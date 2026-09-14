// src/utils/norminette.js
/**
 * Verificador estricto de la Norma 42 para código C
 * Valida restricciones como longitud de línea, bucles 'for', includes prohibidos,
 * número de líneas por función, etc.
 */
export function run42NormCheck(code = '', filename = 'solution.c') {
  if (!code || typeof code !== 'string') {
    return {
      stdout: `${filename}: KO por archivo vacío.\n`,
      stderr: 'Error: El código fuente está vacío.',
      exitCode: 1,
    }
  }

  const lines = code.split('\n')
  const errors = []
  const warnings = []

  // 1. Longitud de línea > 80 columnas
  lines.forEach((line, idx) => {
    const expandedLen = line.replace(/\t/g, '    ').length
    if (expandedLen > 80) {
      errors.push(`Error: LINE_TOO_LONG (line ${idx + 1}, col ${expandedLen}): Línea de ${expandedLen} caracteres (máximo 80 en la Norma 42).`)
    }
  })

  // 2. Bucles 'for' prohibidos (sólo 'while' en 42)
  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (/^for\s*\(/.test(trimmed) || /\s+for\s*\(/.test(line)) {
      errors.push(`Error: FOR_FORBIDDEN (line ${idx + 1}): Bucle 'for' prohibido por la Norma 42. Debes usar 'while'.`)
    }
  })

  // 3. Librerías no permitidas (ej. stdio.h)
  lines.forEach((line, idx) => {
    if (/#include\s*<stdio\.h>/.test(line)) {
      warnings.push(`Warning: FORBIDDEN_INCLUDE (line ${idx + 1}): '<stdio.h>' está prohibido si el ejercicio sólo permite 'write'. Elimina printf antes de la entrega final.`)
    }
  })

  // 4. Múltiples sentencias en una misma línea
  lines.forEach((line, idx) => {
    const cleaned = line.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '').replace(/\/\/.*$/, '')
    const semicolons = (cleaned.match(/;/g) || []).length
    if (semicolons > 1 && !line.includes('for(')) {
      warnings.push(`Warning: MULTIPLE_STATEMENTS (line ${idx + 1}): Más de una instrucción en la misma línea.`)
    }
  })

  // 5. Tamaño de función (> 25 líneas)
  let insideFunc = false
  let funcLines = 0
  let funcName = ''
  lines.forEach((line, idx) => {
    if (/^[a-zA-Z0-9_*]+\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{?/.test(line)) {
      insideFunc = true
      funcLines = 0
      funcName = line.match(/[a-zA-Z0-9_]+\s*\(/)?.[0] || 'función'
    } else if (insideFunc) {
      if (line.trim() === '}') {
        if (funcLines > 25) {
          errors.push(`Error: TOO_MANY_LINES (line ${idx + 1}): ${funcName} tiene ${funcLines} líneas (el límite de la Norma 42 son 25 líneas por función).`)
        }
        insideFunc = false
      } else {
        funcLines++
      }
    }
  })

  // 6. Asignaciones y declaraciones prohibidas
  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    // Inicialización al declarar variable
    if (/^(int|char|void|long|float|double|size_t)\s+[*a-zA-Z0-9_]+\s*=\s*[^;]+;/.test(trimmed)) {
      warnings.push(`Warning: DECLARATION_ASSIGNMENT (line ${idx + 1}): Inicializar variables en la declaración está desaconsejado en la Norma 42 (declara primero, asigna después).`)
    }
  })

  const exitCode = errors.length > 0 ? 1 : 0
  let stdout = ''
  if (errors.length === 0) {
    stdout = `${filename}: OK! (Cumple los estándares de la Norma 42)\n`
    if (warnings.length > 0) {
      stdout += `Avisos informativos:\n` + warnings.map(w => `  ${w}`).join('\n') + '\n'
    }
  } else {
    stdout = `${filename}: KO por Norma 42!\n` + errors.map(e => `  ${e}`).join('\n') + '\n'
  }

  const stderr = warnings.length > 0 && errors.length > 0
    ? warnings.map(w => `  ${w}`).join('\n')
    : ''

  return { stdout, stderr, exitCode }
}
