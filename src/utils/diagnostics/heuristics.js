// src/utils/diagnostics/heuristics.js
//
// Heurísticas data-driven para diagnosticar tests fallidos en PracticeMode.
//
// Cada heurística mira (test, result, exercise) y, si encuentra un patrón
// reconocible, devuelve un objeto:
//   { id, categoria, severidad, titulo, explicacion, accion?, ejemplo? }
//
// - categoria: 'output' | 'argc' | 'memoria' | 'compilacion' | 'tiempo' | 'otro'
// - severidad: 'info' | 'warning' | 'mortal'
// - accion:    opcional, sugerencia operativa que el usuario puede aplicar.
//
// classifyFailure devuelve la PRIMERA heurística que dispara, en orden
// de prioridad. Si nada dispara, devuelve null y el llamador muestra un
// genérico.
//
// Cada función es pura y testeable.

const HEURISTICS = []

function register(h) { HEURISTICS.push(h) }

// ── 1. Crash por señal ────────────────────────────────────────────────────────
register({
  id: 'segfault',
  match: ({ result }) => result?.signal === 11,
  build: ({ test, exercise }) => ({
    id: 'segfault',
    categoria: 'memoria',
    severidad: 'mortal',
    titulo: 'SIGSEGV — acceso a memoria inválida',
    explicacion:
      `El programa crasheó con segfault para entrada=${JSON.stringify(test.entrada)}. ` +
      (test.entrada.length === 0
        ? 'Como no hay argumentos, probablemente accedes a argv[1] sin comprobar argc.'
        : 'Suele ser deferencia de NULL, índice fuera de límites o lectura más allá del \\0.'),
    accion: exercise?.tipoEntrega === 'programa'
      ? 'Añade una guarda `if (argc != N) { write(1, "\\n", 1); return 0; }` antes de tocar argv[1].'
      : 'Revisa cada `*ptr` y cada `arr[i]`: ¿puede ser ptr=NULL? ¿puede i pasarse del tamaño?',
  }),
})

register({
  id: 'sigabrt',
  match: ({ result }) => result?.signal === 6,
  build: ({ test }) => ({
    id: 'sigabrt',
    categoria: 'memoria',
    severidad: 'mortal',
    titulo: 'SIGABRT — abort()',
    explicacion:
      `El programa abortó para entrada=${JSON.stringify(test.entrada)}. ` +
      'Las causas típicas son free() doble o sobre puntero inválido, o assert fallido.',
    accion: 'Si usas malloc/free: marca cada puntero con NULL tras hacerle free, y comprueba antes de liberar.',
  }),
})

register({
  id: 'sigfpe',
  match: ({ result }) => result?.signal === 8,
  build: ({ test }) => ({
    id: 'sigfpe',
    categoria: 'otro',
    severidad: 'mortal',
    titulo: 'SIGFPE — división por cero',
    explicacion:
      `Entrada=${JSON.stringify(test.entrada)}: tu programa hizo a / 0 o a % 0.`,
    accion: 'Comprueba el divisor antes de la operación: `if (b == 0) { /* manejar */ }`.',
  }),
})

register({
  id: 'timeout',
  match: ({ result }) => result?.signal === 14 || result?.signal === 24,
  build: () => ({
    id: 'timeout',
    categoria: 'tiempo',
    severidad: 'mortal',
    titulo: 'Timeout / bucle infinito',
    explicacion: 'El programa tardó demasiado o quedó en bucle infinito.',
    accion: 'Revisa todas las condiciones de `while` y `for`: ¿alguna variable de control nunca avanza? ¿olvidaste `i++`?',
  }),
})

// ── 2. Errores de compilación ────────────────────────────────────────────────
register({
  id: 'compile-error',
  match: ({ result }) => Boolean(result?.compileError),
  build: ({ result }) => {
    const msg = result.compileError || ''
    const m = msg.match(/error:\s*([^\n]+)/i)
    const first = m ? m[1].trim() : msg.split('\n').find(Boolean) || 'sin detalle'
    return {
      id: 'compile-error',
      categoria: 'compilacion',
      severidad: 'mortal',
      titulo: 'No compila',
      explicacion: `gcc rechazó tu código: «${first}»`,
      accion: 'Lee el detalle en el panel "Ejecutar". Si es por -Werror, ese warning es real (no lo silencies).',
    }
  },
})

