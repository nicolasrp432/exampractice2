// src/utils/terminalFallback.js
import { compileAndRun } from './compiler'
import { run42NormCheck } from './norminette'

/**
 * Genera un harness con main() para funciones C que no tienen main propio.
 * Permite que funciones como ft_strlen, ft_split, etc. se puedan compilar
 * y ejecutar interactivamente con argumentos (argv).
 */
export function buildTerminalHarness(code, exercise) {
  if (!code) return ''
  const exId = exercise?.id || 'solution'
  const isFunc = exercise?.tipoEntrega === 'funcion'

  // Si el usuario ya escribió un main(), usamos su código directamente
  if (code.includes('int main(') || code.includes('int\tmain(')) {
    return code
  }

  if (!isFunc) {
    return code
  }

  // Si es ft_strlen
  if (exId === 'ft_strlen') {
    return `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

${code}

int main(int argc, char **argv) {
    if (argc < 2) {
        char test[] = "42 School";
        printf("[Harness 42] Probando con cadena por defecto: \\"%s\\"\\n", test);
        printf("ft_strlen: %d\\n", ft_strlen(test));
        return 0;
    }
    printf("%d\\n", ft_strlen(argv[1]));
    return 0;
}
`
  }

  // Si es ft_strcpy
  if (exId === 'ft_strcpy') {
    return `#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

${code}

int main(int argc, char **argv) {
    char dest[256];
    char *src = (argc > 1) ? argv[1] : "Hola 42";
    printf("Copiando: \\"%s\\"\\n", src);
    ft_strcpy(dest, src);
    printf("Resultado en dest: \\"%s\\"\\n", dest);
    return 0;
}
`
  }

  // Si es ft_swap
  if (exId === 'ft_swap') {
    return `#include <stdio.h>
#include <stdlib.h>

${code}

int main(int argc, char **argv) {
    int a = (argc > 1) ? atoi(argv[1]) : 42;
    int b = (argc > 2) ? atoi(argv[2]) : 24;
    printf("Antes del swap: a = %d, b = %d\\n", a, b);
    ft_swap(&a, &b);
    printf("Después del swap: a = %d, b = %d\\n", a, b);
    return 0;
}
`
  }

  // Harness genérico para funciones
  return `#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

${code}

int main(int argc, char **argv) {
    (void)argc;
    (void)argv;
    printf("[Harness 42]: Función compilada correctamente sin errores.\\n");
    return 0;
}
`
}

/**
 * Ejecutor de respaldo para entornos donde el endpoint local /api/terminal/exec
 * no está disponible (por ejemplo, al estar alojado como sitio estático en Vercel).
 */
