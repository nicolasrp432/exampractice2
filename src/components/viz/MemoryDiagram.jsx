import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

// Renders variables as visual memory cells:
//  - scalars (int, char)         → labeled boxes
//  - strings / char arrays       → horizontal cell grid with NUL terminator
//  - pointers                    → boxes holding an address (target drawn elsewhere)
// Each rendered element exposes a stable DOM id so PointerArrows can connect them.

function parseCharCell(raw) {
  if (raw == null) return null
  const s = String(raw)
  let m = s.match(/^"(.)\s\((\d+)\)"$/)
  if (m) return { glyph: m[1], code: Number(m[2]) }
  m = s.match(/^"\\x([0-9a-f]{2})\s\((\d+)\)"$/i)
  if (m) return { glyph: `0x${m[1]}`, code: Number(m[2]) }
  return null
}

function unquoteString(value) {
  if (value == null) return null
  const s = String(value)
  if (s === 'null' || s === 'NULL') return null
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
  }
  return null
}

function isPointerType(v) {
  if (!v) return false
  if (v.type === 'puntero') return true
  if (v.type && /\*/.test(v.type)) return true
  if (v.address && /^0x[0-9a-f]+$/i.test(v.address)) return true
  return false
}

function classifyVar(v) {
  const charCell = parseCharCell(v.value)
  if (charCell) return { kind: 'char', char: charCell }
  const str = unquoteString(v.value)
  if (str !== null) return { kind: 'string', str }
  if (isPointerType(v)) return { kind: 'pointer' }
  return { kind: 'scalar' }
}

function makeId(frame, name) {
  const safe = String(name).replace(/[^a-zA-Z0-9_-]/g, '_')
  return `mem-${frame}-${safe}`
}

function cellId(frame, name, index) {
  const safe = String(name).replace(/[^a-zA-Z0-9_-]/g, '_')
  return `mem-${frame}-${safe}-c${index}`
}

const Glyph = ({ ch }) => {
  if (ch === '\n') return <span className="text-blue-500">↵</span>
  if (ch === '\t') return <span className="text-blue-500">⇥</span>
  if (ch === ' ') return <span className="text-zinc-400">·</span>
  return <span>{ch}</span>
}

function StringCells({ frameKey, name, str, highlightIndex }) {
  const chars = useMemo(() => Array.from(str || ''), [str])
  const total = chars.length + 1
  return (
    <div className="flex flex-wrap items-end gap-[2px]">
      {chars.map((ch, i) => (
        <motion.div
          key={`${name}-${i}`}
          id={cellId(frameKey, name, i)}
          data-mem-cell={`${name}:${i}`}
          layout
          className={clsx(
            'w-7 h-9 flex flex-col items-center justify-center rounded border text-[11px] font-mono',
            i === highlightIndex
              ? 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-200'
              : 'border-zinc-200 bg-white text-zinc-700'
          )}
          title={`${name}[${i}] = '${ch}' (${ch.charCodeAt(0)})`}
        >
          <span className="leading-none"><Glyph ch={ch} /></span>
          <span className="text-[9px] text-zinc-400">{i}</span>
        </motion.div>
      ))}
      <motion.div
        layout
        id={cellId(frameKey, name, chars.length)}
        data-mem-cell={`${name}:${chars.length}`}
        className="w-7 h-9 flex flex-col items-center justify-center rounded border border-red-200 bg-red-50 text-[10px] font-mono text-red-700"
        title={`${name}[${chars.length}] = '\\0' (terminador)`}
      >
        <span className="leading-none">\0</span>
        <span className="text-[9px] text-red-400">{chars.length}</span>
      </motion.div>
      <span className="ml-2 text-[10px] text-zinc-400 self-center">len {chars.length} · cells {total}</span>
    </div>
  )
}

