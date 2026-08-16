// Pragmatic C instrumenter for the 42 exam subset. Given a complete C source
// (user code + harness) it returns:
//   - `instrumented`  : a transformed source with trace probes injected
//   - `lineMap`       : maps instrumented line numbers back to original lines
//   - `functions`     : list of instrumented functions with their locals
//
// The transformation never reorders or deletes user statements, only inserts
// braced `{ __TR_BEGIN(...); ... __TR_END(); }` blocks after each `;` at the
// top statement level of every function body, plus a probe at the entry of
// the body and one right before each `return`.
//
// If a function can't be parsed safely it is left untouched. Code that the
// parser doesn't understand (preprocessor macros, function pointers, ...)
// just becomes "uninstrumented" — the rest of the file is still usable.

import { classifyRegions, isInsideSkip } from './tokens.js'
import { findFunctions, parseParams, findLocalDeclarations } from './parser.js'

const RUNTIME_HEADER = `
/* ===== __tracer runtime — injected ===== */
#include <stdio.h>
#include <stddef.h>
#define __TR_PREFIX "__TR__"
#define __TR_SUFFIX "__/TR__"
static int __tr_first_field = 0;
static unsigned long __tr_steps_emitted = 0;
static const unsigned long __TR_MAX_STEPS = 8000;
static void __tr_begin(int line, const char *fn) {
    if (__tr_steps_emitted >= __TR_MAX_STEPS) return;
    fprintf(stderr, __TR_PREFIX "{\\"line\\":%d,\\"fn\\":\\"%s\\",\\"vars\\":{", line, fn);
    __tr_first_field = 1;
}
static void __tr_sep(const char *name) {
    if (__tr_steps_emitted >= __TR_MAX_STEPS) return;
    if (!__tr_first_field) fputc(',', stderr);
    __tr_first_field = 0;
    fprintf(stderr, "\\"%s\\":", name);
}
static void __tr_int(const char *name, long long v) {
    if (__tr_steps_emitted >= __TR_MAX_STEPS) return;
    __tr_sep(name);
    fprintf(stderr, "%lld", v);
}
static void __tr_uint(const char *name, unsigned long long v) {
    if (__tr_steps_emitted >= __TR_MAX_STEPS) return;
    __tr_sep(name);
    fprintf(stderr, "%llu", v);
}
static void __tr_char(const char *name, int v) {
    if (__tr_steps_emitted >= __TR_MAX_STEPS) return;
    __tr_sep(name);
    unsigned char c = (unsigned char)v;
    if (c >= 0x20 && c < 0x7f && c != '"' && c != '\\\\') {
        fprintf(stderr, "\\"%c (%d)\\"", c, (int)c);
    } else {
        fprintf(stderr, "\\"\\\\x%02x (%d)\\"", c, (int)c);
    }
}
static void __tr_ptr(const char *name, const void *v) {
    if (__tr_steps_emitted >= __TR_MAX_STEPS) return;
    __tr_sep(name);
    if (!v) fputs("\\"NULL\\"", stderr);
    else fprintf(stderr, "\\"%p\\"", v);
}
static void __tr_str(const char *name, const char *v) {
    if (__tr_steps_emitted >= __TR_MAX_STEPS) return;
    __tr_sep(name);
    if (!v) { fputs("null", stderr); return; }
    fputc('"', stderr);
    size_t n = 0;
    while (v[n] && n < 256) {
        unsigned char c = (unsigned char)v[n++];
        if (c == '"') fputs("\\\\\\"", stderr);
        else if (c == '\\\\') fputs("\\\\\\\\", stderr);
        else if (c == '\\n') fputs("\\\\n", stderr);
        else if (c == '\\t') fputs("\\\\t", stderr);
        else if (c == '\\r') fputs("\\\\r", stderr);
        else if (c < 0x20 || c == 0x7f) fprintf(stderr, "\\\\u%04x", c);
        else fputc(c, stderr);
    }
    if (v[n]) fputs("\\\\u2026", stderr);
    fputc('"', stderr);
}
static void __tr_end(void) {
    if (__tr_steps_emitted >= __TR_MAX_STEPS) {
        if (__tr_steps_emitted == __TR_MAX_STEPS) {
            fprintf(stderr, __TR_PREFIX "{\\"truncated\\":true}" __TR_SUFFIX "\\n");
            __tr_steps_emitted++;
        }
        return;
    }
    fputs("}}" __TR_SUFFIX "\\n", stderr);
    __tr_steps_emitted++;
}
/* ===== end __tracer runtime ===== */

`

