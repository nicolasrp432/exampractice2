import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import { detectConceptos } from '@/utils/conceptos/detect'
import { conceptos as glossary } from '@/data/conceptos'

export default function ConceptPanel({ step, exerciseConceptos = [] }) {
  const [collapsed, setCollapsed] = useState(false)

  const detected = useMemo(
    () => detectConceptos(step, exerciseConceptos),
    [step, exerciseConceptos]
  )

  if (!detected.length) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3">
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <BookOpen size={13} />
          Sin conceptos detectados en esta línea.
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/30 overflow-hidden">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-50/60 hover:bg-blue-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
          <BookOpen size={13} />
          Conceptos clave en esta línea
          <span className="rounded-full bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[10px]">
            {detected.length}
          </span>
        </span>
        {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="px-3 py-2 space-y-2"
          >
            {detected.map(({ id, hint, source }) => {
              const def = glossary[id]
              if (!def && !hint) return null
              return (
                <div
                  key={id}
                  className={clsx(
                    'rounded-lg border bg-white px-3 py-2',
                    source === 'declarativo' ? 'border-blue-200' : 'border-zinc-200'
                  )}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-sm font-semibold text-zinc-800">
                      {def?.titulo || id}
                    </span>
                    <span
                      className={clsx(
                        'text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full',
                        source === 'declarativo'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-zinc-100 text-zinc-500'
                      )}
                    >
                      {source === 'declarativo' ? 'ejercicio' : 'auto'}
                    </span>
                  </div>
                  {hint && (
                    <p className="text-xs text-zinc-700 mb-1.5">{hint}</p>
                  )}
                  {def?.descripcion && (
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {def.descripcion}
                    </p>
                  )}
                  {def?.ejemplo && (
                    <pre className="mt-1.5 rounded bg-zinc-50 border border-zinc-100 px-2 py-1 font-mono text-[11px] text-zinc-700 whitespace-pre-wrap">
                      {def.ejemplo}
                    </pre>
                  )}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