function ScalarBox({ frameKey, variable, changed }) {
  return (
    <motion.div
      layout
      id={makeId(frameKey, variable.name)}
      data-mem-var={variable.name}
      className={clsx(
        'inline-flex flex-col rounded-lg border px-3 py-1.5 min-w-[90px]',
        changed ? 'border-green-300 bg-green-50' : 'border-zinc-200 bg-white'
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-400">
        {variable.type || 'val'}
      </span>
      <span className="font-mono text-sm font-semibold text-zinc-800">{variable.name}</span>
      <motion.span
        key={variable.value}
        initial={{ scale: 1.15, color: '#16a34a' }}
        animate={{ scale: 1, color: '#27272a' }}
        transition={{ duration: 0.25 }}
        className="font-mono text-sm"
      >
        {variable.value ?? '—'}
      </motion.span>
    </motion.div>
  )
}

function PointerBox({ frameKey, variable, changed }) {
  const isNull = variable.value === 'NULL' || variable.value == null
  return (
    <motion.div
      layout
      id={makeId(frameKey, variable.name)}
      data-mem-var={variable.name}
      data-mem-ptr-target={variable.address || ''}
      className={clsx(
        'inline-flex flex-col rounded-lg border px-3 py-1.5 min-w-[120px]',
        changed ? 'border-purple-400 bg-purple-50' : 'border-purple-200 bg-purple-50/40'
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wide text-purple-500">
        {variable.type || '*'}
      </span>
      <span className="font-mono text-sm font-semibold text-purple-900">{variable.name}</span>
      <span className={clsx('font-mono text-[11px]', isNull ? 'text-red-500' : 'text-purple-700')}>
        {isNull ? 'NULL' : variable.address || variable.value}
      </span>
    </motion.div>
  )
}

function CharBox({ frameKey, variable, changed }) {
  return (
    <motion.div
      layout
      id={makeId(frameKey, variable.name)}
      data-mem-var={variable.name}
      className={clsx(
        'inline-flex flex-col items-center rounded-lg border px-3 py-1.5 min-w-[80px]',
        changed ? 'border-green-300 bg-green-50' : 'border-zinc-200 bg-white'
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-400">char</span>
      <span className="font-mono text-sm font-semibold text-zinc-800">{variable.name}</span>
      <span className="font-mono text-sm text-zinc-700">
        '<Glyph ch={variable._char?.glyph ?? ''} />' <span className="text-[10px] text-zinc-400">({variable._char?.code})</span>
      </span>
    </motion.div>
  )
}

function StringBlock({ frameKey, variable, highlightIndex }) {
  return (
    <div
      id={makeId(frameKey, variable.name)}
      data-mem-var={variable.name}
      className="rounded-lg border border-zinc-200 bg-white p-2"
    >
      <div className="flex items-center justify-between mb-1.5 gap-3">
        <span className="font-mono text-sm font-semibold text-zinc-800">{variable.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-400">
          {variable.type || 'char *'}
        </span>
      </div>
      <StringCells
        frameKey={frameKey}
        name={variable.name}
        str={variable._str ?? ''}
        highlightIndex={highlightIndex}
      />
    </div>
  )
}

function inferStringIndex(variables, codeLine) {
  if (!codeLine) return null
  const access = codeLine.match(/(\b[a-zA-Z_][a-zA-Z0-9_]*)\s*\[\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\]/)
  if (!access) return null
  const [, arr, idxName] = access
  const target = variables.find(v => v.name === arr)
  if (!target) return null
  const idx = variables.find(v => v.name === idxName)
  if (!idx || !Number.isFinite(Number(idx.value))) return null
  return { arr, index: Number(idx.value) }
}

export default function MemoryDiagram({
  variables = [],
  frameKey = 'frame-0',
  codeLine = '',
}) {
  const annotated = useMemo(() => variables.map(v => {
    const cls = classifyVar(v)
    return {
      ...v,
      _kind: cls.kind,
      _char: cls.char,
      _str: cls.str,
    }
  }), [variables])

  const highlight = useMemo(() => inferStringIndex(annotated, codeLine), [annotated, codeLine])

  if (!annotated.length) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 p-3 text-xs text-zinc-400">
        Sin variables en este paso.
      </div>
    )
  }

  const scalars = annotated.filter(v => v._kind === 'scalar')
  const chars = annotated.filter(v => v._kind === 'char')
  const pointers = annotated.filter(v => v._kind === 'pointer')
  const strings = annotated.filter(v => v._kind === 'string')

  return (
    <div className="space-y-3" data-mem-frame={frameKey}>
      {(scalars.length > 0 || chars.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {scalars.map(v => (
            <ScalarBox key={v.name} frameKey={frameKey} variable={v} changed={v.changed} />
          ))}
          {chars.map(v => (
            <CharBox key={v.name} frameKey={frameKey} variable={v} changed={v.changed} />
          ))}
        </div>
      )}
      {pointers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pointers.map(v => (
            <PointerBox key={v.name} frameKey={frameKey} variable={v} changed={v.changed} />
          ))}
        </div>
      )}
      {strings.length > 0 && (
        <div className="space-y-2">
          {strings.map(v => (
            <StringBlock
              key={v.name}
              frameKey={frameKey}
              variable={v}
              highlightIndex={highlight?.arr === v.name ? highlight.index : null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
