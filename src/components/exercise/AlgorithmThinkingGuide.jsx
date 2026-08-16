import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Lightbulb, ArrowRight, CheckCircle2, ShieldAlert,
  Code2, Compass, Eye, Sparkles, HelpCircle, ChevronDown,
  ChevronUp, Check, X, RefreshCw, Terminal, Layers, Box
} from 'lucide-react'
import clsx from 'clsx'
import confetti from 'canvas-confetti'

// Generador de deducción lógica para cualquier ejercicio de 42
function getExerciseThinkingBlueprint(exercise) {
  const id = exercise?.id || ''
  const isProgram = exercise?.tipoEntrega === 'programa'
  const isList = id.includes('list') || id.includes('sort_list')
  const isBits = id.includes('bit') || id === 'is_power_of_2' || id === 'max'
  const isMath = id === 'fprime' || id === 'pgcd' || id === 'lcm' || id === 'add_prime_sum' || id === 'hidenp'
  const isAlloc = id === 'ft_split' || id === 'ft_range' || id === 'ft_rrange' || id === 'ft_strdup'

  let analogy = 'Imagina que eres un revisor de tren que camina vagón por vagón con una linterna.'
  let inputOutput = {
    input: isProgram ? 'Argumentos de terminal (argc, argv[1])' : 'Punteros o enteros en parámetros',
    output: isProgram ? 'Impresión en pantalla con write() + salto de línea \\n' : 'Retorno de valor o modificación en memoria',
    goldenRule: isProgram ? 'Si argc != 2 (o esperado), write(1, "\\n", 1) y terminar inmediatamente.' : 'Verificar punteros != NULL antes de desreferenciar.',
  }

  let mentalSteps = [
    {
      num: 1,
      title: 'El Guardián en la Puerta (Filtro inicial)',
      desc: isProgram
        ? 'Lo primero que hace tu cerebro: "¿Me dieron exactamente el número de argumentos que pedí?". Si no, imprime "\\n" y adiós.'
        : 'Pregúntate: "¿El puntero que me pasaron es NULL o la lista está vacía?". Si es así, sal de inmediato sin tocar nada.',
      cCode: isProgram ? 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}' : 'if (!ptr)\n    return (NULL);',
    },
    {
      num: 2,
      title: 'Poner el dedo en el inicio (El Puntero / Índice)',
      desc: 'Coloca tu dedo en el primer elemento. En C esto es "int i = 0" o un puntero "char *str = argv[1]".',
      cCode: 'int i = 0;\n// O puntero directo:\nchar *s = argv[1];',
    },
    {
      num: 3,
      title: 'El Bucle del Vigilante (Caminar hasta el final)',
      desc: '¿Cuándo te detienes? Cuando el dedo toque el centinela (en strings el byte \'\\0\', en listas NULL).',
      cCode: isList ? 'while (curr != NULL) {\n    // acción\n    curr = curr->next;\n}' : 'while (str[i] != \'\\0\') {\n    // acción\n    i++;\n}',
    },
    {
      num: 4,
      title: 'La Decisión en cada casilla (if / else)',
      desc: 'En cada paso te preguntas: ¿Es una letra? ¿Es un espacio? ¿Debo transformarlo, imprimirlo o contarlo?',
      cCode: 'if (str[i] >= \'a\' && str[i] <= \'z\')\n    str[i] -= 32; // pasar a mayúscula',
    },
    {
      num: 5,
      title: 'El Cierre Elegante',
      desc: isProgram ? 'Al salir del bucle, imprime el salto de línea obligatorio y retorna 0.' : 'Retorna el resultado calculado o el puntero resultante.',
      cCode: isProgram ? 'write(1, "\\n", 1);\nreturn (0);' : 'return (resultado);',
    }
  ]

  // Analogías temáticas específicas
  if (id === 'first_word' || id === 'last_word') {
    analogy = id === 'first_word'
      ? 'Imagina una cinta transportadora: saltas todas las cajas vacías (espacios/tabs) hasta ver la primera palabra con letras; luego imprimes las letras una a una hasta que vuelva a haber un espacio o se acabe la cinta.'
      : 'Caminas hasta el final de la cuerda (el \\0) y luego retrocedes con el dedo saltando espacios hasta encontrar la última letra. Desde ahí buscas dónde empieza esa palabra y la imprimes hacia adelante.'
  } else if (id === 'rot_13' || id === 'rotone' || id === 'repeat_alpha') {
    analogy = id === 'repeat_alpha'
      ? 'Cada letra tiene un valor de repetición: la \'a\' se imprime 1 vez, la \'b\' 2 veces, la \'c\' 3 veces... Calculas cuántas veces repites haciendo (letra - \'a\' + 1).'
      : 'Una rueda de cifrado césar: si ves una letra, la adelantas N posiciones en el abecedario. Si se pasa de la \'z\', da la vuelta y vuelve a empezar en la \'a\'.'
  } else if (id === 'inter' || id === 'union') {
    analogy = 'Una libreta con 256 casillas marcadas del 0 al 255 (una por cada carácter ASCII posible). Cuando ves un carácter por primera vez, marcas su casilla con un tick para no volver a imprimirlo jamás aunque se repita.'
  } else if (id === 'wdmatch') {
    analogy = 'Dos personas caminando: la primera tiene un cartel con una palabra y la segunda un texto largo. La segunda busca la primera letra del cartel; cuando la encuentra, busca la segunda letra más adelante, y así sucesivamente en orden.'
  } else if (id === 'epur_str' || id === 'expand_str') {
    analogy = 'Un aspirador de polvo que limpia espacios duplicados: cada vez que pasa de una palabra a otra, inserta un único espacio (o 3 en expand_str) entre ellas, sin dejar nunca espacios al principio ni al final.'
  } else if (id === 'ft_split') {
    analogy = 'Una tijera que corta una cuerda cada vez que encuentra un nudo (espacio). Primero cuenta cuántos trozos saldrán, luego reserva la memoria para la caja grande y después mete cada trozo recortado.'
  } else if (id === 'fprime') {
    analogy = 'Un saco de números que vas dividiendo por el divisor más pequeño posible (empezando en 2). Cada vez que divide exacto, imprimes el divisor y reduces el saco.'
  } else if (id === 'ft_atoi' || id === 'ft_itoa') {
    analogy = id === 'ft_atoi'
      ? 'Un escáner numérico: salta espacios, anota si hay un signo menos (-) y acumula cada dígito multiplicando el acumulado anterior por 10 y sumando el nuevo dígito.'
      : 'Convierte un número a texto: extrae los dígitos de atrás hacia adelante con el módulo % 10 y división / 10, y colócalos en un string reservado con malloc.'
  } else if (isBits) {
    analogy = 'Un tablero con 8 bombillas eléctricas alineadas (1 byte = 8 bits). Para leerlas o cambiarlas, miras una a una usando una máscara binaria (1 << i) o las desplazas hacia la izquierda/derecha (>>, <<).'
  } else if (isList) {
    analogy = 'Un tren de vagones unidos por enganches (next). Nunca puedes saltar al vagón 4 sin haber caminado por el 1, 2 y 3. Para intercambiar o borrar, reenganchas los eslabones con cuidado de no perder la referencia.'
  }

  const dictionary = [
    { human: 'Mirar qué letra hay aquí', c: 'str[i]  ó  *str', note: 'Accede al valor de la casilla actual' },
    { human: 'Avanzar el dedo al siguiente', c: 'i++  ó  str++', note: 'Mueve la posición a la siguiente casilla' },
    { human: 'Saltar espacios y tabuladores', c: 'while (str[i] == \' \' || str[i] == \'\\t\') i++;', note: 'Avanza mientras sea espacio' },
    { human: 'Comprobar si el texto terminó', c: 'str[i] == \'\\0\'  ó  !str[i]', note: 'El byte nulo marca el final de la cadena' },
    { human: 'Escribir un carácter en pantalla', c: 'write(1, &str[i], 1);', note: 'write requiere la dirección de memoria (&)' },
    { human: 'Convertir char numérico a int', c: 'int val = c - \'0\';', note: 'Resta el código ASCII de \'0\' (48)' },
  ]

  const fatalTraps = [
    {
      name: 'Segmentation Fault (Crash por NULL)',
      cause: 'Intentar leer o escribir en una dirección que apunta a la nada (NULL) o salirte del array.',
      cure: 'Pregunta siempre "if (!str) return;" antes de entrar a un bucle.',
    },
    {
      name: 'Bucle Infinito (El programa se congela)',
      cause: 'Olvidar poner "i++" o "str++" dentro del cuerpo del while.',
      cure: 'Asegúrate de que en cada vuelta del bucle el puntero o índice avance hacia la salida.',
    },
    {
      name: 'Olvido del Salto de Línea (\\n)',
      cause: 'En 42, si el enunciado pide programa con main y no imprimes "\\n", la Moulinette da 0/100.',
      cure: 'Coloca siempre "write(1, "\\n", 1);" justo antes del return 0.',
    },
  ]

  return { analogy, inputOutput, mentalSteps, dictionary, fatalTraps }
}

