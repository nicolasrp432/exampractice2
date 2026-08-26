import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, ArrowRight, CheckCircle2, Circle, Sparkles, Box,
  Binary, Network, Layers, Terminal, ToggleLeft, HelpCircle, Trophy,
  Play, BookOpen, Lightbulb, Zap, Code2, Check, X, Brain, Compass, ShieldAlert, Cpu
} from 'lucide-react'
import clsx from 'clsx'
import confetti from 'canvas-confetti'
import { allExercises } from '@/data/index'
import Memory3DVisualizer from '@/components/three/Memory3DVisualizer'
import BitSwitches3D from '@/components/three/BitSwitches3D'
import LinkedList3D from '@/components/three/LinkedList3D'
import StackFrames3DVisualizer from '@/components/three/StackFrames3DVisualizer'
import AlgorithmThinkingGuide from '@/components/exercise/AlgorithmThinkingGuide'
import { PATTERN_ARCHETYPES } from '@/data/exerciseThinkingRegistry'

// ─── 8 Pilares Fundamentales ───────────────────────────────────────────────────
const FUNDAMENTALS_MODULES = [
  {
    id: 'memory-pointers',
    title: '1. Memoria RAM y Punteros',
    subtitle: 'La base física de todo programa en C',
    icon: Box,
    color: 'from-blue-500 to-indigo-600',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    summary: 'La memoria es una hilera de casillas numeradas (direcciones). Una variable guarda un valor; un puntero guarda el número de casilla.',
    analogy: 'Imagina casilleros de correos: cada uno tiene un número de casillero (0x1000) y dentro hay una carta (valor 42). Un puntero es un papelito que dice "mira el casillero 0x1000".',
    keys: [
      { code: 'int x = 42;', desc: 'Crea un casillero para x con el valor 42' },
      { code: 'int *ptr = &x;', desc: '&x obtiene la dirección física del casillero; ptr la guarda' },
      { code: '*ptr = 100;', desc: 'Desreferenciar (*): abre el casillero que apunta ptr y cambia su valor a 100' },
    ],
    interactive3D: 'memory',
    quiz: {
      question: 'Si tenemos "int a = 5; int *p = &a;", ¿qué hace la instrucción "*p = *p + 1;"?',
      options: [
        'Aumenta la dirección de memoria de "a" en 1',
        'Cambia el valor guardado dentro de "a" de 5 a 6',
        'Crea una copia de "a" en el montón',
      ],
      correct: 1,
      explanation: 'El asterisco (*) significa "ve al casillero y accede al valor que contiene". Por tanto, suma 1 al contenido de a (5 + 1 = 6).'
    }
  },
  {
    id: 'strings-null',
    title: '2. Strings y el Carácter Nulo (\\0)',
    subtitle: 'Cómo C sabe cuándo termina un texto',
    icon: Terminal,
    color: 'from-purple-500 to-pink-600',
    tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    summary: 'En C no existen los "strings mágicos". Un string es solo un array de chars continuos que termina obligatoriamente con el byte 0 (\'\\0\').',
    analogy: 'Es como un tren de vagones con letras. El último vagón es un vagón vacío con la luz apagada (\\0). El revisor camina vagón por vagón hasta que ve la luz apagada.',
    keys: [
      { code: 'while (*str != \'\\0\')', desc: 'Avanza mientras el char actual no sea el fin de cadena' },
      { code: 'while (*str)', desc: 'Equivalente y más limpio: en C, \'\\0\' es 0 (falso), cualquier otra letra es verdadero' },
      { code: 'str++', desc: 'Mueve el puntero a la siguiente casilla de memoria (siguiente letra)' },
    ],
    interactive3D: 'memory',
    quiz: {
      question: '¿Por qué al reservar memoria para copiar "hola" con malloc necesitamos 5 bytes y no 4?',
      options: [
        'Por un requisito de alineación de 64 bits en C',
        'Porque "hola" tiene 4 letras más 1 byte obligatorio para el \'\\0\' final',
        'Para guardar el tamaño del string al inicio',
      ],
      correct: 1,
      explanation: 'Sin el \'\\0\', funciones como write o printf no sabrán dónde detenerse y seguirán leyendo basura de la memoria.'
    }
  },
  {
    id: 'bits-bytes',
    title: '3. El Byte y los 8 Interruptores',
    subtitle: 'Operaciones binarias a nivel de hardware',
    icon: Binary,
    color: 'from-emerald-500 to-teal-600',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    summary: 'Un char / uint8_t es un bloque de 8 interruptores (bits). Cada posición vale 2^n: 128, 64, 32, 16, 8, 4, 2, 1.',
    analogy: 'Un panel con 8 interruptores de luz. Encender el primero y el tercero (10100000) representa el número 128 + 32 = 160.',
    keys: [
      { code: 'val << 1', desc: 'Desplaza bits a la izquierda (equivale a multiplicar por 2)' },
      { code: 'val >> 1', desc: 'Desplaza bits a la derecha (equivale a dividir entre 2)' },
      { code: 'val & 1', desc: 'Comprueba si el último bit es 1 (saber si el número es impar)' },
      { code: '(c >> 4) | (c << 4)', desc: 'swap_bits: intercambia los 4 bits altos con los 4 bits bajos' },
    ],
    interactive3D: 'bits',
    quiz: {
      question: '¿Qué resultado produce la operación binaria "(1 << 3)"?',
      options: [
        '3 (en decimal)',
        '8 (porque 2^3 = 8, encendiendo el 4º bit)',
        '13 (en decimal)',
      ],
      correct: 1,
      explanation: 'El bit 1 en posición 0 se mueve 3 posiciones a la izquierda: 1 -> 2 -> 4 -> 8.'
    }
  },
  {
    id: 'linked-lists',
    title: '4. Listas Enlazadas (structs & *next)',
    subtitle: 'Estructuras de datos dinámicas no consecutivas',
    icon: Network,
    color: 'from-amber-500 to-orange-600',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
    summary: 'A diferencia de los arrays, los elementos de una lista no están juntos en memoria. Cada nodo contiene su dato y una dirección (next) que apunta al siguiente.',
    analogy: 'Una búsqueda del tesoro: en cada pista encuentras una moneda (data) y una nota que te dice dónde está la siguiente pista (next). La última nota dice "FIN" (NULL).',
    keys: [
      { code: 'struct s_list { void *data; struct s_list *next; };', desc: 'Declaración canónica del nodo en la escuela 42' },
      { code: 'while (curr != NULL)', desc: 'Recorrer la lista hasta que el puntero apunte al vacío' },
      { code: 'curr = curr->next;', desc: 'Avanzar al siguiente nodo de la cadena' },
    ],
    interactive3D: 'list',
    quiz: {
      question: '¿Qué ocurre si hacemos "curr = curr->next" cuando curr es NULL?',
      options: [
        'El programa vuelve al primer nodo',
        'Retorna 0 de forma segura',
        'Segmentation Fault (Crash: desreferenciación de puntero nulo)',
      ],
      correct: 2,
      explanation: 'Acceder a campos de una dirección NULL (0x0) está prohibido por el sistema operativo y provoca un Segfault inmediato.'
    }
  },
  {
    id: 'ascii-numbers',
    title: '5. El Código ASCII: Las Letras SON Números',
    subtitle: 'Manipulación de caracteres sin tablas mágicas',
    icon: Zap,
    color: 'from-sky-500 to-blue-600',
    tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
    summary: 'En C, el tipo char es simplemente un entero pequeño de 8 bits. \'A\' es el número 65, \'a\' es el número 97 y \'0\' es el número 48.',
    analogy: 'Para convertir un dígito char \'7\' en su valor int 7, solo restas el offset: \'7\' - \'0\' = 55 - 48 = 7.',
    keys: [
      { code: 'c >= \'a\' && c <= \'z\'', desc: 'Detecta si un carácter es letra minúscula' },
      { code: 'c - 32', desc: 'Convierte minúscula a mayúscula (porque \'a\'(97) - 32 = \'A\'(65))' },
      { code: 'c - \'0\'', desc: 'Convierte un char numérico en su entero real para ft_atoi' },
    ],
    interactive3D: 'none',
    quiz: {
      question: '¿Cuál es el valor resultante de la expresión: \'c\' - \'a\'?',
      options: [
        '2 (la distancia en el alfabeto entre a y c)',
        '99',
        'Un carácter de error',
      ],
      correct: 0,
      explanation: '\'c\' es 99 y \'a\' es 97. 99 - 97 = 2. Esta distancia es clave para ejercicios como rot_13 o repeat_alpha.'
    }
  },
  {
    id: 'stack-heap',
    title: '6. Stack vs Heap (Memoria Estática vs Malloc)',
    subtitle: 'El ciclo de vida de las variables',
    icon: Layers,
    color: 'from-red-500 to-rose-600',
    tagColor: 'bg-red-50 text-red-700 border-red-200',
    summary: 'El Stack guarda variables locales automáticamente y las destruye al salir de la función. El Heap es memoria dinámica reservada con malloc() que vive hasta que la liberes con free().',
    analogy: 'Stack = Mesa de trabajo rápida: cuando terminas una tarea, la limpias entera. Heap = Almacén permanente: pides un casillero (malloc), guardas cosas, y cuando ya no lo usas debes devolver la llave (free).',
    keys: [
      { code: 'int tab[10];', desc: 'Stack: reservado automáticamente, muere al salir de la función' },
      { code: 'int *tab = malloc(sizeof(int) * 10);', desc: 'Heap: sobrevive entre funciones hasta que hagas free()' },
      { code: 'free(tab); tab = NULL;', desc: 'Liberar memoria para evitar fugas (memory leaks)' },
    ],
    interactive3D: 'stack',
    quiz: {
      question: '¿Por qué no podemos retornar la dirección de una variable local "int x = 5; return &x;"?',
      options: [
        'Porque el compilador no permite el símbolo & en el return',
        'Porque "x" vive en el Stack y se destruye en cuanto termina la función (dangling pointer)',
        'Porque los punteros siempre deben ser de tipo char*',
      ],
      correct: 1,
      explanation: 'Al salir de la función, la pila (stack frame) se desasigna. Retornar &x apunta a memoria que ya no es válida y causará errores impredecibles.'
    }
  },
  {
    id: 'argc-argv',
    title: '7. El Esqueleto de un Programa (argc, argv & main)',
    subtitle: 'Cómo recibe parámetros un ejecutable',
    icon: Code2,
    color: 'from-amber-600 to-yellow-600',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
    summary: 'En el examen de 42, casi todos los ejercicios de nivel 1 al 3 son programas con main. argc cuenta los argumentos y argv es el array de strings.',
    analogy: 'argc es el número de cajas recibidas. argv[0] es el nombre del programa; argv[1] es el primer parámetro que escribió el usuario.',
    keys: [
      { code: 'if (argc == 2)', desc: 'Comprueba si el usuario pasó exactamente un argumento' },
      { code: 'write(1, "\\n", 1);', desc: 'En 42: si argc no es el esperado, siempre se imprime solo un salto de línea' },
      { code: 'return (0);', desc: 'Indica al sistema operativo que el programa terminó con éxito' },
    ],
    interactive3D: 'none',
    quiz: {
      question: 'Si ejecutas en la terminal "./a.out hello world", ¿cuánto vale "argc" y qué contiene "argv[1]"?',
      options: [
        'argc = 2, argv[1] = "hello world"',
        'argc = 3, argv[1] = "hello"',
        'argc = 3, argv[1] = "./a.out"',
      ],
      correct: 1,
      explanation: 'argv[0] = "./a.out", argv[1] = "hello", argv[2] = "world". Total = 3 argumentos.'
    }
  },
  {
    id: 'flags-state',
    title: '8. Banderas (Flags) y Control de Estados',
    subtitle: 'El truco mental para filtrar y limpiar texto',
    icon: ToggleLeft,
    color: 'from-teal-600 to-cyan-600',
    tagColor: 'bg-teal-50 text-teal-700 border-teal-200',
    summary: 'Una bandera (int flag = 0) es un interruptor mental que recuerda lo que pasó antes mientras recorres un string.',
    analogy: 'Un semáforo: en epur_str / expand_str, enciendes la luz "flag = 1" cuando encuentras un espacio, pero no lo imprimes hasta que veas la siguiente letra.',
    keys: [
      { code: 'int seen[256] = {0};', desc: 'Array de banderas para recordar qué letras ya imprimimos en "inter" o "union"' },
      { code: 'if (!seen[(unsigned char)str[i]])', desc: 'Solo imprime si la bandera de esa letra estaba apagada' },
      { code: 'seen[(unsigned char)str[i]] = 1;', desc: 'Marca la letra como vista para no repetirla jamás' },
    ],
    interactive3D: 'none',
    quiz: {
      question: 'En los ejercicios "inter" o "union", ¿para qué sirve crear un array "int seen[256] = {0}"?',
      options: [
        'Para ordenar los caracteres alfabéticamente',
        'Para saber en tiempo O(1) si un carácter ya fue impreso y evitar duplicados',
        'Para almacenar el string resultante',
      ],
      correct: 1,
      explanation: 'Cada carácter ASCII (0 a 255) tiene su propia casilla. Si vista[c] == 0, se imprime y se pone a 1 para que nunca se repita.'
    }
  },
]

