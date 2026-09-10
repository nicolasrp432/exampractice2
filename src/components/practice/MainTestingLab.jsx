import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, Copy, Check, Terminal, ShieldAlert, CheckCircle2,
  FileCode, Play, AlertTriangle, Layers, Zap, Info, ShieldCheck
} from 'lucide-react'
import clsx from 'clsx'
import { testHarnesses, realMains, buildFullCode } from '@/utils/testHarnesses'

export default function MainTestingLab({ exercise, userCode = '', onUseCode = null }) {
  const [activeView, setActiveView] = useState('real') // 'real' | 'harness' | 'assembled' | 'tests'
  const [copied, setCopied] = useState(false)
  const [selectedEdgeCase, setSelectedEdgeCase] = useState(null)

  if (!exercise) return null

  const isFunction = exercise.tipoEntrega === 'funcion'
  const id = exercise.id

  const realMainObj = realMains[id]
  const harnessObj = testHarnesses[id]

  // Fallback if no realMain exists: build one based on harness
  const realMainCode = useMemo(() => {
    if (realMainObj?.main) return realMainObj.main
    if (harnessObj?.main) {
      return `/* Main de prueba estándar para ${id} */\n${harnessObj.main}`
    }
    return `/* Main de prueba para ${id} */
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
\t(void)argc;
\t(void)argv;
\tprintf("Ejecutando pruebas para ${id}...\\n");
\treturn (0);
}`
  }, [realMainObj, harnessObj, id])

  const harnessCode = useMemo(() => {
    if (harnessObj) {
      return `${harnessObj.header ? harnessObj.header + '\n' : ''}${harnessObj.main}`
    }
    return realMainCode
  }, [harnessObj, realMainCode])

  const effectiveUserCode = userCode || exercise.solucion || exercise.versiones?.[0]?.codigo || '// Escribe tu código aquí\n'

  const assembledCode = useMemo(() => {
    return buildFullCode(id, exercise.tipoEntrega, effectiveUserCode)
  }, [id, exercise.tipoEntrega, effectiveUserCode])

  const currentCodeToDisplay = useMemo(() => {
    if (!isFunction) {
      return effectiveUserCode
    }
    if (activeView === 'real') return realMainCode
    if (activeView === 'harness') return harnessCode
    if (activeView === 'assembled') return assembledCode
    return realMainCode
  }, [isFunction, activeView, realMainCode, harnessCode, assembledCode, effectiveUserCode])

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Comandos de compilación y terminal personalizados
  const gccCmd = isFunction
    ? `gcc -Wall -Wextra -Werror main.c ${id}.c -o test && ./test`
    : `gcc -Wall -Wextra -Werror ${id}.c -o ${id} && ./${id} "argumento"`

  const gdbCmd = isFunction
    ? `gcc -g3 -O0 main.c ${id}.c -o test_debug && gdb ./test_debug`
    : `gcc -g3 -O0 ${id}.c -o ${id}_debug && gdb ./${id}_debug`

  const asanCmd = isFunction
    ? `gcc -fsanitize=address -g3 main.c ${id}.c -o test_asan && ./test_asan`
    : `gcc -fsanitize=address -g3 ${id}.c -o ${id}_asan && ./${id}_asan`

  const valgrindCmd = isFunction
    ? `valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes ./test`
    : `valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes ./${id} "prueba"`

  // Edge cases destacados
  const edgeCases = useMemo(() => {
    const cases = []
    if (isFunction) {
      cases.push({
        name: 'Puntero NULL / Vacío',
        why: 'En C, desreferenciar un puntero NULL causa inmediatamente Segmentation Fault.',
        how: 'Probar pasando NULL o strings de 0 caracteres ("") a la función.',
      })
      if (id.includes('atoi') || id.includes('hex') || id.includes('range')) {
        cases.push({
          name: 'Valores Límites (INT_MIN, INT_MAX, 0)',
          why: 'INT_MIN (-2147483648) no cabe en su positivo inverso en signed int sin overflow.',
          how: 'Probar con "-2147483648", "2147483647", "0", números negativos.',
        })
      }
      if (id.includes('str') || id.includes('split') || id.includes('word')) {
        cases.push({
          name: 'Cadenas sin Terminador / Espacios Consecutivos',
          why: 'Un bucle que no busque \'\\0\' saltará los límites de memoria.',
          how: 'Probar con cadenas con solo espacios ("   "), cadenas de 1 solo carácter ("a").',
        })
      }
      if (id.includes('list')) {
        cases.push({
          name: 'Lista Vacía (head == NULL) y de 1 Nodo',
          why: 'Los accesos a `lst->next` crashean si lst es NULL.',
          how: 'Probar pasando una lista inicializada en NULL y verificar que no crashea.',
        })
      }
    } else {
      cases.push({
        name: 'Sin Argumentos (argc == 1)',
        why: 'Moulinette siempre prueba ejecutar el binario sin argumentos.',
        how: 'Debe imprimir solo un salto de línea "\\n" y retornar 0.',
      })
      cases.push({
        name: 'Más Argumentos de los Esperados (argc > esperado)',
        why: 'Si espera 1 argumento y le pasan 3, debe imprimir solo "\\n".',
        how: 'Ejecutar ./${id} "arg1" "arg2" "arg3" y esperar solo "\\n".',
      })
      cases.push({
        name: 'Argumento Vacío ("")',
        why: 'Un string de longitud 0 puede provocar desreferenciación inválida en argv[1][0].',
        how: 'Ejecutar ./${id} "" y verificar salida limpia.',
      })
    }
    return cases
  }, [isFunction, id])

  return (
    <div className="space-y-5">
      {/* ── 1. Encabezado Didáctico ── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs">
              <Code2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-zinc-900">
                  {isFunction ? 'Laboratorio de Main & Pruebas en C' : 'Harness de Ejecución CLI & Tests'}
                </h3>
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                  isFunction ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                )}>
                  {isFunction ? 'Tipo Función (Requiere Main de Test)' : 'Tipo Programa (Autónomo)'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Cómo compilar, verificar casos límite y debugear <strong>{exercise.nombre}</strong> antes de entregar
              </p>
            </div>
          </div>
        </div>

        {/* Advertencia / Explicación del Método 42 */}
        <div className={clsx(
          'p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-3',
          isFunction ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-blue-50/80 border-blue-200 text-blue-950'
        )}>
          {isFunction ? (
            <>
              <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold block">
                  ⚠️ REGLA CRÍTICA DE EXAMEN 42 (Tipo Función):
                </strong>
                <p>
                  En tu archivo de entrega <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 font-bold">{exercise.archivosEsperados?.[0] || `${id}.c`}</code> <strong>NUNCA debes incluir la función main()</strong>.
                  Si dejas un main en tu archivo, Moulinette o Norminette darán <strong>KO instantáneo</strong> por símbolo duplicado.
                </p>
                <p className="text-[11px] text-amber-800">
                  Para probar tu función, crea un archivo separado <code className="font-mono bg-white px-1 rounded">main.c</code> en tu carpeta de trabajo, compila ambos juntos, y antes del <code className="font-mono">git push</code> asegúrate de entregar únicamente el archivo de la función.
                </p>
              </div>
            </>
          ) : (
            <>
              <Terminal size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold block">
                  🖥️ PROGRAMA AUTÓNOMO (Tipo Programa):
                </strong>
                <p>
                  Este ejercicio se entrega con su propio <code className="font-mono font-bold">int main(int argc, char **argv)</code> en el archivo <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-300">{exercise.archivosEsperados?.[0] || `${id}.c`}</code>.
                  Se prueba ejecutando el binario compilado con diferentes combinaciones de argumentos en la terminal.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 2. Selector de Código y Visor ── */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
          {isFunction ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-zinc-500 mr-1">Ver Código:</span>
              <button
                onClick={() => setActiveView('real')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border',
                  activeView === 'real'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                )}
              >
                Main Oficial 42 (rank02)
              </button>
              <button
                onClick={() => setActiveView('harness')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border',
                  activeView === 'harness'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                )}
              >
                Harness con Asertos
              </button>
              <button
                onClick={() => setActiveView('assembled')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border',
                  activeView === 'assembled'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                )}
              >
                Código Completo (Función + Main)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FileCode size={16} className="text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-700">
                Archivo fuente completo: {exercise.archivosEsperados?.[0] || `${id}.c`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(currentCodeToDisplay)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 transition-all shadow-2xs"
              title="Copiar código C al portapapeles"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
              <span>{copied ? 'Copiado' : 'Copiar C'}</span>
            </button>
          </div>
        </div>

        {/* Visor de Código C con Formato Limpio */}
        <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-200 overflow-x-auto max-h-[380px] overflow-y-auto select-text leading-relaxed">
          <pre>{currentCodeToDisplay}</pre>
        </div>
      </div>

      {/* ── 3. Comandos de Terminal para Compilar y Testear en Local ── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Terminal size={17} className="text-zinc-800" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Comandos Reales de Terminal en Clúster 42
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* GCC Estándar */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">1. Compilación Estricta (Flags 42)</span>
              <button
                onClick={() => handleCopy(gccCmd)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
                title="Copiar comando"
              >
                <Copy size={12} />
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-zinc-900 text-emerald-400 p-2.5 rounded-lg overflow-x-auto select-all">
              {gccCmd}
            </pre>
            <p className="text-[10px] text-zinc-500">
              Usa <code className="font-mono">-Wall -Wextra -Werror</code> idéntico a la Moulinette. Si hay un solo warning, falla.
            </p>
          </div>

          {/* GDB Debugging */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">2. Compilación con Símbolos GDB</span>
              <button
                onClick={() => handleCopy(gdbCmd)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
                title="Copiar comando"
              >
                <Copy size={12} />
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-zinc-900 text-purple-300 p-2.5 rounded-lg overflow-x-auto select-all">
              {gdbCmd}
            </pre>
            <p className="text-[10px] text-zinc-500">
              <code className="font-mono">-g3 -O0</code> preserva todos los nombres de variables y números de línea sin optimización.
            </p>
          </div>

          {/* AddressSanitizer (ASan) */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">3. AddressSanitizer (Cazar Segfaults)</span>
              <button
                onClick={() => handleCopy(asanCmd)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
                title="Copiar comando"
              >
                <Copy size={12} />
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-zinc-900 text-amber-300 p-2.5 rounded-lg overflow-x-auto select-all">
              {asanCmd}
            </pre>
            <p className="text-[10px] text-zinc-500">
              Detecta desbordamientos de búfer (heap/stack overflow) e índices fuera de rango al instante.
            </p>
          </div>

          {/* Valgrind Memory Leaks */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700">4. Valgrind (Fugas de Memoria)</span>
              <button
                onClick={() => handleCopy(valgrindCmd)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
                title="Copiar comando"
              >
                <Copy size={12} />
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-zinc-900 text-cyan-300 p-2.5 rounded-lg overflow-x-auto select-all">
              {valgrindCmd}
            </pre>
            <p className="text-[10px] text-zinc-500">
              Imprescindible en ejercicios con <code className="font-mono">malloc</code> (ej: ft_split, ft_strdup, ft_range).
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. Casos Límite y Edge Cases Críticos a Testear en C ── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={17} className="text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Casos Límite (Edge Cases) que tu Main Debe Verificar
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {edgeCases.map((ec, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all space-y-1"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                <span className="h-4 w-4 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>{ec.name}</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-snug">
                {ec.why}
              </p>
              <p className="text-[11px] font-mono text-indigo-600 pt-0.5">
                💡 {ec.how}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