// Classifies a local declaration into one of the runtime helpers.
function classifyVar(decl) {
  const t = (decl.baseType || '').replace(/\s+/g, ' ').trim()
  const ptr = (decl.pointers || 0) + (decl.arraySuffix ? 1 : 0)

  if (ptr === 0) {
    if (t === 'char' || t === 'signed char' || t === 'unsigned char') return 'char'
    if (t.includes('unsigned')) return 'uint'
    if (
      t === 'int' || t === 'long' || t === 'long long' ||
      t === 'short' || t.endsWith('int8_t') || t.endsWith('int16_t') ||
      t.endsWith('int32_t') || t.endsWith('int64_t') || t === 'size_t' ||
      t === 'ssize_t'
    ) return 'int'
    // Unknown scalar — skip rather than risk a type mismatch.
    return null
  }
  if (ptr === 1 && t === 'char') return 'str'
  return 'ptr'
}

function helperFor(kind) {
  switch (kind) {
    case 'int': return '__tr_int'
    case 'uint': return '__tr_uint'
    case 'char': return '__tr_char'
    case 'str': return '__tr_str'
    case 'ptr': return '__tr_ptr'
    default: return null
  }
}

function buildProbe(line, fnName, scopedVars) {
  const parts = [`__tr_begin(${line}, ${JSON.stringify(fnName)});`]
  for (const v of scopedVars) {
    const helper = helperFor(v.kind)
    if (!helper) continue
    parts.push(`${helper}("${v.name}", (${v.expr}));`)
  }
  parts.push('__tr_end();')
  return `{ ${parts.join(' ')} }`
}

// Picks the variables that are *in scope* at a given source offset, given
// the list of declarations and the declaration end positions.
function scopeAt(allVars, offset) {
  return allVars.filter((v) => v.declEnd <= offset)
}

// Finds candidate insertion points in a function body: positions right after
// a `;` that's not inside a parenthesized expression (so we never break a
// `for(init; cond; step)` header). Returns an array of insertion offsets
// inside braced blocks of arbitrary nesting depth.
function findInsertPoints(src, regions, body) {
  const points = []
  let i = body.bodyStart + 1
  let braceDepth = 0
  let parenDepth = 0
  while (i < body.bodyEnd) {
    if (isInsideSkip(regions, i)) { i++; continue }
    const c = src[i]
    if (c === '{') { braceDepth++; i++; continue }
    if (c === '}') { braceDepth--; i++; continue }
    if (c === '(') { parenDepth++; i++; continue }
    if (c === ')') { parenDepth--; i++; continue }
    if (c === ';' && parenDepth === 0) {
      // Skip the `else` follow-up which would split an `if ... ; else ...`.
      let j = i + 1
      while (j < body.bodyEnd && /\s/.test(src[j])) j++
      const peek = src.slice(j, j + 4)
      if (peek.startsWith('else') && !/[A-Za-z0-9_]/.test(src[j + 4] || '')) {
        i = j
        continue
      }
      // Don't inject after a `;` that's the end of a single-statement loop
      // or if body without braces — the probe would land outside the loop.
      // Detection: walk backwards over the current statement and check if
      // the enclosing controller (while/for/if/else) had no `{` after its
      // condition. We handle this by wrapping bodyless controllers in
      // wrapBodylessControllers() instead, so by the time this runs every
      // controlled body is wrapped in braces and the probe lands correctly.
      points.push(i + 1)
      i++
      continue
    }
    i++
  }
  return points
}

