import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, CheckCircle2, XCircle, RotateCcw, HelpCircle, MoveRight, ArrowRight } from 'lucide-react'
import clsx from 'clsx'

// ─── BANCO DE PREGUNTAS: PUNTEROS ──────────────────────────────────────────
const POINTER_GAMES = [
  {
    str: 'abcdefg',
    code: 'char *p = str;\np += 3;\nprintf("%c", *p);',
    question: '¿Qué carácter se imprime en pantalla?',
    options: ["'c'", "'d'", "'e'", "'a'"],
    correctIndex: 1,
    pointers: [{ name: 'p', index: 3 }],
    explanation: 'El puntero p empieza apuntando a str[0] (\'a\'). Al sumarle 3 (p += 3), avanza tres celdas hacia adelante en memoria, terminando en la celda 3, que contiene el carácter \'d\'.'
  },
  {
    str: 'preparar',
    code: 'char *p = str;\np += 5;\np--;\nprintf("%c", *p);',
    question: '¿A qué carácter apunta p después de estas operaciones?',
    options: ["'a'", "'r'", "'p'", "'e'"],
    correctIndex: 0,
    pointers: [{ name: 'p', index: 4 }],
    explanation: 'El puntero p se mueve primero 5 posiciones adelante, llegando a str[5] (\'r\' en prep[a]rar). Luego, con p--, retrocede una posición hacia atrás en memoria, quedando en str[4], que es la letra \'a\'.'
  },
  {
    str: '42sparta',
    code: 'char *p = str;\nprintf("%c", *(p + 2));',
    question: '¿Qué carácter devuelve la expresión *(p + 2)?',
    options: ["'2'", "'s'", "'p'", "'a'"],
    correctIndex: 1,
    pointers: [{ name: 'p', index: 0 }, { name: 'p+2', index: 2 }],
    explanation: 'La expresión *(p + 2) lee la celda de memoria que está dos posiciones a la derecha de p sin modificar p de forma permanente. p está en la celda 0 (\'4\'), por lo que p+2 está en la celda 2, que contiene \'s\'.'
  },
  {
    str: 'moulinette',
    code: 'char *p = str + 2;\nchar *q = p + 3;\nprintf("%c y %c", *p, *q);',
    question: '¿Qué imprime el programa?',
    options: ["'u y i'", "'u y n'", "'o y l'", "'u y l'"],
    correctIndex: 0,
    pointers: [{ name: 'p', index: 2 }, { name: 'q', index: 5 }],
    explanation: 'p se inicializa apuntando a str+2, que es str[2] (\'u\'). q apunta a p+3, que es str[2+3] = str[5] (\'i\'). Por lo tanto, imprime \'u y i\'.'
  }
]

// ─── BANCO DE PREGUNTAS: ARITMÉTICA ASCII ──────────────────────────────────
const ASCII_GAMES = [
  {
    code: "char c = 'd';\nint n = c - 'a' + 1;",
    question: '¿Cuál es el valor del entero n?',
    options: ['3', '4', '5', '97'],
    correctIndex: 1,
    explanation: "En la tabla ASCII, las letras son correlativas. 'd' - 'a' calcula la distancia entre ellas (3). Al sumarle 1 (+ 1), obtenemos la posición alfabética real de 'd', que es la 4ª letra."
  },
  {
    code: "char c = 'B';\nchar r = c + 32;",
    question: '¿A qué carácter equivale la variable r?',
    options: ["'b'", "'a'", "'B'", "'c'"],
    correctIndex: 0,
    explanation: "La diferencia en la tabla ASCII entre una letra mayúscula y su minúscula es de exactamente 32. Sumarle 32 a una mayúscula ('B' = 66) da como resultado su versión en minúscula ('b' = 98)."
  },
  {
    code: "char c = '7';\nint digit = c - '0';",
    question: '¿Cuál es el valor de la variable entera digit?',
    options: ['7', '48', '55', '0'],
    correctIndex: 0,
    explanation: "El carácter '7' tiene el código ASCII 55, y el carácter '0' tiene el 48. Al restar '7' - '0' (55 - 48), obtenemos el entero numérico puro 7. Esta es la técnica estándar en C para convertir caracteres numéricos en enteros."
  },
  {
    code: "char c = 'z';\nchar r = c - 25;",
    question: '¿Qué letra contiene la variable r?',
    options: ["'a'", "'b'", "'y'", "'z'"],
    correctIndex: 0,
    explanation: "La letra 'z' es la última del abecedario. Al restarle 25 posiciones al código ASCII de 'z', retrocedemos al principio del abecedario, obteniendo la letra 'a'."
  }
]

