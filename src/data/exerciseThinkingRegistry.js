/**
 * Registro de Razonamiento Lógico, Enfoque Algorítmico, Patrones y Modelos Mentales
 * Personalizados para cada ejercicio y arquetipo de la escuela 42 (Rank 02).
 */

// Definición de arquetipos algorítmicos
export const PATTERN_ARCHETYPES = {
  TWO_POINTER_TOKENIZER: {
    id: 'TWO_POINTER_TOKENIZER',
    name: 'Analizador de Palabras / Dos Punteros',
    icon: '✂️',
    summary: 'Recorre la cadena saltando delimitadores (espacios y tabulaciones), identifica el inicio de una palabra y avanza hasta su fin.',
    timeComplexity: 'O(N) — 1 solo pase',
    spaceComplexity: 'O(1) — Punteros en Stack',
    keySentinel: "' ' | '\\t' | '\\0'",
    memoryLayout: 'Recorrido lineal sobre memoria contigua en Stack o Segmento de Datos (argv). Sin reservas en Heap.',
  },
  ASCII_HASH_TABLE_O1: {
    id: 'ASCII_HASH_TABLE_O1',
    name: 'Tabla Hash de Frecuencias ASCII O(1)',
    icon: '⚡',
    summary: 'Vector booleano o de enteros de 256 posiciones (unsigned char) para saber en O(1) si un byte ya fue visto o emitido.',
    timeComplexity: 'O(N + M) — Óptimo lineal',
    spaceComplexity: 'O(1) — 256 bytes fijos en Pila (Stack)',
    keySentinel: "seen[(unsigned char)c]",
    memoryLayout: 'El array `int seen[256] = {0}` se aloja en el Stack Frame de la función (256 * 4 = 1024 bytes) y entra en una sola línea de caché L1.',
  },
  BITWISE_HARDWARE: {
    id: 'BITWISE_HARDWARE',
    name: 'Manipulación de Bits a Nivel de Hardware',
    icon: '🔌',
    summary: 'Operaciones bit a bit con máscaras (&, |, ^, ~, <<, >>) ejecutadas en 1 ciclo de reloj en registros de la ALU.',
    timeComplexity: 'O(1) — 8 o 32 ciclos de CPU',
    spaceComplexity: 'O(1) — 1 byte en registro',
    keySentinel: "1 << bit_pos (máscaras)",
    memoryLayout: 'Los valores se manipulan directamente en registros de propósito general de la CPU (ej: %al, %eax) sin acceder a memoria RAM.',
  },
  LINKED_LIST_POINTERS: {
    id: 'LINKED_LIST_POINTERS',
    name: 'Listas Enlazadas y Punteros Simples / Dobles',
    icon: '🔗',
    summary: 'Navegación dinámica por nodos dispersos en Heap enlazados por punteros `current->next` con centinela NULL.',
    timeComplexity: 'O(N) o O(N²) para ordenamiento',
    spaceComplexity: 'O(1) — Punteros de travesía',
    keySentinel: "node == NULL / *begin_list",
    memoryLayout: 'Cada nodo `t_list` está disperso en el Heap. El acceso es secuencial siguiendo la dirección física en memoria que guarda el puntero `next`.',
  },
  RECURSIVE_DFS_FLOODFILL: {
    id: 'RECURSIVE_DFS_FLOODFILL',
    name: 'Recursión y Búsqueda en Profundidad (DFS)',
    icon: '🌊',
    summary: 'Inundación recursiva sobre matriz 2D con verificación estricta de límites (0 <= y < size.y, 0 <= x < size.x) y cambio de color.',
    timeComplexity: 'O(Ancho × Alto)',
    spaceComplexity: 'O(Ancho × Alto) — Pila de llamadas',
    keySentinel: "Límites de matriz + color diferente",
    memoryLayout: 'Cada invocación recursiva añade un Stack Frame a la pila de ejecución con sus coordenadas y variables locales.',
  },
  ARITHMETIC_NUMBER_THEORY: {
    id: 'ARITHMETIC_NUMBER_THEORY',
    name: 'Aritmética y Teoría de Números',
    icon: '🔢',
    summary: 'Factorización prima con divisor incremental, algoritmo de Euclides para MCD/LCM o conversiones de bases numéricas.',
    timeComplexity: 'O(√N) o O(log(min(a,b)))',
    spaceComplexity: 'O(1) — Variables escalares',
    keySentinel: "div * div <= n / b == 0",
    memoryLayout: 'Cálculos directos sobre registros enteros (ALU). Salida formateada con recursión o write directo.',
  },
  DYNAMIC_HEAP_ALLOCATION: {
    id: 'DYNAMIC_HEAP_ALLOCATION',
    name: 'Asignación Dinámica en Heap (malloc / free)',
    icon: '📦',
    summary: 'Cálculo previo del tamaño exacto, reserva con malloc, verificación obligatoria de puntero nulo y terminación con byte nulo.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N) — Espacio en Heap',
    keySentinel: "ptr == NULL / '\\0' final",
    memoryLayout: 'malloc() solicita memoria al Heap del proceso. Es imperativo calcular el tamaño exacto con `+ 1` para el byte nulo `\\0` o `+ 1` para el puntero NULL.',
  },
  INPLACE_POINTER_MUTATION: {
    id: 'INPLACE_POINTER_MUTATION',
    name: 'Transformación In-Place de Punteros',
    icon: '🔄',
    summary: 'Modificación del búfer original usando dos punteros (inicio y fin) intercambiando valores con variable temporal.',
    timeComplexity: 'O(N/2) — Inversión simétrica',
    spaceComplexity: 'O(1) — Sin memoria extra',
    keySentinel: "start >= end",
    memoryLayout: 'Se modifica la memoria del búfer directamente por desreferenciación `*start = *end`. Cero fragmentación.',
  },
  ASCII_TRANSFORMATION: {
    id: 'ASCII_TRANSFORMATION',
    name: 'Mapeo y Transformación de Caracteres ASCII',
    icon: '🔤',
    summary: 'Verificación de rangos alfabéticos (\'a\'-\'z\', \'A\'-\'Z\') y desplazamiento aritmético (+32, -32, +13, rotación en módulo 26).',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    keySentinel: "c >= 'a' && c <= 'z'",
    memoryLayout: 'Lectura byte a byte, cálculo en registros y escritura secuencial.',
  },
  CSTRING_PTR_WALK: {
    id: 'CSTRING_PTR_WALK',
    name: 'Recorrido de Punteros en C-Strings',
    icon: '🚶',
    summary: 'Avance directo de puntero `*str` hasta encontrar el byte nulo `\\0` (0x00) calculando distancias o copiando bytes.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    keySentinel: "*str != '\\0'",
    memoryLayout: 'El puntero contiene una dirección física de 64 bits (8 bytes). Desreferenciar `*s` lee 1 byte en esa dirección.',
  },
  STATE_MACHINE_INTERPRETER: {
    id: 'STATE_MACHINE_INTERPRETER',
    name: 'Máquina de Estados e Intérprete',
    icon: '🤖',
    summary: 'Búfer de cinta de memoria (30.000 bytes en cero) con puntero de datos y puntero de instrucciones, gestionando bucles con contador de balanceo.',
    timeComplexity: 'O(Instrucciones ejecutadas)',
    spaceComplexity: 'O(1) — Búfer fijo de 30KB',
    keySentinel: "instruction_ptr != '\\0'",
    memoryLayout: 'Un array `char tape[30000] = {0}` simula la cinta de Turing y un puntero `ptr` se desplaza libremente por él.',
  },
}

