import { simulators } from './simulators/index.js'

const JUDGE0_URL = 'https://ce.judge0.com/submissions?base64_encoded=true&wait=true'
const WANDBOX_URL = 'https://wandbox.org/api/compile.json'
const LOCAL_API_URL = typeof window !== 'undefined' ? '/api/compile-local' : 'http://localhost:3000/api/compile-local'

// Circuit breakers con cooldown de 60 segundos para evitar saturar servicios caídos
let localServerFailedUntil = 0
let judge0FailedUntil = 0
let wandboxFailedUntil = 0

function isEndpointAvailable(failedUntilTimestamp) {
  return Date.now() > failedUntilTimestamp
}

function utf8ToBase64(str) {
  try {
    if (typeof window !== 'undefined' && window.btoa) {
      return window.btoa(unescape(encodeURIComponent(str || '')))
    }
    return Buffer.from(str || '', 'utf-8').toString('base64')
  } catch {
    return ''
  }
}

function base64ToUtf8(b64) {
  if (!b64) return ''
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return decodeURIComponent(escape(window.atob(b64)))
    }
    return Buffer.from(b64, 'base64').toString('utf-8')
  } catch {
    try {
      return window.atob(b64)
    } catch {
      return ''
    }
  }
}

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
  if (isEndpointAvailable(localServerFailedUntil)) {
    try {
      const localController = new AbortController()
      const localTimeout = setTimeout(() => localController.abort(), 2500)

      const localRes = await fetch(LOCAL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: localController.signal,
        body: JSON.stringify({
          code,
          args,
          stdin,
          compilerOptionRaw,
          strictMoulinette,
          timeoutMs,
        }),
      })
      clearTimeout(localTimeout)

      if (localRes.ok) {
        const contentType = localRes.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
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
        }
      }
      // Si respondió 404 o compilerUnavailable (como en despliegues estáticos / Vercel), pausar reintentos 60s
      localServerFailedUntil = Date.now() + 60000
    } catch {
      // Servidor local no disponible (ej: Vercel estático)
      localServerFailedUntil = Date.now() + 60000
    }
  }

  // --- CAPA 2: Compilador Online Judge0 CE (GCC C99 con -Wall -Wextra -Werror) ---
  if (isEndpointAvailable(judge0FailedUntil)) {
    try {
      const judge0Controller = new AbortController()
      const judge0Timeout = setTimeout(() => judge0Controller.abort(), 5000)

      const judge0Args = Array.isArray(args) ? args.map(String).join(' ') : String(args || '')
      const judge0Options = strictMoulinette ? '-Wall -Wextra -Werror -std=c99' : '-std=c99'

      const judge0Res = await fetch(JUDGE0_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: judge0Controller.signal,
        body: JSON.stringify({
          source_code: utf8ToBase64(code),
          language_id: 50, // C (GCC 9.2.0)
          command_line_arguments: judge0Args,
          stdin: utf8ToBase64(stdin || ''),
          compiler_options: judge0Options,
        }),
      })
      clearTimeout(judge0Timeout)

      if (judge0Res.ok) {
        const data = await judge0Res.json()
        const compileOutput = base64ToUtf8(data.compile_output)
        const stdout = base64ToUtf8(data.stdout)
        const stderr = base64ToUtf8(data.stderr)
        const statusId = data.status?.id

        if (statusId === 6 || compileOutput) {
          return {
            compileError: compileOutput || 'Error de compilación',
            compileDiagnostics: parseCompilerDiagnostics(compileOutput, code),
            stdout: '',
            stderr: stderr,
            exitCode: 1,
            signal: null,
            mode: 'judge0',
          }
        }

        return {
          compileError: null,
          compileDiagnostics: [],
          stdout,
          stderr,
          exitCode: data.exit_code ?? (statusId === 3 ? 0 : 1),
          signal: data.exit_signal ?? null,
          isTimeout: statusId === 5,
          mode: 'judge0',
        }
      } else {
        if (judge0Res.status >= 400) {
          judge0FailedUntil = Date.now() + 45000
        }
      }
    } catch {
      judge0FailedUntil = Date.now() + 45000
    }
  }

  // --- CAPA 3: Compilador Remoto Wandbox (Backup) ---
  if (isEndpointAvailable(wandboxFailedUntil)) {
    try {
      const wandboxController = new AbortController()
      const wandboxTimeout = setTimeout(() => wandboxController.abort(), 4000)

      const res = await fetch(WANDBOX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: wandboxController.signal,
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
      clearTimeout(wandboxTimeout)

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
      } else {
        wandboxFailedUntil = Date.now() + 60000
      }
    } catch {
      wandboxFailedUntil = Date.now() + 60000
    }
  }

  // --- CAPA 4: Simulador Mock en JavaScript (Fallback final offline instantáneo) ---
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
    compileError: 'Servicio de compilación temporalmente no disponible (Compiladores fuera de línea y sin simulador para este ejercicio).',
    compileDiagnostics: [],
    stdout: '',
    stderr: 'No se pudo contactar con los servicios de compilación ni con el motor offline.',
    exitCode: -1,
    signal: null,
    mode: 'offline',
    networkError: 'Compilador fuera de línea',
  }
}
