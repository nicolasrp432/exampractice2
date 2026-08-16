// Manual smoke test for the instrumenter — instruments user code, writes
// the result to a temp file, compiles it with system gcc and runs it.
// Prints both the program stdout and the parsed trace steps.
//
// Run: node scripts/test-instrument.mjs

import { writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { instrument } from '../src/utils/tracer/instrumenter.js'
import { parseTraceStream, stripTraceFromStderr } from '../src/utils/tracer/traceParser.js'

const FT_STRLEN_USER = `int ft_strlen(char *str)
{
\tint i;

\ti = 0;
\twhile (str[i])
\t\ti++;
\treturn (i);
}
`

const HARNESS_MAIN = `
#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 2) { printf("0\\n"); return (0); }
\tprintf("%d\\n", ft_strlen(argv[1]));
\treturn (0);
}
`

const FULL = FT_STRLEN_USER + HARNESS_MAIN

function run(name, source, argv) {
  console.log(`\n=== ${name} (argv: ${JSON.stringify(argv)}) ===`)
  const { instrumented } = instrument(source)
  const dir = mkdtempSync(join(tmpdir(), 'tracer-'))
  const cFile = join(dir, 'prog.c')
  const exe = join(dir, 'prog')
  writeFileSync(cFile, instrumented, 'utf8')
  try {
    execSync(`gcc -std=c99 -O0 -o ${exe} ${cFile}`, { stdio: 'pipe' })
  } catch (err) {
    console.error('compile failed:\n', err.stderr.toString())
    rmSync(dir, { recursive: true, force: true })
    return
  }
  let stdout = ''
  let stderr = ''
  try {
    const result = execSync(`${exe} ${argv.map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(' ')}`, {
      stdio: 'pipe',
      timeout: 5000,
    })
    stdout = result.toString()
  } catch (err) {
    stdout = err.stdout?.toString() ?? ''
    stderr = err.stderr?.toString() ?? ''
    if (err.status === null) {
      console.error('runtime error:', err.message)
    }
  }
  // execSync collapses stderr unless we run differently — re-run with redirection.
  try {
    const both = execSync(
      `${exe} ${argv.map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(' ')} 2>${dir}/stderr.log`,
      { stdio: 'pipe', timeout: 5000 }
    )
    stdout = both.toString()
    stderr = execSync(`cat ${dir}/stderr.log`).toString()
  } catch {}

  console.log('stdout:', JSON.stringify(stdout))
  console.log('stderr (clean):', JSON.stringify(stripTraceFromStderr(stderr)))
  const { steps } = parseTraceStream(stderr, source)
  console.log(`steps: ${steps.length}`)
  for (const s of steps) {
    const vars = s.variables.map((v) => `${v.name}=${v.value}`).join(' ')
    console.log(`  L${s.line ?? '?'} ${s.functionName.padEnd(10)} | ${vars}`)
  }
  rmSync(dir, { recursive: true, force: true })
}

run('ft_strlen "hello"', FULL, ['hello'])
run('ft_strlen ""', FULL, [''])

// ft_swap — pointers + multiple args
const SWAP = `void ft_swap(int *a, int *b)
{
\tint tmp;
\ttmp = *a;
\t*a = *b;
\t*b = tmp;
}
#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tint a = atoi(argv[1]);
\tint b = atoi(argv[2]);
\tft_swap(&a, &b);
\tprintf("%d %d\\n", a, b);
\treturn (0);
}
`
run('ft_swap 3 7', SWAP, ['3', '7'])

// ft_strcpy — char array dest
const STRCPY = `char *ft_strcpy(char *dst, char *src)
{
\tint i;
\ti = 0;
\twhile (src[i])
\t{
\t\tdst[i] = src[i];
\t\ti++;
\t}
\tdst[i] = 0;
\treturn (dst);
}
#include <stdio.h>
int main(int argc, char **argv)
{
\tchar dst[100];
\tft_strcpy(dst, argv[1]);
\tprintf("%s\\n", dst);
\treturn (0);
}
`
run('ft_strcpy "abc"', STRCPY, ['abc'])

// fizzbuzz — programa-tipo, sin args
const FIZZBUZZ = `#include <stdio.h>
int main(void)
{
\tint i;
\ti = 1;
\twhile (i <= 5)
\t{
\t\tif (i % 15 == 0)
\t\t\tprintf("FizzBuzz\\n");
\t\telse if (i % 3 == 0)
\t\t\tprintf("Fizz\\n");
\t\telse if (i % 5 == 0)
\t\t\tprintf("Buzz\\n");
\t\telse
\t\t\tprintf("%d\\n", i);
\t\ti++;
\t}
\treturn (0);
}
`
run('fizzbuzz', FIZZBUZZ, [])

// ft_atoi — multi-step parsing
const ATOI = `int ft_atoi(char *str)
{
\tint i;
\tint sign;
\tint result;

\ti = 0;
\tsign = 1;
\tresult = 0;
\twhile (str[i] == ' ' || (str[i] >= 9 && str[i] <= 13))
\t\ti++;
\tif (str[i] == '-' || str[i] == '+')
\t{
\t\tif (str[i] == '-')
\t\t\tsign = -1;
\t\ti++;
\t}
\twhile (str[i] >= '0' && str[i] <= '9')
\t{
\t\tresult = result * 10 + (str[i] - '0');
\t\ti++;
\t}
\treturn (result * sign);
}
#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 2) { printf("0\\n"); return (0); }
\tprintf("%d\\n", ft_atoi(argv[1]));
\treturn (0);
}
`
run('ft_atoi "-42"', ATOI, ['-42'])
run('ft_atoi "  +123abc"', ATOI, ['  +123abc'])
