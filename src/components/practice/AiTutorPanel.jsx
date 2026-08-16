import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Key, Loader2, Bot, AlertCircle, Info, Trash2, HelpCircle } from 'lucide-react'
import clsx from 'clsx'
import { useSettingsStore } from '@/store/settingsStore'

export default function AiTutorPanel({ exercise, getCurrentCode, tests = [] }) {
  const { geminiApiKey, setGeminiApiKey } = useSettingsStore()
  const [showKeyInput, setShowKeyInput] = useState(!geminiApiKey)
  const [tempKey, setTempKey] = useState(geminiApiKey || '')
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const chatEndRef = useRef(null)

  // Scroll automatico al recibir mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Guardar API Key
  const handleSaveKey = () => {
    setGeminiApiKey(tempKey.trim())
    setShowKeyInput(false)
    setError(null)
  }

  // Borrar historial
  const handleClearHistory = () => {
    setMessages([])
    setError(null)
  }

  // Generar el prompt del sistema context-aware
  const getSystemPrompt = () => {
    const exerciseName = exercise?.nombre || 'este ejercicio'
    const exerciseDesc = exercise?.descripcion || ''
    const story = exercise?.palacio?.historia || ''
    const anchors = exercise?.palacio?.anclas?.join(', ') || ''
    const fns = exercise?.funcionesPermitidas?.join(', ') || 'write'
    const traps = exercise?.trampas?.map(t => `- ${t.titulo}: ${t.descripcion}`).join('\n') || ''

    return `Eres un tutor experto en C y preparación para el Examen 02 de la Escuela 42. Tu objetivo es guiar al estudiante de manera socrática: explícale los conceptos lógicos, dale pistas de por qué su código no funciona o qué le falta considerar, pero NUNCA le des código de solución directamente. Tampoco escribas bloques de código C listos para copiar. Queremos que el alumno desarrolle sus habilidades de razonamiento lógico.
    El alumno está resolviendo el ejercicio '${exerciseName}' (${exercise.tipoEntrega === 'programa' ? 'programa completo con main' : 'función sin main'}).
    Descripción del ejercicio: ${exerciseDesc}
    Funciones permitidas: ${fns}
    Mnemotecnia y Palacio del alumno (Método Campayo):
    - Personaje: ${exercise?.palacio?.personaje} en la habitación: ${exercise?.palacio?.habitacion}
    - Historia: ${story}
    - Anclas lógicas: ${anchors}
    Errores comunes y trampas en este ejercicio:
    ${traps}
    
    Por favor, responde siempre de forma clara, didáctica, con tono motivador y en español. Utiliza formato markdown para tus respuestas (negritas, listas, bloques de código explicativo conceptual corto si es necesario, pero no código completo). Hazle preguntas socráticas que lo fuercen a revisar su código.`
  }

  // Llamada a la API de Gemini
  const callGemini = async (userMsgText, updatedHistory) => {
    if (!geminiApiKey) {
      // Modo Simulación / Local
      await new Promise(r => setTimeout(r, 1200))
      return getSimulatedResponse(userMsgText)
    }

    const systemPrompt = getSystemPrompt()
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`

    // Mapear historial al formato de Gemini
    const contents = updatedHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))

    const body = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1000
      }
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!reply) throw new Error('No se recibió respuesta del modelo')
      return reply
    } catch (err) {
      console.error(err)
      throw new Error(`Error del Tutor AI: ${err.message}. Verifica tu API Key o conexión.`)
    }
  }

  // Simulación de respuestas locales (socrático, basado en metadata)
  const getSimulatedResponse = (query) => {
    const qLower = query.toLowerCase()
    const name = exercise?.nombre || 'ejercicio'
    const desc = exercise?.descripcion || ''
    const story = exercise?.palacio?.historia || ''
    const character = exercise?.palacio?.personaje || 'el personaje'
    const anchors = exercise?.palacio?.anclas || []

    if (qLower.includes('analizar') || qLower.includes('código') || qLower.includes('#code')) {
      return `### 🧠 Análisis del Código (Simulación)
Veo tu código para **${name}**. 

Como estamos en **Modo de Simulación** (sin API Key configurada), aquí tienes una guía conceptual de razonamiento para revisar tu código:

1. **La meta final**: ${desc}.
2. **Las anclas lógicas**:
   ${anchors.map(a => `- **Punto clave**: ${a}`).join('\n')}
3. **El Palacio de la Memoria**: Recuerda que ${character} nos enseña el camino lógico: *"${story}"*.

**Preguntas Socráticas para que revises tú mismo:**
* ¿Estás controlando de forma segura que el número de argumentos sea exactamente el esperado (guarda de \`argc\`)?
* ¿Tu bucle principal recorre la cadena carácter a carácter deteniéndose en el byte cero (\`\\0\`)?
* Si hay banderas (flags) en juego, ¿las reinicias correctamente o se quedan activas?

*(Tip: Agrega una API Key de Gemini en la parte superior para recibir feedback real sobre tu código específico).*`
    }

    if (qLower.includes('segfault') || qLower.includes('error') || qLower.includes('crash')) {
      return `### ⚠️ ¿Dónde está el Segfault? (Simulación)
En los exámenes de C, los Segmentation Faults suelen ocurrir por tres motivos principales:

1. **No comprobar argc**: Intentar leer \`av[1]\` cuando el usuario no le pasó argumentos al programa (\`argc < 2\`). Esto desreferencia un puntero nulo.
2. **Ignorar el terminador nulo**: Correr un bucle \`while\` sin comprobar \`str[i] != '\\0'\` o incrementar el puntero infinitamente más allá de la memoria asignada.
3. **Punteros sin inicializar**: Usar un puntero antes de asignarle memoria con \`malloc\` o sin apuntarlo a una variable válida.

**Revisa estas líneas en tu editor:**
- ¿Pusiste una condición \`if (ac == 2)\` o similar al iniciar tu main?
- ¿El recorrido de tus strings comprueba siempre si el carácter actual existe?`
    }

    // Default socratic hint
    return `### 💡 Guía Didáctica (Simulación)
Para resolver **${name}** sin memorizar, enfócate en sus bases de razonamiento:

- **Estructura base**: Determina si es un *programa* (requiere \`main\` con manejo de argumentos e impresión de salto de línea) o una *función* (recibe parámetros directos y suele retornar un valor).
- **El flujo de datos**: En tu mente, simula que eres la computadora y dibuja el string carácter por carácter en un papel. ¿Qué hace tu bucle en cada paso?

¿Qué parte específica del razonamiento o de la lógica te cuesta visualizar en este momento?`
  }

  // Enviar mensaje del usuario
  const handleSend = async (customText = null) => {
    const textToSend = (customText || input).trim()
    if (!textToSend && !customText) return

    setInput('')
    setError(null)
    setLoading(true)

    const userMessage = { role: 'user', text: textToSend }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    try {
      const response = await callGemini(textToSend, updatedMessages)
      setMessages(prev => [...prev, { role: 'model', text: response }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Acción rápida: Analizar mi código
  const handleAnalyzeCode = () => {
    const code = getCurrentCode()
    if (!code || code.trim() === '// Tu código aquí') {
      setError('Escribe un poco de código en el editor primero para poder analizarlo.')
      return
    }

    const passedTests = tests.filter(t => t.status === 'passed').length
    const totalTests = tests.length
    
    let moulinetteInfo = ''
    if (totalTests > 0) {
      moulinetteInfo = `Actualmente paso ${passedTests} de ${totalTests} pruebas en Moulinette.`
    }

    const msg = `Tutor, por favor analiza mi código actual para ver si voy por buen camino y dónde tengo errores de razonamiento. No me des la respuesta directa.

Aquí está mi código:
\`\`\`c
${code}
\`\`\`
${moulinetteInfo}`

    handleSend(msg)
  }

  // Acción rápida: Pedir pista conceptual
  const handleAskHint = () => {
    handleSend('Tutor, necesito una pista conceptual. Explícame a alto nivel qué lógica o qué patrón de razonamiento debo emplear en este ejercicio.')
  }

  // Acción rápida: Tengo un Segfault
  const handleAskSegfault = () => {
    handleSend('Tutor, mi código produce un error de memoria (segfault / crash). ¿Cuáles son los puntos débiles típicos de este ejercicio donde podría estar ocurriendo esto?')
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden text-sm">
      {/* Header Panel */}
      <div className="bg-white border-b border-zinc-200 px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 leading-tight">Tutor Socrático AI</h3>
            <p className="text-[10px] text-zinc-500 font-semibold">Aprende a razonar el código</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              title="Borrar chat"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            title="Configurar Gemini API Key"
            className={clsx(
              'p-1.5 rounded-lg transition-colors border',
              geminiApiKey ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200'
            )}
          >
            <Key size={14} />
          </button>
        </div>
      </div>

      {/* Key Config Panel */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-zinc-200 px-4 py-3 shrink-0 overflow-hidden space-y-2 text-xs"
          >
            <div className="flex items-start gap-2 text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60 leading-normal">
              <Info size={14} className="text-sky-500 shrink-0 mt-0.5" />
              <p>
                Este tutor usa la API oficial de **Google Gemini**. Puedes obtener una API Key gratis en{' '}
                <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-sky-600 font-semibold underline">
                  Google AI Studio
                </a>. Si no la configuras, el tutor responderá en **Modo de Simulación**.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={tempKey}
                onChange={e => setTempKey(e.target.value)}
                placeholder="Pega tu Gemini API Key aquí..."
                className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-zinc-400 font-mono text-xs"
              />
              <button
                onClick={handleSaveKey}
                className="px-3 py-1.5 bg-zinc-900 text-white font-bold rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 max-w-xs mx-auto space-y-3 py-8">
            <Bot size={36} className="text-zinc-300" />
            <div>
              <p className="font-bold text-zinc-800 text-sm">¿Cómo puedo ayudarte hoy?</p>
              <p className="text-xs text-zinc-500 mt-1 leading-normal">
                Pega código o usa las acciones rápidas de abajo. Te guiaré paso a paso para que entiendas la lógica sin darte la respuesta servida.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user'
              // Ocultar mensajes de análisis largos que ensucian el chat visualmente
              const isLongCodeSnippet = msg.text.includes('getCurrentCode') || msg.text.includes('Aquí está mi código:')
              const displayText = isUser && isLongCodeSnippet 
                ? '🔍 Enviado mi código actual al Tutor para análisis...' 
                : msg.text

              return (
                <div key={index} className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
                  <div
                    className={clsx(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm text-xs',
                      isUser
                        ? 'bg-zinc-900 text-white rounded-tr-none'
                        : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none prose prose-zinc prose-sm'
                    )}
                  >
                    {!isUser && <div className="font-bold text-purple-600 mb-1 flex items-center gap-1.5"><Bot size={12} /> Tutor AI</div>}
                    <div className="whitespace-pre-wrap break-words">
                      {displayText}
                    </div>
                  </div>
                </div>
              )
            })}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-zinc-500 shadow-sm text-xs">
                  <Loader2 className="animate-spin text-purple-500" size={14} />
                  <span>Pensando mi respuesta socrática...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-none px-4 py-3 text-red-700 flex items-start gap-2 shadow-sm text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Quick Actions Panel */}
      <div className="px-4 py-2 shrink-0 bg-white border-t border-zinc-200 flex flex-wrap gap-1.5 select-none">
        <button
          onClick={handleAnalyzeCode}
          disabled={loading}
          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          🔍 Analizar Código
        </button>
        <button
          onClick={handleAskHint}
          disabled={loading}
          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          💡 Pedir Pista
        </button>
        <button
          onClick={handleAskSegfault}
          disabled={loading}
          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          ⚠️ Crash / Segfault
        </button>
      </div>

      {/* Input Form */}
      <div className="p-3 shrink-0 bg-white border-t border-zinc-200">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Pregúntale al tutor (ej: ¿por qué da segfault?)..."
            disabled={loading}
            className="flex-1 px-3 py-2 border border-zinc-200 rounded-xl text-zinc-800 text-xs focus:outline-none focus:border-zinc-400 disabled:bg-zinc-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="h-8 w-8 bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-40 transition-colors shrink-0"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
