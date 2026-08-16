export default {
  id: 'print_hex',
  nombre: 'print_hex',
  nivel: 3,
  dificultad: 'medio',
  tipoEntrega: 'programa',
  archivosEsperados: ['print_hex.c'],
  funcionesPermitidas: ['write'],

  subject: `Assignment name  : print_hex
Expected files   : print_hex.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a positive (or zero) int as argument and displays
it in base 16 (lowercase), followed by a newline.

If the number of arguments is not 1, just display a newline.

Example:
$> ./print_hex 10 | cat -e
a$
$> ./print_hex 255 | cat -e
ff$
$> ./print_hex 0 | cat -e
0$`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : print_hex
Expected files   : print_hex.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program that takes a positive (or zero) number expressed in base 10,
and displays it in base 16 (lowercase letters) followed by a newline.

If the number of parameters is not 1, the program displays a newline.

Examples:

$> ./print_hex "10" | cat -e
a$
$> ./print_hex "255" | cat -e
ff$
$> ./print_hex "5156454" | cat -e
4eae66$
$> ./print_hex | cat -e
$`,

  descripcion: 'Programa que convierte un entero positivo a base hexadecimal (minúsculas) e imprime el resultado. Usa una tabla de dígitos hex y recursión similar a put_nbr.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'paleta',
    personaje: 'La Paleta de Colores Hex',
    emoji: '🎨',
    historia: `En el dormitorio hay una Paleta de artista con 16 colores (0-9, a-f).
Le das un número decimal y ella lo convierte a base 16.
El proceso: divide por 16 recursivamente, igual que put_nbr pero en base 16.
Cada resto (0-15) mapea a un carácter: 0-9 → '0'-'9', 10-15 → 'a'-'f'.
La tabla "0123456789abcdef" es la clave: hex[n%16] da el dígito correcto.`,
    anclas: [
      "tabla = '0123456789abcdef'  ← 16 dígitos",
      "si n >= 16: llamar print_hex_rec(n/16) primero  ← recursión",
      "write(tabla[n%16])  ← el dígito actual",
      "solo dígitos en MINÚSCULA (a-f, no A-F)",
      "argc != 2 → solo '\\n'",
    ],
  },

  herramientas: ['bits', 'ascii'],

  campayoMetodo: {
    feynman: `El programa recibe un número y lo imprime en hexadecimal (base 16).
Los dígitos hexadecimales van del 0 al 9 y luego de la 'a' a la 'f'.
Para convertir, divide el número entre 16 repetidamente y guarda los restos.
Los restos se imprimen al revés (de último a primero).
Si el número es 0, imprime "0".`,
    datosPuros: [
      { elemento: '"0123456789abcdef"', nota: 'la cadena de dígitos hex — minúsculas, no mayúsculas' },
      { elemento: 'recursión o array+índice inverso', nota: 'dos estrategias comunes para imprimir en base no-decimal' },
    ],
    asociaciones: [
      { dato: 'base hex "0123456789abcdef"', imagen: 'El hexadecimal es el abecedario de 16 caracteres. Para obtener el dígito correcto, el número entra en la cadena como índice: hex_digits[n % 16]. Las letras a (10), b (11), ..., f (15) son los ciudadanos "extra" del sistema.' },
      { dato: 'imprimir al revés (resta últimos primero)', imagen: 'print_hex es un pintor que pinta de derecha a izquierda. Con cada división por 16 saca el dígito más a la derecha. La recursión los voltea automáticamente: imprime el de antes de volver.' },
    ],
  },

  animacion: {
    "tipo": "base-convert",
    "config": {
      "valor": 255,
      "desdeBase": 10,
      "hastaBase": 16
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "char *hex = \"0123456789abcdef\";",
        "porque": "Tabla de los 16 dígitos hexadecimales.",
        "concepto": "strings"
      },
      {
        "codigo": "recursión / pila para invertir el orden",
        "porque": "Los restos salen al revés; hay que darles la vuelta.",
        "concepto": "recursion"
      },
      {
        "codigo": "write(1, &hex[n % 16], 1);",
        "porque": "El resto entre 16 indexa el dígito correcto.",
        "concepto": "bits"
      },
      {
        "codigo": "n = n / 16;",
        "porque": "Reduce el número dividiendo entre 16.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué n % 16 indexa la tabla?",
        "respuesta": "El resto de dividir entre 16 es exactamente el valor 0-15 del dígito hex."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Recursión base 16: dividir por 16, resto mapea a dígito hex',
    formula: 'print_hex(n): if n>=16: print_hex(n/16); write(hex[n%16]);',
    ejemplo: {
      entrada: 'n=255',
      calculo: 'print_hex(255): 255>=16→print_hex(15); hex[255%16]=hex[15]="f"; print_hex(15): 15<16→hex[15]="f"',
      resultado: '"ff"',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=print_hex.c
file2=../../../../rendu/print_hex/print_hex.c


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

    ./out1 "4324324" > out1.txt 2>/dev/null
    ./out2 "4324324" > out2.txt 2>/dev/null

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

    ./out1 "98" > out1.txt 2>/dev/null
    ./out2 "98" > out2.txt 2>/dev/null

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

    ./out1 "42" > out1.txt 2>/dev/null
    ./out2 "42" > out2.txt 2>/dev/null

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

    ./out1 "10" > out1.txt 2>/dev/null
    ./out2 "10" > out2.txt 2>/dev/null

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
    { id: 'tester_2', entrada: ["4324324"], salida: "41fbe4\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["98"], salida: "62\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["42"], salida: "2a\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["10"], salida: "a\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'recursiva',
      nombre: 'Con función recursiva print_hex_rec',
      descripcion: 'La más limpia. Usa una tabla de caracteres y recursión.',
      recomendada: true,
      codigo: `#include <unistd.h>

static void\tprint_hex_rec(unsigned int n)
{
\tchar\thex[] = "0123456789abcdef";

\tif (n >= 16)
\t\tprint_hex_rec(n / 16);
\twrite(1, &hex[n % 16], 1);
}

int\tmain(int argc, char **argv)
{
\tunsigned int\tn;
\tint\t\t\ti;

\tif (argc != 2)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\tn = 0;
\ti = 0;
\twhile (argv[1][i] >= '0' && argv[1][i] <= '9')
\t\tn = n * 10 + (argv[1][i++] - '0');
\tprint_hex_rec(n);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    },
    {
      id: 'iterativa',
      nombre: 'Iterativa con buffer',
      descripcion: 'Construye el número hex en un buffer inverso y luego lo imprime.',
      recomendada: false,
      codigo: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tchar\thex[] = "0123456789abcdef";
\tchar\tbuf[20];
\tunsigned int\tn;
\tint\t\t\ti;
\tint\t\t\tlen;

\tif (argc != 2)
\t{
\t\twrite(1, "\\n", 1);
\t\treturn (0);
\t}
\tn = 0;
\ti = 0;
\twhile (argv[1][i] >= '0' && argv[1][i] <= '9')
\t\tn = n * 10 + (argv[1][i++] - '0');
\tif (n == 0)
\t{
\t\twrite(1, "0\\n", 2);
\t\treturn (0);
\t}
\tlen = 0;
\twhile (n > 0)
\t{\n\t\tbuf[len++] = hex[n % 16];
\t\tn /= 16;
\t}
\twhile (len > 0)
\t\twrite(1, &buf[--len], 1);
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

int		ft_atoi(char *str)
{
	int n = 0;

	while (*str != '\\0')
	{
		n = n * 10;
		n = n + *str - '0';
		++str;
	}
	return (n);
}

void	print_hex(int n)
{
	char hex_digits[] = "0123456789abcdef";

	if (n >= 16)
		print_hex(n / 16);
	write(1, &hex_digits[n % 16], 1);
}

int		main(int argc, char **argv)
{
	if (argc == 2)
		print_hex(ft_atoi(argv[1]));

	write(1, "\\n", 1);
}`,
    },
  ],

  tests: [
    { id: 'test_10', descripcion: '10 → "a"', entrada: ['10'], salida: 'a\n', tipo: 'normal' },
    { id: 'test_255', descripcion: '255 → "ff"', entrada: ['255'], salida: 'ff\n', tipo: 'normal' },
    { id: 'test_0', descripcion: '0 → "0"', entrada: ['0'], salida: '0\n', tipo: 'edge' },
    { id: 'test_16', descripcion: '16 → "10" (hex)', entrada: ['16'], salida: '10\n', tipo: 'normal' },
    { id: 'test_42', descripcion: '42 → "2a"', entrada: ['42'], salida: '2a\n', tipo: 'normal' },
    { id: 'test_256', descripcion: '256 → "100"', entrada: ['256'], salida: '100\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'print_hex_rec(255)',
      codigo: `print_hex_rec(255):
  255 >= 16 → llama print_hex_rec(255/16=15)
    print_hex_rec(15):
      15 < 16 → no recursión
      hex[15%16] = hex[15] = 'f' → write('f')
  hex[255%16] = hex[15] = 'f' → write('f')
Salida: "ff"`,
      variables: [
        { nombre: 'salida', valor: '"ff"', cambio: true, nota: '✓' },
      ],
    },
    {
      paso: 2,
      titulo: 'print_hex_rec(42)',
      codigo: `print_hex_rec(42):
  42 >= 16 → llama print_hex_rec(42/16=2)
    print_hex_rec(2):
      2 < 16 → no recursión
      hex[2%16] = hex[2] = '2' → write('2')
  hex[42%16] = hex[10] = 'a' → write('a')
Salida: "2a"`,
      variables: [
        { nombre: 'salida', valor: '"2a"', cambio: true, nota: '42 en hex = 2*16+10 = 0x2a ✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Usar mayúsculas (A-F) en vez de minúsculas (a-f)',
      descripcion: 'El subject especifica base 16 en MINÚSCULA. "0123456789abcdef", no "0123456789ABCDEF".',
      codigoMal: `// ❌ Mayúsculas
char hex[] = "0123456789ABCDEF";  // imprimiría "FF" en vez de "ff"`,
      codigoBien: `// ✅ Minúsculas
char hex[] = "0123456789abcdef";`,
    },
    {
      severidad: 'mortal',
      titulo: 'Olvidar el caso n=0 en la versión iterativa',
      descripcion: 'En la versión iterativa con while(n>0), si n=0 el while no entra y no se imprime nada. La versión recursiva maneja bien el 0 (hex[0%16]=\'0\').',
      codigoMal: `// ❌ n=0 → no imprime nada
while (n > 0) { buf[len++] = hex[n%16]; n /= 16; }
// si n=0: len=0, while de impresión no entra → output vacío`,
      codigoBien: `// ✅ Caso especial para 0
if (n == 0) { write(1, "0\\n", 2); return 0; }
// o usar la versión recursiva que lo maneja automáticamente`,
    },
  ],

  bajoCelCapot: `Base 16: dígitos 0-9 y a-f. 10→a, 11→b, 12→c, 13→d, 14→e, 15→f.
255 = 15*16 + 15 = 0xff. 42 = 2*16 + 10 = 0x2a.
La tabla "0123456789abcdef" indexada por n%16 mapea automáticamente.
La recursión print_hex(n/16); write(hex[n%16]) imprime MSB primero.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'La tabla "0123456789abcdef" + recursión base 16 es el patrón reutilizable para cualquier conversión de base con digits mixtos.',
  relacionados: ['ft_atoi_base', 'reverse_bits', 'print_bits'],
}
