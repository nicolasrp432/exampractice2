// Light-weight C source walker focused on the subset used by 42 exam
// exercises. It does NOT build an AST. It scans for top-level function
// definitions and, for each one, returns the brace span of its body together
// with a list of local variable declarations grouped by their lexical scope.
//
// Only the things the instrumenter needs are tracked:
//   - functions: name, signature, parameter list, body span
//   - locals: name, base type (int / char / unsigned / ...), pointer level,
//             array suffix, the position right after the declaration
//
// Pointer to struct, complex casts, function pointers and similar oddities
// are NOT handled. The instrumenter falls back gracefully when it can't
// parse a function body.

import { classifyRegions, isInsideSkip } from './tokens.js'

const TYPE_KEYWORDS = new Set([
  'void', 'char', 'short', 'int', 'long', 'float', 'double',
  'signed', 'unsigned', 'size_t', 'ssize_t', 'uint8_t', 'uint16_t',
  'uint32_t', 'uint64_t', 'int8_t', 'int16_t', 'int32_t', 'int64_t',
  't_list', 't_node',
])

const STORAGE_KEYWORDS = new Set(['static', 'const', 'register', 'volatile', 'extern'])

function isIdentStart(c) {
  return /[A-Za-z_]/.test(c)
}
function isIdent(c) {
  return /[A-Za-z0-9_]/.test(c)
}

function readIdent(src, i) {
  if (!isIdentStart(src[i])) return null
  let j = i + 1
  while (j < src.length && isIdent(src[j])) j++
  return { value: src.slice(i, j), end: j }
}

// Find matching closing brace for the `{` at position `open`. Respects
// the precomputed skip regions so nested strings / comments do not throw
// off the depth counter.
function matchBrace(src, regions, open) {
  let depth = 0
  let i = open
  while (i < src.length) {
    if (isInsideSkip(regions, i)) {
      i++
      continue
    }
    const c = src[i]
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return i
    }
    i++
  }
  return -1
}

function matchParen(src, regions, open) {
  let depth = 0
  let i = open
  while (i < src.length) {
    if (isInsideSkip(regions, i)) {
      i++
      continue
    }
    const c = src[i]
    if (c === '(') depth++
    else if (c === ')') {
      depth--
      if (depth === 0) return i
    }
    i++
  }
  return -1
}

// Scans forward from `i` (skipping noise) and returns the next code character
// position along with the character itself.
function peekCode(src, regions, i) {
  while (i < src.length) {
    if (isInsideSkip(regions, i)) {
      i++
      continue
    }
    if (/\s/.test(src[i])) {
      i++
      continue
    }
    return { pos: i, ch: src[i] }
  }
  return { pos: -1, ch: null }
}

// Walks the source looking for a sequence that matches a function definition:
//   <type-and-modifiers> <ident> ( <params> ) <attrs?> {
// On match returns a descriptor and advances the cursor past the closing brace.
function tryReadFunctionAt(src, regions, start) {
  let i = start
  // Type / storage class run.
  const typeTokens = []
  while (i < src.length) {
    if (isInsideSkip(regions, i)) {
      i++
      continue
    }
    if (/\s/.test(src[i])) { i++; continue }
    if (src[i] === '*') {
      typeTokens.push('*')
      i++
      continue
    }
    if (!isIdentStart(src[i])) break
    const ident = readIdent(src, i)
    if (!ident) break

    // Stop when we see something that doesn't look like a type keyword AND
    // the next non-space char is `(` — that's our function name.
    const after = peekCode(src, regions, ident.end)
    if (after.ch === '(') {
      if (typeTokens.length === 0) return null
      // ident.value is the function name.
      const parenOpen = after.pos
      const parenClose = matchParen(src, regions, parenOpen)
      if (parenClose === -1) return null
      // Look for the opening brace of the body.
      const afterParams = peekCode(src, regions, parenClose + 1)
      if (afterParams.ch !== '{') return null
      const braceOpen = afterParams.pos
      const braceClose = matchBrace(src, regions, braceOpen)
      if (braceClose === -1) return null
      return {
        name: ident.value,
        returnType: typeTokens.join(' ').replace(/\s+\*/g, '*').trim(),
        paramsStart: parenOpen + 1,
        paramsEnd: parenClose,
        bodyStart: braceOpen,
        bodyEnd: braceClose,
        end: braceClose + 1,
      }
    }
    if (STORAGE_KEYWORDS.has(ident.value) || TYPE_KEYWORDS.has(ident.value)) {
      typeTokens.push(ident.value)
      i = ident.end
      continue
    }
    // Could still be a type — accept any identifier as a type if we already
    // have at least one type token (handles typedefs not in our list).
    typeTokens.push(ident.value)
    i = ident.end
  }
  return null
}

export function findFunctions(src) {
  const regions = classifyRegions(src)
  const functions = []
  let i = 0
  while (i < src.length) {
    if (isInsideSkip(regions, i)) { i++; continue }
    if (/\s/.test(src[i])) { i++; continue }
    const fn = tryReadFunctionAt(src, regions, i)
    if (fn) {
      functions.push(fn)
      i = fn.end
    } else {
      i++
    }
  }
  return { functions, regions }
}

