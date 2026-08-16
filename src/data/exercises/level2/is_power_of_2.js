export default {
  id: 'is_power_of_2',
  nombre: 'is_power_of_2',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['is_power_of_2.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : is_power_of_2
Expected files   : is_power_of_2.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that determines whether a given number is a power of 2.

This function returns 1 if the given number is a power of 2, otherwise it
returns 0.

int\tis_power_of_2(unsigned int n);

Example:
is_power_of_2(1)   → 1  (2^0 = 1)
is_power_of_2(2)   → 1  (2^1)
is_power_of_2(8)   → 1  (2^3)
is_power_of_2(0)   → 0  (no es potencia de 2)
is_power_of_2(3)   → 0  (no es potencia de 2)`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : is_power_of_2
Expected files   : is_power_of_2.c
Allowed functions: None
--------------------------------------------------------------------------------

Write a function that determines if a given number is a power of 2.

This function returns 1 if the given number is a power of 2, otherwise it returns 0.

Your function must be declared as follows:

int	    is_power_of_2(unsigned int n);`,

  descripcion: 'Función que devuelve 1 si n es potencia de 2, 0 si no. El truco bit a bit: una potencia de 2 tiene exactamente 1 bit activo. n & (n-1) pone ese bit a 0. Si el resultado es 0 (y n>0), es potencia de 2.',

  palacio: {
    habitacion: 'salon',
    mueble: 'lampara',
    personaje: 'El Detective de Potencias',
    emoji: '🔍',
    historia: `En el salón hay una Lámpara especial que solo brilla con potencias de 2.
El Detective sabe el truco secreto: las potencias de 2 tienen UN SOLO BIT encendido.
Y ese truco: n & (n-1) apaga exactamente ese bit. Si el resultado es 0, solo había un bit.
¡OJO! n=0 no es potencia de 2 (ningún bit encendido). Por eso: n > 0 primero.
La fórmula es: return (n > 0 && (n & (n - 1)) == 0).`,
    anclas: [
      "n > 0  ← 0 no es potencia de 2",
      "n & (n-1) == 0  ← si verdad, n tiene exactamente 1 bit",
      "potencias de 2: 1,2,4,8,16,32,64,128,...",
      "return 1 si sí, return 0 si no",
      "tipo: unsigned int (no int) — sin negativos",
    ],
  },

  herramientas: ['bits'],

  campayoMetodo: {
    feynman: `La función dice si un número es potencia de 2.
Los números potencia de 2 tienen solo UN bit a 1 en su representación binaria: 1, 10, 100, 1000...
El truco mágico: n & (n-1) siempre da 0 si n es potencia de 2.
¿Por qué? Porque n-1 "apaga" el único bit a 1 y "enciende" todos los de abajo.
Además, el 0 no es potencia de 2.`,
    datosPuros: [
      { elemento: 'n && !(n & (n - 1))', nota: 'la fórmula completa — el n && descarta el 0' },
      { elemento: 'int is_power_of_2(unsigned int n)', nota: 'devuelve int (1 o 0), recibe unsigned int' },
    ],
    asociaciones: [
      { dato: 'n & (n-1) == 0', imagen: 'Una potencia de 2 es como una vela solitaria. n-1 apaga esa vela y enciende todas las de abajo. El AND de una vela encendida y todas las de abajo = ninguna coincide = 0. Si hay más de una vela, el AND no es 0.' },
      { dato: 'n && ... (descartar 0)', imagen: 'El cero es un tramposo: 0 & (0-1) = 0, lo que daría true. Pero el 0 no es potencia de 2. El n&& del principio lo pilla antes de que haga trampas.' },
    ],
  },

  animacion: {
    "tipo": "recursion",
    "config": {
      "fn": "is_power_of_2",
      "a": 16,
      "b": 0
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "if (n == 0) return (0);",
        "porque": "El 0 no es potencia de 2.",
        "concepto": "condicionales"
      },
      {
        "codigo": "while (n % 2 == 0)",
        "porque": "Divide entre 2 mientras sea par.",
        "concepto": "bucles"
      },
      {
        "codigo": "  n = n / 2;",
        "porque": "Reduce el número a la mitad.",
        "concepto": "recursion"
      },
      {
        "codigo": "return (n == 1);",
        "porque": "Si al final queda 1, era potencia exacta de 2.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué termina comprobando n == 1?",
        "respuesta": "Una potencia de 2 se reduce dividiendo entre 2 hasta llegar justo a 1; si queda otra cosa, no lo era."
      },
      {
        "pregunta": "Truco alternativo: n & (n-1) == 0",
        "respuesta": "Una potencia de 2 tiene un único bit a 1; restarle 1 y hacer AND da 0."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Una potencia de 2 tiene exactamente 1 bit encendido. n & (n-1) lo apaga.',
    formula: 'return (n > 0 && (n & (n - 1)) == 0);',
    ejemplo: {
      entrada: 'n=8 (1000)',
      calculo: 'n-1=7 (0111); 8 & 7 = 1000 & 0111 = 0000 = 0; n>0 && 0==0 → 1',
      resultado: '1',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=is_power_of_2.c
file2=../../../../rendu/is_power_of_2/is_power_of_2.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

    ./out1 "1024" > out1.txt 2>/dev/null
    ./out2 "1024" > out2.txt 2>/dev/null

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

    ./out1 "1023" > out1.txt 2>/dev/null
    ./out2 "1023" > out2.txt 2>/dev/null

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

# 4. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "1" > out1.txt 2>/dev/null
    ./out2 "1" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 5. test 
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "-3" > out1.txt 2>/dev/null
    ./out2 "-3" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["1024"], salida: "is_power_of_2(\"1024\") = 1\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["1023"], salida: "is_power_of_2(\"1023\") = 0\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["0"], salida: "is_power_of_2(\"0\") = 0\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["1"], salida: "is_power_of_2(\"1\") = 1\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["-3"], salida: "is_power_of_2(\"-3\") = 0\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'bitwise',
      nombre: 'Con n & (n-1)',
      descripcion: 'Solución de una línea usando el truco bit a bit. La más elegante.',
      recomendada: true,
      codigo: `int\tis_power_of_2(unsigned int n)
{
\treturn (n > 0 && (n & (n - 1)) == 0);
}`,
    },
    {
      id: 'bucle',
      nombre: 'Con bucle de división',
      descripcion: 'Divide por 2 hasta llegar a 1 o a un impar. Más larga pero más explícita.',
      recomendada: false,
      codigo: `int\tis_power_of_2(unsigned int n)
{
\tif (n == 0)
\t\treturn (0);
\twhile (n > 1)
\t{
\t\tif (n % 2 != 0)
\t\t\treturn (0);
\t\tn /= 2;
\t}
\treturn (1);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `
#include <stdio.h>

int         is_power_of_2(unsigned int n)
{
	if (n == 0)
		return (0);
	while (n > 1)
	{
		if (n % 2 == 0)
			n = n / 2;
		else
			return (0);
	}
	return (1);
}`,
    },
  ],

  tests: [
    { id: 'test_uno', descripcion: '1 (2^0) → 1', entrada: ['1'], salida: '1\n', tipo: 'normal' },
    { id: 'test_dos', descripcion: '2 (2^1) → 1', entrada: ['2'], salida: '1\n', tipo: 'normal' },
    { id: 'test_ocho', descripcion: '8 (2^3) → 1', entrada: ['8'], salida: '1\n', tipo: 'normal' },
    { id: 'test_128', descripcion: '128 (2^7) → 1', entrada: ['128'], salida: '1\n', tipo: 'normal' },
    { id: 'test_cero', descripcion: '0 → 0 (no es potencia de 2)', entrada: ['0'], salida: '0\n', tipo: 'edge' },
    { id: 'test_tres', descripcion: '3 → 0 (no es potencia de 2)', entrada: ['3'], salida: '0\n', tipo: 'normal' },
    { id: 'test_siete', descripcion: '7 → 0 (no es potencia de 2)', entrada: ['7'], salida: '0\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'n=8 (1000 en binario)',
      codigo: `n = 8   → 1000
n - 1 = 7 → 0111
n & (n-1) = 1000 & 0111 = 0000 = 0
n > 0 → TRUE
(n & (n-1)) == 0 → TRUE
→ return 1 (es potencia de 2)`,
      variables: [
        { nombre: 'n', valor: '8 (1000)', cambio: false, nota: '' },
        { nombre: 'n-1', valor: '7 (0111)', cambio: false, nota: '' },
        { nombre: 'n & (n-1)', valor: '0 (0000)', cambio: true, nota: '← bit único apagado' },
        { nombre: 'retorno', valor: '1', cambio: true, nota: '✓ potencia de 2' },
      ],
    },
    {
      paso: 2,
      titulo: 'n=3 (0011 en binario) — NO es potencia de 2',
      codigo: `n = 3   → 0011
n - 1 = 2 → 0010
n & (n-1) = 0011 & 0010 = 0010 = 2 ≠ 0
→ return 0 (no es potencia de 2)`,
      variables: [
        { nombre: 'n', valor: '3 (0011)', cambio: false, nota: '← 2 bits activos' },
        { nombre: 'n & (n-1)', valor: '2 (0010) ≠ 0', cambio: true, nota: '← no es cero' },
        { nombre: 'retorno', valor: '0', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'n=0 — caso especial',
      codigo: `n = 0
n > 0 → FALSE
→ short-circuit: return 0
// 0 no es potencia de 2 — sin bits activos`,
      variables: [
        { nombre: 'n > 0', valor: 'FALSE', cambio: true, nota: '← cortocircuito' },
        { nombre: 'retorno', valor: '0', cambio: true, nota: '' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Olvidar la condición n > 0',
      descripcion: 'n=0 satisface (0 & -1) == 0 en algunos sistemas. La condición n > 0 es necesaria para excluir el 0.',
      codigoMal: `// ❌ n=0 da resultado incorrecto en algunos sistemas
return ((n & (n - 1)) == 0);  // 0 & UINT_MAX puede ser 0`,
      codigoBien: `// ✅
return (n > 0 && (n & (n - 1)) == 0);`,
    },
    {
      severidad: 'warning',
      titulo: 'Usar int en vez de unsigned int',
      descripcion: 'La firma usa unsigned int, que no tiene valores negativos. Con int, n-1 para n=0 sería -1 (underflow). unsigned int lo maneja de forma segura.',
      codigoMal: `// ⚠️ int puede causar underflow con n=0
int is_power_of_2(int n) { ... }`,
      codigoBien: `// ✅
int is_power_of_2(unsigned int n) { ... }`,
    },
    {
      severidad: 'warning',
      titulo: 'Retornar true/false en lugar de 1/0',
      descripcion: 'La función debe retornar exactamente 1 (es potencia) o 0 (no lo es), no -1, 2, etc.',
      codigoMal: `// ⚠️ retorna n & (n-1) que puede ser cualquier valor
return !(n & (n - 1));  // ! convierte a 0/1 — en realidad esto sí está bien`,
      codigoBien: `// ✅ Explícitamente 1 o 0
return (n > 0 && (n & (n - 1)) == 0);  // == 0 da 0 o 1`,
    },
  ],

  bajoCelCapot: `Las potencias de 2 en binario: 1=0001, 2=0010, 4=0100, 8=1000.
Solo tienen UN bit en 1. n-1 pone todos los bits por debajo de ese 1 a 1 y lo apaga.
AND bit a bit: n & (n-1) = 0 solo cuando n tiene exactamente un bit encendido.
Este truco es la base de muchos algoritmos de optimización de bits.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La solución de una línea (n > 0 && (n & (n-1)) == 0) es contra-intuitiva. Sin haberla visto antes es casi imposible derivarla bajo presión.',
  relacionados: ['reverse_bits', 'swap_bits', 'print_bits'],
}
