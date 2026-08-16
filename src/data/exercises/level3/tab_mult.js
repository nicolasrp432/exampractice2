export default {
  id: 'tab_mult',
  nombre: 'tab_mult',
  nivel: 3,
  dificultad: 'fácil',
  tipoEntrega: 'programa',
  archivosEsperados: ['tab_mult.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : tab_mult
Expected files   : tab_mult.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that displays a number's multiplication table.

The program must display the multiplication table of the number given as
argument (from 1 to 9), each operation on its own line.

If the number of arguments is not 1, or if the argument is not a number
between 1 and 9, the program displays a newline.

Format: "i x n = result\\n" for i from 1 to 9.

Example:
$> ./tab_mult 9
1 x 9 = 9
2 x 9 = 18
3 x 9 = 27
4 x 9 = 36
5 x 9 = 45
6 x 9 = 54
7 x 9 = 63
8 x 9 = 72
9 x 9 = 81`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : tab_mult
Expected files   : tab_mult.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that displays a number's multiplication table.

The parameter will always be a strictly positive number that fits in an int,
and said number times 9 will also fit in an int.

If there are no parameters, the program displays \\n.

Examples:

$>./tab_mult 9
1 x 9 = 9
2 x 9 = 18
3 x 9 = 27
4 x 9 = 36
5 x 9 = 45
6 x 9 = 54
7 x 9 = 63
8 x 9 = 72
9 x 9 = 81
$>./tab_mult 19
1 x 19 = 19
2 x 19 = 38
3 x 19 = 57
4 x 19 = 76
5 x 19 = 95
6 x 19 = 114
7 x 19 = 133
8 x 19 = 152
9 x 19 = 171
$>
$>./tab_mult | cat -e
$
$>`,

  descripcion: 'Programa que muestra la tabla de multiplicar del número dado (1-9). Formato exacto: "i x n = resultado\\n" para i de 1 a 9. Requiere put_nbr para imprimir los números.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'poster',
    personaje: 'El Póster de la Tabla',
    emoji: '📋',
    historia: `En el dormitorio hay un Póster de tablas de multiplicar en la pared.
Le dices un número del 1 al 9 y el Póster despliega su tabla completa.
El formato es EXACTO: "i x n = resultado" — con espacios alrededor de x y =.
El Póster solo acepta números entre 1 y 9. Si le das otra cosa: solo imprime '\\n'.
Usa put_nbr para imprimir los números sin printf.`,
    anclas: [
      "for i=1 to 9: write 'i x n = resultado\\n'",
      "formato EXACTO: '1 x N = R\\n' — espacios incluidos",
      "n debe estar entre 1 y 9 (inclusive)",
      "put_nbr para imprimir enteros sin printf",
      "argc != 2 → solo '\\n'",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe un número n e imprime su tabla de multiplicar del 1 al 9.
Para cada número del 1 al 9, multiplica n × i y escribe el resultado.
El formato exacto es: "n * i = resultado\\n".
Necesita funciones auxiliares para convertir enteros a strings (ft_putnbr o similar).`,
    datosPuros: [
      { elemento: '"n * i = resultado\\n"', nota: 'formato exacto con espacios alrededor de * y = — byte a byte' },
      { elemento: 'i de 1 a 9 inclusive', nota: 'el bucle va from i=1 to i<=9' },
    ],
    asociaciones: [
      { dato: 'formato "n * i = resultado"', imagen: 'El robot tab_mult tiene un sello con el patrón "X * Y = Z". Cada vez que multiplica, estampa el sello con los números rellenados. Si cambias los espacios del sello, el examen falla — el sello es exacto.' },
    ],
  },

  animacion: {
    "tipo": "counter",
    "config": {
      "desde": 1,
      "hasta": 9,
      "condiciones": []
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int n = ft_atoi(argv[1]);",
        "porque": "Convierte el argumento en el número de la tabla.",
        "concepto": "ascii"
      },
      {
        "codigo": "int i = 1;",
        "porque": "La tabla va del 1 al 9.",
        "concepto": "variables"
      },
      {
        "codigo": "while (i <= 9)",
        "porque": "Nueve líneas de resultado.",
        "concepto": "bucles"
      },
      {
        "codigo": "  imprime \"i x n = (i*n)\"",
        "porque": "Cada línea es una multiplicación.",
        "concepto": "primitivas"
      },
      {
        "codigo": "  i++;",
        "porque": "Siguiente línea.",
        "concepto": "bucles"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué del 1 al 9?",
        "respuesta": "El enunciado define la tabla de multiplicar clásica de 1 a 9."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Bucle de 1 a 9 imprimiendo "i x n = i*n"',
    formula: 'for i=1 to 9: put_nbr(i); write(" x "); put_nbr(n); write(" = "); put_nbr(i*n); write("\\n");',
    ejemplo: {
      entrada: 'n=9, i=2',
      calculo: '"2 x 9 = 18\\n"',
      resultado: '"2 x 9 = 18"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=tab_mult.c
file2=../../../../rendu/tab_mult/tab_mult.c


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

    ./out1 "9" > out1.txt 2>/dev/null
    ./out2 "9" > out2.txt 2>/dev/null

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

    ./out1 "12" > out1.txt 2>/dev/null
    ./out2 "12" > out2.txt 2>/dev/null

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
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "4" > out1.txt 2>/dev/null
    ./out2 "4" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 6. test 
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

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


    rm out1 out2 out1.txt out2.txt 2>/dev/null
    echo "$(tput setaf 2)$(tput bold)PASSED 🎉$(tput sgr 0)"
    exit 1`,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: [], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["9"], salida: "1 x 9 = 9\n2 x 9 = 18\n3 x 9 = 27\n4 x 9 = 36\n5 x 9 = 45\n6 x 9 = 54\n7 x 9 = 63\n8 x 9 = 72\n9 x 9 = 81\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["12"], salida: "1 x 12 = 12\n2 x 12 = 24\n3 x 12 = 36\n4 x 12 = 48\n5 x 12 = 60\n6 x 12 = 72\n7 x 12 = 84\n8 x 12 = 96\n9 x 12 = 108\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["1"], salida: "1 x 1 = 1\n2 x 1 = 2\n3 x 1 = 3\n4 x 1 = 4\n5 x 1 = 5\n6 x 1 = 6\n7 x 1 = 7\n8 x 1 = 8\n9 x 1 = 9\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["4"], salida: "1 x 4 = 4\n2 x 4 = 8\n3 x 4 = 12\n4 x 4 = 16\n5 x 4 = 20\n6 x 4 = 24\n7 x 4 = 28\n8 x 4 = 32\n9 x 4 = 36\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["0"], salida: "1 x 0 = 0\n2 x 0 = 0\n3 x 0 = 0\n4 x 0 = 0\n5 x 0 = 0\n6 x 0 = 0\n7 x 0 = 0\n8 x 0 = 0\n9 x 0 = 0\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con put_nbr y strings literales',
      descripcion: 'La más legible. Usa write con strings " x " y " = " directamente.',
      recomendada: true,
      codigo: `#include <unistd.h>

static void\tput_nbr(int n)
{
\tchar\tc;

\tif (n >= 10)
\t\tput_nbr(n / 10);
\tc = '0' + n % 10;
\twrite(1, &c, 1);
}

int\tmain(int argc, char **argv)
{
\tint\tn;
\tint\ti;

\tif (argc != 2 || argv[1][0] < '1' || argv[1][0] > '9' || argv[1][1])
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\tn = argv[1][0] - '0';
\ti = 1;
\twhile (i <= 9)
\t{
\t\tput_nbr(i);
\t\twrite(1, " x ", 3);
\t\tput_nbr(n);
\t\twrite(1, " = ", 3);
\t\tput_nbr(i * n);
\t\twrite(1, "\\n", 1);
\t\ti++;
\t}
\treturn (0);
}`,
    },
    {
      id: 'atoi',
      nombre: 'Con atoi y validación completa',
      descripcion: 'Convierte el argumento con ft_atoi y valida el rango.',
      recomendada: false,
      codigo: `#include <unistd.h>

static void\tput_nbr(int n)
{
\tchar\tc;

\tif (n >= 10)
\t\tput_nbr(n / 10);
\tc = '0' + n % 10;
\twrite(1, &c, 1);
}

static int\tft_atoi(char *s)
{
\tint\tn;

\tn = 0;
\twhile (*s >= '0' && *s <= '9')
\t\tn = n * 10 + (*s++ - '0');
\treturn (n);
}

int\tmain(int argc, char **argv)
{
\tint\tn;
\tint\ti;

\tif (argc != 2)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\tn = ft_atoi(argv[1]);
\tif (n < 1 || n > 9)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\ti = 1;
\twhile (i <= 9)
\t{
\t\tput_nbr(i);
\t\twrite(1, " x ", 3);
\t\tput_nbr(n);
\t\twrite(1, " = ", 3);
\t\tput_nbr(i * n);
\t\twrite(1, "\\n", 1);
\t\ti++;
\t}
\treturn (0);
}`,
    },
    {
      id: 'char_to_int',
      nombre: 'Con conversión directa del char',
      descripcion: 'Convierte el argumento con una resta ASCII y usa un solo bucle.',
      recomendada: false,
      codigo: `#include <unistd.h>

static void	put_nbr(int n)
{
	char	c;

	if (n >= 10)
		put_nbr(n / 10);
	c = '0' + n % 10;
	write(1, &c, 1);
}

int	main(int argc, char **argv)
{
	int	n;
	int	i;

	if (argc != 2 || argv[1][1] || argv[1][0] < '1' || argv[1][0] > '9')
	{
		write(1, "\n", 1);
		return (0);
	}
	n = argv[1][0] - '0';
	i = 1;
	while (i <= 9)
	{
		put_nbr(i);
		write(1, " x ", 3);
		put_nbr(n);
		write(1, " = ", 3);
		put_nbr(i * n);
		write(1, "\n", 1);
		i++;
	}
	return (0);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `// Passed Moulinette 2019.09.02

#include <unistd.h>

int		ft_atoi(char *str)
{
	int n = 0;

	while (*str >= '0' && *str <= '9')
	{
		n = n * 10;
		n = n + *str - '0';
		++str;
	}
	return (n);
}

void	ft_putnbr(int n)
{
	if (n >= 10)
		ft_putnbr(n / 10);

	char c = (n % 10) + '0';
	write(1, &c, 1);
}

void	tab_mult(char *str)
{
	int n;
	int i = 1;

	n = ft_atoi(str);
	while (i <= 9)
	{
		ft_putnbr(i);
		write(1, " x ", 3);
		ft_putnbr(n);
		write(1, " = ", 3);
		ft_putnbr(i * n);
		write(1, "\\n", 1);
		++i;
	}
}

int		main(int argc, char **argv)
{
	if (argc == 2)
		tab_mult(argv[1]);
	else
		write(1, "\\n", 1);
	return (0);
}`,
    },
  ],
  tests: [
    {
      id: 'test_9',
      descripcion: 'n=9 → tabla del 9',
      entrada: ['9'],
      salida: '1 x 9 = 9\n2 x 9 = 18\n3 x 9 = 27\n4 x 9 = 36\n5 x 9 = 45\n6 x 9 = 54\n7 x 9 = 63\n8 x 9 = 72\n9 x 9 = 81\n',
      tipo: 'normal',
    },
    {
      id: 'test_1',
      descripcion: 'n=1 → tabla del 1',
      entrada: ['1'],
      salida: '1 x 1 = 1\n2 x 1 = 2\n3 x 1 = 3\n4 x 1 = 4\n5 x 1 = 5\n6 x 1 = 6\n7 x 1 = 7\n8 x 1 = 8\n9 x 1 = 9\n',
      tipo: 'normal',
    },
    {
      id: 'test_5',
      descripcion: 'n=5 → tabla del 5',
      entrada: ['5'],
      salida: '1 x 5 = 5\n2 x 5 = 10\n3 x 5 = 15\n4 x 5 = 20\n5 x 5 = 25\n6 x 5 = 30\n7 x 5 = 35\n8 x 5 = 40\n9 x 5 = 45\n',
      tipo: 'normal',
    },
    { id: 'test_0', descripcion: 'n=0 → fuera de rango → "\\n"', entrada: ['0'], salida: '\n', tipo: 'edge' },
    { id: 'test_10', descripcion: 'n=10 → fuera de rango → "\\n"', entrada: ['10'], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'n=9, i=1: primera línea',
      codigo: `n = 9, i = 1
put_nbr(1) → write('1')
write(1, " x ", 3) → " x "
put_nbr(9) → write('9')
write(1, " = ", 3) → " = "
put_nbr(1 * 9 = 9) → write('9')
write(1, "\\n", 1) → "\\n"
Salida: "1 x 9 = 9\\n"`,
      variables: [
        { nombre: 'i', valor: '1', cambio: false, nota: '' },
        { nombre: 'i * n', valor: '9', cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'n=9, i=2: segunda línea (resultado de 2 dígitos)',
      codigo: `i = 2
put_nbr(2) → "2"
" x "
put_nbr(9) → "9"
" = "
put_nbr(18): 18>=10 → put_nbr(1) → "1"; c='8' → "8"
"\\n"
Salida: "2 x 9 = 18\\n"`,
      variables: [
        { nombre: 'i * n', valor: '18', cambio: true, nota: '← 2 dígitos: put_nbr recursivo' },
      ],
    },
    {
      paso: 3,
      titulo: 'Bucle termina en i=9',
      codigo: `i=9:
"9 x 9 = 81\\n"
i++ → i=10
10 <= 9 → FALSE → sale`,
      variables: [
        { nombre: 'salida final', valor: '9 líneas, última "9 x 9 = 81\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Formato incorrecto: sin espacios alrededor de x y =',
      descripcion: 'El formato EXACTO es "i x n = resultado". Hay espacios antes y después de x, y antes y después de =. Cualquier diferencia da error.',
      codigoMal: `// ❌ Sin espacios
write(1, "x", 1);  // "1x9=9" — incorrecto
write(1, "=", 1);`,
      codigoBien: `// ✅ Con espacios exactos
write(1, " x ", 3);  // " x "
write(1, " = ", 3);  // " = "`,
    },
    {
      severidad: 'mortal',
      titulo: 'No validar que n esté entre 1 y 9',
      descripcion: 'Si n=0 o n=10 (u otro valor fuera de rango), el programa debe imprimir solo \\n. Sin validar, imprimiría una tabla inválida.',
      codigoMal: `// ❌ Sin validación de rango
n = ft_atoi(argv[1]);
// n podría ser 0, 10, -5, etc.`,
      codigoBien: `// ✅ Validar rango
n = ft_atoi(argv[1]);
if (n < 1 || n > 9) { write(1, "\\n", 1); return 0; }`,
    },
    {
      severidad: 'warning',
      titulo: 'Usar printf en vez de write',
      descripcion: 'Las funciones permitidas son solo write. Aunque printf funciona en el examen real, en el simulador y norminette es importante usar solo write.',
      codigoMal: `// ❌ printf no permitido
printf("%d x %d = %d\\n", i, n, i * n);`,
      codigoBien: `// ✅ write + put_nbr
put_nbr(i); write(1, " x ", 3); put_nbr(n); write(1, " = ", 3); put_nbr(i * n); write(1, "\\n", 1);`,
    },
  ],

  bajoCelCapot: `put_nbr(n) imprime n recursivamente: para n=81, llama put_nbr(8) que imprime '8', luego imprime '1'.
El formato " x " tiene 3 bytes (espacio, x, espacio) → write(1, " x ", 3).
Validar el input: argv[1][0] entre '1'-'9' y argv[1][1]==0 es la forma más compacta.
El bucle de 1 a 9 es el más simple posible para una tabla de multiplicar.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El formato exacto "i x n = r" con los espacios correctos y la función put_nbr son lo que hay que memorizar. El bucle de 1 a 9 es trivial.',
  relacionados: ['paramsum', 'add_prime_sum', 'print_hex'],
}