export default function Fundamentos() {
  const [activeTab, setActiveTab] = useState('academia') // 'academia' | 'metodo' | 'laboratorio' | 'quizzes'
  const [selectedModuleId, setSelectedModuleId] = useState(FUNDAMENTALS_MODULES[0].id)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [active3DLab, setActive3DLab] = useState('memory') // 'memory' | 'bits' | 'list' | 'stack'
  const [selectedExerciseExample, setSelectedExerciseExample] = useState('first_word')

  const selectedModule = useMemo(() => {
    return FUNDAMENTALS_MODULES.find((m) => m.id === selectedModuleId) || FUNDAMENTALS_MODULES[0]
  }, [selectedModuleId])

  const targetExercise = useMemo(() => {
    return allExercises.find((e) => e.id === selectedExerciseExample) || allExercises[0]
  }, [selectedExerciseExample])

  const handleQuizAnswer = (moduleId, optionIndex, correctIndex) => {
    const isCorrect = optionIndex === correctIndex
    setQuizAnswers((prev) => ({
      ...prev,
      [moduleId]: { selected: optionIndex, correct: isCorrect }
    }))

    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Didáctico */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-md shrink-0">
            <GraduationCap size={26} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                Academia de Fundamentos
              </h1>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 border border-emerald-200">
                Aprende sin memorizar
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-1 max-w-xl">
              Domina la memoria, punteros, bits y lógica de C mediante modelos 3D interactivos, arquetipos algorítmicos y analogías visuales intuitivas.
            </p>
          </div>
        </div>

        {/* Selector de Modos */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 text-xs font-medium self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('academia')}
            className={clsx(
              'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
              activeTab === 'academia'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            )}
          >
            <BookOpen size={14} />
            <span>Los 8 Pilares</span>
          </button>
          <button
            onClick={() => setActiveTab('metodo')}
            className={clsx(
              'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
              activeTab === 'metodo'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            )}
          >
            <Brain size={14} className="text-indigo-600" />
            <span>Razonamiento &amp; Arquetipos</span>
          </button>
          <button
            onClick={() => setActiveTab('laboratorio')}
            className={clsx(
              'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
              activeTab === 'laboratorio'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            )}
          >
            <Box size={14} />
            <span>Laboratorio 3D</span>
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={clsx(
              'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
              activeTab === 'quizzes'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            )}
          >
            <Trophy size={14} />
            <span>Desafíos &amp; Quizzes</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: ACADEMIA (LOS 8 PILARES) ─────────────────────────────────── */}
      {activeTab === 'academia' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Navegador lateral de módulos */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
              Ruta del Aprendiz al Maestro
            </p>
            <div className="space-y-1.5">
              {FUNDAMENTALS_MODULES.map((mod) => {
                const Icon = mod.icon
                const isSelected = selectedModuleId === mod.id
                const isPassed = quizAnswers[mod.id]?.correct

                return (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left border transition-all duration-150',
                      isSelected
                        ? 'bg-white border-zinc-900 shadow-xs ring-1 ring-zinc-900/5'
                        : 'bg-white/70 border-zinc-200/80 hover:bg-white hover:border-zinc-300'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                        isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={clsx('text-xs font-bold truncate', isSelected ? 'text-zinc-900' : 'text-zinc-700')}>
                          {mod.title}
                        </span>
                        {isPassed && (
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{mod.subtitle}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Panel Principal del Módulo Seleccionado */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              key={selectedModule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Tarjeta de Encabezado y Metáfora */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedModule.tagColor}`}>
                    {selectedModule.subtitle}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Pilar #{selectedModule.title.split('.')[0]}</span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-zinc-900">
                    {selectedModule.title}
                  </h2>
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                    {selectedModule.summary}
                  </p>
                </div>

                {/* Analogía para principiantes */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex gap-3">
                  <span className="text-2xl shrink-0">💡</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Analogía Intuitiva
                    </p>
                    <p className="text-sm text-amber-900 mt-1 leading-relaxed">
                      {selectedModule.analogy}
                    </p>
                  </div>
                </div>

                {/* Patrones de Código Clave */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Sintaxis y Patrones Clave en C
                  </p>
                  <div className="space-y-2">
                    {selectedModule.keys.map((k, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl bg-zinc-900 text-zinc-100 p-3 font-mono text-xs overflow-x-auto"
                      >
                        <code className="text-emerald-400 font-bold whitespace-nowrap">{k.code}</code>
                        <span className="hidden sm:inline text-zinc-500">→</span>
                        <span className="text-zinc-300 font-sans text-xs">{k.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Integración visual 3D según el concepto */}
              {selectedModule.interactive3D === 'memory' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600" />
                    <h3 className="text-sm font-bold text-zinc-800">Interactúa con la Memoria en 3D</h3>
                  </div>
                  <Memory3DVisualizer initialType="string" initialText="42 Madrid" />
                </div>
              )}

              {selectedModule.interactive3D === 'bits' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-600" />
                    <h3 className="text-sm font-bold text-zinc-800">Prueba los 8 Interruptores en 3D</h3>
                  </div>
                  <BitSwitches3D initialValue={42} />
                </div>
              )}

              {selectedModule.interactive3D === 'stack' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-600" />
                    <h3 className="text-sm font-bold text-zinc-800">Visualizador de Stack Frames y Punteros en 3D</h3>
                  </div>
                  <StackFrames3DVisualizer />
                </div>
              )}

              {selectedModule.interactive3D === 'list' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-600" />
                    <h3 className="text-sm font-bold text-zinc-800">El Tren de Nodos en 3D</h3>
                  </div>
                  <LinkedList3D initialValues={[42, 13, 7, 99]} />
                </div>
              )}

              {/* Mini-Quiz del Pilar */}
              {selectedModule.quiz && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-amber-500" />
                    <h3 className="text-sm font-bold text-zinc-800">Comprueba tu Comprensión</h3>
                  </div>

                  <p className="text-sm font-medium text-zinc-900">
                    {selectedModule.quiz.question}
                  </p>

                  <div className="space-y-2">
                    {selectedModule.quiz.options.map((opt, optIdx) => {
                      const answer = quizAnswers[selectedModule.id]
                      const isSelected = answer?.selected === optIdx
                      const isCorrect = selectedModule.quiz.correct === optIdx
                      const showResult = answer !== undefined

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizAnswer(selectedModule.id, optIdx, selectedModule.quiz.correct)}
                          className={clsx(
                            'w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm transition-all',
                            showResult && isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : showResult && isSelected && !isCorrect
                              ? 'bg-red-50 border-red-300 text-red-900'
                              : isSelected
                              ? 'bg-zinc-100 border-zinc-900 font-semibold'
                              : 'bg-white border-zinc-200 hover:bg-zinc-50'
                          )}
                        >
                          <span>{opt}</span>
                          {showResult && isCorrect && <Check size={16} className="text-emerald-600 shrink-0 ml-2" />}
                          {showResult && isSelected && !isCorrect && <X size={16} className="text-red-500 shrink-0 ml-2" />}
                        </button>
                      )
                    })}
                  </div>

                  {quizAnswers[selectedModule.id] && (
                    <div className={clsx(
                      'p-3 rounded-xl text-xs leading-relaxed',
                      quizAnswers[selectedModule.id].correct
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    )}>
                      <strong>Explicación:</strong> {selectedModule.quiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: MÉTODO DE PENSAMIENTO LÓGICO Y ARQUETIPOS ────────────────── */}
      {activeTab === 'metodo' && (
        <div className="space-y-6">
          {/* Selector de Ejercicio de Ejemplo para el Desglose */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                  <Compass size={18} className="text-indigo-600" />
                  Laboratorio de Arquetipos Algorítmicos
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Selecciona cualquier ejercicio canónico del examen para ver cómo se descompone su lógica de resolución:
                </p>
              </div>

              <select
                value={selectedExerciseExample}
                onChange={(e) => setSelectedExerciseExample(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 font-semibold text-xs text-zinc-800 outline-none focus:border-indigo-500"
              >
                {allExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    Nivel {ex.nivel} · {ex.nombre} ({ex.tipoEntrega})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <AlgorithmThinkingGuide exercise={targetExercise} />
        </div>
      )}

      {/* ─── TAB 3: LABORATORIO 3D ────────────────────────────────────────── */}
      {activeTab === 'laboratorio' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActive3DLab('memory')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                active3DLab === 'memory'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              )}
            >
              <Box size={16} />
              <span>Memoria &amp; Punteros 3D</span>
            </button>
            <button
              onClick={() => setActive3DLab('stack')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                active3DLab === 'stack'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              )}
            >
              <Layers size={16} />
              <span>Stack Frames &amp; Funciones 3D</span>
            </button>
            <button
              onClick={() => setActive3DLab('bits')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                active3DLab === 'bits'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              )}
            >
              <Binary size={16} />
              <span>Interruptores de Bits 3D</span>
            </button>
            <button
              onClick={() => setActive3DLab('list')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                active3DLab === 'list'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              )}
            >
              <Network size={16} />
              <span>Listas Enlazadas 3D</span>
            </button>
          </div>

          <div>
            {active3DLab === 'memory' && <Memory3DVisualizer initialType="string" initialText="42 C School" />}
            {active3DLab === 'stack' && <StackFrames3DVisualizer />}
            {active3DLab === 'bits' && <BitSwitches3D initialValue={42} />}
            {active3DLab === 'list' && <LinkedList3D initialValues={[42, 13, 7, 99]} />}
          </div>
        </div>
      )}

      {/* ─── TAB 4: QUIZZES Y DESAFÍOS ─────────────────────────────────────── */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <h3 className="text-lg font-black text-zinc-900">Desafíos Rápidos de Razonamiento</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Pon a prueba tus fundamentos respondiendo cada pregunta. Si aciertas, se celebrará con confeti y quedará marcado como dominado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FUNDAMENTALS_MODULES.map((mod) => (
              <div key={mod.id} className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">{mod.title}</span>
                  {quizAnswers[mod.id]?.correct && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      ¡Acertado!
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-zinc-800">{mod.quiz.question}</p>
                <div className="space-y-1.5">
                  {mod.quiz.options.map((opt, i) => {
                    const ans = quizAnswers[mod.id]
                    const isSelected = ans?.selected === i
                    const isCorrect = mod.quiz.correct === i
                    const answered = ans !== undefined

                    return (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(mod.id, i, mod.quiz.correct)}
                        className={clsx(
                          'w-full p-2.5 rounded-lg border text-left text-xs transition-all',
                          answered && isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : answered && isSelected && !isCorrect
                            ? 'bg-red-50 border-red-300 text-red-900'
                            : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
