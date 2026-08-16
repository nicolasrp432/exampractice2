import { getExercise } from '@/data/index'
import { simulators, getDiff } from '@/utils/simulators/index'

// Runs all tests for an exercise using the JS simulator.
// Returns array of test results with passed/output/diff fields.
export function runTests(exerciseId, _userCode = null) {
  const exercise = getExercise(exerciseId)
  if (!exercise) return []

  const fn = simulators[exerciseId]
  if (!fn) {
    return (exercise.tests ?? []).map(t => ({
      ...t,
      output: null,
      passed: false,
      diff: null,
      error: 'Simulador no disponible para este ejercicio',
    }))
  }

  return (exercise.tests ?? []).map(t => {
    try {
      const output = fn(t.entrada)
      const passed = output === t.salida
      return { ...t, output, passed, diff: passed ? null : getDiff(output, t.salida) }
    } catch (err) {
      return { ...t, output: null, passed: false, diff: null, error: err.message }
    }
  })
}

// Validates all simulators against their test suites.
// Useful for development — call from browser console.
export function validateAllSimulators(exercises) {
  const report = []
  for (const ex of exercises) {
    const results = runTests(ex.id)
    const passed  = results.filter(r => r.passed).length
    const total   = results.length
    report.push({ id: ex.id, passed, total, ok: passed === total })
  }
  return report
}
