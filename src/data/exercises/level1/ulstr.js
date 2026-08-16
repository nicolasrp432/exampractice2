export default {
  id: 'ulstr',
  nombre: 'ulstr',
  nivel: 1,
  dificultad: 'fácil',
  tipoEntrega: 'programa',
  archivosEsperados: ['ulstr.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : ulstr
Expected files   : ulstr.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and swaps the case of every alphabetical
character, then displays the result followed by a newline.

If the number of arguments is not 1, display a newline.

Examples:
$> ./ulstr "Hello World"
hELLO wORLD
$> ./ulstr "L'heure c'est l'heure"
l'HEURE C'EST L'HEURE
$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ulstr
Expected files   : ulstr.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and reverses the case of all its letters.
Other characters remain unchanged.

You must display the result followed by a '\\n'.

If the number of arguments is not 1, the program displays '\\n'.

Examples :

$>./ulstr "L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification." | cat -e
l'EspRIT Ne PEuT PLuS PrOGrESsER S'iL STAgNE ET Si PErSiStENT vaNiTE ET AUTO-JUSTIFICATION.$
$>./ulstr "S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  " | cat -e
s'ENtoUrER De SecREt EsT Un SigNe dE MaNqUe dE COnnAIssANcE.  $
$>./ulstr "3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot" | cat -e
3:21 bA  ToUT  MOuN KI kA DI ke M'EN kA FE FOT$
$>./ulstr | cat -e
$`,

  descripcion: 'Programa que intercambia el case de cada carácter: mayúsculas pasan a minúsculas y minúsculas a mayúsculas. Los no-alfabéticos no cambian.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'batidora',
    personaje: 'Ultrón igualador',
    emoji: '🔄',
    historia: `En la batidora de la cocina vive Ultrón igualador.
Todo lo que entra sale con el case INVERTIDO.
Las mayúsculas se BAJAN y las minúsculas se SUBEN.
Los símbolos, espacios y números: los deja pasar sin tocarlos.
Fórmula: si mayúscula → toLowerCase(); si minúscula → toUpperCase().`,
    anclas: [
      "c >= 'A' && c <= 'Z' → c + 32  ← mayúscula→minúscula",
      "c >= 'a' && c <= 'z' → c - 32  ← minúscula→mayúscula",
      "símbolos/espacios → sin cambio",
      "argc != 2 → solo \\n",
      "+32 y -32 = diferencia ASCII entre mayúscula y minúscula",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe un string y le da la vuelta al case de cada letra.
Las mayúsculas se convierten en minúsculas y las minúsculas en mayúsculas.
Los números, símbolos y espacios los deja exactamente igual.
Al final escribe un salto de línea.`,
    datosPuros: [
      { elemento: "c >= 'A' && c <= 'Z' → c + 32", nota: 'mayúscula → minúscula: suma 32 al valor ASCII' },
      { elemento: "c >= 'a' && c <= 'z' → c - 32", nota: 'minúscula → mayúscula: resta 32 al valor ASCII' },
      { elemento: '+32 y -32', nota: 'diferencia exacta en ASCII entre mayúscula y minúscula equivalente' },
    ],
    asociaciones: [
      { dato: '+32 para bajar (mayús→minús)', imagen: 'Ultrón igualador de la batidora tiene una palanca de +32. Empuja las mayúsculas hacia abajo (suman 32 en ASCII = se hacen minúsculas). Quitar 32 las sube de nuevo.' },
      { dato: "rango 'A'-'Z' / 'a'-'z'", imagen: "Los que viven fuera del barrio de las letras (números, símbolos) tienen pasaporte especial: Ultrón no los toca aunque quiera. Solo los ciudadanos del barrio A-Z y a-z sufren el cambio." },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "Hello",
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
        "codigo": "  if (c >= 'a' && c <= 'z') c -= 32;",
        "porque": "Minúscula → mayúscula restando 32.",
        "concepto": "ascii"
      },
      {
        "codigo": "  else if (c >= 'A' && c <= 'Z') c += 32;",
        "porque": "Mayúscula → minúscula sumando 32.",
        "concepto": "ascii"
      },
      {
        "codigo": "  write(1, &c, 1);",
        "porque": "Imprime la letra invertida de caso.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué 32?",
        "respuesta": "Es la distancia ASCII entre una minúscula y su mayúscula ('a'-'A' = 32)."
      }
    ]
  },

  formulaClave: {
    descripcion: 'La diferencia ASCII entre mayúscula y minúscula es siempre 32',
    formula: "mayúscula: c + 32; minúscula: c - 32;",
    ejemplo: {
      entrada: "'H' (72) y 'e' (101)",
      calculo: 'H: 72 + 32 = 104 = h; e: 101 - 32 = 69 = E',
      resultado: 'h, E',
    },
    tablaASCII: [
      { char: 'A', ascii: 65, calculo: '65+32', resultado: 'a (97)' },
      { char: 'Z', ascii: 90, calculo: '90+32', resultado: 'z (122)' },
      { char: 'a', ascii: 97, calculo: '97-32', resultado: 'A (65)' },
      { char: 'z', ascii: 122, calculo: '122-32', resultado: 'Z (90)' },
    ],
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ulstr.c
file2=../../../../rendu/ulstr/ulstr.c


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

    rm out1 out2 out1.txt out2.txt 2>/dev/null
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
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "l'EspRIT Ne PEuT PLuS PrOGrESsER S'iL STAgNE ET Si PErSiStENT vaNiTE ET AUTO-JUSTIFICATION.\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "s'ENtoUrER De SecREt EsT Un SigNe dE MaNqUe dE COnnAIssANcE.  \n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "3:21 bA  ToUT  MOuN KI kA DI ke M'EN kA FE FOT\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "aKJHz ZlkijZ , 23Y \n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "for pony\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "THIS        ...       IS SPARTA, THEN AGAIN, MAYBE    NOT\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "   \n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "  LOREM,IPSUM  \n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con +32 / -32',
      descripcion: 'Usa la diferencia ASCII 32 entre mayúsculas y minúsculas. La más directa.',
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
\t\tif (c >= 'A' && c <= 'Z')
\t\t\tc = c + 32;
\t\telse if (c >= 'a' && c <= 'z')
\t\t\tc = c - 32;
\t\twrite(1, &c, 1);
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'con_constante',
      nombre: 'Con constante nombrada',
      descripcion: 'Define la diferencia ASCII como constante para mayor claridad.',
      recomendada: false,
      codigo: `#include <unistd.h>

# define CASE_DIFF 32

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
\t\tif (c >= 'A' && c <= 'Z')
\t\t\tc += CASE_DIFF;
\t\telse if (c >= 'a' && c <= 'z')
\t\t\tc -= CASE_DIFF;
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

int main(int ac, char **av)
{
	int i;

	i = 0;
	if (ac == 2)
	{
		while (av[1][i] != '\\0')
		{
			if (av[1][i] >= 'a' && av[1][i] <= 'z')
				av[1][i] = av[1][i] - 32;
			else if (av[1][i] >= 'A' && av[1][i] <= 'Z')
				av[1][i] = av[1][i] + 32;
			write(1, &av[1][i], 1);
			i++;
		}
	}
	write(1, "\\n", 1);
}`,
    },
  ],

  tests: [
    {
      id: 'test_hello',
      descripcion: '"Hello" → "hELLO" (H→h, e→E, l→L, l→L, o→O)',
      entrada: ['Hello'],
      salida: 'hELLO\n',
      tipo: 'normal',
    },
    {
      id: 'test_lower',
      descripcion: '"hello" → "HELLO" (todas minúsculas → todas mayúsculas)',
      entrada: ['hello'],
      salida: 'HELLO\n',
      tipo: 'normal',
    },
    {
      id: 'test_upper',
      descripcion: '"HELLO" → "hello" (todas mayúsculas → todas minúsculas)',
      entrada: ['HELLO'],
      salida: 'hello\n',
      tipo: 'normal',
    },
    {
      id: 'test_con_espacio',
      descripcion: '"Hello World" → "hELLO wORLD"',
      entrada: ['Hello World'],
      salida: 'hELLO wORLD\n',
      tipo: 'normal',
    },
    {
      id: 'test_numeros',
      descripcion: '"42abc" → "42ABC" (dígitos sin cambio)',
      entrada: ['42abc'],
      salida: '42ABC\n',
      tipo: 'normal',
    },
    {
      id: 'test_sin_args',
      descripcion: 'Sin argumentos → solo \\n',
      entrada: [],
      salida: '\n',
      tipo: 'edge',
    },
    {
      id: 'test_vacio',
      descripcion: 'String vacío → solo \\n',
      entrada: [''],
      salida: '\n',
      tipo: 'edge',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Entrada: "Hello"',
      codigo: `argc=2, argv[1]="Hello"
i = 0`,
      variables: [
        { nombre: 'argv[1]', valor: '"Hello"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: '"H" (72) → mayúscula → +32 → "h" (104)',
      codigo: `c = 'H' (72)
c >= 'A' && c <= 'Z' → TRUE
c = 72 + 32 = 104 = 'h'
write 'h'`,
      variables: [
        { nombre: 'c', valor: "'H'(72) → 'h'(104)", cambio: true, nota: '72+32=104' },
        { nombre: 'stdout', valor: '"h"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: '"e" (101) → minúscula → -32 → "E" (69)',
      codigo: `c = 'e' (101)
c >= 'a' && c <= 'z' → TRUE
c = 101 - 32 = 69 = 'E'
write 'E'`,
      variables: [
        { nombre: 'c', valor: "'e'(101) → 'E'(69)", cambio: true, nota: '101-32=69' },
        { nombre: 'stdout', valor: '"hE"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 4,
      titulo: '"l" → "L", "l" → "L", "o" → "O"',
      codigo: `[i=2] 'l'(108) -32 → 'L'(76) → stdout: "hEL"
[i=3] 'l'(108) -32 → 'L'(76) → stdout: "hELL"
[i=4] 'o'(111) -32 → 'O'(79) → stdout: "hELLO"`,
      variables: [
        { nombre: 'stdout', valor: '"hELLO"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 5,
      titulo: '\\0 → sale, write \\n',
      codigo: `argv[1][5] = '\\0' → FALSE → sale
write("\\n", 1)
stdout: "hELLO\\n"`,
      variables: [
        { nombre: 'stdout', valor: '"hELLO\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: '+32 en vez de -32 para minúsculas — van más abajo del rango',
      descripcion: "'a'(97)+32=129, que está fuera del rango ASCII imprimible. Las minúsculas deben RESTAR 32 para ir a mayúsculas.",
      codigoMal: `// ❌ minúscula +32 → carácter no imprimible
if (c >= 'a' && c <= 'z')
    c = c + 32; // 'a'(97)+32=129 ← fuera de ASCII`,
      codigoBien: `// ✅ minúscula -32 → mayúscula
if (c >= 'a' && c <= 'z')
    c = c - 32; // 'a'(97)-32=65='A' ✓`,
    },
    {
      severidad: 'mortal',
      titulo: '-32 para mayúsculas en vez de +32 — dan caracteres de control',
      descripcion: "'A'(65)-32=33='!'. Las mayúsculas deben SUMAR 32 para ir a minúsculas.",
      codigoMal: `// ❌ mayúscula -32 → signo de puntuación
if (c >= 'A' && c <= 'Z')
    c = c - 32; // 'A'(65)-32=33='!' ← MALO`,
      codigoBien: `// ✅ mayúscula +32 → minúscula
if (c >= 'A' && c <= 'Z')
    c = c + 32; // 'A'(65)+32=97='a' ✓`,
    },
    {
      severidad: 'warning',
      titulo: 'Olvidar el else — símbolos procesados por ambas ramas',
      descripcion: 'Si usas if sin else if, un carácter que no sea letra podría entrar por las dos condiciones y cambiar incorrectamente.',
      codigoMal: `// ❌ sin else — doble procesamiento (aunque aquí el rango evita el problema en práctica, es mala forma)
if (c >= 'A' && c <= 'Z') c += 32;
if (c >= 'a' && c <= 'z') c -= 32;  // after +32, 'A' → 'a' might re-enter`,
      codigoBien: `// ✅ con else if — mutuamente exclusivo
if (c >= 'A' && c <= 'Z')
    c += 32;
else if (c >= 'a' && c <= 'z')
    c -= 32;`,
    },
  ],

  bajoCelCapot: `El alfabeto ASCII está organizado de forma que la diferencia entre
una letra mayúscula y su minúscula es siempre 32:
'a'-'A' = 97-65 = 32
'z'-'Z' = 122-90 = 32
El bit 5 (valor 32) es el bit de case: 0=mayúscula, 1=minúscula.
Por eso XOR con 32 también haría el swap: c ^= 32 (si es letra).`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La constante 32 entre mayúscula/minúscula aparece en casi todos los ejercicios que manipulan letras: str_capitalizer, rstr_capitalizer, is_alpha.',
  relacionados: ['str_capitalizer', 'rotone', 'alpha_mirror'],
}
