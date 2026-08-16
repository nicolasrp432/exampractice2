# CONTEXTO COMPLETO — Plataforma 42 Exam Prep
## Lee este archivo COMPLETO antes de generar cualquier código

---

## 🎯 ¿Qué es este proyecto?

Una plataforma web interactiva en **español** para preparar el examen de la **escuela 42** (programación en C). El usuario ya tiene un sistema de estudio desarrollado con un tutor AI que combina:

1. **Palacio de la memoria** (habitaciones por nivel)
2. **Técnica Campayo** (historias absurdas con personajes)
3. **Active Recall** (practicar sin ver la solución)
4. **Simulador Moulinette** (mismo evaluador que usa la escuela 42)
5. **GDB paso a paso** (entender qué pasa en memoria)

La plataforma debe replicar y potenciar exactamente este sistema.

---

## 🏗️ Stack OBLIGATORIO

```
React 18 + Vite 5
Tailwind CSS 3
React Router v6
Zustand (estado global)
Framer Motion (animaciones)
Monaco Editor (@monaco-editor/react)
```

## 🎨 TEMA: LIGHT (no dark)

**Estilo**: Moderno, limpio, educativo. Inspiración: Linear.app + Notion + un toque académico.

**Paleta de colores** (light mode):
```css
--bg-primary: #FAFAFA
--bg-secondary: #F4F4F5
--bg-card: #FFFFFF
--border: #E4E4E7
--text-primary: #18181B
--text-secondary: #71717A
--text-tertiary: #A1A1AA

/* Acentos por nivel/estado */
--accent-green: #16A34A      /* Dominado, correcto */
--accent-purple: #7C3AED     /* Historia/memoria */
--accent-orange: #EA580C     /* En progreso, medio */
--accent-red: #DC2626        /* Error, difícil */
--accent-blue: #2563EB       /* Info, herramientas */

/* Niveles */
--level-1: #7C3AED    /* Nivel 1 - cocina */
--level-2: #16A34A    /* Nivel 2 - salón */
--level-3: #EA580C    /* Nivel 3 - dormitorio */
--level-4: #DC2626    /* Nivel 4 - garaje */

/* Terminal (subject) */
--terminal-bg: #1E1E2E
--terminal-text: #A6E3A1
```

---

## 📚 Los 30 ejercicios del examen

### NIVEL 1 — Cocina (12 ejercicios)
| ID | Personaje Campayo | Emoji | Dificultad |
|----|-------------------|-------|------------|
| ft_strlen | El Alien Elástico | 👽 | fácil |
| ft_swap | El Sapo Mago con varita-estrella | 🧙 | fácil |
| ft_putstr | La Tele que grita letras | 📺 | fácil |
| ft_strcpy | La Fotocopiadora de recetas | 🖨️ | fácil |
| fizzbuzz | El Microondas que cuenta mal | 🎯 | fácil |
| first_word | El Cuchillo que corta la primera palabra | 🔪 | fácil |
| rev_print | El Reverendo haciendo Moonwalk | 🕺 | fácil |
| rotone | El Ratón gigante y el teletransporte | 🐀 | fácil |
| rot_13 | La Habitación 13 y el Rótulo Roto | 🔐 | medio |
| repeat_alpha | El Loro Alfa glotón | 🦜 | medio |
| search_and_replace | El Ninja Reemplazador | 🥷 | medio |
| ulstr | Ultrón igualador de tamaños | 🔄 | fácil |

### NIVEL 2 — Salón (14 ejercicios)
| ID | Personaje | Emoji | Dificultad |
|----|-----------|-------|------------|
| alpha_mirror | El Espejo del abecedario | 🔁 | medio |
| camel_to_snake | El Camello que tropieza | 🐫 | medio |
| do_op | La Calculadora de la mesita | 🧮 | fácil |
| ft_atoi | El Traductor de números | 🔢 | medio |
| ft_strcmp | La Balanza de strings | ⚖️ | fácil |
| ft_strcspn | El Guardia de la barricada | 🚧 | medio |
| ft_strdup | La Clonadora de strings | 🧬 | medio |
| ft_strpbrk | El Pescador de caracteres | 🎣 | difícil |
| ft_strrev | El Sofá que se da la vuelta | ↩️ | medio |
| inter | El Detective de la intersección | 🔍 | difícil |
| is_power_of_2 | La Lámpara de potencias | ⚡ | fácil |
| last_word | La Bandera de la última palabra | 🏁 | medio |
| print_bits | El Príncipe Bits y su corona | 👑 | medio |
| reverse_bits | El Mando que invierte canales | 🔀 | difícil |
| swap_bits | El Intercambiador de mitades | 🔄 | medio |
| union | El Banco con 256 cajas fuertes | 🏦 | difícil |
| wdmatch | El Detective de subsecuencias | 🕵️ | medio |