// ─── BANCO DE PREGUNTAS: BANDERAS (FLAGS) ──────────────────────────────────
const FLAG_GAMES = [
  {
    str: '  first word',
    code: 'int k = 0;\nwhile (str[i]) {\n    if (str[i] == \' \') k = 1;\n    else if (k) { write(1, &str[i], 1); k = 0; }\n    i++;\n}',
    question: '¿Qué imprime exactamente este fragmento de código?',
    options: ['"first"', '"f"', '"f w"', '"w"'],
    correctIndex: 1,
    explanation: 'El bucle recorre el string. Al inicio hay dos espacios, por lo que k se pone en 1. En la letra \'f\', como k es 1, imprime \'f\' y resetea k a 0. Luego, en \'i\', \'r\', \'s\', \'t\', k es 0, así que no imprime nada. En el espacio intermedio k vuelve a ser 1, y al ver la \'w\', imprime \'w\' y resetea k. La salida final sería "fw" (o "f w" si se imprimiese el espacio, pero aquí solo se imprime la letra cuando k=1). Espera, en el else si k=1 escribe str[i], por lo que escribe la letra. Al ver el espacio k=1, al ver \'w\' imprime \'w\' y k=0. No imprime espacios. Por tanto imprime "fw". Espera, una opción es "f" y otra "fw"? Ah, las opciones son "first", "f", "f w", "w". Espera, revisemos las letras: al inicio k es 1 por los espacios. En \'f\' escribe \'f\' y k=0. En \'i\' k es 0, no entra. En \'r\' k es 0, no entra. En el espacio k=1. En \'w\' escribe \'w\' y k=0. Imprime "fw". En las opciones tengo "f w", pero si solo imprime "fw", la opción correcta del código clásico del examen con k usualmente es distinta. Modifiquemos las opciones para tener "fw"!'
  }
]

// Ajustar opción correcta del flag game para que sea exacta
FLAG_GAMES[0].options = ['"first"', '"fw"', '"f w"', '"w"']
FLAG_GAMES[0].correctIndex = 1

