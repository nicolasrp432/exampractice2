import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Trophy, CheckCircle2, XCircle, RotateCcw,
  Sparkles, ArrowRight, Brain, Clock, ShieldCheck, Flame, Layers
} from 'lucide-react'
import clsx from 'clsx'
import confetti from 'canvas-confetti'
import { buildQuizQuestions, getUniversalTools } from '@/utils/tools'

// Banco extendido de preguntas relámpago de instinto rápido
const INSTINCT_QUIZ_BANK = [
  {
    id: 'instinct-1',
    subjectSnippet: 'Assignment: first_word\nWrite a program that takes a string and displays its first word, followed by a newline.',
    question: 'Al leer este subject, ¿cuál es el arquetipo y herramienta primaria que debes aplicar?',
    options: [
      { id: 'opt-1', label: '🧵 Strings + 🚩 Bandera/Delimitadores (Analizador Dos Punteros)', isCorrect: true, emoji: '✂️' },
      { id: 'opt-2', label: '🧠 malloc + clonar array', isCorrect: false, emoji: '📦' },
      { id: 'opt-3', label: '🧮 Bits y desplazamientos de byte', isCorrect: false, emoji: '🔌' },
      { id: 'opt-4', label: '🌀 Recursión y árbol DFS', isCorrect: false, emoji: '🌊' }
    ],
    explanation: 'El problema solo necesita saltar delimitadores iniciales (\' \' y \'\\t\') con dos punteros o índices y escribir hasta el siguiente delimitador sin reservar memoria.'
  },
  {
    id: 'instinct-2',
    subjectSnippet: 'Assignment: inter\nWrite a program that takes two strings and displays, without doubles, the characters that appear in both strings...',
    question: '¿Cuál es la estructura mental más rápida y eficiente para evitar duplicados en tiempo O(1)?',
    options: [
      { id: 'opt-1', label: 'Dos bucles anidados O(N²) recorriendo la cadena hacia atrás', isCorrect: false, emoji: '🐌' },
      { id: 'opt-2', label: '⚡ Vector de frecuencias ASCII en Stack: `int seen[256] = {0};`', isCorrect: true, emoji: '⚡' },
      { id: 'opt-3', label: 'Reservar un array dinámico con malloc() para cada carácter', isCorrect: false, emoji: '📦' },
      { id: 'opt-4', label: 'Ordenar las cadenas con sort alfabético primero', isCorrect: false, emoji: '🔄' }
    ],
    explanation: 'El array `seen[256]` en la Pila permite consultar y marcar en O(1) tiempo constante si un carácter ya fue impreso, reduciendo el código a 10 líneas limpias.'
  },
  {
    id: 'instinct-3',
    subjectSnippet: 'Assignment: ft_strdup\nReproduce the behavior of strdup (man strdup).\nchar *ft_strdup(char *src);',
    question: '¿Qué 2 detalles críticos provocarán un 0 instantáneo de la Moulinette si los olvidas?',
    options: [
      { id: 'opt-1', label: 'No usar recursión y no imprimir con printf', isCorrect: false, emoji: '❌' },
      { id: 'opt-2', label: 'Guardia `if (!src) return (NULL);` y reservar `len + 1` para el `\'\\0\'`', isCorrect: true, emoji: '🛡️' },
      { id: 'opt-3', label: 'No incluir el header <stdio.h>', isCorrect: false, emoji: '❌' },
      { id: 'opt-4', label: 'No crear un main con argc y argv', isCorrect: false, emoji: '❌' }
    ],
    explanation: 'Al ser una función pura, la Moulinette probará punteros nulos (`src == NULL`). Además, sin `len + 1` bytes reservados, el `\'\\0\'` pisará memoria ajena en el Heap.'
  },
  {
    id: 'instinct-4',
    subjectSnippet: 'Assignment: swap_bits\nunsigned char swap_bits(unsigned char octet);\nSwaps the 4 high bits with the 4 low bits of a byte.',
    question: '¿Cuál es la fórmula en 1 línea de hardware que intercambia los dos nibbles?',
    options: [
      { id: 'opt-1', label: '(octet >> 4) | (octet << 4)', isCorrect: true, emoji: '🔌' },
      { id: 'opt-2', label: 'octet & 0xF0 + octet & 0x0F', isCorrect: false, emoji: '❌' },
      { id: 'opt-3', label: 'octet ^ 255', isCorrect: false, emoji: '❌' },
      { id: 'opt-4', label: 'octet * 16 / 2', isCorrect: false, emoji: '❌' }
    ],
    explanation: 'Desplazar 4 bits a la derecha (`>> 4`) baja la mitad alta, desplazar 4 bits a la izquierda (`<< 4`) sube la mitad baja, y el operador OR bit a bit (`|`) los funde en un nuevo byte.'
  },
  {
    id: 'instinct-5',
    subjectSnippet: 'Assignment: epur_str\nWrite a program that displays the string with exactly one space between words and no spaces at the start/end.',
    question: '¿Cómo se maneja la bandera para no imprimir espacios al final de la frase?',
    options: [
      { id: 'opt-1', label: 'Imprimir el espacio inmediatamente cuando veas `str[i] == \' \'`', isCorrect: false, emoji: '❌' },
      { id: 'opt-2', label: 'Activar `flag = 1` al ver espacios, pero imprimir el espacio ÚNICAMENTE cuando detectes la siguiente letra visible', isCorrect: true, emoji: '🚩' },
      { id: 'opt-3', label: 'Borrar los espacios usando memset()', isCorrect: false, emoji: '❌' },
      { id: 'opt-4', label: 'Contar cuántas palabras hay primero con un bucle previo', isCorrect: false, emoji: '🐌' }
    ],
    explanation: 'Si la frase termina con espacios, la bandera quedará activa pero nunca se imprimirá porque no vendrá ninguna letra posterior, garantizando cero trailing spaces.'
  },
  {
    id: 'instinct-6',
    subjectSnippet: 'Assignment: ft_list_size\nint ft_list_size(t_list *begin_list);\nCounts elements in the linked list.',
    question: '¿Cuál es la condición de parada canónica para recorrer cualquier lista enlazada en C?',
    options: [
      { id: 'opt-1', label: 'while (begin_list->data != NULL)', isCorrect: false, emoji: '💥' },
      { id: 'opt-2', label: 'while (begin_list != NULL) { count++; begin_list = begin_list->next; }', isCorrect: true, emoji: '🔗' },
      { id: 'opt-3', label: 'for (int i = 0; i < sizeof(begin_list); i++)', isCorrect: false, emoji: '❌' },
      { id: 'opt-4', label: 'if (begin_list->next == NULL)', isCorrect: false, emoji: '❌' }
    ],
    explanation: 'La lista termina cuando el puntero del nodo es `NULL`. Comprobar `begin_list->data` o `begin_list->next` sin comprobar antes si `begin_list` es `NULL` causa un Segmentation Fault fatal.'
  },
  {
    id: 'instinct-7',
    subjectSnippet: 'Assignment: fprime\nWrite a program that takes a positive int and displays its prime factors, separated by "*".',
    question: '¿Cuál es la optimización algorítmica para factorizar números sin crear tablas de primos?',
    options: [
      { id: 'opt-1', label: 'Generar la criba de Eratóstenes con malloc(1000000)', isCorrect: false, emoji: '🐌' },
      { id: 'opt-2', label: 'Divisor incremental `div = 2`: mientras `n % div == 0` imprime `div` y divide `n /= div`; si no, `div++`', isCorrect: true, emoji: '🔢' },
      { id: 'opt-3', label: 'Comprobar si el número es par o impar y restar 1', isCorrect: false, emoji: '❌' },
      { id: 'opt-4', label: 'Multiplicar todos los impares hasta llegar a n', isCorrect: false, emoji: '❌' }
    ],
    explanation: 'Al dividir exhaustivamente por `div = 2`, luego `div = 3`, etc., nunca se imprimirán factores compuestos porque sus submúltiplos ya habrán agotado a `n` previamente.'
  }
]

