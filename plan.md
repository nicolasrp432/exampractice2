# 🎓 Plataforma Interactiva — Examen 42 School
## Plan de Desarrollo Completo

---

## 📌 Visión General

Una plataforma web interactiva en español para preparar el examen de la escuela 42, que combina:
- Teoría visual de cada ejercicio con técnicas mnemotécnicas (estilo Ramón Campayo)
- Práctica activa con simulador en tiempo real (tipo Moulinette)
- GDB paso a paso para entender qué pasa en memoria
- Sistema de progreso y repetición espaciada
- Palacio de la memoria visual con los 30 ejercicios

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | React + Vite | SPA rápida, sin servidor necesario |
| Estilos | Tailwind CSS + CSS Variables | Tema oscuro/claro, tokens de diseño |
| Editor de código | Monaco Editor (VSCode en web) | Syntax highlighting de C, autocompletado |
| Ejecución C en browser | WebAssembly (Emscripten) | Compila y ejecuta C real en el cliente |
| Persistencia | localStorage + IndexedDB | Sin servidor, todo en el cliente |
| Animaciones | Framer Motion | Transiciones fluidas entre módulos |
| Routing | React Router v6 | Navegación entre ejercicios y niveles |
| Estado global | Zustand | Progreso, configuración, notas del usuario |
| i18n | Español nativo | Todo el contenido en español desde el inicio |

---

## 📁 Estructura del Proyecto

