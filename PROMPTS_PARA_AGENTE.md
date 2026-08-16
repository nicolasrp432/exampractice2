# PROMPTS SECUENCIALES PARA EL AGENTE IA
## Plataforma 42 Exam Prep — Light Theme

> **INSTRUCCIÓN INICIAL PARA EL AGENTE:**
> Antes de ejecutar cualquier prompt, leer el archivo `CONTEXT_FOR_AGENT.md` completo.
> Es el cerebro del proyecto: contiene todos los ejercicios, personajes, schema de datos y decisiones de diseño.

---

## PROMPT 0 — Briefing inicial (dar SIEMPRE como primer mensaje)

```
Lee el archivo CONTEXT_FOR_AGENT.md adjunto completo. Es el contexto de un proyecto de plataforma educativa para preparar el examen de programación C de la escuela 42. 

Necesito que construyas esta plataforma paso a paso. El contexto contiene:
- Los 30 ejercicios con sus personajes mnemotécnicos
- El schema de datos de cada ejercicio
- Las páginas y componentes necesarios
- El sistema de diseño (tema LIGHT, moderno)
- El stack tecnológico obligatorio

Confirma que lo leíste listando los 4 niveles con cuántos ejercicios tiene cada uno.
```

---

## PROMPT 1 — Setup del proyecto

```
Crea el setup completo del proyecto con estos archivos:

1. package.json con estas dependencias exactas:
   - react ^18, react-dom ^18, react-router-dom ^6
   - zustand ^4, framer-motion ^10
   - @monaco-editor/react ^4
   - tailwindcss ^3, autoprefixer, postcss
   - @vitejs/plugin-react, vite ^5
   - clsx, lucide-react

2. vite.config.js con alias @ → src/

3. tailwind.config.js con:
   - content: ["./index.html", "./src/**/*.{js,jsx}"]
   - tema extendido con los colores del sistema de diseño del CONTEXT_FOR_AGENT.md
   - Colores por nivel: level1 (#7C3AED), level2 (#16A34A), level3 (#EA580C), level4 (#DC2626)
   - Familia de fuentes: 'Inter' para cuerpo, 'JetBrains Mono' para código

4. index.html con los Google Fonts: Inter y JetBrains Mono

5. src/index.css con los CSS custom properties del sistema de diseño (tema LIGHT)

6. src/main.jsx con React Router BrowserRouter

7. src/App.jsx con las rutas: /, /ejercicio/:id, /practicar/:id, /examen, /herramientas, /progreso, /palacio

El tema es LIGHT (fondo blanco/gris muy claro, no oscuro).
```

---

## PROMPT 2 — Layout base

```
Crea el layout base de la aplicación con estos componentes en src/components/layout/:

1. Layout.jsx — Wrapper principal con sidebar + main content + header
   - Sidebar fijo a la izquierda (64px colapsado, 240px expandido)
   - Header superior con breadcrumb y progreso global
   - Main content con scroll

2. Sidebar.jsx:
   - Logo "42 Prep" arriba
   - Navegación por secciones: Inicio, Palacio, Herramientas, Examen, Progreso
   - Sección "Niveles" con los 4 niveles (cocina/salón/dormitorio/garaje)
   - Cada nivel con su color y número de ejercicios
   - Hover effects suaves
   - Estado activo con el color del nivel
   - LIGHT theme

3. Header.jsx:
   - Breadcrumb dinámico según la ruta
   - Barra de progreso global (X/30 ejercicios dominados)
   - Badge de racha de días
   - Botón "Examen aleatorio" en esquina derecha

4. LevelBadge.jsx:
   - Badge de color según el nivel (1=purple, 2=green, 3=orange, 4=red)
   - Props: nivel (1-4), tamaño (sm/md/lg)

Todo en tema LIGHT moderno. Usa Tailwind CSS. Sin dark mode.
```

---

## PROMPT 3 — Store de Zustand y datos base

