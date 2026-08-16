export default {
  id: 'rev_print',
  nombre: 'rev_print',
  nivel: 1,
  dificultad: 'fácil',
  tipoEntrega: 'programa',
  archivosEsperados: ['rev_print.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : rev_print
Expected files   : rev_print.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string, and displays the string in reverse,
followed by a newline.

If the number of arguments is not 1, display only a newline.

Examples:
$> ./rev_print "Hello World"
dlroW olleH
$> ./rev_print ""

$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : rev_print
Expected files   : rev_print.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string, and displays the string in reverse
followed by a newline.

If the number of parameters is not 1, the program displays a newline.

Examples:

$> ./rev_print "zaz" | cat -e
zaz$
$> ./rev_print "dub0 a POIL" | cat -e
LIOP a 0bud$
$> ./rev_print | cat -e
$`,

  descripcion: 'Programa que imprime el string al revés (desde el último carácter hasta el primero) seguido de \\n. Con argc != 2, solo \\n.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'espejo',
    personaje: 'El Reverendo Moonwalk',
    emoji: '🕺',
    historia: `En el espejo de la cocina vive el Reverendo Moonwalk.
Cuando le das un string, él camina HACIA ATRÁS imprimiendo cada letra.
Primero busca el FINAL del string con ft_strlen (o un while).
Luego retrocede desde i = len-1 hasta i = 0.
¡El espejo NO miente: invierte hasta el último char, incluidos espacios!`,
    anclas: [
      "i = ft_strlen(str) - 1  ← empieza al final",
      "while (i >= 0) write & i--",
      "string vacío → escribe solo \\n",
      "argc != 2 → solo \\n",
      "¡incluye espacios en el reverso!",
    ],
  },

  herramientas: ['strings', 'argc'],

  campayoMetodo: {
    feynman: `El programa recibe un string como argumento.
Primero busca el final del string contando sus letras (o usando ft_strlen).
Luego empieza desde la ÚLTIMA letra y va hacia atrás, escribiéndola en pantalla.
Hace esto hasta que llega a la primera letra (posición 0).
Al terminar escribe un salto de línea.`,
    datosPuros: [
      { elemento: 'i = len - 1', nota: 'el último carácter está en posición len-1, no len' },
      { elemento: 'while (i >= 0)', nota: 'i >= 0 (no i > 0) para incluir el primer carácter' },
      { elemento: 'i--', nota: 'decrementa i en lugar de incrementar' },
    ],
    asociaciones: [
      { dato: 'i = len - 1 (no len)', imagen: 'El Reverendo Moonwalk del espejo empieza su moonwalk UNA casilla antes del final. Si empieza en len, pisa el Fantasma Cero y resbala — off-by-one.' },
      { dato: 'while (i >= 0)', imagen: 'El reverendo baila hasta la casilla CERO inclusive. Si dijera i > 0 se quedaría sin bailar la primera letra — dejaría la "h" de "hello" sin imprimir.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "hola",
      "modo": "revertir"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int i = ft_strlen(argv[1]) - 1;",
        "porque": "Empezamos por el ÚLTIMO carácter (longitud - 1).",
        "concepto": "strings"
      },
      {
        "codigo": "while (i >= 0)",
        "porque": "Recorremos hacia atrás hasta el índice 0.",
        "concepto": "bucles"
      },
      {
        "codigo": "  write(1, &argv[1][i], 1);",
        "porque": "Imprime el carácter actual.",
        "concepto": "strings"
      },
      {
        "codigo": "  i--;",
        "porque": "Retrocede una posición.",
        "concepto": "bucles"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué empezar en longitud - 1?",
        "respuesta": "El último carácter válido está en esa posición; longitud apuntaría al \\0."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Busca el final, itera hacia atrás',
    formula: 'i = len - 1; while (i >= 0) { write(str[i]); i--; }',
    ejemplo: {
      entrada: '"abc"',
      calculo: 'len=3, i=2→c, i=1→b, i=0→a → "cba"',
      resultado: 'cba',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=rev_print.c
file2=../../../../rendu/rev_print/rev_print.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 "zaz" > out1.txt 2>/dev/null
    ./out2 "zaz" > out2.txt 2>/dev/null

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

    ./out1 "dub0 a POIL" > out1.txt 2>/dev/null
    ./out2 "dub0 a POIL" > out2.txt 2>/dev/null

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

    ./out1 "3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot" > out1.txt 2>/dev/null
    ./out2 "3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot" > out2.txt 2>/dev/null

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

    ./out1 "Papache est un sabre" "a" "o" > out1.txt 2>/dev/null
    ./out2 "Papache est un sabre" "a" "o" > out2.txt 2>/dev/null

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

    ./out1 "zaz" "art" "zul" > out1.txt 2>/dev/null
    ./out2 "zaz" "art" "zul" > out2.txt 2>/dev/null

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

    ./out1 "zaz" "r" "u" > out1.txt 2>/dev/null
    ./out2 "zaz" "r" "u" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 7. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "jacob" "a" "b" "c" "e" > out1.txt 2>/dev/null
    ./out2 "jacob" "a" "b" "c" "e" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 8. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "ZoZ eT Dovid oiME le METol." "o" "a" > out1.txt 2>/dev/null
    ./out2 "ZoZ eT Dovid oiME le METol." "o" "a" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 9. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "wNcOre Un ExEmPle Pas Facilw a Ecrirw " "w" "e" > out1.txt 2>/dev/null
    ./out2 "wNcOre Un ExEmPle Pas Facilw a Ecrirw " "w" "e" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 10. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "AkjhZ zLKIJz , 23y " > out1.txt 2>/dev/null
    ./out2 "AkjhZ zLKIJz , 23y " > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 11. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "FOR PONY" > out1.txt 2>/dev/null
    ./out2 "FOR PONY" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 12. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "this        ...       is sparta, then again, maybe    not" > out1.txt 2>/dev/null
    ./out2 "this        ...       is sparta, then again, maybe    not" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 13. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "   " > out1.txt 2>/dev/null
    ./out2 "   " > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 14. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "a" "b" > out1.txt 2>/dev/null
    ./out2 "a" "b" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 15. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "  lorem,ipsum  " > out1.txt 2>/dev/null
    ./out2 "  lorem,ipsum  " > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 16. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "" > out1.txt 2>/dev/null
    ./out2 "" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    
     # 17. test
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
    { id: 'tester_1', entrada: ["zaz"], salida: "zaz\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["dub0 a POIL"], salida: "LIOP a 0bud\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "tof ef aK ne'm EK id aK ik nUom  tuOt  aB 12:3\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: " y32 , zJIKLz ZhjkA\n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "YNOP ROF\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "ton    ebyam ,niaga neht ,atraps si       ...        siht\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "   \n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "  muspi,merol  \n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con longitud precalculada',
      descripcion: 'Calcula la longitud primero con un while, luego recorre hacia atrás.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;

\tif (argc != 2)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\ti = 0;
\twhile (argv[1][i])
\t\ti++;
\ti--;
\twhile (i >= 0)
\t{
\t\twrite(1, &argv[1][i], 1);
\t\ti--;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'puntero_final',
      nombre: 'Con puntero al final',
      descripcion: 'Encuentra el final del string y retrocede un carácter a la vez.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tchar\t*end;

\tif (argc != 2)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\tend = argv[1];
\twhile (*end)
\t\tend++;
\twhile (end != argv[1])
\t\twrite(1, --end, 1);
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
      codigo: `#include <unistd.h>

int	main(int argc, char *argv[])
{
	int	i = 0;

	if (argc == 2)
	{
		while (argv[1][i])
			i += 1;
		while (i)
			write(1, &argv[1][--i], 1);
	}
	write(1, "\\n", 1);
	return (0);
}`,
    },
  ],

  tests: [
    {
      id: 'test_hello',
      descripcion: '"hello" → "olleh"',
      entrada: ['hello'],
      salida: 'olleh\n',
      tipo: 'normal',
    },
    {
      id: 'test_con_espacio',
      descripcion: '"Hello World" → "dlroW olleH"',
      entrada: ['Hello World'],
      salida: 'dlroW olleH\n',
      tipo: 'normal',
    },
    {
      id: 'test_1char',
      descripcion: '"a" → "a"',
      entrada: ['a'],
      salida: 'a\n',
      tipo: 'normal',
    },
    {
      id: 'test_vacio',
      descripcion: 'String vacío → solo \\n',
      entrada: [''],
      salida: '\n',
      tipo: 'edge',
    },
    {
      id: 'test_sin_args',
      descripcion: 'Sin argumentos → solo \\n',
      entrada: [],
      salida: '\n',
      tipo: 'edge',
    },
    {
      id: 'test_abc',
      descripcion: '"abc" → "cba"',
      entrada: ['abc'],
      salida: 'cba\n',
      tipo: 'normal',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Entrada: "abc", calcula longitud',
      codigo: `argc=2, argv[1]="abc"
i = 0
while (argv[1][0]) → 'a' → i=1
while (argv[1][1]) → 'b' → i=2
while (argv[1][2]) → 'c' → i=3
while (argv[1][3]) → '\\0' → SALE
i-- → i=2  ← índice del último char`,
      variables: [
        { nombre: 'i', valor: '2', cambio: true, nota: '← índice de "c" (último char)' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=2 → write "c"',
      codigo: `while (2 >= 0) → TRUE
write(1, &argv[1][2], 1);  → stdout: "c"
i--  → i=1`,
      variables: [
        { nombre: 'i', valor: '1', cambio: true, nota: '' },
        { nombre: 'stdout', valor: '"c"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'i=1 → write "b", i=0 → write "a"',
      codigo: `[i=1] write 'b' → stdout: "cb", i=0
[i=0] write 'a' → stdout: "cba", i=-1`,
      variables: [
        { nombre: 'i', valor: '-1', cambio: true, nota: '' },
        { nombre: 'stdout', valor: '"cba"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 4,
      titulo: 'i=-1 → sale del while, write \\n',
      codigo: `while (-1 >= 0) → FALSE → sale
write(1, "\\n", 1)
stdout: "cba\\n"`,
      variables: [
        { nombre: 'i', valor: '-1', cambio: false, nota: '← condición false' },
        { nombre: 'stdout', valor: '"cba\\n"', cambio: true, nota: '✓ String invertido' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'i = len sin el -1 → lee fuera del string',
      descripcion: 'Si len=3 (para "abc"), el último índice válido es 2, no 3. argv[1][3] es el \\0. Si empiezas en i=len sin restar 1, escribes el \\0 (invisible) y los chars quedan desplazados.',
      codigoMal: `// ❌ Empieza en i=len, escribe '\\0' primero
i = 0; while (argv[1][i]) i++;  // i=3
while (i >= 0) {
    write(1, &argv[1][i], 1);  // i=3: escribe '\\0' ← basura
    i--;
}`,
      codigoBien: `// ✅ i = len - 1 → último char válido
i = 0; while (argv[1][i]) i++;  // i=3
i--;                             // i=2 ← 'c'
while (i >= 0) {
    write(1, &argv[1][i], 1);
    i--;
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'Condición i > 0 en vez de i >= 0 → pierde el primer char',
      descripcion: 'El índice 0 es el primer carácter. Con i > 0, nunca se escribe argv[1][0].',
      codigoMal: `// ❌ i>0 → no imprime argv[1][0]
while (i > 0) {  // para cuando i=0, sin imprimir argv[1][0]
    write(1, &argv[1][i], 1);
    i--;
}`,
      codigoBien: `// ✅ i>=0 → incluye el índice 0
while (i >= 0) {
    write(1, &argv[1][i], 1);
    i--;
}`,
    },
    {
      severidad: 'warning',
      titulo: 'String vacío → i queda en -1 antes del segundo while',
      descripcion: 'Con "" el primer while no entra, i=0, i-- → i=-1. El segundo while (i>=-1: TRUE) ¡escribiría argv[1][-1]! Usar i>=0 evita esto.',
      codigoMal: `// ❌ Con "" y condición i >= -1 escribiría basura
i = 0; while (argv[1][i]) i++; // i=0 para ""
i--;  // i=-1
while (i >= -1) {  // ← entra y lee memoria inválida
    write(1, &argv[1][i], 1);`,
      codigoBien: `// ✅ Condición i >= 0 protege contra string vacío
i = 0; while (argv[1][i]) i++;
i--;   // i=-1 para ""
while (i >= 0) {  // -1 >= 0 → FALSE → no entra ✓`,
    },
  ],

  bajoCelCapot: `"abc" en memoria: [a][b][c][\\0]
Índices:           0   1   2   3
Recorrido inverso: 2→c, 1→b, 0→a
El \\0 (índice 3) NO se imprime — queda excluido por la condición i>=0.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Patrón de índice descendente. Se reutiliza en rstr_capitalizer, reverse_bits (concepto), ft_strrev.',
  relacionados: ['ft_strlen', 'ft_strrev'],
}
