import test from 'node:test'
import assert from 'node:assert/strict'
import { exercisesByLevel } from './index.js'
import { validateAll } from './exerciseSchema.js'

test('level 1 exercises are fully defined', () => {
  const level1 = exercisesByLevel[1]

  assert.equal(level1.length, 12)

  const result = validateAll(level1)

  assert.equal(result.allValid, true)
  assert.deepEqual(result.failures, [])
})
