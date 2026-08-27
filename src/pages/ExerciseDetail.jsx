import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Play, ClipboardList,
  Gamepad2, Microscope, Shuffle, Trophy, Trash2, Copy, Check, Brain,
  Swords, Sparkles,
} from 'lucide-react'
import clsx from 'clsx'
import { getExercise, getPrevExercise, getNextExercise } from '@/data/index'
import { useProgressStore } from '@/store/progressStore'
import { useUserVariants } from '@/hooks/useUserVariants'
import LevelBadge from '@/components/layout/LevelBadge'
import SubjectViewer from '@/components/exercise/SubjectViewer'
import StoryCard from '@/components/exercise/StoryCard'
import CodeViewer from '@/components/exercise/CodeViewer'
import TrapsList from '@/components/exercise/TrapsList'
import ImageGenerator from '@/components/exercise/ImageGenerator'
import CampayoMethodCard from '@/components/exercise/CampayoMethodCard'
import InputPlayground from '@/components/simulator/InputPlayground'
import LogicAnimator from '@/components/simulator/LogicAnimator'
import GdbStepper from '@/components/gdb/GdbStepper'
import DojoLadder from '@/components/dojo/DojoLadder'
import AlgorithmThinkingGuide from '@/components/exercise/AlgorithmThinkingGuide'
import Exercise3DDojo from '@/components/three/Exercise3DDojo'

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'subject',   icon: ClipboardList, label: 'Subject'                },
  { id: 'logica',    icon: Brain,         label: 'Lógica & 3D'            },
  { id: 'historia',  icon: Sparkles,      label: 'Mnemotecnia & Palacio'  },
  { id: 'dojo',      icon: Swords,        label: 'Dojo'                   },
  { id: 'simulador', icon: Gamepad2,      label: 'Simulador'              },
  { id: 'gdb',       icon: Microscope,    label: 'GDB'                    },
  { id: 'variantes', icon: Shuffle,       label: 'Soluciones'             },
  { id: 'pruebate',  icon: Trophy,        label: 'Pruébate'               },
]

