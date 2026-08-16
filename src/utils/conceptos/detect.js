// Heuristic concept detector. Given a source code line (and optionally
// the variables present at that step), returns an array of concept IDs
// that match the patterns we know about. Used as a fallback when an
// exercise doesn't declare explicit per-line concepts.

const HEURISTICS = [
  {
    id: 'deref-asignacion',
    test: (line) => /\*\s*\w+\s*=\s*\*\s*\w+/.test(line),
  },
  {
    id: 'deref-lectura',
    test: (line) => /=\s*\*\s*\w+\s*[^=]/.test(line) && !/\*\s*\w+\s*=/.test(line),
  },
  {
    id: 'puntero-decl',
    test: (line) => /\b(?:int|char|unsigned|long|void|float|double|t_\w+)\s*\*+\s*\w+\s*[;=,)]/.test(line),
  },
  {
    id: 'paso-por-puntero',
    test: (line) => /&\s*[a-zA-Z_]\w*/.test(line) && /\(/.test(line),
  },
  {
    id: 'post-incremento',
    test: (line) => /\w+\+\+/.test(line) && !/\+\+\w+/.test(line),
  },
  {
    id: 'pre-incremento',
    test: (line) => /\+\+\w+/.test(line),
  },
  {
    id: 'loop-hasta-null',
    test: (line) =>
      /while\s*\(\s*\*?\s*\w+(\s*\[\s*\w+\s*\])?\s*\)/.test(line),
  },
  {
    id: 'asignacion-array',
    test: (line) => /\w+\s*\[\s*\w+\s*\]\s*=/.test(line),
  },
  {
    id: 'argumentos-programa',
    test: (line) => /\bargv\s*\[|\bargc\b/.test(line),
  },
  {
    id: 'malloc-check',
    test: (line) => /malloc\s*\(/.test(line) || /\bfree\s*\(/.test(line),
  },
  {
    id: 'modulo-fizzbuzz',
    test: (line) => /%\s*\d+/.test(line),
  },
  {
    id: 'recursion',
    test: (line, ctx) =>
      ctx?.fnName &&
      new RegExp(`\\b${ctx.fnName}\\s*\\(`).test(line) &&
      !/^\s*(?:[a-zA-Z_]\w*\s+)+\*?\s*[a-zA-Z_]\w*\s*\(/.test(line), // not the declaration
  },
]

// Match a declarative matcher against a step.
// matcher can be:
//  - 'line:N'        → matches the step whose lineNumber === N
//  - RegExp          → tested against the active code line
//  - string          → substring match against the active code line
function declarativeMatch(matcher, { codeLine, lineNumber }) {
  if (!matcher) return false
  if (typeof matcher === 'string') {
    const m = matcher.match(/^line:(\d+)$/)
    if (m) return Number(m[1]) === lineNumber
    return codeLine.includes(matcher)
  }
  if (matcher instanceof RegExp) return matcher.test(codeLine)
  return false
}

// Get the actual line of source code for a step. The step's `code` is
// usually a small excerpt: a few lines around the active one, formatted
// as `N\tcontent`. Extract the active one.
export function extractActiveLine(step) {
  if (!step) return ''
  const code = step.code || ''
  const targetLine = step.lineNumber
  if (!targetLine) return ''
  for (const raw of code.split('\n')) {
    const m = raw.match(/^\s*(\d+)\t(.*)$/)
    if (m && Number(m[1]) === targetLine) return m[2]
  }
  return ''
}

export function detectConceptos(step, exerciseConceptos = []) {
  const codeLine = extractActiveLine(step)
  const lineNumber = step?.lineNumber ?? null
  const fnName = step?.functionName ?? null

  const ids = []
  const seen = new Set()

  // Layer 1: declarative (per-exercise)
  for (const entry of exerciseConceptos) {
    if (declarativeMatch(entry.matcher, { codeLine, lineNumber })) {
      if (!seen.has(entry.id)) {
        seen.add(entry.id)
        ids.push({ id: entry.id, hint: entry.hint || null, source: 'declarativo' })
      }
    }
  }

  // Layer 2: heuristic fallback (only if no declarative matched)
  if (ids.length === 0 && codeLine) {
    for (const h of HEURISTICS) {
      if (h.test(codeLine, { fnName })) {
        if (!seen.has(h.id)) {
          seen.add(h.id)
          ids.push({ id: h.id, hint: null, source: 'heuristico' })
        }
        if (ids.length >= 3) break
      }
    }
  }

  return ids
}
