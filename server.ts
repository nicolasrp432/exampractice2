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
  const rawKey = customKey?.trim() || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!rawKey) return null;
  const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();
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
        const contents = history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || msg.content || '' }],
        }));

        contents.push({
          role: 'user',
          parts: [{ text: contextEnrichedMessage }],
        });

        const candidateModels = ['gemini-2.5-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];

        for (const model of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction,
                temperature: 0.5,
              },
            });

            const replyText = response.text;
            if (replyText) {
              return res.json({ reply: replyText, modelUsed: model });
            }
          } catch (apiErr: any) {
            console.warn(`Model ${model} failed:`, apiErr?.message || apiErr);
          }
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

  // ─── API: Generador de Flashcards de Sintaxis y Resolución C (Gemini) ───
  app.post('/api/gemini/generate-flashcards', async (req, res) => {
    try {
      const {
        topic = 'Algoritmos y Sintaxis C de Examen 42',
        exerciseId,
        level = 1,
        category = 'general', // 'sintaxis' | 'resolucion' | 'memoria_punteros' | 'casos_limite' | 'general'
        count = 3,
        customKey,
      } = req.body;

      const ai = getAiClient(customKey);

      const flashcardSystemInstruction = `Eres un preparador experto y examinador de C para el Examen 02 (Rank 02) de la Escuela 42.
Tu objetivo es generar tarjetas de estudio técnicas (Flashcards) ultra enfocadas en:
1. SINTAXIS Y CÓDIGO REAL EN C: sintaxis exacta de operadores, punteros (* y **), casteos obligatorios (ej: (unsigned char)), llamadas a write y malloc.
2. LÓGICA DE RESOLUCIÓN PASO A PASO: cómo plantear el algoritmo mentalmente para resolver el ejercicio en el examen.
3. GESTIÓN DE MEMORIA Y CONDICIONES LÍMITE: cómo evitar Segfaults, terminadores '\\0', puntero NULL final en arrays, verificación estricta de argc.
4. TRAMPAS TÍPICAS DE LA MOULINETTE: fallos sutiles que causan KO o 0 inmediato.

PROHIBIDO:
- NO inventes historias mnemónicas ni personajes mágicos o palacios de la memoria (nada de duendes, cocinas, o analogías mágicas).
- Céntrate 100% en la sintaxis, el razonamiento algorítmico y el código C de examen.
- Devuelve EXACTAMENTE un array JSON válido con la siguiente estructura por tarjeta:
[
  {
    "titulo": "Título técnico y conciso",
    "categoria": "sintaxis" | "resolucion" | "memoria_punteros" | "casos_limite",
    "nivel": 1 | 2 | 3 | 4,
    "pregunta": "¿Pregunta clara sobre cómo resolver el ejercicio o sobre sintaxis clave?",
    "pista": "Pista conceptual corta para estimular el recuerdo",
    "codigoReto": "Snippet C con ??? o reto de análisis de código",
    "respuesta": "Explicación directa y estructurada de cómo resolverlo paso a paso",
    "codigoSolucion": "Fragmento de código C limpio, idiomático y correcto",
    "porQue": "Por qué es necesario técnicamente en C y para pasar Moulinette",
    "trampaMoulinette": "Trampa crítica que causa 0 o Segfault en el examen"
  }
]`;

      if (ai) {
        try {
          const prompt = `Genera ${count} flashcards de estudio técnico para el Examen 02 de la Escuela 42.
Tema o ejercicio solicitado: "${topic}"
${exerciseId ? `ID de ejercicio: "${exerciseId}"` : ''}
Nivel objetivo: Nivel ${level}
Enfoque preferente: ${category === 'general' ? 'Variado (sintaxis, resolución, punteros y casos límite)' : category}

Recuerda: nada de metáforas de palacio de la memoria. Queremos preguntas sobre cómo escribir el código, cómo plantear el algoritmo, manejo de punteros/memoria y trampas de Moulinette.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: flashcardSystemInstruction,
              responseMimeType: 'application/json',
              temperature: 0.4,
            },
          });

          const replyText = response.text;
          if (replyText) {
            let parsed = null;
            try {
              parsed = JSON.parse(replyText);
            } catch (pErr) {
              const match = replyText.match(/\[[\s\S]*\]/);
              if (match) parsed = JSON.parse(match[0]);
            }
            if (Array.isArray(parsed) && parsed.length > 0) {
              const enriched = parsed.map((item, idx) => ({
                id: `ia-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
                exerciseId: exerciseId || (item.exerciseId || 'general'),
                nivel: item.nivel || level || 2,
                categoria: ['sintaxis', 'resolucion', 'memoria_punteros', 'casos_limite'].includes(item.categoria)
                  ? item.categoria
                  : 'resolucion',
                titulo: item.titulo || `Técnica C: ${topic}`,
                pregunta: item.pregunta || '¿Cómo resolver este ejercicio en C?',
                pista: item.pista || '',
                codigoReto: item.codigoReto || '',
                respuesta: item.respuesta || '',
                codigoSolucion: item.codigoSolucion || '',
                porQue: item.porQue || '',
                trampaMoulinette: item.trampaMoulinette || '',
                origen: 'ia',
              }));
              return res.json({ flashcards: enriched, source: 'gemini' });
            }
          }
        } catch (apiErr: any) {
          console.warn('Gemini generate-flashcards API error, using fallback:', apiErr?.message);
        }
      }

      // Procedural Fallback si no hay API key o falló la llamada
      const fallbackCards = generateFallbackFlashcards(topic, exerciseId, level, category, count);
      return res.json({ flashcards: fallbackCards, source: 'fallback' });
    } catch (err: any) {
      console.error('Error in /api/gemini/generate-flashcards:', err);
      res.status(500).json({ error: err.message || 'Error al generar flashcards' });
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

  // ─── API: Estado del Compilador ───
  app.get('/api/compile/status', (_req, res) => {
    exec('gcc --version', (err, stdout) => {
      if (err) {
        return res.json({ ready: false, compiler: null, error: err.message });
      }
      const firstLine = stdout.split('\n')[0];
      res.json({
        ready: true,
        compiler: firstLine,
        flags: '-Wall -Wextra -Werror (Normas 42)',
        mode: 'local-native-gcc',
      });
    });
  });

  // ─── API: Compilador Local C (Reglas Oficiales Escuela 42) ───
  app.post('/api/compile-local', async (req, res) => {
    try {
      const {
        code,
        args = [],
        stdin = '',
        compilerOptionRaw = '',
        strictMoulinette = true,
        timeoutMs = 3000,
      } = req.body;

      const result = await compileAndRunLocal({
        code,
        args,
        stdin,
        compilerOptionRaw,
        strictMoulinette,
        timeoutMs,
      });
      res.json(result);
    } catch (err: any) {
      res.json({
        compileError: `Error interno de compilación local: ${err.message}`,
        stdout: '',
        stderr: '',
        exitCode: -1,
        signal: null,
      });
    }
  });

  // ─── TERMINAL Y DEPURADOR INTERACTIVO 42 ───
  const TERMINAL_BASE_DIR = path.join(os.tmpdir(), '42_terminal_workspace');
  try {
    if (!fs.existsSync(TERMINAL_BASE_DIR)) {
      fs.mkdirSync(TERMINAL_BASE_DIR, { recursive: true });
    }
  } catch (e) {}

  app.post('/api/terminal/exec', async (req, res) => {
    try {
      const {
        command,
        code = '',
        filename = 'solution.c',
        sessionId = 'user',
        action = 'custom',
        args = [],
        stdin = '',
        exerciseId = '',
        tipoEntrega = 'programa',
      } = req.body;

      const safeSessionId = String(sessionId || 'user').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'user';
      const sessionDir = path.join(TERMINAL_BASE_DIR, safeSessionId);
      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
      }

      const safeFilename = filename.endsWith('.c') ? filename : `${filename}.c`;
      const primaryFile = path.join(sessionDir, safeFilename);

      if (code && typeof code === 'string') {
        fs.writeFileSync(primaryFile, code, 'utf8');
        if (safeFilename !== 'solution.c') {
          fs.writeFileSync(path.join(sessionDir, 'solution.c'), code, 'utf8');
        }

        // Si es una función, creamos un main.c de apoyo si el código no incluye un main
        if (tipoEntrega === 'funcion' && !code.includes('int main(') && !code.includes('int\tmain(')) {
          const harnessMain = `/* Main de prueba generado automáticamente para ${exerciseId || 'tu función'} */
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

// Declaración de tu función
${code.match(/[a-zA-Z0-9_*]+\s+[a-zA-Z0-9_]+\s*\([^)]*\)/)?.[0] || 'void ' + (exerciseId || 'solution') + '();'};

int main(int argc, char **argv) {
    (void)argc;
    (void)argv;
    printf("[Main de prueba 42 ejecutado con éxito]\\n");
    return 0;
}
`;
          fs.writeFileSync(path.join(sessionDir, 'main_test.c'), harnessMain, 'utf8');
        }
      }

      // Si la acción es verificación de Norminette 42
      if (action === 'norm') {
        const normReport = run42NormCheck(code, safeFilename);
        let currentFiles: string[] = [];
        try { currentFiles = fs.readdirSync(sessionDir); } catch (e) {}
        return res.json({
          stdout: normReport.stdout,
          stderr: normReport.stderr,
          exitCode: normReport.exitCode,
          signal: null,
          command: `norminette -R CheckForbiddenSourceHeader ${safeFilename}`,
          cwd: `~/42_exam/${safeSessionId}`,
          files: currentFiles,
        });
      }

      let cmdToRun = '';
      const safeArgsStr = Array.isArray(args) ? args.map((a) => `"${String(a).replace(/"/g, '\\"')}"`).join(' ') : '';

      if (action === 'compile') {
        cmdToRun = `gcc -Wall -Wextra -Werror -std=c99 -g "${safeFilename}" -o solution`;
      } else if (action === 'run') {
        cmdToRun = `./solution ${safeArgsStr}`;
      } else if (action === 'asan') {
        cmdToRun = `gcc -fsanitize=address -g -O1 -std=c99 "${safeFilename}" -o solution_asan && ./solution_asan ${safeArgsStr}`;
      } else if (action === 'gdb') {
        cmdToRun = `gcc -g -O0 -std=c99 "${safeFilename}" -o solution_gdb && gdb --batch -ex "file ./solution_gdb" -ex "set print pretty on" -ex "run ${safeArgsStr}" -ex "where" -ex "info locals" -ex "quit"`;
      } else {
        cmdToRun = String(command || '').trim();
      }

      if (!cmdToRun) {
        let currentFiles: string[] = [];
        try { currentFiles = fs.readdirSync(sessionDir); } catch (e) {}
        return res.json({
          stdout: '',
          stderr: 'No se especificó ningún comando.',
          exitCode: 0,
          signal: null,
          command: '',
          cwd: `~/42_exam/${safeSessionId}`,
          files: currentFiles,
        });
      }

      // Filtro de seguridad
      const blocked = ['rm -rf /', 'mkfs', 'dd if=', ':(){:|:&};:', 'shutdown', 'reboot', 'chmod -R 777 /', '> /dev/sda'];
      for (const b of blocked) {
        if (cmdToRun.includes(b)) {
          let currentFiles: string[] = [];
          try { currentFiles = fs.readdirSync(sessionDir); } catch (e) {}
          return res.json({
            stdout: '',
            stderr: `Acceso restringido: '${b}' está prohibido en el entorno de evaluación de 42.`,
            exitCode: 126,
            signal: null,
            command: cmdToRun,
            cwd: `~/42_exam/${safeSessionId}`,
            files: currentFiles,
          });
        }
      }

      exec(cmdToRun, {
        cwd: sessionDir,
        timeout: 8000,
        maxBuffer: 512 * 1024,
        env: {
          ...process.env,
          PATH: process.env.PATH + ':/usr/local/bin:/usr/bin:/bin',
          ASAN_OPTIONS: 'detect_leaks=1:symbolize=1:abort_on_error=0',
        },
      }, (error, stdout, stderr) => {
        let exitCode = 0;
        let signal: string | number | null = null;

        if (error) {
          exitCode = typeof error.code === 'number' ? error.code : 1;
          if (error.killed) {
            stderr = (stderr ? stderr + '\n' : '') + '⏰ [TIMEOUT]: El comando superó los 8 segundos (posible bucle infinito o espera interactiva).';
          }
          if (error.signal) {
            signal = error.signal;
          }
        }

        // Detección de crashes comunes
        if (exitCode === 139 || stderr.includes('Segmentation fault') || stderr.includes('SIGSEGV')) {
          if (!stderr.includes('Segmentation fault')) {
            stderr += '\n⚠️ Segmentation fault (core dumped): Acceso a memoria inválido o puntero NULL.';
          }
        }

        let currentFiles: string[] = [];
        try { currentFiles = fs.readdirSync(sessionDir); } catch (e) {}

        res.json({
          stdout: stdout || '',
          stderr: stderr || '',
          exitCode,
          signal,
          command: cmdToRun,
          cwd: `~/42_exam/${safeSessionId}`,
          files: currentFiles,
        });
      });
    } catch (err: any) {
      res.status(500).json({
        stdout: '',
        stderr: `Error en la terminal: ${err.message}`,
        exitCode: 1,
        signal: null,
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

interface CompileRequest {
  code: string;
  args?: string[];
  stdin?: string;
  compilerOptionRaw?: string;
  strictMoulinette?: boolean;
  timeoutMs?: number;
}

function run42NormCheck(code: string, filename: string = 'solution.c') {
  const lines = code.split('\n');
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Longitud de línea > 80 columnas
  lines.forEach((line, idx) => {
    const expandedLen = line.replace(/\t/g, '    ').length;
    if (expandedLen > 80) {
      errors.push(`Error: LINE_TOO_LONG (line ${idx + 1}, col ${expandedLen}): Línea de ${expandedLen} caracteres (máx. 80 en Norma 42).`);
    }
  });

  // 2. Bucles 'for' prohibidos (sólo 'while' en 42)
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (/^for\s*\(/.test(trimmed) || /\s+for\s*\(/.test(line)) {
      errors.push(`Error: FOR_FORBIDDEN (line ${idx + 1}): Bucle 'for' prohibido por la Norma 42. Debes usar 'while'.`);
    }
  });

  // 3. Librerías no permitidas (ej. stdio.h)
  lines.forEach((line, idx) => {
    if (/#include\s*<stdio\.h>/.test(line)) {
      warnings.push(`Warning: FORBIDDEN_INCLUDE (line ${idx + 1}): '<stdio.h>' está prohibido si el ejercicio sólo permite 'write'. Elimina printf antes de la entrega.`);
    }
  });

  // 4. Múltiples sentencias en una misma línea
  lines.forEach((line, idx) => {
    const cleaned = line.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '').replace(/\/\/.*$/, '');
    const semicolons = (cleaned.match(/;/g) || []).length;
    if (semicolons > 1 && !line.includes('for(')) {
      warnings.push(`Warning: MULTIPLE_STATEMENTS (line ${idx + 1}): Más de una instrucción en la misma línea.`);
    }
  });

  // 5. Tamaño de función (> 25 líneas)
  let insideFunc = false;
  let funcLines = 0;
  let funcName = '';
  lines.forEach((line, idx) => {
    if (/^[a-zA-Z0-9_*]+\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{?/.test(line)) {
      insideFunc = true;
      funcLines = 0;
      funcName = line.match(/[a-zA-Z0-9_]+\s*\(/)?.[0] || 'función';
    } else if (insideFunc) {
      if (line.trim() === '}') {
        if (funcLines > 25) {
          errors.push(`Error: TOO_MANY_LINES (line ${idx + 1}): ${funcName} tiene ${funcLines} líneas (el límite de la Norma 42 son 25 líneas por función).`);
        }
        insideFunc = false;
      } else {
        funcLines++;
      }
    }
  });

  const exitCode = errors.length > 0 ? 1 : 0;
  let stdout = `${filename}: OK! (Cumple la Norma 42)\n`;
  if (errors.length > 0) {
    stdout = `${filename}: KO por Norma!\n` + errors.map((e) => `  ${e}`).join('\n');
  }

  let stderr = '';
  if (warnings.length > 0) {
    stderr = warnings.map((w) => `  ${w}`).join('\n');
  }

  return { stdout, stderr, exitCode };
}

function compileAndRunLocal(params: CompileRequest): Promise<any> {
  const {
    code,
    args = [],
    stdin = '',
    compilerOptionRaw = '',
    strictMoulinette = true,
    timeoutMs = 3000,
  } = params;

  return new Promise((resolve) => {
    if (!code || typeof code !== 'string') {
      return resolve({
        compileError: 'No se proporcionó código C para compilar.',
        stdout: '',
        stderr: '',
        exitCode: -1,
        signal: null,
      });
    }

    const fileId = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const sourcePath = path.join(BUILDS_DIR, `temp_${fileId}.c`);
    const binaryPath = path.join(BUILDS_DIR, `bin_${fileId}`);

    try {
      fs.writeFileSync(sourcePath, code, 'utf8');
    } catch (e: any) {
      return resolve({
        compileError: `Error al crear archivo temporal: ${e.message}`,
        stdout: '',
        stderr: '',
        exitCode: -1,
        signal: null,
      });
    }

    // Construcción de flags según las normas de la Escuela 42 (-Wall -Wextra -Werror)
    const flags: string[] = [];
    if (strictMoulinette) {
      flags.push('-Wall', '-Wextra', '-Werror');
    }

    // Si el código incluye el tracer de pasos, permitimos no usar todas las funciones o parámetros de traza
    if (code.includes('__tracer') || code.includes('__TR_PREFIX')) {
      flags.push('-Wno-unused-function', '-Wno-unused-variable', '-Wno-unused-parameter');
    }

    // Flags adicionales personalizados
    if (compilerOptionRaw && typeof compilerOptionRaw === 'string') {
      const extraFlags = compilerOptionRaw
        .split(/[\n\s]+/)
        .map((f) => f.trim())
        .filter(Boolean);
      for (const ef of extraFlags) {
        if (!flags.includes(ef)) {
          flags.push(ef);
        }
      }
    }

    const compileCmd = `gcc ${flags.join(' ')} "${sourcePath}" -o "${binaryPath}"`;

    exec(compileCmd, { timeout: 8000 }, (error, stdout, stderr) => {
      try { fs.unlinkSync(sourcePath); } catch (e) {}

      if (error) {
        if (
          error.message.includes('not recognized') ||
          error.message.includes('CommandNotFoundException') ||
          error.message.includes('ENOENT')
        ) {
          resolve({
            compilerUnavailable: true,
            compileError: `El compilador 'gcc' no está disponible en este entorno.\nUsa el simulador en memoria o instala MinGW/WSL para compilación nativa.`,
            stdout: '',
            stderr: '',
            exitCode: -1,
            signal: null,
          });
          return;
        }

        const rawErr = stderr || stdout || error.message;
        resolve({
          compileError: rawErr,
          stdout: '',
          stderr: rawErr,
          exitCode: -1,
          signal: null,
          isCompilationError: true,
        });
        return;
      }

      // Asegurar permisos de ejecución en Linux
      try {
        fs.chmodSync(binaryPath, 0o755);
      } catch (e) {}

      let programStdout = '';
      let programStderr = '';
      let isKilled = false;
      const MAX_OUTPUT = 256 * 1024; // 256 KB límite

      const safeArgs = args.map((a) => String(a ?? ''));
      const child = spawn(binaryPath, safeArgs);

      const timer = setTimeout(() => {
        isKilled = true;
        try { child.kill('SIGKILL'); } catch (e) {}
      }, Math.max(1000, Math.min(timeoutMs, 6000)));

      // Enviar stdin si existe
      if (child.stdin) {
        if (stdin) {
          try {
            child.stdin.write(stdin);
          } catch (e) {}
        }
        try {
          child.stdin.end();
        } catch (e) {}
      }

      child.stdout.on('data', (data) => {
        if (programStdout.length < MAX_OUTPUT) {
          programStdout += data.toString();
        }
      });

      child.stderr.on('data', (data) => {
        if (programStderr.length < MAX_OUTPUT) {
          programStderr += data.toString();
        }
      });

      child.on('error', (spawnErr) => {
        clearTimeout(timer);
        try { fs.unlinkSync(binaryPath); } catch (e) {}
        resolve({
          compileError: `Error al ejecutar el binario: ${spawnErr.message}`,
          stdout: programStdout,
          stderr: programStderr,
          exitCode: -1,
          signal: null,
        });
      });

      child.on('close', (code, signal) => {
        clearTimeout(timer);
        try { fs.unlinkSync(binaryPath); } catch (e) {}

        if (isKilled || signal === 'SIGTERM' || signal === 'SIGKILL') {
          resolve({
            compileError: null,
            stdout: programStdout,
            stderr: (programStderr ? programStderr + '\n' : '') + 'Tiempo límite excedido (Timeout / TLE) — Posible bucle infinito o espera de input.',
            exitCode: -1,
            signal: 'SIGKILL',
            isTimeout: true,
          });
          return;
        }

        // Detección de señales críticas de 42 (Segmentation fault, Bus error, etc.)
        let fatalSignalDesc = null;
        let signalNum: number | null = null;

        if (signal === 'SIGSEGV' || code === 139) {
          signalNum = 11;
          fatalSignalDesc = 'Segmentation fault (core dumped) [KO en Moulinette: Acceso a memoria inválido o desreferenciación de NULL]';
        } else if (signal === 'SIGBUS' || code === 135) {
          signalNum = 7;
          fatalSignalDesc = 'Bus error [KO en Moulinette: Violación de memoria o alineamiento]';
        } else if (signal === 'SIGABRT' || code === 134) {
          signalNum = 6;
          fatalSignalDesc = 'Aborted (core dumped) [KO en Moulinette: Doble free o corrupción de heap/stack]';
        } else if (signal === 'SIGFPE' || code === 136) {
          signalNum = 8;
          fatalSignalDesc = 'Floating point exception [KO en Moulinette: División por cero]';
        }

        if (fatalSignalDesc && !programStderr.includes('Segmentation fault') && !programStderr.includes('Bus error')) {
          programStderr = programStderr ? `${programStderr}\n${fatalSignalDesc}` : fatalSignalDesc;
        }

        resolve({
          compileError: null,
          stdout: programStdout,
          stderr: programStderr,
          exitCode: code ?? 0,
          signal: signalNum,
        });
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

function generateFallbackFlashcards(topic: string, exerciseId?: string, level: number = 2, category: string = 'general', count: number = 3) {
  const tLower = (topic + ' ' + (exerciseId || '')).toLowerCase();

  const library: any[] = [
    {
      id: `fallback-${Date.now()}-1`,
      exerciseId: exerciseId || 'c_pointers',
      nivel: level || 2,
      categoria: 'memoria_punteros',
      titulo: `${topic}: Aritmética de punteros y delimitador '\\0'`,
      pregunta: `¿Cómo avanzar un puntero char *ptr hasta el final del string sin calcular la longitud previamente y evitando desbordamiento?`,
      pista: 'Usa la evaluación booleana de *ptr en la condición del bucle while.',
      codigoReto: `char *ptr = str;\nwhile (???)\n    ptr++;\n// ptr apunta ahora al byte '\\0'`,
      respuesta: `En C, el bucle \`while (*ptr) ptr++;\` evalúa el valor contenido en la dirección. Cuando llega al byte nulo '\\0' (valor numérico 0), la condición se vuelve falsa y el bucle termina inmediatamente con ptr apuntando exactamente a la terminación.`,
      codigoSolucion: `char *end = str;\n\nwhile (*end)\n    end++;\n// Ahora end apunta a '\\0', y (end - str) es exactamente la longitud`,
      porQue: `Evita tener que llamar a strlen o iterar dos veces innecesariamente. La resta de punteros (end - str) devuelve la distancia en elementos en tiempo O(1).`,
      trampaMoulinette: `Escribir \`while (ptr++)\` en lugar de \`while (*ptr)\`. Sin el asterisco desreferenciador, compruebas si la dirección de memoria no es nula, iterando hasta el fin del espacio de direcciones y provocando Segmentation Fault.`,
      origen: 'ia'
    },
    {
      id: `fallback-${Date.now()}-2`,
      exerciseId: exerciseId || 'c_syntax',
      nivel: level || 2,
      categoria: 'sintaxis',
      titulo: `${topic}: Estructura de comprobación de argc en main`,
      pregunta: `¿Cuál es el patrón canónico para un programa de examen que requiere N argumentos y debe imprimir solo '\\n' si no se cumplen?`,
      pista: 'Recuerda que argv[0] es el nombre del ejecutable. Por tanto argc para 1 argumento es 2.',
      codigoReto: `int main(int argc, char **argv) {\n    if (argc == ???) {\n        // lógica principal\n    }\n    // ¿Dónde debe ir el write de '\\n'?\n}`,
      respuesta: `Se evalúa la condición estricta \`if (argc == N + 1)\`. Toda la lógica de procesamiento se ejecuta dentro de ese bloque. Justo antes del \`return (0)\`, se coloca SIEMPRE fuera del if la llamada \`write(1, "\\n", 1);\`.`,
      codigoSolucion: `int main(int argc, char **argv)\n{\n    if (argc == 2)\n    {\n        // resolver para argv[1]\n    }\n    write(1, "\\n", 1);\n    return (0);\n}`,
      porQue: `Moulinette prueba los programas con 0 argumentos, 1 argumento y múltiples argumentos. Si metes el '\\n' dentro del if, con 0 argumentos no imprimirá nada y Moulinette marcará KO instantáneo.`,
      trampaMoulinette: `Poner write(1, "\\n", 1) dentro del if o devolver 1 en lugar de 0. Salvo que el subject diga lo contrario, main debe retornar 0.`,
      origen: 'ia'
    },
    {
      id: `fallback-${Date.now()}-3`,
      exerciseId: exerciseId || 'c_algo',
      nivel: level || 2,
      categoria: 'resolucion',
      titulo: `${topic}: Detección de caracteres alfanuméricos y banderas`,
      pregunta: `¿Cómo implementar un filtro de palabras sin usar isspace() ni ctype.h en los ejercicios de manipulación de texto de 42?`,
      pista: 'Usa una función auxiliar o expresión con los caracteres exactos permitidos: espacio, tabulación y salto de línea.',
      codigoReto: `// ¿Cómo saltar todos los espacios y tabs seguidos?\nwhile (???)\n    i++;`,
      respuesta: `En la Escuela 42 los caracteres separadores estándar son espacio (' ') y tabulación ('\\t') y en ocasiones salto de línea ('\\n'). Se filtran con: \`while (*str == ' ' || *str == '\\t' || *str == '\\n') str++;\`.`,
      codigoSolucion: `int is_sep(char c)\n{\n    return (c == ' ' || c == '\\t' || c == '\\n');\n}\n\n// Uso:\nwhile (is_sep(*str))\n    str++;`,
      porQue: `Crear una pequeña función auxiliar booleana \`is_sep(c)\` hace que el código sea modular, reduce la longitud de las líneas según la Norminette y previene olvidar el '\\t'.`,
      trampaMoulinette: `Comprobar únicamente espacios con \`c == ' '\` y olvidar las tabulaciones \`\\t\`. Moulinette siempre incluye casos de prueba con tabs.`,
      origen: 'ia'
    },
    {
      id: `fallback-${Date.now()}-4`,
      exerciseId: exerciseId || 'c_mem',
      nivel: level || 3,
      categoria: 'casos_limite',
      titulo: `${topic}: Control de desbordamiento en enteros y conversión ASCII`,
      pregunta: `Al convertir caracteres a enteros con la fórmula res = res * 10 + (*s - '0'), ¿qué ocurre si no se valida el rango o vienen signos negativos?`,
      pista: 'Usa una variable int sign = 1; y actualízala a -1 si encuentras \'-\'.',
      codigoReto: `int sign = 1;\nif (*s == '-' || *s == '+') {\n    // ¿Cómo actualizar sign?\n}`,
      respuesta: `Se inicializa \`sign = 1\`. Si el primer carácter no blanco es '-', se asigna \`sign = -1\` y se avanza el puntero. Si es '+', simplemente se avanza. Luego el acumulador suma dígitos positivos y al final se retorna \`res * sign\`.`,
      codigoSolucion: `int sign = 1;\nint res = 0;\n\nif (*s == '-' || *s == '+')\n{\n    if (*s == '-')\n        sign = -1;\n    s++;\n}\nwhile (*s >= '0' && *s <= '9')\n{\n    res = res * 10 + (*s - '0');\n    s++;\n}\nreturn (res * sign);`,
      porQue: `Esta técnica garantiza que solo se procese un signo al inicio y que cualquier carácter no numérico subsiguiente detenga la conversión limpiamente como en la libc.`,
      trampaMoulinette: `Permitir múltiples signos (ej: ++--12) cuando la especificación de examen exige el comportamiento estándar de atoi.`,
      origen: 'ia'
    }
  ];

  return library.slice(0, Math.max(1, Math.min(count, library.length)));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
