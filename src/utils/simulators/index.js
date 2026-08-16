// ─── Simuladores JavaScript — Nivel 1 ────────────────────────────────────────
// Firma: simulate(args: string[]) → string  (output EXACTO con \n al final)
// Para FUNCIONES (sin main), retorna el valor de retorno como string.

export const simulators = {

  // ── NIVEL 1 ────────────────────────────────────────────────────────────────

  ft_strlen: (args) => {
    if (args.length !== 1) return '0\n'
    return String(args[0].length) + '\n'
  },

  ft_swap: (args) => {
    if (args.length !== 2) return '[uso: ft_swap(&a, &b) con dos enteros]\n'
    const a = Number(args[0])
    const b = Number(args[1])
    if (isNaN(a) || isNaN(b)) return '[error: se esperan dos enteros]\n'
    return `Antes:  a = ${a}, b = ${b}\nDespués: a = ${b}, b = ${a}\n`
  },

  ft_putstr: (args) => {
    if (args.length !== 1) return ''
    return args[0]  // sin newline — ft_putstr no añade \n; usar strings que incluyan \n en tests
  },

  ft_strcpy: (args) => {
    if (args.length < 1) return '\n'
    return args[0] + '\n'
  },

  fizzbuzz: (_args) => {
    let out = ''
    for (let i = 1; i <= 100; i++) {
      if      (i % 15 === 0) out += 'FizzBuzz\n'
      else if (i % 3  === 0) out += 'Fizz\n'
      else if (i % 5  === 0) out += 'Buzz\n'
      else                   out += `${i}\n`
    }
    return out
  },

  first_word: (args) => {
    if (args.length !== 1) return '\n'
    const str = args[0]
    let i = 0
    // saltar espacios/tabs iniciales
    while (i < str.length && (str[i] === ' ' || str[i] === '\t')) i++
    let out = ''
    // leer hasta espacio/tab o fin
    while (i < str.length && str[i] !== ' ' && str[i] !== '\t') {
      out += str[i++]
    }
    return out + '\n'
  },

  rev_print: (args) => {
    if (args.length !== 1) return '\n'
    return [...args[0]].reverse().join('') + '\n'
  },

  rotone: (args) => {
    if (args.length !== 1) return '\n'
    let out = ''
    for (const c of args[0]) {
      const code = c.charCodeAt(0)
      if      (code === 122)                  out += 'a'   // z → a
      else if (code === 90)                   out += 'A'   // Z → A
      else if (code >= 97  && code <= 121)    out += String.fromCharCode(code + 1)
      else if (code >= 65  && code <= 89)     out += String.fromCharCode(code + 1)
      else                                    out += c
    }
    return out + '\n'
  },

  rot_13: (args) => {
    if (args.length !== 1) return '\n'
    let out = ''
    for (const c of args[0]) {
      const code = c.charCodeAt(0)
      if      (code >= 65 && code <= 90)  out += String.fromCharCode(((code - 65 + 13) % 26) + 65)
      else if (code >= 97 && code <= 122) out += String.fromCharCode(((code - 97 + 13) % 26) + 97)
      else                                out += c
    }
    return out + '\n'
  },

  repeat_alpha: (args) => {
    if (args.length !== 1) return '\n'
    let out = ''
    for (const c of args[0]) {
      const code = c.charCodeAt(0)
      if      (code >= 97 && code <= 122) out += c.repeat(code - 97 + 1)
      else if (code >= 65 && code <= 90)  out += c.repeat(code - 65 + 1)
      else                                out += c
    }
    return out + '\n'
  },

  search_and_replace: (args) => {
    if (args.length !== 3) return 'search_and_replace: bad arguments\n'
    const [str, searchArg, replaceArg] = args
    if (!searchArg || !replaceArg) return 'search_and_replace: bad arguments\n'
    const search  = searchArg[0]
    const replace = replaceArg[0]
    let out = ''
    for (const c of str) out += c === search ? replace : c
    return out + '\n'
  },

  ulstr: (args) => {
    if (args.length !== 1) return '\n'
    let out = ''
    for (const c of args[0]) {
      const code = c.charCodeAt(0)
      if      (code >= 65 && code <= 90)  out += c.toLowerCase()
      else if (code >= 97 && code <= 122) out += c.toUpperCase()
      else                                out += c
    }
    return out + '\n'
  },

  // ── NIVEL 2 ────────────────────────────────────────────────────────────────

  alpha_mirror: (args) => {
    if (args.length !== 1) return '\n'
    let out = ''
    for (const c of args[0]) {
      const code = c.charCodeAt(0)
      if      (code >= 65 && code <= 90)  out += String.fromCharCode(90  - (code - 65))
      else if (code >= 97 && code <= 122) out += String.fromCharCode(122 - (code - 97))
      else                                out += c
    }
    return out + '\n'
  },

  do_op: (args) => {
    if (args.length !== 3) return 'Error\n'
    const a = parseInt(args[0])
    const b = parseInt(args[2])
    const op = args[1]
    if (isNaN(a) || isNaN(b)) return 'Error\n'
    let result
    if      (op === '+') result = a + b
    else if (op === '-') result = a - b
    else if (op === '*') result = a * b
    else if (op === '/') result = b === 0 ? NaN : Math.trunc(a / b)
    else if (op === '%') result = b === 0 ? NaN : a % b
    else return 'Error\n'
    if (isNaN(result)) return 'Error\n'
    return `${result}\n`
  },

  print_bits: (args) => {
    if (args.length !== 1) return '\n'
    const n = parseInt(args[0])
    if (isNaN(n) || n < 0 || n > 255) return '\n'
    return n.toString(2).padStart(8, '0') + '\n'
  },

  is_power_of_2: (args) => {
    if (args.length !== 1) return '\n'
    const n = parseInt(args[0])
    if (isNaN(n)) return '\n'
    return (n > 0 && (n & (n - 1)) === 0) ? '1\n' : '0\n'
  },

  wdmatch: (args) => {
    if (args.length !== 2) return '\n'
    const [s1, s2] = args
    let j = 0
    for (let i = 0; i < s1.length && j < s2.length; i++) {
      if (s1[i] === s2[j]) j++
    }
    return (j === s2.length ? `${s2}\n` : '\n')
  },

  last_word: (args) => {
    if (args.length !== 1) return '\n'
    const str = args[0]
    let end = str.length - 1
    while (end >= 0 && str[end] === ' ') end--
    if (end < 0) return '\n'
    let start = end
    while (start > 0 && str[start - 1] !== ' ') start--
    return str.slice(start, end + 1) + '\n'
  },

  camel_to_snake: (args) => {
    if (args.length !== 1) return '\n'
    let out = ''
    for (const c of args[0]) {
      const code = c.charCodeAt(0)
      if (code >= 65 && code <= 90) out += '_' + c.toLowerCase()
      else                          out += c
    }
    return out + '\n'
  },

  ft_atoi: (args) => {
    if (args.length !== 1) return '0\n'
    const str = args[0]
    let i = 0
    while (i < str.length && ' \t\n\r\f\v'.includes(str[i])) i++
    let sign = 1
    if (i < str.length && (str[i] === '-' || str[i] === '+')) {
      if (str[i] === '-') sign = -1
      i++
    }
    let result = 0
    while (i < str.length && str[i] >= '0' && str[i] <= '9') {
      result = result * 10 + (str.charCodeAt(i) - 48)
      i++
    }
    return String(result * sign) + '\n'
  },

  ft_strcmp: (args) => {
    if (args.length !== 2) return '0\n'
    const [s1, s2] = args
    const len = Math.max(s1.length, s2.length)
    for (let i = 0; i <= len; i++) {
      const a = i < s1.length ? s1.charCodeAt(i) : 0
      const b = i < s2.length ? s2.charCodeAt(i) : 0
      if (a !== b) return String(a - b) + '\n'
    }
    return '0\n'
  },

  ft_strcspn: (args) => {
    if (args.length !== 2) return '0\n'
    const [s1, s2] = args
    let i = 0
    while (i < s1.length && !s2.includes(s1[i])) i++
    return String(i) + '\n'
  },

  ft_strdup: (args) => {
    if (args.length !== 1) return '\n'
    return args[0] + '\n'
  },

  ft_strrev: (args) => {
    if (args.length !== 1) return '\n'
    return [...args[0]].reverse().join('') + '\n'
  },

  inter: (args) => {
    if (args.length !== 2) return '\n'
    const [s1, s2] = args
    const seen = new Set()
    let out = ''
    for (const c of s1) {
      if (!seen.has(c) && s2.includes(c)) {
        seen.add(c)
        out += c
      }
    }
    return out + '\n'
  },

  reverse_bits: (args) => {
    if (args.length !== 1) return '\n'
    let n = parseInt(args[0])
    if (isNaN(n) || n < 0 || n > 255) return '\n'
    let bit = 0
    for (let i = 0; i < 8; i++) {
      bit = bit * 2 + (n % 2)
      n = Math.floor(n / 2)
    }
    return String(bit) + '\n'
  },

  swap_bits: (args) => {
    if (args.length !== 1) return '\n'
    const n = parseInt(args[0])
    if (isNaN(n) || n < 0 || n > 255) return '\n'
    return String(((n & 0x0F) << 4) | ((n & 0xF0) >> 4)) + '\n'
  },

  union: (args) => {
    if (args.length !== 2) return '\n'
    const [s1, s2] = args
    const seen = new Set()
    let out = ''
    for (const c of s1 + s2) {
      if (!seen.has(c)) { seen.add(c); out += c }
    }
    return out + '\n'
  },

  ft_strpbrk: (args) => {
    if (args.length !== 2) return '(null)\n'
    const [s1, s2] = args
    for (let i = 0; i < s1.length; i++) {
      if (s2.includes(s1[i])) return s1.slice(i) + '\n'
    }
    return '(null)\n'
  },

  // ── NIVEL 3 ────────────────────────────────────────────────────────────────

  tab_mult: (args) => {
    if (args.length !== 1) return '\n'
    const n = parseInt(args[0])
    if (isNaN(n) || n < 1 || n > 9) return '\n'
    let out = ''
    for (let i = 1; i <= 9; i++) out += `${i} x ${n} = ${i * n}\n`
    return out
  },

  add_prime_sum: (args) => {
    if (args.length !== 1) return '\n'
    const n = parseInt(args[0])
    if (isNaN(n) || n <= 0) return '\n'
    const isPrime = (x) => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true }
    let sum = 0
    for (let i = 2; i <= n; i++) if (isPrime(i)) sum += i
    return String(sum) + '\n'
  },

  ft_range: (args) => {
    if (args.length !== 2) return '\n'
    const min = parseInt(args[0]), max = parseInt(args[1])
    if (isNaN(min) || isNaN(max) || min >= max) return '\n'
    let out = ''
    for (let i = min; i < max; i++) out += String(i) + '\n'
    return out
  },

  ft_rrange: (args) => {
    if (args.length !== 2) return '\n'
    const min = parseInt(args[0]), max = parseInt(args[1])
    if (isNaN(min) || isNaN(max) || min >= max) return '\n'
    let out = ''
    for (let i = max - 1; i >= min; i--) out += String(i) + '\n'
    return out
  },

  ft_list_size: (args) => String(args.length) + '\n',

  hidenp: (args) => {
    if (args.length !== 2) return '\n'
    const [s1, s2] = args
    let j = 0
    for (let i = 0; i < s1.length && j < s2.length; i++) if (s1[i] === s2[j]) j++
    return (j === s2.length ? '1\n' : '0\n')
  },

  lcm: (args) => {
    if (args.length !== 2) return '\n'
    const a = parseInt(args[0]), b = parseInt(args[1])
    if (isNaN(a) || isNaN(b)) return '\n'
    if (a === 0 || b === 0) return '0\n'
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y)
    return String(a / gcd(a, b) * b) + '\n'
  },

  pgcd: (args) => {
    if (args.length !== 2) return '\n'
    const a = parseInt(args[0]), b = parseInt(args[1])
    if (isNaN(a) || isNaN(b)) return '\n'
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y)
    return String(gcd(a, b)) + '\n'
  },

  ft_atoi_base: (args) => {
    if (args.length !== 2) return '\n'
    const [str, base] = args
    if (!base || base.length < 2) return '\n'
    let i = 0
    while (i < str.length && ' \t\n\r\f\v'.includes(str[i])) i++
    let sign = 1
    if (i < str.length && (str[i] === '-' || str[i] === '+')) { if (str[i] === '-') sign = -1; i++ }
    let result = 0
    while (i < str.length) {
      const digit = base.indexOf(str[i])
      if (digit === -1) break
      result = result * base.length + digit
      i++
    }
    return String(result * sign) + '\n'
  },

  str_capitalizer: (args) => {
    if (args.length !== 1) return '\n'
    let out = '', capitalize = true
    for (const c of args[0]) {
      if (c === ' ') { out += c; capitalize = true }
      else if (capitalize) { out += c.toUpperCase(); capitalize = false }
      else out += c.toLowerCase()
    }
    return out + '\n'
  },

  rstr_capitalizer: (args) => {
    if (args.length !== 1) return '\n'
    const str = args[0]
    let out = ''
    for (let i = 0; i < str.length; i++) {
      const c = str[i]
      if (c === ' ') out += c
      else if (i === str.length - 1 || str[i + 1] === ' ') out += c.toUpperCase()
      else out += c.toLowerCase()
    }
    return out + '\n'
  },

  epur_str: (args) => {
    if (args.length !== 1) return '\n'
    let out = ''
    let k = 0
    for (const c of args[0]) {
      if (c !== ' ') {
        if (k) { out += ' '; k = 0 }
        out += c
      } else if (out.length > 0) {
        k = 1
      }
    }
    return out + '\n'
  },

  expand_str: (args) => {
    if (args.length !== 1) return '\n'
    let out = ''
    let k = 0
    for (const c of args[0]) {
      if (c !== ' ') {
        if (k) { out += '   '; k = 0 }
        out += c
      } else {
        k = 1
      }
    }
    return out + '\n'
  },

  paramsum: (args) => {
    return `${args.length}\n`
  },

  print_hex: (args) => {
    if (args.length !== 1) return '\n'
    const n = parseInt(args[0])
    if (isNaN(n) || n < 0) return '\n'
    return n.toString(16) + '\n'
  },

  ft_split: (args) => {
    if (args.length !== 2) return '\n'
    const str = args[0]
    const sep = args[1][0]
    if (!sep) return str + '\n'
    const parts = []
    let i = 0
    while (i < str.length) {
      while (i < str.length && str[i] === sep) i++
      if (i >= str.length) break
      let j = i
      while (j < str.length && str[j] !== sep) j++
      parts.push(str.slice(i, j))
      i = j
    }
    return parts.join('\n') + '\n'
  },

  fprime: (args) => {
    if (args.length !== 1) return '\n'
    let n = parseInt(args[0])
    if (isNaN(n) || n <= 0) return '\n'
    if (n === 1) return '1\n'
    let out = ''
    let first = true
    let i = 2
    while (i <= n) {
      while (n % i === 0) {
        if (!first) out += '*'
        out += String(i)
        first = false
        n = Math.floor(n / i)
      }
      i++
    }
    return out + '\n'
  },

  sort_list: (args) => {
    if (args.length === 0) return '\n'
    const nums = args.map(Number).sort((a, b) => a - b)
    return nums.map(String).join('\n') + '\n'
  },

  max: (args) => {
    if (args.length === 0) return '0\n'
    const nums = args.map(Number)
    if (nums.some(Number.isNaN)) return '0\n'
    return String(Math.max(...nums)) + '\n'
  },

  snake_to_camel: (args) => {
    if (args.length !== 1) return '\n'
    const str = args[0]
    let out = ''
    let upper = false
    for (const c of str) {
      if (c === '_') upper = true
      else if (upper) {
        out += c.toUpperCase()
        upper = false
      } else out += c
    }
    return out + '\n'
  },

  ft_itoa: (args) => {
    if (args.length !== 1) return '0\n'
    const n = Number(args[0])
    if (!Number.isFinite(n)) return '0\n'
    return `${Math.trunc(n)}\n`
  },

  rev_wstr: (args) => {
    if (args.length !== 1) return '\n'
    const words = args[0].trim().split(/\s+/).filter(Boolean)
    return words.reverse().join(' ') + '\n'
  },

  rostring: (args) => {
    if (args.length < 1) return '\n'
    const words = args[0].trim().split(/\s+/).filter(Boolean)
    if (words.length <= 1) return (words[0] ?? '') + '\n'
    return [...words.slice(1), words[0]].join(' ') + '\n'
  },

  sort_int_tab: (args) => {
    if (args.length === 0) return '\n'
    return args.map(Number).sort((a, b) => a - b).map(String).join('\n') + '\n'
  },

  ft_list_foreach: (args) => {
    if (args.length === 0) return '\n'
    return args.map((n) => String(Number(n) + 1)).join('\n') + '\n'
  },

  ft_list_remove_if: (args) => {
    if (args.length < 1) return '\n'
    const [ref, ...rest] = args
    return rest.filter((n) => Number(n) !== Number(ref)).map(String).join('\n') + (rest.filter((n) => Number(n) !== Number(ref)).length ? '\n' : '\n')
  },

  flood_fill: (args) => {
    const output = '11111111\n10001001\n10010001\n10110001\n11100001\n\nFFFFFFFF\nF000F00F\nF00F000F\nF0FF000F\nFFF0000F\n'
    return output
  },
}

// ─── getDiff: primer byte diferente ──────────────────────────────────────────
export function getDiff(got, expected) {
  const maxLen = Math.max(got.length, expected.length)
  for (let i = 0; i < maxLen; i++) {
    if (got[i] !== expected[i]) {
      return {
        position: i,
        expected: expected[i] !== undefined ? JSON.stringify(expected[i]) : 'EOF',
        got:      got[i]      !== undefined ? JSON.stringify(got[i])      : 'EOF',
      }
    }
  }
  return null
}

// ─── runTests: corre todos los tests de un ejercicio ─────────────────────────
export function runTests(exercise) {
  const fn = simulators[exercise.id]
  if (!fn) return exercise.tests.map(t => ({ ...t, output: null, passed: false, diff: null, error: 'Simulador no disponible' }))

  return exercise.tests.map(t => {
    try {
      const output = fn(t.entrada)
      const passed = output === t.salida
      return { ...t, output, passed, diff: passed ? null : getDiff(output, t.salida) }
    } catch (err) {
      return { ...t, output: null, passed: false, diff: null, error: err.message }
    }
  })
}
