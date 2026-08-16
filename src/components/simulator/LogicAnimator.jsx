import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipForward, RotateCcw, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

// Generador de pasos de ejecución didácticos por ejercicio
function generateAnimationSteps(exerciseId, inputVal) {
  const steps = []
  const str = inputVal || ''

  // Caso 1: first_word
  if (exerciseId === 'first_word') {
    let i = 0
    let stdout = ''
    
    // Paso inicial
    steps.push({
      i,
      fase: 'Inicio',
      nota: 'Comienza el programa. Comprobamos argc == 2. Iniciamos el puntero i en 0.',
      stdout,
      k: null,
      activeIndices: [i]
    })

    // Salto de espacios iniciales
    while (i < str.length && (str[i] === ' ' || str[i] === '\t')) {
      steps.push({
        i,
        fase: 'Salta Separadores',
        nota: `El carácter en str[${i}] es un separador ('${str[i] === '\t' ? '\\t' : ' '}'). Incrementamos i.`,
        stdout,
        k: null,
        activeIndices: [i]
      })
      i++
    }

    if (i < str.length) {
      steps.push({
        i,
        fase: 'Letra Encontrada',
        nota: `str[${i}] es '${str[i]}'. ¡Comienza la palabra! Empezamos a imprimir y avanzamos.`,
        stdout,
        k: null,
        activeIndices: [i]
      })
    }

    // Copiar primera palabra
    while (i < str.length && str[i] !== ' ' && str[i] !== '\t') {
      stdout += str[i]
      steps.push({
        i,
        fase: 'Imprimiendo Palabra',
        nota: `Escribimos '${str[i]}' en pantalla con write(). Avanzamos i.`,
        stdout,
        k: null,
        activeIndices: [i]
      })
      i++
    }

    // Fin
    stdout += '\n'
    steps.push({
      i,
      fase: 'Fin / Newline',
      nota: `Encontramos ${i >= str.length ? 'el final de la cadena (\\0)' : `un espacio ('${str[i]}')`}. Paramos de escribir e imprimimos '\\n'.`,
      stdout,
      k: null,
      activeIndices: i < str.length ? [i] : []
    })

    return steps
  }

  // Caso 2: epur_str
  if (exerciseId === 'epur_str') {
    let i = 0
    let stdout = ''
    let k = 0 // flag: 0 = no space needed, 1 = space pending
    
    steps.push({
      i,
      fase: 'Inicio',
      nota: 'Comienza epur_str. Inicializamos el flag k = 0 (indica si debemos poner un espacio antes de la siguiente palabra).',
      stdout,
      k,
      activeIndices: [i]
    })

    // Saltar espacios iniciales
    while (i < str.length && (str[i] === ' ' || str[i] === '\t')) {
      steps.push({
        i,
        fase: 'Saltando Inicio',
        nota: `str[${i}] es espacio. Lo ignoramos al inicio del string.`,
        stdout,
        k,
        activeIndices: [i]
      })
      i++
    }

    while (i < str.length) {
      if (str[i] === ' ' || str[i] === '\t') {
        k = 1 // activamos bandera
        steps.push({
          i,
          fase: 'Separador Encontrado',
          nota: `str[${i}] es espacio. Ponemos el flag k = 1 para recordar poner un espacio simple antes de la siguiente palabra.`,
          stdout,
          k,
          activeIndices: [i]
        })
      } else {
        // Si hay bandera y no es el final, escribimos un espacio primero
        // Comprobar si quedan palabras por delante (para evitar espacio al final)
        let hasMoreWords = false
        for (let j = i; j < str.length; j++) {
          if (str[j] !== ' ' && str[j] !== '\t') {
            hasMoreWords = true
            break
          }
        }

        if (k === 1 && hasMoreWords) {
          stdout += ' '
          k = 0
          steps.push({
            i,
            fase: 'Espacio Colocado',
            nota: `¡Nueva palabra detectada! Como k era 1, ponemos un solo espacio y limpiamos k = 0.`,
            stdout,
            k,
            activeIndices: [i]
          })
        }

        stdout += str[i]
        steps.push({
          i,
          fase: 'Escribiendo Palabra',
          nota: `Escribimos el carácter '${str[i]}'.`,
          stdout,
          k,
          activeIndices: [i]
        })
      }
      i++
    }

    stdout += '\n'
    steps.push({
      i,
      fase: 'Fin / Newline',
      nota: 'Llegamos al final de la cadena (\\0). Escribimos salto de línea.',
      stdout,
      k,
      activeIndices: []
    })

    return steps
  }

  // Caso 3: expand_str
  if (exerciseId === 'expand_str') {
    let i = 0
    let stdout = ''
    let k = 0 // flag: 0 = no spaces, 1 = 3 spaces pending
    
    steps.push({
      i,
      fase: 'Inicio',
      nota: 'Comienza expand_str. Inicializamos flag k = 0 (indica si expandiremos a 3 espacios).',
      stdout,
      k,
      activeIndices: [i]
    })

    while (i < str.length && (str[i] === ' ' || str[i] === '\t')) {
      steps.push({
        i,
        fase: 'Saltando Inicio',
        nota: `Ignoramos espacio inicial str[${i}].`,
        stdout,
        k,
        activeIndices: [i]
      })
      i++
    }

    while (i < str.length) {
      if (str[i] === ' ' || str[i] === '\t') {
        k = 1
        steps.push({
          i,
          fase: 'Espacio Encontrado',
          nota: `Detectamos espacio str[${i}]. Activamos k = 1 para expandir en la siguiente palabra.`,
          stdout,
          k,
          activeIndices: [i]
        })
      } else {
        let hasMore = false
        for (let j = i; j < str.length; j++) {
          if (str[j] !== ' ' && str[j] !== '\t') { hasMore = true; break }
        }

        if (k === 1 && hasMore) {
          stdout += '   '
          k = 0
          steps.push({
            i,
            fase: 'Espacio Expandido',
            nota: `Como k era 1, escribimos exactamente TRES espacios ("   ") antes de la palabra y limpiamos k.`,
            stdout,
            k,
            activeIndices: [i]
          })
        }

        stdout += str[i]
        steps.push({
          i,
          fase: 'Imprimiendo',
          nota: `Escribimos '${str[i]}'.`,
          stdout,
          k,
          activeIndices: [i]
        })
      }
      i++
    }

    stdout += '\n'
    steps.push({
      i,
      fase: 'Fin / Newline',
      nota: 'Llegamos al final. Escribimos un salto de línea.',
      stdout,
      k,
      activeIndices: []
    })

    return steps
  }

  // Fallback / Genérico: Recorrido simple
  let index = 0
  let outText = ''
  steps.push({
    i: index,
    fase: 'Inicio',
    nota: 'Inicializamos puntero i = 0 y comenzamos a leer.',
    stdout: outText,
    k: null,
    activeIndices: [index]
  })

  while (index < str.length) {
    outText += str[index]
    steps.push({
      i: index,
      fase: 'Recorrido',
      nota: `Procesando str[${index}] = '${str[index]}'. Avanzamos.`,
      stdout: outText,
      k: null,
      activeIndices: [index]
    })
    index++
  }

  outText += '\n'
  steps.push({
    i: index,
    fase: 'Final',
    nota: 'Terminamos el recorrido. Añadimos salto de línea.',
    stdout: outText,
    k: null,
    activeIndices: []
  })

  return steps
}