```
42-exam-platform/
├── public/
│   ├── favicon.ico
│   └── wasm/                    # Binarios WebAssembly de Emscripten
│       └── c_runner.wasm
│
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Router principal
│   │
│   ├── data/                    # Base de datos de ejercicios
│   │   ├── exercises/
│   │   │   ├── level1/
│   │   │   │   ├── ft_strlen.js
│   │   │   │   ├── ft_swap.js
│   │   │   │   ├── repeat_alpha.js
│   │   │   │   ├── rev_print.js
│   │   │   │   ├── rot_13.js
│   │   │   │   ├── rotone.js
│   │   │   │   ├── first_word.js
│   │   │   │   ├── fizzbuzz.js
│   │   │   │   ├── ft_putstr.js
│   │   │   │   ├── ft_strcpy.js
│   │   │   │   ├── search_and_replace.js
│   │   │   │   └── ulstr.js
│   │   │   ├── level2/
│   │   │   │   ├── alpha_mirror.js
│   │   │   │   ├── camel_to_snake.js
│   │   │   │   ├── do_op.js
│   │   │   │   ├── ft_atoi.js
│   │   │   │   ├── ft_strcmp.js
│   │   │   │   ├── ft_strcspn.js
│   │   │   │   ├── ft_strdup.js
│   │   │   │   ├── ft_strpbrk.js
│   │   │   │   ├── ft_strrev.js
│   │   │   │   ├── inter.js
│   │   │   │   ├── is_power_of_2.js
│   │   │   │   ├── last_word.js
│   │   │   │   ├── max.js
│   │   │   │   ├── print_bits.js
│   │   │   │   ├── reverse_bits.js
│   │   │   │   ├── snake_to_camel.js
│   │   │   │   ├── swap_bits.js
│   │   │   │   ├── union.js
│   │   │   │   └── wdmatch.js
│   │   │   ├── level3/
│   │   │   │   ├── add_prime_sum.js
│   │   │   │   ├── epur_str.js
│   │   │   │   ├── expand_str.js
│   │   │   │   ├── ft_atoi_base.js
│   │   │   │   ├── ft_list_size.js
│   │   │   │   ├── ft_range.js
│   │   │   │   ├── ft_rrange.js
│   │   │   │   ├── hidenp.js
│   │   │   │   ├── lcm.js
│   │   │   │   ├── paramsum.js
│   │   │   │   ├── pgcd.js
│   │   │   │   ├── print_hex.js
│   │   │   │   ├── rstr_capitalizer.js
│   │   │   │   ├── str_capitalizer.js
│   │   │   │   └── tab_mult.js
│   │   │   └── level4/
│   │   │       ├── fprime.js
│   │   │       ├── ft_split.js
│   │   │       └── sort_list.js
│   │   │
│   │   ├── exerciseSchema.js    # Estructura de datos de cada ejercicio
│   │   └── index.js             # Exporta todos los ejercicios
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Dashboard principal con palacio de memoria
│   │   ├── ExerciseDetail.jsx   # Vista completa de un ejercicio
│   │   ├── PracticeMode.jsx     # Modo práctica con editor
│   │   ├── ExamSimulator.jsx    # Simulador del examen real (aleatorio, con tiempo)
│   │   ├── ProgressPage.jsx     # Progreso y estadísticas
│   │   ├── Tools.jsx            # Las 7 herramientas universales
│   │   └── MemoryPalace.jsx     # Palacio de la memoria visual interactivo
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── LevelBadge.jsx
│   │   │
│   │   ├── exercise/
│   │   │   ├── SubjectViewer.jsx        # Muestra el subject como en el terminal
│   │   │   ├── StoryCard.jsx            # Historia mnemotécnica + personaje
│   │   │   ├── FormulaVisualizer.jsx    # Visualización de la fórmula clave
│   │   │   ├── CodeViewer.jsx           # Código con syntax highlighting
│   │   │   ├── VariantSelector.jsx      # Versiones del código (clásica/punteros/compacta)
│   │   │   ├── TrapsList.jsx            # Errores comunes con código rojo/verde
│   │   │   └── AnchorChips.jsx          # Tags de anclaje mnemotécnico
│   │   │
│   │   ├── simulator/
│   │   │   ├── InputPlayground.jsx      # Input interactivo para probar el algoritmo
│   │   │   ├── StepTracer.jsx           # Traza de ejecución paso a paso
│   │   │   ├── BitVisualizer.jsx        # Visualizador de bits (para ejercicios de bits)
│   │   │   ├── StringVisualizer.jsx     # Visualización de chars con índices
│   │   │   └── LinkedListVisualizer.jsx # Visualización de lista enlazada
│   │   │
│   │   ├── gdb/
│   │   │   ├── GdbStepper.jsx          # GDB simulado paso a paso
│   │   │   ├── VariableTable.jsx        # Tabla de variables en cada paso
│   │   │   └── MemoryDiagram.jsx        # Diagrama de RAM simplificado
│   │   │
│   │   ├── practice/
│   │   │   ├── CodeEditor.jsx           # Editor Monaco con C
│   │   │   ├── MoulinetteRunner.jsx     # Corre los tests y muestra resultados
│   │   │   ├── TestCaseList.jsx         # Lista de tests con pass/fail
│   │   │   ├── HintSystem.jsx           # Sistema de pistas progresivas
│   │   │   └── SolutionReveal.jsx       # Revelar solución con explicación
│   │   │
│   │   ├── memory/
│   │   │   ├── PalaceRoom.jsx           # Habitación del palacio (cocina/salón/etc)
│   │   │   ├── CharacterCard.jsx        # Tarjeta de personaje Campayo
│   │   │   ├── FlashCard.jsx            # Flash card para Active Recall
│   │   │   └── SpacedRepetition.jsx     # Cola de repetición espaciada
│   │   │
│   │   └── progress/
│   │       ├── ProgressBar.jsx
│   │       ├── ExerciseStatusGrid.jsx   # Grid de 30 ejercicios con estado
│   │       ├── StreakCounter.jsx
│   │       └── WeakSpotAlert.jsx        # Alerta de ejercicios débiles
│   │
│   ├── hooks/
│   │   ├── useExerciseProgress.js       # Estado de progreso por ejercicio
│   │   ├── useSpacedRepetition.js       # Algoritmo SM-2 simplificado
│   │   ├── useCRunner.js                # Hook para ejecutar C en WASM
│   │   ├── useTimer.js                  # Timer para el simulador de examen
│   │   └── useLocalStorage.js           # Persistencia local
│   │
│   ├── store/
│   │   ├── progressStore.js             # Zustand: progreso global
│   │   ├── settingsStore.js             # Zustand: configuración (tema, idioma)
│   │   └── examStore.js                 # Zustand: estado del simulador de examen
│   │
│   └── utils/
│       ├── cRunner.js                   # Wrapper para ejecutar C con WASM/fallback
│       ├── testRunner.js                # Corre tests contra la solución esperada
│       ├── diffChecker.js               # Compara output byte a byte (como diff)
│       └── asciiUtils.js               # Utilidades ASCII para visualizadores
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🗂️ Schema de Datos — Cada Ejercicio

Cada archivo en `src/data/exercises/levelN/nombre.js` exporta un objeto con esta estructura:

```javascript
export default {
  // ── IDENTIFICACIÓN ──────────────────────────────────────────
  id: "repeat_alpha",
  nombre: "repeat_alpha",
  nivel: 1,
  dificultad: "medio",           // "fácil" | "medio" | "difícil"
  tipoEntrega: "programa",       // "programa" | "función"
  archivosEsperados: ["repeat_alpha.c"],
  funcionesPermitidas: ["write"],

  // ── SUBJECT ─────────────────────────────────────────────────
  subject: `Assignment name  : repeat_alpha
Expected files   : repeat_alpha.c
Allowed functions: write
[...]`,

  // ── DESCRIPCIÓN EN ESPAÑOL ──────────────────────────────────
  descripcion: "Recibe un string y repite cada letra alfabética tantas veces como indica su posición en el abecedario. 'a'→'a', 'b'→'bb', 'z'→26 veces 'z'. Símbolos y números se imprimen 1 vez tal cual.",

  // ── PALACIO DE MEMORIA ──────────────────────────────────────
  palacio: {
    habitacion: "cocina",        // cocina | salón | dormitorio | garaje
    mueble: "ventana",
    personaje: "El Loro Alfa",
    emoji: "🦜",
    historia: "En la cocina vive el Loro Alfa, un loro con un apetito proporcional a su posición en el alfabeto. La 'a' es la primera → come 1 galleta → dice 'a' una vez. La 'b' es la segunda → come 2 galletas → dice 'bb'. Para saber cuántas galletas: su letra menos la 'a', más 1. 'e' - 'a' + 1 = 5. Las mayúsculas usan su propia tabla: 'A' - 'A' + 1 = 1. Los símbolos no son letras → el loro los repite exactamente 1 vez.",
    anclas: [
      "galletas = c - 'a' + 1",
      "mayús = c - 'A' + 1",
      "símbolo = 1 vez",
      "+1 es OBLIGATORIO"
    ]
  },

  // ── HERRAMIENTAS NECESARIAS ──────────────────────────────────
  herramientas: ["strings", "ascii"],  // IDs de las 7 herramientas

  // ── FÓRMULA CLAVE ────────────────────────────────────────────
  formulaClave: {
    descripcion: "Número de repeticiones según posición en abecedario",
    minusculas: "c - 'a' + 1",
    mayusculas: "c - 'A' + 1",
    ejemplo: {
      entrada: "'e'",
      calculo: "101 - 97 + 1 = 5",
      resultado: "eeeee"
    }
  },

  // ── CÓDIGO SOLUCIÓN (múltiples versiones) ────────────────────
  versiones: [
    {
      id: "clasica",
      nombre: "Versión clásica (recomendada)",
      descripcion: "Con función auxiliar ft_putchar_n. La más legible.",
      recomendada: true,
      codigo: `#include <unistd.h>

void ft_putchar_n(char c, int n)
{
  while (n > 0)
  {
    write(1, &c, 1);
    n--;
  }
}

void repeat_alpha(char *str)
{
  while (*str != '\\0')
  {
    if (*str >= 'a' && *str <= 'z')
      ft_putchar_n(*str, *str + 1 - 'a');
    else if (*str >= 'A' && *str <= 'Z')
      ft_putchar_n(*str, *str + 1 - 'A');
    else
      write(1, str, 1);
    ++str;
  }
}

int main(int ac, char **av)
{
  if (ac == 2)
    repeat_alpha(av[1]);
  write(1, "\\n", 1);
  return (0);
}`
    },
    {
      id: "indices",
      nombre: "Versión con índices",
      descripcion: "Usando av[1][i] en vez de puntero. Más familiar para principiantes.",
      recomendada: false,
      codigo: `// ... versión con índices`
    },
    {
      id: "compacta",
      nombre: "Versión compacta",
      descripcion: "Sin función auxiliar, todo inline.",
      recomendada: false,
      codigo: `// ... versión compacta`
    }
  ],

  // ── TESTS (igual que la Moulinette) ─────────────────────────
  tests: [
    {
      id: "test_basic",
      descripcion: "Caso básico abc",
      entrada: ["abc"],
      salida: "abbccc\n",
      tipo: "normal"
    },
    {
      id: "test_mayus",
      descripcion: "Mayúsculas y símbolo",
      entrada: ["Alex."],
      salida: "Alllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx.\n",
      tipo: "normal"
    },
    {
      id: "test_mixto",
      descripcion: "Letras, espacios y números",
      entrada: ["abacadaba 42!"],
      salida: "abbacccaddddabba 42!\n",
      tipo: "normal"
    },
    {
      id: "test_sin_arg",
      descripcion: "Sin argumentos → solo newline",
      entrada: [],
      salida: "\n",
      tipo: "edge"
    },
    {
      id: "test_dos_args",
      descripcion: "Demasiados argumentos → solo newline",
      entrada: ["abc", "def"],
      salida: "\n",
      tipo: "edge"
    },
    {
      id: "test_z",
      descripcion: "Z mayúscula → 26 repeticiones",
      entrada: ["Z"],
      salida: "ZZZZZZZZZZZZZZZZZZZZZZZZZZ\n",
      tipo: "edge"
    },
    {
      id: "test_solo_simbolos",
      descripcion: "Solo símbolos → sin cambio",
      entrada: ["42!"],
      salida: "42!\n",
      tipo: "edge"
    }
  ],

  // ── GDB PASO A PASO ──────────────────────────────────────────
  gdbSteps: [
    {
      paso: 1,
      titulo: "Entrada — ac=2, av[1]='abc'",
      codigo: "(gdb) b repeat_alpha\n(gdb) r \"abc\"\nBreakpoint, repeat_alpha(str=\"abc\")",
      variables: [
        { nombre: "str", valor: '"abc"', cambio: true, nota: "puntero al inicio" },
        { nombre: "*str", valor: "'a' = 97", cambio: true, nota: "primer char" }
      ]
    },
    // ... resto de pasos
  ],

  // ── TRAMPAS Y ERRORES ────────────────────────────────────────
  trampas: [
    {
      severidad: "mortal",
      titulo: "Olvidar el +1",
      descripcion: "Sin +1, 'a' da 0 → el loro no dice nada. 'a' desaparece del output.",
      codigoMal: "ft_putchar_n(*str, *str - 'a');   // 'a' da 0 → desaparece",
      codigoBien: "ft_putchar_n(*str, *str + 1 - 'a'); // 'a' da 1 → correcto"
    },
    {
      severidad: "warning",
      titulo: "Olvidar el else para símbolos",
      descripcion: "Sin else, los símbolos simplemente no se imprimen.",
      codigoMal: "if (...minúscula...) ...\nelse if (...mayúscula...) ...\n// sin else → símbolo ignorado",
      codigoBien: "else\n  write(1, str, 1); // símbolo: 1 vez tal cual"
    },
    {
      severidad: "warning",
      titulo: "Usar = en vez de == en las comparaciones de rango",
      descripcion: "Error clásico de C: asignar en lugar de comparar.",
      codigoMal: "if (*str = 'a' && ...)",
      codigoBien: "if (*str >= 'a' && *str <= 'z')"
    }
  ],

  // ── DESGLOSE ASCII ───────────────────────────────────────────
  desgloseAscii: [
    { char: "a", ascii: 97, formula: "97 - 97 + 1 = 1", resultado: "a" },
    { char: "b", ascii: 98, formula: "98 - 97 + 1 = 2", resultado: "bb" },
    { char: "e", ascii: 101, formula: "101 - 97 + 1 = 5", resultado: "eeeee" },
    { char: "z", ascii: 122, formula: "122 - 97 + 1 = 26", resultado: "zz...z (26)" },
    { char: "A", ascii: 65, formula: "65 - 65 + 1 = 1", resultado: "A" },
    { char: "Z", ascii: 90, formula: "90 - 65 + 1 = 26", resultado: "ZZ...Z (26)" }
  ],

  // ── LO QUE PASA DEBAJO ───────────────────────────────────────
  bajoCelCapot: "Los chars son bytes contiguos en RAM. 'a' vale 97, 'b' vale 98, etc. Al restar 'a' (97) a una letra minúscula obtienes su posición 0-indexed. Sumando 1 lo conviertes a 1-indexed. El bucle ft_putchar_n llama a write() —una syscall al kernel— exactamente N veces sobre el mismo byte. Cada write(1, &c, 1) envía 1 byte al file descriptor 1 (stdout).",

  // ── ESTRATEGIA: ¿MEMORIZAR O ENTENDER? ──────────────────────
  estrategia: "AMBOS",  // "MEMORIZAR" | "ENTENDER" | "AMBOS"
  razonEstrategia: "La fórmula c-'a'+1 hay que saber escribirla de memoria. La lógica (personaje / tipo de carácter / casos) se entiende con la historia.",

  // ── EJERCICIOS RELACIONADOS ──────────────────────────────────
  relacionados: ["rot_13", "rotone", "ulstr", "alpha_mirror"],

  // ── METADATOS DE PROGRESO ────────────────────────────────────
  progreso: {
    estado: "no_iniciado",  // "no_iniciado" | "estudiando" | "practicando" | "dominado"
    intentosMoulinette: 0,
    testsPasados: 0,
    testsTotal: 7,
    ultimaVez: null,
    proximaRepasion: null,  // Calculado por spaced repetition
    notas: ""
  }
}
```

---

## 🖥️ Páginas y Vistas

### 1. Home — Dashboard con Palacio de la Memoria

```
┌─────────────────────────────────────────────────────┐
│  🏠 Tu academia 42  [Progreso general: 12/30 ████░]  │
│                                                      │
│  PALACIO DE LA MEMORIA                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ 🍳 COCINA│ │ 🛋️ SALÓN │ │ 🛏️ DORM. │ │ 🔧 GAR│ │
│  │ Nivel 1  │ │ Nivel 2  │ │ Nivel 3  │ │ Niv. 4│ │
│  │ 10/12 ✓  │ │ 8/14 ... │ │ 3/15 ○   │ │ 0/3 ○ │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│                                                      │
│  PRÓXIMOS A REPASAR (Spaced Repetition)              │
│  [expand_str ⚠️] [search_and_replace ⚠️] [rev_print] │
│                                                      │
│  ACCESO RÁPIDO                                       │
│  [🎯 Examen aleatorio] [📚 Estudiar] [🔧 Herramientas]│
└─────────────────────────────────────────────────────┘
```

### 2. ExerciseDetail — Vista Completa de un Ejercicio

```
┌─────────────────────────────────────────────────────┐
│  ← Nivel 1  │  🦜 repeat_alpha  │  [Practicar →]   │
│─────────────────────────────────────────────────────│
│  [📋 Subject][🦜 Historia][🔢 Fórmula][🎮 Simul.]   │
│  [🔬 GDB][🔀 Variantes][⚙️ Por debajo][🏆 Prueba]   │
│─────────────────────────────────────────────────────│
│                                                      │
│  [CONTENIDO DE LA PESTAÑA ACTIVA]                    │
│                                                      │
│─────────────────────────────────────────────────────│
│  ← Anterior: ft_strlen    Siguiente: rev_print →    │
└─────────────────────────────────────────────────────┘
```

### 3. PracticeMode — Editor + Moulinette

```
┌─────────────────────────────────────────────────────┐
│  🤖 Moulinette Mode — repeat_alpha     [⏱️ 15:00]   │
│─────────────────────────────────────────────────────│
│  ┌──────────────────────┐ ┌───────────────────────┐ │
│  │ // Escribe tu código │ │ TESTS                 │ │
│  │                      │ │ ✓ test_basic     ✓   │ │
│  │ #include <unistd.h>  │ │ ✗ test_mayus     ✗   │ │
│  │                      │ │ ○ test_mixto     ?   │ │
│  │ int main(...)        │ │ ○ test_sin_arg   ?   │ │
│  │ {                    │ │ ○ test_z         ?   │ │
│  │   |                  │ │                       │ │
│  │ }                    │ │ [Ejecutar todos ▶]    │ │
│  └──────────────────────┘ │                       │ │
│  [▶ Compilar] [🧹 Limpiar]│ [💡 Pista] [👁️ Soluc] │ │
│                            └───────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 4. ExamSimulator — Simulador del Examen Real

