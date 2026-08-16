import { useState, useMemo } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, Search, Blocks, Wrench, PenTool, ChevronRight, ChevronLeft,
  Lightbulb, CheckCircle2, RotateCcw, Sparkles,
} from 'lucide-react'
import clsx from 'clsx'
import ParsonsBlock from './ParsonsBlock'
import { simulators } from '@/utils/simulators/index'
import { decodeSubject } from '@/utils/tools'
import { useProgressStore } from '@/store/progressStore'

const STEPS = [
  { id: 'predice', icon: Eye, label: 'Predice', color: 'text-sky-600' },
  { id: 'investiga', icon: Search, label: 'Investiga', color: 'text-purple-600' },
  { id: 'reconstruye', icon: Blocks, label: 'Reconstruye', color: 'text-amber-600' },
  { id: 'modifica', icon: Wrench, label: 'Modifica', color: 'text-orange-600' },
  { id: 'crea', icon: PenTool, label: 'Crea', color: 'text-emerald-600' },
]

// Convierte el código en líneas limpias (sin líneas vacías) para Parsons.
function codeToLines(code = '') {
  return String(code)
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .filter((l) => l.trim().length > 0)
}

function CodeBlock({ code }) {
  return (
    <pre className="rounded-lg border border-zinc-200 bg-zinc-900 text-zinc-100 p-3 overflow-x-auto text-xs font-mono leading-5">
      {code}
    </pre>
  )
}

