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

  return `Eres el "Profesor 42 / Tutor Experto de C", un mentor pedagógico veterano especializado en la preparación del Examen 02 (Rank 02) de la Escuela 42.

Tus Principios Pedagógicos:
1. Método Socrático: Guía con preguntas agudas, analogías visuales y pistas de lógica. No des código completo resuelto para copiar a menos que el usuario lo solicite explícitamente tras varios intentos.
2. Contexto de 42:
   - Moulinette es estricta: saltos de línea obligatorios (\`write(1, "\\n", 1)\`), comprobación de \`argc\`, retorno \`0\`.
   - Cero funciones prohibidas: solo usar las funciones permitidas (${allowed}).
   - Trampas clásicas: punteros nulos, cadenas sin terminador '\\0', bucles infinitos, no saltar espacios iniciales (' ' y '\\t').
3. Ejercicio Actual:
   - Nombre: ${name}
   - Descripción: ${desc}
   - Palacio de la Memoria: ${palace}
   - Errores comunes:
${traps}

Responde siempre en español, de forma clara, motivadora, usando markdown con negritas, listas y fragmentos explicativos.`;
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
  const name = exercise?.nombre || 'este ejercicio';
  const desc = exercise?.descripcion || '';
  const story = exercise?.palacio?.historia || '';
  const char = exercise?.palacio?.personaje || 'el personaje';
  const anchors = exercise?.palacio?.anclas || [];

  if (qLower.includes('analiz') || qLower.includes('código') || code) {
    return `### 🧠 Análisis del Profesor 42

Revisando el enfoque para **${name}**:

1. **Objetivo Central**: ${desc || 'Transformar la entrada según las especificaciones de Moulinette'}.
2. **Puntos Clave a Verificar**:
${anchors.map((a: string) => `   - **Ancla**: ${a}`).join('\n')}
3. **Mnemotecnia del Palacio**: Recuerda la historia con **${char}**: *"${story}"*.

**💡 Preguntas Socráticas:**
* ¿Estás comprobando \`argc == 2\` si es un programa que espera un argumento, o llamando a \`write(1, "\\n", 1)\` inmediatamente si la cantidad no coincide?
* ¿Tu bucle avanza el puntero o índice en todas las ramas para evitar bucles infinitos?
* ¿Tienes en cuenta el terminador nulo \`'\\0'\` para no leer memoria fuera de los límites?`;
  }

  if (qLower.includes('segfault') || qLower.includes('crash') || qLower.includes('error')) {
    return `### 💥 Diagnóstico de Segfault en 42

Los Segfaults más comunes en este tipo de ejercicio se deben a:
1. **Acceder a \`argv[1]\` sin verificar \`argc >= 2\`**: Desreferenciar un puntero nulo produce un crash instantáneo.
2. **No detener el recorrido en \`'\\0'\`**: Leer más allá del final de una cadena en la memoria contigua.
3. **Punteros sin inicializar o malloc sin verificar**: Si usas memoria dinámica, siempre verifica \`if (!ptr) return (NULL);\`.

Revisa tu condición inicial de entrada y los límites de tus bucles \`while\`.`;
  }

  return `### 💡 Guía del Tutor Experto 42

Para resolver **${name}** de forma infalible:
- **Estructura**: Determina si es un programa independiente (con \`main\`) o una función que se integrará en otro archivo.
- **Caso base**: ¿Qué pasa con una cadena vacía o sin argumentos? Debe imprimir \`\\n\` y salir limpiamente.
- **Flujo de transformación**: Simula en tu cabeza el recorrido byte a byte.

¿Qué parte específica de la lógica o de las funciones permitidas quieres que profundicemos?`;
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
