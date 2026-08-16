import { useState } from 'react'
import { Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

// Simula epur_str paso a paso (bandera k)
function buildEpurSteps(input) {
  const steps = []
  let output = ''
  let k = 0

  for (let i = 0; i < input.length; i++) {
    const c = input[i]
    if (c !== ' ') {
      if (k === 1) {
        output += ' '
        steps.push({ i, char: ' ', action: 'write_space', k: 0, output: output.slice(0, -1), outputAfter: output })
        k = 0
      }
      output += c
      steps.push({ i, char: c, action: 'write_char', k, output: output.slice(0, -1), outputAfter: output })
    } else {
      if (output.length > 0) {
        k = 1
        steps.push({ i, char: c, action: 'flag_up', k: 1, output, outputAfter: output })
      } else {
        steps.push({ i, char: c, action: 'skip_leading', k: 0, output, outputAfter: output })
      }
    }
  }
  steps.push({ i: input.length, char: '\\n', action: 'newline', k: 0, output, outputAfter: output + '\n' })
  return steps
}

const ACTION_INFO = {
  write_char:   { label: c => `✍ Escribir '${c}'`,             color: 'text-green-700'  },
  write_space:  { label: _  => '✍ Escribir espacio (k → 0)',   color: 'text-blue-700'   },
  flag_up:      { label: _  => '🚩 Subir bandera k (hay espacio)', color: 'text-orange-700' },
  skip_leading: { label: _  => '⏭ Saltarse espacio inicial',   color: 'text-zinc-400'   },
  newline:      { label: _  => '✍ Escribir \\n y terminar',    color: 'text-green-700'  },
}

export default function FlagVisualizer({ mode = 'epur' }) {
  const [input, setInput] = useState('hello   world  foo')
  const [steps, setSteps] = useState(null)
  const [stepIdx, setStepIdx] = useState(0)

  function run() {
    const s = buildEpurSteps(input)
    setSteps(s)
    setStepIdx(0)
  }

  const cur = steps?.[stepIdx]

  return (
    <div className="space-y-4">

      {/* Advertencia especial */}
      <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
        <p className="text-sm font-semibold text-orange-800">
          ⚠ epur_str &amp; expand_str — Los que costaron el 50/100
        </p>
        <p className="text-xs text-orange-700 mt-1 leading-relaxed">
          La BANDERA K es obligatoria. <strong>Nunca escribas el espacio al verlo</strong> —
          espera a confirmar que hay algo después. Sin k, los trailing spaces se imprimen.
        </p>
      </div>

      {/* Input + botón */}
      <div className="card p-4 space-y-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono
                       bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder='Escribe un string con espacios...'
          />
          <button onClick={run} className="btn-primary shrink-0">
            <Play size={14} /> Simular
          </button>
        </div>

        {steps && (
          <div className="space-y-4">

            {/* Chars del input con indicador del actual */}
            <div className="overflow-x-auto">
              <div className="flex gap-1.5 pb-1">
                {[...input].map((c, i) => {
                  const isCurrent = cur && i === cur.i
                  const isPast    = cur && i <  cur.i
                  const isSpace   = c === ' '
                  const display   = isSpace ? '␣' : c
                  return (
                    <div key={i} className="flex flex-col items-center gap-0.5 shrink-0">
                      <div className={clsx(
                        'w-9 h-9 flex items-center justify-center rounded-lg border font-mono text-sm font-bold transition-all duration-200',
                        isCurrent ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300 scale-110' :
                        isPast    ? 'bg-zinc-100 border-zinc-200 text-zinc-400' :
                        isSpace   ? 'bg-zinc-50 border-zinc-200 text-zinc-300' :
                                    'bg-white border-zinc-200 text-zinc-800'
                      )}>
                        {display}
                      </div>
                      <span className="text-[10px] text-zinc-300 font-mono">{i}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Panel de estado */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 grid grid-cols-3 gap-4">

              {/* Bandera k */}
              <div className="text-center">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-1">Bandera k</p>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cur?.k}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="text-3xl block"
                  >
                    {cur?.k === 1 ? '🚩' : '🏳️'}
                  </motion.span>
                </AnimatePresence>
                <p className={clsx('text-sm font-bold font-mono mt-1',
                  cur?.k === 1 ? 'text-orange-600' : 'text-zinc-400'
                )}>
                  k = {cur?.k ?? 0}
                </p>
              </div>

              {/* Acción */}
              <div className="text-center col-span-1">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-2">Acción</p>
                <p className={clsx('text-sm font-medium leading-tight',
                  ACTION_INFO[cur?.action]?.color ?? 'text-zinc-500'
                )}>
                  {cur ? ACTION_INFO[cur.action]?.label(cur.char) : '—'}
                </p>
              </div>

              {/* Output */}
              <div className="text-center">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wide mb-2">Output hasta ahora</p>
                <p className="text-sm font-mono font-bold text-zinc-800 bg-white px-2 py-1 rounded border border-zinc-200 break-all">
                  "{cur?.outputAfter ?? ''}"
                </p>
              </div>
            </div>

            {/* Navegación */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStepIdx(i => Math.max(0, i - 1))}
                disabled={stepIdx <= 0}
                className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-30"
              >← Atrás</button>
              <span className="text-xs text-zinc-500">
                Paso {stepIdx + 1} / {steps.length}
              </span>
              <button
                onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                disabled={stepIdx >= steps.length - 1}
                className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-30"
              >Siguiente →</button>
            </div>

            {/* Resultado final */}
            {stepIdx === steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="terminal-box text-xs"
              >
                Resultado: "{cur?.outputAfter?.replace('\n', '\\n')}"
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
