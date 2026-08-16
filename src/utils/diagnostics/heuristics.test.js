import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyFailure, listHeuristics } from './heuristics.js'

// Helper para construir un resultado tipo compileAndRun
const ok = (stdout, extras = {}) => ({
  stdout,
  stderr: '',
  exitCode: 0,
  signal: null,
  compileError: null,
  ...extras,
})

const ex = (tipoEntrega = 'programa') => ({ id: 'demo', tipoEntrega })

test('lista de heurísticas registradas no está vacía', () => {
  const ids = listHeuristics()
  assert.ok(ids.length > 5, `esperaba más de 5 heurísticas, hay ${ids.length}`)
  assert.ok(ids.includes('segfault'))
  assert.ok(ids.includes('missing-newline'))
})

test('segfault dispara cuando signal=11', () => {
  const d = classifyFailure({
    test: { entrada: ['hola'], salida: 'hola\n', tipo: 'normal' },
    result: ok('', { signal: 11 }),
    exercise: ex(),
  })
  assert.equal(d?.id, 'segfault')
  assert.equal(d?.categoria, 'memoria')
  assert.equal(d?.severidad, 'mortal')
})

test('timeout dispara con signal=14', () => {
  const d = classifyFailure({
    test: { entrada: [], salida: '\n', tipo: 'edge' },
    result: ok('', { signal: 14 }),
    exercise: ex(),
  })
  assert.equal(d?.id, 'timeout')
})

test('error de compilación se reconoce', () => {
  const d = classifyFailure({
    test: { entrada: [], salida: '\n' },
    result: ok('', { compileError: 'demo.c:3:5: error: expected ‘;’' }),
    exercise: ex(),
  })
  assert.equal(d?.id, 'compile-error')
})

test('missing-newline dispara cuando solo falta el \\n final', () => {
  const d = classifyFailure({
    test: { entrada: ['hola'], salida: 'hola\n', tipo: 'normal' },
    result: ok('hola'),
    exercise: ex(),
  })
  assert.equal(d?.id, 'missing-newline')
})

test('extra-newline dispara cuando sobra un \\n', () => {
  const d = classifyFailure({
    test: { entrada: ['hola'], salida: 'hola' },
    result: ok('hola\n'),
    exercise: ex(),
  })
  assert.equal(d?.id, 'extra-newline')
})

test('truncated-tail: faltan los últimos 1-3 bytes', () => {
  const d = classifyFailure({
    test: { entrada: ['hola'], salida: 'hola\n' },
    result: ok('hol'),
    exercise: ex(),
  })
  assert.equal(d?.id, 'truncated-tail')
})

test('first-byte-differs: misma longitud, primer char distinto', () => {
  const d = classifyFailure({
    test: { entrada: ['abc'], salida: 'abc' },
    result: ok('bbc'),
    exercise: ex(),
  })
  assert.equal(d?.id, 'first-byte-differs')
})

test('no-argc-guard: tipo=programa, sin args, output no vacío cuando se esperaba \\n', () => {
  const d = classifyFailure({
    test: { entrada: [], salida: '\n', tipo: 'edge' },
    result: ok('something\n'),
    exercise: ex('programa'),
  })
  assert.equal(d?.id, 'no-argc-guard')
})

test('mid-divergence: cuando difiere en mitad del string', () => {
  const d = classifyFailure({
    test: { entrada: ['hello'], salida: 'hello world\n' },
    result: ok('hello WORLD\n'),
    exercise: ex(),
  })
  assert.equal(d?.id, 'mid-divergence')
  assert.match(d.titulo, /Divergencia en el byte/)
})

test('cuando todo está bien, no devuelve diagnóstico', () => {
  const d = classifyFailure({
    test: { entrada: ['hola'], salida: 'hola\n' },
    result: ok('hola\n'),
    exercise: ex(),
  })
  // Esto solo se llamaría en fallos, pero las heurísticas no deben
  // disparar en éxito.
  assert.equal(d, null)
})

test('cada heurística devuelve los campos requeridos', () => {
  // Probamos cada tipo de matcher
  const cases = [
    { result: ok('', { signal: 11 }), test: { entrada: [], salida: 'x' }, ex: ex() },
    { result: ok('', { compileError: 'err' }), test: { entrada: [], salida: 'x' }, ex: ex() },
    { result: ok('hola'), test: { entrada: [], salida: 'hola\n' }, ex: ex() },
  ]
  for (const c of cases) {
    const d = classifyFailure({ test: c.test, result: c.result, exercise: c.ex })
    assert.ok(d, 'esperaba diagnóstico')
    assert.ok(d.id, 'id requerido')
    assert.ok(d.categoria, 'categoria requerida')
    assert.ok(d.severidad, 'severidad requerida')
    assert.ok(d.titulo, 'titulo requerido')
    assert.ok(d.explicacion, 'explicacion requerida')
    assert.ok(['info', 'warning', 'mortal'].includes(d.severidad))
  }
})