```
┌─────────────────────────────────────────────────────┐
│  ⏱️ EXAMEN EN CURSO  [Tiempo: 2:34:12]  [Rendir]   │
│─────────────────────────────────────────────────────│
│  Ejercicio actual: [DESCONOCIDO — aleatorio]        │
│                                                      │
│  Assignment name  : ???                             │
│  Expected files   : ???.c                           │
│  Allowed functions: write                           │
│  ─────────────────────────────────────────────────  │
│  [SUBJECT COMPLETO EN VERDE COMO EN EL TERMINAL]   │
│                                                      │
│─────────────────────────────────────────────────────│
│  [EDITOR MONACO — escribe tu solución]              │
│                                                      │
│  [▶ Enviar a Moulinette]  [⏭️ Saltar]               │
└─────────────────────────────────────────────────────┘
```

### 5. MemoryPalace — Palacio de Memoria Interactivo

```
┌─────────────────────────────────────────────────────┐
│  🏠 Palacio de la Memoria                           │
│─────────────────────────────────────────────────────│
│  [Vista: Plano de la casa]                          │
│                                                      │
│        🍳 COCINA              🛋️ SALÓN              │
│    ┌───────────────┐      ┌───────────────┐         │
│    │ 👽 ft_strlen  │      │ 🔁 alpha_mir  │         │
│    │ 🥄 ft_swap    │      │ 🐫 camel_snak │         │
│    │ 🦜 rep_alpha  │      │ ⚖️ ft_strcmp  │         │
│    │ ...           │      │ ...           │         │
│    └───────────────┘      └───────────────┘         │
│                                                      │
│  [Haz clic en cualquier personaje para estudiar]    │
└─────────────────────────────────────────────────────┘
```

