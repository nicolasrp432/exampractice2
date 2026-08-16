export default {
  id: 'pgcd',
  nombre: 'pgcd',
  nivel: 3,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['pgcd.c'],
  // El subject real (programa con argv) permite printf, atoi, malloc, free.
  // La plataforma redibuja el ejercicio como función pura (sin I/O ni alloc),
  // pero declaramos las permitidas reales para coherencia con el examen.
  funcionesPermitidas: ['printf', 'atoi', 'malloc', 'free'],

  subject: `Assignment name  : pgcd
Expected files   : pgcd.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that takes two unsigned int as parameters and returns their
greatest common divisor (GCD), using the Euclidean algorithm.

unsigned int\tpgcd(unsigned int a, unsigned int b);

Example:
pgcd(3, 6)   → 3
pgcd(4, 6)   → 2
pgcd(17, 13) → 1  (coprimes)
pgcd(0, 5)   → 5`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : pgcd
Expected files   : pgcd.c
Allowed functions: printf, atoi, malloc, free
--------------------------------------------------------------------------------

Write a program that takes two strings representing two strictly positive
integers that fit in an int.

Display their highest common denominator followed by a newline (It's always a
strictly positive integer).

If the number of parameters is not 2, display a newline.

Examples:

$> ./pgcd 42 10 | cat -e
2$
$> ./pgcd 42 12 | cat -e
6$
$> ./pgcd 14 77 | cat -e
7$
$> ./pgcd 17 3 | cat -e 
1$
$> ./pgcd | cat -e
$`,

  descripcion: 'Función que calcula el Máximo Común Divisor (MCD/GCD). PGCD = "Plus Grand Commun Diviseur" en francés. Usa el algoritmo de Euclides: pgcd(a,b) = pgcd(b, a%b) hasta b=0.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'tijeras',
    personaje: 'Las Tijeras de Euclides',
    emoji: '✂️',
    historia: `En el dormitorio hay unas Tijeras que cortan hasta encontrar la medida común.
El algoritmo de Euclides: ¿cuánto queda de a cuando lo divides por b?
Si el resto es 0: b es el GCD. Si no: repite con (b, a%b).
pgcd(3,6): ¿cuánto queda 3/6? → resto=3. Ahora pgcd(6,3): resto=0 → GCD=3.
Es el fundamento de lcm y muchos algoritmos de criptografía.`,
    anclas: [
      "while (b): tmp=b; b=a%b; a=tmp  ← Euclides iterativo",
      "cuando b=0: return a  ← a ES el GCD",
      "pgcd(a,0) = a  ← caso base",
      "pgcd(0,b) = b  ← caso especial (el while se ejecuta una vez)",
      "el orden no importa: pgcd(a,b) = pgcd(b,a)",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `El programa recibe dos números y calcula su Máximo Común Divisor.
Usa el algoritmo de Euclides: mientras el segundo número no sea cero, reemplaza el primero por el segundo y el segundo por el resto de la división del primero entre el segundo.
Cuando el segundo número llega a cero, el primero es el MCD.
Imprime el resultado.`,
    datosPuros: [
      { elemento: 'while (b) { tmp = b; b = a % b; a = tmp; }', nota: 'algoritmo de Euclides — el orden importa: guardar b antes de pisarlo' },
      { elemento: 'return (a)', nota: 'al salir del while, a contiene el MCD' },
    ],
    asociaciones: [
      { dato: 'a = b; b = a % b (con tmp)', imagen: 'Euclides es como el juego de las sillas musicales: b se sienta en la silla de a, y el resto (a % b) pasa a ser el nuevo b. Sin la silla temporal (tmp), b sobrescribiría a antes de que pudieras calcular a % b.' },
    ],
  },

  animacion: {
    "tipo": "recursion",
    "config": {
      "fn": "pgcd",
      "a": 48,
      "b": 18
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (b != 0)",
        "porque": "Algoritmo de Euclides: repite hasta resto 0.",
        "concepto": "bucles"
      },
      {
        "codigo": "  int r = a % b;",
        "porque": "Resto de dividir a entre b.",
        "concepto": "variables"
      },
      {
        "codigo": "  a = b; b = r;",
        "porque": "a pasa a ser b, y b el resto.",
        "concepto": "recursion"
      },
      {
        "codigo": "return (a);",
        "porque": "Cuando b llega a 0, a es el mcd.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué el mcd queda en a cuando b es 0?",
        "respuesta": "Es la base de Euclides: mcd(a,0) = a."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Algoritmo de Euclides: reemplazar (a,b) por (b, a%b) hasta b=0',
    formula: 'while(b){ tmp=b; b=a%b; a=tmp; } return a;',
    ejemplo: {
      entrada: 'pgcd(4,6)',
      calculo: '(4,6)→(6,4)→(4,2)→(2,0) → return 2',
      resultado: '2',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=pgcd.c
file2=../../../../rendu/pgcd/pgcd.c


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

    ./out1 "2" "8" > out1.txt 2>/dev/null
    ./out2 "2" "8" > out2.txt 2>/dev/null

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

    ./out1 "98" > out1.txt 2>/dev/null
    ./out2 "98" > out2.txt 2>/dev/null

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

    ./out1 "42" "12" > out1.txt 2>/dev/null
    ./out2 "42" "12" > out2.txt 2>/dev/null

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

    ./out1 "42" "10" > out1.txt 2>/dev/null
    ./out2 "42" "10" > out2.txt 2>/dev/null

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
    { id: 'tester_2', entrada: ["2","8"], salida: "2\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["98"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["42","12"], salida: "6\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["42","10"], salida: "2\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'iterativo',
      nombre: 'Iterativo con while (Euclides)',
      descripcion: 'La versión clásica. Más eficiente en memoria que la recursiva.',
      recomendada: true,
      codigo: `unsigned int\tpgcd(unsigned int a, unsigned int b)
{
\tunsigned int\ttmp;

\twhile (b)
\t{
\t\ttmp = b;
\t\tb = a % b;
\t\ta = tmp;
\t}
\treturn (a);
}`,
    },
    {
      id: 'recursivo',
      nombre: 'Recursivo',
      descripcion: 'pgcd(b, a%b) si b!=0, sino a. Elegante y corto.',
      recomendada: false,
      codigo: `unsigned int\tpgcd(unsigned int a, unsigned int b)
{
\tif (b == 0)
\t\treturn (a);
\treturn (pgcd(b, a % b));
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
#include <stdlib.h>

void	pgcd(int a, int b)
{
	int n = a;

	while (n > 0)
	{
		if (a % n == 0 && b % n == 0)
		{
			printf("%d", n);
			return;
		}
		--n;
	}
}

int		main(int argc, char **argv)
{
	if (argc == 3)
		pgcd(atoi(argv[1]), atoi(argv[2]));

	printf("\\n");
	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_3_6', descripcion: 'pgcd(3,6) → 3', entrada: ['3', '6'], salida: '3\n', tipo: 'normal' },
    { id: 'test_4_6', descripcion: 'pgcd(4,6) → 2', entrada: ['4', '6'], salida: '2\n', tipo: 'normal' },
    { id: 'test_coprimos', descripcion: 'pgcd(17,13) → 1 (coprimos)', entrada: ['17', '13'], salida: '1\n', tipo: 'normal' },
    { id: 'test_0_5', descripcion: 'pgcd(0,5) → 5 (caso especial)', entrada: ['0', '5'], salida: '5\n', tipo: 'edge' },
    { id: 'test_12_8', descripcion: 'pgcd(12,8) → 4', entrada: ['12', '8'], salida: '4\n', tipo: 'normal' },
    { id: 'test_iguales', descripcion: 'pgcd(6,6) → 6 (mismos)', entrada: ['6', '6'], salida: '6\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'pgcd(4,6): iteraciones',
      codigo: `a=4, b=6
Iter 1: b=6≠0 → tmp=6, b=4%6=4, a=6  → (6,4)
Iter 2: b=4≠0 → tmp=4, b=6%4=2, a=4  → (4,2)
Iter 3: b=2≠0 → tmp=2, b=4%2=0, a=2  → (2,0)
Iter 4: b=0 → while FALSE → return a=2`,
      variables: [
        { nombre: 'iteraciones', valor: '3', cambio: false, nota: '' },
        { nombre: 'retorno', valor: '2', cambio: true, nota: '✓ GCD(4,6)=2' },
      ],
    },
    {
      paso: 2,
      titulo: 'pgcd(0,5): caso especial',
      codigo: `a=0, b=5
Iter 1: b=5≠0 → tmp=5, b=0%5=0, a=5
Iter 2: b=0 → while FALSE → return a=5
pgcd(0,5) = 5`,
      variables: [
        { nombre: 'retorno', valor: '5', cambio: true, nota: '← pgcd(0,n)=n' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'info',
      titulo: 'Diferencia plataforma vs examen real',
      descripcion: 'El subject real (rank02) plantea pgcd como un PROGRAMA: `./pgcd 42 10` lee dos enteros de argv, calcula su MCD y lo imprime con printf. Permite `printf, atoi, malloc, free`. La plataforma lo modela como una FUNCIÓN pura `pgcd(int a, int b)` para enfocarse en el algoritmo (Euclides). Ambos enfoques calculan lo mismo; el harness de la plataforma envuelve tu función con un main que hace atoi+printf por ti. Si quieres entregar la versión-programa al examen, mira `subjectReal` y la versión correspondiente que se añadirá en próximas fases.',
      codigoMal: `// El subject real espera un main que parsea argv:
// ./pgcd 42 10 → 2
// Si entregas solo una función pgcd(int,int), el examen no la enlazará.`,
      codigoBien: `// Para el examen real:
#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv) {
\tif (argc != 3) { write(1, "\\n", 1); return 0; }
\tint a = atoi(argv[1]), b = atoi(argv[2]);
\twhile (b) { int t = b; b = a % b; a = t; }
\tprintf("%d\\n", a);
\treturn 0;
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'Olvidar la variable tmp → perder el valor de b',
      descripcion: 'En el intercambio (a,b)→(b,a%b), hay que guardar b en tmp ANTES de modificarlo. Sin tmp: b = a%b, a = b (ya modificado) → incorrecto.',
      codigoMal: `// ❌ Sin tmp: b ya cambió cuando asignamos a
while (b) {
    b = a % b;  // b ya cambió
    a = b;      // a = nuevo b, no el viejo b
}`,
      codigoBien: `// ✅ Guardar b primero
while (b) {
    tmp = b;     // guardar b viejo
    b = a % b;   // calcular nuevo b
    a = tmp;     // a = b viejo
}`,
    },
    {
      severidad: 'warning',
      titulo: 'Confundir pgcd con lcm — son operaciones inversas',
      descripcion: 'pgcd = GCD (máximo COMÚN divisor). lcm = LCM (mínimo COMÚN múltiplo). pgcd(4,6)=2; lcm(4,6)=12. Relacionados: lcm(a,b) = a/pgcd(a,b)*b.',
      codigoMal: `// ❌ Confusión
// "el GCD de 4 y 6 es 12" → INCORRECTO, 12 es el lcm`,
      codigoBien: `// ✓ pgcd(4,6) = 2 (el divisor más grande que divide tanto 4 como 6)
// lcm(4,6) = 12 (el múltiplo más pequeño de 4 y 6)`,
    },
  ],

  bajoCelCapot: `PGCD = "Plus Grand Commun Diviseur" (en francés) = GCD (Greatest Common Divisor).
El algoritmo de Euclides se basa en: gcd(a,b) = gcd(b, a mod b).
Demostración: si d divide a y b, también divide a-b, y por extensión a mod b.
Se converge en O(log(min(a,b))) iteraciones — muy eficiente.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El algoritmo de Euclides con tmp es la pieza central. Memorizar: while(b){tmp=b;b=a%b;a=tmp;} return a. Se usa en lcm, criptografía RSA y muchos algoritmos.',
  relacionados: ['lcm', 'add_prime_sum', 'fprime'],
}
