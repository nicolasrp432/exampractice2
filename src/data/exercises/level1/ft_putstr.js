export default {
  id: 'ft_putstr',
  nombre: 'ft_putstr',
  nivel: 1,
  dificultad: 'fácil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_putstr.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : ft_putstr
Expected files   : ft_putstr.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a function that displays a string on the standard output.

void\tft_putstr(char *str);`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_putstr
Expected files   : ft_putstr.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a function that displays a string on the standard output.

The pointer passed to the function contains the address of the string's first
character.

Your function must be declared as follows:

void	ft_putstr(char *str);`,

  descripcion: 'Función que escribe un string en la salida estándar usando write(). NO añade \\n al final — escribe exactamente los bytes del string.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'ventana',
    personaje: 'La Tele que grita letras',
    emoji: '📺',
    historia: `En la ventana hay una Tele mágica que grita letras.
Le das un string y ella grita CADA LETRA una a una usando write().
Para al llegar al Fantasma Cero (\\0) — no lo grita.
NUNCA añade un newline al final: lo que le das, lo grita SIN AÑADIR NADA.
Fórmula: while(str[i]) { write(1, &str[i], 1); i++; }`,
    anclas: [
      "write(1, &str[i], 1)  ← un byte a la vez",
      "while (str[i])  ← para en el \\0",
      "SIN \\n al final — ft_putstr NO añade newline",
      "i = 0; antes del while",
      "tamaño 1 en write ← solo UN carácter",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función recibe un string.
Mientras haya letras (no sea el Cero Fantasma), escribe UN solo carácter en la pantalla.
Luego avanza al siguiente.
Para cuando llega al final (\\0).
No añade nada más — ni salto de línea, ni espacio.`,
    datosPuros: [
      { elemento: 'write(1, &str[i], 1)', nota: 'fd=1 (stdout), dirección del carácter, tamaño 1 byte' },
      { elemento: 'void ft_putstr(char *str)', nota: 'devuelve void — no hay return con valor' },
      { elemento: 'SIN \\n al final', nota: 'ft_putstr no añade newline — eso lo decide quien la llama' },
    ],
    asociaciones: [
      { dato: 'write(1, &str[i], 1)', imagen: 'La Tele de la ventana tiene una boca gigante. Le das un solo carácter (con un puntero &) y ella lo GRITA (write) al mundo (fd=1). Solo uno por vez.' },
      { dato: 'SIN \\n al final', imagen: 'La Tele tiene la boca cosida para no añadir nada extra al final. Si quieres el salto de línea tienes que pedírselo tú por separado.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "42",
      "modo": "copiar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "void ft_putstr(char *str)",
        "porque": "No devuelve nada (void): solo imprime.",
        "concepto": "punteros"
      },
      {
        "codigo": "  int i = 0;",
        "porque": "Índice para recorrer la cadena.",
        "concepto": "variables"
      },
      {
        "codigo": "  while (str[i])",
        "porque": "Avanza hasta el \\0.",
        "concepto": "strings"
      },
      {
        "codigo": "    write(1, &str[i], 1);",
        "porque": "Escribe 1 byte en la salida (fd 1). &str[i] es la dirección de ese carácter.",
        "concepto": "strings"
      },
      {
        "codigo": "    i++;",
        "porque": "Siguiente carácter.",
        "concepto": "bucles"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué &str[i] y no str[i]?",
        "respuesta": "write necesita una dirección de memoria, no el valor del carácter."
      },
      {
        "pregunta": "¿Por qué el tercer argumento es 1?",
        "respuesta": "Escribimos exactamente un byte por vuelta."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Escribe cada byte del string con write()',
    formula: 'write(1, &str[i], 1)',
    ejemplo: {
      entrada: '"hello"',
      calculo: 'write h, write e, write l, write l, write o → para en \\0',
      resultado: 'stdout: hello  (sin newline)',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash

file1=ft_putstr.c
file2=../../../../rendu/ft_putstr/ft_putstr.c


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
    exit 1`,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification.ft_putstr(\"L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification.\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  ft_putstr(\"S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  \")\n\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fotft_putstr(\"3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "Papache est un sabreft_putstr(\"Papache est un sabre\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "zazft_putstr(\"zaz\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "zazft_putstr(\"zaz\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "jacobft_putstr(\"jacob\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "ZoZ eT Dovid oiME le METol.ft_putstr(\"ZoZ eT Dovid oiME le METol.\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "wNcOre Un ExEmPle Pas Facilw a Ecrirw ft_putstr(\"wNcOre Un ExEmPle Pas Facilw a Ecrirw \")\n\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "AkjhZ zLKIJz , 23y ft_putstr(\"AkjhZ zLKIJz , 23y \")\n\n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "FOR PONYft_putstr(\"FOR PONY\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "this        ...       is sparta, then again, maybe    notft_putstr(\"this        ...       is sparta, then again, maybe    not\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "   ft_putstr(\"   \")\n\n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "aft_putstr(\"a\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "  lorem,ipsum  ft_putstr(\"  lorem,ipsum  \")\n\n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "ft_putstr(\"\")\n\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "ft_putstr(\"\")\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con índice',
      descripcion: 'La más legible en el examen.',
      recomendada: true,
      codigo: `#include <unistd.h>

void\tft_putstr(char *str)
{
\tint\ti;

\ti = 0;
\twhile (str[i])
\t{
\t\twrite(1, &str[i], 1);
\t\ti++;
\t}
}`,
    },
    {
      id: 'puntero',
      nombre: 'Con puntero',
      descripcion: 'Avanza el puntero directamente. Equivalente pero menos explícita.',
      recomendada: false,
      codigo: `#include <unistd.h>

void\tft_putstr(char *str)
{
\twhile (*str)
\t\twrite(1, str++, 1);
}`,
    },
    {
      id: 'write_total',
      nombre: 'Write de todo de una vez',
      descripcion: 'Más eficiente pero requiere ft_strlen. No válida sin strlen disponible.',
      recomendada: false,
      codigo: `#include <unistd.h>

static int\tft_strlen(char *str)
{
\tint\ti;

\ti = 0;
\twhile (str[i])
\t\ti++;
\treturn (i);
}

void\tft_putstr(char *str)
{
\twrite(1, str, ft_strlen(str));
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <unistd.h>

void    ft_putstr(char *str)
{
	int	i;

	i = 0;
	while (str[i] != '\\0')
	{
		write(1, &str[i], 1);
		i++;
	}
}`,
    },
  ],

  tests: [
    {
      id: 'test_con_newline',
      descripcion: 'String que ya incluye \\n — ft_putstr lo escribe tal cual',
      entrada: ['hello\n'],
      salida: 'hello\n',
      tipo: 'normal',
    },
    {
      id: 'test_mundo',
      descripcion: '"mundo\\n" → lo escribe exacto',
      entrada: ['mundo\n'],
      salida: 'mundo\n',
      tipo: 'normal',
    },
    {
      id: 'test_42',
      descripcion: '"42\\n" → escribe 42 y newline',
      entrada: ['42\n'],
      salida: '42\n',
      tipo: 'normal',
    },
    {
      id: 'test_vacio',
      descripcion: 'String vacío → no escribe nada',
      entrada: [''],
      salida: '',
      tipo: 'edge',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Inicio: str = "hello\\n"',
      codigo: `(gdb) break ft_putstr
(gdb) run
Breakpoint 1, ft_putstr (str=0x... "hello\\n") at ft_putstr.c:3
3\t\tint i;`,
      variables: [
        { nombre: 'str', valor: '"hello\\n"', cambio: true, nota: 'Puntero al string' },
        { nombre: 'i', valor: '?', cambio: false, nota: 'Sin inicializar' },
      ],
    },
    {
      paso: 2,
      titulo: 'i = 0, entra al while: str[0]="h"',
      codigo: `(gdb) next
5\t\ti = 0;
(gdb) next
6\t\twhile (str[i])  → str[0]='h' ≠ '\\0', ENTRA`,
      variables: [
        { nombre: 'i', valor: '0', cambio: true, nota: '' },
        { nombre: 'str[0]', valor: "'h'", cambio: false, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'write(1, &str[0], 1) → escribe "h"',
      codigo: `(gdb) next
7\t\t\twrite(1, &str[i], 1);  → stdout: "h"
(gdb) next
8\t\t\ti++;                   → i=1`,
      variables: [
        { nombre: 'i', valor: '1', cambio: true, nota: '' },
        { nombre: 'stdout', valor: '"h"', cambio: true, nota: '1 byte escrito' },
      ],
    },
    {
      paso: 4,
      titulo: 'Iteraciones e, l, l, o → i = 5',
      codigo: `[i=1] write 'e' → stdout: "he"
[i=2] write 'l' → stdout: "hel"
[i=3] write 'l' → stdout: "hell"
[i=4] write 'o' → stdout: "hello"
i → 5`,
      variables: [
        { nombre: 'i', valor: '5', cambio: true, nota: '' },
        { nombre: 'stdout', valor: '"hello"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 5,
      titulo: 'write "\\n" → i = 6',
      codigo: `[i=5] write '\\n' → stdout: "hello\\n"
i → 6`,
      variables: [
        { nombre: 'i', valor: '6', cambio: true, nota: '' },
        { nombre: 'stdout', valor: '"hello\\n"', cambio: true, nota: 'El \\n viene del string, no lo añade ft_putstr' },
      ],
    },
    {
      paso: 6,
      titulo: 'str[6] = \\0 → sale del while, return',
      codigo: `while (str[6]) → '\\0' = 0 → FALSE, sale
// ft_putstr NO añade \\n extra
(gdb) finish`,
      variables: [
        { nombre: 'str[6]', valor: "'\\0'", cambio: false, nota: '← Para el while' },
        { nombre: 'stdout total', valor: '"hello\\n"', cambio: false, nota: '✓ Exactamente lo que contenía el string' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Añadir \\n al final — ft_putstr NO es puts()',
      descripcion: 'puts() añade \\n automáticamente. ft_putstr NO lo hace. Si añades un write extra de \\n, la Moulinette fallará cuando el string no debe terminar en \\n.',
      codigoMal: `// ❌ Añade \\n extra — falla la Moulinette
void ft_putstr(char *str) {
    int i = 0;
    while (str[i])
        write(1, &str[i++], 1);
    write(1, "\\n", 1); // ← EXTRA, no pedido
}`,
      codigoBien: `// ✅ Solo los bytes del string
void ft_putstr(char *str) {
    int i = 0;
    while (str[i])
        write(1, &str[i++], 1);
    // sin write extra
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'Usar printf() en vez de write()',
      descripcion: 'printf no está en la lista de funciones permitidas. Solo write() está permitido.',
      codigoMal: `// ❌ printf no está permitida
void ft_putstr(char *str) {
    printf("%s", str);
}`,
      codigoBien: `// ✅ Solo write, byte a byte
void ft_putstr(char *str) {
    int i = 0;
    while (str[i])
        write(1, &str[i++], 1);
}`,
    },
    {
      severidad: 'warning',
      titulo: 'write(1, str, ft_strlen(str)) sin incluir ft_strlen',
      descripcion: 'write() de todo el string de una vez es eficiente, pero requiere ft_strlen disponible en el mismo archivo o como cabecera.',
      codigoMal: `// ❌ ft_strlen no está declarada aquí
void ft_putstr(char *str) {
    write(1, str, ft_strlen(str)); // error de compilación
}`,
      codigoBien: `// ✅ Escribe byte a byte — siempre compila
void ft_putstr(char *str) {
    int i = 0;
    while (str[i])
        write(1, &str[i++], 1);
}`,
    },
  ],

  bajoCelCapot: `write(1, &str[i], 1):
  - 1 = file descriptor: stdout
  - &str[i] = dirección del byte a escribir
  - 1 = número de bytes a escribir
La llamada al sistema escribe directamente sin buffering (a diferencia de printf).`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Base de todas las funciones de output. ft_putstr + ft_putchar + ft_putnbr forman el kit básico de 42.',
  relacionados: ['ft_strlen', 'ft_strcpy'],
}
