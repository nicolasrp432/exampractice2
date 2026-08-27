import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Bot, 
  AlertCircle, 
  Trash2, 
  HelpCircle,
  Zap,
  Code,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';

export default function AiTutorPanel({ exercise, getCurrentCode, tests = [] }) {
  const geminiApiKey = useSettingsStore((s) => s.geminiApiKey);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(`42prep-tutor-${exercise?.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Persist messages per exercise
  useEffect(() => {
    if (exercise?.id) {
      try {
        localStorage.setItem(`42prep-tutor-${exercise.id}`, JSON.stringify(messages));
      } catch (e) {}
    }
  }, [messages, exercise?.id]);

  const handleClearHistory = () => {
    setMessages([]);
    setError(null);
    if (exercise?.id) {
      localStorage.removeItem(`42prep-tutor-${exercise.id}`);
    }
  };

  const handleSend = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend && !customText) return;

    setInput('');
    setError(null);
    setLoading(true);

    const userMessage = { role: 'user', text: textToSend, timestamp: Date.now() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const currentCode = getCurrentCode ? getCurrentCode() : '';

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: updatedMessages.slice(-10),
          exerciseContext: exercise,
          codeContext: currentCode,
          customKey: geminiApiKey || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: data.reply || 'No se pudo generar respuesta.', timestamp: Date.now() },
      ]);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Fallback message
      setMessages((prev) => [
        ...prev,
        { 
          role: 'model', 
          text: `### 💡 Guía del Profesor 42\nPara **${exercise?.nombre}**:\n- Verifica siempre \`argc == 2\` para evitar Segfaults.\n- Itera con cuidado deteniéndote en \`'\\0'\`.\n- No olvides el salto de línea final obligatorio: \`write(1, "\\n", 1)\`.`,
          timestamp: Date.now()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCode = () => {
    const code = getCurrentCode ? getCurrentCode() : '';
    if (!code || code.trim() === '// Tu código aquí') {
      setError('Escribe un poco de código en el editor primero para poder analizarlo.');
      return;
    }

    const passedTests = tests.filter((t) => t.status === 'passed').length;
    const totalTests = tests.length;
    
    let moulinetteInfo = '';
    if (totalTests > 0) {
      moulinetteInfo = `Actualmente paso ${passedTests} de ${totalTests} pruebas en Moulinette.`;
    }

    const msg = `Tutor, por favor analiza mi código actual para ver si voy por buen camino y dónde tengo errores de razonamiento. No me des la respuesta directa, guíame socráticamente.\n\n${moulinetteInfo}`;

    handleSend(msg);
  };

  const handleAskHint = () => {
    handleSend('Tutor, necesito una pista conceptual socrática. Explícame a alto nivel qué lógica o qué patrón de razonamiento debo emplear en este ejercicio.');
  };

  const handleAskSegfault = () => {
    handleSend('Tutor, mi código produce un error de memoria (segfault / crash). ¿Cuáles son los puntos débiles típicos de este ejercicio donde podría estar ocurriendo esto?');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden text-sm">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 leading-tight">Profesor 42 / Tutor Socrático</h3>
            <p className="text-[10px] text-zinc-500 font-semibold">Razonamiento, lógica y memoria C</p>
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
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 max-w-xs mx-auto space-y-3 py-6">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
              <Bot size={28} />
            </div>
            <div>
              <p className="font-bold text-zinc-800 text-sm">¿En qué necesitas orientación?</p>
              <p className="text-xs text-zinc-500 mt-1 leading-normal">
                Usa las acciones rápidas de abajo o escribe tus dudas. Te guiaré paso a paso para que entiendas la lógica sin memorizar soluciones a ciegas.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={index} className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
                  <div
                    className={clsx(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm text-xs space-y-1',
                      isUser
                        ? 'bg-zinc-900 text-white rounded-tr-none'
                        : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                    )}
                  >
                    {!isUser && (
                      <div className="font-bold text-purple-600 mb-1 flex items-center gap-1.5 text-[11px]">
                        <Bot size={12} /> Profesor 42
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words prose prose-zinc prose-sm">
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-zinc-500 shadow-sm text-xs">
                  <Loader2 className="animate-spin text-purple-500" size={14} />
                  <span>Pensando respuesta socrática...</span>
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
      <div className="px-3 py-2 shrink-0 bg-white border-t border-zinc-200 flex flex-wrap gap-1.5 select-none">
        <button
          onClick={handleAnalyzeCode}
          disabled={loading}
          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          <Code size={12} className="text-purple-600" /> Analizar Código
        </button>
        <button
          onClick={handleAskHint}
          disabled={loading}
          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          <Lightbulb size={12} className="text-amber-500" /> Pedir Pista
        </button>
        <button
          onClick={handleAskSegfault}
          disabled={loading}
          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-[11px] font-semibold text-zinc-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          <AlertTriangle size={12} className="text-red-500" /> Segfault / Crash
        </button>
      </div>

      {/* Input Form */}
      <div className="p-3 shrink-0 bg-white border-t border-zinc-200">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Pregúntale al profesor (ej: ¿por qué da segfault?)..."
            disabled={loading}
            className="flex-1 px-3 py-2 border border-zinc-200 rounded-xl text-zinc-800 text-xs focus:outline-none focus:border-purple-500 disabled:bg-zinc-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="h-8 w-8 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 disabled:opacity-40 transition-colors shrink-0 shadow-sm"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
