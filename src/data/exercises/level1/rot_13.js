export default {
  id: 'rot_13',
  nombre: 'rot_13',
  nivel: 1,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['rot_13.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : rot_13
Expected files   : rot_13.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays it, replacing each of its
letters by the letter 13 spaces ahead in alphabetical order.

'Z' becomes 'M', 'z' becomes 'm' and 'M' becomes 'Z', 'm' becomes 'z'.

Non-alphabetical characters are not modified.

If the number of arguments is not 1, display only a newline.

Examples:
$> ./rot_13 "Hello World !"
Uryyb Jbeyq !
$> ./rot_13 ""

$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : rot_13
Expected files   : rot_13.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays it, replacing each of its
letters by the letter 13 spaces ahead in alphabetical order.

'z' becomes 'm' and 'Z' becomes 'M'. Case remains unaffected.

The output will be followed by a newline.

If the number of arguments is not 1, the program displays a newline.

Example:

$>./rot_13 "abc"
nop
$>./rot_13 "My horse is Amazing." | cat -e
Zl ubefr vf Nznmvat.$
$>./rot_13 "AkjhZ zLKIJz , 23y " | cat -e
NxwuM mYXVWm , 23l $
$>./rot_13 | cat -e
$
$>
$>./rot_13 "" | cat -e
$
$>`,

  descripcion: 'Cifrado ROT13: desplaza cada letra 13 posiciones en el alfabeto. Como el alfabeto tiene 26 letras, aplicar ROT13 dos veces devuelve el original.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'cajón',
    personaje: 'Habitación 13 Rótulo Roto',
    emoji: '🔐',
    historia: `En el cajón hay el Rótulo Roto de la Habitación 13.
Cada letra cambia por la que está 13 posiciones más adelante.
Como hay 26 letras, la mitad del abecedario (a-m) va a (n-z) y viceversa.
El truco del módulo 26: (posición + 13) % 26 siempre queda dentro de 0-25.
Aplicar ROT13 dos veces descifra: es su propio inverso.`,
    anclas: [
      "(c - 'a' + 13) % 26 + 'a'  ← minúscula",
      "(c - 'A' + 13) % 26 + 'A'  ← mayúscula",
      "% 26 asegura el wrap circular",
      "n-z → a-m (simétrico)",
      "argc != 2 → solo \\n",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe un string y desplaza cada letra 13 posiciones en el abecedario.
La 'a' se convierte en 'n', la 'b' en 'o', y así hasta la 'z' que se convierte en 'm'.
Las 26 letras se dividen en dos mitades: la primera mitad avanza 13, la segunda también avanza 13 (y da la vuelta al inicio).
ROT13 es su propio inverso: aplicarlo dos veces devuelve el original.
Los símbolos y números no cambian.`,
    datosPuros: [
      { elemento: "(c - 'a') % 26 + 'a'  con c + 13", nota: 'fórmula con módulo para wrap automático' },
      { elemento: "if (c >= 'a' && c <= 'm') → c + 13", nota: 'primera mitad: simplemente suma 13' },
      { elemento: "if (c >= 'n' && c <= 'z') → c - 13", nota: 'segunda mitad: resta 13 (equivale a wrap)' },
    ],
    asociaciones: [
      { dato: 'ROT13 — 2 mitades', imagen: 'El abecedario es una pizza de 26 trozos. ROT13 parte la pizza por la mitad y da la vuelta a cada mitad. Los de la primera mitad (a-m) saltan a la segunda, y viceversa.' },
      { dato: "c + 13 o c - 13 (no módulo)", imagen: 'El truco del panadero: si estás en la primera mitad (a-m), sumas 13 hacia adelante. Si estás en la segunda (n-z), restas 13 hacia atrás. Nunca te pasas del abecedario.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "hello",
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
        "codigo": "  if minúscula: c = (c - 'a' + 13) % 26 + 'a';",
        "porque": "Desplaza 13 dentro del rango a-z usando módulo 26.",
        "concepto": "ascii"
      },
      {
        "codigo": "  if mayúscula: c = (c - 'A' + 13) % 26 + 'A';",
        "porque": "Mismo cálculo con la base 'A'.",
        "concepto": "ascii"
      },
      {
        "codigo": "  write(1, &c, 1);",
        "porque": "Imprime la letra rotada.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué (c - 'a' + 13) % 26?",
        "respuesta": "Pasas la letra a 0-25, sumas 13 y el módulo la envuelve dentro del alfabeto."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Desplazamiento modular de 13 en el alfabeto',
    formula: "c = 'a' + (c - 'a' + 13) % 26",
    ejemplo: {
      entrada: "'H' (ASCII 72)",
      calculo: "'A'+(72-65+13)%26 = 65+20 = 85 = 'U'",
      resultado: "'U'",
    },
    tablaASCII: [
      { char: 'A', ascii: 65, calculo: '(65-65+13)%26=13', resultado: 'N' },
      { char: 'H', ascii: 72, calculo: '(72-65+13)%26=20', resultado: 'U' },
      { char: 'N', ascii: 78, calculo: '(78-65+13)%26=0', resultado: 'A' },
      { char: 'Z', ascii: 90, calculo: '(90-65+13)%26=12', resultado: 'M' },
      { char: 'a', ascii: 97, calculo: '(97-97+13)%26=13', resultado: 'n' },
      { char: 'n', ascii: 110, calculo: '(110-97+13)%26=0', resultado: 'a' },
    ],
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=rot_13.c
file2=../../../../rendu/rot_13/rot_13.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 "abc" > out1.txt 2>/dev/null
    ./out2 "abc" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 3. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "AkjhZ zLKIJz , 23y " > out1.txt 2>/dev/null
    ./out2 "AkjhZ zLKIJz , 23y " > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
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
        echo "Expected Output: \\"$out1\\""
        echo "Your Output: \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi


    rm out1 out2 out1.txt out2.txt 2>/dev/null
    echo "$(tput setaf 2)$(tput bold)PASSED 🎉$(tput sgr 0)"
    exit 1`,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: ["abc"], salida: "nop\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["My horse is Amazing."], salida: "Zl ubefr vf Nznmvat.\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["AkjhZ zLKIJz , 23y "], salida: "NxwuM mYXVWm , 23l \n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "NxwuM mYXVWm , 23l \n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "SBE CBAL\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "guvf        ...       vf fcnegn, gura ntnva, znlor    abg\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "   \n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "  yberz,vcfhz  \n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con fórmula modular',
      descripcion: 'La fórmula con % 26 maneja el wrap automáticamente. La más limpia en el examen.',
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
\t\t\tc = 'a' + (c - 'a' + 13) % 26;
\t\telse if (c >= 'A' && c <= 'Z')
\t\t\tc = 'A' + (c - 'A' + 13) % 26;
\t\twrite(1, &c, 1);
\t\ti++;
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'tabla',
      nombre: 'Con tabla de lookup (sin módulo)',
      descripcion: 'Verifica si la letra está en la primera o segunda mitad del alfabeto. Menos elegante pero más explícita.',
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
\t\tif (c >= 'a' && c <= 'm')
\t\t\tc = c + 13;
\t\telse if (c >= 'n' && c <= 'z')
\t\t\tc = c - 13;
\t\telse if (c >= 'A' && c <= 'M')
\t\t\tc = c + 13;
\t\telse if (c >= 'N' && c <= 'Z')
\t\t\tc = c - 13;
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
	int	i;

	i = 0;
	if (ac == 2)
	{
		while(av[1][i] != '\\0')
		{
			if ((av[1][i] >= 'a' && av[1][i]<= 'm') || (av[1][i] >= 'A' && av[1][i]<= 'M'))
				av[1][i] = av[1][i] + 13;
			else if ((av[1][i] >= 'n' && av[1][i]<= 'z') || (av[1][i] >= 'N' && av[1][i]<= 'Z'))
				av[1][i] = av[1][i] - 13;
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
      descripcion: '"Hello" → "Uryyb" (H→U e→r l→y l→y o→b)',
      entrada: ['Hello'],
      salida: 'Uryyb\n',
      tipo: 'normal',
    },
    {
      id: 'test_abc',
      descripcion: '"ABC" → "NOP"',
      entrada: ['ABC'],
      salida: 'NOP\n',
      tipo: 'normal',
    },
    {
      id: 'test_xyz',
      descripcion: '"xyz" → "klm" (x+13=k, y+13=l, z+13=m)',
      entrada: ['xyz'],
      salida: 'klm\n',
      tipo: 'edge',
    },
    {
      id: 'test_frase',
      descripcion: '"Hello World!" → símbolos sin cambio',
      entrada: ['Hello World!'],
      salida: 'Uryyb Jbeyq!\n',
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
      id: 'test_idempotente',
      descripcion: '"Uryyb" aplicando rot13 de nuevo → "Hello" (propiedad inversa)',
      entrada: ['Uryyb'],
      salida: 'Hello\n',
      tipo: 'normal',
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
      titulo: '"H" (72) → "U" (85): (72-65+13)%26+65',
      codigo: `c = 'H' (72)
c >= 'A' && c <= 'Z' → TRUE
c = 'A' + (72 - 65 + 13) % 26
  = 65  + (20) % 26
  = 65  + 20
  = 85 = 'U'
write 'U'`,
      variables: [
        { nombre: 'c', valor: "'H'(72) → 'U'(85)", cambio: true, nota: '(72-65+13)%26=20 → 65+20=85' },
        { nombre: 'stdout', valor: '"U"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: '"e" (101) → "r" (114): (101-97+13)%26+97',
      codigo: `c = 'e' (101)
c >= 'a' && c <= 'z' → TRUE
c = 'a' + (101 - 97 + 13) % 26
  = 97  + (17) % 26
  = 97  + 17
  = 114 = 'r'`,
      variables: [
        { nombre: 'c', valor: "'e'(101) → 'r'(114)", cambio: true, nota: '(4+13)%26=17 → 97+17=114' },
      ],
    },
    {
      paso: 4,
      titulo: '"l" (108) → "y" (121): (108-97+13)%26+97',
      codigo: `c = 'l' (108)
c = 97 + (108 - 97 + 13) % 26
  = 97 + (24) % 26
  = 97 + 24
  = 121 = 'y'`,
      variables: [
        { nombre: 'c', valor: "'l'(108) → 'y'(121)", cambio: true, nota: '(11+13)%26=24 → 97+24=121' },
      ],
    },
    {
      paso: 5,
      titulo: '"o" (111) → "b" (98): wrap por módulo',
      codigo: `c = 'o' (111)
c = 97 + (111 - 97 + 13) % 26
  = 97 + (27) % 26
  = 97 + 1
  = 98 = 'b'   ← el % 26 hace el wrap`,
      variables: [
        { nombre: 'c', valor: "'o'(111) → 'b'(98)", cambio: true, nota: '(14+13)%26=1 → 97+1=98 ← wrap!' },
      ],
    },
    {
      paso: 6,
      titulo: 'stdout: "Uryyb\\n"',
      codigo: `H→U, e→r, l→y, l→y, o→b → "Uryyb"
write("\\n", 1)
stdout: "Uryyb\\n"`,
      variables: [
        { nombre: 'stdout', valor: '"Uryyb\\n"', cambio: true, nota: '✓ ROT13 aplicado' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'c + 13 sin módulo → desborda el rango de letras',
      descripcion: '"n" (110) + 13 = 123 = "{". Sin módulo, las letras de la segunda mitad del alfabeto (n-z) salen fuera del rango.',
      codigoMal: `// ❌ Sin módulo — 'n'+13='{', no 'a'
if (c >= 'a' && c <= 'z')
    c = c + 13;  // 'n'(110)+13=123='{' ← MALO`,
      codigoBien: `// ✅ Con módulo — wrap automático
if (c >= 'a' && c <= 'z')
    c = 'a' + (c - 'a' + 13) % 26;  // 'n' → 'a' ✓`,
    },
    {
      severidad: 'mortal',
      titulo: 'Usar la misma fórmula para mayúsculas y minúsculas',
      descripcion: 'La fórmula usa el offset desde "a" o "A". Mezclarlos da resultados incorrectos.',
      codigoMal: `// ❌ Usa 'a' para mayúsculas
if (c >= 'A' && c <= 'Z')
    c = 'a' + (c - 'a' + 13) % 26;  // 'A'(65)-'a'(97) = -32 ← negativo`,
      codigoBien: `// ✅ Usa 'A' para mayúsculas
if (c >= 'A' && c <= 'Z')
    c = 'A' + (c - 'A' + 13) % 26;`,
    },
    {
      severidad: 'warning',
      titulo: 'La versión tabla (+13/-13) requiere dos rangos por mayúsculas/minúsculas',
      descripcion: 'Si usas la versión sin módulo (a-m: +13, n-z: -13), necesitas exactamente los cuatro rangos: a-m, n-z, A-M, N-Z. Olvidar uno rompe ese grupo de letras.',
      codigoMal: `// ❌ Solo minúsculas, olvida mayúsculas
if (c >= 'a' && c <= 'm') c += 13;
else if (c >= 'n' && c <= 'z') c -= 13;
// mayúsculas no cambian → incorrecto`,
      codigoBien: `// ✅ Los cuatro rangos
if (c >= 'a' && c <= 'm') c += 13;
else if (c >= 'n' && c <= 'z') c -= 13;
else if (c >= 'A' && c <= 'M') c += 13;
else if (c >= 'N' && c <= 'Z') c -= 13;`,
    },
  ],

  bajoCelCapot: `ROT13 es un caso especial de cifrado César donde el desplazamiento es 13.
26 letras ÷ 2 = 13: por eso ROT13 es simétrico (su propio inverso).
El operador % 26 modela el abecedario como un anillo (círculo de 26 elementos).
N→A: (N-A+13)%26 = (13+13)%26 = 26%26 = 0 → A+0 = A ✓`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La fórmula modular del ROT13 es el paradigma de todos los cifrados de sustitución. También aparece en alpha_mirror (26-pos-1).',
  relacionados: ['rotone', 'alpha_mirror'],
}
