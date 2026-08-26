import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Play, Pause, RotateCcw, Sparkles, Box, ArrowRight, CornerDownRight } from 'lucide-react'
import clsx from 'clsx'

/**
 * Visualizador 3D interactivo de Flood Fill & Matrices 2D en C.
 * Muestra una cuadrícula voxel 3D isométrica/perspectiva y simula
 * la propagación recursiva DFS en 4 direcciones en tiempo real.
 */
export default function VoxelGrid3D({ initialExercise = null }) {
  const mountRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)
  const [stepCount, setStepCount] = useState(0)
  const [fillChar, setFillChar] = useState('F')
  const [startPoint, setStartPoint] = useState({ x: 1, y: 1 })
  const [selectedCell, setSelectedCell] = useState(null)

  // Mapa inicial por defecto (8x5 clásico de 42)
  const DEFAULT_MAP = [
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['1', '0', '0', '0', '1', '0', '0', '1'],
    ['1', '0', '0', '1', '0', '0', '0', '1'],
    ['1', '0', '1', '1', '0', '0', '0', '1'],
    ['1', '1', '1', '0', '0', '0', '0', '1'],
  ]

  const [grid, setGrid] = useState(() => DEFAULT_MAP.map(row => [...row]))
  const targetCharRef = useRef('0')
  const queueRef = useRef([])
  const visitedRef = useRef(new Set())
  const gridStateRef = useRef(DEFAULT_MAP.map(row => [...row]))

  const rows = grid.length
  const cols = grid[0].length

  // Reiniciar cuadrícula
  const handleReset = () => {
    setIsRunning(false)
    setStepCount(0)
    const reset = DEFAULT_MAP.map(row => [...row])
    setGrid(reset)
    gridStateRef.current = reset.map(row => [...row])
    queueRef.current = []
    visitedRef.current = new Set()
  }

  // Iniciar simulación de flood_fill
  const handleStart = () => {
    if (isRunning) {
      setIsRunning(false)
      return
    }

    const { x, y } = startPoint
    if (x < 0 || y < 0 || y >= rows || x >= cols) return

    const target = gridStateRef.current[y][x]
    if (target === fillChar) return

    targetCharRef.current = target
    queueRef.current = [{ x, y }]
    visitedRef.current = new Set([`${x},${y}`])
    setIsRunning(true)
  }

  // Ejecución paso a paso
  const handleStep = () => {
    if (queueRef.current.length === 0) {
      setIsRunning(false)
      return
    }

    const current = queueRef.current.shift()
    const { x, y } = current

    // Actualizar matriz
    const newGrid = gridStateRef.current.map(row => [...row])
    newGrid[y][x] = fillChar
    gridStateRef.current = newGrid
    setGrid(newGrid)
    setStepCount(s => s + 1)

    // Explorar 4 direcciones (Arriba, Abajo, Izquierda, Derecha)
    const directions = [
      { dx: 0, dy: -1 }, // Arriba
      { dx: 0, dy: 1 },  // Abajo
      { dx: -1, dy: 0 }, // Izquierda
      { dx: 1, dy: 0 },  // Derecha
    ]

    for (const { dx, dy } of directions) {
      const nx = x + dx
      const ny = y + dy
      const key = `${nx},${ny}`

      if (
        nx >= 0 && nx < cols &&
        ny >= 0 && ny < rows &&
        !visitedRef.current.has(key) &&
        gridStateRef.current[ny][nx] === targetCharRef.current
      ) {
        visitedRef.current.add(key)
        queueRef.current.push({ x: nx, y: ny })
      }
    }

    if (queueRef.current.length === 0) {
      setIsRunning(false)
    }
  }

  // Bucle automático de ejecución
  useEffect(() => {
    let timer
    if (isRunning) {
      timer = setTimeout(() => {
        handleStep()
      }, 250)
    }
    return () => clearTimeout(timer)
  }, [isRunning, stepCount])

  // Render Three.js Scene
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 300

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x11111b)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 8, 9)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Luces
    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
    dirLight.position.set(5, 12, 7)
    scene.add(dirLight)

    // Grupo de voxeles
    const voxelGroup = new THREE.Group()
    scene.add(voxelGroup)

    const boxGeo = new THREE.BoxGeometry(0.85, 0.6, 0.85)

    // Materiales
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x313244,
      roughness: 0.4,
      metalness: 0.1,
    })
    const openMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e2e,
      roughness: 0.8,
    })
    const filledMat = new THREE.MeshStandardMaterial({
      color: 0xa6e3a1,
      emissive: 0x2e6b30,
      emissiveIntensity: 0.4,
      roughness: 0.2,
    })
    const startMat = new THREE.MeshStandardMaterial({
      color: 0xf9e2af,
      emissive: 0x7a5b00,
      emissiveIntensity: 0.5,
    })

    const startX = -(cols * 1.0) / 2 + 0.5
    const startZ = -(rows * 1.0) / 2 + 0.5

    grid.forEach((row, rIdx) => {
      row.forEach((val, cIdx) => {
        let mat = openMat
        let heightScale = 1

        if (val === '1') {
          mat = wallMat
          heightScale = 1.3
        } else if (val === fillChar) {
          mat = filledMat
          heightScale = 1.1
        } else if (rIdx === startPoint.y && cIdx === startPoint.x) {
          mat = startMat
          heightScale = 1.2
        }

        const mesh = new THREE.Mesh(boxGeo, mat)
        mesh.position.set(startX + cIdx * 1.0, (heightScale * 0.6) / 2, startZ + rIdx * 1.0)
        mesh.scale.set(1, heightScale, 1)
        voxelGroup.add(mesh)
      })
    })

    // Suelo de rejilla
    const gridHelper = new THREE.GridHelper(cols * 1.2, cols, 0x45475a, 0x313244)
    gridHelper.position.y = -0.05
    scene.add(gridHelper)

    // Animación suave de rotación leve
    let reqId
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      voxelGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.08
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 600
      const h = container.clientHeight || 300
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [grid, startPoint, fillChar])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 text-white">
        <div className="flex items-center gap-2">
          <Box size={16} className="text-green-400" />
          <span className="font-mono text-xs font-bold text-zinc-100">
            Laboratorio 3D: Flood Fill & Recursión 4-Way
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            Pasos DFS: {stepCount}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-950 text-green-400 border border-green-800">
            begin = &#123;{startPoint.x}, {startPoint.y}&#125;
          </span>
        </div>
      </div>

      {/* Canvas 3D */}
      <div className="relative h-[250px] w-full bg-[#11111b]">
        <div ref={mountRef} className="w-full h-full" />
        
        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-green-300 border border-green-500/30">
            Verde: Carácter '{fillChar}' reemplazado
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-zinc-400 border border-zinc-700">
            Gris: Muros ('1')
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStart}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs',
                isRunning
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'
              )}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
              <span>{isRunning ? 'Pausar DFS' : 'Ejecutar Flood Fill'}</span>
            </button>

            <button
              onClick={handleStep}
              disabled={isRunning}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition-colors"
            >
              <ArrowRight size={13} />
              <span>Paso (+1)</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-800 bg-white border border-zinc-200 transition-colors"
              title="Reiniciar cuadrícula"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          {/* Start coordinates selector */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
            <span className="text-[11px] font-sans font-semibold text-zinc-500">Punto Inicio:</span>
            <label className="flex items-center gap-1">
              X:
              <input
                type="number"
                min="0"
                max={cols - 1}
                value={startPoint.x}
                onChange={e => {
                  const x = Math.max(0, Math.min(cols - 1, parseInt(e.target.value) || 0))
                  setStartPoint(p => ({ ...p, x }))
                }}
                className="w-10 px-1 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-center font-bold"
              />
            </label>
            <label className="flex items-center gap-1">
              Y:
              <input
                type="number"
                min="0"
                max={rows - 1}
                value={startPoint.y}
                onChange={e => {
                  const y = Math.max(0, Math.min(rows - 1, parseInt(e.target.value) || 0))
                  setStartPoint(p => ({ ...p, y }))
                }}
                className="w-10 px-1 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-center font-bold"
              />
            </label>
          </div>
        </div>

        {/* Dynamic 2D Matrix Preview */}
        <div className="rounded-xl bg-white p-2.5 border border-zinc-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Estado de la Matriz tab[y][x]
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Dimensiones: {cols} x {rows}
            </span>
          </div>
          <div className="font-mono text-xs flex flex-col gap-1 select-none">
            {grid.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1">
                <span className="text-[10px] text-zinc-400 w-4 select-none">[{rIdx}]</span>
                {row.map((val, cIdx) => {
                  const isStart = rIdx === startPoint.y && cIdx === startPoint.x
                  const isFilled = val === fillChar
                  return (
                    <button
                      key={cIdx}
                      onClick={() => {
                        setStartPoint({ x: cIdx, y: rIdx })
                        handleReset()
                      }}
                      className={clsx(
                        'w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-all border',
                        isStart
                          ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300'
                          : isFilled
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : val === '1'
                          ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                      )}
                      title={`Celda (${cIdx}, ${rIdx}): '${val}'. Haz clic para fijar como punto inicial.`}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
