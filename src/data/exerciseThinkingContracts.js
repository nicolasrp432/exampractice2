/**
 * Catálogo Exhaustivo de Contratos de Entrada, Salida, Tipos de Datos y Movimientos Mentales
 * 100% Específicos para cada Ejercicio de Examen 42 (Rank 02).
 * 
 * Ningún texto genérico: cada ejercicio define su prototipo real en C, sus tipos de datos
 * exactos con explicación física en memoria, el porqué de cada tipo, el concepto clave de C,
 * la mutación en memoria o flujo STDOUT, la regla de oro antimoulinette y sus movimientos mentales.
 */

export const EXERCISE_CONTRACTS = {
  // ───────────────────────────────────────────────────────────────────────────
  // NIVEL 1
  // ───────────────────────────────────────────────────────────────────────────
  ft_strlen: {
    prototype: 'int ft_strlen(char *str);',
    signature: 'char *str',
    inputDataTypes: [
      {
        param: 'char *str',
        type: 'Puntero simple a carácter (char * — 8 bytes en arquitectura x86_64)',
        explanation: 'Apunta a la dirección de memoria física (en Stack o Data Segment) donde reside el primer byte de una cadena terminada en byte nulo (\'\\0\').',
        whyThisType: 'En C las cadenas no guardan metadatos de longitud; son un bloque contiguo de bytes. Se pasa un puntero al primer carácter para poder recorrer la memoria secuencialmente.',
        keyConcept: 'Contigüidad de memoria física, punteros de lectura y centinela \'\\0\' (valor numérico 0).'
      }
    ],
    outputDataTypes: {
      returnType: 'int (entero primitivo con signo — 4 bytes)',
      whatItTransforms: 'No muta la memoria del string ni escribe en STDOUT. Cuenta y retorna el número exacto de bytes antes de toparse con el terminador \'\\0\'.',
      whyReturn: 'El llamador necesita la longitud numérica exacta para iterar, copiar o dimensionar búferes.'
    },
    goldenRule: "Devolver `i`, ¡NO `i - 1`! El carácter '\\0' detiene el bucle pero NO forma parte de la longitud. Al terminar `while (str[i]) i++;`, la variable `i` contiene exactamente el número de caracteres reales.",
    mentalSteps: [
      {
        num: 1,
        title: 'Inicializar el Contador en Registro de CPU',
        desc: 'Declara `int i = 0;`. Se asigna en un registro de CPU (%eax) para máxima velocidad de incremento en cada ciclo de reloj.',
        cCode: 'int i = 0;'
      },
      {
        num: 2,
        title: "Recorrido Secuencial hasta el Centinela '\\0'",
        desc: "Cualquier carácter ASCII válido tiene valor numérico > 0 (verdadero). El byte nulo vale 0 (falso), lo que permite usar `while (str[i])` como condición de frenado limpia.",
        cCode: "while (str[i] != '\\0') // o simplemente while (str[i])"
      },
      {
        num: 3,
        title: 'Incremento Unitario por Cada Byte Válido',
        desc: 'En cada iteración sumamos `i++`. Esto equivale a desplazarse exactamente 1 byte hacia adelante en la memoria física (*(str + i)).',
        cCode: '    i++;'
      },
      {
        num: 4,
        title: 'Retorno del Acumulador sin Descuentos',
        desc: 'Retorna directamente `return (i);`. Como empezamos en 0 y frenamos en el centinela, `i` equivale con precisión matemática a la longitud.',
        cCode: 'return (i);'
      }
    ],
    dictionary: [
      { human: 'Condición de parada', c: 'while (str[i])', note: 'Para en \\0 porque su valor booleano es 0 (falso)' },
      { human: 'Lectura del byte actual', c: 'str[i] o *(str + i)', note: 'Desreferenciación directa a 1 byte' },
      { human: 'Retorno del total', c: 'return (i);', note: 'i ya tiene el total exacto sin incluir el \\0' }
    ],
    quiz: {
      question: "Si str apunta al string \"42\", ¿qué valor tiene str[2] y qué debe retornar ft_strlen?",
      options: [
        "str[2] es '\\0' (valor 0) y ft_strlen retorna 2",
        "str[2] es '2' y ft_strlen retorna 3",
        "str[2] es memoria basura y causará un Segfault"
      ],
      correctIdx: 0,
      explanation: "Los índices son 0 ('4'), 1 ('2') y 2 ('\\0'). El while se detiene en i = 2 porque str[2] vale 0, retornando 2."
    }
  },

  ft_swap: {
    prototype: 'void ft_swap(int *a, int *b);',
    signature: 'int *a, int *b',
    inputDataTypes: [
      {
        param: 'int *a, int *b',
        type: 'Dos punteros a entero (int * — 8 bytes cada uno en la pila)',
        explanation: 'Reciben las direcciones de memoria de dos enteros (&x e &y) que residen en el stack frame del llamador.',
        whyThisType: 'En C todos los argumentos se pasan por valor (copia). Si recibiéramos `int a, int b`, modificaríamos copias efímeras locales. Para mutar las variables originales de quien llamó a la función, necesitamos sus punteros.',
        keyConcept: 'Paso por referencia simulado en C mediante punteros y el operador de desreferenciación (*).'
      }
    ],
    outputDataTypes: {
      returnType: 'void (sin valor de retorno)',
      whatItTransforms: 'Muta directamente las dos celdas de 4 bytes en memoria apuntadas por `a` y `b`. Intercambia sus contenidos in-place sin alocar memoria en Heap ni escribir en STDOUT.',
      whyReturn: 'No retorna nada porque el efecto secundario de la mutación ocurre directamente en la memoria RAM del llamador.'
    },
    goldenRule: 'Obligatorio usar una variable temporal `int tmp = *a; *a = *b; *b = tmp;`. Si intentas hacer `*a = *b` antes de guardar `*a`, destruyes el valor original de `a` irreversiblemente.',
    mentalSteps: [
      {
        num: 1,
        title: 'Preservar el Primer Valor en la Pila Local',
        desc: 'Desreferencia el puntero `a` y guarda su valor numérico de 4 bytes en una variable local `tmp`.',
        cCode: 'int tmp = *a;'
      },
      {
        num: 2,
        title: 'Sobrescribir el Primer Destino con el Segundo',
        desc: 'Desreferencia `b` y escribe su valor en la dirección física de `*a`. En este instante, ambas celdas tienen el valor de `b`.',
        cCode: '*a = *b;'
      },
      {
        num: 3,
        title: 'Asignar el Valor Preservado en el Segundo Destino',
        desc: 'Escribe el valor guardado en `tmp` en la celda apuntada por `b`, completando el intercambio físico simétrico.',
        cCode: '*b = tmp;'
      }
    ],
    dictionary: [
      { human: 'Acceder al valor apuntado', c: '*a', note: 'Operador de desreferenciación de puntero' },
      { human: 'Guardar temporal en Stack', c: 'int tmp = *a;', note: 'Variable local auxiliar imprescindible' },
      { human: 'Modificar la celda remota', c: '*a = *b;', note: 'Sobrescritura in-place de la memoria' }
    ],
    quiz: {
      question: "¿Qué ocurriría si ejecutamos `*a = *b; *b = *a;` sin variable temporal?",
      options: [
        "Ambas variables terminarán teniendo el valor original de *b, perdiendo el valor de *a para siempre",
        "El compilador generará un error de sintaxis",
        "Se produce un Segmentation Fault"
      ],
      correctIdx: 0,
      explanation: "Al hacer `*a = *b`, sobrescribes el valor de `*a`. Luego `*b = *a` asignará de nuevo ese mismo valor, perdiéndose el valor previo de `a`."
    }
  },

  ft_putstr: {
    prototype: 'void ft_putstr(char *str);',
    signature: 'char *str',
    inputDataTypes: [
      {
        param: 'char *str',
        type: 'Puntero simple a carácter (char * — 8 bytes)',
        explanation: 'Dirección del primer carácter de un string terminado en byte nulo (\'\\0\') en la memoria del llamador.',
        whyThisType: 'Acceso secuencial directo a cada byte sin necesidad de duplicar la cadena en memoria.',
        keyConcept: 'Llamada al sistema write() y descriptor de archivo STDOUT (1).'
      }
    ],
    outputDataTypes: {
      returnType: 'void (sin retorno)',
      whatItTransforms: 'Escribe cada byte en la salida estándar (Descriptor 1) mediante llamadas a `write(1, &str[i], 1)` hasta encontrar \'\\0\'. No emite salto de línea adicional a menos que esté en el string.',
      whyReturn: 'Función de efecto secundario pura en la consola.'
    },
    goldenRule: "Nunca emitir salto de línea '\\n' al final. ft_putstr debe imprimir exactamente los caracteres de la cadena y nada más. Agregar un '\\n' es la causa #1 de KO en Moulinette para esta función.",
    mentalSteps: [
      {
        num: 1,
        title: 'Inicializar Puntero o Índice de Avance',
        desc: 'Declarar `int i = 0;` para indexar el string byte a byte.',
        cCode: 'int i = 0;'
      },
      {
        num: 2,
        title: "Bucle de Escritura hasta Centinela '\\0'",
        desc: "Mientras `str[i] != '\\0'`, invocar la llamada al sistema write con el descriptor 1 (STDOUT), pasando la dirección de memoria de la celda `&str[i]`.",
        cCode: 'while (str[i]) {\n    write(1, &str[i], 1);\n    i++;\n}'
      }
    ],
    dictionary: [
      { human: 'Descriptor de salida estándar', c: 'write(1, ...)', note: '1 representa STDOUT_FILENO en UNIX' },
      { human: 'Dirección del byte actual', c: '&str[i]', note: 'write requiere un puntero a la memoria del dato' }
    ],
    quiz: {
      question: "¿Por qué pasamos `&str[i]` a `write` y no simplemente `str[i]`?",
      options: [
        "Porque `write` espera como segundo argumento un puntero (`const void *buf`) a la memoria donde reside el dato",
        "Porque en C no se pueden imprimir caracteres sin ampersand",
        "Para acelerar la llamada al sistema"
      ],
      correctIdx: 0,
      explanation: "El prototipo de write es `ssize_t write(int fd, const void *buf, size_t count)`. Espera una dirección de memoria, que se obtiene con `&str[i]`."
    }
  },

  ft_strcpy: {
    prototype: 'char *ft_strcpy(char *s1, char *s2);',
    signature: 'char *s1, char *s2',
    inputDataTypes: [
      {
        param: 'char *s1',
        type: 'Puntero a búfer de destino (char *)',
        explanation: 'Dirección de memoria donde se escribirán los bytes copiados. Debe tener suficiente espacio alocado para contener todos los caracteres de s2 más el byte nulo.',
        whyThisType: 'Puntero de escritura mutativa.',
        keyConcept: 'Búfer de destino y sobrescritura de memoria contigua.'
      },
      {
        param: 'char *s2',
        type: 'Puntero a cadena fuente (char *)',
        explanation: 'Cadena terminada en \'\\0\' cuyos caracteres se leerán secuencialmente.',
        whyThisType: 'Puntero de lectura.',
        keyConcept: 'Copia byte a byte hasta encontrar centinela nulo.'
      }
    ],
    outputDataTypes: {
      returnType: 'char * (puntero a s1)',
      whatItTransforms: 'Copia cada byte de `s2` en la posición equivalente de `s1`. Escribe obligatoriamente un byte nulo `\\0` al final en `s1[i] = \'\\0\'. Retorna el puntero original `s1`.',
      whyReturn: 'Permite encadenar llamadas a funciones que operan sobre cadenas en C.'
    },
    goldenRule: "Asegurar OBLIGATORIAMENTE el byte nulo final: `s1[i] = '\\0';` tras salir del bucle. Sin esta asignación, el string de destino no tendrá fin y cualquier llamada posterior (como strlen o printf) causará lectura de memoria basura y Segfault.",
    mentalSteps: [
      {
        num: 1,
        title: 'Inicializar Índice de Transferencia',
        desc: 'Declarar `int i = 0;` para sincronizar la lectura en s2 y la escritura en s1.',
        cCode: 'int i = 0;'
      },
      {
        num: 2,
        title: 'Copiar Byte a Byte',
        desc: 'Asignar `s1[i] = s2[i]` e incrementar `i++` mientras `s2[i]` sea distinto de byte nulo.',
        cCode: 'while (s2[i] != \'\\0\') {\n    s1[i] = s2[i];\n    i++;\n}'
      },
      {
        num: 3,
        title: "Colocar el Centinela '\\0' de Cierre",
        desc: "Colocar el terminador nulo en la posición de frenado.",
        cCode: "s1[i] = '\\0';"
      },
      {
        num: 4,
        title: 'Retornar el Puntero de Destino s1',
        desc: 'Retornar s1 según exige el estándar POSIX.',
        cCode: 'return (s1);'
      }
    ],
    dictionary: [
      { human: 'Transferencia de byte', c: 's1[i] = s2[i];', note: 'Lectura de s2 y escritura en s1 en el mismo ciclo' },
      { human: 'Terminador nulo', c: "s1[i] = '\\0';", note: 'Garantiza la validez del string en C' }
    ],
    quiz: {
      question: "¿Qué retorna la función `ft_strcpy` según el subject de 42?",
      options: [
        "El puntero al string de destino `s1`",
        "El número de bytes copiados",
        "El puntero a la cadena fuente `s2`"
      ],
      correctIdx: 0,
      explanation: "El estándar de strcpy en C y en el subject de 42 estipula que la función debe retornar `s1`."
    }
  },

  fizzbuzz: {
    prototype: 'int main(void);',
    signature: 'void (sin parámetros)',
    inputDataTypes: [
      {
        param: 'void',
        type: 'Ninguno (sin parámetros en terminal)',
        explanation: 'fizzbuzz es un programa autónomo que no lee argumentos de terminal.',
        whyThisType: 'Algoritmo fijo con bucle estricto de 1 a 100.',
        keyConcept: 'Aritmética modular y control de flujo condicional.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite en STDOUT números del 1 al 100 con sus respectivos saltos de línea. Los múltiplos de 3 se sustituyen por "fizz", los de 5 por "buzz" y los de 15 por "fizzbuzz".',
      whyReturn: 'Salida exitosa.'
    },
    goldenRule: "Comprobar PRIMERO el caso de múltiplo de 15 (o `i % 3 == 0 && i % 5 == 0`). Si compruebas primero `% 3`, el número 15 imprimirá 'fizz' en vez de 'fizzbuzz', reprobando el ejercicio de inmediato.",
    mentalSteps: [
      {
        num: 1,
        title: 'Bucle Contador del 1 al 100 Inclusivo',
        desc: 'Inicializar `int i = 1;` y avanzar mientras `i <= 100`.',
        cCode: 'int i = 1;\nwhile (i <= 100) {\n    // comprobaciones\n    i++;\n}'
      },
      {
        num: 2,
        title: 'Evaluar Múltiplo de 15 Antes que Nada',
        desc: 'Si `i % 15 == 0`, escribir "fizzbuzz".',
        cCode: 'if (i % 15 == 0)\n    write(1, "fizzbuzz", 8);'
      },
      {
        num: 3,
        title: 'Evaluar Múltiplos de 3 o 5 Individuales',
        desc: 'Si no es 15, evaluar si es divisible por 3 ("fizz") o por 5 ("buzz").',
        cCode: 'else if (i % 3 == 0)\n    write(1, "fizz", 4);\nelse if (i % 5 == 0)\n    write(1, "buzz", 4);'
      },
      {
        num: 4,
        title: 'Imprimir Número Numéricamente con write',
        desc: 'Si no es múltiplo de ninguno, convertir decenas y unidades a ASCII y emitir.',
        cCode: 'else {\n    if (i >= 10) {\n        char c = (i / 10) + \'0\';\n        write(1, &c, 1);\n    }\n    char c = (i % 10) + \'0\';\n    write(1, &c, 1);\n}\nwrite(1, "\\n", 1);'
      }
    ],
    dictionary: [
      { human: 'Múltiplo de 15', c: 'i % 15 == 0', note: 'Equivale a ser múltiplo de 3 y de 5 simultáneamente' },
      { human: 'Dígito de decenas', c: "(i / 10) + '0'", note: 'División entera para obtener las decenas en ASCII' },
      { human: 'Dígito de unidades', c: "(i % 10) + '0'", note: 'Módulo 10 para obtener las unidades en ASCII' }
    ],
    quiz: {
      question: "¿Por qué se comprueba `i % 15 == 0` antes que `i % 3 == 0`?",
      options: [
        "Porque 15 también es divisible por 3; si comprobáramos 3 primero, 15 imprimiría 'fizz' y nunca llegaría a la condición de 15",
        "Porque 15 es un número mayor",
        "Para evitar división por cero"
      ],
      correctIdx: 0,
      explanation: "En una cadena if/else if, la primera condición verdadera gana. Como los múltiplos de 15 son un subconjunto de los de 3, deben evaluarse primero."
    }
  },

  rev_print: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar CLI (int y char **)',
        explanation: 'argv[1] contiene la cadena a emitir en orden inverso.',
        whyThisType: 'Programa CLI.',
        keyConcept: 'Indexación inversa y cálculo previo de longitud.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite por STDOUT los caracteres de argv[1] desde el último hasta el primero, seguido de \'\\n\'. Si argc != 2, emite solo \'\\n\'.',
      whyReturn: 'Salida exitosa.'
    },
    goldenRule: "Calcular la longitud con `while (argv[1][len]) len++;` y luego iterar desde `len - 1` hasta 0 (con `len--`). ¡Cuidado con empezar en `len`! La posición `argv[1][len]` es el byte nulo '\\0' y no debe imprimirse.",
    mentalSteps: [
      {
        num: 1,
        title: 'Verificar Parámetro Único',
        desc: 'Validar si argc == 2. Si no, emitir salto de línea y salir.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Calcular Longitud del String',
        desc: 'Avanzar hasta encontrar el byte nulo para conocer cuántos caracteres hay.',
        cCode: 'int len = 0;\nwhile (argv[1][len])\n    len++;'
      },
      {
        num: 3,
        title: 'Iterar Hacia Atrás desde len - 1',
        desc: 'Decrementar y emitir cada byte mientras len > 0.',
        cCode: 'while (len > 0) {\n    len--;\n    write(1, &argv[1][len], 1);\n}'
      },
      {
        num: 4,
        title: 'Salto de Línea Final',
        desc: 'Emitir el salto de línea al concluir.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Retroceso con pre-decremento', c: 'while (len > 0) { len--; write(...); }', note: 'Visita los índices desde (total - 1) hasta 0 exactamente' }
    ],
    quiz: {
      question: "Si argv[1] es \"abc\", ¿qué valor tiene len al inicio y qué índices se imprimen?",
      options: [
        "len es 3, y se imprimen los índices 2 ('c'), 1 ('b') y 0 ('a')",
        "len es 4, y se imprime primero '\\0'",
        "len es 2"
      ],
      correctIdx: 0,
      explanation: "\"abc\" tiene 3 caracteres. Los índices válidos son 0, 1 y 2. Se imprimen en orden 2, 1, 0."
    }
  },

  repeat_alpha: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar CLI (int y char **)',
        explanation: 'argv[1] contiene la cadena a procesar repitiendo cada letra tantas veces como su índice alfabético (a=1, b=2, z=26).',
        whyThisType: 'Programa CLI.',
        keyConcept: 'Cálculo de índice alfabético y bucle anidado de repetición.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite cada carácter repetido N veces. Caracteres no alfabéticos se emiten exactamente 1 vez.',
      whyReturn: 'Salida exitosa.'
    },
    goldenRule: "Calcular el conteo con `c - 'a' + 1` para minúsculas y `c - 'A' + 1` para mayúsculas. Sumar siempre el `+ 1`: la 'a' debe imprimirse 1 vez ('a' - 'a' = 0, + 1 = 1). Si olvidas el +1, la 'a' se imprimirá 0 veces y desaparecerá.",
    mentalSteps: [
      {
        num: 1,
        title: 'Comprobar argc == 2',
        desc: 'Si no hay exactamente un argumento, emitir salto de línea y salir.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Calcular Número de Repeticiones para el Carácter',
        desc: 'Si es minúscula, `repeat = c - \'a\' + 1`. Si es mayúscula, `repeat = c - \'A\' + 1`. En otro caso `repeat = 1`.',
        cCode: 'int count = 1;\nchar c = argv[1][i];\nif (c >= \'a\' && c <= \'z\') count = c - \'a\' + 1;\nelse if (c >= \'A\' && c <= \'Z\') count = c - \'A\' + 1;'
      },
      {
        num: 3,
        title: 'Bucle Anidado de Escritura',
        desc: 'Ejecutar `write(1, &c, 1)` `count` veces.',
        cCode: 'while (count > 0) {\n    write(1, &c, 1);\n    count--;\n}'
      },
      {
        num: 4,
        title: 'Salto de Línea Final',
        desc: 'Salto de línea obligatorio.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Índice alfabético 1-based', c: "c - 'a' + 1", note: "'a' da 1, 'b' da 2, 'z' da 26" }
    ],
    quiz: {
      question: "¿Cuántas veces se imprimirá la letra 'c' en repeat_alpha?",
      options: [
        "3 veces ('c' - 'a' + 1 = 2 + 1 = 3)",
        "2 veces",
        "1 vez"
      ],
      correctIdx: 0,
      explanation: "'c' es la 3ª letra del abecedario, por lo que se emite 3 veces: \"ccc\"."
    }
  },

  search_and_replace: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc',
        type: 'Entero (int)',
        explanation: 'Debe ser exactamente 4: argv[0] (programa), argv[1] (texto), argv[2] (carácter a buscar), argv[3] (carácter reemplazo).',
        whyThisType: 'Tres parámetros del usuario.',
        keyConcept: 'Validación estricta de cadenas de 1 solo carácter.'
      },
      {
        param: 'char **argv',
        type: 'Array de cadenas (char **)',
        explanation: 'argv[2] y argv[3] deben ser cadenas con longitud exactamente 1 (es decir, `argv[2][1] == \'\\0\'` y `argv[3][1] == \'\\0\'`).',
        whyThisType: 'Contiene los strings del comando.',
        keyConcept: 'Verificación de centinela para comprobar longitud unitaria.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite argv[1] donde cada ocurrencia de `argv[2][0]` se sustituye por `argv[3][0]`. Si argc != 4 o los argumentos 2 y 3 no tienen longitud 1, emite únicamente \'\\n\'.',
      whyReturn: 'Salida exitosa.'
    },
    goldenRule: "Verificar OBLIGATORIAMENTE que `argv[2][1] == '\\0'` y `argv[3][1] == '\\0'`. El subject dice expresamente que si el 2º o 3º argumento no son un solo carácter, solo debe imprimirse un salto de línea.",
    mentalSteps: [
      {
        num: 1,
        title: 'Verificación Estricta de 3 Parámetros y Carácter Único',
        desc: 'Comprobar argc == 4 y que argv[2][1] y argv[3][1] sean el terminador nulo.',
        cCode: 'if (argc != 4 || argv[2][1] != \'\\0\' || argv[3][1] != \'\\0\') {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Recorrer y Sustituir en Salida',
        desc: 'Si `argv[1][i] == argv[2][0]`, escribir `&argv[3][0]`; si no, escribir `&argv[1][i]`.',
        cCode: 'int i = 0;\nwhile (argv[1][i]) {\n    if (argv[1][i] == argv[2][0])\n        write(1, &argv[3][0], 1);\n    else\n        write(1, &argv[1][i], 1);\n    i++;\n}'
      },
      {
        num: 3,
        title: 'Salto de Línea Final',
        desc: 'Salto de línea de cierre.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Comprobar que un string tiene exactamente 1 char', c: "argv[2][1] == '\\0'", note: "El índice 0 es el carácter, el 1 debe ser el fin de cadena" }
    ],
    quiz: {
      question: "¿Qué debe hacer el programa si se ejecuta `./search_and_replace \"hola\" \"l\" \"xx\"`?",
      options: [
        "Imprimir únicamente un salto de línea '\\n', porque el tercer argumento no es un solo carácter",
        "Reemplazar 'l' por 'xx'",
        "Lanzar un error"
      ],
      correctIdx: 0,
      explanation: "El subject estipula que si alguno de los argumentos de búsqueda o reemplazo no es exactamente un solo carácter, se emite únicamente un salto de línea."
    }
  },

  ulstr: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar CLI (int y char **)',
        explanation: 'argv[1] contiene la cadena a la cual invertir la caja de sus letras (mayúsculas a minúsculas, minúsculas a mayúsculas).',
        whyThisType: 'Programa CLI.',
        keyConcept: 'Diferencia de 32 entre mayúsculas y minúsculas en la tabla ASCII.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite el texto invirtiendo cada letra. Caracteres no alfabéticos permanecen inalterados.',
      whyReturn: 'Salida exitosa.'
    },
    goldenRule: "En la tabla ASCII, 'a' (97) - 'A' (65) = 32. Por tanto, para pasar de mayúscula a minúscula se suma 32 (`c += 32`); para pasar de minúscula a mayúscula se resta 32 (`c -= 32`).",
    mentalSteps: [
      {
        num: 1,
        title: 'Validar argc == 2',
        desc: 'Si no hay exactamente un argumento, emitir salto de línea y salir.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Inversión de Caja ASCII',
        desc: 'Si está en rango minúscula restar 32; si está en rango mayúscula sumar 32.',
        cCode: 'int i = 0;\nwhile (argv[1][i]) {\n    char c = argv[1][i];\n    if (c >= \'a\' && c <= \'z\') c -= 32;\n    else if (c >= \'A\' && c <= \'Z\') c += 32;\n    write(1, &c, 1);\n    i++;\n}'
      },
      {
        num: 3,
        title: 'Salto de Línea Final',
        desc: 'Salto de línea obligatorio.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Convertir minúscula a mayúscula', c: 'c -= 32;', note: "Resta 32 al código ASCII ('a' -> 'A')" },
      { human: 'Convertir mayúscula a minúscula', c: 'c += 32;', note: "Suma 32 al código ASCII ('A' -> 'a')" }
    ],
    quiz: {
      question: "¿Por qué el bit 5 de un carácter ASCII controla la distinción entre mayúsculas y minúsculas?",
      options: [
        "Porque 2^5 = 32; en binario, 'a' (01100001) y 'A' (01000001) solo difieren en el bit 5 (0x20)",
        "Porque la tabla ASCII se inventó en 1932",
        "Porque 32 es el espacio en blanco"
      ],
      correctIdx: 0,
      explanation: "Sumar o restar 32 equivale a encender o apagar el bit 5 (máscara 0x20), convirtiendo entre mayúsculas y minúsculas en un solo paso."
    }
  },

  first_word: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc',
        type: 'Entero de conteo de argumentos (int — 4 bytes)',
        explanation: 'Representa cuántos argumentos se pasaron al invocar el binario en la terminal. El nombre del programa cuenta como 1 (argv[0]). Por tanto, para tener exactamente 1 argumento del usuario se requiere argc == 2.',
        whyThisType: 'Convención estándar del estándar POSIX y ABI de UNIX.',
        keyConcept: 'Cláusula de guarda estricta de parámetros en programas CLI.'
      },
      {
        param: 'char **argv',
        type: 'Array de punteros a cadenas (char ** — 8 bytes por puntero)',
        explanation: 'Vector en la pila del sistema operativo. `argv[1]` es el puntero al string introducido por el usuario, y `argv[1][i]` es el carácter individual.',
        whyThisType: 'Permite indexar y recorrer la cadena del usuario directamente sin necesidad de copiarla.',
        keyConcept: 'Indexación bidimensional sobre puntero doble.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (código de salida al sistema operativo, 0 para EXIT_SUCCESS)',
      whatItTransforms: 'Escribe en Descriptor 1 (STDOUT con write) únicamente los caracteres de la primera palabra delimitada por espacios (\' \') o tabulaciones (\'\\t\'), seguidos de un salto de línea \'\\n\'. Si argc != 2 o el string está vacío, emite solo \'\\n\'.',
      whyReturn: 'UNIX requiere que el proceso devuelva 0 al shell para indicar terminación normal.'
    },
    goldenRule: "Si `argc != 2`, imprimir '\\n' y hacer `return (0)` INMEDIATAMENTE. Sin el return, el programa continuará su ejecución, intentará leer `argv[1]` que es NULL y colapsará con Segmentation Fault.",
    mentalSteps: [
      {
        num: 1,
        title: 'Cláusula de Guarda de Argumentos (argc)',
        desc: 'Verifica si recibiste exactamente un argumento (argc == 2). Si no, emite un salto de línea y concluye la ejecución.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Bucle 1: Saltar Espacios y Tabs Iniciales',
        desc: 'Avanza el índice `i` mientras el byte sea espacio (\' \') o tabulación (\'\\t\'). El tabulador es obligatorio según el subject.',
        cCode: 'int i = 0;\nwhile (argv[1][i] == \' \' || argv[1][i] == \'\\t\')\n    i++;'
      },
      {
        num: 3,
        title: 'Bucle 2: Imprimir la Primera Palabra',
        desc: 'Imprime byte a byte mientras no sea espacio, ni tabulador, ni byte nulo (\\0).',
        cCode: 'while (argv[1][i] && argv[1][i] != \' \' && argv[1][i] != \'\\t\') {\n    write(1, &argv[1][i], 1);\n    i++;\n}'
      },
      {
        num: 4,
        title: 'Salto de Línea Final Obligatorio',
        desc: 'Al terminar de imprimir la palabra (o si no había ninguna palabra), emite el salto de línea y retorna 0.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Comprobar argumento único', c: 'if (argc != 2)', note: 'argv[0] es el ejecutable, argv[1] es el texto' },
      { human: 'Saltar separadores', c: "while (s[i] == ' ' || s[i] == '\\t')", note: 'Comprobar SIEMPRE ambos separadores' },
      { human: 'Emitir carácter', c: 'write(1, &argv[1][i], 1)', note: 'Pasar la dirección de memoria del carácter a write' }
    ],
    quiz: {
      question: "¿Qué ocurre si ejecutas `./first_word \"   \\t   \"` (un string con solo espacios y tabs)?",
      options: [
        "El bucle 1 salta todos los separadores, el bucle 2 no se ejecuta, e imprime solo un salto de línea '\\n'",
        "Imprime espacios en blanco antes del salto de línea",
        "Causa un Segmentation Fault por intentar leer más allá de la memoria"
      ],
      correctIdx: 0,
      explanation: "El primer bucle avanza hasta encontrar '\\0'. El segundo bucle comprueba `argv[1][i]`, como es '\\0' (falso), no entra. Finalmente se escribe '\\n' cumpliendo las reglas del examen."
    }
  },

  rotone: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar de CLI (int y char **)',
        explanation: 'argv[1] contiene la cadena de entrada a transformar desplazando cada letra una posición en el alfabeto latino.',
        whyThisType: 'Programa CLI que opera sobre parámetros pasados desde la terminal.',
        keyConcept: 'Desplazamiento modular sobre rangos de caracteres ASCII.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Escribe en STDOUT cada letra rotada una posición (\'a\'->\'b\', \'z\'->\'a\', \'A\'->\'B\', \'Z\'->\'A\'). Los caracteres no alfabéticos se emiten intactos. Finaliza con \'\\n\'.',
      whyReturn: 'Terminación limpia de proceso UNIX.'
    },
    goldenRule: "Gestionar el caso extremo de la 'z' y 'Z': rotar 'z' debe dar 'a', y 'Z' debe dar 'A'. No uses simplemente `c + 1` porque 'z' + 1 daría '{' (carácter 123), provocando KO en Moulinette.",
    mentalSteps: [
      {
        num: 1,
        title: 'Verificar Parámetro Único',
        desc: 'Comprobar argc == 2. Si no, emitir salto de línea y salir inmediatamente.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Iterar sobre la Cadena con Variable Auxiliar',
        desc: 'Recorrer argv[1] carácter a carácter. Copiar el carácter en una variable local `c` para aplicar la transformación.',
        cCode: 'int i = 0;\nwhile (argv[1][i]) {\n    char c = argv[1][i];\n    // lógica de rotación\n    i++;\n}'
      },
      {
        num: 3,
        title: "Rotación Condicional con Casos Borde 'z' y 'Z'",
        desc: "Si es 'z' o 'Z', restar 25 para volver a 'a' o 'A'. Si está en rango 'a'-'y' o 'A'-'Y', sumar 1. En cualquier otro caso, dejarlo intacto.",
        cCode: "if ((c >= 'a' && c <= 'y') || (c >= 'A' && c <= 'Y'))\n    c += 1;\nelse if (c == 'z' || c == 'Z')\n    c -= 25;\nwrite(1, &c, 1);"
      },
      {
        num: 4,
        title: 'Salto de Línea Final',
        desc: 'Escribir el salto de línea al concluir la iteración.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Detectar letra minúscula excepto z', c: "c >= 'a' && c <= 'y'", note: "Permite sumar 1 con seguridad" },
      { human: 'Envolver z en a', c: "c -= 25;", note: "'z' (122) - 25 = 'a' (97)" },
      { human: 'Emitir carácter transformado', c: "write(1, &c, 1);", note: "Envía el byte por el descriptor STDOUT" }
    ],
    quiz: {
      question: "¿Por qué `c -= 25` transforma 'z' en 'a'?",
      options: [
        "Porque el abecedario tiene 26 letras; restar 25 al valor ASCII de 'z' equivale a retroceder hasta la 'a'",
        "Porque 25 es el código ASCII de salto de línea",
        "Porque en C no se puede sumar 1 a la 'z'"
      ],
      correctIdx: 0,
      explanation: "'z' tiene código ASCII 122 y 'a' tiene código 97. 122 - 25 = 97 ('a'). Lo mismo ocurre con 'Z' (90) - 25 = 'A' (65)."
    }
  },

  rot_13: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar de CLI (int y char **)',
        explanation: 'argv[1] contiene la cadena a cifrar/descifrar con ROT13 (desplazamiento de 13 posiciones en el alfabeto).',
        whyThisType: 'Programa CLI que lee de terminal.',
        keyConcept: 'Cifrado simétrico de sustitución César con módulo 26.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite cada letra desplazada 13 posiciones. Al haber 26 letras en el abecedario, aplicar ROT13 dos veces devuelve el texto original. Símbolos y dígitos no se alteran.',
      whyReturn: 'Salida de proceso exitoso.'
    },
    goldenRule: "Dividir las letras en dos mitades: de 'a' a 'm' sumar 13; de 'n' a 'z' restar 13 (y lo mismo para mayúsculas 'A'-'M' y 'N'-'Z'). Si sumas 13 a una 'n' (110 + 13 = 123) te sales del alfabeto ASCII hacia símbolos extraños.",
    mentalSteps: [
      {
        num: 1,
        title: 'Cláusula de Guarda de Argumentos',
        desc: 'Comprueba argc == 2. Si es falso, emite salto de línea y concluye.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Clasificar la Letra en Primera o Segunda Mitad',
        desc: "Las primeras 13 letras ('a'-'m', 'A'-'M') avanzan (+13). Las últimas 13 letras ('n'-'z', 'N'-'Z') retroceden (-13).",
        cCode: "char c = argv[1][i];\nif ((c >= 'a' && c <= 'm') || (c >= 'A' && c <= 'M'))\n    c += 13;\nelse if ((c >= 'n' && c <= 'z') || (c >= 'N' && c <= 'Z'))\n    c -= 13;"
      },
      {
        num: 3,
        title: 'Escritura y Avance',
        desc: 'Emite el carácter (transformado o intacto) y continúa con el siguiente hasta el terminador.',
        cCode: 'write(1, &c, 1);\ni++;'
      },
      {
        num: 4,
        title: 'Salto de Línea Final',
        desc: 'Salto de línea tras procesar todos los caracteres.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Primera mitad del abecedario', c: "(c >= 'a' && c <= 'm')", note: "Letras que admiten sumar 13 sin desbordar" },
      { human: 'Segunda mitad del abecedario', c: "(c >= 'n' && c <= 'z')", note: "Letras que deben restar 13 para dar la vuelta" }
    ],
    quiz: {
      question: "¿Qué ocurre si aplicas ROT13 dos veces sobre la letra 'A'?",
      options: [
        "'A' + 13 = 'N', y luego 'N' - 13 = 'A', recuperando la letra original",
        "Se convierte en 'Z'",
        "Se desborda a un carácter no imprimible"
      ],
      correctIdx: 0,
      explanation: "El cifrado ROT13 es simétrico e involutivo porque 13 es exactamente la mitad de las 26 letras del alfabeto."
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NIVEL 2
  // ───────────────────────────────────────────────────────────────────────────
  inter: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc',
        type: 'Entero (int)',
        explanation: 'Debe ser exactamente 3 (nombre del programa + 2 strings a intersectar).',
        whyThisType: 'Requiere dos cadenas del usuario para calcular su intersección.',
        keyConcept: 'Validación de múltiples argumentos.'
      },
      {
        param: 'char **argv',
        type: 'Vector de strings (char **)',
        explanation: 'argv[1] es la primera cadena (determina el orden de salida) y argv[2] es la cadena donde comprobaremos presencia.',
        whyThisType: 'Acceso directo a los dos búferes.',
        keyConcept: 'Búsqueda de pertenencia y preservación de orden.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Escribe en STDOUT los caracteres presentes en ambos strings sin duplicados, en el orden exacto en que aparecen en argv[1], seguidos de \'\\n\'.',
      whyReturn: 'Finalización de proceso CLI.'
    },
    goldenRule: "Usa una tabla de hash booleana directa `int seen[256] = {0};` para evitar duplicados en O(1). ¡Haz siempre cast `(unsigned char)argv[1][i]`! Los caracteres con tilde o acentos tienen valores negativos en un `char` con signo y romperían los límites de la tabla de memoria causando Segfault.",
    mentalSteps: [
      {
        num: 1,
        title: 'Validación de 2 Argumentos',
        desc: 'Verifica argc == 3. Si no, emite salto de línea y concluye.',
        cCode: 'if (argc != 3) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Inicializar Tabla de Caracteres Vistos en Stack',
        desc: 'Declara `int seen[256] = {0};`. Cada índice representa un valor ASCII de 0 a 255.',
        cCode: 'int seen[256] = {0};\nint i = 0;'
      },
      {
        num: 3,
        title: 'Recorrer el Primer String y Buscar en el Segundo',
        desc: 'Para cada carácter de s1 que no haya sido visto aún (`!seen[(unsigned char)s1[i]]`), recorre s2 buscando coincidencia.',
        cCode: 'while (argv[1][i]) {\n    unsigned char c = (unsigned char)argv[1][i];\n    if (!seen[c]) {\n        int j = 0;\n        while (argv[2][j]) {\n            if ((unsigned char)argv[2][j] == c) {\n                write(1, &c, 1);\n                seen[c] = 1;\n                break;\n            }\n            j++;\n        }\n    }\n    i++;\n}'
      },
      {
        num: 4,
        title: 'Salto de Línea Final',
        desc: 'Cierra la salida estándar con un salto de línea.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Tabla de frecuencias en stack', c: 'int seen[256] = {0};', note: 'Acceso en tiempo constante O(1)' },
      { human: 'Cast seguro para índice', c: '(unsigned char)str[i]', note: 'Garantiza índices entre 0 y 255' },
      { human: 'Marcar carácter como emitido', c: 'seen[c] = 1;', note: 'Evita repeticiones posteriores' }
    ],
    quiz: {
      question: "¿Por qué la tabla `seen` debe tener 256 posiciones y no 128?",
      options: [
        "Porque la tabla ASCII extendida tiene 256 posibles valores para 1 byte (0 a 255)",
        "Porque en C todos los arrays deben ser potencia de 2",
        "Porque argc multiplica el tamaño por dos"
      ],
      correctIdx: 0,
      explanation: "Un unsigned char en C ocupa 1 byte (8 bits), lo que permite 2^8 = 256 combinaciones distintas de caracteres."
    }
  },

  union: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar CLI (int y char **)',
        explanation: 'argv[1] y argv[2] son los dos strings cuya unión sin duplicados se desea emitir.',
        whyThisType: 'Requiere dos parámetros en terminal.',
        keyConcept: 'Unión de conjuntos y preservación de primer avistamiento.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite en STDOUT todos los caracteres de argv[1] seguidos de los de argv[2], ignorando cualquier carácter que ya haya sido emitido previamente.',
      whyReturn: 'Salida de proceso exitoso.'
    },
    goldenRule: "Usa la misma tabla `seen[256]` tanto para el primer string como para el segundo. Al procesar el segundo string, si una letra ya estaba en `seen`, no se emite, logrando la unión perfecta sin duplicados.",
    mentalSteps: [
      {
        num: 1,
        title: 'Comprobar argc == 3',
        desc: 'Si no hay exactamente 2 strings, emitir salto de línea y salir.',
        cCode: 'if (argc != 3) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Recorrer argv[1] Marcando en seen[256]',
        desc: 'Escribe y marca cada carácter de argv[1] que no haya sido visto.',
        cCode: 'int seen[256] = {0};\nint i = 0;\nwhile (argv[1][i]) {\n    unsigned char c = (unsigned char)argv[1][i];\n    if (!seen[c]) {\n        write(1, &c, 1);\n        seen[c] = 1;\n    }\n    i++;\n}'
      },
      {
        num: 3,
        title: 'Recorrer argv[2] Usando la Misma Tabla',
        desc: 'Itera sobre argv[2]. Si un carácter no estaba en seen, se emite y se marca.',
        cCode: 'int j = 0;\nwhile (argv[2][j]) {\n    unsigned char c = (unsigned char)argv[2][j];\n    if (!seen[c]) {\n        write(1, &c, 1);\n        seen[c] = 1;\n    }\n    j++;\n}'
      },
      {
        num: 4,
        title: 'Salto de Línea Final',
        desc: 'Emite salto de línea final obligatorio.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Unión sin duplicados', c: 'if (!seen[c]) { write(1, &c, 1); seen[c] = 1; }', note: 'Patrón de filtrado O(1)' }
    ],
    quiz: {
      question: "¿Cuál es la complejidad temporal de este algoritmo con tabla seen[256]?",
      options: [
        "O(N + M), lineal respecto a las longitudes de los dos strings",
        "O(N * M), cuadrática por comparar cada carácter",
        "O(1), constante"
      ],
      correctIdx: 0,
      explanation: "Con acceso directo a la tabla seen en O(1), solo recorremos cada string una sola vez. N pasos para argv[1] y M pasos para argv[2]."
    }
  },

  last_word: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar CLI (int y char **)',
        explanation: 'argv[1] contiene la frase cuya última palabra se debe imprimir.',
        whyThisType: 'Programa CLI.',
        keyConcept: 'Escaneo inverso de strings desde el terminador hacia el inicio.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Imprime la última palabra de argv[1] seguida de salto de línea. Si no hay palabras o argc != 2, emite solo \'\\n\'.',
      whyReturn: 'Salida exitosa.'
    },
    goldenRule: "Escanear desde el final hacia el principio: 1) Ir hasta el '\\0' con `while (argv[1][i]) i++;`. 2) Retroceder saltando espacios y tabs finales `while (i > 0 && is_space(argv[1][i - 1])) i--;`. 3) Guardar el fin `end = i;`. 4) Retroceder hasta el inicio de esa palabra `while (i > 0 && !is_space(argv[1][i - 1])) i--;`. 5) Imprimir desde `i` hasta `end`. ¡Hacerlo hacia adelante es mucho más complejo y propenso a errores!",
    mentalSteps: [
      {
        num: 1,
        title: 'Verificar argc == 2',
        desc: 'Comprobar argumento único. Si falla, emitir salto de línea y terminar.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: "Avanzar hasta el Centinela '\\0'",
        desc: 'Calcular el final de la cadena.',
        cCode: 'int i = 0;\nwhile (argv[1][i])\n    i++;'
      },
      {
        num: 3,
        title: 'Saltar Espacios y Tabs Finales en Reversa',
        desc: 'Retroceder mientras el carácter previo sea espacio o tabulación.',
        cCode: 'while (i > 0 && (argv[1][i - 1] == \' \' || argv[1][i - 1] == \'\\t\'))\n    i--;\nint end = i;'
      },
      {
        num: 4,
        title: 'Retroceder hasta el Inicio de la Última Palabra',
        desc: 'Retroceder mientras no sea espacio ni tabulación.',
        cCode: 'while (i > 0 && argv[1][i - 1] != \' \' && argv[1][i - 1] != \'\\t\')\n    i--;'
      },
      {
        num: 5,
        title: 'Imprimir el Segmento Extraído de i a end',
        desc: 'Emitir los caracteres de la palabra y terminar con salto de línea.',
        cCode: 'while (i < end) {\n    write(1, &argv[1][i], 1);\n    i++;\n}\nwrite(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Índice de fin de palabra', c: 'int end = i;', note: 'Marca el límite superior exclusivo de la palabra' },
      { human: 'Comprobación de carácter previo', c: "argv[1][i - 1]", note: 'Permite retroceder con seguridad verificando i > 0' }
    ],
    quiz: {
      question: "¿Por qué es mucho más eficiente buscar la última palabra desde el final hacia el inicio?",
      options: [
        "Porque solo se examina la última palabra y sus espacios posteriores en O(K), en lugar de analizar y descartar todas las palabras previas",
        "Porque en C no se pueden recorrer strings hacia adelante",
        "Porque malloc no funciona con cadenas largas"
      ],
      correctIdx: 0,
      explanation: "Al empezar por el final, saltas los espacios finales y encuentras directamente la palabra objetivo sin parsear el resto de la frase."
    }
  },

  ft_strcmp: {
    prototype: 'int ft_strcmp(char *s1, char *s2);',
    signature: 'char *s1, char *s2',
    inputDataTypes: [
      {
        param: 'char *s1, char *s2',
        type: 'Dos punteros a caracteres constantes (char *)',
        explanation: 'Direcciones de memoria de dos strings terminados en byte nulo a comparar lexicográficamente.',
        whyThisType: 'Punteros de lectura.',
        keyConcept: 'Comparación lexicográfica byte a byte y conversión a unsigned char.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (diferencia numérica entera)',
      whatItTransforms: 'No muta memoria. Retorna 0 si ambos strings son exactamente idénticos, un valor positivo si s1 > s2, o negativo si s1 < s2.',
      whyReturn: 'El llamador usa el signo del retorno para ordenar o validar igualdad.'
    },
    goldenRule: "Castear SIEMPRE a `unsigned char` al retornar: `return ((unsigned char)s1[i] - (unsigned char)s2[i]);`. Si haces `return (s1[i] - s2[i])`, caracteres extendidos (como 'é' o valores > 127) se interpretarán como negativos en sistemas con char con signo, dando resultados erróneos.",
    mentalSteps: [
      {
        num: 1,
        title: 'Inicializar Índice Comparador',
        desc: 'Declarar `int i = 0;`.',
        cCode: 'int i = 0;'
      },
      {
        num: 2,
        title: 'Avanzar mientras los Bytes Coincidan y no sea Fin de Cadena',
        desc: 'Continuar mientras `s1[i] == s2[i]` y `s1[i] != \'\\0\'`.',
        cCode: 'while (s1[i] && s2[i] && s1[i] == s2[i])\n    i++;'
      },
      {
        num: 3,
        title: 'Retornar la Diferencia de Códigos ASCII sin Signo',
        desc: 'Restar el byte de s2 al de s1 casteando a unsigned char.',
        cCode: 'return ((unsigned char)s1[i] - (unsigned char)s2[i]);'
      }
    ],
    dictionary: [
      { human: 'Diferencia ASCII sin signo', c: '(unsigned char)s1[i] - (unsigned char)s2[i]', note: 'Garantiza el comportamiento estricto del estándar C' }
    ],
    quiz: {
      question: "¿Qué valor retorna `ft_strcmp(\"abc\", \"abc\")`?",
      options: [
        "0 (ambas cadenas son idénticas)",
        "1",
        "-1"
      ],
      correctIdx: 0,
      explanation: "El bucle avanza hasta que ambos llegan al '\\0'. Al restar `0 - 0`, el resultado es 0."
    }
  },

  ft_strrev: {
    prototype: 'char *ft_strrev(char *str);',
    signature: 'char *str',
    inputDataTypes: [
      {
        param: 'char *str',
        type: 'Puntero a búfer mutable en memoria (char *)',
        explanation: 'Apunta a una cadena en memoria modificable (Stack o Heap). ¡No puede ser un string literal constante de solo lectura!',
        whyThisType: 'Transformación in-place.',
        keyConcept: 'Algoritmo de dos punteros (inicio y fin) y mutación simétrica de memoria.'
      }
    ],
    outputDataTypes: {
      returnType: 'char * (puntero al mismo str)',
      whatItTransforms: 'Muta directamente los bytes dentro del búfer de `str`, invirtiendo el orden de los caracteres. Retorna el mismo puntero `str`.',
      whyReturn: 'Permite encadenar llamadas.'
    },
    goldenRule: "El puntero `end` empieza en `len - 1` (no en `len`), y el bucle corre mientras `start < end`. Si el bucle corre hasta `start <= len`, invertirás dos veces y dejarás el string igual o moverás el '\\0' al principio destruyendo la cadena.",
    mentalSteps: [
      {
        num: 1,
        title: 'Calcular Longitud Total',
        desc: 'Avanzar hasta encontrar el byte nulo.',
        cCode: 'int len = 0;\nwhile (str[len])\n    len++;'
      },
      {
        num: 2,
        title: 'Inicializar Punteros de Extremos',
        desc: '`start = 0` y `end = len - 1`.',
        cCode: 'int start = 0;\nint end = len - 1;'
      },
      {
        num: 3,
        title: 'Intercambio Simétrico con Variable Temporal',
        desc: 'Intercambiar los caracteres de los dos extremos y converger hacia el centro.',
        cCode: 'while (start < end) {\n    char tmp = str[start];\n    str[start] = str[end];\n    str[end] = tmp;\n    start++;\n    end--;\n}'
      },
      {
        num: 4,
        title: 'Retornar el Búfer Mutado',
        desc: 'Retornar `str`.',
        cCode: 'return (str);'
      }
    ],
    dictionary: [
      { human: 'Convergencia de punteros', c: 'while (start < end)', note: 'Se detiene en el centro exacto de la cadena' }
    ],
    quiz: {
      question: "¿Cuántos intercambios se realizan para una cadena de longitud 5 (\"hello\")?",
      options: [
        "2 intercambios: 'h'<->'o' y 'e'<->'l'. La 'l' central no necesita moverse",
        "5 intercambios",
        "1 intercambio"
      ],
      correctIdx: 0,
      explanation: "El número de swaps es `longitud / 2`. Para 5 caracteres, se realizan 5 / 2 = 2 intercambios."
    }
  },

  ft_atoi: {
    prototype: 'int ft_atoi(const char *str);',
    signature: 'const char *str',
    inputDataTypes: [
      {
        param: 'const char *str',
        type: 'Puntero a cadena inmutable (const char *)',
        explanation: 'Cadena con espacios en blanco iniciales, un signo opcional (+ o -) y una secuencia de dígitos decimales.',
        whyThisType: 'Puntero de lectura.',
        keyConcept: 'Conversión de representación ASCII de base 10 a valor numérico entero en registro de CPU.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (entero de 4 bytes con signo)',
      whatItTransforms: 'Calcula el valor numérico decimal de los dígitos acumulados y lo retorna multiplicado por el signo (+1 o -1).',
      whyReturn: 'Devuelve el número entero utilizable en operaciones aritméticas.'
    },
    goldenRule: "Aceptar espacios con la condición completa: `str[i] == ' ' || (str[i] >= 9 && str[i] <= 13)`. Además, SOLO SE PERMITE UN ÚNICO SIGNO (+ o -). Si hay múltiples signos como \"--42\", atoi para y retorna 0 (a diferencia de ft_atoi de la Piscine que acumulaba signos).",
    mentalSteps: [
      {
        num: 1,
        title: 'Saltar Caracteres de Espacio Blanco (Whitespace)',
        desc: 'Saltar espacios (\' \') y caracteres de control ASCII 9 al 13 (\\t, \\n, \\v, \\f, \\r).',
        cCode: 'int i = 0;\nwhile (str[i] == \' \' || (str[i] >= 9 && str[i] <= 13))\n    i++;'
      },
      {
        num: 2,
        title: 'Capturar Signo Único Opcional',
        desc: 'Comprobar si hay un único \'-\' o \'+\'. Si es \'-\', marcar `sign = -1`. Avanzar el índice solo 1 vez.',
        cCode: 'int sign = 1;\nif (str[i] == \'-\' || str[i] == \'+\') {\n    if (str[i] == \'-\')\n        sign = -1;\n    i++;\n}'
      },
      {
        num: 3,
        title: 'Acumular Dígitos Decimales en Base 10',
        desc: 'Multiplicar el acumulador previo por 10 y sumar el valor del dígito actual (`str[i] - \'0\'`).',
        cCode: 'int res = 0;\nwhile (str[i] >= \'0\' && str[i] <= \'9\') {\n    res = res * 10 + (str[i] - \'0\');\n    i++;\n}'
      },
      {
        num: 4,
        title: 'Retornar el Resultado con su Signo',
        desc: 'Retornar `res * sign`.',
        cCode: 'return (res * sign);'
      }
    ],
    dictionary: [
      { human: 'Acumulación en base 10', c: "res = res * 10 + (c - '0');", note: 'Desplaza los dígitos hacia la izquierda sumando el nuevo valor' },
      { human: 'Whitespace estándar', c: "(c >= 9 && c <= 13) || c == ' '", note: 'Definición POSIX de caracteres blancos' }
    ],
    quiz: {
      question: "¿Qué debe retornar `ft_atoi(\"  --42\")` según la especificación del examen?",
      options: [
        "0, porque solo se permite un único signo antes de los dígitos",
        "42",
        "-42"
      ],
      correctIdx: 0,
      explanation: "En la biblioteca estándar y en el examen 42 (Rank 02), atoi solo acepta un único signo. El segundo '-' se interpreta como carácter no numérico y el bucle de dígitos no entra, retornando 0."
    }
  },

  swap_bits: {
    prototype: 'unsigned char swap_bits(unsigned char octet);',
    signature: 'unsigned char octet',
    inputDataTypes: [
      {
        param: 'unsigned char octet',
        type: 'Byte sin signo (unsigned char — 8 bits)',
        explanation: 'Valor binario de 8 bits compuesto por dos semioctetos (nibbles) de 4 bits cada uno.',
        whyThisType: 'Operaciones binarias puras.',
        keyConcept: 'Desplazamiento de nibbles a nivel de hardware.'
      }
    ],
    outputDataTypes: {
      returnType: 'unsigned char (1 byte con los nibbles intercambiados)',
      whatItTransforms: 'Intercambia los 4 bits más significativos con los 4 bits menos significativos. Por ejemplo, 0100 0001 se convierte en 0001 0100.',
      whyReturn: 'Retorna el byte reorganizado.'
    },
    goldenRule: "La fórmula mágica de 1 línea: `return ((octet >> 4) | (octet << 4));`. En un unsigned char de 8 bits, desplazar 4 bits a la derecha vacía los primeros 4 y desplazar a la izquierda vacía los últimos 4. La operación OR (|) los combina limpiamente.",
    mentalSteps: [
      {
        num: 1,
        title: 'Desplazar el Nibble Alto a la Posición Baja',
        desc: '`octet >> 4` mueve los 4 bits de la izquierda hacia la derecha.',
        cCode: '(octet >> 4)'
      },
      {
        num: 2,
        title: 'Desplazar el Nibble Bajo a la Posición Alta',
        desc: '`octet << 4` mueve los 4 bits de la derecha hacia la izquierda.',
        cCode: '(octet << 4)'
      },
      {
        num: 3,
        title: 'Combinar con Operador OR Bitwise (|)',
        desc: 'Unir ambos fragmentos en una sola operación de 1 ciclo de reloj.',
        cCode: 'return ((octet >> 4) | (octet << 4));'
      }
    ],
    dictionary: [
      { human: 'Intercambio de nibbles en 1 línea', c: '(octet >> 4) | (octet << 4)', note: 'Sin necesidad de variables auxiliares' }
    ],
    quiz: {
      question: "Si el octeto es 0x41 (0100 0001 en binario), ¿cuál es el resultado de swap_bits?",
      options: [
        "0x14 (0001 0100 en binario)",
        "0x41",
        "0x82"
      ],
      correctIdx: 0,
      explanation: "El nibble alto 4 pasa a la posición baja, y el nibble bajo 1 pasa a la alta: 0x14."
    }
  },

  reverse_bits: {
    prototype: 'unsigned char reverse_bits(unsigned char octet);',
    signature: 'unsigned char octet',
    inputDataTypes: [
      {
        param: 'unsigned char octet',
        type: 'Byte sin signo (unsigned char — 8 bits)',
        explanation: 'Byte cuyos 8 bits se deben espejar en orden inverso (el bit 0 pasa a la posición 7, el bit 1 a la 6, etc.).',
        whyThisType: 'Manipulación de bits.',
        keyConcept: 'Inversión de bits con registros de desplazamiento.'
      }
    ],
    outputDataTypes: {
      returnType: 'unsigned char (byte con bits invertidos)',
      whatItTransforms: 'Calcula y retorna el byte espejado simétricamente.',
      whyReturn: 'Valor numérico resultante.'
    },
    goldenRule: "Iterar exactamente 8 veces: `res = (res << 1) | (octet & 1); octet >>= 1;`. En cada paso, extraemos el bit menos significativo de `octet` y lo empujamos hacia la izquierda de `res`.",
    mentalSteps: [
      {
        num: 1,
        title: 'Inicializar Acumulador de Bits en Cero',
        desc: 'Declarar `unsigned char res = 0;` y contador `int i = 8;`.',
        cCode: 'unsigned char res = 0;\nint i = 8;'
      },
      {
        num: 2,
        title: 'Bucle de Extracción y Desplazamiento',
        desc: 'Empujar el acumulador a la izquierda e insertar el último bit de octet.',
        cCode: 'while (i > 0) {\n    res = (res << 1) | (octet & 1);\n    octet >>= 1;\n    i--;\n}\nreturn (res);'
      }
    ],
    dictionary: [
      { human: 'Extraer último bit', c: 'octet & 1', note: 'Aísla el bit en la posición 0' },
      { human: 'Empujar acumulador a la izquierda', c: 'res << 1', note: 'Abre espacio para el siguiente bit' }
    ],
    quiz: {
      question: "Si octet es 1 (00000001 en binario), ¿qué retorna reverse_bits?",
      options: [
        "128 (10000000 en binario)",
        "1",
        "255"
      ],
      correctIdx: 0,
      explanation: "El bit 1 situado en la posición 0 se desplaza 7 posiciones hasta convertirse en el bit 7 (2^7 = 128)."
    }
  },

  is_power_of_2: {
    prototype: 'int is_power_of_2(unsigned int n);',
    signature: 'unsigned int n',
    inputDataTypes: [
      {
        param: 'unsigned int n',
        type: 'Entero de 32 bits sin signo (unsigned int)',
        explanation: 'Número a verificar si es una potencia exacta de 2 (ej: 1, 2, 4, 8, 16, 1024...).',
        whyThisType: 'Valores enteros no negativos.',
        keyConcept: 'Propiedad binaria de las potencias de 2 (tienen exactamente un único bit encendido).'
      }
    ],
    outputDataTypes: {
      returnType: 'int (1 si es potencia de 2, 0 en caso contrario)',
      whatItTransforms: 'Evalúa la condición booleana y la devuelve.',
      whyReturn: 'Predicado booleano estándar en C.'
    },
    goldenRule: "Fórmula O(1) a nivel de bit: `return ((n > 0) && ((n & (n - 1)) == 0));`. Si `n` es potencia de 2, tiene un solo bit en 1 (ej: 8 = 1000b). Restar 1 invierte todos los bits inferiores (7 = 0111b). Su operación AND (&) es estrictamente 0. ¡Cuidado con el 0! El 0 no es potencia de 2, de ahí la comprobación `n > 0`.",
    mentalSteps: [
      {
        num: 1,
        title: 'Verificar que n sea Mayor que Cero',
        desc: 'El número 0 no es potencia de 2 (2^k siempre es > 0).',
        cCode: 'if (n == 0)\n    return (0);'
      },
      {
        num: 2,
        title: 'Comprobación Bitwise con n & (n - 1)',
        desc: 'Si n tiene un solo bit activo, n & (n - 1) es exactamente 0.',
        cCode: 'return ((n & (n - 1)) == 0);'
      }
    ],
    dictionary: [
      { human: 'Comprobar potencia de 2 en 1 ciclo', c: '(n > 0) && ((n & (n - 1)) == 0)', note: 'Técnica de bit twiddling canónica de Brian Kernighan' }
    ],
    quiz: {
      question: "¿Por qué `8 & 7` es igual a 0?",
      options: [
        "Porque 8 en binario es 1000 y 7 es 0111; no comparten ningún bit en 1",
        "Porque 8 es múltiplo de 7",
        "Porque la operación & suma los números"
      ],
      correctIdx: 0,
      explanation: "Al no haber ningún bit común encendido, 1000 & 0111 = 0000, demostrando que 8 es una potencia de 2."
    }
  },

  max: {
    prototype: 'int max(int *tab, unsigned int len);',
    signature: 'int *tab, unsigned int len',
    inputDataTypes: [
      {
        param: 'int *tab',
        type: 'Puntero a array de enteros (int *)',
        explanation: 'Dirección del primer elemento de un vector continuo de enteros en memoria.',
        whyThisType: 'Puntero de lectura a vector.',
        keyConcept: 'Punteros de arrays y tamaño explícito sin centinela.'
      },
      {
        param: 'unsigned int len',
        type: 'Entero sin signo de 32 bits (unsigned int)',
        explanation: 'Cantidad de elementos presentes en el array. Puede ser 0.',
        whyThisType: 'Los arrays de enteros no tienen byte nulo de fin, por lo que el tamaño debe recibirse explícitamente.',
        keyConcept: 'Límite explícito de iteración.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (el mayor valor entero encontrado)',
      whatItTransforms: 'Retorna el entero de mayor valor. Si `len == 0`, retorna 0.',
      whyReturn: 'Resultado del cálculo del máximo.'
    },
    goldenRule: "Si `len == 0`, retornar OBLIGATORIAMENTE 0. Si `len > 0`, inicializar `result = tab[0]` y comparar desde el índice 1 hasta `len - 1`. ¡NUNCA inicialices `result = 0`! Si todos los números del array son negativos (ej: [-10, -5, -20]), inicializar en 0 daría 0 como máximo erróneamente.",
    mentalSteps: [
      {
        num: 1,
        title: 'Verificar Caso Especial len == 0',
        desc: 'Si la longitud es 0, retornar inmediatamente 0.',
        cCode: 'if (len == 0)\n    return (0);'
      },
      {
        num: 2,
        title: 'Inicializar el Máximo con el Primer Elemento Real',
        desc: 'Asignar `int result = tab[0];` para manejar arrays con números negativos.',
        cCode: 'int result = tab[0];\nunsigned int i = 1;'
      },
      {
        num: 3,
        title: 'Recorrer el Vector Actualizando el Máximo',
        desc: 'Si `tab[i] > result`, actualizar `result = tab[i]`.',
        cCode: 'while (i < len) {\n    if (tab[i] > result)\n        result = tab[i];\n    i++;\n}\nreturn (result);'
      }
    ],
    dictionary: [
      { human: 'Comprobación de array vacío', c: 'if (len == 0) return (0);', note: 'Guarda obligatoria del subject' },
      { human: 'Inicialización segura', c: 'int result = tab[0];', note: 'Previene errores con números negativos' }
    ],
    quiz: {
      question: "¿Qué ocurriría con el array `[-15, -3, -8]` si inicializas `result = 0`?",
      options: [
        "Retornaría 0, lo cual es incorrecto porque 0 no está en el array y es mayor que todos ellos (-3 es el máximo real)",
        "El programa fallaría con Segfault",
        "Retornaría -3 correctamente"
      ],
      correctIdx: 0,
      explanation: "Por eso es una regla de oro inicializar `result = tab[0]`: el máximo siempre debe ser uno de los elementos presentes en el conjunto."
    }
  },

  do_op: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar CLI (int y char **)',
        explanation: 'argc == 4: argv[1] es el primer operando, argv[2] es el operador (+, -, *, /, %), argv[3] es el segundo operando.',
        whyThisType: 'Calculadora de línea de comandos.',
        keyConcept: 'Análisis de argumentos, conversión con atoi e invocación a la ALU de la CPU.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Calcula la operación matemática e imprime el resultado formateado con `printf("%d\\n", res)`. Si argc != 4, emite solo \'\\n\'.',
      whyReturn: 'Salida exitosa.'
    },
    goldenRule: "Inspeccionar el operador mirando `argv[2][0]`. Se puede usar printf para este ejercicio ya que está explícitamente autorizada en el subject. Comprobar que argc sea exactamente 4.",
    mentalSteps: [
      {
        num: 1,
        title: 'Verificar argc == 4',
        desc: 'Si no hay exactamente 3 argumentos del usuario, emitir salto de línea y salir.',
        cCode: 'if (argc != 4) {\n    printf("\\n");\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Convertir Operandos y Evaluar Operador',
        desc: 'Usar atoi para operandos y un switch o if sobre argv[2][0].',
        cCode: 'int a = atoi(argv[1]);\nint b = atoi(argv[3]);\nchar op = argv[2][0];\nint res = 0;\nif (op == \'+\') res = a + b;\nelse if (op == \'-\') res = a - b;\nelse if (op == \'*\') res = a * b;\nelse if (op == \'/\') res = a / b;\nelse if (op == \'%\') res = a % b;'
      },
      {
        num: 3,
        title: 'Imprimir Resultado con Salto de Línea',
        desc: 'Emitir con printf("%d\\n", res).',
        cCode: 'printf("%d\\n", res);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Operador en argv', c: 'char op = argv[2][0];', note: 'Primer carácter de la cadena del operador' }
    ],
    quiz: {
      question: "¿Qué funciones externas están autorizadas en el subject de `do_op`?",
      options: [
        "atoi, printf, write",
        "Solo write",
        "malloc y free"
      ],
      correctIdx: 0,
      explanation: "El subject de do_op permite `atoi`, `printf` y `write`, lo que facilita enormemente la conversión e impresión del resultado."
    }
  },

  alpha_mirror: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos estándar CLI (int y char **)',
        explanation: 'argv[1] contiene la cadena a espejar contra el alfabeto (\'a\' -> \'z\', \'b\' -> \'y\', etc.).',
        whyThisType: 'Programa CLI.',
        keyConcept: 'Simetría afín en el espacio ASCII.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite cada letra espejada. Los no alfabéticos se emiten intactos.',
      whyReturn: 'Salida exitosa.'
    },
    goldenRule: "Fórmula de espejo: `c = 'z' - (argv[1][i] - 'a');` para minúsculas y `c = 'Z' - (argv[1][i] - 'A');` para mayúsculas. Para 'a', `'z' - ('a' - 'a') = 'z' - 0 = 'z'`. Para 'z', `'z' - ('z' - 'a') = 'z' - 25 = 'a'`. ¡Simetría matemática exacta!",
    mentalSteps: [
      {
        num: 1,
        title: 'Validar argc == 2',
        desc: 'Comprobar argumento único.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Espejar Caracteres con la Fórmula Simétrica',
        desc: 'Aplicar la resta del desplazamiento alfabético desde la última letra.',
        cCode: 'int i = 0;\nwhile (argv[1][i]) {\n    char c = argv[1][i];\n    if (c >= \'a\' && c <= \'z\')\n        c = \'z\' - (c - \'a\');\n    else if (c >= \'A\' && c <= \'Z\')\n        c = \'Z\' - (c - \'A\');\n    write(1, &c, 1);\n    i++;\n}'
      },
      {
        num: 3,
        title: 'Salto de Línea Final',
        desc: 'Salto de línea de cierre.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Fórmula de espejo alfabético', c: "'z' - (c - 'a')", note: "Inversión simétrica exacta en O(1)" }
    ],
    quiz: {
      question: "¿Qué letra es el espejo de 'b' en alpha_mirror?",
      options: [
        "'y' ('z' - ('b' - 'a') = 'z' - 1 = 'y')",
        "'x'",
        "'z'"
      ],
      correctIdx: 0,
      explanation: "'b' es la segunda letra empezando por el principio; su espejo es la segunda letra empezando por el final ('y')."
    }
  },

  print_bits: {
    prototype: 'void print_bits(unsigned char octet);',
    signature: 'unsigned char octet',
    inputDataTypes: [
      {
        param: 'unsigned char octet',
        type: 'Byte sin signo (unsigned char — 1 byte = 8 bits exactos)',
        explanation: 'Un entero de 8 bits sin signo en el rango 0 a 255. No hay bit de signo, por lo que los 8 bits corresponden puramente a datos binarios.',
        whyThisType: 'Garantiza que el desplazamiento de bits hacia la derecha (`>>`) no sufra de extensión de signo aritmética.',
        keyConcept: 'Desplazamiento lógico de bits y máscaras binarias a nivel de hardware.'
      }
    ],
    outputDataTypes: {
      returnType: 'void (sin retorno)',
      whatItTransforms: 'Escribe en STDOUT exactamente 8 caracteres ASCII (\'0\' o \'1\') representando el valor binario del octeto desde el bit más significativo (bit 7) hasta el menos significativo (bit 0). No emite salto de línea a menos que se solicite en el test.',
      whyReturn: 'Función de efecto secundario de impresión.'
    },
    goldenRule: "El bucle debe ir de 7 a 0 (decreciente): `for (int i = 7; i >= 0; i--)`. El bit 7 es el más significativo (a la izquierda). Si haces el bucle de 0 a 7, imprimirás los bits al revés (Little-Endian invertido) y la Moulinette dará KO.",
    mentalSteps: [
      {
        num: 1,
        title: 'Bucle Decreciente de 7 a 0',
        desc: 'Un octeto tiene 8 bits indexados del 7 (más significativo) al 0 (menos significativo).',
        cCode: 'int i = 7;\nwhile (i >= 0) {\n    // inspeccionar bit i\n    i--;\n}'
      },
      {
        num: 2,
        title: 'Extraer el Bit con Desplazamiento y Máscara',
        desc: 'Desplaza el byte `i` posiciones a la derecha y aplica la máscara binaria `& 1` para aislar el bit.',
        cCode: "char bit = ((octet >> i) & 1) + '0';\nwrite(1, &bit, 1);"
      },
      {
        num: 3,
        title: 'Conversión a Carácter ASCII',
        desc: "Sumar el carácter `'0'` (valor ASCII 48) convierte el valor numérico 0 en `'0'` y el 1 en `'1'`.",
        cCode: "write(1, &bit, 1);"
      }
    ],
    dictionary: [
      { human: 'Desplazamiento a la derecha', c: 'octet >> i', note: 'Mueve el bit i a la posición de las unidades' },
      { human: 'Máscara binaria unitaria', c: '... & 1', note: 'Aísla el último bit eliminando todos los demás' },
      { human: 'Convertir 0/1 a carácter', c: "bit + '0'", note: "0 + 48 = '0', 1 + 48 = '1'" }
    ],
    quiz: {
      question: "¿Qué valor binario imprime `print_bits(2)`?",
      options: [
        "00000010",
        "01000000",
        "00000001"
      ],
      correctIdx: 0,
      explanation: "2 en decimal es 2^1, lo que activa el bit en la posición 1: 00000010."
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NIVEL 3
  // ───────────────────────────────────────────────────────────────────────────
  ft_range: {
    prototype: 'int *ft_range(int start, int end);',
    signature: 'int start, int end',
    inputDataTypes: [
      {
        param: 'int start, int end',
        type: 'Dos enteros con signo (int — 4 bytes cada uno)',
        explanation: 'Definen el rango inclusivo de valores [start, end]. Pueden ser positivos, negativos o cero, y start puede ser mayor, menor o igual que end.',
        whyThisType: 'Especificación del rango numérico a generar.',
        keyConcept: 'Asignación dinámica en memoria Heap (malloc) y cálculo de longitud con signo.'
      }
    ],
    outputDataTypes: {
      returnType: 'int * (Puntero a array de enteros en Heap)',
      whatItTransforms: 'Aloca en el Heap un array de `len * sizeof(int)` bytes, lo rellena con la secuencia consecutiva de números desde `start` hasta `end`, y retorna el puntero inicial. Si malloc falla, retorna NULL.',
      whyReturn: 'El llamador recibe la propiedad del array alocado y será responsable de liberarlo con `free()`.'
    },
    goldenRule: "Calcular el tamaño absoluto: `len = (end >= start) ? (end - start + 1) : (start - end + 1);`. Multiplicar siempre por `sizeof(int)` al hacer malloc, ¡NUNCA por `sizeof(char)`! Si olvidas multiplicar por 4, asignarás 1/4 de la memoria requerida, provocando corrupción de Heap.",
    mentalSteps: [
      {
        num: 1,
        title: 'Calcular la Longitud Inclusiva del Rango',
        desc: 'Calcula la distancia absoluta entre start y end sumando 1 para que ambos extremos estén incluidos.',
        cCode: 'int len = (end >= start) ? (end - start + 1) : (start - end + 1);'
      },
      {
        num: 2,
        title: 'Alocar Memoria en Heap con Verificación NULL',
        desc: 'Reserva `len * sizeof(int)` bytes. Si el sistema no tiene memoria, malloc devuelve NULL y debemos retornar NULL de inmediato.',
        cCode: 'int *tab = (int *)malloc(sizeof(int) * len);\nif (!tab)\n    return (NULL);'
      },
      {
        num: 3,
        title: 'Rellenar el Array en Dirección Creciente o Decreciente',
        desc: 'Usa una variable de paso `step = (end >= start) ? 1 : -1` para avanzar o retroceder.',
        cCode: 'int i = 0;\nint step = (end >= start) ? 1 : -1;\nwhile (i < len) {\n    tab[i] = start;\n    start += step;\n    i++;\n}\nreturn (tab);'
      }
    ],
    dictionary: [
      { human: 'Alocación en Heap de enteros', c: 'malloc(sizeof(int) * len)', note: 'Reserva 4 bytes por cada elemento' },
      { human: 'Verificación de malloc', c: 'if (!tab) return (NULL);', note: 'Protección obligatoria contra fallos de memoria' },
      { human: 'Paso condicional', c: 'step = (end >= start) ? 1 : -1;', note: 'Permite avanzar hacia arriba o hacia abajo' }
    ],
    quiz: {
      question: "¿Cuántos enteros contiene el rango de 1 a 3 inclusivo?",
      options: [
        "3 enteros: [1, 2, 3]",
        "2 enteros: [1, 2]",
        "4 enteros: [0, 1, 2, 3]"
      ],
      correctIdx: 0,
      explanation: "El cálculo inclusivo es 3 - 1 + 1 = 3 elementos: 1, 2 y 3."
    }
  },

  ft_list_size: {
    prototype: 'int ft_list_size(t_list *begin_list);',
    signature: 't_list *begin_list',
    inputDataTypes: [
      {
        param: 't_list *begin_list',
        type: 'Puntero simple a la estructura t_list (t_list * — 8 bytes)',
        explanation: 'Apunta a la cabeza de una lista enlazada simple. La estructura t_list contiene dos campos: `void *data` (puntero genérico a los datos) y `struct s_list *next` (dirección del siguiente nodo o NULL si es el último).',
        whyThisType: 'Estructura de datos enlazada donde los nodos están dispersos en el Heap y solo se conectan por punteros.',
        keyConcept: 'Navegación por listas enlazadas y centinela NULL.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (entero con la cantidad total de nodos)',
      whatItTransforms: 'No muta la lista ni modifica ningún nodo. Recorre la cadena de punteros `->next` y retorna cuántos nodos existen.',
      whyReturn: 'Informa al llamador del tamaño de la estructura dinámica.'
    },
    goldenRule: "Usa un puntero temporal de travesía: `t_list *curr = begin_list; while (curr) { count++; curr = curr->next; }`. Si la lista viene vacía (`begin_list == NULL`), el bucle no debe entrar y debe retornar 0 sin causar Segfault.",
    mentalSteps: [
      {
        num: 1,
        title: 'Inicializar el Contador y Puntero de Recorrido',
        desc: 'Declara `int count = 0;` y `t_list *curr = begin_list;`.',
        cCode: 'int count = 0;\nt_list *curr = begin_list;'
      },
      {
        num: 2,
        title: 'Iterar mientras el Nodo Actual no sea NULL',
        desc: 'Avanza nodo a nodo. El centinela NULL marca el final de la lista enlazada.',
        cCode: 'while (curr != NULL) {\n    count++;\n    curr = curr->next;\n}'
      },
      {
        num: 3,
        title: 'Retornar el Conteo',
        desc: 'Retorna el total de nodos contados.',
        cCode: 'return (count);'
      }
    ],
    dictionary: [
      { human: 'Avanzar al siguiente nodo', c: 'curr = curr->next;', note: 'Actualiza la dirección apuntada al siguiente bloque en Heap' },
      { human: 'Fin de la lista enlazada', c: 'curr == NULL', note: 'El último nodo apunta a la dirección 0x0' }
    ],
    quiz: {
      question: "¿Qué ocurre si se llama a `ft_list_size(NULL)` con una lista vacía?",
      options: [
        "El bucle `while (curr)` no se ejecuta y retorna inmediatamente 0 de forma segura",
        "Causa un Segmentation Fault por desreferenciar NULL",
        "Retorna -1 para indicar error"
      ],
      correctIdx: 0,
      explanation: "Como `curr` se inicializa con `NULL`, la condición del while es falsa desde el inicio y retorna 0 sin intentar acceder a `curr->next`."
    }
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NIVEL 4
  // ───────────────────────────────────────────────────────────────────────────
  flood_fill: {
    prototype: 'void flood_fill(char **tab, t_point size, t_point begin);',
    signature: 'char **tab, t_point size, t_point begin',
    inputDataTypes: [
      {
        param: 'char **tab',
        type: 'Matriz bidimensional de caracteres (char ** — array de punteros)',
        explanation: 'Puntero a un array de punteros a filas en memoria. Cada `tab[y][x]` almacena el carácter de una celda de la cuadrícula.',
        whyThisType: 'Representa un mapa o cuadrícula 2D en memoria.',
        keyConcept: 'Indexación bidimensional `tab[y][x]` y mutación recursiva en matriz.'
      },
      {
        param: 't_point size',
        type: 'Estructura por valor con dimensiones de la matriz (int x, int y)',
        explanation: 'Indica el ancho (`size.x`) y el alto (`size.y`) de la matriz para evitar salir de los límites de memoria.',
        whyThisType: 'Límites fijos para prevenir Segmentation Faults por desbordamiento de búfer.',
        keyConcept: 'Límites de coordenadas espaciales (0 <= x < size.x, 0 <= y < size.y).'
      },
      {
        param: 't_point begin',
        type: 'Estructura por valor con la coordenada inicial (int x, int y)',
        explanation: 'Punto de partida de la inundación. Contiene el color original que debe sustituirse por \'F\'.',
        whyThisType: 'Semilla inicial del algoritmo recursivo.',
        keyConcept: 'Punto de partida de Búsqueda en Profundidad (DFS).'
      }
    ],
    outputDataTypes: {
      returnType: 'void (sin retorno)',
      whatItTransforms: 'Muta la matriz `tab` directamente in-place, sustituyendo el carácter original de todas las casillas conectadas ortogonalmente (arriba, abajo, izquierda, derecha) por el carácter \'F\'.',
      whyReturn: 'Efecto secundario directo sobre la matriz recibida.'
    },
    goldenRule: "Comprobar rigurosamente los 4 límites de coordenadas antes de acceder a la matriz: `if (cur.x < 0 || cur.x >= size.x || cur.y < 0 || cur.y >= size.y) return;`. Además, si la celda no tiene el carácter objetivo `target` o ya tiene 'F', retornar inmediatamente para evitar llamadas infinitas a la pila de llamadas (Stack Overflow).",
    mentalSteps: [
      {
        num: 1,
        title: 'Capturar el Carácter Objetivo a Inundar',
        desc: "Lee el carácter en `tab[begin.y][begin.x]`. Este es el color que debemos reemplazar por 'F'.",
        cCode: 'char target = tab[begin.y][begin.x];\nfill(tab, size, target, begin);'
      },
      {
        num: 2,
        title: 'Función Auxiliar Recursiva: Caso Base y Cláusula de Guarda',
        desc: 'Verifica límites espaciales y si el carácter de la celda actual coincide con el objetivo.',
        cCode: 'if (cur.x < 0 || cur.x >= size.x || cur.y < 0 || cur.y >= size.y)\n    return;\nif (tab[cur.y][cur.x] != target || tab[cur.y][cur.x] == \'F\')\n    return;'
      },
      {
        num: 3,
        title: "Pintar la Celda Actual con 'F'",
        desc: "Sustituye el carácter de la casilla actual por 'F' antes de ramificarse a los 4 vecinos.",
        cCode: "tab[cur.y][cur.x] = 'F';"
      },
      {
        num: 4,
        title: 'Ramificación Recursiva a los 4 Vecinos Ortogonales',
        desc: 'Llama recursivamente a fill para la celda superior, inferior, izquierda y derecha.',
        cCode: 't_point p;\np = (t_point){cur.x + 1, cur.y}; fill(tab, size, target, p);\np = (t_point){cur.x - 1, cur.y}; fill(tab, size, target, p);\np = (t_point){cur.x, cur.y + 1}; fill(tab, size, target, p);\np = (t_point){cur.x, cur.y - 1}; fill(tab, size, target, p);'
      }
    ],
    dictionary: [
      { human: 'Indexación bidimensional en C', c: 'tab[y][x]', note: 'Primero la fila (y), luego la columna (x)' },
      { human: 'Verificación de límites', c: 'cur.x >= 0 && cur.x < size.x && cur.y >= 0 && cur.y < size.y', note: 'Previene Segfault al salir de la matriz' }
    ],
    quiz: {
      question: "¿Por qué en C se escribe `tab[cur.y][cur.x]` y no `tab[cur.x][cur.y]`?",
      options: [
        "Porque `tab` es un array de punteros a filas: el primer corchete selecciona la fila (eje Y) y el segundo el carácter en esa fila (eje X)",
        "Porque la escuela 42 invierte los ejes de coordenadas intencionadamente",
        "Porque x e y son equivalentes en memoria continua"
      ],
      correctIdx: 0,
      explanation: "En C, una matriz 2D representada como `char **` o `char tab[H][W]` organiza las filas primero. `tab[y]` es el puntero a la fila `y`, y `tab[y][x]` es la celda horizontal `x`."
    }
  },

  fprime: {
    prototype: 'int main(int argc, char **argv);',
    signature: 'int argc, char **argv',
    inputDataTypes: [
      {
        param: 'int argc, char **argv',
        type: 'Argumentos de CLI (int y char **)',
        explanation: 'argv[1] es una cadena con un número entero estrictamente positivo que debe descomponerse en sus factores primos.',
        whyThisType: 'Programa CLI que recibe un parámetro por terminal.',
        keyConcept: 'Conversión de string a entero (atoi) y descomposición en factores primos.'
      }
    ],
    outputDataTypes: {
      returnType: 'int (0)',
      whatItTransforms: 'Emite por STDOUT los factores primos en orden ascendente separados por un asterisco `*`. Por ejemplo, para 42 emite `2*3*7\\n`. Para 1 emite nada más que `\\n`. Si argc != 2, emite solo `\\n`.',
      whyReturn: 'Salida de proceso exitoso.'
    },
    goldenRule: "Iniciar el divisor en `div = 2`. Mientras `num % div == 0`, imprimir `div`, actualizar `num /= div` y si `num > 1`, imprimir `*`. Solo cuando `num % div != 0`, incrementar `div++`. Tratar el caso especial de `num == 1` imprimiendo solo salto de línea.",
    mentalSteps: [
      {
        num: 1,
        title: 'Validación de Argumentos y Conversión Numérica',
        desc: 'Comprobar argc == 2. Si no, emitir salto de línea y salir. Si es válido, convertir con atoi.',
        cCode: 'if (argc != 2) {\n    printf("\\n");\n    return (0);\n}\nint n = atoi(argv[1]);\nif (n <= 1) {\n    printf("\\n");\n    return (0);\n}'
      },
      {
        num: 2,
        title: 'Bucle de Reducción con Divisor Incremental',
        desc: 'Comienza en divisor = 2. Mientras n > 1, comprueba si es divisible.',
        cCode: 'int div = 2;\nwhile (n > 1) {\n    if (n % div == 0) {\n        printf("%d", div);\n        n /= div;\n        if (n > 1)\n            printf("*");\n    } else {\n        div++;\n    }\n}'
      },
      {
        num: 3,
        title: 'Salto de Línea Final',
        desc: 'Emite el salto de línea al concluir la descomposición.',
        cCode: 'printf("\\n");\nreturn (0);'
      }
    ],
    dictionary: [
      { human: 'Comprobar divisibilidad', c: 'n % div == 0', note: 'Operador módulo: resto 0 significa que div es factor primo' },
      { human: 'Reducir el dividendo', c: 'n /= div;', note: 'Divide n por su factor primo confirmado' },
      { human: 'Separador asterisco', c: 'if (n > 1) printf("*");', note: 'Solo pone asterisco si aún quedan más factores' }
    ],
    quiz: {
      question: "¿Por qué no es necesario comprobar previamente si `div` es un número primo?",
      options: [
        "Porque al dividir sucesivamente desde el 2 hacia arriba, todos los múltiplos compuestos (como 4, 6, 8) ya habrán sido eliminados por sus factores primos menores",
        "Porque el compilador de C solo permite divisores primos",
        "Porque atoi filtra los números compuestos"
      ],
      correctIdx: 0,
      explanation: "Es una propiedad fundamental de la aritmética: si un número no es divisible por 2, jamás será divisible por 4 ni por 6. Por tanto, el primer número que divida a `n` siempre será obligatoriamente primo."
    }
  },

  ft_split: {
    prototype: 'char **ft_split(char *str);',
    signature: 'char *str',
    inputDataTypes: [
      {
        param: 'char *str',
        type: 'Puntero simple a cadena (char *)',
        explanation: 'Cadena de caracteres con palabras delimitadas por espacios, tabulaciones (\'\\t\') o saltos de línea (\'\\n\').',
        whyThisType: 'String de entrada a tokenizar.',
        keyConcept: 'Alocación dinámica doble: array principal de punteros `char **` y strings individuales `char *`.'
      }
    ],
    outputDataTypes: {
      returnType: 'char ** (Array de punteros a string terminado en NULL)',
      whatItTransforms: 'Aloca en Heap un vector de punteros `char **` de tamaño `(palabras + 1) * sizeof(char *)`. Para cada palabra aloca `(longitud + 1) * sizeof(char)`, la copia con \'\\0\' final, y coloca un puntero NULL obligatorio al final del array principal.',
      whyReturn: 'El llamador recibe la estructura de palabras divididas para iterar libremente.'
    },
    goldenRule: "Poner OBLIGATORIAMENTE `tab[k] = NULL;` al final del array de punteros. En C, las funciones que reciben un `char **` (como para imprimir o liberar memoria) no conocen cuántas palabras hay y confían ciegamente en el centinela NULL final. Sin él, leerán memoria basura y causarán Segfault.",
    mentalSteps: [
      {
        num: 1,
        title: 'Función Auxiliar: Contar Número de Palabras',
        desc: 'Recorre la cadena identificando transiciones de delimitadores a caracteres alfabéticos.',
        cCode: 'int count_words(char *s) {\n    int count = 0, in_word = 0;\n    while (*s) {\n        if (*s != \' \' && *s != \'\\t\' && *s != \'\\n\' && !in_word) {\n            in_word = 1;\n            count++;\n        } else if (*s == \' \' || *s == \'\\t\' || *s == \'\\n\')\n            in_word = 0;\n        s++;\n    }\n    return (count);\n}'
      },
      {
        num: 2,
        title: 'Alocar el Array Principal de Punteros en Heap',
        desc: 'Reserva `sizeof(char *) * (words + 1)`. Si malloc falla, retorna NULL.',
        cCode: 'char **tab = (char **)malloc(sizeof(char *) * (count_words(str) + 1));\nif (!tab) return (NULL);'
      },
      {
        num: 3,
        title: 'Extraer y Alocar Cada Palabra Individualmente',
        desc: 'Para cada palabra, calcula su longitud `len`, reserva `len + 1` bytes, cópiala y añade \'\\0\'.',
        cCode: 'int k = 0;\nwhile (*str) {\n    while (*str && (*str == \' \' || *str == \'\\t\' || *str == \'\\n\')) str++;\n    if (*str) {\n        int len = 0;\n        while (str[len] && str[len] != \' \' && str[len] != \'\\t\' && str[len] != \'\\n\') len++;\n        tab[k] = (char *)malloc(len + 1);\n        // copiar caracteres y poner \\0 al final\n        k++;\n        str += len;\n    }\n}'
      },
      {
        num: 4,
        title: 'Centinela Final NULL Obligatorio',
        desc: 'Establece el último puntero a NULL y retorna el array.',
        cCode: 'tab[k] = NULL;\nreturn (tab);'
      }
    ],
    dictionary: [
      { human: 'Alocar array de punteros', c: 'malloc(sizeof(char *) * (count + 1))', note: '8 bytes por cada puntero' },
      { human: 'Centinela de fin de array', c: 'tab[k] = NULL;', note: 'Evita leer punteros basura' }
    ],
    quiz: {
      question: "¿Por qué se reserva `sizeof(char *) * (words + 1)` en vez de `sizeof(char *) * words`?",
      options: [
        "Porque se necesita un espacio adicional al final para colocar el puntero centinela NULL",
        "Porque malloc requiere siempre números pares",
        "Porque el primer elemento debe ser el nombre del programa"
      ],
      correctIdx: 0,
      explanation: "El puntero centinela NULL al final del array permite a cualquier función iterar sobre `tab[i]` hasta encontrar NULL sin necesidad de pasar un argumento separado de longitud."
    }
  }
}

/**
 * Función sintética que genera un contrato completo, no genérico y adaptado
 * para cualquier ejercicio que no tenga una entrada fija en EXERCISE_CONTRACTS.
 * 
 * Extrae la información directamente de exercise.subject, exercise.desglose,
 * exercise.campayoMetodo, exercise.trampas y exercise.formulaClave.
 */
export function buildDynamicExerciseContract(exercise) {
  if (!exercise) return null
  const id = exercise.id || ''
  const isProgram = exercise.tipoEntrega === 'programa'
  const name = exercise.nombre || id

  // 1. Extraer prototipo real del subject
  let prototype = isProgram ? `int main(int argc, char **argv);` : `void ${name}(...);`
  if (exercise.subject) {
    const lines = exercise.subject.split('\n')
    const protoLine = lines.find(l => 
      !isProgram && (l.includes(`${name}(`) || l.includes(`${name} (`)) && !l.includes('Assignment')
    )
    if (protoLine) {
      prototype = protoLine.trim().replace(/\t+/g, ' ')
    }
  }

  // 2. Extraer parámetros y tipos de datos detallados
  let inputDataTypes = []
  if (isProgram) {
    inputDataTypes = [
      {
        param: 'int argc',
        type: 'Entero de 4 bytes (contador de argumentos en Stack del SO)',
        explanation: `Contador de argumentos pasados en la terminal. El binario ocupa argv[0], por lo que la cantidad requerida para ${name} se evalúa contra argc.`,
        whyThisType: 'Convención estándar UNIX para pasar y verificar parámetros en tiempo de ejecución.',
        keyConcept: 'Control estricto de argumentos y prevención de accesos ilegales a memoria.'
      },
      {
        param: 'char **argv',
        type: 'Array de punteros a cadenas (char ** — 8 bytes por dirección)',
        explanation: `Vector en memoria donde cada elemento apunta a una cadena terminada en '\\0'. argv[1] almacena el primer parámetro de ${name}.`,
        whyThisType: 'Permite leer las cadenas del usuario sin necesidad de duplicarlas en memoria.',
        keyConcept: 'Aritmética de punteros e indexación de strings.'
      }
    ]
  } else {
    // Intentar descomponer los parámetros individuales del prototipo
    const rawParams = prototype.split('(')[1]?.replace(');', '')?.trim() || ''
    const splitParams = rawParams ? rawParams.split(',').map(p => p.trim()) : []
    const datosPuros = exercise.campayoMetodo?.datosPuros || []

    if (splitParams.length > 0) {
      inputDataTypes = splitParams.map((p, idx) => {
        const isPointer = p.includes('*')
        const isConst = p.includes('const')
        const typeDesc = isPointer
          ? `Puntero (${isConst ? 'de solo lectura ' : 'mutable '}hacia memoria en Stack o Heap)`
          : 'Valor por copia (primitivo en registro de CPU)'
        const matchingPuro = datosPuros[idx]

        return {
          param: p,
          type: matchingPuro?.nota || typeDesc,
          explanation: matchingPuro?.elemento
            ? `Parámetro: ${matchingPuro.elemento}. Se procesa en el Stack Frame de la función.`
            : `Parámetro formal número ${idx + 1} de ${name}. Se pasa en registros o pila según la ABI de x86_64.`,
          whyThisType: isPointer
            ? 'Los punteros evitan duplicar búferes en memoria y permiten mutación directa o lectura eficiente.'
            : 'Los valores escalares se copian directamente en registros para máxima velocidad de ejecución.',
          keyConcept: isPointer
            ? 'Acceso a memoria mediante desreferenciación e indexación contigua.'
            : 'Paso por valor (el valor original del llamador no se altera).'
        }
      })
    } else {
      inputDataTypes = [
        {
          param: 'void / sin parámetros',
          type: 'void',
          explanation: `La función opera sin argumentos formales directos.`,
          whyThisType: 'Diseño específico del enunciado.',
          keyConcept: 'Ejecución autónoma sin dependencias externas de entrada.'
        }
      ]
    }
  }

  // 3. Salida y transformación
  const returnType = isProgram 
    ? 'int (código de salida al sistema operativo UNIX)'
    : (prototype.split(' ')[0] || 'void')

  const whatItTransforms = isProgram
    ? `Escribe en STDOUT (descriptor 1) el resultado procesado de ${name} seguido de un salto de línea '\\n'. Si los argumentos son inválidos, emite únicamente '\\n'.`
    : (exercise.descripcion || `Calcula y devuelve el resultado esperado según el prototipo ${prototype}, sin efectos secundarios no autorizados.`)

  // 4. Regla de Oro
  let goldenRule = ''
  if (isProgram) {
    goldenRule = `Si argc no cumple la condición del subject, escribir '\\n' y hacer 'return (0);' INMEDIATAMENTE para no acceder a argv fuera de rango.`
  } else if (exercise.desglose?.decisionesClave?.[0]) {
    goldenRule = `${exercise.desglose.decisionesClave[0].pregunta} → ${exercise.desglose.decisionesClave[0].respuesta}`
  } else {
    goldenRule = `Verificar punteros antes de desreferenciar y garantizar el centinela final correspondiente en ${name}.`
  }

  // 5. Movimientos mentales basados en el desglose real del ejercicio
  let mentalSteps = []
  if (exercise.desglose?.lineas && exercise.desglose.lineas.length >= 2) {
    mentalSteps = exercise.desglose.lineas.map((item, idx) => ({
      num: idx + 1,
      title: item.concepto ? `Paso ${idx + 1}: ${item.concepto.toUpperCase()}` : `Lógica del Paso ${idx + 1}`,
      desc: item.porque || 'Operación lógica en memoria.',
      cCode: item.codigo || '// código de la operación'
    }))
  } else if (exercise.campayoMetodo?.datosPuros && exercise.campayoMetodo.datosPuros.length >= 2) {
    mentalSteps = exercise.campayoMetodo.datosPuros.map((d, idx) => ({
      num: idx + 1,
      title: `Paso ${idx + 1}: ${d.elemento.split('(')[0] || 'Operación'}`,
      desc: d.nota || 'Paso del algoritmo',
      cCode: d.elemento
    }))
  } else {
    mentalSteps = [
      {
        num: 1,
        title: isProgram ? 'Guardián de Argumentos (argc)' : 'Verificación de Entrada y Centinelas',
        desc: isProgram ? 'Valida la cantidad de argumentos recibidos antes de acceder a argv.' : 'Asegura que los datos de entrada sean válidos.',
        cCode: isProgram ? 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}' : 'if (!ptr) return (0);'
      },
      {
        num: 2,
        title: 'Bucle Principal de Transformación',
        desc: 'Recorre el búfer ejecutando la lógica central del algoritmo.',
        cCode: exercise.formulaClave?.formula || 'while (condicion) {\n    // procesar\n}'
      },
      {
        num: 3,
        title: 'Cierre y Emisión',
        desc: isProgram ? 'Emite el salto de línea y concluye con 0.' : 'Retorna el resultado final procesado.',
        cCode: isProgram ? 'write(1, "\\n", 1);\nreturn (0);' : 'return (resultado);'
      }
    ]
  }

  return {
    prototype,
    signature: inputDataTypes.map(d => d.param).join(', '),
    inputDataTypes,
    outputDataTypes: {
      returnType,
      whatItTransforms,
      whyReturn: isProgram ? 'Convención estándar de terminación de procesos en UNIX.' : 'Retorna el resultado tipado a la función llamadora.'
    },
    goldenRule,
    mentalSteps,
    dictionary: (exercise.desglose?.lineas || []).slice(0, 4).map(l => ({
      human: l.porque || l.concepto,
      c: l.codigo,
      note: l.concepto || 'Operación en C'
    })),
    quiz: {
      question: `¿Cuál es el objetivo principal del ejercicio ${name}?`,
      options: [
        exercise.descripcion || `Procesar las entradas de forma correcta según el subject de 42`,
        `Imprimir texto aleatorio en la consola`,
        `Alocar memoria sin liberarla`
      ],
      correctIdx: 0,
      explanation: exercise.palacio?.historia || `El ejercicio ${name} implementa este algoritmo respetando la especificación exacta de Moulinette.`
    }
  }
}
