import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Sparkles, Wand2, Copy, Check, Terminal, ShieldAlert,
  ArrowRight, CheckCircle2, BookOpen, Layers, Lightbulb, Zap, Code2, AlertTriangle
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import clsx from 'clsx'
import { decodeSubject, getToolById } from '@/utils/tools'
import { allExercises } from '@/data/index.js'
import { PATTERN_ARCHETYPES } from '@/data/exerciseThinkingRegistry.js'

const SAMPLE_SUBJECTS = [
  {
    label: 'first_word (Programa CLI con espacios y delimitadores)',
    text: `Assignment name  : first_word
Expected files   : first_word.c
Allowed functions: write

Write a program that takes a string and displays its first word, followed by a newline.
A word is a section of string delimited by spaces/tabs or by the start/end of the string.
If the number of parameters is not 1, or if there are no words, simply display a newline.

Examples:
$> ./first_word "FOR PONY" | cat -e
FOR$
$> ./first_word "this        ...       is sparta" | cat -e
this$
$> ./first_word | cat -e
$`
  },
  {
    label: 'inter (Programa CLI con tabla ASCII O(1))',
    text: `Assignment name  : inter
Expected files   : inter.c
Allowed functions: write

Write a program that takes two strings and displays, without doubles, the
characters that appear in both strings, in the order they appear in the first one.
The display will be followed by a \\n.
If the number of arguments is not 2, the program displays \\n.

Examples:
$> ./inter "padinton" "paqefwtdjetyiytjneytjoeyjnejeyj" | cat -e
padinto$
$> ./inter ddf6vewg1 linear2c0gurring | cat -e
df6ewg4$
$> ./inter | cat -e
$`
  },
  {
    label: 'ft_strdup (Función en C con malloc y \\0)',
    text: `Assignment name  : ft_strdup
Expected files   : ft_strdup.c
Allowed functions: malloc

Reproduce the behavior of the function strdup (man strdup).
Your function must be declared as follows:
char    *ft_strdup(char *src);`
  },
  {
    label: 'swap_bits (Función de Bits)',
    text: `Assignment name  : swap_bits
Expected files   : swap_bits.c
Allowed functions: 

Write a function that takes a byte, swaps its halves (4 bits) and returns the result.
Your function must be declared as follows:
unsigned char	swap_bits(unsigned char octet);

Example:
  1 byte
_____________
 0100 | 0001
 \    /   \    /
  \  /     \  /
   \/       \/
 0001 | 0100`
  },
  {
    label: 'ft_list_size (Estructura t_list)',
    text: `Assignment name  : ft_list_size
Expected files   : ft_list_size.c
Allowed functions: 

Write a function that returns the number of elements in the linked list that's
passed to it.
Your function must be declared as follows:
int	ft_list_size(t_list *begin_list);

Where the t_list struct is:
typedef struct    s_list
{
    struct s_list *next;
    void          *data;
}                 t_list;`
  }
]

