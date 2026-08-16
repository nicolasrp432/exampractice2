export default {
  id: 'ft_strdup',
  nombre: 'ft_strdup',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_strdup.c'],
  funcionesPermitidas: ['malloc'],

  subject: `Assignment name  : ft_strdup
Expected files   : ft_strdup.c
Allowed functions: malloc
--------------------------------------------------------------------------------

Write a function that duplicates the string pointed to by s. Returns a pointer
to the duplicated string, or NULL if there was insufficient memory.

char\t*ft_strdup(char *s);`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_strdup
Expected files   : ft_strdup.c
Allowed functions: malloc
--------------------------------------------------------------------------------

Reproduce the behavior of the function strdup (man strdup).

Your function must be declared as follows:

char    *ft_strdup(char *src);`,

  descripcion: 'Función que crea una copia del string en memoria dinámica. Usa malloc para reservar strlen(s)+1 bytes, copia con strcpy y devuelve el puntero.',

  palacio: {
    habitacion: 'salon',
    mueble: 'fotocopiadora',
    personaje: 'La Clonadora de strings',
    emoji: '🧬',
    historia: `En el salón hay una Clonadora que fabrica copias en el montón (heap).
Le das el original (s) y ella:
1. Mide la longitud (ft_strlen(s)).
2. Pide memoria al montón: malloc(len + 1). El +1 es para el \\0.
3. Copia byte a byte (ft_strcpy o bucle).
4. Devuelve el puntero a la copia clonada.
¡Sin el +1, no hay sitio para el \\0 y es corrupción de memoria!`,
    anclas: [
      "len = ft_strlen(s)  ← medir primero",
      "malloc(len + 1)  ← +1 para el \\0",
      "if (!dest) return NULL  ← malloc puede fallar",
      "ft_strcpy(dest, s)  ← copiar el contenido",
      "return dest  ← el clon",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función crea una copia exacta de un string en una nueva zona de memoria.
Primero cuenta cuántas letras tiene el string original (con strlen).
Luego pide esa cantidad de memoria + 1 byte extra al sistema operativo (con malloc).
Si el sistema no puede darlo, devuelve NULL.
Luego copia letra a letra el original en la nueva memoria (con strcpy o un bucle).
Devuelve el puntero a la copia nueva.`,
    datosPuros: [
      { elemento: 'malloc(ft_strlen(src) + 1)', nota: '+1 para el carácter \\0 final — sin él hay buffer overflow' },
      { elemento: 'if (!dup) return (NULL)', nota: 'siempre verificar que malloc no devolvió NULL' },
      { elemento: 'char *ft_strdup(const char *src)', nota: 'devuelve char* (nueva memoria), recibe const char*' },
    ],
    asociaciones: [
      { dato: 'malloc + 1 para \\0', imagen: 'La fotocopiadora de ft_strdup pide papel al almacén (malloc). Siempre pide UN folio más de los que necesita para el texto — ese folio extra es para el sello de "FIN" (\\0). Sin ese folio extra, el texto se derrama.' },
      { dato: 'verificar NULL de malloc', imagen: 'Antes de copiar, la fotocopiadora mira si el almacén le mandó papel. Si viene vacío (NULL), apaga la máquina y dice "sin papel" en lugar de intentar copiar en el aire.' },
    ],
  },

  animacion: {
    "tipo": "malloc-array",
    "config": {
      "longitud": 4,
      "tipo": "char",
      "valores": [
        "h",
        "o",
        "l",
        "a"
      ]
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int len = ft_strlen(src);",
        "porque": "Mide cuánto hay que reservar.",
        "concepto": "strings"
      },
      {
        "codigo": "char *dup = malloc(len + 1);",
        "porque": "Reserva len+1: un byte extra para el \\0.",
        "concepto": "malloc"
      },
      {
        "codigo": "if (!dup) return (NULL);",
        "porque": "malloc puede fallar; hay que comprobarlo.",
        "concepto": "malloc"
      },
      {
        "codigo": "while (src[i]) { dup[i] = src[i]; i++; }",
        "porque": "Copia carácter a carácter.",
        "concepto": "strings"
      },
      {
        "codigo": "dup[i] = \\0;",
        "porque": "Cierra la copia con el terminador.",
        "concepto": "strings"
      },
      {
        "codigo": "return (dup);",
        "porque": "Devuelve la nueva cadena reservada.",
        "concepto": "malloc"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué len + 1?",
        "respuesta": "El \\0 ocupa un byte que ft_strlen no cuenta; sin él, la copia no sería un string válido."
      },
      {
        "pregunta": "¿Por qué comprobar if (!dup)?",
        "respuesta": "Si malloc devuelve NULL y escribes en él, el programa peta."
      }
    ]
  },

  formulaClave: {
    descripcion: 'malloc(strlen+1) + strcpy + return puntero',
    formula: 'len = ft_strlen(s); dest = malloc(len + 1); ft_strcpy(dest, s); return dest;',
    ejemplo: {
      entrada: '"hello"',
      calculo: 'len=5, malloc(6), copia h,e,l,l,o,\\0 → new ptr',
      resultado: 'puntero a "hello" en el heap',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_strdup.c
file2=../../../../rendu/ft_strdup/ft_strdup.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "ft_strdup(\"L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification.\") = L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification.\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "ft_strdup(\"S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  \") = S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  \n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "ft_strdup(\"3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot\") = 3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "ft_strdup(\"Papache est un sabre\") = Papache est un sabre\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "ft_strdup(\"zaz\") = zaz\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "ft_strdup(\"zaz\") = zaz\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "ft_strdup(\"jacob\") = jacob\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "ft_strdup(\"ZoZ eT Dovid oiME le METol.\") = ZoZ eT Dovid oiME le METol.\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "ft_strdup(\"wNcOre Un ExEmPle Pas Facilw a Ecrirw \") = wNcOre Un ExEmPle Pas Facilw a Ecrirw \n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "ft_strdup(\"AkjhZ zLKIJz , 23y \") = AkjhZ zLKIJz , 23y \n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "ft_strdup(\"FOR PONY\") = FOR PONY\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "ft_strdup(\"this        ...       is sparta, then again, maybe    not\") = this        ...       is sparta, then again, maybe    not\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "ft_strdup(\"   \") =    \n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "ft_strdup(\"a\") = a\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "ft_strdup(\"  lorem,ipsum  \") =   lorem,ipsum  \n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "ft_strdup(\"\") = \n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "ft_strdup(\"\") = \n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con ft_strlen + ft_strcpy',
      descripcion: 'La más legible y correcta en el examen.',
      recomendada: true,
      codigo: `#include <stdlib.h>

static int\tft_strlen(char *s)
{
\tint\ti;

\ti = 0;
\twhile (s[i])
\t\ti++;
\treturn (i);
}

static void\tft_strcpy(char *dest, char *src)
{
\tint\ti;

\ti = 0;
\twhile (src[i])
\t{
\t\tdest[i] = src[i];
\t\ti++;
\t}
\tdest[i] = '\\0';
}

char\t*ft_strdup(char *s)
{
\tchar\t*dest;
\tint\tlen;

\tlen = ft_strlen(s);
\tdest = malloc(len + 1);
\tif (!dest)
\t\treturn (NULL);
\tft_strcpy(dest, s);
\treturn (dest);
}`,
    },
    {
      id: 'compacta',
      nombre: 'Con bucle de copia inline',
      descripcion: 'Copia directamente en el bucle sin función auxiliar.',
      recomendada: false,
      codigo: `#include <stdlib.h>

char\t*ft_strdup(char *s)
{
\tchar\t*dest;
\tint\tlen;
\tint\ti;

\tlen = 0;
\twhile (s[len])
\t\tlen++;
\tdest = malloc(len + 1);
\tif (!dest)
\t\treturn (NULL);
\ti = 0;
\twhile (s[i])
\t{
\t\tdest[i] = s[i];
\t\ti++;
\t}
\tdest[i] = '\\0';
\treturn (dest);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <stdlib.h>
#include <stdio.h>

char    *ft_strdup(char *src)
{
	int	i;
	char *dest;

	i = 0;
	while (src[i] != '\\0')
		i++;
	dest = malloc(sizeof (char) * (i + 1));
	if (dest == NULL)
		return (NULL);
	i = 0;
	while (src[i] != '\\0')
	{
		dest[i] = src[i];
		i++;
	}
	dest[i] = src[i];
	return (dest);
}`,
    },
  ],

  tests: [
    { id: 'test_hello', descripcion: '"hello" → duplicado "hello"', entrada: ['hello'], salida: 'hello\n', tipo: 'normal' },
    { id: 'test_vacio', descripcion: '"" → duplicado "" (solo \\0)', entrada: [''], salida: '\n', tipo: 'edge' },
    { id: 'test_espacio', descripcion: '"Hello World" → duplicado con espacio', entrada: ['Hello World'], salida: 'Hello World\n', tipo: 'normal' },
    { id: 'test_numeros', descripcion: '"42abc" → duplicado mixto', entrada: ['42abc'], salida: '42abc\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Inicio: s="hello"',
      codigo: `s = "hello"
len = ft_strlen("hello") = 5
dest = malloc(5 + 1) = malloc(6)
if (!dest) → FALSE (malloc exitoso)`,
      variables: [
        { nombre: 'len', valor: '5', cambio: true, nota: '' },
        { nombre: 'dest', valor: '0x7f... (nuevo bloque de 6 bytes)', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'ft_strcpy: copia "hello" + \\0 a dest',
      codigo: `ft_strcpy(dest, s)
dest[0]='h', dest[1]='e', dest[2]='l', dest[3]='l', dest[4]='o', dest[5]='\\0'`,
      variables: [
        { nombre: 'dest', valor: '"hello\\0" en heap', cambio: true, nota: '6 bytes copiados' },
      ],
    },
    {
      paso: 3,
      titulo: 'return dest — puntero al clon',
      codigo: `return dest
// El caller ahora tiene un puntero a una copia independiente de "hello"
// La copia vive en el heap hasta que se llame free(dest)`,
      variables: [
        { nombre: 'retorno', valor: '0x7f... → "hello"', cambio: true, nota: '✓ Clon independiente del original' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'malloc(len) sin +1 → no hay espacio para el \\0',
      descripcion: 'ft_strlen devuelve el número de chars SIN contar el \\0. malloc(len) reserva exactamente los chars, pero no hay espacio para el terminador. El strcpy posterior escribe el \\0 fuera del bloque → heap corruption.',
      codigoMal: `// ❌ Sin +1 → el \\0 se escribe fuera del bloque
dest = malloc(len);      // "hello" len=5, malloc(5)
ft_strcpy(dest, s);      // escribe h,e,l,l,o,\\0 → \\0 en byte 5, fuera del bloque`,
      codigoBien: `// ✅ malloc(len + 1) → espacio para el \\0
dest = malloc(len + 1);  // malloc(6) para "hello"
ft_strcpy(dest, s);      // h,e,l,l,o,\\0 → todo dentro del bloque`,
    },
    {
      severidad: 'mortal',
      titulo: 'No comprobar si malloc devuelve NULL',
      descripcion: 'malloc puede fallar (sistema sin memoria). Si dest=NULL y haces ft_strcpy(NULL, s), segfault inmediato.',
      codigoMal: `// ❌ Sin check de NULL
dest = malloc(len + 1);
ft_strcpy(dest, s);  // crash si malloc falló`,
      codigoBien: `// ✅
dest = malloc(len + 1);
if (!dest)
    return (NULL);
ft_strcpy(dest, s);`,
    },
    {
      severidad: 'warning',
      titulo: 'El caller es responsable de free() — ft_strdup hace malloc',
      descripcion: 'La función devuelve un bloque malloc\'d. Si el caller no hace free(), hay memory leak. Esto no afecta a la Moulinette, pero es buena práctica mencionarlo.',
      codigoMal: `// ❌ Memory leak
char *dup = ft_strdup("hello");
// ... usar dup ...
// sin free(dup) → leak`,
      codigoBien: `// ✅
char *dup = ft_strdup("hello");
// ... usar dup ...
free(dup);  // ← siempre liberar`,
    },
  ],

  bajoCelCapot: `malloc(n) reserva n bytes en el heap y devuelve un puntero al inicio.
El \\0 no ocupa espacio en strlen pero sí en la memoria real del string.
"hello" ocupa 6 bytes: h(1)+e(1)+l(1)+l(1)+o(1)+\\0(1).
La copia es INDEPENDIENTE: modificar dest no afecta a s ni viceversa.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El patrón malloc+strlen+1+strcpy+return es el prototipo de todas las funciones que retornan strings dinámicos.',
  relacionados: ['ft_strlen', 'ft_strcpy', 'ft_split'],
}
