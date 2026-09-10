import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BUILTIN_FLASHCARDS } from '@/data/flashcardsData'
import { db, auth, isConfigured } from '@/utils/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

/**
 * Motor de Repetición Espaciada tipo Anki (SuperMemo-2 modificado)
 * Calificaciones:
 * 1. 'otra_vez' (Again) -> intervalo 0 (repasar en la misma sesión o <10 min), baja factor de facilidad
 * 2. 'dificil'  (Hard)  -> incremento de intervalo conservador (* 1.2), baja ligeramente factor
 * 3. 'bien'     (Good)  -> intervalo estándar (* factor de facilidad)
 * 4. 'facil'    (Easy)  -> gran salto de intervalo (* factor * 1.3), sube factor de facilidad
 */

export function calculateNextSM2(prevProgress, rating) {
  const current = prevProgress || {
    state: 'nueva',
    repeticiones: 0,
    factorFacilidad: 2.5,
    intervaloDias: 0,
    proximaFecha: new Date().toISOString(),
    ultimoRepaso: null,
    historial: [],
  }

  let reps = current.repeticiones || 0
  let ef = current.factorFacilidad || 2.5
  let interval = current.intervaloDias || 0
  let state = current.state || 'nueva'

  const now = new Date()

  if (rating === 'otra_vez') {
    reps = 0
    interval = 0
    ef = Math.max(1.3, Number((ef - 0.2).toFixed(2)))
    state = 'aprendizaje'
    // Se agenda para dentro de 10 minutos (misma sesión)
    now.setMinutes(now.getMinutes() + 10)
  } else if (rating === 'dificil') {
    reps = reps + 1
    interval = interval === 0 ? 1 : Math.max(1, Math.round(interval * 1.2))
    ef = Math.max(1.3, Number((ef - 0.15).toFixed(2)))
    state = interval >= 14 ? 'dominada' : 'repaso'
    now.setDate(now.getDate() + interval)
  } else if (rating === 'bien') {
    reps = reps + 1
    if (reps === 1) {
      interval = 1
    } else if (reps === 2) {
      interval = 3
    } else {
      interval = Math.max(1, Math.round(interval * ef))
    }
    state = interval >= 14 ? 'dominada' : 'repaso'
    now.setDate(now.getDate() + interval)
  } else if (rating === 'facil') {
    reps = reps + 1
    if (reps === 1) {
      interval = 3
    } else {
      interval = Math.max(1, Math.round((interval || 1) * ef * 1.3))
    }
    ef = Number((ef + 0.15).toFixed(2))
    state = 'dominada'
    now.setDate(now.getDate() + interval)
  }

  return {
    state,
    repeticiones: reps,
    factorFacilidad: ef,
    intervaloDias: interval,
    proximaFecha: now.toISOString(),
    ultimoRepaso: new Date().toISOString(),
    historial: [
      ...(current.historial || []).slice(-19),
      {
        fecha: new Date().toISOString(),
        calificacion: rating,
        intervalo: interval,
      },
    ],
  }
}

export function getPreviewIntervals(cardProgress) {
  const current = cardProgress || {
    repeticiones: 0,
    factorFacilidad: 2.5,
    intervaloDias: 0,
  }

  const ef = current.factorFacilidad || 2.5
  const interval = current.intervaloDias || 0
  const reps = current.repeticiones || 0

  // Otra vez
  const tAgain = '<10m'

  // Difícil
  const dDiff = interval === 0 ? 1 : Math.max(1, Math.round(interval * 1.2))
  const tDiff = `${dDiff}d`

  // Bien
  let dGood = 1
  if (reps === 0) dGood = 1
  else if (reps === 1) dGood = 3
  else dGood = Math.max(1, Math.round(interval * ef))
  const tGood = `${dGood}d`

  // Fácil
  let dEasy = 3
  if (reps === 0) dEasy = 3
  else dEasy = Math.max(1, Math.round((interval || 1) * ef * 1.3))
  const tEasy = `${dEasy}d`

  return {
    otra_vez: tAgain,
    dificil: tDiff,
    bien: tGood,
    facil: tEasy,
  }
}