```
Crea el sistema de estado global y los datos base:

1. src/store/progressStore.js — Zustand con persist a localStorage:
   - Estado inicial: todos los ejercicios con progreso "no_iniciado"
   - Actions: marcarEstado(id, estado), registrarIntento(id), actualizarNotas(id, texto), calcularProximaRepasion(id)
   - Algoritmo spaced repetition simple: intervalos 1, 3, 7, 14, 30 días según rendimiento

2. src/store/settingsStore.js:
   - tema: "light"
   - timerExamen: 180
   - nivelesExamen: [1, 2, 3, 4]

3. src/data/exerciseSchema.js — Función validateExercise(data) que valida el schema

4. src/data/index.js — Exporta todos los ejercicios organizados por nivel:
   ```javascript
   export const exercisesByLevel = { 1: [...], 2: [...], 3: [...], 4: [...] }
   export const allExercises = [...] // flat array
   export const getExercise = (id) => ...
   export const getNextExercise = (id) => ...
   export const getPrevExercise = (id) => ...
   ```

5. src/data/exercises/level1/repeat_alpha.js — El ejercicio COMPLETO siguiendo el schema del CONTEXT_FOR_AGENT.md:
   - Subject exacto en inglés
   - Historia del Loro Alfa en español
   - Anclas: ["c - 'a' + 1", "mayús: c - 'A' + 1", "símbolo = 1 vez", "+1 OBLIGATORIO"]
   - 3 versiones de código
   - 7 tests completos (incluyendo Z → 26 Z's)
   - 10 pasos de GDB con el ejemplo "abc" → "abbccc"
   - 2 trampas (sin +1, sin else para símbolos)
   - Desglose ASCII para a,b,e,z,A,Z
```

---

## PROMPT 4 — Home page

```
Crea la página Home en src/pages/Home.jsx:

SECCIÓN 1 — Hero personal:
- "Hola, ¿listo para el examen?" 
- Progreso global: "X/30 ejercicios dominados"
- Racha de días con ícono de fuego
- Próxima sesión de repaso recomendada

SECCIÓN 2 — Palacio de la Memoria (4 habitaciones):
- Grid 2x2 o fila de 4 tarjetas
- Cada tarjeta: emoji de habitación, nombre, "N/M ejercicios", barra de progreso, color del nivel
- Al hacer click navega a la vista de ese nivel
- Animación hover: ligero lift + shadow

SECCIÓN 3 — Próximos a repasar:
- Máximo 5 ejercicios con proximaRepasion <= hoy
- Cada uno: emoji del personaje, nombre, días desde último repaso, botón "Repasar"
- Si no hay nada: mensaje motivador "¡Al día con todo! 🎉"

SECCIÓN 4 — Accesos rápidos:
- "Examen aleatorio" → /examen
- "Flash Cards" → /palacio?mode=flashcards  
- "Herramientas" → /herramientas
- "Ver progreso" → /progreso

SECCIÓN 5 — Grid de los 30 ejercicios:
- Grid 6x5 (o adaptativo)
- Cada celda: emoji del personaje + nombre corto + color de estado
  - Verde = dominado
  - Naranja = practicando
  - Gris = no iniciado
- Click en cualquiera → /ejercicio/:id

Todo en tema LIGHT. Animaciones con Framer Motion (fade in staggered).
```

---

## PROMPT 5 — ExerciseDetail page con tabs

