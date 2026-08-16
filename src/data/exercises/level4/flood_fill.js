export default {
  id: 'flood_fill',
  nombre: 'flood_fill',
  nivel: 4,
  dificultad: 'difícil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['flood_fill.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : flood_fill
Expected files   : flood_fill.c
Allowed functions: -
--------------------------------------------------------------------------------

Write a function that takes a char ** as a 2-dimensional array of char, a
t_point as the dimensions of this array and a t_point as the starting point.

Starting from the given 'begin' t_point, this function fills an entire zone
by replacing characters inside with the character 'F'. A zone is an group of
the same character delimitated horizontally and vertically by other characters
or the array boundry.

The flood_fill function won't fill diagonally.

The flood_fill function will be prototyped like this:
  void  flood_fill(char **tab, t_point size, t_point begin);

The t_point structure is prototyped like this: (put it in flood_fill.c)

  typedef struct  s_point
  {
    int           x;
    int           y;
  }               t_point;`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : flood_fill
Expected files   : flood_fill.c
Allowed functions: -
--------------------------------------------------------------------------------

Write a function that takes a char ** as a 2-dimensional array of char, a 
t_point as the dimensions of this array and a t_point as the starting point.

Starting from the given 'begin' t_point, this function fills an entire zone 
by replacing characters inside with the character 'F'. A zone is an group of 
the same character delimitated horizontally and vertically by other characters
or the array boundry.

The flood_fill function won't fill diagonally.

The flood_fill function will be prototyped like this:
  void  flood_fill(char **tab, t_point size, t_point begin);

The t_point structure is prototyped like this: (put it in flood_fill.c)

  typedef struct  s_point
  {
    int           x;
    int           y;
  }               t_point;

Example:

$> cat test.c
#include <stdlib.h>
#include <stdio.h>

char** make_area(char** zone, t_point size)
{
	char** new;

	new = malloc(sizeof(char*) * size.y);
	for (int i = 0; i < size.y; ++i)
	{
		new[i] = malloc(size.x + 1);
		for (int j = 0; j < size.x; ++j)
			new[i][j] = zone[i][j];
		new[i][size.x] = '\\0';
	}

	return new;
}

int main(void)
{
	t_point size = {8, 5};
	char *zone[] = {
		"11111111",
		"10001001",
		"10010001",
		"10110001",
		"11100001",
	};

	char**  area = make_area(zone, size);
	for (int i = 0; i < size.y; ++i)
		printf("%s\\n", area[i]);
	printf("\\n");

	t_point begin = {7, 4};
	flood_fill(area, size, begin);
	for (int i = 0; i < size.y; ++i)
		printf("%s\\n", area[i]);
	return (0);
}

$> gcc flood_fill.c test.c -o test; ./test
11111111
10001001
10010001
10110001
11100001

FFFFFFFF
F000F00F
F00F000F
F0FF000F
FFF0000F
$>`,

  descripcion: 'Función recursiva que rellena una zona conectada en una matriz 2D de caracteres usando F.',

  palacio: {
    habitacion: 'garaje',
    mueble: 'pizarra de mapas',
    personaje: 'La Pintora de Zonas',
    emoji: '🎨',
    historia: `La Pintora entra en una zona de la pizarra y pinta todas las celdas conectadas.
Solo se mueve arriba, abajo, izquierda y derecha.
Si una celda no tiene el mismo carácter que la de inicio, se detiene.
No pinta diagonales.`,
    anclas: [
      'comparar con el carácter de inicio',
      'parar en bordes',
      'recursión en 4 direcciones',
    ],
  },

  herramientas: ['recursión', 'matrices'],

  campayoMetodo: {
    feynman: `La función rellena una zona conectada en una matriz de caracteres, como el bote de pintura de MS Paint.
Empieza en una posición (x, y) y cambia el carácter de esa posición por uno nuevo.
Luego se llama a sí misma (recursión) en las 4 posiciones vecinas (arriba, abajo, izquierda, derecha).
Solo avanza si la posición vecina tiene el mismo carácter original — así no se sale de la zona.
Para cuando no queda ninguna casilla vecina con el carácter original.`,
    datosPuros: [
      { elemento: 'if (tab[y][x] != to_fill) return', nota: 'condición de parada: el char ya cambió o era distinto' },
      { elemento: 'tab[y][x] = new_c antes de las llamadas recursivas', nota: 'cambiar primero para evitar bucle infinito' },
      { elemento: 'llamar a las 4 direcciones: (x+1,y), (x-1,y), (x,y+1), (x,y-1)', nota: 'con comprobación de límites' },
    ],
    asociaciones: [
      { dato: 'cambiar ANTES de llamar recursivamente', imagen: 'El bote de pintura se aplica ANTES de llamar a los vecinos. Si lo dejas para después, el vecino vuelve a ti (ves que aún tienes el color original) y te vuelves a llamar infinitamente — bucle de pintura infinita.' },
      { dato: '4 direcciones (no diagonales)', imagen: 'El relleno de flood_fill solo se extiende como una cruz (arriba, abajo, izquierda, derecha). No va en diagonal. Es como un virus que solo infecta a quienes están en contacto directo, no a los vecinos diagonales.' },
    ],
  },

  animacion: {
    "tipo": "flood-fill",
    "config": {
      "grid": [
        [
          "1",
          "1",
          "0"
        ],
        [
          "1",
          "1",
          "0"
        ],
        [
          "0",
          "0",
          "0"
        ]
      ],
      "start": [
        0,
        0
      ],
      "fill": "O"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "fill(x, y): if fuera de límites o color != objetivo, return;",
        "porque": "Casos base que frenan la recursión.",
        "concepto": "recursion"
      },
      {
        "codigo": "pon el nuevo color en (x, y)",
        "porque": "Marca la casilla actual.",
        "concepto": "variables"
      },
      {
        "codigo": "fill(x±1, y) y fill(x, y±1)",
        "porque": "Se propaga a las 4 casillas vecinas.",
        "concepto": "recursion"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué es recursivo?",
        "respuesta": "Cada casilla lanza el mismo relleno sobre sus vecinas hasta topar con un borde o un color distinto."
      },
      {
        "pregunta": "¿Qué pasa sin el caso base?",
        "respuesta": "La recursión se saldría del grid o entraría en bucle infinito repintando lo ya pintado."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Guardar el carácter original y expandirse en cruz',
    formula: 'to_fill = tab[begin.y][begin.x]; recurse N/S/E/W if in bounds and same char',
    ejemplo: {
      entrada: 'zona 8x5 del enunciado',
      calculo: 'se pinta todo el componente conectado al begin',
      resultado: 'celdas originales → F',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `
#!/bin/bash
source ../../../main/colors.sh
file1=flood_fill.c
file2=../../../../rendu/flood_fill/flood_fill.c

# Compile reference and student code
gcc -Wall -Wextra -Werror -o ref.out "$file1" main.c 
gcc -Wall -Wextra -Werror -o user.out "$file2" main.c 

# Test cases
test_case() {
    input=$1
    # Here we're redirecting the output into a file to compare results
    ./ref.out > ref.txt 2>/dev/null
    ./user.out > user.txt 2>/dev/null

    if ! diff -q ref.txt user.txt >/dev/null; then
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$(cat ref.txt)\\""
        echo "\${RED}Your Output:\${RESET}     \\"$(cat user.txt)\\""
        rm -f ref.out user.out ref.txt user.txt 2>/dev/null
        exit 1
    fi
}

# Example test cases (replace with your actual input data if necessary)
test_case "Map 1\\nStart (7, 4)\\nStart (3, 1)\\nMap 2\\nStart (0, 0)\\n" 

# Cleanup
rm -f ref.out user.out ref.txt user.txt
echo "$(tput setaf 2)$(tput bold)PASSED 🎉$(tput sgr 0)"
exit 1

`,


  versiones: [
    {
      id: 'clasica',
      nombre: 'Recursión directa',
      descripcion: 'La solución de rank02: una función helper recursiva que pinta y expande.',
      recomendada: true,
      codigo: `typedef struct  s_point
{
\tint x;
\tint y;
}               t_point;

static void fill(char **tab, t_point size, t_point cur, char to_fill)
{
\tif (cur.y < 0 || cur.y >= size.y || cur.x < 0 || cur.x >= size.x
\t\t|| tab[cur.y][cur.x] != to_fill)
\t\treturn;
\ttab[cur.y][cur.x] = 'F';
\tfill(tab, size, (t_point){cur.x - 1, cur.y}, to_fill);
\tfill(tab, size, (t_point){cur.x + 1, cur.y}, to_fill);
\tfill(tab, size, (t_point){cur.x, cur.y - 1}, to_fill);
\tfill(tab, size, (t_point){cur.x, cur.y + 1}, to_fill);
}

void flood_fill(char **tab, t_point size, t_point begin)
{
\tfill(tab, size, begin, tab[begin.y][begin.x]);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `// Passed Moulinette 2019.09.01

// This code is heavily influenced by @jochang's solution: github.com/MagicHatJo

typedef struct 	s_point {
	int			x;				// x : Width  | x-axis
	int			y;				// y : Height | y-axis
}				t_point;
 
void	fill(char **tab, t_point size, t_point cur, char to_fill)
{
	if (cur.y < 0 || cur.y >= size.y || cur.x < 0 || cur.x >= size.x
		|| tab[cur.y][cur.x] != to_fill)
		return;

	tab[cur.y][cur.x] = 'F';
	fill(tab, size, (t_point){cur.x - 1, cur.y}, to_fill);
	fill(tab, size, (t_point){cur.x + 1, cur.y}, to_fill);
	fill(tab, size, (t_point){cur.x, cur.y - 1}, to_fill);
	fill(tab, size, (t_point){cur.x, cur.y + 1}, to_fill);
}

void	flood_fill(char **tab, t_point size, t_point begin)
{
	fill(tab, size, begin, tab[begin.y][begin.x]);
}`,
    },
  ],

  tests: [
    { id: 'test_example', descripcion: 'Ejemplo del subject', entrada: ['sample'], salida: '11111111\n10001001\n10010001\n10110001\n11100001\n\nFFFFFFFF\nF000F00F\nF00F000F\nF0FF000F\nFFF0000F\n', tipo: 'normal' },
    { id: 'test_border', descripcion: 'Arrancar en una esquina', entrada: ['border'], salida: '11111111\n10001001\n10010001\n10110001\n11100001\n\nFFFFFFFF\nF000F00F\nF00F000F\nF0FF000F\nFFF0000F\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Caracter a pintar',
      codigo: `begin = {7,4}
to_fill = tab[4][7] = '1'
tab[4][7] = 'F'`,
      variables: [
        { nombre: 'to_fill', valor: "'1'", cambio: true, nota: 'carácter original' },
      ],
    },
    {
      paso: 2,
      titulo: 'Expansión a los vecinos',
      codigo: `izquierda, derecha, arriba, abajo
solo si están en bounds y tienen '1'`,
      variables: [
        { nombre: 'frontera', valor: 'filtrada por bounds', cambio: true, nota: 'sin diagonales' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Pintar diagonales',
      descripcion: 'La zona solo se conecta horizontal y verticalmente.',
      codigoMal: `fill(x-1, y-1); // ❌ diagonal`,
      codigoBien: `fill(x-1, y); fill(x+1, y); fill(x, y-1); fill(x, y+1);`,
    },
    {
      severidad: 'warning',
      titulo: 'No copiar el carácter inicial antes de pintar',
      descripcion: 'Hay que guardar el carácter original para comparar en todas las llamadas recursivas.',
      codigoMal: `tab[cur.y][cur.x] = 'F';
if (tab[cur.y][cur.x] == to_fill) ...`,
      codigoBien: `char to_fill = tab[begin.y][begin.x];`,
    },
  ],

  bajoCelCapot: `flood_fill es una búsqueda en profundidad sobre una rejilla.
Se guarda el carácter inicial y se expande en las 4 direcciones mientras la celda siga siendo el mismo carácter.
Es un ejemplo clásico de recursión sobre matrices.`,

  estrategia: 'ENTENDER',
  razonEstrategia: 'La clave es visualizar la rejilla y la expansión en cuatro direcciones. Si se entiende eso, la recursión sale natural.',
  relacionados: ['sort_int_tab', 'ft_split', 'ft_list_remove_if'],
}
