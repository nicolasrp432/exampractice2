export default {
  id: 'ft_strlen',
  nombre: 'ft_strlen',
  nivel: 1,
  dificultad: 'fácil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_strlen.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_strlen
Expected files   : ft_strlen.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that returns the length of a string.

int\tft_strlen(char *str);`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_strlen
Expected files   : ft_strlen.c
Allowed functions:
--------------------------------------------------------------------------------

Write a function that returns the length of a string.

Your function must be declared as follows:

int	ft_strlen(char *str);`,

  descripcion: 'Función que recorre el string carácter a carácter hasta encontrar el \\0 y devuelve el número de posiciones contadas.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'nevera',
    personaje: 'El Alien Elástico',
    emoji: '👽',
    historia: `En la nevera vive el Alien Elástico que se ESTIRA por el string.
Cada celda que toca suma +1 a su contador interno.
Cuando toca al Fantasma Cero (\\0) se CONGELA al instante y no avanza más.
El número que tenía en ese momento = la longitud del string.
Ancla mental: el alien NUNCA cuenta al fantasma, solo se detiene ante él.`,
    anclas: [
      "while(str[i])  ← para en el \\0",
      "i++  ← avanza y cuenta",
      "return(i)  ← el total",
      "el \\0 congela al alien, no se cuenta",
      "off-by-one: devolver i, no i-1",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función recibe un string (una fila de letras).
Empieza a contar desde la posición 0.
Avanza letra a letra mientras haya una letra de verdad.
Cuando encuentra el Cero Fantasma (\\0) que marca el final, para de contar.
Devuelve el número que tenía: eso es la longitud del string.
Nunca cuenta al Fantasma Cero en la longitud.`,
    datosPuros: [
      { elemento: 'int ft_strlen(char *str)', nota: 'devuelve int, recibe char*' },
      { elemento: 'while (str[i])', nota: 'para en \\0 porque \\0 es falso (valor 0)' },
      { elemento: 'return (i)', nota: 'i ya contiene el número correcto, no i-1' },
    ],
    asociaciones: [
      { dato: 'while (str[i])', imagen: 'El Alien Elástico de la nevera se estira casilla a casilla. Cuando toca al Fantasma Cero se congela al instante. El número de casillas tocadas = la longitud.' },
      { dato: 'return (i)', imagen: 'El alien lleva un contador en la mano. Cuando se congela, te enseña el número que tiene: ese es el resultado. No resta nada porque al fantasma nunca lo contó.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "hello",
      "modo": "contar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int ft_strlen(char *str)",
        "porque": "Recibe un puntero al primer carácter; devuelve int porque una longitud es un número.",
        "concepto": "punteros"
      },
      {
        "codigo": "  int i = 0;",
        "porque": "Contador que arranca en 0 (los índices en C empiezan en 0).",
        "concepto": "variables"
      },
      {
        "codigo": "  while (str[i])",
        "porque": "str[i] es verdadero hasta el \\0 (que vale 0 = falso). Así hallamos el final sin saber la longitud.",
        "concepto": "strings"
      },
      {
        "codigo": "    i++;",
        "porque": "Un carácter más contado en cada vuelta.",
        "concepto": "bucles"
      },
      {
        "codigo": "  return (i);",
        "porque": "i ya vale cuántos caracteres había antes del \\0.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué return i y no i+1?",
        "respuesta": "El \\0 no forma parte de la longitud; i cuenta solo los caracteres reales."
      },
      {
        "pregunta": "¿Cómo sabe dónde acaba la cadena?",
        "respuesta": "Por el terminador \\0, que en C marca el final de todo string."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Cuenta caracteres hasta el terminador nulo',
    formula: 'i = 0; while (str[i]) i++; return (i);',
    ejemplo: {
      entrada: '"hello"',
      calculo: 'h(i=1) e(i=2) l(i=3) l(i=4) o(i=5) \\0 → STOP',
      resultado: '5',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_strlen.c
file2=../../../../rendu/ft_strlen/ft_strlen.c


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
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "ft_strlen(\"L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification.\") = 91\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "ft_strlen(\"S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  \") = 62\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "ft_strlen(\"3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot\") = 46\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "ft_strlen(\"Papache est un sabre\") = 20\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "ft_strlen(\"zaz\") = 3\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "ft_strlen(\"zaz\") = 3\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "ft_strlen(\"jacob\") = 5\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "ft_strlen(\"ZoZ eT Dovid oiME le METol.\") = 27\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "ft_strlen(\"wNcOre Un ExEmPle Pas Facilw a Ecrirw \") = 38\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "ft_strlen(\"AkjhZ zLKIJz , 23y \") = 19\n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "ft_strlen(\"FOR PONY\") = 8\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "ft_strlen(\"this        ...       is sparta, then again, maybe    not\") = 57\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "ft_strlen(\"   \") = 3\n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "ft_strlen(\"a\") = 1\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "ft_strlen(\"  lorem,ipsum  \") = 15\n", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "ft_strlen(\"\") = 0\n", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "ft_strlen(\"\") = 0\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica (índice i)',
      descripcion: 'La más legible y la más segura en el examen.',
      recomendada: true,
      codigo: `int\tft_strlen(char *str)
{
\tint\ti;

\ti = 0;
\twhile (str[i])
\t\ti++;
\treturn (i);
}`,
    },
    {
      id: 'puntero',
      nombre: 'Con puntero auxiliar',
      descripcion: 'Avanza un puntero y devuelve la diferencia. Más idiomático en C puro.',
      recomendada: false,
      codigo: `int\tft_strlen(char *str)
{
\tchar\t*p;

\tp = str;
\twhile (*p)
\t\tp++;
\treturn (p - str);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `int     ft_strlen(char *str)
{
	int		i;

	i = 0;
	while (str[i] != '\\0')
		i++;
	return (i);
}`,
    },
  ],

  tests: [
    {
      id: 'test_vacio',
      descripcion: 'String vacío → 0',
      entrada: [''],
      salida: '0\n',
      tipo: 'edge',
    },
    {
      id: 'test_hello',
      descripcion: '"hello" → 5',
      entrada: ['hello'],
      salida: '5\n',
      tipo: 'normal',
    },
    {
      id: 'test_1char',
      descripcion: '"a" → 1',
      entrada: ['a'],
      salida: '1\n',
      tipo: 'normal',
    },
    {
      id: 'test_espacio',
      descripcion: '"hello world" incluye espacio → 11',
      entrada: ['hello world'],
      salida: '11\n',
      tipo: 'normal',
    },
    {
      id: 'test_numeros',
      descripcion: '"42" → 2',
      entrada: ['42'],
      salida: '2\n',
      tipo: 'normal',
    },
    {
      id: 'test_largo',
      descripcion: '"abcdefghij" → 10',
      entrada: ['abcdefghij'],
      salida: '10\n',
      tipo: 'normal',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Inicio: str = "hello"',
      codigo: `(gdb) break ft_strlen
(gdb) run
Breakpoint 1, ft_strlen (str=0x... "hello") at ft_strlen.c:3
3\t\tint i;`,
      variables: [
        { nombre: 'str', valor: '"hello"', cambio: true, nota: 'Puntero al string' },
        { nombre: 'i', valor: '?', cambio: false, nota: 'Sin inicializar' },
      ],
    },
    {
      paso: 2,
      titulo: 'i = 0, comienza el while',
      codigo: `(gdb) next
5\t\ti = 0;
(gdb) next
6\t\twhile (str[i])  → str[0]='h' ≠ '\\0', ENTRA`,
      variables: [
        { nombre: 'i', valor: '0', cambio: true, nota: '→ apunta a "h"' },
        { nombre: 'str[0]', valor: "'h' (104)", cambio: false, nota: '≠ \\0 → entra' },
      ],
    },
    {
      paso: 3,
      titulo: 'Iteración 1-4: h, e, l, l → i = 4',
      codigo: `[i=0] str[0]='h' ≠ '\\0' → i++ → i=1
[i=1] str[1]='e' ≠ '\\0' → i++ → i=2
[i=2] str[2]='l' ≠ '\\0' → i++ → i=3
[i=3] str[3]='l' ≠ '\\0' → i++ → i=4`,
      variables: [
        { nombre: 'i', valor: '4', cambio: true, nota: 'Cuatro chars contados' },
      ],
    },
    {
      paso: 4,
      titulo: 'Iteración 5: "o" → i = 5',
      codigo: `(gdb) next
6\t\twhile (str[i])  → str[4]='o' ≠ '\\0', ENTRA
7\t\t\ti++;          → i = 5`,
      variables: [
        { nombre: 'i', valor: '5', cambio: true, nota: '' },
        { nombre: 'str[4]', valor: "'o' (111)", cambio: false, nota: '' },
      ],
    },
    {
      paso: 5,
      titulo: 'El Fantasma Cero \\0 → PARA',
      codigo: `(gdb) next
6\t\twhile (str[i])  → str[5]='\\0' = 0 → FALSE, sale del while`,
      variables: [
        { nombre: 'str[5]', valor: "'\\0' (0)", cambio: false, nota: '← El Fantasma Cero congela al alien' },
        { nombre: 'i', valor: '5', cambio: false, nota: 'No incrementa para \\0' },
      ],
    },
    {
      paso: 6,
      titulo: 'return (i) = 5',
      codigo: `(gdb) next
8\t\treturn (i);
(gdb) finish
Value returned is $1 = 5`,
      variables: [
        { nombre: 'i', valor: '5', cambio: false, nota: '✓ Longitud correcta' },
        { nombre: 'retorno', valor: '5', cambio: true, nota: '"hello" tiene 5 caracteres' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'return (i - 1) — off-by-one',
      descripcion: 'Al salir del while, i ya apunta al \\0 (no lo cuenta). Devolver i-1 daría 4 para "hello".',
      codigoMal: `// ❌ Off-by-one
while (str[i])
    i++;
return (i - 1); // 'hello' → 4, FALLA`,
      codigoBien: `// ✅
while (str[i])
    i++;
return (i);     // 'hello' → 5, CORRECTO`,
    },
    {
      severidad: 'mortal',
      titulo: 'Usar strlen() en vez de implementarla',
      descripcion: 'strlen() no está en la lista de funciones permitidas. La Moulinette compila con -lboundscheck y detecta si usas funciones no permitidas.',
      codigoMal: `// ❌ Prohibido
#include <string.h>
int ft_strlen(char *str) {
    return strlen(str); // función externa, no permitida
}`,
      codigoBien: `// ✅ Implementación propia
int ft_strlen(char *str) {
    int i = 0;
    while (str[i])
        i++;
    return (i);
}`,
    },
    {
      severidad: 'warning',
      titulo: 'No inicializar i = 0',
      descripcion: 'Sin i = 0, i tiene valor basura. El comportamiento es indefinido.',
      codigoMal: `int i; // ❌ valor basura
while (str[i]) i++;`,
      codigoBien: `int i;
i = 0;         // ✅ siempre inicializar
while (str[i]) i++;`,
    },
  ],

  bajoCelCapot: `La memoria de "hello" en C: [h][e][l][l][o][\\0]
                                              ↑ str apunta aquí al inicio
Cada char ocupa 1 byte. str[i] es equivalente a *(str + i).
El while evalúa el valor del char: 0 (falsy) = \\0 = FIN.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Patrón clásico de recorrido de string. Se usa en ft_strcpy, ft_strdup, ft_strcmp...',
  relacionados: ['ft_strcpy', 'ft_putstr', 'ft_strdup'],
}