```
Crea la página de detalle de ejercicio en src/pages/ExerciseDetail.jsx:

HEADER del ejercicio:
- Emoji del personaje (grande, 48px)
- Nombre del ejercicio + badge del nivel
- Estado actual (no_iniciado / estudiando / practicando / dominado)
- Botones: "← Anterior" y "Siguiente →"
- Botón principal: "Practicar ahora"

SISTEMA DE TABS (8 tabs):
1. 📋 Subject
2. 🦜 Historia  
3. 🔢 Fórmula
4. 🎮 Simulador
5. 🔬 GDB
6. 🔀 Variantes
7. ⚙️ Por debajo
8. 🏆 Pruébate

TAB 1 — Subject:
- Caja terminal (fondo oscuro #1E1E2E, texto verde #A6E3A1)
- El subject exacto en monospace
- Badge "Funciones permitidas: write"
- Sección "Las 5 preguntas clave" (¿Main o función? ¿Cuántos args? ¿Qué recibe? ¿Qué transforma? ¿Trampa especial?)

TAB 2 — Historia:
- Card grande con borde izquierdo morado
- Emoji del personaje (64px) + nombre
- La historia absurda estilo Campayo
- Pills de las anclas mnemotécnicas (chips verdes)
- Sección "El mapa mental" con las anclas en formato visual

TAB 3 — Fórmula:
- La fórmula principal destacada (fuente grande, monospace)
- Ejemplo paso a paso con el desglose numérico
- Para ejercicios ASCII: tabla visual de caracteres con sus valores
- Nota "¿Por qué funciona?" con explicación breve

TAB 4 — Simulador:
- Input de texto del usuario
- Botón "Ejecutar"
- Visualización de cada carácter con su transformación
- Output resultado
- Comparación con el output esperado

TAB 5 — GDB:
- Selector de paso (prev/next arrows)
- Panel oscuro tipo terminal con el código GDB
- Tabla de variables con highlight de cambios
- Contador "Paso N de M"

TAB 6 — Variantes:
- Selector de versión (clásica / índices / compacta)
- Monaco Editor read-only con el código
- Card con pros/contras de cada versión
- Recomendación de cuál usar en el examen

TAB 7 — Por debajo:
- Sección "En la RAM": explicación de qué pasa en memoria
- Sección "El CPU": qué instrucciones ejecuta
- Sección "Las syscalls": qué llama al kernel
- Estilo: cards con íconos técnicos, fondo ligeramente azulado

TAB 8 — Pruébate:
- Los tests de la Moulinette en modo terminal
- Botón "Activar modo Moulinette" → navega a /practicar/:id
- Protocolo de Active Recall
- Botón "Tengo una duda"

Al cambiar de tab, animación de fade con Framer Motion.
Guardar en localStorage el último tab visitado por ejercicio.
```

---

## PROMPT 6 — Componentes de visualización

```
Crea estos componentes en src/components/exercise/:

1. SubjectViewer.jsx:
   - Props: subject (string), funcionesPermitidas (array)
   - Caja terminal oscura con texto verde
   - Copiable al clipboard (botón copy)
   - Las líneas de "Expected files" y "Allowed functions" destacadas

2. StoryCard.jsx:
   - Props: personaje, emoji, historia, anclas, habitacion
   - Borde izquierdo color del nivel
   - Sección de anclas con chips animados (hover: scale 1.05)
   - Botón "Ver en el palacio" que navega al palacio

3. AnchorChips.jsx:
   - Props: anclas (array de strings)
   - Chips con fondo verde claro, texto verde oscuro
   - Font monospace para las fórmulas

4. TrapsList.jsx:
   - Props: trampas (array)
   - Cada trampa: badge rojo "☠ Mortal" o naranja "⚠ Warning"
   - Código malo (fondo rojo claro, texto rojo) vs código bueno (verde)
   - Diff visual entre ambos

5. CodeViewer.jsx:
   - Props: codigo (string), lenguaje ("c"), titulo (string)
   - Monaco Editor en modo read-only
   - Botón de copiar
   - Número de líneas visible
   - Tema: github-light

6. FormulaVisualizer.jsx:
   - Props: formulaClave (objeto del schema)
   - La fórmula en grande con fuente monospace
   - Animación: los números del ejemplo aparecen secuencialmente
   - Para fórmulas ASCII: tabla con los valores clave
```

---

## PROMPT 7 — Simulador interactivo