### NIVEL 3 — Dormitorio (15 ejercicios)
| ID | Personaje | Emoji | Dificultad |
|----|-----------|-------|------------|
| paramsum | El Contador de almohadas | 🔢 | fácil |
| tab_mult | El Póster de la tabla | 📋 | fácil |
| epur_str | El Acordeón de 1 nota | 🎹 | medio |
| expand_str | El Acordeón de 3 notas | 📐 | fácil |
| add_prime_sum | El Microscopio de primos | 🔬 | medio |
| ft_range | La Escalera de la litera (subir) | 🪜 | medio |
| ft_rrange | La Escalera al revés (bajar) | 🪜 | medio |
| ft_list_size | La Cadena de la bicicleta | 🔗 | medio |
| hidenp | La Lupa del detective | 🔎 | medio |
| lcm | El Engranaje del reloj | ⚙️ | medio |
| pgcd | Las Tijeras de Euclides | ✂️ | medio |
| print_hex | La Paleta de colores hex | 🎨 | medio |
| ft_atoi_base | El Diccionario de bases | 🔡 | difícil |
| str_capitalizer | El Sombrero mágico | 🎩 | medio |
| rstr_capitalizer | La Bandera de la última letra | 🏁 | difícil |

### NIVEL 4 — Garaje (3 ejercicios)
| ID | Personaje | Emoji | Dificultad |
|----|-----------|-------|------------|
| fprime | La Fresadora industrial | 🔩 | difícil |
| ft_split | La Guillotina de salchichón | ✂️ | difícil |
| sort_list | El Robot clasificador de piezas | 🤖 | difícil |

---

## 🏠 Palacio de la Memoria — Las 4 Habitaciones

```
COCINA    = Nivel 1  (color: #7C3AED)
SALÓN     = Nivel 2  (color: #16A34A)
DORMITORIO = Nivel 3 (color: #EA580C)
GARAJE    = Nivel 4  (color: #DC2626)
```

---

## 🔧 Las 7 Herramientas Universales

Estas herramientas son los **patrones base** que cubren el 100% de los ejercicios:

1. **Recorrer strings** — `while(str[i])` + `write(1, &str[i], 1)` → 25/30 ejercicios
2. **Aritmética ASCII** — `±32`, `c-'a'+1`, `c-'0'` → 18/30 ejercicios
3. **write + argc/argv** — esqueleto de todo programa → 28/30 ejercicios
4. **Bandera de estado (k)** — para espacios/duplicados/flags → 10/30 ejercicios
5. **Recursión** — `ft_putnbr`, listas, bases → 8/30 ejercicios
6. **Bits** — `>>`, `<<`, `&`, `|`, `%2`, `/2` → 5/30 ejercicios
7. **malloc + memoria** — `sizeof`, `len+1`, `NULL` final → 8/30 ejercicios

---

## 📐 Schema de Datos de cada Ejercicio

Cada ejercicio en `src/data/exercises/levelN/nombre.js` sigue este schema:

```javascript
export default {
  id: "string",
  nombre: "string",
  nivel: 1 | 2 | 3 | 4,
  dificultad: "fácil" | "medio" | "difícil",
  tipoEntrega: "programa" | "función",
  archivosEsperados: ["archivo.c"],
  funcionesPermitidas: ["write", "malloc", ...],

  subject: "string", // El enunciado exacto en inglés

  descripcion: "string", // Descripción en español de qué hace

  palacio: {
    habitacion: "cocina" | "salón" | "dormitorio" | "garaje",
    mueble: "string",
    personaje: "string",
    emoji: "string",
    historia: "string", // La historia absurda tipo Campayo
    anclas: ["string"]  // Las 3-5 anclas clave para memorizar
  },

  herramientas: ["strings", "ascii", "argc", "bandera", "recursion", "bits", "malloc"],

  formulaClave: {
    descripcion: "string",
    formula: "string",       // La fórmula principal
    ejemplo: { entrada, calculo, resultado }
  },

  versiones: [
    {
      id: "clasica",
      nombre: "string",
      descripcion: "string",
      recomendada: boolean,
      codigo: "string"
    }
  ],

  tests: [
    {
      id: "string",
      descripcion: "string",
      entrada: ["arg1", "arg2"], // o [] si no hay args
      salida: "string",           // output esperado EXACTO (con \n)
      tipo: "normal" | "edge"
    }
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: "string",
      codigo: "string",  // Lo que mostraría GDB
      variables: [{ nombre, valor, cambio, nota }]
    }
  ],

  trampas: [
    {
      severidad: "mortal" | "warning",
      titulo: "string",
      descripcion: "string",
      codigoMal: "string",
      codigoBien: "string"
    }
  ],

  bajoCelCapot: "string", // Qué pasa en RAM/CPU/syscalls

  estrategia: "MEMORIZAR" | "ENTENDER" | "AMBOS",
  razonEstrategia: "string",

  relacionados: ["id1", "id2"], // IDs de ejercicios similares

  progreso: {
    estado: "no_iniciado" | "estudiando" | "practicando" | "dominado",
    testsPasados: 0,
    testsTotal: 0,
    intentos: 0,
    ultimaVez: null,
    proximaRepasion: null,
    intervaloDias: 1,
    notas: ""
  }
}
```

