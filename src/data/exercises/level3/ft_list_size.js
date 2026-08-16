export default {
  id: 'ft_list_size',
  nombre: 'ft_list_size',
  nivel: 3,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_list_size.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_list_size
Expected files   : ft_list_size.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that returns the number of elements in a linked list.

The structure t_list is defined in the ft_list.h header file as follows:

typedef struct s_list
{
  struct s_list  *next;
  void           *data;
}                t_list;

int\tft_list_size(t_list *begin_list);

Example:
ft_list_size(NULL)         → 0
ft_list_size(a→b→c→NULL) → 3`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_list_size
Expected files   : ft_list_size.c
Allowed functions: 
--------------------------------------------------------------------------------

Write a function that returns the number of elements in the linked list that's
passed to it.

It must be declared as follows:

int	ft_list_size(t_list *begin_list);

You must use the following structure in your program ft_list_size.c :

typedef struct    s_list
{
    struct s_list *next;
    void          *data;
}                 t_list;`,

  descripcion: 'Función que cuenta los elementos de una lista enlazada simple. Recorre la lista siguiendo el puntero next hasta llegar a NULL, incrementando el contador en cada nodo.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'bicicleta',
    personaje: 'El Ciclista de la Cadena',
    emoji: '🔗',
    historia: `En el dormitorio hay una Bicicleta con una cadena de eslabones (nodos).
El Ciclista recorre la cadena eslabón a eslabón (nodo a nodo).
En cada eslabón: count++. Cuando llega al fin de la cadena (NULL): para.
Si la cadena está vacía (NULL desde el principio): count=0, devuelve 0.
La struct t_list tiene: next (puntero al siguiente) y data (el contenido).`,
    anclas: [
      "count = 0  ← inicializar contador",
      "while (begin_list): count++; begin_list=begin_list->next",
      "cuando begin_list==NULL → sale del while",
      "return count  ← número de nodos",
      "si lista vacía (NULL): while no entra → return 0",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función cuenta cuántos nodos tiene una lista enlazada.
Empieza en el primer nodo y va saltando de nodo en nodo usando el puntero next.
Cuenta 1 por cada nodo que visita.
Para cuando llega al final de la lista (next == NULL).
Devuelve el número de nodos contados.`,
    datosPuros: [
      { elemento: 'int ft_list_size(t_list *begin_list)', nota: 'recibe el primer nodo, devuelve int' },
      { elemento: 'while (node) { count++; node = node->next; }', nota: 'avanzar con ->next hasta NULL' },
      { elemento: 't_list *', nota: 'estructura con al menos void *data y t_list *next' },
    ],
    asociaciones: [
      { dato: 'node = node->next', imagen: 'El contador de nodos es un saltador de trampolines. Salta de trampolín en trampolín (->next). Cuando llega a un sitio sin trampolín (NULL), cuenta cuántos saltos dio.' },
    ],
  },

  animacion: {
    "tipo": "linked-list",
    "config": {
      "valores": [
        10,
        20,
        30,
        40
      ],
      "modo": "contar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int size = 0;",
        "porque": "Contador de nodos.",
        "concepto": "variables"
      },
      {
        "codigo": "while (begin_list)",
        "porque": "Avanza mientras el puntero no sea NULL.",
        "concepto": "recursion"
      },
      {
        "codigo": "  size++;",
        "porque": "Un nodo más contado.",
        "concepto": "bucles"
      },
      {
        "codigo": "  begin_list = begin_list->next;",
        "porque": "Salta al siguiente nodo.",
        "concepto": "punteros"
      },
      {
        "codigo": "return (size);",
        "porque": "Total de nodos de la lista.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Cómo sabes que llegaste al final?",
        "respuesta": "El último nodo apunta a NULL en su campo next."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Recorrer la lista con while(node): count++; node=node->next',
    formula: 'count=0; while(begin_list){ count++; begin_list=begin_list->next; } return count;',
    ejemplo: {
      entrada: 'lista: a→b→c→NULL',
      calculo: 'a:count=1; b:count=2; c:count=3; NULL→para',
      resultado: '3',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_list_size.c
file2=../../../../rendu/ft_list_size/ft_list_size.c


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
    exit 1
    `,

  // Tests derivados del tester.sh real. Las salidas se obtuvieron
  // compilando la solución de rank02 con gcc -w y ejecutándola.
  testsRank02: [
    { id: 'tester_1', entrada: [], salida: "3\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Iterativa con while',
      descripcion: 'La más clara. Avanza nodo a nodo hasta NULL.',
      recomendada: true,
      codigo: `int\tft_list_size(t_list *begin_list)
{
\tint\tcount;

\tcount = 0;
\twhile (begin_list)
\t{
\t\tcount++;
\t\tbegin_list = begin_list->next;
\t}
\treturn (count);
}`,
    },
    {
      id: 'recursiva',
      nombre: 'Recursiva',
      descripcion: 'Recursión: 1 + ft_list_size(next). Elegante pero con stack depth.',
      recomendada: false,
      codigo: `int\tft_list_size(t_list *begin_list)
{
\tif (!begin_list)
\t\treturn (0);
\treturn (1 + ft_list_size(begin_list->next));
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include "ft_list.h"

int	ft_list_size(t_list *begin_list)
{
	if (begin_list == 0)
		return (0);
	else
		return (1 + ft_list_size(begin_list->next));
}`,
    },
  ],

  tests: [
    { id: 'test_tres', descripcion: 'Lista de 3 elementos → 3', entrada: ['a', 'b', 'c'], salida: '3\n', tipo: 'normal' },
    { id: 'test_uno', descripcion: 'Lista de 1 elemento → 1', entrada: ['x'], salida: '1\n', tipo: 'normal' },
    { id: 'test_cinco', descripcion: 'Lista de 5 elementos → 5', entrada: ['1', '2', '3', '4', '5'], salida: '5\n', tipo: 'normal' },
    { id: 'test_vacia', descripcion: 'Lista vacía (NULL) → 0', entrada: [], salida: '0\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Lista: a→b→c→NULL, count=0',
      codigo: `begin_list = &a (nodo A)
count = 0`,
      variables: [
        { nombre: 'begin_list', valor: '&a (no NULL)', cambio: false, nota: '' },
        { nombre: 'count', valor: '0', cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'Recorrer nodo a nodo',
      codigo: `Iter 1: begin_list=&a → count=1; begin_list=a->next=&b
Iter 2: begin_list=&b → count=2; begin_list=b->next=&c
Iter 3: begin_list=&c → count=3; begin_list=c->next=NULL
while(NULL) → FALSE → sale`,
      variables: [
        { nombre: 'count', valor: '3', cambio: true, nota: '← 3 nodos recorridos' },
        { nombre: 'begin_list', valor: 'NULL', cambio: true, nota: '← fin de lista' },
      ],
    },
    {
      paso: 3,
      titulo: 'return 3',
      codigo: `return (3)`,
      variables: [
        { nombre: 'retorno', valor: '3', cambio: true, nota: '✓' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Usar begin_list->data en vez de begin_list->next para avanzar',
      descripcion: 'Para avanzar al siguiente nodo hay que usar begin_list->next (puntero al nodo siguiente). begin_list->data es el contenido del nodo actual.',
      codigoMal: `// ❌ data no es el siguiente nodo
begin_list = (t_list *)begin_list->data;  // UB — data no es un t_list*`,
      codigoBien: `// ✅
begin_list = begin_list->next;  // salta al siguiente nodo`,
    },
    {
      severidad: 'warning',
      titulo: 'No incluir ft_list.h o no declarar t_list',
      descripcion: 'La struct t_list está definida en ft_list.h. Sin el include, el compilador no conoce el tipo.',
      codigoMal: `// ❌ Sin include → error: unknown type 't_list'
int ft_list_size(t_list *begin_list) { ... }`,
      codigoBien: `// ✅ Incluir la definición
#include "ft_list.h"
int ft_list_size(t_list *begin_list) { ... }`,
    },
  ],

  bajoCelCapot: `Una lista enlazada simple: cada nodo tiene data (contenido) y next (puntero al siguiente).
El último nodo apunta a NULL (centinela del fin).
ft_list_size es O(n) — hay que visitar cada nodo.
La versión recursiva es más elegante pero puede hacer stack overflow para listas muy largas.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'ft_list_size es el ejercicio introductorio a listas enlazadas. Su patrón while(node){count++;node=node->next} se repite en sort_list y otros ejercicios con t_list.',
  relacionados: ['sort_list', 'ft_range', 'ft_rrange'],
}