```
Crea los componentes de simulación en src/components/simulator/:

1. InputPlayground.jsx:
   - Input de texto + botón ejecutar
   - Visualización de chars: cada carácter en un chip
     - Verde = letra → se repite N veces
     - Gris = símbolo → 1 vez
     - Naranja = procesándose (animación)
   - Output en tiempo real
   - Comparativa correcto vs incorrecto (si hay error del usuario)

2. StringVisualizer.jsx:
   - Muestra un string como array de chars con su índice
   - Resalta el char "actual" (cursor animado)
   - Distingue: letra minúscula (verde), mayúscula (azul), espacio (gris), símbolo (naranja)

3. FlagVisualizer.jsx (ESPECIAL para epur_str / expand_str):
   - Muestra el string con cada char
   - Bandera k con animación: sube (🚩 naranja) al ver espacio, baja (🏳️) al confirmar
   - Separadores escritos vs no escritos
   - Output construyéndose en tiempo real
   - ¡Este es el ejercicio que costó el 50/100 en el examen real!

4. BitVisualizer.jsx (para print_bits / reverse_bits / swap_bits):
   - 8 "bombillas" (cuadrados) que se encienden/apagan
   - Slider para elegir el valor del byte (0-255)
   - Muestra: entrada → operación → salida en bits
   - Para reverse_bits: animación de inversión
   - Para swap_bits: animación de intercambio de mitades

5. StepTracer.jsx:
   - Lista de pasos de ejecución del algoritmo
   - Cada paso: índice, acción, estado actual
   - Highlight del paso activo
   - Scroll automático al paso activo
   - Botones prev/next para avanzar manualmente

Cada simulador debe conectarse a la lógica JavaScript del ejercicio (implementada en src/utils/simulators/).
```

---

## PROMPT 8 — Simuladores en JavaScript (lógica de cada ejercicio)

```
Crea src/utils/simulators/index.js con las implementaciones JavaScript de cada ejercicio del Nivel 1. Cada función recibe los argumentos como array de strings y retorna el output string (exactamente como haría el programa C):

```javascript
// Firma de cada simulador
// simulate(args: string[]) => string  (output EXACTO con \n al final)

export const simulators = {
  ft_strlen: (args) => {
    // sin main, es función: recibe string y retorna longitud
    if (args.length !== 1) return "";
    return String(args[0].length);
  },
  
  repeat_alpha: (args) => {
    if (args.length !== 1) return "\n";
    const str = args[0];
    let out = "";
    for (const c of str) {
      const code = c.charCodeAt(0);
      if (code >= 97 && code <= 122) out += c.repeat(code - 97 + 1);
      else if (code >= 65 && code <= 90) out += c.repeat(code - 65 + 1);
      else out += c;
    }
    return out + "\n";
  },
  
  // ... implementa los 12 ejercicios del Nivel 1:
  // ft_swap (es función, retorna descripción de swap)
  // ft_putstr (es función)
  // ft_strcpy (es función)
  // fizzbuzz (sin args, genera 1-100)
  // first_word
  // rev_print
  // rotone
  // rot_13
  // search_and_replace
  // ulstr
}
```

Para los ejercicios que son FUNCIONES (no programas), el simulador muestra el comportamiento de la función con inputs de ejemplo.

También crea src/utils/testRunner.js:
```javascript
// Corre todos los tests de un ejercicio y retorna los resultados
export function runTests(exerciseId, userCode = null) {
  // Si hay userCode, compilarlo (futuro con WASM)
  // Si no, usar el simulador JS
  const exercise = getExercise(exerciseId);
  return exercise.tests.map(test => {
    const output = simulators[exerciseId](test.entrada);
    const passed = output === test.salida;
    return { ...test, output, passed, diff: passed ? null : getDiff(output, test.salida) };
  });
}
```
```

---

## PROMPT 9 — Practice Mode con Monaco Editor

```
Crea la página de práctica en src/pages/PracticeMode.jsx:

LAYOUT (2 columnas en desktop, 1 en mobile):

COLUMNA IZQUIERDA (editor):
- Header: nombre del ejercicio + badge nivel + timer (opcional)
- Monaco Editor:
  - Lenguaje: c
  - Tema: github (light)
  - Fuente: JetBrains Mono 13px
  - Altura: 100% disponible
  - Placeholder: estructura básica del programa (con comentario "// Tu código aquí")
- Barra inferior: botones Compilar ▶, Limpiar 🧹, Formato ✨

COLUMNA DERECHA (resultados):
- Header: "Tests de la Moulinette" con contador X/N pasados
- Lista de tests:
  - Cada test: estado (✓/✗/○), descripción, input esperado, output esperado
  - Al pasar: verde, animación check ✓
  - Al fallar: rojo, muestra diff (esperado vs obtenido), resalta el primer byte diferente
  - Pendiente: gris, ○
- Sección "Pistas" (colapsable, 3 niveles):
  - Nivel 1: La historia del personaje
  - Nivel 2: Las anclas clave
  - Nivel 3: El código parcial con huecos
- Botón "Ver solución" (solo tras 3 intentos fallidos):
  - Muestra el código completo con animación
  - Explica cada parte
- Estadísticas de la sesión: intentos, tiempo, tests pasados

COMPORTAMIENTO:
- "Compilar" corre los tests con el simulador JS (MVP) 
- Los tests se ejecutan uno a uno con pequeño delay visual (sensación de compilación real)
- Al pasar TODOS los tests: animación de celebración, marcar como "dominado" en el store
- Guardar el código en localStorage por ejercicio
- Keyboard shortcut: Ctrl+Enter para compilar

HEADER de la práctica:
- Nombre del ejercicio
- Botón "← Volver al estudio"
- Indicador del estado (practicando → dominado)
```