// Catálogo específico de blueprints profundos para los ejercicios clave de 42
const SPECIFIC_BLUEPRINTS = {
  // ─── NIVEL 1 ──────────────────────────────────────────────────────────────
  first_word: {
    archetypeId: 'TWO_POINTER_TOKENIZER',
    nature: 'PROGRAMA_CLI',
    analogy: 'Imagina que vas en un tren y miras por la ventana buscando la primera casa habitada: primero pasas kilómetros de campo vacío (espacios y tabuladores). En cuanto ves la primera casa (carácter), empiezas a tomar fotos (escribir) una tras otra hasta que vuelves a ver campo vacío o se acaba la vía.',
    natureExplanation: 'Es un programa completo con `main`. Requiere recibir exactamente 1 argumento (`argc == 2`). Si no se cumple, imprime un salto de línea y termina con 0.',
    underTheHood: {
      stackVsHeap: 'Toda la memoria se encuentra en la Pila (Stack). `argv` es un vector de punteros en la pila del SO. No se requiere `malloc`.',
      cpuRegisters: 'El índice `i` se almacena preferentemente en un registro de CPU como `%ecx` o `%rsi` para comparaciones instantáneas.',
      pointers: '`argv[1]` es la dirección base del string. `&argv[1][i]` calcula `argv[1] + i` byte a byte para la llamada al sistema `write(1, &argv[1][i], 1)`.',
      sentinel: "El byte nulo `\\0` (0x00) y los caracteres ASCII 32 (' ') y 9 ('\\t') actúan como delimitadores inequívocos.",
    },
    mentalSteps: [
      {
        num: 1,
        title: 'El Guardián de Argumentos (argc == 2)',
        desc: 'Comprueba si el usuario te dio exactamente 1 parámetro (argc == 2 en C). Si no hay argumentos o te dan más de uno, tu programa debe imprimir solo "\\n" y terminar inmediatamente.',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}',
      },
      {
        num: 2,
        title: 'Fase 1: Saltar Espacios y Tabuladores Iniciales',
        desc: 'Avanza el índice "i" mientras el carácter sea espacio (\' \') o tabulador (\'\\t\'). No imprimas nada todavía.',
        cCode: 'int i = 0;\nwhile (argv[1][i] == \' \' || argv[1][i] == \'\\t\')\n    i++;',
      },
      {
        num: 3,
        title: 'Fase 2: Imprimir la Primera Palabra',
        desc: 'Ahora que estás sobre una letra real, imprime carácter a carácter con write() mientras NO sea espacio, NO sea tabulador y NO sea el final (\\0).',
        cCode: 'while (argv[1][i] != \'\\0\' && argv[1][i] != \' \' && argv[1][i] != \'\\t\') {\n    write(1, &argv[1][i], 1);\n    i++;\n}',
      },
      {
        num: 4,
        title: 'Fase 3: Salto de Línea Obligatorio',
        desc: 'Al terminar de imprimir la palabra (o si la cadena solo contenía espacios), imprime el "\\n" final requerido por Moulinette.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);',
      },
    ],
    dictionary: [
      { human: 'Saltar separadores iniciales', c: "while (s[i] == ' ' || s[i] == '\\t') i++;", note: 'Avanza i sin escribir' },
      { human: 'Imprimir carácter actual', c: 'write(1, &s[i], 1);', note: 'write toma la dirección con &' },
      { human: 'Saber si la palabra terminó', c: "s[i] == ' ' || s[i] == '\\t' || s[i] == '\\0'", note: 'Cualquiera marca el fin' },
    ],
    quiz: {
      question: '¿Por qué es un error fatal olvidar comprobar \'\\t\' (tabulador) en first_word?',
      options: [
        'Porque el compilador gcc dará error de sintaxis',
        'Porque si el test contiene tabuladores iniciales, se imprimirán como parte de la palabra y Moulinette dará KO',
        'Porque los tabuladores ocupan 4 bytes en memoria',
      ],
      correctIdx: 1,
      explanation: 'El subject define una palabra delimitada por espacios o tabulaciones. Ignorar \\t hará fallar los tests que empiecen con tab.',
    },
  },

  rot_13: {
    archetypeId: 'ASCII_TRANSFORMATION',
    nature: 'PROGRAMA_CLI',
    analogy: 'Una rueda de cifrado César donde cada letra gira 13 posiciones. Como el abecedario inglés tiene 26 letras, rotar 13 es exactamente la mitad: la "a" se convierte en "n", la "n" en "a", y cualquier carácter que no sea letra (como números o signos) se queda 100% intacto.',
    natureExplanation: 'Programa con `main`. Requiere `argc == 2`. Modifica e imprime en stdout carácter por carácter.',
    underTheHood: {
      stackVsHeap: 'Memoria puramente local en Stack. El buffer del string está en argv.',
      cpuRegisters: 'Las operaciones de suma y resta aritmética sobre caracteres `c += 13` se realizan en registros de 8 bits (ej: `%al`).',
      pointers: '`argv[1][i]` se indexa secuencialmente.',
      sentinel: "Termina cuando `argv[1][i] == '\\0'`.",
    },
    mentalSteps: [
      {
        num: 1,
        title: 'Filtro de Entrada',
        desc: 'Verifica argc == 2. Si no es así, imprime "\\n".',
        cCode: 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}',
      },
      {
        num: 2,
        title: 'Recorrer la Cadena Carácter a Carácter',
        desc: 'Inicia un bucle que examine cada carácter argv[1][i] hasta llegar al byte nulo \'\\0\'.',
        cCode: 'int i = 0;\nwhile (argv[1][i] != \'\\0\') {\n    char c = argv[1][i];\n    // transformar o dejar igual\n    i++;\n}',
      },
      {
        num: 3,
        title: 'Comprobar Rango y Rotar en Módulo 26',
        desc: 'Si la letra está en la primera mitad (\'a\'-\'m\' o \'A\'-\'M\') le sumas 13. Si está en la segunda mitad (\'n\'-\'z\' o \'N\'-\'Z\') le restas 13.',
        cCode: 'if ((c >= \'a\' && c <= \'m\') || (c >= \'A\' && c <= \'M\'))\n    c += 13;\nelse if ((c >= \'n\' && c <= \'z\') || (c >= \'N\' && c <= \'Z\'))\n    c -= 13;\nwrite(1, &c, 1);',
      },
      {
        num: 4,
        title: 'Cierre con Salto de Línea',
        desc: 'Al terminar de imprimir todos los caracteres, escribe el salto de línea.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);',
      },
    ],
    dictionary: [
      { human: 'Rotar hacia adelante (+13)', c: 'c += 13;', note: 'Para letras entre a..m y A..M' },
      { human: 'Rotar hacia atrás (-13)', c: 'c -= 13;', note: 'Para letras entre n..z y N..Z' },
      { human: 'Escribir el carácter rotado', c: 'write(1, &c, 1);', note: 'Mantiene caracteres no alfabéticos inalterados' },
    ],
    quiz: {
      question: '¿Qué ocurre con el carácter especial \'!\' o los dígitos \'9\' al aplicar rot_13?',
      options: [
        'Se les suma 13 a su código ASCII',
        'Se sustituyen por espacios',
        'Se imprimen exactamente igual sin modificarse',
      ],
      correctIdx: 2,
      explanation: 'Rot_13 solo transforma letras del abecedario (a-z, A-Z); el resto de caracteres pasan directos a la salida.',
    },
  },

  // ─── NIVEL 2 ──────────────────────────────────────────────────────────────
  inter: {
    archetypeId: 'ASCII_HASH_TABLE_O1',
    nature: 'PROGRAMA_CLI',
    analogy: 'Imagina que tienes una lista de invitados (cadena 1) y quieres dejar pasar solo a los que también están en la lista VIP (cadena 2), pero sin dejar pasar a la misma persona dos veces. Colocas un sello a cada uno en tu tabla de 256 casillas para no repetir jamás.',
    natureExplanation: 'Programa con `main`. Requiere exactamente 2 parámetros de usuario (`argc == 3`). Si no, escribe `\\n` y retorna 0.',
    underTheHood: {
      stackVsHeap: 'Se declara una tabla de frecuencias `int seen[256] = {0}` en el Stack. Tamaño: 1024 bytes. Cero asignaciones dinámicas.',
      cpuRegisters: 'El acceso por índice `seen[(unsigned char)argv[2][i]]` es una sola instrucción de suma base + desplazamiento con coste temporal O(1).',
      pointers: '`argv[1]` y `argv[2]` son leídos consecutivamente.',
      sentinel: "Ambos strings terminan en `\\0`.",
    },
    mentalSteps: [
      {
        num: 1,
        title: 'Verificación de Argumentos (argc == 3)',
        desc: 'El programa requiere 2 argumentos (nombre del programa + 2 strings = 3 args). Si no se cumple, salto de línea.',
        cCode: 'if (argc != 3) {\n    write(1, "\\n", 1);\n    return (0);\n}',
      },
      {
        num: 2,
        title: 'Fase 1: Mapear Caracteres de la Segunda Cadena en O(1)',
        desc: 'Recorre argv[2] e inserta un 1 en la posición ASCII de cada carácter en la tabla `seen[256]`.',
        cCode: 'int seen[256] = {0};\nint i = 0;\nwhile (argv[2][i]) {\n    seen[(unsigned char)argv[2][i]] = 1;\n    i++;\n}',
      },
      {
        num: 3,
        title: 'Fase 2: Filtrar y Emitir la Primera Cadena Sin Duplicados',
        desc: 'Recorre argv[1]. Si el carácter está en `seen` con valor 1, imprímelo y cambia su valor a 2 para no imprimirlo nunca más.',
        cCode: 'i = 0;\nwhile (argv[1][i]) {\n    unsigned char c = (unsigned char)argv[1][i];\n    if (seen[c] == 1) {\n        write(1, &c, 1);\n        seen[c] = 2; // Marcado como ya impreso\n    }\n    i++;\n}',
      },
      {
        num: 4,
        title: 'Cierre Obligatorio',
        desc: 'Imprime el salto de línea final y termina.',
        cCode: 'write(1, "\\n", 1);\nreturn (0);',
      },
    ],
    dictionary: [
      { human: 'Tabla de presencia ASCII', c: 'int seen[256] = {0};', note: '256 casillas para cada valor byte posible' },
      { human: 'Casteo a unsigned char', c: '(unsigned char)str[i]', note: 'Evita índices negativos con caracteres extendidos' },
      { human: 'Marcar como ya impreso', c: 'seen[c] = 2;', note: 'Garantiza que no se repitan letras en la salida' },
    ],
    quiz: {
      question: '¿Por qué usamos una tabla `seen[256]` en lugar de bucles anidados con dos `while`?',
      options: [
        'Porque en C no se permiten bucles dentro de bucles',
        'Porque la tabla hash reduce la complejidad de O(N²) a O(N+M) lineal y evita código complejo de duplicados',
        'Porque Moulinette prohíbe usar variables de tipo int',
      ],
      correctIdx: 1,
      explanation: 'La tabla hash ASCII O(1) permite verificar en tiempo constante si un carácter existe y si ya fue impreso.',
    },
  },

  union: {
    archetypeId: 'ASCII_HASH_TABLE_O1',
    nature: 'PROGRAMA_CLI',
    analogy: 'Tienes dos listas de nombres y quieres crear una lista unificada en orden de llegada, sin duplicados. Pasas la primera lista completa tachando en tu libreta de 256 casillas cada letra que escribes, y luego haces lo mismo con la segunda lista.',
    natureExplanation: 'Programa CLI con `main`. Requiere exactamente `argc == 3`. Salida con `write(1, &c, 1)` y salto de línea final.',
    underTheHood: {
      stackVsHeap: 'Array `int seen[256] = {0}` en el Stack. Tamaño constante de 1KB.',
      cpuRegisters: 'Indexación directa en O(1) por código ASCII.',
      pointers: '`argv[1]` se recorre primero, seguido de `argv[2]`.',
      sentinel: "Detección de fin por byte nulo `\\0`.",
    },
    mentalSteps: [
      {
        num: 1,
        title: 'Control de Argumentos (argc == 3)',
        desc: 'Verifica argc == 3. Si no, escribe "\\n" y retorna 0.',
        cCode: 'if (argc != 3) {\n    write(1, "\\n", 1);\n    return (0);\n}',
      },
      {
        num: 2,
        title: 'Recorrer la Primera Cadena Marcando en la Tabla',
        desc: 'Recorre argv[1]. Si `seen[c] == 0`, imprímelo y marca `seen[c] = 1`.',
        cCode: 'int seen[256] = {0};\nint i = 0;\nwhile (argv[1][i]) {\n    unsigned char c = (unsigned char)argv[1][i];\n    if (!seen[c]) {\n        write(1, &c, 1);\n        seen[c] = 1;\n    }\n    i++;\n}',
      },
      {
        num: 3,
        title: 'Recorrer la Segunda Cadena con la Misma Tabla',
        desc: 'Sin reiniciar `seen`, recorre argv[2]. Si un carácter no está marcado, imprímelo y márcalo.',
        cCode: 'i = 0;\nwhile (argv[2][i]) {\n    unsigned char c = (unsigned char)argv[2][i];\n    if (!seen[c]) {\n        write(1, &c, 1);\n        seen[c] = 1;\n    }\n    i++;\n}',
      },
      {
        num: 4,
        title: 'Salto de Línea y Cierre',
        desc: 'Finaliza escribiendo "\\n".',
        cCode: 'write(1, "\\n", 1);\nreturn (0);',
      },
    ],
    dictionary: [
      { human: 'Si no fue visto aún', c: 'if (!seen[c])', note: 'Verifica si la casilla está en 0' },
      { human: 'Marcar como visto', c: 'seen[c] = 1;', note: 'Impide futuras impresiones del mismo carácter' },
    ],
    quiz: {
      question: '¿Cuál es la diferencia algorítmica fundamental entre `union` e `inter`?',
      options: [
        'En union se reinicia la tabla seen a cero entre cadenas; en inter no',
        'En union imprimes caracteres nuevos de ambas cadenas consecutivamente; en inter solo imprimes los que existen simultáneamente en la segunda',
        'En union no se usa write',
      ],
      correctIdx: 1,
      explanation: 'Union une ambas cadenas eliminando duplicados globales, mientras que inter solo conserva la intersección de ambas.',
    },
  },

  swap_bits: {
    archetypeId: 'BITWISE_HARDWARE',
    nature: 'FUNCION_C',
    analogy: 'Un byte tiene 8 bits divididos en dos mitades de 4 bits (nibbles: los 4 altos y los 4 bajos). Imagina que tienes dos paquetes de 4 naipes en cada mano y simplemente los cambias de mano.',
    natureExplanation: 'Es una función pura C (`unsigned char swap_bits(unsigned char octet)`). NO debe incluir `main` en la entrega. Retorna el nuevo byte transformado.',
    underTheHood: {
      stackVsHeap: 'Cero uso de memoria RAM. El parámetro `octet` se pasa en el registro de 8 bits `%dil` o `%al` del procesador.',
      cpuRegisters: 'Se ejecuta en 2 operaciones de desplazamiento (`shr`, `shl`) y una operación `or` binaria a nivel de compuertas lógicas.',
      pointers: 'No usa punteros, trabaja por valor de 8 bits.',
      sentinel: 'No requiere centinela, siempre procesa exactamente 1 byte (8 bits).',
    },
    mentalSteps: [
      {
        num: 1,
        title: 'Desplazar el Nibble Alto hacia la Derecha',
        desc: 'Mueve los 4 bits más significativos 4 posiciones a la derecha: `(octet >> 4)`.',
        cCode: 'unsigned char right = (octet >> 4);',
      },
      {
        num: 2,
        title: 'Desplazar el Nibble Bajo hacia la Izquierda',
        desc: 'Mueve los 4 bits menos significativos 4 posiciones a la izquierda: `(octet << 4)`.',
        cCode: 'unsigned char left = (octet << 4);',
      },
      {
        num: 3,
        title: 'Combinar Ambos Nibbles con un OR Binario (|)',
        desc: 'Une ambas mitades para formar el nuevo byte cruzado.',
        cCode: 'return ((octet >> 4) | (octet << 4));',
      },
    ],
    dictionary: [
      { human: 'Mover 4 bits a la derecha', c: 'octet >> 4', note: 'Los bits altos caen a las posiciones bajas' },
      { human: 'Mover 4 bits a la izquierda', c: 'octet << 4', note: 'Los bits bajos suben a las posiciones altas' },
      { human: 'Unir las dos mitades', c: '(octet >> 4) | (octet << 4)', note: 'Fusión bit a bit en 1 sola línea' },
    ],
    quiz: {
      question: 'Si el byte de entrada es 0x41 (binario 0100 0001), ¿cuál es el resultado de swap_bits?',
      options: [
        '0x14 (binario 0001 0100)',
        '0x41 (sin cambios)',
        '0xFF (todos en uno)',
      ],
      correctIdx: 0,
      explanation: 'El nibble alto 0100 (4) pasa al bajo, y el nibble bajo 0001 (1) pasa al alto, formando 0001 0100 (0x14).',
    },
  },

  // ─── NIVEL 3 ──────────────────────────────────────────────────────────────
  add_prime_sum: {
    archetypeId: 'ARITHMETIC_NUMBER_THEORY',
    nature: 'PROGRAMA_CLI',
    analogy: 'Te dan un número límite y tienes una bolsa vacía. Visitas todos los números desde el 2 hasta ese límite; a cada uno le preguntas "¿tienes algún divisor secreto?". Si responde que no (es primo), lo metes a la bolsa sumándolo al total. Al final, muestras el total acumulado en pantalla.',
    natureExplanation: 'Programa CLI con `main`. Requiere exactamente `argc == 2` con un entero positivo. Si la entrada es inválida o no hay argumentos, escribe `0\\n`.',
    underTheHood: {
      stackVsHeap: 'Variables enteras en Stack (`int sum = 0`, `int num`). Función auxiliar `is_prime` ejecutada en O(√N).',
      cpuRegisters: 'La división `n % d == 0` usa la instrucción de CPU `idiv` o comprobación de residuo.',
      pointers: 'Lectura de `argv[1]` con función propia `ft_atoi` sin usar librerías externas prohibidas.',
      sentinel: "Bucle de primos se optimiza comprobando hasta `d * d <= n`.",
    },
    mentalSteps: [
      {
        num: 1,
        title: 'Validación de Argumentos y Conversión a Entero',
        desc: 'Verifica argc == 2. Convierte argv[1] a entero positivo con un mini-atoi. Si es <= 0, imprime "0\\n".',
        cCode: 'if (argc != 2 || ft_atoi(argv[1]) <= 0) {\n    write(1, "0\\n", 2);\n    return (0);\n}\nint target = ft_atoi(argv[1]);',
      },
      {
        num: 2,
        title: 'Función Auxiliar: Comprobador de Primos O(√N)',
        desc: 'Un número n < 2 no es primo. Si algún d desde 2 con d*d <= n divide a n exactamente (n % d == 0), no es primo.',
        cCode: 'int is_prime(int n) {\n    if (n <= 1) return (0);\n    for (int d = 2; d * d <= n; d++) {\n        if (n % d == 0) return (0);\n    }\n    return (1);\n}',
      },
      {
        num: 3,
        title: 'Bucle Acumulador de Suma',
        desc: 'Itera desde i = 2 hasta target. Si `is_prime(i)` es verdadero, añade i al total `sum`.',
        cCode: 'int sum = 0;\nfor (int i = 2; i <= target; i++) {\n    if (is_prime(i))\n        sum += i;\n}',
      },
      {
        num: 4,
        title: 'Imprimir el Número con Función Recurrente (putnbr) + Salto',
        desc: 'Convierte el entero acumulado a caracteres ASCII e imprime "\\n".',
        cCode: 'ft_putnbr(sum);\nwrite(1, "\\n", 1);\nreturn (0);',
      },
    ],
    dictionary: [
      { human: 'Optimización de primalidad', c: 'd * d <= n', note: 'Comprueba hasta la raíz cuadrada, mucho más rápido que llegar a n' },
      { human: 'Imprimir entero sin printf', c: 'ft_putnbr(sum);', note: 'Recursión dividiendo entre 10 y tomando el módulo' },
    ],
    quiz: {
      question: '¿Por qué la condición `d * d <= n` es crucial en la función `is_prime`?',
      options: [
        'Porque si iteramos hasta n, Moulinette dará Time Limit Exceeded (TLE) con números grandes',
        'Porque los números mayores a la raíz cuadrada no existen en memoria',
        'Porque gcc produce un error de punto flotante',
      ],
      correctIdx: 0,
      explanation: 'Un factor compuesto siempre tiene un divisor menor o igual a su raíz cuadrada. Iterar hasta √N es exponencialmente más veloz.',
    },
  },

  // ─── NIVEL 4 ──────────────────────────────────────────────────────────────
  flood_fill: {
    archetypeId: 'RECURSIVE_DFS_FLOODFILL',
    nature: 'FUNCION_C',
    analogy: 'La herramienta "Bote de Pintura" de Photoshop / Paint: haces clic en un píxel y la pintura se expande como una ola hacia arriba, abajo, izquierda y derecha, pero solo sobre los píxeles que tenían el mismo color original del punto de partida.',
    natureExplanation: 'Función en C (`void flood_fill(char **tab, t_point size, t_point begin)`). Modifica la matriz `tab` directamente en memoria por recursión. NO incluye `main`.',
    underTheHood: {
      stackVsHeap: 'La matriz `tab` es un puntero doble `char **` en Heap o Stack. La recursión usa la Pila de Ejecución (Call Stack).',
      cpuRegisters: 'Guarda el color objetivo `char target = tab[begin.y][begin.x]` antes de pintar.',
      pointers: '`tab[y][x]` accede a la fila `y` y al byte de columna `x`.',
      sentinel: 'Condiciones de parada: fuera de límites (`x < 0 || x >= size.x || y < 0 || y >= size.y`) o celda que no coincide con `target` o ya pintada.',
    },
    mentalSteps: [
      {
        num: 1,
        title: 'Capturar el Color Objetivo Original',
        desc: 'Guarda en una variable el carácter que reside en las coordenadas de inicio `begin.y` y `begin.x`. Si ya es igual a \'F\', sal inmediatamente.',
        cCode: 'char target = tab[begin.y][begin.x];\nif (target == \'F\') return;\nfill(tab, size, begin.x, begin.y, target);',
      },
      {
        num: 2,
        title: 'Función Recursiva: El Guardián de Fronteras',
        desc: 'Verifica que la coordenada actual esté dentro de la matriz y que contenga el color objetivo.',
        cCode: 'void fill(char **tab, t_point size, int x, int y, char target) {\n    if (x < 0 || x >= size.x || y < 0 || y >= size.y)\n        return;\n    if (tab[y][x] != target)\n        return;\n    // Pintar celda actual\n    tab[y][x] = \'F\';\n    // Llamar a los 4 vecinos\n}',
      },
      {
        num: 3,
        title: 'Propagación a los 4 Vecinos Cardinales',
        desc: 'Llama recursivamente a `fill` para arriba (y-1), abajo (y+1), izquierda (x-1) y derecha (x+1).',
        cCode: 'fill(tab, size, x + 1, y, target); // Derecha\nfill(tab, size, x - 1, y, target); // Izquierda\nfill(tab, size, x, y + 1, target); // Abajo\nfill(tab, size, x, y - 1, target); // Arriba',
      },
    ],
    dictionary: [
      { human: 'Acceso a matriz 2D', c: 'tab[y][x]', note: 'Primero fila (y), luego columna (x)' },
      { human: 'Comprobar límites', c: 'x >= 0 && x < size.x && y >= 0 && y < size.y', note: 'Evita Segfault fuera de matriz' },
      { human: 'Pintar celda', c: "tab[y][x] = 'F';", note: 'Modifica el mapa in-place' },
    ],
    quiz: {
      question: '¿Por qué ocurre un Stack Overflow si la celda de inicio ya contiene el color \'F\' y no se comprueba?',
      options: [
        'Porque la función intentará pintar infinitamente los mismos vecinos sin cambiar de estado, saturando la pila de llamadas',
        'Porque el compilador gcc no soporta el carácter F',
        'Porque el tipo t_point se desborda a valores negativos',
      ],
      correctIdx: 0,
      explanation: 'Sin verificar si la celda ya fue pintada, `fill` se llamará recursivamente a sí misma y a sus vecinos en un bucle infinito hasta agotar la pila.',
    },
  },

  ft_split: {
    archetypeId: 'DYNAMIC_HEAP_ALLOCATION',
    nature: 'FUNCION_C',
    analogy: 'Tienes una frase larga y una tijera que corta en cada espacio o tabulador. Primero cuentas cuántas palabras hay para comprar una caja con exactamente ese número de compartimentos (+ 1 para la tapa final NULL). Luego cortas cada palabra a su medida exacta y la guardas en su casilla.',
    natureExplanation: 'Función pura C (`char **ft_split(char *str)`). Reserva memoria dinámica en Heap con `malloc`. Retorna un array de strings terminado en `NULL`.',
    underTheHood: {
      stackVsHeap: 'La tabla principal `char **result` y cada palabra `result[i]` se reservan en el HEAP. El llamador es responsable de su ciclo de vida.',
      cpuRegisters: 'Punteros de travesía para calcular longitudes de palabras (`word_len`).',
      pointers: '`result` es un puntero a punteros (`char**`). `result[count] = NULL` es el centinela obligatorio.',
      sentinel: "Separadores son `' '`, `'\\t'` y `'\\n'`. El array termina en `NULL`.",
    },
    mentalSteps: [
      {
        num: 1,
        title: 'Contar el Número Total de Palabras',
        desc: 'Recorre el string ignorando delimitadores consecutivos. Cada vez que pasas de un delimitador a un carácter alfabético, incrementas el contador.',
        cCode: 'int count_words(char *s) {\n    int count = 0, in_word = 0;\n    while (*s) {\n        if (*s != \' \' && *s != \'\\t\' && *s != \'\\n\' && !in_word) {\n            in_word = 1;\n            count++;\n        } else if (*s == \' \' || *s == \'\\t\' || *s == \'\\n\')\n            in_word = 0;\n        s++;\n    }\n    return (count);\n}',
      },
      {
        num: 2,
        title: 'Asignar el Array Principal de Punteros en Heap',
        desc: 'Reserva `sizeof(char *) * (words + 1)`. Si malloc falla, retorna NULL.',
        cCode: 'char **tab = (char **)malloc(sizeof(char *) * (count_words(str) + 1));\nif (!tab) return (NULL);',
      },
      {
        num: 3,
        title: 'Extraer y Reservar Cada Palabra Individualmente',
        desc: 'Para cada palabra, calcula su longitud `len`, reserva `len + 1` bytes, cópiala y añade el terminador `\\0`.',
        cCode: 'int k = 0;\nwhile (*str) {\n    while (*str && (*str == \' \' || *str == \'\\t\' || *str == \'\\n\')) str++;\n    if (*str) {\n        int len = 0;\n        while (str[len] && str[len] != \' \' && str[len] != \'\\t\' && str[len] != \'\\n\') len++;\n        tab[k] = (char *)malloc(len + 1);\n        // Copiar len caracteres y tab[k][len] = \'\\0\';\n        k++;\n        str += len;\n    }\n}',
      },
      {
        num: 4,
        title: 'Centinela Final NULL Obligatorio',
        desc: 'El último elemento del array de punteros debe ser obligatoriamente NULL para que las funciones externas sepan dónde termina.',
        cCode: 'tab[k] = NULL;\nreturn (tab);',
      },
    ],
    dictionary: [
      { human: 'Alocar array de punteros', c: 'malloc(sizeof(char *) * (count + 1))', note: 'Punteros de 8 bytes cada uno' },
      { human: 'Centinela final del array', c: 'tab[count] = NULL;', note: 'Vital para evitar leer memoria basura' },
    ],
    quiz: {
      question: '¿Por qué es obligatorio asignar `sizeof(char *) * (count + 1)` y poner `tab[count] = NULL`?',
      options: [
        'Porque en C los arrays dinámicos de strings no guardan su longitud y requieren NULL como centinela de parada',
        'Porque malloc siempre exige que el último elemento sea cero',
        'Porque si no se pone NULL, el compilador genera un error al compilar',
      ],
      correctIdx: 0,
      explanation: 'Sin el puntero NULL al final, cualquier función que itere sobre `tab[i]` continuará leyendo direcciones de memoria arbitrarias provocando un Segfault.',
    },
  },
}

