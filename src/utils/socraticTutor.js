/**
 * Motor Pedagógico Socrático del Profesor 42
 * Genera explicaciones y diagnósticos precisos según el ejercicio, la pregunta y el código en C.
 */

export function generateSocraticResponse(query, exercise, code) {
  const q = (query || '').toLowerCase().trim();
  const name = exercise?.nombre || 'este ejercicio';
  const nivel = exercise?.nivel || 1;
  const proto = exercise?.prototipo || '';
  const tipo = exercise?.tipoEntrega || 'programa';
  const allowed = exercise?.funcionesPermitidas?.join(', ') || 'write';
  const traps = exercise?.trampas || [];
  const palace = exercise?.palacio;

  // 1. Detección de dudas sobre Segfaults o Crashes
  if (q.includes('segfault') || q.includes('crash') || q.includes('segmentation') || q.includes('coredump') || q.includes('error de memoria')) {
    let specificCause = '';
    if (tipo === 'programa') {
      specificCause = `1. **Omitir la guardia de \`argc\`**: Acceder a \`argv[1][0]\` cuando el programa se ejecuta sin argumentos (\`argc < 2\`).
2. **Acceso fuera de rango**: Iterar \`argv[1][i]\` sin verificar si ya se alcanzó el byte nulo \`'\\0'\`.
3. **Escritura sobre puntero no asignado**: Intentar modificar strings literales o buffers de tamaño 0.`;
    } else {
      specificCause = `1. **Punteros NULL no verificados**: No incluir una guardia como \`if (!str) return (NULL);\` o \`if (!list) return (0);\`.
2. **Desreferenciación de nodo NULL**: Hacer \`current->next\` cuando \`current\` ya es \`NULL\` en un bucle de listas.
3. **Falta de terminador nulo**: En funciones que reservan con \`malloc\`, olvidar poner \`res[len] = '\\0';\`.`;
    }

    return `### ⚠️ Diagnóstico de Segfault en **${name}**

Cadete, en la Escuela 42 un Segfault ante la Moulinette significa **0 automático**. En este ejercicio, revisa:

${specificCause}

${code ? `🔍 **Inspección de tu código actual**:
Comprueba la primera condición de tu función/main. ¿Tienes una guardia que aborte de inmediato si los parámetros son inválidos?` : ''}

❓ **Pregunta Socrática**: Si pasas como argumento \`""\` (cadena vacía) o nada en absoluto, ¿cuál es la primera línea de código que tu ejecutable intentará desreferenciar?`;
  }

  // 2. Detección de dudas sobre Mnemotecnia o Palacio de la Memoria
  if (q.includes('mnemo') || q.includes('palacio') || q.includes('recordar') || q.includes('memoria') || q.includes('olvid')) {
    if (palace) {
      return `### 🏛️ Palacio de la Memoria: **${name}**

Para retener el algoritmo de memoria sin dudar en el examen:

- 🎭 **Personaje / Ancla**: **${palace.personaje}**
- 🚪 **Habitación**: **${palace.habitacion}**
- 📖 **Historia Mnemotécnica**: "${palace.historia}"

⚡ **Estructura que no debes olvidar**:
1. **Entrada**: Filtro de argumentos o validación de punteros.
2. **Acción**: El bucle principal de transformación o cálculo.
3. **Salida**: Escritura del resultado y siempre el salto de línea final \`\\n\`.

❓ **Desafío mental**: Cierra los ojos 5 segundos y visualiza a **${palace.personaje}** en la **${palace.habitacion}**. ¿Cuál es la primera acción que realiza en la historia?`;
    }
  }

  // 3. Detección de dudas sobre Trampas de Moulinette o Casos Extremos
  if (q.includes('trampa') || q.includes('moulinette') || q.includes('extremo') || q.includes('test') || q.includes('borde') || q.includes('caso')) {
    const trapList = traps.length > 0
      ? traps.map((t, idx) => `${idx + 1}. **${t.titulo}**: ${t.descripcion}`).join('\n')
      : `1. **0 Argumentos**: Debe imprimir solo \`\\n\`.
2. **Espacios y tabuladores múltiples**: Manejo correcto de \`' '\` y \`'\\t'\`.
3. **Caracteres no imprimibles o negativos**.`;

    return `### 🎯 Casos Trampa de Moulinette para **${name}**

La Moulinette no solo prueba casos bonitos, prueba los límites:

${trapList}

⚠️ **Recordatorio Vital**: 
- Si no hay argumentos válidos, la regla general de 42 es: \`write(1, "\\n", 1); return (0);\`.
- No agregues espacios sobrantes al final de la salida si el subject no los pide explícitamente.

❓ **Reflexiona**: ¿Qué devuelve tu implementación si le pasas \`"   \\t   "\` (solo espacios y tabs)? ¿Imprime un espacio vacío o solo el salto de línea?`;
  }

  // 4. Detección de dudas sobre Lógica, Algoritmo o Paso a Paso
  if (q.includes('logica') || q.includes('paso') || q.includes('algoritmo') || q.includes('como se hace') || q.includes('como resolver') || q.includes('explicar')) {
    let logicGuidance = '';
    if (name === 'first_word' || name === 'last_word') {
      logicGuidance = `1. **Saltar espacios iniciales**: Avanza mientras el carácter sea espacio (\`' '\`) o tabulador (\`'\\t'\`).
2. **Imprimir la palabra**: En un segundo bucle, imprime carácter por carácter mientras NO sea espacio, NO sea tabulador y NO sea \`'\\0'\`.
3. **Cerrar**: Imprime el salto de línea \`\\n\`.`;
    } else if (name === 'ft_strlen' || name === 'ft_putstr' || name === 'ft_strcpy' || name === 'ft_strcmp') {
      logicGuidance = `1. **Puntero o índice base**: Inicializa un contador \`i = 0\` o recorre con un puntero móvil.
2. **Condición de avance**: Itera mientras el carácter actual sea distinto de \`'\\0'\`.
3. **Retorno o copia**: Asegúrate de no desbordar y mantener la invariante del puntero original.`;
    } else if (name === 'fizzbuzz') {
      logicGuidance = `1. **Bucle de 1 a 100**.
2. **Prioridad condicional**: Comprueba primero el caso divisible por 3 Y por 5 (múltiplo de 15) antes de evaluar 3 o 5 por separado.
3. **Escritura manual**: Para los números normales, debes implementar una función que convierta el entero a dígitos ASCII usando \`write(1, ...)\`.`;
    } else if (name === 'rotone' || name === 'rot_13' || name === 'repeat_alpha') {
      logicGuidance = `1. **Verificar rango alfabético**: Comprueba si el carácter está en \`['a'..'z']\` o \`['A'..'Z']\`.
2. **Desplazamiento circular**: Al pasar de la 'z' o 'Z', vuelve a la 'a' o 'A'.
3. **Caracteres no alfabéticos**: Déjalos intactos y escríbelos tal cual.`;
    } else {
      logicGuidance = `1. **Filtro de Entrada**: Verifica \`argc\` o valida punteros de entrada.
2. **Núcleo de Procesamiento**: Recorre la estructura con un bucle \`while\` manteniendo clara la condición de parada.
3. **Salida Controlada**: Emite los caracteres requeridos con \`write\` y asegura la terminación.`;
    }

    return `### ⚡ Estrategia Algorítmica: **${name}**

Para estructurar tu código de forma limpia y a prueba de fallos:

${logicGuidance}

📌 **Funciones autorizadas por el Subject**: \`${allowed}\`.

❓ **Paso a dar**: ¿Cómo piensas plantear la condición de parada de tu bucle principal? Escríbela mentalmente antes de codificar.`;
  }

  // 5. Análisis del código si se proporciona o se solicita revisión
  if (code && code.trim().length > 15 && (q.includes('revis') || q.includes('mira') || q.includes('codigo') || q.includes('bien') || q.includes('mal') || q.includes('corrige'))) {
    const hasArgc = code.includes('argc');
    const hasWrite = code.includes('write');
    const hasNullCheck = code.includes('\\0') || code.includes('NULL') || code.includes('!str');

    const issues = [];
    if (tipo === 'programa' && !hasArgc) {
      issues.push('⚠️ No veo la comprobación de `argc == 2` al inicio del `main`. Si no hay argumentos, Moulinette te dará 0.');
    }
    if (!hasNullCheck) {
      issues.push('⚠️ No detecto validación explícita del terminador nulo `\'\\0\'` o punteros nulos.');
    }
    if (!hasWrite && allowed.includes('write')) {
      issues.push('💡 Recuerda que para imprimir en pantalla debes usar la syscall `write(1, &char, 1);`.');
    }

    return `### 🔍 Revisión de tu Código en C: **${name}**

He examinado la estructura de tu código en el editor:

${issues.length > 0 ? issues.join('\n\n') : '✅ La estructura básica tiene buena pinta a nivel de guardias y llamadas permitidas.'}

📌 **Checklist de Moulinette**:
- ¿Retornas 0 al final del \`main\`?
- ¿Todos los \`write\` apuntan al file descriptor \`1\` (stdout)?
- ¿Se imprime siempre el salto de línea \`\\n\` final?

❓ **Prueba de fuego**: Si ejecutas tu programa pasando como argumento \`"hola mundo"\`, ¿qué imprime exactamente la primera iteración de tu bucle?`;
  }

  // 6. Respuesta general enriquecida
  return `### 💡 Tutoría Socrática: **${name}** (Nivel ${nivel})

Cadete, para dominar **${name}** en el Examen de 42:

- **Tipo**: ${tipo === 'programa' ? 'Programa completo con `main`' : 'Función pura (`' + proto + '`)'}
- **Herramientas permitidas**: \`${allowed}\`
${traps[0] ? `- **Atención especial**: ${traps[0].titulo} (${traps[0].descripcion})` : ''}

Recuerda: En 42 no buscamos código complejo, sino código **robusto, limpio y sin fugas ni segfaults**.

❓ **Dime**: ¿Qué duda específica tienes sobre el algoritmo, las guardias de entrada o el formato de salida?`;
}