---

## PROMPT 10 — GDB Simulado

```
Crea el componente GDB en src/components/gdb/GdbStepper.jsx:

DISEÑO:
- Panel dividido en 2:
  - Arriba (60%): Terminal oscuro simulando GDB
  - Abajo (40%): Tabla de variables

TERMINAL GDB:
- Fondo: #1E1E2E
- Texto base: #CDD6F4
- Prompt "(gdb)": color verde #A6E3A1
- Comandos: blanco bold
- Líneas con "→": amarillo #F9E2AF (destacado)
- Líneas con "✓": verde
- Líneas con "✗": rojo

CONTROLES:
- Barra de progreso de pasos (Paso N de M)
- Botones: ← prev | next → (keyboard: ← →)
- Label del paso actual (título)
- Botón "Ir al inicio"

TABLA DE VARIABLES:
- Columnas: Variable | Valor | Binario (opcional) | Nota
- Rows con fondo verde claro cuando el valor CAMBIÓ en ese paso
- Badge "← cambió" en la columna Nota cuando hay cambio

NOTA SOBRE RAM:
- Si el paso tiene nota sobre memoria, mostrar en card azul abajo
- "Qué pasa en RAM en este momento:"

El componente recibe `steps` del schema del ejercicio y los muestra paso a paso.
```

---

## PROMPT 11 — Palacio de la Memoria

```
Crea la página del Palacio de la Memoria en src/pages/MemoryPalace.jsx:

MODOS (toggle en el header):
- "Palacio" — Vista visual del mapa
- "Flash Cards" — Active Recall mode
- "Personajes" — Grid de todos los personajes

MODO PALACIO:
- Mapa SVG o CSS Grid de la "casa" con 4 habitaciones
- Cada habitación:
  - Icono grande (🍳 🛋️ 🛏️ 🔧)
  - Nombre (Cocina, Salón, Dormitorio, Garaje)
  - N/M ejercicios completados
  - Mini-grid de los personajes de esa habitación
  - Al hover: se expande mostrando los personajes
  - Al click: zoom in a esa habitación
- Vista de habitación expandida:
  - Grid de personajes
  - Cada personaje: emoji grande + nombre + estado
  - Click → /ejercicio/:id

MODO FLASH CARDS:
- Una tarjeta a la vez con flip animation
- Anverso: Nombre del ejercicio + emoji del personaje
- Reverso: Historia + anclas principales + fórmula clave
- Controles: ← Anterior | No lo sé | Lo tengo | Siguiente →
- "Lo tengo" → spaced repetition: amplía el intervalo
- "No lo sé" → vuelve a aparecer pronto
- Progreso de la sesión: X/30

MODO PERSONAJES:
- Grid 4 columnas de los 30 personajes
- Cada card: emoji + nombre del personaje + nombre del ejercicio + nivel + estado
- Filtros: por nivel, por dificultad, por estado
- Click → /ejercicio/:id

Animaciones suaves con Framer Motion en todas las transiciones.
```

---

## PROMPT 12 — Herramientas Universales + Decodificador

