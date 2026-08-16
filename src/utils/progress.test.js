import test from 'node:test'
import assert from 'node:assert/strict'
import { buildProgressModel } from './progress.js'

test('buildProgressModel computes global summary, weak spots, and history', () => {
  const model = buildProgressModel({
    exercises: [
      { id: 'a', nombre: 'A', nivel: 1, palacio: { emoji: '🟣' } },
      { id: 'b', nombre: 'B', nivel: 1, palacio: { emoji: '🟢' } },
      { id: 'c', nombre: 'C', nivel: 2, palacio: { emoji: '🟠' } },
    ],
    progressById: {
      a: { estado: 'dominado', intentos: 3, fallos: 0, notas: 'ok' },
      b: { estado: 'practicando', intentos: 5, fallos: 4, notas: '' },
      c: { estado: 'no_iniciado', intentos: 0, fallos: 0, notas: '' },
    },
    exams: [
      { timestamp: '2024-05-01T10:00:00.000Z', levels: [1], scorePct: 75, totalSeconds: 400, failedExercises: ['b'] },
      { timestamp: '2024-05-03T10:00:00.000Z', levels: [1, 2], scorePct: 50, totalSeconds: 1200, failedExercises: ['c'] },
    ],
    streak: 4,
    totalSessions: 2,
    lastSession: '2024-05-03T10:00:00.000Z',
  })

  assert.equal(model.masteredCount, 1)
  assert.equal(model.totalExercises, 3)
  assert.equal(model.masteredPct, 33)
  assert.deepEqual(model.levelStats.map((level) => level.pct), [50, 0, 0, 0])
  assert.deepEqual(model.weakSpots.map((spot) => spot.id), ['b'])
  assert.equal(model.totalPracticeSeconds, 1600)
  assert.deepEqual(model.examHistory.map((row) => row.timestamp), [
    '2024-05-03T10:00:00.000Z',
    '2024-05-01T10:00:00.000Z',
  ])
  assert.equal(model.miniCalendar.length, 7)
  assert.equal(model.miniCalendar.filter((day) => day.active).length, 4)
})
