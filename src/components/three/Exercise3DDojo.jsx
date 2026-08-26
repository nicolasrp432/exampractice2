import { useState } from 'react'
import { Box, Layers, Cpu, Code2, Sparkles, RefreshCw, Eye } from 'lucide-react'
import clsx from 'clsx'

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

/**
 * Motor Central de Visualización 3D Personalizado por Ejercicio.
 * Detecta la naturaleza exacta del problema (Bits, Listas, Recursión 2D, Tabla ASCII,
 * Escaneo de Palabras, Factores Primos, Heap Malloc, o Punteros) y renderiza
 * la maqueta 3D interactiva correspondiente alimentada con los datos reales del ejercicio.
 */
export default function Exercise3DDojo({ exercise }) {
  const [viewMode, setViewMode] = useState('algorithm') // 'algorithm' | 'memory' | 'stack'

  if (!exercise) return null

  const id = exercise.id || ''

  // 1. Clasificación del dominio del ejercicio
  const isVoxelGrid = id === 'flood_fill'
  const isBitwise = ['print_bits', 'reverse_bits', 'swap_bits', 'is_power_of_2'].includes(id)
  const isLinkedList = ['ft_list_size', 'ft_list_foreach', 'ft_list_remove_if', 'sort_list'].includes(id)
  const isAsciiTable = ['inter', 'union', 'wdmatch', 'hidenp'].includes(id)
  const isMathReactor = ['fprime', 'pgcd', 'lcm', 'add_prime_sum', 'print_hex', 'tab_mult', 'fizzbuzz'].includes(id)
  const isArrayBars = ['sort_int_tab', 'max', 'ft_range', 'ft_rrange', 'ft_atoi', 'ft_atoi_base', 'ft_itoa'].includes(id)
  const isWordScanner = [
    'first_word', 'last_word', 'epur_str', 'expand_str',
    'rostring', 'rev_wstr', 'ft_split', 'str_capitalizer',
    'rstr_capitalizer', 'camel_to_snake', 'snake_to_camel',
  ].includes(id)

  // 2. Extraer datos de muestra del ejercicio
  const test1 = exercise.tests?.[0]
  const rawArg1 = test1?.entrada?.[0]
  const rawArg2 = test1?.entrada?.[1]

  const sampleText = typeof rawArg1 === 'string' ? rawArg1 : '42 Madrid'
  const sampleNum = typeof rawArg1 === 'number' ? rawArg1 : parseInt(rawArg1) || 42
  const sampleNumB = typeof rawArg2 === 'number' ? rawArg2 : parseInt(rawArg2) || 18

  // Descriptor del tipo de estructura
  const getStructureType = () => {
    if (isVoxelGrid) return 'char **tab (Matriz 2D + t_point)'
    if (isBitwise) return 'unsigned char (8 bits / byte)'
    if (isLinkedList) return 't_list * (Nodos enlazados)'
    if (isAsciiTable) return 'int seen[256] (Tabla de búsqueda O(1))'
    if (isMathReactor) return 'int / uint (Aritmética & Factores)'
    if (isArrayBars) return 'int *tab (Heap Array en Memoria)'
    if (isWordScanner) return 'char * (Punteros a palabras & \\0)'
    return 'char * (Cadena de caracteres)'
  }

  return (
    <div className="space-y-3">
      {/* Selector de perspectiva 3D */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Box size={18} className="text-indigo-600" />
          <h3 className="font-bold text-sm text-zinc-900">
            Laboratorio 3D Personalizado
          </h3>
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
            <span>Celdas Hex (0x7ffd)</span>
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

      {/* Subtítulo con tipo de dato en memoria */}
      <div className="flex items-center justify-between text-[11px] px-1 text-zinc-500">
        <span className="font-semibold uppercase tracking-wider text-zinc-400">
          Estructura Física en C:
        </span>
        <span className="font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-700 border border-zinc-200">
          {getStructureType()}
        </span>
      </div>

      {/* Renderizado de la vista seleccionada */}
      {viewMode === 'algorithm' && (
        <>
          {isVoxelGrid && <VoxelGrid3D initialExercise={exercise} />}
          {isBitwise && <BitSwitches3D initialValue={sampleNum} />}
          {isLinkedList && <LinkedList3D initialValues={[42, 13, 7, 99]} />}
          {isAsciiTable && (
            <AsciiTable3D
              exerciseId={id}
              initialS1={typeof rawArg1 === 'string' ? rawArg1 : 'padinton'}
              initialS2={typeof rawArg2 === 'string' ? rawArg2 : 'paqefwtdjetyiytjneytjoeyjnejeyj'}
            />
          )}
          {isMathReactor && (
            <MathReactor3D
              exerciseId={id}
              initialNum={sampleNum}
              initialNumB={sampleNumB}
            />
          )}
          {isArrayBars && (
            <ArrayBars3D
              exerciseId={id}
              initialValues={Array.isArray(rawArg1) ? rawArg1 : [42, 13, 7, 99, 25, -4, 58, 3]}
            />
          )}
          {isWordScanner && (
            <WordScanner3D
              exerciseId={id}
              initialText={sampleText}
            />
          )}
          {/* Default string/memory visualizer para otros ejercicios de strings directos */}
          {!isVoxelGrid && !isBitwise && !isLinkedList && !isAsciiTable && !isMathReactor && !isArrayBars && !isWordScanner && (
            <Memory3DVisualizer initialType="string" initialText={sampleText} />
          )}
        </>
      )}

      {viewMode === 'memory' && (
        <Memory3DVisualizer
          initialType={isBitwise ? 'array' : 'string'}
          initialText={sampleText}
        />
      )}

      {viewMode === 'stack' && (
        <StackFrames3DVisualizer />
      )}
    </div>
  )
}