### 6. Tools — Las 7 Herramientas Universales

Vista detallada de cada herramienta con:
- Patrones de código
- Ejercicios que la usan
- Decodificador de palabras clave
- Quiz de reconocimiento

---

## 🧠 Módulos de Aprendizaje por Ejercicio

Cada ejercicio tiene 8 pestañas/secciones:

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | 📋 Subject | El enunciado exacto en formato terminal verde |
| 2 | 🦜 Historia | Personaje Campayo + historia absurda + anclas |
| 3 | 🔢 Fórmula | La fórmula o patrón clave visualizado |
| 4 | 🎮 Simulador | Input interactivo + traza de ejecución |
| 5 | 🔬 GDB | Depurador simulado paso a paso con tabla de variables |
| 6 | 🔀 Variantes | 2-3 formas de resolver (clásica / punteros / compacta) |
| 7 | ⚙️ Por debajo | Qué pasa en RAM/CPU/syscalls |
| 8 | 🏆 Pruébate | Editor + Moulinette + sistema de pistas |

---

## 🎮 Modos de Práctica

### Modo 1: Estudio Guiado
- Navega por las 8 secciones de cada ejercicio
- Marca como "aprendido" cuando dominas cada sección
- Sugerencias de repaso automáticas

### Modo 2: Active Recall
- Se muestra solo el subject
- Escribes el código de memoria
- Moulinette evalúa test a test
- Sistema de pistas progresivas (3 niveles: historia → anclas → código parcial)

