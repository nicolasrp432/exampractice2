/**
 * Traductor y Catálogo Oficial de Subjects en Español para 42 Rank 02
 * Permite visualizar cualquier subject en español con precisión técnica y terminología oficial de 42.
 */

// Catálogo de traducciones detalladas en español por ID de ejercicio
export const SUBJECTS_ES = {
  // === NIVEL 1 ===
  first_word: `Nombre del ejercicio: first_word
Archivos esperados : first_word.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome un string y muestre su primera palabra, seguida
de un salto de línea.

Una palabra es una sección de la cadena delimitada por espacios, tabuladores ('\\t')
o por el inicio/fin de la cadena.

Si el número de parámetros no es 1, o si no hay palabras en la cadena, muestra
únicamente un salto de línea.

Ejemplos:
$> ./first_word "FOR PONY" | cat -e
FOR$
$> ./first_word "this        ...    is sparta, then again, maybe    not" | cat -e
this$
$> ./first_word "   " | cat -e
$
$> ./first_word "a" "b" | cat -e
$
$> ./first_word "  lorem,ipsum  " | cat -e
lorem,ipsum$
$>`,

  fizzbuzz: `Nombre del ejercicio: fizzbuzz
Archivos esperados : fizzbuzz.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que imprima los números del 1 al 100, cada uno seguido de
un salto de línea.

- Si el número es múltiplo de 3, imprime "fizz" en su lugar.
- Si el número es múltiplo de 5, imprime "buzz" en su lugar.
- Si el número es múltiplo tanto de 3 como de 5, imprime "fizzbuzz" en su lugar.

Ejemplo de salida:
$> ./fizzbuzz
1
2
fizz
4
buzz
fizz
7
8
fizz
buzz
11
fizz
13
14
fizzbuzz
[...]
97
98
fizz
buzz
$>`,

  ft_putstr: `Nombre del ejercicio: ft_putstr
Archivos esperados : ft_putstr.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe una función que muestre una cadena de caracteres en la salida estándar (stdout).

El puntero pasado a la función contiene la dirección del primer carácter de la cadena.

Tu función debe declararse de la siguiente manera:
void	ft_putstr(char *str);`,

  ft_strcpy: `Nombre del ejercicio: ft_strcpy
Archivos esperados : ft_strcpy.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Reproduce el comportamiento de la función strcpy (man strcpy).

Tu función debe declararse de la siguiente manera:
char    *ft_strcpy(char *s1, const char *s2);`,

  ft_strlen: `Nombre del ejercicio: ft_strlen
Archivos esperados : ft_strlen.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que cuente el número de caracteres en una cadena y lo retorne.

Tu función debe declararse de la siguiente manera:
int	ft_strlen(char *str);`,

  ft_swap: `Nombre del ejercicio: ft_swap
Archivos esperados : ft_swap.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que intercambie el contenido de dos enteros cuyas direcciones
se pasan como parámetros.

Tu función debe declararse de la siguiente manera:
void	ft_swap(int *a, int *b);`,

  repeat_alpha: `Nombre del ejercicio: repeat_alpha
Archivos esperados : repeat_alpha.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa llamado repeat_alpha que tome una cadena de caracteres y la
muestre repitiendo cada carácter alfabético tantas veces como su índice alfabético:
'a' se convierte en 'a', 'b' en 'bb', 'e' en 'eeeee', etc.

Las mayúsculas y minúsculas mantienen su caso ('A' -> 'A', 'B' -> 'BB').
Los caracteres no alfabéticos permanecen inalterados.

Si el número de argumentos no es 1, simplemente muestra un salto de línea.

Ejemplos:
$> ./repeat_alpha "abc"
abbccc
$> ./repeat_alpha "Alex."
Alllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx.
$> ./repeat_alpha "ab c"
abb c
$> ./repeat_alpha "" | cat -e
$
$> ./repeat_alpha | cat -e
$`,

  rev_print: `Nombre del ejercicio: rev_print
Archivos esperados : rev_print.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena y muestre dicha cadena en orden inverso,
seguida de un salto de línea.

Si el número de parámetros no es 1, el programa muestra únicamente un salto de línea.

Ejemplos:
$> ./rev_print "zaz" | cat -e
zaz$
$> ./rev_print "dub0 a POIL" | cat -e
LIOP a 0bud$
$> ./rev_print | cat -e
$`,

  rot_13: `Nombre del ejercicio: rot_13
Archivos esperados : rot_13.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena y la muestre habiendo reemplazado cada una
de sus letras por la letra 13 posiciones más adelante en el alfabeto.

'z' se convierte en 'm' y 'Z' se convierte en 'M'. Las mayúsculas y minúsculas
se preservan intactas.

La salida debe terminar con un salto de línea.

Si el número de argumentos no es 1, el programa muestra un salto de línea.

Ejemplos:
$> ./rot_13 "abc"
nop
$> ./rot_13 "My horse is Amazing." | cat -e
Zl ubefr vf Nznmvat.$
$> ./rot_13 "AkjhZ zLKIJnbest frontend" | cat -e
NxwuM mYXVWnaorfg sebagraq$
$> ./rot_13 | cat -e
$`,

  rotone: `Nombre del ejercicio: rotone
Archivos esperados : rotone.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena y la muestre habiendo reemplazado cada una
de sus letras por la siguiente en el alfabeto.

'z' se convierte en 'a' y 'Z' se convierte en 'A'. Las mayúsculas y minúsculas
se preservan intactas.

La salida debe terminar con un salto de línea.

Si el número de argumentos no es 1, el programa muestra un salto de línea.

Ejemplos:
$> ./rotone "abc"
bcd
$> ./rotone "Les stagiaires du staff ne sentent pas tres bon." | cat -e
Mft tubhjbjsft ev tubgg of tfoufou qbt usft cpo.$
$> ./rotone "AkjhZ zLKIJnbest frontend" | cat -e
BlkiA aMLJKocftu gspoufoe$
$> ./rotone | cat -e
$`,

  search_and_replace: `Nombre del ejercicio: search_and_replace
Archivos esperados : search_and_replace.c
Funciones autorizadas: write, exit
--------------------------------------------------------------------------------

Escribe un programa llamado search_and_replace que tome 3 argumentos:
- El primer argumento es una cadena en la que se reemplazarán letras.
- El segundo argumento es la letra a ser reemplazada (debe ser un único carácter).
- El tercer argumento es la letra de reemplazo (debe ser un único carácter).

Si el número de argumentos no es 3, el programa simplemente muestra un salto de línea.

Si el segundo o tercer argumento no contienen exactamente un carácter, muestra
un salto de línea.

Ejemplos:
$> ./search_and_replace "Papache est un saboteur" "a" "o"
Popoche est un soboteur
$> ./search_and_replace "zaz" "r" "u"
zaz
$> ./search_and_replace "uncfindable" "d" "d"
uncfindable
$> ./search_and_replace | cat -e
$`,

  ulstr: `Nombre del ejercicio: ulstr
Archivos esperados : ulstr.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena y cambie las mayúsculas por minúsculas
y las minúsculas por mayúsculas. Los demás caracteres quedan intactos.

Debes mostrar el resultado seguido de un salto de línea.

Si el número de argumentos no es 1, el programa simplemente muestra un salto de línea.

Ejemplos:
$> ./ulstr "L'eSPrit nE peUt plUs pRogResSer s'Il sE coNTeNte dE CoP构建" | cat -e
l'EspRIT Ne PEuT PLuS PrOGrESsER S'iL Se COntEntE De cOp构建$
$> ./ulstr "S'en TOUCHE pas L'AUtAut" | cat -e
s'EN touche PAS l'auTaut$
$> ./ulstr | cat -e
$`,

  // === NIVEL 2 ===
  alpha_mirror: `Nombre del ejercicio: alpha_mirror
Archivos esperados : alpha_mirror.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa llamado alpha_mirror que tome una cadena y muestre dicha cadena
después de reemplazar cada carácter alfabético por su opuesto simétrico en el alfabeto.

'a' se convierte en 'z', 'Z' se convierte en 'A', 'b' en 'y', 'Y' en 'B', etc.
Las mayúsculas y minúsculas conservan su estado original.

Si el número de argumentos no es 1, muestra únicamente un salto de línea.

Ejemplos:
$> ./alpha_mirror "abc"
zyx
$> ./alpha_mirror "My horse is Amazing." | cat -e
Nb slihv rh Znzarmt.$
$> ./alpha_mirror | cat -e
$`,

  camel_to_snake: `Nombre del ejercicio: camel_to_snake
Archivos esperados : camel_to_snake.c
Funciones autorizadas: write, malloc, free
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena en formato lowerCamelCase y la convierta
a formato snake_case.

Una palabra en lowerCamelCase comienza en minúscula y cada palabra sucesiva empieza
con mayúscula. En snake_case, las palabras se separan por un guion bajo ('_') y todas
las letras son minúsculas.

Si el número de parámetros no es 1, simplemente muestra un salto de línea.

Ejemplos:
$> ./camel_to_snake "hereIsACamelCaseWord"
here_is_a_camel_case_word
$> ./camel_to_snake "helloWorld" | cat -e
hello_world$
$> ./camel_to_snake | cat -e
$`,

  do_op: `Nombre del ejercicio: do_op
Archivos esperados : do_op.c
Funciones autorizadas: atoi, printf, write
--------------------------------------------------------------------------------

Escribe un programa que tome tres cadenas:
- La primera y la tercera son representaciones de enteros con signo en base 10.
- La segunda es un operador aritmético entre: +, -, *, /, %

El programa debe calcular el resultado de la operación aritmética y mostrarlo
seguido de un salto de línea.

Si el número de argumentos no es 3, el programa muestra un salto de línea.

Ejemplos:
$> ./do_op "123" "*" "456" | cat -e
56088$
$> ./do_op "-982" "/" "-77" | cat -e
12$
$> ./do_op "1" "+" "-43" | cat -e
-42$
$> ./do_op | cat -e
$`,

  ft_atoi: `Nombre del ejercicio: ft_atoi
Archivos esperados : ft_atoi.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que convierta la porción inicial de una cadena a entero (int).

Tu función debe comportarse exactamente igual que la función estándar atoi (man atoi).

Tu función debe declararse de la siguiente manera:
int	ft_atoi(const char *str);`,

  ft_strcmp: `Nombre del ejercicio: ft_strcmp
Archivos esperados : ft_strcmp.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Reproduce el comportamiento de la función strcmp (man strcmp).

Tu función debe declararse de la siguiente manera:
int    ft_strcmp(char *s1, char *s2);`,

  ft_strcspn: `Nombre del ejercicio: ft_strcspn
Archivos esperados : ft_strcspn.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Reproduce exactamente el comportamiento de la función strcspn (man strcspn).

La función strcspn() calcula la longitud del segmento inicial de s compuesto enteramente
por caracteres que NO están en reject.

Tu función debe declararse de la siguiente manera:
size_t	ft_strcspn(const char *s, const char *reject);`,

  ft_strdup: `Nombre del ejercicio: ft_strdup
Archivos esperados : ft_strdup.c
Funciones autorizadas: malloc
--------------------------------------------------------------------------------

Reproduce el comportamiento de la función strdup (man strdup).

Tu función debe declararse de la siguiente manera:
char    *ft_strdup(char *src);`,

  ft_strpbrk: `Nombre del ejercicio: ft_strpbrk
Archivos esperados : ft_strpbrk.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Reproduce el comportamiento de la función strpbrk (man strpbrk).

La función strpbrk() localiza la primera aparición en la cadena s de cualquiera
de los caracteres en la cadena accept.

Tu función debe declararse de la siguiente manera:
char	*ft_strpbrk(const char *s1, const char *s2);`,

  ft_strrev: `Nombre del ejercicio: ft_strrev
Archivos esperados : ft_strrev.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que invierta una cadena in-place (sobre sí misma) y retorne
un puntero a dicha cadena invertida.

Tu función debe declararse de la siguiente manera:
char    *ft_strrev(char *str);`,

  inter: `Nombre del ejercicio: inter
Archivos esperados : inter.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome dos cadenas y muestre, sin duplicados, los caracteres
que aparecen en ambas cadenas, en el orden en que aparecen en la primera cadena.

La salida debe terminar con un salto de línea.

Si el número de argumentos no es 2, el programa muestra un salto de línea.

Ejemplos:
$> ./inter "padinton" "paqefwtdjetyiytjneytjoeyjnejeyj" | cat -e
padinto$
$> ./inter "ddf6vewg64f" "gtwthgdwthdwfteewhrtag6h4ffdhsd" | cat -e
df6vewg4$
$> ./inter "rien" "cette phrase ne cache rien" | cat -e
rien$
$> ./inter | cat -e
$`,

  is_power_of_2: `Nombre del ejercicio: is_power_of_2
Archivos esperados : is_power_of_2.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que determine si un número entero positivo dado es una potencia
de 2.

Esta función devuelve 1 si el entero dado es una potencia de 2, de lo contrario devuelve 0.

Tu función debe declararse de la siguiente manera:
int	    is_power_of_2(unsigned int n);`,

  last_word: `Nombre del ejercicio: last_word
Archivos esperados : last_word.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena y muestre su última palabra, seguida de
un salto de línea.

Una palabra es una sección de la cadena delimitada por espacios/tabuladores o por
el inicio/fin de la cadena.

Si el número de parámetros no es 1, o si no hay palabras en la cadena, muestra
únicamente un salto de línea.

Ejemplos:
$> ./last_word "FOR PONY" | cat -e
PONY$
$> ./last_word "this        ...    is sparta, then again, maybe    not" | cat -e
not$
$> ./last_word "   " | cat -e
$
$> ./last_word "a" "b" | cat -e
$
$> ./last_word "  lorem,ipsum  " | cat -e
lorem,ipsum$
$>`,

  max: `Nombre del ejercicio: max
Archivos esperados : max.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe la siguiente función:
int		max(int* tab, unsigned int len);

El primer parámetro es un array de enteros, y el segundo es el número de elementos
en el array.

La función retorna el mayor entero encontrado en el array.
Si el array está vacío (len == 0) o el puntero es NULL, la función retorna 0.`,

  print_bits: `Nombre del ejercicio: print_bits
Archivos esperados : print_bits.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe una función que tome un byte (unsigned char) y lo imprima en binario
(8 dígitos: '0' y '1'), desde el bit más significativo (MSB) al menos significativo (LSB).

Tu función debe declararse de la siguiente manera:
void	print_bits(unsigned char octet);

Ejemplo: con 2 (00000010) imprime "00000010".`,

  reverse_bits: `Nombre del ejercicio: reverse_bits
Archivos esperados : reverse_bits.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que tome un byte (unsigned char), invierta el orden de sus bits
(bit 0 pasa a bit 7, bit 1 a bit 6, etc.) y retorne el byte resultante.

Tu función debe declararse de la siguiente manera:
unsigned char	reverse_bits(unsigned char octet);

Ejemplo:
  1 byte
  _____________
  0010  0110
	||
	\\/
  0110  0100`,

  snake_to_camel: `Nombre del ejercicio: snake_to_camel
Archivos esperados : snake_to_camel.c
Funciones autorizadas: write, malloc, free
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena en formato snake_case y la convierta a
lowerCamelCase.

En snake_case, las palabras se separan por un guion bajo ('_'). En lowerCamelCase,
los guiones bajos se eliminan y la letra inicial de cada palabra sucesiva pasa a
mayúscula.

Si el número de parámetros no es 1, muestra un salto de línea.

Ejemplos:
$> ./snake_to_camel "here_is_a_snake_case_word"
hereIsASnakeCaseWord
$> ./snake_to_camel "hello_world" | cat -e
helloWorld$
$> ./snake_to_camel | cat -e
$`,

  swap_bits: `Nombre del ejercicio: swap_bits
Archivos esperados : swap_bits.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que tome un byte (unsigned char), intercambie sus dos mitades
(los 4 bits más significativos por los 4 bits menos significativos) y devuelva el resultado.

Tu función debe declararse de la siguiente manera:
unsigned char	swap_bits(unsigned char octet);

Ejemplo:
  1 byte
  _____________
  0100 | 0001
      \\ /
      / \\
  0001 | 0100`,

  union: `Nombre del ejercicio: union
Archivos esperados : union.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa llamado union que tome dos cadenas y muestre, sin duplicados,
los caracteres que aparecen en cualquiera de las dos cadenas.

La visualización debe respetar el orden de aparición en la línea de comandos
(primero los caracteres de s1, luego los de s2).

La salida debe terminar con un salto de línea.

Si el número de argumentos no es 2, el programa simplemente muestra un salto de línea.

Ejemplos:
$> ./union "zpadinton" "paqefwtdjetyiytjneytjoeyjnejeyj" | cat -e
zpadintoqefwjy$
$> ./union "ddf6vewg64f" "gtwthgdwthdwfteewhrtag6h4ffdhsd" | cat -e
df6vewg4thras$
$> ./union "rien" "cette phrase ne cache rien" | cat -e
rienct phas$
$> ./union | cat -e
$`,

  wdmatch: `Nombre del ejercicio: wdmatch
Archivos esperados : wdmatch.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome dos cadenas y verifique si la primera cadena puede
escribirse con los caracteres de la segunda cadena respetando el orden original.

Si es posible, el programa muestra la primera cadena seguida de un salto de línea.
De lo contrario, simplemente muestra un salto de línea.

Si el número de argumentos no es 2, el programa muestra un salto de línea.

Ejemplos:
$> ./wdmatch "faya" "fgvvfdAlphabet_ahdp传" | cat -e
$
$> ./wdmatch "faya" "fgvvfdAlphabet_ahdpfaya" | cat -e
faya$
$> ./wdmatch "quarante deux" "qfuShared anrtee        deux" | cat -e
quarante deux$
$> ./wdmatch | cat -e
$`,

  // === NIVEL 3 ===
  add_prime_sum: `Nombre del ejercicio: add_prime_sum
Archivos esperados : add_prime_sum.c
Funciones autorizadas: exit, write
--------------------------------------------------------------------------------

Escribe un programa que tome un entero positivo como argumento y muestre la suma
de todos los números primos menores o iguales a dicho entero, seguido de un salto de línea.

Si el número de argumentos no es 1, o si el argumento no es un entero positivo,
muestra un "0" seguido de un salto de línea.

Ejemplos:
$> ./add_prime_sum 5
10
$> ./add_prime_sum 7
17
$> ./add_prime_sum | cat -e
0$`,

  epur_str: `Nombre del ejercicio: epur_str
Archivos esperados : epur_str.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena y la muestre con exactamente un espacio
entre palabras, sin espacios ni tabuladores al principio ni al final.

Una palabra es una sección de cadena delimitada por espacios/tabuladores o por el inicio/fin.

Si el número de argumentos no es 1, o si no hay palabras, simplemente muestra un salto de línea.

Ejemplos:
$> ./epur_str "See? It's easy to print the same thing" | cat -e
See? It's easy to print the same thing$
$> ./epur_str " this        time it      will     be    more complex  . " | cat -e
this time it will be more complex .$
$> ./epur_str | cat -e
$`,

  expand_str: `Nombre del ejercicio: expand_str
Archivos esperados : expand_str.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena y la muestre con exactamente tres espacios
entre cada palabra, sin espacios ni tabuladores al principio ni al final.

Si el número de argumentos no es 1, o si no hay palabras, muestra un salto de línea.

Ejemplos:
$> ./expand_str "See? It's easy to print the same thing" | cat -e
See?   It's   easy   to   print   the   same   thing$
$> ./expand_str " this        time it      will     be    more complex  . " | cat -e
this   time   it   will   be   more   complex   .$
$> ./expand_str | cat -e
$`,

  ft_atoi_base: `Nombre del ejercicio: ft_atoi_base
Archivos esperados : ft_atoi_base.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que convierta la cadena str (representada en base str_base,
donde 2 <= str_base <= 16) a su valor entero equivalente en base 10.

Los dígitos válidos van de 0 a 9 y de 'a'/'A' a 'f'/'F'.
Maneja espacios iniciales y el signo opcional '+' o '-'.

Tu función debe declararse de la siguiente manera:
int	ft_atoi_base(const char *str, int str_base);`,

  ft_list_size: `Nombre del ejercicio: ft_list_size
Archivos esperados : ft_list_size.c, ft_list.h
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que retorne el número de elementos en la lista enlazada pasada
como parámetro.

Tu función debe declararse de la siguiente manera:
int	ft_list_size(t_list *begin_list);

Utilizando la estructura:
typedef struct    s_list
{
    struct s_list *next;
    void          *data;
}                 t_list;`,

  ft_range: `Nombre del ejercicio: ft_range
Archivos esperados : ft_range.c
Funciones autorizadas: malloc
--------------------------------------------------------------------------------

Escribe la siguiente función:
int     *ft_range(int start, int end);

Debe asignar (con malloc()) un array de enteros conteniendo todos los valores
consecutivos entre start y end (ambos inclusive), en orden secuencial.

Si start = 1 y end = 3, retorna [1, 2, 3].
Si start = 3 y end = 1, retorna [3, 2, 1].`,

  ft_rrange: `Nombre del ejercicio: ft_rrange
Archivos esperados : ft_rrange.c
Funciones autorizadas: malloc
--------------------------------------------------------------------------------

Escribe la siguiente función:
int     *ft_rrange(int start, int end);

Debe asignar (con malloc()) un array de enteros conteniendo todos los valores
consecutivos entre start y end (ambos inclusive), pero en orden inverso (comenzando
en end y terminando en start).

Si start = 1 y end = 3, retorna [3, 2, 1].
Si start = 3 y end = 1, retorna [1, 2, 3].`,

  hidenp: `Nombre del ejercicio: hidenp
Archivos esperados : hidenp.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome dos cadenas y verifique si la primera cadena está
oculta dentro de la segunda (es decir, si sus caracteres aparecen en s2 en el mismo orden).

Si s1 está contenida en s2, muestra "1" seguido de un salto de línea.
De lo contrario, muestra "0" seguido de un salto de línea.

Si el número de argumentos no es 2, el programa simplemente muestra un salto de línea.

Ejemplos:
$> ./hidenp "fgex.;" "tyf34gdgf;'ektufjhgdg.;" | cat -e
1$
$> ./hidenp "abc" "2altrb53c.sse" | cat -e
1$
$> ./hidenp "abc" "btarc" | cat -e
0$`,

  lcm: `Nombre del ejercicio: lcm
Archivos esperados : lcm.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que tome dos enteros sin signo (unsigned int) y calcule su
Mínimo Común Múltiplo (MCM / LCM).

Si alguno de los dos números es 0, la función debe retornar 0.

Tu función debe declararse de la siguiente manera:
unsigned int    lcm(unsigned int a, unsigned int b);`,

  paramsum: `Nombre del ejercicio: paramsum
Archivos esperados : paramsum.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que muestre el número de argumentos pasados en la línea de comandos,
seguido de un salto de línea.

Si no se pasa ningún argumento, muestra 0 seguido de un salto de línea.

Ejemplos:
$> ./paramsum 1 2 3 5 7 24
6
$> ./paramsum
0
$>`,

  pgcd: `Nombre del ejercicio: pgcd
Archivos esperados : pgcd.c
Funciones autorizadas: atoi, printf, write, malloc, free
--------------------------------------------------------------------------------

Escribe un programa que tome dos cadenas que representen enteros positivos estrictos
y muestre su Máximo Común Divisor (MCD / PGCD), seguido de un salto de línea.

Si el número de parámetros no es 2, el programa muestra un salto de línea.

Ejemplos:
$> ./pgcd 42 10 | cat -e
2$
$> ./pgcd 14 77 | cat -e
7$
$> ./pgcd 17 3 | cat -e
1$`,

  print_hex: `Nombre del ejercicio: print_hex
Archivos esperados : print_hex.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome un entero positivo en base 10 (como string) y lo
muestre en hexadecimal (letras minúsculas 'a'..'f'), seguido de un salto de línea.

Si el número de parámetros no es 1, muestra únicamente un salto de línea.

Ejemplos:
$> ./print_hex "10" | cat -e
a$
$> ./print_hex "255" | cat -e
ff$
$> ./print_hex "0" | cat -e
0$`,

  rstr_capitalizer: `Nombre del ejercicio: rstr_capitalizer
Archivos esperados : rstr_capitalizer.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una o más cadenas y, para cada argumento, convierta
la última letra de cada palabra a mayúscula y el resto a minúsculas, mostrando el
resultado seguido de un salto de línea.

Una palabra es una sección delimitada por espacios/tabuladores o inicio/fin.

Si no hay argumentos, el programa muestra un salto de línea.

Ejemplos:
$> ./rstr_capitalizer "Premier texte contenant plusieurs mots" | cat -e
premieR textE contenanT plusieurS motS$
$> ./rstr_capitalizer | cat -e
$`,

  str_capitalizer: `Nombre del ejercicio: str_capitalizer
Archivos esperados : str_capitalizer.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome una o más cadenas y, para cada argumento, convierta
la primera letra de cada palabra a mayúscula y el resto a minúsculas, mostrando el
resultado seguido de un salto de línea.

Si no hay argumentos, el programa muestra un salto de línea.

Ejemplos:
$> ./str_capitalizer "Premier texte contenant plusieurs mots" | cat -e
Premier Texte Contenant Plusieurs Mots$
$> ./str_capitalizer | cat -e
$`,

  tab_mult: `Nombre del ejercicio: tab_mult
Archivos esperados : tab_mult.c
Funciones autorizadas: write
--------------------------------------------------------------------------------

Escribe un programa que tome un entero positivo en string y muestre su tabla de
multiplicar del 1 al 9, con el formato: "1 x n = resultado\\n", ..., "9 x n = resultado\\n".

Si no hay parámetros, muestra un salto de línea.

Ejemplos:
$> ./tab_mult "9"
1 x 9 = 9
2 x 9 = 18
3 x 9 = 27
4 x 9 = 36
5 x 9 = 45
6 x 9 = 54
7 x 9 = 63
8 x 9 = 72
9 x 9 = 81
$>`,

  // === NIVEL 4 ===
  flood_fill: `Nombre del ejercicio: flood_fill
Archivos esperados : flood_fill.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que tome una matriz 2D de caracteres (t_point size, t_point begin)
y rellene con el carácter 'F' la zona contigua conectada del mismo carácter inicial
que comienza en begin.

Tu función debe declararse de la siguiente manera:
void  flood_fill(char **tab, t_point size, t_point begin);

Utilizando la estructura:
typedef struct  s_point
{
    int           x;
    int           y;
}               t_point;`,

  fprime: `Nombre del ejercicio: fprime
Archivos esperados : fprime.c
Funciones autorizadas: printf, atoi
--------------------------------------------------------------------------------

Escribe un programa que tome un entero positivo y muestre su descomposición en
factores primos en orden ascendente, separados por '*'.

Si el número de argumentos no es 1, muestra un salto de línea.

Ejemplos:
$> ./fprime 225225 | cat -e
3*3*5*5*7*11*13$
$> ./fprime 8333325 | cat -e
3*3*5*5*7*11*13*37$
$> ./fprime 42 | cat -e
2*3*7$
$> ./fprime 1 | cat -e
1$`,

  ft_itoa: `Nombre del ejercicio: ft_itoa
Archivos esperados : ft_itoa.c
Funciones autorizadas: malloc
--------------------------------------------------------------------------------

Escribe una función que tome un entero (int) y lo convierta a una cadena de caracteres
terminada en nulo ('\\0'), asignando la memoria necesaria con malloc().

Maneja números negativos y el caso de INT_MIN (-2147483648).

Tu función debe declararse de la siguiente manera:
char	*ft_itoa(int nbr);`,

  ft_list_foreach: `Nombre del ejercicio: ft_list_foreach
Archivos esperados : ft_list_foreach.c, ft_list.h
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe una función que aplique la función (*f)(data) a los datos de cada elemento
de la lista enlazada begin_list.

Tu función debe declararse de la siguiente manera:
void    ft_list_foreach(t_list *begin_list, void (*f)(void *));`,

  ft_list_remove_if: `Nombre del ejercicio: ft_list_remove_if
Archivos esperados : ft_list_remove_if.c, ft_list.h
Funciones autorizadas: free
--------------------------------------------------------------------------------

Escribe una función que elimine de la lista enlazada **begin_list todos los elementos
cuyo data satisfaga (*cmp)(list_ptr->data, data_ref) == 0.

Libera la memoria del nodo con free().

Tu función debe declararse de la siguiente manera:
void ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)());`,

  ft_split: `Nombre del ejercicio: ft_split
Archivos esperados : ft_split.c
Funciones autorizadas: malloc
--------------------------------------------------------------------------------

Escribe una función que tome una cadena, la divida en palabras (delimitadas por
espacios, tabuladores o saltos de línea) y retorne un array de cadenas terminado
en NULL con las palabras.

Tu función debe declararse de la siguiente manera:
char    **ft_split(char *str);`,

  rev_wstr: `Nombre del ejercicio: rev_wstr
Archivos esperados : rev_wstr.c
Funciones autorizadas: write, malloc, free
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena como parámetro e imprima sus palabras en
orden inverso, separadas por un único espacio.

Una palabra es una sección delimitada por espacios/tabuladores.

Si el número de parámetros no es 1, el programa muestra un salto de línea.

Ejemplos:
$> ./rev_wstr "You hate people! But I love gatherings. Isn't it ironic?" | cat -e
ironic? it Isn't gatherings. love I But people! hate You$
$> ./rev_wstr "abcdefghijklm" | cat -e
abcdefghijklm$
$> ./rev_wstr | cat -e
$`,

  rostring: `Nombre del ejercicio: rostring
Archivos esperados : rostring.c
Funciones autorizadas: write, malloc, free
--------------------------------------------------------------------------------

Escribe un programa que tome una cadena y muestre sus palabras rotadas hacia la
izquierda: la primera palabra pasa a ser la última palabra.

Las palabras se separan por exactamente un espacio, sin espacios al inicio ni al final.

Si el número de parámetros no es al menos 1, muestra un salto de línea.

Ejemplos:
$> ./rostring "abc   " | cat -e
abc$
$> ./rostring "Que la      lumiere soit et la lumiere fut" | cat -e
la lumiere soit et la lumiere fut Que$
$> ./rostring | cat -e
$`,

  sort_int_tab: `Nombre del ejercicio: sort_int_tab
Archivos esperados : sort_int_tab.c
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe la siguiente función:
void sort_int_tab(int *tab, unsigned int size);

Debe ordenar in-place (sobre el mismo array) el array de enteros tab de menor a
mayor (orden ascendente). El parámetro size indica la cantidad de elementos.`,

  sort_list: `Nombre del ejercicio: sort_list
Archivos esperados : sort_list.c, list.h
Funciones autorizadas: ninguna
--------------------------------------------------------------------------------

Escribe la siguiente función:
t_list	*sort_list(t_list* lst, int (*cmp)(int, int));

Esta función debe ordenar la lista dada como parámetro utilizando la función puntero
cmp para determinar el orden de dos elementos. Debe devolver el puntero al inicio
de la lista ordenada.`
};

