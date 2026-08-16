export default {
  id: 'ft_itoa',
  nombre: 'ft_itoa',
  nivel: 4,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_itoa.c'],
  funcionesPermitidas: ['malloc'],

  subject: `Assignment name  : ft_itoa
Expected files   : ft_itoa.c
Allowed functions: malloc
--------------------------------------------------------------------------------

Write a function that takes an int and converts it to a null-terminated string.
The function returns the result in a char array that you must allocate.

Your function must be declared as follows:

char\t*ft_itoa(int nbr);`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_itoa
Expected files   : ft_itoa.c
Allowed functions: malloc
--------------------------------------------------------------------------------

Write a function that takes an int and converts it to a null-terminated string.
The function returns the result in a char array that you must allocate.

Your function must be declared as follows:

char	*ft_itoa(int nbr);`,

  descripcion: 'Función que convierte un int en una cadena terminada en \\0, reservando memoria con malloc.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'caja fuerte',
    personaje: 'El Traductor Decimal',
    emoji: '🔢',
    historia: `El Traductor Decimal mete un número en una caja fuerte y lo saca como texto.
Primero cuenta cuántos dígitos hará falta reservar.
Luego rellena la cadena desde el final hacia el inicio.
Si el número es negativo, añade el signo menos.
Si vale 0, debe devolver "0".`,
    anclas: [
      'contar dígitos antes de malloc',
      'reservar espacio para el \\0',
      'llenar desde el final',
      '0 → "0"',
      'INT_MIN necesita cuidado especial',
    ],
  },

  herramientas: ['strings', 'malloc'],

  campayoMetodo: {
    feynman: `La función convierte un entero en un string.
Primero calcula cuántos dígitos tiene el número (y si es negativo, añade 1 para el '-').
Luego pide esa cantidad de memoria + 1 (para el \\0).
Rellena el string de derecha a izquierda con los dígitos (módulo 10 para el último dígito).
Si es negativo, añade el '-' al principio.
Devuelve el string resultante.`,
    datosPuros: [
      { elemento: 'manejar INT_MIN (-2147483648) por separado', nota: '-INT_MIN = overflow en int — caso especial obligatorio' },
      { elemento: 'str[len] = \'\\0\' antes de rellenar', nota: 'poner el terminador al final antes de rellenar hacia atrás' },
      { elemento: 'char *ft_itoa(int n)', nota: 'devuelve char* asignado con malloc — el caller debe hacer free' },
    ],
    asociaciones: [
      { dato: 'INT_MIN caso especial', imagen: 'INT_MIN es el pasajero problemático: si intentas hacerlo positivo con -n, el int se desborda (no cabe). Lo mejor es tratarlo aparte al principio: hardcodear "-2147483648" o usar long para la conversión.' },
      { dato: 'rellenar de derecha a izquierda', imagen: 'ft_itoa llena el string como un espejo de la calculadora: el último dígito se calcula primero (n%10) y va al final del array. Luego se divide por 10 y se va hacia la izquierda hasta terminar.' },
    ],
  },

  animacion: {
    "tipo": "base-convert",
    "config": {
      "valor": 42,
      "desdeBase": 10,
      "hastaBase": 10
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "cuenta los dígitos de n",
        "porque": "Para saber cuánta memoria reservar.",
        "concepto": "variables"
      },
      {
        "codigo": "char *s = malloc(len + 1);",
        "porque": "Reserva los dígitos + el \\0 (+ signo si negativo).",
        "concepto": "malloc"
      },
      {
        "codigo": "while (n) { s[--i] = n % 10 + '0'; n /= 10; }",
        "porque": "Extrae dígitos de derecha a izquierda.",
        "concepto": "ascii"
      },
      {
        "codigo": "return (s);",
        "porque": "Devuelve el número como cadena.",
        "concepto": "malloc"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué llenar de derecha a izquierda?",
        "respuesta": "n % 10 da el último dígito primero; se coloca al final y se sube."
      },
      {
        "pregunta": "¿Qué cuidado hay con INT_MIN?",
        "respuesta": "No se puede negar directamente; se trata el signo con cuidado para no desbordar."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Calcular longitud, reservar, y escribir desde el final',
    formula: 'len = digits(n) + sign; result = malloc(len + 1); result[len] = "\\0"; fill from back',
    ejemplo: {
      entrada: '-13268',
      calculo: 'len=6 ("-13268") → escribir 8,6,2,3,1,-',
      resultado: '"-13268"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_itoa.c
file2=../../../../rendu/ft_itoa/ft_itoa.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

    ./out1 "16" > out1.txt 2>/dev/null
    ./out2 "16" > out2.txt 2>/dev/null

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

    ./out1 "13268" > out1.txt 2>/dev/null
    ./out2 "13268" > out2.txt 2>/dev/null

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

    ./out1 "-13268" > out1.txt 2>/dev/null
    ./out2 "-13268" > out2.txt 2>/dev/null

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
    exit 1
`,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: ["16"], salida: "16\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["13268"], salida: "13268\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["-13268"], salida: "-13268\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["0"], salida: "0\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con longitud previa y relleno inverso',
      descripcion: 'La versión más estable: calcula el tamaño y rellena desde atrás.',
      recomendada: true,
      codigo: `#include <stdlib.h>

static int\tlen_nbr(long n)
{
\tint len;

\tlen = (n <= 0);
\twhile (n != 0)
\t{
\t\tlen++;
\t\tn /= 10;
\t}
\treturn (len);
}

char\t*ft_itoa(int nbr)
{
\tlong\tn;
\tchar\t*res;
\tint\t\tlen;

\tn = nbr;
\tlen = len_nbr(n);
\tres = malloc(len + 1);
\tif (!res)
\t\treturn (NULL);
\tres[len] = '\\0';
\tif (n == 0)
\t\tres[0] = '0';
\tif (n < 0)
\t\tn = -n;
\twhile (n != 0)
\t{
\t\tres[--len] = (n % 10) + '0';
\t\tn /= 10;
\t}
\tif (nbr < 0)
\t\tres[0] = '-';
\treturn (res);
}`,
    },
    {
      id: 'compacta',
      nombre: 'Con división sucesiva y signo aparte',
      descripcion: 'Más breve, pero con el mismo patrón de longitud + relleno posterior.',
      recomendada: false,
      codigo: `#include <stdlib.h>

char\t*ft_itoa(int nbr)
{
\tlong\tn;
\tint\t\tlen;
\tchar\t*res;

\tn = nbr;
\tlen = 1;
\tif (n <= 0)
\t\tlen++;
\twhile (n / 10 != 0)
\t{
\t\tlen++;
\t\tn /= 10;
\t}
\tres = malloc(len + 1);
\tif (!res)
\t\treturn (NULL);
\tres[len] = '\\0';
\tn = nbr;
\tif (n == 0)
\t\tres[0] = '0';
\tif (n < 0)
\t\tn = -n;
\twhile (n != 0)
\t{
\t\tres[--len] = (n % 10) + '0';
\t\tn /= 10;
\t}
\tif (nbr < 0)
\t\tres[0] = '-';
\treturn (res);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `
#include <stdlib.h>

int		absolute_value(int nbr)
{
	if (nbr < 0)
		return (-nbr);
	return (nbr);
}

int		get_len(int nbr)
{
	int len = 0;
	if (nbr <= 0)
		++len;
	while (nbr != 0)
	{
		++len;
		nbr = nbr / 10;
	}
	return (len);
}

char	*ft_itoa(int nbr)
{
	char *result;
	int len;

	len = get_len(nbr);
	result = malloc(sizeof(char) * (len + 1));
	result[len] = '\\0';

	if (nbr < 0)
		result[0] = '-';
	else if (nbr == 0)
		result[0] = '0';

	while (nbr != 0)
	{
		--len;
		result[len] = absolute_value(nbr % 10) + '0';
		nbr = nbr / 10;
	}
	return (result);
}`,
    },
  ],

  tests: [
    { id: 'test_zero', descripcion: '0 → "0"', entrada: ['0'], salida: '0\n', tipo: 'edge' },
    { id: 'test_pos', descripcion: '13268 → "13268"', entrada: ['13268'], salida: '13268\n', tipo: 'normal' },
    { id: 'test_neg', descripcion: '-13268 → "-13268"', entrada: ['-13268'], salida: '-13268\n', tipo: 'normal' },
    { id: 'test_small', descripcion: '16 → "16"', entrada: ['16'], salida: '16\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'nbr = -13268',
      codigo: `n = -13268
len = 6
malloc(7 bytes)
res[6] = '\\0'`,
      variables: [
        { nombre: 'len', valor: '6', cambio: true, nota: '5 dígitos + signo' },
        { nombre: 'res', valor: 'buffer[7]', cambio: true, nota: 'heap' },
      ],
    },
    {
      paso: 2,
      titulo: 'Relleno desde el final',
      codigo: `n = 13268
res[5] = '8'
res[4] = '6'
res[3] = '2'`,
      variables: [
        { nombre: 'res', valor: '"-13268"', cambio: true, nota: 'cadena final' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Olvidar INT_MIN',
      descripcion: 'Si se hace nbr = -nbr con INT_MIN hay overflow. Hay que trabajar con long o tratar ese caso.',
      codigoMal: `// ❌ overflow con INT_MIN
if (nbr < 0)
\tnbr = -nbr;`,
      codigoBien: `// ✅ usar long
long n = nbr;
if (n < 0)
\tn = -n;`,
    },
    {
      severidad: 'warning',
      titulo: 'No reservar espacio para "\\0"',
      descripcion: 'La cadena devuelta debe terminar en null byte.',
      codigoMal: `res = malloc(len);`,
      codigoBien: `res = malloc(len + 1);`,
    },
  ],

  bajoCelCapot: `ft_itoa convierte un entero en texto decimal.
La estrategia robusta es contar dígitos primero y escribir de derecha a izquierda.
El caso INT_MIN merece atención porque el opuesto no cabe en int.`,

  estrategia: 'ENTENDER',
  razonEstrategia: 'Es un clásico de manipulación de números y memoria dinámica. Conviene entender la longitud y el signo antes de escribir.',
  relacionados: ['ft_atoi', 'max', 'print_hex'],
}