### Modo 3: Flash Cards
- Tarjeta frontal: nombre del ejercicio
- Tarjeta trasera: historia + fórmula clave
- Algoritmo de repetición espaciada SM-2 simplificado
- Estimación de "próxima sesión"

### Modo 4: Simulador de Examen Real
- Ejercicio aleatorio de cualquier nivel (configurable)
- Timer configurable (3h real, o 30min de práctica)
- Sin pistas disponibles (modo difícil)
- Reporte final con análisis de errores

### Modo 5: Decodificador de Subjects
- Pega cualquier subject
- La plataforma detecta palabras clave
- Sugiere las herramientas necesarias
- Genera el esqueleto del código

### Modo 6: Quiz Relámpago
- 10 preguntas aleatorias sobre herramientas y patrones
- Preguntas tipo: "¿Qué fórmula resuelve este subject?"
- Score y análisis de debilidades

---

## 🤖 Sistema de Ejecución de C

### Opción A: WebAssembly con Emscripten (ideal)
```javascript
// Compila C a WASM en tiempo de build
// En runtime: ejecuta el código del usuario en WASM sandbox
import { createCRunner } from './wasm/c_runner'

const runner = await createCRunner()
const result = await runner.run(userCode, testInput)
// result: { stdout, stderr, exitCode, timing }
```

