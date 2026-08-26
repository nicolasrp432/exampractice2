import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Play, RotateCcw, Plus, Minus, Info, Sparkles } from 'lucide-react'

/**
 * Visualizador 3D interactivo de Memoria y Punteros en C.
 * Muestra celdas de memoria física en 3D con direcciones hexadecimales,
 * valores asignados, y flechas 3D animadas que representan punteros desreferenciados.
 */
export default function Memory3DVisualizer({ initialType = 'string', initialText = '42 Madrid' }) {
  const mountRef = useRef(null)
  const [selectedCell, setSelectedCell] = useState(null)
  const [pointerOffset, setPointerOffset] = useState(0)
  const [inputText, setInputText] = useState(initialText)
  const [isPointerMoving, setIsPointerMoving] = useState(false)
  const [viewMode, setViewMode] = useState(initialType) // 'string' | 'array' | 'pointers'

  // Generamos los datos de las celdas según el modo y el texto
  const cellsData = []
  const baseAddress = 0x7ffd80

  if (viewMode === 'string') {
    const chars = inputText.split('')
    chars.forEach((ch, idx) => {
      cellsData.push({
        address: `0x${(baseAddress + idx).toString(16)}`,
        name: `str[${idx}]`,
        val: `'${ch}'`,
        ascii: ch.charCodeAt(0),
        isSpecial: false,
        type: 'char (1 byte)',
      })
    })
    // Null terminator al final
    cellsData.push({
      address: `0x${(baseAddress + chars.length).toString(16)}`,
      name: `str[${chars.length}]`,
      val: "'\\0'",
      ascii: 0,
      isSpecial: true,
      specialLabel: 'Fin de cadena (NULL terminator)',
      type: 'char (1 byte)',
    })
  } else if (viewMode === 'array') {
    const nums = [42, 1337, 7, 99, -4, 256]
    nums.forEach((n, idx) => {
      cellsData.push({
        address: `0x${(baseAddress + idx * 4).toString(16)}`,
        name: `arr[${idx}]`,
        val: `${n}`,
        ascii: null,
        isSpecial: false,
        type: 'int (4 bytes)',
      })
    })
  } else {
    // Modo punteros: variable y puntero que apunta a ella
    cellsData.push({
      address: `0x${baseAddress.toString(16)}`,
      name: 'int x',
      val: '42',
      ascii: null,
      isSpecial: false,
      type: 'int',
    })
    cellsData.push({
      address: `0x${(baseAddress + 8).toString(16)}`,
      name: 'int *ptr',
      val: `0x${baseAddress.toString(16)}`,
      ascii: null,
      isSpecial: true,
      specialLabel: 'Puntero a x (&x)',
      type: 'int * (8 bytes)',
    })
    cellsData.push({
      address: `0x${(baseAddress + 16).toString(16)}`,
      name: 'int **pptr',
      val: `0x${(baseAddress + 8).toString(16)}`,
      ascii: null,
      isSpecial: true,
      specialLabel: 'Puntero doble (**)',
      type: 'int ** (8 bytes)',
    })
  }

  const rendererRef = useRef(null)
  const blocksGroupRef = useRef(null)
  const pointerGroupRef = useRef(null)
  const textCanvasesRef = useRef([])
  const blockMeshesRef = useRef([])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 320

    // 1. Escena
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x181825) // Fondo dark sofisticado catppuccin

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 5.5, 9)
    camera.lookAt(0, 0, 0)

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    rendererRef.current = renderer
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 4. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 7)
    dirLight.castShadow = true
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0x7c3aed, 2, 20)
    pointLight.position.set(0, 3, 2)
    scene.add(pointLight)

    // 5. Suelo de cuadrícula (Grid)
    const gridHelper = new THREE.GridHelper(16, 16, 0x313244, 0x242436)
    gridHelper.position.y = -0.5
    scene.add(gridHelper)

    const blocksGroup = new THREE.Group()
    scene.add(blocksGroup)
    blocksGroupRef.current = blocksGroup

    // 7. Flecha 3D de Puntero (Pointer Arrow)
    const pointerGroup = new THREE.Group()
    const coneGeo = new THREE.ConeGeometry(0.2, 0.5, 16)
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x047857, emissiveIntensity: 0.8 })
    const cone = new THREE.Mesh(coneGeo, coneMat)
    cone.rotation.x = Math.PI // Apuntando hacia abajo
    cone.position.y = 1.6
    pointerGroup.add(cone)

    const cylinderGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 16)
    const cylinderMat = new THREE.MeshStandardMaterial({ color: 0x10b981 })
    const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat)
    cylinder.position.y = 2.1
    pointerGroup.add(cylinder)

    // Etiqueta del puntero `ptr`
    const pCanvas = document.createElement('canvas')
    pCanvas.width = 256
    pCanvas.height = 80
    const pCtx = pCanvas.getContext('2d')
    pCtx.fillStyle = '#10b981'
    pCtx.font = 'bold 38px monospace'
    pCtx.textAlign = 'center'
    pCtx.fillText('*ptr', 128, 50)
    const pTexture = new THREE.CanvasTexture(pCanvas)
    textCanvasesRef.current.push(pTexture)
    const pSpriteMat = new THREE.SpriteMaterial({ map: pTexture })
    const pSprite = new THREE.Sprite(pSpriteMat)
    pSprite.position.set(0, 2.7, 0)
    pSprite.scale.set(1.4, 0.45, 1)
    pointerGroup.add(pSprite)

    scene.add(pointerGroup)
    pointerGroupRef.current = pointerGroup

    // 8. Raycaster para hacer clic e interactuar con celdas 3D
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(blockMeshesRef.current)
      if (intersects.length > 0) {
        const hit = intersects[0].object
        setSelectedCell(hit.userData.cellData)
        setPointerOffset(hit.userData.index)
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)

    // 9. Loop de animación
    let animationFrameId
    const startTime = performance.now()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsed = (performance.now() - startTime) * 0.001

      if (pointerGroupRef.current) {
        pointerGroupRef.current.position.y = Math.sin(elapsed * 4) * 0.08
      }

      renderer.render(scene, camera)
    }

    animate()

    // 10. Resize handler
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
      textCanvasesRef.current.forEach((t) => t.dispose())
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
      }
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  // Update 3D cells and pointer without destroying WebGL context
  useEffect(() => {
    const blocksGroup = blocksGroupRef.current
    if (!blocksGroup) return

    while (blocksGroup.children.length > 0) {
      const obj = blocksGroup.children[0]
      if (obj.geometry) obj.geometry.dispose()
      blocksGroup.remove(obj)
    }

    blockMeshesRef.current = []
    const count = cellsData.length
    const spacing = 1.4
    const startX = -((count - 1) * spacing) / 2

    cellsData.forEach((cell, i) => {
      const xPos = startX + i * spacing
      const boxGeo = new THREE.BoxGeometry(1.1, 0.8, 1.1)
      const isNull = cell.val === "'\\0'"
      const isSelected = selectedCell?.address === cell.address
      const isPointed = i === pointerOffset

      let color = 0x3b82f6 // Azul base
      if (isNull) color = 0xef4444 // Rojo centinela
      else if (isPointed) color = 0x10b981 // Verde puntero
      else if (cell.isSpecial) color = 0x8b5cf6 // Púrpura

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.2,
        roughness: 0.3,
        emissive: isPointed ? 0x065f46 : isSelected ? 0x1e3a8a : 0x000000,
        emissiveIntensity: 0.5,
      })

      const mesh = new THREE.Mesh(boxGeo, mat)
      mesh.position.set(xPos, 0, 0)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = { index: i, cellData: cell }
      if (isPointed) {
        mesh.scale.set(1.08, 1.15, 1.08)
      }
      blocksGroup.add(mesh)
      blockMeshesRef.current.push(mesh)

      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = isNull ? '#ef4444' : isPointed ? '#10b981' : '#ffffff'
      ctx.font = 'bold 36px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(cell.val, 128, 50)
      ctx.font = '22px monospace'
      ctx.fillStyle = '#a1a1aa'
      ctx.fillText(cell.name, 128, 85)
      ctx.font = '18px monospace'
      ctx.fillStyle = '#60a5fa'
      ctx.fillText(cell.address, 128, 115)

      const texture = new THREE.CanvasTexture(canvas)
      textCanvasesRef.current.push(texture)
      const spriteMat = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.position.set(xPos, 0.9, 0)
      sprite.scale.set(1.5, 0.75, 1)
      blocksGroup.add(sprite)
    })

    if (pointerGroupRef.current) {
      const targetX = startX + pointerOffset * spacing
      pointerGroupRef.current.position.x = targetX
    }
  }, [viewMode, inputText, pointerOffset, selectedCell])

  // Recorrido automático del puntero (Simular while (*str))
  useEffect(() => {
    let interval
    if (isPointerMoving) {
      interval = setInterval(() => {
        setPointerOffset((prev) => {
          if (prev >= cellsData.length - 1) {
            setIsPointerMoving(false)
            return prev
          }
          return prev + 1
        })
      }, 700)
    }
    return () => clearInterval(interval)
  }, [isPointerMoving, cellsData.length])

  const currentCell = cellsData[pointerOffset] || cellsData[0]

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      {/* Barra de control superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm">
            3D
          </span>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Explorador 3D de Memoria y Punteros</h4>
            <p className="text-[11px] text-zinc-500">Toca cualquier celda o usa los controles para desplazar el puntero</p>
          </div>
        </div>

        {/* Modos de vista */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-200/70 p-1 text-xs font-medium text-zinc-600">
          <button
            onClick={() => { setViewMode('string'); setPointerOffset(0); }}
            className={`rounded-lg px-2.5 py-1 transition-all ${
              viewMode === 'string' ? 'bg-white text-zinc-900 shadow-sm font-semibold' : 'hover:text-zinc-900'
            }`}
          >
            String (&apos;\0&apos;)
          </button>
          <button
            onClick={() => { setViewMode('array'); setPointerOffset(0); }}
            className={`rounded-lg px-2.5 py-1 transition-all ${
              viewMode === 'array' ? 'bg-white text-zinc-900 shadow-sm font-semibold' : 'hover:text-zinc-900'
            }`}
          >
            Array de Ints
          </button>
          <button
            onClick={() => { setViewMode('pointers'); setPointerOffset(0); }}
            className={`rounded-lg px-2.5 py-1 transition-all ${
              viewMode === 'pointers' ? 'bg-white text-zinc-900 shadow-sm font-semibold' : 'hover:text-zinc-900'
            }`}
          >
            Puntero Doble
          </button>
        </div>
      </div>

      {/* Controles para String personalizado */}
      {viewMode === 'string' && (
        <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-900/5 px-4 py-2 text-xs">
          <span className="font-mono text-zinc-500">char str[] = </span>
          <input
            type="text"
            value={inputText}
            maxLength={12}
            onChange={(e) => {
              setInputText(e.target.value)
              setPointerOffset(0)
            }}
            placeholder="Escribe texto..."
            className="rounded-md border border-zinc-300 bg-white px-2 py-0.5 font-mono text-xs text-zinc-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-[11px] text-zinc-400"> (Max 12 chars + &apos;\0&apos;)</span>
        </div>
      )}

      {/* Lienzo 3D Three.js */}
      <div className="relative h-64 sm:h-72 w-full bg-[#181825] cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="h-full w-full" />
        
        {/* Overlay informativo 3D */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 text-xs text-zinc-200 border border-zinc-700/50">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono">Puntero actual: <strong>str + {pointerOffset}</strong></span>
          <span className="text-zinc-400">({currentCell?.address})</span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1">
          <button
            onClick={() => setPointerOffset((p) => Math.max(0, p - 1))}
            disabled={pointerOffset <= 0}
            className="rounded-lg bg-zinc-800/80 p-2 text-white hover:bg-zinc-700 disabled:opacity-30 backdrop-blur-sm transition-all"
            title="ptr--"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => setIsPointerMoving(!isPointerMoving)}
            className={`rounded-lg p-2 text-white backdrop-blur-sm transition-all flex items-center gap-1 text-xs font-semibold px-3 ${
              isPointerMoving ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
            title="Simular bucle while (*str)"
          >
            <Play size={14} className={isPointerMoving ? 'animate-spin' : ''} />
            {isPointerMoving ? 'Pausar' : 'while (*ptr)'}
          </button>
          <button
            onClick={() => setPointerOffset((p) => Math.min(cellsData.length - 1, p + 1))}
            disabled={pointerOffset >= cellsData.length - 1}
            className="rounded-lg bg-zinc-800/80 p-2 text-white hover:bg-zinc-700 disabled:opacity-30 backdrop-blur-sm transition-all"
            title="ptr++"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => { setPointerOffset(0); setIsPointerMoving(false); }}
            className="rounded-lg bg-zinc-800/80 p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 backdrop-blur-sm transition-all ml-1"
            title="Reset ptr = str"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Panel interactivo de estado y explicación en tiempo real */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">1. Expresión en C</p>
            <p className="mt-1 font-mono text-sm font-semibold text-indigo-600">
              *ptr == {currentCell?.val}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Valor guardado en la dirección actual
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">2. Dirección de Memoria (&amp;ptr)</p>
            <p className="mt-1 font-mono text-sm font-semibold text-emerald-600">
              {currentCell?.address}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Ubicación física en la memoria RAM
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">3. Condición en el Bucle</p>
            <p className={`mt-1 font-mono text-sm font-semibold ${
              currentCell?.val === "'\\0'" || currentCell?.ascii === 0 ? 'text-red-600' : 'text-emerald-600'
            }`}>
              {currentCell?.val === "'\\0'" || currentCell?.ascii === 0 ? 'FALSE (0) 🛑 DETIENE BUCLE' : 'TRUE (!= 0) 🟢 CONTINÚA'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {currentCell?.val === "'\\0'" ? 'El \\0 vale 0 en ASCII, rompiendo while (*str)' : 'Cualquier char distinto de 0 es verdadero'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
