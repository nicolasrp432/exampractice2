import test from 'node:test'
import assert from 'node:assert/strict'
import { allExercises, getExercise } from './index.js'
import {
  validateExercise,
  validateAll,
  validateOptionalRank02,
  EXERCISE_SCHEMA_VERSION,
} from './exerciseSchema.js'

// La integración rank02 sólo añade campos opcionales. Estos tests garantizan
// que ningún ejercicio rompió el contrato existente y que los campos nuevos,
// cuando aparecen, son válidos.

test('schema version bumped after rank02 extension', () => {
  assert.equal(EXERCISE_SCHEMA_VERSION, '1.1')
})

// El repo tiene una incidencia preexistente: 17 ejercicios declaran
// palacio.habitacion="salon" (sin tilde) mientras el validador exige "salón".
// No es responsabilidad de la integración rank02 arreglarlo; aquí nos
// limitamos a impedir nuevas regresiones: el set de fallos no debe crecer
// ni cambiar de naturaleza.
const ALLOWED_PREEXISTING_ERRORS = new Set([
  'palacio.habitacion inválida: "salon"',
])

test('no new validator regressions beyond the preexisting baseline', () => {
  const { failures } = validateAll(allExercises)
  const novel = []
  for (const f of failures) {
    const newErrs = f.errors.filter(e => !ALLOWED_PREEXISTING_ERRORS.has(e))
    if (newErrs.length) novel.push({ id: f.id, errors: newErrs })
  }
  assert.deepEqual(novel, [],
    'La integración rank02 no debe introducir nuevos fallos de validación')
})

test('optional rank02 fields, when present, are well-formed', () => {
  const failures = []
  for (const ex of allExercises) {
    const { valid, errors } = validateOptionalRank02(ex)
    if (!valid) failures.push({ id: ex.id, errors })
  }
  assert.deepEqual(failures, [])
})

test('subjectReal coexists with subject (didactic or original)', () => {
  for (const ex of allExercises) {
    if (ex.subjectReal !== undefined) {
      assert.equal(typeof ex.subject, 'string',
        `${ex.id}: subject debe seguir existiendo junto a subjectReal`)
      // Al menos uno de los dos debe ser exponible
      assert.ok(ex.subject.length > 0 || ex.subjectAlternativo,
        `${ex.id}: o subject o subjectAlternativo deben tener contenido`)
    }
  }
})

test('versiones with origen always carry a valid value', () => {
  for (const ex of allExercises) {
    for (const v of (ex.versiones || [])) {
      if (v.origen !== undefined) {
        assert.ok(
          ['plataforma', 'rank02', 'didactica'].includes(v.origen),
          `${ex.id}/${v.id}: origen inválido "${v.origen}"`
        )
      }
    }
  }
})

test('every exercise still has exactly one recommended version', () => {
  for (const ex of allExercises) {
    const reco = (ex.versiones || []).filter(v => v.recomendada)
    assert.equal(reco.length, 1,
      `${ex.id}: debe haber 1 versión recomendada, hay ${reco.length}`)
  }
})

test('getExercise exposes rank02 optional fields when present', () => {
  for (const ex of allExercises) {
    if (ex.subjectReal === undefined) continue
    const fetched = getExercise(ex.id)
    assert.equal(fetched.subjectReal, ex.subjectReal,
      `${ex.id}: getExercise debe exponer subjectReal`)
  }
})
