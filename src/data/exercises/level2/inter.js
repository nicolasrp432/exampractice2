export default {
  id: 'inter',
  nombre: 'inter',
  nivel: 2,
  dificultad: 'difícil',
  tipoEntrega: 'programa',
  archivosEsperados: ['inter.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : inter
Expected files   : inter.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes two strings and prints, without doubles, the
characters that appear in both strings, in the order they appear in the
first one, followed by a newline.

If the number of arguments is not 2, just print a newline.

Example:
$> ./inter "padinton" "notpad"
padnto
$> ./inter "" "notpad"

$> ./inter "padinton" ""

$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : inter
Expected files   : inter.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes two strings and displays, without doubles, the
characters that appear in both strings, in the order they appear in the first
one.

The display will be followed by a \\n.

If the number of arguments is not 2, the program displays \\n.

Examples:

$>./inter "padinton" "paqefwtdjetyiytjneytjoeyjnejeyj" | cat -e
padinto$
$>./inter ddf6vewg64f gtwthgdwthdwfteewhrtag6h4ffdhsd | cat -e
df6ewg4$
$>./inter "rien" "cette phrase ne cache rien" | cat -e
rien$
$>./inter | cat -e
$`,

  descripcion: 'Programa que imprime los caracteres comunes a s1 y s2, en el orden de aparición en s1, sin duplicados. Usa función auxiliar iter() para buscar en s2, y tabla seen[] para evitar duplicados.',

  palacio: {
    habitacion: 'salon',
    mueble: 'fichero',
    personaje: 'El Archivero de Intersecciones',
    emoji: '🗂️',
    historia: `En el salón hay un Archivero que gestiona dos listas de invitados (s1 y s2).
Solo pasan a la lista final los que están en AMBAS listas.
El Archivero recorre s1 uno a uno: "¿está este en s2?" Si sí, escribe el nombre.
Pero tiene otra regla: "cada nombre solo una vez" — consulta su cuaderno seen[256].
DOBLE CONDICIÓN en iter(): avanzar mientras s2[j] && s2[j] != c.
Si sale por el \\0 → no encontrado. Si sale por coincidencia → encontrado.`,
    anclas: [
      "iter(s2, c): busca c en s2 — doble condición: s2[j] && s2[j]!=c",
      "si s2[j] != '\\0' al salir → c SÍ está en s2",
      "seen[256]={0}: marca los chars ya escritos",
      "solo escribir si iter(s2,c) && !seen[(unsigned char)c]",
      "argc != 3 → solo '\\n'",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe dos strings e imprime solo los caracteres que aparecen en AMBOS.
Para cada carácter del primer string, mira si también está en el segundo.
Si está en los dos y no lo ha imprimido antes, lo imprime.
Los caracteres repetidos solo se imprimen una vez.
El orden de salida sigue el orden del primer string.`,
    datosPuros: [
      { elemento: 'array seen[256] = {0}', nota: 'tabla de caracteres ya vistos para evitar duplicados' },
      { elemento: 'buscar s1[i] en s2 con un while', nota: 'doble bucle: i sobre s1, j sobre s2' },
      { elemento: 'imprimir solo si !seen[s1[i]]', nota: 'la comprobación de duplicados es obligatoria' },
    ],
    asociaciones: [
      { dato: 'array seen[256]', imagen: 'Inter lleva una lista de invitados de 256 casillas (una por carácter ASCII). Cuando imprime un carácter, tapa su casilla. La segunda vez que llega, la casilla está tapada y se va sin imprimir.' },
      { dato: 'orden del primer string', imagen: 'Es como un filtro de café: el primer string es el café y el segundo string es el filtro. Solo pasa lo que el filtro deja pasar (lo que está en ambos), en el orden en que cae (orden de s1).' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "padrino",
      "modo": "buscar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (s1[i])",
        "porque": "Recorre la primera cadena.",
        "concepto": "strings"
      },
      {
        "codigo": "  if (está_en(s2, s1[i]) && !ya_impreso(s1[i]))",
        "porque": "Imprime si aparece en s2 y no se imprimió antes.",
        "concepto": "bandera"
      },
      {
        "codigo": "    write(1, &s1[i], 1);",
        "porque": "Escribe el carácter común.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué controlar los ya impresos?",
        "respuesta": "inter no repite: cada carácter común se muestra una sola vez."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Para cada char de s1: si está en s2 y no ha salido antes, escribirlo',
    formula: 'for s1[i]: if iter(s2,s1[i]) && !seen[s1[i]]: write(s1[i]); seen[s1[i]]=1',
    ejemplo: {
      entrada: 's1="padinton", s2="notpad"',
      calculo: 'p→en s2,nuevo→p; a→en s2,nuevo→a; d→en s2,nuevo→d; i→no en s2; n→en s2,nuevo→n; t→en s2,nuevo→t; o→en s2,nuevo→o; n→seen',
      resultado: '"padnto"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=inter.c
file2=../../../../rendu/inter/inter.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 "padinton" "paqefwtdjetyiytjneytjoeyjnejeyj" > out1.txt 2>/dev/null
    ./out2 "padinton" "paqefwtdjetyiytjneytjoeyjnejeyj" > out2.txt 2>/dev/null

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

    ./out1 "ddf6vewg64f" "gtwthgdwthdwfteewhrtag6h4ffdhsd" > out1.txt 2>/dev/null
    ./out2 "ddf6vewg64f" "gtwthgdwthdwfteewhrtag6h4ffdhsd" > out2.txt 2>/dev/null

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

    ./out1 "Oupsi" "Oups" > out1.txt 2>/dev/null
    ./out2 "Oupsi" "Oups" > out2.txt 2>/dev/null

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

    ./out1 "Manger pour vivre" "Vivre pour manger" > out1.txt 2>/dev/null
    ./out2 "Manger pour vivre" "Vivre pour manger" > out2.txt 2>/dev/null

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

# 7. test
    gcc -w -o out1 "$file1"
    gcc -w -o out2 "$file2"

    ./out1 "Too" "Many" "Arguments" > out1.txt 2>/dev/null
    ./out2 "Too" "Many" "Arguments" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["padinton","paqefwtdjetyiytjneytjoeyjnejeyj"], salida: "padinto\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["ddf6vewg64f","gtwthgdwthdwfteewhrtag6h4ffdhsd"], salida: "df6ewg4\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["rien","cette phrase ne cache rien"], salida: "rien\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Oupsi","Oups"], salida: "Oups\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["Manger pour vivre","Vivre pour manger"], salida: "anger pouvi\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: [], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["Too","Many","Arguments"], salida: "\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con función auxiliar iter() y seen[256]',
      descripcion: 'La trampa es iter(): doble condición en el while. La más correcta para el examen.',
      recomendada: true,
      codigo: `#include <unistd.h>

static int\titer(char *s, char c)
{
\tint\tj;

\tj = 0;
\twhile (s[j] && s[j] != c)
\t\tj++;
\treturn (s[j] == c);
}

int\tmain(int argc, char **argv)
{
\tint\t\ti;
\tint\t\tseen[256];
\tchar\tc;

\tif (argc == 3)
\t{
\t\ti = 0;
\t\tft_bzero(seen, sizeof(seen));
\t\twhile (argv[1][i])
\t\t{
\t\t\tc = argv[1][i];
\t\t\tif (iter(argv[2], c) && !seen[(unsigned char)c])
\t\t\t{
\t\t\t\twrite(1, &c, 1);
\t\t\t\tseen[(unsigned char)c] = 1;
\t\t\t}
\t\t\ti++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'sin_bzero',
      nombre: 'Sin ft_bzero (inicialización manual)',
      descripcion: 'Inicializa seen[] con un bucle. Más verboso pero sin depender de bzero.',
      recomendada: false,
      codigo: `#include <unistd.h>

static int\titer(char *s, char c)
{
\tint\tj;

\tj = 0;
\twhile (s[j] && s[j] != c)
\t\tj++;
\treturn (s[j] == c);
}

int\tmain(int argc, char **argv)
{
\tint\t\ti;
\tint\t\tseen[256];
\tchar\tc;

\ti = 0;
\twhile (i < 256)
\t\tseen[i++] = 0;
\tif (argc == 3)
\t{
\t\ti = 0;
\t\twhile (argv[1][i])
\t\t{
\t\t\tc = argv[1][i];
\t\t\tif (iter(argv[2], c) && !seen[(unsigned char)c])
\t\t\t{
\t\t\t\twrite(1, &c, 1);
\t\t\t\tseen[(unsigned char)c] = 1;
\t\t\t}
\t\t\ti++;
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
      codigo: `
#include <unistd.h>

int	main(int ac, char **av)
{
	int	i;
	int k;
	int l;
	char *s1;
	char *s2;

	i = 0;
	l = 0;
	if (ac == 3)
	{
		s1 = av[1];
		s2 = av[2];
		while (s1[i] != '\\0')
		{
			k = 0;
			while (s2[k] != '\\0')
			{
				if(s1[i] == s2[k])
				{ 
					l = 0;
					while (s1[l] != s1[i])
						l++;
					if (l == i)
					{
						l = 0;
						while (s2[l] != s2[k])
							l++;
						if (l == k)
							write(1, &s1[i], 1);
					}
				}
				k++;
			}
			i++;
		}
	}
	write(1, "\\n", 1);
}`,
    },
  ],

  tests: [
    { id: 'test_clasico', descripcion: '"padinton","notpad" → "padnto"', entrada: ['padinton', 'notpad'], salida: 'padnto\n', tipo: 'normal' },
    { id: 'test_hello_world', descripcion: '"hello","world" → "lo" (solo l y o comunes)', entrada: ['hello', 'world'], salida: 'lo\n', tipo: 'normal' },
    { id: 'test_sin_comun', descripcion: '"abc","xyz" → "" (ninguno en común)', entrada: ['abc', 'xyz'], salida: '\n', tipo: 'edge' },
    { id: 'test_iguales', descripcion: '"hello","hello" → "helo" (sin duplicados)', entrada: ['hello', 'hello'], salida: 'helo\n', tipo: 'normal' },
    { id: 'test_s1_vacio', descripcion: '"","abc" → "" (s1 vacío)', entrada: ['', 'abc'], salida: '\n', tipo: 'edge' },
    { id: 'test_s2_vacio', descripcion: '"hello","" → "" (s2 vacío → nada en común)', entrada: ['hello', ''], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 's1="padinton", s2="notpad" — i=0, c="p"',
      codigo: `c = 'p'
iter("notpad", 'p'):
  j=0: 'n'!='p' && 'n'→ j++
  j=1: 'o'!='p' && 'o'→ j++
  j=2: 't'!='p' && 't'→ j++
  j=3: 'p'=='p' → para
  s[3]='p' == 'p' → return 1
seen['p']=0 → write('p'); seen['p']=1`,
      variables: [
        { nombre: 'c', valor: "'p'", cambio: false, nota: '' },
        { nombre: 'iter result', valor: '1 (encontrado)', cambio: true, nota: '' },
        { nombre: 'salida', valor: '"p"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=3, c="i" — NO está en s2',
      codigo: `c = 'i'
iter("notpad", 'i'):
  j=0..5: n,o,t,p,a,d ≠ 'i'
  j=6: '\\0' → para
  s[6]='\\0' ≠ 'i' → return 0
→ no escribe`,
      variables: [
        { nombre: 'c', valor: "'i'", cambio: false, nota: '' },
        { nombre: 'iter result', valor: '0 (no encontrado)', cambio: true, nota: '← \\0 al salir' },
      ],
    },
    {
      paso: 3,
      titulo: 'i=7, c="n" — segunda n → seen ya activo',
      codigo: `c = 'n'
iter("notpad", 'n') → 1 (n en s2)
seen['n'] = 1  ← ya se escribió en i=4
→ condición: iter && !seen → 1 && !1 = FALSE
→ no escribe (sin duplicados)`,
      variables: [
        { nombre: "seen['n']", valor: '1 (ya visto)', cambio: false, nota: '← bloquea duplicado' },
      ],
    },
    {
      paso: 4,
      titulo: 'Fin: write("\\n")',
      codigo: `// Resultado acumulado: p,a,d,n,t,o
write(1, "\\n", 1)
// Salida: "padnto\\n"`,
      variables: [
        { nombre: 'salida final', valor: '"padnto\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'iter() con solo una condición: while (s[j] != c) — loop infinito si no está',
      descripcion: 'Si c no está en s2, el while nunca para (lee más allá del \\0). La doble condición s[j] && s[j]!=c es esencial.',
      codigoMal: `// ❌ Sin verificar '\\0' → loop infinito
static int iter(char *s, char c) {
    int j = 0;
    while (s[j] != c)  // si c no está: loop infinito o UB
        j++;
    return (1);  // siempre devuelve 1 — incorrecto
}`,
      codigoBien: `// ✅ Doble condición
static int iter(char *s, char c) {
    int j = 0;
    while (s[j] && s[j] != c)  // para en '\\0' o en match
        j++;
    return (s[j] == c);  // '\\0' → no encontrado; c → encontrado
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'No usar seen[] → imprime duplicados',
      descripcion: 'Si s1="hello" y s2="hello", sin seen[] imprimiría "helllo" (l dos veces). Hay que marcar cada char ya escrito.',
      codigoMal: `// ❌ Sin deduplicación
while (argv[1][i]) {
    c = argv[1][i];
    if (iter(argv[2], c))
        write(1, &c, 1);  // imprime l dos veces si l aparece dos veces en s1
    i++;
}`,
      codigoBien: `// ✅ Con seen[256]
if (iter(argv[2], c) && !seen[(unsigned char)c]) {
    write(1, &c, 1);
    seen[(unsigned char)c] = 1;
}`,
    },
    {
      severidad: 'warning',
      titulo: 'argc != 3 vs argc != 2 — el programa tiene nombre como argv[0]',
      descripcion: 'argv[0] = nombre del programa, argv[1] = s1, argv[2] = s2. Con 2 strings de entrada, argc=3.',
      codigoMal: `// ❌ Condición incorrecta
if (argc != 2) ...  // falta el nombre del programa`,
      codigoBien: `// ✅
if (argc == 3) {
    // argv[1] = s1, argv[2] = s2
}
write(1, "\\n", 1);`,
    },
  ],

  bajoCelCapot: `iter() termina en '\\0' (no encontrado) o en match (encontrado).
La diferencia con union: inter busca chars que estén en AMBOS; union combina ambos sin repetir.
seen[256] usa el valor ASCII como índice — cubre todos los bytes posibles (0..255).
El cast (unsigned char) evita índices negativos para chars > 127.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'inter es la combinación de iter() (búsqueda en string) + seen[256] (deduplicación). Ambos patrones aparecen en union, ft_strpbrk y otros ejercicios.',
  relacionados: ['union', 'ft_strpbrk', 'ft_strcspn'],
}