---

## 🖥️ Estructura de Páginas

```
/ (Home)
  ├── Dashboard con palacio de memoria visual
  ├── Estado de los 30 ejercicios
  ├── Próximos a repasar (spaced repetition)
  └── Accesos rápidos

/ejercicios/:nivel
  ├── Grid de ejercicios del nivel
  └── Filtros por dificultad/estado

/ejercicio/:id
  ├── Tab: Subject (terminal verde)
  ├── Tab: Historia (personaje + story + anclas)
  ├── Tab: Fórmula (visualización interactiva)
  ├── Tab: Simulador (input → output en tiempo real)
  ├── Tab: GDB (paso a paso)
  ├── Tab: Variantes (3 formas de resolver)
  ├── Tab: Por debajo (RAM/CPU)
  └── Tab: Pruébate (editor + Moulinette)

/practicar/:id
  ├── Editor Monaco (C)
  ├── Moulinette (tests en tiempo real)
  ├── Sistema de pistas (3 niveles)
  └── Reveal de solución

/examen
  ├── Timer configurable
  ├── Ejercicio aleatorio por nivel
  ├── Sin pistas (modo examen)
  └── Reporte final

/herramientas
  ├── Las 7 herramientas universales
  ├── Decodificador de subjects
  └── Quiz relámpago

/progreso
  ├── Estadísticas globales
  ├── Racha de días
  └── Ejercicios débiles

/palacio
  └── Mapa visual del palacio con los 30 ejercicios
```

---

## 🧩 Componentes Principales

### Layout
- `Sidebar` — Navegación lateral con los 4 niveles
- `Header` — Breadcrumb + progress global
- `LevelBadge` — Badge de color por nivel

### Ejercicio
- `SubjectViewer` — Terminal verde con el subject exacto
- `StoryCard` — Historia + personaje + anclas mnemotécnicas
- `FormulaVisualizer` — Fórmula clave animada/interactiva
- `CodeViewer` — Código con syntax highlighting de C
- `VariantSelector` — Switch entre versiones del código
- `TrapsList` — Lista de errores con código rojo/verde
- `AnchorChips` — Pills de las anclas de memoria

### Simulador
- `InputPlayground` — Input del usuario + output esperado vs real
- `StepTracer` — Traza de ejecución paso a paso (como las tarjetas del widget)
- `BitVisualizer` — Para ejercicios de bits (print_bits, reverse_bits)
- `StringVisualizer` — Chars con índices, colores por tipo
- `FlagVisualizer` — Para ejercicios con bandera k (epur_str, expand_str)

### GDB
- `GdbStepper` — Terminal oscuro con pasos de GDB
- `VariableTable` — Tabla de variables en cada paso
- `MemoryNote` — Nota sobre qué pasa en RAM

### Práctica
- `CodeEditor` — Monaco Editor configurado para C
- `MoulinetteRunner` — Ejecuta tests y muestra ✓/✗
- `TestCaseList` — Lista de tests con estado
- `HintSystem` — Pistas progresivas (historia → anclas → código parcial)
- `SolutionReveal` — Revela la solución animada

### Memoria
- `PalaceMap` — SVG interactivo del palacio
- `PalaceRoom` — Vista de una habitación con sus personajes
- `CharacterCard` — Tarjeta de personaje con flip animation
- `FlashCard` — Tarjeta con anverso/reverso para Active Recall

### Progreso
- `ProgressRing` — Anillo de progreso SVG por nivel
- `ExerciseStatusGrid` — Grid 4×8 con estado de los 30 ejercicios
- `StreakBadge` — Racha de días
- `WeakSpotCard` — Ejercicios que necesitan repaso

