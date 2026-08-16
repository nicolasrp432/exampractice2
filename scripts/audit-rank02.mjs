#!/usr/bin/env node
// scripts/audit-rank02.mjs
//
// Compara cada ejercicio de rank02 con su gemelo en src/data/exercises/ y
// genera audit-report.json en la raíz del repo. NO modifica nada en la
// plataforma, sólo informa.
//
// Mapeo de niveles:
//   rank02/level0 → platform/level1
//   rank02/level1 → platform/level2
//   rank02/level2 → platform/level3
//   rank02/level3 → platform/level4
//
// Uso:
//   node scripts/audit-rank02.mjs           # genera audit-report.json
//   node scripts/audit-rank02.mjs --check   # falla si hay divergencias críticas
//                                           # no resueltas (subjectReal ausente)

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const RANK02    = join(REPO_ROOT, 'rank02')
const EX_ROOT   = join(REPO_ROOT, 'src/data/exercises')
const REPORT    = join(REPO_ROOT, 'audit-report.json')

const LEVEL_MAP = {
  level0: 1,
  level1: 2,
  level2: 3,
  level3: 4,
}

// ── helpers ──────────────────────────────────────────────────────────────────

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null
}

function parseAllowedFunctions(subjectText) {
  if (!subjectText) return []
  const m = subjectText.match(/Allowed functions\s*:\s*([^\n]*)/i)
  if (!m) return []
  const raw = m[1].trim()
  // En sub.txt, una línea vacía suele ir seguida de "------" (separador).
  // Lo descartamos.
  // "-" solitario y "none" se tratan igual que vacío.
  if (!raw || /^none$/i.test(raw) || /^-+$/.test(raw)) return []
  // Filtramos tokens que sean sólo guiones (separador / placeholder).
  return raw.split(/[,\s]+/).filter(t => t && !/^-+$/.test(t)).sort()
}

function parseExpectedFiles(subjectText) {
  if (!subjectText) return []
  const m = subjectText.match(/Expected files\s*:\s*([^\n]*)/i)
  if (!m) return []
  return m[1].trim().split(/[,\s]+/).filter(Boolean).sort()
}

function normalizeSubjectForCompare(s) {
  if (!s) return ''
  return s.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim()
}

// Extrae casos del tester.sh: busca llamadas tipo
//   ./out1 "arg1" "arg2" ... > out1.txt
// y captura cada conjunto de argumentos como un test.
function parseTesterCases(testerText) {
  if (!testerText) return []
  const cases = []
  const re = /\.\/out1\s+([^\n>]*)\s*>\s*out1\.txt/g
  let m
  let i = 0
  while ((m = re.exec(testerText)) !== null) {
    const argsRaw = m[1].trim()
    const args = []
    if (argsRaw) {
      // tokenizer simple para "a b c" / a b c / "a \"x\" b"
      const tokRe = /"((?:\\.|[^"\\])*)"|(\S+)/g
      let t
      while ((t = tokRe.exec(argsRaw)) !== null) {
        args.push(t[1] !== undefined ? t[1] : t[2])
      }
    }
    cases.push({ id: `tester_${++i}`, entrada: args })
  }
  return cases
}

