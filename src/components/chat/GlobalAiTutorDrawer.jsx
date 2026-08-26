import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  Code2, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Maximize2, 
  Minimize2,
  ChevronDown,
  Terminal,
  HelpCircle,
  Zap
} from 'lucide-react';
import clsx from 'clsx';
import { allExercises, getExercise } from '@/data/index';

export default function GlobalAiTutorDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('42prep-tutor-global-chat');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const location = useLocation();
  const chatEndRef = useRef(null);

  // Detect current exercise from URL (/ejercicio/:id or /practicar/:id)
  useEffect(() => {
    const match = location.pathname.match(/\/(?:ejercicio|practicar)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      setSelectedExerciseId(match[1]);
    }
  }, [location.pathname]);

  useEffect(() => {
    try {
      localStorage.setItem('42prep-tutor-global-chat', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const activeExercise = getExercise(selectedExerciseId) || null;

  const handleSend = async (customPrompt = null) => {
    const text = (customPrompt || input).trim();
    if (!text || isLoading) return;

    setInput('');
    setIsLoading(true);

    const userMessage = { role: 'user', text, timestamp: Date.now() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);

    // Get current code if available from localStorage
    let currentCode = '';
    if (activeExercise) {
      currentCode = localStorage.getItem(`42prep-code-${activeExercise.id}`) || '';
    }

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newHistory.slice(-10), // keep recent context
          exerciseContext: activeExercise,
          codeContext: currentCode,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const modelMessage = {
        role: 'model',
        text: data.reply || 'No se pudo generar respuesta.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `⚠️ **Profesor 42**: Hubo un detalle de conexión, pero aquí tienes una guía clave:\n\nPara **${activeExercise?.nombre || 'este ejercicio'}**, revisa siempre que:\n1. Filtres \`argc == 2\` para evitar Segfaults al inicio.\n2. Verifiques el byte nulo \`'\\0'\` en cada bucle.\n3. Imprimas un salto de línea \`\\n\` final obligatorio para Moulinette.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem('42prep-tutor-global-chat');
  };

  const quickPrompts = [
    {
      label: 'Explicar lógica',
      icon: <Lightbulb size={12} className="text-amber-500" />,
      prompt: `Tutor, explícame paso a paso cómo razonar la lógica de ${activeExercise ? activeExercise.nombre : 'este ejercicio'} sin darme la solución directa.`,
    },
    {
      label: '¿Por qué da Segfault?',
      icon: <AlertTriangle size={12} className="text-red-500" />,
      prompt: `Tutor, ¿cuáles son los errores de memoria y causas típicas de Segfault en ${activeExercise ? activeExercise.nombre : 'los exámenes de C'}?`,
    },
    {
      label: 'Mnemotecnia y Palacio',
      icon: <BookOpen size={12} className="text-purple-500" />,
      prompt: `Tutor, ¿cómo me ayuda el método Campayo y el palacio de la memoria a recordar la estructura de ${activeExercise ? activeExercise.nombre : 'este ejercicio'}?`,
    },
    {
      label: 'Caso de Test Trampa',
      icon: <Zap size={12} className="text-sky-500" />,
      prompt: `Tutor, dame un caso de prueba extremo o trampa que Moulinette suele usar para ${activeExercise ? activeExercise.nombre : 'evaluar este ejercicio'}.`,
    },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm shadow-xl transition-all border',
            isOpen
              ? 'bg-zinc-900 text-white border-zinc-700'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/40 shadow-purple-500/25'
          )}
        >
          <div className="relative">
            <Bot size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse border-2 border-purple-600" />
          </div>
          <span>Profesor 42 IA</span>
          {activeExercise && (
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-white/20 rounded-full font-mono font-normal">
              {activeExercise.nombre}
            </span>
          )}
        </motion.button>
      </div>

      {/* Slide-over / Modal Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={clsx(
              'fixed z-50 bg-white rounded-3xl shadow-2xl border border-zinc-200/80 flex flex-col overflow-hidden',
              isExpanded
                ? 'inset-4 md:inset-10'
                : 'bottom-20 right-4 sm:right-6 w-[94vw] sm:w-[460px] h-[600px] max-h-[82vh]'
            )}
          >
            {/* Header */}
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-zinc-100">Profesor 42</h3>
                    <span className="px-2 py-0.5 text-[10px] bg-purple-500/30 text-purple-300 rounded-full font-medium">
                      Tutor Socrático
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {activeExercise ? `Contexto: ${activeExercise.nombre} (Nivel ${activeExercise.nivel})` : 'Contexto General de Examen 42'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    title="Borrar conversación"
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded((v) => !v)}
                  title={isExpanded ? 'Restaurar tamaño' : 'Maximizar'}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors hidden sm:block"
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Cerrar"
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Exercise Selector Bar */}
            <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200 flex items-center justify-between text-xs shrink-0">
              <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                <Code2 size={13} className="text-purple-600" />
                Ejercicio enfocado:
              </span>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1 text-xs text-zinc-800 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="">General (Todos los ejercicios)</option>
                {allExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    N{ex.nivel} - {ex.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4 max-w-sm mx-auto my-auto text-zinc-500">
                  <div className="h-16 w-16 rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                    <Sparkles size={30} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-800 text-sm">¡Hola, cadete!</h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      Soy tu tutor pedagógico para el examen de 42. Pregúntame sobre algoritmos, punteros en C, cómo evitar Segfaults o cómo memorizar la estructura de cualquier ejercicio.
                    </p>
                  </div>

                  <div className="w-full space-y-1.5 pt-2 text-left">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
                      Preguntas sugeridas:
                    </p>
                    {quickPrompts.map((qp, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(qp.prompt)}
                        className="w-full flex items-center gap-2 p-2.5 bg-white border border-zinc-200/80 hover:border-purple-300 rounded-xl text-xs text-zinc-700 font-medium transition-all text-left shadow-xs hover:bg-purple-50/30"
                      >
                        {qp.icon}
                        <span className="flex-1 truncate">{qp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={idx}
                        className={clsx('flex flex-col', isUser ? 'items-end' : 'items-start')}
                      >
                        <div
                          className={clsx(
                            'max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm space-y-1.5',
                            isUser
                              ? 'bg-zinc-900 text-white rounded-tr-none'
                              : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                          )}
                        >
                          {!isUser && (
                            <div className="flex items-center gap-1.5 font-bold text-purple-600 text-[11px] mb-1">
                              <Bot size={13} /> Profesor 42
                            </div>
                          )}
                          <div className="whitespace-pre-wrap break-words prose prose-zinc prose-sm">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-start">
                      <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-zinc-500 shadow-sm flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-600 animate-spin" />
                        <span>Razonando respuesta socrática...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 py-2 bg-white border-t border-zinc-100 flex gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSend(qp.prompt)}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-zinc-100 hover:bg-purple-50 hover:text-purple-700 text-zinc-600 rounded-lg text-[11px] font-medium transition-colors border border-transparent hover:border-purple-200 disabled:opacity-50"
                >
                  {qp.icon}
                  <span>{qp.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-zinc-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeExercise
                      ? `Pregunta sobre ${activeExercise.nombre}...`
                      : 'Pregunta al Profesor 42...'
                  }
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-9 w-9 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-200 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
