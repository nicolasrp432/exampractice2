export default {
  id: 'max',
  nombre: 'max',
  nivel: 2,
  dificultad: 'fácil',
  tipoEntrega: 'funcion',
  archivosEsperados: ['max.c'],
  funcionesPermitidas: [],

  subject: `Assignment name  : max
Expected files   : max.c
Allowed functions:
--------------------------------------------------------------------------------

Write the following function:

int		max(int* tab, unsigned int len);

The first parameter is an array of int, the second is the number of elements in
the array.

The function returns the largest number found in the array.

If the array is empty, the function returns 0.`,

  // Subject literal del repo rank02 (sub.txt). Útil para comparar con
  // el subject didáctico activo y para la pestaña "Examen real".
  subjectReal: `Assignment name  : max
Expected files   : max.c
Allowed functions:
--------------------------------------------------------------------------------

Write the following function:

int		max(int* tab, unsigned int len);

The first parameter is an array of int, the second is the number of elements in
the array.

The function returns the largest number found in the array.

If the array is empty, the function returns 0.`,

  descripcion: 'Función que recorre un array de enteros y devuelve el valor máximo. Si len es 0, devuelve 0.',

  palacio: {
    habitacion: 'salón',
    mueble: 'estantería',
    personaje: 'El Guardián del Pico',
    emoji: '⛰️',
    historia: `En la estantería hay una montaña de números.
El Guardián mira el primer valor y lo usa como cima provisional.
Después compara cada elemento: si aparece uno más alto, la cima cambia.
Si la montaña está vacía, el Guardián devuelve 0 y no mira nada más.`,
    anclas: [
      'len == 0 → return 0',
      'res = tab[0]',
      'if (tab[i] > res) res = tab[i]',
      'los repetidos no cambian el máximo',
    ],
  },

  herramientas: ['arrays', 'comparación'],

  campayoMetodo: {
    feynman: `La función recibe un array de enteros y su tamaño, y devuelve el más grande.
Guarda el primer número como candidato a "máximo".
Recorre el resto del array comparando cada número con el máximo actual.
Si encuentra uno mayor, lo convierte en el nuevo máximo.
Al terminar, devuelve el máximo encontrado.`,
    datosPuros: [
      { elemento: 'int max(int *tab, int len)', nota: 'recibe puntero a array y su longitud' },
      { elemento: 'int max = tab[0]', nota: 'inicializar con el primer elemento, no con 0 (puede haber negativos)' },
      { elemento: 'if (tab[i] > max) max = tab[i]', nota: 'actualizar si el nuevo es mayor' },
    ],
    asociaciones: [
      { dato: 'inicializar con tab[0] (no 0)', imagen: 'El cazador de máximos necesita un punto de partida. Si empieza con 0 y todos los números son negativos, devolverá 0 — pero 0 ni siquiera está en el array. Siempre empieza por la primera presa real (tab[0]).' },
    ],
  },

  animacion: {
    "tipo": "swap",
    "config": {
      "a": 42,
      "b": 17,
      "modo": "max"
    }
  },

  desglose: {
    "lineas": [
      {
        "codigo": "int max = tab[0];",
        "porque": "Asume que el primero es el mayor de momento.",
        "concepto": "variables"
      },
      {
        "codigo": "while (i < len)",
        "porque": "Recorre todo el array.",
        "concepto": "bucles"
      },
      {
        "codigo": "  if (tab[i] > max) max = tab[i];",
        "porque": "Actualiza max si encuentra algo más grande.",
        "concepto": "condicionales"
      },
      {
        "codigo": "return (max);",
        "porque": "Devuelve el mayor encontrado.",
        "concepto": "primitivas"
      }
    ],
    "decisionesClave": [
      {
        "pregunta": "¿Por qué inicializar max con tab[0] y no con 0?",
        "respuesta": "Si todos los números fueran negativos, empezar en 0 daría un máximo falso."
      },
      {
        "pregunta": "¿Qué devuelve si len es 0?",
        "respuesta": "El enunciado obliga a devolver 0 con array vacío: hay que comprobar ese caso."
      }
    ]
  },

  formulaClave: {
    descripcion: 'Guardar el mayor encontrado mientras se recorre el array',
    formula: 'if (len == 0) return 0; res = tab[0]; for i=1..len-1 if tab[i] > res res = tab[i]; return res;',
    ejemplo: {
      entrada: '[3, 7, 2, 7]',
      calculo: 'res=3 → 7 reemplaza → 2 no cambia → 7 no cambia',
      resultado: '7',
    },
  },

  // Tester oficial copiado literalmente desde rank02 (tester.sh).
  testerReal: `#!/bin/bash
source ../../../main/colors.sh
file1=max.c
file2=../../../../rendu/max/max.c


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

    # 16. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

    ./out1 "" > out1.txt 2>/dev/null
    ./out2 "" > out2.txt 2>/dev/null

    if ! diff -q out1.txt out2.txt >/dev/null ; then
        out1=$(cat out1.txt)
        out2=$(cat out2.txt)
        echo "$(tput setaf 1)$(tput bold)FAIL$(tput sgr 0)"
        echo "\${GREEN}Expected Output:\${RESET} \\"$out1\\""
        echo "\${RED}Your Output:\${RESET}     \\"$out2\\""
        rm out1 out2 out1.txt out2.txt 2>/dev/null
        exit 1
    fi
    
     # 17. test
    gcc -w -o out1 "$file1" main.c
    gcc -w -o out2 "$file2" main.c

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
    { id: 'tester_1', entrada: ["L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification."], salida: "", fuente: 'tester.sh' },
    { id: 'tester_2', entrada: ["S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  "], salida: "", fuente: 'tester.sh' },
    { id: 'tester_3', entrada: ["3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot"], salida: "", fuente: 'tester.sh' },
    { id: 'tester_4', entrada: ["Papache est un sabre","a","o"], salida: "max( {a;o} , Papache est un sabre) = 0\n", fuente: 'tester.sh' },
    { id: 'tester_5', entrada: ["zaz","art","zul"], salida: "max( {art;zul} , zaz) = 0\n", fuente: 'tester.sh' },
    { id: 'tester_6', entrada: ["zaz","r","u"], salida: "max( {r;u} , zaz) = 0\n", fuente: 'tester.sh' },
    { id: 'tester_7', entrada: ["jacob","a","b","c","e"], salida: "max( {a;b;c;e} , jacob) = 0\n", fuente: 'tester.sh' },
    { id: 'tester_8', entrada: ["ZoZ eT Dovid oiME le METol.","o","a"], salida: "max( {o;a} , ZoZ eT Dovid oiME le METol.) = 0\n", fuente: 'tester.sh' },
    { id: 'tester_9', entrada: ["wNcOre Un ExEmPle Pas Facilw a Ecrirw ","w","e"], salida: "max( {w;e} , wNcOre Un ExEmPle Pas Facilw a Ecrirw ) = 0\n", fuente: 'tester.sh' },
    { id: 'tester_10', entrada: ["AkjhZ zLKIJz , 23y "], salida: "", fuente: 'tester.sh' },
    { id: 'tester_11', entrada: ["FOR PONY"], salida: "", fuente: 'tester.sh' },
    { id: 'tester_12', entrada: ["this        ...       is sparta, then again, maybe    not"], salida: "", fuente: 'tester.sh' },
    { id: 'tester_13', entrada: ["   "], salida: "", fuente: 'tester.sh' },
    { id: 'tester_14', entrada: ["a","b"], salida: "max( {b} , a) = 0\n", fuente: 'tester.sh' },
    { id: 'tester_15', entrada: ["  lorem,ipsum  "], salida: "", fuente: 'tester.sh' },
    { id: 'tester_16', entrada: [""], salida: "", fuente: 'tester.sh' },
    { id: 'tester_17', entrada: [], salida: "", fuente: 'tester.sh' },
  ],

  versiones: [
    {
      id: 'clasica',
      nombre: 'Recorrido lineal con máximo provisional',
      descripcion: 'La versión más directa: inicializar con tab[0] y comparar el resto.',
      recomendada: true,
      codigo: `int\tmax(int *tab, unsigned int len)
{
\tunsigned int\ti;
\tint\t\t\tres;

\tif (len == 0)
\t\treturn (0);
\tres = tab[0];
\ti = 1;
\twhile (i < len)
\t{
\t\tif (tab[i] > res)
\t\t\tres = tab[i];
\t\ti++;
\t}
\treturn (res);
}`,
    },
    {
      id: 'compacta',
      nombre: 'Con índice único',
      descripcion: 'Misma lógica, pero con el índice arranque en 0 y una condición explícita para len vacío.',
      recomendada: false,
      codigo: `int\tmax(int *tab, unsigned int len)
{
\tunsigned int\ti;
\tint\t\t\tres;

\tif (len == 0)
\t\treturn (0);
\tres = tab[0];
\ti = 0;
\twhile (i < len)
\t{
\t\tif (tab[i] > res)
\t\t\tres = tab[i];
\t\ti++;
\t}
\treturn (res);
}`,
    },
  
    {
      id: 'rank02',
      nombre: 'Versión rank02 (solución de referencia)',
      descripcion: 'Solución tal y como aparece en el repo de referencia rank02. Útil para comparar estilo, validaciones y constraints reales del examen.',
      recomendada: false,
      origen: 'rank02',
      codigo: `int	max(int* tab, unsigned int len)
{
	if (len == 0)
		return (0);
	int res = tab[0];
	for (unsigned int i = 0; i < len; i += 1)
	{
		if (res < tab[i])
			res = tab[i];
	}
	return (res);
}`,
    },
  ],

  tests: [
    { id: 'test_vacio', descripcion: 'Array vacío → 0', entrada: [], salida: '0\n', tipo: 'edge' },
    { id: 'test_simple', descripcion: '[3,7,2] → 7', entrada: ['3', '7', '2'], salida: '7\n', tipo: 'normal' },
    { id: 'test_negativos', descripcion: '[-8,-3,-10] → -3', entrada: ['-8', '-3', '-10'], salida: '-3\n', tipo: 'normal' },
    { id: 'test_iguales', descripcion: '[4,4,4] → 4', entrada: ['4', '4', '4'], salida: '4\n', tipo: 'normal' },
  ],

  gdbSteps: [
    {
      paso: 1,
      titulo: 'Inicio con tab = [3, 7, 2]',
      codigo: `len = 3
len == 0 → FALSE
res = tab[0] = 3
i = 1`,
      variables: [
        { nombre: 'res', valor: '3', cambio: true, nota: 'cima provisional' },
        { nombre: 'i', valor: '1', cambio: true, nota: 'siguiente elemento' },
      ],
    },
    {
      paso: 2,
      titulo: 'tab[1] = 7 supera a res',
      codigo: `i = 1
tab[1] = 7
7 > 3 → TRUE
res = 7`,
      variables: [
        { nombre: 'res', valor: '7', cambio: true, nota: 'nuevo máximo' },
      ],
    },
    {
      paso: 3,
      titulo: 'Fin del recorrido → return 7',
      codigo: `i = 2, tab[2] = 2
2 > 7 → FALSE
return res`,
      variables: [
        { nombre: 'retorno', valor: '7', cambio: true, nota: 'máximo final' },
      ],
    },
  ],

  trampas: [
    {
      severidad: 'mortal',
      titulo: 'No tratar len == 0',
      descripcion: 'Si el array está vacío no hay tab[0]. Hay que devolver 0 antes de leer nada.',
      codigoMal: `// ❌ tab[0] no existe si len == 0
int res = tab[0];`,
      codigoBien: `// ✅
if (len == 0)
\treturn (0);`,
    },
    {
      severidad: 'warning',
      titulo: 'Inicializar res a 0',
      descripcion: 'Si todos los valores son negativos, res = 0 devuelve un valor incorrecto.',
      codigoMal: `// ❌ rompe con [-8, -3]
int res = 0;`,
      codigoBien: `// ✅ tomar el primer elemento real
int res = tab[0];`,
    },
  ],

  bajoCelCapot: `max recorre un array plano de enteros.
No hay terminador especial: el tamaño lo marca len.
El patrón es “candidado provisional + comparación lineal” y se reutiliza en muchos ejercicios de búsqueda.`,

  estrategia: 'ENTENDER',
  razonEstrategia: 'Es un ejercicio base de recorrido de arrays. Sirve para practicar índices, límites y el caso vacío sin complejidad extra.',
  relacionados: ['ft_range', 'sort_int_tab', 'ft_atoi'],
}