// Detects control statements with a bodyless single-statement body
// (`if (c) stmt;`, `while (c) stmt;`, `for (a;b;c) stmt;`, `else stmt;`)
// at any depth inside the function body and returns the offsets at which
// braces need to be inserted: one open right after the `)` (or `else`) and
// one close right after the terminating `;`.
function findBodylessWraps(src, regions, body) {
  const wraps = []
  const keywords = ['if', 'while', 'for']
  let i = body.bodyStart + 1
  while (i < body.bodyEnd) {
    if (isInsideSkip(regions, i)) { i++; continue }
    const c = src[i]
    if (!/[A-Za-z_]/.test(c)) { i++; continue }
    let matched = null
    for (const kw of keywords) {
      if (src.slice(i, i + kw.length) === kw && !/[A-Za-z0-9_]/.test(src[i + kw.length] || '')) {
        matched = kw
        break
      }
    }
    if (!matched) {
      // Maybe `else`.
      if (src.slice(i, i + 4) === 'else' && !/[A-Za-z0-9_]/.test(src[i + 4] || '')) {
        // Find the start of the else body.
        let j = i + 4
        while (j < body.bodyEnd && /\s/.test(src[j])) j++
        // `else if` — let the next iteration handle the `if`.
        if (src.slice(j, j + 2) === 'if' && !/[A-Za-z0-9_]/.test(src[j + 2] || '')) {
          i = j
          continue
        }
        if (src[j] !== '{') {
          // Wrap from j to end-of-statement.
          const stmtEnd = scanStatementEnd(src, regions, j, body.bodyEnd)
          if (stmtEnd > j) wraps.push({ open: j, close: stmtEnd })
        }
        i = j
        continue
      }
      // Skip identifier so we don't re-scan inside it.
      while (i < body.bodyEnd && /[A-Za-z0-9_]/.test(src[i])) i++
      continue
    }
    // Match the condition parens.
    let j = i + matched.length
    while (j < body.bodyEnd && /\s/.test(src[j])) j++
    if (src[j] !== '(') {
      i = j
      continue
    }
    const close = matchParenAt(src, regions, j)
    if (close === -1) { i = j; continue }
    let k = close + 1
    while (k < body.bodyEnd && /\s/.test(src[k])) k++
    if (src[k] === '{') {
      // Already braced.
      i = k + 1
      continue
    }
    if (src[k] === ';') {
      // Empty body — skip.
      i = k + 1
      continue
    }
    const stmtEnd = scanStatementEnd(src, regions, k, body.bodyEnd)
    if (stmtEnd > k) wraps.push({ open: k, close: stmtEnd })
    i = stmtEnd
  }
  return wraps
}

function matchParenAt(src, regions, open) {
  let depth = 0
  let i = open
  while (i < src.length) {
    if (isInsideSkip(regions, i)) { i++; continue }
    if (src[i] === '(') depth++
    else if (src[i] === ')') { depth--; if (depth === 0) return i }
    i++
  }
  return -1
}

// Scans from `start` (positioned at the first character of a statement) and
// returns the offset right after the `;` that ends it, respecting nested
// braces and parens.
function scanStatementEnd(src, regions, start, limit) {
  let i = start
  let brace = 0
  let paren = 0
  while (i < limit) {
    if (isInsideSkip(regions, i)) { i++; continue }
    const c = src[i]
    if (c === '{') { brace++; i++; continue }
    if (c === '}') {
      brace--
      i++
      if (brace <= 0) return i
      continue
    }
    if (c === '(') { paren++; i++; continue }
    if (c === ')') { paren--; i++; continue }
    if (c === ';' && brace === 0 && paren === 0) return i + 1
    i++
  }
  return i
}

// Finds `return` keywords at the top depth of the body. For each, returns
// `{ keywordStart }`. We insert the probe right before the keyword.
function findReturnPoints(src, regions, body) {
  const points = []
  let i = body.bodyStart + 1
  let braceDepth = 0
  let parenDepth = 0
  while (i < body.bodyEnd) {
    if (isInsideSkip(regions, i)) { i++; continue }
    const c = src[i]
    if (c === '{') { braceDepth++; i++; continue }
    if (c === '}') { braceDepth--; i++; continue }
    if (c === '(') { parenDepth++; i++; continue }
    if (c === ')') { parenDepth--; i++; continue }
    if (braceDepth === 0 && parenDepth === 0 && c === 'r') {
      const slice = src.slice(i, i + 6)
      if (slice === 'return' && !/[A-Za-z0-9_]/.test(src[i + 6] || '')) {
        // Make sure we are at a statement boundary: previous non-space code
        // char should be `;`, `{`, or nothing (start of body).
        let p = i - 1
        while (p > body.bodyStart && /\s/.test(src[p])) p--
        const prev = src[p]
        if (prev === ';' || prev === '{' || prev === '}') {
          points.push(i)
        }
        i += 6
        continue
      }
    }
    i++
  }
  return points
}