const syncFlashcardsToCloud = async (progressMap, customCards) => {
  const user = auth?.currentUser
  if (!isConfigured || !db || !user || !user.uid) return
  try {
    const docRef = doc(db, `users/${user.uid}/flashcard_data`, 'anki_state')
    await setDoc(docRef, {
      progressMap,
      customCards,
      updatedAt: new Date().toISOString(),
    }, { merge: true })
  } catch (err) {
    console.warn('Sync flashcards notice:', err?.message)
  }
}

export const useFlashcardStore = create(
  persist(
    (set, get) => ({
      // Lista de tarjetas adicionales (generadas con IA o creadas manualmente)
      customCards: [],
      // Progreso de repetición espaciada por id de tarjeta: { [id]: CardProgress }
      progressMap: {},

      // Obtener todas las tarjetas combinadas (predefinidas + custom)
      getAllCards: () => {
        const custom = get().customCards || []
        // Evitar duplicados por id
        const customIds = new Set(custom.map(c => c.id))
        const builtins = BUILTIN_FLASHCARDS.filter(c => !customIds.has(c.id))
        return [...builtins, ...custom]
      },

      // Registrar una revisión con calificación de Anki
      reviewCard: (cardId, rating) => {
        const state = get()
        const prev = state.progressMap[cardId]
        const next = calculateNextSM2(prev, rating)

        const newProgressMap = {
          ...state.progressMap,
          [cardId]: next,
        }

        set({ progressMap: newProgressMap })
        syncFlashcardsToCloud(newProgressMap, state.customCards)
      },

      // Añadir una nueva tarjeta individual
      addCard: (card) => {
        const state = get()
        const newCard = {
          ...card,
          id: card.id || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          origen: card.origen || 'personalizada',
        }
        const newCustomCards = [newCard, ...state.customCards]
        set({ customCards: newCustomCards })
        syncFlashcardsToCloud(state.progressMap, newCustomCards)
        return newCard
      },

      // Añadir lote de tarjetas (ej: generadas con IA)
      addCards: (cardsArray) => {
        const state = get()
        const formatted = cardsArray.map((c, i) => ({
          ...c,
          id: c.id || `ia-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          origen: c.origen || 'ia',
        }))
        const newCustomCards = [...formatted, ...state.customCards]
        set({ customCards: newCustomCards })
        syncFlashcardsToCloud(state.progressMap, newCustomCards)
        return formatted
      },

      // Eliminar una tarjeta personalizada
      deleteCard: (cardId) => {
        const state = get()
        const newCustomCards = state.customCards.filter(c => c.id !== cardId)
        const newProgressMap = { ...state.progressMap }
        delete newProgressMap[cardId]
        set({ customCards: newCustomCards, progressMap: newProgressMap })
        syncFlashcardsToCloud(newProgressMap, newCustomCards)
      },

      // Editar una tarjeta
      updateCard: (cardId, updatedData) => {
        const state = get()
        const newCustomCards = state.customCards.map(c => 
          c.id === cardId ? { ...c, ...updatedData } : c
        )
        set({ customCards: newCustomCards })
        syncFlashcardsToCloud(state.progressMap, newCustomCards)
      },

      // Reiniciar progreso de una tarjeta específica
      resetCardProgress: (cardId) => {
        const state = get()
        const newProgressMap = { ...state.progressMap }
        delete newProgressMap[cardId]
        set({ progressMap: newProgressMap })
        syncFlashcardsToCloud(newProgressMap, state.customCards)
      },

      // Reiniciar todo el progreso del mazo
      resetDeckProgress: () => {
        set({ progressMap: {} })
        syncFlashcardsToCloud({}, get().customCards)
      },

      // Sincronizar con la nube al iniciar sesión
      syncWithCloud: async () => {
        const user = auth?.currentUser
        if (!isConfigured || !db || !user || !user.uid) return
        try {
          const docRef = doc(db, `users/${user.uid}/flashcard_data`, 'anki_state')
          const snap = await getDoc(docRef)
          if (snap.exists()) {
            const data = snap.data()
            if (data?.progressMap) {
              set(s => ({
                progressMap: { ...s.progressMap, ...data.progressMap },
                customCards: data.customCards?.length ? data.customCards : s.customCards,
              }))
            }
          }
        } catch (err) {
          console.warn('Sync flashcard state error:', err?.message)
        }
      },
    }),
    {
      name: '42prep-anki-flashcards',
      version: 1,
    }
  )
)
