import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

/**
 * Conversión de una base a otra por divisiones sucesivas.
 * Muestra: valor / base = cociente, resto → dígito (de derecha a izquierda).
 */
export default function BaseConvertEngine({ config = {} }) {
  const { valor = 255, desdeBase = 10, hastaBase = 16 } = config

  const frames = useMemo(() => {
    const out = []
    let n = Math.abs(valor)
    const digitos = []
    if (n === 0) {
      out.push({ actual: 0, cociente: 0, resto: 0, digito: '0', acumulado: '0' })
      return out
    }
    while (n > 0) {
      const resto = n % hastaBase
      const cociente = Math.floor(n / hastaBase)
      const digito = DIGITS[resto]
      digitos.unshift(digito)
      out.push({
        actual: n,
        cociente,
        resto,
        digito,
        acumulado: digitos.join(''),
      })
      n = cociente
    }
    return out
  }, [valor, hastaBase])

  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {valor} (base {desdeBase}) → base {hastaBase}
        </span>
        <span className="text-xs font-mono text-zinc-400">
          divisiones sucesivas entre {hastaBase}
        </span>
      </div>

      {/* Tabla de divisiones */}
      <div className="space-y-1.5">
        {frames.map((f, idx) => {
          const revealed = idx <= player.step
          const active = idx === player.step
          return (
            <motion.div
              key={idx}
              layout
              className={clsx(
                'grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm transition-all',
                active
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-zinc-200 bg-white',
                !revealed && 'opacity-25'
              )}
            >
              <span className="text-zinc-700">
                {f.actual} ÷ {hastaBase} = {f.cociente}
              </span>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded font-bold',
                  active ? 'bg-purple-200 text-purple-800' : 'bg-zinc-100 text-zinc-600'
                )}
              >
                resto {f.resto} → '{f.digito}'
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Resultado */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">
          Resultado (se lee de abajo hacia arriba)
        </p>
        <p className="font-mono text-lg text-zinc-900 font-bold tracking-wider">
          {frame.acumulado}
          {hastaBase === 16 ? ' (hex)' : hastaBase === 2 ? ' (bin)' : ''}
        </p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
