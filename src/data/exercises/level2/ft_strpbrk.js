export default {
  id: 'ft_strpbrk',
  nombre: 'ft_strpbrk',
  nivel: 2,
  dificultad: 'difícil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_strpbrk.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_strpbrk
Expected files   : ft_strpbrk.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that searches the string s1 for any of the bytes in the
string s2. It returns a pointer to the first occurrence in s1 of any of the
bytes in s2, or NULL if none found.

char\t*ft_strpbrk(char *s1, char *s2);

Example:
ft_strpbrk("hello", "lo")   → pointer to "llo" (first l at index 2)
ft_strpbrk("hello", "xyz")  → NULL`,

  descripcion: 'Función que busca en s1 el primer carácter que también aparezca en s2. Devuelve PUNTERO al punto de s1 donde lo encuentra, o NULL. La trampa crítica: devolver &s1[i], no s1[i].',

  palacio: {
    habitacion: 'salon',
    mueble: 'pecera',
    personaje: 'El Pescador de caracteres',
    emoji: '🎣',
    historia: `En la pecera del salón vive el Pescador de caracteres.
Le lanzas su caña con el cebo s2 (conjunto de chars a buscar).
Recorre el mar de s1 buscando el primer char que coincida con alguno del cebo.
Cuando lo pesca, NO te da el char solo — te da EL ANZUELO COMPLETO desde ahí (puntero).
Si no pesca nada, devuelve NULL. ¡NUNCA devuelve el char, sino el puntero!`,
    anclas: [
      "return &s1[i]  ← PUNTERO al primer match (NO s1[i])",
      "return NULL  ← si no hay match (no '\\0' ni vacío)",
      "doble while: externo por s1, interno por s2",
      "La trampa: confundir puntero con valor",
      "el retorno es char* (puntero), no char (valor)",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función busca la primera letra del string que aparezca en un conjunto de caracteres.
Avanza por el string principal letra a letra.
Para cada letra, la compara con todas las letras del conjunto.
Si la encuentra, devuelve un puntero a esa posición en el string original.
Si recorre todo el string sin encontrar ninguno del conjunto, devuelve NULL.`,
    datosPuros: [
      { elemento: 'char *ft_strpbrk(const char *s1, const char *s2)', nota: 'devuelve char* (puntero dentro de s1), no un índice' },
      { elemento: 'return ((char *)&s1[i])', nota: 'devuelve PUNTERO al carácter encontrado, no su posición numérica' },
      { elemento: 'return (NULL)', nota: 'si no encuentra ningún carácter del conjunto' },
    ],
    asociaciones: [
      { dato: 'devuelve puntero (no índice)', imagen: 'strpbrk es un sabueso que olfatea el string. Cuando encuentra el olor buscado, no te dice "está en la posición 5" sino que te LLEVA hasta allí y te señala con la pata (devuelve el puntero). strspn (su primo) solo dice el número.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "hello",
      "modo": "buscar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (s1[i])",
        "porque": "Recorre la cadena principal.",
        "concepto": "strings"
      },
      {
        "codigo": "  while (s2[j])",
        "porque": "Para cada carácter, revisa todo el conjunto s2.",
        "concepto": "bucles"
      },
      {
        "codigo": "    if (s1[i] == s2[j]) return (&s1[i]);",
        "porque": "Devuelve el puntero al primer carácter que aparezca en s2.",
        "concepto": "punteros"
      },
      {
        "codigo": "return (NULL);",
        "porque": "Si ninguno coincide, devuelve NULL.",
        "concepto": "punteros"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué devolver &s1[i] y no el índice?",
        "respuesta": "strpbrk devuelve un puntero a la posición encontrada dentro de la cadena original."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Recorre s1; para cada char, busca si está en s2; devuelve &s1[i] si sí',
    formula: 'for (i=0; s1[i]; i++) if (ft_isin(s1[i], s2)) return &s1[i]; return NULL;',
    ejemplo: {
      entrada: 's1="hello", s2="lo"',
      calculo: 'h: not in s2; e: not in s2; l: IN s2 → return &s1[2] = "llo"',
      resultado: 'puntero a "llo" (substring desde l)',
    },
  },

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con función auxiliar',
      descripcion: 'Separa la búsqueda en s2 en ft_isin(). La más legible.',
      recomendada: true,
      codigo: `static int\tft_isin(char c, char *s2)
{
\tint\tj;

\tj = 0;
\twhile (s2[j])
\t{
\t\tif (s2[j] == c)
\t\t\treturn (1);
\t\tj++;
\t}
\treturn (0);
}

char\t*ft_strpbrk(char *s1, char *s2)
{
\tint\ti;

\ti = 0;
\twhile (s1[i])
\t{
\t\tif (ft_isin(s1[i], s2))
\t\t\treturn (&s1[i]);
\t\ti++;
\t}
\treturn (NULL);
}`,
    },
    {
      id: 'doble_while',
      nombre: 'Con doble while anidado',
      descripcion: 'Sin función auxiliar. Más compacta pero más difícil de leer.',
      recomendada: false,
      codigo: `char\t*ft_strpbrk(char *s1, char *s2)
{
\tint\ti;
\tint\tj;

\ti = 0;
\twhile (s1[i])
\t{
\t\tj = 0;
\t\twhile (s2[j])
\t\t{
\t\t\tif (s1[i] == s2[j])
\t\t\t\treturn (&s1[i]);
\t\t\tj++;
\t\t}
\t\ti++;
\t}
\treturn (NULL);
}`,
    },
  ],

  tests: [
    { id: 'test_hello_lo', descripcion: '"hello","lo" → "llo" (primer l en pos 2)', entrada: ['hello', 'lo'], salida: 'llo\n', tipo: 'normal' },
    { id: 'test_sin_match', descripcion: '"hello","xyz" → (null)', entrada: ['hello', 'xyz'], salida: '(null)\n', tipo: 'normal' },
    { id: 'test_primer_char', descripcion: '"hello","h" → "hello" (h es el primer char)', entrada: ['hello', 'h'], salida: 'hello\n', tipo: 'normal' },
    { id: 'test_ultimo_char', descripcion: '"hello","o" → "o" (o es el último char)', entrada: ['hello', 'o'], salida: 'o\n', tipo: 'normal' },
    { id: 'test_s1_vacio', descripcion: '"","abc" → (null)', entrada: ['', 'abc'], salida: '(null)\n', tipo: 'edge' },
    { id: 'test_s2_vacio', descripcion: '"hello","" → (null) (s2 vacío, nada que buscar)', entrada: ['hello', ''], salida: '(null)\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 's1="hello", s2="lo": i=0, "h" no en s2',
      codigo: `i=0, s1[0]='h'
ft_isin('h', "lo"):  l≠h, o≠h, \\0 → return 0
→ i++, i=1`,
      variables: [
        { nombre: 'i', valor: '1', cambio: true, nota: '' },
        { nombre: 's1[0]', valor: "'h': no en s2", cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=1, "e" no en s2',
      codigo: `s1[1]='e'
ft_isin('e', "lo"): l≠e, o≠e, \\0 → return 0
→ i++, i=2`,
      variables: [
        { nombre: 'i', valor: '2', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'i=2, "l" SÍ en s2 → return &s1[2]',
      codigo: `s1[2]='l'
ft_isin('l', "lo"): l=='l' → return 1
→ return &s1[2]
// &s1[2] apunta al inicio de "llo"`,
      variables: [
        { nombre: 's1[2]', valor: "'l': SÍ en s2 ← MATCH", cambio: false, nota: '' },
        { nombre: 'retorno', valor: '&s1[2] → "llo"', cambio: true, nota: '← PUNTERO, no el char "l" solo' },
      ],
    },
    {
      paso: 4,
      titulo: 'No encontrado → return NULL',
      codigo: `// Con s2="xyz" en "hello":
// h,e,l,l,o: ninguno en "xyz"
// s1[5]='\\0' → while FALSE → sale
return (NULL)`,
      variables: [
        { nombre: 'retorno', valor: 'NULL', cambio: true, nota: '← printf imprime "(null)"' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'return s1[i] en vez de return &s1[i] — devuelve el char, no el puntero',
      descripcion: 'La función devuelve char* (puntero). return s1[i] sería un char (valor), no un puntero. No compila sin cast, y aunque compilara, el resultado sería incorrecto (un entero interpretado como puntero).',
      codigoMal: `// ❌ Devuelve el char, no el puntero
char *ft_strpbrk(char *s1, char *s2) {
    if (ft_isin(s1[i], s2))
        return (s1[i]);  // ← char, no char* — error de tipo
}`,
      codigoBien: `// ✅ Devuelve el puntero al char dentro de s1
if (ft_isin(s1[i], s2))
    return (&s1[i]);  // ← &s1[i] = puntero al i-ésimo byte de s1`,
    },
    {
      severidad: 'mortal',
      titulo: 'return "" en vez de return NULL cuando no hay match',
      descripcion: 'La función debe devolver NULL (el puntero nulo), no una cadena vacía. NULL y "" son cosas completamente diferentes.',
      codigoMal: `// ❌ Devuelve string vacío, no NULL
return ("");  // vacío pero no es NULL
// el caller no puede distinguir "no encontrado" de "encontrado el \\0"`,
      codigoBien: `// ✅
return (NULL);  // puntero nulo = no encontrado`,
    },
    {
      severidad: 'warning',
      titulo: 's2 vacío → return NULL (ningún char que buscar)',
      descripcion: 'Si s2="", el while interno nunca entra, ft_isin devuelve siempre 0, y nunca hay match. El comportamiento correcto es return NULL.',
      codigoMal: `// Confusión: ¿devolver s1 completo si s2 vacío?
if (!*s2) return s1;  // ← no, comportamiento incorrecto`,
      codigoBien: `// El código genérico ya maneja esto:
// si s2="" → ft_isin siempre 0 → nunca match → return NULL ✓`,
    },
  ],

  bajoCelCapot: `&s1[i] = s1 + i (aritmética de punteros).
La diferencia con strcspn: strpbrk devuelve el PUNTERO al primer match.
strcspn devuelve el ÍNDICE (entero) del primer match.
Un puntero al interior de un string es un "substring view" — no hace malloc.
NULL == 0 en C; printf("%s", NULL) imprime "(null)" en la mayoría de implementaciones.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La trampa &s1[i] vs s1[i] es la más frecuente en ejercicios con funciones que devuelven punteros a substrings.',
  relacionados: ['ft_strcspn', 'inter', 'union'],
}
