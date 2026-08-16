export default {
  id: 'wdmatch',
  nombre: 'wdmatch',
  nivel: 2,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['wdmatch.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : wdmatch
Expected files   : wdmatch.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes two strings and checks whether the second string's
characters can be found in the first string, in the same order.

If this is the case, display the second string, followed by a newline, otherwise
display just a newline.

If the number of arguments is not 2, the program displays a newline.

Example:
$> ./wdmatch "foobar" "bar" | cat -e
bar$
$> ./wdmatch "foobar" "rab" | cat -e
$
$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : wdmatch
Expected files   : wdmatch.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes two strings and checks whether it's possible to
write the first string with characters from the second string, while respecting
the order in which these characters appear in the second string.

If it's possible, the program displays the string, followed by a \\n, otherwise
it simply displays a \\n.

If the number of arguments is not 2, the program displays a \\n.

Examples:

$>./wdmatch "faya" "fgvvfdxcacpolhyghbreda" | cat -e
faya$
$>./wdmatch "faya" "fgvvfdxcacpolhyghbred" | cat -e
$
$>./wdmatch "quarante deux" "qfqfsudf arzgsayns tsregfdgs sjytdekuoixq " | cat -e
quarante deux$
$>./wdmatch "error" rrerrrfiiljdfxjyuifrrvcoojh | cat -e
$
$>./wdmatch | cat -e
$`,

  descripcion: 'Programa que comprueba si s2 es una subsecuencia de s1 (los chars de s2 aparecen en s1 en el mismo orden, pero no necesariamente contiguos). Si sí, imprime s2; si no, solo \\n.',

  palacio: {
    habitacion: 'salon',
    mueble: 'alfombra',
    personaje: 'El Detective de Subsecuencias',
    emoji: '🕵️',
    historia: `En el salón hay una Alfombra con huellas secretas.
El Detective tiene dos listas: la pista maestra (s1) y los sospechosos (s2).
Avanza por s1 buscando el primer sospechoso de s2. Cuando lo encuentra, busca el siguiente.
Si logra encontrar TODOS los sospechosos de s2 en orden dentro de s1 → imprime s2.
Si alguno falta o llega antes que su anterior → solo imprime '\\n'.
No importa si hay chars de más entre ellos en s1 — solo importa el ORDEN.`,
    anclas: [
      "j avanza solo cuando s1[i]==s2[j]  ← sólo al encontrar coincidencia",
      "i avanza siempre  ← recorre toda s1",
      "si argv[2][j]=='\\0' al final → todos encontrados → imprimir s2",
      "si argv[1][i]=='\\0' y argv[2][j]!='\\0' → no encontrado → solo '\\n'",
      "argc != 3 → solo '\\n'",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `El programa comprueba si el primer string es una subsecuencia del segundo.
Recorre el segundo string carácter a carácter.
Cada vez que encuentra el siguiente carácter que busca del primer string, avanza en el primero.
Si al terminar el segundo string ya encontró todos los caracteres del primero (en orden), imprime el primero.
Si no los encontró todos, imprime solo un salto de línea.`,
    datosPuros: [
      { elemento: 'if (s1[j] == s2[i]) j++', nota: 'avanzar en s1 solo cuando hay coincidencia en s2' },
      { elemento: 'if (!s1[j]) → imprimir s1', nota: 'j llegó al \\0 de s1 → todos los chars encontrados' },
    ],
    asociaciones: [
      { dato: 'subsecuencia (orden importa)', imagen: 'wdmatch es como buscar las letras de una palabra en una sopa de letras leyendo solo de izquierda a derecha. Puedes saltarte letras, pero el orden debe mantenerse. Si encuentras todas en orden, ¡ganaste!' },
      { dato: '!s1[j] → éxito', imagen: 'El índice j es un rastreador de pistas. Cuando j llega al Fantasma Cero de s1 (s1[j] = \\0), significa que encontró todas las pistas en orden. Si j se queda atascado, la búsqueda fracasó.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "faya",
      "modo": "buscar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int i = 0, j = 0;",
        "porque": "i recorre s1 (patrón), j recorre s2 (fuente).",
        "concepto": "variables"
      },
      {
        "codigo": "while (s2[j])",
        "porque": "Avanza por la cadena grande.",
        "concepto": "bucles"
      },
      {
        "codigo": "  if (s1[i] == s2[j]) i++;",
        "porque": "Si el carácter del patrón coincide EN ORDEN, avanza el patrón.",
        "concepto": "condicionales"
      },
      {
        "codigo": "  j++;",
        "porque": "La fuente siempre avanza.",
        "concepto": "bucles"
      },
      {
        "codigo": "if (s1[i] == \\0) imprime s1;",
        "porque": "Si consumiste todo el patrón, s1 estaba en orden dentro de s2.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué i solo avanza al coincidir?",
        "respuesta": "El patrón debe aparecer EN ORDEN; solo progresas cuando encuentras la siguiente letra esperada."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Dos índices: i recorre s1, j avanza en s2 solo cuando hay match',
    formula: 'while(s1[i]&&s2[j]){ if(s1[i]==s2[j])j++; i++; } if(!s2[j]) write(s2);',
    ejemplo: {
      entrada: 's1="foobar", s2="bar"',
      calculo: 'f≠b,o≠b,o≠b,b==b(j=1),a==a(j=2),r==r(j=3); s2[3]=\\0 → print "bar"',
      resultado: '"bar"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=wdmatch.c
file2=../../../../rendu/wdmatch/wdmatch.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 zpadinton "paqefwtdjetyiytjneytjoeyjnejeyj" > out1.txt 2>/dev/null
    ./out2 zpadinton "paqefwtdjetyiytjneytjoeyjnejeyj" > out2.txt 2>/dev/null

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

    ./out1 ddf6vewg64f gtwthgdwthdwfteewhrtag6h4ffdhsd > out1.txt 2>/dev/null
    ./out2 ddf6vewg64f gtwthgdwthdwfteewhrtag6h4ffdhsd > out2.txt 2>/dev/null

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

    ./out1 "rien" "cette phrase ne cache rien" > out1.txt 2>/dev/null
    ./out2 "rien" "cette phrase ne cache rien" > out2.txt 2>/dev/null

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

    ./out1 "rien" > out1.txt 2>/dev/null
    ./out2 "rien" > out2.txt 2>/dev/null

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

# 6. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "  lorem,ipsum  " "oooo"> out1.txt 2>/dev/null
    ./out2 "  lorem,ipsum  " "oooo" > out2.txt 2>/dev/null

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

    ./out1 "this        ...       is sparta, then again, maybe    not" "lol" > out1.txt 2>/dev/null
    ./out2 "this        ...       is sparta, then again, maybe    not" "lol" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["zpadinton","paqefwtdjetyiytjneytjoeyjnejeyj"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["ddf6vewg64f","gtwthgdwthdwfteewhrtag6h4ffdhsd"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["rien","cette phrase ne cache rien"], salida: "rien\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["rien"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["a","b"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["  lorem,ipsum  ","oooo"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["this        ...       is sparta, then again, maybe    not","lol"], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con dos índices i y j',
      descripcion: 'El patrón clásico de verificación de subsecuencia. i siempre avanza, j solo cuando hay match.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;
\tint\tj;

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
\t\tif (!argv[2][j])
\t\t{
\t\t\ti = 0;
\t\t\twhile (argv[2][i])
\t\t\t{
\t\t\t\twrite(1, &argv[2][i], 1);
\t\t\t\ti++;
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
      descripcion: 'Avanza punteros en vez de índices. Más compacto.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tchar\t*s1;
\tchar\t*s2;

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
\t\tif (!*s2)
\t\t{
\t\t\ts2 = argv[2];
\t\t\twhile (*s2)
\t\t\t\twrite(1, s2++, 1);
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

void ft_putstr(char const *str)
{
	int i = 0;

	while (str[i])
		write(1, &str[i++], 1);
}

int	main(int argc, char const *argv[])
{
	int i = 0;
	int j = 0;

	if (argc == 3)
	{
		while (argv[2][j])
			if (argv[2][j++] == argv[1][i])
				i += 1;
		if (!argv[1][i])
			ft_putstr(argv[1]);
	}
	write(1, "\\n", 1);
	return (0);
}`,
    },
  ],

  tests: [
    { id: 'test_bar', descripcion: '"foobar","bar" → "bar" (subsecuencia válida)', entrada: ['foobar', 'bar'], salida: 'bar\n', tipo: 'normal' },
    { id: 'test_rab', descripcion: '"foobar","rab" → "" (r antes de a pero no b a continuación)', entrada: ['foobar', 'rab'], salida: '\n', tipo: 'normal' },
    { id: 'test_heo', descripcion: '"hello","heo" → "heo" (h,e,o en orden en "hello")', entrada: ['hello', 'heo'], salida: 'heo\n', tipo: 'normal' },
    { id: 'test_oxe', descripcion: '"hello","oxe" → "" (no subsecuencia)', entrada: ['hello', 'oxe'], salida: '\n', tipo: 'normal' },
    { id: 'test_igual', descripcion: '"hello","hello" → "hello" (idéntico)', entrada: ['hello', 'hello'], salida: 'hello\n', tipo: 'edge' },
    { id: 'test_s2_mas_largo', descripcion: '"ab","abc" → "" (s2 más largo que s1)', entrada: ['ab', 'abc'], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 's1="foobar", s2="bar" — bucle principal',
      codigo: `i=0,j=0: s1[0]='f' != s2[0]='b' → i=1
i=1,j=0: s1[1]='o' != 'b' → i=2
i=2,j=0: s1[2]='o' != 'b' → i=3
i=3,j=0: s1[3]='b' == 'b' → j=1, i=4
i=4,j=1: s1[4]='a' == 'a' → j=2, i=5
i=5,j=2: s1[5]='r' == 'r' → j=3, i=6
s1[6]='\\0' → while FALSE`,
      variables: [
        { nombre: 'j final', valor: '3', cambio: true, nota: '← avanzó 3 veces' },
        { nombre: 'argv[2][3]', valor: "'\\0'", cambio: false, nota: '← todos encontrados' },
      ],
    },
    {
      paso: 2,
      titulo: '!argv[2][j]: j=3, s2[3]=\\0 → TRUE → imprimir s2',
      codigo: `argv[2][3] = '\\0'
!('\\0') = !(0) = TRUE
→ imprimir s2="bar":
  write('b'), write('a'), write('r')`,
      variables: [
        { nombre: 'condición', valor: '!s2[j] = TRUE', cambio: true, nota: '' },
        { nombre: 'salida', valor: '"bar"', cambio: true, nota: '✓' },
      ],
    },
    {
      paso: 3,
      titulo: 'Caso "foobar","rab" — r encontrado en pos 5 pero no hay a después',
      codigo: `i=0..4: f,o,o,b,a → 'r' no encontrado aún (j=0)
i=5: s1[5]='r' == s2[0]='r' → j=1, i=6
s1[6]='\\0' → while FALSE
s2[1]='a' ≠ '\\0' → !s2[j] = FALSE → no imprime`,
      variables: [
        { nombre: 'j final', valor: '1', cambio: true, nota: '← solo r encontrado' },
        { nombre: 'condición', valor: '!s2[1]="a" = FALSE', cambio: true, nota: '← no subsecuencia' },
        { nombre: 'salida', valor: '"" (solo \\n)', cambio: true, nota: '' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Avanzar j cuando NO hay match — j solo avanza en coincidencia',
      descripcion: 'j solo debe avanzar cuando s1[i]==s2[j]. Si avanza siempre, consume chars de s2 sin haberlos encontrado en s1.',
      codigoMal: `// ❌ j avanza siempre — no es subsecuencia correcta
while (s1[i] && s2[j]) {
    if (s1[i] == s2[j])
        write(1, &s2[j], 1);
    i++;
    j++;  // ← siempre avanza — incorrecto
}`,
      codigoBien: `// ✅ j solo avanza en match
while (s1[i] && s2[j]) {
    if (s1[i] == s2[j])
        j++;
    i++;  // i siempre avanza
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'Imprimir s2 char a char dentro del while, no después',
      descripcion: 'No se puede imprimir s2 durante la búsqueda — no sabemos aún si toda la subsecuencia está. Hay que verificar primero (!s2[j]) y luego imprimir.',
      codigoMal: `// ❌ Imprime durante la búsqueda — imprime parcial si falla
while (s1[i] && s2[j]) {
    if (s1[i] == s2[j]) {
        write(1, &s2[j], 1);  // imprime aunque no complete s2
        j++;
    }
    i++;
}`,
      codigoBien: `// ✅ Verificar PRIMERO, luego imprimir s2 completo
// ... while de búsqueda ...
if (!s2[j]) {
    // imprimir s2 desde el inicio
    i = 0;
    while (s2[i]) write(1, &s2[i++], 1);
}`,
    },
    {
      severidad: 'warning',
      titulo: 'Confundir subsecuencia con substring',
      descripcion: '"bar" es substring Y subsecuencia de "foobar". Pero "bor" es subsecuencia (b,o,r en orden) pero NO substring (no son contiguos). wdmatch busca subsecuencia, no substring.',
      codigoMal: `// ❌ Busca substring (chars contiguos) — incorrecto
// strstr("foobar", "bor") = NULL → error
// wdmatch("foobar", "bor") debería imprimir "bor" ✓`,
      codigoBien: `// ✅ Subsecuencia: chars en orden, no necesariamente contiguos
// "foobar" contiene b(pos3), o(pos4), r(pos5) → "bor" es subsecuencia`,
    },
  ],

  bajoCelCapot: `Una subsecuencia mantiene el ORDEN pero no la contigüidad.
"abc" es subsecuencia de "axbxc" (a→b→c en orden, con x de por medio).
"cba" NO es subsecuencia de "abc" (el orden está invertido).
Este algoritmo es O(n+m) — óptimo para verificación de subsecuencias.
Se usa en algoritmos de alineamiento de secuencias de ADN y LCS (Longest Common Subsequence).`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El patrón "dos índices: i siempre avanza, j solo en match" es el algoritmo clásico de verificación de subsecuencia. Hay que conocerlo de memoria.',
  relacionados: ['inter', 'union', 'ft_strpbrk'],
}