/**
 * Traduce de forma sintética un subject en inglés estándar de 42 al español
 */
export function translate42SubjectToSpanish(englishText, exerciseName = '') {
  if (!englishText) return '';

  let es = englishText;

  // Reemplazar encabezados comunes
  es = es.replace(/Assignment name\s*:\s*(\S+)/gi, 'Nombre del ejercicio: $1');
  es = es.replace(/Expected files\s*:\s*(.+)/gi, 'Archivos esperados : $1');
  es = es.replace(/Allowed functions\s*:\s*(.+)/gi, 'Funciones autorizadas: $1');
  es = es.replace(/Write a program that takes a string/gi, 'Escribe un programa que tome una cadena');
  es = es.replace(/Write a program that takes three strings/gi, 'Escribe un programa que tome tres cadenas');
  es = es.replace(/Write a program that takes two strings/gi, 'Escribe un programa que tome dos cadenas');
  es = es.replace(/Write a program that takes/gi, 'Escribe un programa que tome');
  es = es.replace(/Write a program that/gi, 'Escribe un programa que');
  es = es.replace(/Write a function that/gi, 'Escribe una función que');
  es = es.replace(/Your function must be declared as follows\s*:/gi, 'Tu función debe declararse de la siguiente manera:');
  es = es.replace(/Your function must be declared as follows/gi, 'Tu función debe declararse de la siguiente manera:');
  es = es.replace(/Reproduce the behavior of the function/gi, 'Reproduce el comportamiento de la función');
  es = es.replace(/and displays its first word, followed by a newline/gi, 'y muestre su primera palabra, seguida de un salto de línea');
  es = es.replace(/and displays its last word, followed by a newline/gi, 'y muestre su última palabra, seguida de un salto de línea');
  es = es.replace(/followed by a newline/gi, 'seguido de un salto de línea');
  es = es.replace(/display only a newline/gi, 'muestra únicamente un salto de línea');
  es = es.replace(/simply display a newline/gi, 'muestra únicamente un salto de línea');
  es = es.replace(/If the number of parameters is not 1/gi, 'Si el número de parámetros no es 1');
  es = es.replace(/If the number of parameters is not 2/gi, 'Si el número de parámetros no es 2');
  es = es.replace(/If the number of parameters is not 3/gi, 'Si el número de parámetros no es 3');
  es = es.replace(/If the number of arguments is not 1/gi, 'Si el número de argumentos no es 1');
  es = es.replace(/If the number of arguments is not 2/gi, 'Si el número de argumentos no es 2');
  es = es.replace(/If the number of arguments is not 3/gi, 'Si el número de argumentos no es 3');
  es = es.replace(/A word is a sequence of/gi, 'Una palabra es una secuencia de');
  es = es.replace(/A word is a section of/gi, 'Una palabra es una sección de');
  es = es.replace(/Examples\s*:/gi, 'Ejemplos:');
  es = es.replace(/Example\s*:/gi, 'Ejemplo:');
  es = es.replace(/None\b/gi, 'Ninguna');

  return es;
}

/**
 * Obtiene el subject en español para un ejercicio y variante concreta
 */
export function getSpanishSubject(exercise, currentSubject = '') {
  if (!exercise) return '';

  // 1. Si el ejercicio tiene definido `subjectEs` explícitamente
  if (exercise.subjectEs && exercise.subjectEs.trim().length > 20) {
    return exercise.subjectEs;
  }

  // 2. Si existe en el catálogo maestro oficial de traducciones
  const id = exercise.id || exercise.nombre;
  if (id && SUBJECTS_ES[id]) {
    return SUBJECTS_ES[id];
  }

  // 3. Traducción sintética del subject actual
  const sourceText = currentSubject || exercise.subject || '';
  return translate42SubjectToSpanish(sourceText, exercise.nombre);
}
