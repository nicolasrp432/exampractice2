import StringPointerEngine from './engines/StringPointerEngine'
import CounterEngine from './engines/CounterEngine'
import BitsEngine from './engines/BitsEngine'
import BaseConvertEngine from './engines/BaseConvertEngine'
import WordSplitEngine from './engines/WordSplitEngine'
import RecursionEngine from './engines/RecursionEngine'
import SortEngine from './engines/SortEngine'
import LinkedListEngine from './engines/LinkedListEngine'
import FloodFillEngine from './engines/FloodFillEngine'
import SwapEngine from './engines/SwapEngine'
import MallocArrayEngine from './engines/MallocArrayEngine'

const ENGINES = {
  'string-pointer': StringPointerEngine,
  counter: CounterEngine,
  bits: BitsEngine,
  'base-convert': BaseConvertEngine,
  'word-split': WordSplitEngine,
  recursion: RecursionEngine,
  sort: SortEngine,
  'linked-list': LinkedListEngine,
  'flood-fill': FloodFillEngine,
  swap: SwapEngine,
  'malloc-array': MallocArrayEngine,
}

/**
 * Router de animaciones: mira exercise.animacion.tipo y renderiza el motor
 * adecuado, pasándole su config. Cada motor es autónomo (su propio estado).
 */
export default function ExerciseAnimation({ exercise }) {
  const animacion = exercise?.animacion

  if (!animacion || !ENGINES[animacion.tipo]) {
    return (
      <div className="py-16 text-center text-zinc-400">
        <p className="text-4xl mb-3">🚧</p>
        <p className="text-sm">Visualización animada no disponible para este ejercicio</p>
      </div>
    )
  }

  const Engine = ENGINES[animacion.tipo]

  return (
    <div className="space-y-4">
      <div className="card p-3 flex items-start gap-3 bg-purple-50/40 border-purple-100">
        <span className="text-xl shrink-0">🎬</span>
        <div>
          <p className="text-sm font-semibold text-zinc-800">
            Cómo funciona <span className="font-mono">{exercise.nombre}</span> por dentro
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Dale a reproducir y observa paso a paso qué hace el algoritmo. No es GDB: es el
            concepto visualizado.
          </p>
        </div>
      </div>
      <Engine config={animacion.config || {}} nombre={exercise.nombre} />
    </div>
  )
}
