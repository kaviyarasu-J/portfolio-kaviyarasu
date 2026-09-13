import portfolioContext from '../src/data/portfolio-context.json' assert { type: 'json' };

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const NAVIGATION_MAP = {
  'show projects': 'projects',
  'go to projects': 'projects',
  'show skills': 'skills',
  'go to skills': 'skills',
  'show experience': 'experience',
  'go to experience': 'experience',
  'show contact': 'contact',
  'go to contact': 'contact',
  'show about': 'about',
  'go to about': 'about',
};

function detectNavigation(question) {
  const q = question.toLowerCase().trim();
  for (const [command, target] of Object.entries(NAVIGATION_MAP)) {
    if (q.includes(command)) {
      return target;
    }
  }
  return null;
}

function buildPrompt(question) {
  return `You are Kavi AI, the portfolio assistant for Kaviyarasu J.

ROLE:
Represent Kaviyarasu J professionally and accurately. Answer questions about his experience, projects, skills, architecture, and technical background.

STRICT RULES:
1. Speak about Kaviyarasu in the third person using: "Kaviyarasu", "he", "his". Never use: "I", "me", "my".
2. Keep responses concise and professional. Maximum 2-4 sentences.
3. Use only the information provided in the portfolio context. Do not invent details.
4. If the information is unavailable in the provided context, the answer must be: "I don't have enough information about that from Kaviyarasu's portfolio."
5. Do not use bullet points unless explicitly requested.
6. Do not repeat the user's question.

CRITICAL OUTPUT FORMATTING:
At the very end of your response, you MUST wrap your final, polished response in <answer> and </answer> tags.
Do not put any reasoning, constraint checks, or bullet points inside the <answer> tags. Only put the final, clean, third-person sentences.

OUTPUT EXAMPLES:

Question:
Tell me about your backend experience

Correct Response:
<answer>Kaviyarasu develops scalable backend services using Python, Flask, and FastAPI, focusing on workflow automation, asynchronous processing, and AI-driven applications. He has experience building backend systems that integrate LLMs, Azure services, and MongoDB for enterprise workflows.</answer>

Question:
What is your Azure experience?

Correct Response:
<answer>Kaviyarasu has worked with Azure Functions, Azure App Services, API Management (APIM), and Azure DevOps. His experience includes workflow-based architectures, secure API integrations, deployment support, and production monitoring.</answer>

PORTFOLIO CONTEXT:
${JSON.stringify(portfolioContext, null, 2)}

USER QUESTION:
${question}`;
}

/**
 * Extract only the actual text answer from the API response,
 * filtering out any "thought" / reasoning parts that Gemma models emit.
 */
function extractAnswer(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!parts || parts.length === 0) {
    return "I'm sorry, I couldn't generate a response. Please try again.";
  }

  // Filter out parts flagged as thoughts (Gemma thinking mode)
  const textParts = parts.filter((p) => !p.thought && p.text);
  
  let rawText = textParts.length > 0 
    ? textParts.map((p) => p.text).join('')
    : (parts[parts.length - 1]?.text || "");

  // 1. Try to find content inside <answer>...</answer> tags (complete pair)
  const answerMatch = rawText.match(/<answer>([\s\S]*?)<\/answer>/);
  if (answerMatch && answerMatch[1]) {
    const cleanAnswer = answerMatch[1].trim();
    if (cleanAnswer.length > 0) {
      return cleanAnswer;
    }
  }

  // 2. Gemma fallback: output was truncated and closing </answer> is missing
  //    Grab everything after the last <answer> tag.
  const openTagMatch = rawText.match(/<answer>([\s\S]*)$/);
  if (openTagMatch && openTagMatch[1]) {
    const partial = openTagMatch[1]
      .replace(/<\/answer>\s*$/, '') // strip trailing tag if present
      .trim();
    if (partial.length > 0) {
      return partial;
    }
  }

  // 3. Fallback: strip Gemma reasoning patterns and return cleaned text
  const cleaned = rawText
    // Remove thinking/reasoning blocks Gemma sometimes wraps in tags
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    // Remove common reasoning prefixes
    .replace(/^(User Question|Constraint|Analysis|Reasoning|Thought|Step \d+):.*$/gm, '')
    // Strip any remaining HTML-like tags but NOT the content between them
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    // Remove asterisk-prefixed bullet lines (Gemma reasoning artifacts)
    .replace(/^\*\*?\s.*$/gm, '')
    .replace(/^\* /gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned || "I'm sorry, I couldn't generate a response. Please try again.";
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

  const { question, model = 'gemini-2.5-flash' } = req.body || {};

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  // Detect navigation commands
  const navigationTarget = detectNavigation(question);

  try {
    // Gemma models need more tokens — they emit reasoning before the answer tags
    const isGemma = model.toLowerCase().includes('gemma');
    const maxTokens = isGemma ? 2048 : 512;

    // Build request body
    const requestBody = {
      contents: [
        {
          parts: [{ text: buildPrompt(question.trim()) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: maxTokens,
      },
    };

    let response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok && model === 'gemini-2.5-flash') {
      console.warn(`Gemini 2.5 Flash failed (${response.status}), trying fallback to gemini-2.0-flash...`);
      const FALLBACK_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      response = await fetch(FALLBACK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API error:', response.status, errorBody);
      return res.status(502).json({ error: 'Failed to get response from AI' });
    }

    const data = await response.json();
    const answer = extractAnswer(data);

    return res.status(200).json({
      answer,
      navigationTarget,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
