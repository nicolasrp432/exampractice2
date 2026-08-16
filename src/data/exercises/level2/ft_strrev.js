export default {
  id: 'ft_strrev',
  nombre: 'ft_strrev',
  nivel: 2,
  dificultad: 'fácil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_strrev.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_strrev
Expected files   : ft_strrev.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that reverses a string in-place and returns it.

char\t*ft_strrev(char *str);

Example:
ft_strrev("hello") → returns str modified to "olleh"`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_strrev
Expected files   : ft_strrev.c
Allowed functions:
--------------------------------------------------------------------------------

Write a function that reverses (in-place) a string.

It must return its parameter.

Your function must be declared as follows:

char    *ft_strrev(char *str);`,

  descripcion: 'Función que invierte un string in-place (dentro del mismo array) y lo devuelve. Usa dos índices que se acercan desde los extremos intercambiando chars.',

  palacio: {
    habitacion: 'salon',
    mueble: 'espejo',
    personaje: 'El Espejo Inversor',
    emoji: '🪞',
    historia: `En el salón hay un Espejo mágico que invierte todo lo que le pones delante.
Le das el string y el Espejo usa dos dedos: uno en el primer char, otro en el último.
Los intercambia con tmp, luego avanza el dedo izquierdo y retrocede el derecho.
Cuando los dos dedos se cruzan, la inversión está completa.
SIEMPRE devuelve el mismo puntero (str) — modifica in-place, sin malloc.`,
    anclas: [
      "len = strlen(str)  ← medir la longitud primero",
      "i=0, j=len-1  ← dos índices desde los extremos",
      "tmp = str[i]; str[i] = str[j]; str[j] = tmp  ← intercambio",
      "while (i < len / 2)  ← solo hasta la mitad",
      "return (str)  ← mismo puntero, modificado in-place",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función invierte un string IN PLACE — modifica el string original, no crea uno nuevo.
Pone un puntero al principio y otro al final del string.
Intercambia las letras de los extremos (como ft_swap pero para chars).
Mueve los punteros hacia el centro y repite.
Para cuando los punteros se cruzan o se tocan.
Devuelve el mismo puntero al string ya invertido.`,
    datosPuros: [
      { elemento: 'char *ft_strrev(char *str)', nota: 'devuelve char* (el mismo str), modifica in place' },
      { elemento: 'i = 0; j = len - 1; while (i < j)', nota: 'dos punteros desde los extremos hacia el centro' },
      { elemento: 'swap: tmp = str[i]; str[i] = str[j]; str[j] = tmp', nota: 'swap clásico con variable temporal' },
    ],
    asociaciones: [
      { dato: 'in place (mismo puntero)', imagen: 'ft_strrev no hace una fotocopia al revés — da la vuelta al papel original. Cuando termina, el papel ya está al revés y te devuelve el MISMO papel (el mismo puntero), no uno nuevo.' },
      { dato: 'dos punteros hacia el centro', imagen: 'Dos hormigas empiezan en los extremos del string y caminan hacia el centro intercambiando lo que llevan. Cuando se cruzan, el trabajo está hecho.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "hola",
      "modo": "revertir"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int i = 0, j = ft_strlen(str) - 1;",
        "porque": "Dos índices: uno al inicio, otro al final.",
        "concepto": "variables"
      },
      {
        "codigo": "while (i < j)",
        "porque": "Se cruzan en el centro.",
        "concepto": "bucles"
      },
      {
        "codigo": "  swap(str[i], str[j]);",
        "porque": "Intercambia extremos usando una variable temporal.",
        "concepto": "strings"
      },
      {
        "codigo": "  i++; j--;",
        "porque": "Cierran hacia el medio.",
        "concepto": "bucles"
      },
      {
        "codigo": "return (str);",
        "porque": "Devuelve la misma cadena, ya invertida.",
        "concepto": "punteros"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué while (i < j) y no i <= j?",
        "respuesta": "Cuando se cruzan ya está todo; con i == j intercambiarías un carácter consigo mismo."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Intercambio de chars desde extremos hacia el centro',
    formula: 'while (i < len/2) { tmp=str[i]; str[i]=str[len-1-i]; str[len-1-i]=tmp; i++; } return str;',
    ejemplo: {
      entrada: '"hello"',
      calculo: 'len=5; i=0:h↔o; i=1:e↔l; i=2:l≈l(centro); → "olleh"',
      resultado: '"olleh"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_strrev.c
file2=../../../../rendu/ft_strrev/ft_strrev.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

    ./out1 "zaz" > out1.txt 2>/dev/null
    ./out2 "zaz" > out2.txt 2>/dev/null

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

    ./out1 "dub0 a POIL" > out1.txt 2>/dev/null
    ./out2 "dub0 a POIL" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["zaz"], salida: "zaz", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["dub0 a POIL"], salida: "LIOP a 0bud", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "tof ef aK ne'm EK id aK ik nUom  tuOt  aB 12:3", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["AkjhZ zLKIJz , 23y "], salida: " y32 , zJIKLz ZhjkA", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["FOR PONY"], salida: "YNOP ROF", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "ton    ebyam ,niaga neht ,atraps si       ...        siht", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["   "], salida: "   ", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["  lorem,ipsum  "], salida: "  muspi,merol  ", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: [""], salida: "", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: [], salida: "", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con len calculado y dos variables',
      descripcion: 'Calcula len primero, intercambia con tmp. La más legible.',
      recomendada: true,
      codigo: `char\t*ft_strrev(char *str)
{
\tint\tlen;
\tint\ti;
\tchar\ttmp;

\tlen = 0;
\twhile (str[len])
\t\tlen++;
\ti = 0;
\twhile (i < len / 2)
\t{
\t\ttmp = str[i];
\t\tstr[i] = str[len - 1 - i];
\t\tstr[len - 1 - i] = tmp;
\t\ti++;
\t}
\treturn (str);
}`,
    },
    {
      id: 'dos_indices',
      nombre: 'Con dos índices i y j',
      descripcion: 'i desde el inicio, j desde el final, se acercan hasta cruzarse.',
      recomendada: false,
      codigo: `char\t*ft_strrev(char *str)
{
\tint\ti;
\tint\tj;
\tchar\ttmp;

\ti = 0;
\tj = 0;
\twhile (str[j])
\t\tj++;
\tj--;
\twhile (i < j)
\t{
\t\ttmp = str[i];
\t\tstr[i] = str[j];
\t\tstr[j] = tmp;
\t\ti++;
\t\tj--;
\t}
\treturn (str);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `char *ft_strrev(char *str)
{
	int i = -1;
	int length = 0;
	char temporary;

	while (str[length])
		length++;
	while (++i < length / 2)
	{
		temporary = str[i];
		str[i] = str[length - 1 - i];
		str[length - 1 - i] = temporary;
	}
	return (str);
}`,
    },
  ],

  tests: [
    { id: 'test_hello', descripcion: '"hello" → "olleh"', entrada: ['hello'], salida: 'olleh\n', tipo: 'normal' },
    { id: 'test_palindrome', descripcion: '"racecar" → "racecar" (palíndromo)', entrada: ['racecar'], salida: 'racecar\n', tipo: 'normal' },
    { id: 'test_single', descripcion: '"a" → "a" (un char)', entrada: ['a'], salida: 'a\n', tipo: 'edge' },
    { id: 'test_vacio', descripcion: '"" → "" (string vacío)', entrada: [''], salida: '\n', tipo: 'edge' },
    { id: 'test_abc', descripcion: '"abc" → "cba"', entrada: ['abc'], salida: 'cba\n', tipo: 'normal' },
    { id: 'test_numero', descripcion: '"12345" → "54321"', entrada: ['12345'], salida: '54321\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Calcular len de "hello"',
      codigo: `str = "hello"
len = 0
str[0]='h' → len++; str[1]='e' → len++; ... str[5]='\\0' → para
len = 5`,
      variables: [
        { nombre: 'len', valor: '5', cambio: true, nota: '' },
        { nombre: 'i', valor: '0', cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=0: intercambiar str[0]="h" con str[4]="o"',
      codigo: `i=0, len-1-i = 4
tmp = str[0] = 'h'
str[0] = str[4] = 'o' → str="oello"
str[4] = tmp = 'h' → str="oellh"
i++ → i=1`,
      variables: [
        { nombre: 'tmp', valor: "'h'", cambio: true, nota: '' },
        { nombre: 'str', valor: '"oellh"', cambio: true, nota: '' },
        { nombre: 'i', valor: '1', cambio: true, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: 'i=1: intercambiar str[1]="e" con str[3]="l"',
      codigo: `i=1, len-1-i = 3
tmp = 'e'; str[1]='l'; str[3]='e' → str="olh"...
str="olleh" ... i=2`,
      variables: [
        { nombre: 'str', valor: '"olleh"', cambio: true, nota: '' },
        { nombre: 'i', valor: '2', cambio: true, nota: '' },
      ],
    },
    {
      paso: 4,
      titulo: 'i=2: 2 < 5/2=2 → FALSE → sale del while',
      codigo: `i=2, len/2=2
while (2 < 2) → FALSE → sale
return (str) = "olleh"`,
      variables: [
        { nombre: 'retorno', valor: '"olleh"', cambio: true, nota: '✓ invertido in-place' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'i < len en vez de i < len/2 → invierte el string dos veces',
      descripcion: 'Si el while va hasta len, pasa el punto medio y vuelve a invertir, dejando el string original. El intercambio debe hacerse solo hasta la mitad.',
      codigoMal: `// ❌ Invierte dos veces → string original
while (i < len) {
    tmp = str[i]; str[i] = str[len-1-i]; str[len-1-i] = tmp;
    i++;
}`,
      codigoBien: `// ✅ Solo hasta la mitad
while (i < len / 2) {
    tmp = str[i]; str[i] = str[len-1-i]; str[len-1-i] = tmp;
    i++;
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'No devolver str — retornar NULL o void',
      descripcion: 'La firma es char *ft_strrev. Debe devolver el mismo puntero str. Si devuelves void o NULL, el caller no puede usar el resultado.',
      codigoMal: `// ❌ Olvida return
void ft_strrev(char *str) {
    // ... invierte ...
    // sin return
}`,
      codigoBien: `// ✅
char *ft_strrev(char *str) {
    // ... invierte ...
    return (str);  // mismo puntero
}`,
    },
    {
      severidad: 'warning',
      titulo: 'j = len sin -1 → j apunta al \\0',
      descripcion: 'Si j empieza en len (no len-1), apunta al \\0 terminal. El primer intercambio pondría \\0 al inicio del string.',
      codigoMal: `// ❌ j apunta al '\\0'
j = len;  // str[len] = '\\0'
// primer intercambio: str[0] ↔ str[len] = '\\0' → error`,
      codigoBien: `// ✅ j apunta al último char
j = len - 1;  // str[len-1] = último char real`,
    },
  ],

  bajoCelCapot: `ft_strrev modifica el string directamente (in-place), sin malloc.
El puntero str no cambia — devuelve la misma dirección.
El intercambio a la mitad: para len=5, solo 2 intercambios (i=0,1); el char central (i=2) no se mueve.
Para len=4: 2 intercambios (i=0,1); se cruzan en el medio.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El patrón de inversión in-place con dos índices es la base de reverse_bits, ft_strrev, y cualquier algoritmo de inversión de array.',
  relacionados: ['reverse_bits', 'ft_strlen', 'ft_strcpy'],
}
