import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

const MODE_LABELS = {
  primero: 'Primera palabra',
  ultimo: 'Última palabra',
  todos: 'Todas las palabras',
  revertir: 'Palabras en orden inverso',
  rotar: 'Rotar palabras',
  epur: 'Limpiar espacios sobrantes',
}

// Extrae palabras con su posición inicial, tratando cualquier run de espacios
// como separador (como hacen los ejercicios de 42).
function tokenize(str) {
  const words = []
  const re = /\S+/g
  let m
  while ((m = re.exec(str)) !== null) words.push({ text: m[0], start: m.index })
  return words
}

function resultFor(mode, words) {
  const texts = words.map((w) => w.text)
  switch (mode) {
    case 'primero':
      return texts[0] ?? ''
    case 'ultimo':
      return texts[texts.length - 1] ?? ''
    case 'revertir':
      return texts.slice().reverse().join(' ')
    case 'rotar':
      return texts.length ? [...texts.slice(1), texts[0]].join(' ') : ''
    case 'epur':
    case 'todos':
    default:
      return texts.join(' ')
  }
}

export default function WordSplitEngine({ config = {} }) {
  const { cadena = ' hola  mundo  foo ', modo = 'primero' } = config

  const words = useMemo(() => tokenize(cadena), [cadena])
  const chars = useMemo(() => String(cadena).split(''), [cadena])

  // Un fotograma por palabra descubierta + fotograma final con el resultado.
  const frames = useMemo(() => {
    const out = words.map((_, idx) => ({ wordIdx: idx, fin: false }))
    out.push({ wordIdx: words.length - 1, fin: true })
    return out.length ? out : [{ wordIdx: -1, fin: true }]
  }, [words])

  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]

  // Qué palabras están resaltadas según el modo
  const highlighted = useMemo(() => {
    if (frame.fin) {
      if (modo === 'primero') return new Set([0])
      if (modo === 'ultimo') return new Set([words.length - 1])
      return new Set(words.map((_, i) => i))
    }
    return new Set([frame.wordIdx])
  }, [frame, modo, words])

  const charInWord = (charIdx) => {
    for (let w = 0; w < words.length; w++) {
      const start = words[w].start
      const end = start + words[w].text.length
      if (charIdx >= start && charIdx < end) return w
    }
    return -1
  }

  const result = frame.fin ? resultFor(modo, words) : ''

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {MODE_LABELS[modo] ?? 'Separar en palabras'}
        </span>
        <span className="text-xs font-mono text-zinc-400">{words.length} palabras</span>
      </div>

      {/* Cadena con espacios visibles */}
      <div className="flex flex-wrap gap-0.5">
        {chars.map((ch, idx) => {
          const w = charInWord(idx)
          const isSpace = ch === ' '
          const active = w >= 0 && highlighted.has(w)
          return (
            <div
              key={idx}
              className={clsx(
                'h-9 w-6 rounded flex items-center justify-center font-mono text-xs border transition-colors',
                isSpace
                  ? 'border-transparent bg-zinc-50 text-zinc-300'
                  : active
                  ? 'border-purple-300 bg-purple-100 text-purple-800'
                  : 'border-zinc-200 bg-white text-zinc-500'
              )}
            >
              {isSpace ? '␣' : ch}
            </div>
          )
        })}
      </div>

      {/* Palabras detectadas */}
      <div className="flex flex-wrap gap-1.5">
        {words.map((w, idx) => (
          <motion.span
            key={idx}
            layout
            className={clsx(
              'px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors',
              highlighted.has(idx)
                ? 'border-purple-300 bg-purple-50 text-purple-800'
                : 'border-zinc-200 bg-zinc-50 text-zinc-400'
            )}
          >
            [{idx}] {w.text}
          </motion.span>
        ))}
      </div>

      {/* Resultado */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">
          {frame.fin ? 'Resultado' : 'Recorriendo…'}
        </p>
        <p className="font-mono text-sm text-zinc-900 break-all">
          {frame.fin ? result || '(vacío)' : `palabra [${frame.wordIdx}] = ${words[frame.wordIdx]?.text ?? ''}`}
        </p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
