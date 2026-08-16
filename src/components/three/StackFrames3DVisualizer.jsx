import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Layers, Play, RotateCcw, ArrowRight, Sparkles, CheckCircle2, ChevronRight, HelpCircle, Eye } from 'lucide-react'
import clsx from 'clsx'

const SCENARIOS = [
  {
    id: 'swap',
    title: 'ft_swap(&a, &b) — Paso por Referencia',
    subtitle: 'Cómo un puntero modifica variables de otra función',
    desc: 'Observa cómo el frame de ft_swap recibe direcciones de memoria (&a, &b) de main y altera sus cajas directamente sin necesidad de retornar nada.',
    steps: [
      {
        step: 1,
        title: 'main() reserva a=42 y b=13',
        explanation: 'En el Stack Frame de main() se crean dos casillas en memoria para los enteros a y b.',
        activeFrame: 'main',
        highlightVars: ['a', 'b'],
        actionText: 'int a = 42; int b = 13;',
      },
      {
        step: 2,
        title: 'Llamada: ft_swap(&a, &b)',
        explanation: 'Se crea un nuevo Stack Frame arriba para ft_swap. Recibe las direcciones &a (0x1000) y &b (0x1004).',
        activeFrame: 'swap',
        highlightVars: ['ptr_a', 'ptr_b'],
        actionText: 'ft_swap(&a, &b); // apila nuevo frame',
      },
      {
        step: 3,
        title: 'Variable temporal: tmp = *a',
        explanation: 'ft_swap guarda en su variable local tmp el valor 42 (siguiendo la flecha del puntero a).',
        activeFrame: 'swap',
        highlightVars: ['tmp', 'ptr_a'],
        actionText: 'tmp = *a; // tmp = 42',
      },
      {
        step: 4,
        title: 'Sobrescribir: *a = *b',
        explanation: 'El puntero a viaja al casillero de main y cambia 42 por 13.',
        activeFrame: 'swap',
        highlightVars: ['ptr_a', 'ptr_b', 'a'],
        actionText: '*a = *b; // la casilla de a ahora vale 13',
      },
      {
        step: 5,
        title: 'Asignar: *b = tmp',
        explanation: 'El puntero b viaja al casillero de main y cambia 13 por 42 (el valor de tmp).',
        activeFrame: 'swap',
        highlightVars: ['ptr_b', 'tmp', 'b'],
        actionText: '*b = tmp; // la casilla de b ahora vale 42',
      },
      {
        step: 6,
        title: 'Retorno y Destrucción del Frame (POP)',
        explanation: 'ft_swap termina y su memoria se destruye. En main, ¡las variables a y b han intercambiado sus valores!',
        activeFrame: 'main',
        highlightVars: ['a', 'b'],
        actionText: '// swap frame destruido. a=13, b=42',
      },
    ]
  },
  {
    id: 'strlen',
    title: 'ft_strlen(str) — Recorrido de Puntero',
    subtitle: 'El puntero avanza casilla a casilla en la memoria',
    desc: 'Visualiza la memoria RAM donde vive el texto "42" y cómo el puntero móvil recorre cada char hasta encontrar el byte centinela \\0.',
    steps: [
      {
        step: 1,
        title: 'main() apunta a la cadena "42"',
        explanation: 'El array en memoria contiene \'4\' (0x2000), \'2\' (0x2001) y \'\\0\' (0x2002).',
        activeFrame: 'main',
        highlightVars: ['str_0'],
        actionText: 'char *str = "42";',
      },
      {
        step: 2,
        title: 'ft_strlen(str) inicia contador i = 0',
        explanation: 'ft_strlen crea su propio frame en el stack con la variable i = 0 y examina str[0] (\'4\').',
        activeFrame: 'strlen',
        highlightVars: ['i_0', 'str_0'],
        actionText: 'int i = 0; while (str[i])',
      },
      {
        step: 3,
        title: 'Carácter \'4\' detectado -> i = 1',
        explanation: '\'4\' no es \'\\0\', por lo que incrementa el contador y pasa a la casilla 0x2001.',
        activeFrame: 'strlen',
        highlightVars: ['i_1', 'str_1'],
        actionText: 'i++; // i = 1',
      },
      {
        step: 4,
        title: 'Carácter \'2\' detectado -> i = 2',
        explanation: '\'2\' no es \'\\0\', incrementa el contador y pasa a la casilla 0x2002.',
        activeFrame: 'strlen',
        highlightVars: ['i_2', 'str_null'],
        actionText: 'i++; // i = 2',
      },
      {
        step: 5,
        title: 'Centinela \'\\0\' encontrado -> FIN',
        explanation: 'str[2] es \'\\0\' (valor 0). El bucle termina y retorna i = 2 a main().',
        activeFrame: 'main',
        highlightVars: ['ret_2'],
        actionText: 'return (i); // retorna 2',
      },
    ]
  },
  {
    id: 'recursion',
    title: 'Recursión — Pila de Frames en Cascada',
    subtitle: 'Cómo cada llamada crea un nuevo piso en la torre',
    desc: 'Entiende visualmente por qué una función que se llama a sí misma apila copias independientes hasta tocar el caso base.',
    steps: [
      {
        step: 1,
        title: 'Llamada factorial(3)',
        explanation: 'main() invoca factorial(n=3). Se crea el Frame #1.',
        activeFrame: 'rec_1',
        highlightVars: ['n3'],
        actionText: 'factorial(3) -> espera factorial(2)',
      },
      {
        step: 2,
        title: 'Llamada factorial(2)',
        explanation: 'El Frame #1 queda en pausa y se apila el Frame #2 encima (n=2).',
        activeFrame: 'rec_2',
        highlightVars: ['n2'],
        actionText: 'factorial(2) -> espera factorial(1)',
      },
      {
        step: 3,
        title: 'Llamada factorial(1) [Caso Base]',
        explanation: 'Se apila el Frame #3 (n=1). Cumple if (n <= 1) y retorna 1 inmediatamente.',
        activeFrame: 'rec_3',
        highlightVars: ['n1'],
        actionText: 'if (n <= 1) return (1);',
      },
      {
        step: 4,
        title: 'Desapilado y Multiplicación',
        explanation: 'Frame #3 retorna 1 a Frame #2 (2 * 1 = 2), luego a Frame #1 (3 * 2 = 6).',
        activeFrame: 'rec_1',
        highlightVars: ['n3', 'res6'],
        actionText: 'return (3 * 2) = 6;',
      },
    ]
  }
]

