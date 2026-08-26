import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Play, Pause, RotateCcw, ArrowRight, Sparkles, BarChart2, Shuffle } from 'lucide-react'
import clsx from 'clsx'

/**
 * Visualizador 3D de Arrays, Ordenamiento (sort_int_tab), Rangos en Heap (ft_range) y Máximos (max).
 */
export default function ArrayBars3D({
  exerciseId = 'sort_int_tab',
  initialValues = [42, 13, 7, 99, 25, -4, 58, 3],
}) {
  const mountRef = useRef(null)
  const [array, setArray] = useState(initialValues)
  const [iIdx, setIIdx] = useState(0)
  const [jIdx, setJIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [maxVal, setMaxVal] = useState(Math.max(...initialValues))
  const [statusMsg, setStatusMsg] = useState('Listo para ordenar / inspeccionar')

  const isSort = exerciseId === 'sort_int_tab'
  const isMax = exerciseId === 'max'
  const isRange = exerciseId === 'ft_range' || exerciseId === 'ft_rrange'

  const handleShuffle = () => {
    setIsPlaying(false)
    const shuffled = [...array].sort(() => Math.random() - 0.5)
    setArray(shuffled)
    setIIdx(0)
    setJIdx(0)
    setMaxVal(Math.max(...shuffled))
    setStatusMsg('Array reordenado aleatoriamente')
  }

  const handleReset = () => {
    setIsPlaying(false)
    setArray([42, 13, 7, 99, 25, -4, 58, 3])
    setIIdx(0)
    setJIdx(0)
    setMaxVal(99)
    setStatusMsg('Reiniciado')
  }

  const handleStep = () => {
    if (isSort) {
      // Bubble sort step
      const n = array.length
      let newArr = [...array]
      let currentI = iIdx
      let currentJ = jIdx

      if (currentI < n - 1) {
        if (currentJ < n - currentI - 1) {
          if (newArr[currentJ] > newArr[currentJ + 1]) {
            // Swap
            const temp = newArr[currentJ]
            newArr[currentJ] = newArr[currentJ + 1]
            newArr[currentJ + 1] = temp
            setStatusMsg(`Intercambio: arr[${currentJ}] (${temp}) > arr[${currentJ + 1}] (${newArr[currentJ]}) → Swap ejecutado`)
          } else {
            setStatusMsg(`Comparación: arr[${currentJ}] <= arr[${currentJ + 1}] → No requiere intercambio`)
          }
          setArray(newArr)
          setJIdx(currentJ + 1)
        } else {
          setIIdx(currentI + 1)
          setJIdx(0)
        }
      } else {
        setIsPlaying(false)
        setStatusMsg('¡Array completamente ordenado!')
      }
    } else if (isMax) {
      if (iIdx < array.length) {
        const val = array[iIdx]
        const currentMax = iIdx === 0 ? val : Math.max(maxVal, val)
        setMaxVal(currentMax)
        setStatusMsg(`Inspeccionando arr[${iIdx}] = ${val}. Máximo actual: ${currentMax}`)
        setIIdx(i => i + 1)
      } else {
        setIsPlaying(false)
        setStatusMsg(`Escaneo completado. Valor máximo final: ${maxVal}`)
      }
    } else {
      setIsPlaying(false)
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
  }, [isPlaying, iIdx, jIdx, array])

  // Three.js 3D Bar Chart
  const rendererRef = useRef(null)
  const barGroupRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 240

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x11111b)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 5, 8.5)
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

    const barGroup = new THREE.Group()
    scene.add(barGroup)
    barGroupRef.current = barGroup

    let reqId
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      if (barGroupRef.current) {
        barGroupRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.06
      }
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container || !rendererRef.current) return
      const w = container.clientWidth || 600
      const h = container.clientHeight || 240
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

  // Update bars without recreating WebGL canvas
  useEffect(() => {
    const barGroup = barGroupRef.current
    if (!barGroup) return

    while (barGroup.children.length > 0) {
      const obj = barGroup.children[0]
      if (obj.geometry) obj.geometry.dispose()
      barGroup.remove(obj)
    }

    const maxAbs = Math.max(...array.map(Math.abs), 1)
    const count = array.length
    const startX = -(count * 0.7) / 2 + 0.35

    const defaultMat = new THREE.MeshStandardMaterial({ color: 0x89b4fa, roughness: 0.3 })
    const comparingMat = new THREE.MeshStandardMaterial({
      color: 0xf38ba8,
      emissive: 0x991b1b,
      emissiveIntensity: 0.6,
    })
    const maxMat = new THREE.MeshStandardMaterial({
      color: 0xf9e2af,
      emissive: 0x854d0e,
      emissiveIntensity: 0.7,
    })

    array.forEach((val, idx) => {
      const height = Math.max(0.3, (Math.abs(val) / maxAbs) * 3)
      const isComparing = (isSort && (idx === jIdx || idx === jIdx + 1)) || (isMax && idx === iIdx)
      const isMaxItem = val === maxVal

      const geo = new THREE.BoxGeometry(0.5, height, 0.5)
      const mesh = new THREE.Mesh(
        geo,
        isComparing ? comparingMat : isMaxItem ? maxMat : defaultMat
      )
      mesh.position.set(startX + idx * 0.7, height / 2, 0)
      barGroup.add(mesh)
    })
  }, [array, iIdx, jIdx, maxVal, isSort, isMax])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 text-white">
        <div className="flex items-center gap-2">
          <BarChart2 size={16} className="text-blue-400" />
          <span className="font-mono text-xs font-bold text-zinc-100">
            Laboratorio 3D: Array en Heap & Ordenamiento
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
          Elementos: {array.length} | int* ({array.length * 4} bytes)
        </span>
      </div>

      <div className="relative h-[220px] w-full bg-[#11111b]">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-red-300 border border-red-500/30">
            Rojo: Celdas en comparación
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-amber-300 border border-amber-500/30">
            Dorado: Máximo ({maxVal})
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
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
              )}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pausar' : 'Ordenar / Ejecutar'}</span>
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
              onClick={handleShuffle}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-100"
              title="Mezclar array"
            >
              <Shuffle size={13} />
              <span>Mezclar</span>
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
            Array actual: [{array.join(', ')}]
          </div>
        </div>

        <p className="text-[11px] font-sans text-zinc-500 italic bg-white/60 p-2 rounded-lg border border-zinc-200/60">
          📊 <strong>Acción de memoria:</strong> {statusMsg}
        </p>
      </div>
    </div>
  )
}
