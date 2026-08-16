import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Cpu, Sparkles, Trophy, CheckCircle2, XCircle, RotateCcw, Wand2, Flame, Copy, Check, Dumbbell } from 'lucide-react'
import clsx from 'clsx'
import { buildQuizQuestions, decodeSubject, getToolById, getToolTrainingExercises, getUniversalTools } from '@/utils/tools'
import { useProgressStore } from '@/store/progressStore'
import LogicGym from '@/components/tools/LogicGym'

const TABS = [
  { id: 'tools', label: 'Las 7 Herramientas', icon: Cpu },
  { id: 'decoder', label: 'Decodificador de Subjects', icon: Wand2 },
  { id: 'quiz', label: 'Quiz Relámpago', icon: Flame },
  { id: 'gimnasio', label: 'Gimnasio de Lógica', icon: Dumbbell },
]

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm sm:text-base text-zinc-500 max-w-3xl">{subtitle}</p> : null}
    </div>
  )
}

function ToolCard({ tool, open, onToggle }) {
  const training = getToolTrainingExercises(tool.id)
  return (
    <motion.div layout className={clsx('rounded-3xl border bg-white shadow-sm overflow-hidden', open ? 'border-zinc-300' : 'border-zinc-200')}>
      <button onClick={onToggle} className="w-full px-5 py-4 text-left flex items-center gap-4 hover:bg-zinc-50 transition-colors">
        <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-2xl shrink-0">{tool.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-zinc-900">{tool.label}</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{tool.frequency}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{tool.description}</p>
        </div>
        {open ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5 pt-1 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Cuándo entra</p>
                  <p className="mt-1 text-sm text-zinc-700">{tool.recognition}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Patrones</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tool.patterns.map((pattern) => (
                      <span key={pattern} className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-mono">{pattern}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Trampas</p>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-700">
                    {tool.traps.map((trap) => <li key={trap} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />{trap}</li>)}
                  </ul>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Ejercicios para entrenar</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {training.map((exercise) => (
                      <span key={exercise.id} className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 text-xs font-medium">{exercise.nombre}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Reglas rápidas</p>
                  <div className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                    <p>{tool.tools.map((t) => getToolById(t)?.label).filter(Boolean).join(' + ') || tool.label}</p>
                    <p className="mt-2 text-zinc-500">{tool.subjectHints.join(' · ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DecoderPanel() {
  const [subject, setSubject] = useState('Write a program that trims duplicate spaces from argv and prints the first word')
  const decoded = useMemo(() => decodeSubject(subject), [subject])
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!decoded.skeleton) return
    navigator.clipboard.writeText(decoded.skeleton).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Subject en inglés</p>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            rows={6}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['argc', 'strings', 'ascii', 'bandera', 'recursion', 'bits', 'malloc'].map((hint) => (
            <button key={hint} onClick={() => setSubject((prev) => `${prev} ${hint}`.trim())} className="px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-600 hover:border-sky-300 hover:text-sky-700 transition-colors">
              + {hint}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Herramientas detectadas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {decoded.toolIds.length ? decoded.toolIds.map((id) => {
                const tool = getToolById(id)
                return <span key={id} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">{tool?.emoji} {tool?.label}</span>
              }) : <span className="text-sm text-zinc-500">Ninguna todavía.</span>}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Keywords capturadas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {decoded.keywords.length ? decoded.keywords.map((keyword) => (
                <span key={keyword} className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-mono">{keyword}</span>
              )) : <span className="text-sm text-zinc-500">Escribe más texto para afinar.</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="border-b border-zinc-200 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Skeleton sugerido</p>
            <p className="text-sm text-zinc-600">Pega esto en el editor y ajusta la lógica.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg transition-colors"
              title="Copiar código"
            >
              {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <Sparkles className="text-sky-500 shrink-0" size={18} />
          </div>
        </div>
        <div className="flex-1 min-h-[420px]">
          <Editor
            height="100%"
            defaultLanguage="c"
            value={decoded.skeleton}
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, lineNumbers: 'on', wordWrap: 'on' }}
            theme="vs-light"
          />
        </div>
        <div className="p-5 border-t border-zinc-200 bg-zinc-50">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Ejercicios similares</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {decoded.similarExercises.map((exercise) => (
              <span key={exercise.id} className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-700">{exercise.nombre}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizPanel() {
  const quiz = useMemo(() => buildQuizQuestions(), [])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const current = quiz[index]

  useEffect(() => {
    setPicked(null)
    setDone(false)
  }, [index])

  const handlePick = (optionIndex) => {
    if (picked !== null) return
    setPicked(optionIndex)
    if (optionIndex === current.correctIndex) setScore((s) => s + 1)
  }

  const next = () => {
    if (index === quiz.length - 1) {
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
  }

  const reset = () => {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <Trophy className="mx-auto text-amber-500" size={44} />
        <h3 className="mt-4 text-2xl font-black text-zinc-900">Resultado final</h3>
        <p className="mt-2 text-zinc-500">Marcaste {score}/{quiz.length}.</p>
        <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800">
          <RotateCcw size={16} /> Repetir
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm font-semibold text-zinc-500">
        <span>Pregunta {index + 1}/{quiz.length}</span>
        <span>Score {score}</span>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-bold text-zinc-900">{current.prompt}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {current.options.map((option, optionIndex) => {
            const correct = optionIndex === current.correctIndex
            const selected = picked === optionIndex
            const showState = picked !== null
            return (
              <button
                key={option.id}
                onClick={() => handlePick(optionIndex)}
                className={clsx(
                  'rounded-2xl border px-4 py-4 text-left transition-all',
                  showState && correct ? 'border-green-300 bg-green-50' :
                  showState && selected && !correct ? 'border-red-300 bg-red-50' :
                  'border-zinc-200 bg-zinc-50 hover:border-sky-300 hover:bg-sky-50'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-zinc-900">{option.emoji} {option.label}</span>
                  {showState && correct ? <CheckCircle2 className="text-green-600" size={18} /> : null}
                  {showState && selected && !correct ? <XCircle className="text-red-600" size={18} /> : null}
                </div>
              </button>
            )
          })}
        </div>

        {picked !== null && (
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            <p className="font-semibold text-zinc-900">{picked === current.correctIndex ? 'Correcto.' : 'No.'}</p>
            <p className="mt-1">{current.explanation}</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={reset} className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">Reset</button>
          <button onClick={next} disabled={picked === null} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
            {index === quiz.length - 1 ? 'Terminar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Tools() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'tools')
  const [openToolId, setOpenToolId] = useState('strings')
  const ejerciciosDominados = useProgressStore((s) => s.getTotalDominados())
  const tools = useMemo(() => getUniversalTools(), [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tab !== activeTab) setActiveTab(tab)
  }, [searchParams, activeTab])

  const selectTab = (tab) => {
    setActiveTab(tab)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('tab', tab)
      return next
    }, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-500">Prompt 12</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl">Tools</h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-600">
                Las 7 herramientas universales, un decodificador de subjects y un quiz relámpago para entrenar el instinto antes de abrir el editor.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="text-zinc-400 font-semibold uppercase tracking-wide text-[11px]">Herramientas</div>
                <div className="mt-1 text-xl font-black text-zinc-900">7</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="text-zinc-400 font-semibold uppercase tracking-wide text-[11px]">Dominados</div>
                <div className="mt-1 text-xl font-black text-zinc-900">{ejerciciosDominados}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 rounded-full border border-zinc-200 bg-white p-2 shadow-sm flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => selectTab(tab.id)} className={clsx('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors', active ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100')}>
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.section
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'tools' && (
                <div>
                  <SectionTitle title="Las 7 herramientas" subtitle="Úsalas como filtros mentales: no resuelven todo, pero reducen el espacio de búsqueda en segundos." />
                  <div className="space-y-4">
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} open={openToolId === tool.id} onToggle={() => setOpenToolId((current) => (current === tool.id ? '' : tool.id))} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'decoder' && (
                <div>
                  <SectionTitle title="Decodificador de Subjects" subtitle="Pega el subject y mira qué herramientas entran, qué ejercicios lo entrenan y cuál sería el esqueleto inicial." />
                  <DecoderPanel />
                </div>
              )}

              {activeTab === 'quiz' && (
                <div>
                  <SectionTitle title="Quiz relámpago" subtitle="Lee el subject, identifica la herramienta y responde sin pensar de más. Ritmo corto, repetición alta." />
                  <QuizPanel />
                </div>
              )}

              {activeTab === 'gimnasio' && (
                <div>
                  <SectionTitle title="Gimnasio de Lógica" subtitle="Entrena tus bases de punteros, aritmética ASCII y seguimiento de banderas de forma visual y didáctica." />
                  <LogicGym />
                </div>
              )}
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
