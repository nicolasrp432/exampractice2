import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { getExercisesByLevel } from '@/data/index'
import { useProgressStore } from '@/store/progressStore'
import LevelBadge from '@/components/layout/LevelBadge'

const ROOM_INFO = {
  1: { nombre: 'Cocina',     emoji: '🍳', desc: 'Fundamentos — strings, ASCII, argc' },
  2: { nombre: 'Salón',      emoji: '🛋️', desc: 'Intermedio — bits, manipulación de strings' },
  3: { nombre: 'Dormitorio', emoji: '🛏️', desc: 'Avanzado — malloc, lógica compleja' },
  4: { nombre: 'Garaje',     emoji: '🔧', desc: 'Experto — algoritmos, listas enlazadas' },
}

const STATUS_STYLE = {
  dominado:    { label: 'Dominado',    bg: 'bg-green-100',  text: 'text-green-700'  },
  practicando: { label: 'Practicando', bg: 'bg-orange-100', text: 'text-orange-700' },
  estudiando:  { label: 'Estudiando',  bg: 'bg-blue-100',   text: 'text-blue-700'   },
  no_iniciado: { label: 'Sin iniciar', bg: 'bg-zinc-100',   text: 'text-zinc-500'   },
}

const DIFICULTAD_STYLE = {
  'fácil':   'bg-green-50 text-green-600 border-green-200',
  'medio':   'bg-orange-50 text-orange-600 border-orange-200',
  'difícil': 'bg-red-50 text-red-600 border-red-200',
}

export default function ExerciseList() {
  const { nivel } = useParams()
  const nivelNum = Number(nivel)
  const exercises = getExercisesByLevel(nivelNum)
  const ejercicios = useProgressStore(s => s.ejercicios)

  const room = ROOM_INFO[nivelNum]
  if (!room || !exercises.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-lg font-semibold text-zinc-800">Nivel no encontrado</p>
        <Link to="/" className="btn-primary mt-4 inline-flex">← Volver al inicio</Link>
      </div>
    )
  }

  const dominados = exercises.filter(ex => ejercicios[ex.id]?.estado === 'dominado').length

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="text-5xl">{room.emoji}</span>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-900">{room.nombre}</h1>
            <LevelBadge nivel={nivelNum} />
          </div>
          <p className="text-sm text-zinc-500 mt-0.5">{room.desc}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold text-zinc-900">{dominados}/{exercises.length}</p>
          <p className="text-xs text-zinc-400">dominados</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-zinc-800"
          initial={{ width: 0 }}
          animate={{ width: `${Math.round((dominados / exercises.length) * 100)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Exercise grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {exercises.map((ex, i) => {
          const estado = ejercicios[ex.id]?.estado ?? 'no_iniciado'
          const statusCfg = STATUS_STYLE[estado]
          const hasContent = ex.subject && ex.subject.length > 0

          return (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/ejercicio/${ex.id}`}
                className="card p-4 flex items-start gap-3 hover:shadow-card-hover transition-shadow block"
              >
                <span className="text-3xl shrink-0">{ex.palacio?.emoji || '❓'}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono font-semibold text-sm text-zinc-900 truncate">{ex.nombre}</p>
                    {!hasContent && (
                      <span className="text-[10px] text-zinc-300 shrink-0">🚧</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">
                    {ex.palacio?.personaje || '—'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={clsx('text-[10px] px-1.5 py-0.5 rounded border font-medium', DIFICULTAD_STYLE[ex.dificultad])}>
                      {ex.dificultad}
                    </span>
                    <span className={clsx('text-[10px] px-1.5 py-0.5 rounded font-medium', statusCfg.bg, statusCfg.text)}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
