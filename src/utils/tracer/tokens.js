// Small character-level scanner that knows about C strings, char literals,
// line comments and block comments. It does NOT produce a real token stream;
// it just exposes utilities to walk a C source while skipping content that
// must not be transformed (so we never inject tracing calls inside a string
// literal or a comment).

export function skipWhitespace(src, i) {
  while (i < src.length && /\s/.test(src[i])) i++
  return i
}

// Returns the index right after the closing element if `i` is positioned at
// the opening of a string / char / comment, or `i` itself otherwise.
export function skipNonCode(src, i) {
  if (i >= src.length) return i
  const c = src[i]
  const next = src[i + 1]

  if (c === '/' && next === '/') {
    let j = i + 2
    while (j < src.length && src[j] !== '\n') j++
    return j
  }
  if (c === '/' && next === '*') {
    let j = i + 2
    while (j < src.length - 1 && !(src[j] === '*' && src[j + 1] === '/')) j++
    return Math.min(src.length, j + 2)
  }
  if (c === '"' || c === "'") {
    const quote = c
    let j = i + 1
    while (j < src.length && src[j] !== quote) {
      if (src[j] === '\\' && j + 1 < src.length) j += 2
      else j++
    }
    return Math.min(src.length, j + 1)
  }
  if (c === '#') {
    // Preprocessor line — skip to end of line (respect line continuations).
    let j = i + 1
    while (j < src.length) {
      if (src[j] === '\\' && src[j + 1] === '\n') { j += 2; continue }
      if (src[j] === '\n') break
      j++
    }
    return j
  }
  return i
}

// Walks the source and returns an array of "regions" tagged either "code"
// or "skip". The whole source is covered, no gaps. Useful for fast lookups
// when we need to decide if a character is real code or noise.
export function classifyRegions(src) {
  const regions = []
  let i = 0
  let codeStart = 0
  while (i < src.length) {
    const after = skipNonCode(src, i)
    if (after === i) {
      i++
      continue
    }
    if (i > codeStart) {
      regions.push({ kind: 'code', start: codeStart, end: i })
    }
    regions.push({ kind: 'skip', start: i, end: after })
    i = after
    codeStart = i
  }
  if (codeStart < src.length) {
    regions.push({ kind: 'code', start: codeStart, end: src.length })
  }
  return regions
}

export function isInsideSkip(regions, pos) {
  for (const r of regions) {
    if (pos < r.start) return false
    if (pos < r.end) return r.kind === 'skip'
  }
  return false
}

// Computes a function that returns the 1-based source line of a position.
export function makeLineLookup(src) {
  const offsets = [0]
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '\n') offsets.push(i + 1)
  }
  return function lineAt(pos) {
    // Binary search.
    let lo = 0
    let hi = offsets.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (offsets[mid] <= pos) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }
}
