import { GoogleGenAI } from '@google/genai';

function getAiClient(customKey) {
  const rawKey = customKey?.trim() || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!rawKey) return null;
  // Limpiar comillas o espacios residuales
  const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function getSystemInstruction(exerciseContext) {
  const name = exerciseContext?.nombre || 'General 42 C';
  const desc = exerciseContext?.descripcion || '';
  const allowed = exerciseContext?.funcionesPermitidas?.join(', ') || 'write, malloc, free';
  const palace = exerciseContext?.palacio 
    ? `Personaje: ${exerciseContext.palacio.personaje}, Habitación: ${exerciseContext.palacio.habitacion}, Historia: "${exerciseContext.palacio.historia}"`
    : 'No especificado';
  const traps = exerciseContext?.trampas?.map((t) => `- ${t.titulo}: ${t.descripcion}`).join('\n') || '';

  return `Eres el "Profesor 42", el mentor veterano y exigente pero profundamente pedagógico de la Escuela 42 para el Examen 02 (Rank 02).

PERSONALIDAD Y TONO:
- Eres experto, directo y riguroso como la Moulinette, pero a la vez amigable y formador.
- Si el alumno comete un error grave (Segfault, no verificar NULL, memoria sin '\\0', funciones no permitidas, ignorar argc), sé duro, tajante y claro sobre las consecuencias ("Moulinette te pondrá un 0 en el segundo 1 por esto").
- NUNCA des respuestas kilométricas o muros de texto aburridos. Sé conciso, directo al grano y estructurado.
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history = [], exerciseContext, codeContext, customKey } = req.body || {};
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
      const contents = history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text || msg.content || '' }],
      }));

      contents.push({
        role: 'user',
        parts: [{ text: contextEnrichedMessage }],
      });

      // Modelos candidatos en orden de compatibilidad y velocidad
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
            return res.status(200).json({ reply: replyText, modelUsed: model });
          }
        } catch (apiErr) {
          console.warn(`Model ${model} failed on Vercel:`, apiErr?.message || apiErr);
        }
      }
    }

    // Fallback pedagógico local socrático si no hay API key o si se agotó la cuota
    const fallbackReply = generateFallbackChat(message, exerciseContext, codeContext);
    return res.status(200).json({ reply: fallbackReply, isFallback: true });
  } catch (err) {
    console.error('Error in Vercel api/gemini/chat:', err);
    res.status(500).json({ error: err.message || 'Error interno del tutor' });
  }
}

function generateFallbackChat(query, exercise, code) {
  const qLower = (query || '').toLowerCase();
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
