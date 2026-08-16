# 42 Exam Prep — Guía de Setup

## Pasos para crear el proyecto

### 1. Crear el proyecto con Vite

```bash
npm create vite@latest 42-exam-prep -- --template react
cd 42-exam-prep
```

### 2. Reemplazar los archivos de configuración

Copia los archivos de esta carpeta (`42-platform-starter/`) al proyecto:
- `package.json` → reemplaza el generado por Vite
- `vite.config.js` → reemplaza el generado
- `tailwind.config.js` → archivo nuevo
- `index.html` → reemplaza el generado
- `src/index.css` → reemplaza el generado

### 3. Instalar dependencias

```bash
npm install
```

### 4. Instalar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
*(ya tienes el `tailwind.config.js` listo, no necesitas generarlo)*

### 5. Crear la estructura de carpetas

```bash
mkdir -p src/pages src/components/layout src/components/exercise
mkdir -p src/components/simulator src/components/gdb src/components/practice
mkdir -p src/components/memory src/components/progress
mkdir -p src/data/exercises/level1 src/data/exercises/level2
mkdir -p src/data/exercises/level3 src/data/exercises/level4
mkdir -p src/store src/hooks src/utils
```

### 6. Copiar el archivo de ejercicio de ejemplo

```bash
# Copia src/data/exercises/level1/repeat_alpha.js al proyecto
```

### 7. Verificar que funciona

```bash
npm run dev
```

---

## Dar contexto al agente IA

### Opción A — Adjuntar archivos directamente
1. Adjunta `CONTEXT_FOR_AGENT.md` al inicio de la conversación
2. Adjunta `PROMPTS_PARA_AGENTE.md`
3. Empieza con el PROMPT 0

### Opción B — Copiar y pegar el contexto
1. Copia el contenido de `CONTEXT_FOR_AGENT.md`
2. Pégalo en el primer mensaje al agente
3. Sigue con los prompts en orden

### Opción C — Repositorio GitHub
1. Crea un repo con todos estos archivos
2. Da la URL al agente y pídele que lo lea
3. Útil para Claude Code, Cursor, etc.

---

## Agentes recomendados para este proyecto

| Agente | Ideal para |
|--------|------------|
| **Claude Code** | Desarrollo completo, puede leer archivos del sistema |
| **Cursor AI** | Buena integración con el código, edición inline |
| **v0.dev** | Componentes React/Tailwind rápidos |
| **Bolt.new** | Setup rápido del proyecto completo |

### Para Claude Code (recomendado):
```bash
# Instala Claude Code
npm install -g @anthropic-ai/claude-code

# En la carpeta del proyecto
claude

# Primer mensaje:
# "Lee el archivo CONTEXT_FOR_AGENT.md y luego ejecuta el PROMPT 1 de PROMPTS_PARA_AGENTE.md"
```

---

## Estructura de archivos a crear (en orden)

```
Fase 1 (MVP):
├── src/main.jsx
├── src/App.jsx
├── src/components/layout/Layout.jsx
├── src/components/layout/Sidebar.jsx
├── src/components/layout/Header.jsx
├── src/store/progressStore.js
├── src/store/settingsStore.js
├── src/data/index.js
├── src/pages/Home.jsx
└── src/pages/ExerciseDetail.jsx

Fase 2 (Práctica):
├── src/components/exercise/*.jsx (6 componentes)
├── src/components/simulator/*.jsx (5 componentes)
├── src/utils/simulators/index.js
├── src/utils/testRunner.js
└── src/pages/PracticeMode.jsx

Fase 3 (Contenido):
├── src/data/exercises/level1/*.js (12 archivos)
├── src/data/exercises/level2/*.js (14 archivos)
├── src/data/exercises/level3/*.js (15 archivos)
└── src/data/exercises/level4/*.js (3 archivos)

Fase 4 (Memoria + Examen):
├── src/components/gdb/*.jsx
├── src/components/memory/*.jsx
├── src/pages/MemoryPalace.jsx
├── src/pages/ExamSimulator.jsx
├── src/pages/Tools.jsx
└── src/pages/ProgressPage.jsx
```

---

## Verificación rápida

Cuando el agente termine la Fase 1, deberías ver:
- ✅ La app arranca sin errores (`npm run dev`)
- ✅ El sidebar muestra los 4 niveles con sus colores
- ✅ La home muestra el palacio de memoria
- ✅ Puedes navegar a /ejercicio/repeat_alpha
- ✅ El subject se muestra en la caja terminal verde
- ✅ La historia del Loro Alfa aparece en la tab "Historia"

---

*Archivos generados por Claude como tutor del examen 42.*
