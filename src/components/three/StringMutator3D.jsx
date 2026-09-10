import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Play, Pause, RotateCcw, ArrowRight, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

/**
 * Visualizador 3D Dedicado para Operaciones de Memoria y Mutación de Strings
 * Soporta: ft_swap, ft_strlen, rotone, rot_13, ft_strrev, search_and_replace, repeat_alpha, ulstr, alpha_mirror, ft_strcpy, ft_strcmp
 */
export default function StringMutator3D({
  operation = 'ft_strlen',
  initialText = '42Madrid',
}) {
  const mountRef = useRef(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [logText, setLogText] = useState('')

  // Estado para ft_swap
  const [swapState, setSwapState] = useState({
    valA: 42,
    valB: 1337,
    valTmp: null,
    activePhase: 0, // 0: init, 1: tmp=*a, 2: *a=*b, 3: *b=tmp, 4: done
  })

  // Estado para ft_strlen
  const [strlenCount, setStrlenCount] = useState(0)

  // Estado para strings
  const [activeIdx, setActiveIdx] = useState(0)
  const [endIdx, setEndIdx] = useState(initialText.length - 1)
  const [transformedChars, setTransformedChars] = useState(() => initialText.split(''))

  // Configuración de la escena Three.js
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const meshesRef = useRef([])
  const arrowMeshRef = useRef(null)

  // Inicializar Three.js Canvas
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 320

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a) // Slate-900 oscuro
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 5, 12)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.innerHTML = ''
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 1.2)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0x10b981, 1, 20)
    pointLight.position.set(-5, 4, 3)
    scene.add(pointLight)

    // Cuadrícula sutil
    const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b)
    grid.position.y = -1.2
    scene.add(grid)

    // Crear objetos visuales según la operación
    build3DScene(scene, operation, transformedChars, swapState)

    // Bucle de renderizado
    let animationFrameId
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      // Animación suave de flotación
      if (meshesRef.current) {
        meshesRef.current.forEach((mesh, i) => {
          if (mesh && mesh.userData?.isFloating) {
            mesh.position.y += Math.sin(Date.now() * 0.003 + i) * 0.002
          }
        })
      }
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      if (container) container.innerHTML = ''
    }
  }, [operation])

  // Helper para construir la escena 3D según la operación
  function build3DScene(scene, op, chars, swap) {
    // Limpiar meshes previos
    meshesRef.current.forEach(m => scene.remove(m))
    meshesRef.current = []

    if (op === 'ft_swap') {
      // 3 Bloques: *a, *b, tmp
      const geometry = new THREE.BoxGeometry(2, 1.5, 2)
      
      // Slot *a
      const matA = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.3, metalness: 0.2 })
      const meshA = new THREE.Mesh(geometry, matA)
      meshA.position.set(-3.5, 0, 0)
      meshA.userData = { id: 'a', isFloating: true }
      scene.add(meshA)
      meshesRef.current.push(meshA)

      // Slot *b
      const matB = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.2 })
      const meshB = new THREE.Mesh(geometry, matB)
      meshB.position.set(3.5, 0, 0)
      meshB.userData = { id: 'b', isFloating: true }
      scene.add(meshB)
      meshesRef.current.push(meshB)

      // Slot tmp (centro, abajo)
      const matTmp = new THREE.MeshStandardMaterial({ 
        color: 0xf59e0b, 
        wireframe: swap.valTmp === null,
        roughness: 0.3 
      })
      const meshTmp = new THREE.Mesh(geometry, matTmp)
      meshTmp.position.set(0, -0.5, 2)
      meshTmp.userData = { id: 'tmp', isFloating: false }
      scene.add(meshTmp)
      meshesRef.current.push(meshTmp)
    } else {
      // Bloques de caracteres en fila (C-String)
      const count = chars.length
      const spacing = 1.6
      const startX = -((count * spacing) / 2) + spacing / 2

      chars.forEach((ch, idx) => {
        const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2)
        const isNullTerm = ch === '\\0' || idx === chars.length - 1
        const color = isNullTerm ? 0xf43f5e : (idx === activeIdx ? 0x10b981 : 0x3b82f6)

        const mat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.2,
          metalness: 0.1,
          wireframe: isNullTerm && ch !== '\\0',
        })
        const cube = new THREE.Mesh(geo, mat)
        cube.position.set(startX + idx * spacing, 0, 0)
        cube.userData = { charIndex: idx, char: ch, isFloating: true }
        scene.add(cube)
        meshesRef.current.push(cube)
      })

      // Flecha puntero 3D
      const arrowGeo = new THREE.ConeGeometry(0.4, 0.8, 8)
      const arrowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04 })
      const arrow = new THREE.Mesh(arrowGeo, arrowMat)
      arrow.rotation.x = Math.PI // Apuntando hacia abajo
      arrow.position.set(startX + activeIdx * spacing, 1.5, 0)
      scene.add(arrow)
      arrowMeshRef.current = arrow
    }
  }

  // Actualizar colores y posiciones cuando cambia el estado
  useEffect(() => {
    if (operation === 'ft_swap') {
      const [meshA, meshB, meshTmp] = meshesRef.current
      if (meshA && meshB && meshTmp) {
        if (swapState.activePhase === 1) {
          meshTmp.material.wireframe = false
          meshTmp.material.color.setHex(0xf59e0b) // tmp toma color de A
        } else if (swapState.activePhase === 2) {
          meshA.material.color.setHex(0x10b981) // A toma color de B
        } else if (swapState.activePhase === 3) {
          meshB.material.color.setHex(0x6366f1) // B toma color original de A
        }
      }
    } else {
      // Actualizar posición de la flecha
      if (arrowMeshRef.current) {
        const spacing = 1.6
        const startX = -((transformedChars.length * spacing) / 2) + spacing / 2
        arrowMeshRef.current.position.x = startX + activeIdx * spacing
      }
      // Actualizar colores de los cubos
      meshesRef.current.forEach((mesh, idx) => {
        if (!mesh) return
        if (idx === activeIdx) {
          mesh.material.color.setHex(0x10b981) // Verde activo
          mesh.scale.set(1.2, 1.2, 1.2)
        } else if (idx === endIdx && operation === 'ft_strrev') {
          mesh.material.color.setHex(0x06b6d4) // Cyan para end
          mesh.scale.set(1.2, 1.2, 1.2)
        } else {
          mesh.material.color.setHex(idx === transformedChars.length - 1 ? 0xf43f5e : 0x3b82f6)
          mesh.scale.set(1, 1, 1)
        }
      })
    }
  }, [activeIdx, endIdx, swapState, operation, transformedChars])

  // Lógica interactiva de paso a paso
  const handleStep = () => {
    if (operation === 'ft_swap') {
      if (swapState.activePhase === 0) {
        setSwapState(prev => ({
          ...prev,
          valTmp: prev.valA,
          activePhase: 1,
        }))
        setLogText("Paso 1: `int tmp = *a;` → Se preserva el valor de a (42) en la pila local.")
      } else if (swapState.activePhase === 1) {
        setSwapState(prev => ({
          ...prev,
          valA: prev.valB,
          activePhase: 2,
        }))
        setLogText("Paso 2: `*a = *b;` → Se escribe el valor de b (1337) en la dirección apuntada por a.")
      } else if (swapState.activePhase === 2) {
        setSwapState(prev => ({
          ...prev,
          valB: prev.valTmp,
          activePhase: 3,
        }))
        setLogText("Paso 3: `*b = tmp;` → Se escribe el valor temporal (42) en la dirección apuntada por b.")
      } else {
        setLogText("¡Intercambio completado con éxito! *a vale 1337 y *b vale 42 in-place.")
      }
    } else if (operation === 'ft_strlen') {
      if (activeIdx < transformedChars.length - 1) {
        const next = activeIdx + 1
        setActiveIdx(next)
        setStrlenCount(next)
        setLogText(`str[${activeIdx}] = '${transformedChars[activeIdx]}' ≠ '\\0' → Contador i incrementa a ${next}`)
      } else {
        setLogText(`str[${activeIdx}] = '\\0' (terminador) → ¡FIN DEL RECORRIDO! Retorna longitud = ${strlenCount}`)
        setIsPlaying(false)
      }
    } else if (operation === 'rotone' || operation === 'rot_13') {
      if (activeIdx < transformedChars.length - 1) {
        const c = transformedChars[activeIdx]
        let shifted = c
        if (operation === 'rotone') {
          if ((c >= 'a' && c <= 'y') || (c >= 'A' && c <= 'Y')) shifted = String.fromCharCode(c.charCodeAt(0) + 1)
          else if (c === 'z') shifted = 'a'
          else if (c === 'Z') shifted = 'A'
        } else {
          if ((c >= 'a' && c <= 'm') || (c >= 'A' && c <= 'M')) shifted = String.fromCharCode(c.charCodeAt(0) + 13)
          else if ((c >= 'n' && c <= 'z') || (c >= 'N' && c <= 'Z')) shifted = String.fromCharCode(c.charCodeAt(0) - 13)
        }
        const updated = [...transformedChars]
        updated[activeIdx] = shifted
        setTransformedChars(updated)
        setLogText(`Carácter [${activeIdx}] '${c}' rota a '${shifted}'`)
        setActiveIdx(prev => prev + 1)
      } else {
        setLogText("¡Cadena completamente transformada y rotada!")
        setIsPlaying(false)
      }
    } else if (operation === 'ft_strrev') {
      if (activeIdx < endIdx) {
        const updated = [...transformedChars]
        const tmp = updated[activeIdx]
        updated[activeIdx] = updated[endIdx]
        updated[endIdx] = tmp
        setTransformedChars(updated)
        setLogText(`Swap simétrico: str[${activeIdx}] ('${tmp}') <-> str[${endIdx}] ('${updated[activeIdx]}')`)
        setActiveIdx(prev => prev + 1)
        setEndIdx(prev => prev - 1)
      } else {
        setLogText("start >= end → ¡Cadena completamente invertida in-place!")
        setIsPlaying(false)
      }
    } else if (operation === 'ulstr') {
      if (activeIdx < transformedChars.length - 1) {
        const c = transformedChars[activeIdx]
        let shifted = c
        if (c >= 'a' && c <= 'z') shifted = c.toUpperCase()
        else if (c >= 'A' && c <= 'Z') shifted = c.toLowerCase()
        const updated = [...transformedChars]
        updated[activeIdx] = shifted
        setTransformedChars(updated)
        setLogText(`Invertir caja: '${c}' (ASCII ${c.charCodeAt(0)}) -> '${shifted}' (ASCII ${shifted.charCodeAt(0)})`)
        setActiveIdx(prev => prev + 1)
      } else {
        setLogText("¡Inversión de mayúsculas/minúsculas finalizada!")
        setIsPlaying(false)
      }
    } else if (operation === 'alpha_mirror') {
      if (activeIdx < transformedChars.length - 1) {
        const c = transformedChars[activeIdx]
        let shifted = c
        if (c >= 'a' && c <= 'z') shifted = String.fromCharCode('z'.charCodeAt(0) - (c.charCodeAt(0) - 'a'.charCodeAt(0)))
        else if (c >= 'A' && c <= 'Z') shifted = String.fromCharCode('Z'.charCodeAt(0) - (c.charCodeAt(0) - 'A'.charCodeAt(0)))
        const updated = [...transformedChars]
        updated[activeIdx] = shifted
        setTransformedChars(updated)
        setLogText(`Espejo alfabético: '${c}' -> '${shifted}'`)
        setActiveIdx(prev => prev + 1)
      } else {
        setLogText("¡Espejo alfabético completado!")
        setIsPlaying(false)
      }
    } else {
      // Default step
      if (activeIdx < transformedChars.length - 1) {
        setActiveIdx(prev => prev + 1)
        setLogText(`Avanzando puntero a posición [${activeIdx + 1}]`)
      } else {
        setIsPlaying(false)
      }
    }
  }

  // Reiniciar
  const handleReset = () => {
    setIsPlaying(false)
    setActiveIdx(0)
    setEndIdx(initialText.length - 1)
    setStrlenCount(0)
    setTransformedChars(initialText.split(''))
    setSwapState({
      valA: 42,
      valB: 1337,
      valTmp: null,
      activePhase: 0,
    })
    setLogText("Reiniciado al estado inicial de memoria.")
  }

  // Auto-play
  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setInterval(() => {
        handleStep()
      }, 700)
    }
    return () => clearInterval(timer)
  }, [isPlaying, activeIdx, endIdx, swapState, transformedChars])

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/90 shadow-2xl">
      {/* Barra de cabecera con estado y controles */}
      <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            3D LAB: {operation.toUpperCase()}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
            {operation === 'ft_swap' ? 'Memoria Punteros Stack' : `Buffer Contiguo (${transformedChars.length} bytes)`}
          </span>
        </div>

        {/* Botones de control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md active:scale-95"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Auto Play'}</span>
          </button>
          <button
            onClick={handleStep}
            className="flex items-center space-x-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Paso a Paso</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-xs font-mono rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all active:scale-95"
            title="Reiniciar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Contenedor Canvas 3D */}
      <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-slate-950 to-slate-900">
        <div ref={mountRef} className="w-full h-full" />

        {/* Superposición informativa para ft_swap */}
        {operation === 'ft_swap' && (
          <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
            <div className="p-2 rounded-lg bg-slate-900/85 border border-indigo-500/40 backdrop-blur-md">
              <span className="text-[10px] font-mono text-indigo-400 block font-bold">Dirección: 0x7ffd00 (*a)</span>
              <span className="text-sm font-mono font-bold text-white">Valor: {swapState.valA}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/85 border border-amber-500/40 backdrop-blur-md text-center">
              <span className="text-[10px] font-mono text-amber-400 block font-bold">Stack Local (tmp)</span>
              <span className="text-sm font-mono font-bold text-amber-300">
                {swapState.valTmp !== null ? swapState.valTmp : 'vacío'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/85 border border-emerald-500/40 backdrop-blur-md text-right">
              <span className="text-[10px] font-mono text-emerald-400 block font-bold">Dirección: 0x7ffd04 (*b)</span>
              <span className="text-sm font-mono font-bold text-white">Valor: {swapState.valB}</span>
            </div>
          </div>
        )}

        {/* Superposición informativa para ft_strlen */}
        {operation === 'ft_strlen' && (
          <div className="absolute top-3 right-3 p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md pointer-events-none">
            <span className="text-[10px] font-mono text-emerald-400 block font-bold">ACUMULADOR i</span>
            <span className="text-2xl font-mono font-bold text-white text-right block">{strlenCount}</span>
            <span className="text-[9px] font-mono text-slate-400">bytes válidos</span>
          </div>
        )}

        {/* Indicador de instrucción C activa */}
        <div className="absolute bottom-2 left-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 rounded-lg p-2 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-mono text-slate-200 truncate">
            {logText || "Pulsa 'Paso a Paso' o 'Auto Play' para ver la mutación de memoria en 3D."}
          </span>
        </div>
      </div>

      {/* Tira de memoria física inferior */}
      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between overflow-x-auto text-xs font-mono">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-semibold">Memoria:</span>
          {operation === 'ft_swap' ? (
            <div className="flex space-x-2">
              <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
                *a = {swapState.valA}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                tmp = {swapState.valTmp !== null ? swapState.valTmp : 'NULL'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                *b = {swapState.valB}
              </span>
            </div>
          ) : (
            <div className="flex space-x-1.5 overflow-x-auto">
              {transformedChars.map((c, i) => (
                <span
                  key={i}
                  className={clsx(
                    'px-2 py-0.5 rounded border transition-all text-center min-w-[28px]',
                    i === activeIdx
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 font-bold scale-105'
                      : i === endIdx && operation === 'ft_strrev'
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  )}
                >
                  {c === ' ' ? '␣' : c}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sin fugas en Heap</span>
        </div>
      </div>
    </div>
  )
}
