import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

const WIDTH = 8

function toBits(value) {
  const bits = []
  for (let i = WIDTH - 1; i >= 0; i--) bits.push((value >> i) & 1)
  return bits // MSB primero
}

/**
 * Visualiza un byte bit a bit. Modos:
 *  - mostrar: recorre de MSB a LSB imprimiendo cada bit
 *  - revertir: intercambia bit i con bit (7-i)
 *  - swap: intercambia los 4 bits altos con los 4 bajos
 */
export default function BitsEngine({ config = {} }) {
  const { valor = 42, modo = 'mostrar' } = config

  const frames = useMemo(() => {
    const start = toBits(valor)
    const out = []
    if (modo === 'mostrar') {
      for (let i = 0; i < WIDTH; i++) {
        out.push({
          bits: start,
          activo: i,
          nota: `bit ${WIDTH - 1 - i} = ${start[i]} → write('${start[i]}')`,
          salida: start.slice(0, i + 1).join(''),
        })
      }
      return out
    }
    if (modo === 'revertir') {
      const b = start.slice()
      out.push({ bits: b.slice(), activo: null, par: null, nota: 'byte original', salida: b.join('') })
      for (let i = 0; i < WIDTH / 2; i++) {
        const j = WIDTH - 1 - i
        const nb = b.slice()
        ;[nb[i], nb[j]] = [nb[j], nb[i]]
        for (let k = 0; k < WIDTH; k++) b[k] = nb[k]
        out.push({
          bits: nb,
          activo: i,
          par: j,
          nota: `intercambia bit ${WIDTH - 1 - i} ↔ bit ${WIDTH - 1 - j}`,
          salida: nb.join(''),
        })
      }
      return out
    }
    // swap: nibble alto <-> nibble bajo
    out.push({ bits: start, activo: null, nota: 'byte original', salida: start.join('') })
    const swapped = [...start.slice(4), ...start.slice(0, 4)]
    out.push({
      bits: swapped,
      activo: null,
      nota: 'los 4 bits altos y los 4 bajos se intercambian ((n<<4)|(n>>4))',
      salida: swapped.join(''),
      grupo: true,
    })
    return out
  }, [valor, modo])

  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Byte de {valor}
        </span>
        <span className="text-xs font-mono text-zinc-400">valor decimal = {valor}</span>
      </div>

      {/* Bits */}
      <div className="flex gap-1.5 justify-center flex-wrap">
        {frame.bits.map((bit, idx) => {
          const active = frame.activo === idx || frame.par === idx
          const inGroup = frame.grupo
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <motion.div
                layout
                className={clsx(
                  'h-11 w-9 rounded-lg border flex items-center justify-center font-mono text-sm font-bold transition-colors',
                  bit === 1
                    ? 'border-purple-300 bg-purple-100 text-purple-800'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-400',
                  active && 'ring-2 ring-offset-1 ring-amber-400',
                  inGroup && idx < 4 && 'ring-1 ring-sky-300',
                  inGroup && idx >= 4 && 'ring-1 ring-emerald-300'
                )}
              >
                {bit}
              </motion.div>
              <span className="text-[9px] font-mono text-zinc-300">2^{WIDTH - 1 - idx}</span>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 space-y-1">
        <p className="font-mono text-sm text-zinc-800">
          {frame.salida}
          {modo === 'mostrar' && player.step < frames.length - 1 ? '▏' : ''}
        </p>
        <p className="text-xs text-zinc-500">{frame.nota}</p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
