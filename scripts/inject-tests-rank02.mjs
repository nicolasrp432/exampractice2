#!/usr/bin/env node
// scripts/inject-tests-rank02.mjs
//
// Para cada ejercicio de rank02 con tester.sh:
//   1) Compila la solución <id>.c con gcc -w en /tmp.
//      Para tipoEntrega='funcion' enlazamos un main mínimo si lo trae el
//      repo (main.c). Si no, se omite (no podemos derivar salidas).
//   2) Parsea los casos del tester (./out1 args > out1.txt) y ejecuta el
//      binario con esos args para obtener la salida esperada.
//   3) Inyecta en el archivo de la plataforma:
//        - testerReal: string del tester.sh
//        - testsRank02: array de tests {id, entrada, salida, fuente}
//
// Idempotente: si ya existe testsRank02 o testerReal, no los reescribe.

import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs'
import { execSync, spawnSync } from 'node:child_process'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')

const LEVEL_MAP = { level0: 1, level1: 2, level2: 3, level3: 4 }

function escapeTemplate(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

function parseTesterCases(testerText) {
  if (!testerText) return []
  const cases = []
  const re = /\.\/out1\s+([^\n>]*)\s*>\s*out1\.txt/g
  let m, i = 0
  while ((m = re.exec(testerText)) !== null) {
    const argsRaw = m[1].trim()
    const args = []
    if (argsRaw) {
      const tokRe = /"((?:\\.|[^"\\])*)"|(\S+)/g
      let t
      while ((t = tokRe.exec(argsRaw)) !== null) {
        args.push((t[1] !== undefined ? t[1] : t[2]).replace(/\\(.)/g, '$1'))
      }
    }
    cases.push({ id: `tester_${++i}`, entrada: args })
  }
  return cases
}

function compile(srcPath, mainPath, outBin) {
  const files = [srcPath]
  if (mainPath && existsSync(mainPath)) files.push(mainPath)
  const r = spawnSync('gcc', ['-w', '-o', outBin, ...files], { encoding: 'utf8' })
  return r.status === 0
}

function runBinary(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'utf8', timeout: 5000 })
  if (r.error || r.signal) return null
  return r.stdout
}

function injectIntoFile(filePath, testerReal, testsRank02) {
  let src = readFileSync(filePath, 'utf8')
  const hasTester = /\n  testerReal:/.test(src)
  const hasTests  = /\n  testsRank02:/.test(src)
  if (hasTester && hasTests) {
    return { changed: false, reason: 'testerReal y testsRank02 ya presentes' }
  }
  // Insertamos justo antes del primer `  versiones:` para mantenerlo
  // junto a los demás metadatos.
  const marker = /\n  versiones:/
  if (!marker.test(src)) {
    return { changed: false, reason: 'no se encontró `  versiones:`' }
  }
  let block = '\n'
  if (!hasTester) {
    block += `  // Tester oficial copiado literalmente desde rank02 (tester.sh).\n`
    block += `  testerReal: \`${escapeTemplate(testerReal)}\`,\n\n`
  }
  if (!hasTests && testsRank02.length) {
    block += `  // Tests derivados del tester.sh real. Las salidas se obtuvieron\n`
    block += `  // compilando la solución de rank02 con gcc -w y ejecutándola.\n`
    block += `  testsRank02: [\n`
    for (const t of testsRank02) {
      const entrada = JSON.stringify(t.entrada)
      const salida  = JSON.stringify(t.salida)
      block += `    { id: '${t.id}', entrada: ${entrada}, salida: ${salida}, fuente: 'tester.sh' },\n`
    }
    block += `  ],\n`
  }
  src = src.replace(marker, () => `${block}\n  versiones:`)
  writeFileSync(filePath, src)
  return { changed: true }
}

const targets = process.argv.slice(2)

async function listAll() {
  const fs = await import('node:fs')
  const out = []
  for (const rankLevel of Object.keys(LEVEL_MAP)) {
    const dir = join(REPO_ROOT, 'rank02', rankLevel)
    if (!fs.existsSync(dir)) continue
    for (const id of fs.readdirSync(dir).sort()) out.push(`${rankLevel}/${id}`)
  }
  return out
}

const finalTargets = targets.length ? targets : await listAll()

const workDir = mkdtempSync(join(tmpdir(), 'rank02-tests-'))
process.on('exit', () => { try { rmSync(workDir, { recursive: true, force: true }) } catch {} })

let changed = 0, skipped = 0, compileFails = 0, runFails = 0

for (const t of finalTargets) {
  const [rankLevel, id] = t.split('/')
  const platformLevel = LEVEL_MAP[rankLevel]
  if (!platformLevel) { skipped++; continue }
  const exDir   = join(REPO_ROOT, 'rank02', rankLevel, id)
  const srcC    = join(exDir, `${id}.c`)
  const mainC   = join(exDir, 'main.c')
  const tester  = join(exDir, 'tester.sh')
  const target  = join(REPO_ROOT, 'src/data/exercises', `level${platformLevel}`, `${id}.js`)

  if (!existsSync(srcC) || !existsSync(target)) { skipped++; continue }

  const testerText = existsSync(tester) ? readFileSync(tester, 'utf8') : ''
  const cases = parseTesterCases(testerText)

  let testsRank02 = []
  if (cases.length) {
    const bin = join(workDir, `${id}.out`)
    const ok = compile(srcC, existsSync(mainC) ? mainC : null, bin)
    if (!ok) {
      console.log(`- ${t}: gcc falló al compilar; sólo guardo testerReal`)
      compileFails++
    } else {
      for (const c of cases) {
        const out = runBinary(bin, c.entrada)
        if (out === null) { runFails++; continue }
        testsRank02.push({ id: c.id, entrada: c.entrada, salida: out })
      }
    }
  }

  if (!testerText && !testsRank02.length) { skipped++; continue }

  const r = injectIntoFile(target, testerText, testsRank02)
  if (r.changed) {
    console.log(`✓ ${t}: ${testsRank02.length} tests + testerReal`)
    changed++
  } else {
    console.log(`- ${t}: ${r.reason}`)
    skipped++
  }
}

console.log(`\nresumen: ${changed} cambiados, ${skipped} sin tocar, ${compileFails} no compilan, ${runFails} runs fallidos`)
