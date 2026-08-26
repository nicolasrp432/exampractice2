import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Play, Pause, RotateCcw, ArrowRight, Sparkles, Check, Hash } from 'lucide-react'
import clsx from 'clsx'

/**
 * Visualizador 3D interactivo de Tabla de Búsqueda ASCII (Lookup Table de 256 booleanos)
 * para inter, union, wdmatch, hidenp.
 */
export default function AsciiTable3D({
  exerciseId = 'inter',
  initialS1 = 'padinton',
  initialS2 = 'paqefwtdjetyiytjneytjoeyjnejeyj',
}) {
  const mountRef = useRef(null)
  const [s1, setS1] = useState(initialS1)
  const [s2, setS2] = useState(initialS2)
  const [cursor1, setCursor1] = useState(0)
  const [cursor2, setCursor2] = useState(0)
  const [seenTable, setSeenTable] = useState(() => new Array(256).fill(0))
  const [outputStr, setOutputStr] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [statusMsg, setStatusMsg] = useState('Listo para iniciar escaneo')

  const isUnion = exerciseId === 'union'
  const isInter = exerciseId === 'inter'
  const isWdmatch = exerciseId === 'wdmatch'
  const isHidenp = exerciseId === 'hidenp'

  const handleReset = () => {
    setIsPlaying(false)
    setCursor1(0)
    setCursor2(0)
    setSeenTable(new Array(256).fill(0))
    setOutputStr('')
    setStatusMsg('Reiniciado')
  }

  // Paso algoritmo inter / union / wdmatch
  const handleStep = () => {
    if (isInter) {
      // inter: Primero llena s2 con seen=1, luego recorre s1 y si seen=1 imprime y seen=2
      if (cursor2 < s2.length) {
        const charCode = s2.charCodeAt(cursor2)
        const newTable = [...seenTable]
        if (newTable[charCode] === 0) {
          newTable[charCode] = 1
        }
        setSeenTable(newTable)
        setStatusMsg(`Paso s2[${cursor2}] = '${s2[cursor2]}': Marcado como presente en s2 (flag = 1)`)
        setCursor2(c => c + 1)
      } else if (cursor1 < s1.length) {
        const charCode = s1.charCodeAt(cursor1)
        const char = s1[cursor1]
        const newTable = [...seenTable]

        if (newTable[charCode] === 1) {
          newTable[charCode] = 2 // ya impreso
          setSeenTable(newTable)
          setOutputStr(prev => prev + char)
          setStatusMsg(`Paso s1[${cursor1}] = '${char}': ¡Coincide y no ha sido impreso! Se añade a la salida`)
        } else if (newTable[charCode] === 2) {
          setStatusMsg(`Paso s1[${cursor1}] = '${char}': Ya fue impreso antes (duplicado ignorado)`)
        } else {
          setStatusMsg(`Paso s1[${cursor1}] = '${char}': No existe en s2`)
        }
        setCursor1(c => c + 1)
      } else {
        setIsPlaying(false)
        setStatusMsg('¡Escaneo completado!')
      }
    } else if (isUnion) {
      // union: Recorre s1 imprimiendo sin repetir, luego s2 imprimiendo sin repetir
      if (cursor1 < s1.length) {
        const charCode = s1.charCodeAt(cursor1)
        const char = s1[cursor1]
        const newTable = [...seenTable]
        if (newTable[charCode] === 0) {
          newTable[charCode] = 1
          setSeenTable(newTable)
          setOutputStr(prev => prev + char)
          setStatusMsg(`Paso s1[${cursor1}] = '${char}': Primera vez que se ve → Impreso`)
        } else {
          setStatusMsg(`Paso s1[${cursor1}] = '${char}': Ya impreso anteriormente`)
        }
        setCursor1(c => c + 1)
      } else if (cursor2 < s2.length) {
        const charCode = s2.charCodeAt(cursor2)
        const char = s2[cursor2]
        const newTable = [...seenTable]
        if (newTable[charCode] === 0) {
          newTable[charCode] = 1
          setSeenTable(newTable)
          setOutputStr(prev => prev + char)
          setStatusMsg(`Paso s2[${cursor2}] = '${char}': Primera vez que se ve → Impreso`)
        } else {
          setStatusMsg(`Paso s2[${cursor2}] = '${char}': Ya impreso anteriormente`)
        }
        setCursor2(c => c + 1)
      } else {
        setIsPlaying(false)
        setStatusMsg('¡Unión completada sin duplicados!')
      }
    } else if (isWdmatch || isHidenp) {
      // wdmatch / hidenp: Comprueba si s1 está contenida como subsecuencia en s2
      if (cursor1 < s1.length && cursor2 < s2.length) {
        if (s1[cursor1] === s2[cursor2]) {
          setStatusMsg(`¡Coincidencia encontrada! s1[${cursor1}] ('${s1[cursor1]}') == s2[${cursor2}] ('${s2[cursor2]}')`)
          setCursor1(c => c + 1)
          setCursor2(c => c + 1)
        } else {
          setStatusMsg(`Buscando s1[${cursor1}] ('${s1[cursor1]}') en s2[${cursor2}] ('${s2[cursor2]}')... avanzando s2`)
          setCursor2(c => c + 1)
        }
      } else {
        setIsPlaying(false)
        if (cursor1 >= s1.length) {
          setOutputStr(s1)
          setStatusMsg(`¡Éxito! Todas las letras de s1 encontradas en orden en s2. Salida: "${s1}"`)
        } else {
          setStatusMsg(`Fin de s2 sin encontrar todas las letras de s1. Sin salida.`)
        }
      }
    }
  }

  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setTimeout(() => {
        handleStep()
      }, 300)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, cursor1, cursor2, seenTable])

  // Three.js 3D Rack de ASCII Slots
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 260

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x11111b)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 5, 8.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(4, 10, 5)
    scene.add(dirLight)

    const rackGroup = new THREE.Group()
    scene.add(rackGroup)

    // Renderizamos los caracteres ASCII relevantes del alfabeto (97 a 122 -> 'a' a 'z')
    const startChar = 97
    const count = 26
    const colsPerRow = 13

    const boxGeo = new THREE.BoxGeometry(0.55, 0.4, 0.55)

    const idleMat = new THREE.MeshStandardMaterial({ color: 0x313244, roughness: 0.8 })
    const seenMat = new THREE.MeshStandardMaterial({
      color: 0x89b4fa,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    })
    const printedMat = new THREE.MeshStandardMaterial({
      color: 0xa6e3a1,
      emissive: 0x14532d,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    })

    for (let i = 0; i < count; i++) {
      const code = startChar + i
      const val = seenTable[code] || 0
      const row = Math.floor(i / colsPerRow)
      const col = i % colsPerRow

      let mat = idleMat
      let height = 1
      if (val === 1) {
        mat = seenMat
        height = 1.4
      } else if (val === 2) {
        mat = printedMat
        height = 1.8
      }

      const mesh = new THREE.Mesh(boxGeo, mat)
      mesh.position.set(col * 0.75 - (colsPerRow * 0.75) / 2 + 0.37, (height * 0.4) / 2, row * 1.0 - 0.5)
      mesh.scale.set(1, height, 1)
      rackGroup.add(mesh)
    }

    let reqId
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      rackGroup.rotation.y = Math.sin(Date.now() * 0.0006) * 0.05
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 600
      const h = container.clientHeight || 260
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
  }, [seenTable])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 text-white">
        <div className="flex items-center gap-2">
          <Hash size={16} className="text-cyan-400" />
          <span className="font-mono text-xs font-bold text-zinc-100">
            Laboratorio 3D: Tabla de Búsqueda ASCII (256 Banderas)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
          O(1) Acceso en Memoria
        </span>
      </div>

      <div className="relative h-[230px] w-full bg-[#11111b]">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-blue-300 border border-blue-500/30">
            Azul: Presente en s2 (seen=1)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-green-300 border border-green-500/30">
            Verde: Emitido en Salida (seen=2)
          </span>
        </div>
      </div>

      {/* Controls & Stream */}
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
              <span>{isPlaying ? 'Pausar' : 'Escanear Animado'}</span>
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

          <div className="text-xs font-mono text-zinc-600 bg-white px-3 py-1 rounded-lg border border-zinc-200">
            Salida Actual: <strong className="text-green-600 font-bold">"{outputStr}"</strong>
          </div>
        </div>

        {/* Input strings cursor cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 bg-white rounded-lg border border-zinc-200">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
              <span>Cadena 1 (s1):</span>
              <span>idx: {cursor1}/{s1.length}</span>
            </div>
            <div className="flex gap-1 overflow-x-auto py-1">
              {s1.split('').map((char, i) => (
                <span
                  key={i}
                  className={clsx(
                    'w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 border transition-all',
                    i === cursor1
                      ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300 scale-110'
                      : i < cursor1
                      ? 'bg-zinc-100 text-zinc-400 border-zinc-200'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-200'
                  )}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2 bg-white rounded-lg border border-zinc-200">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
              <span>Cadena 2 (s2):</span>
              <span>idx: {cursor2}/{s2.length}</span>
            </div>
            <div className="flex gap-1 overflow-x-auto py-1">
              {s2.split('').map((char, i) => (
                <span
                  key={i}
                  className={clsx(
                    'w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 border transition-all',
                    i === cursor2
                      ? 'bg-cyan-600 text-white border-cyan-700 ring-2 ring-cyan-300 scale-110'
                      : i < cursor2
                      ? 'bg-zinc-100 text-zinc-400 border-zinc-200'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-200'
                  )}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[11px] font-sans text-zinc-500 italic bg-white/60 p-2 rounded-lg border border-zinc-200/60">
          💡 <strong>Estado del algoritmo:</strong> {statusMsg}
        </p>
      </div>
    </div>
  )
}
