import clsx from 'clsx'

function getCharType(c) {
  const code = c.charCodeAt(0)
  if (code >= 97 && code <= 122) return 'lower'
  if (code >= 65 && code <= 90)  return 'upper'
  if (c === ' ' || c === '\t')   return 'space'
  if (code >= 48 && code <= 57)  return 'digit'
  return 'symbol'
}

const CHAR_STYLE = {
  lower:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  tag: 'min' },
  upper:  { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   tag: 'MAY' },
  space:  { bg: 'bg-zinc-100',  border: 'border-zinc-300',   text: 'text-zinc-400',   tag: 'spc' },
  digit:  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', tag: '123' },
  symbol: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', tag: 'sym' },
}

export default function StringVisualizer({ str = '', activeIndex = -1, showTypes = true }) {
  if (!str.length) {
    return <p className="text-xs text-zinc-400 text-center py-2">String vacío — mostrará \\0</p>
  }

  const chars = [...str]

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1.5 pb-1 min-w-0">
        {chars.map((c, i) => {
          const type  = getCharType(c)
          const s     = CHAR_STYLE[type]
          const isActive = i === activeIndex
          const display  = c === ' ' ? '␣' : c === '\t' ? '→' : c

          return (
            <div key={i} className="flex flex-col items-center gap-0.5 shrink-0">
              <span className="text-[10px] text-zinc-300 font-mono">{i}</span>
              <div className={clsx(
                'w-9 h-9 flex items-center justify-center rounded-lg border',
                'font-mono text-sm font-bold transition-all duration-150',
                s.bg, s.border, s.text,
                isActive && 'ring-2 ring-offset-1 ring-blue-400 scale-115 z-10'
              )}>
                {display}
              </div>
              {showTypes && (
                <span className={clsx('text-[9px] font-semibold', s.text)}>{s.tag}</span>
              )}
            </div>
          )
        })}

        {/* Terminador \0 */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 opacity-35">
          <span className="text-[10px] text-zinc-300 font-mono">{chars.length}</span>
          <div className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-[11px] text-zinc-400">
            \0
          </div>
          {showTypes && <span className="text-[9px] text-zinc-400">fin</span>}
        </div>
      </div>
    </div>
  )
}