```
Crea la página src/pages/Tools.jsx con 3 secciones en tabs:

TAB 1 — Las 7 Herramientas:
- Grid de 7 tarjetas (las del CONTEXT_FOR_AGENT.md)
- Cada tarjeta: emoji, nombre, frecuencia (N/30 ejercicios), descripción breve
- Al expandir (click):
  - Patrones de código (Monaco read-only)
  - Ejercicios que la usan (chips clicables)
  - Trampas frecuentes
  - Cómo reconocerla en el subject
  - Botón "Entrenar esta herramienta"

TAB 2 — Decodificador de Subjects:
- Input grande para pegar un subject
- Botón "Decodificar"
- Resultado:
  - Palabras clave detectadas (highlighted en el subject)
  - Herramientas necesarias (con explicación)
  - Esqueleto del código generado
  - Ejercicios similares del banco
- También: chips clicables con palabras clave comunes
  (string, word, byte, binary, malloc, list, split, etc.)

TAB 3 — Quiz Relámpago:
- 10 preguntas sobre patrones y herramientas
- Formato: subject reducido → ¿qué herramienta necesitas? (4 opciones)
- Feedback inmediato con explicación
- Score final con análisis de debilidades
- "Repetir quiz" o "Ir a estudiar los que fallé"
```

---

## PROMPT 13 — Simulador de Examen

```
Crea el simulador de examen en src/pages/ExamSimulator.jsx:

CONFIGURACIÓN (pantalla antes de empezar):
- Seleccionar niveles a incluir (checkboxes: Nivel 1, 2, 3, 4)
- Duración: 30min, 1h, 3h (real)
- Modo: con/sin pistas
- Botón "Comenzar examen"

EXAMEN ACTIVO:
- Header: timer countdown prominente + botón "Terminar"
- Sin sidebar visible (modo concentración)
- Subject del ejercicio aleatorio en caja terminal
- Monaco Editor abajo para escribir el código
- Botones: "Enviar solución" | "Saltar ejercicio" | "Terminar examen"
- El ejercicio NO muestra el nombre, solo el subject (simulación real)

AL ENVIAR:
- Corre los tests silenciosamente
- Muestra ✓ / ✗ por test (sin revelar la solución)
- Pasa al siguiente ejercicio automáticamente

AL TERMINAR (pantalla de resultados):
- "Resumen del examen"
- Ejercicios completados: N/total
- Tests pasados: X%
- Tiempo por ejercicio
- Identificación de los ejercicios que fallaste
- Botones: "Estudiar ejercicios fallidos" | "Repetir examen" | "Volver al inicio"

IMPORTANTE:
- El timer en grande, visible siempre
- Sin pistas disponibles en modo examen real
- Guardar resultado en el historial de exámenes
```

---

## PROMPT 14 — Progress Page

```
Crea src/pages/ProgressPage.jsx:

SECCIÓN 1 — Resumen global:
- Circular progress: X/30 ejercicios dominados (SVG animado)
- Racha de días (con calendario mini)
- Total de sesiones
- Tiempo total de práctica

SECCIÓN 2 — Estado por nivel (4 barras):
- Nivel 1: X/12 ████████░░ 67%
- Nivel 2: X/14 ██████░░░░ 43%
- Nivel 3: X/15 ████░░░░░░ 27%
- Nivel 4: X/3  ██░░░░░░░░ 33%

SECCIÓN 3 — Grid de los 30 ejercicios:
- 4 filas (por nivel) × columnas adaptativas
- Cada celda: emoji + nombre + estado (color)
- Estados: dominado (verde), practicando (naranja), no_iniciado (gris)
- Click → /ejercicio/:id

SECCIÓN 4 — Puntos débiles:
- Top 5 ejercicios con más intentos fallidos
- Badge rojo con el número de intentos
- Botón "Estudiar ahora" por ejercicio

SECCIÓN 5 — Historial de exámenes:
- Tabla: fecha, niveles, score, tiempo, ejercicios fallidos
- Ordenado por fecha descendente
- Máximo 10 entradas

SECCIÓN 6 — Notas personales:
- Por ejercicio, el campo "notas" del store
- Editor inline para agregar/editar notas
```

---

## PROMPT 15 — Poblar ejercicios restantes del Nivel 1

