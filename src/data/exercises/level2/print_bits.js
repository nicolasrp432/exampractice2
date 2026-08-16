export default {
  id: 'print_bits',
  nombre: 'print_bits',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['print_bits.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : print_bits
Expected files   : print_bits.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a function that takes a byte, and prints it in binary without a
newline at the end.

void\tprint_bits(unsigned char octet);

Example:
print_bits(2)  → 00000010
print_bits(42) → 00101010`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : print_bits
Expected files   : print_bits.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a function that takes a byte, and prints it in binary WITHOUT A NEWLINE
AT THE END.

Your function must be declared as follows:

void	print_bits(unsigned char octet);

Example, if you pass 2 to print_bits, it will print "00000010"`,

  descripcion: 'Función que imprime los 8 bits de un byte en orden MSB→LSB. Itera desde el bit 7 al bit 0, extrayendo cada bit con (octet >> i) & 1 y escribiendo "0" o "1".',

  palacio: {
    habitacion: 'salon',
    mueble: 'radio',
    personaje: 'El Locutor Binario',
    emoji: '📻',
    historia: `En el salón hay una Radio que retransmite en binario.
El Locutor lee el byte desde el bit más importante (bit 7) al menos importante (bit 0).
Para cada bit: desplaza el byte i posiciones a la derecha, enmascara con &1.
Si el resultado es 1 → transmite "1", si es 0 → transmite "0".
SIEMPRE 8 bits, siempre con ceros a la izquierda. SIN newline al final.`,
    anclas: [
      "i = 7; while i >= 0: extraer bit",
      "(octet >> i) & 1  ← bit i del byte",
      "c = '0' + bit  ← convierte 0/1 a char",
      "write(1, &c, 1)  ← escribe un char",
      "SIN '\\n' al final (a diferencia de printf)",
    ],
  },

  herramientas: ['bits', 'ascii'],

  campayoMetodo: {
    feynman: `La función recibe un byte (unsigned char) e imprime sus 8 bits como "0" y "1".
Empieza desde el bit más significativo (el bit 7, el de más a la izquierda).
Para cada bit, usa una máscara con desplazamiento para ver si ese bit es 1 o 0.
Si el bit es 1, escribe "1". Si es 0, escribe "0".
Hace esto 8 veces, del bit 7 al bit 0.`,
    datosPuros: [
      { elemento: '1 << (7 - i)', nota: 'máscara que selecciona el bit i-ésimo desde la izquierda' },
      { elemento: 'if (byte & mask)', nota: 'AND con máscara para ver si el bit está a 1' },
      { elemento: 'i = 0; i < 8; i++', nota: 'iterar 8 veces (un byte = 8 bits)' },
    ],
    asociaciones: [
      { dato: '1 << (7 - i)', imagen: 'La linterna de 8 posiciones: empieza apuntando al bit más grande (1 corrida 7 puestos a la izquierda). Con cada paso, la linterna se mueve un poco a la derecha (i crece, el desplazamiento baja). Donde brilla la linterna y el byte tiene 1, escribes "1".' },
    ],
  },

  animacion: {
    "tipo": "bits",
    "config": {
      "valor": 42,
      "modo": "mostrar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int i = 7;",
        "porque": "Empezamos por el bit más significativo (posición 7).",
        "concepto": "variables"
      },
      {
        "codigo": "while (i >= 0)",
        "porque": "Recorre los 8 bits de MSB a LSB.",
        "concepto": "bucles"
      },
      {
        "codigo": "  char bit = ((octet >> i) & 1) + '0';",
        "porque": "Desplaza el bit i a la derecha y lo aísla con & 1.",
        "concepto": "bits"
      },
      {
        "codigo": "  write(1, &bit, 1);",
        "porque": "Imprime '0' o '1'.",
        "concepto": "bits"
      },
      {
        "codigo": "  i--;",
        "porque": "Siguiente bit hacia la derecha.",
        "concepto": "bucles"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué (octet >> i) & 1?",
        "respuesta": "Mueves el bit que quieres a la posición 0 y el & 1 borra todos los demás."
      },
      {
        "pregunta": "¿Por qué + '0'?",
        "respuesta": "Convierte el número 0/1 en el carácter '0'/'1' imprimible."
      }
    ]
  },

  formulaClave: {
    descripcion: 'MSB primero: extraer bit i con (octet>>i)&1, escribir "0" o "1"',
    formula: 'i=7; while(i>=0){ c="0"+((octet>>i)&1); write(1,&c,1); i--; }',
    ejemplo: {
      entrada: 'octet=2 (00000010)',
      calculo: 'i=7→0, i=6→0, i=5→0, i=4→0, i=3→0, i=2→0, i=1→1, i=0→0',
      resultado: '"00000010"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=print_bits.c
file2=../../../../rendu/print_bits/print_bits.c


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
    { id: 'tester_1', entrada: ["a"], salida: "01100001\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["0"], salida: "00110000\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["P"], salida: "01010000\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Desde i=7 hasta i=0 (MSB primero)',
      descripcion: 'Bucle descendente, extrae cada bit con shift y mask. La más clara.',
      recomendada: true,
      codigo: `#include <unistd.h>

void\tprint_bits(unsigned char octet)
{
\tint\ti;
\tchar\tc;

\ti = 7;
\twhile (i >= 0)
\t{
\t\tc = '0' + ((octet >> i) & 1);
\t\twrite(1, &c, 1);
\t\ti--;
\t}
}`,
    },
    {
      id: 'mascara',
      nombre: 'Con máscara 128 (1000 0000)',
      descripcion: 'Empieza con máscara=128, desplaza a la derecha. Evita el shift en el índice.',
      recomendada: false,
      codigo: `#include <unistd.h>

void\tprint_bits(unsigned char octet)
{
\tunsigned char\tmask;
\tchar\t\tc;

\tmask = 128;
\twhile (mask > 0)
\t{
\t\tc = (octet & mask) ? '1' : '0';
\t\twrite(1, &c, 1);
\t\tmask >>= 1;
\t}
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <unistd.h>

void print_bits(unsigned char octet)
{
	int	i = 8;
	unsigned char 	bit;

	while (i--)
	{
		bit = (octet >> i & 1) + '0';
		write(1, &bit, 1);
	}
}`,
    },
  ],

  tests: [
    { id: 'test_dos', descripcion: '2 → "00000010"', entrada: ['2'], salida: '00000010\n', tipo: 'normal' },
    { id: 'test_42', descripcion: '42 → "00101010"', entrada: ['42'], salida: '00101010\n', tipo: 'normal' },
    { id: 'test_cero', descripcion: '0 → "00000000"', entrada: ['0'], salida: '00000000\n', tipo: 'edge' },
    { id: 'test_255', descripcion: '255 → "11111111"', entrada: ['255'], salida: '11111111\n', tipo: 'edge' },
    { id: 'test_uno', descripcion: '1 → "00000001"', entrada: ['1'], salida: '00000001\n', tipo: 'normal' },
    { id: 'test_128', descripcion: '128 → "10000000"', entrada: ['128'], salida: '10000000\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'octet=2 (00000010) — i=7 hasta i=2: bits 0',
      codigo: `octet = 2 → 00000010
i=7: (2 >> 7) & 1 = 0 & 1 = 0 → write('0')
i=6: (2 >> 6) & 1 = 0 → write('0')
i=5: (2 >> 5) & 1 = 0 → write('0')
i=4: (2 >> 4) & 1 = 0 → write('0')
i=3: (2 >> 3) & 1 = 0 → write('0')
i=2: (2 >> 2) & 1 = 0 → write('0')`,
      variables: [
        { nombre: 'salida hasta i=2', valor: '"000000"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=1: bit 1 está activo en 2',
      codigo: `i=1: (2 >> 1) & 1 = 1 & 1 = 1 → write('1')
// 2 en binario: ...0010 → bit 1 (segundo desde la derecha) = 1`,
      variables: [
        { nombre: 'salida', valor: '"0000001"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'i=0: bit 0 es 0',
      codigo: `i=0: (2 >> 0) & 1 = 2 & 1 = 0 → write('0')
// 2 en binario: 00000010 → bit 0 = 0`,
      variables: [
        { nombre: 'salida final', valor: '"00000010"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Empezar desde i=0 (LSB primero) en vez de i=7 (MSB primero)',
      descripcion: 'print_bits imprime MSB primero (bit 7 al bit 0). Si empiezas desde i=0, el output es el binario al revés.',
      codigoMal: `// ❌ LSB primero → output invertido
i = 0;
while (i < 8) {
    c = '0' + ((octet >> i) & 1);
    write(1, &c, 1);
    i++;
}
// octet=2: "01000000" (invertido, incorrecto)`,
      codigoBien: `// ✅ MSB primero → correcto
i = 7;
while (i >= 0) {
    c = '0' + ((octet >> i) & 1);
    write(1, &c, 1);
    i--;
}
// octet=2: "00000010" (correcto)`,
    },
    {
      severidad: 'mortal',
      titulo: 'Añadir \\n al final — la función NO debe imprimir newline',
      descripcion: 'El subject dice explícitamente "without a newline at the end". Solo el main de prueba puede añadir el \\n. La función no debe.',
      codigoMal: `// ❌ No debe imprimir newline
write(1, "\\n", 1);  // al final de print_bits`,
      codigoBien: `// ✅ Sin newline — la función termina tras el bit 0
// El main de prueba añade el \\n separado`,
    },
    {
      severidad: 'warning',
      titulo: 'Usar printf en vez de write',
      descripcion: 'Las funciones permitidas son solo write. No puedes usar printf, puts ni putchar.',
      codigoMal: `// ❌ printf no está permitido
printf("%d", (octet >> i) & 1);`,
      codigoBien: `// ✅ write con char calculado
c = '0' + ((octet >> i) & 1);
write(1, &c, 1);`,
    },
  ],

  bajoCelCapot: `(octet >> i) desplaza el byte i posiciones a la derecha.
& 1 enmascara todo excepto el bit menos significativo → 0 o 1.
'0' + bit convierte 0→'0'(48) o 1→'1'(49) para poder escribirlo con write.
El bit más significativo (MSB) es el bit 7: (octet >> 7) & 1.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El patrón (octet>>i)&1 para extraer el bit i es universal en manipulación de bits. MSB primero (i=7..0) es el orden visual estándar.',
  relacionados: ['reverse_bits', 'swap_bits', 'is_power_of_2'],
}
