export default {
  id: 'repeat_alpha',
  nombre: 'repeat_alpha',
  nivel: 1,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['repeat_alpha.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : repeat_alpha
Expected files   : repeat_alpha.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays it with each alphabetical
character duplicated as many times as its alphabetical index, followed by a
newline.

'a' duplicated 1 time.
'b' duplicated 2 times.
'z' duplicated 26 times.
'A' duplicated 1 time.
'Z' duplicated 26 times.

Non-alphabetical characters are not duplicated.

If the number of argument is not 1, just display a newline.

Example:
$>./repeat_alpha "abc"
abbccc
$>./repeat_alpha "Alex;1;"
Alllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx;1;
$>./repeat_alpha ""

$>./repeat_alpha`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : repeat_alpha
Expected files   : repeat_alpha.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program called repeat_alpha that takes a string and display it
repeating each alphabetical character as many times as its alphabetical index,
followed by a newline.

'a' becomes 'a', 'b' becomes 'bb', 'e' becomes 'eeeee', etc...

Case remains unchanged.

If the number of arguments is not 1, just display a newline.

Examples:

$>./repeat_alpha "abc"
abbccc
$>./repeat_alpha "Alex." | cat -e
Alllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx.$
$>./repeat_alpha 'abacadaba 42!' | cat -e
abbacccaddddabba 42!$
$>./repeat_alpha | cat -e
$
$>
$>./repeat_alpha "" | cat -e
$
$>`,

  descripcion: 'Programa que recibe un string y repite cada letra tantas veces como su posición en el alfabeto: a=1 vez, b=2 veces, ..., z=26 veces. Minúsculas y mayúsculas tienen la misma posición. Los símbolos se imprimen 1 vez.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'microondas',
    personaje: 'El Loro Alfa',
    emoji: '🦜',
    historia: `En la cocina hay un Loro Alfa glotón que devora letras del abecedario.
Cuando le das una 'a', la repite UNA vez (es la primera, la más rara).
Cuando le das una 'b', la grita DOS veces (segunda letra, segundo plato).
Cuando le das una 'z', enloquece y la chilla VEINTISÉIS veces sin parar.
¡Pero si le das un símbolo como ';' o '3', lo escupe exactamente UNA vez porque no le gusta!
La fórmula mágica del loro: posición = letra - 'a' + 1. ¡El +1 es OBLIGATORIO!`,
    anclas: [
      "c - 'a' + 1  (minúsculas)",
      "c - 'A' + 1  (mayúsculas)",
      'símbolo → repeat = 1',
      '+1 OBLIGATORIO (a=1, no 0)',
      'else para símbolos, ¡no olvides!',
    ],
  },

  herramientas: ['strings', 'ascii', 'argc'],

  campayoMetodo: {
    feynman: `El programa recibe un string.
Para cada letra calcula su posición en el alfabeto: 'a' = 1, 'b' = 2, ..., 'z' = 26.
Luego repite esa letra exactamente esa cantidad de veces.
Los símbolos y números se imprimen una sola vez (sin repetición).
Al final escribe un salto de línea.`,
    datosPuros: [
      { elemento: "repeticiones = c - 'a' + 1", nota: 'el +1 es obligatorio: sin él a=0 (y no se imprimiría)' },
      { elemento: "mayúsculas: c - 'A' + 1", nota: 'misma posición que la minúscula equivalente' },
      { elemento: 'símbolos: repeat = 1 (no 0)', nota: 'se imprimen una vez — no se omiten' },
    ],
    asociaciones: [
      { dato: "c - 'a' + 1 (+1 obligatorio)", imagen: "El Loro Alfa tiene hambre proporcional a su posición: el 'a' (1º en el abc) come 1 plato. Sin el +1 el 'a' comería 0 platos y desaparecería. ¡El loro siempre come al menos 1!" },
      { dato: 'símbolo → 1 vez', imagen: "Los símbolos llevan chaleco antibalas. El loro los toca pero no puede repetirlos más de una vez — los escupe una sola vez y los manda a casa." },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "abc",
      "modo": "copiar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (str[i])",
        "porque": "Recorre la cadena de entrada.",
        "concepto": "strings"
      },
      {
        "codigo": "  int n = 1;",
        "porque": "Cuántas veces repetir el carácter (por defecto 1).",
        "concepto": "variables"
      },
      {
        "codigo": "  if minúscula: n = c - 'a' + 1;",
        "porque": "'a'=1, 'b'=2... la posición en el alfabeto.",
        "concepto": "ascii"
      },
      {
        "codigo": "  if mayúscula: n = c - 'A' + 1;",
        "porque": "Igual para mayúsculas.",
        "concepto": "ascii"
      },
      {
        "codigo": "  while (n--) write(1, &c, 1);",
        "porque": "Imprime el carácter n veces.",
        "concepto": "bucles"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué c - 'a' + 1?",
        "respuesta": "Convierte la letra en su número de orden (a→1) para saber cuántas veces repetirla."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Número de repeticiones según posición en el alfabeto',
    formula: "repeat = c - 'a' + 1",
    ejemplo: {
      entrada: "'e'",
      calculo: "101 - 97 + 1 = 5",
      resultado: "'eeeee'",
    },
    tablaASCII: [
      { char: 'a', ascii: 97, calculo: '97-97+1', repeat: 1 },
      { char: 'b', ascii: 98, calculo: '98-97+1', repeat: 2 },
      { char: 'e', ascii: 101, calculo: '101-97+1', repeat: 5 },
      { char: 'z', ascii: 122, calculo: '122-97+1', repeat: 26 },
      { char: 'A', ascii: 65, calculo: '65-65+1', repeat: 1 },
      { char: 'Z', ascii: 90, calculo: '90-65+1', repeat: 26 },
    ],
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=repeat_alpha.c
file2=../../../../rendu/repeat_alpha/repeat_alpha.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 "abc" > out1.txt 2>/dev/null
    ./out2 "abc" > out2.txt 2>/dev/null

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

    ./out1 " !abc " > out1.txt 2>/dev/null
    ./out2 " !abc " > out2.txt 2>/dev/null

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

    ./out1 "Alex." > out1.txt 2>/dev/null
    ./out2 "Alex." > out2.txt 2>/dev/null

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

    ./out1 "abacadaba 42!" > out1.txt 2>/dev/null
    ./out2 "abacadaba 42!" > out2.txt 2>/dev/null

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
    exit 1
`,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: ["abc"], salida: "abbccc\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: [" !abc "], salida: " !abbccc \n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["Alex."], salida: "Alllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx.\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["abacadaba 42!"], salida: "abbacccaddddabba 42!\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "AkkkkkkkkkkkjjjjjjjjjjhhhhhhhhZZZZZZZZZZZZZZZZZZZZZZZZZZ zzzzzzzzzzzzzzzzzzzzzzzzzzLLLLLLLLLLLLKKKKKKKKKKKIIIIIIIIIJJJJJJJJJJzzzzzzzzzzzzzzzzzzzzzzzzzz , 23yyyyyyyyyyyyyyyyyyyyyyyyy \n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "FFFFFFOOOOOOOOOOOOOOORRRRRRRRRRRRRRRRRR PPPPPPPPPPPPPPPPOOOOOOOOOOOOOOONNNNNNNNNNNNNNYYYYYYYYYYYYYYYYYYYYYYYYY\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "tttttttttttttttttttthhhhhhhhiiiiiiiiisssssssssssssssssss        ...       iiiiiiiiisssssssssssssssssss ssssssssssssssssssspppppppppppppppparrrrrrrrrrrrrrrrrrtttttttttttttttttttta, tttttttttttttttttttthhhhhhhheeeeennnnnnnnnnnnnn agggggggaiiiiiiiiinnnnnnnnnnnnnn, mmmmmmmmmmmmmayyyyyyyyyyyyyyyyyyyyyyyyybbeeeee    nnnnnnnnnnnnnnoooooooooooooootttttttttttttttttttt\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "   \n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "  llllllllllllooooooooooooooorrrrrrrrrrrrrrrrrreeeeemmmmmmmmmmmmm,iiiiiiiiippppppppppppppppsssssssssssssssssssuuuuuuuuuuuuuuuuuuuuummmmmmmmmmmmm  \n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica (variable repeat)',
      descripcion: 'Usa variable repeat explícita. La más legible y segura en el examen.',
      recomendada: true,
      codigo: `#include <unistd.h>

int main(int argc, char **argv)
{
\tint\ti;
\tint\tj;
\tint\trepeat;
\tchar\tc;

\tif (argc != 2)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\ti = 0;
\twhile (argv[1][i])
\t{
\t\tc = argv[1][i];
\t\tif (c >= 'a' && c <= 'z')
\t\t\trepeat = c - 'a' + 1;
\t\telse if (c >= 'A' && c <= 'Z')
\t\t\trepeat = c - 'A' + 1;
\t\telse
\t\t\trepeat = 1;
\t\tj = 0;
\t\twhile (j < repeat)
\t\t{
\t\t\twrite(1, &c, 1);
\t\t\tj++;
\t\t}
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'compacta',
      nombre: 'Compacta (función auxiliar)',
      descripcion: 'Separa el cálculo del repeat en una función. Más limpia pero requiere función extra.',
      recomendada: false,
      codigo: `#include <unistd.h>

static int\tft_repeat(char c)
{
\tif (c >= 'a' && c <= 'z')
\t\treturn (c - 'a' + 1);
\tif (c >= 'A' && c <= 'Z')
\t\treturn (c - 'A' + 1);
\treturn (1);
}

int main(int argc, char **argv)
{
\tint\ti;
\tint\tj;

\tif (argc != 2)
\t\treturn (write(1, "\\n", 1), 0);
\ti = 0;
\twhile (argv[1][i])
\t{
\t\tj = ft_repeat(argv[1][i]);
\t\twhile (j--)
\t\t\twrite(1, &argv[1][i], 1);
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'inline',
      nombre: 'Inline (sin variable repeat)',
      descripcion: 'Todo en el while interior. Más difícil de leer bajo presión, no recomendada.',
      recomendada: false,
      codigo: `#include <unistd.h>

int main(int argc, char **argv)
{
\tint\ti;
\tint\tj;
\tint\tr;

\tif (argc != 2)
\t\treturn (write(1, "\\n", 1), 0);
\ti = 0;
\twhile (argv[1][i])
\t{
\t\tr = (argv[1][i] >= 'a' && argv[1][i] <= 'z') ? argv[1][i] - 'a' + 1
\t\t  : (argv[1][i] >= 'A' && argv[1][i] <= 'Z') ? argv[1][i] - 'A' + 1
\t\t  : 1;
\t\tj = 0;
\t\twhile (j++ < r)
\t\t\twrite(1, &argv[1][i], 1);
\t\ti++;
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
	int i;
	int k;
	char *str;

	i = 0;
	k = 1;
	if (ac ==2)
	{
		str = av[1];
		while (str[i] != '\\0')
		{
			k = 1;
			if (str[i] >= 'A' && str[i] <= 'Z')
				k = str[i] - 64;
			if (str[i] >= 'a' && str[i] <= 'z')
				k = str[i] - 96;
			while (k >= 1)
			{
				write(1, &str[i], 1);
				k--;
			}
			i++;
		}
	}
	write(1, "\\n", 1);
	return (0);
}`,
    },
  ],

  tests: [
    {
      id: 'test_abc',
      descripcion: '"abc" → a=1, b=2, c=3',
      entrada: ['abc'],
      salida: 'abbccc\n',
      tipo: 'normal',
    },
    {
      id: 'test_Z',
      descripcion: '"Z" → 26 Z mayúsculas',
      entrada: ['Z'],
      salida: 'ZZZZZZZZZZZZZZZZZZZZZZZZZZ\n',
      tipo: 'edge',
    },
    {
      id: 'test_a',
      descripcion: '"a" → solo 1 a',
      entrada: ['a'],
      salida: 'a\n',
      tipo: 'normal',
    },
    {
      id: 'test_vacio',
      descripcion: 'String vacío → solo newline',
      entrada: [''],
      salida: '\n',
      tipo: 'edge',
    },
    {
      id: 'test_sin_args',
      descripcion: 'Sin argumentos (argc=1) → newline',
      entrada: [],
      salida: '\n',
      tipo: 'edge',
    },
    {
      id: 'test_dos_args',
      descripcion: 'Dos argumentos (argc=3) → newline',
      entrada: ['abc', 'def'],
      salida: '\n',
      tipo: 'edge',
    },
    {
      id: 'test_simbolos',
      descripcion: 'Solo símbolos → sin repetición',
      entrada: [';!@3'],
      salida: ';!@3\n',
      tipo: 'normal',
    },
    {
      id: 'test_mixto',
      descripcion: '"aA" → a=1 vez, A=1 vez',
      entrada: ['aA'],
      salida: 'aA\n',
      tipo: 'normal',
    },
    {
      id: 'test_alex',
      descripcion: '"Alex;1;" → A(1)+l(12)+e(5)+x(24)+;1;',
      entrada: ['Alex;1;'],
      salida: 'Alllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx;1;\n',
      tipo: 'normal',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Inicio: argc=2, argv[1]="abc"',
      codigo: `(gdb) run "abc"
Starting program: ./repeat_alpha "abc"

Breakpoint 1, main (argc=2, argv=0x7fffffffe198) at repeat_alpha.c:5
5\t\tint i;`,
      variables: [
        { nombre: 'argc', valor: '2', cambio: true, nota: '✓ Correcto: 1 argumento' },
        { nombre: 'argv[1]', valor: '"abc"', cambio: true, nota: 'El string a procesar' },
        { nombre: 'i', valor: '?', cambio: false, nota: 'Sin inicializar' },
        { nombre: 'repeat', valor: '?', cambio: false, nota: 'Sin inicializar' },
      ],
    },
    {
      paso: 2,
      titulo: 'i = 0, inicia el bucle',
      codigo: `(gdb) next
11\t\ti = 0;
(gdb) next
12\t\twhile (argv[1][i])  → argv[1][0] = 'a' ≠ '\\0', ENTRA`,
      variables: [
        { nombre: 'i', valor: '0', cambio: true, nota: '→ apunta a "a"' },
        { nombre: 'argv[1][0]', valor: "'a' (97)", cambio: false, nota: 'Primer char ≠ \\0' },
      ],
    },
    {
      paso: 3,
      titulo: 'c = "a" → calcula repeat = 1',
      codigo: `(gdb) next
13\t\tc = argv[1][i];           // c = 'a'
(gdb) next
15\t\tif (c >= 'a' && c <= 'z') // 97>=97 && 97<=122 → TRUE
16\t\t\trepeat = c - 'a' + 1; // 97 - 97 + 1 = 1`,
      variables: [
        { nombre: 'c', valor: "'a' (97)", cambio: true, nota: 'Minúscula detectada' },
        { nombre: 'repeat', valor: '97 - 97 + 1 = 1', cambio: true, nota: '← posición 1 en alfabeto' },
      ],
    },
    {
      paso: 4,
      titulo: 'Bucle j: escribe "a" × 1',
      codigo: `(gdb) next
20\t\tj = 0;
(gdb) next
21\t\twhile (j < repeat)  // 0 < 1 → TRUE
22\t\t\twrite(1, &c, 1);  // output: "a"
(gdb) next
23\t\t\tj++;              // j=1
(gdb) next
21\t\twhile (j < repeat)  // 1 < 1 → FALSE, sale`,
      variables: [
        { nombre: 'j', valor: '0 → 1', cambio: true, nota: '' },
        { nombre: 'output', valor: '"a"', cambio: true, nota: '1 carácter escrito' },
      ],
    },
    {
      paso: 5,
      titulo: 'i++ → i=1, c="b" → calcula repeat = 2',
      codigo: `(gdb) next
24\t\ti++;              // i=1
(gdb) next
12\t\twhile (argv[1][i])  // argv[1][1]='b' ≠ '\\0', ENTRA
(gdb) next
13\t\tc = argv[1][i];           // c = 'b'
16\t\t\trepeat = c - 'a' + 1; // 98 - 97 + 1 = 2`,
      variables: [
        { nombre: 'i', valor: '1', cambio: true, nota: '' },
        { nombre: 'c', valor: "'b' (98)", cambio: true, nota: '' },
        { nombre: 'repeat', valor: '98 - 97 + 1 = 2', cambio: true, nota: '← posición 2' },
      ],
    },
    {
      paso: 6,
      titulo: 'Bucle j: escribe "bb" × 2',
      codigo: `(gdb) next  [j=0] write 'b'  → output: "ab"
(gdb) next  [j=1] write 'b'  → output: "abb"
(gdb) next  [j=2] 2<2 FALSE  → sale del while`,
      variables: [
        { nombre: 'j', valor: '0 → 1 → 2', cambio: true, nota: '' },
        { nombre: 'output', valor: '"abb"', cambio: true, nota: '2 chars escritos' },
      ],
    },
    {
      paso: 7,
      titulo: 'i++ → i=2, c="c" → calcula repeat = 3',
      codigo: `(gdb) next
i=2, c = argv[1][2] = 'c' (99)
repeat = 'c' - 'a' + 1 = 99 - 97 + 1 = 3`,
      variables: [
        { nombre: 'i', valor: '2', cambio: true, nota: '' },
        { nombre: 'c', valor: "'c' (99)", cambio: true, nota: '' },
        { nombre: 'repeat', valor: '99 - 97 + 1 = 3', cambio: true, nota: '← posición 3' },
      ],
    },
    {
      paso: 8,
      titulo: 'Bucle j: escribe "ccc" × 3',
      codigo: `(gdb) next  [j=0] write 'c'  → output: "abbc"
(gdb) next  [j=1] write 'c'  → output: "abbcc"
(gdb) next  [j=2] write 'c'  → output: "abbccc"
(gdb) next  [j=3] 3<3 FALSE  → sale del while`,
      variables: [
        { nombre: 'j', valor: '0 → 1 → 2 → 3', cambio: true, nota: '' },
        { nombre: 'output', valor: '"abbccc"', cambio: true, nota: '3 chars escritos' },
      ],
    },
    {
      paso: 9,
      titulo: 'i++ → i=3, argv[1][3]="\\0" → sale del while principal',
      codigo: `(gdb) next
i=3
while (argv[1][3])  // '\\0' = 0 → FALSE, sale del bucle
→ write(1, "\\n", 1)  // output: "abbccc\\n"`,
      variables: [
        { nombre: 'i', valor: '3', cambio: true, nota: '' },
        { nombre: 'argv[1][3]', valor: "'\\0' (0)", cambio: false, nota: 'Fin del string' },
        { nombre: 'output', valor: '"abbccc\\n"', cambio: true, nota: 'Newline final añadido' },
      ],
    },
    {
      paso: 10,
      titulo: 'return 0 — Programa termina',
      codigo: `(gdb) next
return (0);
[Inferior 1 (process 12345) exited normally]
$> echo $?
0`,
      variables: [
        { nombre: 'exit code', valor: '0', cambio: false, nota: '✓ Sin errores' },
        { nombre: 'output total', valor: '"abbccc\\n"', cambio: false, nota: '✓ Correcto' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Olvidar el +1 → a sale 0 veces (invisible)',
      descripcion: 'Sin el +1, la fórmula da repeat=0 para "a". La letra desaparece del output y la Moulinette falla.',
      codigoMal: `// ❌ SIN +1
if (c >= 'a' && c <= 'z')
    repeat = c - 'a';     // 'a'-'a' = 0 → no se imprime nada
                          // 'b'-'a' = 1 → sale 1 vez en vez de 2`,
      codigoBien: `// ✅ CON +1
if (c >= 'a' && c <= 'z')
    repeat = c - 'a' + 1; // 'a'-'a'+1 = 1 ✓
                           // 'b'-'a'+1 = 2 ✓`,
    },
    {
      severidad: 'mortal',
      titulo: 'Olvidar el else para símbolos → repeat basura',
      descripcion: 'Sin el else final, repeat queda con el valor anterior cuando el char es un símbolo. Imprime basura.',
      codigoMal: `// ❌ SIN else → repeat queda con valor anterior
if (c >= 'a' && c <= 'z')
    repeat = c - 'a' + 1;
else if (c >= 'A' && c <= 'Z')
    repeat = c - 'A' + 1;
// ";" con repeat anterior = 3 → ";;;" en vez de ";"`,
      codigoBien: `// ✅ CON else → símbolos = 1 vez
if (c >= 'a' && c <= 'z')
    repeat = c - 'a' + 1;
else if (c >= 'A' && c <= 'Z')
    repeat = c - 'A' + 1;
else
    repeat = 1; // ← OBLIGATORIO`,
    },
    {
      severidad: 'warning',
      titulo: 'No inicializar i = 0 antes del while',
      descripcion: 'i tiene valor basura si no se inicializa. Normas de 42: declarar + inicializar por separado.',
      codigoMal: `// ❌ Comportamiento indefinido
int i;
// ... (sin i = 0)
while (argv[1][i]) // i = basura`,
      codigoBien: `// ✅
int i;

i = 0;  // ← siempre antes del while
while (argv[1][i])`,
    },
  ],

  bajoCelCapot: `RAM: argv[1] es un puntero al string del argumento en el stack del proceso.
Cada argv[1][i] accede a una dirección de memoria: argv[1] + i.

CPU: El bucle externo (i) itera por el array de chars hasta encontrar \\0.
El bucle interno (j) llama a write() N veces, donde N = posición en alfabeto.

SYSCALL write(1, &c, 1):
- fd=1 → stdout
- &c → dirección de la variable local c en el stack
- 1 → escribe exactamente 1 byte
Cada write es una llamada al kernel (syscall número 1 en Linux x86-64).

ARITMÉTICA ASCII:
- 'a'=97, 'z'=122 (rango 97-122)
- 'A'=65, 'Z'=90  (rango 65-90)
- La diferencia entre mayúscula y minúscula es siempre 32
- c-'a'+1 convierte el char a su posición (1-indexed)`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La fórmula c-"a"+1 hay que recordarla de memoria. El patrón if/else if/else también. No hay forma de deducirla bajo presión.',

  relacionados: ['rot_13', 'rotone', 'ulstr', 'alpha_mirror'],

  progreso: {
    estado: 'no_iniciado',
    testsPasados: 0,
    testsTotal: 9,
    intentos: 0,
    ultimaVez: null,
    proximaRepasion: null,
    intervaloDias: 1,
    notas: '',
  },
}
