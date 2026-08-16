#!/usr/bin/env node
// scripts/inject-subject-real.mjs
//
// Para cada ejercicio listado, lee el sub.txt real desde rank02/<rankLevel>/<id>
// e inserta el campo subjectReal justo antes de `  descripcion:` en el archivo
// src/data/exercises/<platformLevel>/<id>.js
//
// Idempotente: si subjectReal ya existe, no hace nada.
// No toca ningún otro campo. Si subject existente difiere del real, no lo
// modifica — eso lo decide cada fase 1 a mano (solo para los críticos).

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')

const LEVEL_MAP = { level0: 1, level1: 2, level2: 3, level3: 4 }

function escapeTemplateLiteral(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

function readSubject(rankLevel, id) {
  const p = join(REPO_ROOT, 'rank02', rankLevel, id, 'sub.txt')
  if (!existsSync(p)) return null
  return readFileSync(p, 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '')
}

function insertSubjectReal(filePath, subject) {
  let src = readFileSync(filePath, 'utf8')
  if (src.includes('subjectReal:')) {
    return { changed: false, reason: 'subjectReal ya presente' }
  }
  // Insertamos antes de la línea que contiene `descripcion:` al nivel raíz
  // del objeto (2 espacios + "descripcion:").
  const marker = /\n  descripcion:/
  if (!marker.test(src)) {
    return { changed: false, reason: 'no se encontró marcador `  descripcion:`' }
  }
  const block =
    `\n  // Subject literal del repo rank02 (sub.txt). Útil para comparar con\n` +
    `  // el subject didáctico activo y para la pestaña "Examen real".\n` +
    `  subjectReal: \`${escapeTemplateLiteral(subject)}\`,\n`
  // OJO: en String.prototype.replace, el segundo argumento como STRING
  // interpreta $& $' $` $n $$ — y nuestros sub.txt contienen literalmente
  // "$" (prompts del shell). Usamos una función para evitar esa expansión.
  src = src.replace(marker, () => `${block}\n  descripcion:`)
  writeFileSync(filePath, src)
  return { changed: true }
}

const targets = process.argv.slice(2)
if (!targets.length) {
  console.error('Uso: node scripts/inject-subject-real.mjs <rankLevel/id> [...]')
  console.error('Ejemplo: node scripts/inject-subject-real.mjs level0/first_word level0/ft_swap')
  process.exit(2)
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
  const subject = readSubject(rankLevel, id)
  if (!subject) {
    console.error(`✗ ${t}: sub.txt no existe`)
    skipped++
    continue
  }
  const file = join(REPO_ROOT, 'src/data/exercises', `level${platformLevel}`, `${id}.js`)
  if (!existsSync(file)) {
    console.error(`✗ ${t}: ${file} no existe`)
    skipped++
    continue
  }
  const r = insertSubjectReal(file, subject)
  if (r.changed) {
    console.log(`✓ ${t}: subjectReal insertado`)
    changed++
  } else {
    console.log(`- ${t}: ${r.reason}`)
    skipped++
  }
}
console.log(`\nresumen: ${changed} cambiados, ${skipped} sin tocar`)
