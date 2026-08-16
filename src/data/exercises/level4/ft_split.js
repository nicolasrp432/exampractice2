export default {
  id: 'ft_split',
  nombre: 'ft_split',
  nivel: 4,
  dificultad: 'difícil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_split.c'],
  funcionesPermitidas: ['malloc'],

  subject: `Assignment name  : ft_split
Expected files   : ft_split.c
Allowed functions: malloc
--------------------------------------------------------------------------------

Write a function that splits a string into an array of strings, using the
character c as the delimiter.

char\t**ft_split(char *str, char c);

The array must end with a NULL pointer.

There should be no empty strings in the result.

If str is NULL, return NULL.

Example:
ft_split("hello world foo", ' ')  → {"hello", "world", "foo", NULL}
ft_split("hello::world", ':')     → {"hello", "world", NULL}
ft_split("  spaces  ", ' ')       → {"spaces", NULL}`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_split
Expected files   : ft_split.c
Allowed functions: malloc
--------------------------------------------------------------------------------

Write a function that takes a string, splits it into words, and returns them as
a NULL-terminated array of strings.

A "word" is defined as a part of a string delimited either by spaces/tabs/new
lines, or by the start/end of the string.

Your function must be declared as follows:

char    **ft_split(char *str);`,

  descripcion: 'Función que divide un string por un delimitador y devuelve un array de strings (terminado en NULL). Requiere malloc para el array de punteros y para cada substring. Sin strings vacíos en el resultado.',

  palacio: {
    habitacion: 'garaje',
    mueble: 'sierra',
    personaje: 'La Sierra Divisora',
    emoji: '🪚',
    historia: `En el garaje hay una Sierra que corta strings en trozos.