export default function LogicAnimator({ exerciseId, defaultInput = '  hello   world  ' }) {
  const [inputVal, setInputVal] = useState(defaultInput)
  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(600) // ms
  
  const timerRef = useRef(null)

  // Generar pasos cuando cambia input o ejercicio
  useEffect(() => {
    const s = generateAnimationSteps(exerciseId, inputVal)
    setSteps(s)
    setStepIndex(0)
    setIsPlaying(false)
  }, [exerciseId, inputVal])

  // Manejar loop de reproducción automática
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, steps.length, speed])

  const currentStep = steps[stepIndex] || { i: 0, fase: '', nota: '', stdout: '', k: null, activeIndices: [] }

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(s => s - 1)
    }
  }

  const handleReset = () => {
    setStepIndex(0)
    setIsPlaying(false)
  }

  return (
    <div className="card p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">
      {/* Selector de Entrada */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Entrada para la Animación</label>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-200 rounded-xl text-xs font-mono bg-zinc-50 focus:outline-none focus:bg-white"
            placeholder="Introduce una frase..."
          />
        </div>
        <div className="shrink-0 flex gap-1 mt-5">
          {['FOR PONY', '  lorem  ipsum  ', 'a'].map(preset => (
            <button
              key={preset}
              onClick={() => setInputVal(preset)}
              className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-[10px] text-zinc-600 font-mono transition-colors border border-zinc-200"
            >
              {preset.length > 8 ? 'lorem' : preset || 'vacío'}
            </button>
          ))}
        </div>
      </div>

      {/* Visualización de la String en Memoria */}
      <div className="space-y-1.5 select-none">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Celdas de Memoria (char *str)</p>
        <div className="flex flex-wrap gap-1 items-end">
          {inputVal.split('').concat('\0').map((char, idx) => {
            const isNul = char === '\0'
            const isActive = currentStep.activeIndices?.includes(idx)
            const charText = isNul ? '\\0' : char === ' ' ? '␣' : char === '\t' ? '\\t' : char
            
            return (
              <div key={idx} className="flex flex-col items-center">
                {isActive && (
                  <motion.div
                    layoutId="anim-pointer"
                    className="text-xs font-bold text-purple-600 mb-0.5 leading-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    ▼
                  </motion.div>
                )}
                <div
                  className={clsx(
                    'h-8 w-8 rounded-lg flex items-center justify-center font-mono text-xs border transition-all duration-200',
                    isActive
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-black scale-105 shadow-sm'
                      : isNul
                        ? 'border-red-200 bg-red-50 text-red-500'
                        : char === ' ' || char === '\t'
                          ? 'border-zinc-200 bg-zinc-50 text-zinc-300'
                          : 'border-zinc-200 bg-white text-zinc-700'
                  )}
                  title={`Índice: ${idx}`}
                >
                  {charText}
                </div>
                <span className="text-[9px] font-mono text-zinc-400 mt-1">{idx}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Panel de Controles */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-zinc-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors border border-zinc-200 bg-white"
            title="Reiniciar"
          >
            <RotateCcw size={14} />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border',
              isPlaying
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
            )}
          >
            {isPlaying ? <><Pause size={12} /> Pausa</> : <><Play size={12} /> Auto</>}
          </button>
          
          <button
            onClick={handleNext}
            disabled={stepIndex >= steps.length - 1}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors border border-zinc-200 bg-white disabled:opacity-40"
            title="Siguiente Paso"
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Velocidad:</span>
          <select
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="px-2.5 py-1 border border-zinc-200 rounded-lg text-xs bg-white text-zinc-600 focus:outline-none"
          >
            <option value={1000}>Lento (1s)</option>
            <option value={600}>Normal (0.6s)</option>
            <option value={250}>Rápido (0.25s)</option>
          </select>
        </div>

        <div className="text-xs font-mono font-bold text-zinc-500">
          Paso {stepIndex + 1} / {steps.length || 1}
        </div>
      </div>

      {/* Fases y Logs de Explicación */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-mono">
              {currentStep.fase || 'Inicial'}
            </span>
            {currentStep.k !== null && (
              <span className={clsx(
                'text-[10px] font-bold px-1.5 py-0.5 rounded font-mono border',
                currentStep.k === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
              )}>
                Flag k = {currentStep.k}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
            {currentStep.nota || 'Cargando animación...'}
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Salida en Pantalla (stdout)</p>
          <div className="terminal-box h-20 text-xs overflow-y-auto font-mono text-[#A6E3A1] bg-[#1E1E2E] rounded-xl p-3 border border-[#313244] whitespace-pre-wrap select-text">
            {currentStep.stdout}
            {stepIndex < steps.length - 1 && <span className="animate-pulse">_</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
