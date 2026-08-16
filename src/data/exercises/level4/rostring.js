export default {
  id: 'rostring',
  nombre: 'rostring',
  nivel: 4,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['rostring.c'],
  funcionesPermitidas: ['write', 'malloc', 'free'],

  subject: `Assignment name  : rostring
Expected files   : rostring.c
Allowed functions: write, malloc, free
--------------------------------------------------------------------------------

Write a program that takes a string and displays this string after rotating it
one word to the left.

Thus, the first word becomes the last, and others stay in the same order.

A "word" is defined as a part of a string delimited either by spaces/tabs, or
by the start/end of the string.

Words will be separated by only one space in the output.

If there's less than one argument, the program displays \\n.`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : rostring
Expected files   : rostring.c
Allowed functions: write, malloc, free
--------------------------------------------------------------------------------

Write a program that takes a string and displays this string after rotating it
one word to the left.

Thus, the first word becomes the last, and others stay in the same order.

A "word" is defined as a part of a string delimited either by spaces/tabs, or
by the start/end of the string.

Words will be separated by only one space in the output.

If there's less than one argument, the program displays \\n.

Example:

$>./rostring "abc   " | cat -e
abc$
$>
$>./rostring "Que la      lumiere soit et la lumiere fut"
la lumiere soit et la lumiere fut Que
$>
$>./rostring "     AkjhZ zLKIJz , 23y"
zLKIJz , 23y AkjhZ
$>
$>./rostring "first" "2" "11000000"
first
$>
$>./rostring | cat -e
$
$>`,

  descripcion: 'Programa que rota una frase una palabra a la izquierda: la primera palabra pasa al final.',

  palacio: {
    habitacion: 'garaje',
    mueble: 'cinta transportadora',
    personaje: 'El Rotador de Frases',
    emoji: '🧭',
    historia: `La cinta transportadora mueve palabras.
La primera palabra sube al final de la cola y el resto se queda en orden.
Se imprimen palabras separadas por un solo espacio.
Si no hay argumento, solo escribe "\\n".`,
    anclas: [
      'argc >= 2',
      'primera palabra al final',
      'espacios normalizados a uno',
    ],
  },

  herramientas: ['strings', 'punteros'],

  campayoMetodo: {
    feynman: `El programa recibe un string y rota sus palabras: la primera pasa al final.
Las palabras del string se imprimen en orden, pero la primera palabra va al final.
Ejemplo: "hello world foo" → "world foo hello".
Los espacios entre palabras se reducen a exactamente uno.`,
    datosPuros: [
      { elemento: 'saltar espacios → imprimir palabras 2..N → espacio → imprimir palabra 1', nota: 'orden de impresión: todas menos la primera, luego la primera' },
      { elemento: 'guardar inicio y longitud de la primera palabra', nota: 'necesitas recordar dónde empezó y cuánto ocupa' },
    ],
    asociaciones: [
      { dato: 'primera palabra al final', imagen: 'rostring es una ruleta de personas: todos avanzan un paso y el que estaba primero en la fila va al final. El truco: memorizas quién era el primero (inicio y longitud), dejas pasar a los demás, y al último lo llamas.' },
    ],
  },

  animacion: {
    "tipo": "word-split",
    "config": {
      "cadena": "hola mundo foo",
      "modo": "rotar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "separa la primera palabra del resto",
        "porque": "La primera palabra se moverá al final.",
        "concepto": "bandera"
      },
      {
        "codigo": "imprime desde la segunda palabra hasta el final",
        "porque": "El resto va primero.",
        "concepto": "strings"
      },
      {
        "codigo": "imprime al final la primera palabra",
        "porque": "Cierra la rotación.",
        "concepto": "strings"
      },
      {
        "codigo": "normaliza espacios (uno entre palabras)",
        "porque": "Salida sin espacios de más.",
        "concepto": "bandera"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Qué significa \"rotar\"?",
        "respuesta": "La primera palabra pasa al final: \"a b c\" → \"b c a\"."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Saltar la primera palabra y luego imprimirla al final',
    formula: 'find first word; print rest normalized; print first word last',
    ejemplo: {
      entrada: '"Que la lumiere soit et la lumiere fut"',
      calculo: 'resto = "la lumiere soit et la lumiere fut"; final = "Que"',
      resultado: 'la lumiere soit et la lumiere fut Que',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=rostring.c
file2=../../../../rendu/rostring/rostring.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 "abc   " > out1.txt 2>/dev/null
    ./out2 "abc   " > out2.txt 2>/dev/null

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

    ./out1 "Que la      lumiere soit et la lumiere fut" > out1.txt 2>/dev/null
    ./out2 "Que la      lumiere soit et la lumiere fut" > out2.txt 2>/dev/null

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

    ./out1 "     AkjhZ zLKIJz , 23y" > out1.txt 2>/dev/null
    ./out2 "     AkjhZ zLKIJz , 23y" > out2.txt 2>/dev/null

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

    ./out1 "first" "2" "11000000" > out1.txt 2>/dev/null
    ./out2 "first" "2" "11000000" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["abc   "], salida: "abc\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["Que la      lumiere soit et la lumiere fut"], salida: "la lumiere soit et la lumiere fut Que\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["     AkjhZ zLKIJz , 23y"], salida: "zLKIJz , 23y AkjhZ\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["first","2","11000000"], salida: "first\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Escaneo de la primera palabra + impresión normalizada',
      descripcion: 'La versión de examen más habitual.',
      recomendada: true,
      codigo: `#include <unistd.h>

static int	skip(char *s, int i)
{
\twhile (s[i] == ' ' || s[i] == '\\t')
\t\ti++;
\treturn (i);
}

static int	wordlen(char *s, int i)
{
\tint len;

\tlen = 0;
\twhile (s[i + len] && s[i + len] != ' ' && s[i + len] != '\\t')
\t\tlen++;
\treturn (len);
}

int main(int ac, char **av)
{
\tint i;
\tint first_start;
\tint first_len;
\tint first;
\tint len;

\tif (ac < 2)
\t\treturn (write(1, "\\n", 1), 0);
\ti = skip(av[1], 0);
\tfirst_start = i;
\tfirst_len = wordlen(av[1], i);
\tif (first_len == 0)
\t\treturn (write(1, "\\n", 1), 0);
\ti += first_len;
\tfirst = 1;
\twhile (av[1][i])
\t{
\t\ti = skip(av[1], i);
\t\tif (!av[1][i])
\t\t\tbreak;
\t\tlen = wordlen(av[1], i);
\t\tif (!first)
\t\t\twrite(1, " ", 1);
\t\twrite(1, &av[1][i], len);
\t\tfirst = 0;
\t\ti += len;
\t}
\tif (!first)
\t\twrite(1, " ", 1);
\twrite(1, &av[1][first_start], first_len);
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
      codigo: `
#include <unistd.h>

int		skip_whitespace(char *str, int i)
{
	while (str[i] == ' ' || str[i] == '\\t')
		++i;
	return (i);
}

int		ft_wordlen(char *str)
{
	int i = 0;

	while (str[i] != '\\0' && str[i] != ' ' && str[i] != '\\t')
		++i;
	return (i);
}

int		print_word(char *str, int i, int *is_first)
{
	int word_len;

	i = skip_whitespace(str, i);
	word_len = ft_wordlen(str + i);
	if (*is_first == 0)
		write(1, " ", 1);
	write(1, str + i, word_len);
	*is_first = 0;
	return (i + word_len);
}

int		epur_str(char *str)
{
	int i = 0;
	int is_first = 1;

	i = skip_whitespace(str, i);
	while (str[i] != '\\0')
	{
		i = print_word(str, i, &is_first);
		i = skip_whitespace(str, i);
	}
	return (is_first);
}

int		main(int argc, char **argv)
{
	if (argc >= 2)
	{
		char *str = argv[1];
		int i = 0;
		int is_first;

		i = skip_whitespace(str, i);
		i = i + ft_wordlen(str + i);
		is_first = epur_str(str + i);
		print_word(str, 0, &is_first);
	}
	write(1, "\\n", 1);
	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_1', descripcion: 'Que la lumiere... → primera al final', entrada: ['Que la      lumiere soit et la lumiere fut'], salida: 'la lumiere soit et la lumiere fut Que\n', tipo: 'normal' },
    { id: 'test_2', descripcion: 'AkjhZ zLKIJz , 23y → rotación una palabra', entrada: ['     AkjhZ zLKIJz , 23y'], salida: 'zLKIJz , 23y AkjhZ\n', tipo: 'normal' },
    { id: 'test_3', descripcion: 'una sola palabra', entrada: ['first'], salida: 'first\n', tipo: 'normal' },
    { id: 'test_empty', descripcion: 'sin argumentos → salto de línea', entrada: [], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Localizar la primera palabra',
      codigo: `av[1] = "Que la lumiere soit..."
i = skip(0) → av[1][i] = 'Q'
wordlen("Que") = 3`,
      variables: [
        { nombre: 'i', valor: '0', cambio: true, nota: 'inicio del string' },
      ],
    },
    {
      paso: 2,
      titulo: 'Imprimir el resto y luego la primera palabra',
      codigo: `resto = "la lumiere soit et la lumiere fut"
write("Que") al final`,
      variables: [
        { nombre: 'salida', valor: '"la lumiere soit et la lumiere fut Que"', cambio: true, nota: '' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'No mover la primera palabra al final',
      descripcion: 'La primera palabra no se elimina: se imprime al final del resultado.',
      codigoMal: `// ❌ imprime todo en orden original
while (...) write(...);`,
      codigoBien: `// ✅ imprime resto primero y primera palabra al final`,
    },
    {
      severidad: 'warning',
      titulo: 'Dejar múltiples espacios',
      descripcion: 'El resultado debe normalizar separadores a un solo espacio.',
      codigoMal: `write(1, " ", 1); // sin controlar bordes`,
      codigoBien: `write(1, " ", 1); // solo entre palabras`,
    },
  ],

  bajoCelCapot: `rostring es “rotar una frase una palabra”.
Es un patrón complementario a rev_wstr: aquí cambias el orden hacia la izquierda, no al revés.
Controlar el primer grupo y normalizar espacios es la clave.`,

  estrategia: 'ENTENDER',
  razonEstrategia: 'Trabaja con inicio/fin de palabras y con la normalización de espacios; entender el flujo de impresión evita errores de formato.',
  relacionados: ['rev_wstr', 'epur_str', 'first_word'],
}
