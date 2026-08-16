const REQUIRED_FIELDS = [
  'id', 'nombre', 'nivel', 'dificultad', 'tipoEntrega',
  'archivosEsperados', 'funcionesPermitidas', 'subject', 'descripcion',
  'palacio', 'herramientas', 'formulaClave', 'versiones',
  'tests', 'gdbSteps', 'trampas', 'bajoCelCapot',
  'estrategia', 'razonEstrategia',
]

const PALACIO_REQUIRED = ['habitacion', 'personaje', 'emoji', 'historia', 'anclas']
const VALID_NIVELES = [1, 2, 3, 4]
const VALID_DIFICULTADES = ['fácil', 'medio', 'difícil']
const VALID_TIPO_ENTREGA = ['programa', 'función', 'funcion']
const VALID_HABITACIONES = ['cocina', 'salón', 'dormitorio', 'garaje']
const VALID_ESTRATEGIAS = ['MEMORIZAR', 'ENTENDER', 'AMBOS']
const VALID_ESTADOS = ['no_iniciado', 'estudiando', 'practicando', 'dominado']

export function validateExercise(data) {
  const errors = []

  // Campos raíz obligatorios
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`Campo requerido faltante: "${field}"`)
    }
  }

  // Enumeraciones
  if (data.nivel !== undefined && !VALID_NIVELES.includes(data.nivel))
    errors.push(`nivel inválido: ${data.nivel}. Debe ser 1, 2, 3 o 4`)

  if (data.dificultad && !VALID_DIFICULTADES.includes(data.dificultad))
    errors.push(`dificultad inválida: "${data.dificultad}"`)

  if (data.tipoEntrega && !VALID_TIPO_ENTREGA.includes(data.tipoEntrega))
    errors.push(`tipoEntrega inválido: "${data.tipoEntrega}"`)

  if (data.estrategia && !VALID_ESTRATEGIAS.includes(data.estrategia))
    errors.push(`estrategia inválida: "${data.estrategia}"`)

  // Palacio
  if (data.palacio && typeof data.palacio === 'object') {
    for (const field of PALACIO_REQUIRED) {
      if (!data.palacio[field])
        errors.push(`palacio.${field} faltante`)
    }
    if (data.palacio.habitacion && !VALID_HABITACIONES.includes(data.palacio.habitacion))
      errors.push(`palacio.habitacion inválida: "${data.palacio.habitacion}"`)
    if (data.palacio.anclas && !Array.isArray(data.palacio.anclas))
      errors.push('palacio.anclas debe ser un array')
    if (Array.isArray(data.palacio.anclas) && data.palacio.anclas.length < 2)
      errors.push('palacio.anclas debe tener al menos 2 anclas')
  }

  // Tests
  if (Array.isArray(data.tests)) {
    if (data.tests.length === 0)
      errors.push('tests está vacío')
    data.tests.forEach((t, i) => {
      if (!t.id)      errors.push(`tests[${i}].id faltante`)
      if (t.salida === undefined) errors.push(`tests[${i}].salida faltante`)
      if (!Array.isArray(t.entrada)) errors.push(`tests[${i}].entrada debe ser array`)
      if (!['normal', 'edge'].includes(t.tipo))
        errors.push(`tests[${i}].tipo inválido: "${t.tipo}"`)
      // Verificar que la salida termine en \n (excepto funciones que retornan valor)
      if (typeof t.salida === 'string' && t.salida.length > 0 && !t.salida.endsWith('\n'))
        errors.push(`tests[${i}] "${t.id}": salida debe terminar en \\n (byte a byte)`)
    })
  }

  // Versiones
  if (Array.isArray(data.versiones)) {
    if (data.versiones.length === 0)
      errors.push('versiones está vacío')
    const hayRecomendada = data.versiones.some(v => v.recomendada)
    if (!hayRecomendada)
      errors.push('ninguna versión está marcada como recomendada')
  }

  // Progreso
  if (data.progreso && typeof data.progreso === 'object') {
    if (!VALID_ESTADOS.includes(data.progreso.estado))
      errors.push(`progreso.estado inválido: "${data.progreso.estado}"`)
  }

  return { valid: errors.length === 0, errors }
}

export function validateAll(exercises) {
  const results = []
  for (const ex of exercises) {
    const { valid, errors } = validateExercise(ex)
    if (!valid) results.push({ id: ex.id || '?', errors })
  }
  return { allValid: results.length === 0, failures: results }
}

