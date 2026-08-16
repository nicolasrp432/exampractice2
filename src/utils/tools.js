import { allExercises } from '../data/index.js'

const UNIVERSAL_TOOLS = [
  {
    id: 'strings',
    label: 'Strings',
    emoji: '🧵',
    description: 'Recorrer, cortar y transformar cadenas sin perder el hilo.',
    frequency: '25/30 ejercicios',
    subjectHints: ['string', 'word', 'char', 'argv', 'strlen', 'strcpy', 'strrev', 'search_and_replace'],
    patterns: ['while (str[i])', 'write(1, &str[i], 1)', 'for (const c of str)'],
    traps: ['Olvidar el terminador \\0', 'Confundir índice con puntero'],
    trainingExercises: ['ft_strlen', 'ft_putstr', 'ft_strcpy', 'first_word', 'rev_print', 'rotone', 'rot_13', 'search_and_replace', 'ulstr', 'ft_strrev', 'ft_strcmp', 'ft_strcspn', 'ft_strdup', 'ft_strpbrk', 'inter', 'wdmatch', 'epur_str', 'expand_str', 'ft_split'],
    recognition: 'Si ves palabras, posiciones, recortes o transformaciones de texto, casi seguro entra aquí.',
    tools: ['strings', 'argc'],
  },
  {
    id: 'ascii',
    label: 'ASCII',
    emoji: '🔣',
    description: 'Hacer aritmética con letras y dígitos para convertir sin tablas.',
    frequency: '18/30 ejercicios',
    subjectHints: ['ascii', 'upper', 'lower', 'case', 'digit', 'alphabet', 'mirror', 'capitalizer'],
    patterns: ["c - 'a' + 1", "c - 'A' + 1", '±32', "c - '0'"],
    traps: ['Olvidar el +1', 'Aplicar la resta al rango equivocado'],
    trainingExercises: ['repeat_alpha', 'rot_13', 'rotone', 'ulstr', 'alpha_mirror', 'camel_to_snake', 'str_capitalizer', 'rstr_capitalizer', 'ft_atoi', 'ft_atoi_base', 'do_op'],
    recognition: 'Si la solución depende de mayúsculas, minúsculas o números como caracteres, esta es la pista.',
    tools: ['ascii'],
  },
  {
    id: 'argc',
    label: 'argc / argv',
    emoji: '🧭',
    description: 'Esqueleto de programas que leen argumentos de línea de comandos.',
    frequency: '28/30 ejercicios',
    subjectHints: ['argc', 'argv', 'program', 'arguments', 'write'],
    patterns: ['int main(int ac, char **av)', '(void)ac;', '(void)av;'],
    traps: ['No validar argc', 'Confundir función con programa'],
    trainingExercises: ['ft_strlen', 'ft_swap', 'ft_putstr', 'ft_strcpy', 'fizzbuzz', 'first_word', 'rev_print', 'rotone', 'rot_13', 'search_and_replace', 'ulstr', 'do_op', 'ft_atoi', 'ft_split', 'fprime'],
    recognition: 'Si el subject habla de entrada por terminal, casi siempre empieza por argc/argv.',
    tools: ['argc', 'strings'],
  },
  {
    id: 'bandera',
    label: 'Bandera',
    emoji: '🚩',
    description: 'Controlar estados al recorrer strings: duplicados, espacios y separadores.',
    frequency: '10/30 ejercicios',
    subjectHints: ['space', 'spaces', 'duplicate', 'duplicate words', 'first word', 'last word', 'epur', 'expand', 'split'],
    patterns: ['int k = 0;', 'if (k)', 'k = 1;'],
    traps: ['Imprimir espacios de más', 'Olvidar reiniciar el estado'],
    trainingExercises: ['first_word', 'last_word', 'epur_str', 'expand_str', 'ft_split', 'search_and_replace', 'inter', 'wdmatch', 'union', 'fizzbuzz'],
    recognition: 'Cuando hay espacios dobles, flags de impresión o separadores, mira la bandera.',
    tools: ['bandera', 'strings'],
  },
  {
    id: 'recursion',
    label: 'Recursión',
    emoji: '🌀',
    description: 'Resolver repitiendo el mismo patrón con un caso base claro.',
    frequency: '8/30 ejercicios',
    subjectHints: ['recursive', 'recursion', 'list', 'base', 'nbr', 'prime', 'factor'],
    patterns: ['if (n <= 1) return;', 'call the same function again', 'divide and conquer'],
    traps: ['Caso base ausente', 'No avanzar el estado'],
    trainingExercises: ['ft_putnbr', 'ft_range', 'ft_rrange', 'ft_list_size', 'add_prime_sum', 'fprime', 'ft_atoi_base', 'sort_list'],
    recognition: 'Si el problema se vuelve más pequeño y repite la misma lógica, suele ser recursión.',
    tools: ['recursion'],
  },
  {
    id: 'bits',
    label: 'Bits',
    emoji: '🧮',
    description: 'Mover, enmascarar y recombinar bits para ver el byte como una máquina.',
    frequency: '5/30 ejercicios',
    subjectHints: ['bit', 'bits', 'binary', 'byte', 'reverse', 'swap'],
    patterns: ['>>', '<<', '&', '|', '%2', '/2'],
    traps: ['Usar el bit equivocado', 'No limitar a 8 bits'],
    trainingExercises: ['print_bits', 'reverse_bits', 'swap_bits', 'is_power_of_2', 'ft_swap', 'ft_atoi_base'],
    recognition: 'Si el subject pide bytes, binarios o desplazamientos, es zona de bits.',
    tools: ['bits'],
  },
  {
    id: 'malloc',
    label: 'malloc',
    emoji: '🧠',
    description: 'Reservar memoria y cerrar bien el array con NULL final.',
    frequency: '8/30 ejercicios',
    subjectHints: ['malloc', 'array', 'split', 'range', 'clone', 'copy', 'list', 'memory'],
    patterns: ['malloc(sizeof(...))', 'len + 1', 'result[i] = NULL'],
    traps: ['Olvidar el NULL final', 'No reservar un byte extra'],
    trainingExercises: ['ft_strdup', 'ft_range', 'ft_rrange', 'ft_split', 'sort_list', 'ft_list_size', 'union', 'ft_strdup'],
    recognition: 'Si hay arrays dinámicos, clones de strings o listas nuevas, piensa en malloc.',
    tools: ['malloc'],
  },
]

