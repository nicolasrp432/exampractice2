export default {
  id: 'expand_str',
  nombre: 'expand_str',
  nivel: 3,
  dificultad: 'fácil',
  tipoEntrega: 'programa',
  archivosEsperados: ['expand_str.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : expand_str
Expected files   : expand_str.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays it, replacing every blank
character by 3 spaces, and without any trailing spaces.

If the number of arguments is not 1, just display a newline.

Example:
$> ./expand_str "hello world" | cat -e
hello   world$
$> ./expand_str " hello " | cat -e
   hello$
$> ./expand_str "  " | cat -e
$
$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : expand_str
Expected files   : expand_str.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays it with exactly three spaces
between each word, with no spaces or tabs either at the beginning or the end,
followed by a newline.

A word is a section of string delimited either by spaces/tabs, or by the
start/end of the string.

If the number of parameters is not 1, or if there are no words, simply display
a newline.

Examples:

$> ./expand_str "See? It's easy to print the same thing" | cat -e
See?   It's   easy   to   print   the   same   thing$
$> ./expand_str " this        time it      will     be    more complex  " | cat -e
this   time   it   will   be   more   complex$
$> ./expand_str "No S*** Sherlock..." "nAw S*** ShErLaWQ..." | cat -e
$
$> ./expand_str "" | cat -e
$
$>

$> ./expand_str "vous   voyez   c'est   facile   d'afficher   la   meme   chose" | cat -e
vous   voyez   c'est   facile   d'afficher   la   meme   chose$
$> ./expand_str " seulement          la c'est      plus dur " | cat -e
seulement   la   c'est   plus   dur$
$> ./expand_str "comme c'est cocasse" "vous avez entendu, Mathilde ?" | cat -e
$
$> ./expand_str "" | cat -e
$
$>`,

  descripcion: 'Programa que expande los espacios: cualquier grupo de espacios consecutivos se reemplaza por exactamente 3 espacios. Los espacios finales se eliminan. Similar a epur_str pero con 3 espacios en vez de 1.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'persiana',
    personaje: 'El Acordeón de Tres Notas',
    emoji: '📐',
    historia: `En el dormitorio hay una Persiana que expande los silencios.
Es el hermano mayor de epur_str: en vez de UN silencio, hace TRES.
Cualquier grupo de uno o más espacios → exactamente 3 espacios.
Pero los espacios al FINAL también los elimina (igual que epur_str).
El algoritmo es idéntico a epur_str pero escribe "   " en vez de " ".`,
    anclas: [
      "k=0 inicialmente (sin grupo de espacios pendiente)",
      "si c==' ': k=1 (hay un grupo de espacios pendiente)",
      "si c!=' ': si k=1, write('   ') (3 espacios), k=0; luego write(c)",
      "espacios iniciales: añade 3 espacios ANTES del primer char",
      "espacios finales: k queda 1 pero no se escribe → eliminados",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `El programa recibe un string y añade espacios alrededor de cada carácter no-alfanumérico.
Los caracteres alfanuméricos (letras y dígitos) se imprimen tal cual.
Los demás caracteres (símbolos, espacios, puntuación) se imprimen con un espacio antes y uno después.
Los espacios extras se normalizan para evitar dobles espacios.`,
    datosPuros: [
      { elemento: "isalnum(c) para detectar alfanumérico", nota: 'alternativa: c >= a-z || c >= A-Z || c >= 0-9' },
      { elemento: 'espacio antes y después del símbolo', nota: 'dos write: primero " ", luego el símbolo, luego " "' },
    ],
    asociaciones: [
      { dato: 'espacio antes y después de símbolo', imagen: 'expand_str es un repartidor que respeta el espacio personal de los símbolos. Cada vez que ve un símbolo, le abre paso con "espacios guardaespaldas" a ambos lados. Las letras y números van sin guardaespaldas.' },
    ],
  },

  animacion: {
    "tipo": "word-split",
    "config": {
      "cadena": "  hola   mundo foo ",
      "modo": "epur"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "recorre palabras (ignorando espacios extra)",
        "porque": "Detecta cada palabra.",
        "concepto": "bandera"
      },
      {
        "codigo": "imprime la palabra",
        "porque": "Escribe sus caracteres.",
        "concepto": "strings"
      },
      {
        "codigo": "entre palabras imprime \"   \" (3 espacios)",
        "porque": "expand_str separa con exactamente tres espacios.",
        "concepto": "bandera"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿En qué se diferencia de epur_str?",
        "respuesta": "epur deja UN espacio entre palabras; expand deja TRES."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Flag k: cada grupo de espacios → exactamente 3 espacios antes del siguiente char',
    formula: 'for c: if c!=" " { if k: write("   "),k=0; write(c) } else: k=1',
    ejemplo: {
      entrada: '"hello world"',
      calculo: 'hello→ok; " "→k=1; w→write("   ")+"w" → "hello   world"',
      resultado: '"hello   world"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=expand_str.c
file2=../../../../rendu/expand_str/expand_str.c


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

    ./out1 "See? It's easy to print the same thing" > out1.txt 2>/dev/null
    ./out2 "See? It's easy to print the same thing" > out2.txt 2>/dev/null

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

    ./out1 " this        time it      will     be    more complex  . " > out1.txt 2>/dev/null
    ./out2 " this        time it      will     be    more complex  . " > out2.txt 2>/dev/null

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

    ./out1 "No S*** Sherlock..." "nAw S*** ShErLaWQ..." > out1.txt 2>/dev/null
    ./out2 "No S*** Sherlock..." "nAw S*** ShErLaWQ..." > out2.txt 2>/dev/null

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

    ./out1 "comme c'est cocasse" "vous avez entendu, Mathilde ?" > out1.txt 2>/dev/null
    ./out2 "comme c'est cocasse" "vous avez entendu, Mathilde ?" > out2.txt 2>/dev/null

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

    ./out1 "5" > out1.txt 2>/dev/null
    ./out2 "5"> out2.txt 2>/dev/null

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

# 8. test
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
    { id: 'tester_1', entrada: [], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["See? It's easy to print the same thing"], salida: "See?   It's   easy   to   print   the   same   thing\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: [" this        time it      will     be    more complex  . "], salida: "this   time   it   will   be   more   complex   .\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["No S*** Sherlock...","nAw S*** ShErLaWQ..."], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["comme c'est cocasse","vous avez entendu, Mathilde ?"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["5"], salida: "5\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["Too","Many","Arguments"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["7"], salida: "7\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con flag k igual que epur_str pero con 3 espacios',
      descripcion: 'Idéntica estructura a epur_str, solo cambia " " por "   ". La diferencia clave.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tint\tk;

\tif (argc == 2)
\t{
\t\ti = 0;
\t\tk = 0;
\t\twhile (argv[1][i])
\t\t{
\t\t\tif (argv[1][i] != ' ')
\t\t\t{
\t\t\t\tif (k)
\t\t\t\t{
\t\t\t\t\twrite(1, "   ", 3);
\t\t\t\t\tk = 0;
\t\t\t\t}
\t\t\t\twrite(1, &argv[1][i], 1);
\t\t\t}
\t\t\telse
\t\t\t\tk = 1;
\t\t\ti++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'pendiente',
      nombre: 'Con bandera pending_spaces',
      descripcion: 'Usa una bandera más descriptiva: hay espacios pendientes antes del siguiente carácter.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tint\tpending_spaces;

\tif (argc == 2)
\t{
\t\ti = 0;
\t\tpending_spaces = 0;
\t\twhile (argv[1][i])
\t\t{
\t\t\tif (argv[1][i] == ' ')
\t\t\t\tpending_spaces = 1;
\t\t\telse
\t\t\t{
\t\t\t\tif (pending_spaces)
\t\t\t\t{
\t\t\t\t\twrite(1, "   ", 3);
\t\t\t\t\tpending_spaces = 0;
\t\t\t\t}
\t\t\t\twrite(1, &argv[1][i], 1);
\t\t\t}
\t\t\ti++;
\t\t}
\t}
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

int		word_len(char *str)
{
	int i = 0;
	while (str[i] != '\\0' && str[i] != ' ' && str[i] != '\\t')
		++i;
	return (i);
}

void	expand_str(char *str)
{
	int len;
	int first_word = 1;

	while (*str != '\\0')
	{
		while (*str == ' ' || *str == '\\t')
			++str;
		len = word_len(str);
		if (len > 0 && first_word == 0)
			write(1, "   ", 3);
		first_word = 0;
		write(1, str, len);
		str = str + len;
	}
}

int		main(int argc, char **argv)
{
	if (argc == 2)
		expand_str(argv[1]);

	write(1, "\\n", 1);
	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_un_espacio', descripcion: '"hello world" → "hello   world" (1 espacio → 3)', entrada: ['hello world'], salida: 'hello   world\n', tipo: 'normal' },
    { id: 'test_multi_espacios', descripcion: '"hello  world" → "hello   world" (2 espacios → 3)', entrada: ['hello  world'], salida: 'hello   world\n', tipo: 'normal' },
    { id: 'test_leading', descripcion: '" hello" → "   hello" (espacio inicial → 3 espacios)', entrada: [' hello'], salida: '   hello\n', tipo: 'normal' },
    { id: 'test_trailing', descripcion: '"hello " → "hello" (espacio final eliminado)', entrada: ['hello '], salida: 'hello\n', tipo: 'edge' },
    { id: 'test_solo_espacios', descripcion: '"  " → "" (solo espacios → nada)', entrada: ['  '], salida: '\n', tipo: 'edge' },
    { id: 'test_multi_inter', descripcion: '"a b c" → "a   b   c"', entrada: ['a b c'], salida: 'a   b   c\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: '"hello world": h,e,l,l,o normales; espacio → k=1',
      codigo: `k=0
i=0..4: 'h','e','l','l','o' → k=0, write cada char
i=5: ' ' → k=1
salida hasta ahora: "hello"`,
      variables: [
        { nombre: 'k', valor: '1', cambio: true, nota: '← espacio pendiente' },
        { nombre: 'salida', valor: '"hello"', cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=6: "w" → k=1 → write("   ") antes de "w"',
      codigo: `i=6: 'w' != ' '
k=1 → write(1, "   ", 3)  ← los 3 espacios
k=0
write(1, "w", 1)
salida: "hello   w"`,
      variables: [
        { nombre: 'k', valor: '0', cambio: true, nota: '' },
        { nombre: 'salida', valor: '"hello   w"', cambio: true, nota: '← 3 espacios exactos' },
      ],
    },
    {
      paso: 3,
      titulo: '"o","r","l","d" y fin: sin espacios al final',
      codigo: `i=7..10: 'o','r','l','d' → sin k → write directo
fin del string: k=0 (no hay espacios al final en este test)
write("\\n")
Salida final: "hello   world\\n"`,
      variables: [
        { nombre: 'salida final', valor: '"hello   world\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Reemplazar CADA espacio por 3 en vez de cada GRUPO por 3',
      descripcion: 'Si "hello  world" (2 espacios), el resultado debe ser "hello   world" (3 espacios), NO "hello      world" (6 espacios = 2*3). Cada GRUPO de espacios se reemplaza por 3, sin importar cuántos haya.',
      codigoMal: `// ❌ Reemplaza cada espacio individual por 3
if (c == ' ')
    write(1, "   ", 3);  // "hello  world" → 6 spaces!`,
      codigoBien: `// ✅ Flag k: cualquier grupo de spaces → k=1 → 3 spaces una vez
if (c == ' ') k = 1;
else { if (k) { write(1, "   ", 3); k = 0; } write(1, &c, 1); }`,
    },
    {
      severidad: 'mortal',
      titulo: 'Confundir con epur_str: escribir 1 espacio en vez de 3',
      descripcion: 'epur_str escribe 1 espacio por grupo; expand_str escribe 3. La única diferencia es "   " vs " ".',
      codigoMal: `// ❌ epur_str, no expand_str
if (k) write(1, " ", 1);  // 1 espacio, no 3`,
      codigoBien: `// ✅ expand_str: siempre 3 espacios
if (k) write(1, "   ", 3);`,
    },
    {
      severidad: 'warning',
      titulo: 'expand_str SÍ añade 3 espacios para espacios iniciales (a diferencia de epur_str)',
      descripcion: 'En epur_str, los espacios iniciales se ignoran (no se imprime el espacio antes del primer char). En expand_str, si hay espacios iniciales, se imprimen 3 espacios antes del primer char.',
      codigoMal: `// ❌ Ignorar espacios iniciales como en epur_str
if (c == ' ' && started) k = 1;  // expand_str no tiene esta condición`,
      codigoBien: `// ✅ expand_str: k=1 para CUALQUIER espacio, incluyendo los iniciales
if (c == ' ') k = 1;  // sin condición "started"`,
    },
  ],

  bajoCelCapot: `expand_str es casi idéntico a epur_str con dos diferencias:
1. Escribe 3 espacios en vez de 1
2. Los espacios INICIALES también producen 3 espacios (k=1 sin condición "started")
Los espacios finales siguen eliminándose (k queda a 1 al salir del bucle → nunca se escribe).
El subject dice "every blank character" → cada char espacio activa k, pero un grupo solo produce 3.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Una vez memorizado epur_str, expand_str es trivial: misma estructura, 3 espacios en vez de 1, y sin la condición "started" para espacios iniciales.',
  relacionados: ['epur_str', 'str_capitalizer'],
}
