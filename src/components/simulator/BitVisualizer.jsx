import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

function toBits(n) {
  return Array.from({ length: 8 }, (_, i) => (n >> (7 - i)) & 1)
}
function reverseByte(n) {
  let r = 0
  for (let i = 0; i < 8; i++) r = (r << 1) | ((n >> i) & 1)
  return r
}
function swapHalves(n) {
  return ((n & 0x0F) << 4) | ((n & 0xF0) >> 4)
}

const COLORS = {
  blue:   { on: 'bg-blue-500 border-blue-400 text-white',   off: 'bg-blue-50 border-blue-200 text-blue-300'   },
  green:  { on: 'bg-green-500 border-green-400 text-white', off: 'bg-green-50 border-green-200 text-green-300' },
  orange: { on: 'bg-orange-400 border-orange-300 text-white', off: 'bg-orange-50 border-orange-200 text-orange-300' },
  zinc:   { on: 'bg-zinc-800 border-zinc-700 text-white',   off: 'bg-zinc-100 border-zinc-200 text-zinc-400'  },
}

function BitRow({ bits, label, color = 'zinc', highlight = [] }) {
  const c = COLORS[color]
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-400 w-20 text-right shrink-0">{label}</span>
      <div className="flex gap-1.5">
        {bits.map((bit, i) => (
          <motion.div
            key={i}
            layout
            className={clsx(
              'w-9 h-9 flex items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors duration-200',
              bit ? c.on : c.off,
              highlight.includes(i) && 'ring-2 ring-offset-1 ring-yellow-400'
            )}
          >
            {bit}
          </motion.div>
        ))}
      </div>
      <span className="text-xs font-mono text-zinc-400 shrink-0">
        {bits.join('')} = {parseInt(bits.join(''), 2)}
      </span>
    </div>
  )
}

const MODES = [
  { id: 'print',   label: 'print_bits',   desc: 'Escribe cada bit como char ASCII "0" o "1"'  },
  { id: 'reverse', label: 'reverse_bits', desc: 'Invierte el orden de los 8 bits'              },
  { id: 'swap',    label: 'swap_bits',    desc: 'Intercambia nibble alto (bits 0-3) y bajo (bits 4-7)' },
]

export default function BitVisualizer({ initialMode = 'print' }) {
  const [value, setValue] = useState(42)
  const [mode, setMode]   = useState(initialMode)

  const inputBits   = toBits(value)
  const reversedBits = toBits(reverseByte(value))
  const swappedBits  = toBits(swapHalves(value))
  const current = MODES.find(m => m.id === mode)

  return (
    <div className="space-y-4">

      {/* Selector de modo */}
      <div className="flex gap-2 flex-wrap">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              mode === m.id
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-zinc-500">{current?.desc}</p>

      {/* Slider */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Valor del byte</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-zinc-900">{value}</span>
            <span className="font-mono text-xs text-zinc-400">
              0x{value.toString(16).padStart(2, '0').toUpperCase()}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={0} max={255}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="w-full accent-zinc-800 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-300 font-mono">
          <span>0</span><span>63</span><span>127</span><span>191</span><span>255</span>
        </div>
      </div>

      {/* Visualización de bits */}
      <div className="card p-4 space-y-3">
        <BitRow bits={inputBits} label="Entrada:" color="blue" />

        {mode === 'print' && (
          <div className="pl-24 space-y-1.5">
            <p className="text-xs text-zinc-400">→ write(1, &bits, 1) por cada bit como char '0'/'1'</p>
            <div className="terminal-box text-xs">
              {inputBits.join('')} + \n
            </div>
          </div>
        )}

        {mode === 'reverse' && (
          <div className="space-y-3">
            <div className="pl-24 text-xs text-zinc-400 space-y-0.5">
              <p className="font-mono">bit = 0;  // inicializar SIEMPRE</p>
              <p className="font-mono">bit = bit * 2 + octet % 2;</p>
              <p className="font-mono">octet /= 2;  // ×8 iteraciones</p>
            </div>
            <BitRow bits={reversedBits} label="Resultado:" color="green" />
          </div>
        )}

        {mode === 'swap' && (
          <div className="space-y-3">
            <div className="pl-24 text-xs text-zinc-400">
              <p className="font-mono">((octet &amp; 0x0F) &lt;&lt; 4) | ((octet &amp; 0xF0) &gt;&gt; 4)</p>
            </div>
            <BitRow bits={inputBits}  label="Entrada:"  color="blue"   highlight={[4,5,6,7]} />
            <div className="pl-24 flex gap-2 text-xs text-zinc-400 items-center">
              <span className="px-2 py-0.5 rounded bg-yellow-50 border border-yellow-200 text-yellow-700">bits 0-3 ↔ bits 4-7</span>
            </div>
            <BitRow bits={swappedBits} label="Swapped:"  color="green"  highlight={[0,1,2,3]} />
          </div>
        )}
      </div>

    </div>
  )
}
