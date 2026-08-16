import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

// Construye la cadena de llamadas (descenso) y sus valores de retorno (ascenso)
// para cada función recursiva soportada.
function buildCalls(fn, a, b) {
  const calls = []
  if (fn === 'pgcd') {
    let x = a
    let y = b
    while (true) {
      calls.push({ label: `pgcd(${x}, ${y})`, base: y === 0 })
      if (y === 0) break
      ;[x, y] = [y, x % y]
      if (calls.length > 30) break
    }
    const ret = calls[calls.length - 1] ? Number(calls[calls.length - 1].label.match(/pgcd\((\d+)/)[1]) : 0
    calls.forEach((c) => (c.ret = ret))
    return { calls, resultado: `mcd = ${ret}`, tipo: 'MCD por Euclides' }
  }
  if (fn === 'lcm') {
    let x = a
    let y = b
    while (y !== 0 && calls.length < 30) {
      calls.push({ label: `gcd(${x}, ${y})`, base: false })
      ;[x, y] = [y, x % y]
    }
    calls.push({ label: `gcd(${x}, 0)`, base: true })
    const g = x
    const lcm = g ? (a * b) / g : 0
    calls.forEach((c) => (c.ret = g))
    return { calls, resultado: `mcm = ${a}·${b}/${g} = ${lcm}`, tipo: 'MCM vía MCD' }
  }
  if (fn === 'is_power_of_2') {
    let n = a
    while (n > 1 && calls.length < 30) {
      const impar = n % 2 !== 0
      calls.push({ label: `pow2(${n})`, base: false, fallo: impar })
      if (impar) {
        calls.forEach((c) => (c.ret = 'false'))
        return { calls, resultado: `${a} NO es potencia de 2`, tipo: 'Dividir entre 2' }
      }
      n = n / 2
    }
    calls.push({ label: `pow2(${n})`, base: true })
    const ok = n === 1
    calls.forEach((c) => (c.ret = ok ? 'true' : 'false'))
    return {
      calls,
      resultado: ok ? `${a} SÍ es potencia de 2` : `${a} NO es potencia de 2`,
      tipo: 'Dividir entre 2',
    }
  }
  // fprime / add_prime_sum: factorización por divisores crecientes
  let n = a
  let d = 2
  const factores = []
  while (n > 1 && calls.length < 40) {
    if (n % d === 0) {
      calls.push({ label: `${n} ÷ ${d}`, base: false })
      factores.push(d)
      n = n / d
    } else {
      d++
    }
  }
  calls.forEach((c) => (c.ret = factores.join('×')))
  return {
    calls,
    resultado: `factores: ${factores.join(' × ') || a}`,
    tipo: 'Factores primos',
  }
}

export default function RecursionEngine({ config = {} }) {
  const { fn = 'pgcd', a = 48, b = 18 } = config
  const { calls, resultado, tipo } = useMemo(() => buildCalls(fn, a, b), [fn, a, b])

  // Fase descenso (n llamadas) + fase ascenso (n retornos)
  const total = calls.length * 2
  const player = useAnimationPlayer(total)
  const step = player.step

  const descentDepth = Math.min(step + 1, calls.length) // cuántas llamadas visibles
  const ascentResolved = Math.max(0, step - calls.length + 1) // cuántos retornos resueltos

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{tipo}</span>
        <span className="text-xs font-mono text-zinc-400">
          {step < calls.length ? 'bajando (llamadas)' : 'subiendo (retornos)'}
        </span>
      </div>

      {/* Pila de llamadas */}
      <div className="space-y-1.5">
        {calls.map((c, idx) => {
          const visible = idx < descentDepth
          const resolved = idx >= calls.length - ascentResolved
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={visible ? { opacity: 1, x: 0 } : { opacity: 0.15, x: -10 }}
              className={clsx(
                'flex items-center justify-between gap-2 rounded-lg border px-3 py-2 font-mono text-sm',
                c.base
                  ? 'border-emerald-300 bg-emerald-50'
                  : resolved
                  ? 'border-sky-300 bg-sky-50'
                  : 'border-zinc-200 bg-white'
              )}
              style={{ marginLeft: `${idx * 14}px` }}
            >
              <span className="text-zinc-700">
                {c.label}
                {c.base && <span className="ml-2 text-[10px] text-emerald-600 font-sans">caso base</span>}
              </span>
              {resolved && (
                <motion.span
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-0.5 rounded bg-sky-200 text-sky-800 text-xs font-bold"
                >
                  → {c.ret}
                </motion.span>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">Resultado</p>
        <p className="font-mono text-sm text-zinc-900">{resultado}</p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