### Opción B: Fallback — Evaluador JS
Para ejercicios sin complejidad de sistema (sin punteros complejos), se puede reimplementar la lógica en JavaScript como fallback si WASM no está disponible.

### Opción C: Backend mínimo (si se necesita)
Servidor Node.js con `child_process.exec` para compilar y ejecutar C real:
```javascript
// POST /run  { code: string, tests: TestCase[] }
// Response: { results: TestResult[] }
```

---

## 💾 Sistema de Persistencia

```javascript
// progressStore.js — Zustand con persistencia en localStorage
{
  ejercicios: {
    "repeat_alpha": {
      estado: "practicando",
      testsPasados: 5,
      testsTotal: 7,
      intentos: 3,
      ultimaVez: "2025-01-15",
      proximaRepasion: "2025-01-18",
      intervaloDias: 3,
      notas: "Recordar el +1 en la fórmula"
    },
    // ... resto de ejercicios
  },
  racha: 5,           // días consecutivos practicando
  totalSesiones: 12,
  tiempoTotal: 3600,  // segundos
}
```

---

## 🎨 Sistema de Diseño

### Paleta de colores

```css
:root {
  /* Tema oscuro (default) */
  --bg-primary: #0d0d14;
  --bg-secondary: #12121e;
  --bg-card: #1a1a2e;
  --accent-green: #1D9E75;    /* Dominado / correcto */
  --accent-purple: #7F77DD;   /* Historia / memoria */
  --accent-orange: #EF9F27;   /* Medio / en progreso */
  --accent-red: #D85A30;      /* Error / difícil */
  --accent-blue: #185FA5;     /* Info / herramientas */
  --text-primary: #e0e7ff;
  --text-secondary: #8892b0;
  --terminal-green: #c8ffb0;  /* Texto del subject/terminal */

  /* Niveles */
  --level-1: #7F77DD;  /* Cocina — morado */
  --level-2: #1D9E75;  /* Salón — verde */
  --level-3: #EF9F27;  /* Dormitorio — naranja */
  --level-4: #D85A30;  /* Garaje — rojo */
}
```

