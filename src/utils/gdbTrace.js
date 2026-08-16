const POINTER_RE = /0x[0-9a-f]+/i

function countLines(text) {
  if (!text) return 0
  return String(text).split('\n').length
}

function extractLineNumber(code = '') {
  const match = String(code).match(/(?:^|\n)\s*(\d+)\t/)
  return match ? Number(match[1]) : null
}

function extractFunctionName(code = '', title = '') {
  const breakpointMatch = String(code).match(/Breakpoint\s+\d+,\s+([^(]+)\s*\(/)
  if (breakpointMatch) return breakpointMatch[1].trim()

  const titleMatch = String(title).match(/^\s*([a-z_][a-z0-9_]*)\b/i)
  if (titleMatch) return titleMatch[1]

  return 'main'
}

function extractFileLocation(code = '') {
  const match = String(code).match(/at\s+(.+?):(\d+)/)
  if (!match) return { file: null, line: null }

  return {
    file: match[1].trim(),
    line: Number(match[2]),
  }
}

function normalizeVariable(variable = {}) {
  const name = variable.name ?? variable.nombre ?? 'variable'
  const value = variable.value ?? variable.valor ?? ''
  const note = variable.note ?? variable.nota ?? ''
  const rawType = variable.type ?? variable.tipo ?? ''
  const isPointer = POINTER_RE.test(String(value)) || String(rawType).includes('*') || String(name).startsWith('*')

  return {
    name,
    value,
    type: rawType || (isPointer ? 'puntero' : 'valor'),
    note,
    changed: Boolean(variable.changed ?? variable.cambio ?? false),
    address: variable.address ?? (isPointer ? String(value).match(POINTER_RE)?.[0] ?? null : null),
    pointsTo: variable.pointsTo ?? null,
  }
}

function buildMemoryEntries(step) {
  const entries = []

  for (const variable of step.variables) {
    if (variable.address) {
      entries.push({
        address: variable.address,
        label: variable.name,
        value: variable.value,
        kind: variable.type,
      })
    }
  }

  return entries
}

export function normalizeGdbStep(step = {}, index = 0) {
  const code = step.code ?? step.codigo ?? ''
  const title = step.title ?? step.titulo ?? `Paso ${index + 1}`
  const lineNumber = step.line ?? extractLineNumber(code)
  const functionName = step.functionName ?? extractFunctionName(code, title)
  const location = extractFileLocation(code)
  const variables = (step.variables ?? []).map(normalizeVariable)
  const frames = step.stackFrames ?? step.frames ?? [
    {
      functionName,
      location: location.file && location.line ? `${location.file}:${location.line}` : null,
    },
  ]

  return {
    id: step.id ?? `gdb-step-${index + 1}`,
    index,
    title,
    code,
    lineNumber,
    functionName,
    file: step.file ?? location.file,
    variables,
    frames,
    memory: step.memory ?? buildMemoryEntries({ variables }),
    output: step.output ?? step.partialOutput ?? step.salida ?? null,
    note: step.note ?? step.notaRAM ?? '',
  }
}

export function normalizeGdbTrace(steps = []) {
  return steps.map((step, index) => normalizeGdbStep(step, index))
}

export function summarizeTrace(steps = []) {
  const normalized = normalizeGdbTrace(steps)
  return {
    steps: normalized,
    totalSteps: normalized.length,
    totalVariables: normalized.reduce((sum, step) => sum + step.variables.length, 0),
    totalFrames: normalized.reduce((sum, step) => sum + step.frames.length, 0),
    totalMemoryEntries: normalized.reduce((sum, step) => sum + step.memory.length, 0),
    hasPointers: normalized.some((step) => step.variables.some((variable) => variable.address)),
  }
}

export function formatMemoryAddress(address) {
  return address || '—'
}

export function formatCodeLineCount(code = '') {
  return countLines(code)
}
