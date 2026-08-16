export default {
  id: 'union',
  nombre: 'union',
  nivel: 2,
  dificultad: 'difícil',
  tipoEntrega: 'programa',
  archivosEsperados: ['union.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : union
Expected files   : union.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes two strings and prints, without doubles, the
characters that appear in either one of the strings.

The display will be in the order characters appear in the command line, and
will be followed by a newline.

If the number of arguments is not 2, the program displays a newline.

Example:
$> ./union "zpadinton" "notpad" | cat -e
zpadinto$
$> ./union "" "notpad" | cat -e
notpad$
$> ./union | cat -e
$
$>`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : union
Expected files   : union.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes two strings and displays, without doubles, the
characters that appear in either one of the strings.

The display will be in the order characters appear in the command line, and
will be followed by a \\n.

If the number of arguments is not 2, the program displays \\n.

Example:

$>./union zpadinton "paqefwtdjetyiytjneytjoeyjnejeyj" | cat -e
zpadintoqefwjy$
$>./union ddf6vewg64f gtwthgdwthdwfteewhrtag6h4ffdhsd | cat -e
df6vewg4thras$
$>./union "rien" "cette phrase ne cache rien" | cat -e
rienct phas$
$>./union | cat -e
$
$>
$>./union "rien" | cat -e
$
$>`,

  descripcion: 'Programa que imprime todos los chars de s1 y s2 combinados, sin duplicados, en orden de aparición. Usa tabla visto[256] con índice (unsigned char) para marcar chars ya escritos.',

  palacio: {
    habitacion: 'salon',
    mueble: 'maceta',
    personaje: 'El Jardinero de Caracteres',
    emoji: '🌱',
    historia: `En el salón hay un Jardinero con una maceta enorme donde cabe todo.
Le das dos bolsas de semillas (s1 y s2).
El Jardinero planta cada semilla EN ORDEN: primero las de s1, luego las de s2.
Si ya plantó esa semilla antes, no la repite — mira su libro visto[256].
CLAVE: el índice es (unsigned char)c para evitar acceso con índice negativo.
Al final, la maceta tiene todos los chars únicos en orden de primera aparición.`,
    anclas: [
      "visto[256] = {0}  ← tabla de chars ya vistos",
      "recorrer s1+s2 en orden (primero s1, luego s2)",
      "if (!visto[(unsigned char)c]): write(c); visto[(unsigned char)c]=1",
      "argc != 3 → solo '\\n'",
      "(unsigned char) evita índices negativos para chars > 127",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe dos strings e imprime todos los caracteres que aparecen en cualquiera de los dos, sin repetir.
Primero recorre el primer string e imprime cada carácter que no haya imprimido antes.
Luego hace lo mismo con el segundo string.
Los caracteres duplicados (tanto dentro de un string como entre los dos) solo se imprimen una vez.
El orden de salida sigue el orden del primer string, luego el del segundo.`,
    datosPuros: [
      { elemento: 'int seen[256] = {0}', nota: 'array de 256 para marcar qué caracteres ya fueron impresos' },
      { elemento: 'if (!seen[(unsigned char)c])', nota: 'imprimir solo si no se ha visto antes' },
      { elemento: 'seen[(unsigned char)c] = 1', nota: 'marcar como visto después de imprimir' },
    ],
    asociaciones: [
      { dato: 'seen[256] como filtro', imagen: 'Un club con 256 puertas (una por carácter ASCII). La primera vez que un personaje entra, le estampan el sello (seen = 1) y pasa. La segunda vez que llega, el portero ve el sello y no le deja entrar. Así no hay duplicados en la fiesta (el output).' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "zpadinton",
      "modo": "buscar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "recorre s1, luego s2",
        "porque": "Une los caracteres de ambas cadenas.",
        "concepto": "strings"
      },
      {
        "codigo": "  if (!ya_impreso(c))",
        "porque": "Solo imprime cada carácter la primera vez que aparece.",
        "concepto": "bandera"
      },
      {
        "codigo": "    write(1, &c, 1); marca c como visto",
        "porque": "Escribe y registra para no repetir.",
        "concepto": "strings"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿En qué se diferencia de inter?",
        "respuesta": "union junta TODOS los caracteres únicos de ambas; inter solo los que están en las dos."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Recorrer s1 luego s2: para cada char, si no está en visto, escribirlo y marcarlo',
    formula: 'for c in s1+s2: if !visto[(uchar)c]: write(c); visto[(uchar)c]=1',
    ejemplo: {
      entrada: 's1="hello", s2="world"',
      calculo: 'h→nuevo; e→nuevo; l→nuevo; l→visto; o→nuevo; w→nuevo; o→visto; r→nuevo; l→visto; d→nuevo',
      resultado: '"helowrd"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=union.c
file2=../../../../rendu/union/union.c


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
    { id: 'tester_1', entrada: ["zpadinton","paqefwtdjetyiytjneytjoeyjnejeyj"], salida: "zpadintoqefwjy\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["ddf6vewg64f","gtwthgdwthdwfteewhrtag6h4ffdhsd"], salida: "df6vewg4thras\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["rien","cette phrase ne cache rien"], salida: "rienct phas\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["rien"], salida: "\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["a","b"], salida: "ab\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["  lorem,ipsum  ","oooo"], salida: " lorem,ipsu\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["this        ...       is sparta, then again, maybe    not","lol"], salida: "this .par,engmybol\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con tabla visto[256] e índice (unsigned char)',
      descripcion: 'La más segura y correcta. Inicializa visto[] con un bucle.',
      recomendada: true,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\t\t\ti;
\tint\t\t\tvisto[256];
\tchar\t\tc;

\ti = 0;
\twhile (i < 256)
\t\tvisto[i++] = 0;
\tif (argc == 3)
\t{
\t\ti = 0;
\t\twhile (argv[1][i])
\t\t{
\t\t\tc = argv[1][i];
\t\t\tif (!visto[(unsigned char)c])
\t\t\t{
\t\t\t\twrite(1, &c, 1);
\t\t\t\tvisto[(unsigned char)c] = 1;
\t\t\t}
\t\t\ti++;
\t\t}
\t\ti = 0;
\t\twhile (argv[2][i])
\t\t{
\t\t\tc = argv[2][i];
\t\t\tif (!visto[(unsigned char)c])
\t\t\t{
\t\t\t\twrite(1, &c, 1);
\t\t\t\tvisto[(unsigned char)c] = 1;
\t\t\t}
\t\t\ti++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'compacta',
      nombre: 'Con función auxiliar print_unique()',
      descripcion: 'Separa la lógica de escritura única en una función. Más limpia.',
      recomendada: false,
      codigo: `#include <unistd.h>

static void\tprint_unique(char *s, int *visto)
{
\tint\ti;
\tchar\tc;

\ti = 0;
\twhile (s[i])
\t{
\t\tc = s[i];
\t\tif (!visto[(unsigned char)c])
\t\t{
\t\t\twrite(1, &c, 1);
\t\t\tvisto[(unsigned char)c] = 1;
\t\t}
\t\ti++;
\t}
}

int\tmain(int argc, char **argv)
{
\tint\t\tvisto[256];
\tint\t\ti;

\ti = 0;
\twhile (i < 256)
\t\tvisto[i++] = 0;
\tif (argc == 3)
\t{
\t\tprint_unique(argv[1], visto);
\t\tprint_unique(argv[2], visto);
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

int check(int c, char *str, int index)
{
	int i = 0;
	
	while(i < index)
	{
		if (str[i] == c)
			return 0;
		i++;
	}
	return  1;
}

int main(int argc, char **argv)
{	
	int i = 0;
	int j = 0;
	int k = 0;
	
	if (argc == 3)
	{
		while(argv[1][i] != '\\0')
		{
			i++;
		}
		while(argv[2][j] != '\\0')
		{
			argv[1][i] = argv[2][j];
			i++;
			j++;
		}
		i--;
		while(k <= i)
		{
			if(check(argv[1][k], argv[1], k) == 1) 
				write (1, &argv[1][k], 1); 
			k++;
		}
	}
	write (1, "\\n", 1);
}`,
    },
  ],

  tests: [
    { id: 'test_clasico', descripcion: '"zpadinton","notpad" → "zpadinto"', entrada: ['zpadinton', 'notpad'], salida: 'zpadinto\n', tipo: 'normal' },
    { id: 'test_hello_world', descripcion: '"hello","world" → "helowrd"', entrada: ['hello', 'world'], salida: 'helowrd\n', tipo: 'normal' },
    { id: 'test_s1_vacio', descripcion: '"","notpad" → "notpad"', entrada: ['', 'notpad'], salida: 'notpad\n', tipo: 'edge' },
    { id: 'test_s2_vacio', descripcion: '"hello","" → "helo"', entrada: ['hello', ''], salida: 'helo\n', tipo: 'edge' },
    { id: 'test_ambos_vacios', descripcion: '"","" → "" (nada)', entrada: ['', ''], salida: '\n', tipo: 'edge' },
    { id: 'test_sin_comun', descripcion: '"abc","xyz" → "abcxyz"', entrada: ['abc', 'xyz'], salida: 'abcxyz\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Inicializar visto[256] a 0',
      codigo: `i = 0;
while (i < 256)
    visto[i++] = 0;
// Todos los 256 slots a 0 (ningún char visto)`,
      variables: [
        { nombre: 'visto', valor: '[0,0,0,...,0] (256 ceros)', cambio: true, nota: '← clean state' },
      ],
    },
    {
      paso: 2,
      titulo: 'Recorrer s1="hello": h,e,l son nuevos',
      codigo: `s1[0]='h': visto['h']=0 → write('h'); visto['h']=1
s1[1]='e': visto['e']=0 → write('e'); visto['e']=1
s1[2]='l': visto['l']=0 → write('l'); visto['l']=1
s1[3]='l': visto['l']=1 → NO escribe
s1[4]='o': visto['o']=0 → write('o'); visto['o']=1
salida hasta ahora: "helo"`,
      variables: [
        { nombre: 'salida', valor: '"helo"', cambio: true, nota: '' },
        { nombre: "visto['l']", valor: '1', cambio: true, nota: '← duplicado bloqueado' },
      ],
    },
    {
      paso: 3,
      titulo: 'Recorrer s2="world": w,r,d son nuevos; o,l ya vistos',
      codigo: `s2[0]='w': visto['w']=0 → write('w')
s2[1]='o': visto['o']=1 → NO escribe
s2[2]='r': visto['r']=0 → write('r')
s2[3]='l': visto['l']=1 → NO escribe
s2[4]='d': visto['d']=0 → write('d')
salida: "helowrd"`,
      variables: [
        { nombre: 'salida', valor: '"helowrd"', cambio: true, nota: '' },
      ],
    },
    {
      paso: 4,
      titulo: 'write("\\n")',
      codigo: `write(1, "\\n", 1)
// Salida final: "helowrd\\n"`,
      variables: [
        { nombre: 'salida final', valor: '"helowrd\\n"', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Usar char c como índice de visto[] sin cast → índice negativo',
      descripcion: 'En muchas plataformas char es signed (-128..127). Si c=200 (un char extendido), visto[c] sería visto[-56] → segfault. El cast a (unsigned char) lo hace 0..255.',
      codigoMal: `// ❌ Sin cast: char puede ser negativo → acceso fuera de rango
char c = argv[1][i];
if (!visto[c])  // si c > 127, c es negativo → crash`,
      codigoBien: `// ✅ Cast a unsigned char → siempre 0..255
char c = argv[1][i];
if (!visto[(unsigned char)c]) {
    write(1, &c, 1);
    visto[(unsigned char)c] = 1;
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'No inicializar visto[] → valores basura de la pila',
      descripcion: 'int visto[256] sin inicializar contiene basura. Algunos chars parecerán "ya vistos" y no se imprimirán. Siempre inicializar a 0.',
      codigoMal: `// ❌ Sin inicializar → comportamiento indefinido
int visto[256];  // contiene basura de la pila`,
      codigoBien: `// ✅ Inicializar a 0 manualmente (o con memset si está permitido)
int visto[256];
int i = 0;
while (i < 256)
    visto[i++] = 0;`,
    },
    {
      severidad: 'warning',
      titulo: 'Confundir union (todos únicos) con inter (solo comunes)',
      descripcion: 'union: chars de s1 O s2 (todos, sin repetir). inter: chars de s1 QUE ESTÁN EN s2. Son complementarios.',
      codigoMal: `// ❌ Confusión: comprueba si c está en s2 antes de escribirlo → inter, no union
if (!visto[(unsigned char)c] && iter(argv[2], c))
    write(1, &c, 1);`,
      codigoBien: `// ✅ union: no comprueba si c está en s2
if (!visto[(unsigned char)c]) {
    write(1, &c, 1);
    visto[(unsigned char)c] = 1;
}`,
    },
  ],

  bajoCelCapot: `visto[256] indexado por (unsigned char) es el patrón estándar para "¿he visto este byte antes?".
La diferencia con inter: union incluye todos los chars de ambos strings; inter solo los que están en ambos.
El orden importa: primero s1 completo, luego s2 completo — los chars de s1 siempre van primero.
Para strings vacíos: el while de recorrido no entra, simplemente se salta.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'El patrón visto[256]+(unsigned char) es universal para deduplicación de bytes. Aparece en union, inter, y cualquier problema de "chars únicos".',
  relacionados: ['inter', 'ft_strpbrk', 'ft_strcspn'],
}
