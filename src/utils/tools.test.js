import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildQuizQuestions,
  decodeSubject,
  getToolById,
  getToolTrainingExercises,
  getUniversalTools,
} from './tools.js'

test('getUniversalTools returns the seven canonical tools', () => {
  const tools = getUniversalTools()

  assert.equal(tools.length, 7)
  assert.deepEqual(
    tools.map((tool) => tool.id),
    ['strings', 'ascii', 'argc', 'bandera', 'recursion', 'bits', 'malloc']
  )
  assert.equal(getToolById('bits').label, 'Bits')
})

test('decodeSubject maps a subject to the expected tools', () => {
  const result = decodeSubject('Write a program that trims duplicate spaces from argv and prints the first word')

  assert.deepEqual(result.toolIds, ['strings', 'argc', 'bandera'])
  assert.ok(result.keywords.includes('argv'))
  assert.ok(result.keywords.includes('spaces'))
  assert.ok(result.keywords.includes('word'))
})

test('decodeSubject produces a short skeleton for the detected tools', () => {
  const result = decodeSubject('void ft_putchar(char c); expected files: ft_putchar.c')

  assert.ok(result.skeleton.includes('void ft_putchar(char c)'))
  assert.ok(result.skeleton.includes('{'))
})

test('buildQuizQuestions returns ten multiple choice questions', () => {
  const questions = buildQuizQuestions()

  assert.equal(questions.length, 10)
  for (const question of questions) {
    assert.equal(question.options.length, 4)
    assert.ok(Number.isInteger(question.correctIndex))
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4)
  }
})

test('getToolTrainingExercises returns related exercises for a tool', () => {
  const exercises = getToolTrainingExercises('bits')

  assert.ok(exercises.some((exercise) => exercise.id === 'print_bits'))
  assert.ok(exercises.some((exercise) => exercise.id === 'reverse_bits'))
})
