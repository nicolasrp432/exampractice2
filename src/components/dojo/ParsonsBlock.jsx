import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, RotateCcw, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

// Baraja de forma determinista-suficiente (Fisher-Yates) evitando el orden correcto.
function shuffle(arr) {
  const a = arr.map((line, i) => ({ line, correct: i }))
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // Si por azar quedó ordenado, empuja el primero al final.
  if (a.every((item, idx) => item.correct === idx) && a.length > 1) {
    a.push(a.shift())
  }
  return a
}

/**
 * Problema de Parsons: el usuario reordena las líneas barajadas hasta
 * reconstruir el orden correcto. Valida y resalta líneas fuera de sitio.
 */
export default function ParsonsBlock({ lineas = [], onSolved }) {
  const [items, setItems] = useState(() => shuffle(lineas))
  const [checked, setChecked] = useState(false)

  const reshuffle = useCallback(() => {
    setItems(shuffle(lineas))
    setChecked(false)
  }, [lineas])

  const move = (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= items.length) return
    const next = items.slice()
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setItems(next)
    setChecked(false)
  }

  const solved = useMemo(() => items.every((item, idx) => item.correct === idx), [items])

  const handleCheck = () => {
    setChecked(true)
    if (solved) onSolved?.()
  }

  if (!lineas.length) {
    return (
      <p className="text-sm text-zinc-400 text-center py-6">
        Este ejercicio aún no tiene líneas para reconstruir.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        {items.map((item, idx) => {
          const wrong = checked && item.correct !== idx
          const right = checked && item.correct === idx
          return (
            <motion.div
              key={item.correct}
              layout
              transition={{ duration: 0.2 }}
              className={clsx(
                'flex items-center gap-2 rounded-lg border px-2 py-1.5',
                right
                  ? 'border-emerald-300 bg-emerald-50'
                  : wrong
                  ? 'border-red-300 bg-red-50'
                  : 'border-zinc-200 bg-white'
              )}
            >
              <div className="flex flex-col">
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className={clsx('text-zinc-400 hover:text-zinc-700', idx === 0 && 'opacity-20')}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === items.length - 1}
                  className={clsx(
                    'text-zinc-400 hover:text-zinc-700',
                    idx === items.length - 1 && 'opacity-20'
                  )}
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <span className="text-[10px] font-mono text-zinc-300 w-5 text-right shrink-0">
                {idx}
              </span>
              <code className="flex-1 font-mono text-xs text-zinc-800 whitespace-pre-wrap break-all">
                {item.line}
              </code>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={handleCheck} className="btn-primary">
          <CheckCircle2 size={14} /> Comprobar orden
        </button>
        <button onClick={reshuffle} className="btn-secondary">
          <RotateCcw size={14} /> Rebarajar
        </button>
        {checked && (
          <span
            className={clsx(
              'text-sm font-semibold',
              solved ? 'text-emerald-600' : 'text-red-500'
            )}
          >
            {solved ? '¡Orden correcto! 🎉' : 'Aún hay líneas fuera de sitio'}
          </span>
        )}
      </div>
    </div>
  )
}