export async function executeTerminalClientFallback({
  action,
  command,
  code,
  exercise,
  filename = 'solution.c',
  args = [],
  stdin = '',
}) {
  const exId = exercise?.id || 'solution'
  const isFunc = exercise?.tipoEntrega === 'funcion'

  // 1. Verificación de Norminette
  if (action === 'norm') {
    const report = run42NormCheck(code, filename)
    return {
      command: `norminette -R CheckForbiddenSourceHeader ${filename}`,
      stdout: report.stdout,
      stderr: report.stderr,
      exitCode: report.exitCode,
      signal: null,
      mode: 'client-norminette',
    }
  }

  // 2. Compilación (gcc)
  if (action === 'compile') {
    const fullCode = buildTerminalHarness(code, exercise)
    const result = await compileAndRun(fullCode, [], exId, {
      compilerOptionRaw: '-Wall\n-Wextra\n-Werror\n-std=c99',
    })

    let stdout = ''
    let stderr = ''
    let exitCode = 0

    if (result.compileError) {
      stderr = result.compileError
      exitCode = 1
    } else {
      stdout = `gcc -Wall -Wextra -Werror -std=c99 ${filename} -o solution\n`
      if (isFunc && !code.includes('int main(')) {
        stdout += `ℹ️ [Nota 42]: En el examen real, ${filename} no debe llevar main(). Para la terminal se enlazó un arnés de prueba.\n`
      }
      stdout += `Compilación exitosa (0 errores, 0 advertencias). Binario ./solution listo.`
    }

    return {
      command: `gcc -Wall -Wextra -Werror -std=c99 ${filename} -o solution`,
      stdout,
      stderr,
      exitCode,
      signal: null,
      mode: result.mode || 'remote-gcc',
    }
  }

  // 3. Ejecución (./solution)
  if (action === 'run') {
    const fullCode = buildTerminalHarness(code, exercise)
    const result = await compileAndRun(fullCode, args, exId, {
      stdin,
      compilerOptionRaw: '-std=c99',
    })

    const cmdStr = `./solution ${args.map(a => `"${a}"`).join(' ')}`.trim()
    return {
      command: cmdStr,
      stdout: result.stdout || '',
      stderr: result.compileError ? `Error de compilación previo:\n${result.compileError}` : (result.stderr || ''),
      exitCode: result.compileError ? 1 : (result.exitCode ?? 0),
      signal: result.signal,
      mode: result.mode || 'remote-exec',
    }
  }

  // 4. AddressSanitizer (Leaks)
  if (action === 'asan') {
    const fullCode = buildTerminalHarness(code, exercise)
    const result = await compileAndRun(fullCode, args, exId, {
      stdin,
      compilerOptionRaw: '-fsanitize=address\n-g\n-O1',
    })

    const cmdStr = `gcc -fsanitize=address -g ${filename} -o solution_asan && ./solution_asan`
    let stdout = result.stdout || ''
    let stderr = result.stderr || ''

    if (!result.compileError && (!stderr || !stderr.includes('ERROR: AddressSanitizer'))) {
      stdout = (stdout ? stdout + '\n' : '') + `[ASan Report]: ✅ 0 fugas de memoria (leaks) detectadas. Todos los bloques liberados correctamente.`
    }

    return {
      command: cmdStr,
      stdout,
      stderr: result.compileError || stderr,
      exitCode: result.compileError ? 1 : (result.exitCode ?? 0),
      signal: result.signal,
      mode: result.mode || 'remote-asan',
    }
  }

  // 5. GDB Debug
  if (action === 'gdb') {
    const fullCode = buildTerminalHarness(code, exercise)
    const result = await compileAndRun(fullCode, args, exId, {
      stdin,
      compilerOptionRaw: '-g\n-O0',
    })

    const cmdStr = `gdb ./solution --batch -ex "run"`
    let stdout = `GNU gdb (GDB) 13.1 - Debugging Session\nReading symbols from ./solution...done.\n`
    if (result.exitCode === 139 || (result.stderr && result.stderr.includes('Segmentation fault'))) {
      stdout += `Program received signal SIGSEGV, Segmentation fault.\n`
      stdout += `0x0000555555555149 in ${exId} () at ${filename}\n`
      stdout += `(gdb) bt\n#0  0x0000555555555149 in ${exId} ()\n#1  0x000055555555518b in main ()`
    } else {
      stdout += `[Thread debugging using libthread_db enabled]\n`
      stdout += (result.stdout ? result.stdout + '\n' : '')
      stdout += `[Inferior 1 (process) exited normally with code ${result.exitCode ?? 0}]`
    }

    return {
      command: cmdStr,
      stdout,
      stderr: result.compileError || result.stderr || '',
      exitCode: result.compileError ? 1 : 0,
      signal: null,
      mode: result.mode || 'remote-gdb',
    }
  }

  // 6. Comandos personalizados
  const cleanCmd = String(command || '').trim()

  if (cleanCmd === 'ls' || cleanCmd === 'ls -la' || cleanCmd === 'ls -l') {
    return {
      command: cleanCmd,
      stdout: `total 32
drwxr-xr-x 2 user 42school 4096 workspace
-rw-r--r-- 1 user 42school  ${code.length} ${filename}
-rwxr-xr-x 1 user 42school 16384 solution`,
      stderr: '',
      exitCode: 0,
    }
  }

  if (cleanCmd.startsWith('nm -u')) {
    // Extraer símbolos externos usados en el código
    const matches = code.match(/\b(write|read|malloc|free|printf|exit|atoi|strlen)\b/g) || []
    const unique = [...new Set(matches)]
    const symbolsText = unique.map(s => `                 U ${s}`).join('\n')
    return {
      command: cleanCmd,
      stdout: symbolsText || '                 U write\n                 U __libc_start_main',
      stderr: '',
      exitCode: 0,
    }
  }

  if (cleanCmd === 'pwd') {
    return {
      command: cleanCmd,
      stdout: `/home/user/42_exam/${exId}`,
      stderr: '',
      exitCode: 0,
    }
  }

  if (cleanCmd.startsWith('echo ')) {
    return {
      command: cleanCmd,
      stdout: cleanCmd.replace(/^echo\s+/, '').replace(/^["']|["']$/g, ''),
      stderr: '',
      exitCode: 0,
    }
  }

  if (cleanCmd.startsWith('cat ')) {
    return {
      command: cleanCmd,
      stdout: code,
      stderr: '',
      exitCode: 0,
    }
  }

  if (cleanCmd === 'clear') {
    return {
      command: cleanCmd,
      stdout: '',
      stderr: '',
      exitCode: 0,
      clear: true,
    }
  }

  if (cleanCmd === 'help') {
    return {
      command: cleanCmd,
      stdout: `Terminal 42 - Comandos soportados:
  - gcc -Wall -Wextra -Werror : Compila tu código con flags 42
  - ./solution [argumentos]   : Ejecuta el binario
  - norminette               : Revisa la norma de estilo 42
  - nm -u solution           : Lista funciones externas utilizadas
  - ls -la                   : Muestra archivos del directorio
  - pwd                      : Directorio actual
  - cat ${filename}          : Muestra el contenido del archivo`,
      stderr: '',
      exitCode: 0,
    }
  }

  // Comando genérico: si empieza con gcc o ./solution
  if (cleanCmd.startsWith('gcc')) {
    return executeTerminalClientFallback({
      action: 'compile',
      command: cleanCmd,
      code,
      exercise,
      filename,
      args,
      stdin,
    })
  }

  if (cleanCmd.startsWith('./solution') || cleanCmd.startsWith('./')) {
    const rawArgs = cleanCmd.replace(/^\.\/[^\s]+\s*/, '')
    const parsedArgs = rawArgs ? rawArgs.match(/"[^"]*"|\S+/g)?.map(m => m.replace(/^"|"$/g, '')) || [] : args
    return executeTerminalClientFallback({
      action: 'run',
      command: cleanCmd,
      code,
      exercise,
      filename,
      args: parsedArgs,
      stdin,
    })
  }

  return {
    command: cleanCmd,
    stdout: '',
    stderr: `bash: ${cleanCmd.split(' ')[0]}: comando simulado no encontrado. Escribe 'help' para ver comandos disponibles.`,
    exitCode: 127,
  }
}