const TOOL_INDEX = Object.fromEntries(UNIVERSAL_TOOLS.map((tool) => [tool.id, tool]))

const DECODER_RULES = [
  { toolId: 'strings', keywords: ['string', 'strings', 'word', 'words', 'char', 'chars', 'argv', 'first word', 'last word', 'search_and_replace', 'str', 'copy', 'reverse'] },
  { toolId: 'ascii', keywords: ['ascii', 'uppercase', 'lowercase', 'mirror', 'capitalizer', 'alphabet', 'digit', 'digit', 'case'] },
  { toolId: 'argc', keywords: ['argc', 'argv', 'main', 'program', 'arguments', 'write'] },
  { toolId: 'bandera', keywords: ['space', 'spaces', 'duplicate', 'duplicates', 'epur', 'expand', 'flag', 'separator', 'compress'] },
  { toolId: 'recursion', keywords: ['recursive', 'recursion', 'list', 'prime', 'factor', 'base', 'tree'] },
  { toolId: 'bits', keywords: ['bit', 'bits', 'binary', 'byte', 'swap_bits', 'reverse_bits', 'print_bits', 'mask'] },
  { toolId: 'malloc', keywords: ['malloc', 'memory', 'array', 'clone', 'split', 'range', 'list', 'buffer'] },
]

const QUESTION_BANK = [
  { prompt: 'Subject: print characters one by one from argv[1]', correctToolId: 'argc', distractors: ['strings', 'malloc', 'bits'] },
  { prompt: 'Subject: uppercase and lowercase conversion with 32', correctToolId: 'ascii', distractors: ['strings', 'bits', 'malloc'] },
  { prompt: 'Subject: remove duplicate spaces between words', correctToolId: 'bandera', distractors: ['strings', 'argc', 'recursion'] },
  { prompt: 'Subject: reverse the bits of a byte', correctToolId: 'bits', distractors: ['ascii', 'malloc', 'strings'] },
  { prompt: 'Subject: recursively print the factors of a number', correctToolId: 'recursion', distractors: ['bits', 'argc', 'bandera'] },
  { prompt: 'Subject: duplicate a string in a new buffer', correctToolId: 'malloc', distractors: ['strings', 'bits', 'ascii'] },
  { prompt: 'Subject: find the first word in a string', correctToolId: 'strings', distractors: ['argc', 'malloc', 'bits'] },
  { prompt: 'Subject: convert CamelCase to snake_case', correctToolId: 'ascii', distractors: ['bandera', 'recursion', 'malloc'] },
  { prompt: 'Subject: split the string on a separator', correctToolId: 'malloc', distractors: ['strings', 'argc', 'bits'] },
  { prompt: 'Subject: count the length of argv[1]', correctToolId: 'argc', distractors: ['strings', 'bandera', 'recursion'] },
]

function normalize(text) {
  return text.toLowerCase()
}

function unique(items) {
  return [...new Set(items)]
}

