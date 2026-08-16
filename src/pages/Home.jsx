import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Shuffle, BookOpen, Map, Wrench, BarChart2, Clock, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { useProgressStore } from '@/store/progressStore'
import { allExercises, exercisesByLevel } from '@/data/index'

// ─── Constantes ──────────────────────────────────────────────────────────────
const ROOMS = [
  { nivel: 1, emoji: '🍳', nombre: 'Cocina',      color: 'purple', total: 12, to: '/ejercicios/1',
    bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500', ring: 'ring-purple-100' },
  { nivel: 2, emoji: '🛋️', nombre: 'Salón',       color: 'green',  total: 17, to: '/ejercicios/2',
    bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  bar: 'bg-green-500',  ring: 'ring-green-100'  },
  { nivel: 3, emoji: '🛏️', nombre: 'Dormitorio',  color: 'orange', total: 15, to: '/ejercicios/3',
    bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', bar: 'bg-orange-500', ring: 'ring-orange-100' },
  { nivel: 4, emoji: '🔧', nombre: 'Garaje',       color: 'red',    total: 3,  to: '/ejercicios/4',
    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    bar: 'bg-red-500',    ring: 'ring-red-100'    },
]

const QUICK_ACTIONS = [
  { label: 'Examen aleatorio', icon: Shuffle,   to: '/examen',                    bg: 'bg-zinc-900', text: 'text-white',         primary: true  },
  { label: 'Flash Cards',      icon: BookOpen,  to: '/palacio?mode=flashcards',   bg: 'bg-purple-50',text: 'text-purple-700',   primary: false },
  { label: 'Herramientas',     icon: Wrench,    to: '/herramientas',              bg: 'bg-blue-50',  text: 'text-blue-700',     primary: false },
  { label: 'Ver progreso',     icon: BarChart2, to: '/progreso',                  bg: 'bg-green-50', text: 'text-green-700',    primary: false },
]

const STATUS_STYLE = {
  dominado:    { bg: 'bg-green-500',  ring: 'ring-green-200',  label: 'Dominado'    },
  practicando: { bg: 'bg-orange-400', ring: 'ring-orange-200', label: 'Practicando' },
  estudiando:  { bg: 'bg-blue-400',   ring: 'ring-blue-200',   label: 'Estudiando'  },
  no_iniciado: { bg: 'bg-zinc-200',   ring: 'ring-zinc-100',   label: 'Sin iniciar' },
}

const LEVEL_DOT = { 1: 'bg-purple-400', 2: 'bg-green-400', 3: 'bg-orange-400', 4: 'bg-red-400' }

// ─── Animación stagger ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}
// Grid de ejercicios — stagger más rápido para 47 celdas pequeñas
const cellContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
}
const cellVariants = {
  hidden:  { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } },
}

