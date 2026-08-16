import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

// Divide la cadena en caracteres visibles; representa el terminador \0 aparte.
function toChars(str = '') {
  return String(str).replace(/\\0$/, '').split('')
}

const MODE_LABELS = {
  contar: 'Contar caracteres',
  copiar: 'Copiar carácter a carácter',
  revertir: 'Recorrer y darle la vuelta',
  comparar: 'Comparar dos cadenas',
  filtrar: 'Recorrer y filtrar',
  buscar: 'Buscar en la cadena',
}

function CharBox({ ch, active, done, tone = 'zinc' }) {
  const tones = {
    zinc: 'border-zinc-200 bg-white text-zinc-700',
    green: 'border-green-300 bg-green-50 text-green-700',
    red: 'border-red-300 bg-red-50 text-red-700',
  }
  return (
    <motion.div
      layout
      className={clsx(
        'relative h-11 w-9 shrink-0 rounded-lg border flex items-center justify-center font-mono text-sm transition-colors',
        active ? 'border-purple-400 bg-purple-50 text-purple-800 shadow-sm' : tones[tone],
        done && !active && tone === 'zinc' && 'opacity-60'
      )}
    >
      {ch === ' ' ? <span className="text-zinc-300">␣</span> : ch}
    </motion.div>
  )
}

export default function StringPointerEngine({ config = {} }) {
  const { cadena = 'hello', cadena2 = null, modo = 'contar' } = config

  const chars = useMemo(() => toChars(cadena), [cadena])
  const chars2 = useMemo(() => (cadena2 != null ? toChars(cadena2) : null), [cadena2])

  const frames = useMemo(() => {
    const out = []
    if (modo === 'comparar' && chars2) {
      const n = Math.max(chars.length, chars2.length)
      for (let i = 0; i < n; i++) {
        const a = chars[i]
        const b = chars2[i]
        const equal = a === b
        out.push({
          i,
          resultado: equal ? 'iguales hasta aquí' : `difieren en la posición ${i}`,
          ok: equal,
          nota: equal
            ? `'${a ?? '\\0'}' == '${b ?? '\\0'}'`
            : `'${a ?? '\\0'}' ≠ '${b ?? '\\0'}' → devuelve la diferencia`,
        })
        if (!equal) break
      }
      return out
    }

    for (let i = 0; i < chars.length; i++) {
      let resultado = ''
      if (modo === 'contar') resultado = `longitud = ${i + 1}`
      else if (modo === 'revertir') resultado = chars.slice(0, i + 1).reverse().join('')
      else resultado = chars.slice(0, i + 1).join('') // copiar / filtrar / buscar
      out.push({ i, resultado, nota: `str[${i}] = '${chars[i]}'` })
    }
    // Fotograma final: encontrar el \0
    out.push({
      i: chars.length,
      resultado:
        modo === 'contar'
          ? `longitud final = ${chars.length}`
          : modo === 'revertir'
          ? chars.slice().reverse().join('')
          : chars.join(''),
      nota: 'str[i] = \\0 → fin de la cadena',
      fin: true,
    })
    return out
  }, [chars, chars2, modo])

  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {MODE_LABELS[modo] ?? 'Recorrido de cadena'}
        </span>
        <span className="text-xs font-mono text-zinc-400">i = {frame.i}</span>
      </div>

      {/* Cadena principal con puntero */}
      <div className="space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-6 pt-5 relative">
          {chars.map((ch, idx) => (
            <div key={idx} className="relative">
              {frame.i === idx && (
                <motion.div
                  layoutId="pointer"
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-purple-500 text-xs"
                >
                  ▼
                </motion.div>
              )}
              <CharBox ch={ch} active={frame.i === idx} done={idx < frame.i} />
              <span className="block text-center text-[10px] text-zinc-300 font-mono mt-0.5">
                {idx}
              </span>
            </div>
          ))}
          {/* Caja del terminador */}
          <div className="relative">
            {frame.i >= chars.length && (
              <motion.div
                layoutId="pointer"
                className="absolute -top-5 left-1/2 -translate-x-1/2 text-purple-500 text-xs"
              >
                ▼
              </motion.div>
            )}
            <div
              className={clsx(
                'h-11 w-9 shrink-0 rounded-lg border border-dashed flex items-center justify-center font-mono text-xs',
                frame.i >= chars.length
                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-400'
              )}
            >
              \0
            </div>
          </div>
        </div>

        {/* Segunda cadena (modo comparar) */}
        {chars2 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {chars2.map((ch, idx) => (
              <CharBox
                key={idx}
                ch={ch}
                active={frame.i === idx}
                tone={frame.i === idx ? (frame.ok ? 'green' : 'red') : 'zinc'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resultado acumulado */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          Estado actual
        </p>
        <p className="font-mono text-sm text-zinc-800 break-all">
          {frame.resultado || '—'}
        </p>
        <p className="text-xs text-zinc-500">{frame.nota}</p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