export default function StackFrames3DVisualizer({ compact = false }) {
  const mountRef = useRef(null)
  const [activeScenarioId, setActiveScenarioId] = useState('swap')
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0]
  const currentStep = scenario.steps[currentStepIdx] || scenario.steps[0]

  const nextStep = () => {
    setCurrentStepIdx((p) => Math.min(scenario.steps.length - 1, p + 1))
  }

  const prevStep = () => {
    setCurrentStepIdx((p) => Math.max(0, p - 1))
  }

  const resetSteps = () => {
    setCurrentStepIdx(0)
    setIsPlaying(false)
  }

  // Auto-play loop
  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= scenario.steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 2000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, scenario.steps.length])

  // Three.js Render Logic
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 320

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 7, 13)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4)
    dirLight.position.set(10, 15, 10)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xa855f7, 2, 20)
    pointLight.position.set(-8, 6, 4)
    scene.add(pointLight)

    const grid = new THREE.GridHelper(24, 24, 0x334155, 0x1e293b)
    grid.position.y = -2.5
    scene.add(grid)

    const texturesToDispose = []

    // Helper text sprite
    const createTextSprite = (text, color = '#ffffff', fontSize = 28, bgColor = 'transparent') => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor
        ctx.roundRect(10, 10, 492, 108, 16)
        ctx.fill()
      }
      ctx.fillStyle = color
      ctx.font = `bold ${fontSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, 256, 64)

      const texture = new THREE.CanvasTexture(canvas)
      texturesToDispose.push(texture)
      const spriteMat = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.set(3, 0.75, 1)
      return sprite
    }

    // Render Scenarios
    const isSwap = activeScenarioId === 'swap'
    const isStrlen = activeScenarioId === 'strlen'
    const isRec = activeScenarioId === 'recursion'

    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    if (isSwap) {
      // 1. Stack Frame main()
      const mainFrameGeo = new THREE.BoxGeometry(6.5, 0.6, 4.0)
      const mainFrameMat = new THREE.MeshStandardMaterial({
        color: currentStep.activeFrame === 'main' ? 0x1e293b : 0x0f172a,
        roughness: 0.4,
        metalness: 0.2,
      })
      const mainFrameMesh = new THREE.Mesh(mainFrameGeo, mainFrameMat)
      mainFrameMesh.position.set(0, -1.5, 0)
      mainGroup.add(mainFrameMesh)

      const mainLabel = createTextSprite('STACK FRAME: main()', '#94a3b8', 24)
      mainLabel.position.set(0, -1.5, 2.3)
      mainGroup.add(mainLabel)

      // Variables en main: a y b
      const aVal = currentStepIdx >= 3 ? (currentStepIdx >= 4 ? '13' : '13') : '42'
      const bVal = currentStepIdx >= 4 ? '42' : '13'

      // Casilla a
      const boxAGeo = new THREE.BoxGeometry(1.4, 1.2, 1.4)
      const isAHigh = currentStep.highlightVars.includes('a')
      const boxAMat = new THREE.MeshStandardMaterial({
        color: isAHigh ? 0x10b981 : 0x3b82f6,
        emissive: isAHigh ? 0x059669 : 0x1d4ed8,
        emissiveIntensity: isAHigh ? 0.6 : 0.2,
      })
      const boxAMesh = new THREE.Mesh(boxAGeo, boxAMat)
      boxAMesh.position.set(-1.8, -0.6, 0)
      mainGroup.add(boxAMesh)

      const textA = createTextSprite(`int a = ${aVal}\n[0x1000]`, '#ffffff', 26)
      textA.position.set(-1.8, 0.6, 0)
      mainGroup.add(textA)

      // Casilla b
      const boxBGeo = new THREE.BoxGeometry(1.4, 1.2, 1.4)
      const isBHigh = currentStep.highlightVars.includes('b')
      const boxBMat = new THREE.MeshStandardMaterial({
        color: isBHigh ? 0x10b981 : 0x6366f1,
        emissive: isBHigh ? 0x059669 : 0x3730a3,
        emissiveIntensity: isBHigh ? 0.6 : 0.2,
      })
      const boxBMesh = new THREE.Mesh(boxBGeo, boxBMat)
      boxBMesh.position.set(1.8, -0.6, 0)
      mainGroup.add(boxBMesh)

      const textB = createTextSprite(`int b = ${bVal}\n[0x1004]`, '#ffffff', 26)
      textB.position.set(1.8, 0.6, 0)
      mainGroup.add(textB)

      // 2. Stack Frame ft_swap() (arriba si step >= 1 y step <= 4)
      if (currentStepIdx >= 1 && currentStepIdx <= 4) {
        const swapFrameGeo = new THREE.BoxGeometry(6.5, 0.6, 4.0)
        const swapFrameMat = new THREE.MeshStandardMaterial({
          color: 0x312e81,
          emissive: 0x1e1b4b,
          emissiveIntensity: 0.4,
        })
        const swapFrameMesh = new THREE.Mesh(swapFrameGeo, swapFrameMat)
        swapFrameMesh.position.set(0, 2.2, 0)
        mainGroup.add(swapFrameMesh)

        const swapLabel = createTextSprite('STACK FRAME: ft_swap(&a, &b)', '#c7d2fe', 24)
        swapLabel.position.set(0, 2.2, 2.3)
        mainGroup.add(swapLabel)

        // Puntero *a
        const ptrAGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 16)
        const ptrAMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 })
        const ptrAMesh = new THREE.Mesh(ptrAGeo, ptrAMat)
        ptrAMesh.position.set(-1.8, 3.1, 0)
        mainGroup.add(ptrAMesh)

        const textPtrA = createTextSprite('int *a\n-> 0x1000', '#38bdf8', 26)
        textPtrA.position.set(-1.8, 4.0, 0)
        mainGroup.add(textPtrA)

        // Puntero *b
        const ptrBGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 16)
        const ptrBMat = new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x4f46e5, emissiveIntensity: 0.5 })
        const ptrBMesh = new THREE.Mesh(ptrBGeo, ptrBMat)
        ptrBMesh.position.set(1.8, 3.1, 0)
        mainGroup.add(ptrBMesh)

        const textPtrB = createTextSprite('int *b\n-> 0x1004', '#818cf8', 26)
        textPtrB.position.set(1.8, 4.0, 0)
        mainGroup.add(textPtrB)

        // Variable local tmp
        if (currentStepIdx >= 2) {
          const tmpGeo = new THREE.BoxGeometry(1.0, 0.9, 1.0)
          const tmpMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.7 })
          const tmpMesh = new THREE.Mesh(tmpGeo, tmpMat)
          tmpMesh.position.set(0, 3.1, 0)
          mainGroup.add(tmpMesh)

          const textTmp = createTextSprite('tmp = 42', '#fde68a', 28)
          textTmp.position.set(0, 4.0, 0)
          mainGroup.add(textTmp)
        }

        // Flechas 3D que viajan hacia las casillas de abajo
        const arrowLen = 2.4
        const arrowGeo = new THREE.CylinderGeometry(0.06, 0.06, arrowLen, 16)
        const arrowMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 })

        // Flecha a
        const arrowA = new THREE.Mesh(arrowGeo, arrowMat)
        arrowA.position.set(-1.8, 1.1, 0)
        mainGroup.add(arrowA)

        // Flecha b
        const arrowB = new THREE.Mesh(arrowGeo, arrowMat)
        arrowB.position.set(1.8, 1.1, 0)
        mainGroup.add(arrowB)
      }
    } else if (isStrlen) {
      // Strlen Memory & Index Pointers
      const charBoxes = [
        { char: "'4'", addr: '0x2000', idx: 0 },
        { char: "'2'", addr: '0x2001', idx: 1 },
        { char: "'\\0'", addr: '0x2002', idx: 2 },
      ]

      const currIdx = Math.min(2, Math.max(0, currentStepIdx - 1))

      charBoxes.forEach((cb, i) => {
        const x = (i - 1) * 2.6
        const isSelected = i === currIdx
        const isNull = i === 2

        const boxGeo = new THREE.BoxGeometry(1.6, 1.2, 1.4)
        const boxMat = new THREE.MeshStandardMaterial({
          color: isNull ? 0xef4444 : isSelected ? 0x10b981 : 0x475569,
          emissive: isNull ? 0x7f1d1d : isSelected ? 0x047857 : 0x1e293b,
          emissiveIntensity: isSelected ? 0.8 : 0.3,
        })
        const boxMesh = new THREE.Mesh(boxGeo, boxMat)
        boxMesh.position.set(x, -0.5, 0)
        mainGroup.add(boxMesh)

        const charLabel = createTextSprite(`${cb.char}\n[${cb.addr}]`, isNull ? '#fca5a5' : '#ffffff', 28)
        charLabel.position.set(x, 0.7, 0)
        mainGroup.add(charLabel)
      })

      // Puntero Cursor
      const targetX = (currIdx - 1) * 2.6
      const cursorCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.7, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 })
      )
      cursorCone.rotation.x = Math.PI
      cursorCone.position.set(targetX, 2.2, 0)
      mainGroup.add(cursorCone)

      const cursorLabel = createTextSprite(`str[${currIdx}] (i=${currIdx})`, '#38bdf8', 26)
      cursorLabel.position.set(targetX, 3.0, 0)
      mainGroup.add(cursorLabel)
    } else if (isRec) {
      // Recursion 3-Level Tower
      const levels = [
        { name: 'main()', y: -1.5, color: 0x334155, val: 'factorial(3)' },
        { name: 'factorial(3)', y: 0.0, color: 0x4f46e5, val: 'n = 3' },
        { name: 'factorial(2)', y: 1.5, color: 0x7c3aed, val: 'n = 2' },
        { name: 'factorial(1)', y: 3.0, color: 0x10b981, val: 'n = 1 [BASE]' },
      ]

      const maxLevel = Math.min(3, currentStepIdx)

      for (let i = 0; i <= maxLevel; i++) {
        const lvl = levels[i]
        const lvlGeo = new THREE.BoxGeometry(5.0 - i * 0.4, 0.8, 3.0)
        const lvlMat = new THREE.MeshStandardMaterial({
          color: lvl.color,
          roughness: 0.3,
          metalness: 0.1,
          emissive: lvl.color,
          emissiveIntensity: i === maxLevel ? 0.5 : 0.2,
        })
        const lvlMesh = new THREE.Mesh(lvlGeo, lvlMat)
        lvlMesh.position.set(0, lvl.y, 0)
        mainGroup.add(lvlMesh)

        const lbl = createTextSprite(`${lvl.name}: ${lvl.val}`, '#ffffff', 26)
        lbl.position.set(0, lvl.y + 0.8, 0)
        mainGroup.add(lbl)
      }
    }

    let animId
    const clock = new THREE.Clock()
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      mainGroup.rotation.y = Math.sin(t * 0.4) * 0.15
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      texturesToDispose.forEach((t) => t.dispose())
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [activeScenarioId, currentStepIdx])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      {/* Header & Scenario Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Layers size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900">Visualizador 3D: Stack Frames &amp; Punteros</h4>
            <p className="text-[11px] text-zinc-500">Comprende cómo la CPU apila funciones y direcciones de memoria</p>
          </div>
        </div>

        {/* Scenarios pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id)
                setCurrentStepIdx(0)
                setIsPlaying(false)
              }}
              className={clsx(
                'px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                activeScenarioId === sc.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              )}
            >
              {sc.id === 'swap' && 'ft_swap (&punteros)'}
              {sc.id === 'strlen' && 'ft_strlen (recorrido)'}
              {sc.id === 'recursion' && 'Recursión (apilado)'}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Stage */}
      <div className="relative h-64 sm:h-72 w-full bg-[#0f172a]">
        <div ref={mountRef} className="h-full w-full" />

        {/* Floating step info HUD */}
        <div className="absolute top-3 left-3 max-w-[85%] sm:max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-white shadow-lg pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold">
              {currentStep.step}
            </span>
            <h5 className="text-xs font-bold text-indigo-300 truncate">{currentStep.title}</h5>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">{currentStep.explanation}</p>
          <div className="mt-1.5 px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-emerald-400 border border-slate-700">
            {currentStep.actionText}
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-700">
          {scenario.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStepIdx(i)}
              className={clsx(
                'h-2 rounded-full transition-all',
                i === currentStepIdx ? 'w-5 bg-indigo-400' : 'w-2 bg-slate-600 hover:bg-slate-500'
              )}
              title={`Paso ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Step Controls Toolbar */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-white font-semibold flex items-center gap-1.5 shadow-xs transition-all',
              isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            )}
          >
            <Play size={13} className={isPlaying ? 'animate-spin' : ''} />
            <span>{isPlaying ? 'Pausar' : 'Auto-Play'}</span>
          </button>
          <button
            onClick={resetSteps}
            className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-800"
            title="Reiniciar pasos"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={prevStep}
            disabled={currentStepIdx === 0}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 font-medium hover:bg-zinc-100 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="font-mono text-zinc-500 text-xs px-1">
            {currentStepIdx + 1} / {scenario.steps.length}
          </span>
          <button
            onClick={nextStep}
            disabled={currentStepIdx === scenario.steps.length - 1}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-semibold hover:bg-zinc-800 disabled:opacity-40 flex items-center gap-1"
          >
            <span>Siguiente</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