export default function AlgorithmThinkingGuide({ exercise }) {
  const [activeStep, setActiveStep] = useState(1)
  const [quizAnswered, setQuizAnswered] = useState(null)
  const blueprint = getExerciseThinkingBlueprint(exercise)

  const handleQuiz = (isCorrect) => {
    setQuizAnswered(isCorrect)
    if (isCorrect) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } })
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner Principal: El Método Mental */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
            <Brain size={22} className="text-indigo-200" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-zinc-900">
                El Método de Razonamiento Lógico
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                Para Todos los Niveles
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Programar en C no es memorizar líneas de código. Es aprender a ver la película en tu mente, trazar los pasos con el dedo y luego traducir cada pensamiento a la sintaxis del lenguaje.
            </p>
          </div>
        </div>

        {/* Metáfora Cotidiana del Ejercicio */}
        <div className="mt-4 rounded-xl border border-indigo-200/80 bg-white/90 p-4 flex items-start gap-3 shadow-xs">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Analogía de la Vida Real para {exercise?.nombre || 'este ejercicio'}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-700 mt-1 leading-relaxed">
              {blueprint.analogy}
            </p>
          </div>
        </div>
      </div>

      {/* 1. La Caja Negra: Entrada y Salida */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Box size={18} className="text-emerald-600" />
          <h4 className="font-bold text-sm text-zinc-900">Paso 1: Delimitar la Caja Negra (Entrada vs Salida)</h4>
        </div>
        <p className="text-xs text-zinc-500">
          Antes de escribir una sola letra, ten 100% claro qué entra al programa y qué debe salir:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">¿Qué entra?</span>
            <p className="font-medium text-zinc-800">{blueprint.inputOutput.input}</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">¿Qué debe salir?</span>
            <p className="font-medium text-zinc-800">{blueprint.inputOutput.output}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Regla de Oro</span>
            <p className="font-medium text-amber-900">{blueprint.inputOutput.goldenRule}</p>
          </div>
        </div>
      </div>

      {/* 2. La Escalera de Pensamiento Paso a Paso (5 Pasos) */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-indigo-600" />
            <h4 className="font-bold text-sm text-zinc-900">Paso 2: La Traza Mental en 5 Movimientos</h4>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Paso {activeStep} de 5</span>
        </div>

        {/* Botones de pasos */}
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
              <span className={clsx('h-4 w-4 rounded-full flex items-center justify-center text-[10px]', activeStep === s.num ? 'bg-indigo-400 text-zinc-900 font-black' : 'bg-zinc-300 text-zinc-700')}>
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
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-bold">
                  Movimiento {stepData.num}
                </span>
                <h5 className="font-bold text-sm text-zinc-900">{stepData.title}</h5>
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {stepData.desc}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Traducción a C:</span>
                <pre className="p-3 rounded-lg bg-zinc-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                  {stepData.cCode}
                </pre>
              </div>
            </div>
          )
        })()}
      </div>

      {/* 3. Diccionario Español -> C */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-purple-600" />
          <h4 className="font-bold text-sm text-zinc-900">Diccionario Mental: De Español Simple a Código C</h4>
        </div>
        <p className="text-xs text-zinc-500">
          Usa esta tabla de conversión mental cuando no sepas cómo escribir lo que estás pensando:
        </p>

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

      {/* 4. Las 3 Trampas Fatales */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-red-500" />
          <h4 className="font-bold text-sm text-zinc-900">Las 3 Trampas que te Dan 0/100 (y cómo evitarlas)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {blueprint.fatalTraps.map((trap, i) => (
            <div key={i} className="p-3 rounded-xl border border-red-100 bg-red-50/40 space-y-2 text-xs">
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
    </div>
  )
}