Le das un string y un carácter separador, y la Sierra lo divide en palabras.
El proceso tiene DOS pasadas:
PASADA 1: contar cuántas palabras hay (para malloc del array).
PASADA 2: para cada palabra, malloc de su longitud y copiar.
La Sierra ignora los separadores múltiples — sin strings vacíos.`,
    anclas: [
      "Pasada 1: count_words(str,c) → contar palabras",
      "malloc((words+1) * sizeof(char*)) → +1 para NULL final",
      "Pasada 2: saltar separadores, calcular longitud de palabra, malloc+copiar",
      "poner resultado[words] = NULL al final",
      "si str==NULL → return NULL",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función divide un string en palabras usando un carácter separador.
Primero cuenta cuántas palabras hay (para saber cuántos strings malloc necesita).
Luego crea un array de strings con malloc (de words + 1 elementos, el último NULL).
Para cada palabra, calcula su longitud, hace malloc, y la copia.
Devuelve el array de strings (array terminado en NULL).`,
    datosPuros: [
      { elemento: 'char **ft_split(char const *s, char c)', nota: 'devuelve char** (array de strings), terminado en NULL' },
      { elemento: 'resultado[word_count] = NULL', nota: 'el último elemento del array debe ser NULL' },
      { elemento: 'malloc para el array y malloc para cada palabra', nota: 'dos niveles de malloc — free del caller es su responsabilidad' },
    ],
    asociaciones: [
      { dato: 'char** terminado en NULL', imagen: 'ft_split entrega un edificio de apartamentos (char**). El último apartamento está vacío y tiene el cartel "NULL — fin del edificio". Sin ese cartel, quien recorra el edificio no sabe cuándo parar.' },
      { dato: 'dos niveles de malloc', imagen: 'Para construir el edificio necesitas dos tipos de cemento: uno para las paredes del edificio (malloc del char**) y otro para el interior de cada apartamento (malloc de cada char*). Si fallas en uno, el edificio se derrumba.' },
    ],
  },

  animacion: {
    "tipo": "word-split",
    "config": {
      "cadena": "  hola mundo foo ",
      "modo": "todos"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "cuenta cuántas palabras hay",
        "porque": "Para reservar el array de punteros.",
        "concepto": "bandera"
      },
      {
        "codigo": "char **res = malloc(sizeof(char*) * (n + 1));",
        "porque": "n cadenas + 1 hueco para el NULL final.",
        "concepto": "malloc"
      },
      {
        "codigo": "por cada palabra: res[i] = ft_strndup(palabra);",
        "porque": "Copia cada palabra en su propia cadena.",
        "concepto": "strings"
      },
      {
        "codigo": "res[n] = NULL;",
        "porque": "Cierra el array con NULL.",
        "concepto": "malloc"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué n + 1 punteros?",
        "respuesta": "El último debe ser NULL para saber dónde acaba el array de cadenas."
      },
      {
        "pregunta": "¿Por qué cada palabra en su propio malloc?",
        "respuesta": "Cada string necesita su propio bloque terminado en \\0, independiente de los demás."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Dos pasadas: contar palabras → malloc array → extraer cada palabra',
    formula: 'words=count(str,c); res=malloc((words+1)*ptr_size); for each word: skip_sep; get_len; malloc+copy; res[i]=word;',
    ejemplo: {
      entrada: '"hello world foo", sep=" "',
      calculo: 'words=3; malloc(4 ptrs); "hello"→malloc(6)+"hello\\0"; "world"→6; "foo"→4; res[3]=NULL',
      resultado: '{"hello","world","foo",NULL}',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_split.c
file2=../../../../rendu/ft_split/ft_split.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

    ./out1 "three words apart" > out1.txt 2>/dev/null
    ./out2 "three words apart" > out2.txt 2>/dev/null

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

    ./out1 "  starting and ending   " > out1.txt 2>/dev/null
    ./out2 "  starting and ending   " > out2.txt 2>/dev/null

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

    ./out1 "t a b c " > out1.txt 2>/dev/null
    ./out2 "t a b c " > out2.txt 2>/dev/null

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

    ./out1 "    " > out1.txt 2>/dev/null
    ./out2 "    " > out2.txt 2>/dev/null

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

    ./out1 "    a  " > out1.txt 2>/dev/null
    ./out2 "    a  " > out2.txt 2>/dev/null

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

    ./out1 "    b" > out1.txt 2>/dev/null
    ./out2 "    b" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["three words apart"], salida: "three words apart (null)\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["  starting and ending   "], salida: "starting and ending (null)\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["t a b c "], salida: "t a b c (null)\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["    "], salida: "(null) (null)\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["    a  "], salida: "a (null)\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["    b"], salida: "b (null)\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con count_words y extracción en bucle',
      descripcion: 'Dos funciones auxiliares: count_words y extract_word. La más legible.',
      recomendada: true,
      codigo: `#include <stdlib.h>

static int\tcount_words(char *str, char c)
{
\tint\tcount;
\tint\tin_word;

\tcount = 0;
\tin_word = 0;
\twhile (*str)
\t{
\t\tif (*str == c)
\t\t\tin_word = 0;
\t\telse if (!in_word)
\t\t{
\t\t\tcount++;
\t\t\tin_word = 1;
\t\t}
\t\tstr++;
\t}
\treturn (count);
}

static char\t*extract_word(char *str, char c, int *i)
{
\tchar\t*word;
\tint\t\tlen;
\tint\t\tj;

\twhile (str[*i] == c)
\t\t(*i)++;
\tlen = 0;
\twhile (str[*i + len] && str[*i + len] != c)
\t\tlen++;
\tword = (char *)malloc(len + 1);
\tif (!word)
\t\treturn (NULL);
\tj = 0;
\twhile (j < len)
\t{
\t\tword[j] = str[*i + j];
\t\tj++;
\t}
\tword[j] = '\\0';
\t*i += len;
\treturn (word);
}

char\t**ft_split(char *str, char c)
{
\tchar\t**result;
\tint\t\twords;
\tint\t\ti;
\tint\t\tj;

\tif (!str)
\t\treturn (NULL);
\twords = count_words(str, c);
\tresult = (char **)malloc((words + 1) * sizeof(char *));
\tif (!result)
\t\treturn (NULL);
\ti = 0;
\tj = 0;
\twhile (j < words)
\t{
\t\tresult[j] = extract_word(str, c, &i);
\t\tif (!result[j])
\t\t{
\t\t\twhile (j > 0)
\t\t\t\tfree(result[--j]);
\t\t\tfree(result);
\t\t\treturn (NULL);
\t\t}
\t\tj++;
\t}
\tresult[j] = NULL;
\treturn (result);
}`,
    },
    {
      id: 'punteros',
      nombre: 'Con punteros y helpers pequeños',
      descripcion: 'Usa punteros para contar y copiar palabras con una estructura un poco más lineal.',
      recomendada: false,
      codigo: `#include <stdlib.h>

static int\tcount_words(char *str, char c)
{
\tint\tcount;
\tint\tin_word;

\tcount = 0;
\tin_word = 0;
\twhile (*str)
\t{
\t\tif (*str == c)
\t\t\tin_word = 0;
\t\telse if (!in_word)
\t\t{
\t\t\tcount++;
\t\t\tin_word = 1;
\t\t}
\t\tstr++;
\t}
\treturn (count);
}

static char\t*copy_word(char *str, char c, int *index)
{
\tchar\t*word;
\tint\t\tlen;
\tint\t\tj;

\twhile (str[*index] == c)
\t\t(*index)++;
\tlen = 0;
\twhile (str[*index + len] && str[*index + len] != c)
\t\tlen++;
\tword = (char *)malloc(len + 1);
\tif (!word)
\t\treturn (NULL);
\tj = 0;
\twhile (j < len)
\t{
\t\tword[j] = str[*index + j];
\t\tj++;
\t}
\tword[j] = '\\0';
\t*index += len;
\treturn (word);
}

char\t**ft_split(char *str, char c)
{
\tchar\t**result;
\tint\t\twords;
\tint\t\tindex;
\tint\t\tj;

\tif (!str)
\t\treturn (NULL);
\twords = count_words(str, c);
\tresult = (char **)malloc((words + 1) * sizeof(char *));
\tif (!result)
\t\treturn (NULL);
\tindex = 0;
\tj = 0;
\twhile (j < words)
\t{
\t\tresult[j] = copy_word(str, c, &index);
\t\tif (!result[j])
\t\t{
\t\t\twhile (j > 0)
\t\t\t\tfree(result[--j]);
\t\t\tfree(result);
\t\t\treturn (NULL);
\t\t}
\t\tj++;
\t}
\tresult[j] = NULL;
\treturn (result);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <stdlib.h>

int	ft_wordlen(char *str)
{
	int i = 0;

	while (str[i] != '\\0' && str[i] != ' ' && str[i] != '\\t' && str[i] != '\\n')
		++i;
	return (i);
}

char	*word_dupe(char *str)
{
	int i = 0;
	int len = ft_wordlen(str);
	char *word = malloc(sizeof(char) * (len + 1));
	
	word[len] = '\\0';
	while (i < len)
	{
		word[i] = str[i];
		++i;
	}
	return (word);
}

void	fill_words(char **array, char *str)
{
	int word_index = 0;
	
	while (*str == ' ' || *str == '\\t' || *str == '\\n')
		++str;
	while (*str != '\\0')
	{
		array[word_index] = word_dupe(str);
		++word_index;
		while (*str != '\\0' && *str != ' ' && *str != '\\t' && *str != '\\n')
			++str;
		while (*str == ' ' || *str == '\\t' || *str == '\\n')
			++str;
	}
}

int		count_words(char *str)
{
	int num_words = 0;
	
	while (*str == ' ' || *str == '\\t' || *str == '\\n')
		++str;
	while (*str != '\\0')
	{
		++num_words;
		while (*str != '\\0' && *str != ' ' && *str != '\\t' && *str != '\\n')
			++str;
		while (*str == ' ' || *str == '\\t' || *str == '\\n')
			++str;
	}
	return (num_words);
}

char	**ft_split(char *str)
{
	int		num_words;
	char	**array;
	
	num_words = count_words(str);
	array = malloc(sizeof(char *) * (num_words + 1));
	
	array[num_words] = 0;
	fill_words(array, str);
	return (array);
}`,
    },
  ],

  tests: [
    { id: 'test_spaces', descripcion: '"hello world foo" por " " → 3 palabras', entrada: ['hello world foo', ' '], salida: 'hello\nworld\nfoo\n', tipo: 'normal' },
    { id: 'test_colon', descripcion: '"hello::world" por ":" → 2 palabras', entrada: ['hello::world', ':'], salida: 'hello\nworld\n', tipo: 'normal' },
    { id: 'test_leading_sep', descripcion: '"  spaces  " por " " → 1 palabra', entrada: ['  spaces  ', ' '], salida: 'spaces\n', tipo: 'normal' },
    { id: 'test_single', descripcion: '"hello" sin sep → 1 palabra', entrada: ['hello', ' '], salida: 'hello\n', tipo: 'normal' },
    { id: 'test_no_sep', descripcion: 'sep no aparece → string completo', entrada: ['hello', ':'], salida: 'hello\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'ft_split("hello world", " "): contar y extraer',
      codigo: `count_words("hello world", ' '):
  'h'..'o': in_word=1, count=1
  ' ': in_word=0
  'w'..'d': in_word=1, count=2
  → words=2

malloc(3 * sizeof(char*)) → result[3]

extract_word: skip ' ', len=5 ("hello"), malloc(6), copy "hello\\0"
  i=5
extract_word: skip ' ', i=6, len=5 ("world"), malloc(6), copy "world\\0"
result[2] = NULL`,
      variables: [
        { nombre: 'result[0]', valor: '"hello"', cambio: true, nota: '' },
        { nombre: 'result[1]', valor: '"world"', cambio: true, nota: '' },
        { nombre: 'result[2]', valor: 'NULL', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Olvidar el NULL al final del array',
      descripcion: 'El enunciado especifica que el array termina en NULL. Sin él, el código que usa el resultado no sabe dónde termina el array.',
      codigoMal: `// ❌ Sin NULL final
result = malloc(words * sizeof(char*));
// ... llenar result[0..words-1]
// result[words] no asignado → comportamiento undefined`,
      codigoBien: `// ✅ malloc words+1, asignar NULL al final
result = malloc((words + 1) * sizeof(char*));
// ...
result[words] = NULL;`,
    },
    {
      severidad: 'mortal',
      titulo: 'No saltar separadores múltiples → strings vacíos',
      descripcion: 'ft_split("a::b", ":") debe devolver {"a","b",NULL}, no {"a","","b",NULL}. Hay que saltar todos los separadores consecutivos.',
      codigoMal: `// ❌ Solo salta un separador → crea strings vacíos
while (str[i] != c) { ... }
i++;  // solo avanza uno`,
      codigoBien: `// ✅ Saltar todos los separadores consecutivos
while (str[i] == c)
    i++;`,
    },
    {
      severidad: 'warning',
      titulo: 'No liberar en caso de malloc fallo (memory leak)',
      descripcion: 'Si malloc falla a la mitad, liberar todo lo ya asignado antes de retornar NULL.',
      codigoMal: `// ❌ Si falla malloc de word[j], result y word[0..j-1] quedan sin liberar
if (!result[j]) return NULL;`,
      codigoBien: `// ✅ Liberar todo en caso de fallo
if (!result[j]) {
    while (j > 0) free(result[--j]);
    free(result);
    return NULL;
}`,
    },
  ],

  bajoCelCapot: `ft_split es una función de biblioteca fundamental en C — equivalente a split() en Python/JS.
La clave es que NO hay strings vacíos: separadores consecutivos o al inicio/fin se ignoran.
La función hace dos pasadas: contar → allocar → llenar.
El array de punteros más NULL final es el contrato estándar en C para arrays de strings.
Alternativa: una sola pasada si se puede malloc el máximo posible y luego realloc — pero dos pasadas es más limpio.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Memorizar la estructura: count_words + malloc(n+1) + extract_word(con skip sep) + result[n]=NULL. Es el patrón más complejo del examen y aparece en proyectos reales.',
  relacionados: ['ft_strdup', 'ft_range', 'epur_str'],
}
