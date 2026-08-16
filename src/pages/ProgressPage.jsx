import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Clock3, Flame, PencilLine, Trophy, AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Circle } from 'lucide-react'
import clsx from 'clsx'
import { allExercises } from '@/data/index'
import { useProgressStore } from '@/store/progressStore'
import { buildProgressModel } from '@/utils/progress'

const STATUS_STYLES = {
  dominado: {
    dot: 'bg-green-500',
    chip: 'bg-green-50 text-green-700 border-green-200',
    card: 'border-green-200 bg-green-50/80',
  },
  practicando: {
    dot: 'bg-orange-500',
    chip: 'bg-orange-50 text-orange-700 border-orange-200',
    card: 'border-orange-200 bg-orange-50/80',
  },
  estudiando: {
    dot: 'bg-sky-500',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    card: 'border-sky-200 bg-sky-50/80',
  },
  no_iniciado: {
    dot: 'bg-zinc-300',
    chip: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    card: 'border-zinc-200 bg-zinc-50',
  },
}

const LEVEL_COLORS = {
  1: { bar: 'bg-purple-500', fill: 'from-purple-500 to-purple-400', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  2: { bar: 'bg-green-500', fill: 'from-green-500 to-green-400', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  3: { bar: 'bg-orange-500', fill: 'from-orange-500 to-orange-400', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  4: { bar: 'bg-red-500', fill: 'from-red-500 to-red-400', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
}

function shortName(name) {
  return name.replace(/^ft_/, '').replaceAll('_', ' ')
}

function formatDuration(totalSeconds = 0) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function CircularProgress({ value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
        <circle cx="70" cy="70" r={radius} className="fill-none stroke-zinc-100" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          className="fill-none stroke-zinc-900"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-black text-zinc-900">{pct}%</div>
        <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Dominado</div>
      </div>
    </div>
  )
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-500">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-900">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl text-sm text-zinc-500">{description}</p> : null}
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, hint, tone = 'zinc' }) {
  const toneStyles = {
    zinc: 'bg-zinc-50 border-zinc-200 text-zinc-900',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }

  return (
    <div className={clsx('rounded-3xl border p-4 sm:p-5', toneStyles[tone])}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
        <Icon size={16} className={clsx(tone === 'zinc' ? 'text-zinc-400' : 'text-current')} />
      </div>
      <div className="mt-3 text-2xl font-black">{value}</div>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  )
}

function MiniCalendar({ days }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Mini calendario</p>
          <p className="mt-1 text-sm font-semibold text-zinc-700">Racha actual</p>
        </div>
        <CalendarDays size={18} className="text-zinc-400" />
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.date}
            className={clsx(
              'flex h-10 flex-col items-center justify-center rounded-2xl border text-[10px] font-semibold uppercase tracking-wide',
              day.active ? 'border-green-200 bg-green-500 text-white' : 'border-zinc-200 bg-white text-zinc-400'
            )}
          >
            <span>{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LevelBar({ level, total, mastered, pct }) {
  const theme = LEVEL_COLORS[level]
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div>
          <p className={clsx('font-semibold', theme.text)}>Nivel {level}</p>
          <p className="mt-1 text-xs text-zinc-500">{mastered}/{total} ejercicios</p>
        </div>
        <span className={clsx('rounded-full border px-3 py-1 text-xs font-semibold', theme.bg, theme.border, theme.text)}>{pct}%</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          className={clsx('h-full rounded-full', theme.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function ExerciseTile({ exercise, progress }) {
  const style = STATUS_STYLES[progress?.estado] ?? STATUS_STYLES.no_iniciado

  return (
    <Link
      to={`/ejercicio/${exercise.id}`}
      className={clsx(
        'group rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card-hover',
        style.card
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl">{exercise.palacio.emoji}</span>
        <span className={clsx('rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide', style.chip)}>
          {progress?.estado ?? 'no_iniciado'}
        </span>
      </div>
      <p className="mt-3 font-semibold text-zinc-900">{shortName(exercise.nombre)}</p>
      <p className="mt-1 text-xs text-zinc-500">Nivel {exercise.nivel}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
        <span>{progress?.intentos ?? 0} intentos</span>
        <ArrowRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  )
}

function WeakSpotRow({ exercise, progress }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{exercise.nombre}</p>
          <p className="mt-1 text-xs text-zinc-500">{exercise.palacio.emoji} · Nivel {exercise.nivel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-red-200 bg-white px-3 py-1 text-red-700">{exercise.failedCount} fallos</span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-zinc-600">{progress.intentos ?? 0} intentos</span>
          <Link to={`/practicar/${exercise.id}`} className="rounded-full bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-500">
            Estudiar ahora
          </Link>
        </div>
      </div>
    </div>
  )
}

function HistoryTable({ rows }) {
  if (rows.length === 0) {
    return <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">Todavía no hay exámenes guardados.</div>
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-zinc-100 text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-400">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Fecha</th>
            <th className="px-4 py-3 text-left font-semibold">Niveles</th>
            <th className="px-4 py-3 text-left font-semibold">Score</th>
            <th className="px-4 py-3 text-left font-semibold">Tiempo</th>
            <th className="px-4 py-3 text-left font-semibold">Fallidos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <tr key={row.timestamp} className="text-zinc-700">
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.timestamp)}</td>
              <td className="px-4 py-3">{row.levels?.map((level) => `Nivel ${level}`).join(', ') || '—'}</td>
              <td className="px-4 py-3 font-semibold text-zinc-900">{row.scorePct}%</td>
              <td className="px-4 py-3 whitespace-nowrap">{formatDuration(row.totalSeconds ?? 0)}</td>
              <td className="px-4 py-3">{row.failedExercises?.length ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ProgressPage() {
  const ejercicios = useProgressStore((s) => s.ejercicios)
  const examenes = useProgressStore((s) => s.examenes)
  const racha = useProgressStore((s) => s.racha)
  const totalSesiones = useProgressStore((s) => s.totalSesiones)
  const ultimaSesion = useProgressStore((s) => s.ultimaSesion)
  const actualizarNotas = useProgressStore((s) => s.actualizarNotas)
  const [selectedExerciseId, setSelectedExerciseId] = useState(allExercises[0]?.id ?? '')

  const model = useMemo(() => {
    return buildProgressModel({
      exercises: allExercises,
      progressById: ejercicios,
      exams: examenes,
      streak: racha,
      totalSessions: totalSesiones,
      lastSession: ultimaSesion,
    })
  }, [ejercicios, examenes, racha, totalSesiones, ultimaSesion])

  const selectedExercise = allExercises.find((exercise) => exercise.id === selectedExerciseId) ?? allExercises[0] ?? null
  const selectedProgress = selectedExercise ? ejercicios[selectedExercise.id] : null

  const levelGroups = useMemo(() => {
    return [1, 2, 3, 4].map((level) => ({
      level,
      exercises: allExercises.filter((exercise) => exercise.nivel === level),
    }))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="card p-6 sm:p-8"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-500">Prompt 14</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl">Progreso</h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-600">
              Tu mapa de dominio: qué ya tienes, dónde te rompes y qué conviene estudiar ahora.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:min-w-[560px]">
            <MetricCard icon={Trophy} label="Dominados" value={`${model.masteredCount}/${model.totalExercises}`} hint={`${model.masteredPct}% del total`} tone="green" />
            <MetricCard icon={Flame} label="Racha" value={`${model.streak} días`} hint={model.lastSession ? `Última sesión: ${formatDate(model.lastSession)}` : 'Sin sesiones aún'} tone="orange" />
            <MetricCard icon={BookOpen} label="Sesiones" value={model.totalSessions} hint="Exámenes guardados" tone="purple" />
            <MetricCard icon={Clock3} label="Práctica" value={formatDuration(model.totalPracticeSeconds)} hint="Tiempo acumulado" tone="zinc" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <CircularProgress value={model.masteredCount} total={model.totalExercises} />
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <MetricCard icon={CheckCircle2} label="Ejercicios" value={model.totalExercises} hint="Total disponible" tone="zinc" />
                <MetricCard icon={AlertTriangle} label="Puntos débiles" value={model.weakSpots.length} hint="Top 5 por fallos" tone="orange" />
              </div>
            </div>
          </div>

          <MiniCalendar days={model.miniCalendar} />
        </div>
      </motion.header>

      <section>
        <SectionHeader
          eyebrow="Estado por nivel"
          title="4 barras de progreso"
          description="Cada barra resume cuánto tienes consolidado por nivel de la plataforma."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {model.levelStats.map((level) => (
            <LevelBar key={level.level} {...level} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Grid general"
          title="Los ejercicios"
          description="Cuatro filas, una por nivel, con acceso directo a cada ejercicio."
        />
        <div className="space-y-6">
          {levelGroups.map(({ level, exercises: levelExercises }) => {
            const theme = LEVEL_COLORS[level]
            return (
              <div key={level} className={clsx('rounded-3xl border p-4 sm:p-5', theme.border, theme.bg)}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={clsx('text-sm font-semibold', theme.text)}>Nivel {level}</p>
                    <p className="mt-1 text-xs text-zinc-500">{levelExercises.length} ejercicios</p>
                  </div>
                  <span className={clsx('rounded-full border px-3 py-1 text-xs font-semibold', theme.border, 'bg-white', theme.text)}>
                    {model.levelStats.find((entry) => entry.level === level)?.pct ?? 0}% dominado
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  {levelExercises.map((exercise) => (
                    <ExerciseTile key={exercise.id} exercise={exercise} progress={ejercicios[exercise.id]} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Puntos débiles"
          title="Top 5"
          description="Se ordenan por más fallos. Úsalos como lista de estudio inmediata."
        />
        <div className="space-y-3">
          {model.weakSpots.length ? model.weakSpots.map((exercise) => (
            <WeakSpotRow key={exercise.id} exercise={exercise} progress={exercise.progress} />
          )) : (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
              Aún no hay fallos registrados. Haz exámenes para descubrir tus puntos débiles.
            </div>
          )}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Historial"
          title="Exámenes recientes"
          description="Máximo 10 entradas, ordenadas de más reciente a más antigua."
        />
        <HistoryTable rows={model.examHistory} />
      </section>

      <section>
        <SectionHeader
          eyebrow="Notas"
          title="Notas personales"
          description="Edita una nota inline por ejercicio y guárdala en el estado persistente."
        />

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Ejercicio</label>
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              {allExercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.nombre}
                </option>
              ))}
            </select>

            {selectedExercise ? (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedExercise.palacio.emoji}</span>
                  <div>
                    <p className="font-semibold text-zinc-900">{selectedExercise.nombre}</p>
                    <p className="text-xs text-zinc-500">Nivel {selectedExercise.nivel}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                  <Circle size={10} className={clsx((selectedProgress?.estado && STATUS_STYLES[selectedProgress.estado]?.dot) || STATUS_STYLES.no_iniciado.dot)} />
                  {selectedProgress?.estado ?? 'no_iniciado'}
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{selectedExercise?.nombre ?? 'Sin selección'}</p>
                <p className="mt-1 text-xs text-zinc-500">Texto guardado en `notas` del store.</p>
              </div>
              <PencilLine size={18} className="text-zinc-400" />
            </div>

            <textarea
              value={selectedProgress?.notas ?? ''}
              onChange={(e) => selectedExercise && actualizarNotas(selectedExercise.id, e.target.value)}
              rows={8}
              placeholder="Escribe aquí tus recordatorios, trampas y reglas rápidas..."
              className="mt-4 w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
              <span>Guardado automático.</span>
              {selectedExercise ? <span>{selectedExercise.id}</span> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