export default function LogicGym() {
  const [activeSubTab, setActiveSubTab] = useState('pointers') // 'pointers' | 'ascii' | 'flags'
  
  // Estados para el juego actual
  const [gameIndex, setGameIndex] = useState(0)
  const [pickedOption, setPickedOption] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [finished, setFinished] = useState(false)

  // Obtener banco de preguntas según subtab
  const currentBank = {
    pointers: POINTER_GAMES,
    ascii: ASCII_GAMES,
    flags: FLAG_GAMES
  }[activeSubTab]

  const currentGame = currentBank[gameIndex]

  // Resetear estado al cambiar de tipo de juego o al reiniciar
  const handleReset = (tab = activeSubTab) => {
    setActiveSubTab(tab)
    setGameIndex(0)
    setPickedOption(null)
    setShowExplanation(false)
    setScore(0)
    setAnsweredCount(0)
    setFinished(false)
  }

  // Responder a una pregunta
  const handlePick = (optionIdx) => {
    if (pickedOption !== null) return
    setPickedOption(optionIdx)
    setShowExplanation(true)
    setAnsweredCount(s => s + 1)
    
    if (optionIdx === currentGame.correctIndex) {
      setScore(s => s + 1)
    }
  }

  // Avanzar al siguiente
  const handleNext = () => {
    setPickedOption(null)
    setShowExplanation(false)
    if (gameIndex < currentBank.length - 1) {
      setGameIndex(i => i + 1)
    } else {
      setFinished(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Subtab buttons */}
      <div className="flex gap-2 border-b border-zinc-200 pb-px select-none">
        {[
          { id: 'pointers', label: 'Aritmética de Punteros', icon: '📍' },
          { id: 'ascii', label: 'Lógica ASCII', icon: '🔣' },
          { id: 'flags', label: 'Seguimiento de Banderas', icon: '🚩' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleReset(tab.id)}
            className={clsx(
              'px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all',
              activeSubTab === tab.id
                ? 'border-zinc-900 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {finished ? (
        <div className="max-w-md mx-auto text-center card p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm space-y-4">
          <Trophy className="mx-auto text-amber-500" size={48} />
          <div className="space-y-1">
            <h3 className="text-xl font-black text-zinc-900">¡Gimnasio completado!</h3>
            <p className="text-sm text-zinc-500">Has entrenado tus bases de razonamiento lógico.</p>
          </div>
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold text-zinc-700">
            Puntuación final: {score} / {currentBank.length} correctas
          </div>
          <button
            onClick={() => handleReset()}
            className="w-full btn-primary py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} /> Volver a entrenar
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          {/* Columna Izquierda: Código y Ejercicio Visual */}
          <div className="space-y-4">
            {/* Cabecera Pregunta */}
            <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Ejercicio {gameIndex + 1} de {currentBank.length}</span>
              <span>Score: {score}/{answeredCount}</span>
            </div>

            {/* Código C */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-700/80 bg-[#1E1E2E] shadow-sm">
              <div className="px-4 py-2 bg-[#181825] border-b border-zinc-700/40 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                codigo.c
              </div>
              <pre className="p-4 font-mono text-xs text-sky-300 leading-relaxed overflow-x-auto whitespace-pre">
                {currentGame.code}
              </pre>
            </div>

            {/* Visualización de Celdas de Memoria */}
            {currentGame.str && (
              <div className="card p-4 bg-white border border-zinc-200 rounded-2xl space-y-2 select-none">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Visualización en memoria de str</p>
                <div className="flex flex-wrap gap-1 items-end pt-4">
                  {currentGame.str.split('').concat('\0').map((char, idx) => {
                    const isNul = char === '\0'
                    // Buscar si hay algún puntero apuntando a este índice
                    const activePointers = currentGame.pointers?.filter(p => p.index === idx) || []
                    const hasPointer = activePointers.length > 0

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        {hasPointer && (
                          <div className="flex flex-col items-center mb-0.5 leading-none">
                            {activePointers.map(p => (
                              <span key={p.name} className="text-[10px] font-bold text-purple-700 font-mono bg-purple-100 border border-purple-200 px-1 rounded">
                                *{p.name}
                              </span>
                            ))}
                            <span className="text-xs text-purple-600 font-bold">▼</span>
                          </div>
                        )}
                        <div
                          className={clsx(
                            'h-8 w-8 rounded-lg flex items-center justify-center font-mono text-xs border transition-colors',
                            hasPointer
                              ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold'
                              : isNul
                                ? 'border-red-200 bg-red-50 text-red-400'
                                : 'border-zinc-200 bg-white text-zinc-700'
                          )}
                        >
                          {isNul ? '\\0' : char === ' ' ? '␣' : char}
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400 mt-1">{idx}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Texto de la Pregunta */}
            <div className="card p-4 bg-white border border-zinc-200 rounded-2xl">
              <h3 className="font-bold text-zinc-950 text-sm flex items-start gap-2">
                <HelpCircle size={16} className="text-zinc-400 shrink-0 mt-0.5" />
                {currentGame.question}
              </h3>
            </div>
          </div>

          {/* Columna Derecha: Respuestas y Explicación */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Opciones */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Selecciona la respuesta correcta</p>
              <div className="grid gap-2">
                {currentGame.options.map((opt, idx) => {
                  const isSelected = pickedOption === idx
                  const isCorrect = idx === currentGame.correctIndex
                  const isWrongSelected = isSelected && !isCorrect
                  const wasAnswered = pickedOption !== null

                  return (
                    <button
                      key={idx}
                      onClick={() => handlePick(idx)}
                      disabled={wasAnswered}
                      className={clsx(
                        'w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between',
                        wasAnswered
                          ? isCorrect
                            ? 'border-green-200 bg-green-50 text-green-800 shadow-sm'
                            : isWrongSelected
                              ? 'border-red-200 bg-red-50 text-red-800'
                              : 'border-zinc-100 bg-zinc-50/50 text-zinc-400'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                      )}
                    >
                      <span className="font-mono">{opt}</span>
                      {wasAnswered && isCorrect && <CheckCircle2 size={14} className="text-green-600" />}
                      {wasAnswered && isWrongSelected && <XCircle size={14} className="text-red-600" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Explicación Accordion */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="card p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3 flex-1 flex flex-col justify-between mt-4"
                >
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Razonamiento Didáctico</p>
                    <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                      {currentGame.explanation}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleNext}
                    className="w-full btn-primary py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs mt-4"
                  >
                    <span>{gameIndex < currentBank.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Entrenamiento'}</span>
                    <ArrowRight size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
