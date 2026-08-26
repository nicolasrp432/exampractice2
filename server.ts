import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { exec, spawn } from 'child_process';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

const BUILDS_DIR = path.join(os.tmpdir(), '42_exam_c_builds');

try {
  if (!fs.existsSync(BUILDS_DIR)) {
    fs.mkdirSync(BUILDS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not initialize BUILDS_DIR:', e);
}

function getAiClient(customKey?: string) {
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

function getSystemInstruction(exerciseContext?: any) {
  const name = exerciseContext?.nombre || 'General 42 C';
  const desc = exerciseContext?.descripcion || '';
  const allowed = exerciseContext?.funcionesPermitidas?.join(', ') || 'write, malloc, free';
  const palace = exerciseContext?.palacio 
    ? `Personaje: ${exerciseContext.palacio.personaje}, Habitación: ${exerciseContext.palacio.habitacion}, Historia: "${exerciseContext.palacio.historia}"`
    : 'No especificado';
  const traps = exerciseContext?.trampas?.map((t: any) => `- ${t.titulo}: ${t.descripcion}`).join('\n') || '';

  return `Eres el "Profesor 42", el mentor veterano y exigente pero profundamente comprometido de la Escuela 42 para el Examen 02 (Rank 02).

PERSONALIDAD Y TONO:
- Eres experto, directo y riguroso como la Moulinette, pero a la vez amigable y formador.
- Si el alumno comete un error grave (Segfault, no verificar NULL, memoria sin '\\0', funciones no permitidas, ignorar argc), sé duro, tajante y claro sobre las consecuencias ("Moulinette te pondrá un 0 en el segundo 1 por esto").
- NUNCA des respuestas kilométrica o muros de texto aburridos. Sé conciso, directo al grano y altamente estructurado.
- Siempre remata con una PREGUNTA SOCRÁTICA desafiante que obligue al estudiante a pensar y escribir la línea correcta.

REGLAS DE FORMATO ESTRICTAS:
1. Longitud máxima: 2 a 4 párrafos cortos o puntos con viñetas. Evita rodeos innecesarios.
2. Usa formato Markdown limpio: negritas para conceptos clave, bloques de código \`c\` cortos para ejemplos o contraejemplos, y emojis funcionales (🎯, ⚠️, 💡, ⚡, ❓).
3. Nunca entregues la solución completa en una sola respuesta si el usuario está atascado: enséñale el paso mental y dale una pista afilada.
4. Si el alumno te pasa código con un fallo fatal, señálale la línea exacta o el fallo de concepto y pregúntale cómo lo solucionaría.

CONTEXTO DEL EJERCICIO ACTUAL:
- Nombre: ${name}
- Descripción: ${desc}
- Funciones Permitidas por Moulinette: ${allowed}
- Palacio Mnemotécnico: ${palace}
- Trampas críticas conocidas:
${traps}

Responde siempre en español.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ─── API: Health Check ───
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // ─── API: Chat Socrático con Gemini ───
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history = [], exerciseContext, codeContext, customKey } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
      }

      const ai = getAiClient(customKey);
      const systemInstruction = getSystemInstruction(exerciseContext);

      let contextEnrichedMessage = message;
      if (codeContext && codeContext.trim() && codeContext !== '// Tu código aquí') {
        contextEnrichedMessage += `\n\n[CÓDIGO ACTUAL DEL ALUMNO EN EL EDITOR]:\n\`\`\`c\n${codeContext}\n\`\`\``;
      }

      if (ai) {
        try {
          const contents = history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text || msg.content || '' }],
          }));

          contents.push({
            role: 'user',
            parts: [{ text: contextEnrichedMessage }],
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.5,
            },
          });

          const replyText = response.text || 'No se pudo generar respuesta.';
          return res.json({ reply: replyText });
        } catch (apiErr: any) {
          console.error('Gemini chat API error:', apiErr?.message);
          // Si falla por cuota o modelo, fallback socrático
        }
      }

      // Fallback pedagógico local socrático
      const fallbackReply = generateFallbackChat(message, exerciseContext, codeContext);
      return res.json({ reply: fallbackReply });
    } catch (err: any) {
      console.error('Error in /api/gemini/chat:', err);
      res.status(500).json({ error: err.message || 'Error interno del tutor' });
    }
  });

  // ─── API: Generador de Imágenes Nano Banana ───
  app.post('/api/gemini/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio = '1:1', imageSize = '1K', inputImage, customKey } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Se requiere un prompt para la imagen.' });
      }

      const ai = getAiClient(customKey);

      if (ai) {
        try {
          const modelName = inputImage ? 'gemini-3.1-flash-lite-image' : 'gemini-3.1-flash-lite-image';
          const parts: any[] = [];

          if (inputImage) {
            // Extraer base64 y mimetype
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
                aspectRatio: (aspectRatio as any) || '1:1',
              },
            },
          });

          // Iterar partes para encontrar la imagen
          const candidate = response.candidates?.[0];
          if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
              if (part.inlineData?.data) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
                return res.json({ imageUrl, provider: 'nanobanana' });
              }
            }
          }
        } catch (geminiImgErr: any) {
          console.warn('Gemini Nano Banana returned error, falling back to pollinations/procedural:', geminiImgErr?.message);
        }
      }

      // Fallback robusto con Pollinations.ai (garantiza que siempre funcione)
      const cleanPrompt = encodeURIComponent(
        prompt
          .replace(/[\\/()[\]{}"']/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      );
      const seed = Math.floor(Math.random() * 9999999);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

      return res.json({ imageUrl: pollinationsUrl, provider: 'fallback' });
    } catch (err: any) {
      console.error('Error in /api/gemini/generate-image:', err);
      res.status(500).json({ error: err.message || 'Error al generar la imagen' });
    }
  });

  // ─── API: Generador de Videos con Veo ───
  app.post('/api/gemini/generate-video', async (req, res) => {
    try {
      const { prompt, aspectRatio = '16:9', customKey, startingImage } = req.body;
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
            aspectRatio: (aspectRatio as any) || '16:9',
          },
        });
      } else {
        operation = await ai.models.generateVideos({
          model: 'veo-3.1-lite-generate-preview',
          prompt,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: (aspectRatio as any) || '16:9',
          },
        });
      }

      res.json({ operationName: operation.name });
    } catch (err: any) {
      console.error('Error in /api/gemini/generate-video:', err);
      res.status(500).json({ error: err.message || 'Error al iniciar generación de video' });
    }
  });

  app.post('/api/gemini/video-status', async (req, res) => {
    try {
      const { operationName, customKey } = req.body;
      const ai = getAiClient(customKey);
      if (!ai) return res.status(400).json({ error: 'API Key no configurada' });

      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await ai.operations.getVideosOperation({ operation: op });
      res.json({ done: updated.done });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/gemini/video-download', async (req, res) => {
    try {
      const { operationName, customKey } = req.body;
      const apiKey = customKey?.trim() || process.env.GEMINI_API_KEY;
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
      if (videoRes.body) {
        const stream = videoRes.body as any;
        if (typeof stream.pipe === 'function') {
          stream.pipe(res);
        } else {
          const buffer = await videoRes.arrayBuffer();
          res.send(Buffer.from(buffer));
        }
      } else {
        res.status(500).json({ error: 'Body vacío' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── API: Compilador Local C ───
  app.post('/api/compile-local', async (req, res) => {
    try {
      const { code, args = [] } = req.body;
      const result = await compileAndRunLocal(code, args);
      res.json(result);
    } catch (err: any) {
      res.json({
        compileError: `Error interno de compilación local: ${err.message}`,
        stdout: '',
        stderr: '',
        exitCode: -1,
      });
    }
  });

  // ─── Vite Middleware o Servidor Estático ───
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`42 Exam Prep server running on port ${PORT}`);
  });
}

function compileAndRunLocal(code: string, args: string[]): Promise<any> {
  return new Promise((resolve) => {
    const fileId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const sourcePath = path.join(BUILDS_DIR, `temp_${fileId}.c`);
    const binaryPath = path.join(BUILDS_DIR, `temp_${fileId}.exe`);

    fs.writeFileSync(sourcePath, code, 'utf8');
    const compileCmd = `gcc -Wall -Wextra -Werror "${sourcePath}" -o "${binaryPath}"`;

    exec(compileCmd, { timeout: 10000 }, (error, stdout, stderr) => {
      try { fs.unlinkSync(sourcePath); } catch (e) {}

      if (error) {
        if (error.message.includes('not recognized') || error.message.includes('CommandNotFoundException') || error.message.includes('ENOENT')) {
          resolve({
            compilerUnavailable: true,
            compileError: `El compilador 'gcc' no está disponible en este entorno.\nUsa el simulador en memoria o instala MinGW/WSL para compilación nativa.`,
            stdout: '',
            stderr: '',
            exitCode: -1,
          });
          return;
        }

        resolve({
          compileError: stderr || stdout || error.message,
          stdout: '',
          stderr: '',
          exitCode: -1,
        });
        return;
      }

      let programStdout = '';
      let programStderr = '';
      const child = spawn(binaryPath, args, { timeout: 3000 });

      child.stdout.on('data', (data) => {
        programStdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        programStderr += data.toString();
      });

      child.on('error', (spawnErr) => {
        try { fs.unlinkSync(binaryPath); } catch (e) {}
        resolve({
          compileError: `Error al ejecutar el binario: ${spawnErr.message}`,
          stdout: programStdout,
          stderr: programStderr,
          exitCode: -1,
        });
      });

      child.on('close', (code, signal) => {
        try { fs.unlinkSync(binaryPath); } catch (e) {}

        if (signal === 'SIGTERM' || signal === 'SIGKILL' || child.killed) {
          resolve({
            compileError: 'Ejecución cancelada: Tiempo de ejecución excedido (posible bucle infinito o espera de input)',
            stdout: programStdout,
            stderr: programStderr,
            exitCode: -1,
          });
        } else {
          resolve({
            compileError: null,
            stdout: programStdout,
            stderr: programStderr,
            exitCode: code ?? 0,
          });
        }
      });
    });
  });
}

function generateFallbackChat(query: string, exercise?: any, code?: string): string {
  const qLower = query.toLowerCase();
  const name = exercise?.nombre || 'el ejercicio';
  const proto = exercise?.prototipo || '';
  const allowed = exercise?.funcionesPermitidas?.join(', ') || 'write';
  const traps = exercise?.trampas || [];

  if (qLower.includes('analiz') || qLower.includes('código') || code) {
    return `### 🎯 Diagnóstico Rápido: **${name}**

Revisando el enfoque contra los estándares de Moulinette:

- **Contrato**: \`${proto || name}\` (Funciones permitidas: \`${allowed}\`).
- **Peligro Inmediato**: ${traps[0]?.descripcion || 'Ojo con no validar punteros nulos o desbordar el búfer.'}

${code ? `⚠️ **Revisión de tu código**:
Fíjate con lupa en la condición de parada de tus bucles y en si estás garantizando que todo camino devuelva el valor o salida correcta.` : ''}

❓ **Pregunta de examen**: ¿Qué hace exactamente tu código si la entrada es una cadena vacía \`""\` o si no se pasan parámetros? Escribe mentalmente qué imprimirá tu \`write\`.`;
  }

  if (qLower.includes('segfault') || qLower.includes('crash') || qLower.includes('error')) {
    return `### ⚠️ Alerta de Segfault (Crash en Moulinette)

En **42**, el 90% de los Segfaults en este nivel ocurren por una de estas 3 causas:

1. **Desreferenciación ciega**: Acceder a \`argv[1][0]\` sin haber comprobado antes \`if (argc != 2)\`.
2. **Desborde de Heap/Stack**: Leer más allá del byte nulo \`'\\0'\` en un \`while (str[i])\` o olvidar el \`+ 1\` en \`malloc(len + 1)\`.
3. **Punteros NULL**: No validar \`if (!src) return (NULL);\` al entrar en una función pura.

❓ **Tu desafío**: ¿Cuál de estos 3 puntos no tiene una guardia explícita en las primeras líneas de tu archivo?`;
  }

  if (qLower.includes('logica') || qLower.includes('explicar') || qLower.includes('paso')) {
    return `### ⚡ Estrategia Mental para **${name}**

Para resolverlo con cero dudas en la terminal del examen:

1. **Filtro de Entrada**: Si no se cumplen los argumentos requeridos, escribe únicamente un salto de línea \`\\n\` y sal de inmediato.
2. **Punteros / Índices**: Recorre avanzando sólo cuando la condición sea verdadera; nunca modifiques el puntero base si necesitas retornarlo.
3. **Terminación limpia**: Todo resultado debe cerrarse con \`'\\0'\` o salto de línea según el enunciado.

❓ **Dime**: ¿Qué estructura de bucle vas a usar para recorrer la cadena y cuál es tu condición exacta de parada?`;
  }

  return `### 💡 Profesor 42 en Línea

Aquí estamos para asegurar tu **100% en el Rank 02**. Para **${name}**:

- **Regla de oro**: Moulinette no perdona formatos. Un espacio extra o un \`\\n\` ausente es un 0 instantáneo.
- **Herramientas permitidas**: \`${allowed}\`.

❓ ¿Qué parte concreta de la lógica estás planteando o qué comportamiento inesperado te está dando? Explícamelo en una frase y lo destripamos.`;
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
