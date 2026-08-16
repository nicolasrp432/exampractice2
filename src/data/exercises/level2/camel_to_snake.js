export default {
  id: 'camel_to_snake',
  nombre: 'camel_to_snake',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['camel_to_snake.c'],
  // El subject real permite también malloc/free/realloc — útil si quieres
  // construir el resultado en buffer antes de escribirlo. La versión
  // didáctica solo usa write, que es perfectamente válida.
  funcionesPermitidas: ['write', 'malloc', 'free', 'realloc'],

  subject: `Assignment name  : camel_to_snake
Expected files   : camel_to_snake.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a single string in lowerCamelCase format and
converts it into a string in snake_case format.

The result must be in lowercase.

If the number of arguments is not 1, display a newline.

Examples:
$> ./camel_to_snake "helloWorld"
hello_world
$> ./camel_to_snake "helloWorldFoo"
hello_world_foo
$> ./camel_to_snake ""

$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : camel_to_snake
Expected files   : camel_to_snake.c
Allowed functions: malloc, free, realloc, write
--------------------------------------------------------------------------------

Write a program that takes a single string in lowerCamelCase format
and converts it into a string in snake_case format.

A lowerCamelCase string is a string where each word begins with a capital letter
except for the first one.

A snake_case string is a string where each word is in lower case, separated by
an underscore "_".

Examples:
$>./camel_to_snake "hereIsACamelCaseWord"
here_is_a_camel_case_word
$>./camel_to_snake "helloWorld" | cat -e
hello_world$
$>./camel_to_snake | cat -e
$`,

  descripcion: 'Programa que convierte lowerCamelCase a snake_case: cada letra mayúscula se reemplaza por "_" + su versión minúscula.',

  palacio: {
    habitacion: 'salon',
    mueble: 'alfombra',
    personaje: 'El Camello que tropieza',
    emoji: '🐫',
    historia: `En el salón hay un Camello con jorobas que TROPIEZA en cada mayúscula.
Cuando el Camello tropieza (letra mayúscula), grita "_" y cae al suelo (minúscula).
Las letras normales las pisa sin problemas (las escribe tal cual).
Fórmula: mayúscula → '_' + (c + 32).
¡El lowerCamelCase comienza SIEMPRE en minúscula, nunca hay "_" al inicio!`,
    anclas: [
      "mayúscula → write '_'; write c+32",
      "minúscula → write c (sin cambio)",
      "símbolos/nums → write tal cual",
      "argc != 2 → solo \\n",
      "+32 convierte mayúscula a minúscula",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe un string en camelCase y lo convierte a snake_case.
Cada vez que encuentra una mayúscula, la convierte a minúscula y le pone un guión bajo delante.
Las letras minúsculas y los otros caracteres los deja tal cual.
Ejemplo: helloWorld → hello_world`,
    datosPuros: [
      { elemento: "if (c >= 'A' && c <= 'Z')", nota: 'detectar mayúscula' },
      { elemento: "write '_' luego c + 32", nota: 'escribir guión bajo y luego la minúscula' },
    ],
    asociaciones: [
      { dato: 'mayúscula → _ + minúscula', imagen: "La serpiente del camelCase tiene alergia a las jorobas (mayúsculas). Cada vez que ve una joroba, le planta un guión bajo delante y la aplana (c + 32 = minúscula). Sin guión primero = error." },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "goProNow",
      "modo": "copiar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (str[i])",
        "porque": "Recorre la cadena.",
        "concepto": "strings"
      },
      {
        "codigo": "  if (mayúscula)",
        "porque": "Una mayúscula marca una nueva palabra en camelCase.",
        "concepto": "ascii"
      },
      {
        "codigo": "    write(1, \"_\", 1);",
        "porque": "Inserta el guion bajo antes de la letra.",
        "concepto": "strings"
      },
      {
        "codigo": "    c += 32;",
        "porque": "Convierte la mayúscula a minúscula.",
        "concepto": "ascii"
      },
      {
        "codigo": "  write(1, &c, 1);",
        "porque": "Imprime el carácter (ya en snake_case).",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué imprimir \"_\" antes de la letra?",
        "respuesta": "En camelCase la mayúscula ES el separador; en snake_case se sustituye por _ + minúscula."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Mayúscula → "_" + minúscula equivalente (+32)',
    formula: "if (uppercase) { write('_'); write(c + 32); } else write(c);",
    ejemplo: {
      entrada: '"helloWorld"',
      calculo: 'h,e,l,l,o → iguales; W(87) → _+w(119)',
      resultado: 'hello_world',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=camel_to_snake.c
file2=../../../../rendu/camel_to_snake/camel_to_snake.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 > out1.txt 2>/dev/null
    ./out2 > out2.txt 2>/dev/null

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
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "" > out1.txt 2>/dev/null
    ./out2 "" > out2.txt 2>/dev/null

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
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "hereIsACamelCaseString" > out1.txt 2>/dev/null
    ./out2 "hereIsACamelCaseString" > out2.txt 2>/dev/null

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
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "helloWorld" > out1.txt 2>/dev/null
    ./out2 "helloWorld" > out2.txt 2>/dev/null

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
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "testWith" "multipleArguments" "aAaAaAaAaAaAa" > out1.txt 2>/dev/null
    ./out2 "testWith" "multipleArguments" "aAaAaAaAaAaAa" > out2.txt 2>/dev/null

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
    exit 1`,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: [], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["hereIsACamelCaseString"], salida: "here_is_a_camel_case_string\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["helloWorld"], salida: "hello_world\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["testWith","multipleArguments","aAaAaAaAaAaAa"], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con +32',
      descripcion: 'La más directa: detecta mayúscula, escribe underscore y la versión +32.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tchar\tc;
\tchar\tunderscore;

\tif (argc != 2)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\tunderscore = '_';
\ti = 0;
\twhile (argv[1][i])
\t{
\t\tc = argv[1][i];
\t\tif (c >= 'A' && c <= 'Z')
\t\t{
\t\t\twrite(1, &underscore, 1);
\t\t\tc = c + 32;
\t\t}
\t\twrite(1, &c, 1);
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'array',
      nombre: 'Con string de underscore',
      descripcion: 'Escribe "_" directamente como string literal. Más compacta.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tchar\tc;

\tif (argc != 2)
\t\treturn (write(1, "\\n", 1), 0);
\ti = 0;
\twhile (argv[1][i])
\t{
\t\tc = argv[1][i];
\t\tif (c >= 'A' && c <= 'Z')
\t\t{
\t\t\twrite(1, "_", 1);
\t\t\tc += 32;
\t\t}
\t\twrite(1, &c, 1);
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv)
{
	if (argc == 2)
	{
		for (int i = 0; argv[1][i]; i += 1)
		{
			if (argv[1][i] >= 'A' 
			&& argv[1][i] <= 'Z')
			{
				write(STDOUT_FILENO, "_", 1);
				argv[1][i] += 32;
			}
			write(STDOUT_FILENO, &argv[1][i], 1);
		}
	}
	write(STDOUT_FILENO, "\\n", 1);
	return EXIT_SUCCESS;
}`,
    },
  ],

  tests: [
    { id: 'test_basic', descripcion: '"helloWorld" → "hello_world"', entrada: ['helloWorld'], salida: 'hello_world\n', tipo: 'normal' },
    { id: 'test_multi', descripcion: '"helloWorldFoo" → "hello_world_foo"', entrada: ['helloWorldFoo'], salida: 'hello_world_foo\n', tipo: 'normal' },
    { id: 'test_nouppercase', descripcion: '"already" → sin cambios', entrada: ['already'], salida: 'already\n', tipo: 'normal' },
    { id: 'test_leading', descripcion: '"CamelCase" → "_camel_case" (C inicial)', entrada: ['CamelCase'], salida: '_camel_case\n', tipo: 'edge' },
    { id: 'test_vacio', descripcion: 'String vacío → solo \\n', entrada: [''], salida: '\n', tipo: 'edge' },
    { id: 'test_sin_args', descripcion: 'Sin argumentos → solo \\n', entrada: [], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: '"helloWorld": h,e,l,l,o sin cambio',
      codigo: `[i=0..4] 'h','e','l','l','o' → todos minúsculas → write tal cual
stdout: "hello"`,
      variables: [
        { nombre: 'stdout', valor: '"hello"', cambio: true, nota: '' },
        { nombre: 'i', valor: '5', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=5: "W"(87) → mayúscula → escribe "_" luego "w"(119)',
      codigo: `c = 'W' (87)
c >= 'A' && c <= 'Z' → TRUE
write(1, &underscore, 1) → stdout: "hello_"
c = 87 + 32 = 119 = 'w'
write(1, &c, 1) → stdout: "hello_w"`,
      variables: [
        { nombre: 'c', valor: "'W'(87) → '_' luego 'w'(119)", cambio: true, nota: '87+32=119' },
        { nombre: 'stdout', valor: '"hello_w"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: '"orld" sin cambio → stdout: "hello_world\\n"',
      codigo: `[i=6..9] 'o','r','l','d' → minúsculas → write tal cual
write("\\n")
stdout: "hello_world\\n"`,
      variables: [
        { nombre: 'stdout', valor: '"hello_world\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'write("_", 1) con literal string → write necesita &char',
      descripcion: 'write(1, "_", 1) funciona (string literal es un char* válido). Pero write(1, &"_", 1) es un puntero a puntero, no funciona. Lo más seguro: `char u = "_"; write(1, &u, 1)`.',
      codigoMal: `// ❌ No es error de compilación pero el comportamiento puede sorprender
char *u = "_";
write(1, &u, 1);  // &u es la dirección del PUNTERO, no del char`,
      codigoBien: `// ✅ Dos formas válidas:
write(1, "_", 1);          // string literal como char*
// o:
char u = '_';
write(1, &u, 1);           // dirección del char local`,
    },
    {
      severidad: 'mortal',
      titulo: '-32 en vez de +32 para pasar de mayúscula a minúscula',
      descripcion: "Mayúscula A(65) → minúscula a(97). La diferencia es +32, no -32. c-32 daría c='!' para 'A'.",
      codigoMal: `// ❌ -32 va en la dirección equivocada
c = c - 32; // 'A'(65)-32=33='!' ← carácter de control`,
      codigoBien: `// ✅ +32 convierte mayúscula a minúscula
c = c + 32; // 'A'(65)+32=97='a' ✓`,
    },
    {
      severidad: 'warning',
      titulo: '"CamelCase" → "_camel_case" (con underscore inicial)',
      descripcion: 'Si el primer carácter ya es mayúscula (no es lowerCamelCase puro), el programa añade "_" al inicio. El sujeto no especifica protección contra esto.',
      codigoMal: `// Comportamiento esperado por el sujeto con "CamelCase":
// _camel_case (con underscore inicial)
// Es correcto según el sujeto. No lo "arregles" añadiendo una condición especial.`,
      codigoBien: `// El programa es simple: mayúscula → _ + lower, siempre.
// No hace falta distinción para el primer carácter.`,
    },
  ],

  bajoCelCapot: `lowerCamelCase → snake_case es una conversión de nombrado.
Diferencia ASCII entre mayúsculas y minúsculas: siempre 32.
El underscore ASCII = 95, entre 'Z'(90) y 'a'(97).
Alternativa: usar tolower() si está permitida.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Patrón de transformación carácter a carácter con escritura condicional de prefijo. Aparece en str_capitalizer.',
  relacionados: ['ulstr', 'str_capitalizer'],
}