function buildSkeleton(toolIds, parsedInfo = {}) {
  const isFunction = parsedInfo.isFunction;
  const prototype = parsedInfo.prototype;
  const hasMalloc = toolIds.includes('malloc') || (prototype && prototype.includes('malloc'));

  const lines = [
    '#include <unistd.h>',
    hasMalloc ? '#include <stdlib.h>' : null,
    ''
  ];

  if (isFunction && prototype) {
    // Limpiar prototipo y quitar el punto y coma final
    const cleanProto = prototype.replace(';', '').trim();
    lines.push(cleanProto, '{');
    
    // Inicialización inteligente basada en parámetros
    if (prototype.includes('char *') || prototype.includes('char*')) {
      const paramMatch = prototype.match(/char\s*\*+\s*([a-zA-Z0-9_]+)/);
      const paramName = paramMatch ? paramMatch[1] : 'str';
      lines.push(
        '\tint\ti = 0;',
        '',
        `\twhile (${paramName}[i])`,
        '\t{',
        `\t\t// Recorrer caracteres: ${paramName}[i]`,
        '\t\ti++;',
        '\t}'
      );
      if (cleanProto.startsWith('int ')) {
        lines.push('\treturn (i);');
      } else if (cleanProto.startsWith('char *') || cleanProto.startsWith('char*')) {
        lines.push(`\treturn (${paramName});`);
      }
    } else if (prototype.includes('int *') || prototype.includes('int*')) {
      lines.push(
        '\t// Operación con punteros enteros',
        '\t// Ejemplo: int tmp = *a; *a = *b; *b = tmp;'
      );
    } else {
      lines.push('\t// Tu lógica de la función aquí');
    }
    
    lines.push('}');
  } else {
    // Es un programa con main
    lines.push('int\tmain(int ac, char **av)', '{');
    
    if (toolIds.includes('argc')) {
      lines.push(
        '\tif (ac == 2)',
        '\t{',
        '\t\tint\ti = 0;',
        '',
        '\t\twhile (av[1][i])',
        '\t\t{',
        '\t\t\t// Escribe tu lógica de recorrido aquí',
        '\t\t\twrite(1, &av[1][i], 1);',
        '\t\t\ti++;',
        '\t\t}',
        '\t}',
        '\twrite(1, "\\n", 1);'
      );
    } else {
      lines.push(
        '\t(void)ac;',
        '\t(void)av;',
        '\twrite(1, "\\n", 1);'
      );
    }
    lines.push('\treturn (0);', '}');
  }

  return lines.filter(Boolean).join('\n');
}

export function getUniversalTools() {
  return UNIVERSAL_TOOLS.map((tool) => ({ ...tool }))
}

export function getToolById(id) {
  return TOOL_INDEX[id] ? { ...TOOL_INDEX[id] } : null
}

export function getToolTrainingExercises(toolId) {
  const tool = TOOL_INDEX[toolId]
  if (!tool) return []
  return tool.trainingExercises
    .map((id) => allExercises.find((exercise) => exercise.id === id))
    .filter(Boolean)
}

export function decodeSubject(subject) {
  const normalized = normalize(subject)
  const keywords = []
  const matchedTools = []

  for (const rule of DECODER_RULES) {
    const matched = rule.keywords.some((keyword) => normalized.includes(keyword))
    if (matched) {
      matchedTools.push(rule.toolId)
      for (const keyword of rule.keywords) {
        if (normalized.includes(keyword)) keywords.push(keyword)
      }
    }
  }

  const toolIds = unique(matchedTools)
  if (toolIds.includes('ascii') && !toolIds.includes('strings')) {
    toolIds.unshift('strings')
  }

  // --- Extracción de Prototipo C ---
  const protoRegex = /(?:void|int|char|unsigned\s+char)\s*\*?\s*[a-zA-Z0-9_]+\s*\([^)]*\)\s*;/;
  const protoMatch = subject.match(protoRegex);
  const prototype = protoMatch ? protoMatch[0].replace(/\s+/g, ' ').trim() : null;

  // Determinar si es función o programa completo
  const isFunction = !!prototype || (subject.toLowerCase().includes('expected files') && !subject.toLowerCase().includes('program that'));

  let functionName = null;
  if (prototype) {
    const nameMatch = prototype.match(/(?:void|int|char|unsigned\s+char)\s*\*?\s*([a-zA-Z0-9_]+)/);
    if (nameMatch) functionName = nameMatch[1];
  }

  const parsedInfo = {
    isFunction,
    prototype,
    functionName
  };

  return {
    toolIds,
    keywords: unique(keywords),
    skeleton: buildSkeleton(toolIds, parsedInfo),
    similarExercises: allExercises.filter((exercise) => toolIds.some((toolId) => getToolById(toolId)?.trainingExercises.includes(exercise.id))).slice(0, 6),
  }
}

export function buildQuizQuestions() {
  return QUESTION_BANK.map((item, index) => {
    const tool = TOOL_INDEX[item.correctToolId]
    const distractorTools = item.distractors
      .map((id) => TOOL_INDEX[id])
      .filter(Boolean)
      .slice(0, 3)

    const options = [tool, ...distractorTools].slice(0, 4)
    while (options.length < 4) {
      options.push(UNIVERSAL_TOOLS[options.length])
    }

    return {
      id: `quiz-${index + 1}`,
      prompt: item.prompt,
      options: options.map((opt) => ({ id: opt.id, label: opt.label, emoji: opt.emoji })),
      correctIndex: options.findIndex((opt) => opt.id === tool.id),
      explanation: tool.description,
    }
  })
}