// Splits a function parameter list into individual parameter descriptors.
// "int argc, char **argv" → [{type:"int", pointers:0, name:"argc"}, ...]
export function parseParams(text) {
  const params = []
  const parts = []
  let depth = 0
  let buf = ''
  for (const c of text) {
    if (c === '(') { depth++; buf += c; continue }
    if (c === ')') { depth--; buf += c; continue }
    if (c === ',' && depth === 0) { parts.push(buf); buf = ''; continue }
    buf += c
  }
  if (buf.trim()) parts.push(buf)

  for (const raw of parts) {
    const trimmed = raw.trim()
    if (!trimmed || trimmed === 'void') continue
    const m = trimmed.match(/^(.*?)([A-Za-z_][A-Za-z0-9_]*)(\s*\[.*\])?$/)
    if (!m) continue
    const typePart = m[1].trim()
    const name = m[2]
    const arraySuffix = m[3] || ''
    const pointers = (typePart.match(/\*/g) || []).length
    const baseType = typePart.replace(/\*/g, '').trim() || 'int'
    params.push({
      name,
      baseType,
      pointers: pointers + (arraySuffix ? 1 : 0),
      arraySuffix,
    })
  }
  return params
}

// Inside a function body, finds local variable declarations at the top
// statement level (depth 0 relative to the body). Returns an array of
// { name, baseType, pointers, declEnd } where declEnd is the index right
// after the `;` that ends the declaration.
export function findLocalDeclarations(src, regions, body) {
  const decls = []
  let i = body.bodyStart + 1
  let depth = 0

  while (i < body.bodyEnd) {
    if (isInsideSkip(regions, i)) { i++; continue }
    const c = src[i]
    if (c === '{') { depth++; i++; continue }
    if (c === '}') { depth--; i++; continue }
    if (depth !== 0) { i++; continue }
    if (/\s/.test(c)) { i++; continue }

    // Attempt a declaration starting here.
    const start = i
    const collected = []
    let j = i
    let lastIdent = null
    let sawType = false

    while (j < body.bodyEnd) {
      if (isInsideSkip(regions, j)) { j++; continue }
      const cj = src[j]
      if (/\s/.test(cj)) { j++; continue }
      if (cj === '*') { collected.push('*'); j++; continue }
      if (!isIdentStart(cj)) break
      const id = readIdent(src, j)
      if (!id) break
      collected.push(id.value)
      if (TYPE_KEYWORDS.has(id.value) || STORAGE_KEYWORDS.has(id.value)) {
        sawType = true
      } else {
        lastIdent = id.value
      }
      j = id.end
      const peek = peekCode(src, regions, j)
      if (peek.ch === '=' || peek.ch === ';' || peek.ch === ',' || peek.ch === '[' || peek.ch === '(') break
    }

    // If we didn't see a type keyword and the next char is `(`, this is a
    // function call statement, not a declaration. Skip to the next `;`.
    const peek = peekCode(src, regions, j)
    if (!sawType || !lastIdent || peek.ch === '(' || peek.ch === null) {
      // Skip to ; at this depth.
      while (j < body.bodyEnd) {
        if (isInsideSkip(regions, j)) { j++; continue }
        const cj = src[j]
        if (cj === '{') { depth++ }
        else if (cj === '}') { depth-- }
        else if (cj === ';' && depth === 0) { j++; break }
        j++
      }
      i = j
      continue
    }

    // We have a declaration. Parse the rest until the closing `;`.
    // Each variable has its own optional `= value` and trailing `,`.
    const pointersBeforeName = collected.filter((t) => t === '*').length
    const typeTokens = collected.filter((t) => t !== '*' && t !== lastIdent)
    const baseType = typeTokens.join(' ').trim() || 'int'

    // Collect the first variable.
    const vars = [{ name: lastIdent, pointers: pointersBeforeName, arraySuffix: '' }]

    // Parse trailing siblings.
    let k = j
    let currentPointers = 0
    let pendingName = null
    let parenDepth = 0
    let bracketDepth = 0
    while (k < body.bodyEnd) {
      if (isInsideSkip(regions, k)) { k++; continue }
      const ck = src[k]
      if (ck === '(') { parenDepth++; k++; continue }
      if (ck === ')') { parenDepth--; k++; continue }
      if (ck === '[') { bracketDepth++; k++; continue }
      if (ck === ']') { bracketDepth--; k++; continue }
      if (ck === ';' && parenDepth === 0 && bracketDepth === 0) { k++; break }
      if (ck === ',' && parenDepth === 0 && bracketDepth === 0) {
        pendingName = null
        currentPointers = 0
        k++
        continue
      }
      if (ck === '*' && parenDepth === 0) { currentPointers++; k++; continue }
      if (ck === '=' || /\s/.test(ck)) { k++; continue }
      if (isIdentStart(ck)) {
        const id = readIdent(src, k)
        if (id && pendingName === null) {
          // Only treat as a new declared variable if directly preceded by
          // a comma or pointer in this loop — otherwise it's part of an
          // initializer expression.
          // Heuristic: it's a new var if it's the first ident we see at
          // this depth between the last `,` and the next `=`/`,`/`;`.
          const ahead = peekCode(src, regions, id.end)
          if (ahead.ch === '=' || ahead.ch === ',' || ahead.ch === ';' || ahead.ch === '[') {
            // Decide if this is a new variable or an rvalue. We treat it
            // as a new variable only if the previous non-space significant
            // char was `,` or `*`. Look backwards from k.
            let p = k - 1
            while (p >= 0 && /\s/.test(src[p])) p--
            const prev = src[p]
            if (prev === ',' || prev === '*') {
              pendingName = id.value
              vars.push({ name: id.value, pointers: currentPointers, arraySuffix: '' })
            }
          }
          k = id.end
          continue
        }
        k = id.end
        continue
      }
      k++
    }

    for (const v of vars) {
      decls.push({
        ...v,
        baseType,
        declEnd: k,
      })
    }
    i = k
  }
  return decls
}
