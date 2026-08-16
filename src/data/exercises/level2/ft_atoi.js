export default {
  id: 'ft_atoi',
  nombre: 'ft_atoi',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_atoi.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_atoi
Expected files   : ft_atoi.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that converts the initial portion of the string pointed to
by str to int representation.

int\tft_atoi(const char *str);

The function should behave like the standard atoi(3) function:
- Skip whitespace characters (space, \\t, \\n, \\r, \\f, \\v).
- Read optional sign (+ or -).
- Read digits until non-digit.
- Return the resulting integer.`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_atoi
Expected files   : ft_atoi.c
Allowed functions: None
--------------------------------------------------------------------------------

Write a function that converts the string argument str to an integer (type int)
and returns it.

It works much like the standard atoi(const char *str) function, see the man.

Your function must be declared as follows:

int	ft_atoi(const char *str);`,

  descripcion: 'Función que convierte un string a int: salta espacios blancos, lee signo opcional, acumula dígitos. Replica el comportamiento de atoi(3).',

  palacio: {
    habitacion: 'salon',
    mueble: 'television',
    personaje: 'El Traductor de números',
    emoji: '🔢',
    historia: `En el salón hay un Traductor de números que lee el string FASE A FASE.
FASE 1: Salta los espacios blancos (space, tab, \\n, \\r, \\f, \\v) del principio.
FASE 2: Lee el signo opcional (+ o -). Solo un signo.
FASE 3: Acumula dígitos: result = result*10 + (c-'0').
Cuando llega a un carácter no-dígito, para y devuelve el número.`,
    anclas: [
      "FASE 1: while(isspace) → salta espacios",
      "FASE 2: if (+/-) → signo; ¡solo uno!",
      "FASE 3: while(isdigit) result=result*10+(c-'0')",
      "return (result * sign)",
      "isspace: ' ', \\t, \\n, \\r, \\f, \\v",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `La función convierte un string de números en un entero.
Primero salta los espacios y tabulaciones del principio.
Luego mira si hay un signo + o - (si no hay, es positivo).
Luego va dígito a dígito y construye el número: resultado = resultado * 10 + (c - '0').
Para cuando deja de haber dígitos.`,
    datosPuros: [
      { elemento: "result = result * 10 + (c - '0')", nota: "fórmula para construir el número: cada dígito desplaza los anteriores una posición decimal" },
      { elemento: 'c - 0x30  o  c - 48  o  c - \'0\'', nota: "las tres formas son equivalentes — '0' en ASCII es 48" },
      { elemento: 'sign = -1 si hay -', nota: 'multiplicar por sign al final para el resultado negativo' },
    ],
    asociaciones: [
      { dato: "result * 10 + (c - '0')", imagen: "El constructor de números es como un teleférico: con cada dígito nuevo, todos los anteriores suben un piso (×10) y el nuevo se sienta en planta baja. Al final, el número completo está construido piso a piso." },
      { dato: "c - '0' (quitar ASCII 48)", imagen: "El dígito '5' lleva puesto el disfraz de ASCII (valor 53). Para quitarle el disfraz le restas '0' (48) y te queda el número real 5. Sin quitarle el disfraz, el número sale disparatado." },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "1234",
      "modo": "copiar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int res = 0, signo = 1;",
        "porque": "Acumulador del número y su signo.",
        "concepto": "variables"
      },
      {
        "codigo": "while (espacios/blancos) i++;",
        "porque": "Salta espacios iniciales.",
        "concepto": "bandera"
      },
      {
        "codigo": "if (str[i]=='-') signo = -1;",
        "porque": "Detecta signo negativo.",
        "concepto": "condicionales"
      },
      {
        "codigo": "while (str[i] >= '0' && str[i] <= '9')",
        "porque": "Mientras haya dígitos...",
        "concepto": "strings"
      },
      {
        "codigo": "  res = res * 10 + (str[i] - '0');",
        "porque": "Desplaza el número y añade el nuevo dígito.",
        "concepto": "ascii"
      },
      {
        "codigo": "return (res * signo);",
        "porque": "Aplica el signo al resultado.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué res * 10 + dígito?",
        "respuesta": "Cada dígito nuevo vale 10 veces más: \"12\" = 1*10 + 2."
      },
      {
        "pregunta": "¿Por qué str[i] - '0'?",
        "respuesta": "Convierte el carácter '7' en el número 7 restando el ASCII de '0'."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Acumulación de dígitos en base 10',
    formula: 'result = result * 10 + (str[i] - "0");',
    ejemplo: {
      entrada: '"  -42hello"',
      calculo: 'salta 2 spaces → sign=-1 → 4: result=4, 2: result=42 → para en h → return -42',
      resultado: '-42',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_atoi.c
file2=../../../../rendu/ft_atoi/ft_atoi.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

    ./out1 "Ceci permet de decouvrir le fonctionnement de ton ft_atoi." > out1.txt 2>/dev/null
    ./out2 "Ceci permet de decouvrir le fonctionnement de ton ft_atoi." > out2.txt 2>/dev/null

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

    ./out1 "OH ! 13268!" > out1.txt 2>/dev/null
    ./out2 "OH ! 13268!" > out2.txt 2>/dev/null

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

    ./out1 "13268!" > out1.txt 2>/dev/null
    ./out2 "13268!" > out2.txt 2>/dev/null

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

    ./out1 "-13268!" > out1.txt 2>/dev/null
    ./out2 "-13268!" > out2.txt 2>/dev/null

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

    ./out1 "+13268!" > out1.txt 2>/dev/null
    ./out2 "+13268!" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["Ceci permet de decouvrir le fonctionnement de ton ft_atoi."], salida: "ft_atoi(\"Ceci permet de decouvrir le fonctionnement de ton ft_atoi.\") = 0\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["OH ! 13268!"], salida: "ft_atoi(\"OH ! 13268!\") = 0\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["13268!"], salida: "ft_atoi(\"13268!\") = 13268\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["-13268!"], salida: "ft_atoi(\"-13268!\") = -13268\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["+13268!"], salida: "ft_atoi(\"+13268!\") = 13268\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica tres fases',
      descripcion: 'Tres bucles/condiciones explícitos: whitespace, signo, dígitos.',
      recomendada: true,
      codigo: `int\tft_atoi(const char *str)
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
\t{
\t\tresult = result * 10 + (*str - '0');
\t\tstr++;
\t}
\treturn (result * sign);
}`,
    },
    {
      id: 'indice',
      nombre: 'Con índice i',
      descripcion: 'Usa índice explícito en vez de mover el puntero. Igual de válida.',
      recomendada: false,
      codigo: `int\tft_atoi(const char *str)
{
\tint\ti;
\tint\tsign;
\tint\tresult;

\ti = 0;
\tsign = 1;
\tresult = 0;
\twhile (str[i] == ' ' || (str[i] >= '\\t' && str[i] <= '\\r'))
\t\ti++;
\tif (str[i] == '-' || str[i] == '+')
\t{
\t\tif (str[i] == '-')
\t\t\tsign = -1;
\t\ti++;
\t}
\twhile (str[i] >= '0' && str[i] <= '9')
\t{
\t\tresult = result * 10 + (str[i] - '0');
\t\ti++;
\t}
\treturn (result * sign);
}`,
    },
    {
      id: 'puntero_y_estado',
      nombre: 'Con puntero y función auxiliar para whitespace',
      descripcion: 'Separa el salto de espacios y el parseo numérico en pasos fáciles de seguir.',
      recomendada: false,
      codigo: `static int\tis_ws(char c)
{
\treturn (c == ' ' || (c >= '\\t' && c <= '\\r'));
}

int\tft_atoi(const char *str)
{
\tint\tresult;
\tint\tsign;

\tresult = 0;
\tsign = 1;
\twhile (is_ws(*str))
\t\tstr++;
\tif (*str == '+' || *str == '-')
\t{
\t\tif (*str == '-')
\t\t\tsign = -1;
\t\tstr++;
\t}
\twhile (*str >= '0' && *str <= '9')
\t{
\t\tresult = result * 10 + (*str - '0');
\t\tstr++;
\t}
\treturn (result * sign);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <stdio.h>

int     ft_atoi(const char *str)
{
	int	nbr;
	int sig;
	int	i;

	nbr = 0;
	sig = 1;
	i = 0;
	if (str[0] == '-' || str[0] == '+')
	{
		if (str[0] == '-')
			sig = -1;
		i += 1;
	}
	while (str[i] && str[i] >= '0' && str[i] <= '9')
		nbr = (nbr * 10) + (str[i++] - '0');
	return (nbr * sig);
}`,
    },
  ],

  tests: [
    { id: 'test_simple', descripcion: '"42" → 42', entrada: ['42'], salida: '42\n', tipo: 'normal' },
    { id: 'test_negativo', descripcion: '"-42" → -42', entrada: ['-42'], salida: '-42\n', tipo: 'normal' },
    { id: 'test_positivo', descripcion: '"+5" → 5 (signo positivo explícito)', entrada: ['+5'], salida: '5\n', tipo: 'normal' },
    { id: 'test_espacios', descripcion: '"  42" → 42 (salta espacios)', entrada: ['  42'], salida: '42\n', tipo: 'normal' },
    { id: 'test_letras', descripcion: '"abc" → 0 (sin dígitos)', entrada: ['abc'], salida: '0\n', tipo: 'edge' },
    { id: 'test_mixto', descripcion: '"-15hello" → -15 (para en h)', entrada: ['-15hello'], salida: '-15\n', tipo: 'normal' },
    { id: 'test_cero', descripcion: '"0" → 0', entrada: ['0'], salida: '0\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'FASE 1: saltar whitespace en "  -42"',
      codigo: `str = "  -42"
FASE 1: while(*str==' ') str++
str[0]=' ' → str++
str[1]=' ' → str++
str[2]='-' ≠ ' ' → sale
str ahora apunta a "-42"`,
      variables: [
        { nombre: 'str', valor: '"  -42" → "-42"', cambio: true, nota: '2 espacios saltados' },
        { nombre: 'result', valor: '0', cambio: false, nota: '' },
        { nombre: 'sign', valor: '1', cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'FASE 2: leer signo "-" → sign = -1',
      codigo: `if (*str == '-') → TRUE
sign = -1
str++  ← ahora apunta a "42"`,
      variables: [
        { nombre: 'sign', valor: '-1', cambio: true, nota: '← signo negativo' },
        { nombre: 'str', valor: '"42"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'FASE 3: leer "4" → result = 4',
      codigo: `while(*str >= '0' && *str <= '9')
*str = '4' (52) → 52>='0' y 52<='9' → TRUE
result = 0*10 + (52-48) = 4
str++`,
      variables: [
        { nombre: 'result', valor: '4', cambio: true, nota: '0*10 + (52-48)' },
      ],
    },
    {
      paso: 4,
      titulo: 'FASE 3: leer "2" → result = 42',
      codigo: `*str = '2' (50) → TRUE
result = 4*10 + (50-48) = 42
str++
*str = '\\0' → FALSE → sale del while`,
      variables: [
        { nombre: 'result', valor: '42', cambio: true, nota: '4*10+2=42' },
      ],
    },
    {
      paso: 5,
      titulo: 'return (result * sign) = 42 * (-1) = -42',
      codigo: `return (42 * -1) = -42`,
      variables: [
        { nombre: 'retorno', valor: '-42', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Olvidar los whitespace distintos del espacio (\t, \n, \r, \f, \v)',
      descripcion: 'atoi() salta TODOS los whitespace C: " ", \\t(9), \\n(10), \\r(13), \\f(12), \\v(11). Solo comprobar " " (espacio) hace fallar las pruebas con tabs.',
      codigoMal: `// ❌ Solo espacio
while (*str == ' ') str++;  // ¡falta \\t, \\n, \\r, \\f, \\v!`,
      codigoBien: `// ✅ Todos los whitespace
while (*str == ' ' || (*str >= '\\t' && *str <= '\\r'))
    str++;
// \\t=9, \\n=10, \\v=11, \\f=12, \\r=13 → rango 9..13`,
    },
    {
      severidad: 'mortal',
      titulo: 'Multiplicar result * 10 ANTES de sumar el nuevo dígito',
      descripcion: 'result = result + c - "0" acumula incorrectamente. Siempre: result = result * 10 + dígito.',
      codigoMal: `// ❌ Sin multiplicar por 10 — solo suma
result = result + (*str - '0');  // "42" → 4+2=6, no 42`,
      codigoBien: `// ✅
result = result * 10 + (*str - '0');  // "42" → 0*10+4=4, 4*10+2=42 ✓`,
    },
    {
      severidad: 'warning',
      titulo: 'Doble signo: "--5" o "+-5"',
      descripcion: 'El real atoi() solo lee UN signo. "--5" resultaría en 0 (el segundo "-" no es dígito). No intentes manejar múltiples signos.',
      codigoMal: `// ❌ Leer múltiples signos
while (*str == '-' || *str == '+') { ... }`,
      codigoBien: `// ✅ Solo un signo
if (*str == '-' || *str == '+') {
    if (*str == '-') sign = -1;
    str++;
}`,
    },
  ],

  bajoCelCapot: `El rango ASCII de whitespace: ' '(32), '\\t'(9), '\\n'(10), '\\v'(11), '\\f'(12), '\\r'(13).
El truco \\t..\\r (9..13) captura todos excepto el espacio.
result * 10 + dígito convierte "123" en 1*100+2*10+3=123.
La función no maneja overflow — comportamiento definido por implementación.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'ft_atoi es un building block de ft_atoi_base, do_op, y cualquier parser numérico. Las 3 fases son el patrón universal.',
  relacionados: ['do_op', 'ft_atoi_base'],
}
