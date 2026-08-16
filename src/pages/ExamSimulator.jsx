import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, CheckCircle2, XCircle, Clock3, Flag, SkipForward, Send } from 'lucide-react'
import clsx from 'clsx'
import { allExercises } from '@/data/index'
import { runTests } from '@/utils/simulators/index'
import { buildExamPlan, getExamNavigationItems, summarizeExamResults } from '@/utils/exam'
import { useProgressStore } from '@/store/progressStore'
import { useSettingsStore } from '@/store/settingsStore'

const DURATIONS = [
  { value: 30, label: '30 min' },
  { value: 60, label: '1 h' },
  { value: 180, label: '3 h' },
]

const DEFAULT_CONFIG = {
  levels: [1, 2, 3, 4],
  durationMinutes: 30,
  showHints: false,
}

function getPlaceholder() {
  return `#include <unistd.h>\n\nint main(int ac, char **av)\n{\n\t(void)ac;\n\t(void)av;\n\treturn (0);\n}\n`
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function ExamTestRow({ test }) {
  return (
    <div className={clsx('rounded-xl border px-4 py-3 text-sm', test.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50')}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-zinc-800">{test.descripcion || test.id}</span>
        {test.passed ? <CheckCircle2 size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-600" />}
      </div>
    </div>
  )
}

function ExamConfig({ config, onChange, onStart }) {
  return (
    <div className="card p-6 space-y-6 max-w-4xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Simulador de examen</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900">Examen aleatorio</h1>
        <p className="mt-2 text-sm text-zinc-500">Selecciona niveles, tiempo y si quieres pistas. Después de empezar, el modo concentración oculta todo lo demás.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Niveles</p>
          <div className="mt-3 space-y-2">
            {[1, 2, 3, 4].map((level) => (
              <label key={level} className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={config.levels.includes(level)}
                  onChange={() => onChange({ ...config, levels: config.levels.includes(level) ? config.levels.filter((n) => n !== level) : [...config.levels, level].sort() })}
                />
                Nivel {level}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Duración</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DURATIONS.map((duration) => (
              <button
                key={duration.value}
                onClick={() => onChange({ ...config, durationMinutes: duration.value })}
                className={clsx('rounded-full px-4 py-2 text-sm font-semibold border transition-colors', config.durationMinutes === duration.value ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50')}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Modo</p>
          <label className="mt-3 flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={config.showHints}
              onChange={(e) => onChange({ ...config, showHints: e.target.checked })}
            />
            Con pistas
          </label>
        </div>
      </div>

      <button onClick={onStart} disabled={config.levels.length === 0} className="btn-primary disabled:opacity-40">
        <Play size={16} /> Comenzar examen
      </button>
    </div>
  )
}

function ExamActive({ session, onSubmit, onSkip, onFinish, showHints }) {
  const progress = session.timeLeftSeconds / session.totalSeconds
  const current = session.currentExercise

  return (
    <div className="fixed inset-0 z-40 bg-[#FAFAFA]">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-secondary">
              <ArrowLeft size={16} /> Inicio
            </Link>
            <div
              className={clsx(
                'rounded-full border px-3 py-1 text-sm font-mono transition-colors duration-500',
                session.timeLeftSeconds < 300
                  ? 'border-red-300 bg-red-50 text-red-700 animate-pulse'
                  : session.timeLeftSeconds < 600
                  ? 'border-orange-200 bg-orange-50 text-orange-700'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700'
              )}
            >
              {formatTime(session.timeLeftSeconds)}
            </div>
          </div>

          <button onClick={onFinish} className="btn-secondary">
            <Flag size={16} /> Terminar
          </button>
        </header>

        <div className="border-b border-zinc-200 bg-white px-4 py-2 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            {getExamNavigationItems().map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-b border-zinc-200 bg-white px-4 sm:px-6">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
            <motion.div className="h-full rounded-full bg-zinc-900" animate={{ width: `${Math.max(progress, 0) * 100}%` }} transition={{ duration: 0.2 }} />
          </div>
        </div>

        <main className="flex-1 overflow-hidden p-4 sm:p-6">
          <div className="grid h-full gap-4 lg:grid-cols-[1fr_380px]">
            <div className="flex min-w-0 flex-col gap-4">
              <div className="card flex-1 min-h-0 p-4 sm:p-6">
                <div className="terminal-box text-base sm:text-lg whitespace-pre-wrap">
                  {current?.subject || 'Sin subject'}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                  <Clock3 size={14} /> Nivel {current?.nivel} · {current?.dificultad}
                </div>
                {showHints ? <p className="mt-3 text-xs text-amber-600">Pistas activadas para este simulacro.</p> : null}
              </div>

              <div className="card min-h-[320px] overflow-hidden">
                <Editor
                  height="320px"
                  language="c"
                  theme="vs"
                  value={session.code}
                  onChange={session.setCode}
                  options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 13, wordWrap: 'off', tabSize: 4, insertSpaces: false }}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={onSubmit} className="btn-primary">
                  <Send size={16} /> Enviar solución
                </button>
                <button onClick={onSkip} className="btn-secondary">
                  <SkipForward size={16} /> Saltar ejercicio
                </button>
                <button onClick={onFinish} className="btn-secondary">
                  <Flag size={16} /> Terminar examen
                </button>
              </div>
            </div>

            <aside className="card flex min-h-0 flex-col overflow-hidden">
              <div className="border-b border-zinc-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Tests Moulinette</p>
                <p className="mt-1 text-sm text-zinc-500">Corre en silencio y marca el avance por ejercicio.</p>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {session.currentRun.map((test) => <ExamTestRow key={test.id} test={test} />)}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

function ExamSummary({ summary, onStudyFailed, onRepeat, onHome }) {
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
      <div className="card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Resumen del examen</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900">Examen completado</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Stat label="Ejercicios completados" value={`${summary.completedExercises}/${summary.totalExercises}`} />
          <Stat label="Tests pasados" value={`${summary.scorePct}%`} />
          <Stat label="Fallidos" value={summary.failedExercises.length} />
          <Stat label="Tiempo total" value={formatTime(summary.totalSeconds)} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-zinc-900">Ejercicios fallidos</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.failedExercises.length ? summary.failedExercises.map((id) => <span key={id} className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700">{id}</span>) : <span className="text-sm text-zinc-500">Ninguno.</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onStudyFailed} className="btn-primary">Estudiar ejercicios fallidos</button>
        <button onClick={onRepeat} className="btn-secondary">Repetir examen</button>
        <button onClick={onHome} className="btn-secondary">Volver al inicio</button>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-zinc-900">{value}</p>
    </div>
  )
}

export default function ExamSimulator() {
  const navigate = useNavigate()
  const showHintsPreference = useSettingsStore((s) => s.mostrarPistas)
  const guardarExamen = useProgressStore((s) => s.guardarExamen)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [status, setStatus] = useState('config')
  const [session, setSession] = useState(null)
  const [summary, setSummary] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef(null)
  const advanceRef = useRef(null)

  const startExam = () => {
    const plan = buildExamPlan(allExercises, config.levels, Math.random, config.durationMinutes)
    const initialExercise = plan.exercises[0] ?? null

    setSession({
      plan,
      index: 0,
      currentExercise: initialExercise,
      code: getPlaceholder(),
      setCode: (value) => setSession((current) => current ? { ...current, code: value ?? '' } : current),
      currentRun: [],
      results: [],
      timeLeftSeconds: config.durationMinutes * 60,
      totalSeconds: config.durationMinutes * 60,
    })
    setStatus('active')
  }

  const recordResult = (result) => {
    setSession((current) => {
      if (!current) return current
      const nextResults = [...current.results, result]
      const nextIndex = current.index + 1
      const nextExercise = current.plan.exercises[nextIndex] ?? null

      return {
        ...current,
        index: nextIndex,
        currentExercise: nextExercise,
        code: getPlaceholder(),
        currentRun: [],
        results: nextResults,
      }
    })
  }

  const queueAdvance = (result, delay = 900) => {
    window.clearTimeout(advanceRef.current)
    setTransitioning(true)
    advanceRef.current = window.setTimeout(() => {
      recordResult(result)
      setTransitioning(false)
    }, delay)
  }

  const finishExam = (forcedResults) => {
    const current = session
    if (!current) return

    const finalResults = forcedResults ?? current.results
    const computed = summarizeExamResults(finalResults)
    const payload = {
      timestamp: new Date().toISOString(),
      levels: config.levels,
      durationMinutes: config.durationMinutes,
      showHints: config.showHints,
      ...computed,
      totalSeconds: current.totalSeconds - current.timeLeftSeconds,
    }

    guardarExamen(payload)
    setSummary(payload)
    setStatus('summary')
  }

  const submitCurrent = () => {
    if (!session?.currentExercise) return
    const run = runTests(session.currentExercise)
    setSession((current) => current ? { ...current, currentRun: run } : current)
    const passedTests = run.filter((test) => test.passed).length
    const totalTests = run.length
    const passed = passedTests === totalTests

    queueAdvance({
      id: session.currentExercise.id,
      nombre: session.currentExercise.nombre,
      nivel: session.currentExercise.nivel,
      passedTests,
      totalTests,
      elapsedSeconds: config.durationMinutes * 60 - session.timeLeftSeconds,
      passed,
      status: 'completed',
    })
  }

  const skipCurrent = () => {
    if (!session?.currentExercise) return
    queueAdvance({
      id: session.currentExercise.id,
      nombre: session.currentExercise.nombre,
      nivel: session.currentExercise.nivel,
      passedTests: 0,
      totalTests: session.currentExercise.tests?.length ?? 0,
      elapsedSeconds: config.durationMinutes * 60 - session.timeLeftSeconds,
      passed: false,
      status: 'skipped',
    })
  }

  useEffect(() => {
    if (status !== 'active' || !session) return
    timerRef.current = window.setInterval(() => {
      setSession((current) => {
        if (!current) return current
        const next = Math.max(current.timeLeftSeconds - 1, 0)
        if (next === 0) {
          window.clearInterval(timerRef.current)
          queueMicrotask(() => finishExam(current.results))
        }
        return { ...current, timeLeftSeconds: next }
      })
    }, 1000)

    return () => window.clearInterval(timerRef.current)
  }, [status, session])

  useEffect(() => {
    if (status !== 'active' || !session) return
    if (session.results.length >= session.plan.exercises.length && session.plan.exercises.length > 0) {
      finishExam(session.results)
    }
  }, [session, status])

  useEffect(() => () => {
    window.clearTimeout(advanceRef.current)
    window.clearInterval(timerRef.current)
  }, [])

  if (status === 'summary' && summary) {
    return (
      <ExamSummary
        summary={summary}
        onStudyFailed={() => navigate('/progreso')}
        onRepeat={() => {
          setStatus('config')
          setSession(null)
          setSummary(null)
        }}
        onHome={() => navigate('/')}
      />
    )
  }

  if (status === 'active' && session) {
    return (
        <ExamActive
          session={{ ...session, currentRun: session.currentRun, currentExercise: session.currentExercise }}
          onSubmit={submitCurrent}
          onSkip={skipCurrent}
          onFinish={() => finishExam(session.results)}
          showHints={(config.showHints && showHintsPreference) || transitioning}
        />
      )
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <ExamConfig config={config} onChange={setConfig} onStart={startExam} />
    </div>
  )
}
