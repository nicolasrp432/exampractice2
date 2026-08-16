// Glossary of C concepts surfaced in the step-by-step visualizer.
// Each entry: { titulo, descripcion, ejemplo, verMas? }.
// Keys are referenced by the heuristic detector and by per-exercise
// declarative `conceptos: [{ matcher, id, hint }]` arrays.

export const conceptos = {
  'deref-asignacion': {
    titulo: 'Dereferencia + asignación',
    descripcion:
      'El operador * lee/escribe el valor al que apunta el puntero. ' +
      '`*p = *q` copia el contenido apuntado por q en la celda apuntada por p; ' +
      'no cambia las direcciones, solo los contenidos.',
    ejemplo: '*a = *b;   // escribe en la celda apuntada por a',
  },
  'deref-lectura': {
    titulo: 'Dereferencia (lectura)',
    descripcion:
      'Lee el valor almacenado en la dirección que contiene el puntero. ' +
      'Si el puntero es NULL o inválido, esto causa un crash.',
    ejemplo: 'int n = *p;   // n recibe el entero apuntado por p',
  },
  'puntero-decl': {
    titulo: 'Declaración de puntero',
    descripcion:
      'Un puntero guarda una DIRECCIÓN, no un valor. ' +
      '`int *p` significa "p es la dirección de un int". ' +
      'Mientras no apunte a algo válido, no se puede dereferenciar.',
    ejemplo: 'int *p;       // p contiene basura hasta que se inicialice',
  },
  'post-incremento': {
    titulo: 'Post-incremento',
    descripcion:
      '`x++` devuelve el valor ACTUAL y luego incrementa x. ' +
      'En punteros, avanza al siguiente elemento; en `str[i++]` se evalúa ' +
      'el subíndice ANTES de incrementar i.',
    ejemplo: 'char c = str[i++];   // primero usa i, después i = i + 1',
  },
  'pre-incremento': {
    titulo: 'Pre-incremento',
    descripcion:
      '`++x` incrementa primero y devuelve el nuevo valor. ' +
      'En este examen suele aparecer en bucles donde necesitas el valor ya ' +
      'incrementado en la misma expresión.',
    ejemplo: 'if (++count > 10) break;',
  },
  'loop-hasta-null': {
    titulo: 'Recorrer hasta el null-terminator',
    descripcion:
      'Las cadenas C terminan con el byte 0 (\'\\0\'). ' +
      'Un `while (*str)` o `while (str[i])` recorre hasta encontrarlo y se ' +
      'detiene. Olvidar este byte causa lecturas fuera del buffer.',
    ejemplo: 'while (*str)\\n    str++;',
  },
  'argumentos-programa': {
    titulo: 'argc / argv',
    descripcion:
      '`argc` es el número total de argumentos (incluido el nombre del programa). ' +
      '`argv[0]` es el nombre, `argv[1]…argv[argc-1]` son los argumentos del usuario. ' +
      'Accede sólo después de comprobar argc.',
    ejemplo: 'if (argc >= 2) ft_putstr(argv[1]);',
  },
  'paso-por-puntero': {
    titulo: 'Paso por referencia (puntero)',
    descripcion:
      'C pasa todo por valor. Para que una función modifique una variable ' +
      'del caller hay que pasarle SU DIRECCIÓN (`&var`) y la función la modifica ' +
      'dereferenciando.',
    ejemplo: 'ft_swap(&a, &b);   // dentro: *a, *b',
  },
  'recursion': {
    titulo: 'Recursión',
    descripcion:
      'Una función que se llama a sí misma. Cada llamada apila un nuevo frame con ' +
      'sus propias variables; al volver, se restauran los del frame anterior. ' +
      'Necesita un caso base, si no, stack overflow.',
    ejemplo: 'rev_print(str + 1); write(1, str, 1);',
  },
  'asignacion-array': {
    titulo: 'Asignación a celda de array',
    descripcion:
      'Escribir en `arr[i]` modifica el i-ésimo byte/elemento del array. ' +
      'El índice debe estar dentro de [0, longitud) — escribir fuera corrompe ' +
      'memoria adyacente.',
    ejemplo: 'dest[i] = src[i];   // copia un byte',
  },
  'comparacion-strings': {
    titulo: 'Comparación de cadenas',
    descripcion:
      'En C, comparar `s1 == s2` compara DIRECCIONES, no contenido. Para comparar ' +
      'contenido se recorre carácter a carácter hasta encontrar diferencia o el `\\0`.',
    ejemplo: 'while (*s1 && *s1 == *s2) { s1++; s2++; }',
  },
  'malloc-check': {
    titulo: 'Reserva dinámica + check',
    descripcion:
      '`malloc` devuelve un puntero a memoria del heap, o NULL si falla. ' +
      'Siempre comprueba el resultado antes de usarlo, y libera con `free` cuando ' +
      'termines.',
    ejemplo: 'p = malloc(n);\\nif (!p) return (NULL);',
  },
  'modulo-fizzbuzz': {
    titulo: 'Operador módulo',
    descripcion:
      '`a % b` da el resto de dividir a entre b. Es la herramienta clave para ' +
      'detectar múltiplos: `x % 3 == 0` significa "x es múltiplo de 3".',
    ejemplo: 'if (i % 15 == 0) write(1, "fizzbuzz", 8);',
  },
}

export function getConcepto(id) {
  return conceptos[id] || null
}
