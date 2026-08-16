import ftStrlen         from './exercises/level1/ft_strlen.js'
import ftSwap           from './exercises/level1/ft_swap.js'
import ftPutstr         from './exercises/level1/ft_putstr.js'
import ftStrcpy         from './exercises/level1/ft_strcpy.js'
import fizzbuzz         from './exercises/level1/fizzbuzz.js'
import firstWord        from './exercises/level1/first_word.js'
import revPrint         from './exercises/level1/rev_print.js'
import rotone           from './exercises/level1/rotone.js'
import rot13            from './exercises/level1/rot_13.js'
import repeatAlpha      from './exercises/level1/repeat_alpha.js'
import searchAndReplace from './exercises/level1/search_and_replace.js'
import ulstr            from './exercises/level1/ulstr.js'

import alphaMirror   from './exercises/level2/alpha_mirror.js'
import camelToSnake  from './exercises/level2/camel_to_snake.js'
import doOp          from './exercises/level2/do_op.js'
import max           from './exercises/level2/max.js'
import ftAtoi        from './exercises/level2/ft_atoi.js'
import ftStrcmp      from './exercises/level2/ft_strcmp.js'
import ftStrcspn     from './exercises/level2/ft_strcspn.js'
import ftStrdup      from './exercises/level2/ft_strdup.js'
import ftStrpbrk     from './exercises/level2/ft_strpbrk.js'
import ftStrrev      from './exercises/level2/ft_strrev.js'
import inter         from './exercises/level2/inter.js'
import isPowerOf2    from './exercises/level2/is_power_of_2.js'
import lastWord      from './exercises/level2/last_word.js'
import printBits     from './exercises/level2/print_bits.js'
import reverseBits   from './exercises/level2/reverse_bits.js'
import swapBits      from './exercises/level2/swap_bits.js'
import union         from './exercises/level2/union.js'
import wdmatch       from './exercises/level2/wdmatch.js'
import snakeToCamel  from './exercises/level2/snake_to_camel.js'

import paramsum        from './exercises/level3/paramsum.js'
import tabMult         from './exercises/level3/tab_mult.js'
import epurStr         from './exercises/level3/epur_str.js'
import expandStr       from './exercises/level3/expand_str.js'
import addPrimeSum     from './exercises/level3/add_prime_sum.js'
import ftRange         from './exercises/level3/ft_range.js'
import ftRrange        from './exercises/level3/ft_rrange.js'
import ftListSize      from './exercises/level3/ft_list_size.js'
import hidenp          from './exercises/level3/hidenp.js'
import lcm             from './exercises/level3/lcm.js'
import pgcd            from './exercises/level3/pgcd.js'
import printHex        from './exercises/level3/print_hex.js'
import ftAtoiBase      from './exercises/level3/ft_atoi_base.js'
import ftItoa          from './exercises/level4/ft_itoa.js'
import strCapitalizer  from './exercises/level3/str_capitalizer.js'
import rstrCapitalizer from './exercises/level3/rstr_capitalizer.js'

import fprime    from './exercises/level4/fprime.js'
import ftSplit   from './exercises/level4/ft_split.js'
import sortList  from './exercises/level4/sort_list.js'
import revWstr   from './exercises/level4/rev_wstr.js'
import rostring  from './exercises/level4/rostring.js'
import sortIntTab from './exercises/level4/sort_int_tab.js'
import ftListForeach from './exercises/level4/ft_list_foreach.js'
import ftListRemoveIf from './exercises/level4/ft_list_remove_if.js'
import floodFill from './exercises/level4/flood_fill.js'

// ─── Nivel 1 — Cocina ────────────────────────────────────────────────────────
const nivel1 = [
  ftStrlen,
  ftSwap,
  ftPutstr,
  ftStrcpy,
  fizzbuzz,
  firstWord,
  revPrint,
  rotone,
  rot13,
  repeatAlpha,
  searchAndReplace,
  ulstr,
]

// ─── Nivel 2 — Salón ─────────────────────────────────────────────────────────
const nivel2 = [
  alphaMirror,
  camelToSnake,
  doOp,
  max,
  ftAtoi,
  ftStrcmp,
  ftStrcspn,
  ftStrdup,
  ftStrpbrk,
  ftStrrev,
  inter,
  isPowerOf2,
  lastWord,
  printBits,
  reverseBits,
  swapBits,
  union,
  wdmatch,
  snakeToCamel,
]

// ─── Nivel 3 — Dormitorio ────────────────────────────────────────────────────
const nivel3 = [
  paramsum,
  tabMult,
  epurStr,
  expandStr,
  addPrimeSum,
  ftRange,
  ftRrange,
  ftListSize,
  hidenp,
  lcm,
  pgcd,
  printHex,
  ftAtoiBase,
  ftItoa,
  strCapitalizer,
  rstrCapitalizer,
]

// ─── Nivel 4 — Garaje ────────────────────────────────────────────────────────
const nivel4 = [
  fprime,
  ftSplit,
  sortList,
  revWstr,
  rostring,
  sortIntTab,
  ftListForeach,
  ftListRemoveIf,
  floodFill,
]

// ─── Exports ─────────────────────────────────────────────────────────────────
export const exercisesByLevel = {
  1: nivel1,
  2: nivel2,
  3: nivel3,
  4: nivel4,
}

export const allExercises = [...nivel1, ...nivel2, ...nivel3, ...nivel4]

const exerciseMap = Object.fromEntries(allExercises.map(ex => [ex.id, ex]))

export function getExercise(id) {
  return exerciseMap[id] ?? null
}

export function getNextExercise(id) {
  const idx = allExercises.findIndex(ex => ex.id === id)
  if (idx === -1 || idx === allExercises.length - 1) return null
  return allExercises[idx + 1]
}

export function getPrevExercise(id) {
  const idx = allExercises.findIndex(ex => ex.id === id)
  if (idx <= 0) return null
  return allExercises[idx - 1]
}

export function getExercisesByLevel(nivel) {
  return exercisesByLevel[nivel] ?? []
}

export function getExercisesForExam(nivelesIncluidos = [1, 2, 3, 4]) {
  return allExercises.filter(ex => nivelesIncluidos.includes(ex.nivel))
}
