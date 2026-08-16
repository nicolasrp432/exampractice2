export default {
  id: 'rstr_capitalizer',
  nombre: 'rstr_capitalizer',
  nivel: 3,
  dificultad: 'difícil',
  tipoEntrega: 'programa',
  archivosEsperados: ['rstr_capitalizer.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : rstr_capitalizer
Expected files   : rstr_capitalizer.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes one or more strings as arguments and, for each of
them, capitalizes the LAST letter of each word (lowercases all others), and
displays the result, each followed by a newline character.

A "word" is defined as a sequence of non-space characters.

If the number of arguments is 0, the program just outputs a newline.

Example:
$> ./rstr_capitalizer "hello world" | cat -e
hellO worlD$
$> ./rstr_capitalizer "hELLO wORLD" | cat -e
hellO worlD$
$> ./rstr_capitalizer "a b c" | cat -e
A B C$`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : rstr_capitalizer
Expected files   : rstr_capitalizer.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes one or more strings and, for each argument, puts 
the last character that is a letter of each word in uppercase and the rest
in lowercase, then displays the result followed by a \\n.

A word is a section of string delimited by spaces/tabs or the start/end of the
string. If a word has a single letter, it must be capitalized.

A letter is a character in the set [a-zA-Z]

If there are no parameters, display \\n.

Examples:

$> ./rstr_capitalizer | cat -e
$
$> ./rstr_capitalizer "a FiRSt LiTTlE TESt" | cat -e
A firsT littlE tesT$
$> ./rstr_capitalizer "SecONd teST A LITtle BiT   Moar comPLEX" "   But... This iS not THAT COMPLEX" "     Okay, this is the last 1239809147801 but not    the least    t" | cat -e
seconD tesT A littlE biT   moaR compleX$
   but... thiS iS noT thaT compleX$
     okay, thiS iS thE lasT 1239809147801 buT noT    thE leasT    T$
$>`,

  descripcion: "Como str_capitalizer pero al revés: la ÚLTIMA letra de cada palabra en mayúscula, el resto en minúsculas. Para detectar la última letra de una palabra: str[i+1]==' ' o str[i+1]='\\0'.",

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'espejo',
    personaje: 'El Espejo Invertido',
    emoji: '🪞',
    historia: `En el dormitorio hay un Espejo que todo lo invierte.
En vez de capitalizar la primera letra de cada palabra, capitaliza la ÚLTIMA.
La lógica: si el siguiente char es espacio o fin de string → MAYÚSCULA.
Si no es la última letra de la palabra → MINÚSCULA.
Es el "reverso" de str_capitalizer.`,
    anclas: [
      "si str[i+1]==' ' o str[i+1]='\\0' → toupper(str[i])",
      "si no → tolower(str[i])",
      "los espacios se escriben sin modificar",
      "str[j+1] para mirar adelante (lookahead)",
      "último char antes de '\\0' o antes de espacio → mayúscula",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe un string y pone en mayúscula la ÚLTIMA letra de cada palabra.
El resto de las letras de cada palabra las pone en minúscula.
Para saber si una letra es la última de una palabra, mira si el siguiente carácter es un separador o el final del string.
Es el inverso de str_capitalizer.`,
    datosPuros: [
      { elemento: 'mirar el siguiente carácter: str[i+1]', nota: 'la última letra de palabra la detectas mirando hacia adelante (str[i+1] es separador o \\0)' },
      { elemento: 'si !str[i+1] o str[i+1] es separador → mayúscula', nota: 'caso borde: el \\0 también marca fin de palabra' },
    ],
    asociaciones: [
      { dato: 'mirar str[i+1] para detectar última letra', imagen: 'rstr_capitalizer es un revisor de billetes que solo corona a los que van al final del vagón. Mira al pasajero de delante (str[i+1]): si el de delante es un espacio o el fantasma \\0, el actual es el último del vagón y recibe la corona.' },
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
        "codigo": "recorre la palabra",
        "porque": "Procesa cada carácter.",
        "concepto": "strings"
      },
      {
        "codigo": "la ÚLTIMA letra de cada palabra a mayúscula",
        "porque": "rstr capitaliza el final, no el inicio.",
        "concepto": "ascii"
      },
      {
        "codigo": "el resto en minúscula",
        "porque": "Normaliza los demás caracteres.",
        "concepto": "ascii"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Cómo detectas la última letra de una palabra?",
        "respuesta": "Es una letra seguida de un espacio o del final de la cadena."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Lookahead: si el siguiente char es espacio o fin → mayúscula',
    formula: 'if(!c[j+1]||c[j+1]==" ") upper; else lower; (salvo el propio espacio)',
    ejemplo: {
      entrada: '"hello world"',
      calculo: 'h→l,e→l,l→l,l→l,o→O(next=" "); " "; w→l,o→l,r→l,l→l,d→D(next=\\0)',
      resultado: '"hellO worlD"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=rstr_capitalizer.c
file2=../../../../rendu/rstr_capitalizer/rstr_capitalizer.c


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
    { id: 'tester_2', entrada: ["a FiRSt LiTTlE TESt"], salida: "A firsT littlE tesT\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["SecONd teST A LITtle BiT   Moar comPLEX","   But... This iS not THAT COMPLEX","     Okay, this is the last 1239809147801 but not    the least    t"], salida: "seconD tesT A littlE biT   moaR compleX\n   but... thiS iS noT thaT compleX\n     okay, thiS iS thE lasT 1239809147801 buT noT    thE leasT    T\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Okay i thing you got it!!! "], salida: "okaY I thinG yoU goT it!!! \n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["10"], salida: "10\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con lookahead argv[i][j+1]',
      descripcion: 'Mira el siguiente char para saber si el actual es el último de la palabra.',
      recomendada: true,
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
\t\t\tif (c != ' ')
\t\t\t{
\t\t\t\tif (!argv[i][j + 1] || argv[i][j + 1] == ' ')
\t\t\t\t{
\t\t\t\t\tif (c >= 'a' && c <= 'z')
\t\t\t\t\t\tc -= 32;
\t\t\t\t}
\t\t\t\telse
\t\t\t\t{
\t\t\t\t\tif (c >= 'A' && c <= 'Z')
\t\t\t\t\t\tc += 32;
\t\t\t\t}
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
      id: 'por_palabras',
      nombre: 'Por palabras completas',
      descripcion: 'Busca el final de cada palabra y solo capitaliza su último carácter.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tint\tj;
\tint\tk;
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
\t\t\tif (argv[i][j] == ' ')
\t\t\t{
\t\t\t\twrite(1, " ", 1);
\t\t\t\tj++;
\t\t\t\tcontinue ;
\t\t\t}
\t\t\tk = j;
\t\t\twhile (argv[i][k] && argv[i][k] != ' ')
\t\t\t\tk++;
\t\t\twhile (j < k)
\t\t\t{
\t\t\t\tc = argv[i][j];
\t\t\t\tif (j == k - 1)
\t\t\t\t{
\t\t\t\t\tif (c >= 'a' && c <= 'z')
\t\t\t\t\t\tc -= 32;
\t\t\t\t}
\t\t\t\telse if (c >= 'A' && c <= 'Z')
\t\t\t\t\tc += 32;
\t\t\t\twrite(1, &c, 1);
\t\t\t\tj++;
\t\t\t}
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

		while (*str != '\\0' && *str != ' ' && *str != '\\t')
		{
			if (*str >= 'a' && *str <= 'z'
			&& (*(str + 1) == '\\0' || *(str + 1) == ' ' || *(str + 1) == '\\t'))
				*str = *str - ('a' - 'A');
			else if (*str >= 'A' && *str <= 'Z' && *(str + 1) != '\\0'
			&& *(str + 1) != ' ' && *(str + 1) != '\\t')
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
    { id: 'test_hello_world', descripcion: '"hello world" → "hellO worlD"', entrada: ['hello world'], salida: 'hellO worlD\n', tipo: 'normal' },
    { id: 'test_mixed', descripcion: '"hELLO wORLD" → "hellO worlD"', entrada: ['hELLO wORLD'], salida: 'hellO worlD\n', tipo: 'normal' },
    { id: 'test_single', descripcion: '"a b c" → "A B C"', entrada: ['a b c'], salida: 'A B C\n', tipo: 'normal' },
    { id: 'test_all_upper', descripcion: '"HELLO WORLD" → "hellO worlD"', entrada: ['HELLO WORLD'], salida: 'hellO worlD\n', tipo: 'normal' },
    { id: 'test_no_args', descripcion: 'sin args → solo newline', entrada: [], salida: '\n', tipo: 'edge' },
    { id: 'test_single_word', descripcion: '"hello" → "hellO"', entrada: ['hello'], salida: 'hellO\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: '"hello world": trazar con lookahead',
      codigo: `j=0: 'h', next='e' (no esp,no\\0) → tolower → 'h'
j=1: 'e', next='l' → 'e'
j=2: 'l', next='l' → 'l'
j=3: 'l', next='o' → 'l'
j=4: 'o', next=' ' → LAST → toupper → 'O'
j=5: ' ' → es espacio → write(' ')
j=6: 'w', next='o' → 'w'
j=7: 'o', next='r' → 'o'
j=8: 'r', next='l' → 'r'
j=9: 'l', next='d' → 'l'
j=10: 'd', next='\\0' → LAST → toupper → 'D'
write('\\n')
Salida: "hellO worlD"`,
      variables: [
        { nombre: 'salida', valor: '"hellO worlD"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Confundir con str_capitalizer — primera vs última letra',
      descripcion: 'str_capitalizer: PRIMERA → flag activate after space. rstr_capitalizer: ÚLTIMA → lookahead next char is space or \\0.',
      codigoMal: `// ❌ Capitalizar la primera (str_capitalizer)
if (capitalize) { toupper; capitalize=0; }
if (space) capitalize=1;`,
      codigoBien: `// ✅ Capitalizar la última (rstr_capitalizer)
if (!next || next == ' ') toupper;
else tolower;`,
    },
    {
      severidad: 'mortal',
      titulo: 'Aplicar toupper/tolower a los espacios',
      descripcion: 'Los espacios se escriben sin modificar. Solo aplicar transformación a letras (c != " ").',
      codigoMal: `// ❌ toupper(' ') podría dar resultado incorrecto
c = toupper(argv[i][j]);  // sin verificar si es espacio`,
      codigoBien: `// ✅ Verificar que no es espacio antes de transformar
if (c != ' ') {
    if (!argv[i][j+1] || argv[i][j+1]==' ') c = toupper(c);
    else c = tolower(c);
}`,
    },
  ],

  bajoCelCapot: `rstr_capitalizer = "reverse str_capitalizer".
La diferencia con str_capitalizer es conceptual: en vez de flag post-space,
usamos lookahead para detectar el final de cada palabra.
Útil para entender patrones de look-ahead en strings.
El case 'a b c' → 'A B C' es interesante: cada palabra tiene 1 sola letra,
que simultáneamente es primera Y última → resultado igual en ambas versiones.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El patrón de lookahead: si(argv[i][j+1]==" "||!argv[i][j+1]) es la clave. Es el opuesto exacto de str_capitalizer. Memorizarlos juntos como un par.',
  relacionados: ['str_capitalizer', 'epur_str', 'hidenp'],
}
