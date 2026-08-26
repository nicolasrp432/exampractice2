import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu, Sparkles, Trophy, Wand2, Flame, Copy, Check, Dumbbell,
  ChevronDown, ChevronUp, ArrowRight, BookOpen, ShieldAlert, Code2,
  Terminal, Zap, CheckCircle2, FileText, Layers, CheckSquare
} from 'lucide-react'
import clsx from 'clsx'
import { getToolById, getToolTrainingExercises, getUniversalTools } from '@/utils/tools'
import { useProgressStore } from '@/store/progressStore'
import SubjectDecoderStudio from '@/components/tools/SubjectDecoderStudio'
import LightningInstinctQuiz from '@/components/tools/LightningInstinctQuiz'
import LogicGym from '@/components/tools/LogicGym'

const TABS = [
  { id: 'tools', label: 'Las 7 Herramientas Universales', icon: Cpu },
  { id: 'decoder', label: 'Decodificador de Subjects', icon: Wand2 },
  { id: 'quiz', label: 'Quiz Relámpago (Entrenar Instinto)', icon: Flame },
  { id: 'gimnasio', label: 'Gimnasio de Punteros y Lógica', icon: Dumbbell },
]

function ToolCard({ tool, open, onToggle }) {
  const training = getToolTrainingExercises(tool.id)
  
  return (
    <motion.div
      layout
      className={clsx(
        'rounded-2xl border bg-white shadow-xs overflow-hidden transition-all',
        open ? 'border-zinc-400 ring-1 ring-zinc-900/5' : 'border-zinc-200 hover:border-zinc-300'
      )}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 text-left flex items-start sm:items-center gap-4 hover:bg-zinc-50/80 transition-colors"
      >
        <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
          {tool.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-zinc-900">{tool.label}</h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {tool.frequency}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>
        <div className="shrink-0 text-zinc-400 ml-2 mt-1 sm:mt-0">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-zinc-100 bg-zinc-50/50"
          >
            <div className="p-5 sm:p-6 grid gap-6 md:grid-cols-2">
              {/* Columna 1: Reconocimiento y Patrones */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                    🎯 Cuándo entra en juego
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
                    {tool.recognition}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    ⚙️ Patrones de Código Idiomáticos
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.patterns.map((pattern) => (
                      <span
                        key={pattern}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 text-emerald-400 font-mono text-xs shadow-2xs"
                      >
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1.5">
                    ⚠️ Trampas Típicas en Examen
                  </span>
                  <ul className="space-y-1.5">
                    {tool.traps.map((trap) => (
                      <li key={trap} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{trap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Columna 2: Ejercicios para entrenar y Regla Mnemotécnica */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    📋 Ejercicios donde se aplica
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                    {training.map((exercise) => (
                      <span
                        key={exercise.id}
                        className="px-2.5 py-1 rounded-lg bg-white text-zinc-800 border border-zinc-200 text-xs font-mono font-medium shadow-2xs"
                      >
                        {exercise.nombre}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1.5">
                    💡 Palabras Clave del Subject
                  </span>
                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-950 space-y-1">
                    <p className="font-semibold">Detectores en el texto:</p>
                    <p className="font-mono text-zinc-700">{tool.subjectHints.join(' · ')}</p>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Didáctico */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-md shrink-0">
            <Cpu size={26} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                Herramientas &amp; Instinto 42
              </h1>
              <span className="rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 border border-amber-200">
                Lectura &amp; Resolución
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-1 max-w-xl">
              Las 7 herramientas universales, decodificador instantáneo de subjects y quiz relámpago para entrenar el instinto antes de abrir el editor.
            </p>
          </div>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 text-xs font-medium self-stretch sm:self-auto overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => selectTab(tab.id)}
                className={clsx(
                  'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
                  active
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800'
                )}
              >
                <Icon size={14} className={active ? 'text-indigo-600' : ''} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenido Dinámico por Pestaña */}
      <div>
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* ─── TAB 1: LAS 7 HERRAMIENTAS UNIVERSALES ─── */}
            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" />
                      El Cinturón de las 7 Herramientas
                    </h2>
                    <span className="text-xs text-zinc-400 font-mono">7 Arquetipos Esenciales</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Todo ejercicio del examen de 42 se resuelve combinando un subconjunto de estas 7 herramientas. Úsalas como filtros mentales inmediatos para saber exactamente qué patrón aplicar en cuanto leas las primeras 3 líneas del enunciado.
                  </p>
                </div>

                <div className="space-y-3">
                  {tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      open={openToolId === tool.id}
                      onToggle={() => setOpenToolId((curr) => (curr === tool.id ? '' : tool.id))}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─── TAB 2: DECODIFICADOR DE SUBJECTS ─── */}
            {activeTab === 'decoder' && (
              <SubjectDecoderStudio />
            )}

            {/* ─── TAB 3: QUIZ RELÁMPAGO ─── */}
            {activeTab === 'quiz' && (
              <LightningInstinctQuiz />
            )}

            {/* ─── TAB 4: GIMNASIO DE LÓGICA ─── */}
            {activeTab === 'gimnasio' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                  <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                    <Dumbbell size={18} className="text-indigo-600" />
                    Gimnasio de Lógica y Micro-Operaciones
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Entrena la traza mental rápida: desplazamiento de punteros en memoria, aritmética ASCII y conmutación de banderas con feedback visual instantáneo.
                  </p>
                </div>
                <LogicGym />
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  )
}
