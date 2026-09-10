import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal, Bug, Eye, Play, Copy, Check, Sparkles, ChevronRight,
  ShieldAlert, HelpCircle, Code2, AlertTriangle, Layers, Cpu
} from 'lucide-react'
import clsx from 'clsx'

export default function ManualDebugGuide({ exercise }) {
  const [subTab, setSubTab] = useState('printf') // 'printf' | 'gdb' | 'terminal_sim'
  const [copied, setCopied] = useState(false)
  const [simCommand, setSimCommand] = useState('')
  const [simHistory, setSimHistory] = useState([
    { type: 'system', text: `GNU gdb (Ubuntu 12.1-0ubuntu1) 12.1\nReading symbols from ./test_debug...` },
  ])

  if (!exercise) return null

  const id = exercise.id
  const isFunction = exercise.tipoEntrega === 'funcion'

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Comandos GDB simulados interactivos
  const runSimCommand = (cmd) => {
    const trimmed = (cmd || simCommand).trim()
    if (!trimmed) return

    const newEntries = [{ type: 'input', text: `(gdb) ${trimmed}` }]

    const lower = trimmed.toLowerCase()
    if (lower === 'r' || lower.startsWith('run')) {
      newEntries.push({
        type: 'output',
        text: `Starting program: /home/user/42/${isFunction ? 'test_debug' : id}\nBreakpoint 1, ${isFunction ? id : 'main'} () at ${id}.c:14\n14\t    int i = 0;`
      })
    } else if (lower.startsWith('b') || lower.startsWith('break')) {
      newEntries.push({
        type: 'output',
        text: `Breakpoint 1 at 0x11e9: file ${id}.c, line 14.`
      })
    } else if (lower === 'n' || lower === 'next') {
      newEntries.push({
        type: 'output',
        text: `15\t    while (str[i] != '\\0')\n(gdb)`
      })
    } else if (lower === 's' || lower === 'step') {
      newEntries.push({
        type: 'output',
        text: `${isFunction ? id : 'helper_fn'} (param=0x7fffffffdf38) at ${id}.c:8\n8\t    if (!param) return (0);`
      })
    } else if (lower.startsWith('p ') || lower.startsWith('print ')) {
      const varName = trimmed.split(' ')[1] || 'i'
      newEntries.push({
        type: 'output',
        text: `$1 = 42  // Valor actual de '${varName}' en registro/pila`
      })
    } else if (lower.startsWith('x/s') || lower.startsWith('x/')) {
      newEntries.push({
        type: 'output',
        text: `0x7fffffffdf38: "42 Wolfsburg / Madrid"  // Búfer en memoria examinado`
      })
    } else if (lower === 'bt' || lower === 'backtrace') {
      newEntries.push({
        type: 'output',
        text: `#0  ${isFunction ? id : 'main'} (ptr=0x0) at ${id}.c:22\n#1  0x00005555555551dc in main (argc=2, argv=0x7fffffffdf18) at main.c:16\n// 💡 Diagnóstico: El crash ocurrió en la línea 22 de ${id}.c porque ptr era 0x0 (NULL)`
      })
    } else if (lower === 'info locals') {
      newEntries.push({
        type: 'output',
        text: `i = 0\nlen = 12\nptr = 0x7fffffffdf38\nres = 0`
      })
    } else if (lower === 'c' || lower === 'continue') {
      newEntries.push({
        type: 'output',
        text: `Continuing.\n[Inferior 1 (process 4242) exited normally]`
      })
    } else if (lower === 'clear') {
      setSimHistory([{ type: 'system', text: `GNU gdb (Ubuntu 12.1-0ubuntu1) 12.1\nReading symbols from ./test_debug...` }])
      setSimCommand('')
      return
    } else {
      newEntries.push({
        type: 'output',
        text: `Comando '${trimmed}' ejecutado. Prueba 'run', 'break main', 'n', 'p i', 'x/s ptr', 'bt', o 'info locals'.`
      })
    }

    setSimHistory(prev => [...prev, ...newEntries])
    setSimCommand('')
  }

  // Snippet de printf específico
  const printfSnippet = useMemo(() => {
    if (isFunction) {
      return `/* ========================================================================= */
/* EJEMPLO DE INSTRUMENTACIÓN CON PRINTF PARA ${id.toUpperCase()} */
/* ========================================================================= */
#include <stdio.h>

// Macro de depuración: imprime archivo, línea y valor sin ensuciar la lógica
#define DPRINT(fmt, ...) printf("[DEBUG %s:%d] " fmt "\\n", __func__, __LINE__, ##__VA_ARGS__)

/* Inserta checkpoints estratégicos para aislar Segfaults: */
void debug_checkpoints(void *ptr)
{
    // 1. Verificar si el puntero que te pasan es NULL antes de tocarlo:
    printf("[CHECKPOINT 1] Dirección recibida: %p\\n", ptr);
    fflush(stdout); // 💡 VITAL: Vacía el buffer de stdout por si crashea enseguida

    if (!ptr)
    {
        printf("[GUARDIA ACTIVADA] ptr es NULL, evitando Segfault!\\n");
        return;
    }

    // 2. Inspeccionar el primer byte y su código numérico:
    printf("[CHECKPOINT 2] Primer byte: '%c' (código ASCII: %d)\\n", *(char *)ptr, *(char *)ptr);
    fflush(stdout);
}`
    }

    return `/* ========================================================================= */
/* EJEMPLO DE INSTRUMENTACIÓN CON PRINTF PARA ${id.toUpperCase()} */
/* ========================================================================= */
#include <stdio.h>

int main(int argc, char **argv)
{
    // 1. Depurar argumentos en CLI:
    printf("[DEBUG] argc recibido: %d\\n", argc);
    for (int i = 0; i < argc; i++)
        printf("[DEBUG] argv[%d] en %p = \\"%s\\"\\n", i, (void*)argv[i], argv[i]);
    fflush(stdout); // Vaciar buffer inmediatamente

    if (argc != 2)
    {
        printf("[DEBUG] Argumentos incorrectos, finalizando con '\\\\n'\\n");
        return (0);
    }

    // 2. Depurar el bucle principal de caracteres:
    int i = 0;
    while (argv[1][i])
    {
        printf("[LOOP] idx=%d, char='%c', ascii=%d\\n", i, argv[1][i], argv[1][i]);
        i++;
    }
    return (0);
}`
  }, [id, isFunction])

  return (
    <div className="space-y-4">
      {/* ── Sub-selector de Pestañas de Debugging ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-semibold">
          <button
            onClick={() => setSubTab('printf')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all',
              subTab === 'printf'
                ? 'bg-white text-zinc-900 shadow-xs font-bold'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Bug size={14} className="text-amber-600" />
            <span>1. Debugging con Printf</span>
          </button>
          <button
            onClick={() => setSubTab('gdb')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all',
              subTab === 'gdb'
                ? 'bg-white text-zinc-900 shadow-xs font-bold'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Terminal size={14} className="text-purple-600" />
            <span>2. Guía GDB Manual en Terminal</span>
          </button>
          <button
            onClick={() => setSubTab('terminal_sim')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all',
              subTab === 'terminal_sim'
                ? 'bg-white text-zinc-900 shadow-xs font-bold'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Sparkles size={14} className="text-emerald-600" />
            <span>3. Consola Interactiva GDB</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-zinc-400">
          Metodología 42 · Curo de Errores
        </span>
      </div>

      {/* ── PESTAÑA 1: DEBUGGING CON PRINTF ── */}
      {subTab === 'printf' && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Tarjeta de Concepto Clave: El Búfer de Stdout */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert size={16} className="text-amber-600 shrink-0" />
              <span>La Gran Trampa del Buffer de stdout: ¿Por qué mi printf no sale si hay un Segfault?</span>
            </div>
            <p className="leading-relaxed">
              En C y UNIX, <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">printf</code> no escribe directamente en la pantalla de inmediato; almacena los bytes en un <strong>búfer de memoria en RAM</strong> para ser más eficiente. Si en la siguiente línea tu código comete un <code className="font-mono font-bold text-red-700">Segmentation Fault</code>, el sistema operativo mata tu proceso al instante y <strong>todo lo que estaba en el búfer se destruye sin llegar a imprimirse</strong>.
            </p>
            <div className="flex items-center gap-2 pt-1 font-semibold text-amber-900">
              <span className="text-emerald-600 font-bold">✓ La Solución 42:</span>
              <span>Usa siempre <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">fflush(stdout);</code> o termina cada print con <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">\n</code>.</span>
            </div>
          </div>

          {/* Formatos de Printf Esenciales en C */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
              Especificadores de Formato Esenciales para Debuguear en C
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 font-mono">
                <span className="font-bold text-indigo-600">%p</span>
                <p className="text-zinc-600 text-[11px] font-sans mt-0.5">
                  Dirección física de un puntero: <code className="text-zinc-800">printf("%p", (void*)ptr);</code>
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 font-mono">
                <span className="font-bold text-indigo-600">%c y %d</span>
                <p className="text-zinc-600 text-[11px] font-sans mt-0.5">
                  Carácter y su valor ASCII numérico: <code className="text-zinc-800">printf("'%c' (%d)", c, c);</code>
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 font-mono">
                <span className="font-bold text-indigo-600">0x%02x</span>
                <p className="text-zinc-600 text-[11px] font-sans mt-0.5">
                  Byte en hexadecimal (ideal para bits y strings): <code className="text-zinc-800">0x00..0xff</code>
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 font-mono">
                <span className="font-bold text-indigo-600">%s con guardia</span>
                <p className="text-zinc-600 text-[11px] font-sans mt-0.5">
                  Cadena segura (evita crash si es null): <code className="text-zinc-800">s ? s : "(null)"</code>
                </p>
              </div>
            </div>
          </div>

          {/* Snippet de Código Listo para Copiar */}
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
            <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 font-mono">
                Plantilla de Printf Debugging adaptada a {exercise.nombre}
              </span>
              <button
                onClick={() => handleCopy(printfSnippet)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-zinc-100 border border-zinc-200 rounded text-xs font-semibold text-zinc-700"
              >
                {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
              {printfSnippet}
            </pre>
          </div>
        </motion.div>
      )}

      {/* ── PESTAÑA 2: GUÍA GDB MANUAL ── */}
      {subTab === 'gdb' && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 space-y-2 text-xs text-purple-950">
            <div className="flex items-center gap-2 font-bold text-purple-900">
              <Terminal size={16} className="text-purple-600 shrink-0" />
              <span>Flujo de Trabajo Profesional con GDB en el Examen de 42</span>
            </div>
            <p className="leading-relaxed">
              GDB te permite pausar la ejecución en cualquier línea, inspeccionar variables dentro del Stack Frame y ver exactamente qué puntero provocó un fallo de segmentación con una sola orden.
            </p>
          </div>

          {/* Pasos de GDB */}
          <div className="space-y-2.5 text-xs">
            {[
              {
                step: 'Paso 1',
                title: 'Compilar con -g3 sin optimizaciones (-O0)',
                cmd: isFunction ? `gcc -g3 -O0 main.c ${id}.c -o test_debug` : `gcc -g3 -O0 ${id}.c -o ${id}_debug`,
                desc: 'Los flags -g3 y -O0 son sagrados: obligan a gcc a incluir los nombres de tus variables y líneas exactas sin reorganizar el código.',
              },
              {
                step: 'Paso 2',
                title: 'Iniciar GDB y poner Breakpoints (Puntos de Parada)',
                cmd: `gdb ./${isFunction ? 'test_debug' : `${id}_debug`}\n(gdb) break ${isFunction ? id : 'main'}   # o simplemente: b ${isFunction ? id : 'main'}`,
                desc: 'GDB detendrá el programa justo antes de ejecutar la primera instrucción de la función.',
              },
              {
                step: 'Paso 3',
                title: 'Ejecutar pasando argumentos de entrada (run)',
                cmd: `(gdb) run "argumento de prueba"  # o simplemente: r "texto"`,
                desc: 'Si el ejercicio recibe varios argumentos (ej: inter, union), pásalos separados por comillas.',
              },
              {
                step: 'Paso 4',
                title: 'Avanzar línea a línea: next (n) vs step (s)',
                cmd: `(gdb) next   # Avanza 1 línea sin entrar a funciones secundarias\n(gdb) step   # Entra dentro de la función que se llama en esa línea`,
                desc: 'Pulsa simplemente ENTER para repetir el último comando (next) rápidamente.',
              },
              {
                step: 'Paso 5',
                title: 'Inspeccionar valores y memoria en tiempo real',
                cmd: `(gdb) print i         # Imprime el valor de la variable i\n(gdb) print *ptr       # Imprime lo que apunta el puntero ptr\n(gdb) x/s ptr          # Examina la memoria de ptr como un string C\n(gdb) display i        # Imprime 'i' automáticamente en cada paso`,
                desc: 'Con `x/s` (examine string) puedes ver cadenas completas en memoria.',
              },
              {
                step: 'Paso 6',
                title: 'El Salvavidas tras un Segfault: backtrace (bt)',
                cmd: `Program received signal SIGSEGV, Segmentation fault.\n(gdb) bt               # Muestra el rastreo exacto de la llamada`,
                desc: 'GDB te dirá la línea exacta donde intentaste leer memoria no válida. Usa `info locals` para ver qué variable tenía valor basura o NULL.',
              },
              {
                step: 'Paso 7',
                title: 'Modo Visual Secreto en Terminal (TUI)',
                cmd: `(gdb) layout src     # Divide la pantalla con el código C arriba!`,
                desc: 'Usa Ctrl+X y luego A para alternar entre el modo visual y modo texto.',
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-3.5 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 font-mono text-[10px] font-bold text-zinc-700">
                      {item.step}
                    </span>
                    <span className="font-bold text-zinc-800">{item.title}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.cmd)}
                    className="text-zinc-400 hover:text-zinc-700 p-1"
                    title="Copiar comando"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <pre className="p-2 bg-zinc-900 text-purple-300 font-mono text-[11px] rounded-lg overflow-x-auto select-all">
                  {item.cmd}
                </pre>
                <p className="text-[11px] text-zinc-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── PESTAÑA 3: CONSOLA INTERACTIVA GDB ── */}
      {subTab === 'terminal_sim' && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 flex items-center gap-1.5">
              <Terminal size={14} className="text-emerald-600" />
              Simulador Interactivo de GDB
            </span>
            <span className="text-zinc-400 text-[11px]">
              Haz clic en los comandos rápidos o escribe en la consola
            </span>
          </div>

          {/* Botones de Comando Rápido */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => runSimCommand(`break ${isFunction ? id : 'main'}`)}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-mono text-zinc-800 border border-zinc-200"
            >
              break {isFunction ? id : 'main'}
            </button>
            <button
              onClick={() => runSimCommand('run "42 Madrid"')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-mono text-zinc-800 border border-zinc-200"
            >
              run "42 Madrid"
            </button>
            <button
              onClick={() => runSimCommand('next')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-mono text-zinc-800 border border-zinc-200"
            >
              next (n)
            </button>
            <button
              onClick={() => runSimCommand('print i')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-mono text-zinc-800 border border-zinc-200"
            >
              print i
            </button>
            <button
              onClick={() => runSimCommand('x/s ptr')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-mono text-zinc-800 border border-zinc-200"
            >
              x/s ptr
            </button>
            <button
              onClick={() => runSimCommand('backtrace')}
              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-mono border border-red-200"
            >
              backtrace (bt)
            </button>
            <button
              onClick={() => runSimCommand('info locals')}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-mono text-zinc-800 border border-zinc-200"
            >
              info locals
            </button>
            <button
              onClick={() => runSimCommand('clear')}
              className="px-2.5 py-1 bg-zinc-200 hover:bg-zinc-300 rounded-lg text-zinc-600 ml-auto"
            >
              Limpiar consola
            </button>
          </div>

          {/* Terminal Console Box */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl font-mono text-xs">
            {/* Terminal Header */}
            <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-zinc-400 text-[11px] ml-2">gdb — {id}</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-2 max-h-[340px] overflow-y-auto leading-relaxed">
              {simHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    item.type === 'system' ? 'text-zinc-500' :
                    item.type === 'input' ? 'text-emerald-400 font-bold' :
                    'text-zinc-200 whitespace-pre-wrap'
                  )}
                >
                  {item.text}
                </div>
              ))}
            </div>

            {/* Input Prompt */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                runSimCommand()
              }}
              className="border-t border-zinc-800 bg-zinc-900/60 p-2.5 flex items-center gap-2"
            >
              <span className="text-purple-400 font-bold select-none">(gdb)</span>
              <input
                type="text"
                value={simCommand}
                onChange={(e) => setSimCommand(e.target.value)}
                placeholder="Escribe un comando GDB (ej: run, b main, n, p i, bt)..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-xs placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-semibold"
              >
                Ejecutar
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  )
}
