export default {
  id: 'alpha_mirror',
  nombre: 'alpha_mirror',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['alpha_mirror.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : alpha_mirror
Expected files   : alpha_mirror.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays it, replacing each
alphabetical character by the character that has the opposite position in the
alphabetical order.

'a' is replaced by 'z', 'b' by 'y', 'c' by 'x', ..., 'z' by 'a'.
Upper and lower case letters are handled separately.

Non-alphabetical characters are not changed.

If the number of arguments is not 1, display a newline.

Examples:
$> ./alpha_mirror "Hello World!"
Svool Dliow!
$> ./alpha_mirror ""

$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : alpha_mirror
Expected files   : alpha_mirror.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program called alpha_mirror that takes a string and displays this string
after replacing each alphabetical character by the opposite alphabetical
character, followed by a newline.

'a' becomes 'z', 'Z' becomes 'A'
'd' becomes 'w', 'M' becomes 'N'

and so on.

Case is not changed.

If the number of arguments is not 1, display only a newline.

Examples:

$>./alpha_mirror "abc"
zyx
$>./alpha_mirror "My horse is Amazing." | cat -e
Nb slihv rh Znzarmt.$
$>./alpha_mirror | cat -e
$
$>`,

  descripcion: 'Programa que espeja el alfabeto: a↔z, b↔y, ... z↔a. Mayúsculas y minúsculas por separado. Símbolos sin cambio.',

  palacio: {
    habitacion: 'salon',
    mueble: 'espejo',
    personaje: 'El Espejo del abecedario',
    emoji: '🔁',
    historia: `En el salón hay un Espejo Mágico del abecedario.
Cuando le das una 'a', te devuelve la 'z' (su opuesto).
Cuando le das una 'b', devuelve la 'y'. Cuando das 'z', devuelve 'a'.
Fórmula: la posición desde el final = 25 - (posición desde el inicio).
El espejo maneja mayúsculas y minúsculas por separado (A↔Z, a↔z).`,
    anclas: [
      "'z' - (c - 'a')  ← fórmula minúsculas",
      "'Z' - (c - 'A')  ← fórmula mayúsculas",
      "a↔z, b↔y, m↔n  ← el punto medio",
      "símbolos y espacios: sin cambio",
      "argc != 2 → solo \\n",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe un string y espeja cada letra del alfabeto.
La 'a' se convierte en 'z', la 'b' en 'y', la 'c' en 'x', y así al revés.
Es como si el abecedario tuviera un espejo en el centro (entre la m y la n).
Las mayúsculas hacen lo mismo entre sí.
Los símbolos y números no cambian.`,
    datosPuros: [
      { elemento: "'z' - (c - 'a')", nota: 'fórmula espejo para minúsculas' },
      { elemento: "'Z' - (c - 'A')", nota: 'fórmula espejo para mayúsculas' },
    ],
    asociaciones: [
      { dato: "'z' - (c - 'a')", imagen: "El alfabeto es un pasillo con espejo al fondo. Caminas desde la 'a' un número de pasos (c - 'a') y el espejo te devuelve a esa misma distancia desde la 'z'. Siempre llegas al espejo opuesto." },
      { dato: 'símbolos sin cambio', imagen: "Los símbolos llevan gafas de sol reflectantes — el espejo los ve pero no puede transformarlos. Los deja pasar tal cual." },
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
        "porque": "Recorre la cadena.",
        "concepto": "strings"
      },
      {
        "codigo": "  if minúscula: c = 'z' - (c - 'a');",
        "porque": "Espeja: a↔z, b↔y... reflejando sobre el alfabeto.",
        "concepto": "ascii"
      },
      {
        "codigo": "  if mayúscula: c = 'Z' - (c - 'A');",
        "porque": "Igual con mayúsculas.",
        "concepto": "ascii"
      },
      {
        "codigo": "  write(1, &c, 1);",
        "porque": "Imprime la letra reflejada.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué 'z' - (c - 'a')?",
        "respuesta": "c - 'a' es la distancia desde el inicio; restándola desde 'z' obtienes la letra simétrica."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Posición especular: 25 - posición_original',
    formula: "c = 'z' - (c - 'a')  ó equivalente  c = 'a' + 'z' - c",
    ejemplo: {
      entrada: "'H' (pos 7 desde A)",
      calculo: "'Z' - (72 - 65) = 90 - 7 = 83 = 'S'",
      resultado: "'S'",
    },
    tablaASCII: [
      { char: 'a', ascii: 97, calculo: '122-(97-97)=122', resultado: 'z' },
      { char: 'z', ascii: 122, calculo: '122-(122-97)=97', resultado: 'a' },
      { char: 'H', ascii: 72, calculo: '90-(72-65)=83', resultado: 'S' },
      { char: 'm', ascii: 109, calculo: '122-(109-97)=110', resultado: 'n' },
    ],
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=alpha_mirror.c
file2=../../../../rendu/alpha_mirror/alpha_mirror.c


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

    ./out1 "My horse is Amazing." > out1.txt 2>/dev/null
    ./out2 "My horse is Amazing." > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["abc"], salida: "zyx\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["My horse is Amazing."], salida: "Nb slihv rh Znzarmt.\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "3:21 Yz  gLfg  nlFm pr Pz wr PV n'vm Pz uv ulg\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "ZpqsA aOPRQa , 23b \n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "ULI KLMB\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "gsrh        ...       rh hkzigz, gsvm ztzrm, nzbyv    mlg\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "   \n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "  olivn,rkhfn  \n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con fórmula de espejo',
      descripcion: 'La fórmula directa "z - (c - a)" es la más elegante y sin casos especiales.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
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
\t\t\tc = 'z' - (c - 'a');
\t\telse if (c >= 'A' && c <= 'Z')
\t\t\tc = 'Z' - (c - 'A');
\t\twrite(1, &c, 1);
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'suma',
      nombre: 'Con suma directa',
      descripcion: "Equivalente: 'a' + 'z' - c = 97 + 122 - c = 219 - c.",
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tchar\tc;

\tif (argc != 2)
\t\treturn (write(1, "\\n", 1), 0);
\ti = 0;
\twhile (argv[1][i])
\t{
\t\tc = argv[1][i];
\t\tif (c >= 'a' && c <= 'z')
\t\t\tc = 'a' + 'z' - c;
\t\telse if (c >= 'A' && c <= 'Z')
\t\t\tc = 'A' + 'Z' - c;
\t\twrite(1, &c, 1);
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
	int	i;

	i = 0;
	if (ac == 2)
	{
		while (av[1][i] != '\\0')
		{
			if (av[1][i] >= 'a' && av[1][i] <= 'z')
				av[1][i] = 219 - av[1][i];
			else if (av[1][i] >= 'A' && av[1][i] <= 'Z')
				av[1][i] = 155 - av[1][i];
			write(1, &av[1][i], 1);
			i++;
		}
	}
	write(1, "\\n", 1);
}`,
    },
  ],

  tests: [
    { id: 'test_abc', descripcion: '"abc" → "zyx"', entrada: ['abc'], salida: 'zyx\n', tipo: 'normal' },
    { id: 'test_hello', descripcion: '"Hello" → "Svool"', entrada: ['Hello'], salida: 'Svool\n', tipo: 'normal' },
    { id: 'test_az', descripcion: '"Az" → "Za" (extremos del alfabeto)', entrada: ['Az'], salida: 'Za\n', tipo: 'edge' },
    { id: 'test_mn', descripcion: '"mn" → "nm" (punto medio del alfabeto)', entrada: ['mn'], salida: 'nm\n', tipo: 'normal' },
    { id: 'test_simbolos', descripcion: '"hello world!" → "svool dliow!" (símbolos sin cambio)', entrada: ['hello world!'], salida: 'svool dliow!\n', tipo: 'normal' },
    { id: 'test_sin_args', descripcion: 'Sin argumentos → solo \\n', entrada: [], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Entrada: "abc"',
      codigo: `argc=2, argv[1]="abc"
i=0, c='a'(97)
c >= 'a' && c <= 'z' → TRUE
c = 'z' - ('a' - 'a') = 122 - 0 = 122 = 'z'
write 'z'`,
      variables: [
        { nombre: 'c', valor: "'a'(97) → 'z'(122)", cambio: true, nota: '97-97=0, 122-0=122' },
        { nombre: 'stdout', valor: '"z"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=1: "b"(98) → "y"(121)',
      codigo: `c = 'b' (98)
c = 'z' - ('b' - 'a') = 122 - 1 = 121 = 'y'
write 'y'`,
      variables: [
        { nombre: 'c', valor: "'b'(98) → 'y'(121)", cambio: true, nota: '98-97=1, 122-1=121' },
      ],
    },
    {
      paso: 3,
      titulo: 'i=2: "c"(99) → "x"(120)',
      codigo: `c = 'c' (99)
c = 'z' - ('c' - 'a') = 122 - 2 = 120 = 'x'
write 'x'
stdout: "zyx\\n"`,
      variables: [
        { nombre: 'stdout', valor: '"zyx\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Mezclar rangos mayúsculas/minúsculas',
      descripcion: "c = 'z' - (c - 'a') para mayúsculas da resultados erróneos. 'A'(65) - 'a'(97) = -32 → 122-(-32) = 154, fuera de ASCII.",
      codigoMal: `// ❌ Usa offset de minúscula para mayúsculas
if (c >= 'A' && c <= 'Z')
    c = 'z' - (c - 'a');  // 'A'(65)-'a'(97)=-32 → 122+32=154 ← fuera de rango`,
      codigoBien: `// ✅ Cada rango con su propia base
if (c >= 'A' && c <= 'Z')
    c = 'Z' - (c - 'A');  // 'A'(65)-'A'(65)=0 → 90-0=90='Z' ✓`,
    },
    {
      severidad: 'warning',
      titulo: 'alpha_mirror vs rot_13: la fórmula no es la misma',
      descripcion: "ROT13 suma 13. alpha_mirror hace 'z'-posicion (espejo). Son cifrados distintos. No confundirlos.",
      codigoMal: `// ❌ ROT13, no alpha_mirror
c = 'a' + (c - 'a' + 13) % 26;`,
      codigoBien: `// ✅ alpha_mirror (espejo del alfabeto)
c = 'z' - (c - 'a');`,
    },
  ],

  bajoCelCapot: `Posición de 'a' = 0, 'b' = 1, ..., 'z' = 25.
Espejo: posición_nueva = 25 - posición_original.
Equivalencias: 'z' - (c - 'a') = 'a' + 'z' - c = 219 - c (para minúsculas).
Es su propio inverso: aplicar dos veces da el original.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La fórmula de espejo "z-(c-a)" aparece también en cifrados simétricos y manipulaciones de rango alfabético.',
  relacionados: ['rot_13', 'rotone', 'ulstr'],
}
