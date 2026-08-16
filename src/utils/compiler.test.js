import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCompilerDiagnostics } from './compiler.js'

test('parseCompilerDiagnostics extracts line, column, and source context', () => {
  const diagnostics = parseCompilerDiagnostics(
    'main.c:3:5: error: expected \';\' before \'}\' token\nmain.c:7: error: unknown type name \'foo\'',
    'int main()\n{\n    return 0\n}\n'
  )

  assert.equal(diagnostics.length, 2)
  assert.deepEqual(diagnostics[0], {
    raw: "main.c:3:5: error: expected ';' before '}' token",
    file: 'main.c',
    line: 3,
    column: 5,
    severity: 'error',
    message: "expected ';' before '}' token",
    sourceLine: '    return 0',
  })
  assert.equal(diagnostics[1].line, 7)
  assert.equal(diagnostics[1].column, null)
  assert.equal(diagnostics[1].sourceLine, '')
})
