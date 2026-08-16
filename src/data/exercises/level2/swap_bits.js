export default {
  id: 'swap_bits',
  nombre: 'swap_bits',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['swap_bits.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : swap_bits
Expected files   : swap_bits.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that takes a byte, swaps its halves like the example and
returns the result.

unsigned char\tswap_bits(unsigned char octet);

Example:
swap_bits(1)  → 16   (00000001 → 00010000)
swap_bits(16) → 1    (00010000 → 00000001)
swap_bits(65) → 20   (01000001 → 00010100)`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : swap_bits
Expected files   : swap_bits.c
Allowed functions:
--------------------------------------------------------------------------------

Write a function that takes a byte, swaps its halves (like the example) and
returns the result.

Your function must be declared as follows:

unsigned char	swap_bits(unsigned char octet);

Example:

  1 byte
_____________
 0100 | 0001
     \\ /
     / \\
 0001 | 0100`,

  descripcion: 'Función que intercambia los dos nibbles (mitades de 4 bits) de un byte. El nibble bajo (bits 0-3) pasa a ser el alto (bits 4-7) y viceversa. Fórmula: (octet << 4) | (octet >> 4).',

  palacio: {
    habitacion: 'salon',
    mueble: 'ventilador',
    personaje: 'El Intercambiador de Nibbles',
    emoji: '🌀',
    historia: `En el salón hay un Ventilador que hace girar los nibbles de un byte.
Un byte tiene dos mitades: nibble alto (bits 4-7) y nibble bajo (bits 0-3).
El Ventilador toma el nibble bajo y lo sube a la posición alta (shift left 4).
Toma el nibble alto y lo baja a la posición baja (shift right 4).
Combina ambas partes con OR y listo: los nibbles están intercambiados.`,
    anclas: [
      "nibble bajo: octet & 0x0F (0000 1111) → bits 0-3",
      "nibble alto: octet & 0xF0 (1111 0000) → bits 4-7",
      "bajo al alto: (octet & 0x0F) << 4",
      "alto al bajo: (octet & 0xF0) >> 4",
      "return ((octet << 4) | (octet >> 4))  ← versión compacta",
    ],
  },

  herramientas: ['bits'],

  campayoMetodo: {
    feynman: `La función recibe un byte y devuelve ese mismo byte con los 4 bits altos y los 4 bits bajos intercambiados.
El nibble alto (bits 7-4) pasa a la posición baja (bits 3-0) y viceversa.
La fórmula es: resultado = (byte >> 4) | (byte << 4).
Los 4 bits de arriba se desplazan 4 posiciones a la derecha.
Los 4 bits de abajo se desplazan 4 posiciones a la izquierda.
El OR los combina.`,
    datosPuros: [
      { elemento: '(byte >> 4) | (byte << 4)', nota: 'la fórmula completa — shift derecho e izquierdo con OR' },
      { elemento: 'unsigned char swap_bits(unsigned char octet)', nota: 'devuelve y recibe unsigned char' },
    ],
    asociaciones: [
      { dato: '>> 4 | << 4', imagen: 'El byte es un sándwich de 2 capas de 4 bits. Para intercambiarlas: bajas la capa de arriba 4 pisos (>> 4) y subes la de abajo 4 pisos (<< 4). El OR (|) une las dos capas ya intercambiadas en el nuevo sándwich.' },
    ],
  },

  animacion: {
    "tipo": "bits",
    "config": {
      "valor": 210,
      "modo": "swap"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "unsigned char alto = octet >> 4;",
        "porque": "Los 4 bits altos bajan a la parte baja.",
        "concepto": "bits"
      },
      {
        "codigo": "unsigned char bajo = octet << 4;",
        "porque": "Los 4 bits bajos suben a la parte alta.",
        "concepto": "bits"
      },
      {
        "codigo": "return (alto | bajo);",
        "porque": "Combina ambas mitades intercambiadas con OR.",
        "concepto": "bits"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué >> 4 y << 4?",
        "respuesta": "Un nibble son 4 bits; desplazar 4 posiciones intercambia la mitad alta con la baja."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Mover nibble bajo a posición alta y nibble alto a posición baja, combinar con OR',
    formula: 'return ((octet << 4) | (octet >> 4));',
    ejemplo: {
      entrada: 'octet=1 (00000001)',
      calculo: '1<<4=16 (00010000); 1>>4=0 (00000000); 16|0=16',
      resultado: '16 (00010000)',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=swap_bits.c
file2=../../../../rendu/swap_bits/swap_bits.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

    ./out1 "a" > out1.txt 2>/dev/null
    ./out2 "a" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi


# 2. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "0" > out1.txt 2>/dev/null
    ./out2 "0" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi


# 3. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "P" > out1.txt 2>/dev/null
    ./out2 "P" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi



    rm out1 out2 out1.txt out2.txt 2>/dev/null
    echo "$(tput setaf 2)$(tput bold)PASSED 🎉$(tput sgr 0)"
    exit 1
`,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: ["a"], salida: "a\n\u0016\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["0"], salida: "0\n\u0003\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["P"], salida: "P\n\u0005\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'compacta',
      nombre: 'Compacta con shift directo',
      descripcion: 'Una línea. Solo funciona si unsigned char — los bits extras se truncan automáticamente.',
      recomendada: true,
      codigo: `unsigned char\tswap_bits(unsigned char octet)
{
\treturn ((octet << 4) | (octet >> 4));
}`,
    },
    {
      id: 'mascara',
      nombre: 'Con máscaras explícitas 0x0F y 0xF0',
      descripcion: 'Más explícita: separa nibbles con AND antes de desplazar.',
      recomendada: false,
      codigo: `unsigned char\tswap_bits(unsigned char octet)
{
\tunsigned char\tlow;
\tunsigned char\thigh;

\tlow = (octet & 0x0F) << 4;
\thigh = (octet & 0xF0) >> 4;
\treturn (low | high);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `
#include <unistd.h>

unsigned char	swap_bits(unsigned char octet)
{
	return ((octet >> 4) | (octet << 4));
}`,
    },
  ],

  tests: [
    { id: 'test_uno', descripcion: '1 (00000001) → 16 (00010000)', entrada: ['1'], salida: '16\n', tipo: 'normal' },
    { id: 'test_16', descripcion: '16 (00010000) → 1 (00000001)', entrada: ['16'], salida: '1\n', tipo: 'normal' },
    { id: 'test_65', descripcion: '65 (01000001) → 20 (00010100)', entrada: ['65'], salida: '20\n', tipo: 'normal' },
    { id: 'test_cero', descripcion: '0 (00000000) → 0', entrada: ['0'], salida: '0\n', tipo: 'edge' },
    { id: 'test_255', descripcion: '255 (11111111) → 255 (simétrico)', entrada: ['255'], salida: '255\n', tipo: 'edge' },
    { id: 'test_170', descripcion: '170 (10101010) → 170 (simétrico)', entrada: ['170'], salida: '170\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'octet=1 (00000001)',
      codigo: `octet = 1  → 00000001
nibble bajo: bits 0-3 = 0001
nibble alto: bits 4-7 = 0000`,
      variables: [
        { nombre: 'octet', valor: '1 (00000001)', cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'octet << 4 y octet >> 4',
      codigo: `octet << 4 = 1 << 4 = 16   → 00010000
// El nibble bajo (0001) sube a posición alta
octet >> 4 = 1 >> 4 = 0    → 00000000
// El nibble alto (0000) baja a posición baja`,
      variables: [
        { nombre: 'octet << 4', valor: '16 (00010000)', cambio: true, nota: '← nibble bajo→alto' },
        { nombre: 'octet >> 4', valor: '0 (00000000)', cambio: true, nota: '← nibble alto→bajo' },
      ],
    },
    {
      paso: 3,
      titulo: 'OR para combinar',
      codigo: `16 | 0 = 16
00010000
| 00000000
= 00010000 = 16
return 16`,
      variables: [
        { nombre: 'retorno', valor: '16 (00010000)', cambio: true, nota: '✓ nibbles intercambiados' },
      ],
    },
    {
      paso: 4,
      titulo: 'octet=65 (01000001): nibble bajo=0001, alto=0100',
      codigo: `65 = 01000001
65 << 4 = 00010000 (bajo=0001 → alto)  = 16... pero se trunca a 8 bits
65 << 4 en unsigned char = 00010000 = 16? No:
65 = 0100 0001
65 << 4 = 0001 0000 (el 0100 sale del byte) → 00010000 → pero como unsigned char = truncado
65 >> 4 = 0000 0100 = 4
16 | 4 = 20 → 00010100
return 20 ✓`,
      variables: [
        { nombre: 'octet', valor: '65 (01000001)', cambio: false, nota: '' },
        { nombre: 'retorno', valor: '20 (00010100)', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Usar int en vez de unsigned char → shift puede dar resultados incorrectos',
      descripcion: 'Si octet fuera un int y tuvieras bits en posiciones >7, octet << 4 podría desbordar. Con unsigned char el compilador trunca al byte automáticamente.',
      codigoMal: `// ❌ int puede tener bits extras que complican el shift
int swap_bits(int octet) { return (octet << 4) | (octet >> 4); }`,
      codigoBien: `// ✅ unsigned char: solo 8 bits
unsigned char swap_bits(unsigned char octet) {
    return ((octet << 4) | (octet >> 4));
}`,
    },
    {
      severidad: 'warning',
      titulo: 'Confundir swap_bits (nibbles) con reverse_bits (todos los bits)',
      descripcion: 'swap_bits: intercambia mitades 4+4. reverse_bits: invierte el orden completo bit a bit. Son distintos. swap_bits(1)=16; reverse_bits(1)=128.',
      codigoMal: `// ❌ Confusión: esto es reverse_bits, no swap_bits
unsigned char bit = 0;
for (int i = 0; i < 8; i++) {
    bit = bit * 2 + octet % 2;
    octet /= 2;
}`,
      codigoBien: `// ✅ swap_bits: intercambio de nibbles
return ((octet << 4) | (octet >> 4));`,
    },
  ],

  bajoCelCapot: `Un nibble es la mitad de un byte (4 bits). Un byte tiene nibble alto (bits 4-7) y bajo (bits 0-3).
0x0F = 00001111 (máscara nibble bajo)
0xF0 = 11110000 (máscara nibble alto)
(octet << 4) desplaza el nibble bajo a la posición alta (bits 4-7).
(octet >> 4) desplaza el nibble alto a la posición baja (bits 0-3).
OR combina las dos partes.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La fórmula (octet<<4)|(octet>>4) es corta pero no obvia. Hay que memorizarla junto con la visualización de nibbles.',
  relacionados: ['reverse_bits', 'print_bits', 'is_power_of_2'],
}
