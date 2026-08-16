export default {
  id: 'reverse_bits',
  nombre: 'reverse_bits',
  nivel: 2,
  dificultad: 'difícil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['reverse_bits.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : reverse_bits
Expected files   : reverse_bits.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that takes a byte, reverses its bits in order and returns
the result.

unsigned char\treverse_bits(unsigned char octet);

Example:
reverse_bits(1)   → 128   (00000001 → 10000000)
reverse_bits(2)   → 64    (00000010 → 01000000)
reverse_bits(170) → 85    (10101010 → 01010101)`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : reverse_bits
Expected files   : reverse_bits.c
Allowed functions:
--------------------------------------------------------------------------------

Write a function that takes a byte, reverses it, bit by bit (like the
example) and returns the result.

Your function must be declared as follows:

unsigned char	reverse_bits(unsigned char octet);

Example:

  1 byte
_____________
 0010  0110
	 ||
	 \\/
 0110  0100`,

  descripcion: 'Función que invierte el orden de los bits de un byte. Usa acumulación: bit = bit*2 + octet%2, octet /= 2, repetido 8 veces. Inicializar bit=0.',

  palacio: {
    habitacion: 'salon',
    mueble: 'reloj',
    personaje: 'El Reversificador de Bits',
    emoji: '🔄',
    historia: `En el salón hay un Reloj especial que lee bits en orden inverso.
El Reversificador tiene dos variables: octet (el byte original) y bit (el resultado, empieza en 0).
CADA ITERACIÓN hace dos cosas:
1. bit = bit*2 + octet%2  ← extrae el bit menos significativo y lo añade a la izquierda
2. octet = octet / 2       ← desplaza octet a la derecha (borra el bit extraído)
Después de 8 iteraciones, bit contiene los bits en orden inverso.
CLAVE: inicializar bit=0 (no 1, no octet).`,
    anclas: [
      "bit = 0  ← inicializar a 0 (¡no a otra cosa!)",
      "bit = bit * 2 + octet % 2  ← extrae LSB y construye resultado",
      "octet = octet / 2  ← desplaza derecha (equivale a >> 1)",
      "repetir 8 veces (un byte = 8 bits)",
      "return (bit)  ← el byte invertido",
    ],
  },

  herramientas: ['bits'],

  campayoMetodo: {
    feynman: `La función recibe un byte y devuelve el mismo byte con los bits en orden inverso.
El bit 7 (el mayor) se convierte en el bit 0 (el menor), y así sucesivamente.
Para cada bit del byte original, comprueba si es 1 con una máscara.
Si es 1, lo pone en la posición correspondiente del resultado (invertida).
Al terminar los 8 bits, devuelve el resultado.`,
    datosPuros: [
      { elemento: 'result |= (1 << (7 - i))', nota: 'poner el bit extraído en la posición invertida del resultado' },
      { elemento: 'if (byte & (1 << i))', nota: 'comprobar el bit i-ésimo (de derecha a izquierda)' },
      { elemento: 'unsigned char reverse_bits(unsigned char octet)', nota: 'devuelve unsigned char, recibe unsigned char' },
    ],
    asociaciones: [
      { dato: 'bit i → posición (7-i) en result', imagen: 'Es como dar la vuelta a una fila de 8 soldados. El soldado de la derecha pasa a la izquierda y viceversa. El soldado en posición i del original acaba en posición (7-i) del resultado.' },
    ],
  },

  animacion: {
    "tipo": "bits",
    "config": {
      "valor": 42,
      "modo": "revertir"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "unsigned char res = 0;",
        "porque": "Byte resultado, empieza a 0.",
        "concepto": "variables"
      },
      {
        "codigo": "int i = 0;",
        "porque": "Recorre las 8 posiciones.",
        "concepto": "variables"
      },
      {
        "codigo": "while (i < 8)",
        "porque": "Un paso por bit.",
        "concepto": "bucles"
      },
      {
        "codigo": "  res = res << 1;",
        "porque": "Hace hueco a la derecha desplazando res.",
        "concepto": "bits"
      },
      {
        "codigo": "  res = res | (octet & 1);",
        "porque": "Copia el bit más bajo de octet al hueco.",
        "concepto": "bits"
      },
      {
        "codigo": "  octet = octet >> 1;",
        "porque": "Descarta ese bit de octet.",
        "concepto": "bits"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué << en res y >> en octet a la vez?",
        "respuesta": "Sacas bits por la derecha de octet y los apilas por la izquierda de res: eso los invierte."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Extrae LSB de octet, acumúlalo en bit desplazando left. Repetir 8 veces.',
    formula: 'bit=0; for(i=0;i<8;i++){ bit=bit*2+octet%2; octet/=2; } return bit;',
    ejemplo: {
      entrada: 'octet=1 (00000001)',
      calculo: 'i=0:bit=0*2+1=1,oct=0; i=1:bit=1*2+0=2,oct=0; ...i=7:bit=128,oct=0',
      resultado: '128 (10000000)',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=reverse_bits.c
file2=../../../../rendu/reverse_bits/reverse_bits.c


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
    { id: 'tester_1', entrada: ["a"], salida: "134", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["0"], salida: "12", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["P"], salida: "10", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con while y operaciones aritméticas',
      descripcion: 'Usa * y % en vez de operadores de bits. La más clara conceptualmente.',
      recomendada: true,
      codigo: `unsigned char\treverse_bits(unsigned char octet)
{
\tunsigned char\tbit;
\tint\t\t\ti;

\tbit = 0;
\ti = 0;
\twhile (i < 8)
\t{
\t\tbit = bit * 2 + octet % 2;
\t\toctet = octet / 2;
\t\ti++;
\t}
\treturn (bit);
}`,
    },
    {
      id: 'bitwise',
      nombre: 'Con operadores de bits (<<, >>, &, |)',
      descripcion: 'Equivalente con shift y AND. Más idiomático en C para bits.',
      recomendada: false,
      codigo: `unsigned char\treverse_bits(unsigned char octet)
{
\tunsigned char\tbit;
\tint\t\t\ti;

\tbit = 0;
\ti = 0;
\twhile (i < 8)
\t{
\t\tbit = (bit << 1) | (octet & 1);
\t\toctet >>= 1;
\t\ti++;
\t}
\treturn (bit);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `unsigned char	reverse_bits(unsigned char octet)
{
	int		i = 8;
	unsigned char	res = 0;

	while (i > 0)
	{
		res = res * 2 + (octet % 2);
		octet = octet / 2;
		i--;
	}
	return (res);
}`,
    },
  ],

  tests: [
    { id: 'test_uno', descripcion: '1 (00000001) → 128 (10000000)', entrada: ['1'], salida: '128\n', tipo: 'normal' },
    { id: 'test_dos', descripcion: '2 (00000010) → 64 (01000000)', entrada: ['2'], salida: '64\n', tipo: 'normal' },
    { id: 'test_170', descripcion: '170 (10101010) → 85 (01010101)', entrada: ['170'], salida: '85\n', tipo: 'normal' },
    { id: 'test_cero', descripcion: '0 (00000000) → 0 (00000000)', entrada: ['0'], salida: '0\n', tipo: 'edge' },
    { id: 'test_255', descripcion: '255 (11111111) → 255 (11111111)', entrada: ['255'], salida: '255\n', tipo: 'edge' },
    { id: 'test_128', descripcion: '128 (10000000) → 1 (00000001)', entrada: ['128'], salida: '1\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'octet=1 (00000001), bit=0 — inicio',
      codigo: `octet = 1  → binario: 00000001
bit = 0    → binario: 00000000
i = 0`,
      variables: [
        { nombre: 'octet', valor: '1 (00000001)', cambio: false, nota: '' },
        { nombre: 'bit', valor: '0 (00000000)', cambio: false, nota: '← inicializado a 0' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=0: extraer LSB=1, mover a bit',
      codigo: `bit = 0 * 2 + 1 % 2 = 0 + 1 = 1
octet = 1 / 2 = 0
→ bit=1 (00000001), octet=0`,
      variables: [
        { nombre: 'octet%2', valor: '1 (LSB)', cambio: false, nota: '← bit menos significativo' },
        { nombre: 'bit', valor: '1 (00000001)', cambio: true, nota: '' },
        { nombre: 'octet', valor: '0', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'i=1..7: octet=0 → solo bit*2 cada vez',
      codigo: `i=1: bit=1*2+0=2, octet=0
i=2: bit=2*2+0=4, octet=0
i=3: bit=4*2+0=8, octet=0
i=4: bit=8*2+0=16, octet=0
i=5: bit=16*2+0=32, octet=0
i=6: bit=32*2+0=64, octet=0
i=7: bit=64*2+0=128, octet=0`,
      variables: [
        { nombre: 'bit tras i=7', valor: '128 (10000000)', cambio: true, nota: '← LSB original ahora es MSB' },
      ],
    },
    {
      paso: 4,
      titulo: 'return 128',
      codigo: `return (bit) = 128
// 00000001 invertido = 10000000 = 128 ✓`,
      variables: [
        { nombre: 'retorno', valor: '128', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Inicializar bit=1 o bit=octet en vez de bit=0',
      descripcion: 'bit empieza en 0. Si empieza en 1 u otro valor, el resultado final será incorrecto porque bit*2 en la primera iteración ya da un valor no nulo.',
      codigoMal: `// ❌ Inicialización incorrecta
unsigned char bit = 1;   // error: 1*2+... = 2+... incorrectobunsigned char bit = octet; // error: comienza con el valor original`,
      codigoBien: `// ✅
unsigned char bit = 0;   // empieza limpio, se construye bit a bit`,
    },
    {
      severidad: 'mortal',
      titulo: 'Iterar 7 veces en vez de 8',
      descripcion: 'Un byte tiene 8 bits. Si el bucle va i<7, el último bit (MSB) no se procesa y el resultado es incorrecto.',
      codigoMal: `// ❌ Solo 7 iteraciones — pierde el MSB
while (i < 7) { ... i++; }`,
      codigoBien: `// ✅ 8 iteraciones (uno por bit de byte)
while (i < 8) { ... i++; }`,
    },
    {
      severidad: 'warning',
      titulo: 'Usar int en vez de unsigned char para bit',
      descripcion: 'bit debe ser unsigned char para que los bits extras no causen problemas. Con int funciona en la práctica, pero la firma dice unsigned char.',
      codigoMal: `// ⚠️ int puede funcionar pero no es correcto semánticamente
int bit = 0;`,
      codigoBien: `// ✅
unsigned char bit = 0;`,
    },
  ],

  bajoCelCapot: `bit = bit*2 + octet%2 es equivalente a (bit << 1) | (octet & 1).
octet / 2 es equivalente a octet >> 1.
Matemáticamente: si octet = b7b6b5b4b3b2b1b0, el resultado es b0b1b2b3b4b5b6b7.
El LSB (bit menos significativo) de octet se extrae con %2 y se convierte en MSB del resultado al iterar.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La fórmula bit=bit*2+octet%2 y octet/=2 es contraintuitiva pero elegante. Hay que memorizarla porque es difícil de derivar bajo presión.',
  relacionados: ['swap_bits', 'print_bits', 'is_power_of_2'],
}
