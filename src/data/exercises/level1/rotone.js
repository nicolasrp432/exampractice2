export default {
  id: 'rotone',
  nombre: 'rotone',
  nivel: 1,
  dificultad: 'fácil',
  tipoEntrega: 'programa',
  archivosEsperados: ['rotone.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : rotone
Expected files   : rotone.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays it, with each of its
alphabetical characters converted to the next one in alphabetical order.

'z' becomes 'a', 'Z' becomes 'A'.

Non-alphabetical characters are not modified.

If the number of arguments is not 1, display only a newline.

Examples:
$> ./rotone "Hello World !"
Ifmmp Xpsme !
$> ./rotone ""

$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : rotone
Expected files   : rotone.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays it, replacing each of its
letters by the next one in alphabetical order.

'z' becomes 'a' and 'Z' becomes 'A'. Case remains unaffected.

The output will be followed by a \\n.

If the number of arguments is not 1, the program displays \\n.

Example:

$>./rotone "abc"
bcd
$>./rotone "Les stagiaires du staff ne sentent pas toujours tres bon." | cat -e
Mft tubhjbjsft ev tubgg of tfoufou qbt upvkpvst usft cpo.$
$>./rotone "AkjhZ zLKIJz , 23y " | cat -e
BlkiA aMLJKa , 23z $
$>./rotone | cat -e
$
$>
$>./rotone "" | cat -e
$
$>`,

  descripcion: 'Programa que rota cada letra +1 en el alfabeto (a→b, y→z, z→a). Mayúsculas y minúsculas se tratan por separado. Símbolos sin cambio.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'especiero',
    personaje: 'El Ratón Teletransportador',
    emoji: '🐀',
    historia: `En el especiero de la cocina vive el Ratón Teletransportador.
Cada letra que toca la desplaza UN PELDAÑO adelante en el alfabeto.
Si la letra está en la última posición (z o Z) ¡salta al inicio! (→ a o A).
Los símbolos y números no los toca: no son su territorio.
Fórmula mental: letra + 1, pero z → a (el abecedario es circular).`,
    anclas: [
      "'z' → 'a'  ← caso especial minúscula",
      "'Z' → 'A'  ← caso especial mayúscula",
      "c + 1  ← todos los demás",
      "símbolos: sin cambio",
      "argc != 2 → solo \\n",
    ],
  },

  herramientas: ['strings', 'ascii', 'argc'],

  campayoMetodo: {
    feynman: `El programa recibe un string y lo imprime con cada letra avanzada una posición en el abecedario.
La 'a' se convierte en 'b', la 'b' en 'c', etc.
La 'z' da la vuelta y se convierte en 'a' (y la 'Z' en 'A').
Las letras mayúsculas siguen siendo mayúsculas.
Los símbolos, espacios y números no cambian.`,
    datosPuros: [
      { elemento: "c == 'z' ? 'a' : c + 1", nota: 'wrap para z minúscula' },
      { elemento: "c == 'Z' ? 'A' : c + 1", nota: 'wrap para Z mayúscula' },
      { elemento: 'else: no modificar', nota: 'símbolos y números pasan sin cambio' },
    ],
    asociaciones: [
      { dato: 'z → a (wrap circular)', imagen: 'El alfabeto es una rueda de hamster. La z llega al final y la rueda da la vuelta: cae de nuevo en la a. La Z hace lo mismo en la rueda de los grandes.' },
      { dato: 'símbolos sin cambio', imagen: 'Los números y símbolos tienen una armadura protectora. El rotone los toca pero rebotan — él solo cambia las letras desnudas (sin armadura).' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "abz",
      "modo": "copiar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (argv[1][i])",
        "porque": "Recorre cada carácter.",
        "concepto": "strings"
      },
      {
        "codigo": "  if (c >= 'a' && c <= 'z')",
        "porque": "Solo desplaza letras minúsculas.",
        "concepto": "ascii"
      },
      {
        "codigo": "    if (c == 'z') c = 'a'; else c++;",
        "porque": "La z da la vuelta a la a; el resto suma 1.",
        "concepto": "ascii"
      },
      {
        "codigo": "  write(1, &c, 1);",
        "porque": "Imprime la letra desplazada.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué el caso especial de la z?",
        "respuesta": "z+1 sería '{' (fuera del alfabeto); hay que envolver a la 'a'."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Desplazamiento +1 con wrap en z/Z',
    formula: "if (c == 'z') 'a'; else if (c == 'Z') 'A'; else c + 1;",
    ejemplo: {
      entrada: '"hello"',
      calculo: 'h→i e→f l→m l→m o→p',
      resultado: 'ifmmp',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=rotone.c
file2=../../../../rendu/rotone/rotone.c


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
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "M'fTQsju oF qfVu qmVt qSphSftTfs t'Jm tubHof fu tJ qfStJtUfou WBoJuf fu bvup-kvtujgjdbujpo.\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "T'foUPvSfs eF tFDsfU fTu vO tJHoF Ef nBoRvF Ef dpOObjTTboDf.  \n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "3:21 Cb  uPvu  npVo lj Lb ej LF n'fo Lb gf gpu\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "BlkiA aMLJKa , 23z \n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "GPS QPOZ\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "uijt        ...       jt tqbsub, uifo bhbjo, nbzcf    opu\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "   \n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "  mpsfn,jqtvn  \n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con casos especiales explícitos',
      descripcion: 'La más legible: comprueba z y Z primero, luego el rango general.',
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
\t\tif (c == 'z')
\t\t\tc = 'a';
\t\telse if (c == 'Z')
\t\t\tc = 'A';
\t\telse if ((c >= 'a' && c <= 'y') || (c >= 'A' && c <= 'Y'))
\t\t\tc = c + 1;
\t\twrite(1, &c, 1);
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'con_rangos',
      nombre: 'Con rangos y wrap aritmético',
      descripcion: 'Usa modulo aritmético para el wrap. Menos intuitiva pero válida.',
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
\t\t\tc = 'a' + (c - 'a' + 1) % 26;
\t\telse if (c >= 'A' && c <= 'Z')
\t\t\tc = 'A' + (c - 'A' + 1) % 26;
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
	int i;

	i = 0;
	if (ac == 2)
	{
		while (av[1][i]!= '\\0')
		{
			if ((av[1][i] >= 'a' && av[1][i] <= 'y') || (av[1][i] >= 'A' && av[1][i] <= 'Y'))
				av[1][i] = av[1][i] + 1;
			else if (av[1][i] == 'z' || av[1][i] == 'Z')
				av[1][i] = av[1][i] - 25;
			write(1, &av[1][i], 1);
			i++;
		}
	}
	write(1, "\\n",1);
}`,
    },
  ],

  tests: [
    {
      id: 'test_hello',
      descripcion: '"hello" → h+1=i, e+1=f, l+1=m, l+1=m, o+1=p',
      entrada: ['hello'],
      salida: 'ifmmp\n',
      tipo: 'normal',
    },
    {
      id: 'test_wrap_min',
      descripcion: '"xyz" → y+1=z, z→a (wrap)',
      entrada: ['xyz'],
      salida: 'yza\n',
      tipo: 'edge',
    },
    {
      id: 'test_mayus',
      descripcion: '"ABC" → A+1=B, B+1=C, C+1=D',
      entrada: ['ABC'],
      salida: 'BCD\n',
      tipo: 'normal',
    },
    {
      id: 'test_wrap_mayus',
      descripcion: '"XYZ" → Z→A (wrap mayúscula)',
      entrada: ['XYZ'],
      salida: 'YZA\n',
      tipo: 'edge',
    },
    {
      id: 'test_simbolos',
      descripcion: '"hello 42!" → letras rotan, símbolos sin cambio',
      entrada: ['hello 42!'],
      salida: 'ifmmp 42!\n',
      tipo: 'normal',
    },
    {
      id: 'test_sin_args',
      descripcion: 'Sin argumentos → solo \\n',
      entrada: [],
      salida: '\n',
      tipo: 'edge',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Entrada: "xyz"',
      codigo: `argc=2, argv[1]="xyz"
i = 0`,
      variables: [
        { nombre: 'argv[1]', valor: '"xyz"', cambio: true, nota: '' },
        { nombre: 'i', valor: '0', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'c = "x" → x+1=y (ASCII 120→121)',
      codigo: `c = argv[1][0] = 'x' (120)
if (c=='z') → NO
if (c=='Z') → NO
if (c>='a' && c<='y') → 120>='a' && 120<='y' → TRUE
c = c + 1 = 121 = 'y'
write 'y'`,
      variables: [
        { nombre: 'c', valor: "'x'→'y'", cambio: true, nota: 'ASCII 120→121' },
        { nombre: 'stdout', valor: '"y"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'c = "y" → y+1=z (no es z todavía)',
      codigo: `c = 'y' (121)
if (c=='z') → NO (121 ≠ 122)
if (c>='a' && c<='y') → TRUE (121=121=y ✓)
c = c + 1 = 122 = 'z'
write 'z'`,
      variables: [
        { nombre: 'c', valor: "'y'→'z'", cambio: true, nota: '121→122' },
        { nombre: 'stdout', valor: '"yz"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 4,
      titulo: 'c = "z" → z→a (¡caso especial wrap!)',
      codigo: `c = 'z' (122)
if (c == 'z') → TRUE ← caso especial
c = 'a'       ← wrap al inicio del abecedario
write 'a'`,
      variables: [
        { nombre: 'c', valor: "'z'→'a'", cambio: true, nota: '← El wrap. Sin esto daría "{" (ASCII 123)' },
        { nombre: 'stdout', valor: '"yza"', cambio: true, nota: '✓ Resultado correcto' },
      ],
    },
    {
      paso: 5,
      titulo: 'argv[1][3] = \\0 → sale, write \\n',
      codigo: `i=3, argv[1][3]='\\0' → while FALSE → sale
write("\\n", 1)`,
      variables: [
        { nombre: 'stdout', valor: '"yza\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'No manejar z→a: c+1 daría "{" (ASCII 123)',
      descripcion: '"z" tiene ASCII 122. z+1 = 123 = "{". Si no capturas el caso especial z→a, la salida para "xyz" será "yz{" en vez de "yza".',
      codigoMal: `// ❌ Sin caso especial para z
if (c >= 'a' && c <= 'z')
    c = c + 1;  // 'z'+1 = '{', no 'a'`,
      codigoBien: `// ✅ Caso especial primero
if (c == 'z')
    c = 'a';
else if (c >= 'a' && c <= 'y')
    c = c + 1;`,
    },
    {
      severidad: 'mortal',
      titulo: 'No tratar mayúsculas por separado: Z→A, no Z→a',
      descripcion: 'Mayúsculas y minúsculas tienen rangos ASCII distintos (65-90 y 97-122). Z+1=91 es "[". El wrap de Z debe ir a A (65), no a a (97).',
      codigoMal: `// ❌ Mezcla mayúsculas y minúsculas
if (c == 'z' || c == 'Z')
    c = 'a';  // Z→a es incorrecto (debería ser 'A')`,
      codigoBien: `// ✅ Separados
if (c == 'z') c = 'a';
if (c == 'Z') c = 'A';  // mayúscula → mayúscula`,
    },
    {
      severidad: 'warning',
      titulo: 'Imprimir directamente argv[1][i]+1 sin guardar en c',
      descripcion: 'write() necesita una dirección (&c). No puedes hacer write(1, &(argv[1][i]+1), 1) porque argv[1][i]+1 es un valor temporal, no una variable.',
      codigoMal: `// ❌ No compila o UB
write(1, &(argv[1][i] + 1), 1); // valor temporal, no variable`,
      codigoBien: `// ✅ Guarda en variable primero
char c = argv[1][i] + 1;
write(1, &c, 1);`,
    },
  ],

  bajoCelCapot: `ASCII: 'a'=97, 'z'=122, 'A'=65, 'Z'=90.
'z'+1 = 123 = '{' — no es una letra.
Por eso el wrap debe ser explícito: si c=='z' → c='a'.
La versión con módulo: 'a' + (c-'a'+1)%26 evita el caso especial pero es menos legible.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El wrap circular del alfabeto aparece en rot_13, alpha_mirror, y cualquier cifrado de sustitución.',
  relacionados: ['rot_13', 'alpha_mirror'],
}
