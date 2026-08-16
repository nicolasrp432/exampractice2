export default {
  id: 'ft_list_remove_if',
  nombre: 'ft_list_remove_if',
  nivel: 4,
  dificultad: 'difícil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_list_remove_if.c', 'ft_list.h'],
  funcionesPermitidas: ['free'],

  subject: `Assignment name  : ft_list_remove_if
Expected files   : ft_list_remove_if.c
Allowed functions: free
--------------------------------------------------------------------------------

Write a function called ft_list_remove_if that removes from the
passed list any element the data of which is "equal" to the reference data.

It will be declared as follows :

void ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)());

cmp takes two void* and returns 0 when both parameters are equal.

You have to use the ft_list.h file, which will contain:

typedef struct      s_list
{
    struct s_list   *next;
    void            *data;
}                   t_list;`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_list_remove_if
Expected files   : ft_list_remove_if.c
Allowed functions: free
--------------------------------------------------------------------------------

Write a function called ft_list_remove_if that removes from the
passed list any element the data of which is "equal" to the reference data.

It will be declared as follows :

void ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)());

cmp takes two void* and returns 0 when both parameters are equal.

You have to use the ft_list.h file, which will contain:

$>cat ft_list.h
typedef struct      s_list
{
    struct s_list   *next;
    void            *data;
}                   t_list;`,

  descripcion: 'Función que recorre una lista enlazada y elimina los nodos cuyo data coincide con una referencia.',

  palacio: {
    habitacion: 'salón',
    mueble: 'papelera',
    personaje: 'El Eliminador Silencioso',
    emoji: '🗑️',
    historia: `El Eliminador recorre la lista y tira al cubo los nodos que coinciden.
Si el primero se borra, hay que mover begin_list.
Si un nodo se borra, la cadena debe seguir unida sin perder el resto.
Cada nodo eliminado debe liberarse con free.`,
    anclas: [
      'comparar con cmp(data, data_ref) == 0',
      'si se borra el head, actualizar begin_list',
      'free(node) al eliminar',
      'seguir el recorrido sin saltarse nodos',
    ],
  },

  herramientas: ['listas', 'free'],

  campayoMetodo: {
    feynman: `La función elimina de una lista enlazada todos los nodos cuyo dato coincida con una referencia.
Recorre la lista usando un doble puntero (puntero al puntero actual) para poder editar la lista.
Si el dato del nodo actual coincide (según la función cmp), libera ese nodo y salta al siguiente.
Si no coincide, avanza al siguiente.
El doble puntero permite eliminar el primer nodo sin caso especial.`,
    datosPuros: [
      { elemento: 't_list **begin_list (doble puntero)', nota: 'necesario para poder modificar el primer nodo de la lista' },
      { elemento: '*begin_list = node->next antes del free', nota: 'enlazar antes de liberar para no perder la referencia' },
      { elemento: 'cmp(node->data, ref) == 0 → eliminar', nota: 'usar la función de comparación, no == directamente' },
    ],
    asociaciones: [
      { dato: 'doble puntero **begin_list', imagen: 'El doble puntero es el mando a distancia del primer nodo. Sin él, para borrar el primero necesitarías un caso especial. Con él, el primer nodo se borra exactamente igual que cualquier otro: el mando apunta al nodo, lo borras y lo apuntas al siguiente.' },
      { dato: 'enlazar ANTES de free', imagen: 'Antes de cortar el eslabón de la cadena, agarras los dos extremos para unirlos. Si haces free primero, pierdes la referencia al siguiente nodo y la cadena se rompe.' },
    ],
  },

  animacion: {
    "tipo": "linked-list",
    "config": {
      "valores": [
        10,
        25,
        30,
        45
      ],
      "modo": "filtrar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "while (*begin)",
        "porque": "Recorre con un puntero a puntero para poder borrar.",
        "concepto": "punteros"
      },
      {
        "codigo": "  if (cmp((*begin)->data, ref) == 0)",
        "porque": "Si el dato coincide con la referencia...",
        "concepto": "condicionales"
      },
      {
        "codigo": "    guarda next, free(nodo), reengancha",
        "porque": "Elimina el nodo y une el anterior con el siguiente.",
        "concepto": "malloc"
      },
      {
        "codigo": "  else avanza al siguiente",
        "porque": "Si no coincide, sigue.",
        "concepto": "bucles"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué puntero a puntero (t_list **)?",
        "respuesta": "Para poder modificar el enlace del nodo anterior cuando borras, incluso si borras el primero."
      },
      {
        "pregunta": "¿Por qué guardar next antes del free?",
        "respuesta": "Tras liberar el nodo no puedes leer su ->next: ya no existe."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Borrar nodos coincidentes preservando el resto de la lista',
    formula: 'if cmp(node->data, ref)==0: unlink+free; else avanzar',
    ejemplo: {
      entrada: '[1,2,3,2] ref=2',
      calculo: 'se quitan los 2',
      resultado: '[1,3]',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_list_remove_if.c
file2=../../../../rendu/ft_list_remove_if/ft_list_remove_if.c


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
    { id: 'tester_1', entrada: [], salida: "String aa\nString bb\nString cc\nString dd\n----------\nString bb\nString cc\nString dd\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'recursiva',
      nombre: 'Versión recursiva',
      descripcion: 'La versión de rank02: recurre sobre el resto de la lista y libera coincidencias.',
      recomendada: true,
      codigo: `#include <stdlib.h>