---

## 💾 Estado Global (Zustand)

```javascript
// progressStore
{
  ejercicios: { [id]: { estado, testsPasados, intentos, ultimaVez, proximaRepasion, intervaloDias, notas } },
  racha: number,
  totalSesiones: number,
  ultimaSesion: date,
  actions: { marcarEstado, registrarIntento, actualizarNotas, calcularRepasion }
}

// settingsStore
{
  tema: "light",
  idioma: "es",
  timerExamen: 180, // minutos
  nivelesExamen: [1, 2, 3, 4], // niveles a incluir en examen aleatorio
  mostrarPistas: true,
  autoReveal: false
}

// examStore
{
  activo: boolean,
  ejercicioActual: string | null,
  tiempoRestante: number,
  resultados: [{ id, pasado, tiempo }],
  actions: { iniciar, pausar, terminar, enviarEjercicio }
}
```

---

## 🎨 Patrones de UI Clave

### Terminal del Subject
```html
<div class="font-mono text-sm bg-[#1E1E2E] text-[#A6E3A1] 
            rounded-xl p-4 leading-relaxed whitespace-pre overflow-x-auto
            border border-[#313244]">
  {subject}
</div>
```

### Story Card
```html
<div class="border-l-4 border-purple-500 bg-purple-50 
            rounded-r-xl px-4 py-3 text-sm leading-relaxed">
  {historia}
</div>
```

### Badge de nivel
```html
<span class="text-xs font-semibold px-2 py-0.5 rounded-full
             bg-purple-100 text-purple-700">  <!-- Nivel 1 -->
  Nivel 1
</span>
```

### Estado del ejercicio
```html
<!-- Dominado -->
<div class="bg-green-50 border border-green-200 rounded-lg p-3 ...">
<!-- Practicando -->
<div class="bg-orange-50 border border-orange-200 rounded-lg p-3 ...">
<!-- No iniciado -->
<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 ...">
```

---

## 📋 Consideraciones Importantes

### Sobre la Moulinette (tests)
La comparación DEBE ser byte a byte. Un espacio extra al final = test fallado.
Especialmente crítico para: `epur_str`, `expand_str`, `tab_mult`, `fizzbuzz`.

### Sobre ejecución de C
Para el MVP, implementar la lógica de cada ejercicio en JavaScript como fallback.
Después integrar Monaco Editor + un backend Node.js simple para compilar C real.

### Sobre el contenido en español
- Todos los textos de UI en español
- Los subjects se mantienen en inglés (como en el examen real)
- Las historias, descripciones y explicaciones en español

### Sobre los personajes Campayo
El usuario tiene estos personajes ya memorizados de sesiones previas. La plataforma debe usar exactamente los mismos nombres/emojis para no crear confusión.

### Sobre expand_str y epur_str
Estos son los ejercicios que le costaron el 50/100 en el examen real al usuario. Necesitan atención especial con el simulador de la bandera k.

---

## 🚀 Orden de Implementación para el Agente

1. Setup proyecto (Vite + React + Tailwind + Router + Zustand)
2. Layout base (Sidebar + Header)
3. Sistema de datos (schema + los 12 ejercicios del Nivel 1)
4. Home page con palacio de memoria
5. ExerciseDetail page con las 8 tabs
6. Componentes de visualización (StoryCard, SubjectViewer, CodeViewer)
7. Simulador básico en JS
8. Sistema de progreso
9. PracticeMode con Monaco Editor
10. Moulinette (tests + evaluación)
11. Resto de ejercicios (Niveles 2, 3, 4)
12. Flash cards + spaced repetition
13. Simulador de examen
14. Polish + animaciones

---

## 🔁 Integración rank02 (subjects, soluciones y testers reales)

La carpeta `rank02/level{0..3}/<id>/` contiene material de referencia
para 55 ejercicios:

- `sub.txt`   — subject literal del examen real
- `<id>.c`    — solución de referencia
- `main.c`    — main de prueba (cuando aplica, ejercicios `funcion`)
- `tester.sh` — script de tests bash que compila la solución y ejecuta
  varios `./out args > out.txt`

Mapeo: `rank02/level0 ↔ src/data/exercises/level1`, level1↔level2, etc.

### Campos opcionales añadidos al schema (v1.1)

En `src/data/exerciseSchema.js`. Validados por `validateOptionalRank02`
sólo si están presentes. Ningún ejercicio los exige.

