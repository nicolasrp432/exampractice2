import { GoogleGenAI } from '@google/genai';

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
    const { prompt, aspectRatio = '16:9', customKey, startingImage } = req.body || {};
    const ai = getAiClient(customKey);
    if (!ai) {
      return res.status(400).json({ error: 'Se requiere una API Key de Gemini para generar video.' });
    }

    let operation;
    if (startingImage) {
      const match = startingImage.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt || 'An animation of 42 school programming concepts in action',
        image: match ? {
          imageBytes: match[2],
          mimeType: match[1],
        } : undefined,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio || '16:9',
        },
      });
    } else {
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio || '16:9',
        },
      });
    }

    return res.status(200).json({ operationName: operation.name });
  } catch (err) {
    console.error('Error in Vercel api/gemini/generate-video:', err);
    return res.status(500).json({ error: err.message || 'Error al iniciar generación de video' });
  }
}