// ─── Componentes internos ─────────────────────────────────────────────────────
function RoomCard({ room, dominados }) {
  const pct = Math.round((dominados / room.total) * 100)
  return (
    <motion.div variants={itemVariants}>
      <Link
        to={room.to}
        className={clsx(
          'flex flex-col gap-3 p-5 rounded-xl border cursor-pointer',
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
          room.bg, room.border
        )}
      >
        <div className="flex items-start justify-between">
          <span className="text-3xl">{room.emoji}</span>
          <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70', room.text)}>
            Nivel {room.nivel}
          </span>
        </div>
        <div>
          <p className={clsx('font-semibold', room.text)}>{room.nombre}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{dominados}/{room.total} ejercicios</p>
        </div>
        <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
          <motion.div
            className={clsx('h-full rounded-full', room.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </Link>
    </motion.div>
  )
}

function ExerciseCell({ exercise, estado }) {
  const style = STATUS_STYLE[estado] ?? STATUS_STYLE.no_iniciado
  return (
    <Link
      to={`/ejercicio/${exercise.id}`}
      title={`${exercise.nombre} — ${style.label}`}
      className={clsx(
        'group flex flex-col items-center justify-center gap-1 p-2 rounded-lg',
        'border border-transparent transition-all duration-150',
        'hover:bg-white hover:border-zinc-200 hover:shadow-card'
      )}
    >
      <span className="text-xl leading-none">{exercise.palacio.emoji}</span>
      <span className="text-[10px] text-zinc-500 text-center leading-tight truncate w-full text-center">
        {exercise.nombre.replace('ft_', '').replace('_', ' ')}
      </span>
      <span className={clsx('w-1.5 h-1.5 rounded-full', style.bg)} />
    </Link>
  )
}

function ReviewCard({ exercise, progreso }) {
  const diasDesde = progreso.ultimaVez
    ? Math.floor((Date.now() - new Date(progreso.ultimaVez)) / 86400000)
    : null

  return (
    <Link
      to={`/practicar/${exercise.id}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors group"
    >
      <span className="text-2xl">{exercise.palacio.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 truncate">{exercise.nombre}</p>
        <p className="text-xs text-zinc-400">
          {diasDesde !== null ? `Hace ${diasDesde} día${diasDesde !== 1 ? 's' : ''}` : 'Pendiente de repaso'}
        </p>
      </div>
      <span className="text-xs font-medium px-2 py-1 rounded-md bg-orange-50 text-orange-700 shrink-0">
        Repasar
      </span>
    </Link>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const ejercicios = useProgressStore(s => s.ejercicios)
  const racha = useProgressStore(s => s.racha)

  const dominadosTotal = useMemo(
    () => Object.values(ejercicios).filter(p => p.estado === 'dominado').length,
    [ejercicios]
  )

  const dominadosPorNivel = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 }
    allExercises.forEach(ex => {
      const p = ejercicios[ex.id]
      if (p?.estado === 'dominado') counts[ex.nivel]++
    })
    return counts
  }, [ejercicios])

  const paraRepasar = useMemo(() => {
    const hoy = new Date()
    return allExercises
      .filter(ex => {
        const p = ejercicios[ex.id]
        return p?.proximaRepasion && new Date(p.proximaRepasion) <= hoy
      })
      .slice(0, 5)
  }, [ejercicios])

  function examAleatorio() {
    const id = allExercises[Math.floor(Math.random() * allExercises.length)].id
    navigate(`/practicar/${id}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">

      {/* ── Hero ── */}
      <motion.section
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Hola, ¿listo para el examen? 👋
          </h1>
          <p className="text-zinc-500 mt-1">
            <span className="font-semibold text-zinc-800">{dominadosTotal}</span>/47 ejercicios dominados
          </p>
        </div>
        <div className="flex items-center gap-3">
          {racha > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200">
              <Flame size={15} className="text-orange-500" />
              <span className="text-sm font-semibold text-orange-700">{racha} días</span>
            </div>
          )}
          <button
            onClick={examAleatorio}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <Shuffle size={15} />
            Examen aleatorio
          </button>
        </div>
      </motion.section>

      {/* ── Palacio de la Memoria ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-800">🏠 Palacio de la Memoria</h2>
          <Link to="/palacio" className="text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors">
            Ver mapa <ChevronRight size={13} />
          </Link>
        </div>
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {ROOMS.map(room => (
            <RoomCard
              key={room.nivel}
              room={room}
              dominados={dominadosPorNivel[room.nivel]}
            />
          ))}
        </motion.div>
      </section>

      {/* ── Próximos a repasar ── */}
      <section>
        <h2 className="text-base font-semibold text-zinc-800 mb-3">⏰ Próximos a repasar</h2>
        <div className="card divide-y divide-zinc-100">
          {paraRepasar.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-sm font-medium text-zinc-700">¡Al día con todo!</p>
              <p className="text-xs text-zinc-400 mt-1">No tienes ejercicios pendientes de repaso</p>
            </div>
          ) : (
            paraRepasar.map(ex => (
              <ReviewCard key={ex.id} exercise={ex} progreso={ejercicios[ex.id]} />
            ))
          )}
        </div>
      </section>

      {/* ── Accesos rápidos ── */}
      <section>
        <h2 className="text-base font-semibold text-zinc-800 mb-3">⚡ Accesos rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to, bg, text, primary }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent',
                'font-medium text-sm text-center',
                'transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover',
                primary ? 'bg-zinc-900 text-white border-zinc-800' : `${bg} ${text} border-zinc-100`
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Grid 47 ejercicios ── */}
      <section>
        <h2 className="text-base font-semibold text-zinc-800 mb-3">📋 Todos los ejercicios</h2>
        <div className="card p-4 space-y-4">
          {ROOMS.map(room => (
            <div key={room.nivel}>
              <div className="flex items-center gap-2 mb-2">
                <span className={clsx('w-2 h-2 rounded-full', room.bar)} />
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  {room.emoji} {room.nombre}
                </span>
              </div>
              <motion.div
                className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1"
                variants={cellContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                {(exercisesByLevel[room.nivel] ?? []).map(ex => (
                  <motion.div key={ex.id} variants={cellVariants}>
                    <ExerciseCell
                      exercise={ex}
                      estado={ejercicios[ex.id]?.estado ?? 'no_iniciado'}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
        {/* Leyenda */}
        <div className="flex items-center gap-4 mt-3 px-1">
          {Object.entries(STATUS_STYLE).map(([key, s]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className={clsx('w-2 h-2 rounded-full', s.bg)} />
              {s.label}
            </span>
          ))}
        </div>
      </section>

    </div>
  )
}
