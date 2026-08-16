export default {
  id: 'hidenp',
  nombre: 'hidenp',
  nivel: 3,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['hidenp.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : hidenp
Expected files   : hidenp.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes two strings and checks whether the characters of
the second string are "hidden" in the first string (i.e., appear in the same
order as a subsequence).

Display '1' followed by a newline if they are, '0' followed by a newline if
they are not.

If the number of arguments is not 2, display a newline.

Example:
$> ./hidenp "foobar" "bar" | cat -e
1$
$> ./hidenp "foobar" "rab" | cat -e
0$
$> ./hidenp "hello" "heo" | cat -e
1$`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : hidenp
Expected files   : hidenp.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program named hidenp that takes two strings and displays 1
followed by a newline if the first string is hidden in the second one,
otherwise displays 0 followed by a newline.

Let s1 and s2 be strings. We say that s1 is hidden in s2 if it's possible to
find each character from s1 in s2, in the same order as they appear in s1.
Also, the empty string is hidden in any string.

If the number of parameters is not 2, the program displays a newline.

Examples :

$>./hidenp "fgex.;" "tyf34gdgf;'ektufjhgdgex.;.;rtjynur6" | cat -e
1$
$>./hidenp "abc" "2altrb53c.sse" | cat -e
1$
$>./hidenp "abc" "btarc" | cat -e
0$
$>./hidenp | cat -e
$
$>`,

  descripcion: 'Programa que verifica si s2 es una subsecuencia de s1 (los chars de s2 aparecen en s1 en el mismo orden). Imprime "1\\n" si sí, "0\\n" si no. Similar a wdmatch pero imprime 1/0 en vez de s2/vacío.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'lupa',
    personaje: 'La Lupa del Detective',
    emoji: '🔎',
    historia: `En el dormitorio hay una Lupa poderosa que detecta patrones ocultos.
Le das dos strings: la pista maestra (s1) y el patrón secreto (s2).
La Lupa busca si s2 está "escondido" en s1 como subsecuencia.
Si todos los chars de s2 aparecen en s1 en orden → imprime '1'.
Si alguno falta o está fuera de orden → imprime '0'.
(Mismo algoritmo que wdmatch, pero salida 1/0 en vez de s2/vacío.)`,
    anclas: [
      "i recorre s1, j recorre s2",
      "si s1[i]==s2[j]: j++ (encontramos un char de s2)",
      "i++ siempre (recorre s1 completo)",
      "si argv[2][j]=='\\0' al final: '1'",
      "si s1 acaba antes que s2: '0'",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `El programa comprueba si el primer número (como string) es una subsecuencia del segundo número (también como string).
Recorre el segundo string dígito a dígito.
Cada vez que encuentra el siguiente dígito que busca del primero, avanza en el primero.
Si al terminar el segundo ya encontró todos los dígitos del primero (en orden), imprime "1\\n".
Si no, imprime "0\\n".`,
    datosPuros: [
      { elemento: 'imprimir "1\\n" o "0\\n"', nota: 'comillas y newline exactos' },
      { elemento: 'misma lógica que wdmatch pero para dígitos', nota: 'if (!s1[j]) → "1", else → "0"' },
    ],
    asociaciones: [
      { dato: '"1\\n" o "0\\n" (no int)', imagen: 'hidenp es wdmatch disfrazado de números. El resultado no es el número 1 o 0 — son los CARACTERES "1" y "0" escritos con write, seguidos de newline. Si escribes el entero 1 con write, sale un carácter de control, no el texto "1".' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "abc",
      "cadena2": "aXbXcX",
      "modo": "comparar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int i = 0;",
        "porque": "Índice del patrón s1.",
        "concepto": "variables"
      },
      {
        "codigo": "while (s2[j])",
        "porque": "Recorre la cadena grande s2.",
        "concepto": "bucles"
      },
      {
        "codigo": "  if (s1[i] == s2[j]) i++;",
        "porque": "Avanza el patrón cuando coincide EN ORDEN.",
        "concepto": "condicionales"
      },
      {
        "codigo": "write(1, s1[i] == \\0 ? \"1\" : \"0\", 1);",
        "porque": "Imprime 1 si s1 estaba escondido en orden dentro de s2.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué imprime \"1\" o \"0\"?",
        "respuesta": "hidenp responde sí/no: ¿aparece s1 como subsecuencia de s2?"
      }
    ]
  },

  formulaClave: {
    descripcion: 'Dos índices: i en s1 (siempre avanza), j en s2 (solo en match)',
    formula: 'while(s1[i]&&s2[j]){ if(s1[i]==s2[j])j++; i++; } write(s2[j]?"0":"1");',
    ejemplo: {
      entrada: 's1="foobar", s2="bar"',
      calculo: 'f≠b,o≠b,o≠b,b==b(j=1),a==a(j=2),r==r(j=3); s2[3]=\\0 → "1"',
      resultado: '"1"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=hidenp.c
file2=../../../../rendu/hidenp/hidenp.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

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

# 2. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "fgex.;" "tyf34gdgf;'ektufjhgdgex.;.;rtjynur6" > out1.txt 2>/dev/null
    ./out2 "fgex.;" "tyf34gdgf;'ektufjhgdgex.;.;rtjynur6" > out2.txt 2>/dev/null

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

    ./out1 "abc" "2altrb53c.sse" > out1.txt 2>/dev/null
    ./out2 "abc" "2altrb53c.sse" > out2.txt 2>/dev/null

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

    ./out1 "abc" "btarc" > out1.txt 2>/dev/null
    ./out2 "abc" "btarc" > out2.txt 2>/dev/null

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

    ./out1 "mais non!" "mais non!" > out1.txt 2>/dev/null
    ./out2 "mais non!" "mais non!" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: [], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["fgex.;","tyf34gdgf;'ektufjhgdgex.;.;rtjynur6"], salida: "1\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["abc","2altrb53c.sse"], salida: "1\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["abc","btarc"], salida: "0\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["mais non!","mais non!"], salida: "1\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con dos índices i y j',
      descripcion: 'Idéntica estructura a wdmatch. Solo cambia la salida: "1" o "0" en vez de s2 o vacío.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tint\tj;
\tchar\tc;

\tif (argc == 3)
\t{
\t\ti = 0;
\t\tj = 0;
\t\twhile (argv[1][i] && argv[2][j])
\t\t{
\t\t\tif (argv[1][i] == argv[2][j])
\t\t\t\tj++;
\t\t\ti++;
\t\t}
\t\tc = (argv[2][j] == '\\0') ? '1' : '0';
\t\twrite(1, &c, 1);
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'punteros',
      nombre: 'Con punteros avanzando sobre ambos strings',
      descripcion: 'Resuelve la subsecuencia sin índices, moviendo dos punteros en paralelo.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tchar\t*s1;
\tchar\t*s2;
\tchar\tc;

\tif (argc == 3)
\t{
\t\ts1 = argv[1];
\t\ts2 = argv[2];
\t\twhile (*s1 && *s2)
\t\t{
\t\t\tif (*s1 == *s2)
\t\t\t\ts2++;
\t\t\ts1++;
\t\t}
\t\tc = (*s2 == '\\0') ? '1' : '0';
\t\twrite(1, &c, 1);
\t\twrite(1, "\\n", 1);
\t\treturn (0);
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
      codigo: `
#include <unistd.h>

void	hidenp(char *probe, char *target)
{
	while (*probe != '\\0')
	{
		while (*probe != *target && *target != '\\0')
			++target;
		if (*target == '\\0')
		{
			write(1, "0", 1);
			return;
		}
		++target;
		++probe;
	}
	write(1, "1", 1);
}

int		main(int argc, char **argv)
{
	if (argc == 3)
		hidenp(argv[1], argv[2]);
	write(1, "\\n", 1);
	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_bar', descripcion: '"foobar","bar" → 1 (bar es subsecuencia)', entrada: ['foobar', 'bar'], salida: '1\n', tipo: 'normal' },
    { id: 'test_rab', descripcion: '"foobar","rab" → 0 (no subsecuencia)', entrada: ['foobar', 'rab'], salida: '0\n', tipo: 'normal' },
    { id: 'test_heo', descripcion: '"hello","heo" → 1 (h,e,o en orden)', entrada: ['hello', 'heo'], salida: '1\n', tipo: 'normal' },
    { id: 'test_xyz', descripcion: '"hello","xyz" → 0 (ninguno encontrado)', entrada: ['hello', 'xyz'], salida: '0\n', tipo: 'normal' },
    { id: 'test_s2_largo', descripcion: '"ab","abc" → 0 (s2 más largo que s1)', entrada: ['ab', 'abc'], salida: '0\n', tipo: 'edge' },
    { id: 'test_vacio_s2', descripcion: '"hello","" → 1 (vacío es subsecuencia de todo)', entrada: ['hello', ''], salida: '1\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 's1="foobar",s2="bar": buscar "bar" en "foobar"',
      codigo: `i=0,j=0: 'f'!='b' → i=1
i=1,j=0: 'o'!='b' → i=2
i=2,j=0: 'o'!='b' → i=3
i=3,j=0: 'b'=='b' → j=1, i=4
i=4,j=1: 'a'=='a' → j=2, i=5
i=5,j=2: 'r'=='r' → j=3, i=6
s1[6]='\\0' → while FALSE
s2[3]='\\0' → c='1'`,
      variables: [
        { nombre: 'j', valor: '3 (= s2.length)', cambio: true, nota: '← todos encontrados' },
        { nombre: 'c', valor: "'1'", cambio: true, nota: '✓' },
      ],
    },
    {
      paso: 2,
      titulo: 's1="foobar",s2="rab": "r" no encontrado a tiempo',
      codigo: `i=0..4: f,o,o,b,a → j=0 (no hay 'r' antes de pos 5)
i=5,j=0: 'r'=='r' → j=1, i=6
s1[6]='\\0' → while FALSE
s2[1]='a' ≠ '\\0' → c='0'`,
      variables: [
        { nombre: 'j', valor: '1 ≠ s2.length(3)', cambio: true, nota: '← no encontrado' },
        { nombre: 'c', valor: "'0'", cambio: true, nota: '' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Confundir hidenp con wdmatch: imprimir s2 en vez de "1"',
      descripcion: 'wdmatch imprime s2 si encontrado, "" si no. hidenp imprime "1" o "0". Misma lógica, diferente salida.',
      codigoMal: `// ❌ Salida de wdmatch, no de hidenp
if (!argv[2][j]) {
    i = 0;
    while (argv[2][i]) write(1, &argv[2][i++], 1);
}`,
      codigoBien: `// ✅ Salida de hidenp: '1' o '0'
c = (argv[2][j] == '\\0') ? '1' : '0';
write(1, &c, 1);`,
    },
    {
      severidad: 'warning',
      titulo: 'Caso s2 vacío: j=0=s2.length → resultado es "1"',
      descripcion: 'Si s2="" (vacío), j empieza en 0 y s2.length=0 → inmediatamente j==s2.length → "1". Un string vacío es subsecuencia de cualquier string.',
      codigoMal: `// ❌ Caso especial innecesario
if (!argv[2][0]) { write("0\\n", ...); }`,
      codigoBien: `// ✅ El algoritmo general ya maneja este caso
// s2="": j=0, s2[0]='\\0' → while no entra → s2[j]='\\0' → "1"`,
    },
  ],

  bajoCelCapot: `hidenp = "hidden n in p" o similar — verificación de subsecuencia.
La diferencia con wdmatch: solo el OUTPUT difiere. El algoritmo es idéntico.
wdmatch: "bar" → imprime "bar\\n"; "rab" → imprime "\\n".
hidenp: "bar" → imprime "1\\n"; "rab" → imprime "0\\n".
Una subsecuencia mantiene el orden pero no requiere contigüidad.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Memorizar wdmatch implica saber hidenp: mismo algoritmo, distinto output. Recordar la diferencia: wdmatch imprime s2, hidenp imprime 1/0.',
  relacionados: ['wdmatch', 'inter', 'ft_strcspn'],
}
