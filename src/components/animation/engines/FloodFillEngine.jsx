import { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useAnimationPlayer } from '../useAnimationPlayer'
import PlayerControls from '../PlayerControls'

// Flood fill 4-direccional desde `start`, rellenando la región conexa que
// comparte el valor de la casilla inicial. Un fotograma por casilla rellenada.
function fillFrames(grid, start, fillChar) {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const target = grid[start[0]]?.[start[1]]
  const frames = [{ filled: [], actual: start, nota: `casilla inicial (${start[0]},${start[1]}) = '${target}'` }]
  if (target === fillChar) return frames

  const seen = Array.from({ length: rows }, () => Array(cols).fill(false))
  const queue = [start]
  seen[start[0]][start[1]] = true
  const filledOrder = []

  while (queue.length) {
    const [r, c] = queue.shift()
    filledOrder.push([r, c])
    frames.push({
      filled: filledOrder.slice(),
      actual: [r, c],
      nota: `rellena (${r},${c}) con '${fillChar}'`,
    })
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nr = r + dr
      const nc = c + dc
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !seen[nr][nc] &&
        grid[nr][nc] === target
      ) {
        seen[nr][nc] = true
        queue.push([nr, nc])
      }
    }
  }
  frames.push({ filled: filledOrder.slice(), actual: null, nota: 'región completa rellenada', fin: true })
  return frames
}

export default function FloodFillEngine({ config = {} }) {
  const {
    grid = [
      ['1', '1', '0'],
      ['1', '1', '0'],
      ['0', '0', '0'],
    ],
    start = [0, 0],
    fill = 'O',
  } = config

  const frames = useMemo(() => fillFrames(grid, start, fill), [grid, start, fill])
  const player = useAnimationPlayer(frames.length)
  const frame = frames[player.step] ?? frames[0]

  const filledSet = useMemo(() => new Set(frame.filled.map(([r, c]) => `${r},${c}`)), [frame])

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Flood fill desde ({start[0]},{start[1]})
        </span>
        <span className="text-xs font-mono text-zinc-400">rellena con '{fill}'</span>
      </div>

      {/* Grid */}
      <div className="flex justify-center">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, minmax(0, 1fr))` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r},${c}`
              const isFilled = filledSet.has(key)
              const isActive = frame.actual && frame.actual[0] === r && frame.actual[1] === c
              return (
                <motion.div
                  key={key}
                  layout
                  className={clsx(
                    'h-11 w-11 rounded-md border flex items-center justify-center font-mono text-sm font-bold transition-colors',
                    isActive
                      ? 'border-purple-500 bg-purple-200 text-purple-900 ring-2 ring-purple-300'
                      : isFilled
                      ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                      : 'border-zinc-200 bg-white text-zinc-500'
                  )}
                >
                  {isFilled ? fill : cell}
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <p className="text-xs text-zinc-600">{frame.nota}</p>
      </div>

      <PlayerControls player={player} />
    </div>
  )
}
