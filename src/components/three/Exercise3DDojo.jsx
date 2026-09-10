import { useState } from 'react'
import { Box, Layers, Cpu, Sparkles, Eye, Info, MousePointer } from 'lucide-react'
import clsx from 'clsx'
import { getExerciseThinkingBlueprint } from '@/data/exerciseThinkingRegistry'

// 3D Visualizer Engines
import VoxelGrid3D from './VoxelGrid3D'
import AsciiTable3D from './AsciiTable3D'
import WordScanner3D from './WordScanner3D'
import MathReactor3D from './MathReactor3D'
import ArrayBars3D from './ArrayBars3D'
import BitSwitches3D from './BitSwitches3D'
import LinkedList3D from './LinkedList3D'
import StackFrames3DVisualizer from './StackFrames3DVisualizer'
import Memory3DVisualizer from './Memory3DVisualizer'
import StringMutator3D from './StringMutator3D'

/**
 * Motor Central de Visualización 3D Personalizado por Ejercicio.
 * Utiliza el blueprint conceptual del ejercicio para configurar la maqueta 3D interactiva,
 * adaptando el modelo físico en memoria (Bits, Listas enlazadas, Vóxeles DFS,
 * Tabla ASCII O(1), Escáner de Palabras, Factores de ALU o Memoria Heap).
 */
export default function Exercise3DDojo({ exercise }) {
  const [viewMode, setViewMode] = useState('algorithm') // 'algorithm' | 'memory' | 'stack'
  const [showLegend, setShowLegend] = useState(true)

  if (!exercise) return null

  const blueprint = getExerciseThinkingBlueprint(exercise)
  const threeConfig = blueprint.threeConfig
  const id = exercise.id || ''

  // 1. Extraer datos reales de prueba del ejercicio
  const tests = exercise.tests || []
  const validTest = tests.find(t => t.entrada && t.entrada.length > 0) || tests[0]
  const rawArg1 = validTest?.entrada?.[0]
  const rawArg2 = validTest?.entrada?.[1]

  const sampleText = typeof rawArg1 === 'string' && rawArg1.length > 0 ? rawArg1 : '42 Madrid'
  const sampleNum = typeof rawArg1 === 'number' ? rawArg1 : parseInt(rawArg1) || 42
  const sampleNumB = typeof rawArg2 === 'number' ? rawArg2 : parseInt(rawArg2) || 18

  const modelType = threeConfig.modelType

  return (
    <div className="space-y-4">
      {/* ── Barra Superior de Control y Perspectiva 3D ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
            <Box size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 leading-none">
              Laboratorio 3D Personalizado
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {threeConfig.conceptTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-medium">
          <button
            onClick={() => setViewMode('algorithm')}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all',
              viewMode === 'algorithm'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Sparkles size={13} />
            <span>Modelo del Algoritmo</span>
          </button>
          <button
            onClick={() => setViewMode('memory')}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all',
              viewMode === 'memory'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Cpu size={13} />
            <span>Celdas Hex (RAM)</span>
          </button>
          <button
            onClick={() => setViewMode('stack')}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all',
              viewMode === 'stack'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Layers size={13} />
            <span>Stack Frames</span>
          </button>
        </div>
      </div>

      {/* ── Ficha Pedagógica de la Estructura en Memoria ── */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Estructura Física en C:
              </span>
              <span className="font-mono text-xs bg-white text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200 font-semibold">
                {threeConfig.structureType}
              </span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {threeConfig.conceptDesc}
            </p>
          </div>
          <button
            onClick={() => setShowLegend(s => !s)}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold shrink-0"
          >
            {showLegend ? 'Ocultar leyenda' : 'Ver leyenda 3D'}
          </button>
        </div>

        {/* Leyenda interactiva de entidades 3D */}
        {showLegend && threeConfig.visualEntities && threeConfig.visualEntities.length > 0 && (
          <div className="pt-2 border-t border-indigo-100/80 flex flex-wrap gap-2">
            {threeConfig.visualEntities.map((entity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-indigo-100 text-[11px] text-zinc-700 shadow-2xs"
              >
                <span className={clsx('w-2.5 h-2.5 rounded-full shrink-0', entity.color)} />
                <span className="font-semibold text-zinc-900">{entity.label}:</span>
                <span className="text-zinc-500">{entity.desc}</span>
              </div>
            ))}
          </div>
        )}

        {threeConfig.keyObservation && (
          <div className="text-[11px] text-indigo-900/80 bg-white/70 rounded-lg p-2 border border-indigo-100/60 flex items-start gap-1.5">
            <Info size={13} className="text-indigo-600 shrink-0 mt-0.5" />
            <span><strong className="font-semibold text-indigo-950">Observación Clave:</strong> {threeConfig.keyObservation}</span>
          </div>
        )}
      </div>

      {/* ── Renderizado 3D Interactivo ── */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-950 min-h-[380px]">
        {viewMode === 'algorithm' && (
          <>
            {modelType === 'voxel' && <VoxelGrid3D initialExercise={exercise} />}
            {modelType === 'bitwise' && <BitSwitches3D initialValue={sampleNum} />}
            {modelType === 'linked_list' && <LinkedList3D initialValues={[42, 13, 7, 99]} />}
            {modelType === 'ascii_table' && (
              <AsciiTable3D
                exerciseId={id}
                initialS1={typeof rawArg1 === 'string' ? rawArg1 : 'padinton'}
                initialS2={typeof rawArg2 === 'string' ? rawArg2 : 'paqefwtdjetyiytjneytjoeyjnejeyj'}
              />
            )}
            {modelType === 'math_reactor' && (
              <MathReactor3D
                exerciseId={id}
                initialNum={sampleNum}
                initialNumB={sampleNumB}
              />
            )}
            {modelType === 'array_bars' && (
              <ArrayBars3D
                exerciseId={id}
                initialValues={Array.isArray(rawArg1) ? rawArg1 : [42, 13, 7, 99, 25, -4, 58, 3]}
              />
            )}
            {modelType === 'word_scanner' && (
              <WordScanner3D
                exerciseId={id}
                initialText={sampleText}
              />
            )}
            {modelType === 'string_mutator' && (
              <StringMutator3D
                operation={threeConfig.operation || id}
                initialText={sampleText}
              />
            )}
            {modelType === 'memory_cells' && (
              <Memory3DVisualizer initialType="string" initialText={sampleText} />
            )}
          </>
        )}

        {viewMode === 'memory' && (
          <Memory3DVisualizer
            initialType={modelType === 'bitwise' ? 'array' : 'string'}
            initialText={sampleText}
          />
        )}

        {viewMode === 'stack' && (
          <StackFrames3DVisualizer />
        )}

        {/* Tip flotante de navegación 3D */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-xs text-zinc-300 text-[10px] px-2.5 py-1 rounded-full border border-zinc-700">
          <MousePointer size={11} className="text-zinc-400" />
          <span>Arrastra para rotar · Rueda para zoom · Clic para interactuar</span>
        </div>
      </div>
    </div>
  )
}
