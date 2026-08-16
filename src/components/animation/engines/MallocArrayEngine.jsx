import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

/**
 * Reserva de memoria dinámica: primero se calcula el tamaño, se pide malloc,
 * y luego se rellena celda a celda. Enseña por qué (n+1) o (len) importa.
 */
export default function MallocArrayEngine({ config = {} }) {
  const { longitud = 5, tipo = 'int', valores = null } = config

  const data = useMemo(() => {
    if (Array.isArray(valores) && valores.length) return valores
    return Array.from({ length: longitud }, (_, i) => i + 1)
  }, [valores, longitud])

  const frames = useMemo(() => {
    const out = [
      { fase: 'medir', llenas: 0, nota: `medir cuánto reservar: ${data.length} × sizeof(${tipo})` },
      { fase: 'malloc', llenas: 0, nota: `malloc(${data.length} * sizeof(${tipo})) → bloque vacío` },
    ]
    for (let i = 0; i < data.length; i++) {
      out.push({ fase: 'llenar', llenas: i + 1, actual: i, nota: `arr[${i}] = ${data[i]}` })
    }
    out.push({ fase: 'fin', llenas: data.length, nota: 'bloque listo — recuerda free() al terminar', fin: true })
    return out
  }, [data, tipo])

  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]
  const reserved = frame.fase !== 'medir'

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          malloc de {data.length} {tipo}
        </span>
        <span
          className={clsx(
            'text-xs font-mono px-2 py-0.5 rounded-full',
            reserved ? 'bg-purple-100 text-purple-700' : 'bg-zinc-100 text-zinc-400'
          )}
        >
          {reserved ? 'memoria reservada' : 'sin reservar'}
        </span>
      </div>

      {/* Bloque de memoria */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {data.map((v, idx) => {
          const filled = idx < frame.llenas
          const active = frame.actual === idx
          return (
            <motion.div
              key={idx}
              layout
              animate={{ opacity: reserved ? 1 : 0.2, scale: active ? 1.1 : 1 }}
              className={clsx(
                'flex flex-col items-center gap-1'
              )}
            >
              <div
                className={clsx(
                  'h-12 w-12 rounded-lg border-2 flex items-center justify-center font-mono text-sm font-bold transition-colors',
                  !reserved
                    ? 'border-dashed border-zinc-200 text-zinc-300'
                    : active
                    ? 'border-purple-500 bg-purple-100 text-purple-800'
                    : filled
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-zinc-300 bg-zinc-50 text-zinc-300'
                )}
              >
                {filled ? v : '?'}
              </div>
              <span className="text-[9px] font-mono text-zinc-300">[{idx}]</span>
            </motion.div>
          )
        })}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <p className="font-mono text-sm text-zinc-800">{frame.nota}</p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
