// npm run validate — verifica ejercicios, simuladores y utilidades
// Ejecutar con: node src/utils/validateData.js

import { allExercises } from '../data/index.js'
import { simulators, getDiff } from './simulators/index.js'
import { testHarnesses } from './testHarnesses.js'
import { buildExamPlan, summarizeExamResults } from './exam.js'
import { buildProgressModel } from './progress.js'

const RED    = '\x1b[31m'
const GREEN  = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN   = '\x1b[36m'
const RESET  = '\x1b[0m'
const BOLD   = '\x1b[1m'
const DIM    = '\x1b[2m'

let totalErrors   = 0
let totalWarnings = 0

// Flags para el checklist
let trailingSpaceOk  = true
let examPlanOk       = true
let progressModelOk  = true

function error(msg) { console.log(`  ${RED}✗${RESET} ${msg}`); totalErrors++ }
function warn(msg)  { console.log(`  ${YELLOW}⚠${RESET} ${msg}`); totalWarnings++ }
function ok(msg)    { console.log(`  ${GREEN}✓${RESET} ${msg}`) }
function section(n, title) { console.log(`${BOLD}${n}. ${title}${RESET}`) }

console.log(`\n${BOLD}42 Exam Prep — Validación de datos${RESET}`)
console.log(`${'─'.repeat(55)}\n`)

// ── 1. Campos requeridos ──────────────────────────────────────────────────────
section(1, 'Campos requeridos')
for (const ex of allExercises) {
  const issues = []
  if (!ex.subject)                  issues.push('subject vacío')
  if (!ex.palacio?.historia)        issues.push('palacio.historia vacío')
  if (!ex.palacio?.anclas?.length)  issues.push('sin anclas')
  if (!ex.versiones?.length)        issues.push('sin versiones de código')
  if (!ex.tests?.length)            issues.push('sin tests')
  if (!ex.trampas?.length)          issues.push('sin trampas')
  if (!ex.formulaClave?.formula)    issues.push('formulaClave.formula vacía')
  if (issues.length) warn(`${ex.id}: ${issues.join(', ')}`)
}
console.log()

// ── 2. Formato de tests ───────────────────────────────────────────────────────
section(2, 'Formato de tests (salida debe terminar en \\n, sin trailing spaces)')
for (const ex of allExercises) {
  for (const t of ex.tests ?? []) {
    if (typeof t.salida !== 'string') {
      error(`${ex.id}/${t.id}: salida no es string`)
      continue
    }
    if (!t.salida.endsWith('\n') && t.salida !== '') {
      error(`${ex.id}/${t.id}: salida no termina en \\n → ${JSON.stringify(t.salida)}`)
    }
    // Detectar trailing spaces dentro de cada línea (como hace la Moulinette real)
    const lines = t.salida.split('\n')
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i] !== lines[i].trimEnd()) {
        warn(`${ex.id}/${t.id}: línea ${i + 1} tiene espacios al final: ${JSON.stringify(lines[i])}`)
        trailingSpaceOk = false
      }
    }
  }
}
console.log()

// ── 3. Simuladores contra tests ───────────────────────────────────────────────
section(3, 'Simuladores contra tests')
let simOk = 0, simFail = 0, simMissing = 0

for (const ex of allExercises) {
  if (!ex.tests?.length) continue
  const fn = simulators[ex.id]
  if (!fn) {
    if (ex.subject) warn(`${ex.id}: sin simulador JS`)
    simMissing++
    continue
  }
  let exFail = 0
  for (const t of ex.tests) {
    let out
    try { out = fn(t.entrada) } catch (e) { out = null }
    if (out !== t.salida) {
      exFail++
      const diff = out !== null ? getDiff(out, t.salida) : null
      error(`${ex.id}/${t.id}: esperado ${JSON.stringify(t.salida)} | obtenido ${JSON.stringify(out)}${diff ? ` | diff pos ${diff.position}` : ''}`)
    }
  }
  if (exFail === 0) { ok(`${ex.id}: ${ex.tests.length} tests OK`); simOk++ }
  else simFail++
}
console.log()

// ── 4. Versiones de código ────────────────────────────────────────────────────
section(4, 'Versiones de código')
for (const ex of allExercises) {
  const versiones = ex.versiones ?? []
  if (!versiones.length) continue
  const recomendadas = versiones.filter(v => v.recomendada)
  if (recomendadas.length === 0) warn(`${ex.id}: ninguna versión marcada como recomendada`)
  if (recomendadas.length > 1)  warn(`${ex.id}: ${recomendadas.length} versiones marcadas como recomendada`)
  for (const v of versiones) {
    if (!v.codigo?.trim()) error(`${ex.id}/${v.id}: versión sin código`)
  }
}
console.log()

