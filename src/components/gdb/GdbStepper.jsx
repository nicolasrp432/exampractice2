import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Zap } from 'lucide-react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { normalizeGdbTrace } from '@/utils/gdbTrace'
import StackFrameView from '@/components/viz/StackFrameView'
import PointerArrows from '@/components/viz/PointerArrows'
import ConceptPanel from '@/components/viz/ConceptPanel'

function CodeExcerpt({ code = '', lineNumber = null }) {
  const lines = useMemo(() => {
    return String(code)
      .split('\n')
      .map((line) => {
        const match = line.match(/^\s*(\d+)\t(.*)$/)
        if (match) {
          return { number: Number(match[1]), text: match[2] }
        }
        return { number: null, text: line }
      })
  }, [code])

  if (!code) {
    return <p className="text-sm text-zinc-400">No hay código asociado a este paso.</p>
  }

  return (
    <div className="space-y-0.5 font-mono text-[11px] leading-5">
      {lines.map((line, index) => {
        const active = line.number !== null && line.number === lineNumber
        return (
          <div
            key={`${line.number ?? 'raw'}-${index}`}
            className={clsx(
              'grid grid-cols-[3.5rem_1fr] gap-2 rounded px-2',
              active ? 'bg-purple-50 text-purple-900' : 'text-zinc-500'
            )}
          >
            <span className="text-right select-none">{line.number ?? ''}</span>
            <span className="whitespace-pre-wrap break-words">{line.text || ' '}</span>
          </div>
        )
      })}
    </div>
  )
}

