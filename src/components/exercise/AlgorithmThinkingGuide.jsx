import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Lightbulb, ArrowRight, CheckCircle2, ShieldAlert,
  Code2, Compass, Eye, Sparkles, HelpCircle, ChevronDown,
  ChevronUp, Check, X, RefreshCw, Terminal, Layers, Box,
  Cpu, HardDrive, Zap, Network, GitCommit, Split
} from 'lucide-react'
import clsx from 'clsx'
import confetti from 'canvas-confetti'
import { getExerciseThinkingBlueprint } from '@/data/exerciseThinkingRegistry'

export default function AlgorithmThinkingGuide({ exercise }) {
  const [activeStep, setActiveStep] = useState(1)
  const [quizAnswered, setQuizAnswered] = useState(null)
  const [showUnderTheHood, setShowUnderTheHood] = useState(true)

  const blueprint = getExerciseThinkingBlueprint(exercise)

  if (!blueprint) return null

  const handleQuiz = (idx) => {
    const isCorrect = idx === blueprint.quiz?.correctIdx
    setQuizAnswered(idx)
    if (isCorrect) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } })
    }
  }

  const isProgram = blueprint.nature === 'PROGRAMA_CLI'

  return (
    <div className="space-y-6">
      {/* ─── 1. Header: Arquetipo, Naturaleza del Ejercicio y Enfoque ─── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <span className="text-2xl">{blueprint.archetype?.icon || '🧠'}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-zinc-900">
                  {blueprint.archetype?.name || 'Razonamiento Algorítmico'}
                </h3>
                <span
                  className={clsx(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                    isProgram
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  )}
                >
                  {isProgram ? 'Programa CLI (con main)' : 'Función C (sin main)'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Patrón de resolución estructurado para <strong>{exercise?.nombre || 'este ejercicio'}</strong>
              </p>
            </div>
          </div>

          {/* Medidores de Complejidad y Centinela */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="px-2.5 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono flex items-center gap-1.5">
              <Zap size={13} className="text-amber-500" />
              <span>{blueprint.archetype?.timeComplexity || 'O(N)'}</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono flex items-center gap-1.5">
              <HardDrive size={13} className="text-blue-500" />
              <span>{blueprint.archetype?.spaceComplexity || 'O(1)'}</span>
            </div>
          </div>
        </div>

        {/* Explicación de la Naturaleza (Programa vs Función) */}
        <div
          className={clsx(
            'p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5',
            isProgram ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          )}
        >
          <span className="text-base shrink-0">{isProgram ? '🖥️' : '⚙️'}</span>
          <div>
            <strong className="font-semibold block mb-0.5">
              {isProgram ? '¿Cómo se aborda? — Es un Programa Autónomo' : '¿Cómo se aborda? — Es una Función Pura'}
            </strong>
            <p>{blueprint.natureExplanation}</p>
          </div>
        </div>

        {/* Analogía y Modelo Mental */}
        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-1.5">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Modelo Mental y Analogía Cotidiana
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
            {blueprint.analogy}
          </p>
        </div>
      </div>

      {/* ─── 2. Contrato de Entrada y Salida ─── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Box size={18} className="text-zinc-700" />
          <h4 className="font-bold text-sm text-zinc-900">1. Contrato de Entrada, Salida y Regla de Oro</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">¿Qué recibe?</span>
            <p className="font-medium text-zinc-800">{blueprint.inputOutput.input}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">¿Qué debe emitir?</span>
            <p className="font-medium text-zinc-800">{blueprint.inputOutput.output}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Regla de Oro</span>
            <p className="font-medium text-amber-900">{blueprint.inputOutput.goldenRule}</p>
          </div>
        </div>
      </div>

      {/* ─── 3. Traza Mental Paso a Paso (La Escalera de Pensamiento) ─── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-indigo-600" />
            <h4 className="font-bold text-sm text-zinc-900">2. Desglose Paso a Paso: Movimientos Mentales</h4>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Paso {activeStep} de {blueprint.mentalSteps.length}
          </span>
        </div>

        {/* Selector de pasos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {blueprint.mentalSteps.map((s) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
                activeStep === s.num
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
              )}
            >
              <span
                className={clsx(
                  'h-4 w-4 rounded-full flex items-center justify-center text-[10px]',
                  activeStep === s.num ? 'bg-indigo-400 text-zinc-900 font-black' : 'bg-zinc-300 text-zinc-700'
                )}
              >
                {s.num}
              </span>
              <span>{s.title.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tarjeta del paso activo */}
        {(() => {
          const stepData = blueprint.mentalSteps.find((s) => s.num === activeStep) || blueprint.mentalSteps[0]
          return (
            <div className="p-4.5 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-bold">
                  Movimiento {stepData.num}
                </span>
                <h5 className="font-bold text-sm text-zinc-900">{stepData.title}</h5>
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {stepData.desc}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Traducción a C:</span>
                <pre className="p-3 rounded-xl bg-zinc-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
                  {stepData.cCode}
                </pre>
              </div>
            </div>
          )
        })()}
      </div>

      {/* ─── 4. Bajo el Capó: Memoria, Punteros y Hardware (Integrado) ─── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-purple-600" />
            <h4 className="font-bold text-sm text-zinc-900">3. Bajo el Capó: Hardware, Memoria y Punteros</h4>
          </div>
          <button
            onClick={() => setShowUnderTheHood(!showUnderTheHood)}
            className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1 font-medium"
          >
            {showUnderTheHood ? 'Ocultar' : 'Ver'} detalles técnicos
            {showUnderTheHood ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showUnderTheHood && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold uppercase text-[10px] tracking-wider">
                <Layers size={13} />
                <span>Pila (Stack) vs Montón (Heap)</span>
              </div>
              <p className="text-zinc-700 leading-relaxed font-sans">{blueprint.underTheHood?.stackVsHeap}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase text-[10px] tracking-wider">
                <Zap size={13} />
                <span>Registros de CPU & Caché L1</span>
              </div>
              <p className="text-zinc-700 leading-relaxed font-sans">{blueprint.underTheHood?.cpuRegisters}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold uppercase text-[10px] tracking-wider">
                <GitCommit size={13} />
                <span>Aritmética y Desreferenciación de Punteros</span>
              </div>
              <p className="text-zinc-700 leading-relaxed font-sans">{blueprint.underTheHood?.pointers}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold uppercase text-[10px] tracking-wider">
                <ShieldAlert size={13} />
                <span>Centinela en Memoria y Byte Nulo</span>
              </div>
              <p className="text-zinc-700 leading-relaxed font-mono">{blueprint.underTheHood?.sentinel}</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── 5. Diccionario Mental: De Español a Sintaxis C ─── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-purple-600" />
          <h4 className="font-bold text-sm text-zinc-900">4. Diccionario Mental: Pensamiento → Código C</h4>
        </div>

        <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden text-xs">
          {blueprint.dictionary.map((item, idx) => (
            <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white hover:bg-zinc-50/80 transition-colors">
              <div className="space-y-0.5">
                <span className="font-semibold text-zinc-900 block">{item.human}</span>
                <span className="text-[11px] text-zinc-400">{item.note}</span>
              </div>
              <code className="px-2.5 py-1 rounded bg-zinc-900 text-emerald-400 font-mono font-bold shrink-0 self-start sm:self-auto">
                {item.c}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 6. Trampas Frecuentes y Puntos de Segfault ─── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-500" />
          <h4 className="font-bold text-sm text-zinc-900">5. Trampas Críticas y Casos Extremos en Examen</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {blueprint.fatalTraps.map((trap, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-red-100 bg-red-50/40 space-y-2 text-xs">
              <h5 className="font-bold text-red-900 flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                  !
                </span>
                <span className="truncate">{trap.name.split('(')[0]}</span>
              </h5>
              <p className="text-[11px] text-zinc-600">
                <strong className="text-zinc-800">Causa:</strong> {trap.cause}
              </p>
              <div className="p-2 rounded-lg bg-white border border-red-200 text-emerald-800 text-[11px] font-medium">
                <strong>Solución:</strong> {trap.cure}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 7. Quiz de Verificación Lógica ─── */}
      {blueprint.quiz && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-amber-600" />
            <h4 className="font-bold text-sm text-zinc-900">6. Quiz Rápido: Valida tu Comprensión del Algoritmo</h4>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-zinc-800">
            {blueprint.quiz.question}
          </p>

          <div className="space-y-2">
            {blueprint.quiz.options.map((opt, idx) => {
              const isSelected = quizAnswered === idx
              const isCorrect = idx === blueprint.quiz.correctIdx
              let btnStyle = 'bg-white border-zinc-200 text-zinc-700 hover:bg-amber-50/50 hover:border-amber-300'

              if (quizAnswered !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-400'
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-800'
                } else {
                  btnStyle = 'bg-zinc-50 border-zinc-200 text-zinc-400 opacity-60'
                }
              }

              return (
                <button
                  key={idx}
                  disabled={quizAnswered !== null}
                  onClick={() => handleQuiz(idx)}
                  className={clsx(
                    'w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2',
                    btnStyle
                  )}
                >
                  <span>{opt}</span>
                  {quizAnswered !== null && isCorrect && (
                    <Check size={16} className="text-emerald-600 shrink-0" />
                  )}
                  {quizAnswered !== null && isSelected && !isCorrect && (
                    <X size={16} className="text-red-500 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {quizAnswered !== null && (
            <div
              className={clsx(
                'p-3 rounded-xl text-xs space-y-1 animate-fadeIn',
                quizAnswered === blueprint.quiz.correctIdx
                  ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100/80 text-amber-900 border border-amber-300'
              )}
            >
              <div className="font-bold flex items-center gap-1.5">
                {quizAnswered === blueprint.quiz.correctIdx ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-700" />
                    <span>¡Correcto! Has razonado el patrón adecuadamente.</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={14} className="text-amber-700" />
                    <span>Explicación del concepto:</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">{blueprint.quiz.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
