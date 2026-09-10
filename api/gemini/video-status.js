import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

function getAiClient(customKey) {
  const rawKey = customKey?.trim() || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!rawKey) return null;
  const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { operationName, customKey } = req.body || {};
    const ai = getAiClient(customKey);
    if (!ai) return res.status(400).json({ error: 'API Key no configurada' });

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    return res.status(200).json({ done: updated.done });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