function Section({ title, children, action = null }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <div className="border-b border-zinc-100 bg-zinc-50 px-3 py-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</p>
        {action}
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

function Timeline({ trace, currentStepIndex, onPick }) {
  const fnColors = useMemo(() => {
    const palette = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899']
    const map = new Map()
    let i = 0
    for (const s of trace) {
      const fn = s.functionName || 'main'
      if (!map.has(fn)) { map.set(fn, palette[i % palette.length]); i++ }
    }
    return map
  }, [trace])

  return (
    <div className="mt-3 flex gap-[2px] overflow-x-auto pb-1" data-timeline="ticks">
      {trace.map((step, index) => {
        const isActive = index === currentStepIndex
        const color = fnColors.get(step.functionName || 'main') || '#8b5cf6'
        return (
          <button
            key={step.id}
            onClick={() => onPick(index)}
            title={`#${index + 1} · ${step.functionName} · L${step.lineNumber ?? '?'}`}
            className={clsx(
              'shrink-0 w-2.5 transition-all rounded-sm',
              isActive ? 'h-7' : 'h-4 hover:h-6'
            )}
            style={{
              backgroundColor: isActive ? color : color + '60',
              boxShadow: isActive ? `0 0 0 2px ${color}30` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

export default function GdbStepper({
  steps = [],
  caminos = null,
  title = 'Traza de ejecución',
  exerciseConceptos = [],
  cached = false,
}) {
  const tieneCaminos = Array.isArray(caminos) && caminos.length > 0
  const [caminoIdx, setCaminoIdx] = useState(0)
  const activeSteps = tieneCaminos
    ? (caminos[caminoIdx]?.pasos ?? [])
    : steps

  const trace = useMemo(() => normalizeGdbTrace(activeSteps), [activeSteps])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const stackContainerRef = useRef(null)

  useEffect(() => { setCurrentStepIndex(0); setPlaying(false) }, [caminoIdx])

  useEffect(() => {
    setCurrentStepIndex((index) => Math.min(index, Math.max(trace.length - 1, 0)))
  }, [trace.length])

  const currentStep = trace[currentStepIndex] ?? null

  const handleNext = useCallback(() => {
    setCurrentStepIndex((index) => Math.min(trace.length - 1, index + 1))
  }, [trace.length])

  const handlePrev = useCallback(() => {
    setCurrentStepIndex((index) => Math.max(0, index - 1))
  }, [])

  const handleReset = useCallback(() => {
    setCurrentStepIndex(0)
    setPlaying(false)
  }, [])

  // Auto-play
  useEffect(() => {
    if (!playing) return
    if (currentStepIndex >= trace.length - 1) { setPlaying(false); return }
    const ms = 800 / speed
    const t = setTimeout(() => setCurrentStepIndex(i => i + 1), ms)
    return () => clearTimeout(t)
  }, [playing, currentStepIndex, trace.length, speed])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') handleNext()
      if (event.key === 'ArrowLeft') handlePrev()
      if (event.key === 'Home') handleReset()
      if (event.key === ' ' && event.target === document.body) {
        event.preventDefault()
        setPlaying(p => !p)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, handleReset])

  if (!trace.length) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-500">
        No hay pasos de GDB definidos para este ejercicio.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white min-h-[420px] overflow-hidden">
      {tieneCaminos && caminos.length > 1 && (
        <div className="border-b border-zinc-100 bg-white px-4 py-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 font-semibold uppercase tracking-wide mr-1">Camino GDB</span>
          {caminos.map((c, i) => (
            <button
              key={c.id ?? i}
              onClick={() => setCaminoIdx(i)}
              className={
                'px-2.5 py-1 rounded-md border ' +
                (i === caminoIdx
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50')
              }
              title={c.descripcion}
            >
              {c.nombre || c.id || `Camino ${i + 1}`}
            </button>
          ))}
        </div>
      )}
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="rounded-md border border-zinc-200 bg-white p-1.5 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="Anterior (←)"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === trace.length - 1}
              className="rounded-md border border-zinc-200 bg-white p-1.5 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="Siguiente (→)"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setPlaying(p => !p)}
              className={clsx(
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                playing
                  ? 'border-purple-300 bg-purple-600 text-white'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              )}
              title="Play / pausa (espacio)"
            >
              {playing ? '⏸ Pausa' : '▶ Play'}
            </button>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded-md border border-zinc-200 bg-white px-1.5 py-1 text-xs text-zinc-600"
              title="Velocidad"
            >
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
              <option value={4}>4×</option>
            </select>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              <RotateCcw size={12} />
              Inicio
            </button>
          </div>

          <div className="min-w-0 flex items-center gap-2">
            {cached && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                <Zap size={10} /> cached
              </span>
            )}
            <div>
              <p className="truncate text-sm font-semibold text-zinc-800">{title}</p>
              <p className="text-xs text-zinc-500">
                Paso {currentStepIndex + 1} de {trace.length}
              </p>
            </div>
          </div>
        </div>

        <Timeline trace={trace} currentStepIndex={currentStepIndex} onPick={setCurrentStepIndex} />
      </div>

      <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <Section
            title={currentStep?.title || 'Paso actual'}
            action={
              <span className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-semibold text-zinc-600 normal-case">
                  {currentStep?.functionName || 'main'}
                </span>
                {currentStep?.lineNumber && (
                  <span className="font-mono">L{currentStep.lineNumber}</span>
                )}
              </span>
            }
          >
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <CodeExcerpt code={currentStep?.code} lineNumber={currentStep?.lineNumber} />
            </div>
          </Section>

          <ConceptPanel step={currentStep} exerciseConceptos={exerciseConceptos} />

          {currentStep?.output && (
            <Section title="Salida parcial">
              <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-sm text-zinc-700">
                {currentStep.output}
              </pre>
            </Section>
          )}
        </div>

        <div className="space-y-4">
          <Section title="Stack y memoria">
            <div className="relative" ref={stackContainerRef}>
              <StackFrameView
                steps={trace}
                currentStepIndex={currentStepIndex}
              />
              <PointerArrows
                containerRef={stackContainerRef}
                deps={[currentStepIndex, trace.length]}
                enabled
              />
            </div>
          </Section>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="border-t border-zinc-100 px-4 py-2 text-xs text-zinc-500 flex items-center justify-between"
        >
          <span>
            {currentStep?.lineNumber
              ? `Línea activa: ${currentStep.lineNumber}`
              : 'Sin línea activa detectada.'}
          </span>
          <span className="text-zinc-400">
            ← / →: navegar · Espacio: play/pausa · Home: reiniciar
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
