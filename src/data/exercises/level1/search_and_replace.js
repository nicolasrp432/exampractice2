export default {
  id: 'search_and_replace',
  nombre: 'search_and_replace',
  nivel: 1,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['search_and_replace.c'],
  funcionesPermitidas: ['write', 'exit'],

  // ── Subject real del examen (rank02/level0/search_and_replace/sub.txt) ──
  subject: `Assignment name  : search_and_replace
Expected files   : search_and_replace.c
Allowed functions: write, exit
--------------------------------------------------------------------------------

Write a program called search_and_replace that takes 3 arguments, the first
arguments is a string in which to replace a letter (2nd argument) by
another one (3rd argument).

If the number of arguments is not 3, just display a newline.

If the second argument is not contained in the first one (the string)
then the program simply rewrites the string followed by a newline.

Examples:
$>./search_and_replace "Papache est un sabre" "a" "o"
Popoche est un sobre
$>./search_and_replace "zaz" "art" "zul" | cat -e
$
$>./search_and_replace "zaz" "r" "u" | cat -e
zaz$
$>./search_and_replace "jacob" "a" "b" "c" "e" | cat -e
$
$>./search_and_replace "ZoZ eT Dovid oiME le METol." "o" "a" | cat -e
ZaZ eT David aiME le METal.$
$>./search_and_replace "wNcOre Un ExEmPle Pas Facilw a Ecrirw " "w" "e" | cat -e
eNcOre Un ExEmPle Pas Facile a Ecrire $`,

  // Copia literal del sub.txt para auditoría — no se renderiza por defecto.
  subjectReal: `Assignment name  : search_and_replace
Expected files   : search_and_replace.c
Allowed functions: write, exit
--------------------------------------------------------------------------------

Write a program called search_and_replace that takes 3 arguments, the first
arguments is a string in which to replace a letter (2nd argument) by
another one (3rd argument).

If the number of arguments is not 3, just display a newline.

If the second argument is not contained in the first one (the string)
then the program simply rewrites the string followed by a newline.

Examples:
$>./search_and_replace "Papache est un sabre" "a" "o"
Popoche est un sobre
$>./search_and_replace "zaz" "art" "zul" | cat -e
$
$>./search_and_replace "zaz" "r" "u" | cat -e
zaz$
$>./search_and_replace "jacob" "a" "b" "c" "e" | cat -e
$
$>./search_and_replace "ZoZ eT Dovid oiME le METol." "o" "a" | cat -e
ZaZ eT David aiME le METal.$
$>./search_and_replace "wNcOre Un ExEmPle Pas Facilw a Ecrirw " "w" "e" | cat -e
eNcOre Un ExEmPle Pas Facile a Ecrire $`,

  // Subject didáctico previo, conservado como variante. Endurecía la
  // especificación al exigir que 2º y 3º arg fueran exactamente 1 char.
  subjectAlternativo: `Assignment name  : search_and_replace
Expected files   : search_and_replace.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes 3 arguments:
  - A string in which to make replacements.
  - The character to search for (given as a string, only the first char counts).
  - The replacement character (given as a string, only the first char counts).

The replacement must be done in the order they appear in the string.

If the number of arguments is not 3, or if the second or third argument is
not a single character, print only a newline.

Example:
$> ./search_and_replace "hello" "l" "r"
herro
$> ./search_and_replace "hello" "x" "r"
hello
$>`,

  descripcion: 'Programa que reemplaza todas las ocurrencias de un carácter en un string. Recibe 3 args: string, char a buscar, char de reemplazo.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'tabla de cortar',
    personaje: 'El Ninja Reemplazador',
    emoji: '🥷',
    historia: `En la tabla de cortar trabaja el Ninja Reemplazador.
Le das el string (la lista de ingredientes), el ingrediente a quitar (search) y el nuevo (replace).
Recorre la lista de principio a fin.
Cuando encuentra el ingrediente a quitar, lo sustituye por el nuevo.
Si no lo encuentra, deja el ingrediente sin tocar.
¡Solo acepta EXACTAMENTE 3 argumentos! Con más o menos, huye.`,
    anclas: [
      "argc != 3 → solo \\n y exit",
      "search = argv[2][0] ← solo el primer char",
      "replace = argv[3][0] ← solo el primer char",
      "if (c == search) write replace; else write c;",
      "recorre argv[1] byte a byte",
    ],
  },

  herramientas: ['strings', 'argc'],

  campayoMetodo: {
    feynman: `El programa recibe 3 argumentos: un string, una letra a buscar y una letra de reemplazo.
Recorre el string letra a letra.
Cuando encuentra la letra que hay que buscar (av[2][0]), la escribe reemplazada por la letra nueva (av[3][0]).
Si la letra no es la buscada, la escribe tal cual.
Si no hay exactamente 3 argumentos o el segundo argumento no está en el string, solo imprime el string + newline.`,
    datosPuros: [
      { elemento: 'argc != 4', nota: '4 argumentos en total: programa + string + búsqueda + reemplazo' },
      { elemento: 'av[2][0]', nota: 'primer carácter del 2º argumento — solo se usa el primer char' },
      { elemento: 'av[3][0]', nota: 'primer carácter del 3º argumento — solo se usa el primer char' },
    ],
    asociaciones: [
      { dato: 'argc != 4 (4 total)', imagen: 'La fotocopiadora de recetas necesita 4 ingredientes: ella misma + el papel original + el sabor a buscar + el sabor nuevo. Si faltan ingredientes, solo imprime y se va.' },
      { dato: 'av[2][0] (primer char del arg)', imagen: 'El argumento av[2] es una palabra entera, pero la "lupa" solo mira la primera letra ([0]). El resto del argumento lo ignora: solo importa el primer carácter.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "zaz",
      "modo": "copiar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "char c = argv[2][0], r = argv[3][0];",
        "porque": "Carácter a buscar y su reemplazo (primer char de cada arg).",
        "concepto": "strings"
      },
      {
        "codigo": "while (argv[1][i])",
        "porque": "Recorre la frase.",
        "concepto": "strings"
      },
      {
        "codigo": "  if (argv[1][i] == c) write(1,&r,1);",
        "porque": "Si coincide, escribe el reemplazo.",
        "concepto": "condicionales"
      },
      {
        "codigo": "  else write(1,&argv[1][i],1);",
        "porque": "Si no, escribe el carácter original.",
        "concepto": "condicionales"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué argv[2][0] y no argv[2]?",
        "respuesta": "Se reemplaza un carácter, no una palabra: tomamos solo el primer char."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Por cada carácter: si es el buscado, escribe el reemplazo; si no, escribe el original',
    formula: "if (str[i] == search) write(replace); else write(str[i]);",
    ejemplo: {
      entrada: '"hello", search="l", replace="r"',
      calculo: 'h→h e→e l→r l→r o→o',
      resultado: 'herro',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=search_and_replace.c
file2=../../../../rendu/search_and_replace/search_and_replace.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 "L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification." > out1.txt 2>/dev/null
    ./out2 "L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification." > out2.txt 2>/dev/null

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

    ./out1 "S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  " > out1.txt 2>/dev/null
    ./out2 "S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  " > out2.txt 2>/dev/null

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

    rm out1 out2 out1.txt out2.txt 2>/dev/null
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
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "Popoche est un sobre\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "zaz\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "ZaZ eT David aiME le METal.\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "eNcOre Un ExEmPle Pas Facile a Ecrire \n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica',
      descripcion: 'La más directa y legible en el examen.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tchar\tsearch;
\tchar\treplace;
\tint\ti;

\tif (argc != 4)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\tsearch = argv[2][0];
\treplace = argv[3][0];
\ti = 0;
\twhile (argv[1][i])
\t{
\t\tif (argv[1][i] == search)
\t\t\twrite(1, &replace, 1);
\t\telse
\t\t\twrite(1, &argv[1][i], 1);
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'punteros',
      nombre: 'Con puntero y validación explícita',
      descripcion: 'Recorre el string con un puntero y valida que search y replace sean de un solo carácter.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tchar\t*s;
\tchar\tsearch;
\tchar\treplace;

\tif (argc != 4 || !argv[2][0] || argv[2][1] || !argv[3][0] || argv[3][1])
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\ts = argv[1];
\tsearch = argv[2][0];
\treplace = argv[3][0];
\twhile (*s)
\t{
\t\tif (*s == search)
\t\t\twrite(1, &replace, 1);
\t\telse
\t\t\twrite(1, s, 1);
\t\ts++;
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
      codigo: `#include <unistd.h>

int	main(int ac, char **av)
{
	int	i;

	i = 0;
	if (ac == 4)
	{
		if(((av[2][0] >= 'a' && av[2][0]<= 'z') || (av[2][0] >= 'A' && av[2][0]<= 'Z')) && av[2][1] == '\\0')
			if (((av[3][0] >= 'a' && av[2][0]<= 'z') || (av[3][0] >= 'A' && av[3][0]<= 'Z')) && av[3][1] == '\\0')
			{
				while (av[1][i] != '\\0')
				{
					if (av[1][i] == av[2][0])
							av[1][i] = av[3][0];
					write(1, &av[1][i], 1);
					i++;
				}
			}
	}
	write(1, "\\n", 1);
}`,
    },
  ],

  tests: [
    {
      id: 'test_hello_lr',
      descripcion: '"hello" l→r → "herro"',
      entrada: ['hello', 'l', 'r'],
      salida: 'herro\n',
      tipo: 'normal',
    },
    {
      id: 'test_no_match',
      descripcion: '"hello" x→r → sin cambios',
      entrada: ['hello', 'x', 'r'],
      salida: 'hello\n',
      tipo: 'normal',
    },
    {
      id: 'test_reemplaza_todos',
      descripcion: '"hello world" o→a → "hella warld"',
      entrada: ['hello world', 'o', 'a'],
      salida: 'hella warld\n',
      tipo: 'normal',
    },
    {
      id: 'test_bad_args',
      descripcion: 'Sin argumentos → error',
      entrada: [],
      salida: 'search_and_replace: bad arguments\n',
      tipo: 'edge',
    },
    {
      id: 'test_bad_args2',
      descripcion: 'Un solo argumento → error',
      entrada: ['hello'],
      salida: 'search_and_replace: bad arguments\n',
      tipo: 'edge',
    },
    {
      id: 'test_primer_char',
      descripcion: 'search="HH" → solo usa el primer char "H"',
      entrada: ['Hello', 'H', 'h'],
      salida: 'hello\n',
      tipo: 'normal',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Entrada: "hello", "l", "r" → argc=4',
      codigo: `argc=4, argv[1]="hello", argv[2]="l", argv[3]="r"
search = argv[2][0] = 'l'
replace = argv[3][0] = 'r'
i = 0`,
      variables: [
        { nombre: 'argc', valor: '4', cambio: true, nota: '✓ Correcto: programa + 3 args' },
        { nombre: 'search', valor: "'l'", cambio: true, nota: '' },
        { nombre: 'replace', valor: "'r'", cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=0: "h" ≠ "l" → escribe "h"',
      codigo: `argv[1][0] = 'h'
'h' == 'l' → FALSE
write(1, &argv[1][0], 1) → stdout: "h"
i = 1`,
      variables: [
        { nombre: 'stdout', valor: '"h"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'i=1: "e" ≠ "l" → escribe "e". i=2: "l" == "l" → escribe "r"',
      codigo: `[i=1] 'e' ≠ 'l' → write 'e' → stdout: "he"
[i=2] 'l' == 'l' → write REPLACE='r' → stdout: "her"`,
      variables: [
        { nombre: 'stdout', valor: '"her"', cambio: true, nota: 'Primera "l" reemplazada por "r"' },
      ],
    },
    {
      paso: 4,
      titulo: 'i=3: segunda "l" → escribe "r". i=4: "o" → escribe "o"',
      codigo: `[i=3] 'l' == 'l' → write 'r' → stdout: "herr"
[i=4] 'o' ≠ 'l' → write 'o' → stdout: "herro"`,
      variables: [
        { nombre: 'stdout', valor: '"herro"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 5,
      titulo: '\\0 → sale del while, write \\n',
      codigo: `argv[1][5] = '\\0' → FALSE → sale
write("\\n", 1)
stdout: "herro\\n"`,
      variables: [
        { nombre: 'stdout', valor: '"herro\\n"', cambio: true, nota: '✓ Resultado correcto' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'info',
      titulo: 'Diferencia plataforma vs examen real',
      descripcion: 'El subject real (rank02) permite también la función exit y solo exige newline cuando argc != 4 (no valida que el 2º/3º arg sean un único char). La versión didáctica de la plataforma era más estricta. La sub.txt del repo se conserva en `subjectReal`; el subject anterior queda como `subjectAlternativo` por si quieres entrenar con esa variante.',
      codigoMal: `// Versión didáctica vieja: rechaza si 2º arg tiene >1 char
if (argc != 4 || argv[2][1] || argv[3][1])
\twrite(1, "\\n", 1);`,
      codigoBien: `// Subject real: basta con argc != 4
// (extras tras el primer char del 2º/3º arg se ignoran sin error)
if (argc != 4)
\twrite(1, "\\n", 1);`,
    },
    {
      severidad: 'mortal',
      titulo: 'argc != 3 en vez de argc != 4 (el programa mismo cuenta)',
      descripcion: 'argc incluye el nombre del programa (argv[0]). Con 3 argumentos del usuario, argc = 4. Si compruebas argc != 3 o argc != 2, el programa siempre falla.',
      codigoMal: `// ❌ Confunde argc: programa+3args = argc=4
if (argc != 3)  // nunca ejecuta con 3 args reales`,
      codigoBien: `// ✅ argc=4 con 3 argumentos de usuario
if (argc != 4)  // correcto: ./prog str search replace`,
    },
    {
      severidad: 'mortal',
      titulo: 'write(1, &replace, 1) donde replace es un char local',
      descripcion: 'write necesita una dirección. Si escribes write(1, argv[3], 1) está bien (ya es un char*). Pero si intentas write(1, &(argv[3][0]), 1) también funciona. El problema es pasar un literal directamente.',
      codigoMal: `// ❌ No funciona: literal no tiene dirección tomable fácilmente
write(1, "r", 1);  // escribe siempre 'r', no el replace de argv`,
      codigoBien: `// ✅ Variable local con &
char replace = argv[3][0];
write(1, &replace, 1);  // correcto`,
    },
    {
      severidad: 'warning',
      titulo: 'No añadir \\n al final',
      descripcion: 'La salida debe terminar en \\n según las normas de 42. Sin él, la Moulinette compara byte a byte y falla.',
      codigoMal: `// ❌ Sin \\n
while (argv[1][i])
    // ...imprime chars
return (0); // sin write("\\n", 1)`,
      codigoBien: `// ✅ \\n siempre al final
while (argv[1][i]) { /* ... */ i++; }
write(1, "\\n", 1);
return (0);`,
    },
  ],

  bajoCelCapot: `argv[2][0] accede al primer byte del tercer argumento.
Si argv[2] = "lll", solo se usa argv[2][0] = 'l'.
La búsqueda es O(n): recorre el string una sola vez.
Es una versión simplificada de sed s/old/new/g.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Patrón de transformación carácter a carácter. Base conceptual de ft_strchr, ft_strrchr, inter, union.',
  relacionados: ['inter', 'union', 'ft_strcspn'],
}
