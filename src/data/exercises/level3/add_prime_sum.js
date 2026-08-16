export default {
  id: 'add_prime_sum',
  nombre: 'add_prime_sum',
  nivel: 3,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['add_prime_sum.c'],
  // El subject real permite además `exit`. La plataforma solo había
  // declarado `write` — ampliamos sin romper soluciones existentes.
  funcionesPermitidas: ['write', 'exit'],

  subject: `Assignment name  : add_prime_sum
Expected files   : add_prime_sum.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a positive integer as argument and displays the
sum of all prime numbers up to and including it, followed by a newline.

If the number of arguments is not 1, or if the argument is not a positive
integer, just display 0 followed by a newline.

Example:
$> ./add_prime_sum 5 | cat -e
10$
$> ./add_prime_sum 7 | cat -e
17$
$> ./add_prime_sum 1 | cat -e
0$`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : add_prime_sum
Expected files   : add_prime_sum.c
Allowed functions: write, exit
--------------------------------------------------------------------------------

Write a program that takes a positive integer as argument and displays the sum
of all prime numbers inferior or equal to it followed by a newline.

If the number of arguments is not 1, or the argument is not a positive number,
just display 0 followed by a newline.

Yes, the examples are right.

Examples:

$>./add_prime_sum 5
10
$>./add_prime_sum 7 | cat -e
17$
$>./add_prime_sum | cat -e
0$
$>`,

  descripcion: 'Programa que suma todos los números primos hasta N (inclusive). Requiere is_prime() con verificación hasta sqrt(n), y put_nbr para imprimir el resultado.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'microscopio',
    personaje: 'El Microscopio de Primos',
    emoji: '🔬',
    historia: `En el dormitorio hay un Microscopio que detecta números primos.
Le das un número N y el Microscopio examina cada número de 2 a N.
Para cada uno: ¿es primo? Si sí, lo añade a la suma.
La clave de is_prime: probar divisores solo hasta sqrt(n) — eficiencia crítica.
El 1 no es primo. El 2 sí es primo (el único par primo). Resultado: put_nbr(suma).`,
    anclas: [
      "is_prime(n): probar i de 2 hasta i*i<=n",
      "si n%i==0 → no es primo",
      "if (n < 2) return 0  ← 0 y 1 no son primos",
      "suma = 0; for i=2 to N: if is_prime(i) sum+=i",
      "put_nbr(suma); write('\\n')",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `El programa recibe un número n e imprime la suma de todos los números primos hasta n (incluyendo n si es primo).
Para cada número del 2 al n, comprueba si es primo.
Un número es primo si solo es divisible entre 1 y él mismo.
Para comprobarlo, intenta dividirlo entre todos los números del 2 hasta su raíz cuadrada.
Si ninguno lo divide exactamente, es primo y lo suma al total.`,
    datosPuros: [
      { elemento: 'i * i <= n (en vez de i <= sqrt(n))', nota: 'evitar usar sqrt() — comparar i*i es equivalente y más seguro' },
      { elemento: 'si argc != 2 o n <= 0 → solo \\n', nota: 'validación de argumentos' },
    ],
    asociaciones: [
      { dato: 'i * i <= n (no sqrt)', imagen: 'El detective de primos usa una regla: "Si no has encontrado divisor antes de que tu cuadrado supere al sospechoso, es primo." Es más rápido que sacar la raíz cuadrada y evita errores de coma flotante.' },
    ],
  },

  animacion: {
    "tipo": "counter",
    "config": {
      "desde": 1,
      "hasta": 12,
      "condiciones": []
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int i = 2, sum = 0;",
        "porque": "Empieza en 2 (primer primo) y acumula.",
        "concepto": "variables"
      },
      {
        "codigo": "while (i <= n)",
        "porque": "Revisa cada número hasta n.",
        "concepto": "bucles"
      },
      {
        "codigo": "  if (es_primo(i)) sum += i;",
        "porque": "Suma solo los que son primos.",
        "concepto": "condicionales"
      },
      {
        "codigo": "  i++;",
        "porque": "Siguiente número.",
        "concepto": "bucles"
      },
      {
        "codigo": "ft_putnbr(sum);",
        "porque": "Imprime la suma de todos los primos ≤ n.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Cómo se comprueba si i es primo?",
        "respuesta": "Dividiéndolo entre los números desde 2: si ninguno lo divide, es primo."
      }
    ]
  },

  formulaClave: {
    descripcion: 'is_prime hasta sqrt + suma acumulativa',
    formula: 'is_prime(x): i=2; while i*i<=x: if x%i==0 return 0; i++ return 1',
    ejemplo: {
      entrada: 'N=5',
      calculo: '2(primo)+3(primo)+4(no)+5(primo) = 10',
      resultado: '10',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=add_prime_sum.c
file2=../../../../rendu/add_prime_sum/add_prime_sum.c

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

    ./out1 "5" > out1.txt 2>/dev/null
    ./out2 "5" > out2.txt 2>/dev/null

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

    ./out1 "Too" "Many" "Arguments" > out1.txt 2>/dev/null
    ./out2 "Too" "Many" "Arguments" > out2.txt 2>/dev/null

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

    ./out1 "7" > out1.txt 2>/dev/null
    ./out2 "7" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: [], salida: "0\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["5"], salida: "10\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["Too","Many","Arguments"], salida: "0\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["7"], salida: "17\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con is_prime() auxiliar',
      descripcion: 'Separa la verificación de primalidad. La más legible.',
      recomendada: true,
      codigo: `#include <unistd.h>

static int\tis_prime(int n)
{
\tint\ti;

\tif (n < 2)
\t\treturn (0);
\ti = 2;
\twhile (i * i <= n)
\t{
\t\tif (n % i == 0)
\t\t\treturn (0);
\t\ti++;
\t}
\treturn (1);
}

static void\tput_nbr(unsigned long n)
{
\tchar\tc;

\tif (n >= 10)
\t\tput_nbr(n / 10);
\tc = '0' + n % 10;
\twrite(1, &c, 1);
}

int\tmain(int argc, char **argv)
{
\tunsigned long\tsum;
\tint\t\t\tn;
\tint\t\t\ti;

\tif (argc != 2)
\t{
\t\twrite(1, "0\\n", 2);
\t\treturn (0);
\t}
\tn = 0;
\ti = 0;
\twhile (argv[1][i] >= '0' && argv[1][i] <= '9')
\t\tn = n * 10 + (argv[1][i++] - '0');
\tif (argv[1][i] != '\\0' || n == 0)
\t{
\t\twrite(1, "0\\n", 2);
\t\treturn (0);
\t}
\tsum = 0;
\ti = 2;
\twhile (i <= n)
\t{
\t\tif (is_prime(i))
\t\t\tsum += i;
\t\ti++;
\t}
\tput_nbr(sum);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'impar_optimizado',
      nombre: 'Con salto de pares',
      descripcion: 'Comprueba el 2 aparte y luego prueba solo divisores impares. Más simple para ver el patrón.',
      recomendada: false,
      codigo: `#include <unistd.h>

static int\tis_prime(int n)
{
\tint\td;

\tif (n < 2)
\t\treturn (0);
\tif (n == 2)
\t\treturn (1);
\tif (n % 2 == 0)
\t\treturn (0);
\td = 3;
\twhile (d * d <= n)
\t{
\t\tif (n % d == 0)
\t\t\treturn (0);
\t\td += 2;
\t}
\treturn (1);
}

static void\tput_nbr(unsigned long n)
{
\tchar\tc;

\tif (n >= 10)
\t\tput_nbr(n / 10);
\tc = '0' + n % 10;
\twrite(1, &c, 1);
}

int\tmain(int argc, char **argv)
{
\tunsigned long\tsum;
\tint\t\t\tn;
\tint\t\t\ti;

\tif (argc != 2)
\t{
\t\twrite(1, "0\\n", 2);
\t\treturn (0);
\t}
\tn = 0;
\ti = 0;
\twhile (argv[1][i] >= '0' && argv[1][i] <= '9')
\t\tn = n * 10 + (argv[1][i++] - '0');
\tif (argv[1][i] != '\\0' || n == 0)
\t{
\t\twrite(1, "0\\n", 2);
\t\treturn (0);
\t}
\tsum = 0;
\ti = 2;
\twhile (i <= n)
\t{
\t\tif (is_prime(i))
\t\t\tsum += i;
\t\ti++;
\t}
\tput_nbr(sum);
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

int		ft_atoi(char *str)
{
	int n = 0;

	while (*str >= '0' && *str <= '9')
	{
		n *= 10;
		n += *str - '0';
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

int		is_prime(int n)
{
	int i = 2;

	while (i < n)
	{
		if (n % i == 0)
			return (0);
		++i;
	}
	return (1);
}

int		add_prime_sum(int n)
{
	int sum = 0;
	int i = 2;

	while (i <= n)
	{
		if (is_prime(i) == 1)
			sum += i;
		++i;
	}
	return (sum);
}

int		main(int argc, char **argv)
{
	int n;

	if (argc == 2 && (n = ft_atoi(argv[1])))
		ft_putnbr(add_prime_sum(n));
	else
		ft_putnbr(0);
	write(1, "\\n", 1);
	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_5', descripcion: 'N=5 → 10 (2+3+5)', entrada: ['5'], salida: '10\n', tipo: 'normal' },
    { id: 'test_7', descripcion: 'N=7 → 17 (2+3+5+7)', entrada: ['7'], salida: '17\n', tipo: 'normal' },
    { id: 'test_1', descripcion: 'N=1 → 0 (ningún primo ≤1)', entrada: ['1'], salida: '0\n', tipo: 'edge' },
    { id: 'test_2', descripcion: 'N=2 → 2 (solo el 2)', entrada: ['2'], salida: '2\n', tipo: 'edge' },
    { id: 'test_10', descripcion: 'N=10 → 17 (2+3+5+7)', entrada: ['10'], salida: '17\n', tipo: 'normal' },
    { id: 'test_20', descripcion: 'N=20 → 77 (2+3+5+7+11+13+17+19)', entrada: ['20'], salida: '77\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'N=5: is_prime para 2,3,4,5',
      codigo: `is_prime(2): i=2, i*i=4 > 2 → while FALSE → return 1 ✓ primo
is_prime(3): i=2, 4>3 → while FALSE → return 1 ✓ primo
is_prime(4): i=2, 4<=4 → 4%2=0 → return 0 ✗ no primo
is_prime(5): i=2, 4<=5 → 5%2=1; i=3, 9>5 → while FALSE → return 1 ✓ primo`,
      variables: [
        { nombre: 'primos ≤5', valor: '[2, 3, 5]', cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'Sumar: 2+3+5=10',
      codigo: `sum = 0
i=2: is_prime(2)=1 → sum=2
i=3: is_prime(3)=1 → sum=5
i=4: is_prime(4)=0 → sum sin cambio
i=5: is_prime(5)=1 → sum=10
i=6: 6>5 → while FALSE`,
      variables: [
        { nombre: 'sum', valor: '10', cambio: true, nota: '← 2+3+5' },
      ],
    },
    {
      paso: 3,
      titulo: 'put_nbr(10) → "10"',
      codigo: `put_nbr(10):
  10 >= 10 → put_nbr(1) → write('1')
  c = '0' + 10%10 = '0' → write('0')
write("\\n")
Salida: "10\\n"`,
      variables: [
        { nombre: 'salida', valor: '"10\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'info',
      titulo: 'Diferencia plataforma vs examen real',
      descripcion: 'El subject real permite también la función `exit` (útil para salir limpiamente si el argumento no es un entero positivo). Las soluciones write-only de la plataforma siguen siendo válidas.',
      codigoMal: `// La versión didáctica forzaba return 0 con guardas anidadas:
if (argc != 2) { write(1, "0\\n", 2); return 0; }
if (!is_positive_int(argv[1])) { write(1, "0\\n", 2); return 0; }`,
      codigoBien: `// Con exit puedes simplificar la salida temprana:
if (argc != 2 || !is_positive_int(argv[1])) {
\twrite(1, "0\\n", 2);
\texit(0);
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'is_prime: probar hasta n/2 en vez de sqrt(n)',
      descripcion: 'Probar hasta n/2 funciona pero es O(n) en vez de O(sqrt(n)). Para N grande, puede ser muy lento. El examen puede tener timeouts. Usar i*i<=n.',
      codigoMal: `// ❌ Hasta n/2 — correcto pero lento
while (i <= n / 2) { if (n % i == 0) return 0; i++; }`,
      codigoBien: `// ✅ Hasta sqrt(n) — eficiente
while (i * i <= n) { if (n % i == 0) return 0; i++; }`,
    },
    {
      severidad: 'mortal',
      titulo: 'Considerar el 1 como primo',
      descripcion: 'El 1 NO es primo por definición. is_prime(1) debe devolver 0. La condición if (n < 2) return 0 cubre este caso.',
      codigoMal: `// ❌ 1 considerado primo
int is_prime(int n) {
    int i = 2;
    while (i * i <= n)  // para n=1: i=2, 4>1 → FALSE → return 1!
        if (n % i++ == 0) return 0;
    return 1;  // is_prime(1) devuelve 1 — INCORRECTO
}`,
      codigoBien: `// ✅ Excluir 0 y 1 explícitamente
if (n < 2) return (0);  // 0 y 1 no son primos`,
    },
    {
      severidad: 'warning',
      titulo: 'sum puede desbordar int para N grande',
      descripcion: 'La suma de todos los primos hasta N crece rápidamente. Usar unsigned long para evitar overflow.',
      codigoMal: `// ⚠️ int puede desbordar para N grande
int sum = 0;`,
      codigoBien: `// ✅
unsigned long sum = 0;  // o long long`,
    },
  ],

  bajoCelCapot: `Un número n es primo si solo es divisible por 1 y por sí mismo.
Si n = a*b con a<=b, entonces a<=sqrt(n). Basta probar hasta sqrt(n).
Primos hasta 20: 2, 3, 5, 7, 11, 13, 17, 19 → suma=77.
El 2 es el único primo par. Todos los demás son impares.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La función is_prime con i*i<=n es el patrón que hay que memorizar. También se usa en pgcd, lcm y fprime.',
  relacionados: ['pgcd', 'lcm', 'fprime', 'tab_mult'],
}