function lineOfOffset(src, offset) {
  let line = 1
  for (let i = 0; i < offset; i++) if (src[i] === '\n') line++
  return line
}

function safeFunctionName(name) {
  return name.replace(/[^A-Za-z0-9_]/g, '_')
}

export function instrument(source) {
  if (!source || typeof source !== 'string') {
    return { instrumented: source ?? '', lineMap: [], functions: [], runtime: false }
  }

  // Step 1: wrap any bodyless control statements so probes land inside the
  // controlled block. We do this in a separate pre-pass that produces a new
  // source string, then re-parse it.
  let prepared = source
  {
    const { functions: fns0, regions: regs0 } = findFunctions(prepared)
    const wraps = []
    for (const fn of fns0) {
      for (const w of findBodylessWraps(prepared, regs0, fn)) {
        wraps.push(w)
      }
    }
    // Sort right-to-left so offsets stay valid as we splice.
    wraps.sort((a, b) => b.close - a.close)
    for (const w of wraps) {
      prepared = prepared.slice(0, w.close) + ' }' + prepared.slice(w.close)
      prepared = prepared.slice(0, w.open) + '{ ' + prepared.slice(w.open)
    }
  }

  const { functions, regions } = findFunctions(prepared)
  if (!functions.length) {
    return { instrumented: prepared, lineMap: [], functions: [], runtime: false }
  }

  // Pre-compute insertion edits. Each edit: { at, text }.
  const edits = []
  const instrumentedFunctions = []

  for (const fn of functions) {
    const paramText = prepared.slice(fn.paramsStart, fn.paramsEnd)
    const params = parseParams(paramText).map((p) => {
      const ptr = (p.pointers || 0)
      const looksStr = ptr === 1 && p.baseType === 'char'
      const kind = ptr === 0
        ? ((p.baseType.includes('unsigned')) ? 'uint'
            : (p.baseType === 'char' ? 'char' : 'int'))
        : (looksStr ? 'str' : 'ptr')
      return { name: p.name, kind, expr: p.name, declEnd: fn.bodyStart + 1 }
    })

    const localDecls = findLocalDeclarations(prepared, regions, fn)
    const locals = localDecls
      .map((d) => {
        const kind = classifyVar(d)
        if (!kind) return null
        return { name: d.name, kind, expr: d.name, declEnd: d.declEnd }
      })
      .filter(Boolean)

    // Merge params (always in scope) + locals (in scope after their decl).
    const allVars = [...params, ...locals]

    // Skip if everything is unknown — no useful trace.
    if (params.length === 0 && locals.length === 0) {
      // Still emit a line probe so the user sees execution flow.
    }

    // Entry probe — just after `{`.
    const entryLine = lineOfOffset(prepared, fn.bodyStart)
    const entryProbe = buildProbe(entryLine, fn.name, scopeAt(allVars, fn.bodyStart + 1))
    edits.push({ at: fn.bodyStart + 1, text: '\n' + entryProbe + '\n' })

    // After every `;` (any depth, but not inside parens).
    const insertPoints = findInsertPoints(prepared, regions, fn)
    for (const offset of insertPoints) {
      const line = lineOfOffset(prepared, offset - 1)
      const probe = buildProbe(line, fn.name, scopeAt(allVars, offset))
      edits.push({ at: offset, text: ' ' + probe })
    }

    // Before each `return` at depth 0.
    const returnPoints = findReturnPoints(prepared, regions, fn)
    for (const offset of returnPoints) {
      const line = lineOfOffset(prepared, offset)
      const probe = buildProbe(line, fn.name, scopeAt(allVars, offset))
      edits.push({ at: offset, text: probe + ' ' })
    }

    instrumentedFunctions.push({
      name: fn.name,
      params,
      locals,
    })
  }

  // Apply edits from right to left so offsets remain valid.
  edits.sort((a, b) => b.at - a.at)
  let body = prepared
  for (const e of edits) {
    body = body.slice(0, e.at) + e.text + body.slice(e.at)
  }

  const instrumented = RUNTIME_HEADER + body

  return {
    instrumented,
    functions: instrumentedFunctions,
    runtime: true,
    runtimeLineOffset: RUNTIME_HEADER.split('\n').length - 1,
  }
}
