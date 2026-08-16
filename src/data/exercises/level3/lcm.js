export default {
  id: 'lcm',
  nombre: 'lcm',
  nivel: 3,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['lcm.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : lcm
Expected files   : lcm.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that takes two unsigned int as parameters and returns the
smallest unsigned int divisible by both.

unsigned int\tlcm(unsigned int a, unsigned int b);

Example:
lcm(4, 6)   → 12
lcm(2, 3)   → 6
lcm(3, 3)   → 3
lcm(0, 5)   → 0`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : lcm
Expected files   : lcm.c
Allowed functions:
--------------------------------------------------------------------------------

Write a function who takes two unsigned int as parameters and returns the
computed LCM of those parameters.

LCM (Lowest Common Multiple) of two non-zero integers is the smallest postive
integer divisible by the both integers.

A LCM can be calculated in two ways:

- You can calculate every multiples of each integers until you have a common
multiple other than 0

- You can use the HCF (Highest Common Factor) of these two integers and
calculate as follows:

	LCM(x, y) = | x * y | / HCF(x, y)

  | x * y | means "Absolute value of the product of x by y"

If at least one integer is null, LCM is equal to 0.

Your function must be prototyped as follows:

  unsigned int    lcm(unsigned int a, unsigned int b);`,

  descripcion: 'Función que calcula el Mínimo Común Múltiplo (MCM). Usa la relación lcm(a,b) = a/gcd(a,b)*b para evitar overflow. Necesita implementar gcd (algoritmo de Euclides).',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'reloj',
    personaje: 'El Reloj de los Engranes',
    emoji: '⚙️',
    historia: `En el dormitorio hay un Reloj con dos engranes (a y b).
El Reloj busca el primer momento en que ambos engranes se sincronizan de nuevo.
Para calcular lcm, usa el truco matemático: lcm(a,b) = a/gcd(a,b) * b.
Primero calcula el GCD (Máximo Común Divisor) con el algoritmo de Euclides.
Luego divide a entre el GCD antes de multiplicar para evitar overflow.`,
    anclas: [
      "lcm(a,b) = a / gcd(a,b) * b  ← fórmula clave",
      "gcd usa el algoritmo de Euclides: while b: tmp=b; b=a%b; a=tmp",
      "if (a==0 || b==0) return 0  ← caso especial",
      "dividir ANTES de multiplicar: a/gcd * b (no a*b/gcd — overflow!)",
      "unsigned int → sin negativos",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `El programa recibe dos números y calcula su Mínimo Común Múltiplo.
El MCM es el número más pequeño que es múltiplo de ambos.
La fórmula es: MCM = (a × b) / MCD(a, b).
El MCD (Máximo Común Divisor) se calcula con el algoritmo de Euclides.
Algoritmo de Euclides: mientras b != 0, hacemos a = b, b = a % b. El MCD es el a final.`,
    datosPuros: [
      { elemento: 'lcm = (a / pgcd(a, b)) * b', nota: 'dividir primero para evitar overflow de a*b' },
      { elemento: 'pgcd: while (b) { tmp = b; b = a % b; a = tmp; }', nota: 'algoritmo de Euclides estándar' },
    ],
    asociaciones: [
      { dato: 'lcm = (a / gcd) * b (no a*b/gcd)', imagen: 'El truco del orden: si multiplicas a*b primero el número puede ser gigantesco y hacer overflow. Dividir primero (a/gcd) mantiene los números manejables. El resultado es el mismo pero sin accidente de desbordamiento.' },
    ],
  },

  animacion: {
    "tipo": "recursion",
    "config": {
      "fn": "lcm",
      "a": 4,
      "b": 6
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "if (a == 0 || b == 0) return (0);",
        "porque": "El mcm con 0 es 0.",
        "concepto": "condicionales"
      },
      {
        "codigo": "int g = pgcd(a, b);",
        "porque": "Calcula primero el máximo común divisor.",
        "concepto": "recursion"
      },
      {
        "codigo": "return (a / g * b);",
        "porque": "mcm = a·b/mcd, dividiendo antes para no desbordar.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué a / g * b y no a * b / g?",
        "respuesta": "Dividir primero evita que a*b se pase del rango de int."
      }
    ]
  },

  formulaClave: {
    descripcion: 'lcm(a,b) = a / gcd(a,b) * b — divide primero para evitar overflow',
    formula: 'gcd(x,y): while(y){tmp=y;y=x%y;x=tmp;} return x; lcm: return a/gcd(a,b)*b;',
    ejemplo: {
      entrada: 'a=4, b=6',
      calculo: 'gcd(4,6): gcd(6,4)→gcd(4,2)→gcd(2,0)=2; lcm=4/2*6=12',
      resultado: '12',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=lcm.c
file2=../../../../rendu/lcm/lcm.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    { id: 'tester_1', entrada: [], salida: "", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["2","8"], salida: "8", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["98"], salida: "", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["42","12"], salida: "84", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["42","10"], salida: "210", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con gcd auxiliar iterativo',
      descripcion: 'gcd con while loop (Euclides iterativo). La más eficiente.',
      recomendada: true,
      codigo: `static unsigned int\tgcd(unsigned int a, unsigned int b)
{
\tunsigned int\ttmp;

\twhile (b)
\t{
\t\ttmp = b;
\t\tb = a % b;
\t\ta = tmp;
\t}
\treturn (a);
}

unsigned int\tlcm(unsigned int a, unsigned int b)
{
\tif (a == 0 || b == 0)
\t\treturn (0);
\treturn (a / gcd(a, b) * b);
}`,
    },
    {
      id: 'recursivo',
      nombre: 'Con gcd recursivo',
      descripcion: 'gcd recursivo. Más compacto, misma complejidad.',
      recomendada: false,
      codigo: `static unsigned int\tgcd(unsigned int a, unsigned int b)
{
\tif (b == 0)
\t\treturn (a);
\treturn (gcd(b, a % b));
}

unsigned int\tlcm(unsigned int a, unsigned int b)
{
\tif (a == 0 || b == 0)
\t\treturn (0);
\treturn (a / gcd(a, b) * b);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `unsigned int lcm(unsigned int a, unsigned int b)
{
	unsigned int n;	

	if (a == 0 || b == 0)
		return (0);
	if (a > b)
		n = a;
	else
		n = b;
	while (1)
	{
		if (n % a == 0 && n % b == 0)
			return (n);
		++n;
	}
}`,
    },
  ],

  tests: [
    { id: 'test_4_6', descripcion: 'lcm(4,6) → 12', entrada: ['4', '6'], salida: '12\n', tipo: 'normal' },
    { id: 'test_2_3', descripcion: 'lcm(2,3) → 6', entrada: ['2', '3'], salida: '6\n', tipo: 'normal' },
    { id: 'test_3_3', descripcion: 'lcm(3,3) → 3 (mismos)', entrada: ['3', '3'], salida: '3\n', tipo: 'normal' },
    { id: 'test_0_5', descripcion: 'lcm(0,5) → 0 (caso especial)', entrada: ['0', '5'], salida: '0\n', tipo: 'edge' },
    { id: 'test_12_8', descripcion: 'lcm(12,8) → 24', entrada: ['12', '8'], salida: '24\n', tipo: 'normal' },
    { id: 'test_1_n', descripcion: 'lcm(1,7) → 7', entrada: ['1', '7'], salida: '7\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'lcm(4,6): calcular gcd(4,6)',
      codigo: `gcd(4, 6):
  iter 1: b=6 → tmp=6, b=4%6=4, a=6 → gcd(6,4)
  iter 2: b=4 → tmp=4, b=6%4=2, a=4 → gcd(4,2)
  iter 3: b=2 → tmp=2, b=4%2=0, a=2 → gcd(2,0)
  iter 4: b=0 → while FALSE → return a=2
gcd(4,6) = 2`,
      variables: [
        { nombre: 'gcd(4,6)', valor: '2', cambio: true, nota: '← Máximo Común Divisor' },
      ],
    },
    {
      paso: 2,
      titulo: 'lcm = a/gcd * b = 4/2 * 6',
      codigo: `a=4, b=6, gcd=2
lcm = 4 / 2 * 6
    = 2 * 6
    = 12
return 12`,
      variables: [
        { nombre: 'lcm(4,6)', valor: '12', cambio: true, nota: '✓ mínimo múltiplo común' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Calcular a*b/gcd en vez de a/gcd*b → overflow',
      descripcion: 'a*b puede desbordar unsigned int antes de dividir por gcd. Dividir primero: a/gcd*b es seguro porque a/gcd es siempre entero (gcd divide a a).',
      codigoMal: `// ❌ Posible overflow con a*b
return (a * b / gcd(a, b));  // si a=65536, b=65536 → overflow`,
      codigoBien: `// ✅ Dividir primero — sin overflow
return (a / gcd(a, b) * b);  // a/gcd es exacto (gcd|a)`,
    },
    {
      severidad: 'mortal',
      titulo: 'No manejar el caso a=0 o b=0',
      descripcion: 'lcm(0, n) = 0 matemáticamente. Sin esta verificación, gcd(0, n) podría causar división por cero o comportamiento indefinido.',
      codigoMal: `// ❌ Sin caso especial para 0
return (a / gcd(a, b) * b);  // si gcd(0, b) = b, a/b puede ser 0 o error`,
      codigoBien: `// ✅
if (a == 0 || b == 0) return (0);
return (a / gcd(a, b) * b);`,
    },
  ],

  bajoCelCapot: `lcm (Least Common Multiple) = mínimo múltiplo común.
lcm(4,6)=12 porque 12 = 4*3 = 6*2 → divisible por ambos.
La relación lcm(a,b) * gcd(a,b) = a * b es el fundamento matemático.
El algoritmo de Euclides: gcd(a,b) = gcd(b, a%b). Se detiene cuando b=0.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La fórmula lcm=a/gcd*b y el algoritmo de Euclides son dos conceptos que hay que memorizar juntos. Son la base de pgcd, lcm y muchos algoritmos matemáticos.',
  relacionados: ['pgcd', 'add_prime_sum', 'fprime'],
}
