export default {
  id: 'ft_strcpy',
  nombre: 'ft_strcpy',
  nivel: 1,
  dificultad: 'fácil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_strcpy.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_strcpy
Expected files   : ft_strcpy.c
Allowed functions: none
--------------------------------------------------------------------------------

Reproduce the behavior of the function strcpy (man strcpy).

char\t*ft_strcpy(char *dest, char *src);`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_strcpy
Expected files   : ft_strcpy.c
Allowed functions:
--------------------------------------------------------------------------------

Reproduce the behavior of the function strcpy (man strcpy).

Your function must be declared as follows:

char    *ft_strcpy(char *s1, char *s2);`,

  descripcion: 'Función que copia el string src en dest (incluyendo el \\0 final) y devuelve dest. dest debe tener espacio suficiente para contener src.',

  palacio: {
    habitacion: 'cocina',
    mueble: 'alacena',
    personaje: 'La Fotocopiadora de recetas',
    emoji: '🖨️',
    historia: `En la alacena hay una Fotocopiadora de recetas mágica.
Le das el original (src) y el papel en blanco (dest).
Copia LETRA a LETRA: dest[i] = src[i].
Cuando llega al Fantasma Cero (\\0) lo copia también (¡es obligatorio!) y para.
Al final devuelve dest — el papel ya relleno.
¡El papel debe ser LO BASTANTE GRANDE antes de copiar!`,
    anclas: [
      "dest[i] = src[i]  ← copia byte a byte",
      "copiar el \\0 final  ← OBLIGATORIO",
      "return (dest)  ← devuelve destino",
      "i = 0; antes del while",
      "dest debe tener espacio: sin malloc aquí",
    ],
  },

  herramientas: ['strings'],

  campayoMetodo: {
    feynman: `La función recibe dos strings: el destino vacío y el original.
Va copiando letra a letra del original al destino: destino[i] = origen[i].
Cuando llega al Cero Fantasma, lo copia también (¡es obligatorio!).
Al terminar devuelve el destino — el papel ya relleno.
El destino debe tener espacio suficiente para caber todo el original.`,
    datosPuros: [
      { elemento: 'char *ft_strcpy(char *dest, char *src)', nota: 'devuelve char* (el mismo dest), no void' },
      { elemento: 'while ((dest[i] = src[i]))', nota: 'asignación dentro del while — copia y comprueba a la vez' },
      { elemento: 'return (dest)', nota: 'devuelve el puntero al destino, no al origen' },
    ],
    asociaciones: [
      { dato: 'devuelve char* dest', imagen: 'La Fotocopiadora de recetas de la alacena no solo te da la copia — te devuelve el papel de la copia en la mano. No el original, sino el papel que rellenó.' },
      { dato: 'while ((dest[i] = src[i]))', imagen: 'La fotocopiadora tiene un bucle mágico: copia Y mira al mismo tiempo. Cuando copia el Fantasma Cero (valor 0 = falso), el while para solo.' },
    ],
  },

  animacion: {
    "tipo": "string-pointer",
    "config": {
      "cadena": "hola",
      "modo": "copiar"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "char *ft_strcpy(char *dest, char *src)",
        "porque": "Copia src en dest y devuelve dest.",
        "concepto": "punteros"
      },
      {
        "codigo": "  int i = 0;",
        "porque": "Índice compartido para leer y escribir.",
        "concepto": "variables"
      },
      {
        "codigo": "  while (src[i])",
        "porque": "Copia mientras no llegue al \\0 de src.",
        "concepto": "strings"
      },
      {
        "codigo": "    dest[i] = src[i];",
        "porque": "Copia carácter a carácter en la misma posición.",
        "concepto": "strings"
      },
      {
        "codigo": "    i++;",
        "porque": "Avanza.",
        "concepto": "bucles"
      },
      {
        "codigo": "  dest[i] = \\0;",
        "porque": "Cierra dest con el terminador (el while no lo copió).",
        "concepto": "strings"
      },
      {
        "codigo": "  return (dest);",
        "porque": "Devuelve el destino ya copiado.",
        "concepto": "punteros"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué añadir dest[i] = \\0 al final?",
        "respuesta": "El bucle para en el \\0 de src sin copiarlo; hay que cerrar dest a mano o no sería un string válido."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Copia cada byte de src a dest incluyendo el \\0',
    formula: 'while ((dest[i] = src[i])) i++;',
    ejemplo: {
      entrada: 'src = "hello"',
      calculo: 'h→h e→e l→l l→l o→o \\0→\\0',
      resultado: 'dest = "hello"\\0, retorna dest',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_strcpy.c
file2=../../../../rendu/ft_strcpy/ft_strcpy.c


# 1. test
    gcc -Werror -Wall -Wextra -o out1 "$file1" main.c 
    gcc -Werror -Wall -Wextra -o out2 "$file2" main.c

    ./out1 "L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification." > out1.txt 2>/dev/null
    ./out2 "L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification." > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi


# 2. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  " > out1.txt 2>/dev/null
    ./out2 "S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  " > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 3. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot" > out1.txt 2>/dev/null
    ./out2 "3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 4. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "Papache est un sabre" "a" "o" > out1.txt 2>/dev/null
    ./out2 "Papache est un sabre" "a" "o" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 5. test 
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "zaz" "art" "zul" > out1.txt 2>/dev/null
    ./out2 "zaz" "art" "zul" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 6. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "zaz" "r" "u" > out1.txt 2>/dev/null
    ./out2 "zaz" "r" "u" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 7. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "jacob" "a" "b" "c" "e" > out1.txt 2>/dev/null
    ./out2 "jacob" "a" "b" "c" "e" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 8. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "ZoZ eT Dovid oiME le METol." "o" "a" > out1.txt 2>/dev/null
    ./out2 "ZoZ eT Dovid oiME le METol." "o" "a" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 9. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "wNcOre Un ExEmPle Pas Facilw a Ecrirw " "w" "e" > out1.txt 2>/dev/null
    ./out2 "wNcOre Un ExEmPle Pas Facilw a Ecrirw " "w" "e" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

# 10. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "AkjhZ zLKIJz , 23y " > out1.txt 2>/dev/null
    ./out2 "AkjhZ zLKIJz , 23y " > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 11. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "FOR PONY" > out1.txt 2>/dev/null
    ./out2 "FOR PONY" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 12. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "this        ...       is sparta, then again, maybe    not" > out1.txt 2>/dev/null
    ./out2 "this        ...       is sparta, then again, maybe    not" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 13. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "   " > out1.txt 2>/dev/null
    ./out2 "   " > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 14. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "a" "b" > out1.txt 2>/dev/null
    ./out2 "a" "b" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi

    # 15. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "  lorem,ipsum  " > out1.txt 2>/dev/null
    ./out2 "  lorem,ipsum  " > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "ft_strcpy(\"L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification.\", str) = L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification.\n", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "ft_strcpy(\"S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  \", str) = S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  \n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "ft_strcpy(\"3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot\", str) = 3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "ft_strcpy(\"Papache est un sabre\", str) = Papache est un sabre\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "ft_strcpy(\"zaz\", str) = zaz\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "ft_strcpy(\"zaz\", str) = zaz\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "ft_strcpy(\"jacob\", str) = jacob\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "ft_strcpy(\"ZoZ eT Dovid oiME le METol.\", str) = ZoZ eT Dovid oiME le METol.\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "ft_strcpy(\"wNcOre Un ExEmPle Pas Facilw a Ecrirw \", str) = wNcOre Un ExEmPle Pas Facilw a Ecrirw \n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "ft_strcpy(\"AkjhZ zLKIJz , 23y \", str) = AkjhZ zLKIJz , 23y \n", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "ft_strcpy(\"FOR PONY\", str) = FOR PONY\n", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "ft_strcpy(\"this        ...       is sparta, then again, maybe    not\", str) = this        ...       is sparta, then again, maybe    not\n", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "ft_strcpy(\"   \", str) =    \n", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "ft_strcpy(\"a\", str) = a\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "ft_strcpy(\"  lorem,ipsum  \", str) =   lorem,ipsum  \n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Clásica con while + índice',
      descripcion: 'La más legible y segura. Copia explícitamente el \\0 fuera del bucle.',
      recomendada: true,
      codigo: `char\t*ft_strcpy(char *dest, char *src)
{
\tint\ti;

\ti = 0;
\twhile (src[i])
\t{
\t\tdest[i] = src[i];
\t\ti++;
\t}
\tdest[i] = '\\0';
\treturn (dest);
}`,
    },
    {
      id: 'compacta',
      nombre: 'Compacta (asignación en while)',
      descripcion: 'La condición del while asigna y comprueba en la misma expresión. Copia el \\0 automáticamente.',
      recomendada: false,
      codigo: `char\t*ft_strcpy(char *dest, char *src)
{
\tint\ti;

\ti = 0;
\twhile ((dest[i] = src[i]))
\t\ti++;
\treturn (dest);
}`,
    },
    {
      id: 'puntero',
      nombre: 'Con punteros',
      descripcion: 'Avanza punteros directamente. Compacta pero menos legible bajo presión.',
      recomendada: false,
      codigo: `char\t*ft_strcpy(char *dest, char *src)
{
\tchar\t*start;

\tstart = dest;
\twhile ((*dest++ = *src++))
\t\t;
\treturn (start);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `#include <unistd.h>

char	*ft_strcpy(char *s1, char *s2)
{
	int	i;

	i = 0;
	while (s2[i] != '\\0')
	{
		s1[i] = s2[i];
		i++;
	}
	s1[i] = '\\0';
	return (s1);
}`,
    },
  ],

  tests: [
    {
      id: 'test_hello',
      descripcion: 'Copia "hello" → "hello"',
      entrada: ['hello'],
      salida: 'hello\n',
      tipo: 'normal',
    },
    {
      id: 'test_vacio',
      descripcion: 'Copia "" → ""',
      entrada: [''],
      salida: '\n',
      tipo: 'edge',
    },
    {
      id: 'test_espacio',
      descripcion: 'Copia "Hello World" con espacio',
      entrada: ['Hello World'],
      salida: 'Hello World\n',
      tipo: 'normal',
    },
    {
      id: 'test_simbolos',
      descripcion: 'Copia "abc123!" — mezcla de chars',
      entrada: ['abc123!'],
      salida: 'abc123!\n',
      tipo: 'normal',
    },
    {
      id: 'test_1char',
      descripcion: 'Copia "x" — un solo carácter',
      entrada: ['x'],
      salida: 'x\n',
      tipo: 'normal',
    },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Inicio: src="hello", dest=buffer[10]',
      codigo: `(gdb) break ft_strcpy
(gdb) run
Breakpoint 1, ft_strcpy (dest=0x..., src=0x... "hello") at ft_strcpy.c:3
3\t\tint i;`,
      variables: [
        { nombre: 'src', valor: '"hello"', cambio: false, nota: 'Cadena origen' },
        { nombre: 'dest', valor: '[basura]', cambio: false, nota: 'Buffer destino sin inicializar' },
        { nombre: 'i', valor: '?', cambio: false, nota: '' },
      ],
    },
    {
      paso: 2,
      titulo: 'i=0 → copia h: dest[0] = src[0]',
      codigo: `i = 0
while (src[0])  → 'h' ≠ '\\0' → ENTRA
dest[0] = src[0];  // 'h'
i++;               // i=1`,
      variables: [
        { nombre: 'i', valor: '0 → 1', cambio: true, nota: '' },
        { nombre: 'dest[0]', valor: "'h'", cambio: true, nota: 'Primer byte copiado' },
      ],
    },
    {
      paso: 3,
      titulo: 'Copia e, l, l, o → i=5',
      codigo: `[i=1] dest[1]='e'
[i=2] dest[2]='l'
[i=3] dest[3]='l'
[i=4] dest[4]='o'
i = 5`,
      variables: [
        { nombre: 'i', valor: '5', cambio: true, nota: '' },
        { nombre: 'dest', valor: '"hello"...', cambio: true, nota: '5 bytes copiados, falta el \\0' },
      ],
    },
    {
      paso: 4,
      titulo: 'src[5] = \\0 → sale del while',
      codigo: `while (src[5])  → '\\0' = 0 → FALSE, sale
// Fuera del bucle: ahora copia el \\0
dest[5] = '\\0';`,
      variables: [
        { nombre: 'src[5]', valor: "'\\0'", cambio: false, nota: '← Termina el while' },
        { nombre: 'dest[5]', valor: "'\\0'", cambio: true, nota: '← ¡OBLIGATORIO! Sin esto dest no es string válido' },
      ],
    },
    {
      paso: 5,
      titulo: 'return (dest) → puntero al inicio',
      codigo: `return (dest);
// dest apunta al inicio del buffer: "hello\\0"
(gdb) print dest
$1 = 0x... "hello"`,
      variables: [
        { nombre: 'dest', valor: '"hello"', cambio: false, nota: '✓ Copia completa con \\0' },
        { nombre: 'retorno', valor: 'puntero a dest', cambio: true, nota: 'Permite encadenamiento: strcpy(strcpy(a,b), c)' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'Olvidar copiar el \\0 final',
      descripcion: 'Sin dest[i] = "\\0" al final, dest no es un string válido. Cualquier función que lo reciba después iterará más allá del buffer → undefined behavior.',
      codigoMal: `// ❌ Sin el \\0 final
while (src[i]) {
    dest[i] = src[i];
    i++;
}
// dest = "hello" + basura, NO un string válido`,
      codigoBien: `// ✅ Con el \\0 final
while (src[i]) {
    dest[i] = src[i];
    i++;
}
dest[i] = '\\0'; // ← SIEMPRE`,
    },
    {
      severidad: 'mortal',
      titulo: 'No devolver dest — pérdida del puntero',
      descripcion: 'La firma dice char *. Sin return (dest), la función devuelve basura. Los encadenamientos como ft_putstr(ft_strcpy(buf, src)) fallan.',
      codigoMal: `// ❌ Sin return
char *ft_strcpy(char *dest, char *src) {
    int i = 0;
    while (src[i]) dest[i++] = src[i];
    dest[i] = '\\0';
    // falta return (dest);
}`,
      codigoBien: `// ✅
char *ft_strcpy(char *dest, char *src) {
    int i = 0;
    while (src[i]) { dest[i] = src[i]; i++; }
    dest[i] = '\\0';
    return (dest); // ← siempre
}`,
    },
    {
      severidad: 'warning',
      titulo: 'Buffer dest demasiado pequeño — buffer overflow',
      descripcion: 'ft_strcpy NO comprueba el tamaño de dest. Si src es más largo que dest, escribe fuera del buffer (stack smashing). Responsabilidad del llamador.',
      codigoMal: `// ❌ Buffer desbordado
char dest[3];
ft_strcpy(dest, "hello"); // escribe 6 bytes en 3 → overflow`,
      codigoBien: `// ✅ Buffer suficientemente grande
char dest[100];
ft_strcpy(dest, "hello"); // OK: 6 bytes en 100`,
    },
  ],

  bajoCelCapot: `strcpy es una de las funciones más peligrosas de C por el buffer overflow.
En producción se usa strncpy o strlcpy.
En 42 el sujeto garantiza que dest tiene espacio suficiente.
La versión compacta while((dest[i]=src[i])) aprovecha que '\\0'=0=falsy.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'Patrón base de copia de strings. Aparece en ft_strdup (con malloc), en manipulaciones de strings compuestos, etc.',
  relacionados: ['ft_strlen', 'ft_putstr', 'ft_strdup'],
}
