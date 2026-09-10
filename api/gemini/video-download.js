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
    const apiKey = customKey?.trim() || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const ai = getAiClient(customKey);
    if (!ai || !apiKey) return res.status(400).json({ error: 'API Key no configurada' });

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) return res.status(404).json({ error: 'Video URI no encontrada' });

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