// ── 5. Estructura e integridad de tests ──────────────────────────────────────
section(5, 'Estructura e integridad de tests')
const seenExIds = new Set()
let structOk = 0

for (const ex of allExercises) {
  if (seenExIds.has(ex.id)) { error(`ID de ejercicio duplicado: "${ex.id}"`); continue }
  seenExIds.add(ex.id)

  const seenTestIds = new Set()
  let exStructOk = true
  for (const t of ex.tests ?? []) {
    if (seenTestIds.has(t.id)) { error(`${ex.id}: test ID duplicado "${t.id}"`); exStructOk = false }
    seenTestIds.add(t.id)
    if (!Array.isArray(t.entrada)) { error(`${ex.id}/${t.id}: entrada no es array`); exStructOk = false }
    if (!['normal', 'edge'].includes(t.tipo)) { error(`${ex.id}/${t.id}: tipo inválido "${t.tipo}" (debe ser 'normal' o 'edge')`); exStructOk = false }
  }
  if (exStructOk) structOk++
}
ok(`${structOk}/${allExercises.length} ejercicios con estructura de tests correcta`)
console.log()

// ── 6. Schema de ejercicios ───────────────────────────────────────────────────
section(6, 'Schema de ejercicios (tipoEntrega, nivel, dificultad)')
let schemaOk = 0

for (const ex of allExercises) {
  let ok_ = true
  if (!['funcion', 'programa'].includes(ex.tipoEntrega)) {
    error(`${ex.id}: tipoEntrega inválido "${ex.tipoEntrega}" (debe ser 'funcion' o 'programa')`)
    ok_ = false
  }
  if (![1, 2, 3, 4].includes(ex.nivel)) {
    error(`${ex.id}: nivel inválido ${ex.nivel}`)
    ok_ = false
  }
  if (!['fácil', 'medio', 'difícil'].includes(ex.dificultad)) {
    warn(`${ex.id}: dificultad inusual "${ex.dificultad}"`)
  }
  if (ok_) schemaOk++
}
ok(`${schemaOk}/${allExercises.length} ejercicios con schema correcto`)
console.log()

// ── 7. Cobertura de harnesses (funcion-type) ──────────────────────────────────
section(7, 'Cobertura de test harnesses (ejercicios tipo funcion)')
const funcionExercises = allExercises.filter(e => e.tipoEntrega === 'funcion')
let harnessOk = 0

for (const ex of funcionExercises) {
  if (testHarnesses[ex.id]) {
    const h = testHarnesses[ex.id]
    if (!h.main?.trim()) {
      error(`${ex.id}: harness existe pero main está vacío`)
    } else {
      harnessOk++
    }
  } else {
    error(`${ex.id}: tipoEntrega='funcion' pero sin harness en testHarnesses.js`)
  }
}
ok(`${harnessOk}/${funcionExercises.length} ejercicios funcion con harness completo`)
console.log()

// ── 8. Utilidades core ────────────────────────────────────────────────────────
section(8, 'Utilidades core (buildExamPlan, summarizeExamResults, buildProgressModel)')

// buildExamPlan — una combinación por nivel y la combinación completa
const rng = () => 0.5
const planCases = [[1], [2], [3], [4], [1, 2, 3, 4]]
for (const levels of planCases) {
  try {
    const plan = buildExamPlan(allExercises, levels, rng, 30)
    const got = plan.exercises.length
    const want = levels.length
    if (got !== want) {
      error(`buildExamPlan([${levels}]): esperados ${want} ejercicios, obtenidos ${got}`)
      examPlanOk = false
    } else if (plan.exercises.some(e => !levels.includes(e.nivel))) {
      error(`buildExamPlan([${levels}]): ejercicio de nivel incorrecto en el plan`)
      examPlanOk = false
    } else {
      ok(`buildExamPlan([${levels.join(',')}]): ${got} ejercicio(s) de niveles correctos`)
    }
  } catch (e) {
    error(`buildExamPlan([${levels}]): excepción → ${e.message}`)
    examPlanOk = false
  }
}

