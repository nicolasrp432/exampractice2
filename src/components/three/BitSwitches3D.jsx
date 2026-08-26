import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Sparkles, RotateCcw, ArrowLeft, ArrowRight, Zap, RefreshCw, Layers } from 'lucide-react'

/**
 * Visualizador 3D interactivo de 8 Bits / Byte en C.
 * Permite a principiantes y niños entender un byte como 8 interruptores físicos.
 * Incluye operaciones como <<, >>, swap_bits, reverse_bits, ~, & mask, etc.
 */
export default function BitSwitches3D({ initialValue = 42 }) {
  const mountRef = useRef(null)
  const [byteVal, setByteVal] = useState(initialValue & 0xff)

  // Obtener array de 8 bits [bit7, bit6, ... bit0]
  const bits = Array.from({ length: 8 }, (_, i) => (byteVal >> (7 - i)) & 1)

  const toggleBit = (bitIndex) => {
    const bitPos = 7 - bitIndex
    setByteVal((prev) => prev ^ (1 << bitPos))
  }

  const shiftLeft = () => setByteVal((prev) => (prev << 1) & 0xff)
  const shiftRight = () => setByteVal((prev) => (prev >> 1) & 0xff)
  const bitwiseNot = () => setByteVal((prev) => ~prev & 0xff)
  const swapBits = () => setByteVal((prev) => ((prev >> 4) | (prev << 4)) & 0xff)
  const reverseBits = () => {
    let r = 0
    for (let i = 0; i < 8; i++) {
      r = (r << 1) | ((byteVal >> i) & 1)
    }
    setByteVal(r & 0xff)
  }

  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const switchesGroupRef = useRef(null)
  const textSpritesRef = useRef([])
  const lightPointsRef = useRef([])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 280

    // 1. Escena
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x11111b) // Dark cybernetic
    sceneRef.current = scene

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 4.5, 7.5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 4. Luces
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 8, 5)
    scene.add(dirLight)

    // 5. Plataforma base
    const baseGeo = new THREE.BoxGeometry(11, 0.4, 2.5)
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e1e2e, roughness: 0.4, metalness: 0.5 })
    const baseMesh = new THREE.Mesh(baseGeo, baseMat)
    baseMesh.position.y = -0.2
    scene.add(baseMesh)

    const switchesGroup = new THREE.Group()
    scene.add(switchesGroup)
    switchesGroupRef.current = switchesGroup

    // 7. Raycaster para click en los interruptores 3D
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      for (const hit of intersects) {
        let p = hit.object.parent
        while (p && p !== scene) {
          if (p.userData && typeof p.userData.bitIndex === 'number') {
            toggleBit(p.userData.bitIndex)
            return
          }
          p = p.parent
        }
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)

    // 8. Render loop
    let animationFrameId
    const startTime = performance.now()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) * 0.001
      lightPointsRef.current.forEach((lp) => {
        lp.intensity = 1.0 + Math.sin(t * 6) * 0.2
      })
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container || !rendererRef.current) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      textSpritesRef.current.forEach((t) => t.dispose())
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
      }
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  // Actualizar interruptores sin destruir el WebGLRenderer
  useEffect(() => {
    const switchesGroup = switchesGroupRef.current
    if (!switchesGroup) return

    textSpritesRef.current.forEach((t) => t.dispose())
    textSpritesRef.current = []
    lightPointsRef.current = []

    while (switchesGroup.children.length > 0) {
      const obj = switchesGroup.children[0]
      if (obj.geometry) obj.geometry.dispose()
      switchesGroup.remove(obj)
    }

    const spacing = 1.25
    const startX = -((8 - 1) * spacing) / 2

    bits.forEach((bit, i) => {
      const x = startX + i * spacing
      const bitWeight = 1 << (7 - i)
      const isOn = bit === 1

      const group = new THREE.Group()
      group.position.set(x, 0, 0)

      // Base del socket
      const socketGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.3, 24)
      const socketMat = new THREE.MeshStandardMaterial({ color: 0x313244, metalness: 0.6 })
      const socket = new THREE.Mesh(socketGeo, socketMat)
      socket.position.y = 0.15
      group.add(socket)

      // Palanca / Interruptor
      const leverGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 16)
      const leverMat = new THREE.MeshStandardMaterial({ color: 0x6c7086, metalness: 0.8, roughness: 0.2 })
      const lever = new THREE.Mesh(leverGeo, leverMat)
      lever.position.y = 0.6
      lever.rotation.x = isOn ? 0.35 : -0.35
      group.add(lever)

      // Bombilla / LED 3D brillante
      const bulbGeo = new THREE.SphereGeometry(0.25, 24, 24)
      const bulbMat = new THREE.MeshStandardMaterial({
        color: isOn ? 0x22c55e : 0x3f3f46,
        emissive: isOn ? 0x16a34a : 0x18181b,
        emissiveIntensity: isOn ? 1.5 : 0.1,
        roughness: 0.1,
      })
      const bulb = new THREE.Mesh(bulbGeo, bulbMat)
      bulb.position.set(0, 1.05, isOn ? 0.2 : -0.2)
      group.add(bulb)

      // Luz puntual si está encendido
      if (isOn) {
        const pLight = new THREE.PointLight(0x22c55e, 1.2, 3)
        pLight.position.set(0, 1.2, 0)
        group.add(pLight)
        lightPointsRef.current.push(pLight)
      }

      // Sprite con valor y peso
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 96
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = isOn ? '#4ade80' : '#71717a'
      ctx.font = 'bold 36px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(String(bit), 64, 38)
      ctx.fillStyle = '#94a3b8'
      ctx.font = '22px monospace'
      ctx.fillText(`2^${7 - i}`, 64, 65)
      ctx.fillStyle = '#64748b'
      ctx.font = '16px monospace'
      ctx.fillText(`(${bitWeight})`, 64, 86)

      const texture = new THREE.CanvasTexture(canvas)
      textSpritesRef.current.push(texture)
      const spriteMat = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.position.set(0, 1.8, 0)
      sprite.scale.set(0.9, 0.65, 1)
      group.add(sprite)

      group.userData = { bitIndex: i }
      switchesGroup.add(group)
    })
  }, [byteVal])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-sm">
            8-BIT
          </span>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Los 8 Interruptores del Byte (3D)</h4>
            <p className="text-[11px] text-zinc-500">Haz clic en cualquier bombilla 3D o usa los botones de operaciones en C</p>
          </div>
        </div>

        {/* Input numérico directo */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono">Valor:</span>
          <input
            type="number"
            min={0}
            max={255}
            value={byteVal}
            onChange={(e) => setByteVal(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
            className="w-18 rounded-md border border-zinc-300 bg-white px-2 py-0.5 font-mono text-xs text-center font-bold text-zinc-800 outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => setByteVal(0)}
            className="rounded-md border border-zinc-200 bg-white p-1 text-zinc-400 hover:text-zinc-700"
            title="Poner a 0"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Visor 3D Three.js */}
      <div className="relative h-60 sm:h-68 w-full bg-[#11111b] cursor-pointer">
        <div ref={mountRef} className="h-full w-full" />
      </div>

      {/* Representaciones simultáneas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-zinc-900 text-white border-t border-zinc-800 text-center font-mono">
        <div className="rounded-lg bg-zinc-800/80 p-2">
          <span className="text-[10px] text-zinc-400 block uppercase">Binario</span>
          <span className="text-sm font-bold text-emerald-400">
            {byteVal.toString(2).padStart(8, '0')}
          </span>
        </div>
        <div className="rounded-lg bg-zinc-800/80 p-2">
          <span className="text-[10px] text-zinc-400 block uppercase">Decimal (uint8)</span>
          <span className="text-sm font-bold text-sky-400">{byteVal}</span>
        </div>
        <div className="rounded-lg bg-zinc-800/80 p-2">
          <span className="text-[10px] text-zinc-400 block uppercase">Hexadecimal</span>
          <span className="text-sm font-bold text-purple-400">
            0x{byteVal.toString(16).toUpperCase().padStart(2, '0')}
          </span>
        </div>
        <div className="rounded-lg bg-zinc-800/80 p-2">
          <span className="text-[10px] text-zinc-400 block uppercase">Carácter ASCII</span>
          <span className="text-sm font-bold text-amber-400">
            {byteVal >= 32 && byteVal <= 126 ? `'${String.fromCharCode(byteVal)}'` : 'No imprimible'}
          </span>
        </div>
      </div>

      {/* Barra de Operaciones Bit a Bit en C */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-zinc-600">Operaciones en C:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={shiftLeft}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-mono text-zinc-700 hover:bg-zinc-100 shadow-xs active:scale-95 transition-all"
            title="Desplazar a la izquierda: val << 1 (Multiplica por 2)"
          >
            <ArrowLeft size={12} className="text-sky-500" />
            val &lt;&lt; 1
          </button>
          <button
            onClick={shiftRight}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-mono text-zinc-700 hover:bg-zinc-100 shadow-xs active:scale-95 transition-all"
            title="Desplazar a la derecha: val >> 1 (Divide entre 2)"
          >
            val &gt;&gt; 1
            <ArrowRight size={12} className="text-sky-500" />
          </button>
          <button
            onClick={bitwiseNot}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-mono text-zinc-700 hover:bg-zinc-100 shadow-xs active:scale-95 transition-all"
            title="Invertir todos los bits: ~val (NOT)"
          >
            <Zap size={12} className="text-amber-500" />
            ~val
          </button>
          <button
            onClick={swapBits}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 hover:bg-emerald-100 shadow-xs active:scale-95 transition-all"
            title="Intercambiar mitades (4 bits): swap_bits"
          >
            <RefreshCw size={12} className="text-emerald-600" />
            swap_bits()
          </button>
          <button
            onClick={reverseBits}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-mono text-purple-800 hover:bg-purple-100 shadow-xs active:scale-95 transition-all"
            title="Invertir el orden de los 8 bits: reverse_bits"
          >
            <Layers size={12} className="text-purple-600" />
            reverse_bits()
          </button>
        </div>
      </div>
    </div>
  )
}
