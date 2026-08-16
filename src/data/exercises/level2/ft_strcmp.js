export default {
  id: 'ft_strcmp',
  nombre: 'ft_strcmp',
  nivel: 2,
  dificultad: 'fácil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_strcmp.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_strcmp
Expected files   : ft_strcmp.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that compares the two strings s1 and s2.

It returns an integer less than, equal to, or greater than zero if s1 is
found, respectively, to be less than, to match, or to be greater than s2.

int\tft_strcmp(char *s1, char *s2);`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_strcmp
Expected files   : ft_strcmp.c
Allowed functions:
--------------------------------------------------------------------------------

Reproduce the behavior of the function strcmp (man strcmp).

Your function must be declared as follows:

int    ft_strcmp(char *s1, char *s2);`,

  descripcion: 'Función que compara dos strings byte a byte. Devuelve 0 si iguales, positivo si s1>s2, negativo si s1<s2. El valor es la diferencia de los primeros bytes distintos.',

  palacio: {
    habitacion: 'salon',
    mueble: 'balanza',
    personaje: 'La Balanza de strings',
    emoji: '⚖️',
    historia: `En el salón hay una Balanza que pesa strings letra a letra.
Compara s1[i] con s2[i] simultáneamente.
Si encuentra una diferencia: devuelve s1[i] - s2[i].
Si llega al final de ambos sin diferencias: devuelve 0 (iguales).
Si s1 termina antes que s2, el \\0 de s1 "pesa" menos que el char de s2.`,
    anclas: [
      "while (s1[i] == s2[i] && s1[i]) i++",
      "return (unsigned char)s1[i] - (unsigned char)s2[i]",
      "0 = iguales, <0 = s1<s2, >0 = s1>s2",
      "\\0 tiene valor 0 — el más pequeño de todos",
      "comparación byte a byte, no string completo",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `La función compara dos strings carácter a carácter.
Avanza mientras los caracteres sean iguales y ninguno sea el final.
Cuando encuentra una diferencia (o el final de uno), para.
Devuelve la diferencia entre los valores ASCII de los dos caracteres en esa posición.
Si ambos son iguales hasta el final, devuelve 0.`,
    datosPuros: [
      { elemento: 'return (unsigned char)s1[i] - (unsigned char)s2[i]', nota: 'la diferencia entre valores ASCII — no un booleano' },
      { elemento: 'while (s1[i] && s2[i] && s1[i] == s2[i])', nota: 'avanzar mientras ambos son iguales y no son \\0' },
      { elemento: 'int ft_strcmp(char *s1, char *s2)', nota: 'devuelve int (la diferencia), no un bool' },
    ],
    asociaciones: [
      { dato: 'devuelve diferencia (no bool)', imagen: 'ft_strcmp no es un árbitro que dice "¡igual!" o "¡diferente!". Es un tasador que dice "el primero vale 5 más que el segundo". Negativo: s1 < s2. Cero: iguales. Positivo: s1 > s2.' },
      { dato: 'unsigned char para la resta', imagen: 'Los caracteres con tilde o especiales pueden ser "negativos" como char. Ponerlos en unsigned char es como ponerles un chaleco salvavidas: siempre flotan entre 0-255 y la resta es predecible.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "abc",
      "cadena2": "abd",
      "modo": "comparar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (s1[i] && s1[i] == s2[i])",
        "porque": "Avanza mientras ambos coincidan y no acabe s1.",
        "concepto": "strings"
      },
      {
        "codigo": "  i++;",
        "porque": "Siguiente carácter.",
        "concepto": "bucles"
      },
      {
        "codigo": "return (s1[i] - s2[i]);",
        "porque": "Devuelve la diferencia ASCII en el primer carácter distinto.",
        "concepto": "ascii"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué devolver la resta y no 1 / -1?",
        "respuesta": "strcmp devuelve la diferencia real entre los caracteres que difieren."
      },
      {
        "pregunta": "¿Por qué la condición s1[i] && ...?",
        "respuesta": "Si llegas al \\0 de s1, las cadenas son iguales hasta ahí y hay que parar."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Diferencia del primer byte distinto (o 0 si son iguales hasta el final)',
    formula: 'while (s1[i] == s2[i] && s1[i]) i++; return ((unsigned char)s1[i] - (unsigned char)s2[i]);',
    ejemplo: {
      entrada: '"abc" vs "abd"',
      calculo: 'a==a(i++), b==b(i++), c(99) ≠ d(100) → 99-100=-1',
      resultado: '-1',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_strcmp.c
file2=../../../../rendu/ft_strcmp/ft_strcmp.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

    ./out1 "Ceci permet de decouvrir le fonctionnement de ton ft_atoi." > out1.txt 2>/dev/null
    ./out2 "Ceci permet de decouvrir le fonctionnement de ton ft_atoi." > out2.txt 2>/dev/null

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

    ./out1 "OH ! 13268!" > out1.txt 2>/dev/null
    ./out2 "OH ! 13268!" > out2.txt 2>/dev/null

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

    ./out1 "hello World" "hello world" > out1.txt 2>/dev/null
    ./out2 "hello World" "hello world" > out2.txt 2>/dev/null

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

    ./out1 "hello World" "" > out1.txt 2>/dev/null
    ./out2 "hello World" "" > out2.txt 2>/dev/null

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

    ./out1 "13268!" "+13268!" > out1.txt 2>/dev/null
    ./out2 "13268!" "+13268!" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["Ceci permet de decouvrir le fonctionnement de ton ft_atoi."], salida: "", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["OH ! 13268!"], salida: "", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["hello World","hello world"], salida: "ft_strcmp(\"hello World\", \"hello world\") = -32\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["hello World",""], salida: "ft_strcmp(\"hello World\", \"\") = 104\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["13268!","+13268!"], salida: "ft_strcmp(\"13268!\", \"+13268!\") = 6\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con while e índice',
      descripcion: 'La más legible. Avanza mientras los chars son iguales y no es \\0.',
      recomendada: true,
      codigo: `int\tft_strcmp(char *s1, char *s2)
{
\tint\ti;

\ti = 0;
\twhile (s1[i] == s2[i] && s1[i])
\t\ti++;
\treturn ((unsigned char)s1[i] - (unsigned char)s2[i]);
}`,
    },
    {
      id: 'puntero',
      nombre: 'Con punteros',
      descripcion: 'Avanza los punteros directamente. Más compacta.',
      recomendada: false,
      codigo: `int\tft_strcmp(char *s1, char *s2)
{
\twhile (*s1 && *s1 == *s2)
\t{
\t\ts1++;
\t\ts2++;
\t}
\treturn ((unsigned char)*s1 - (unsigned char)*s2);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <stdio.h>
#include <string.h>

int	ft_strcmp(char *s1, char *s2)
{
	int i;

	i = 0;
	while (s1[i] == s2[i] && s1[i] != '\\0' && s2[i] != '\\0')
		i++;
	return (s1[i] - s2[i]);
}`,
    },
  ],

  tests: [
    { id: 'test_igual', descripcion: '"hello" == "hello" → 0', entrada: ['hello', 'hello'], salida: '0\n', tipo: 'normal' },
    { id: 'test_menor', descripcion: '"abc" < "abd" → -1', entrada: ['abc', 'abd'], salida: '-1\n', tipo: 'normal' },
    { id: 'test_mayor', descripcion: '"abd" > "abc" → 1', entrada: ['abd', 'abc'], salida: '1\n', tipo: 'normal' },
    { id: 'test_ambos_vacios', descripcion: '"" == "" → 0', entrada: ['', ''], salida: '0\n', tipo: 'edge' },
    { id: 'test_s1_corto', descripcion: '"hello" vs "hello!" → -33 (\\0 vs !)', entrada: ['hello', 'hello!'], salida: '-33\n', tipo: 'edge' },
    { id: 'test_s2_corto', descripcion: '"hello!" vs "hello" → 33', entrada: ['hello!', 'hello'], salida: '33\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Comparando "abc" vs "abd"',
      codigo: `s1="abc", s2="abd", i=0
s1[0]='a'(97) == s2[0]='a'(97) && s1[0]≠'\\0' → i=1
s1[1]='b'(98) == s2[1]='b'(98) && s1[1]≠'\\0' → i=2
s1[2]='c'(99) != s2[2]='d'(100) → sale del while`,
      variables: [
        { nombre: 'i', valor: '2', cambio: true, nota: '← primer índice diferente' },
        { nombre: 's1[2]', valor: "'c'(99)", cambio: false, nota: '' },
        { nombre: 's2[2]', valor: "'d'(100)", cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'return s1[2] - s2[2] = 99 - 100 = -1',
      codigo: `return ((unsigned char)'c' - (unsigned char)'d')
     = 99 - 100
     = -1`,
      variables: [
        { nombre: 'retorno', valor: '-1', cambio: true, nota: '< 0 → s1 < s2 ✓' },
      ],
    },
    {
      paso: 3,
      titulo: 'Caso "hello" vs "hello!": \\0 vs !',
      codigo: `i=0..4: h==h, e==e, l==l, l==l, o==o
i=5: s1[5]='\\0'(0), while(s1[5] == s2[5]) → '\\0'≠'!' → sale
also: while condition: s1[5]=0 → FALSE → sale
return 0 - '!'(33) = -33`,
      variables: [
        { nombre: 's1[5]', valor: "'\\0'(0)", cambio: false, nota: '← string más corto' },
        { nombre: 's2[5]', valor: "'!'(33)", cambio: false, nota: '' },
        { nombre: 'retorno', valor: '-33', cambio: true, nota: '0-33=-33' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Usar char en vez de unsigned char para la diferencia',
      descripcion: 'Un char puede ser signed (-128..127) en muchas plataformas. Si s1[i]=200 y s2[i]=50, la diferencia sería -56 (incorrecto). La spec dice "unsigned char".',
      codigoMal: `// ❌ Con signed char: caracteres > 127 dan resultados incorrectos
return (s1[i] - s2[i]);`,
      codigoBien: `// ✅ Cast explícito a unsigned char
return ((unsigned char)s1[i] - (unsigned char)s2[i]);`,
    },
    {
      severidad: 'mortal',
      titulo: 'Condición del while: olvidar && s1[i]',
      descripcion: 'Sin && s1[i], el while continúa después del \\0 leyendo memoria inválida.',
      codigoMal: `// ❌ Sin verificar \\0 — lee más allá del string
while (s1[i] == s2[i])  // continúa aunque ambos sean \\0`,
      codigoBien: `// ✅ Para cuando s1[i] es \\0 (lo que implica que s2[i] también lo es si son iguales)
while (s1[i] == s2[i] && s1[i])
    i++;`,
    },
    {
      severidad: 'warning',
      titulo: 'No devolver los valores exactos estándar (0, 1, -1 vs diff real)',
      descripcion: 'La firma dice "entero mayor, igual o menor que 0". Puede ser -1, 0, 1 o -33, 0, 33. La versión diff real (return s1[i]-s2[i]) es correcta y más fiel al estándar.',
      codigoMal: `// ❌ Solo -1, 0, 1 — no estándar estricto
if (s1[i] > s2[i]) return 1;
if (s1[i] < s2[i]) return -1;
return 0;`,
      codigoBien: `// ✅ Diferencia real — correcto y estándar
return ((unsigned char)s1[i] - (unsigned char)s2[i]);`,
    },
  ],

  bajoCelCapot: `strcmp compara byte a byte (no "string completo").
El \\0 tiene valor 0, el más pequeño, por eso "abc" < "abcd" (\\0 < 'd').
"abc" vs "abd": 'c'(99) - 'd'(100) = -1 (negativo → s1 < s2).
El cast a unsigned char es crítico para chars > 127.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'ft_strcmp es la base de ft_strncmp, wdmatch conceptual, y cualquier comparación de strings. El patrón "avanza mientras igual y no-null" es universal.',
  relacionados: ['ft_strlen', 'ft_strcpy', 'wdmatch'],
}
