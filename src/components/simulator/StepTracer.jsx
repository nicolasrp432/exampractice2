import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, SkipBack } from 'lucide-react'
import clsx from 'clsx'

export default function StepTracer({ steps = [], title = 'Traza de ejecución' }) {
  const [active, setActive] = useState(0)
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [active])

  if (!steps.length) {
    return <p className="text-sm text-zinc-400 text-center py-6">Sin pasos de traza disponibles</p>
  }

  const step = steps[active]

  return (
    <div className="space-y-3">

      {/* Controles de navegación */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActive(0)}
          disabled={active === 0}
          className="btn-secondary px-2 py-1.5 disabled:opacity-30"
        >
          <SkipBack size={14} />
        </button>
        <button
          onClick={() => setActive(a => Math.max(0, a - 1))}
          disabled={active === 0}
          className="btn-secondary px-2 py-1.5 disabled:opacity-30"
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-zinc-600">{title}</span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={clsx(
                  'h-1.5 rounded-full transition-all duration-200',
                  i === active ? 'w-4 bg-zinc-800' : 'w-1.5 bg-zinc-200 hover:bg-zinc-300'
                )}
              />
            ))}
          </div>
          <span className="text-[11px] text-zinc-400">
            Paso {active + 1} de {steps.length}
          </span>
        </div>

        <button
          onClick={() => setActive(a => Math.min(steps.length - 1, a + 1))}
          disabled={active === steps.length - 1}
          className="btn-secondary px-2 py-1.5 disabled:opacity-30"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Lista scrolleable de pasos */}
      <div className="card divide-y divide-zinc-100 max-h-64 overflow-y-auto">
        {steps.map((s, i) => (
          <button
            key={i}
            ref={i === active ? activeRef : null}
            onClick={() => setActive(i)}
            className={clsx(
              'w-full text-left flex items-start gap-3 px-4 py-2.5 transition-colors',
              i === active ? 'bg-blue-50' : 'hover:bg-zinc-50'
            )}
          >
            <span className={clsx(
              'shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5',
              i === active ? 'bg-blue-500 text-white' :
              i < active   ? 'bg-green-100 text-green-600' :
                             'bg-zinc-100 text-zinc-400'
            )}>
              {i < active ? '✓' : i + 1}
            </span>
            <p className={clsx('text-sm truncate', i === active ? 'text-blue-900 font-medium' : 'text-zinc-600')}>
              {s.titulo ?? `Paso ${i + 1}`}
            </p>
          </button>
        ))}
      </div>

      {/* Detalle del paso activo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.15 }}
          className="space-y-2"
        >
          {step.codigo && (
            <pre className="terminal-box text-xs whitespace-pre-wrap leading-relaxed">
              {step.codigo}
            </pre>
          )}

          {step.variables?.length > 0 && (
            <div className="card overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    {['Variable', 'Valor', 'Nota'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-zinc-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {step.variables.map((v, j) => (
                    <tr key={j} className={clsx('transition-colors', v.cambio && 'bg-green-50')}>
                      <td className="px-3 py-2 font-mono font-bold text-zinc-800">{v.nombre}</td>
                      <td className="px-3 py-2 font-mono text-blue-700">{v.valor}</td>
                      <td className="px-3 py-2 text-zinc-500">
                        {v.cambio && <span className="text-green-600 font-semibold mr-1">← cambió</span>}
                        {v.nota}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
