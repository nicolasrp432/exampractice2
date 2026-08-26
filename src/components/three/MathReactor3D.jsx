import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Play, Pause, RotateCcw, ArrowRight, Sparkles, Calculator, Zap } from 'lucide-react'
import clsx from 'clsx'

/**
 * Visualizador 3D de Aritmética, Descomposición en Factores Primos y Bases Numéricas
 * para fprime, pgcd, lcm, add_prime_sum, print_hex, tab_mult, fizzbuzz.
 */
export default function MathReactor3D({
  exerciseId = 'fprime',
  initialNum = 42,
  initialNumB = 18,
}) {
  const mountRef = useRef(null)
  const [numA, setNumA] = useState(initialNum)
  const [numB, setNumB] = useState(initialNumB)
  const [currentValue, setCurrentValue] = useState(initialNum)
  const [divisor, setDivisor] = useState(2)
  const [factors, setFactors] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [statusMsg, setStatusMsg] = useState('Listo para iniciar cálculo')

  const isFprime = exerciseId === 'fprime'
  const isPgcd = exerciseId === 'pgcd'
  const isLcm = exerciseId === 'lcm'
  const isPrintHex = exerciseId === 'print_hex'
  const isAddPrimeSum = exerciseId === 'add_prime_sum'

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentValue(numA)
    setDivisor(2)
    setFactors([])
    setStatusMsg('Reiniciado')
  }

  const handleStep = () => {
    if (isFprime) {
      if (currentValue <= 1) {
        setIsPlaying(false)
        setStatusMsg(`¡Descomposición completa! Factores: ${factors.join(' * ')}`)
        return
      }

      if (currentValue % divisor === 0) {
        const nextVal = currentValue / divisor
        setFactors(prev => [...prev, divisor])
        setCurrentValue(nextVal)
        setStatusMsg(`${currentValue} es divisible por ${divisor} → Nuevo valor: ${nextVal}`)
      } else {
        const nextDiv = divisor + 1
        setDivisor(nextDiv)
        setStatusMsg(`${currentValue} no es divisible por ${divisor} → Probando divisor ${nextDiv}`)
      }
    } else if (isPrintHex) {
      const hexChars = '0123456789abcdef'
      const digits = []
      let temp = numA
      if (temp === 0) digits.push('0')
      while (temp > 0) {
        digits.unshift(hexChars[temp % 16])
        temp = Math.floor(temp / 16)
      }
      setFactors(digits)
      setStatusMsg(`${numA} en Base 10 = 0x${digits.join('')} en Base 16 (Hexadecimal)`)
      setIsPlaying(false)
    } else if (isPgcd || isLcm) {
      // Euclidean step
      let a = numA
      let b = numB
      while (b !== 0) {
        const temp = b
        b = a % b
        a = temp
      }
      const gcd = a
      const lcmVal = (numA * numB) / gcd
      setFactors(isPgcd ? [gcd] : [lcmVal])
      setStatusMsg(isPgcd ? `PGCD(${numA}, ${numB}) = ${gcd}` : `LCM(${numA}, ${numB}) = ${lcmVal}`)
      setIsPlaying(false)
    } else {
      setFactors([currentValue])
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setTimeout(() => {
        handleStep()
      }, 400)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, currentValue, divisor, factors])

  // Three.js 3D Reactor Scene
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = container.clientHeight || 240

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x11111b)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 4.5, 7.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
    dirLight.position.set(5, 10, 5)
    scene.add(dirLight)

    const reactorGroup = new THREE.Group()
    scene.add(reactorGroup)

    // Central Sphere (Core Number)
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x89b4fa,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.2,
      wireframe: false,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    const scaleNorm = Math.max(0.6, Math.min(1.8, currentValue / (numA || 1)))
    coreMesh.scale.set(scaleNorm, scaleNorm, scaleNorm)
    reactorGroup.add(coreMesh)

    // Orbiting Rings / Factor Crystals
    const factorGroup = new THREE.Group()
    reactorGroup.add(factorGroup)

    factors.forEach((f, idx) => {
      const crystalGeo = new THREE.OctahedronGeometry(0.35)
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0xa6e3a1,
        emissive: 0x14532d,
        emissiveIntensity: 0.8,
        metalness: 0.5,
      })
      const mesh = new THREE.Mesh(crystalGeo, crystalMat)
      const angle = (idx / Math.max(factors.length, 1)) * Math.PI * 2
      mesh.position.set(Math.cos(angle) * 2.3, Math.sin(idx * 0.5) * 0.4, Math.sin(angle) * 2.3)
      factorGroup.add(mesh)
    })

    // Divisor Ring
    const ringGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 100)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf9e2af,
      emissive: 0x78350f,
      emissiveIntensity: 0.6,
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 2.5
    reactorGroup.add(ringMesh)

    let reqId
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      reactorGroup.rotation.y += 0.01
      factorGroup.rotation.y -= 0.02
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
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
      renderer.dispose()
    }
  }, [currentValue, factors, numA])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 text-white">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-purple-400" />
          <span className="font-mono text-xs font-bold text-zinc-100">
            Laboratorio 3D: Reactor de Aritmética y Descomposición
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
          {isFprime ? `Divisor: ${divisor}` : `Base ${isPrintHex ? 16 : 10}`}
        </span>
      </div>

      <div className="relative h-[220px] w-full bg-[#11111b]">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute top-2 left-2 flex gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-blue-300 border border-blue-500/30">
            Núcleo: {currentValue}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-green-300 border border-green-500/30">
            Cristales: {factors.join(' × ') || 'Ninguno'}
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
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100'
              )}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pausar' : 'Calcular'}</span>
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

          {/* Number inputs */}
          <div className="flex items-center gap-2 text-xs font-mono bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
            <span className="text-[11px] font-sans font-semibold text-zinc-500">Número:</span>
            <input
              type="number"
              min="1"
              value={numA}
              onChange={e => {
                const val = Math.max(1, parseInt(e.target.value) || 1)
                setNumA(val)
                setCurrentValue(val)
                setFactors([])
                setDivisor(2)
              }}
              className="w-16 px-1 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-center font-bold text-zinc-800"
            />
          </div>
        </div>

        {/* Result equation box */}
        <div className="p-2.5 bg-white rounded-xl border border-zinc-200/80 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1 font-sans">
            <span>Ecuación generada:</span>
            <span>Estado: {currentValue === 1 ? 'Completo' : 'En proceso'}</span>
          </div>
          <div className="text-sm font-bold text-zinc-800 flex items-center gap-2 flex-wrap">
            <span>{numA} =</span>
            {factors.length > 0 ? (
              <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                {factors.join(' * ')}
              </span>
            ) : (
              <span className="text-zinc-400 font-normal">Pulsa "Calcular" o "Paso"</span>
            )}
          </div>
        </div>

        <p className="text-[11px] font-sans text-zinc-500 italic bg-white/60 p-2 rounded-lg border border-zinc-200/60">
          ⚙️ <strong>Explicación:</strong> {statusMsg}
        </p>
      </div>
    </div>
  )
}