### Tipografía
- Display/Títulos: `JetBrains Mono` (fuerte presencia técnica)
- Cuerpo: `Inter` o `DM Sans`
- Terminal/código: `JetBrains Mono` o `Fira Code`
- Emojis: Sistema nativo

### Componentes clave
- **Terminal box**: fondo `#1a1a2e`, texto `#c8ffb0`, bordes `#2d2d4e`
- **Story card**: borde izquierdo 3px `#7F77DD`, fondo translúcido
- **Code diff**: verde para correcto, rojo para incorrecto
- **Progress ring**: SVG circular animado por nivel

---

## 📅 Plan de Desarrollo por Fases

### Fase 1 — MVP (2-3 semanas)
**Objetivo**: Plataforma funcional con los ejercicios del Nivel 1

- [ ] Setup del proyecto (Vite + React + Tailwind)
- [ ] Schema de datos definido y todos los ejercicios del Nivel 1 poblados
- [ ] Componente SubjectViewer (terminal verde)
- [ ] Componente StoryCard (historia + anclas)
- [ ] Componente CodeViewer (código con highlighting)
- [ ] Simulador básico (input → output esperado en JS)
- [ ] Sistema de progreso básico (localStorage)
- [ ] Navegación entre ejercicios
- [ ] Home con palacio de memoria simplificado

**Entregable**: Los 12 ejercicios del Nivel 1 completamente documentados y navegables.

### Fase 2 — Práctica Activa (2 semanas)
**Objetivo**: Modo Moulinette funcional

- [ ] Integrar Monaco Editor
- [ ] Sistema de tests con comparación byte a byte
- [ ] Ejecutor de C (WASM o backend mínimo)
- [ ] Sistema de pistas progresivas (3 niveles)
- [ ] Reveal de solución con animación
- [ ] Todos los tests de los 30 ejercicios definidos

**Entregable**: Puedes practicar cualquier ejercicio como si fuera el examen real.

