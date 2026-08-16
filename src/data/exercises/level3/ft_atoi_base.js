export default {
  id: 'ft_atoi_base',
  nombre: 'ft_atoi_base',
  nivel: 3,
  dificultad: 'difícil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['ft_atoi_base.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : ft_atoi_base
Expected files   : ft_atoi_base.c
Allowed functions: none
--------------------------------------------------------------------------------

Write a function that converts the string argument str (base nb_base) to an
integer and returns it.

int\tft_atoi_base(const char *str, const char *base);

The function must handle:
- Whitespace at the beginning (like atoi)
- Optional sign (+ or -)
- Characters in the given base

If a character in str is not in base, stop conversion.

Example:
ft_atoi_base("ff", "0123456789abcdef") → 255
ft_atoi_base("10", "01")              → 2   (binary)
ft_atoi_base("-f", "0123456789abcdef")→ -15
ft_atoi_base("z", "abcdefghijklmnopqrstuvwxyz") → 25`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : ft_atoi_base
Expected files   : ft_atoi_base.c
Allowed functions: None
--------------------------------------------------------------------------------

Write a function that converts the string argument str (base N <= 16)
to an integer (base 10) and returns it.

The characters recognized in the input are: 0123456789abcdef
Those are, of course, to be trimmed according to the requested base. For
example, base 4 recognizes "0123" and base 16 recognizes "0123456789abcdef".

Uppercase letters must also be recognized: "12fdb3" is the same as "12FDB3".

Minus signs ('-') are interpreted only if they are the first character of the
string.

Your function must be declared as follows:

int	ft_atoi_base(const char *str, int str_base);`,

  descripcion: 'Generalización de ft_atoi para cualquier base. La base es un string cuyos caracteres son los dígitos. Cada carácter de str se mapea a su índice en base. El índice es el valor numérico.',

  palacio: {
    habitacion: 'dormitorio',
    mueble: 'diccionario',
    personaje: 'El Diccionario de Bases',
    emoji: '🔡',
    historia: `En el dormitorio hay un Diccionario que traduce a cualquier idioma numérico.
Le das un número en cualquier base (binario, hex, letras...) y lo convierte a decimal.
El Diccionario tiene tres fases (como ft_atoi):
FASE 1: Salta espacios en blanco.
FASE 2: Lee signo opcional (+ o -).
FASE 3: Para cada char de str, busca su POSICIÓN en base → ese es su valor.
Si el char no está en base: PARA. El índice en base ES el dígito.`,
    anclas: [
      "base_len = strlen(base)  ← el tamaño de la base",
      "ft_isin(c, base) devuelve el ÍNDICE de c en base (o -1)",
      "result = result * base_len + digit  ← acumulación en la base dada",
      "FASE 1: skip whitespace; FASE 2: signo; FASE 3: dígitos",
      "parar al primer char no encontrado en base",
    ],
  },

  herramientas: ['strings', 'ascii'],

  campayoMetodo: {
    feynman: `La función convierte un string a entero usando una base arbitraria (no solo base 10).
Recibe el string del número y la base como string de caracteres válidos.
Para cada carácter del número, busca su posición en la base — esa posición es su valor.
Construye el resultado: resultado = resultado * longitud_de_base + valor_del_carácter.
Si la base es inválida (menos de 2 chars o con duplicados), devuelve 0.`,
    datosPuros: [
      { elemento: 'result = result * base_len + char_value', nota: 'fórmula: igual que ft_atoi pero multiplicando por la longitud de la base' },
      { elemento: 'validar base: len >= 2, sin duplicados', nota: 'base inválida → return 0' },
      { elemento: 'buscar char en base con while anidado', nota: 'para cada dígito del string, encontrar su índice en la cadena base' },
    ],
    asociaciones: [
      { dato: 'result * base_len + posición', imagen: 'Es ft_atoi con un abecedario personalizado. En base 16 tienes 16 caracteres; en base 2 tienes 2. El truco del teleférico (×base_len en vez de ×10) sigue siendo el mismo: cada dígito nuevo empuja a los anteriores una posición.' },
      { dato: 'validar base (sin duplicados)', imagen: 'La base es la regla del juego. Si hay duplicados en la base, el juego no tiene sentido (¿qué vale "A" si hay dos "A"?). La función echa al tramposo con return 0.' },
    ],
  },

  animacion: {
    "tipo": "base-convert",
    "config": {
      "valor": 42,
      "desdeBase": 10,
      "hastaBase": 2
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int base = ft_strlen(base_str);",
        "porque": "El tamaño de la cadena base es el número base (2, 16...).",
        "concepto": "strings"
      },
      {
        "codigo": "while (es_dígito_de_base(str[i]))",
        "porque": "Recorre mientras el carácter pertenezca a la base.",
        "concepto": "bucles"
      },
      {
        "codigo": "  res = res * base + valor(str[i]);",
        "porque": "Acumula multiplicando por la base y sumando el dígito.",
        "concepto": "ascii"
      },
      {
        "codigo": "return (res * signo);",
        "porque": "Aplica el signo detectado.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué res * base y no res * 10?",
        "respuesta": "En base arbitraria cada posición vale \"base\" veces más, no siempre 10."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Como ft_atoi pero cada dígito es el índice del char en la cadena base',
    formula: 'digit=base.indexOf(str[i]); result=result*base_len+digit; (parar si -1)',
    ejemplo: {
      entrada: '"ff", base="0123456789abcdef"',
      calculo: "'f'→índice 15; result=0*16+15=15; 'f'→15; result=15*16+15=255",
      resultado: '255',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=ft_atoi_base.c
file2=../../../../rendu/ft_atoi_base/ft_atoi_base.c


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

# 2. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "Ceci permet de decouvrir le fonctionnement de ton ft_atoi_base." "16" > out1.txt 2>/dev/null
    ./out2 "Ceci permet de decouvrir le fonctionnement de ton ft_atoi_base." "16" > out2.txt 2>/dev/null

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

    ./out1 "13268!" "16" > out1.txt 2>/dev/null
    ./out2 "13268!" "16" > out2.txt 2>/dev/null

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

    ./out1 "-13268!" "10" > out1.txt 2>/dev/null
    ./out2 "-13268!" "10" > out2.txt 2>/dev/null

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
    { id: 'tester_1', entrada: [], salida: "", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["Ceci permet de decouvrir le fonctionnement de ton ft_atoi_base.","16"], salida: "3308\n", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["13268!","16"], salida: "78440\n", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["-13268!","10"], salida: "-13268\n", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Con ft_isin() auxiliar que devuelve índice',
      descripcion: 'La más modular. ft_isin busca el índice del carácter en la base.',
      recomendada: true,
      codigo: `static int\tft_isin(char c, const char *base)
{
\tint\ti;

\ti = 0;
\twhile (base[i])
\t{
\t\tif (base[i] == c)
\t\t\treturn (i);
\t\ti++;
\t}
\treturn (-1);
}

static int\tft_strlen(const char *s)
{
\tint\ti;

\ti = 0;
\twhile (s[i])
\t\ti++;
\treturn (i);
}

int\tft_atoi_base(const char *str, const char *base)
{
\tint\tbase_len;
\tint\tsign;
\tint\tresult;
\tint\tdigit;

\tbase_len = ft_strlen(base);
\tsign = 1;
\tresult = 0;
\twhile (*str == ' ' || (*str >= '\\t' && *str <= '\\r'))
\t\tstr++;
\tif (*str == '-')
\t{\n\t\tsign = -1;\n\t\tstr++;
\t}
\telse if (*str == '+')
\t\tstr++;
\twhile ((digit = ft_isin(*str, base)) != -1)
\t{
\t\tresult = result * base_len + digit;
\t\tstr++;
\t}
\treturn (result * sign);
}`,
    },
    {
      id: 'punteros',
      nombre: 'Con búsqueda por punteros',
      descripcion: 'Recorre la base con un puntero y acumula el resultado sin usar helpers extra.',
      recomendada: false,
      codigo: `static int\tft_strlen(const char *s)
{
\tint\ti;

\ti = 0;
\twhile (s[i])
\t\ti++;
\treturn (i);
}

static int\tbase_index(char c, const char *base)
{
\tint\ti;

\ti = 0;
\twhile (base[i])
\t{
\t\tif (base[i] == c)
\t\t\treturn (i);
\t\ti++;
\t}
\treturn (-1);
}

int\tft_atoi_base(const char *str, const char *base)
{
\tint\tbase_len;
\tint\tsign;
\tint\tresult;
\tint\tdigit;

\tbase_len = ft_strlen(base);
\tsign = 1;
\tresult = 0;
\twhile (*str == ' ' || (*str >= '\\t' && *str <= '\\r'))
\t\tstr++;
\tif (*str == '+' || *str == '-')
\t{
\t\tif (*str == '-')
\t\t\tsign = -1;
\t\tstr++;
\t}
\twhile ((digit = base_index(*str, base)) >= 0)
\t{
\t\tresult = result * base_len + digit;
\t\tstr++;
\t}
\treturn (result * sign);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `char	to_lower(char c)
{
	if (c >= 'A' && c <= 'Z')
		return (c + ('a' - 'A'));
	return (c);
}

int get_digit(char c, int digits_in_base)
{
	int max_digit;
	if (digits_in_base <= 10)
		max_digit = digits_in_base + '0';
	else
		max_digit = digits_in_base - 10 + 'a';

	if (c >= '0' && c <= '9' && c <= max_digit)
		return (c - '0');
	else if (c >= 'a' && c <= 'f' && c <= max_digit)
		return (10 + c - 'a');
	else
		return (-1);
}

int ft_atoi_base(const char *str, int str_base)
{
	int result = 0;
	int sign = 1;
	int digit;

	if (*str == '-')
	{
		sign = -1;
		++str;
	}

	while ((digit = get_digit(to_lower(*str), str_base)) >= 0)
	{
		result = result * str_base;
		result = result + (digit * sign);
		++str;
	}
	return (result);
}`,
    },
  ],

  tests: [
    { id: 'test_hex_ff', descripcion: '"ff" base hex → 255', entrada: ['ff', '0123456789abcdef'], salida: '255\n', tipo: 'normal' },
    { id: 'test_bin_10', descripcion: '"10" base binaria → 2', entrada: ['10', '01'], salida: '2\n', tipo: 'normal' },
    { id: 'test_neg_hex', descripcion: '"-f" base hex → -15', entrada: ['-f', '0123456789abcdef'], salida: '-15\n', tipo: 'normal' },
    { id: 'test_decimal', descripcion: '"42" base decimal → 42 (igual que atoi)', entrada: ['42', '0123456789'], salida: '42\n', tipo: 'normal' },
    { id: 'test_alpha', descripcion: '"z" base alpha → 25 (z es el char 25)', entrada: ['z', 'abcdefghijklmnopqrstuvwxyz'], salida: '25\n', tipo: 'normal' },
    { id: 'test_0', descripcion: '"0" base hex → 0', entrada: ['0', '0123456789abcdef'], salida: '0\n', tipo: 'edge' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: '"ff" base "0123456789abcdef"',
      codigo: `base_len = 16, sign=1, result=0
FASE 3: *str='f'
  ft_isin('f', base) → 'f' en posición 15 → digit=15
  result = 0*16 + 15 = 15
  str++
*str='f' (segundo)
  ft_isin('f', base) → digit=15
  result = 15*16 + 15 = 255
  str++
*str='\\0' → ft_isin==-1 → para`,
      variables: [
        { nombre: 'result', valor: '255', cambio: true, nota: '' },
        { nombre: 'sign', valor: '1', cambio: false, nota: '' },
        { nombre: 'retorno', valor: '255', cambio: true, nota: '✓' },
      ],
    },
    {
      paso: 2,
      titulo: '"10" base "01" (binario)',
      codigo: `base_len = 2, result=0
'1' → ft_isin('1',"01") = 1 → result=0*2+1=1
'0' → ft_isin('0',"01") = 0 → result=1*2+0=2
'\\0' → -1 → para
return 2`,
      variables: [
        { nombre: 'retorno', valor: '2', cambio: true, nota: '✓ "10" en binario = 2' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'ft_isin devuelve 1/0 (encontrado/no) en vez del ÍNDICE',
      descripcion: 'El índice de c en base es su VALOR numérico en esa base. Si devuelves 1/0, todos los dígitos valdrían 1 o 0 — resultado completamente incorrecto.',
      codigoMal: `// ❌ Devuelve bool, no índice
static int ft_isin(char c, char *base) {
    int i = 0;
    while (base[i])
        if (base[i++] == c) return 1;  // debería return i-1 (el índice)
    return 0;
}`,
      codigoBien: `// ✅ Devuelve el índice (= valor del dígito en esa base)
static int ft_isin(char c, const char *base) {
    int i = 0;
    while (base[i]) {
        if (base[i] == c) return i;  // ← el índice ES el valor
        i++;
    }
    return (-1);
}`,
    },
    {
      severidad: 'mortal',
      titulo: 'No multiplicar result * base_len antes de sumar — acumulación incorrecta',
      descripcion: 'Como en ft_atoi: result = result * BASE + dígito. En base 16, si result=1 y siguiente dígito=5, result = 1*16+5=21, no 1+5=6.',
      codigoMal: `// ❌ No multiplica por base_len
result = result + digit;  // "ff" → 15+15=30 en vez de 255`,
      codigoBien: `// ✅
result = result * base_len + digit;  // "ff" → 0*16+15=15, 15*16+15=255`,
    },
  ],

  bajoCelCapot: `ft_atoi_base generaliza ft_atoi a cualquier base numérica.
Con base="0123456789abcdef": base 16 (hexadecimal).
Con base="01": base 2 (binario).
Con base="0123456789": base 10 (igual que ft_atoi).
El índice en el string base es el valor numérico del dígito en esa base.`,

  estrategia: 'MEMORIZAR',
  razonEstrategia: 'ft_atoi_base = ft_atoi pero la "tabla de dígitos" es el parámetro base. El patrón clave: ft_isin devuelve el ÍNDICE (no 0/1), y result=result*base_len+digit.',
  relacionados: ['ft_atoi', 'print_hex', 'reverse_bits'],
}