// ── 3. Salida vacía cuando se esperaba algo ──────────────────────────────────
register({
  id: 'empty-output',
  match: ({ result, test }) =>
    !result?.compileError &&
    !result?.signal &&
    (result?.stdout === '' || result?.stdout === undefined) &&
    test?.salida &&
    test.salida !== '',
  build: ({ test }) => ({
    id: 'empty-output',
    categoria: 'output',
    severidad: 'mortal',
    titulo: 'Salida vacía',
    explicacion:
      `Se esperaba ${JSON.stringify(test.salida)} pero el programa no imprimió nada. ` +
      'Suele significar que entras en una rama early-return o que el `while` no se ejecuta nunca.',
    accion: 'Añade un `write(1, "DEBUG\\n", 6)` antes del bucle principal y vuelve a correr: confirmas si se llega.',
  }),
})

// ── 4. Solo falta el newline final ───────────────────────────────────────────
register({
  id: 'missing-newline',
  match: ({ result, test }) => {
    if (!result?.stdout || !test?.salida) return false
    if (result.stdout === test.salida) return false
    return result.stdout + '\n' === test.salida
  },
  build: () => ({
    id: 'missing-newline',
    categoria: 'output',
    severidad: 'warning',
    titulo: 'Falta el \\n final',
    explicacion:
      'Tu salida es idéntica a la esperada salvo por el `\\n` final. La Moulinette compara byte a byte y eso suspende el test.',
    accion: 'Antes del `return (0)`, añade `write(1, "\\n", 1);`.',
  }),
})

// ── 5. Sobra el newline final ────────────────────────────────────────────────
register({
  id: 'extra-newline',
  match: ({ result, test }) => {
    if (!result?.stdout || test?.salida === undefined) return false
    if (result.stdout === test.salida) return false
    return result.stdout === test.salida + '\n'
  },
  build: () => ({
    id: 'extra-newline',
    categoria: 'output',
    severidad: 'warning',
    titulo: 'Sobra un \\n al final',
    explicacion: 'Tu salida coincide con la esperada salvo por un newline extra al final.',
    accion: 'Quita una llamada `write(1, "\\n", 1)` duplicada — quizás la tienes dentro del bucle Y después.',
  }),
})

// ── 6. Off-by-one al inicio o al final ───────────────────────────────────────
register({
  id: 'truncated-tail',
  match: ({ result, test }) => {
    if (!result?.stdout || !test?.salida) return false
    if (result.stdout === test.salida) return false
    // got es un prefijo de expected, faltando 1-3 chars al final.
    const diff = test.salida.length - result.stdout.length
    return diff > 0 && diff <= 3 && test.salida.startsWith(result.stdout)
  },
  build: ({ result, test }) => ({
    id: 'truncated-tail',
    categoria: 'output',
    severidad: 'mortal',
    titulo: `Se cortan los últimos ${test.salida.length - result.stdout.length} bytes`,
    explicacion:
      'Tu salida es el inicio de la esperada pero termina antes. ' +
      'Suele ser un off-by-one en el bucle: `while (i < n - 1)` o `while (*p && p[1])`.',
    accion: 'Comprueba la condición de salida del último bucle: ¿se queda corto en 1 iteración?',
  }),
})

register({
  id: 'extra-prefix',
  match: ({ result, test }) => {
    if (!result?.stdout || !test?.salida) return false
    if (result.stdout === test.salida) return false
    const diff = result.stdout.length - test.salida.length
    return diff > 0 && diff <= 3 && result.stdout.endsWith(test.salida)
  },
  build: ({ result, test }) => ({
    id: 'extra-prefix',
    categoria: 'output',
    severidad: 'warning',
    titulo: `Bytes extra al principio (${result.stdout.length - test.salida.length})`,
    explicacion: 'Tu salida termina igual a la esperada pero empieza con bytes de más.',
    accion: 'Revisa si imprimes algo de DEBUG o un prefijo antes del bucle.',
  }),
})

