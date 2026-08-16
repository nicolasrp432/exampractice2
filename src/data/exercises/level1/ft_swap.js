export default {
  id: 'ft_swap',
  nombre: 'ft_swap',
  nivel: 1,
  dificultad: 'fácil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_swap.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_swap
Expected files   : ft_swap.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that swaps the contents of two integers whose addresses
are given as parameters.

void\tft_swap(int *a, int *b);`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_swap
Expected files   : ft_swap.c
Allowed functions:
--------------------------------------------------------------------------------

Write a function that swaps the contents of two integers the adresses of which
are passed as parameters.

Your function must be declared as follows:

void	ft_swap(int *a, int *b);`,

  descripcion: 'Función que intercambia los valores de dos enteros usando sus direcciones de memoria. Requiere una variable temporal.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'fregadero',
    personaje: 'El Sapo Mago',
    emoji: '🧙',
    historia: `Junto al fregadero vive el Sapo Mago con su varita-estrella.
Tiene que intercambiar el agua de dos vasos (A y B).
Para hacerlo necesita UN TERCER VASO VACÍO (int tmp).
Ritual: 1) Vierte A en tmp. 2) Vierte B en A. 3) Vierte tmp en B.
¡Sin el vaso vacío es un DESASTRE (segfault o pérdida de datos)!`,
    anclas: [
      "int tmp = *a  ← guarda A en el vaso vacío",
      "*a = *b  ← vierte B donde estaba A",
      "*b = tmp  ← vierte el vaso en B",
      "TMP es int, no int* (¡sin puntero!)",
      "sin tmp → catástrofe: perderías A",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función recibe las direcciones de dos enteros (no los valores, sino dónde están guardados).
Para intercambiarlos necesita un tercer vaso vacío: int tmp.
Primero vierte el contenido de A en el vaso vacío.
Luego pone lo de B donde estaba A.
Luego pone lo del vaso en B.
Sin el vaso vacío perdería uno de los valores para siempre.`,
    datosPuros: [
      { elemento: 'void ft_swap(int *a, int *b)', nota: 'recibe punteros int*, devuelve void' },
      { elemento: 'int tmp = *a', nota: 'tmp es int (no int*) — guarda el valor, no la dirección' },
      { elemento: '*a = *b; *b = tmp', nota: 'desreferenciar con * para leer/escribir el valor' },
    ],
    asociaciones: [
      { dato: 'int tmp (no int*)', imagen: 'El Sapo Mago del fregadero coge un vaso de agua (int tmp). No coge el grifo (int*), sino EL AGUA MISMA. Si confundes vaso con grifo el hechizo explota.' },
      { dato: '*a = *b (*desreferencia)', imagen: 'El asterisco es como meter la mano en el buzón (*) para sacar o meter cartas. Sin el asterisco solo tocas el buzón (la dirección) sin abrir.' },
    ],
  },

  animacion: {
    "tipo": "swap",
    "config": {
      "a": 42,
      "b": 17,
      "modo": "swap"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "void ft_swap(int *a, int *b)",
        "porque": "Recibe punteros para modificar las variables originales, no copias.",
        "concepto": "punteros"
      },
      {
        "codigo": "  int temp;",
        "porque": "Variable auxiliar: sin ella perderíamos un valor al pisarlo.",
        "concepto": "variables"
      },
      {
        "codigo": "  temp = *a;",
        "porque": "Guarda el valor de a antes de sobrescribirlo.",
        "concepto": "punteros"
      },
      {
        "codigo": "  *a = *b;",
        "porque": "a recibe el valor de b.",
        "concepto": "punteros"
      },
      {
        "codigo": "  *b = temp;",
        "porque": "b recibe el a original que teníamos guardado.",
        "concepto": "punteros"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué hacen falta punteros?",
        "respuesta": "Sin punteros modificarías copias locales y el cambio no se vería fuera de la función."
      },
      {
        "pregunta": "¿Por qué la variable temp?",
        "respuesta": "Si haces *a = *b primero, pierdes el valor de a para siempre. temp lo conserva."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Swap clásico con variable temporal',
    formula: 'tmp = *a; *a = *b; *b = tmp;',
    ejemplo: {
      entrada: 'a=3, b=7',
      calculo: 'tmp=3 → *a=7 → *b=3',
      resultado: 'a=7, b=3',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_swap.c
file2=../../../../rendu/ft_swap/ft_swap.c


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
    { id: 'tester_1', entrada: [], salida: "Value of n1 is: 9 and the value of n2 is: 6.\nNow the value of n1 is: 6 and the value of n2 is: 9.\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con tmp',
      descripcion: 'La única versión válida en el examen de 42. Clara y sin UB.',
      recomendada: true,
      codigo: `void\tft_swap(int *a, int *b)
{
\tint\ttmp;

\ttmp = *a;
\t*a = *b;
\t*b = tmp;
}`,
    },
    {
      id: 'xor',
      nombre: 'XOR swap (solo informativo)',
      descripcion: 'Usa XOR para intercambiar sin variable temporal. NO usar: poco legible, falla si a==b (mismo puntero).',
      recomendada: false,
      codigo: `// ⚠️ Solo informativo — NO usar en el examen
void\tft_swap(int *a, int *b)
{
\t*a ^= *b;
\t*b ^= *a;
\t*a ^= *b;
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <unistd.h>
#include <stdio.h>

void    ft_swap(int *a, int *b)
{
	int	temp;

	temp = *a;
	*a = *b;
	*b = temp;
}`,
    },
  ],

  tests: [
    {
      id: 'test_normal',
      descripcion: '3 y 7 → quedan 7 y 3',
      entrada: ['3', '7'],
      salida: 'Antes:  a = 3, b = 7\nDespués: a = 7, b = 3\n',
      tipo: 'normal',
    },
    {
      id: 'test_ceros',
      descripcion: '0 y 0 → siguen siendo 0 y 0',
      entrada: ['0', '0'],
      salida: 'Antes:  a = 0, b = 0\nDespués: a = 0, b = 0\n',
      tipo: 'edge',
    },
    {
      id: 'test_negativos',
      descripcion: '-1 y 5 → quedan 5 y -1',
      entrada: ['-1', '5'],
      salida: 'Antes:  a = -1, b = 5\nDespués: a = 5, b = -1\n',
      tipo: 'normal',
    },
    {
      id: 'test_grandes',
      descripcion: '100 y -100 → quedan -100 y 100',
      entrada: ['100', '-100'],
      salida: 'Antes:  a = 100, b = -100\nDespués: a = -100, b = 100\n',
      tipo: 'normal',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Inicio: a=&3, b=&7',
      codigo: `(gdb) break ft_swap
(gdb) run
Breakpoint 1, ft_swap (a=0x7fffe10, b=0x7fffe14) at ft_swap.c:3
3\t\tint tmp;`,
      variables: [
        { nombre: '*a', valor: '3', cambio: false, nota: 'Valor en la dirección a' },
        { nombre: '*b', valor: '7', cambio: false, nota: 'Valor en la dirección b' },
        { nombre: 'tmp', valor: '?', cambio: false, nota: 'Sin inicializar' },
      ],
    },
    {
      paso: 2,
      titulo: 'tmp = *a → guarda 3 en el vaso',
      codigo: `(gdb) next
5\t\ttmp = *a;
(gdb) next
6\t\t*a = *b;  ← siguiente línea`,
      variables: [
        { nombre: 'tmp', valor: '3', cambio: true, nota: '← El vaso guarda A' },
        { nombre: '*a', valor: '3', cambio: false, nota: 'Aún sin cambiar' },
        { nombre: '*b', valor: '7', cambio: false, nota: '' },
      ],
    },
    {
      paso: 3,
      titulo: '*a = *b → pone 7 en la dirección de A',
      codigo: `(gdb) next
7\t\t*b = tmp;
(gdb) print *a
$1 = 7`,
      variables: [
        { nombre: '*a', valor: '7', cambio: true, nota: '← Ahora A tiene el valor de B' },
        { nombre: '*b', valor: '7', cambio: false, nota: 'Aún sin cambiar' },
        { nombre: 'tmp', valor: '3', cambio: false, nota: 'Sigue guardando el viejo A' },
      ],
    },
    {
      paso: 4,
      titulo: '*b = tmp → pone 3 en la dirección de B',
      codigo: `(gdb) next
8\t\t}
(gdb) print *b
$2 = 3`,
      variables: [
        { nombre: '*b', valor: '3', cambio: true, nota: '← Ahora B tiene el viejo valor de A' },
        { nombre: '*a', valor: '7', cambio: false, nota: '✓ Correcto' },
        { nombre: 'tmp', valor: '3', cambio: false, nota: 'Ya no es necesario' },
      ],
    },
    {
      paso: 5,
      titulo: 'Swap completado — resultado',
      codigo: `(gdb) finish
// Antes:  a=3, b=7
// Después: a=7, b=3  ← ¡Intercambiados!`,
      variables: [
        { nombre: '*a', valor: '7', cambio: false, nota: '✓ Antes era 3' },
        { nombre: '*b', valor: '3', cambio: false, nota: '✓ Antes era 7' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'info',
      titulo: 'Diferencia plataforma vs examen real',
      descripcion: 'Tu función ft_swap del repo rank02 está bien, pero el `main.c` que la acompaña imprime los enteros con `printf("%u", *a)` — `%u` es para `unsigned int`, no `int`. Con `-Wall -Wextra -Werror` ese main NO compila. El subject real no obliga a usar ese main: la Moulinette enlaza tu .c con uno propio. La plataforma usa su propio harness limpio (ver Practica), así que no te encontrarás ese warning aquí.',
      codigoMal: `// ❌ main.c real del rank02 (no compila con -Werror)
printf("Value of n1 is: %u and the value of n2 is: %u.", *a, *b);
// warning: format '%u' expects 'unsigned int', argument has type 'int'`,
      codigoBien: `// ✅ Lo que hace la plataforma: %d para int
printf("Antes:  a = %d, b = %d\\n", *a, *b);
ft_swap(&a, &b);
printf("Después: a = %d, b = %d\\n", *a, *b);`,
    },
    {
      severidad: 'mortal',
      titulo: 'int *tmp en vez de int tmp → segfault',
      descripcion: 'Si declaras int *tmp (puntero), tmp es una dirección sin inicializar. Desreferenciarla (*tmp = *a) es un acceso a memoria inválida → segfault inmediato.',
      codigoMal: `// ❌ int *tmp es un puntero que apunta a basura
void ft_swap(int *a, int *b) {
    int *tmp;      // apunta a dirección aleatoria
    *tmp = *a;     // ← SEGFAULT: escribe en memoria aleatoria
    *a = *b;
    *b = *tmp;
}`,
      codigoBien: `// ✅ int tmp es un entero normal, el "vaso vacío"
void ft_swap(int *a, int *b) {
    int tmp;       // entero normal
    tmp = *a;      // guarda el valor
    *a = *b;
    *b = tmp;
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'No usar * al desreferenciar — modifica el puntero, no el valor',
      descripcion: 'a = b cambia el puntero local a para que apunte a b. No cambia los valores. El caller no ve ningún cambio.',
      codigoMal: `// ❌ Cambia los punteros locales, no los valores
void ft_swap(int *a, int *b) {
    int *tmp;
    tmp = a;   // tmp apunta al mismo sitio que a
    a = b;     // a apunta al mismo sitio que b
    b = tmp;   // b apunta al mismo sitio que tmp
    // Los valores *a y *b NO han cambiado
}`,
      codigoBien: `// ✅ Cambia los valores en memoria
void ft_swap(int *a, int *b) {
    int tmp;
    tmp = *a;  // dereferenciar para obtener el valor
    *a = *b;
    *b = tmp;
}`,
    },
    {
      severidad: 'warning',
      titulo: 'No comprobar punteros NULL',
      descripcion: 'ft_swap(NULL, &b) provocará segfault. En 42 el sujeto no suele pedir manejo de NULL para funciones básicas, pero es buena práctica saberlo.',
      codigoMal: `// ❌ Sin protección
void ft_swap(int *a, int *b) {
    int tmp = *a; // crash si a es NULL`,
      codigoBien: `// ✅ Con protección (si el sujeto lo permite)
void ft_swap(int *a, int *b) {
    int tmp;
    if (!a || !b) return;
    tmp = *a; *a = *b; *b = tmp;
}`,
    },
  ],

  bajoCelCapot: `Memoria: a y b son punteros (direcciones de memoria de 8 bytes en 64 bits).
*a y *b acceden al entero (4 bytes) que vive en esas direcciones.
tmp vive en el stack frame de ft_swap.
Tras el return, tmp desaparece — el swap queda en memoria del caller.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Patrón de swap más fundamental. Aparece en sort, en ft_sort_int_tab, y en cualquier algoritmo de ordenación.',
  relacionados: ['ft_strcpy', 'ft_range'],
}