// ── Campos opcionales añadidos por la integración con rank02 ──────────────────
// Ninguno es obligatorio. validateExercise NO los exige.
// validateOptionalRank02 los valida solo si están presentes, para que el día
// que un ejercicio los declare, no se cuele un campo malformado.
//
// Campos a nivel raíz:
//   - subjectReal:         string. Subject literal del repo rank02 (sub.txt).
//   - subjectAlternativo:  string. Subject didáctico anterior, conservado.
//   - mainReal:            string. Contenido del main.c real (cuando rank02 lo trae).
//   - testerReal:          string. Contenido del tester.sh oficial.
//   - testsRank02:         array de tests derivados del tester.sh.
//
// Campos opcionales en versiones[i]:
//   - origen: 'plataforma' | 'rank02' | 'didactica'
//
// Campos opcionales en gdbSteps[i] / o caminos GDB:
//   - fuente: 'didactica' | 'real'
//   - linea:  number (línea del código de la versión recomendada)
//
// Esquema futuro de gdbCaminos (opcional, alternativo a gdbSteps):
//   [{ id, nombre, pasos: [...] }]
const VALID_VERSION_ORIGENES = ['plataforma', 'rank02', 'didactica']
const VALID_GDB_FUENTES      = ['didactica', 'real']

export function validateOptionalRank02(data) {
  const errors = []

  if (data.subjectEs !== undefined && typeof data.subjectEs !== 'string')
    errors.push('subjectEs debe ser string')

  if (data.razonamiento !== undefined) {
    if (typeof data.razonamiento !== 'object' || data.razonamiento === null) {
      errors.push('razonamiento debe ser un objeto')
    } else {
      const raz = data.razonamiento
      if (raz.porQue !== undefined && typeof raz.porQue !== 'string')
        errors.push('razonamiento.porQue debe ser string')
      if (raz.animacionFlujo !== undefined && !['string', 'flag', 'bits', 'pointer'].includes(raz.animacionFlujo))
        errors.push('razonamiento.animacionFlujo debe ser: string, flag, bits o pointer')
      if (raz.qa !== undefined) {
        if (!Array.isArray(raz.qa)) {
          errors.push('razonamiento.qa debe ser un array')
        } else {
          raz.qa.forEach((qItem, idx) => {
            if (!qItem || typeof qItem !== 'object') {
              errors.push(`razonamiento.qa[${idx}] debe ser un objeto`)
            } else {
              if (typeof qItem.pregunta !== 'string') errors.push(`razonamiento.qa[${idx}].pregunta debe ser string`)
              if (typeof qItem.respuesta !== 'string') errors.push(`razonamiento.qa[${idx}].respuesta debe ser string`)
            }
          })
        }
      }
    }
  }

  if (data.subjectReal !== undefined && typeof data.subjectReal !== 'string')
    errors.push('subjectReal debe ser string')
  if (data.subjectAlternativo !== undefined && typeof data.subjectAlternativo !== 'string')
    errors.push('subjectAlternativo debe ser string')
  if (data.mainReal !== undefined && typeof data.mainReal !== 'string')
    errors.push('mainReal debe ser string')
  if (data.testerReal !== undefined && typeof data.testerReal !== 'string')
    errors.push('testerReal debe ser string')

  if (data.testsRank02 !== undefined) {
    if (!Array.isArray(data.testsRank02)) {
      errors.push('testsRank02 debe ser array')
    } else {
      data.testsRank02.forEach((t, i) => {
        if (!t || typeof t !== 'object') {
          errors.push(`testsRank02[${i}] debe ser objeto`)
          return
        }
        if (!t.id) errors.push(`testsRank02[${i}].id faltante`)
        if (!Array.isArray(t.entrada)) errors.push(`testsRank02[${i}].entrada debe ser array`)
        if (t.salida === undefined) errors.push(`testsRank02[${i}].salida faltante`)
        if (t.fuente !== undefined && t.fuente !== 'tester.sh')
          errors.push(`testsRank02[${i}].fuente inválida: "${t.fuente}"`)
      })
    }
  }

  if (Array.isArray(data.versiones)) {
    data.versiones.forEach((v, i) => {
      if (v && v.origen !== undefined && !VALID_VERSION_ORIGENES.includes(v.origen))
        errors.push(`versiones[${i}].origen inválido: "${v.origen}"`)
    })
  }

  if (Array.isArray(data.gdbSteps)) {
    data.gdbSteps.forEach((s, i) => {
      if (s && s.fuente !== undefined && !VALID_GDB_FUENTES.includes(s.fuente))
        errors.push(`gdbSteps[${i}].fuente inválida: "${s.fuente}"`)
      if (s && s.linea !== undefined && !Number.isInteger(s.linea))
        errors.push(`gdbSteps[${i}].linea debe ser entero`)
    })
  }

  if (data.gdbCaminos !== undefined) {
    if (!Array.isArray(data.gdbCaminos)) {
      errors.push('gdbCaminos debe ser array')
    } else {
      data.gdbCaminos.forEach((c, i) => {
        if (!c || typeof c !== 'object') {
          errors.push(`gdbCaminos[${i}] debe ser objeto`)
          return
        }
        if (!c.id)     errors.push(`gdbCaminos[${i}].id faltante`)
        if (!c.nombre) errors.push(`gdbCaminos[${i}].nombre faltante`)
        if (!Array.isArray(c.pasos))
          errors.push(`gdbCaminos[${i}].pasos debe ser array`)
      })
    }
  }

  return { valid: errors.length === 0, errors }
}

export const EXERCISE_SCHEMA_VERSION = '1.1'
