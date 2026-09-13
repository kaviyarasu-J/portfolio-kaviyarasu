const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generate 44-byte WAV header for raw PCM 16-bit mono audio.
 */
function getWavHeader(dataLength, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  /* RIFF identifier */
  view.setUint8(0, 0x52); // R
  view.setUint8(1, 0x49); // I
  view.setUint8(2, 0x46); // F
  view.setUint8(3, 0x46); // F
  
  /* file length */
  view.setUint32(4, 36 + dataLength, true);
  
  /* RIFF type */
  view.setUint8(8, 0x57);  // W
  view.setUint8(9, 0x41);  // A
  view.setUint8(10, 0x56); // V
  view.setUint8(11, 0x45); // E
  
  /* format chunk identifier */
  view.setUint8(12, 0x66); // f
  view.setUint8(13, 0x6d); // m
  view.setUint8(14, 0x74); // t
  view.setUint8(15, 0x20); // ' '
  
  /* format chunk length */
  view.setUint32(16, 16, true);
  
  /* sample format (raw PCM = 1) */
  view.setUint16(20, 1, true);
  
  /* channel count */
  view.setUint16(22, numChannels, true);
  
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  
  /* byte rate = sampleRate * numChannels * bitsPerSample/8 */
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
  
  /* block align = numChannels * bitsPerSample/8 */
  view.setUint16(32, numChannels * (bitsPerSample / 8), true);
  
  /* bits per sample */
  view.setUint16(34, bitsPerSample, true);
  
  /* data chunk identifier */
  view.setUint8(36, 0x64); // d
  view.setUint8(37, 0x61); // a
  view.setUint8(38, 0x74); // t
  view.setUint8(39, 0x61); // a
  
  /* data chunk length */
  view.setUint32(40, dataLength, true);

  return Buffer.from(buffer);
}

/**
 * Fetch helper with retry logic for 503 Service Unavailable responses using exponential backoff.
 */
async function fetchWithRetry(url, options, maxRetries = 3, initialDelay = 1000) {
  let attempt = 0;
  while (true) {
    attempt++;
    try {
      const response = await fetch(url, options);
      
      // If we got a 503 and haven't exceeded maxRetries, wait and retry
      if (response.status === 503 && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.warn(`[Gemini TTS] API returned 503 (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.warn(`[Gemini TTS] Network error (attempt ${attempt}/${maxRetries}): ${error.message}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voice = 'Puck' } = req.body || {};
  // Use dedicated Gemini TTS model
  const model = 'gemini-2.5-flash-preview-tts';

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const requestBody = {
      contents: [
        {
          parts: [{ text: text.trim() }],
        },
      ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice,
            },
          },
        },
      },
    };

    const response = await fetchWithRetry(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorCode = 'UNKNOWN';
      let errorMessage = errorBody;

      try {
        const parsedError = JSON.parse(errorBody);
        errorCode = parsedError?.error?.code || response.status;
        errorMessage = parsedError?.error?.message || errorBody;
      } catch (e) {
        // use raw errorBody
      }

      console.error(`[Gemini TTS Debug] Model Name: ${model}`);
      console.error(`[Gemini TTS Debug] Response Status: ${response.status}`);
      console.error(`[Gemini TTS Debug] Error Code: ${errorCode}`);
      console.error(`[Gemini TTS Debug] Error Message: ${errorMessage}`);

      return res.status(response.status === 503 ? 503 : 502).json({
        error: 'TTS model is currently unavailable',
        details: {
          model,
          status: response.status,
          code: errorCode,
          message: errorMessage,
        },
      });
    }

    const data = await response.json();
    
    // Look for inlineData inside candidates
    const parts = data?.candidates?.[0]?.content?.parts;
    const audioPart = parts?.find((p) => p.inlineData);
    
    if (!audioPart || !audioPart.inlineData || !audioPart.inlineData.data) {
      console.error('No audio data in response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No audio generated by Gemini model' });
    }

    const pcmBase64 = audioPart.inlineData.data;
    const pcmBuffer = Buffer.from(pcmBase64, 'base64');
    
    // Prepend WAV header to make it a fully playable audio/wav format in browsers
    const header = getWavHeader(pcmBuffer.length, 24000, 1, 16);
    const wavBuffer = Buffer.concat([header, pcmBuffer]);
    const base64Wav = wavBuffer.toString('base64');

    return res.status(200).json({
      audioContent: base64Wav,
      mimeType: 'audio/wav',
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
