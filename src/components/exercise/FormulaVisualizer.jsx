import { motion } from 'framer-motion'

const stepVariant = (delay) => ({
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.3, ease: 'easeOut' } },
})

export default function FormulaVisualizer({ formulaClave }) {
  if (!formulaClave?.formula) {
    return (
      <div className="py-10 text-center text-zinc-400">
        <p className="text-3xl mb-2">🚧</p>
        <p className="text-sm">Fórmula no disponible todavía</p>
      </div>
    )
  }

  const { descripcion, formula, ejemplo, tablaASCII } = formulaClave

  return (
    <div className="space-y-4">

      {/* Fórmula principal */}
      <motion.div
        className="card p-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {descripcion && (
          <p className="text-xs text-zinc-400 mb-3 uppercase tracking-wide">{descripcion}</p>
        )}
        <p className="text-3xl font-mono font-bold text-zinc-900 tracking-tight">{formula}</p>
      </motion.div>

      {/* Ejemplo animado paso a paso */}
      {ejemplo && (
        <div className="card p-5">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-4">
            Ejemplo paso a paso
          </p>
          <div className="flex items-end gap-3 flex-wrap">
            <motion.div variants={stepVariant(0)} initial="hidden" animate="visible" className="text-center">
              <p className="text-[10px] text-zinc-400 mb-1">Entrada</p>
              <span className="inline-block px-4 py-2.5 rounded-xl font-mono font-bold text-sm
                               bg-blue-50 text-blue-700 border border-blue-200">
                {ejemplo.entrada}
              </span>
            </motion.div>

            <motion.span variants={stepVariant(0.2)} initial="hidden" animate="visible"
              className="text-xl font-bold text-zinc-300 mb-2.5">→</motion.span>

            <motion.div variants={stepVariant(0.4)} initial="hidden" animate="visible" className="text-center">
              <p className="text-[10px] text-zinc-400 mb-1">Cálculo</p>
              <span className="inline-block px-4 py-2.5 rounded-xl font-mono text-sm
                               bg-zinc-50 text-zinc-700 border border-zinc-200">
                {ejemplo.calculo}
              </span>
            </motion.div>

            <motion.span variants={stepVariant(0.6)} initial="hidden" animate="visible"
              className="text-xl font-bold text-zinc-300 mb-2.5">=</motion.span>

            <motion.div variants={stepVariant(0.8)} initial="hidden" animate="visible" className="text-center">
              <p className="text-[10px] text-zinc-400 mb-1">Resultado</p>
              <span className="inline-block px-4 py-2.5 rounded-xl font-mono font-bold text-sm
                               bg-green-50 text-green-700 border border-green-200">
                {ejemplo.resultado}
              </span>
            </motion.div>
          </div>
        </div>
      )}

      {/* Tabla ASCII */}
      {tablaASCII?.length > 0 && (
        <div className="card overflow-hidden">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-4 pt-4 pb-2">
            Valores ASCII clave
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-y border-zinc-100">
                <tr>
                  {['Char', 'ASCII', 'Cálculo', '→ Repeticiones'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {tablaASCII.map((row, i) => (
                  <motion.tr
                    key={row.char}
                    className="hover:bg-zinc-50 transition-colors"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                  >
                    <td className="px-4 py-2.5 font-mono font-bold text-zinc-900 text-base">'{row.char}'</td>
                    <td className="px-4 py-2.5 font-mono text-zinc-500">{row.ascii}</td>
                    <td className="px-4 py-2.5 font-mono text-blue-600">{row.calculo}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full
                                       bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                        {row.repeat}×
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