#include "ft_list.h"

void\tft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)(void *, void *))
{
\tt_list *cur;

\tif (!begin_list || !*begin_list)
\t\treturn;
\tcur = *begin_list;
\tif (cmp(cur->data, data_ref) == 0)
\t{
\t\t*begin_list = cur->next;
\t\tfree(cur);
\t\tft_list_remove_if(begin_list, data_ref, cmp);
\t}
\telse
\t\tft_list_remove_if(&cur->next, data_ref, cmp);
}`,
    },
    {
      id: 'iterativa',
      nombre: 'Con nodo previo',
      descripcion: 'Una alternativa iterativa que evita recursión y deja claro el relink.',
      recomendada: false,
      codigo: `#include <stdlib.h>
#include "ft_list.h"

void\tft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)(void *, void *))
{
\tt_list *cur;
\tt_list *prev;
\tt_list *next;

\tcur = begin_list ? *begin_list : NULL;
\tprev = NULL;
\twhile (cur)
\t{
\t\tnext = cur->next;
\t\tif (cmp(cur->data, data_ref) == 0)
\t\t{
\t\t\tif (prev)
\t\t\t\tprev->next = next;
\t\t\telse
\t\t\t\t*begin_list = next;
\t\t\tfree(cur);
\t\t}
\t\telse
\t\t\tprev = cur;
\t\tcur = next;
\t}
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <stdlib.h>
#include "ft_list.h"

int cmp(void *a, void *b);

void ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)(void *, void *))
{
	if (begin_list == NULL || *begin_list == NULL)
		return;

	t_list *cur = *begin_list;

	if (cmp(cur->data, data_ref) == 0)
	{
		*begin_list = cur->next;
		free(cur);
		ft_list_remove_if(begin_list, data_ref, cmp);
	}
	else
		ft_list_remove_if(&cur->next, data_ref, cmp);
}`,
    },
  ],

  tests: [
    { id: 'test_middle', descripcion: 'Eliminar los valores iguales al ref', entrada: ['2', '1', '2', '3', '2'], salida: '1\n3\n', tipo: 'normal' },
    { id: 'test_head', descripcion: 'Si el primer nodo coincide, también se borra', entrada: ['1', '1', '2', '3'], salida: '2\n3\n', tipo: 'normal' },
    { id: 'test_all', descripcion: 'Si todo coincide, la lista queda vacía', entrada: ['5', '5', '5'], salida: '\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Coincidencia en la cabeza',
      codigo: `cur = *begin_list
cmp(cur->data, ref) == 0
*begin_list = cur->next`,
      variables: [
        { nombre: 'head', valor: 'actualizado', cambio: true, nota: 'se movió la cabeza' },
      ],
    },
    {
      paso: 2,
      titulo: 'Eliminar un nodo intermedio',
      codigo: `prev->next = cur->next
free(cur)
seguir con next`,
      variables: [
        { nombre: 'lista', valor: 'sin el nodo coincidente', cambio: true, nota: '' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'No actualizar begin_list al borrar la cabeza',
      descripcion: 'Si el primer nodo coincide y no se mueve begin_list, la lista queda corrupta.',
      codigoMal: `if (cmp(cur->data, ref) == 0) free(cur);`,
      codigoBien: `if (cmp(cur->data, ref) == 0) { *begin_list = cur->next; free(cur); }`,
    },
    {
      severidad: 'mortal',
      titulo: 'Perder el siguiente nodo tras free',
      descripcion: 'Guardar next antes de liberar evita perder el resto de la cadena.',
      codigoMal: `free(cur);
cur = cur->next;`,
      codigoBien: `next = cur->next;
free(cur);
cur = next;`,
    },
  ],

  bajoCelCapot: `ft_list_remove_if combina recorrido, comparación y liberación.
El patrón correcto es guardar el siguiente nodo antes de free y relinkear sin perder la cadena.
Es uno de los ejercicios más importantes para entender mutación segura de listas enlazadas.`,

  estrategia: 'ENTENDER',
  razonEstrategia: 'Obliga a controlar punteros previos, cabeza de lista y liberación. Entender la mutación segura evita bugs de memoria.',
  relacionados: ['ft_list_foreach', 'ft_list_size', 'sort_list'],
}
