import test from 'node:test'
import assert from 'node:assert/strict'
import { allExercises } from '../data/index.js'
import { buildExamPlan, getExamNavigationItems, summarizeExamResults } from './exam.js'

test('buildExamPlan picks one exercise per selected level in level order', () => {
  const plan = buildExamPlan(allExercises, [2, 1], () => 0)

  assert.deepEqual(plan.exercises.map((exercise) => exercise.nivel), [2, 1])
  assert.equal(plan.totalExercises, 2)
  assert.equal(plan.durationMinutes, 30)
})

test('summarizeExamResults aggregates score and failed exercises', () => {
  const summary = summarizeExamResults([
    {
      id: 'ft_strlen',
      nombre: 'ft_strlen',
      nivel: 1,
      passedTests: 3,
      totalTests: 3,
      elapsedSeconds: 12,
      passed: true,
    },
    {
      id: 'ft_swap',
      nombre: 'ft_swap',
      nivel: 1,
      passedTests: 1,
      totalTests: 3,
      elapsedSeconds: 18,
      passed: false,
    },
  ])

  assert.equal(summary.totalExercises, 2)
  assert.equal(summary.completedExercises, 2)
  assert.equal(summary.testsPassed, 4)
  assert.equal(summary.testsTotal, 6)
  assert.equal(summary.scorePct, 67)
  assert.deepEqual(summary.failedExercises, ['ft_swap'])
  assert.deepEqual(summary.timeByExercise.ft_swap, 18)
})

test('getExamNavigationItems exposes the exam navbar targets', () => {
  const items = getExamNavigationItems()

  assert.deepEqual(items.map((item) => item.to), ['/', '/palacio', '/herramientas', '/progreso'])
  assert.deepEqual(items.map((item) => item.label), ['Inicio', 'Palacio', 'Herramientas', 'Progreso'])
})
