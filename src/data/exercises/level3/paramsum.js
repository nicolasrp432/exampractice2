export default {
  id: 'paramsum',
  nombre: 'paramsum',
  nivel: 3,
  dificultad: 'fácil',
  tipoEntrega: 'programa',
  archivosEsperados: ['paramsum.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : paramsum
Expected files   : paramsum.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that displays the number of arguments passed to it, followed
by a newline.

With no argument, the program just displays 0.

Example:
$> ./paramsum | cat -e
0$
$> ./paramsum a b c | cat -e
3$
$> ./paramsum "hello world" foo bar | cat -e
3$`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : paramsum
Expected files   : paramsum.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that displays the number of arguments passed to it, followed by
a newline.

If there are no arguments, just display a 0 followed by a newline.

Example:

$>./paramsum 1 2 3 5 7 24
6
$>./paramsum 6 12 24 | cat -e
3$
$>./paramsum | cat -e
0$
$>`,

  descripcion: 'Programa que imprime el número de argumentos recibidos (sin contar el nombre del programa). Básicamente imprime argc-1.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'mesita',
    personaje: 'El Contador de Argumentos',
    emoji: '🔢',
    historia: `En la mesita del dormitorio hay un Contador digital que siempre sabe cuántas cosas le das.
Le pasas argumentos y él cuenta: ¿cuántos son? Pero OJO: argv[0] (el nombre del programa) NO cuenta.
argc cuenta el programa también, así que el resultado es argc-1.
Sin argumentos: argc=1, imprime 0.
Con tres argumentos: argc=4, imprime 3.`,
    anclas: [
      "argc incluye el nombre del programa (argv[0])",
      "imprimir argc - 1  ← el número de argumentos reales",
      "sin args: argc=1 → imprimir 0",
      "put_nbr para imprimir el número",
      "seguido de '\\n'",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `El programa recibe varios números como argumentos y muestra su suma.
Recorre todos los argumentos desde av[1] hasta av[argc-1].
Para cada uno, lo convierte a entero (con ft_atoi o similar).
Los suma todos.
Imprime el resultado seguido de newline.
Si no hay argumentos, imprime "0".`,
    datosPuros: [
      { elemento: 'i = 1; i < argc; i++', nota: 'empezar en av[1], no av[0] (av[0] es el nombre del programa)' },
      { elemento: 'si argc == 1 → imprimir "0\\n"', nota: 'sin argumentos = suma vacía = 0' },
    ],
    asociaciones: [
      { dato: 'av[1] no av[0]', imagen: 'La caja registradora de paramsum ignora el primer artículo (av[0] = el nombre del programa). Solo cuenta lo que el cliente pone en la cinta (av[1], av[2], ...). Si el cliente no trae nada, el total es 0.' },
    ],
  },

  animacion: {
    "tipo": "counter",
    "config": {
      "desde": 0,
      "hasta": 5,
      "condiciones": []
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int n = argc - 1;",
        "porque": "El número de argumentos, sin contar el nombre del programa.",
        "concepto": "variables"
      },
      {
        "codigo": "ft_putnbr(n);",
        "porque": "Imprime cuántos parámetros se pasaron.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué argc - 1?",
        "respuesta": "argc incluye el nombre del programa en argv[0]; los parámetros reales son uno menos."
      }
    ]
  },

  formulaClave: {
    descripcion: 'argc - 1 es el número de parámetros del programa',
    formula: 'put_nbr(argc - 1); write(1, "\\n", 1);',
    ejemplo: {
      entrada: './paramsum a b c',
      calculo: 'argc=4 → argc-1=3',
      resultado: '3',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=paramsum.c
file2=../../../../rendu/paramsum/paramsum.c


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

    ./out1 "fgex.;" > out1.txt 2>/dev/null
    ./out2 "fgex.;" > out2.txt 2>/dev/null

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

    ./out1 "abc" "2altrb53c.sse" > out1.txt 2>/dev/null
    ./out2 "abc" "2altrb53c.sse" > out2.txt 2>/dev/null

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

    ./out1 "abc" "btarc" > out1.txt 2>/dev/null
    ./out2 "abc" "btarc" > out2.txt 2>/dev/null

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

    ./out1 "fgex.;" "1" "2 " "3" "4" "5" "6" " 7" "8" "9" "10" > out1.txt 2>/dev/null
    ./out2 "fgex.;" "1" "2 " "3" "4" "5" "6" " 7" "8" "9" "10" > out2.txt 2>/dev/null

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

    ./out1 "mais non!" "mais non!" > out1.txt 2>/dev/null
    ./out2 "mais non!" "mais non!" > out2.txt 2>/dev/null

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
    { id: 'tester_2', entrada: ["fgex.;"], salida: "1\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["abc","2altrb53c.sse"], salida: "2\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["abc","btarc"], salida: "2\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["fgex.;","1","2 ","3","4","5","6"," 7","8","9","10"], salida: "11\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["mais non!","mais non!"], salida: "2\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con put_nbr recursivo',
      descripcion: 'Imprime argc-1 con una función auxiliar put_nbr. La más limpia.',
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
\t(void)argv;
\tput_nbr(argc - 1);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'inline',
      nombre: 'Inline con string temporal',
      descripcion: 'Construye el número como string en un buffer. Sin recursión.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tchar\tbuf[12];
\tint\tlen;
\tint\tn;

\t(void)argv;
\tn = argc - 1;
\tlen = 0;
\tif (n == 0)
\t\tbuf[len++] = '0';
\twhile (n > 0)
\t{
\t\tbuf[len++] = '0' + n % 10;
\t\tn /= 10;
\t}
\twhile (len > 0)
\t\twrite(1, &buf[--len], 1);
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

void	ft_putnbr(int n)
{
	char digit;

	if (n >= 10)
		ft_putnbr(n / 10);

	digit = (n % 10) + '0';
	write(1, &digit, 1);
}

int		main(int argc, char **argv)
{
	(void)argv;		// Silence 'unused parameter' error

	ft_putnbr(argc - 1);
	write(1, "\\n", 1);

	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_cero', descripcion: 'Sin argumentos → 0', entrada: [], salida: '0\n', tipo: 'edge' },
    { id: 'test_uno', descripcion: 'Un argumento → 1', entrada: ['a'], salida: '1\n', tipo: 'normal' },
    { id: 'test_tres', descripcion: 'Tres argumentos → 3', entrada: ['a', 'b', 'c'], salida: '3\n', tipo: 'normal' },
    { id: 'test_dos', descripcion: 'Dos argumentos → 2', entrada: ['hello', 'world'], salida: '2\n', tipo: 'normal' },
    { id: 'test_cinco', descripcion: 'Cinco argumentos → 5', entrada: ['1', '2', '3', '4', '5'], salida: '5\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: './paramsum a b c → argc=4',
      codigo: `argc = 4
argv[0] = "./paramsum"
argv[1] = "a"
argv[2] = "b"
argv[3] = "c"
argc - 1 = 3`,
      variables: [
        { nombre: 'argc', valor: '4', cambio: false, nota: '← incluye el nombre del programa' },
        { nombre: 'argc - 1', valor: '3', cambio: true, nota: '← lo que hay que imprimir' },
      ],
    },
    {
      paso: 2,
      titulo: 'put_nbr(3)',
      codigo: `put_nbr(3):
  3 < 10 → no recursión
  c = '0' + 3 = '3'
  write(1, "3", 1)
write(1, "\\n", 1)
// Salida: "3\\n"`,
      variables: [
        { nombre: 'salida', valor: '"3\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Imprimir argc en vez de argc-1',
      descripcion: 'argc incluye el nombre del programa (argv[0]). La pregunta pide el número de argumentos pasados, no el total de argc.',
      codigoMal: `// ❌ argc incluye ./paramsum
put_nbr(argc);  // "3 args" → imprime 4`,
      codigoBien: `// ✅
put_nbr(argc - 1);  // "3 args" → imprime 3`,
    },
    {
      severidad: 'warning',
      titulo: 'No manejar el caso n=0 en put_nbr',
      descripcion: 'Si argc-1=0, put_nbr(0) debe imprimir "0". Con un put_nbr que solo itera mientras n>0, no imprimiría nada para n=0.',
      codigoMal: `// ❌ No imprime nada para n=0
void put_nbr(int n) {
    while (n > 0) { write('0'+n%10); n/=10; }
}`,
      codigoBien: `// ✅ Manejar 0 explícitamente o con recursión
void put_nbr(int n) {
    if (n >= 10) put_nbr(n / 10);
    char c = '0' + n % 10; write(1, &c, 1);
}
// put_nbr(0): 0 < 10 → no recursión; c='0'+0='0' → write('0') ✓`,
    },
  ],

  bajoCelCapot: `argc (argument count) siempre incluye argv[0] (el nombre del programa).
argc=1 significa que no se pasaron argumentos: solo el nombre del programa.
"./paramsum a b c" → argc=4, argv={["./paramsum", "a", "b", "c"]}.
El cast (void)argv evita el warning del compilador "unused parameter".`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La confusión argc vs argc-1 es la única trampa. Una vez clara, el ejercicio es el más simple del nivel 3.',
  relacionados: ['tab_mult', 'add_prime_sum'],
}
