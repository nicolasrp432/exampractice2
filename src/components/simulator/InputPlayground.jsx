import { useState, useCallback } from 'react'
import { Play, RotateCcw, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import StringVisualizer from './StringVisualizer'
import { simulators, getDiff } from '@/utils/simulators/index'

function DiffLine({ label, value, color }) {
  return (
    <p className={clsx('text-xs font-mono', color)}>
      <span className="font-semibold">{label}: </span>
      <span className="bg-white/50 px-1 rounded">{JSON.stringify(value)}</span>
    </p>
  )
}

export default function InputPlayground({ exerciseId, tests = [] }) {
  const [input, setInput]           = useState('')
  const [output, setOutput]         = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [running, setRunning]       = useState(false)

  const fn = simulators[exerciseId]

  const runSingle = useCallback(() => {
    if (!fn) { setOutput('⚠ Simulador no disponible para este ejercicio'); return }
    const args = input !== '' ? [input] : []
    setOutput(fn(args))
  }, [fn, input])

  async function runAllTests() {
    if (!fn || !tests.length) return
    setRunning(true)
    setTestResults([])
    const results = []
    for (const t of tests) {
      await new Promise(r => setTimeout(r, 110))
      let out, passed, diff
      try {
        out    = fn(t.entrada)
        passed = out === t.salida
        diff   = passed ? null : getDiff(out, t.salida)
      } catch (err) {
        out    = null
        passed = false
        diff   = null
      }
      results.push({ ...t, out, passed, diff })
      setTestResults([...results])
    }
    setRunning(false)
  }

  const passedCount = testResults?.filter(t => t.passed).length ?? 0
  const allPassed   = testResults && passedCount === testResults.length

  return (
    <div className="space-y-4">

      {/* Input manual */}
      <div className="card p-4 space-y-3">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Probar con entrada personalizada
        </p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runSingle()}
            placeholder='Escribe un string, p.ej. "abc"'
            className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono
                       bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
          <button onClick={runSingle} className="btn-primary shrink-0">
            <Play size={14} /> Ejecutar
          </button>
          <button onClick={() => { setInput(''); setOutput(null) }} className="btn-secondary shrink-0 px-2.5">
            <RotateCcw size={14} />
          </button>
        </div>

        {input.length > 0 && (
          <div>
            <p className="text-[11px] text-zinc-400 mb-1.5">Visualización del string:</p>
            <StringVisualizer str={input} />
          </div>
        )}
      </div>

      {/* Output de la ejecución */}
      <AnimatePresence>
        {output !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card p-4 space-y-2"
          >
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Output</p>
            <div className="terminal-box text-xs">{output}</div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Exacto: {JSON.stringify(output)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tests automáticos */}
      {tests.length > 0 && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Tests Moulinette
              </p>
              {testResults && (
                <span className={clsx(
                  'text-xs font-bold px-2 py-0.5 rounded-full',
                  allPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
                  {passedCount}/{testResults.length}
                </span>
              )}
            </div>
            <button
              onClick={runAllTests}
              disabled={running || !fn}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40 flex items-center gap-1"
            >
              <Zap size={13} />
              {running ? 'Ejecutando...' : 'Correr todos'}
            </button>
          </div>

          <div className="space-y-2">
            {tests.map((t, i) => {
              const r = testResults?.[i]
              return (
                <motion.div
                  key={t.id}
                  layout
                  className={clsx(
                    'flex items-start gap-3 p-3 rounded-lg border text-sm transition-colors',
                    r
                      ? r.passed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                      : 'bg-zinc-50 border-zinc-100'
                  )}
                >
                  <span className="text-lg shrink-0 mt-0.5 leading-none">
                    {r ? (r.passed ? '✅' : '❌') : '⭕'}
                  </span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs font-medium text-zinc-700">{t.descripcion}</p>
                    <p className="text-xs font-mono text-zinc-400">
                      args: {JSON.stringify(t.entrada)}
                    </p>
                    {r && !r.passed && r.out !== null && (
                      <div className="mt-1.5 p-2 rounded bg-white/70 space-y-0.5">
                        <DiffLine label="esperado" value={t.salida} color="text-green-700" />
                        <DiffLine label="obtenido" value={r.out}    color="text-red-600"   />
                        {r.diff && (
                          <p className="text-[10px] text-orange-600 font-mono">
                            primer diff en posición {r.diff.position}: esperado {r.diff.expected}, obtenido {r.diff.got}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {t.tipo === 'edge' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 shrink-0 mt-0.5">
                      edge
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>

          {allPassed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-3"
            >
              <p className="text-2xl">🎉</p>
              <p className="text-sm font-semibold text-green-700 mt-1">¡Todos los tests pasan!</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
