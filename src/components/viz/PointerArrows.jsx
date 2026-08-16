import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

// Overlay SVG that draws arrows from every pointer-typed variable
// (data-mem-var with a non-empty data-mem-ptr-target) to its target
// memory cell or variable in the same container. Re-measures on
// resize and whenever `deps` change (e.g. after a step transition).
//
// containerRef must point to the DOM node that wraps the stack of
// frames so arrows stay within its coordinate system.

function getRect(el, containerRect) {
  const r = el.getBoundingClientRect()
  return {
    left: r.left - containerRect.left,
    right: r.right - containerRect.left,
    top: r.top - containerRect.top,
    bottom: r.bottom - containerRect.top,
    cx: r.left - containerRect.left + r.width / 2,
    cy: r.top - containerRect.top + r.height / 2,
    width: r.width,
    height: r.height,
  }
}

function pickAnchor(from, to) {
  const dx = to.cx - from.cx
  const fromX = dx >= 0 ? from.right : from.left
  const fromY = from.cy
  const toX = dx >= 0 ? to.left : to.right
  const toY = to.cy
  return { x1: fromX, y1: fromY, x2: toX, y2: toY }
}

function curvedPath(p) {
  const dx = p.x2 - p.x1
  const dy = p.y2 - p.y1
  const mx = (p.x1 + p.x2) / 2
  const my = (p.y1 + p.y2) / 2
  const offset = Math.min(40, Math.abs(dy) * 0.6 + Math.abs(dx) * 0.1)
  const cx1 = p.x1 + Math.sign(dx || 1) * 30
  const cy1 = p.y1
  const cx2 = mx
  const cy2 = my - offset
  return `M ${p.x1} ${p.y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x2} ${p.y2}`
}

export default function PointerArrows({ containerRef, deps = [], enabled = true }) {
  const svgRef = useRef(null)
  const [paths, setPaths] = useState([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  const recompute = useMemo(() => {
    return () => {
      const container = containerRef?.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      setSize({ w: container.clientWidth, h: container.clientHeight })

      const pointers = container.querySelectorAll('[data-mem-ptr-target]')
      const next = []
      pointers.forEach((el) => {
        const target = el.getAttribute('data-mem-ptr-target')
        if (!target) return
        // Find a cell whose data-mem-cell contains this address, or a var
        // whose id matches a known address. Wandbox pointer addresses are
        // opaque; we approximate by matching variable names if the pointer
        // looks like `&name`, otherwise highlight the first string cell
        // in the same frame.
        const ptrName = el.getAttribute('data-mem-var')
        const frameWrap = el.closest('[data-mem-frame]')
        if (!frameWrap) return
        // Heuristic: match by name suffix (e.g. `pa` -> `a`)
        const candidate = frameWrap.querySelector(
          `[data-mem-cell^="${ptrName}:"]`
        ) || frameWrap.querySelector(
          `[data-mem-var="${ptrName.replace(/^[*&]/, '')}"]`
        )
        if (!candidate || candidate === el) return
        const from = getRect(el, containerRect)
        const to = getRect(candidate, containerRect)
        const anchored = pickAnchor(from, to)
        next.push({
          d: curvedPath(anchored),
          key: `${ptrName}->${candidate.id || candidate.getAttribute('data-mem-cell')}`,
        })
      })
      setPaths(next)
    }
  }, [containerRef])

  useLayoutEffect(() => {
    if (!enabled) {
      setPaths([])
      return
    }
    recompute()
  }, [recompute, enabled, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!enabled) return
    const container = containerRef?.current
    if (!container) return
    const ro = new ResizeObserver(() => recompute())
    ro.observe(container)
    window.addEventListener('scroll', recompute, true)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', recompute, true)
    }
  }, [containerRef, recompute, enabled])

  if (!enabled || !paths.length) return null

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0"
      width={size.w}
      height={size.h}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <marker
          id="ptr-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
        </marker>
      </defs>
      {paths.map((p) => (
        <path
          key={p.key}
          d={p.d}
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.5"
          strokeDasharray="3 2"
          markerEnd="url(#ptr-arrow)"
          opacity="0.85"
        />
      ))}
    </svg>
  )
}
