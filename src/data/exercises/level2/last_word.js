export default {
  id: 'last_word',
  nombre: 'last_word',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['last_word.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : last_word
Expected files   : last_word.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays its last word followed by
a newline.

A word is a sequence of non-space characters.

If the number of arguments is not 1, or there are no words, just display a
newline.

Example:
$> ./last_word "FOR THE KNIFE" | cat -e
KNIFE$
$> ./last_word "   hello   " | cat -e
hello$
$> ./last_word | cat -e
$
$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : last_word
Expected files   : last_word.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a string and displays its last word followed by a \\n.

A word is a section of string delimited by spaces/tabs or by the start/end of
the string.

If the number of parameters is not 1, or there are no words, display a newline.

Example:

$> ./last_word "FOR PONY" | cat -e
PONY$
$> ./last_word "this        ...       is sparta, then again, maybe    not" | cat -e
not$
$> ./last_word "   " | cat -e
$
$> ./last_word "a" "b" | cat -e
$
$> ./last_word "  lorem,ipsum  " | cat -e
lorem,ipsum$
$>`,

  descripcion: 'Programa que imprime la última palabra de un string. Algoritmo: retroceder desde el final saltando espacios, luego encontrar el inicio de la última palabra y escribirla.',

  palacio: {
    habitacion: 'salon',
    mueble: 'sofa',
    personaje: 'El Detective de la Última Palabra',
    emoji: '🕵️',
    historia: `En el salón hay un Sofá donde el Detective siempre se sienta al final.
Le das una frase y el Detective empieza leyendo desde el FINAL:
PASO 1: Retrocede hasta que no sea espacio (salta espacios finales).
PASO 2: Marca donde termina la palabra (end).
PASO 3: Retrocede hasta que sea espacio o llegue al inicio (start).
PASO 4: Escribe str[start..end].
Si no hay palabras (todo espacios o string vacío), imprime solo '\\n'.`,
    anclas: [
      "end = len-1; while end>=0 && str[end]==' ': end--",
      "if end<0: sin palabra → solo '\\n'",
      "start = end; while start>0 && str[start-1]!=' ': start--",
      "write str[start..end] char a char",
      "separador: solo espacio (no tab, no newline)",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `El programa recibe un string e imprime la última palabra.
Primero busca el final del string.
Luego retrocede saltando los espacios del final.
Luego sigue retrocediendo hasta encontrar otro espacio (o el inicio): eso marca el inicio de la última palabra.
Luego imprime desde ese inicio hasta donde encontró el espacio final.`,
    datosPuros: [
      { elemento: 'tres fases: ir al final, saltar espacios finales, retroceder hasta espacio', nota: 'el orden de las fases es crítico' },
      { elemento: "while (i > 0 && str[i] == ' ')", nota: 'retroceder saltando espacios finales' },
      { elemento: "while (i > 0 && str[i - 1] != ' ')", nota: 'retroceder hasta encontrar el inicio de la última palabra' },
    ],
    asociaciones: [
      { dato: '3 fases hacia atrás', imagen: 'El Detective Moonwalk busca la última palabra andando hacia atrás en 3 pasos: 1) Va al final del string. 2) Salta las baldosas blancas (espacios finales). 3) Camina hasta la primera baldosa blanca (inicio de la última palabra). ¡Luego imprime lo que tiene entre las manos!' },
    ],
  },

  animacion: {
    "tipo": "word-split",
    "config": {
      "cadena": "  hola mundo foo ",
      "modo": "ultimo"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int i = ft_strlen(argv[1]) - 1;",
        "porque": "Empezamos por el final de la cadena.",
        "concepto": "strings"
      },
      {
        "codigo": "while (i >= 0 && argv[1][i] == ' ')",
        "porque": "Salta los espacios finales.",
        "concepto": "bandera"
      },
      {
        "codigo": "  i--;",
        "porque": "Retrocede hasta la última letra real.",
        "concepto": "bucles"
      },
      {
        "codigo": "marca el final, retrocede hasta un espacio",
        "porque": "Ese espacio marca el inicio de la última palabra.",
        "concepto": "bandera"
      },
      {
        "codigo": "imprime desde ahí hasta el final marcado",
        "porque": "Escribe solo la última palabra.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué recorrer desde el final?",
        "respuesta": "La última palabra está al final; buscarla hacia atrás es más directo que recorrer todo."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Desde el final: saltar espacios, luego buscar el inicio de la última palabra',
    formula: 'end=len-1; while(str[end]==" ")end--; start=end; while(start>0&&str[start-1]!=" ")start--; write(str+start, end-start+1)',
    ejemplo: {
      entrada: '"   hello   "',
      calculo: 'end=8→saltar 3 spaces→end=4("o"); start=4→retroceder hasta espacio→start=0; write "hello"',
      resultado: '"hello"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=last_word.c
file2=../../../../rendu/last_word/last_word.c


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
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "auto-justification.\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "coNNaiSSanCe.\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "fot\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "23y\n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "PONY\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "not\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "lorem,ipsum\n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con dos índices end y start',
      descripcion: 'La más explícita. Primero end (salta espacios finales), luego start (encuentra inicio de palabra).',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\tend;
\tint\tstart;

\tif (argc == 2)
\t{
\t\tend = 0;
\t\twhile (argv[1][end])
\t\t\tend++;
\t\tend--;
\t\twhile (end >= 0 && argv[1][end] == ' ')
\t\t\tend--;
\t\tif (end >= 0)
\t\t{
\t\t\tstart = end;
\t\t\twhile (start > 0 && argv[1][start - 1] != ' ')
\t\t\t\tstart--;
\t\t\twhile (start <= end)
\t\t\t{
\t\t\t\twrite(1, &argv[1][start], 1);
\t\t\t\tstart++;
\t\t\t}
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'punteros',
      nombre: 'Con punteros directos',
      descripcion: 'Usa punteros para retroceder. Más compacto.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tchar\t*end;
\tchar\t*start;

\tif (argc == 2)
\t{
\t\tend = argv[1];
\t\twhile (*end)
\t\t\tend++;
\t\tend--;
\t\twhile (end >= argv[1] && *end == ' ')
\t\t\tend--;
\t\tif (end >= argv[1])
\t\t{
\t\t\tstart = end;
\t\t\twhile (start > argv[1] && *(start - 1) != ' ')
\t\t\t\tstart--;
\t\t\twhile (start <= end)
\t\t\t\twrite(1, start++, 1);
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
      codigo: `#include <unistd.h>

void	last_word(char *str)
{
	int	j = 0;
	int i = 0;

	while (str[i])
	{
		if (str[i] == ' ' && str[i + 1] >= 33 && str[i + 1] <= 126)
			j = i + 1;
		i++;
	}
	while (str[j] >= 33 && str[j] <= 126)
	{
		write(1, &str[j], 1);
		j++;
	}
}

int		main(int argc, char **argv)
{
	if (argc == 2)
		last_word(argv[1]);
	write(1, "\\n", 1);
	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_clasico', descripcion: '"FOR THE KNIFE" → "KNIFE"', entrada: ['FOR THE KNIFE'], salida: 'KNIFE\n', tipo: 'normal' },
    { id: 'test_trailing_spaces', descripcion: '"hello   " → "hello" (espacios finales)', entrada: ['hello   '], salida: 'hello\n', tipo: 'normal' },
    { id: 'test_leading_spaces', descripcion: '"   hello" → "hello"', entrada: ['   hello'], salida: 'hello\n', tipo: 'normal' },
    { id: 'test_una_palabra', descripcion: '"hello" → "hello"', entrada: ['hello'], salida: 'hello\n', tipo: 'normal' },
    { id: 'test_solo_espacios', descripcion: '"   " → "" (solo espacios → sin palabra)', entrada: ['   '], salida: '\n', tipo: 'edge' },
    { id: 'test_vacio', descripcion: '"" → "" (string vacío)', entrada: [''], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 's="   hello   ": calcular len y retroceder desde el final',
      codigo: `s = "   hello   "
len = 11
end = 10  (índice del último char)
s[10]=' ', s[9]=' ', s[8]=' ' → espacios finales
end-- × 3 → end = 7  (s[7]='o')`,
      variables: [
        { nombre: 'end inicial', valor: '10', cambio: false, nota: '' },
        { nombre: 'end tras saltar', valor: '7 ("o")', cambio: true, nota: '← fin real de "hello"' },
      ],
    },
    {
      paso: 2,
      titulo: 'end=7: buscar inicio de la palabra',
      codigo: `start = 7
start>0 && s[start-1]!=' ':
  s[6]='l' ≠ ' ' → start-- → 6
  s[5]='l' ≠ ' ' → start-- → 5
  s[4]='e' ≠ ' ' → start-- → 4
  s[3]='h' ≠ ' ' → start-- → 3
  s[2]=' ' == ' ' → PARA
start = 3`,
      variables: [
        { nombre: 'start', valor: '3 ("h" de "hello")', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'Escribir str[3..7] = "hello"',
      codigo: `write s[3]='h', s[4]='e', s[5]='l', s[6]='l', s[7]='o'
→ "hello"`,
      variables: [
        { nombre: 'salida', valor: '"hello"', cambio: true, nota: '✓' },
      ],
    },
    {
      paso: 4,
      titulo: 'write("\\n")',
      codigo: `write(1, "\\n", 1)
// Salida final: "hello\\n"`,
      variables: [
        { nombre: 'salida final', valor: '"hello\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'No saltar espacios finales → last "word" incluye espacios',
      descripcion: 'Si el string termina en espacios y no los saltamos, end apunta a un espacio, no al final de la última palabra.',
      codigoMal: `// ❌ No salta espacios finales
end = len - 1;
// "hello   ": end=7 (' ') → busca desde espacio → incorrecto`,
      codigoBien: `// ✅ Saltar espacios del final primero
end = len - 1;
while (end >= 0 && str[end] == ' ')
    end--;
// "hello   ": end=4 ('o') → correcto`,
    },
    {
      severidad: 'mortal',
      titulo: 'Condición start > 0 en vez de start >= 0',
      descripcion: 'Si la última palabra está al inicio del string (sin espacios delante), start debe llegar a 0. Si la condición es start > 0, se para en 1 y pierde el primer char.',
      codigoMal: `// ❌ Se para en start=1, pierde str[0]
while (start > 0 && str[start] != ' ')
    start--;
// "hello": start nunca llega a 0`,
      codigoBien: `// ✅ Comprobar str[start-1] para poder llegar a start=0
while (start > 0 && str[start - 1] != ' ')
    start--;`,
    },
    {
      severidad: 'warning',
      titulo: 'Solo espacio como separador, NO tab ni newline',
      descripcion: 'El subject dice "non-space characters" — espacio ASCII 32. El separador es SOLO el espacio, no el tab. Diferente de first_word que incluye tabs.',
      codigoMal: `// ❌ Tratar tab como separador (no es correcto para last_word)
while (end >= 0 && (str[end] == ' ' || str[end] == '\\t'))
    end--;`,
      codigoBien: `// ✅ Solo espacio
while (end >= 0 && str[end] == ' ')
    end--;`,
    },
  ],

  bajoCelCapot: `El algoritmo es: ir al final, retroceder spaces, marcar end, retroceder no-spaces para encontrar start.
La longitud de la última palabra es end - start + 1.
Casos especiales: string vacío (end empieza en -1), todo espacios (end<0 tras el primer while).
last_word vs first_word: first_word avanza desde el inicio; last_word retrocede desde el final.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El patrón "ir al final, saltar separadores, encontrar inicio" es reutilizable en cualquier parser de tokens desde la derecha.',
  relacionados: ['first_word', 'ft_strcspn', 'ft_strrev'],
}
