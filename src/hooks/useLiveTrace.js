import { useCallback, useRef, useState } from 'react'
import { compileAndRun } from '@/utils/compiler'
import { instrument } from '@/utils/tracer/instrumenter'
import { parseTraceStream, stripTraceFromStderr, attachOutputToLastStep } from '@/utils/tracer/traceParser'
import { useTraceCache, makeTraceKey } from '@/hooks/useTraceCache'

// Hook returning a function that takes `(fullSource, args, stdin)` and
// returns `{ steps, stdout, stderr, exitCode, signal, compileError }`.
// Instruments the source, sends to Wandbox, parses stderr into steps.
// Caches results by (source + args + stdin) hash to avoid re-running.
// `status` exposes idle | running | done | error | cached.
export function useLiveTrace() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const cache = useTraceCache()
  const inflight = useRef(0)

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setResult(null)
  }, [])

  const run = useCallback(async (fullSource, args = [], stdin = '') => {
    const runId = ++inflight.current
    setError(null)

    const cacheKey = makeTraceKey(fullSource, args, stdin)
    const hit = cache.get(cacheKey)
    if (hit) {
      setStatus('cached')
      setResult(hit)
      return hit
    }

    setStatus('running')
    setResult(null)

    let instrumentedCode
    let originalSource = fullSource
    try {
      const { instrumented } = instrument(fullSource)
      instrumentedCode = instrumented
    } catch (err) {
      if (runId !== inflight.current) return null
      setStatus('error')
      setError('No se pudo instrumentar el código: ' + err.message)
      return null
    }

    let runResult
    try {
      runResult = await compileAndRun(instrumentedCode, args, { stdin })
    } catch (err) {
      if (runId !== inflight.current) return null
      setStatus('error')
      setError('Error de red con el compilador: ' + err.message)
      return null
    }

    if (runId !== inflight.current) return null

    if (runResult.compileError) {
      setStatus('error')
      setError(
        'El código instrumentado no compila. Suele significar que el parser no ' +
        'entendió alguna construcción (macro, sintaxis poco común). Revisa el ' +
        'panel "Ejecutar" para ver el error exacto.'
      )
      const payload = {
        steps: [],
        stdout: runResult.stdout,
        stderr: stripTraceFromStderr(runResult.stderr),
        exitCode: runResult.exitCode,
        signal: runResult.signal,
        compileError: runResult.compileError,
        instrumentedSource: instrumentedCode,
      }
      setResult(payload)
      return payload
    }

    const { steps } = parseTraceStream(runResult.stderr, originalSource)
    const finalSteps = attachOutputToLastStep(steps, runResult.stdout)
    const cleanStderr = stripTraceFromStderr(runResult.stderr)

    const payload = {
      steps: finalSteps,
      stdout: runResult.stdout,
      stderr: cleanStderr,
      exitCode: runResult.exitCode,
      signal: runResult.signal,
      compileError: null,
      instrumentedSource: instrumentedCode,
    }
    setResult(payload)
    setStatus(finalSteps.length ? 'done' : 'error')
    if (!finalSteps.length) {
      setError(
        'El programa se ejecutó pero no emitió pasos de traza. ' +
        'Puede que tu código no use ninguna función instrumentable, o que el ' +
        'parser haya saltado tu función por una construcción que no reconoce.'
      )
    } else {
      cache.set(cacheKey, payload)
    }
    return payload
  }, [cache])

  return { run, reset, status, error, result }
}