```
Crea los archivos de datos para los 11 ejercicios restantes del Nivel 1 en src/data/exercises/level1/. Sigue EXACTAMENTE el schema definido en CONTEXT_FOR_AGENT.md. Cada archivo debe incluir:

ft_strlen.js:
- Personaje: El Alien Elástico 👽
- Historia: "El Alien Elástico se estira por el string. Cada celda que toca, grita un número. Cuando toca al Fantasma Cero \\0 se congela. El número que gritó = la longitud."
- Anclas: ["while(str[c])", "c++", "return(c)", "el \\0 para al alien"]
- Tests: string vacío "", "abc" → 3, "hello" → 5, string de 1 char
- GDB: 8 pasos con "hello" → retorna 5

ft_swap.js:
- Personaje: El Sapo Mago con varita-estrella 🧙
- Historia: "El Sapo necesita un vaso vacío (int empty). Mete A en el vaso, pone B donde estaba A, saca el vaso y pone A donde estaba B. Sin vaso = desastre (segfault)."
- Trampa MORTAL: "int *empty en vez de int empty → puntero a nada → segfault"

[continúa con los 9 ejercicios restantes...]

Para CADA ejercicio incluir mínimo:
- subject exacto (en inglés)
- descripción en español
- historia completa del personaje
- 4-5 anclas
- 5-7 tests (incluyendo edge cases)
- 2-3 trampas
- La fórmula o patrón clave
```

---

## PROMPT 16 — Ejercicios Nivel 2

```
Crea los archivos de datos para los 14 ejercicios del Nivel 2 en src/data/exercises/level2/.
Mismo formato. Ejercicios priorizados por dificultad (difíciles primero):

PRIMERO los difíciles (más atención en el simulador):
- ft_strpbrk.js: Trampa crítica = retornar &s1[i] (puntero), NO s1[i] (valor)
- inter.js: Función auxiliar iter() con doble condición
- reverse_bits.js: bit = bit*2 + octet%2, inicializar bit=0
- union.js: Tabla visto[256] para no usar segfault

LUEGO los medios y fáciles:
- alpha_mirror.js, camel_to_snake.js, do_op.js, ft_atoi.js
- ft_strcmp.js, ft_strcspn.js, ft_strdup.js, ft_strrev.js
- is_power_of_2.js, last_word.js, print_bits.js
- swap_bits.js, wdmatch.js
```

---

## PROMPT 17 — Ejercicios Nivel 3 y 4

```
Crea los archivos de datos para los 15 ejercicios del Nivel 3 y los 3 del Nivel 4.

Nivel 3 — ESPECIAL ATENCIÓN EN:
- epur_str.js Y expand_str.js: 
  ESTOS SON LOS EJERCICIOS QUE LE COSTARON EL 50/100 AL USUARIO.
  El simulador FlagVisualizer debe mostrar visualmente la bandera k.
  Incluir la advertencia: "LA BANDERA K es obligatoria. Nunca escribas el espacio al verlo."
  Tests adicionales para trailing spaces (el error clásico)

- ft_split.js: 
  Las DOS PASADAS son el núcleo. Incluir diagrama textual de las 2 pasadas.
  Trampa MORTAL: olvidar result[k] = NULL al final.

Nivel 4 — TODO DIFÍCIL:
- fprime.js: Reset i=1 (no i=2). Trampa del asterisco antes del break.
- ft_split.js: Ya cubierto arriba.  
- sort_list.js: Swap de DATA (no nodos). cmp==0 significa intercambiar.
```

---

## PROMPT 18 — Animaciones y Polish

```
Añade animaciones con Framer Motion en toda la app:

1. Page transitions:
   - Fade in al navegar entre páginas (duration: 0.2s)

2. Home:
   - Stagger de las tarjetas del palacio (aparecen con delay 0.1s cada una)
   - El grid de 30 ejercicios aparece en cascada

3. Exercise tabs:
   - Fade + slight slide al cambiar de tab

4. StoryCard:
   - Las anclas aparecen una a una con delay

5. Flash cards:
   - Flip 3D al hacer click (rotateY 180deg)

6. Progress bars:
   - Animación de llenado al cargar (spring animation)

7. Test results (Moulinette):
   - Los tests "pasan" uno a uno con micro-delay
   - Check ✓ con scale pop animation
   - Cruz ✗ con shake animation

8. Celebración al dominar un ejercicio:
   - Confetti o similar (css-based)
   - Card que se pone verde con bounce

9. Timer del examen:
   - Se pone rojo cuando quedan < 10 minutos
   - Pulso animado cuando quedan < 5 minutos

Todas las animaciones deben respetar prefers-reduced-motion.
```