// ── 7. Mismo tamaño, primer byte distinto → off-by-one en el primer write ────
register({
  id: 'first-byte-differs',
  match: ({ result, test }) => {
    if (!result?.stdout || !test?.salida) return false
    if (result.stdout === test.salida) return false
    return result.stdout.length === test.salida.length &&
      result.stdout.charAt(0) !== test.salida.charAt(0)
  },
  build: ({ result, test }) => ({
    id: 'first-byte-differs',
    categoria: 'output',
    severidad: 'warning',
    titulo: `Primer byte distinto (esperado '${test.salida.charAt(0)}', obtenido '${result.stdout.charAt(0)}')`,
    explicacion:
      'La longitud coincide pero arrancas con el carácter incorrecto. Suele ser un fence-post: ' +
      'estás empezando en `i=1` cuando deberías empezar en `i=0` (o viceversa).',
    accion: 'Mira el primer write/printf: ¿imprime `str[i]` o `str[i+1]`?',
  }),
})

// ── 8. Argc no comprobado (sin args y output de strings no vacío) ────────────
register({
  id: 'no-argc-guard',
  match: ({ result, test, exercise }) => {
    if (exercise?.tipoEntrega !== 'programa') return false
    if (test.entrada.length > 0) return false
    if (result?.signal) return false
    // Falló el test sin argumentos y la salida no es solo \n o cadena vacía
    return test.salida && result?.stdout !== test.salida &&
           test.salida.trim() === '' && (result?.stdout || '').trim() !== ''
  },
  build: () => ({
    id: 'no-argc-guard',
    categoria: 'argc',
    severidad: 'mortal',
    titulo: 'Probablemente accedes a argv[1] sin comprobar argc',
    explicacion:
      'Sin argumentos se esperaba sólo `\\n` (o nada). Tu programa imprimió otra cosa. ' +
      'Muy probable: entras al bucle de procesamiento sin verificar argc.',
    accion: 'Al inicio del main: `if (argc != N) { write(1, "\\n", 1); return 0; }`.',
  }),
})

// ── 9. Diferencia importante en mitad del string ─────────────────────────────
register({
  id: 'mid-divergence',
  match: ({ result, test }) => {
    if (!result?.stdout || !test?.salida) return false
    if (result.stdout === test.salida) return false
    // Encuentra la primera divergencia
    const min = Math.min(result.stdout.length, test.salida.length)
    let i = 0
    while (i < min && result.stdout[i] === test.salida[i]) i++
    return i > 0 && i < min   // diverge en mitad, no en el borde
  },
  build: ({ result, test }) => {
    const min = Math.min(result.stdout.length, test.salida.length)
    let i = 0
    while (i < min && result.stdout[i] === test.salida[i]) i++
    const ctxStart = Math.max(0, i - 4)
    const ctxEnd   = Math.min(test.salida.length, i + 4)
    return {
      id: 'mid-divergence',
      categoria: 'output',
      severidad: 'mortal',
      titulo: `Divergencia en el byte ${i}`,
      explicacion:
        `Hasta el byte ${i} coinciden. Esperado a partir de ahí: «${test.salida.slice(ctxStart, ctxEnd)}». ` +
        `Obtenido: «${result.stdout.slice(ctxStart, ctxEnd)}». ` +
        'Lo más común: un caso del switch/if mal mapeado, o que un carácter se transforma con la regla equivocada.',
      accion: `Reproduce el input ${JSON.stringify(test.entrada)} en el panel "Ejecutar" e inspecciona el trace en el byte ${i}.`,
    }
  },
})

/**
 * Clasifica un fallo y devuelve la primera heurística que matchea.
 *
 * @param {object} args
 * @param {object} args.test      - { entrada, salida, tipo, ... }
 * @param {object} args.result    - { stdout, stderr, signal, exitCode, compileError }
 * @param {object} args.exercise  - el ejercicio completo (para tipoEntrega, etc.)
 * @returns {object|null}
 */
export function classifyFailure(args) {
  for (const h of HEURISTICS) {
    try {
      if (h.match(args)) {
        return h.build(args)
      }
    } catch {
      // las heurísticas son defensivas: nunca deben romper el caller
    }
  }
  return null
}

/**
 * Para tests pasivos (utilidades, depuración). Expone la lista en orden.
 */
export function listHeuristics() {
  return HEURISTICS.map(h => h.id)
}
