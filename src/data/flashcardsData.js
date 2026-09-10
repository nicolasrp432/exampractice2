// Colección curada de Flashcards enfocadas en Sintaxis, Lógica de Resolución,
// Memoria & Punteros y Casos Límite para el Examen 02 (Rank 02) de Escuela 42.

export const BUILTIN_FLASHCARDS = [
  // ─── NIVEL 1 ───
  {
    id: 'l1-ft_strlen-sintaxis',
    exerciseId: 'ft_strlen',
    nivel: 1,
    categoria: 'sintaxis',
    titulo: 'ft_strlen: Conteo seguro de caracteres',
    pregunta: '¿Cuál es la forma más idiomática y segura de implementar ft_strlen sin librerías?',
    pista: 'Recorre con un entero o aritmética de punteros hasta encontrar el carácter nulo.',
    codigoReto: `int ft_strlen(char *str) {
    int i = 0;
    // ¿Qué condición debe comprobar el bucle?
    while (???)
        i++;
    return (i);
}`,
    respuesta: 'Se debe iterar comprobando que el carácter actual no sea el nulo (`str[i] != \'\\0\'` o simplemente `str[i]`). Además, si te pasan NULL en la vida real es un fallo, pero en 42 ft_strlen asume un string válido.',
    codigoSolucion: `int\tft_strlen(char *str)
{
\tint\ti = 0;

\twhile (str[i])
\t\ti++;
\treturn (i);
}`,
    porQue: 'En C, las cadenas son arrays de caracteres terminados en byte 0 (\'\\0\'). El valor numérico de \'\\0\' es 0 (falso en evaluaciones booleanas), por lo que while (str[i]) se detiene exactamente al final.',
    trampaMoulinette: 'Cuidado con devolver int cuando en libft estándar se usa size_t. En el examen rank02 el prototipo oficial suele ser: int ft_strlen(char *str);.',
    origen: 'predefinida'
  },
  {
    id: 'l1-ft_swap-punteros',
    exerciseId: 'ft_swap',
    nivel: 1,
    categoria: 'memoria_punteros',
    titulo: 'ft_swap: Paso por referencia y desreferenciación',
    pregunta: '¿Por qué necesitamos usar el operador * (desreferenciación) dentro de ft_swap(int *a, int *b)?',
    pista: 'C pasa los argumentos por valor. ¿Qué pasaría si hicieras a = b?',
    codigoReto: `void ft_swap(int *a, int *b) {
    int tmp;
    tmp = a; // ¿Es esto correcto?
    a = b;
    b = tmp;
}`,
    respuesta: 'Si modificas `a` y `b` directamente, solo intercambias las copias locales de las direcciones de memoria dentro de la función. Para modificar los valores originales en la memoria del llamador, debes desreferenciar los punteros usando `*a` y `*b`.',
    codigoSolucion: `void\tft_swap(int *a, int *b)
{
\tint\ttmp;

\ttmp = *a;
\t*a = *b;
\t*b = tmp;
}`,
    porQue: '`a` contiene una dirección de memoria (ej. 0x7ffd). `*a` accede al valor entero almacenado en esa dirección. `tmp` debe ser de tipo `int`, no `int*`.',
    trampaMoulinette: 'Declarar `int *tmp` en lugar de `int tmp`, o no verificar que los punteros apunten a direcciones válidas si el ejercicio lo requiriera.',
    origen: 'predefinida'
  },
  {
    id: 'l1-ft_putstr-write',
    exerciseId: 'ft_putstr',
    nivel: 1,
    categoria: 'sintaxis',
    titulo: 'ft_putstr: Parámetros de write en Unix',
    pregunta: '¿Cuáles son los 3 parámetros de la función de sistema write() y por qué pasamos &str[i] o str + i?',
    pista: 'write(file_descriptor, const void *buf, size_t count)',
    codigoReto: `write(1, str[i], 1); // ¿Por qué esto compila con warning o crashea?`,
    respuesta: '`write()` requiere una DIRECCIÓN de memoria (un puntero) en el segundo argumento, no el valor del carácter. Pasar `str[i]` pasa el código ASCII (ej: 65 para \'A\'), lo cual write interpreta como la dirección de memoria 0x41 y causa un Segmentation Fault.',
    codigoSolucion: `void\tft_putstr(char *str)
{
\tint\ti = 0;

\tif (!str)
\t\treturn ;
\twhile (str[i])
\t{
\t\twrite(1, &str[i], 1); // o write(1, str + i, 1);
\t\ti++;
\t}
}`,
    porQue: 'El descriptor 1 es stdout (salida estándar). El segundo argumento debe ser `const void *`, por lo que pasamos la dirección del carácter con `&str[i]`.',
    trampaMoulinette: 'Pasar `str[i]` en vez de `&str[i]`. En C produce Segfault instantáneo en el examen.',
    origen: 'predefinida'
  },
  {
    id: 'l1-first_word-espacios',
    exerciseId: 'first_word',
    nivel: 1,
    categoria: 'resolucion',
    titulo: 'first_word: Bucle de salto de espacios y tabs',
    pregunta: '¿Cómo estructurar los bucles en first_word para imprimir exactamente la primera palabra ignorando espacios iniciales?',
    pista: 'Dos bucles consecutivos: uno para saltar delimitadores y otro para imprimir mientras no sea delimitador ni nulo.',
    codigoReto: `// argc == 2
char *s = argv[1];
int i = 0;
// 1. Saltar espacios
while (s[i] == ' ' || s[i] == '\\t') i++;
// 2. ¿Cómo imprimir la palabra?`,
    respuesta: 'Primero se salta todo espacio y tabulación con `while (s[i] == \' \' || s[i] == \'\\t\') i++;`. Luego, se imprime con un segundo bucle mientras `s[i] && s[i] != \' \' && s[i] != \'\\t\'`. Al final siempre se imprime un salto de línea `write(1, "\\n", 1)`.',
    codigoSolucion: `int\tmain(int argc, char **argv)
{
\tint\ti = 0;

\tif (argc == 2)
\t{
\t\twhile (argv[1][i] == ' ' || argv[1][i] == '\\t')
\t\t\ti++;
\t\twhile (argv[1][i] && argv[1][i] != ' ' && argv[1][i] != '\\t')
\t\t{
\t\t\twrite(1, &argv[1][i], 1);
\t\t\ti++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    porQue: 'El salto de línea `\\n` debe imprimirse SIEMPRE, incluso si `argc != 2` o si el string está vacío o solo contiene espacios.',
    trampaMoulinette: 'Meter el write(1, "\\n", 1) dentro del bloque `if (argc == 2)` en lugar de fuera. Moulinette prueba con 0 argumentos o 3 argumentos y espera ver solo un "\\n".',
    origen: 'predefinida'
  },
  {
    id: 'l1-repeat_alpha-aritmetica',
    exerciseId: 'repeat_alpha',
    nivel: 1,
    categoria: 'sintaxis',
    titulo: 'repeat_alpha: Cálculo del número de repeticiones',
    pregunta: '¿Cuál es la fórmula aritmética exacta para obtener cuántas veces se debe imprimir una letra (a=1, b=2... z=26)?',
    pista: 'Resta el código ASCII de \'a\' o \'A\' y suma 1.',
    codigoReto: `int count = 1;
if (c >= 'a' && c <= 'z')
    count = ???;
else if (c >= 'A' && c <= 'Z')
    count = ???;`,
    respuesta: 'Para minúsculas: `count = c - \'a\' + 1`. Para mayúsculas: `count = c - \'A\' + 1`. Para cualquier otro carácter que no sea letra, count es 1.',
    codigoSolucion: `int\tcount = 1;

if (c >= 'a' && c <= 'z')
\tcount = c - 'a' + 1;
else if (c >= 'A' && c <= 'Z')
\tcount = c - 'A' + 1;

while (count--)
\twrite(1, &c, 1);`,
    porQue: 'En la tabla ASCII las letras van consecutivas. \'b\' (98) - \'a\' (97) = 1. Al sumar 1 obtenemos 2 repeticiones.',
    trampaMoulinette: 'Olvidar el `+ 1` (haciendo que \'a\' se repita 0 veces y desaparezca) o repetir caracteres no alfabéticos más de una vez.',
    origen: 'predefinida'
  },
  {
    id: 'l1-search_and_replace-validacion',
    exerciseId: 'search_and_replace',
    nivel: 1,
    categoria: 'casos_limite',
    titulo: 'search_and_replace: Validación estricta de longitud de argumentos',
    pregunta: '¿Cómo verificar que el segundo y tercer argumento sean exactamente caracteres individuales y no strings largos?',
    pista: 'El carácter 0 puede ser cualquiera, pero el carácter en la posición 1 DEBE ser \'\\0\'.',
    codigoReto: `if (argc == 4 && ??? && ???)`,
    respuesta: 'Debes comprobar que `argv[2][1] == \'\\0\'` y `argv[3][1] == \'\\0\'`. Si el usuario pasa `"a"` tiene longitud 1 (`argv[2][1] == \'\\0\'`). Si pasa `"abc"` tiene longitud > 1 y el programa no debe reemplazar nada, solo imprimir un salto de línea.',
    codigoSolucion: `int\tmain(int argc, char **argv)
{
\tint\ti = 0;

\tif (argc == 4 && argv[2][1] == '\\0' && argv[3][1] == '\\0')
\t{
\t\twhile (argv[1][i])
\t\t{
\t\t\tif (argv[1][i] == argv[2][0])
\t\t\t\twrite(1, &argv[3][0], 1);
\t\t\telse
\t\t\t\twrite(1, &argv[1][i], 1);
\t\t\ti++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    porQue: 'El subject indica explícitamente: "If the number of arguments is not 3, or if either string 2 or string 3 is not a single character, just display a newline".',
    trampaMoulinette: 'Olvidar comprobar que `argv[2][1] == \'\\0\'`. Moulinette probará `./search_and_replace "hola" "ol" "x"` esperando un simple newline.',
    origen: 'predefinida'
  },
  {
    id: 'l1-fizzbuzz-orden',
    exerciseId: 'fizzbuzz',
    nivel: 1,
    categoria: 'resolucion',
    titulo: 'fizzbuzz: Orden de condiciones y putnbr sin printf',
    pregunta: '¿Por qué la condición `i % 15 == 0` debe comprobarse antes que `i % 3 == 0` o `i % 5 == 0`?',
    pista: 'Si compruebas `i % 3 == 0` primero, un múltiplo de 15 como 30 entrará en esa rama y nunca imprimirá "fizzbuzz".',
    codigoReto: `if (i % 3 == 0)
    write(1, "fizz", 4);
else if (i % 15 == 0) // ¡Esta rama nunca se alcanzará!`,
    respuesta: 'Las condiciones deben ir de la más restrictiva a la más general. 15 es múltiplo común (3 * 5). Además, para imprimir números del 1 al 100 con `write` sin usar printf se utiliza una función `write_num(n)` que descompone recursivamente o imprime decenas y unidades.',
    codigoSolucion: `void\tputnbr(int n)
{
\tchar\tc;

\tif (n >= 10)
\t\tputnbr(n / 10);
\tc = (n % 10) + '0';
\twrite(1, &c, 1);
}

int\tmain(void)
{
\tint\ti = 1;
\twhile (i <= 100)
\t{
\t\tif (i % 15 == 0)
\t\t\twrite(1, "fizzbuzz\\n", 9);
\t\telse if (i % 3 == 0)
\t\t\twrite(1, "fizz\\n", 5);
\t\telse if (i % 5 == 0)
\t\t\twrite(1, "buzz\\n", 5);
\t\telse
\t\t{
\t\t\tputnbr(i);
\t\t\twrite(1, "\\n", 1);
\t\t}
\t\ti++;
\t}
\treturn (0);
}`,
    porQue: '`i % 15 == 0` equivale a `(i % 3 == 0 && i % 5 == 0)`. Evaluarlo primero garantiza que no se ejecute una coincidencia parcial prematura.',
    trampaMoulinette: 'Imprimir desde 0 en vez de 1, o hasta 99 en vez de 100 inclusive.',
    origen: 'predefinida'
  },

  // ─── NIVEL 2 ───
  {
    id: 'l2-ft_atoi-fases',
    exerciseId: 'ft_atoi',
    nivel: 2,
    categoria: 'resolucion',
    titulo: 'ft_atoi: Las 3 fases del algoritmo',
    pregunta: '¿Cuáles son las 3 fases secuenciales indispensables para implementar ft_atoi de 42?',
    pista: '1) Caracteres blancos, 2) Signo (+ o -), 3) Acumulador de dígitos.',
    codigoReto: `int ft_atoi(const char *str) {
    // Fase 1: Whitespaces: ' ', '\\t', '\\n', '\\v', '\\f', '\\r'
    // Fase 2: ¿Cuántos signos acepta el atoi estándar?
    // Fase 3: ¿Fórmula de acumulación?
}`,
    respuesta: 'Fase 1: Saltar espacios con `while (*str == \' \' || (*str >= 9 && *str <= 13)) str++;`. Fase 2: Leer UN SOLO signo (+ o -): `if (*str == \'-\' || *str == \'+\') { if (*str == \'-\') sign = -1; str++; }`. Fase 3: Multiplicar por 10 y sumar dígito: `res = res * 10 + (*str - \'0\');`.',
    codigoSolucion: `int\tft_atoi(const char *str)
{
\tint\tsign = 1;
\tint\tres = 0;

\twhile (*str == ' ' || (*str >= 9 && *str <= 13))
\t\tstr++;
\tif (*str == '-' || *str == '+')
\t{
\t\tif (*str == '-')
\t\t\tsign = -1;
\t\tstr++;
\t}
\twhile (*str >= '0' && *str <= '9')
\t{
\t\tres = res * 10 + (*str - '0');
\t\tstr++;
\t}
\treturn (res * sign);
}`,
    porQue: 'El `atoi` de la libc estándar sólo acepta UN signo (+ o -). Si viene `--12` o `+-12`, el segundo signo no es un dígito y el bucle termina dando 0.',
    trampaMoulinette: 'Aceptar múltiples signos con un bucle `while (*str == \'-\')`. Eso era en la Piscine para `ft_atoi` custom, pero en el examen Rank02 `ft_atoi` imita la función de la librería estándar (máximo UN signo).',
    origen: 'predefinida'
  },
  {
    id: 'l2-ft_strcmp-unsigned',
    exerciseId: 'ft_strcmp',
    nivel: 2,
    categoria: 'sintaxis',
    titulo: 'ft_strcmp: ¿Por qué castear a (unsigned char)?',
    pregunta: '¿Por qué la resta final en ft_strcmp debe ser `(unsigned char)s1[i] - (unsigned char)s2[i]`?',
    pista: '¿Qué pasa si un char tiene valor > 127 y `char` es signed en el compilador?',
    codigoReto: `return (s1[i] - s2[i]); // ¿Por qué esto puede dar un signo incorrecto?`,
    respuesta: 'En muchas arquitecturas, `char` tiene signo (-128 a 127). Un byte como 0xFF se interpreta como -1. Si se compara con \'A\' (65), la resta con signo daría -1 - 65 = -66 (negativo), cuando 255 > 65 (debería ser positivo). La especificación POSIX/C de strcmp exige interpretar los bytes como `unsigned char`.',
    codigoSolucion: `int\tft_strcmp(char *s1, char *s2)
{
\tint\ti = 0;

\twhile (s1[i] && s2[i] && s1[i] == s2[i])
\t\ti++;
\treturn ((unsigned char)s1[i] - (unsigned char)s2[i]);
}`,
    porQue: 'El estándar de C establece: "The sign of a non-zero value returned by the comparison functions is the sign of the difference between the values of the first pair of characters (both interpreted as unsigned char)".',
    trampaMoulinette: 'Olvidar el casteo `(unsigned char)`. En caracteres no ASCII (acentos, símbolos > 127), Moulinette detectará la discrepancia de signo con el `strcmp` del sistema.',
    origen: 'predefinida'
  },
  {
    id: 'l2-inter-lookup-table',
    exerciseId: 'inter',
    nivel: 2,
    categoria: 'resolucion',
    titulo: 'inter: Técnica de la tabla booleana ASCII de 256 bytes',
    pregunta: '¿Cómo implementar `inter` en O(n + m) sin bucles cuádruples usando una tabla de enteros o caracteres?',
    pista: 'Un array `int seen[256] = {0};` puede llevar el estado de cada uno de los 256 posibles bytes ASCII.',
    codigoReto: `// ¿Cómo saber si un carácter de argv[1] está en argv[2]
// y aún no ha sido impreso?`,
    respuesta: 'Se crea un array `int seen[256] = {0};`. Paso 1: recorrer `argv[2]` marcando `seen[(unsigned char)argv[2][j]] = 1;` (indica que existe en la 2ª cadena). Paso 2: recorrer `argv[1]`: si `seen[(unsigned char)argv[1][i]] == 1`, se imprime y se cambia su valor a 2 para no volver a imprimirlo.',
    codigoSolucion: `int\tmain(int argc, char **argv)
{
\tint\tseen[256] = {0};
\tint\ti = 0;

\tif (argc == 3)
\t{
\t\twhile (argv[2][i])
\t\t{
\t\t\tseen[(unsigned char)argv[2][i]] = 1;
\t\t\ti++;
\t\t}
\t\ti = 0;
\t\twhile (argv[1][i])
\t\t{
\t\t\tif (seen[(unsigned char)argv[1][i]] == 1)
\t\t\t{
\t\t\t\twrite(1, &argv[1][i], 1);
\t\t\t\tseen[(unsigned char)argv[1][i]] = 2; // Ya impreso
\t\t\t}
\t\t\ti++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    porQue: 'El acceso por índice a un array de 256 es O(1). Esto hace que el código sea ultra limpio, compacto (15 líneas) e imposible de romper por tiempo límite o desbordamiento.',
    trampaMoulinette: 'No castear el índice a `(unsigned char)`. Si el string tiene un carácter negativo (ej: UTF-8 byte 0x80 = -128), indexar `seen[-128]` corromperá la memoria de la pila y dará Segfault.',
    origen: 'predefinida'
  },
  {
    id: 'l2-union-diferencia',
    exerciseId: 'union',
    nivel: 2,
    categoria: 'resolucion',
    titulo: 'union: Diferencia clave con inter',
    pregunta: '¿Cuál es la diferencia entre el ejercicio `inter` y `union` y cómo cambia la lógica de la tabla?',
    pista: 'En `union` se imprimen los caracteres de s1 (sin repetir) y luego los de s2 (sin repetir ni repetir con s1).',
    codigoReto: `// ¿Qué valor inicial y qué comprobación se hace en seen[256]?`,
    respuesta: 'En `union`, cualquier carácter que aparezca en `s1` o `s2` se imprime una sola vez en el orden de aparición. Usamos `int seen[256] = {0};`. Recorremos `s1`: si `!seen[c]` -> imprimir y `seen[c] = 1`. Luego recorremos `s2`: si `!seen[c]` -> imprimir y `seen[c] = 1`.',
    codigoSolucion: `int\tmain(int argc, char **argv)
{
\tint\tseen[256] = {0};
\tint\ti = 0;
\tint\tj = 0;

\tif (argc == 3)
\t{
\t\twhile (argv[1][i])
\t\t{
\t\t\tif (!seen[(unsigned char)argv[1][i]])
\t\t\t{
\t\t\t\twrite(1, &argv[1][i], 1);
\t\t\t\tseen[(unsigned char)argv[1][i]] = 1;
\t\t\t}
\t\t\ti++;
\t\t}
\t\twhile (argv[2][j])
\t\t{
\t\t\tif (!seen[(unsigned char)argv[2][j]])
\t\t\t{
\t\t\t\twrite(1, &argv[2][j], 1);
\t\t\t\tseen[(unsigned char)argv[2][j]] = 1;
\t\t\t}
\t\t\tj++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    porQue: 'La tabla `seen` persiste el estado entre `argv[1]` y `argv[2]`. No hay que reiniciar el array entre ambos bucles.',
    trampaMoulinette: 'Reiniciar `seen` a 0 antes de procesar `argv[2]`, provocando que caracteres comunes se vuelvan a imprimir.',
    origen: 'predefinida'
  },
  {
    id: 'l2-print_bits-operadores',
    exerciseId: 'print_bits',
    nivel: 2,
    categoria: 'sintaxis',
    titulo: 'print_bits: Desplazamiento a la derecha y máscara & 1',
    pregunta: '¿Cómo funciona la expresión `((octet >> i) & 1) + \'0\'` para imprimir los 8 bits de un byte de mayor a menor?',
    pista: 'Un bucle descendente desde el bit 7 (más significativo) hasta el bit 0 (menos significativo).',
    codigoReto: `void print_bits(unsigned char octet) {
    int i = 7;
    while (i >= 0) {
        // ¿Cómo aislar el bit i?
        i--;
    }
}`,
    respuesta: 'Desplazar `octet >> i` mueve el bit en la posición `i` a la posición 0 (bit menos significativo). Hacer `& 1` descarta todos los demás bits superiores, dejando exactamente 0 o 1. Sumar `+\'0\'` convierte el número numérico 0 o 1 en el carácter ASCII \'0\' o \'1\'.',
    codigoSolucion: `void\tprint_bits(unsigned char octet)
{
\tint\t\ti = 7;
\tchar\tc;

\twhile (i >= 0)
\t{
\t\tc = ((octet >> i) & 1) + '0';
\t\twrite(1, &c, 1);
\t\ti--;
\t}
}`,
    porQue: 'El bit más representativo de un byte es el bit 7 ($2^7 = 128$) y el menos es el bit 0 ($2^0 = 1$). Por eso el bucle empieza en 7 y baja hasta 0.',
    trampaMoulinette: 'Hacer el bucle de 0 a 7, lo que imprimiría los bits al revés (little-endian visual en vez del orden estándar).',
    origen: 'predefinida'
  },
  {
    id: 'l2-swap_bits-nibbles',
    exerciseId: 'swap_bits',
    nivel: 2,
    categoria: 'sintaxis',
    titulo: 'swap_bits: Intercambio de 4 bits (nibbles) en una línea',
    pregunta: '¿Cuál es la expresión bitwise de 1 sola línea para intercambiar los 4 bits altos por los 4 bits bajos de un octeto?',
    pista: 'Desplaza 4 a la derecha y combina con el desplazamiento de 4 a la izquierda.',
    codigoReto: `unsigned char swap_bits(unsigned char octet) {
    return (???);
}`,
    respuesta: 'La expresión es: `return ((octet >> 4) | (octet << 4));`. Al ser `unsigned char`, los bits desplazados a la derecha se rellenan con ceros y los desplazados a la izquierda también. El operador OR bit a bit `|` fusiona ambos medios bytes (nibbles).',
    codigoSolucion: `unsigned char\tswap_bits(unsigned char octet)
{
\treturn ((octet >> 4) | (octet << 4));
}`,
    porQue: 'Si octet es `1010 0011`: `octet >> 4` es `0000 1010` y `octet << 4` es `0011 0000`. Al aplicar OR `|` obtenemos `0011 1010`.',
    trampaMoulinette: 'Usar `char` en lugar de `unsigned char`. Si fuera signed char negativo, el desplazamiento a la derecha `>>` mantendría el bit de signo rellenando con unos (sign extension) corrompiendo el resultado.',
    origen: 'predefinida'
  },
  {
    id: 'l2-is_power_of_2-truco',
    exerciseId: 'is_power_of_2',
    nivel: 2,
    categoria: 'sintaxis',
    titulo: 'is_power_of_2: Truco binario n & (n - 1)',
    pregunta: '¿Por qué `(n > 0) && ((n & (n - 1)) == 0)` determina en O(1) si un número es potencia de 2?',
    pista: 'Una potencia de 2 en binario tiene exactamente UN bit encendido (ej: 8 = 1000). ¿Qué aspecto tiene n - 1?',
    codigoReto: `int is_power_of_2(unsigned int n) {
    // ¿Cómo comprobarlo sin bucle while?
}`,
    respuesta: 'Una potencia de 2 tiene exactamente un bit 1 seguido de ceros (ej: 8 = `1000_2`). Restar 1 invierte ese bit a 0 y pone todos los bits inferiores a 1 (ej: 7 = `0111_2`). Al hacer un AND bit a bit `n & (n - 1)`, no queda ningún bit coincidente dando 0.',
    codigoSolucion: `int\tis_power_of_2(unsigned int n)
{
\tif (n == 0)
\t\treturn (0);
\treturn ((n & (n - 1)) == 0);
}`,
    porQue: 'Cualquier número que no sea potencia de 2 tiene más de un bit encendido; al restar 1 sólo cambia desde el bit menos significativo, por lo que el AND retendrá los bits superiores y dará distinto de 0.',
    trampaMoulinette: 'Olvidar el caso especial `n == 0`. Para n = 0, `0 & -1` es 0, pero 0 NO es potencia de 2.',
    origen: 'predefinida'
  },

  // ─── NIVEL 3 ───
  {
    id: 'l3-ft_range-calculo',
    exerciseId: 'ft_range',
    nivel: 3,
    categoria: 'memoria_punteros',
    titulo: 'ft_range: Cálculo exacto de tamaño y malloc',
    pregunta: 'En ft_range(int start, int end), ¿cómo se calcula la cantidad de enteros a reservar y cómo se recorre cuando start > end o start <= end?',
    pista: 'Si start=0 y end=3, los valores son 0, 1, 2, 3 (4 elementos). Fórmula del tamaño: len = abs(end - start) + 1.',
    codigoReto: `int *ft_range(int start, int end) {
    int len;
    // ¿Cómo calcular len para start=5, end=3?
    // ¿Cómo asignar los valores en el array?
}`,
    respuesta: 'El tamaño es `int len = (start <= end) ? (end - start + 1) : (start - end + 1);`. Reservamos `malloc(len * sizeof(int))`. Luego un bucle `while (i < len)` asigna `res[i] = start;` y hace `start += (start <= end ? 1 : -1);`.',
    codigoSolucion: `int\t*ft_range(int start, int end)
{
\tint\t*res;
\tint\tlen;
\tint\ti = 0;

\tlen = (start <= end) ? (end - start + 1) : (start - end + 1);
\tres = malloc(len * sizeof(int));
\tif (!res)
\t\treturn (NULL);
\twhile (i < len)
\t{
\t\tres[i] = start;
\t\tif (start <= end)
\t\t\tstart++;
\t\telse
\t\t\tstart--;
\t\ti++;
\t}
\treturn (res);
}`,
    porQue: 'No olvidar comprobar `if (!res) return (NULL);` tras la llamada a malloc.',
    trampaMoulinette: 'Olvidar multiplicar por `sizeof(int)`. Escribir `malloc(len)` en vez de `malloc(len * sizeof(int))` reserva solo 1/4 de los bytes necesarios (en sistemas de 32/64 bits donde int = 4 bytes) causando heap corruption.',
    origen: 'predefinida'
  },
  {
    id: 'l3-ft_rrange-diferencia',
    exerciseId: 'ft_rrange',
    nivel: 3,
    categoria: 'memoria_punteros',
    titulo: 'ft_rrange: Sentido de llenado desde end hacia start',
    pregunta: '¿Cuál es la diferencia entre ft_range y ft_rrange y cuál es la forma más limpia de rellenarlo?',
    pista: 'ft_rrange(1, 3) devuelve [3, 2, 1]. Rellénalo empezando en end y avanzando hacia start.',
    codigoReto: `// ft_rrange empieza en 'end' y termina en 'start'`,
    respuesta: 'En ft_rrange, el primer elemento es `end` y el último es `start`. La longitud se calcula exactamente igual: `len = (start <= end) ? (end - start + 1) : (start - end + 1);`. El puntero actual se inicializa en `end` y se incrementa o decrementa hacia `start`.',
    codigoSolucion: `int\t*ft_rrange(int start, int end)
{
\tint\t*res;
\tint\tlen;
\tint\ti = 0;

\tlen = (start <= end) ? (end - start + 1) : (start - end + 1);
\tres = malloc(len * sizeof(int));
\tif (!res)
\t\treturn (NULL);
\twhile (i < len)
\t{
\t\tres[i] = end;
\t\tif (end <= start)
\t\t\tend++;
\t\telse
\t\t\tend--;
\t\ti++;
\t}
\treturn (res);
}`,
    porQue: 'Simplemente intercambiar el rol de start y end permite reutilizar la misma estructura lógica garantizando 0 errores de signo.',
    trampaMoulinette: 'Confundir el sentido y entregar `ft_range` en lugar de `ft_rrange`. Comprueba siempre: si te piden `(1, 3)`, el resultado debe comenzar por 3.',
    origen: 'predefinida'
  },
  {
    id: 'l3-add_prime_sum-is_prime',
    exerciseId: 'add_prime_sum',
    nivel: 3,
    categoria: 'resolucion',
    titulo: 'add_prime_sum: Función is_prime optimizada y límites',
    pregunta: '¿Por qué en is_prime(int n) basta con comprobar divisores hasta i * i <= n, y cuáles son los casos base?',
    pista: '0 y 1 NO son primos. 2 es el primer número primo.',
    codigoReto: `int is_prime(int n) {
    if (n <= 1) return (0);
    // ¿Hasta dónde debe iterar el bucle?
}`,
    respuesta: 'Los casos base son: si `n <= 1` devuelve 0 (ni 0 ni 1 ni negativos son primos). Para buscar divisores, basta con probar desde `i = 2` mientras `i * i <= n`. Si un número tuviera un divisor mayor que su raíz cuadrada, necesariamente tendría otro divisor menor que ya habría sido encontrado.',
    codigoSolucion: `int\tis_prime(int n)
{
\tint\ti = 2;

\tif (n <= 1)
\t\treturn (0);
\twhile (i * i <= n)
\t{
\t\tif (n % i == 0)
\t\t\treturn (0);
\t\ti++;
\t}
\treturn (1);
}`,
    porQue: 'Iterar hasta $\\sqrt{n}$ reduce la complejidad de $O(n)$ a $O(\\sqrt{n})$. Para números grandes como el límite de atoi, previene que Moulinette mate el proceso por Timeout (TLE).',
    trampaMoulinette: 'Considerar 1 como primo (1 NO es primo) o no controlar números negativos (debe imprimir 0\\n si el argumento es <= 0).',
    origen: 'predefinida'
  },
  {
    id: 'l3-ft_atoi_base-digitos',
    exerciseId: 'ft_atoi_base',
    nivel: 3,
    categoria: 'sintaxis',
    titulo: 'ft_atoi_base: Mapeo de caracteres hex/alfanuméricos a valor decimal',
    pregunta: '¿Cómo convertir un carácter que puede ser \'0\'-\'9\', \'a\'-\'f\' o \'A\'-\'F\' a su valor entero (0 a 15)?',
    pista: 'Crea una función auxiliar get_val(char c).',
    codigoReto: `int get_digit(char c) {
    if (c >= '0' && c <= '9') return (c - '0');
    if (c >= 'a' && c <= 'f') return (???);
    if (c >= 'A' && c <= 'F') return (???);
    return (-1);
}`,
    respuesta: 'Para \'a\'-\'f\': `c - \'a\' + 10`. Para \'A\'-\'F\': `c - \'A\' + 10`. Si el valor retornado es `>= base` o `< 0`, el carácter no es válido para esa base y el bucle termina.',
    codigoSolucion: `int\tget_val(char c)
{
\tif (c >= '0' && c <= '9')
\t\treturn (c - '0');
\tif (c >= 'a' && c <= 'f')
\t\treturn (c - 'a' + 10);
\tif (c >= 'A' && c <= 'F')
\t\treturn (c - 'A' + 10);
\treturn (-1);
}

int\tft_atoi_base(const char *str, int str_base)
{
\tint\tsign = 1;
\tint\tres = 0;
\tint\tdigit;

\tif (!str || str_base < 2 || str_base > 16)
\t\treturn (0);
\twhile (*str == ' ' || (*str >= 9 && *str <= 13))
\t\tstr++;
\tif (*str == '-' || *str == '+')
\t{
\t\tif (*str == '-')
\t\t\tsign = -1;
\t\tstr++;
\t}
\twhile ((digit = get_val(*str)) >= 0 && digit < str_base)
\t{
\t\tres = res * str_base + digit;
\t\tstr++;
\t}
\treturn (res * sign);
}`,
    porQue: 'En base 16, \'a\' vale 10. \'a\' (ASCII 97) - \'a\' (97) + 10 = 10. Si la base es 8 y el carácter es \'9\', `digit` es 9 pero `digit >= str_base` detiene el bucle correctamente.',
    trampaMoulinette: 'Olvidar comprobar que `digit < str_base`. En base 2 ("10201"), debe detenerse en el \'2\' y devolver 2 en decimal, no continuar.',
    origen: 'predefinida'
  },
  {
    id: 'l3-epur_str-espaciado',
    exerciseId: 'epur_str',
    nivel: 3,
    categoria: 'resolucion',
    titulo: 'epur_str: Salto de espacios y bandera de espacio intermedio',
    pregunta: '¿Cuál es la técnica más limpia para imprimir palabras separadas por exactamente 1 espacio sin imprimir espacios al inicio ni al final?',
    pista: 'Usa una bandera `int flag = 0;`. Al encontrar espacios entre palabras, pon `flag = 1`. Cuando empiece la siguiente palabra, si flag == 1, imprime un espacio y resetea flag a 0.',
    codigoReto: `// ¿Cómo evitar imprimir un espacio si tras la última palabra
// solo vienen espacios antes de '\\0'?`,
    respuesta: 'Saltas los espacios iniciales. Luego recorres: si encuentras espacio/tab, pones `flag = 1`. Si encuentras un carácter no-espacio: si `flag == 1`, imprimes \' \' y pones `flag = 0`; luego imprimes el carácter con write.',
    codigoSolucion: `int\tmain(int argc, char **argv)
{
\tint\ti = 0;
\tint\tflag = 0;

\tif (argc == 2)
\t{
\t\twhile (argv[1][i] == ' ' || argv[1][i] == '\\t')
\t\t\ti++;
\t\twhile (argv[1][i])
\t\t{
\t\t\tif (argv[1][i] == ' ' || argv[1][i] == '\\t')
\t\t\t\tflag = 1;
\t\t\telse
\t\t\t{
\t\t\t\tif (flag)
\t\t\t\t\twrite(1, " ", 1);
\t\t\t\tflag = 0;
\t\t\t\twrite(1, &argv[1][i], 1);
\t\t\t}
\t\t\ti++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
    porQue: 'Al diferir la impresión del espacio hasta que efectivamente aparece el primer carácter de la SIGUIENTE palabra, evitas imprimir espacios sobrantes al final de la cadena (trailing spaces).',
    trampaMoulinette: 'Imprimir un espacio inmediatamente después de cada palabra. Si la cadena terminaba en `"hola   "`, imprimirías `"hola "` con un trailing space que Moulinette detectará como KO.',
    origen: 'predefinida'
  },

  // ─── NIVEL 4 ───
  {
    id: 'l4-ft_split-dos_pasadas',
    exerciseId: 'ft_split',
    nivel: 4,
    categoria: 'resolucion',
    titulo: 'ft_split: Las 4 fases de la resolución',
    pregunta: '¿Cuáles son las 4 fases indispensables para implementar ft_split en C de forma infalible?',
    pista: '1) Contar palabras, 2) Malloc de punteros, 3) Extraer y copiar cada palabra, 4) Poner NULL final.',
    codigoReto: `char **ft_split(char *str) {
    // Fase 1: count_words(str)
    // Fase 2: malloc((count + 1) * sizeof(char*))
    // Fase 3: extraer cada palabra con malloc
    // Fase 4: res[count] = NULL;
}`,
    respuesta: 'Fase 1: Recorrer `str` para contar cuántas palabras hay (delimitadas por espacios/tabs/newlines). Fase 2: `malloc((words + 1) * sizeof(char *))` para el array de punteros. Fase 3: Para cada palabra, saltar espacios, medir la longitud `len`, reservar `malloc((len + 1) * sizeof(char))` y copiarla. Fase 4: Asignar `res[words] = NULL`.',
    codigoSolucion: `static int\tcount_words(char *str)
{
\tint\tcount = 0;
\tint\tin_word = 0;

\twhile (*str)
\t{
\t\tif (*str == ' ' || *str == '\\t' || *str == '\\n')
\t\t\tin_word = 0;
\t\telse if (!in_word)
\t\t{
\t\t\tin_word = 1;
\t\t\tcount++;
\t\t}
\t\tstr++;
\t}
\treturn (count);
}

char\t**ft_split(char *str)
{
\tint\t\twords = count_words(str);
\tchar\t**res = malloc((words + 1) * sizeof(char *));
\tint\t\ti = 0, j, len;

\tif (!res)
\t\treturn (NULL);
\twhile (*str)
\t{
\t\twhile (*str == ' ' || *str == '\\t' || *str == '\\n')
\t\t\tstr++;
\t\tif (*str)
\t\t{
\t\t\tlen = 0;
\t\t\twhile (str[len] && str[len] != ' ' && str[len] != '\\t' && str[len] != '\\n')
\t\t\t\tlen++;
\t\t\tres[i] = malloc((len + 1) * sizeof(char));
\t\t\tfor (j = 0; j < len; j++)
\t\t\t\tres[i][j] = str[j];
\t\t\tres[i][len] = '\\0';
\t\t\ti++;
\t\t\tstr += len;
\t\t}
\t}
\tres[i] = NULL;
\treturn (res);
}`,
    porQue: 'Al tener dos niveles de reserva dinámica (el array contenedor `char**` y cada palabra individual `char*`), es crucial poner `res[words] = NULL` para que quien itere el resultado sepa cuándo parar.',
    trampaMoulinette: 'Olvidar poner el terminador nulo `res[i][len] = \'\\0\'` en cada palabra o no reservar `+ 1` para el puntero NULL final en el array de punteros.',
    origen: 'predefinida'
  },
  {
    id: 'l4-ft_itoa-int_min',
    exerciseId: 'ft_itoa',
    nivel: 4,
    categoria: 'casos_limite',
    titulo: 'ft_itoa: El peligro de INT_MIN (-2147483648)',
    pregunta: '¿Por qué hacer `if (n < 0) n = -n;` en ft_itoa provoca un desbordamiento catastrófico con INT_MIN?',
    pista: 'En un int de 32 bits en complemento a 2, el rango va de -2147483648 a 2147483647.',
    codigoReto: `int n = -2147483648;
n = -n; // ¿Qué valor toma n en C?`,
    respuesta: 'El valor máximo positivo de un int de 32 bits es +2147483647. Al intentar negar -2147483648 se produce un undefined behavior (overflow) y en la mayoría de CPUs `n` sigue siendo negativo (-2147483648). La solución es usar un tipo más ancho como `long num = n;` antes de hacer `if (num < 0) num = -num;`.',
    codigoSolucion: `char\t*ft_itoa(int nbr)
{
\tlong\tn = nbr;
\tint\t\tlen = (n <= 0) ? 1 : 0;
\tlong\ttmp = n;
\tchar\t*res;

\tif (tmp < 0)
\t\ttmp = -tmp;
\twhile (tmp > 0)
\t{
\t\ttmp /= 10;
\t\tlen++;
\t}
\tres = malloc((len + 1) * sizeof(char));
\tif (!res)
\t\treturn (NULL);
\tres[len] = '\\0';
\tif (n == 0)
\t\tres[0] = '0';
\tif (n < 0)
\t{
\t\tres[0] = '-';
\t\tn = -n;
\t}
\twhile (n > 0)
\t{
\t\tres[--len] = (n % 10) + '0';
\t\tn /= 10;
\t}
\treturn (res);
}`,
    porQue: 'Casting a `long` absorbe el rango completo de int con 64 bits de amplitud sin riesgo alguno de desbordamiento.',
    trampaMoulinette: 'Escribir `if (nbr == -2147483648) return ft_strdup("-2147483648");` es un parche válido, pero olvidar el caso n = 0 dará strings vacíos si no inicializas `len = 1` cuando n <= 0.',
    origen: 'predefinida'
  },
  {
    id: 'l4-sort_list-swap_data',
    exerciseId: 'sort_list',
    nivel: 4,
    categoria: 'memoria_punteros',
    titulo: 'sort_list: Intercambiar datos vs reconectar punteros',
    pregunta: 'En sort_list(t_list *lst, int (*cmp)(int, int)), ¿por qué es 10 veces más fácil intercambiar lst->data que reconectar punteros lst->next?',
    pista: 'El subject solo pide que la lista quede ordenada, no que las direcciones de memoria de los nodos cambien.',
    codigoReto: `// Estructura oficial en list.h:
// typedef struct s_list {
//     int data;
//     struct s_list *next;
// } t_list;`,
    respuesta: 'Reconectar los punteros `next` requiere mantener referencias al nodo anterior (`prev`), cambiar 4 enlaces por swap y actualizar la cabeza de la lista si el primer nodo cambia. Intercambiar simplemente el entero `data` (`int tmp = a->data; a->data = b->data; b->data = tmp;`) preserva la estructura de la lista intacta y es 100% infalible.',
    codigoSolucion: `t_list\t*sort_list(t_list *lst, int (*cmp)(int, int))
{
\tint\t\ttmp;
\tt_list\t*start;

\tstart = lst;
\twhile (lst && lst->next)
\t{
\t\tif (!(*cmp)(lst->data, lst->next->data))
\t\t{
\t\t\ttmp = lst->data;
\t\t\tlst->data = lst->next->data;
\t\t\tlst->next->data = tmp;
\t\t\tlst = start; // Reiniciar al inicio tras un swap
\t\t}
\t\telse
\t\t\tlst = lst->next;
\t}
\treturn (start);
}`,
    porQue: 'El puntero a función `cmp(a, b)` devuelve 0 si no están en orden correcto. Al detectar que están desordenados, intercambias `data` y devuelves el cursor al principio (`lst = start`).',
    trampaMoulinette: 'Olvidar reiniciar `lst = start` después de un intercambio, provocando que elementos menores que flotan hacia atrás queden desordenados.',
    origen: 'predefinida'
  },
  {
    id: 'l4-fprime-factores',
    exerciseId: 'fprime',
    nivel: 4,
    categoria: 'resolucion',
    titulo: 'fprime: Descomposición factorial en números primos',
    pregunta: '¿Por qué no es necesario verificar si `factor` es primo en el algoritmo de fprime?',
    pista: 'Al dividir exhaustivamente por los factores menores (2, luego 3...), ¿puede quedar algún múltiplo compuesto cuando llegamos a 4, 6 u 8?',
    codigoReto: `int n = atoi(argv[1]);
int f = 2;
while (f <= n) {
    if (n % f == 0) {
        // Imprimir f
        // n /= f;
    } else f++;
}`,
    respuesta: 'No hace falta verificar si `f` es primo porque al empezar en 2 y extraer todos sus múltiplos (dividiendo sucesivamente `n /= f`), cuando `f` llega a 4, `n` ya no es divisible por 2 y por ende tampoco por 4. Matemáticamente sólo se imprimirán factores primos.',
    codigoSolucion: `int\tmain(int argc, char **argv)
{
\tint\tn;
\tint\tf = 2;

\tif (argc == 2)
\t{
\t\tn = atoi(argv[1]);
\t\tif (n == 1)
\t\t\tprintf("1");
\t\twhile (f <= n)
\t\t{
\t\t\tif (n % f == 0)
\t\t\t{
\t\t\t\tprintf("%d", f);
\t\t\t\tif (n != f)
\t\t\t\t\tprintf("*");
\t\t\t\tn /= f;
\t\t\t}
\t\t\telse
\t\t\t\tf++;
\t\t}
\t}
\tprintf("\\n");
\treturn (0);
}`,
    porQue: 'En fprime está PERMITIDO usar `printf` según el subject oficial. Aprovechar `printf("%d", f)` ahorra decenas de líneas de código manual.',
    trampaMoulinette: 'Olvidar el caso especial `n == 1` que debe imprimir `"1"` y no quedarse en blanco.',
    origen: 'predefinida'
  },
  {
    id: 'l4-flood_fill-condiciones',
    exerciseId: 'flood_fill',
    nivel: 4,
    categoria: 'resolucion',
    titulo: 'flood_fill: Condiciones de parada en la recursión DFS',
    pregunta: '¿Cuáles son las 3 condiciones de parada obligatorias dentro de la función recursiva fill()?',
    pista: 'Límites de la cuadrícula, color del píxel actual vs color objetivo, y ciclo infinito.',
    codigoReto: `void fill(char **tab, t_point size, t_point cur, char target) {
    // 1. ¿Fuera de límites?
    // 2. ¿Color diferente a target?
    // 3. ¿Píxel ya pintado con 'F'?
}`,
    respuesta: '1) Si `cur.x < 0 || cur.x >= size.x || cur.y < 0 || cur.y >= size.y` (fuera del mapa). 2) Si `tab[cur.y][cur.x] != target` (no es del color a rellenar o ya fue pintado con \'F\'). 3) En caso contrario: pintar `tab[cur.y][cur.x] = \'F\'` y llamar recursivamente a los 4 vecinos: arriba, abajo, izquierda y derecha.',
    codigoSolucion: `void\tfill(char **tab, t_point size, t_point cur, char target)
{
\tif (cur.x < 0 || cur.x >= size.x || cur.y < 0 || cur.y >= size.y)
\t\treturn ;
\tif (tab[cur.y][cur.x] != target)
\t\treturn ;

\ttab[cur.y][cur.x] = 'F';

\tfill(tab, size, (t_point){cur.x + 1, cur.y}, target);
\tfill(tab, size, (t_point){cur.x - 1, cur.y}, target);
\tfill(tab, size, (t_point){cur.x, cur.y + 1}, target);
\tfill(tab, size, (t_point){cur.x, cur.y - 1}, target);
}

void\tflood_fill(char **tab, t_point size, t_point begin)
{
\tchar\ttarget = tab[begin.y][begin.x];
\tfill(tab, size, begin, target);
}`,
    porQue: 'El orden de coordenadas: en un array bidimensional `char **tab`, la fila es `y` y la columna es `x`, es decir `tab[cur.y][cur.x]`. Confundir x e y produce Segfault inmediato al desbordar las filas.',
    trampaMoulinette: 'Escribir `tab[cur.x][cur.y]` en lugar de `tab[cur.y][cur.x]`. Es el error #1 de los estudiantes en flood_fill.',
    origen: 'predefinida'
  }
];
