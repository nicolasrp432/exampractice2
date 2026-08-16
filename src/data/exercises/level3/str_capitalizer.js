export default {
  id: 'str_capitalizer',
  nombre: 'str_capitalizer',
  nivel: 3,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['str_capitalizer.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : str_capitalizer
Expected files   : str_capitalizer.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes one or more strings as arguments and, for each of
them, capitalizes the first letter of each word (i.e., any sequence of
non-space characters), lowercases the rest, and displays the result, each
followed by a newline character.

A "word" is defined as a sequence of non-space characters.

If the number of arguments is 0, the program just outputs a newline.

Example:
$> ./str_capitalizer "hello world" | cat -e
Hello World$
$> ./str_capitalizer "hELLO wORLD" | cat -e
Hello World$
$> ./str_capitalizer "a b c" | cat -e
A B C$`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : str_capitalizer
Expected files   : str_capitalizer.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes one or several strings and, for each argument,
capitalizes the first character of each word (If it's a letter, obviously),
puts the rest in lowercase, and displays the result on the standard output,
followed by a \\n.

A "word" is defined as a part of a string delimited either by spaces/tabs, or
by the start/end of the string. If a word only has one letter, it must be
capitalized.

If there are no arguments, the progam must display \\n.

Example:

$> ./str_capitalizer | cat -e
$
$> ./str_capitalizer "a FiRSt LiTTlE TESt" | cat -e
A First Little Test$
$> ./str_capitalizer "__SecONd teST A LITtle BiT   Moar comPLEX" "   But... This iS not THAT COMPLEX" "     Okay, this is the last 1239809147801 but not    the least    t" | cat -e
__second Test A Little Bit   Moar Complex$
   But... This Is Not That Complex$
     Okay, This Is The Last 1239809147801 But Not    The Least    T$
$>`,

  descripcion: 'Programa que capitaliza la primera letra de cada palabra (secuencia de no-espacios) y pone en minúsculas el resto. Para cada argumento imprime el resultado seguido de newline.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'corona',
    personaje: 'La Corona Capitalizadora',
    emoji: '👑',
    historia: `En el dormitorio hay una Corona que nombra a cada palabra.
La Corona pone la primera letra en MAYÚSCULA y el resto en minúsculas.
La lógica: un flag "capitalize" que empieza en true.
Si encuentras espacio: capitalize=true. Si no es espacio y capitalize: MAYÚSCULA, capitalize=false.
Si no es espacio y !capitalize: MINÚSCULA.`,
    anclas: [
      "flag capitalize = 1 al inicio",
      "espacio → capitalize = 1; no-espacio+capitalize → toupper, capitalize=0",
      "no-espacio+!capitalize → tolower",
      "cada argumento en argv[i], i de 1 a argc-1",
      "write('\\n') al final de cada argumento",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe un string y pone en mayúscula la primera letra de cada palabra.
El resto de las letras de cada palabra las pone en minúscula.
Los caracteres no-alfabéticos actúan como separadores de palabras.
El primer carácter de una nueva palabra va en mayúscula; los demás en minúscula.`,
    datosPuros: [
      { elemento: 'bandera "inicio de palabra"', nota: 'necesitas saber si el próximo carácter es inicio de palabra' },
      { elemento: 'letra + separador → siguiente letra en mayúscula', nota: 'el separador activa la bandera; la siguiente letra la usa' },
    ],
    asociaciones: [
      { dato: 'bandera de inicio de palabra', imagen: 'str_capitalizer lleva una linterna. Cuando el portero (un espacio o símbolo) pasa, la linterna se enciende. La primera letra que llega con la linterna encendida recibe la corona (mayúscula) y la linterna se apaga.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "hello world",
      "modo": "copiar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "recorre la cadena con una bandera \"inicio de palabra\"",
        "porque": "Sabe si el carácter abre palabra.",
        "concepto": "bandera"
      },
      {
        "codigo": "primera letra de cada palabra → mayúscula",
        "porque": "Capitaliza el inicio.",
        "concepto": "ascii"
      },
      {
        "codigo": "resto de letras → minúscula",
        "porque": "El resto en minúscula.",
        "concepto": "ascii"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Cómo sabes que empieza una palabra?",
        "respuesta": "El carácter anterior es un espacio (o es el primero de la cadena)."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Flag capitalize: true al inicio y tras cada espacio',
    formula: 'if(space) cap=1; else if(cap){upper;cap=0;} else lower;',
    ejemplo: {
      entrada: '"hELLO wORLD"',
      calculo: 'h→cap=1→H(cap=0); E→e; L→l; L→l; O→o; space→cap=1; w→cap=1→W(cap=0); O→o; R→r; L→l; D→d',
      resultado: '"Hello World"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=str_capitalizer.c
file2=../../../../rendu/str_capitalizer/str_capitalizer.c


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

    ./out1 "a FiRSt LiTTlE TESt" > out1.txt 2>/dev/null
    ./out2 "a FiRSt LiTTlE TESt" > out2.txt 2>/dev/null

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

    ./out1 "SecONd teST A LITtle BiT   Moar comPLEX" "   But... This iS not THAT COMPLEX" "     Okay, this is the last 1239809147801 but not    the least    t" > out1.txt 2>/dev/null
    ./out2 "SecONd teST A LITtle BiT   Moar comPLEX" "   But... This iS not THAT COMPLEX" "     Okay, this is the last 1239809147801 but not    the least    t" > out2.txt 2>/dev/null

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

    ./out1 "Okay i thing you got it!!! " > out1.txt 2>/dev/null
    ./out2 "Okay i thing you got it!!! " > out2.txt 2>/dev/null

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

    ./out1 "10" > out1.txt 2>/dev/null
    ./out2 "10" > out2.txt 2>/dev/null

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
    { id: 'tester_2', entrada: ["a FiRSt LiTTlE TESt"], salida: "A First Little Test\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["SecONd teST A LITtle BiT   Moar comPLEX","   But... This iS not THAT COMPLEX","     Okay, this is the last 1239809147801 but not    the least    t"], salida: "Second Test A Little Bit   Moar Complex\n   But... This Is Not That Complex\n     Okay, This Is The Last 1239809147801 But Not    The Least    T\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Okay i thing you got it!!! "], salida: "Okay I Thing You Got It!!! \n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["10"], salida: "10\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con flag capitalize y write char a char',
      descripcion: 'La más directa. Itera cada argumento char a char con un flag para saber si hay que capitalizar.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tint\tj;
\tchar\tc;
\tint\tcapitalize;

\tif (argc == 1)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\ti = 1;
\twhile (i < argc)
\t{
\t\tj = 0;
\t\tcapitalize = 1;
\t\twhile (argv[i][j])
\t\t{
\t\t\tc = argv[i][j];
\t\t\tif (c == ' ')
\t\t\t\tcapitalize = 1;
\t\t\telse if (capitalize)
\t\t\t{
\t\t\t\tif (c >= 'a' && c <= 'z')
\t\t\t\t\tc -= 32;
\t\t\t\tcapitalize = 0;
\t\t\t}
\t\t\telse
\t\t\t{
\t\t\t\tif (c >= 'A' && c <= 'Z')
\t\t\t\t\tc += 32;
\t\t\t}
\t\t\twrite(1, &c, 1);
\t\t\tj++;
\t\t}
\t\twrite(1, "\\n", 1);
\t\ti++;
\t}
\treturn (0);
}`,
    },
    {
      id: 'previo',
      nombre: 'Con revisión del carácter anterior',
      descripcion: 'Detecta el inicio de palabra mirando el carácter previo en vez de usar un flag.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tint\tj;
\tchar\tc;

\tif (argc == 1)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\ti = 1;
\twhile (i < argc)
\t{
\t\tj = 0;
\t\twhile (argv[i][j])
\t\t{
\t\t\tc = argv[i][j];
\t\t\tif (c == ' ')
\t\t\t\twrite(1, &c, 1);
\t\t\telse if (j == 0 || argv[i][j - 1] == ' ')
\t\t\t{
\t\t\t\tif (c >= 'a' && c <= 'z')
\t\t\t\t\tc -= 32;
\t\t\t\twrite(1, &c, 1);
\t\t\t}
\t\t\telse
\t\t\t{
\t\t\t\tif (c >= 'A' && c <= 'Z')
\t\t\t\t\tc += 32;
\t\t\t\twrite(1, &c, 1);
\t\t\t}
\t\t\tj++;
\t\t}
\t\twrite(1, "\\n", 1);
\t\ti++;
\t}
\treturn (0);
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

void	str_capitalizer(char *str)
{
	while (*str != '\\0')
	{
		while (*str != '\\0' && (*str == ' ' || *str == '\\t'))
		{
			write(1, str, 1);
			++str;
		}

		if (*str != '\\0')
		{
			if (*str >= 'a' && *str <= 'z')
				*str = *str - ('a' - 'A');
			write(1, str, 1);
			++str;
		}

		while (*str != '\\0' && *str != ' ' && *str != '\\t')
		{
			if (*str >= 'A' && *str <= 'Z')
				*str = *str + ('a' - 'A');
			write(1, str, 1);
			++str;
		}
	}
	write(1, "\\n", 1);
}

int		main(int argc, char **argv)
{
	if (argc == 1)
		write(1, "\\n", 1);
	else
	{
		int i = 1;
		while (i < argc)
		{
			str_capitalizer(argv[i]);
			++i;
		}
	}

	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_hello_world', descripcion: '"hello world" → "Hello World"', entrada: ['hello world'], salida: 'Hello World\n', tipo: 'normal' },
    { id: 'test_mixed', descripcion: '"hELLO wORLD" → "Hello World"', entrada: ['hELLO wORLD'], salida: 'Hello World\n', tipo: 'normal' },
    { id: 'test_single', descripcion: '"a b c" → "A B C"', entrada: ['a b c'], salida: 'A B C\n', tipo: 'normal' },
    { id: 'test_all_upper', descripcion: '"HELLO WORLD" → "Hello World"', entrada: ['HELLO WORLD'], salida: 'Hello World\n', tipo: 'normal' },
    { id: 'test_no_args', descripcion: 'sin args → solo newline', entrada: [], salida: '\n', tipo: 'edge' },
    { id: 'test_single_word', descripcion: '"hello" → "Hello"', entrada: ['hello'], salida: 'Hello\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: '"hELLO wORLD": trazar el flag capitalize',
      codigo: `capitalize=1
'h' → capitalize=1 → 'H', capitalize=0
'E' → cap=0 → tolower → 'e'
'L' → 'l', 'L' → 'l', 'O' → 'o'
' ' → capitalize=1; write(' ')
'w' → capitalize=1 → 'W', capitalize=0
'O' → 'o', 'R' → 'r', 'L' → 'l', 'D' → 'd'
write('\\n')
Salida: "Hello World"`,
      variables: [
        { nombre: 'salida', valor: '"Hello World"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Olvidar escribir el espacio — no modificar caracteres que no son letras',
      descripcion: 'Los espacios se escriben tal cual (solo actualizan el flag). No los saltes ni los modifiques.',
      codigoMal: `// ❌ Saltar espacios en vez de escribirlos
if (c == ' ') { capitalize = 1; } // no escribe el espacio`,
      codigoBien: `// ✅ Escribir el espacio y actualizar el flag
if (c == ' ')
    capitalize = 1;
// ...
write(1, &c, 1);  // siempre escribir c`,
    },
    {
      severidad: 'mortal',
      titulo: 'Confundir str_capitalizer con rstr_capitalizer',
      descripcion: 'str_capitalizer: PRIMERA letra de cada palabra en mayúscula. rstr_capitalizer: ÚLTIMA letra de cada palabra en mayúscula.',
      codigoMal: `// ❌ Capitalizar la última en vez de la primera
// → eso es rstr_capitalizer`,
      codigoBien: `// ✅ str_capitalizer: capitalize=1 al inicio y tras espacio → primera
// rstr_capitalizer: mayúscula si char+1 es espacio o fin → última`,
    },
  ],

  bajoCelCapot: `La capitalización de palabras requiere saber si estamos al inicio de una palabra.
Un flag booleano "capitalize" que se activa tras cada espacio lo resuelve.
El truco c-=32 y c+=32 es el bit 5 de ASCII: 'a'=97='A'+32, 'A'=65.
Alternativamente: if(c>='a'&&c<='z') c-=32; if(c>='A'&&c<='Z') c+=32.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El flag capitalize es el patrón reutilizable. Memorizar: cap=1 al inicio; espacio→cap=1; primer no-espacio→upper+cap=0; resto→lower.',
  relacionados: ['rstr_capitalizer', 'epur_str', 'hidenp'],
}
