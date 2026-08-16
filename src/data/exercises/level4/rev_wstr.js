export default {
  id: 'rev_wstr',
  nombre: 'rev_wstr',
  nivel: 4,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['rev_wstr.c'],
  funcionesPermitidas: ['write', 'malloc', 'free'],

  subject: `Assignment name  : rev_wstr
Expected files   : rev_wstr.c
Allowed functions: write, malloc, free
--------------------------------------------------------------------------------

Write a program that takes a string as a parameter, and prints its words in
reverse order.

A "word" is a part of the string bounded by spaces and/or tabs, or the
begin/end of the string.

If the number of parameters is different from 1, the program will display
'\\n'.`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : rev_wstr
Expected files   : rev_wstr.c
Allowed functions: write, malloc, free
--------------------------------------------------------------------------------

Write a program that takes a string as a parameter, and prints its words in 
reverse order.

A "word" is a part of the string bounded by spaces and/or tabs, or the 
begin/end of the string.

If the number of parameters is different from 1, the program will display 
'\\n'.

In the parameters that are going to be tested, there won't be any "additional" 
spaces (meaning that there won't be additionnal spaces at the beginning or at 
the end of the string, and words will always be separated by exactly one space).

Examples:

$> ./rev_wstr "You hate people! But I love gatherings. Isn't it ironic?" | cat -e
ironic? it Isn't gatherings. love I But people! hate You$
$>./rev_wstr "abcdefghijklm"
abcdefghijklm
$> ./rev_wstr "Wingardium Leviosa" | cat -e
Leviosa Wingardium$
$> ./rev_wstr | cat -e
$
$>`,

  descripcion: 'Programa que imprime las palabras de un string en orden inverso, separadas por un solo espacio.',

  palacio: {
    habitacion: 'garaje',
    mueble: 'retrovisor',
    personaje: 'El Eco Inverso',
    emoji: '🔁',
    historia: `El Eco Inverso oye una frase y la repite al revés por palabras.
No invierte las letras: solo cambia el orden de las palabras.
Primero localiza cada palabra y luego la imprime desde la última hasta la primera.
Si no recibe exactamente un argumento, solo escribe "\\n".`,
    anclas: [
      'argc == 2',
      'invertir palabras, no caracteres',
      'separar con un solo espacio',
    ],
  },

  herramientas: ['strings', 'punteros'],

  campayoMetodo: {
    feynman: `El programa recibe un string e imprime sus palabras en orden inverso.
Primero localiza todas las palabras del string.
Luego las imprime comenzando por la última hasta la primera.
Las palabras se separan por espacios en la salida, sin espacio al final.
Si no hay argumentos o la string está vacía, imprime solo un newline.`,
    datosPuros: [
      { elemento: 'estrategia: ir al final, retroceder por palabras', nota: 'encontrar el fin de cada palabra con dos índices' },
      { elemento: 'espacio ENTRE palabras (no antes de la primera ni después de la última)', nota: 'flag o condición para el primer espacio' },
    ],
    asociaciones: [
      { dato: 'imprimir de derecha a izquierda', imagen: 'rev_wstr es un lector de libros que empieza por el último capítulo. Va al final del libro (string), lee la última palabra (desde atrás), la imprime, y retrocede página por página hasta el principio.' },
    ],
  },

  animacion: {
    "tipo": "word-split",
    "config": {
      "cadena": "hola mundo foo",
      "modo": "revertir"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "recorre argv[1] desde el FINAL",
        "porque": "Las palabras se imprimen de la última a la primera.",
        "concepto": "strings"
      },
      {
        "codigo": "detecta cada palabra (entre espacios)",
        "porque": "Localiza inicio y fin de cada palabra.",
        "concepto": "bandera"
      },
      {
        "codigo": "imprime la palabra en su orden normal",
        "porque": "Se invierte el ORDEN de palabras, no las letras.",
        "concepto": "strings"
      },
      {
        "codigo": "separa con un espacio, sin espacio final",
        "porque": "Salida limpia.",
        "concepto": "bandera"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Se invierten las letras?",
        "respuesta": "No: solo el orden de las palabras. \"hola mundo\" → \"mundo hola\"."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Recorrer de derecha a izquierda detectando límites de palabra',
    formula: 'scan end → find start of last word → print it → repeat with one space',
    ejemplo: {
      entrada: '"Wingardium Leviosa"',
      calculo: 'última = Leviosa, primera = Wingardium',
      resultado: 'Leviosa Wingardium',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=rev_wstr.c
file2=../../../../rendu/rev_wstr/rev_wstr.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1"
    gcc -Werror -Wall -Wextra -o out2 "$file2"

    ./out1 "order in us put" > out1.txt 2>/dev/null
    ./out2 "order in us put" > out2.txt 2>/dev/null

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

    ./out1 "done! well it, did You" > out1.txt 2>/dev/null
    ./out2 "done! well it, did You" > out2.txt 2>/dev/null

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

    ./out1 "You hate people! But I love gatherings. Isn't it ironic?" > out1.txt 2>/dev/null
    ./out2 "You hate people! But I love gatherings. Isn't it ironic?" > out2.txt 2>/dev/null

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

    ./out1 "abcdefghijklm" > out1.txt 2>/dev/null
    ./out2 "abcdefghijklm" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["order in us put"], salida: "put us in order\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["done! well it, did You"], salida: "You did it, well done!\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["You hate people! But I love gatherings. Isn't it ironic?"], salida: "ironic? it Isn't gatherings. love I But people! hate You\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["abcdefghijklm"], salida: "abcdefghijklm\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Recorrido desde el final',
      descripcion: 'La solución más compacta: usa índices y detecta los inicios de palabra.',
      recomendada: true,
      codigo: `#include <unistd.h>

static int is_sep(char c)
{
\treturn (c == ' ' || c == '\\t');
}

int main(int ac, char **av)
{
\tint i;
\tint end;
\tint start;
\tint printed;

\tif (ac != 2)
\t\treturn (write(1, "\\n", 1), 0);
\ti = 0;
\twhile (av[1][i])
\t\ti++;
\tend = i;
\tprinted = 0;
\twhile (i >= 0)
\t{
\t\tif (i == 0 || is_sep(av[1][i - 1]))
\t\t{
\t\t\tstart = i;
\t\t\tif (start < end)
\t\t\t{
\t\t\t\tif (printed)
\t\t\t\t\twrite(1, " ", 1);
\t\t\t\twhile (start < end)
\t\t\t\t\twrite(1, &av[1][start++], 1);
\t\t\t\tprinted = 1;
\t\t\t\tend = i - 1;
\t\t\t}
\t\t}
\t\ti--;
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

void ft_putchar(char c)
{
	write(1, &c, 1);
}

int ft_strlen(char *str)
{
	int i = 0;
	
	while (str[i])
		i++;
	return (i);
}

int main(int ac, char *av[])
{
	char *tmp;
	char *rev;
	int len;

	if (ac == 2)
	{
		tmp = av[1];
		len = ft_strlen(tmp);
		rev = NULL;
		len--;
		while (tmp[len])
		{
			if (tmp[len - 1] == ' ')
			{
				rev = &tmp[len];
				while (*rev && *rev != ' ')
				{
					ft_putchar(*rev);
					rev++;
				}
				ft_putchar(' ');
			}
			else if (len == 0)
			{
				rev = &tmp[len];
				while (*rev && *rev != ' ')
				{
					ft_putchar(*rev);
					rev++;
				}
			}
			len--;
		}
	}
	ft_putchar('\\n');
}`,
    },
  ],

  tests: [
    { id: 'test_1', descripcion: 'Wingardium Leviosa → Leviosa Wingardium', entrada: ['Wingardium Leviosa'], salida: 'Leviosa Wingardium\n', tipo: 'normal' },
    { id: 'test_2', descripcion: 'Que la lumiere soit... → palabras en reversa', entrada: ['Que la      lumiere soit et la lumiere fut'], salida: 'fut lumiere la et soit lumiere la Que\n', tipo: 'normal' },
    { id: 'test_3', descripcion: 'solo una palabra', entrada: ['abcdefghijklm'], salida: 'abcdefghijklm\n', tipo: 'normal' },
    { id: 'test_empty', descripcion: 'sin argumentos → salto de línea', entrada: [], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Final de la cadena',
      codigo: `ac = 2
av[1] = "Wingardium Leviosa"
end apunta al final`,
      variables: [
        { nombre: 'end', valor: '18', cambio: true, nota: 'último índice' },
      ],
    },
    {
      paso: 2,
      titulo: 'Última palabra',
      codigo: `encuentra el espacio antes de "Leviosa"
imprime av[1][10..17]`,
      variables: [
        { nombre: 'salida parcial', valor: '"Leviosa"', cambio: true, nota: '' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Revertir caracteres en vez de palabras',
      descripcion: 'El ejercicio invierte el orden de las palabras, no el contenido de cada palabra.',
      codigoMal: `// ❌ invertir letras
while (i >= 0) write(1, &av[1][i--], 1);`,
      codigoBien: `// ✅ imprimir palabras completas desde atrás`,
    },
    {
      severidad: 'warning',
      titulo: 'Olvidar el espacio entre palabras',
      descripcion: 'Las palabras del resultado deben ir separadas por un único espacio.',
      codigoMal: `write(1, " ", 1); // en cada iteración sin control`,
      codigoBien: `if (no_es_la_ultima_palabra) write(1, " ", 1);`,
    },
  ],

  bajoCelCapot: `rev_wstr suele resolverse con un scan hacia atrás.
La trampa no es técnica, sino de interpretación: palabras al revés, letras intactas.
Es el espejo de first_word/last_word y un buen ejercicio de índices.`,

  estrategia: 'ENTENDER',
  razonEstrategia: 'Es un problema de delimitación de palabras y control de índices; entender los bordes evita duplicar espacios o invertir caracteres.',
  relacionados: ['rostring', 'first_word', 'last_word'],
}