| Campo (root) | Origen |
|---|---|
| `subjectReal`        | `sub.txt` literal |
| `subjectAlternativo` | subject didáctico previo (para los críticos donde ya sustituimos `subject`) |
| `testerReal`         | `tester.sh` literal |
| `testsRank02`        | tests `{id, entrada, salida, fuente:'tester.sh'}` derivados compilando la solución del rank02 con gcc y ejecutando cada caso |
| `mainReal`           | (futuro) — actualmente vive en `realMains` de `testHarnesses.js` |

Campos opcionales en `versiones[i]`:
- `origen: 'plataforma' | 'rank02' | 'didactica'`

Campos opcionales en `gdbSteps[i]` y `gdbCaminos`:
- `gdbSteps[i].fuente: 'didactica' | 'real'`, `linea: number`
- `gdbCaminos: [{ id, nombre, descripcion?, pasos: [...] }]` (alternativa
  multi-camino a `gdbSteps`; `GdbStepper` los muestra con selector si hay
  más de uno).

### Test harnesses con main real

`src/utils/testHarnesses.js` exporta dos extras:

- `realMains` — para ejercicios `funcion` cuyos `main.c` existen en
  rank02. Cada entrada lleva `{ main, requiereWarningsRelajados }`.
  Sólo `ft_swap` tiene el flag `true` (su `main.c` usa `%u` con `int*`
  y no compila con `-Werror`).
- `buildFullCodeWithRealMain(id, tipoEntrega, userCode)` → `{ code,
  requiereWarningsRelajados }`. Permite que PracticeMode ofrezca un
  toggle "usar el main real del examen" sin romper el harness por defecto.

### Diagnóstico en PracticeMode (heurísticas)

`src/utils/diagnostics/heuristics.js` define `classifyFailure({ test,
result, exercise })` que clasifica fallos por patrón:

- crashes: segfault, sigabrt, sigfpe, timeout
- compilación: compile-error
- output: missing-newline, extra-newline, truncated-tail, extra-prefix,
  first-byte-differs, mid-divergence, empty-output
- programa sin guarda argc: no-argc-guard

`src/components/practice/PracticeDiagnostics.jsx` muestra el primer test
fallido con su diagnóstico + acción sugerida, y un botón "Inspeccionar"
que carga los args en el RunPanel. Sólo se renderiza si hay fallos.

### Scripts de mantenimiento (en `scripts/`)

| Script | Qué hace |
|---|---|
| `audit-rank02.mjs` | Compara cada ejercicio plataforma vs rank02. Emite `audit-report.json`. Opción `--check` para CI. |
| `inject-subject-real.mjs <rankLevel/id> [...]` | Inyecta `subjectReal` desde el `sub.txt` literal. Idempotente. Cuidado: usa función como segundo arg de `String.replace` (los `sub.txt` contienen `$>` que activaría `$\``). |
| `inject-rank02-version.mjs [target...]` | Añade entrada `id:'rank02', origen:'rank02'` al final de `versiones[]`. Sin argumentos opera sobre los 55. |
| `inject-tests-rank02.mjs [target...]` | Compila la solución `.c` (con `main.c` si existe), ejecuta cada caso del `tester.sh` y guarda `testerReal` + `testsRank02` con la salida obtenida. |
| `inject-real-mains.mjs` | Imprime en stdout el bloque `realMains + buildFullCodeWithRealMain` listo para anexar a `testHarnesses.js`. |

### Fases ejecutadas

1. **Fase 0** — audit + schema extendido + `rank02Integration.test.js`.
2. **Fase 1** — subjects alineados (críticos: search_and_replace, do_op,
   camel_to_snake, add_prime_sum, pgcd, fprime). `subjectReal` en los 55.
3. **Fase 2** — versión `id:'rank02'` añadida en los 55 ejercicios.
4. **Fase 3.1** — `realMains` para 26 ejercicios.
5. **Fase 3.2/3.3** — `testerReal` + `testsRank02` (422 casos).
6. **Fase 4** — `gdbCaminos` opcional en GdbStepper.
7. **Fase 5** — PracticeDiagnostics con heurísticas.
8. **Fase 6** — toggle subject vigente/real/didáctico + badge rank02 en
   versiones.

Todo aditivo: ningún ejercicio existente se rompe sin esos campos. El
único cambio sustantivo de `subject` se hizo en `search_and_replace` y
`do_op` (donde la divergencia era crítica) — la versión previa se
conserva en `subjectAlternativo`.

---

*Este contexto fue generado a partir de sesiones intensivas de estudio para el examen 42 School. Todos los personajes, historias y patrones han sido validados por el usuario estudiante.*