// ─── Paso 1: Predice ──────────────────────────────────────────────────────────
function StepPredice({ exercise, code }) {
  const [prediction, setPrediction] = useState('')
  const [revealed, setRevealed] = useState(false)

  const test = exercise.tests?.[0]
  const sim = simulators[exercise.id]
  const realOutput = useMemo(() => {
    if (test && sim) {
      try {
        return sim(test.entrada)
      } catch {
        return test.salida ?? '(no disponible)'
      }
    }
    return test?.salida ?? '(no disponible)'
  }, [test, sim])

  return (
    <div className="space-y-4">
      <div className="card p-3 bg-sky-50/50 border-sky-100 flex gap-2">
        <Lightbulb className="text-sky-500 shrink-0" size={18} />
        <p className="text-sm text-zinc-700">
          Lee el código <strong>sin ejecutarlo</strong> y predice qué produce. Trazar mentalmente
          antes de ver el resultado es lo que construye tu modelo de ejecución.
        </p>
      </div>

      <CodeBlock code={code} />

      {test && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-600">
          Entrada: {test.entrada?.length ? JSON.stringify(test.entrada) : '(sin argumentos)'}
        </div>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Tu predicción
        </label>
        <textarea
          value={prediction}
          onChange={(e) => setPrediction(e.target.value)}
          rows={3}
          placeholder="¿Qué imprime o devuelve?"
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <button onClick={() => setRevealed(true)} className="btn-primary">
        <Eye size={14} /> Ver salida real
      </button>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 mb-1">
                Salida real
              </p>
              <pre className="font-mono text-xs text-emerald-900 whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                {realOutput}
              </pre>
              <p className="text-xs text-emerald-700 mt-2">
                ¿Coincidió con tu predicción? Si no, vuelve al código y encuentra dónde se desvió tu
                razonamiento — ahí está el aprendizaje.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Paso 2: Investiga ────────────────────────────────────────────────────────
function StepInvestiga({ lineas, decisiones }) {
  const [openLine, setOpenLine] = useState(null)
  const [openDec, setOpenDec] = useState(null)

  if (!lineas.length) {
    return (
      <p className="text-sm text-zinc-400 text-center py-6">
        El desglose línea por línea de este ejercicio se añadirá próximamente.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card p-3 bg-purple-50/50 border-purple-100 flex gap-2">
        <Search className="text-purple-500 shrink-0" size={18} />
        <p className="text-sm text-zinc-700">
          Toca cada línea para descubrir <strong>por qué está ahí</strong>. No memorices la sintaxis:
          entiende la decisión detrás de cada una.
        </p>
      </div>

      <div className="space-y-1">
        {lineas.map((l, idx) => {
          const open = openLine === idx
          return (
            <div key={idx} className="rounded-lg border border-zinc-200 overflow-hidden">
              <button
                onClick={() => setOpenLine(open ? null : idx)}
                className={clsx(
                  'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
                  open ? 'bg-purple-50' : 'bg-zinc-900 hover:bg-zinc-800'
                )}
              >
                <code
                  className={clsx(
                    'flex-1 font-mono text-xs whitespace-pre-wrap break-all',
                    open ? 'text-purple-900' : 'text-zinc-100'
                  )}
                >
                  {l.codigo}
                </code>
                {l.concepto && (
                  <span
                    className={clsx(
                      'text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase shrink-0',
                      open ? 'bg-purple-200 text-purple-700' : 'bg-zinc-700 text-zinc-300'
                    )}
                  >
                    {l.concepto}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white"
                  >
                    <p className="px-3 py-2.5 text-sm text-zinc-700 border-t border-purple-100">
                      {l.porque}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {decisiones.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Decisiones clave — ¿por qué así y no de otra forma?
          </p>
          {decisiones.map((d, idx) => {
            const open = openDec === idx
            return (
              <div key={idx} className="rounded-lg border border-amber-200 bg-amber-50/60 overflow-hidden">
                <button
                  onClick={() => setOpenDec(open ? null : idx)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left"
                >
                  <Lightbulb size={14} className="text-amber-500 shrink-0" />
                  <span className="flex-1 text-sm font-medium text-amber-900">{d.pregunta}</span>
                  <ChevronRight
                    size={14}
                    className={clsx('text-amber-400 transition-transform', open && 'rotate-90')}
                  />
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden px-3 pb-2.5 text-sm text-amber-800"
                    >
                      {d.respuesta}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Paso 4: Modifica ─────────────────────────────────────────────────────────
function StepModifica({ code, decisiones }) {
  const [value, setValue] = useState(code)
  return (
    <div className="space-y-4">
      <div className="card p-3 bg-orange-50/50 border-orange-100 flex gap-2">
        <Wrench className="text-orange-500 shrink-0" size={18} />
        <p className="text-sm text-zinc-700">
          Parte de la solución y <strong>cámbiale algo</strong>: haz lo contrario, filtra distinto,
          maneja mayúsculas… Al tocar el código descubres qué línea controla cada comportamiento.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <Editor
          height="320px"
          defaultLanguage="c"
          value={value}
          onChange={(v) => setValue(v ?? '')}
          options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, wordWrap: 'on' }}
          theme="vs-dark"
        />
      </div>

      {decisiones.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
            Pistas: qué controla cada decisión
          </p>
          <ul className="space-y-1.5">
            {decisiones.map((d, idx) => (
              <li key={idx} className="text-xs text-zinc-600 flex gap-2">
                <span className="text-orange-400 shrink-0">→</span>
                <span>
                  <span className="font-medium text-zinc-700">{d.pregunta}</span> {d.respuesta}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Paso 5: Crea ─────────────────────────────────────────────────────────────
function StepCrea({ exercise, code, decisiones, datosPuros, onResult }) {
  const [value, setValue] = useState('')
  const [revealed, setRevealed] = useState(false)

  const skeleton = useMemo(() => {
    try {
      return decodeSubject(exercise.subject || '').skeleton || ''
    } catch {
      return ''
    }
  }, [exercise])

  const rubrica = useMemo(() => {
    const items = []
    datosPuros.forEach((dp) => items.push(dp.elemento))
    decisiones.forEach((d) => items.push(d.pregunta.replace(/^¿|\?$/g, '')))
    return items.slice(0, 6)
  }, [datosPuros, decisiones])

  return (
    <div className="space-y-4">
      <div className="card p-3 bg-emerald-50/50 border-emerald-100 flex gap-2">
        <Sparkles className="text-emerald-500 shrink-0" size={18} />
        <p className="text-sm text-zinc-700">
          Escríbelo <strong>desde cero</strong>, solo con el subject en la cabeza. Cuando termines,
          compara con la solución y autoevalúate con honestidad.
        </p>
      </div>

      {skeleton && !value && (
        <button
          onClick={() => setValue(skeleton)}
          className="text-xs text-emerald-700 underline underline-offset-2"
        >
          Empezar desde el esqueleto sugerido
        </button>
      )}

      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <Editor
          height="300px"
          defaultLanguage="c"
          value={value}
          onChange={(v) => setValue(v ?? '')}
          options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, wordWrap: 'on' }}
          theme="vs-dark"
        />
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="btn-primary">
          <Eye size={14} /> Revelar solución y comparar
        </button>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 mb-1">
                Tu código
              </p>
              <CodeBlock code={value || '(vacío)'} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 mb-1">
                Solución recomendada
              </p>
              <CodeBlock code={code} />
            </div>
          </div>

          {rubrica.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
                Rúbrica — ¿tu solución cubre esto?
              </p>
              <ul className="space-y-1">
                {rubrica.map((r, idx) => (
                  <li key={idx} className="text-xs text-zinc-600 flex gap-2 items-start">
                    <span className="text-zinc-300">☐</span>
                    <code className="font-mono">{r}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button onClick={() => onResult(true)} className="btn-primary">
              <CheckCircle2 size={14} /> Lo logré
            </button>
            <button onClick={() => onResult(false)} className="btn-secondary">
              <RotateCcw size={14} /> Necesito repasar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function DojoLadder({ exercise }) {
  const [active, setActive] = useState('predice')
  const registrarIntento = useProgressStore((s) => s.registrarIntento)
  const [feedback, setFeedback] = useState(null)

  const recomendada =
    exercise.versiones?.find((v) => v.recomendada) ?? exercise.versiones?.[0] ?? null
  const code = recomendada?.codigo ?? '// solución no disponible'

  const lineas = exercise.desglose?.lineas ?? []
  const decisiones = exercise.desglose?.decisionesClave ?? []
  const datosPuros = exercise.campayoMetodo?.datosPuros ?? []

  // Para Parsons: usa las líneas del desglose si existen; si no, parte el código.
  const parsonsLines = useMemo(() => {
    if (lineas.length) return lineas.map((l) => l.codigo)
    return codeToLines(code)
  }, [lineas, code])

  const activeIdx = STEPS.findIndex((s) => s.id === active)

  const handleResult = (exito) => {
    registrarIntento(exercise.id, exito)
    setFeedback(exito ? '¡Registrado como dominado! 🎉 Vuelve en unos días para consolidarlo.' : 'Anotado para repaso pronto. La repetición espaciada hará el resto.')
  }

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="card p-3 flex items-start gap-3 bg-zinc-50">
        <span className="text-xl shrink-0">🥋</span>
        <div>
          <p className="text-sm font-semibold text-zinc-800">
            Dojo — de entender a saber programarlo
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Método PRIMM: primero lees y predices, luego investigas el porqué, reconstruyes,
            modificas y por fin lo creas desde cero. No es memorizar: es construir la habilidad.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {STEPS.map((s, idx) => {
          const Icon = s.icon
          const isActive = s.id === active
          const done = idx < activeIdx
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border',
                isActive
                  ? 'bg-white border-zinc-300 shadow-sm text-zinc-900'
                  : done
                  ? 'bg-zinc-50 border-transparent text-zinc-400'
                  : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100'
              )}
            >
              <span className={clsx('text-[10px] font-bold', isActive ? s.color : 'text-zinc-300')}>
                {idx + 1}
              </span>
              <Icon size={14} className={isActive ? s.color : ''} />
              <span>{s.label}</span>
            </button>
          )
        })}
      </div>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {active === 'predice' && <StepPredice exercise={exercise} code={code} />}
          {active === 'investiga' && <StepInvestiga lineas={lineas} decisiones={decisiones} />}
          {active === 'reconstruye' && (
            <div className="space-y-4">
              <div className="card p-3 bg-amber-50/50 border-amber-100 flex gap-2">
                <Blocks className="text-amber-500 shrink-0" size={18} />
                <p className="text-sm text-zinc-700">
                  Las líneas están <strong>desordenadas</strong>. Reconstruye la solución con las
                  flechas. Aprendes la estructura sin la carga de teclear cada carácter.
                </p>
              </div>
              <ParsonsBlock lineas={parsonsLines} />
            </div>
          )}
          {active === 'modifica' && <StepModifica code={code} decisiones={decisiones} />}
          {active === 'crea' && (
            <StepCrea
              exercise={exercise}
              code={code}
              decisiones={decisiones}
              datosPuros={datosPuros}
              onResult={handleResult}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {feedback && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {feedback}
        </div>
      )}

      {/* Navegación */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
        <button
          onClick={() => setActive(STEPS[Math.max(0, activeIdx - 1)].id)}
          disabled={activeIdx === 0}
          className={clsx('btn-secondary', activeIdx === 0 && 'opacity-30 pointer-events-none')}
        >
          <ChevronLeft size={14} /> Anterior
        </button>
        <button
          onClick={() => setActive(STEPS[Math.min(STEPS.length - 1, activeIdx + 1)].id)}
          disabled={activeIdx === STEPS.length - 1}
          className={clsx('btn-primary', activeIdx === STEPS.length - 1 && 'opacity-30 pointer-events-none')}
        >
          Siguiente <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