### Fase 3 — Contenido Completo (2-3 semanas)
**Objetivo**: Los 30 ejercicios con toda la documentación

- [ ] Niveles 2, 3 y 4 poblados completamente
- [ ] GDB simulado para todos los ejercicios
- [ ] Variantes de código (clásica/punteros/compacta)
- [ ] Sección "Por debajo" con diagramas de RAM
- [ ] Visualizadores específicos (bits, listas enlazadas, ASCII)

**Entregable**: Plataforma completa con los 30 ejercicios.

### Fase 4 — Herramientas de Memoria (1-2 semanas)
**Objetivo**: Sistema completo de memorización

- [ ] Flash cards con spaced repetition (SM-2)
- [ ] Palacio de la memoria visual interactivo
- [ ] Decodificador de subjects
- [ ] Las 7 herramientas universales con quiz
- [ ] Active Recall mode

**Entregable**: Sistema de memorización completo tipo Anki pero para C.

### Fase 5 — Simulador de Examen (1 semana)
**Objetivo**: Experiencia idéntica al examen real

- [ ] Timer configurable
- [ ] Ejercicios aleatorios por nivel
- [ ] Sin pistas disponibles en modo examen
- [ ] Reporte post-examen con análisis
- [ ] Historial de simulacros

### Fase 6 — Polish y Extras (1 semana)
- [ ] Modo oscuro/claro
- [ ] Animaciones con Framer Motion
- [ ] PWA (instalar en móvil)
- [ ] Export de progreso
- [ ] Modo offline completo

---

## 🏗️ Orden de Implementación Recomendado

```
1. Estructura del proyecto + routing
2. Schema de datos + populate Nivel 1
3. SubjectViewer + StoryCard + CodeViewer
4. Home + navegación básica
5. Simulador JS (sin WASM)
6. Monaco Editor + tests básicos
7. Sistema de progreso (localStorage)
8. Niveles 2, 3, 4
9. GDB simulado
10. Moulinette completa (WASM o backend)
11. Flash cards + spaced repetition
12. Palacio memoria visual
13. Simulador de examen
14. Polish + animaciones
```

---

## 📊 Métricas de Éxito

La plataforma es exitosa cuando el usuario puede:

- [ ] Ver el subject de cualquier ejercicio y recordar la historia en < 5 segundos
- [ ] Escribir el código correcto de los ejercicios "MEMORIZAR" sin pistas
- [ ] Leer un subject nuevo y deducir las herramientas necesarias sin haber visto el ejercicio
- [ ] Pasar el 80%+ de los tests de la Moulinette en el primer intento
- [ ] Completar un simulacro de examen con nivel 1 y 2 correctos

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build producción
npm run build

# Preview del build
npm run preview

# Compilar WASM (requiere Emscripten instalado)
npm run build:wasm

# Tests de los ejercicios
npm run test:exercises
```

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "zustand": "^4.x",
    "framer-motion": "^10.x",
    "@monaco-editor/react": "^4.x",
    "tailwindcss": "^3.x",
    "clsx": "^2.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

---

## 📝 Notas Importantes

### Sobre la ejecución de C
La parte más compleja es ejecutar código C real en el browser. Las opciones en orden de complejidad:
1. **Reimplementar en JS** cada ejercicio (rápido de hacer, limitado)
2. **Backend Node.js con child_process** (requiere servidor, pero funciona siempre)
3. **WASM con Emscripten** (el ideal, funciona offline, más complejo de setup)

Para el MVP se recomienda empezar con la opción 1 (JS) para los ejercicios más simples e ir añadiendo WASM progresivamente.

### Sobre el contenido
Todo el contenido (historias, descripciones, fórmulas, GDB) ha sido desarrollado en sesiones previas de estudio. El plan.md incluye el schema para estructurarlo, pero el contenido ya existe y necesita trasladarse al formato de datos.

### Sobre la Moulinette
La comparación debe ser byte a byte, exactamente como `diff`. Un espacio extra al final del output = test fallado. Esto es crítico para expand_str, epur_str y cualquier ejercicio con formato de output específico.

---

*Plan creado a partir de las sesiones de estudio con técnicas Campayo + Palacio de Memoria + Active Recall. Todos los ejercicios, historias y patrones documentados en las sesiones previas son el contenido base de esta plataforma.*
