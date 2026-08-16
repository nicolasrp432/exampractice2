import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

/**
 * Contador con condiciones coloreadas. Para cada número desde..hasta se evalúan
 * las condiciones (módulo) en orden; la primera que casa decide etiqueta y color.
 */
export default function CounterEngine({ config = {} }) {
  const { desde = 1, hasta = 20, condiciones = [] } = config

  const items = useMemo(() => {
    const arr = []
    for (let n = desde; n <= hasta; n++) {
      const cond = condiciones.find((c) => n % c.modulo === 0)
      arr.push({
        n,
        label: cond ? cond.label : String(n),
        color: cond ? cond.color : null,
        regla: cond ? `${n} % ${cond.modulo} == 0` : 'ninguna condición → imprime el número',
      })
    }
    return arr
  }, [desde, hasta, condiciones])

  const player = useAnimationPlayer(items.length)
  const current = items[player.step] ?? items[0]

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Contador {desde} → {hasta}
        </span>
        {condiciones.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {condiciones.map((c) => (
              <span
                key={c.modulo}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border"
                style={{ color: c.color, borderColor: c.color, backgroundColor: `${c.color}14` }}
              >
                %{c.modulo} → {c.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Grid de números */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
        {items.map((it, idx) => {
          const active = idx === player.step
          const revealed = idx <= player.step
          return (
            <motion.div
              key={it.n}
              layout
              className={clsx(
                'h-10 rounded-lg border flex items-center justify-center text-xs font-mono font-semibold transition-all',
                active && 'ring-2 ring-offset-1 ring-purple-400 scale-105',
                !revealed && 'opacity-30'
              )}
              style={
                revealed && it.color
                  ? { color: it.color, borderColor: it.color, backgroundColor: `${it.color}14` }
                  : { borderColor: '#e4e4e7', backgroundColor: '#fff', color: '#3f3f46' }
              }
              title={`${it.n} → ${it.label}`}
            >
              {revealed ? (it.label.length > 5 ? it.label.slice(0, 4) + '…' : it.label) : it.n}
            </motion.div>
          )
        })}
      </div>

      {/* Foco del número actual */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 flex items-center gap-3">
        <div
          className="h-12 min-w-12 px-2 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
          style={
            current.color
              ? { color: current.color, backgroundColor: `${current.color}1f` }
              : { color: '#3f3f46', backgroundColor: '#f4f4f5' }
          }
        >
          {current.label}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-zinc-800 font-mono">n = {current.n}</p>
          <p className="text-xs text-zinc-500">{current.regla}</p>
        </div>
      </div>

      <PlayerControls player={player} stepLabel={`n = ${current.n}`} />
    </div>
  )
}
