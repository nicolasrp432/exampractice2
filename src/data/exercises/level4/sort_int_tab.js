export default {
  id: 'sort_int_tab',
  nombre: 'sort_int_tab',
  nivel: 4,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['sort_int_tab.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : sort_int_tab
Expected files   : sort_int_tab.c
Allowed functions:
--------------------------------------------------------------------------------

Write the following function:

void sort_int_tab(int *tab, unsigned int size);

It must sort (in-place) the 'tab' int array, that contains exactly 'size'
members, in ascending order.

Doubles must be preserved.

Input is always coherent.`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : sort_int_tab
Expected files   : sort_int_tab.c
Allowed functions:
--------------------------------------------------------------------------------

Write the following function:

void sort_int_tab(int *tab, unsigned int size);

It must sort (in-place) the 'tab' int array, that contains exactly 'size'
members, in ascending order.

Doubles must be preserved.

Input is always coherent.`,

  descripcion: 'Función que ordena in-place un array de enteros en orden ascendente, conservando duplicados.',

  palacio: {
    habitacion: 'garaje',
    mueble: 'mesa de herramientas',
    personaje: 'El Mecánico de Burbujas',
    emoji: '🧰',
    historia: `El Mecánico mira parejas de números sobre la mesa.
Si una pareja está al revés, las intercambia y vuelve a empezar.
Repite hasta que ya no hay ningún intercambio pendiente.
Los duplicados se quedan exactamente donde toca en el orden final.`,
    anclas: [
      'swap si tab[i] > tab[i + 1]',
      'repetir hasta que no haya cambios',
      'orden ascendente',
    ],
  },

  herramientas: ['arrays', 'swap'],

  campayoMetodo: {
    feynman: `La función ordena un array de enteros de menor a mayor.
Usa bubble sort: recorre el array comparando pares de elementos adyacentes.
Si el de la izquierda es mayor que el de la derecha, los intercambia.
Repite el proceso hasta que en toda una pasada no hace ningún intercambio.
Al terminar, el array está ordenado.`,
    datosPuros: [
      { elemento: 'void sort_int_tab(int *tab, int size)', nota: 'ordena in place — void, no devuelve nada' },
      { elemento: 'flag swapped para detectar si terminó antes', nota: 'optimización: si no hubo swap en una pasada, ya está ordenado' },
    ],
    asociaciones: [
      { dato: 'bubble sort — el mayor burbujea al final', imagen: 'En cada pasada, el número más grande "burbujea" hacia el final del array como una burbuja de champán. Tras N pasadas, los N números más grandes están en su sitio. Con el flag de swap, para antes si ya está todo ordenado.' },
    ],
  },

  animacion: {
    "tipo": "sort",
    "config": {
      "array": [
        5,
        2,
        8,
        1,
        9,
        3
      ],
      "algoritmo": "bubble"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (i < size - 1)  // pasadas",
        "porque": "Repite pasadas sobre el array.",
        "concepto": "bucles"
      },
      {
        "codigo": "  while (j < size - 1 - i)",
        "porque": "Compara vecinos; los ya ordenados quedan al final.",
        "concepto": "bucles"
      },
      {
        "codigo": "    if (tab[j] > tab[j+1]) swap(...);",
        "porque": "Intercambia si están desordenados.",
        "concepto": "variables"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué size - 1 - i en el bucle interno?",
        "respuesta": "Tras cada pasada, el mayor ya está colocado al final; no hace falta recompararlo."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Bubble sort simple o inserción en sitio',
    formula: 'while swaps: for i=0..size-2 if tab[i] > tab[i+1] swap',
    ejemplo: {
      entrada: '[3,1,2]',
      calculo: '[3,1,2] → [1,3,2] → [1,2,3]',
      resultado: '[1,2,3]',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=sort_int_tab.c
file2=../../../../rendu/sort_int_tab/sort_int_tab.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

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
    { id: 'tester_1', entrada: [], salida: "1 2 3 4 5 ", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Bubble sort simple',
      descripcion: 'La versión más fácil de leer y de depurar.',
      recomendada: true,
      codigo: `void\tsort_int_tab(int *tab, unsigned int size)
{
\tunsigned int i;
\tint temp;

\tif (size < 2)
\t\treturn;
\ti = 0;
\twhile (i < size - 1)
\t{
\t\tif (tab[i] > tab[i + 1])
\t\t{
\t\t\ttemp = tab[i];
\t\t\ttab[i] = tab[i + 1];
\t\t\ttab[i + 1] = temp;
\t\t\ti = 0;
\t\t}
\t\telse
\t\t\ti++;
\t}
}`,
    },
    {
      id: 'insercion',
      nombre: 'Inserción in-place',
      descripcion: 'Una alternativa un poco más lineal, con menos reinicios.',
      recomendada: false,
      codigo: `void\tsort_int_tab(int *tab, unsigned int size)
{
\tunsigned int i;
\tunsigned int j;
\tint tmp;

\ti = 1;
\twhile (i < size)
\t{
\t\ttmp = tab[i];
\t\tj = i;
\t\twhile (j > 0 && tab[j - 1] > tmp)
\t\t{
\t\t\ttab[j] = tab[j - 1];
\t\t\tj--;
\t\t}
\t\ttab[j] = tmp;
\t\ti++;
\t}
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `void	sort_int_tab(int *tab, unsigned int size)
{
	unsigned int	i = 0;
	int	temp;

	while (i < (size - 1))
	{
		if (tab[i] > tab[i + 1])
		{
			temp = tab[i];
			tab[i] = tab[i+ 1];
			tab[i + 1] = temp;
			i = 0;
		}
		else
			i++;
	}
}`,
    },
  ],

  tests: [
    { id: 'test_sorted', descripcion: '[1,2,3] queda igual', entrada: ['1', '2', '3'], salida: '1\n2\n3\n', tipo: 'normal' },
    { id: 'test_reverse', descripcion: '[3,2,1] → [1,2,3]', entrada: ['3', '2', '1'], salida: '1\n2\n3\n', tipo: 'normal' },
    { id: 'test_dups', descripcion: 'Duplicados se preservan', entrada: ['4', '1', '4', '2'], salida: '1\n2\n4\n4\n', tipo: 'normal' },
    { id: 'test_empty', descripcion: 'sin elementos → salto de línea', entrada: [], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'tab = [3,1,2]',
      codigo: `i = 0
tab[0] > tab[1] → swap
tab = [1,3,2]`,
      variables: [
        { nombre: 'tab', valor: '[1,3,2]', cambio: true, nota: 'primer swap' },
      ],
    },
    {
      paso: 2,
      titulo: 'Reiniciar el recorrido tras un swap',
      codigo: `i = 0 otra vez
tab[1] > tab[2] → swap
tab = [1,2,3]`,
      variables: [
        { nombre: 'tab', valor: '[1,2,3]', cambio: true, nota: 'orden final' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Salir demasiado pronto',
      descripcion: 'Hay que repetir pases hasta que no haya intercambios. Un solo recorrido no basta en general.',
      codigoMal: `for (...) if (tab[i] > tab[i+1]) swap; // un solo pase`,
      codigoBien: `// ✅ repetir hasta orden estable`,
    },
    {
      severidad: 'warning',
      titulo: 'Olvidar size < 2',
      descripcion: 'Un array de 0 o 1 elemento ya está ordenado.',
      codigoMal: `while (i < size - 1) ...`,
      codigoBien: `if (size < 2) return;`,
    },
  ],

  bajoCelCapot: `sort_int_tab ordena el array en sitio: no devuelve nada.
El intercambio es estable respecto a duplicados en el sentido de que los valores iguales no cambian de orden relativo por comparación estricta >.
Es un ejercicio ideal para practicar bucles anidados y condiciones de parada.`,

  estrategia: 'ENTENDER',
  razonEstrategia: 'Es un problema clásico de ordenación in-place. Entender el patrón de swap y reinicio ayuda más que memorizar una sola línea.',
  relacionados: ['max', 'ft_range', 'ft_list_size'],
}