/**
 * Función principal que recupera el blueprint de razonamiento algorítmico
 * para un ejercicio dado, asociando su arquetipo estructural y de memoria.
 */
export function getExerciseThinkingBlueprint(exercise) {
  if (!exercise) return null

  const id = exercise.id || ''
  const isProgram = exercise.tipoEntrega === 'programa'

  // Si existe un blueprint específico a medida, lo devolvemos enriquecido con su arquetipo
  if (SPECIFIC_BLUEPRINTS[id]) {
    const specific = SPECIFIC_BLUEPRINTS[id]
    const archetype = PATTERN_ARCHETYPES[specific.archetypeId] || PATTERN_ARCHETYPES.TWO_POINTER_TOKENIZER

    return {
      exerciseId: id,
      nature: specific.nature,
      natureExplanation: specific.natureExplanation,
      archetype,
      analogy: specific.analogy,
      underTheHood: specific.underTheHood,
      inputOutput: {
        input: isProgram ? 'Argumentos en línea de comandos (argc, argv)' : 'Parámetros de función en C',
        output: isProgram ? 'Salida estándar write(1, ...) con salto de línea' : 'Valor de retorno o mutación de memoria',
        goldenRule: isProgram
          ? 'Si los argumentos son incorrectos, imprimir "\\n" y retornar 0.'
          : 'Comprobar siempre punteros NULL antes de desreferenciar.',
      },
      mentalSteps: specific.mentalSteps,
      dictionary: specific.dictionary,
      fatalTraps: [
        {
          name: 'Segmentation Fault por Falta de Comprobación',
          cause: isProgram ? 'Acceder a argv[1] sin verificar argc == 2.' : 'Desreferenciar punteros sin comprobar si son NULL.',
          cure: isProgram ? 'Colocar `if (argc != 2) { write(1, "\\n", 1); return (0); }` al inicio de main.' : 'Colocar `if (!ptr) return (0);` al entrar en la función.',
        },
        {
          name: 'Bucle Infinito / Condición de Parada',
          cause: "Olvidar incrementar el índice `i++` o el puntero `ptr = ptr->next` en ramas condicionales.",
          cure: 'Verificar que cada rama del while avance inequívocamente hacia el centinela final.',
        },
        {
          name: 'Moulinette KO: Salto de Línea y Cierre',
          cause: isProgram ? 'Olvidar el salto de línea "\\n" al final de la ejecución.' : 'Retornar valores no inicializados o memory leaks.',
          cure: isProgram ? 'Añadir siempre `write(1, "\\n", 1); return (0);`.' : 'Garantizar el terminador de string `\\0` o `NULL` en arrays.',
        },
      ],
      quiz: specific.quiz,
    }
  }

  // Deducción dinámica del arquetipo para ejercicios que no tengan override manual
  let archetypeId = 'TWO_POINTER_TOKENIZER'
  let nature = isProgram ? 'PROGRAMA_CLI' : 'FUNCION_C'

  if (id.includes('list') || id.includes('sort_list')) {
    archetypeId = 'LINKED_LIST_POINTERS'
  } else if (id.includes('bit') || id === 'is_power_of_2') {
    archetypeId = 'BITWISE_HARDWARE'
  } else if (id === 'inter' || id === 'union' || id === 'wdmatch' || id === 'hidenp') {
    archetypeId = 'ASCII_HASH_TABLE_O1'
  } else if (id === 'flood_fill') {
    archetypeId = 'RECURSIVE_DFS_FLOODFILL'
  } else if (id === 'pgcd' || id === 'lcm' || id === 'add_prime_sum' || id === 'fprime' || id === 'tab_mult' || id === 'do_op') {
    archetypeId = 'ARITHMETIC_NUMBER_THEORY'
  } else if (id.includes('range') || id === 'ft_split' || id === 'ft_strdup' || id === 'ft_itoa') {
    archetypeId = 'DYNAMIC_HEAP_ALLOCATION'
  } else if (id === 'ft_strrev' || id === 'sort_int_tab' || id === 'ft_swap' || id === 'max') {
    archetypeId = 'INPLACE_POINTER_MUTATION'
  } else if (id === 'brainfuck') {
    archetypeId = 'STATE_MACHINE_INTERPRETER'
  } else if (id.includes('rot') || id.includes('capitalizer') || id === 'repeat_alpha' || id === 'ulstr' || id === 'alpha_mirror') {
    archetypeId = 'ASCII_TRANSFORMATION'
  } else if (id.startsWith('ft_str') || id.startsWith('ft_mem') || id === 'putstr') {
    archetypeId = 'CSTRING_PTR_WALK'
  }

  const archetype = PATTERN_ARCHETYPES[archetypeId]

  const isList = archetypeId === 'LINKED_LIST_POINTERS'
  const isBits = archetypeId === 'BITWISE_HARDWARE'
  const isHash = archetypeId === 'ASCII_HASH_TABLE_O1'

  let analogy = exercise.palacio?.historia || exercise.campayoMetodo?.feynman || exercise.razonamiento?.porQue || 'Un algoritmo determinista que transforma las entradas en salidas válidas para Moulinette.'
  if (typeof analogy === 'string' && analogy.length > 250) {
    analogy = analogy.slice(0, 240) + '...'
  }

  const underTheHood = {
    stackVsHeap: archetype.memoryLayout,
    cpuRegisters: 'Variables escalares e índices residen en registros de CPU para máxima eficiencia.',
    pointers: isList ? 'Punteros de 64 bits a estructuras t_list con campos ->data y ->next.' : 'Aritmética de punteros directa sobre memoria contigua.',
    sentinel: archetype.keySentinel,
  }

  const mentalSteps = [
    {
      num: 1,
      title: isProgram ? 'Guardián de Argumentos (argc)' : 'Cláusula de Guarda y Seguridad (NULL Check)',
      desc: isProgram
        ? 'Valida si recibiste los argumentos esperados. Si la cantidad no coincide, imprime "\\n" y termina inmediatamente.'
        : 'Verifica si te han pasado punteros nulos o datos vacíos. Si es así, retorna inmediatamente evitando un Segfault.',
      cCode: isProgram ? 'if (argc != 2) {\n    write(1, "\\n", 1);\n    return (0);\n}' : 'if (!ptr)\n    return (0);',
    },
    {
      num: 2,
      title: 'Inicializar Punteros e Índices en la Pila',
      desc: isList
        ? 'Declara un puntero temporal `curr = lst` para recorrer los nodos sin perder la cabeza de la lista.'
        : isHash
        ? 'Declara la tabla de frecuencias `int seen[256] = {0}` para registrar caracteres vistos en O(1).'
        : 'Coloca tu índice o puntero al inicio de los datos a procesar.',
      cCode: isList ? 't_list *curr = lst;' : isHash ? 'int seen[256] = {0};' : 'int i = 0;',
    },
    {
      num: 3,
      title: 'El Bucle Principal de Transformación',
      desc: 'Avanza elemento a elemento aplicando la lógica de transformación hasta alcanzar el centinela.',
      cCode: isList
        ? 'while (curr != NULL) {\n    // acción sobre curr->data\n    curr = curr->next;\n}'
        : isBits
        ? 'for (int i = 7; i >= 0; i--) {\n    // operaciones bit a bit\n}'
        : 'while (str[i] != \'\\0\') {\n    // transformar o filtrar\n    i++;\n}',
    },
    {
      num: 4,
      title: 'Cierre y Retorno Limpio',
      desc: isProgram ? 'Imprime el salto de línea obligatorio y retorna 0.' : 'Retorna el resultado final o el puntero asignado.',
      cCode: isProgram ? 'write(1, "\\n", 1);\nreturn (0);' : 'return (resultado);',
    },
  ]

  const dictionary = [
    { human: 'Acceso a memoria del elemento', c: isList ? 'curr->data' : 'str[i] / *ptr', note: 'Lectura de byte o dirección' },
    { human: 'Avanzar al siguiente elemento', c: isList ? 'curr = curr->next;' : 'i++; / ptr++;', note: 'Puntero avanza hacia la salida' },
    { human: 'Condición de parada', c: isList ? 'curr == NULL' : "str[i] == '\\0'", note: 'Centinela de fin' },
  ]

  return {
    exerciseId: id,
    nature,
    natureExplanation: isProgram
      ? 'Programa autónomo con `int main(int argc, char **argv)`. Emite a través de `write()` y requiere salto de línea.'
      : 'Función C pura para enlazar en biblioteca. Recibe parámetros formales y devuelve un valor.',
    archetype,
    analogy,
    underTheHood,
    inputOutput: {
      input: isProgram ? 'Argumentos de terminal (argc, argv)' : 'Parámetros formales en C',
      output: isProgram ? 'write(1, ...) + "\\n"' : 'Retorno de valor o modificación en memoria',
      goldenRule: isProgram ? 'Si los argumentos son incorrectos, imprimir "\\n" y salir.' : 'Verificar punteros antes de desreferenciar.',
    },
    mentalSteps,
    dictionary,
    fatalTraps: [
      {
        name: 'Segmentation Fault',
        cause: 'Acceso a memoria no inicializada o desreferenciación de NULL.',
        cure: 'Validar siempre `if (!ptr) return;`.',
      },
      {
        name: 'Bucle Infinito',
        cause: 'No incrementar la variable de control o no avanzar el puntero en todas las ramas.',
        cure: 'Asegurar `i++` o `ptr = ptr->next` en cada iteración.',
      },
      {
        name: 'Formato de Salida Moulinette',
        cause: 'Olvidar el salto de línea obligatorio en programas con main.',
        cure: 'Escribir `write(1, "\\n", 1);` al finalizar.',
      },
    ],
    quiz: {
      question: `¿Cuál es el primer paso antes de ejecutar el algoritmo de ${exercise.nombre || 'este ejercicio'}?`,
      options: [
        'Escribir un bucle while sin comprobar nada',
        'Validar los argumentos de entrada o punteros para evitar fallos de segmentación',
        'Llamar a malloc sin calcular el tamaño',
      ],
      correctIdx: 1,
      explanation: 'La regla de oro en C y en 42 es siempre validar la entrada antes de intentar leerla.',
    },
  }
}
