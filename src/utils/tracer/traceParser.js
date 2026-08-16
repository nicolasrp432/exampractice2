// Parses the stderr stream produced by the instrumented binary into an
// array of trace steps compatible with `normalizeGdbStep` in gdbTrace.js.
//
// Each probe emits a line like:
//   __TR__{"line":12,"fn":"ft_strlen","vars":{"i":3,"str":"hello"}}__/TR__
// We extract every `__TR__...__/TR__` block, JSON.parse the inner object,
// and turn it into a step descriptor with variables grouped into the shape
// the existing GdbStepper expects.

const PROBE_RE = /__TR__(\{[\s\S]*?\})__\/TR__/g

function valueToString(v) {
  if (v === null) return 'NULL'
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  return JSON.stringify(v)
}

function classifyValue(rawValue) {
  if (rawValue === null) return 'puntero'
  if (typeof rawValue === 'number') return 'int'
  if (typeof rawValue === 'string') {
    if (/^0x[0-9a-f]+$/i.test(rawValue)) return 'puntero'
    if (rawValue === 'NULL') return 'puntero'
    if (/^.\s\(\d+\)$/.test(rawValue) || /^\\x[0-9a-f]{2}\s\(\d+\)$/i.test(rawValue)) return 'char'
    return 'char *'
  }
  return 'valor'
}

function diffVariables(prev, current) {
  const previousByName = new Map((prev || []).map((v) => [v.name, v.value]))
  return current.map((v) => ({
    ...v,
    changed: previousByName.has(v.name) ? previousByName.get(v.name) !== v.value : true,
  }))
}

function buildStep(rawEvent, index, fileLabel, sourceCode, sourceLines, prevVariables) {
  if (rawEvent.truncated) {
    return {
      id: `tr-step-${index + 1}`,
      title: '⚠ Traza truncada',
      code: 'Demasiados pasos: la traza fue cortada.',
      line: null,
      functionName: 'sistema',
      file: null,
      variables: [],
      frames: [],
      memory: [],
      output: null,
      note: 'El instrumentador emite como mucho 8000 pasos para evitar trazas infinitas. Reduce el bucle o usa argumentos más pequeños.',
    }
  }

  const variables = Object.entries(rawEvent.vars || {}).map(([name, value]) => {
    const stringValue = valueToString(value)
    const kind = classifyValue(value)
    const isPointer = kind === 'puntero' || (kind === 'char *' && stringValue.startsWith('0x'))
    const address = kind === 'puntero' && stringValue !== 'NULL'
      ? stringValue
      : (typeof value === 'string' && /0x[0-9a-f]+/i.test(value)
          ? value.match(/0x[0-9a-f]+/i)[0]
          : null)
    return {
      name,
      type: kind,
      value: stringValue,
      address,
      changed: false,
      note: '',
    }
  })

  const withDiff = diffVariables(prevVariables, variables)

  const line = rawEvent.line ?? null
  const codeExcerpt = buildExcerpt(sourceLines, line)
  return {
    id: `tr-step-${index + 1}`,
    title: `Línea ${line ?? '?'} · ${rawEvent.fn ?? 'main'}`,
    code: codeExcerpt,
    line,
    functionName: rawEvent.fn ?? 'main',
    file: fileLabel,
    variables: withDiff,
    frames: [
      {
        functionName: rawEvent.fn ?? 'main',
        location: line && fileLabel ? `${fileLabel}:${line}` : null,
      },
    ],
    memory: withDiff
      .filter((v) => v.address)
      .map((v) => ({
        address: v.address,
        label: v.name,
        value: v.value,
        kind: v.type,
      })),
    output: null,
    note: '',
  }
}

function buildExcerpt(sourceLines, line, radius = 2) {
  if (!sourceLines.length || !Number.isInteger(line) || line < 1) return ''
  const start = Math.max(1, line - radius)
  const end = Math.min(sourceLines.length, line + radius)
  const out = []
  for (let n = start; n <= end; n++) {
    out.push(`${n}\t${sourceLines[n - 1] ?? ''}`)
  }
  return out.join('\n')
}

export function parseTraceStream(stderr, originalSource = '') {
  if (!stderr) return { steps: [], stdoutChunks: [] }
  const sourceLines = originalSource ? originalSource.split('\n') : []
  const steps = []
  let prevVariables = null
  let match
  PROBE_RE.lastIndex = 0
  while ((match = PROBE_RE.exec(stderr)) !== null) {
    let parsed
    try {
      parsed = JSON.parse(match[1])
    } catch {
      continue
    }
    const step = buildStep(parsed, steps.length, null, originalSource, sourceLines, prevVariables)
    steps.push(step)
    if (!parsed.truncated) {
      prevVariables = step.variables
    }
  }
  return { steps }
}

// Strip trace probes from stderr to recover the actual program stderr.
export function stripTraceFromStderr(stderr) {
  if (!stderr) return ''
  return stderr.replace(PROBE_RE, '').replace(/\n{3,}/g, '\n\n').trim()
}

// Attach the program stdout up to each step using a heuristic — the
// instrumented binary intermixes stdout and stderr through two file
// descriptors, so we can't reliably correlate offsets. We simply attach the
// final stdout to the last step (for now).
export function attachOutputToLastStep(steps, stdout) {
  if (!steps.length || !stdout) return steps
  const next = [...steps]
  next[next.length - 1] = {
    ...next[next.length - 1],
    output: stdout,
  }
  return next
}
