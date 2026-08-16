export function buildExamPlan(exercises, selectedLevels, rng = Math.random, durationMinutes = 30) {
  const byLevel = new Map()

  for (const exercise of exercises) {
    if (!byLevel.has(exercise.nivel)) byLevel.set(exercise.nivel, [])
    byLevel.get(exercise.nivel).push(exercise)
  }

  const levels = [...selectedLevels]
  const pickedExercises = levels
    .map((level) => {
      const pool = byLevel.get(level) ?? []
      if (pool.length === 0) return null
      const index = Math.floor(rng() * pool.length)
      return pool[index]
    })
    .filter(Boolean)

  return {
    levels,
    exercises: pickedExercises,
    totalExercises: pickedExercises.length,
    durationMinutes,
  }
}

export function getExamNavigationItems() {
  return [
    { to: '/', label: 'Inicio' },
    { to: '/palacio', label: 'Palacio' },
    { to: '/herramientas', label: 'Herramientas' },
    { to: '/progreso', label: 'Progreso' },
  ]
}

export function summarizeExamResults(results) {
  const totalExercises = results.length
  const completedExercises = results.filter((result) => result.status !== 'skipped').length
  const testsPassed = results.reduce((sum, result) => sum + (result.passedTests ?? 0), 0)
  const testsTotal = results.reduce((sum, result) => sum + (result.totalTests ?? 0), 0)

  return {
    totalExercises,
    completedExercises,
    testsPassed,
    testsTotal,
    scorePct: testsTotal === 0 ? 0 : Math.round((testsPassed / testsTotal) * 100),
    failedExercises: results.filter((result) => !result.passed).map((result) => result.id),
    timeByExercise: Object.fromEntries(results.map((result) => [result.id, result.elapsedSeconds ?? 0])),
  }
}
