import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

// Traza de bubble sort: un fotograma por comparación, marcando si hubo swap.
function bubbleFrames(input) {
  const arr = input.slice()
  const frames = [{ arr: arr.slice(), i: -1, j: -1, swap: false, nota: 'array inicial', sorted: -1 }]
  const n = arr.length
  for (let pass = 0; pass < n - 1; pass++) {
    for (let k = 0; k < n - 1 - pass; k++) {
      const swap = arr[k] > arr[k + 1]
      if (swap) [arr[k], arr[k + 1]] = [arr[k + 1], arr[k]]
      frames.push({
        arr: arr.slice(),
        i: k,
        j: k + 1,
        swap,
        sorted: n - pass,
        nota: swap
          ? `${arr[k + 1]} > ${arr[k]} → intercambia`
          : `${arr[k]} ≤ ${arr[k + 1]} → deja igual`,
      })
    }
  }
  frames.push({ arr: arr.slice(), i: -1, j: -1, swap: false, nota: 'ordenado', sorted: 0 })
  return frames
}

export default function SortEngine({ config = {} }) {
  const { array = [5, 2, 8, 1, 9, 3], algoritmo = 'bubble' } = config
  const frames = useMemo(() => bubbleFrames(array), [array])
  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]

  const max = Math.max(...array, 1)

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Ordenar ({algoritmo === 'bubble' ? 'burbuja' : algoritmo})
        </span>
        <span className="text-xs font-mono text-zinc-400">
          compara vecinos e intercambia si están desordenados
        </span>
      </div>

      {/* Barras */}
      <div className="flex items-end justify-center gap-2 h-40">
        {frame.arr.map((v, idx) => {
          const comparing = idx === frame.i || idx === frame.j
          const isSorted = frame.sorted >= 0 && idx >= frame.sorted
          return (
            <motion.div
              key={idx}
              layout
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-1"
              style={{ width: `${Math.max(20, 220 / frame.arr.length)}px` }}
            >
              <div
                className={clsx(
                  'w-full rounded-t-md transition-colors flex items-start justify-center pt-1',
                  comparing
                    ? frame.swap
                      ? 'bg-amber-400'
                      : 'bg-purple-400'
                    : isSorted
                    ? 'bg-emerald-300'
                    : 'bg-zinc-300'
                )}
                style={{ height: `${(v / max) * 120 + 20}px` }}
              >
                <span className="text-[10px] font-mono font-bold text-white">{v}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <p className="font-mono text-sm text-zinc-800">[{frame.arr.join(', ')}]</p>
        <p className="text-xs text-zinc-500 mt-0.5">{frame.nota}</p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