export default function LightningInstinctQuiz() {
  const [questions] = useState(INSTINCT_QUIZ_BANK)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [history, setHistory] = useState([])

  const currentQ = questions[currentIndex]

  const handleSelect = (option) => {
    if (selectedOption !== null) return
    setSelectedOption(option)

    const isCorrect = option.isCorrect
    if (isCorrect) {
      setScore((s) => s + 1)
      setStreak((st) => st + 1)
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } })
    } else {
      setStreak(0)
    }

    setHistory((h) => [...h, { questionId: currentQ.id, isCorrect }])
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setScore(0)
    setStreak(0)
    setIsFinished(false)
    setHistory([])
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-2xl mx-auto rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
          <Trophy size={40} />
        </div>
        
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Sesión de Instinto Completada
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">
            Puntuación: {score} / {questions.length} ({percentage}%)
          </h3>
          <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
            {percentage >= 80
              ? '¡Excelente instinto! Eres capaz de identificar arquetipos y patrones en segundos sin dudar.'
              : 'Buen entrenamiento. Repasa los módulos de fundamentos para afianzar el reconocimiento automático de patrones.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-2 text-xs">
          <span className="font-bold text-zinc-700 block uppercase tracking-wider">Resumen de respuestas:</span>
          <div className="grid grid-cols-7 gap-2">
            {history.map((item, idx) => (
              <div
                key={idx}
                className={clsx(
                  'h-8 rounded-lg flex items-center justify-center font-bold text-xs border',
                  item.isCorrect
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                )}
              >
                #{idx + 1}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <RotateCcw size={16} /> Entrenar de Nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Barra superior de progreso y racha */}
      <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-800">
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
          {streak > 1 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-1 animate-pulse">
              <Flame size={13} className="text-amber-500 fill-amber-500" />
              <span>Racha x{streak}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-700 font-mono">Aciertos: {score}</span>
        </div>
      </div>

      {/* Tarjeta de la Pregunta */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-5"
      >
        {/* Snippet del Subject Real */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Enunciado simulado de 42:
          </span>
          <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
            {currentQ.subjectSnippet}
          </pre>
        </div>

        {/* Pregunta */}
        <div>
          <h3 className="text-base sm:text-lg font-black text-zinc-900">
            {currentQ.question}
          </h3>
        </div>

        {/* Opciones */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt) => {
            const isPicked = selectedOption?.id === opt.id
            const showFeedback = selectedOption !== null
            const isOptionCorrect = opt.isCorrect

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                disabled={selectedOption !== null}
                className={clsx(
                  'w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3',
                  showFeedback && isOptionCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                    : showFeedback && isPicked && !isOptionCorrect
                    ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                    : selectedOption === null
                    ? 'bg-zinc-50/80 border-zinc-200/90 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-800'
                    : 'bg-white border-zinc-100 text-zinc-400 opacity-60'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </div>

                {showFeedback && isOptionCorrect && (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                )}
                {showFeedback && isPicked && !isOptionCorrect && (
                  <XCircle size={18} className="text-rose-600 shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Explicación formativa */}
        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={clsx(
              'p-4 rounded-xl text-xs leading-relaxed border space-y-1',
              selectedOption.isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            )}
          >
            <strong className="block font-bold">
              {selectedOption.isCorrect ? '✅ ¡Exacto! Análisis de instinto:' : '💡 Explicación del Patrón:'}
            </strong>
            <p>{currentQ.explanation}</p>
          </motion.div>
        )}

        {/* Botón Siguiente */}
        {selectedOption !== null && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-2xs"
            >
              <span>{currentIndex === questions.length - 1 ? 'Ver Resultado Final' : 'Siguiente Pregunta'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
