import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

const MODE_LABELS = {
  contar: 'Contar nodos (size)',
  mapear: 'Aplicar función a cada nodo (foreach)',
  filtrar: 'Eliminar nodos que cumplen (remove_if)',
}

export default function LinkedListEngine({ config = {} }) {
  const { valores = [10, 20, 30, 40, 50], modo = 'contar' } = config

  // Un fotograma por nodo visitado. En filtrar marcamos los pares como eliminados.
  const frames = useMemo(() => {
    const out = []
    let count = 0
    valores.forEach((v, idx) => {
      let accion = ''
      let marcado = false
      if (modo === 'contar') {
        count++
        accion = `count = ${count}`
      } else if (modo === 'mapear') {
        accion = `f(${v}) aplicado`
      } else {
        marcado = v % 2 === 0
        accion = marcado ? `${v} es par → eliminar` : `${v} impar → conservar`
      }
      out.push({ idx, accion, marcado })
    })
    out.push({ idx: valores.length, accion: 'ptr = NULL → fin de la lista', fin: true })
    return out
  }, [valores, modo])

  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]

  const removed = useMemo(() => {
    const set = new Set()
    if (modo === 'filtrar') {
      for (let k = 0; k <= player.step; k++) {
        const f = frames[k]
        if (f && f.marcado) set.add(f.idx)
      }
    }
    return set
  }, [frames, player.step, modo])

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {MODE_LABELS[modo] ?? 'Lista enlazada'}
        </span>
        <span className="text-xs font-mono text-zinc-400">{valores.length} nodos</span>
      </div>

      {/* Nodos + flechas */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 pt-1">
        {valores.map((v, idx) => {
          const active = frame.idx === idx
          const isRemoved = removed.has(idx)
          return (
            <div key={idx} className="flex items-center gap-1 shrink-0">
              <motion.div
                layout
                animate={{ opacity: isRemoved ? 0.3 : 1, scale: active ? 1.08 : 1 }}
                className={clsx(
                  'rounded-lg border-2 px-3 py-2 font-mono text-sm min-w-[52px] text-center transition-colors',
                  isRemoved
                    ? 'border-red-300 bg-red-50 text-red-400 line-through'
                    : active
                    ? 'border-purple-400 bg-purple-50 text-purple-800'
                    : 'border-zinc-300 bg-white text-zinc-700'
                )}
              >
                {v}
              </motion.div>
              <span className="text-zinc-300 text-lg">→</span>
            </div>
          )
        })}
        <div
          className={clsx(
            'rounded-lg border-2 border-dashed px-3 py-2 font-mono text-xs',
            frame.fin ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-zinc-200 text-zinc-400'
          )}
        >
          NULL
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <p className="font-mono text-sm text-zinc-800">{frame.accion}</p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