const STATUS_CONFIG = {
  dominado:    { label: 'Dominado',    bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200'  },
  practicando: { label: 'Practicando', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  estudiando:  { label: 'Estudiando',  bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200'   },
  no_iniciado: { label: 'Sin iniciar', bg: 'bg-zinc-100',   text: 'text-zinc-500',   border: 'border-zinc-200'   },
}

// ─── Sub-componentes de tabs ──────────────────────────────────────────────────

function TabSubject({ exercise }) {
  // Subject toggle: si el ejercicio expone subjectAlternativo, ofrecemos
  // alternar entre la variante didáctica y la del examen real.
  const [variant, setVariant] = useState('default')   // 'default' | 'alternativo' | 'real'
  const hasAlt  = Boolean(exercise.subjectAlternativo)
  const hasReal = Boolean(exercise.subjectReal)
  const showSwitch = hasAlt || hasReal

  const subjectToShow =
    variant === 'alternativo' ? exercise.subjectAlternativo :
    variant === 'real'        ? exercise.subjectReal :
                                exercise.subject

  return (
    <div className="space-y-4">
      {showSwitch && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 font-semibold uppercase tracking-wide mr-1">Subject</span>
          <button
            onClick={() => setVariant('default')}
            className={`px-2.5 py-1 rounded-md border ${
              variant === 'default'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Vigente
          </button>
          {hasReal && (
            <button
              onClick={() => setVariant('real')}
              className={`px-2.5 py-1 rounded-md border ${
                variant === 'real'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
              }`}
              title="Subject literal del repo rank02 (sub.txt)"
            >
              Examen real (rank02)
            </button>
          )}
          {hasAlt && (
            <button
              onClick={() => setVariant('alternativo')}
              className={`px-2.5 py-1 rounded-md border ${
                variant === 'alternativo'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
              }`}
              title="Subject didáctico anterior, conservado como variante"
            >
              Didáctico
            </button>
          )}
        </div>
      )}
      <SubjectViewer
        exercise={exercise}
        exerciseId={exercise.id}
        subject={subjectToShow}
        subjectEs={exercise.subjectEs}
        funcionesPermitidas={exercise.funcionesPermitidas}
        archivosEsperados={exercise.archivosEsperados}
      />
      <div className="card p-4 space-y-2">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Las 5 preguntas clave</p>
        {[
          ['¿Main o función?',  exercise.tipoEntrega === 'programa' ? 'main() — programa completo' : 'función — sin main'],
          ['¿Cuántos args?',    exercise.tipoEntrega === 'programa' ? 'argc = 2 (programa + 1 arg)' : 'recibe parámetros de función'],
          ['¿Qué recibe?',      exercise.archivosEsperados?.[0]?.replace('.c', '') ?? '—'],
          ['¿Qué transforma?',  exercise.descripcion?.split('.')[0] ?? '—'],
          ['¿Trampa especial?', exercise.trampas?.[0]?.titulo ?? 'Ver tab Variantes'],
        ].map(([q, a]) => (
          <div key={q} className="flex gap-2 text-sm">
            <span className="text-zinc-300 shrink-0">→</span>
            <span className="font-medium text-zinc-500 w-36 shrink-0 text-xs">{q}</span>
            <span className="text-zinc-800 text-xs">{a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabLogicaVisual({ exercise }) {
  return (
    <div className="space-y-6">
      {/* Visual Thinking Guide */}
      <AlgorithmThinkingGuide exercise={exercise} />

      {/* Laboratorio 3D Dedicado al Ejercicio */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
        <Exercise3DDojo exercise={exercise} />
      </div>
    </div>
  )
}

function TabHistoria({ exercise }) {
  const [activeMnemonicView, setActiveMnemonicView] = useState('palacio') // 'palacio' | 'campayo'

  return (
    <div className="space-y-6">
      {/* Sub-selector de Mnemotecnia */}
      <div className="flex items-center gap-2 p-1 bg-zinc-100/80 rounded-xl w-fit border border-zinc-200 text-xs">
        <button
          onClick={() => setActiveMnemonicView('palacio')}
          className={clsx(
            'px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5',
            activeMnemonicView === 'palacio'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800'
          )}
        >
          <span>🏰</span>
          <span>Palacio de la Memoria & Nano Banana</span>
        </button>
        <button
          onClick={() => setActiveMnemonicView('campayo')}
          className={clsx(
            'px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5',
            activeMnemonicView === 'campayo'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800'
          )}
        >
          <span>🧠</span>
          <span>Método Ramón Campayo (5 Pasos)</span>
        </button>
      </div>

      {activeMnemonicView === 'palacio' ? (
        <div className="grid gap-6 md:grid-cols-2">
          <StoryCard palacio={exercise.palacio} relacionados={exercise.relacionados} />
          <ImageGenerator exercise={exercise} />
        </div>
      ) : (
        <CampayoMethodCard exercise={exercise} />
      )}
    </div>
  )
}

function TabSimulador({ exercise }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🎬</span>
          <h3 className="font-bold text-sm text-zinc-800">Animación Interactiva de la Lógica</h3>
        </div>
        <LogicAnimator exerciseId={exercise.id} />
      </div>

      <div className="h-px bg-zinc-200" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🎮</span>
          <h3 className="font-bold text-sm text-zinc-800">Simulador de Entradas Moulinette</h3>
        </div>
        <InputPlayground exerciseId={exercise.id} tests={exercise.tests} />
      </div>
    </div>
  )
}

function TabGDB({ exercise }) {
  return (
    <GdbStepper
      steps={exercise.gdbSteps}
      caminos={exercise.gdbCaminos}
      title={`GDB — ${exercise.nombre}`}
      exerciseConceptos={exercise.conceptos || []}
    />
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handle}
      title="Copiar código al portapapeles"
      className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function TabVariantes({ exercise }) {
  const [selected, setSelected] = useState(0)
  const versiones = exercise.versiones ?? []
  const { variants, deleteVariant } = useUserVariants(exercise.id)

  if (!versiones.length && !variants.length) return <EmptyTab label="variantes" />

  const version = versiones[selected] ?? null

  return (
    <div className="space-y-6">
      {/* ── Versiones predefinidas ── */}
      {versiones.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Versiones del ejercicio</p>

          {/* Selector */}
          <div className="flex gap-2 flex-wrap">
            {versiones.map((v, i) => (
              <button key={v.id} onClick={() => setSelected(i)}
                className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                  i === selected ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                )}
              >
                {v.nombre}
                {v.recomendada && <span className="ml-1.5 text-xs text-green-400">★</span>}
                {v.origen === 'rank02' && (
                  <span
                    className={clsx(
                      'ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide',
                      i === selected ? 'bg-blue-400 text-white' : 'bg-blue-100 text-blue-700'
                    )}
                    title="Solución literal del repo rank02"
                  >
                    rank02
                  </span>
                )}
              </button>
            ))}
          </div>

          {version && (
            <>
              {/* Info de la versión */}
              <div className={clsx('p-3 rounded-lg border text-sm',
                version.recomendada ? 'bg-green-50 border-green-200 text-green-800' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
              )}>
                {version.recomendada && <span className="font-semibold">✓ Recomendada para el examen · </span>}
                {version.descripcion}
              </div>

              {/* Código */}
              <CodeViewer
                codigo={version.codigo}
                titulo={exercise.archivosEsperados?.[0] ?? 'solution.c'}
                lenguaje="c"
              />
            </>
          )}
        </div>
      )}

      {/* ── Mis variantes guardadas ── */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Mis variantes guardadas</p>
            <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">
              {variants.length}
            </span>
          </div>

          {variants.map(v => (
            <div key={v.id} className="rounded-xl border border-blue-200 bg-blue-50/50 overflow-hidden">
              <div className="flex items-start justify-between px-4 py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-blue-900">{v.nombre}</p>
                  {v.descripcion && (
                    <p className="text-xs text-blue-600 mt-0.5">{v.descripcion}</p>
                  )}
                  <p className="text-xs text-zinc-400 mt-0.5">{formatDate(v.fechaGuardado)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <CopyButton text={v.codigo} />
                  <button
                    onClick={() => deleteVariant(v.id)}
                    title="Eliminar variante"
                    className="text-zinc-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <CodeViewer codigo={v.codigo} titulo="mi_variante.c" lenguaje="c" />
            </div>
          ))}
        </div>
      )}

      {/* Hint when no user variants yet */}
      {variants.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-200 px-4 py-5 text-center">
          <p className="text-xs text-zinc-400">
            Guarda tu propia solución desde el editor con el botón <strong>💾 Guardar variante</strong>
          </p>
        </div>
      )}
    </div>
  )
}

function TabPruebate({ exercise, navigate }) {
  const tests = exercise.tests ?? []

  return (
    <div className="space-y-4">
      {/* Active recall */}
      <div className="card p-5 text-center space-y-3">
        <p className="text-3xl">🧠</p>
        <p className="font-semibold text-zinc-800">Protocolo Active Recall</p>
        <p className="text-sm text-zinc-500">
          Sin mirar el código, intenta escribir la solución de memoria. Solo con las anclas que recuerdas.
        </p>
        <button
          onClick={() => navigate(`/practicar/${exercise.id}`)}
          className="btn-primary mx-auto"
        >
          <Play size={14} /> Abrir editor + Moulinette
        </button>
      </div>

      {/* Tests preview */}
      {tests.length > 0 && (
        <div className="card divide-y divide-zinc-100">
          <p className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Tests de la Moulinette ({tests.length})
          </p>
          {tests.map(t => (
            <div key={t.id} className="px-4 py-3 flex items-start gap-3">
              <span className={clsx('mt-0.5 text-xs px-1.5 py-0.5 rounded font-mono shrink-0',
                t.tipo === 'edge' ? 'bg-orange-50 text-orange-700' : 'bg-zinc-100 text-zinc-500'
              )}>
                {t.tipo}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-zinc-700">{t.descripcion}</p>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  {t.entrada.length ? `→ args: ${JSON.stringify(t.entrada)}` : '→ sin argumentos'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {exercise.trampas?.length > 0 && <TrapsList trampas={exercise.trampas} />}
    </div>
  )
}

function EmptyTab({ label }) {
  return (
    <div className="py-16 text-center text-zinc-400">
      <p className="text-4xl mb-3">🚧</p>
      <p className="text-sm">Los datos de {label} se añadirán próximamente</p>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'ex-last-tab'

export default function ExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const exercise = getExercise(id)
  const prev = getPrevExercise(id)
  const next = getNextExercise(id)

  const progreso = useProgressStore(s => s.ejercicios[id])
  const marcarEstado = useProgressStore(s => s.marcarEstado)

  const [activeTab, setActiveTab] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.[id] ?? 'subject' }
    catch { return 'subject' }
  })

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, [id]: activeTab }))
    } catch {}
  }, [id, activeTab])

  // Marcar como "estudiando" al abrir por primera vez
  useEffect(() => {
    if (progreso?.estado === 'no_iniciado') marcarEstado(id, 'estudiando')
  }, [id])

  if (!exercise) {
    return (
      <div className="p-8 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-lg font-semibold text-zinc-800">Ejercicio no encontrado</p>
        <p className="text-zinc-400 text-sm mt-1">ID: <span className="font-mono">{id}</span></p>
        <Link to="/" className="btn-primary mt-4 inline-flex">← Volver al inicio</Link>
      </div>
    )
  }

  const estado = progreso?.estado ?? 'no_iniciado'
  const statusCfg = STATUS_CONFIG[estado]

  const tabContent = {
    subject:   <TabSubject exercise={exercise} />,
    logica:    <TabLogicaVisual exercise={exercise} />,
    historia:  <TabHistoria exercise={exercise} />,
    dojo:      <DojoLadder exercise={exercise} />,
    simulador: <TabSimulador exercise={exercise} />,
    gdb:       <TabGDB exercise={exercise} />,
    variantes: <TabVariantes exercise={exercise} />,
    pruebate:  <TabPruebate exercise={exercise} navigate={navigate} />,
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">

      {/* ── Header del ejercicio ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-5xl shrink-0">{exercise.palacio.emoji}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-zinc-900 font-mono">{exercise.nombre}</h1>
              <LevelBadge nivel={exercise.nivel} />
              <span className={clsx('badge border', statusCfg.bg, statusCfg.text, statusCfg.border)}>
                {statusCfg.label}
              </span>
            </div>
            {exercise.descripcion && (
              <p className="text-sm text-zinc-500 mt-0.5 truncate">{exercise.descripcion}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to={prev ? `/ejercicio/${prev.id}` : '#'}
            className={clsx('btn-secondary px-2 py-2', !prev && 'opacity-30 pointer-events-none')}>
            <ChevronLeft size={16} />
          </Link>
          <Link to={next ? `/ejercicio/${next.id}` : '#'}
            className={clsx('btn-secondary px-2 py-2', !next && 'opacity-30 pointer-events-none')}>
            <ChevronRight size={16} />
          </Link>
          <button
            onClick={() => navigate(`/practicar/${id}`)}
            className="btn-primary"
          >
            <Play size={14} /> Practicar
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mb-1 scrollbar-none">
        {TABS.map(({ id: tabId, icon: Icon, label }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={activeTab === tabId ? 'tab-button-active' : 'tab-button'}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Contenido del tab activo ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
