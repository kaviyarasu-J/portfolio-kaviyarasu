class TtsService {
  constructor() {
    this.audio = null;
  }

  /**
   * Request /api/tts to generate speech for a given text.
   * Returns base64 WAV string.
   */
  async generateSpeech(text, model = 'gemini-2.5-flash', voice = 'Puck') {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, model, voice }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const data = await response.json();
    return data.audioContent;
  }

  /**
   * Play the audio from base64 string.
   */
  playAudio(base64Wav, onEnded = () => {}, onError = () => {}) {
    this.stop();

    try {
      this.audio = new Audio(`data:audio/wav;base64,${base64Wav}`);
      
      this.audio.onended = () => {
        this.audio = null;
        onEnded();
      };
      
      this.audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        this.audio = null;
        onError(e);
      };

      this.audio.play().catch((err) => {
        console.error('Failed to play audio:', err);
        this.audio = null;
        onError(err);
      });
    } catch (err) {
      console.error('Error instantiating Audio:', err);
      onError(err);
    }
  }

  /**
   * Stop any active audio playback.
   */
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}

export const ttsService = new TtsService();
