#!/usr/bin/env node
// scripts/inject-rank02-version.mjs
//
// Lee la solución de cada ejercicio en rank02/<rankLevel>/<id>/<id>.c y la
// añade como nueva entrada al final del array `versiones:` del ejercicio
// correspondiente en src/data/exercises/.
//
// Idempotente: si ya hay una versión con id === 'rank02', no hace nada.
//
// La inserción es puramente sintáctica: busca el cierre del array
// `versiones: [` y mete una entrada nueva antes del cierre. Por eso no toca
// ninguna versión existente.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')

const LEVEL_MAP = { level0: 1, level1: 2, level2: 3, level3: 4 }

function escapeTemplate(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

function readSolution(rankLevel, id) {
  const p = join(REPO_ROOT, 'rank02', rankLevel, id, `${id}.c`)
  if (!existsSync(p)) return null
  // Quitamos cabeceras 42 (los bloques /* *** ... *** */) para no inflar la UI
  let raw = readFileSync(p, 'utf8').replace(/\r\n/g, '\n')
  const header42 = /^\/\*\s*\*+\s*\*\/\s*\n([\s\S]*?)\/\*\s*\*+\s*\*\/\s*\n+/
  raw = raw.replace(header42, '')
  return raw.replace(/\s+$/, '')
}

function injectVersion(filePath, id, solution) {
  let src = readFileSync(filePath, 'utf8')
  if (/id:\s*['"]rank02['"]/.test(src)) {
    return { changed: false, reason: 'versión rank02 ya presente' }
  }
  // Buscamos el final del array versiones: [...]
  // Estrategia: localizamos `  versiones: [` y emparejamos corchetes hasta
  // encontrar el `]` de cierre del array (no de objetos internos).
  const startMatch = src.match(/\n  versiones:\s*\[/)
  if (!startMatch) {
    return { changed: false, reason: 'no se encontró `  versiones: [`' }
  }
  let depth = 0
  let i = startMatch.index + startMatch[0].length - 1   // posición del '['
  for (; i < src.length; i++) {
    const c = src[i]
    if (c === '[') depth++
    else if (c === ']') {
      depth--
      if (depth === 0) break
    }
  }
  if (depth !== 0) {
    return { changed: false, reason: 'array versiones no cerrado correctamente' }
  }
  // i apunta al `]` de cierre. Buscamos hacia atrás el último `}` de la
  // última versión (debería estar precedido de coma o no).
  let insertAt = i
  // Retrocedemos saltando espacios para detectar si ya hay coma trailing.
  let j = insertAt - 1
  while (j > 0 && /\s/.test(src[j])) j--
  const needsComma = src[j] !== ','
  const entry =
    (needsComma ? ',' : '') +
    `\n    {\n` +
    `      id: 'rank02',\n` +
    `      nombre: 'Versión rank02 (solución de referencia)',\n` +
    `      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',\n` +
    `      recomendada: false,\n` +
    `      origen: 'rank02',\n` +
    `      codigo: \`${escapeTemplate(solution)}\`,\n` +
    `    },\n  `
  src = src.slice(0, insertAt) + entry + src.slice(insertAt)
  writeFileSync(filePath, src)
  return { changed: true }
}

const targets = process.argv.slice(2)
if (!targets.length) {
  // Sin args: aplicar a todos los ejercicios mapeables.
  const { readdirSync } = await import('node:fs')
  for (const [rankLevel] of Object.entries(LEVEL_MAP)) {
    const dir = join(REPO_ROOT, 'rank02', rankLevel)
    for (const id of readdirSync(dir).sort()) {
      targets.push(`${rankLevel}/${id}`)
    }
  }
}

let changed = 0, skipped = 0
for (const t of targets) {
  const [rankLevel, id] = t.split('/')
  const platformLevel = LEVEL_MAP[rankLevel]
  if (!platformLevel) {
    console.error(`✗ ${t}: rankLevel inválido`)
    skipped++
    continue
  }
  const solution = readSolution(rankLevel, id)
  if (!solution) {
    console.error(`✗ ${t}: solución .c no existe`)
    skipped++
    continue
  }
  const file = join(REPO_ROOT, 'src/data/exercises', `level${platformLevel}`, `${id}.js`)
  if (!existsSync(file)) {
    console.error(`- ${t}: ${file} no existe en plataforma`)
    skipped++
    continue
  }
  const r = injectVersion(file, id, solution)
  if (r.changed) {
    console.log(`✓ ${t}: versión rank02 añadida`)
    changed++
  } else {
    console.log(`- ${t}: ${r.reason}`)
    skipped++
  }
}
console.log(`\nresumen: ${changed} cambiados, ${skipped} sin tocar`)
