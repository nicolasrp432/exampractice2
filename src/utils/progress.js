const LEVELS = [1, 2, 3, 4]

function toDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

function roundPct(value, total) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

function buildMiniCalendar(streak, lastSession, now = new Date()) {
  const anchor = toDate(lastSession) ?? now
  const days = []

  for (let index = 6; index >= 0; index -= 1) {
    const day = new Date(anchor)
    day.setDate(anchor.getDate() - (6 - index))
    days.push({
      date: day.toISOString(),
      label: day.toLocaleDateString('es-ES', { weekday: 'narrow' }),
      active: index >= 7 - Math.min(Math.max(streak, 0), 7),
    })
  }

  return days
}

function countFailures(progress = {}, examFailureTally = {}) {
  if (typeof progress.fallos === 'number') return progress.fallos

  const fromExams = examFailureTally[progress.id]
  if (typeof fromExams === 'number') return fromExams

  const passed = typeof progress.testsPasados === 'number' ? progress.testsPasados : 0
  const total = typeof progress.testsTotal === 'number' ? progress.testsTotal : 0
  return Math.max(total - passed, 0)
}

export function buildProgressModel({
  exercises = [],
  progressById = {},
  exams = [],
  streak = 0,
  totalSessions = 0,
  lastSession = null,
  now = new Date(),
} = {}) {
  const totalExercises = exercises.length
  const masteredExercises = exercises.filter((exercise) => progressById[exercise.id]?.estado === 'dominado')
  const masteredCount = masteredExercises.length
  const masteredPct = roundPct(masteredCount, totalExercises)

  const examFailureTally = exams.reduce((acc, exam) => {
    for (const id of exam.failedExercises ?? []) {
      acc[id] = (acc[id] ?? 0) + 1
    }
    return acc
  }, {})

  const levelStats = LEVELS.map((level) => {
    const levelExercises = exercises.filter((exercise) => exercise.nivel === level)
    const levelMastered = levelExercises.filter((exercise) => progressById[exercise.id]?.estado === 'dominado').length

    return {
      level,
      total: levelExercises.length,
      mastered: levelMastered,
      pct: roundPct(levelMastered, levelExercises.length),
    }
  })

  const weakSpots = exercises
    .map((exercise) => {
      const progress = { id: exercise.id, ...(progressById[exercise.id] ?? {}) }
      const failedCount = countFailures(progress, examFailureTally)
      const attempts = progress.intentos ?? 0

      return {
        ...exercise,
        progress,
        failedCount,
        attempts,
      }
    })
    .filter((exercise) => exercise.failedCount > 0)
    .sort((a, b) => b.failedCount - a.failedCount || b.attempts - a.attempts || a.nombre.localeCompare(b.nombre))
    .slice(0, 5)

  const examHistory = [...exams]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10)

  const totalPracticeSeconds = exams.reduce((sum, exam) => sum + (exam.totalSeconds ?? 0), 0)

  return {
    totalExercises,
    masteredCount,
    masteredPct,
    levelStats,
    weakSpots,
    examHistory,
    totalPracticeSeconds,
    totalSessions,
    streak,
    lastSession,
    miniCalendar: buildMiniCalendar(streak, lastSession, now),
  }
}
