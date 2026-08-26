import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Plus, Trash2, ArrowRight, Play, RotateCcw, Sparkles } from 'lucide-react'

/**
 * Visualizador 3D interactivo de Listas Enlazadas (t_list).
 * Muestra cómo cada nodo guarda un valor (data) y un puntero (next)
 * que conecta en el espacio 3D con el siguiente nodo o con NULL.
 */
export default function LinkedList3D({ initialValues = [42, 13, 7, 99] }) {
  const mountRef = useRef(null)
  const [nodes, setNodes] = useState(initialValues)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isTraversing, setIsTraversing] = useState(false)
  const [newValue, setNewValue] = useState('')

  const addFront = () => {
    const v = parseInt(newValue) || Math.floor(Math.random() * 90 + 10)
    setNodes([v, ...nodes])
    setNewValue('')
    setCurrentIdx(0)
  }

  const addBack = () => {
    const v = parseInt(newValue) || Math.floor(Math.random() * 90 + 10)
    setNodes([...nodes, v])
    setNewValue('')
  }

  const removeSelected = () => {
    if (nodes.length <= 1) return
    setNodes(nodes.filter((_, idx) => idx !== currentIdx))
    setCurrentIdx(Math.max(0, currentIdx - 1))
  }

  const resetList = () => {
    setNodes([42, 13, 7, 99])
    setCurrentIdx(0)
    setIsTraversing(false)
  }

  // Traversal loop
  useEffect(() => {
    let interval
    if (isTraversing) {
      interval = setInterval(() => {
        setCurrentIdx((prev) => {
          if (prev >= nodes.length - 1) {
            setIsTraversing(false)
            return prev
          }
          return prev + 1
        })
      }, 800)
    }
    return () => clearInterval(interval)
  }, [isTraversing, nodes.length])

  const rendererRef = useRef(null)
  const listGroupRef = useRef(null)
  const pointerGroupRef = useRef(null)
  const texturesRef = useRef([])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 280

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x181825)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)

    const grid = new THREE.GridHelper(20, 20, 0x313244, 0x242436)
    grid.position.y = -0.5
    scene.add(grid)

    const listGroup = new THREE.Group()
    scene.add(listGroup)
    listGroupRef.current = listGroup

    // Puntero actual (Current cursor)
    const pointerGroup = new THREE.Group()
    const coneP = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.45, 16),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.9 })
    )
    coneP.rotation.x = Math.PI
    coneP.position.y = 1.8
    pointerGroup.add(coneP)

    const cCanvas = document.createElement('canvas')
    cCanvas.width = 256
    cCanvas.height = 80
    const cCtx = cCanvas.getContext('2d')
    cCtx.fillStyle = '#10b981'
    cCtx.font = 'bold 36px monospace'
    cCtx.textAlign = 'center'
    cCtx.fillText('*current', 128, 50)
    const cTex = new THREE.CanvasTexture(cCanvas)
    texturesRef.current.push(cTex)
    const cSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: cTex }))
    cSprite.position.set(0, 2.4, 0)
    cSprite.scale.set(1.4, 0.45, 1)
    pointerGroup.add(cSprite)

    scene.add(pointerGroup)
    pointerGroupRef.current = pointerGroup

    let animationFrameId
    const startTime = performance.now()
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) * 0.001
      if (pointerGroupRef.current) {
        pointerGroupRef.current.position.y = Math.sin(t * 5) * 0.08
      }
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
      texturesRef.current.forEach((t) => t.dispose())
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
      }
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  // Update nodes without recreating WebGL canvas
  useEffect(() => {
    const listGroup = listGroupRef.current
    if (!listGroup) return

    while (listGroup.children.length > 0) {
      const obj = listGroup.children[0]
      if (obj.geometry) obj.geometry.dispose()
      listGroup.remove(obj)
    }

    const spacing = 2.4
    const totalCount = nodes.length + 1 // + 1 para el bloque NULL
    const startX = -((totalCount - 1) * spacing) / 2

    nodes.forEach((val, i) => {
      const x = startX + i * spacing
      const isCurrent = i === currentIdx

      const group = new THREE.Group()
      group.position.set(x, 0, 0)

      const dataGeo = new THREE.BoxGeometry(0.9, 0.8, 1.0)
      const dataMat = new THREE.MeshStandardMaterial({
        color: isCurrent ? 0x10b981 : 0x6366f1,
        emissive: isCurrent ? 0x059669 : 0x312e81,
        emissiveIntensity: isCurrent ? 0.6 : 0.2,
      })
      const dataMesh = new THREE.Mesh(dataGeo, dataMat)
      dataMesh.position.x = -0.45
      group.add(dataMesh)

      const nextGeo = new THREE.BoxGeometry(0.6, 0.8, 1.0)
      const nextMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 })
      const nextMesh = new THREE.Mesh(nextGeo, nextMat)
      nextMesh.position.x = 0.35
      group.add(nextMesh)

      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 36px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`data: ${val}`, 128, 50)
      ctx.fillStyle = '#93c5fd'
      ctx.font = '22px monospace'
      ctx.fillText('next ➜', 128, 90)

      const texture = new THREE.CanvasTexture(canvas)
      texturesRef.current.push(texture)
      const spriteMat = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.position.set(0, 1.0, 0)
      sprite.scale.set(1.5, 0.75, 1)
      group.add(sprite)

      const arrowLen = spacing - 1.5
      const arrowCylGeo = new THREE.CylinderGeometry(0.04, 0.04, arrowLen, 16)
      const arrowMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 })
      const arrowCyl = new THREE.Mesh(arrowCylGeo, arrowMat)
      arrowCyl.rotation.z = -Math.PI / 2
      arrowCyl.position.set(0.65 + arrowLen / 2, 0, 0)
      group.add(arrowCyl)

      const coneGeo = new THREE.ConeGeometry(0.12, 0.3, 16)
      const cone = new THREE.Mesh(coneGeo, arrowMat)
      cone.rotation.z = -Math.PI / 2
      cone.position.set(0.65 + arrowLen, 0, 0)
      group.add(cone)

      group.userData = { nodeIndex: i }
      listGroup.add(group)
    })

    const nullX = startX + nodes.length * spacing
    const nullGeo = new THREE.BoxGeometry(1.0, 0.8, 1.0)
    const nullMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.4 })
    const nullMesh = new THREE.Mesh(nullGeo, nullMat)
    nullMesh.position.set(nullX, 0, 0)
    listGroup.add(nullMesh)

    const nullCanvas = document.createElement('canvas')
    nullCanvas.width = 256
    nullCanvas.height = 128
    const nullCtx = nullCanvas.getContext('2d')
    nullCtx.fillStyle = '#ef4444'
    nullCtx.font = 'bold 42px monospace'
    nullCtx.textAlign = 'center'
    nullCtx.fillText('NULL', 128, 60)
    nullCtx.fillStyle = '#fca5a5'
    nullCtx.font = '20px monospace'
    nullCtx.fillText('(Fin de lista)', 128, 95)
    const nullTex = new THREE.CanvasTexture(nullCanvas)
    texturesRef.current.push(nullTex)
    const nullSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: nullTex }))
    nullSprite.position.set(nullX, 1.0, 0)
    nullSprite.scale.set(1.4, 0.7, 1)
    listGroup.add(nullSprite)

    if (pointerGroupRef.current) {
      const targetX = startX + currentIdx * spacing
      pointerGroupRef.current.position.x = targetX
    }
  }, [nodes, currentIdx])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
            3D
          </span>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Listas Enlazadas: El Tren de Nodos en C</h4>
            <p className="text-[11px] text-zinc-500">Estructura struct s_list (content + *next)</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Val..."
            className="w-16 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-mono"
          />
          <button
            onClick={addFront}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100"
            title="Añadir al inicio (push_front)"
          >
            <Plus size={12} /> Al inicio
          </button>
          <button
            onClick={addBack}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100"
            title="Añadir al final (push_back)"
          >
            <Plus size={12} /> Al final
          </button>
          <button
            onClick={removeSelected}
            disabled={nodes.length <= 1}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 disabled:opacity-30"
            title="Eliminar nodo actual"
          >
            <Trash2 size={12} /> Borrar
          </button>
          <button
            onClick={resetList}
            className="p-1 rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-700"
            title="Reset"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      <div className="relative h-60 sm:h-68 w-full bg-[#181825]">
        <div ref={mountRef} className="h-full w-full" />
        
        {/* Controles de navegación */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <button
            onClick={() => setIsTraversing(!isTraversing)}
            className={`rounded-lg px-3 py-1.5 text-white backdrop-blur-sm transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isTraversing ? 'bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            <Play size={13} className={isTraversing ? 'animate-spin' : ''} />
            {isTraversing ? 'Pausar' : 'while (curr)'}
          </button>
          <button
            onClick={() => setCurrentIdx((p) => Math.min(nodes.length - 1, p + 1))}
            disabled={currentIdx >= nodes.length - 1}
            className="rounded-lg bg-zinc-800/80 px-2.5 py-1.5 text-white hover:bg-zinc-700 disabled:opacity-30 text-xs font-mono"
            title="curr = curr->next"
          >
            curr-&gt;next ➜
          </button>
        </div>
      </div>

      <div className="p-3 bg-zinc-50 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Tamaño (ft_list_size)</span>
          <span className="font-mono font-bold text-indigo-600 text-sm">{nodes.length} nodos</span>
        </div>
        <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Nodo Actual (*curr)</span>
          <span className="font-mono font-bold text-emerald-600 text-sm">
            data = {nodes[currentIdx]}
          </span>
        </div>
        <div className="bg-white p-2.5 rounded-lg border border-zinc-200">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Siguiente Puntero (curr-&gt;next)</span>
          <span className="font-mono font-bold text-sky-600 text-sm">
            {currentIdx < nodes.length - 1 ? `&nodo[${currentIdx + 1}]` : 'NULL (0x0)'}
          </span>
        </div>
      </div>
    </div>
  )
}
