import { GoogleGenAI } from '@google/genai';

function getAiClient(customKey) {
  const apiKey = customKey?.trim() || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, aspectRatio = '1:1', inputImage, customKey } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Se requiere un prompt para la imagen.' });
    }

    const ai = getAiClient(customKey);

    if (ai) {
      try {
        const modelName = 'gemini-3.1-flash-lite-image';
        const parts = [];

        if (inputImage) {
          const match = inputImage.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2],
              },
            });
          }
        }

        parts.push({ text: prompt });

        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio || '1:1',
            },
          },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData?.data) {
              const mimeType = part.inlineData.mimeType || 'image/png';
              const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
              return res.status(200).json({ imageUrl, provider: 'nanobanana' });
            }
          }
        }
      } catch (geminiImgErr) {
        console.warn('Vercel Gemini image error, fallback to pollinations:', geminiImgErr?.message);
      }
    }

    // Fallback robusto con Pollinations.ai
    const cleanPrompt = encodeURIComponent(
      prompt
        .replace(/[\\/()[\]{}"']/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    );
    const seed = Math.floor(Math.random() * 9999999);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

    return res.status(200).json({ imageUrl: pollinationsUrl, provider: 'fallback' });
  } catch (err) {
    console.error('Error in Vercel api/gemini/generate-image:', err);
    res.status(500).json({ error: err.message || 'Error al generar imagen' });
  }
}