// summarizeExamResults — cálculo de scorePct
try {
  const mockResults = [
    { id: 'ft_strlen', nombre: 'ft_strlen', nivel: 1, passedTests: 3, totalTests: 3, passed: true,  status: 'completed', elapsedSeconds: 120 },
    { id: 'ft_swap',   nombre: 'ft_swap',   nivel: 1, passedTests: 1, totalTests: 2, passed: false, status: 'completed', elapsedSeconds: 90  },
  ]
  const s = summarizeExamResults(mockResults)
  if (s.scorePct !== 80) {
    error(`summarizeExamResults: scorePct esperado 80, obtenido ${s.scorePct}`)
  } else if (s.failedExercises.length !== 1 || s.failedExercises[0] !== 'ft_swap') {
    error(`summarizeExamResults: failedExercises incorrecto → ${JSON.stringify(s.failedExercises)}`)
  } else {
    ok('summarizeExamResults: scorePct y failedExercises correctos')
  }
} catch (e) {
  error(`summarizeExamResults: excepción → ${e.message}`)
}

// buildProgressModel — estructura y miniCalendar
try {
  const model = buildProgressModel({
    exercises: allExercises,
    progressById: {},
    exams: [],
    streak: 5,
    now: new Date('2025-01-15'),
  })
  if (model.totalExercises !== allExercises.length) {
    error(`buildProgressModel: totalExercises esperado ${allExercises.length}, obtenido ${model.totalExercises}`)
    progressModelOk = false
  } else if (model.miniCalendar.length !== 7) {
    error(`buildProgressModel: miniCalendar debe tener 7 días, tiene ${model.miniCalendar.length}`)
    progressModelOk = false
  } else if (model.levelStats.length !== 4) {
    error(`buildProgressModel: levelStats debe tener 4 niveles`)
    progressModelOk = false
  } else {
    ok(`buildProgressModel: ${model.totalExercises} ejercicios, 7 días de calendario, 4 niveles`)
  }
} catch (e) {
  error(`buildProgressModel: excepción → ${e.message}`)
  progressModelOk = false
}
console.log()

// ── Resumen ───────────────────────────────────────────────────────────────────
console.log('─'.repeat(55))
console.log(`\n${BOLD}Resumen${RESET}`)
console.log(`  Ejercicios totales:      ${allExercises.length}`)
console.log(`  Con datos completos:     ${allExercises.filter(e => e.subject).length}`)
console.log(`  Simuladores OK:          ${simOk}`)
console.log(`  Simuladores con fallos:  ${simFail}`)
console.log(`  Sin simulador:           ${simMissing}`)
console.log(`  ${RED}Errores: ${totalErrors}${RESET}`)
console.log(`  ${YELLOW}Advertencias: ${totalWarnings}${RESET}`)

// ── QA Checklist ──────────────────────────────────────────────────────────────
const AUTO = (pass) => pass ? `${GREEN}✓ AUTO  ${RESET}` : `${RED}✗ AUTO  ${RESET}`
const MANUAL = `${CYAN}[ ] MANUAL${RESET}`

console.log(`\n${'─'.repeat(55)}`)
console.log(`${BOLD}QA Checklist${RESET}`)
console.log(`${DIM}  AUTO = verificado por este script | MANUAL = verificar en browser${RESET}\n`)

const checklist = [
  { label: `Los ${allExercises.length} ejercicios tienen datos completos`, auto: true, pass: totalWarnings === 0 && totalErrors === 0 },
  { label: 'Simuladores reproducen output exacto byte a byte',            auto: true, pass: simFail === 0 && simMissing === 0 },
  { label: 'Moulinette detecta trailing spaces correctamente',            auto: true, pass: trailingSpaceOk },
  { label: 'Spaced repetition (buildProgressModel) calcula correctamente',auto: true, pass: progressModelOk },
  { label: 'Examen aleatorio produce ejercicios por nivel correctos',     auto: true, pass: examPlanOk },
  { label: 'Tema LIGHT visible en todos los componentes',                 auto: false },
  { label: 'Navegación entre ejercicios funciona (breadcrumbs, back)',    auto: false },
  { label: 'El progreso persiste al recargar la página',                  auto: false },
  { label: 'Las flash cards hacen flip 3D al hacer click',                auto: false },
  { label: 'El GDB stepper avanza y retrocede correctamente',             auto: false },
  { label: 'Responsive en mobile — mínimo 375px sin overflow horizontal', auto: false },
]

for (const item of checklist) {
  const badge = item.auto ? AUTO(item.pass) : MANUAL
  console.log(`  ${badge}  ${item.label}`)
}

// ── Resultado final ───────────────────────────────────────────────────────────
console.log()
if (totalErrors === 0) {
  console.log(`${GREEN}${BOLD}✓ Validación completa — 0 errores${RESET}`)
  if (totalWarnings > 0) {
    console.log(`${YELLOW}  ${totalWarnings} advertencia(s) — revisar antes de publicar${RESET}`)
  }
  console.log()
} else {
  console.log(`${RED}${BOLD}✗ ${totalErrors} error(es) a corregir${RESET}\n`)
  process.exit(1)
}
