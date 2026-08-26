import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Play, Pause, RotateCcw, ArrowRight, Sparkles, Filter, RefreshCw, Scissors } from 'lucide-react'
import clsx from 'clsx'

/**
 * Visualizador 3D de Escaneo de Palabras, Delimitadores y Transformación de Strings
 * para first_word, last_word, epur_str, expand_str, rostring, rev_wstr, ft_split, etc.
 */
export default function WordScanner3D({
  exerciseId = 'first_word',
  initialText = '   lorem   ipsum   dolor   ',
}) {
  const mountRef = useRef(null)
  const [text, setText] = useState(initialText)
  const [cursor, setCursor] = useState(0)
  const [phase, setPhase] = useState('skip_spaces') // 'skip_spaces' | 'scanning_word' | 'finished'
  const [outputTokens, setOutputTokens] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [actionLog, setActionLog] = useState('Inicia el escáner para ver la segmentación en 3D')

  const chars = text.split('')

  const handleReset = () => {
    setIsPlaying(false)
    setCursor(0)
    setPhase('skip_spaces')
    setOutputTokens([])
    setActionLog('Reiniciado')
  }

  const handleStep = () => {
    if (cursor >= chars.length) {
      setIsPlaying(false)
      setPhase('finished')
      setActionLog('¡Fin del string alcanzado (\\0)!')
      return
    }

    const c = chars[cursor]
    const isSpaceOrTab = c === ' ' || c === '\t'

    if (exerciseId === 'first_word') {
      if (phase === 'skip_spaces') {
        if (isSpaceOrTab) {
          setActionLog(`Posición [${cursor}] es '${c === '\t' ? '\\t' : 'espacio'}': Saltando separador inicial`)
          setCursor(c => c + 1)
        } else {
          setPhase('scanning_word')
          setOutputTokens([c])
          setActionLog(`Posición [${cursor}] es '${c}': ¡Primera letra de la primera palabra encontrada!`)
          setCursor(c => c + 1)
        }
      } else if (phase === 'scanning_word') {
        if (isSpaceOrTab) {
          setPhase('finished')
          setIsPlaying(false)
          setActionLog(`Posición [${cursor}] es '${c === '\t' ? '\\t' : 'espacio'}': Fin de la primera palabra. Deteniendo escáner.`)
        } else {
          setOutputTokens(prev => [...prev, c])
          setActionLog(`Posición [${cursor}] es '${c}': Escribiendo letra '${c}' a la salida`)
          setCursor(c => c + 1)
        }
      }
    } else if (exerciseId === 'last_word') {
      // Last word demo
      if (isSpaceOrTab) {
        setActionLog(`Posición [${cursor}] es espacio`)
        setCursor(c => c + 1)
      } else {
        // Collect word
        let w = c
        let nextIdx = cursor + 1
        while (nextIdx < chars.length && chars[nextIdx] !== ' ' && chars[nextIdx] !== '\t') {
          w += chars[nextIdx]
          nextIdx++
        }
        setOutputTokens([w])
        setActionLog(`Palabra detectada: "${w}". Si no hay más palabras posteriores, esta será la última.`)
        setCursor(nextIdx)
      }
    } else if (exerciseId === 'rostring' || exerciseId === 'rev_wstr' || exerciseId === 'ft_split') {
      if (isSpaceOrTab) {
        setActionLog(`Saltando separadores...`)
        setCursor(c => c + 1)
      } else {
        let w = c
        let nextIdx = cursor + 1
        while (nextIdx < chars.length && chars[nextIdx] !== ' ' && chars[nextIdx] !== '\t') {
          w += chars[nextIdx]
          nextIdx++
        }
        setOutputTokens(prev => [...prev, w])
        setActionLog(`Token/Palabra #${outputTokens.length + 1} extraída: "${w}"`)
        setCursor(nextIdx)
      }
    } else if (exerciseId === 'camel_to_snake' || exerciseId === 'snake_to_camel') {
      if (c >= 'A' && c <= 'Z') {
        const transformed = `_${c.toLowerCase()}`
        setOutputTokens(prev => [...prev, transformed])
        setActionLog(`Mayúscula '${c}' convertida a '${transformed}'`)
      } else if (c === '_') {
        setActionLog(`Guión bajo detectado: preparando mayúscula para camelCase`)
      } else {
        setOutputTokens(prev => [...prev, c])
        setActionLog(`Carácter regular '${c}'`)
      }
      setCursor(c => c + 1)
    } else {
      // General token / char scan
      if (!isSpaceOrTab) {
        setOutputTokens(prev => [...prev, c])
      }
      setCursor(c => c + 1)
    }
  }

  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setTimeout(() => {
        handleStep()
      }, 350)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, cursor, phase])

  // Three.js Scene: 3D Conveyor Belt of Characters
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const beltGroupRef = useRef(null)
  const pointerMeshRef = useRef(null)

  // Initialize scene ONCE
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 250

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x11111b)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 4.5, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 10, 5)
    scene.add(dirLight)

    const beltGroup = new THREE.Group()
    scene.add(beltGroup)
    beltGroupRef.current = beltGroup

    const coneGeo = new THREE.ConeGeometry(0.25, 0.6, 16)
    coneGeo.rotateX(Math.PI)
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0xf9e2af,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
    })
    const pointerMesh = new THREE.Mesh(coneGeo, coneMat)
    pointerMesh.position.set(0, 1.4, 0)
    scene.add(pointerMesh)
    pointerMeshRef.current = pointerMesh

    let reqId
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      if (pointerMeshRef.current) {
        pointerMeshRef.current.position.y = 1.4 + Math.sin(Date.now() * 0.005) * 0.1
      }
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container || !rendererRef.current) return
      const w = container.clientWidth || 600
      const h = container.clientHeight || 250
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', handleResize)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
      }
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  // Update meshes only when chars or cursor changes, without recreating WebGL renderer
  useEffect(() => {
    const beltGroup = beltGroupRef.current
    if (!beltGroup) return

    // Clear old meshes in group
    while (beltGroup.children.length > 0) {
      const obj = beltGroup.children[0]
      if (obj.geometry) obj.geometry.dispose()
      beltGroup.remove(obj)
    }

    const boxGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7)
    const spaceGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5)

    const charMat = new THREE.MeshStandardMaterial({
      color: 0x89b4fa,
      metalness: 0.2,
      roughness: 0.3,
    })
    const activeMat = new THREE.MeshStandardMaterial({
      color: 0xf38ba8,
      emissive: 0x9e1a3a,
      emissiveIntensity: 0.6,
      roughness: 0.1,
    })
    const spaceMat = new THREE.MeshStandardMaterial({
      color: 0x313244,
      roughness: 0.9,
    })

    const totalChars = Math.min(chars.length, 16)
    const startX = -(totalChars * 0.9) / 2 + 0.45

    for (let i = 0; i < totalChars; i++) {
      const ch = chars[i]
      const isSpace = ch === ' ' || ch === '\t'
      const isActive = i === cursor

      const mesh = new THREE.Mesh(
        isSpace ? spaceGeo : boxGeo,
        isActive ? activeMat : isSpace ? spaceMat : charMat
      )
      mesh.position.set(startX + i * 0.9, isActive ? 0.6 : isSpace ? 0.1 : 0.35, 0)
      beltGroup.add(mesh)
    }

    if (pointerMeshRef.current) {
      const pointerX = startX + Math.min(cursor, totalChars - 1) * 0.9
      pointerMeshRef.current.position.x = pointerX
    }
  }, [chars, cursor])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 text-white">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-amber-400" />
          <span className="font-mono text-xs font-bold text-zinc-100">
            Laboratorio 3D: Escaneo de Palabras y Delimitadores
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
          Fase: {phase}
        </span>
      </div>

      <div className="relative h-[230px] w-full bg-[#11111b]">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-amber-300 border border-amber-500/30">
            Flecha Amarilla: Puntero *str / Índice i
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-blue-300 border border-blue-500/30">
            Bloques Azules: Letras
          </span>
        </div>
      </div>

      <div className="p-3 bg-zinc-50 border-t border-zinc-200 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(p => !p)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs',
                isPlaying
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              )}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pausar' : 'Escanear'}</span>
            </button>

            <button
              onClick={handleStep}
              disabled={isPlaying}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
            >
              <ArrowRight size={13} />
              <span>Paso (+1)</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 bg-white border border-zinc-200"
              title="Reiniciar"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="text-xs font-mono text-zinc-700 bg-white px-3 py-1 rounded-lg border border-zinc-200">
            Salida acumulada: <strong className="text-indigo-600 font-bold">"{outputTokens.join('')}"</strong>
          </div>
        </div>

        {/* Char conveyor visualizer */}
        <div className="bg-white p-2.5 rounded-xl border border-zinc-200/80">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1 font-mono">
            <span>Cinta transportadora en memoria:</span>
            <span>i = {cursor}/{chars.length}</span>
          </div>
          <div className="flex gap-1 overflow-x-auto py-1 font-mono select-none">
            {chars.map((c, idx) => {
              const isCurrent = idx === cursor
              const isSpace = c === ' ' || c === '\t'
              return (
                <div
                  key={idx}
                  className={clsx(
                    'h-7 min-w-[28px] px-1 rounded flex items-center justify-center font-bold text-xs border transition-all',
                    isCurrent
                      ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300 scale-110'
                      : isSpace
                      ? 'bg-zinc-100 text-zinc-400 border-zinc-200'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-200'
                  )}
                >
                  {isSpace ? (c === '\t' ? '\\t' : '␣') : c}
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-[11px] font-sans text-zinc-500 italic bg-white/60 p-2 rounded-lg border border-zinc-200/60">
          🔍 <strong>Acción del puntero:</strong> {actionLog}
        </p>
      </div>
    </div>
  )
}
