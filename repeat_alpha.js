/**
 * repeat_alpha — El Loro Alfa glotón 🦜
 * Nivel 1 — Cocina
 * Dificultad: medio
 * Estrategia: AMBOS (memorizar la fórmula + entender la lógica)
 */
export default {
  // ── IDENTIFICACIÓN ────────────────────────────────────────────
  id: "repeat_alpha",
  nombre: "repeat_alpha",
  nivel: 1,
  dificultad: "medio",
  tipoEntrega: "programa",
  archivosEsperados: ["repeat_alpha.c"],
  funcionesPermitidas: ["write"],

  // ── SUBJECT ──────────────────────────────────────────────────
  subject: `Assignment name  : repeat_alpha
Expected files   : repeat_alpha.c
Allowed functions: write
--------------------------------------------------------------------------------

Write a program called repeat_alpha that takes a string and displays
it repeating each alphabetical character as many times as its
alphabetical index, followed by a newline.

'a' becomes 'a', 'b' becomes 'bb', 'e' becomes 'eeeee', etc...

Case remains unchanged.

If the number of arguments is not 1, just display a newline.

Examples:
$>./repeat_alpha "abc"
abbccc
$>./repeat_alpha "Alex." | cat -e
Alllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx.$
$>./repeat_alpha 'abacadaba 42!' | cat -e
abbacccaddddabba 42!$
$>./repeat_alpha | cat -e
$
$>
$>./repeat_alpha "" | cat -e
$
$>`,

  // ── DESCRIPCIÓN EN ESPAÑOL ────────────────────────────────────
  descripcion: "Recibe un string y repite cada letra alfabética tantas veces como indica su posición en el abecedario: 'a'→1 vez, 'b'→2 veces, 'z'→26 veces. Las mayúsculas siguen la misma regla. Los símbolos, números y espacios se imprimen exactamente 1 vez, sin cambios.",

  // ── PALACIO DE MEMORIA ────────────────────────────────────────
  palacio: {
    habitacion: "cocina",
    mueble: "ventana",
    personaje: "El Loro Alfa glotón",
    emoji: "🦜",
    historia: `En la cocina vive el Loro Alfa, un loro con un apetito proporcional a su posición en el alfabeto.

La 'a' es la primera → come 1 galleta → dice "a" una vez.
La 'b' es la segunda → come 2 galletas → dice "bb".
La 'e' es la quinta → come 5 galletas → dice "eeeee".
La 'z' es la vigésimosexta → come 26 galletas → dice "zzz...z" 26 veces.

¿Cómo sabe cuántas galletas? Hace la resta mágica:
su letra menos la 'a', más 1.
'e' - 'a' + 1 = 101 - 97 + 1 = 5 ✓

Las MAYÚSCULAS también comen, pero con su propia tabla:
'A' - 'A' + 1 = 1 → La 'A' come 1 galleta.
'Z' - 'A' + 1 = 26 → La 'Z' come 26 galletas.
El loro imprime la letra en su forma original (sin cambiar mayúsculas/minúsculas).

Los números, espacios y símbolos NO son letras → el loro los repite exactamente 1 vez tal cual.`,
    anclas: [
      "minús: c - 'a' + 1",
      "mayús: c - 'A' + 1",
      "símbolo/número = 1 vez",
      "+1 OBLIGATORIO (sin +1: 'a' desaparece)",
      "ft_putchar_n = el loro repitiendo"
    ]
  },

  // ── HERRAMIENTAS ──────────────────────────────────────────────
  herramientas: ["strings", "ascii"],

  // ── FÓRMULA CLAVE ─────────────────────────────────────────────
  formulaClave: {
    descripcion: "Número de repeticiones según posición en el abecedario",
    formulaMinusculas: "c - 'a' + 1",
    formulaMayusculas: "c - 'A' + 1",
    ejemplo: {
      entrada: "'e'",
      calculo: "'e' - 'a' + 1 = 101 - 97 + 1 = 5",
      resultado: "eeeee"
    },
    desgloseAscii: [
      { char: "a", ascii: 97, formula: "97 - 97 + 1 = 1",   resultado: "a" },
      { char: "b", ascii: 98, formula: "98 - 97 + 1 = 2",   resultado: "bb" },
      { char: "c", ascii: 99, formula: "99 - 97 + 1 = 3",   resultado: "ccc" },
      { char: "e", ascii: 101, formula: "101 - 97 + 1 = 5", resultado: "eeeee" },
      { char: "z", ascii: 122, formula: "122 - 97 + 1 = 26", resultado: "zz...z ×26" },
      { char: "A", ascii: 65,  formula: "65 - 65 + 1 = 1",  resultado: "A" },
      { char: "Z", ascii: 90,  formula: "90 - 65 + 1 = 26", resultado: "ZZ...Z ×26" },
    ]
  },

  // ── VERSIONES DE CÓDIGO ───────────────────────────────────────
  versiones: [
    {
      id: "clasica",
      nombre: "Versión clásica — recomendada para el examen",
      descripcion: "Con función auxiliar ft_putchar_n. La más legible y fácil de recordar.",
      recomendada: true,
      codigo: `#include <unistd.h>

void\tft_putchar_n(char c, int n)
{
\twhile (n > 0)
\t{
\t\twrite(1, &c, 1);
\t\tn--;
\t}
}

void\trepeat_alpha(char *str)
{
\twhile (*str != '\\0')
\t{
\t\tif (*str >= 'a' && *str <= 'z')
\t\t\tft_putchar_n(*str, *str + 1 - 'a');
\t\telse if (*str >= 'A' && *str <= 'Z')
\t\t\tft_putchar_n(*str, *str + 1 - 'A');
\t\telse
\t\t\twrite(1, str, 1);
\t\t++str;
\t}
}

int\tmain(int ac, char **av)
{
\tif (ac == 2)
\t\trepeat_alpha(av[1]);
\twrite(1, "\\n", 1);
\treturn (0);
}`
    },
    {
      id: "indices",
      nombre: "Versión con índices",
      descripcion: "Usando av[1][i] en lugar de puntero. Más familiar para principiantes.",
      recomendada: false,
      codigo: `#include <unistd.h>

void\tft_putchar_n(char c, int n)
{
\twhile (n-- > 0)
\t\twrite(1, &c, 1);
}

int\tmain(int ac, char **av)
{
\tint\ti = 0;

\tif (ac == 2)
\t{
\t\twhile (av[1][i])
\t\t{
\t\t\tif (av[1][i] >= 'a' && av[1][i] <= 'z')
\t\t\t\tft_putchar_n(av[1][i], av[1][i] - 'a' + 1);
\t\t\telse if (av[1][i] >= 'A' && av[1][i] <= 'Z')
\t\t\t\tft_putchar_n(av[1][i], av[1][i] - 'A' + 1);
\t\t\telse
\t\t\t\twrite(1, &av[1][i], 1);
\t\t\ti++;
\t\t}
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`
    }
  ],

  // ── TESTS (exactamente como la Moulinette) ────────────────────
  tests: [
    {
      id: "test_basico",
      descripcion: "Caso básico — abc",
      entrada: ["abc"],
      salida: "abbccc\n",
      tipo: "normal"
    },
    {
      id: "test_mayus_simbolo",
      descripcion: "Mayúsculas y símbolo",
      entrada: ["Alex."],
      salida: "Alllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx.\n",
      tipo: "normal"
    },
    {
      id: "test_mixto",
      descripcion: "Letras, espacios y números",
      entrada: ["abacadaba 42!"],
      salida: "abbacccaddddabba 42!\n",
      tipo: "normal"
    },
    {
      id: "test_sin_arg",
      descripcion: "Sin argumentos → solo newline",
      entrada: [],
      salida: "\n",
      tipo: "edge"
    },
    {
      id: "test_dos_args",
      descripcion: "Demasiados argumentos → solo newline",
      entrada: ["abc", "def"],
      salida: "\n",
      tipo: "edge"
    },
    {
      id: "test_z_mayus",
      descripcion: "Z mayúscula → 26 repeticiones",
      entrada: ["Z"],
      salida: "ZZZZZZZZZZZZZZZZZZZZZZZZZZ\n",
      tipo: "edge"
    },
    {
      id: "test_solo_simbolos",
      descripcion: "Solo símbolos y números → sin cambio",
      entrada: ["42!"],
      salida: "42!\n",
      tipo: "edge"
    },
    {
      id: "test_vacio",
      descripcion: "String vacío → solo newline",
      entrada: [""],
      salida: "\n",
      tipo: "edge"
    }
  ],

  // ── GDB PASO A PASO (ejemplo: "abc" → "abbccc") ───────────────
  gdbSteps: [
    {
      paso: 1,
      titulo: "Entrada — ac=2, av[1]=\"abc\"",
      codigo: `(gdb) b repeat_alpha
(gdb) r "abc"
Breakpoint 1, repeat_alpha (str="abc")
> while (*str != '\\0')
str apunta al byte 'a' (ASCII 97)`,
      variables: [
        { nombre: "str", valor: '"abc"', cambio: true, nota: "puntero al inicio" },
        { nombre: "*str", valor: "'a' = 97", cambio: true, nota: "primer char" }
      ]
    },
    {
      paso: 2,
      titulo: "'a' → minúscula → calcula repeticiones",
      codigo: `(gdb) n
> if (*str >= 'a' && *str <= 'z')  →  97>=97 && 97<=122  →  TRUE
> ft_putchar_n(*str, *str + 1 - 'a')
= ft_putchar_n(97, 97 + 1 - 97)
= ft_putchar_n('a', 1)`,
      variables: [
        { nombre: "*str", valor: "'a' = 97", cambio: false },
        { nombre: "repeticiones", valor: "97+1-97 = 1", cambio: true, nota: "'a' → 1 vez" }
      ]
    },
    {
      paso: 3,
      titulo: "ft_putchar_n('a', 1) → write 'a' 1 vez",
      codigo: `(gdb) step  ← entra en ft_putchar_n
n=1  →  while(1>0)  →  write(1, &c, 1)
stdout recibe: "a"
n--  →  n=0  →  while(0>0) FALSO → sale`,
      variables: [
        { nombre: "c", valor: "'a'", cambio: false },
        { nombre: "n", valor: "1 → 0", cambio: true, nota: "1 galleta consumida" },
        { nombre: "stdout", valor: '"a"', cambio: true }
      ]
    },
    {
      paso: 4,
      titulo: "++str → avanza a 'b' (ASCII 98)",
      codigo: `(gdb) n
++str
str avanza 1 byte en memoria
*str ahora apunta a 'b' = ASCII 98`,
      variables: [
        { nombre: "str", valor: '"bc"', cambio: true, nota: "avanzó 1 byte" },
        { nombre: "*str", valor: "'b' = 98", cambio: true }
      ]
    },
    {
      paso: 5,
      titulo: "'b' → minúscula → 98+1-97 = 2 repeticiones",
      codigo: `(gdb) n
if (*str >= 'a' && *str <= 'z')  →  TRUE
ft_putchar_n(*str, *str + 1 - 'a')
= ft_putchar_n('b', 98+1-97)
= ft_putchar_n('b', 2)`,
      variables: [
        { nombre: "*str", valor: "'b' = 98", cambio: false },
        { nombre: "repeticiones", valor: "98+1-97 = 2", cambio: true, nota: "'b' → 2 veces" }
      ]
    },
    {
      paso: 6,
      titulo: "ft_putchar_n('b', 2) → escribe 'bb'",
      codigo: `write 'b' → n=1
write 'b' → n=0
while(0>0) → sale
stdout acumulado: "abb"`,
      variables: [
        { nombre: "stdout", valor: '"abb"', cambio: true, nota: "'a'×1 + 'b'×2" }
      ]
    },
    {
      paso: 7,
      titulo: "'c' → minúscula → 99+1-97 = 3 repeticiones",
      codigo: `(gdb) n
++str → str apunta a "c"
ft_putchar_n('c', 99+1-97 = 3)
write 'c' × 3
stdout: "abbccc"`,
      variables: [
        { nombre: "repeticiones", valor: "99+1-97 = 3", cambio: true, nota: "'c' → 3 veces" },
        { nombre: "stdout", valor: '"abbccc"', cambio: true }
      ]
    },
    {
      paso: 8,
      titulo: "++str → '\\0' → while termina → write '\\n'",
      codigo: `(gdb) n
++str → str apunta al \\0
while (*str != '\\0')  →  FALSE  →  sale
Regresa a main
write(1, "\\n", 1)
stdout final: "abbccc\\n"`,
      variables: [
        { nombre: "*str", valor: "'\\0' = 0", cambio: true, nota: "fin del string" },
        { nombre: "stdout", valor: '"abbccc\\n"', cambio: true, nota: "✓ output correcto" }
      ]
    }
  ],

  // ── TRAMPAS Y ERRORES ─────────────────────────────────────────
  trampas: [
    {
      severidad: "mortal",
      titulo: "Olvidar el +1 en la fórmula",
      descripcion: "Sin +1, 'a' - 'a' = 0. El loro come 0 galletas y no dice nada. La 'a' desaparece del output completamente.",
      codigoMal: `ft_putchar_n(*str, *str - 'a');   // 'a' → 0 → desaparece del output`,
      codigoBien: `ft_putchar_n(*str, *str + 1 - 'a'); // 'a' → 1 → correcto`
    },
    {
      severidad: "mortal",
      titulo: "Olvidar el else para símbolos/números",
      descripcion: "Sin el else, los símbolos, números y espacios no se imprimen. El punto en 'Alex.' desaparecería.",
      codigoMal: `if (*str >= 'a' && *str <= 'z')
    ft_putchar_n(*str, *str + 1 - 'a');
else if (*str >= 'A' && *str <= 'Z')
    ft_putchar_n(*str, *str + 1 - 'A');
// sin else → símbolo ignorado`,
      codigoBien: `else
    write(1, str, 1); // símbolo: 1 vez tal cual`
    },
    {
      severidad: "warning",
      titulo: "No separar los casos de mayúsculas y minúsculas",
      descripcion: "Si usas solo un if para ambas con || sin manejarlas por separado, la fórmula es diferente para cada caso.",
      codigoMal: `// Fórmula mezclada incorrecta
ft_putchar_n(*str, *str + 1 - 'a'); // para TODAS → 'A' daría número negativo`,
      codigoBien: `// Cada caso con su propia base
if (minúscula) ft_putchar_n(*str, *str + 1 - 'a');
else if (mayúscula) ft_putchar_n(*str, *str + 1 - 'A');`
    }
  ],

  // ── LO QUE PASA DEBAJO DEL ORDENADOR ─────────────────────────
  bajoCelCapot: `Los caracteres en C son bytes en memoria. 'a' vale 97, 'b' vale 98, 'z' vale 122. Son números contiguos en la tabla ASCII. Al restar 'a' (97) a una letra minúscula, obtienes su posición 0-indexed (a=0, b=1, z=25). Sumando 1 lo conviertes a 1-indexed (a=1, b=2, z=26).

El CPU ejecuta una resta de enteros: (code_del_char) - 97. Es una instrucción SUB.

ft_putchar_n llama a write() N veces. Cada write() es una syscall al kernel Linux: interrupción del modo usuario al modo kernel, que copia 1 byte al buffer del file descriptor 1 (stdout). En total, para "abbccc\\n": 7 syscalls write.

El ++str al final del bucle incrementa el puntero en 1 byte, apuntando al siguiente carácter en el array contiguo en RAM.`,

  // ── ESTRATEGIA ────────────────────────────────────────────────
  estrategia: "AMBOS",
  razonEstrategia: "La fórmula c-'a'+1 hay que saber escribirla de memoria sin dudar. La lógica (if minús / else if mayús / else símbolo) se entiende con la historia del loro.",

  // ── EJERCICIOS RELACIONADOS ───────────────────────────────────
  relacionados: ["rot_13", "rotone", "ulstr", "alpha_mirror"],
}
