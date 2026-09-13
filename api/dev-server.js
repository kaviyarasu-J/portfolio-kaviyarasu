/**
 * Local dev server for the /api/chat endpoint.
 * Run: node api/dev-server.js
 * Requires: GEMINI_API_KEY in .env or environment
 *
 * This simulates the Vercel serverless function locally.
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env if present
try {
  const envPath = join(__dirname, '..', '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
} catch {
  // .env not found, rely on environment variables
}

// Dynamically import the handlers
const chatModule = await import('./chat.js');
const chatHandler = chatModule.default;

const ttsModule = await import('./tts.js');
const ttsHandler = ttsModule.default;

const PORT = 3001;

const server = createServer(async (req, res) => {
  // Simple request/response adapter to match Vercel's API
  const vercelRes = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
      res.setHeader(key, value);
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      res.writeHead(this.statusCode, { ...this.headers, 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    },
    end() {
      res.writeHead(this.statusCode, this.headers);
      res.end();
    },
  };

  // Parse body for POST requests
  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      req.body = JSON.parse(body);
    } catch {
      req.body = {};
    }
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const handler = url.pathname === '/api/tts' ? ttsHandler : chatHandler;
    await handler(req, vercelRes);
  } catch (err) {
    console.error('Handler error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  🤖 AI Chat dev server running at http://127.0.0.1:${PORT}/api/chat\n`);
  console.log(`  GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing — add to .env'}\n`);
});
