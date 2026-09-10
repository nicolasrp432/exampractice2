import { simulators } from './simulators/index.js'

const WANDBOX_URL = 'https://wandbox.org/api/compile.json'
const LOCAL_API_URL = typeof window !== 'undefined' ? '/api/compile-local' : 'http://localhost:3000/api/compile-local'

function parseDiagnosticLine(line, sourceLines) {
  const detailed = line.match(/^(.*?):(\d+):(\d+):\s*(fatal error|error|warning|note):\s*(.*)$/i)
  const simple = line.match(/^(.*?):(\d+):\s*(fatal error|error|warning|note):\s*(.*)$/i)

  const match = detailed || simple
  if (!match) return null

  const hasColumn = Boolean(detailed)
  const lineNumber = Number(match[2])
  const columnNumber = hasColumn ? Number(match[3]) : null
  const severity = hasColumn ? match[4] : match[3]
  const message = hasColumn ? match[5] : match[4]

  return {
    raw: line,
    file: match[1],
    line: lineNumber,
    column: columnNumber,
    severity,
    message,
    sourceLine: sourceLines[lineNumber - 1] ?? '',
  }
}

export function parseCompilerDiagnostics(compilerError, source = '') {
  if (!compilerError) return []

  const sourceLines = source ? source.split('\n') : []
  return String(compilerError)
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => parseDiagnosticLine(line, sourceLines))
    .filter(Boolean)
}

function parseStatus(rawStatus) {
  if (rawStatus === undefined || rawStatus === null) {
    return { exitCode: -1, signal: null }
  }
  const s = String(rawStatus).trim()
  const sigMatch = s.match(/signal\s+(\d+)/i)
  if (sigMatch) {
    return { exitCode: -1, signal: Number(sigMatch[1]) }
  }
  const n = parseInt(s, 10)
  return { exitCode: Number.isNaN(n) ? -1 : n, signal: null }
}

export async function compileAndRun(code, args = [], exerciseIdOrOptions = null, maybeOptions = {}) {
  let exerciseId = null
  let options = {}

  if (exerciseIdOrOptions && typeof exerciseIdOrOptions === 'object') {
    options = exerciseIdOrOptions
    exerciseId = options.exerciseId || null
  } else {
    exerciseId = exerciseIdOrOptions
    options = maybeOptions || {}
  }

  const {
    stdin = '',
    compilerOptions = '',
    compilerOptionRaw = '',
    compiler = 'gcc-head-c',
    strictMoulinette = true,
    timeoutMs = 3000,
  } = options

  // --- CAPA 1: Compilador Local Nativo (GCC con normas 42) ---
  try {
    const localRes = await fetch(LOCAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        args,
        stdin,
        compilerOptionRaw,
        strictMoulinette,
        timeoutMs,
      }),
    })

    if (localRes.ok) {
      const data = await localRes.json()
      if (!data.compilerUnavailable) {
        return {
          compileError: data.compileError,
          compileDiagnostics: parseCompilerDiagnostics(data.compileError, code),
          stdout: data.stdout ?? '',
          stderr: data.stderr ?? '',
          exitCode: data.exitCode ?? 0,
          signal: data.signal ?? null,
          isTimeout: Boolean(data.isTimeout),
          mode: 'local',
        }
      }
      console.warn('Compilador gcc local no disponible. Reintentando con Wandbox...')
    }
  } catch (err) {
    console.warn('Error al conectar con compilador local, intentando con Wandbox:', err.message)
  }

  // --- CAPA 2: Compilador Remoto (Wandbox) ---
  try {
    const res = await fetch(WANDBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        compiler,
        options: compilerOptions,
        stdin,
        'runtime-option-raw': args.map(String).join('\n'),
        'compiler-option-raw': compilerOptionRaw,
        save: false,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      const compileError =
        data.compiler_error && data.compiler_error.trim()
          ? data.compiler_error
          : null

      const { exitCode, signal } = parseStatus(data.status)

      return {
        compileError,
        compileDiagnostics: parseCompilerDiagnostics(compileError, code),
        compileMessage: data.compiler_message ?? '',
        stdout: data.program_output ?? '',
        stderr: data.program_error ?? '',
        exitCode,
        signal,
        mode: 'wandbox',
      }
    }
  } catch (err) {
    console.warn('Error al conectar con Wandbox:', err.message)
  }

  // --- CAPA 3: Simulador Mock en JavaScript (Fallback final offline) ---
  if (exerciseId && simulators[exerciseId]) {
    try {
      const stdout = simulators[exerciseId](args)
      return {
        compileError: null,
        compileDiagnostics: [],
        stdout,
        stderr: '',
        exitCode: 0,
        signal: null,
        mode: 'mock',
        isMock: true,
      }
    } catch (simErr) {
      return {
        compileError: `Error en simulador offline: ${simErr.message}`,
        compileDiagnostics: [],
        stdout: '',
        stderr: '',
        exitCode: -1,
        signal: null,
        mode: 'mock',
        isMock: true,
      }
    }
  }

  // Fallback seguro sin lanzar excepción destructiva
  return {
    compileError: 'Servicio de compilación temporalmente no disponible (Compilador local desconectado y Wandbox fuera de línea).',
    compileDiagnostics: [],
    stdout: '',
    stderr: 'No se pudo contactar ni con el compilador nativo local ni con el servidor remoto.',
    exitCode: -1,
    signal: null,
    mode: 'offline',
    networkError: 'Compilador fuera de línea',
  }
}
