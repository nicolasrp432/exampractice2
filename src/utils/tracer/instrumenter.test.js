import { test } from 'node:test'
import assert from 'node:assert/strict'
import { instrument } from './instrumenter.js'
import { findFunctions, findLocalDeclarations, parseParams } from './parser.js'
import { classifyRegions } from './tokens.js'

const FT_STRLEN = `int\tft_strlen(char *str)
{
\tint\ti;

\ti = 0;
\twhile (str[i])
\t\ti++;
\treturn (i);
}

#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 2) { printf("0\\n"); return (0); }
\tprintf("%d\\n", ft_strlen(argv[1]));
\treturn (0);
}`

test('parser finds top-level functions', () => {
  const { functions } = findFunctions(FT_STRLEN)
  const names = functions.map((f) => f.name)
  assert.ok(names.includes('ft_strlen'))
  assert.ok(names.includes('main'))
})

test('parser identifies local declarations', () => {
  const { functions, regions } = findFunctions(FT_STRLEN)
  const ft = functions.find((f) => f.name === 'ft_strlen')
  const decls = findLocalDeclarations(FT_STRLEN, regions, ft)
  const iDecl = decls.find((d) => d.name === 'i')
  assert.ok(iDecl, 'should find local "i"')
  assert.equal(iDecl.baseType, 'int')
  assert.equal(iDecl.pointers, 0)
})

test('parser parses params', () => {
  const params = parseParams('char *str')
  assert.deepEqual(params, [{ name: 'str', baseType: 'char', pointers: 1, arraySuffix: '' }])
})

test('instrument injects runtime + probes', () => {
  const { instrumented, runtime, functions } = instrument(FT_STRLEN)
  assert.ok(runtime, 'runtime should be injected')
  assert.ok(instrumented.includes('__tr_begin'), 'probes should be present')
  assert.ok(instrumented.includes('__tr_str("str"'), 'should trace string param')
  assert.ok(instrumented.includes('__tr_int("i"'), 'should trace int local')
  const ftNames = functions.map((f) => f.name)
  assert.ok(ftNames.includes('ft_strlen'))
})

test('instrument leaves strings and comments alone', () => {
  const code = `int main(void) {
    char *s = "hello {; }";
    /* tricky ; comment */
    // line ;
    return 0;
  }`
  const { instrumented } = instrument(code)
  assert.ok(instrumented.includes('"hello {; }"'), 'should preserve string literal')
  assert.ok(instrumented.includes('/* tricky ; comment */'), 'should preserve block comment')
})

test('regions classify strings as skip', () => {
  const code = 'int x = 1; char *s = ";";'
  const regions = classifyRegions(code)
  const skips = regions.filter((r) => r.kind === 'skip')
  assert.ok(skips.length >= 1)
})

test('does not break a function without locals', () => {
  const code = `void noop(void) { return; }`
  const { instrumented } = instrument(code)
  assert.ok(instrumented.includes('__tr_begin'))
  assert.ok(instrumented.includes('return;'))
})
