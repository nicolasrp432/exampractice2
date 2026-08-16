export default {
  id: 'ft_list_foreach',
  nombre: 'ft_list_foreach',
  nivel: 4,
  dificultad: 'medio',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_list_foreach.c', 'ft_list.h'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_list_foreach
Expected files   : ft_list_foreach.c, ft_list.h
Allowed functions:
--------------------------------------------------------------------------------

Write a function that takes a list and a function pointer, and applies this
function to each element of the list.

It must be declared as follows:

void    ft_list_foreach(t_list *begin_list, void (*f)(void *));

The function pointed to by f will be used as follows:

(*f)(list_ptr->data);

You must use the following structure, and turn it in as a file called
ft_list.h:

typedef struct    s_list
{
    struct s_list *next;
    void          *data;
}                 t_list;`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_list_foreach
Expected files   : ft_list_foreach.c, ft_list.h
Allowed functions:
--------------------------------------------------------------------------------

Write a function that takes a list and a function pointer, and applies this
function to each element of the list.

It must be declared as follows:

void    ft_list_foreach(t_list *begin_list, void (*f)(void *));

The function pointed to by f will be used as follows:

(*f)(list_ptr->data);

You must use the following structure, and turn it in as a file called
ft_list.h:

typedef struct    s_list
{
    struct s_list *next;
    void          *data;
}                 t_list;`,

  descripcion: 'Función que recorre una lista enlazada y aplica una función a cada nodo.',

  palacio: {
    habitacion: 'salón',
    mueble: 'cadena de luces',
    personaje: 'El Director de la Procesión',
    emoji: '🔗',
    historia: `El Director pasa por cada nodo y le dice a su data qué hacer.
No crea nodos nuevos, no elimina nodos: solo visita uno a uno.
El ritmo es simple: visitar, aplicar la función, avanzar al siguiente.`,
    anclas: [
      'while (node) { f(node->data); node = node->next; }',
      'no modifica la lista',
      'aplica f a cada nodo',
    ],
  },

  herramientas: ['listas', 'punteros a función'],

  campayoMetodo: {
    feynman: `La función recorre una lista enlazada y aplica una función a los datos de cada nodo.
Empieza en el primer nodo.
Para cada nodo, llama a la función con los datos de ese nodo.
Luego avanza al siguiente nodo.
Para cuando llega al final (next == NULL).`,
    datosPuros: [
      { elemento: 'void ft_list_foreach(t_list *begin, void (*f)(void *))', nota: 'el segundo argumento es un puntero a función que recibe void*' },
      { elemento: 'f(node->data)', nota: 'llamar a la función con los datos del nodo — la función la proporciona el caller' },
    ],
    asociaciones: [
      { dato: 'void (*f)(void *) — puntero a función', imagen: 'ft_list_foreach es un autobús que lleva un mecánico de alquiler (f). En cada parada (nodo), el mecánico baja y arregla lo que hay (f(data)). Tú contratas al mecánico (pasas f) y el autobús hace el recorrido.' },
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
      "modo": "mapear"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "void ft_list_foreach(t_list *begin, void (*f)(void *))",
        "porque": "Recibe la lista y un puntero a función.",
        "concepto": "punteros"
      },
      {
        "codigo": "while (begin)",
        "porque": "Recorre hasta NULL.",
        "concepto": "recursion"
      },
      {
        "codigo": "  (*f)(begin->data);",
        "porque": "Aplica la función f al dato de cada nodo.",
        "concepto": "punteros"
      },
      {
        "codigo": "  begin = begin->next;",
        "porque": "Salta al siguiente nodo.",
        "concepto": "punteros"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Qué es void (*f)(void *)?",
        "respuesta": "Un puntero a función: foreach no sabe qué hará f, solo la llama en cada nodo."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Iterar lista y llamar al callback para cada elemento',
    formula: 'for node in list: f(node->data)',
    ejemplo: {
      entrada: '[1,2,3] con callback +1',
      calculo: '1→2, 2→3, 3→4',
      resultado: '2\n3\n4\n',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_list_foreach.c
file2=../../../../rendu/ft_list_foreach/ft_list_foreach.c


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
    { id: 'tester_1', entrada: [], salida: "9876543210", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Bucle while simple',
      descripcion: 'La forma más directa de recorrer la lista.',
      recomendada: true,
      codigo: `#include "ft_list.h"

void\tft_list_foreach(t_list *begin_list, void (*f)(void *))
{
\twhile (begin_list)
\t{
\t\t(*f)(begin_list->data);
\t\tbegin_list = begin_list->next;
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

void	ft_list_foreach(t_list *begin_list, void (*f)(void *))
{
	t_list *list_ptr;

	list_ptr = begin_list;
	while (list_ptr)
	{
		(*f)(list_ptr->data);
		list_ptr = list_ptr->next;
	}
}`,
    },
  ],

  tests: [
    { id: 'test_empty', descripcion: 'Lista vacía → salto de línea', entrada: [], salida: '\n', tipo: 'edge' },
    { id: 'test_plus1', descripcion: '[1,2,3] con callback +1', entrada: ['1', '2', '3'], salida: '2\n3\n4\n', tipo: 'normal' },
    { id: 'test_neg', descripcion: 'Negativos también se transforman', entrada: ['-2', '0'], salida: '-1\n1\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Nodo actual y llamada al callback',
      codigo: `begin_list -> node[0]
(*f)(node->data)
begin_list = begin_list->next`,
      variables: [
        { nombre: 'node', valor: '1er nodo', cambio: true, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'Último nodo alcanzado',
      codigo: `node->next = NULL
f(node->data)
advance → NULL`,
      variables: [
        { nombre: 'avance', valor: 'NULL', cambio: true, nota: 'fin de la lista' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'No avanzar al siguiente nodo',
      descripcion: 'Si begin_list no cambia dentro del bucle, la función entra en un bucle infinito.',
      codigoMal: `while (begin_list) { (*f)(begin_list->data); }`,
      codigoBien: `while (begin_list) { (*f)(begin_list->data); begin_list = begin_list->next; }`,
    },
    {
      severidad: 'warning',
      titulo: 'Asumir que f siempre existe',
      descripcion: 'El prototipo recibe un puntero a función; el ejercicio suele garantizarlo, pero la lógica debe ser clara.',
      codigoMal: `f(begin_list->data);`,
      codigoBien: `(*f)(begin_list->data);`,
    },
  ],

  bajoCelCapot: `ft_list_foreach es puro recorrido + callback.
No altera la estructura, solo ejecuta una acción sobre cada data.
Es una base perfecta para entender punteros a función antes de ejercicios más complejos.`,

  estrategia: 'ENTENDER',
  razonEstrategia: 'El objetivo es interiorizar el patrón “recorrer lista y ejecutar callback” antes de ejercicios que mutan o borran nodos.',
  relacionados: ['ft_list_remove_if', 'ft_list_size', 'sort_list'],
}
