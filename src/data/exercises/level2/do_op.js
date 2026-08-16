export default {
  id: 'do_op',
  nombre: 'do_op',
  nivel: 2,
  dificultad: 'fácil',
  tipoEntrega: 'programa',
  archivosEsperados: ['do_op.c'],
  funcionesPermitidas: ['atoi', 'printf', 'write'],

  // ── Subject real (rank02/level1/do_op/sub.txt) ──
  subject: `Assignment name  : do_op
Expected files   : do_op.c
Allowed functions: atoi, printf, write
--------------------------------------------------------------------------------

Write a program that takes three strings:
- The first and the third one are representations of base-10 signed integers
  that fit in an int.
- The second one is an arithmetic operator chosen from: + - * / %

The program must display the result of the requested arithmetic operation,
followed by a newline. If the number of parameters is not 3, the program
just displays a newline.

You can assume the string have no mistakes or extraneous characters. Negative
numbers, in input or output, will have one and only one leading '-'. The
result of the operation fits in an int.

Examples:

$> ./do_op "123" "*" 456 | cat -e
56088$
$> ./do_op "9828" "/" 234 | cat -e
42$
$> ./do_op "1" "+" "-43" | cat -e
-42$
$> ./do_op | cat -e
$`,

  subjectReal: `Assignment name  : do_op
Expected files   : do_op.c
Allowed functions: atoi, printf, write
--------------------------------------------------------------------------------

Write a program that takes three strings:
- The first and the third one are representations of base-10 signed integers
  that fit in an int.
- The second one is an arithmetic operator chosen from: + - * / %

The program must display the result of the requested arithmetic operation,
followed by a newline. If the number of parameters is not 3, the program
just displays a newline.

You can assume the string have no mistakes or extraneous characters. Negative
numbers, in input or output, will have one and only one leading '-'. The
result of the operation fits in an int.

Examples:

$> ./do_op "123" "*" 456 | cat -e
56088$
$> ./do_op "9828" "/" 234 | cat -e
42$
$> ./do_op "1" "+" "-43" | cat -e
-42$
$> ./do_op | cat -e
$`,

  // Subject didáctico previo (más estricto: exige "Error" en bad-argc, valida
  // operador y división por cero). Conservado por si quieres practicarlo así.
  subjectAlternativo: `Assignment name  : do_op
Expected files   : do_op.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes three strings:
  - Two representing integer values.
  - One representing an arithmetic operator (+, -, *, /, %).

The program must display the integer result of the requested operation,
followed by a newline.

If the number of parameters is not 3, or if the operator is not one of the
valid operators, simply display "Error", followed by a newline.

Division and modulo by zero also display "Error".

Example:
$> ./do_op 42 "*" 2
84
$> ./do_op 10 / 2
5
$> ./do_op 10 % 0
Error
$>`,

  descripcion: 'Programa que realiza operaciones aritméticas: argc==4 (programa + 3 args). Convierte strings a int, aplica operador, imprime resultado o "Error".',

  palacio: {
    habitacion: 'salon',
    mueble: 'mesita',
    personaje: 'La Calculadora de la mesita',
    emoji: '🧮',
    historia: `En la mesita del salón hay una Calculadora mágica.
Le das TRES argumentos: el número A, el operador (+,-,*,/,%) y el número B.
Si el operador es válido y no hay división por cero, calcula y muestra el resultado.
Si algo está mal (mal argc, operador desconocido, /0), grita "Error".
¡El programa cuenta como argv[0], así que argc válido = 4!`,
    anclas: [
      "argc != 4 → Error (programa + 3 argumentos)",
      "a = atoi(argv[1]), op = argv[2][0], b = atoi(argv[3])",
      "/ o % con b==0 → Error",
      "operador inválido → Error",
      "división: truncar hacia cero (comportamiento C)",
    ],
  },

  herramientas: ['strings', 'argc', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe 3 argumentos: un número, un operador y otro número.
Convierte los dos strings de números en enteros (usando ft_atoi o similar).
Aplica la operación indicada por el operador (+, -, *, /, %).
Imprime el resultado.
Si el operador no es válido, o si se divide entre 0, imprime "Error".`,
    datosPuros: [
      { elemento: 'argc == 4', nota: '4 argumentos: programa + num1 + operador + num2' },
      { elemento: 'av[2][0]', nota: 'el operador es av[2], pero solo el primer carácter cuenta' },
      { elemento: '"Error\\n"', nota: 'con mayúscula y newline — exactamente así' },
    ],
    asociaciones: [
      { dato: 'argc == 4', imagen: 'La calculadora del do_op necesita 4 ingredientes: ella misma + primer número + símbolo de operación + segundo número. Ni uno más ni uno menos.' },
      { dato: '"Error\\n" con mayúscula', imagen: 'El robot calculador tiene un cartel de ERROR en mayúscula gigante que muestra cuando alguien le pide dividir por cero o le da un operador raro. El cartel siempre lleva su salto de línea.' },
    ],
  },

  animacion: {
    "tipo": "word-split",
    "config": {
      "cadena": "42 + 8",
      "modo": "todos"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "if (argc != 4) return (0);",
        "porque": "Necesita exactamente: número, operador, número.",
        "concepto": "condicionales"
      },
      {
        "codigo": "int a = ft_atoi(argv[1]);",
        "porque": "Convierte el primer número de texto a int.",
        "concepto": "ascii"
      },
      {
        "codigo": "int b = ft_atoi(argv[3]);",
        "porque": "Convierte el segundo número.",
        "concepto": "ascii"
      },
      {
        "codigo": "char op = argv[2][0];",
        "porque": "El operador es el primer carácter del arg central.",
        "concepto": "strings"
      },
      {
        "codigo": "if (op == '+') ft_putnbr(a + b);",
        "porque": "Según el operador, ejecuta la operación.",
        "concepto": "condicionales"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué ft_atoi y no usar argv directamente?",
        "respuesta": "argv son cadenas de texto; para sumar necesitas números enteros reales."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Leer dos enteros y un operador, aplicar y escribir resultado',
    formula: 'a = ft_atoi(argv[1]); b = ft_atoi(argv[3]); op = argv[2][0];',
    ejemplo: {
      entrada: '"42" "*" "2"',
      calculo: 'a=42, op="*", b=2 → 42*2=84',
      resultado: '84',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=do_op.c
file2=../../../../rendu/do_op/do_op.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 "123" "*" "456" > out1.txt 2>/dev/null
    ./out2 "123" "*" "456" > out2.txt 2>/dev/null

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

    ./out1 "9828" "/" "234" > out1.txt 2>/dev/null
    ./out2 "9828" "/" "234" > out2.txt 2>/dev/null

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

    ./out1 "9828" "%" "234" > out1.txt 2>/dev/null
    ./out2 "9828" "%" "234" > out2.txt 2>/dev/null

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

    ./out1 "9828" "/" "2" > out1.txt 2>/dev/null
    ./out2 "9828" "/" "2" > out2.txt 2>/dev/null

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

    ./out1 "1" "+" "-43" > out1.txt 2>/dev/null
    ./out2 "1" "+" "-43" > out2.txt 2>/dev/null

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
# 6. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

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


    rm out1 out2 out1.txt out2.txt 2>/dev/null
    echo "$(tput setaf 2)$(tput bold)PASSED 🎉$(tput sgr 0)"
    exit 1`,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: ["123","*","456"], salida: "56088\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["9828","/","234"], salida: "42\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["9828","%","234"], salida: "0\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["9828","/","2"], salida: "4914\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["1","+","-43"], salida: "-42\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con ft_atoi y ft_putnbr propios',
      descripcion: 'La solución completa que implementa las funciones auxiliares necesarias.',
      recomendada: true,
      codigo: `#include <unistd.h>

static int\tft_atoi(char *str)
{
\tint\tresult;
\tint\tsign;

\tresult = 0;
\tsign = 1;
\twhile (*str == ' ' || (*str >= '\\t' && *str <= '\\r'))
\t\tstr++;
\tif (*str == '-' || *str == '+')
\t{
\t\tif (*str == '-')
\t\t\tsign = -1;
\t\tstr++;
\t}
\twhile (*str >= '0' && *str <= '9')
\t\tresult = result * 10 + (*str++ - '0');
\treturn (result * sign);
}

static void\tft_putnbr(int n)
{
\tchar\tc;

\tif (n < 0)
\t{
\t\twrite(1, "-", 1);
\t\tn = -n;
\t}
\tif (n >= 10)
\t\tft_putnbr(n / 10);
\tc = '0' + (n % 10);
\twrite(1, &c, 1);
}

int\tmain(int argc, char **argv)
{
\tint\ta;
\tint\tb;
\tchar\top;
\tint\tresult;

\tif (argc != 4)
\t{
\t\twrite(1, "Error\\n", 6);
\t\treturn (0);
\t}
\ta = ft_atoi(argv[1]);
\top = argv[2][0];
\tb = ft_atoi(argv[3]);
\tif (op == '+')
\t\tresult = a + b;
\telse if (op == '-')
\t\tresult = a - b;
\telse if (op == '*')
\t\tresult = a * b;
\telse if (op == '/' && b != 0)
\t\tresult = a / b;
\telse if (op == '%' && b != 0)
\t\tresult = a % b;
\telse
\t{
\t\twrite(1, "Error\\n", 6);
\t\treturn (0);
\t}
\tft_putnbr(result);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'switch',
      nombre: 'Con switch sobre el operador',
      descripcion: 'Agrupa las operaciones en un switch para que la lógica del examen sea más fácil de seguir.',
      recomendada: false,
      codigo: `#include <unistd.h>

static int\tft_atoi(char *str)
{
\tint\tresult;
\tint\tsign;

\tresult = 0;
\tsign = 1;
\twhile (*str == ' ' || (*str >= '\\t' && *str <= '\\r'))
\t\tstr++;
\tif (*str == '-' || *str == '+')
\t{
\t\tif (*str == '-')
\t\t\tsign = -1;
\t\tstr++;
\t}
\twhile (*str >= '0' && *str <= '9')
\t\tresult = result * 10 + (*str++ - '0');
\treturn (result * sign);
}

static void\tft_putnbr(int n)
{
\tchar\tc;

\tif (n < 0)
\t{
\t\twrite(1, "-", 1);
\t\tn = -n;
\t}
\tif (n >= 10)
\t\tft_putnbr(n / 10);
\tc = '0' + (n % 10);
\twrite(1, &c, 1);
}

int\tmain(int argc, char **argv)
{
\tint\ta;
\tint\tb;
\tchar\top;
\tint\tresult;

\tif (argc != 4)
\t{
\t\twrite(1, "Error\\n", 6);
\t\treturn (0);
\t}
\ta = ft_atoi(argv[1]);
\top = argv[2][0];
\tb = ft_atoi(argv[3]);
\tswitch (op)
\t{
\t\tcase '+':
\t\t\tresult = a + b;
\t\t\tbreak ;
\t\tcase '-':
\t\t\tresult = a - b;
\t\t\tbreak ;
\t\tcase '*':
\t\t\tresult = a * b;
\t\t\tbreak ;
\t\tcase '/':
\t\t\tif (b == 0)
\t\t\t{
\t\t\t\twrite(1, "Error\\n", 6);
\t\t\t\treturn (0);
\t\t\t}
\t\t\tresult = a / b;
\t\t\tbreak ;
\t\tcase '%':
\t\t\tif (b == 0)
\t\t\t{
\t\t\t\twrite(1, "Error\\n", 6);
\t\t\t\treturn (0);
\t\t\t}
\t\t\tresult = a % b;
\t\t\tbreak ;
\t\tdefault:
\t\t\twrite(1, "Error\\n", 6);
\t\t\treturn (0);
\t}
\tft_putnbr(result);
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
      codigo: `#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int	main(int ac, char **av)
{
	int	n1 = 0;
	int n2 = 0;
	int	res = 0;

	if (ac == 4)
	{
		n1 = atoi(av[1]);
		n2 = atoi(av[3]);
		if (av[2][0] == '+')
			res = n1 + n2;
		else if (av[2][0] == '-')
			res = n1 - n2;
		else if (av[2][0] == '*')
			res = n1 * n2;
		else if (av[2][0]== '/')
			res = n1 / n2;
		else if (av[2][0] == '%')
			res = n1 % n2;
		printf("%d\\n", res);
	}
	else
		write(1, "\\n", 1);
}`,
    },
  ],

  tests: [
    { id: 'test_suma', descripcion: '42 + 2 → 44', entrada: ['42', '+', '2'], salida: '44\n', tipo: 'normal' },
    { id: 'test_resta', descripcion: '10 - 3 → 7', entrada: ['10', '-', '3'], salida: '7\n', tipo: 'normal' },
    { id: 'test_mult', descripcion: '6 * 7 → 42', entrada: ['6', '*', '7'], salida: '42\n', tipo: 'normal' },
    { id: 'test_div', descripcion: '10 / 3 → 3 (entero truncado)', entrada: ['10', '/', '3'], salida: '3\n', tipo: 'normal' },
    { id: 'test_mod', descripcion: '10 % 3 → 1', entrada: ['10', '%', '3'], salida: '1\n', tipo: 'normal' },
    { id: 'test_div_cero', descripcion: '5 / 0 → Error', entrada: ['5', '/', '0'], salida: 'Error\n', tipo: 'edge' },
    { id: 'test_bad_op', descripcion: 'Operador ^ inválido → Error', entrada: ['5', '^', '3'], salida: 'Error\n', tipo: 'edge' },
    { id: 'test_bad_argc', descripcion: 'Sin argumentos → Error', entrada: [], salida: 'Error\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Entrada: "42" "+" "2" → argc=4',
      codigo: `argc=4, argv[1]="42", argv[2]="+", argv[3]="2"
a = ft_atoi("42") = 42
op = argv[2][0] = '+'
b = ft_atoi("2") = 2`,
      variables: [
        { nombre: 'a', valor: '42', cambio: true, nota: '' },
        { nombre: 'op', valor: "'+'", cambio: true, nota: '' },
        { nombre: 'b', valor: '2', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: "op == '+' → result = 42 + 2 = 44",
      codigo: `if (op == '+') → TRUE
result = a + b = 42 + 2 = 44
ft_putnbr(44) → write '4','4'
write "\\n"
stdout: "44\\n"`,
      variables: [
        { nombre: 'result', valor: '44', cambio: true, nota: '' },
        { nombre: 'stdout', valor: '"44\\n"', cambio: true, nota: '✓' },
      ],
    },
    {
      paso: 3,
      titulo: 'Caso error: "5 / 0" → b=0 → Error',
      codigo: `a=5, op='/', b=0
if (op == '/') → TRUE
if (op == '/' && b != 0) → FALSE (b==0)
→ else → write "Error\\n"`,
      variables: [
        { nombre: 'b', valor: '0', cambio: false, nota: '← división por cero' },
        { nombre: 'stdout', valor: '"Error\\n"', cambio: true, nota: '' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'info',
      titulo: 'Diferencia plataforma vs examen real',
      descripcion: 'El subject real (rank02) permite usar `atoi` y `printf` directamente, y en argc != 4 sólo imprime un newline (NO "Error"). El subject didáctico de la plataforma era más exigente: prohibía `atoi`/`printf` (te obligaba a escribir ft_atoi y ft_putnbr) y exigía la cadena literal "Error" en bad-argc / operador inválido / división por cero. El didáctico queda en `subjectAlternativo` por si quieres practicarlo. Los `tests` actuales aún siguen la versión didáctica (se actualizarán cuando se añadan `testsRank02`).',
      codigoMal: `// Versión didáctica antigua: implementabas ft_atoi/ft_putnbr a mano
// y escribías "Error\\n" en bad-argc. Pasa la moulinette didáctica pero
// duplica trabajo respecto al examen real.`,
      codigoBien: `// Subject real: puedes apoyarte en atoi y printf
int a = atoi(argv[1]);
int b = atoi(argv[3]);
if (argc != 4) { write(1, "\\n", 1); return 0; }
// ...switch sobre argv[2][0], printf("%d\\n", result);`,
    },
    {
      severidad: 'mortal',
      titulo: 'argc != 3 en vez de argc != 4',
      descripcion: 'El programa "do_op" es argv[0]. Con 3 argumentos de usuario → argc = 4. La comprobación correcta es argc != 4.',
      codigoMal: `// ❌ argc==3 con 3 args de usuario sería argc=4, no 3
if (argc != 3)  // do_op 42 + 2 → argc=4, no entraría aquí nunca`,
      codigoBien: `// ✅
if (argc != 4)  // programa + 3 argumentos = 4`,
    },
    {
      severidad: 'mortal',
      titulo: 'División entera trunca hacia cero en C (no floor)',
      descripcion: '-7 / 2 = -3 en C (trunca hacia cero), no -4 (que sería floor). La Moulinette espera el comportamiento de C.',
      codigoMal: `// ❌ No trunca hacia cero correctamente en todos los compiladores
// sin comportamiento definido para negativos en C89`,
      codigoBien: `// ✅ En C99/C11 la división entera siempre trunca hacia cero
// -7 / 2 = -3 (no -4)
result = a / b;  // comportamiento definido en C99+`,
    },
    {
      severidad: 'warning',
      titulo: 'Comprobar ambos / y % contra división por cero',
      descripcion: 'Tanto a/0 como a%0 son undefined behavior en C. Hay que proteger ambos.',
      codigoMal: `// ❌ Solo protege división
else if (op == '/' && b != 0) result = a / b;
else if (op == '%') result = a % b;  // ← a%0 también es UB`,
      codigoBien: `// ✅ Protege ambos
else if (op == '/' && b != 0) result = a / b;
else if (op == '%' && b != 0) result = a % b;`,
    },
  ],

  bajoCelCapot: `El operador viene como string (argv[2]). Sólo el primer byte es relevante (argv[2][0]).
La conversión de string a int la hace ft_atoi (o atoi si está permitida).
El resultado debe imprimirse con ft_putnbr (o printf si está permitida).`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Patrón de parseo de argumentos múltiples + conversión de tipos. El manejo de argc==4 es la trampa clásica.',
  relacionados: ['ft_atoi', 'paramsum'],
}