function listDirs(p) {
  if (!existsSync(p)) return []
  return readdirSync(p, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()
}

function classifySeverity({ allowedDiffers, subjectDiffers, missingPlatform }) {
  if (missingPlatform)  return 'critica'
  if (allowedDiffers)   return 'critica'
  if (subjectDiffers)   return 'menor'
  return 'ninguna'
}

// ── carga lazy de la plataforma ──────────────────────────────────────────────

async function loadPlatformExercises() {
  const mod = await import(pathToFileURL(join(EX_ROOT, '..', 'index.js')).href)
  const byId = new Map()
  for (const ex of mod.allExercises) byId.set(ex.id, ex)
  return byId
}

// ── audit principal ──────────────────────────────────────────────────────────

async function audit() {
  const platform = await loadPlatformExercises()
  const entries = []

  for (const rankLvl of Object.keys(LEVEL_MAP)) {
    const platformLvl = LEVEL_MAP[rankLvl]
    const dir = join(RANK02, rankLvl)
    const exNames = listDirs(dir)

    for (const name of exNames) {
      const exDir = join(dir, name)
      const subPath    = join(exDir, 'sub.txt')
      const cPath      = join(exDir, `${name}.c`)
      const mainPath   = join(exDir, 'main.c')
      const testerPath = join(exDir, 'tester.sh')

      const subjectReal  = readIfExists(subPath)
      const solutionReal = readIfExists(cPath)
      const mainReal     = readIfExists(mainPath)
      const testerReal   = readIfExists(testerPath)

      const allowedReal   = parseAllowedFunctions(subjectReal)
      const expectedReal  = parseExpectedFiles(subjectReal)
      const testerCases   = parseTesterCases(testerReal)

      const platformEx    = platform.get(name) || null
      const missingPlatform = !platformEx

      const allowedPlatform = platformEx
        ? [...(platformEx.funcionesPermitidas || [])].sort()
        : []
      const expectedPlatform = platformEx
        ? [...(platformEx.archivosEsperados || [])].sort()
        : []

      const allowedDiffers =
        JSON.stringify(allowedReal) !== JSON.stringify(allowedPlatform)
      const subjectDiffers = platformEx
        ? normalizeSubjectForCompare(platformEx.subject)
            !== normalizeSubjectForCompare(subjectReal)
        : true
      const expectedDiffers =
        JSON.stringify(expectedReal) !== JSON.stringify(expectedPlatform)

      const severity = classifySeverity({
        allowedDiffers, subjectDiffers, missingPlatform,
      })

      const subjectRealEmbedded = platformEx?.subjectReal
        ? normalizeSubjectForCompare(platformEx.subjectReal)
            === normalizeSubjectForCompare(subjectReal)
        : false

      entries.push({
        id: name,
        rankLevel: rankLvl,
        platformLevel: platformLvl,
        files: {
          sub:    Boolean(subjectReal),
          c:      Boolean(solutionReal),
          main:   Boolean(mainReal),
          tester: Boolean(testerReal),
        },
        platform: {
          present: !missingPlatform,
          funcionesPermitidas: allowedPlatform,
          archivosEsperados:   expectedPlatform,
          subjectRealEmbedded,
        },
        real: {
          allowedFunctions: allowedReal,
          expectedFiles:    expectedReal,
          hasMain:          Boolean(mainReal),
          testerCases:      testerCases.length,
        },
        diffs: {
          allowedDiffers,
          subjectDiffers,
          expectedDiffers,
        },
        severity,
        // Para inspección manual / scaffolding
        sample: {
          firstTesterCase: testerCases[0] ?? null,
        },
      })
    }
  }

  // resumen
  const summary = {
    total: entries.length,
    bySeverity: {
      critica:  entries.filter(e => e.severity === 'critica').length,
      menor:    entries.filter(e => e.severity === 'menor').length,
      ninguna:  entries.filter(e => e.severity === 'ninguna').length,
    },
    missingInPlatform: entries.filter(e => !e.platform.present).map(e => e.id),
    criticasPendientes: entries
      .filter(e => e.severity === 'critica' && !e.platform.subjectRealEmbedded)
      .map(e => e.id),
  }

  const report = {
    generatedAt: new Date().toISOString(),
    schemaVersion: '1.0',
    levelMap: LEVEL_MAP,
    summary,
    entries,
  }

  return report
}

// ── runner ───────────────────────────────────────────────────────────────────

const args = new Set(process.argv.slice(2))
const isCheck = args.has('--check')

audit().then((report) => {
  writeFileSync(REPORT, JSON.stringify(report, null, 2))
  const { total, bySeverity, criticasPendientes } = report.summary
  console.log(`audit-rank02: ${total} ejercicios analizados`)
  console.log(`  críticas: ${bySeverity.critica}`)
  console.log(`  menores:  ${bySeverity.menor}`)
  console.log(`  iguales:  ${bySeverity.ninguna}`)
  console.log(`  faltan en plataforma: ${report.summary.missingInPlatform.length}`)
  console.log(`  reporte: ${REPORT}`)

  if (isCheck && criticasPendientes.length > 0) {
    console.error(`\n✗ ${criticasPendientes.length} ejercicios con divergencia crítica sin resolver:`)
    for (const id of criticasPendientes) console.error(`  - ${id}`)
    process.exit(1)
  }
}).catch((err) => {
  console.error('audit-rank02 falló:', err)
  process.exit(2)
})