export default function SubjectDecoderStudio() {
  const [inputText, setInputText] = useState(SAMPLE_SUBJECTS[0].text)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('breakdown') // 'breakdown' | 'skeleton' | 'traps'

  const decoded = decodeSubject(inputText)

  // Detección heurística de arquetipo algorítmico
  const archetype = (() => {
    const txt = inputText.toLowerCase()
    if (txt.includes('t_list') || txt.includes('list')) return PATTERN_ARCHETYPES.LINKED_LIST_POINTERS
    if (txt.includes('swap_bits') || txt.includes('reverse_bits') || txt.includes('print_bits') || txt.includes('byte')) return PATTERN_ARCHETYPES.BITWISE_HARDWARE
    if (txt.includes('inter') || txt.includes('union') || txt.includes('without doubles') || txt.includes('doubles')) return PATTERN_ARCHETYPES.ASCII_HASH_TABLE_O1
    if (txt.includes('malloc') || txt.includes('strdup') || txt.includes('split') || txt.includes('range')) return PATTERN_ARCHETYPES.DYNAMIC_HEAP_ALLOCATION
    if (txt.includes('flood_fill') || txt.includes('flood')) return PATTERN_ARCHETYPES.RECURSIVE_DFS_FLOODFILL
    if (txt.includes('fprime') || txt.includes('prime') || txt.includes('lcm') || txt.includes('gcd')) return PATTERN_ARCHETYPES.ARITHMETIC_NUMBER_THEORY
    if (txt.includes('word') || txt.includes('epur') || txt.includes('expand')) return PATTERN_ARCHETYPES.TWO_POINTER_TOKENIZER
    return PATTERN_ARCHETYPES.CSTRING_PTR_WALK || PATTERN_ARCHETYPES.TWO_POINTER_TOKENIZER
  })()

  // Detección de naturaleza: Función pura o Programa con main
  const isFunction = !!inputText.match(/(?:void|int|char|unsigned\s+char)\s*\*?\s*[a-zA-Z0-9_]+\s*\([^)]*\)\s*;/) ||
                     (inputText.toLowerCase().includes('expected files') && !inputText.toLowerCase().includes('write a program'))
  
  // Extracción del prototipo si existe
  const protoMatch = inputText.match(/(?:void|int|char|unsigned\s+char|t_list)\s*\*?\s*[a-zA-Z0-9_]+\s*\([^)]*\)\s*;/)
  const prototype = protoMatch ? protoMatch[0] : null

  // Extracción de funciones permitidas
  const allowedMatch = inputText.match(/Allowed functions:\s*([^\n\r]*)/i)
  const allowedFunctions = allowedMatch && allowedMatch[1].trim() ? allowedMatch[1].trim() : 'Ninguna (solo operadores y sintaxis C)'

  // Extracción de nombre de archivo esperado
  const expectedFilesMatch = inputText.match(/Expected files\s*:\s*([^\n\r]*)/i)
  const expectedFiles = expectedFilesMatch ? expectedFilesMatch[1].trim() : 'archivo.c'

  const handleCopySkeleton = () => {
    if (!decoded.skeleton) return
    navigator.clipboard.writeText(decoded.skeleton).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-6">
      {/* ─── Encabezado del Decodificador ─── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Lectura Crítica 42
              </span>
              <span className="text-xs text-zinc-400 font-mono">Parser Universal de Subjects</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 mt-1">
              Decodificador Instantáneo de Enunciados
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-2xl">
              Pega cualquier subject del examen o selecciona un ejemplo para desglosar su naturaleza, funciones permitidas, herramientas necesarias y generar el esqueleto óptimo en segundos.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ejemplos rápidos:</span>
            {SAMPLE_SUBJECTS.map((sample, i) => (
              <button
                key={i}
                onClick={() => setInputText(sample.text)}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200 transition-colors truncate max-w-[140px]"
                title={sample.label}
              >
                {sample.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea de entrada del Subject */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <FileText size={14} className="text-indigo-600" />
              Pega aquí el Subject (enunciado de 42)
            </label>
            <span className="text-[11px] text-zinc-400 font-mono">Detecta automáticamente prototipos, argc y funciones permitidas</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={7}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 font-mono text-xs text-zinc-800 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
            placeholder="Pega el subject aquí..."
          />
        </div>
      </div>

      {/* ─── Resultado del Análisis en Tiempo Real ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Tarjetas de Diagnóstico y Desglose (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tarjeta 1: Ficha Técnica Rápida */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Terminal size={16} className="text-indigo-600" />
                Ficha Técnica del Enunciado
              </h3>
              <span
                className={clsx(
                  'px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border',
                  isFunction
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                )}
              >
                {isFunction ? '⚙️ Función en C (sin main)' : '🖥️ Programa CLI (con main)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-400 font-bold uppercase block text-[10px]">Archivo Esperado</span>
                <span className="font-mono font-bold text-zinc-900 text-xs mt-0.5 block">{expectedFiles}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-400 font-bold uppercase block text-[10px]">Funciones Permitidas</span>
                <span className="font-mono font-bold text-indigo-600 text-xs mt-0.5 block truncate" title={allowedFunctions}>
                  {allowedFunctions}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-400 font-bold uppercase block text-[10px]">Patrón Algorítmico</span>
                <span className="font-bold text-zinc-900 text-xs mt-0.5 block truncate">
                  {archetype?.icon} {archetype?.name || 'Recorrido Lineal'}
                </span>
              </div>
            </div>

            {prototype && (
              <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
                <span className="text-emerald-400 font-bold whitespace-nowrap">{prototype}</span>
                <span className="text-[10px] text-zinc-400 font-sans uppercase">Prototipo Oficial</span>
              </div>
            )}
          </div>

          {/* Tarjeta 2: Las Herramientas Universales Requeridas */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Herramientas Universales Detectadas
            </h3>
            <p className="text-xs text-zinc-500">
              Estas son las herramientas de tu cinturón que debes activar mentalmente para este subject:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {decoded.toolIds.map((id) => {
                const tool = getToolById(id)
                if (!tool) return null
                return (
                  <div
                    key={id}
                    className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/80 flex items-start gap-2.5"
                  >
                    <span className="text-xl shrink-0">{tool.emoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900">{tool.label}</span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                          {tool.frequency}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">{tool.recognition}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tarjeta 3: Trampas y Puntos Críticos del Subject */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldAlert size={18} className="text-amber-600" />
              <h3 className="text-sm font-bold">Puntos de Fallo y Trampas Típicas en la Moulinette</h3>
            </div>

            <div className="space-y-2 text-xs text-amber-950">
              {!isFunction && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 mt-0.5">•</span>
                  <p><strong>Filtro de Argumentos:</strong> Si el usuario pasa 0 argumentos o más de los pedidos, debes escribir ÚNICAMENTE un salto de línea <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">write(1, "\n", 1);</code> y retornar 0.</p>
                </div>
              )}
              {isFunction && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 mt-0.5">•</span>
                  <p><strong>Punteros Nulos (NULL):</strong> La Moulinette testeará tu función pasándole NULL como argumento. Añade siempre una guardia inicial <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">if (!param) return (NULL);</code> para evitar Segfault.</p>
                </div>
              )}
              {decoded.toolIds.includes('malloc') && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 mt-0.5">•</span>
                  <p><strong>Byte Nulo ('\0') en Heap:</strong> Todo string reservado con malloc requiere <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">len + 1</code> bytes para cerrar la cadena con <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">dest[len] = '\0';</code>.</p>
                </div>
              )}
              {decoded.toolIds.includes('bandera') && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 mt-0.5">•</span>
                  <p><strong>Espacios Múltiples:</strong> En ejercicios como <em>epur_str</em> o <em>expand_str</em>, nunca imprimas un espacio al encontrarlo; activa una bandera y solo imprime el espacio cuando aparezca la siguiente letra visible.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Skeleton Sugerido en C (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden flex flex-col h-full min-h-[480px]">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Esqueleto Estructurado</p>
                <p className="text-xs text-zinc-600 mt-0.5">Base lista para abrir el editor y programar</p>
              </div>
              <button
                onClick={handleCopySkeleton}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors shadow-2xs"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="flex-1 min-h-[380px] bg-zinc-900">
              <Editor
                height="100%"
                defaultLanguage="c"
                value={decoded.skeleton}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12.5,
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  theme: 'vs-dark'
                }}
              />
            </div>

            <div className="p-3.5 border-t border-zinc-200 bg-zinc-50/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Ejercicios idénticos en el examen:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {decoded.similarExercises.length > 0 ? (
                  decoded.similarExercises.map((ex) => (
                    <span
                      key={ex.id}
                      className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-[11px] font-mono text-zinc-700"
                    >
                      {ex.nombre}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400">Ningún ejercicio similar directo.</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