---

## PROMPT 19 — PWA + modo offline

```
Configura la app como PWA:

1. vite-plugin-pwa:
   - manifest.json con nombre "42 Prep", icono, theme_color blanco
   - Service worker con Workbox
   - Cache: todos los assets estáticos + los datos de ejercicios

2. Indicador de estado offline:
   - Banner suave cuando no hay conexión: "Modo offline — todo el contenido disponible"

3. Instalar prompt:
   - Mostrar solo si no está instalada
   - Botón discreto en el header "Instalar app"

4. localStorage como única fuente de truth para el progreso:
   - Todo el progreso ya está en localStorage
   - Funciona 100% offline

La app debe funcionar completamente sin conexión una vez cargada por primera vez.
```

---

## PROMPT 20 — Testing y QA

```
Crea un sistema de verificación automática:

1. src/utils/validateData.js:
   - Verifica que todos los ejercicios tienen subject, historia, anclas, tests
   - Verifica que los tests tienen salida exacta (con \n al final)
   - Verifica que los simuladores dan el output correcto

2. Script: npm run validate
   - Corre los simuladores contra los tests
   - Reporta ejercicios con tests fallidos
   - Reporta ejercicios con datos incompletos

3. Checklist manual de QA:
   - [ ] Los 30 ejercicios tienen datos completos
   - [ ] El tema LIGHT funciona en todos los componentes
   - [ ] La Moulinette detecta trailing spaces correctamente
   - [ ] El spaced repetition calcula fechas correctamente
   - [ ] El examen aleatorio funciona
   - [ ] La navegación entre ejercicios funciona
   - [ ] El progreso persiste al recargar
   - [ ] Las flash cards hacen flip
   - [ ] El GDB stepper avanza/retrocede
   - [ ] Responsive en mobile (mínimo 375px)
```

---

## PROMPTS ADICIONALES (según avance)

### Para depurar un componente específico:
```
El componente [NOMBRE] no funciona correctamente. 
El comportamiento esperado es [X].
El comportamiento actual es [Y].
El código actual es:
[PEGAR CÓDIGO]
Corrígelo.
```

### Para añadir un ejercicio faltante:
```
Añade el ejercicio [NOMBRE] al Nivel [N] siguiendo el schema del CONTEXT_FOR_AGENT.md.
El subject exacto es:
[PEGAR SUBJECT]
El personaje es [NOMBRE PERSONAJE] con emoji [EMOJI].
La trampa crítica es [DESCRIPCIÓN].
```

### Para mejorar la UI de un componente:
```
El componente [NOMBRE] necesita mejoras visuales.
Tema: LIGHT, moderno, educativo.
Debe verse como [REFERENCIA].
Mantén exactamente la misma lógica, solo mejora el diseño.
```

---

## ORDEN DE EJECUCIÓN RECOMENDADO

1. PROMPT 0 → Verificar que el agente leyó el contexto
2. PROMPT 1 → Setup base
3. PROMPT 2 → Layout
4. PROMPT 3 → Datos y store
5. PROMPT 4 → Home
6. PROMPT 5 → ExerciseDetail
7. PROMPT 6 → Componentes de visualización
8. PROMPT 7 → Simuladores
9. PROMPT 8 → Lógica JS
10. PROMPT 9 → PracticeMode
11. PROMPT 10 → GDB
12. PROMPT 11 → Palacio de memoria
13. PROMPT 12 → Herramientas
14. PROMPT 13 → Simulador de examen
15. PROMPT 14 → Progress
16. PROMPT 15 → Datos Nivel 1 completo
17. PROMPT 16 → Datos Nivel 2
18. PROMPT 17 → Datos Niveles 3 y 4
19. PROMPT 18 → Animaciones
20. PROMPT 19 → PWA
21. PROMPT 20 → Validación

---

*Total: 20 prompts secuenciales para construir la plataforma completa.*
*El agente debe leer CONTEXT_FOR_AGENT.md antes de ejecutar cualquier prompt.*
