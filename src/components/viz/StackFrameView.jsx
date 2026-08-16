import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import MemoryDiagram from './MemoryDiagram'

// Builds a "logical" call stack by replaying step.functionName values
// across the trace up to (and including) the current step. Each entry/exit
// of a function pushes/pops a frame. Variables of the active frame come
// from the latest step that belonged to it.
//
// Heuristic: we treat a transition where the new fn differs from the top
// frame AND has not appeared before as a push. A transition back to a
// previous frame on the stack is a pop. Recursion produces repeated frames.

function buildLogicalStack(steps, upTo) {
  const stack = []
  const lastStepByFrameIndex = []
  const end = Math.min(upTo, steps.length - 1)
  for (let i = 0; i <= end; i++) {
    const step = steps[i]
    const fn = step?.functionName ?? 'main'
    const top = stack[stack.length - 1]
    if (!top) {
      stack.push(fn)
      lastStepByFrameIndex.push(i)
      continue
    }
    if (top === fn) {
      lastStepByFrameIndex[stack.length - 1] = i
      continue
    }
    const previousIdx = stack.lastIndexOf(fn)
    if (previousIdx >= 0 && previousIdx < stack.length - 1) {
      stack.length = previousIdx + 1
      lastStepByFrameIndex.length = stack.length
      lastStepByFrameIndex[stack.length - 1] = i
    } else {
      stack.push(fn)
      lastStepByFrameIndex.push(i)
    }
  }
  return stack.map((fn, idx) => ({
    fn,
    stepIndex: lastStepByFrameIndex[idx],
  }))
}

function collapseRepeats(frames) {
  const out = []
  for (const f of frames) {
    const prev = out[out.length - 1]
    if (prev && prev.fn === f.fn) {
      prev.count = (prev.count || 1) + 1
      prev.stepIndex = f.stepIndex
    } else {
      out.push({ ...f, count: 1 })
    }
  }
  return out
}

export default function StackFrameView({
  steps = [],
  currentStepIndex = 0,
  showMemory = true,
}) {
  const frames = useMemo(() => {
    if (!steps.length) return []
    return collapseRepeats(buildLogicalStack(steps, currentStepIndex))
  }, [steps, currentStepIndex])

  if (!frames.length) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 p-3 text-xs text-zinc-400">
        Sin stack frames todavía.
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse gap-2" data-stack="frames">
      <AnimatePresence initial={false}>
        {frames.map((frame, idx) => {
          const isTop = idx === frames.length - 1
          const step = steps[frame.stepIndex]
          const variables = step?.variables ?? []
          return (
            <motion.div
              key={`${frame.fn}-${idx}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className={clsx(
                'rounded-xl border overflow-hidden',
                isTop
                  ? 'border-purple-300 bg-purple-50/40 shadow-sm'
                  : 'border-zinc-200 bg-zinc-50/60 opacity-80'
              )}
            >
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-100 bg-white/60">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'inline-block w-2 h-2 rounded-full',
                      isTop ? 'bg-purple-500' : 'bg-zinc-300'
                    )}
                  />
                  <span className="font-mono text-sm font-semibold text-zinc-800">
                    {frame.fn}
                  </span>
                  {frame.count > 1 && (
                    <span className="rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold px-2 py-0.5">
                      ×{frame.count}
                    </span>
                  )}
                  {step?.lineNumber && (
                    <span className="font-mono text-[10px] text-zinc-400">
                      línea {step.lineNumber}
                    </span>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wide text-zinc-400">
                  {isTop ? 'actual' : 'pendiente'}
                </span>
              </div>
              {showMemory && (
                <div className="p-2">
                  <MemoryDiagram
                    variables={variables}
                    frameKey={`frame-${idx}`}
                    codeLine={step?.code ?? ''}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
