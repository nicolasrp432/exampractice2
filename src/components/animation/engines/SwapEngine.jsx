import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

// Intercambio de dos valores usando una variable temporal (o comparación max).
function swapFrames(a, b) {
  return [
    { a, b, temp: null, nota: 'valores iniciales', destacar: null },
    { a, b, temp: a, nota: 'temp = *a  (guardamos a antes de pisarlo)', destacar: 'temp' },
    { a: b, b, temp: a, nota: '*a = *b  (a recibe el valor de b)', destacar: 'a' },
    { a: b, b: a, temp: a, nota: '*b = temp  (b recibe el a original)', destacar: 'b' },
    { a: b, b: a, temp: a, nota: 'intercambio completo', fin: true },
  ]
}

function maxFrames(a, b) {
  const mayor = a >= b ? 'a' : 'b'
  return [
    { a, b, nota: 'dos valores a comparar' },
    { a, b, nota: `¿${a} > ${b}?  →  ${a > b ? 'sí' : 'no'}`, comparar: true },
    { a, b, nota: `el mayor es ${Math.max(a, b)}`, fin: true, mayor },
  ]
}

function Box({ label, value, highlight, tone }) {
  const tones = {
    a: 'border-sky-300 bg-sky-50 text-sky-800',
    b: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    temp: 'border-amber-300 bg-amber-50 text-amber-800',
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-mono text-zinc-400">{label}</span>
      <motion.div
        layout
        animate={{ scale: highlight ? 1.12 : 1 }}
        className={clsx(
          'h-16 w-16 rounded-xl border-2 flex items-center justify-center font-mono text-lg font-bold',
          value == null ? 'border-dashed border-zinc-200 text-zinc-300' : tones[tone],
          highlight && 'ring-2 ring-offset-2 ring-purple-300'
        )}
      >
        {value == null ? '∅' : value}
      </motion.div>
    </div>
  )
}

export default function SwapEngine({ config = {} }) {
  const { a = 42, b = 17, modo = 'swap' } = config
  const frames = useMemo(() => (modo === 'max' ? maxFrames(a, b) : swapFrames(a, b)), [a, b, modo])
  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]

  return (
    <div className="card p-4 space-y-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {modo === 'max' ? 'Encontrar el mayor' : 'Intercambio con variable temporal'}
      </span>

      <div className="flex items-end justify-center gap-6 py-4">
        <Box label="*a" value={frame.a} tone="a" highlight={frame.destacar === 'a' || frame.mayor === 'a'} />
        <Box label="*b" value={frame.b} tone="b" highlight={frame.destacar === 'b' || frame.mayor === 'b'} />
        {modo !== 'max' && (
          <Box label="temp" value={frame.temp} tone="temp" highlight={frame.destacar === 'temp'} />
        )}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <p className="font-mono text-sm text-zinc-800">{frame.nota}</p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
