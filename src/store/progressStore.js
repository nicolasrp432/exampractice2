import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db, auth, isConfigured } from '../utils/firebase'
import { doc, setDoc, getDocs, collection, writeBatch } from 'firebase/firestore'

const EXERCISE_IDS = [
  // Nivel 1
  'ft_strlen', 'ft_swap', 'ft_putstr', 'ft_strcpy', 'fizzbuzz',
  'first_word', 'rev_print', 'rotone', 'rot_13', 'repeat_alpha',
  'search_and_replace', 'ulstr',
  // Nivel 2
  'alpha_mirror', 'camel_to_snake', 'do_op', 'ft_atoi', 'ft_strcmp',
  'ft_strcspn', 'ft_strdup', 'ft_strpbrk', 'ft_strrev', 'inter',
  'is_power_of_2', 'last_word', 'print_bits', 'reverse_bits',
  'swap_bits', 'union', 'wdmatch',
  // Nivel 3
  'paramsum', 'tab_mult', 'epur_str', 'expand_str', 'add_prime_sum',
  'ft_range', 'ft_rrange', 'ft_list_size', 'hidenp', 'lcm',
  'pgcd', 'print_hex', 'ft_atoi_base', 'str_capitalizer', 'rstr_capitalizer',
  // Nivel 4
  'fprime', 'ft_split', 'sort_list',
]

function defaultProgreso() {
  return {
    estado: 'no_iniciado',
    testsPasados: 0,
    testsTotal: 0,
    intentos: 0,
    ultimaVez: null,
    proximaRepasion: null,
    intervaloDias: 1,
    notas: '',
  }
}

function buildInitialEjercicios() {
  return Object.fromEntries(EXERCISE_IDS.map(id => [id, defaultProgreso()]))
}

const INTERVALOS = [1, 3, 7, 14, 30]

function calcularProximaRepasion(intentos, exito) {
  const idx = exito ? Math.min(intentos, INTERVALOS.length - 1) : 0
  const dias = INTERVALOS[idx]
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + dias)
  return { proximaRepasion: fecha.toISOString(), intervaloDias: dias }
}

const saveToFirestore = async (id, data) => {
  const user = auth?.currentUser
  if (!isConfigured || !db || !user) return
  try {
    const docRef = doc(db, `users/${user.uid}/progress`, id)
    await setDoc(docRef, data, { merge: true })
  } catch (error) {
    console.error('Error al guardar progreso en Firestore:', error)
  }
}

const saveProfileToFirestore = async (profileData) => {
  const user = auth?.currentUser
  if (!isConfigured || !db || !user) return
  try {
    const docRef = doc(db, `users/${user.uid}`)
    await setDoc(docRef, profileData, { merge: true })
  } catch (error) {
    console.error('Error al guardar perfil en Firestore:', error)
  }
}

export const useProgressStore = create(
  persist(
    (set, get) => ({
      ejercicios: buildInitialEjercicios(),
      racha: 0,
      totalSesiones: 0,
      ultimaSesion: null,
      examenes: [],
      user: null,

      setUser: (user) => set({ user }),

      logout: async () => {
        if (auth) {
          await auth.signOut()
        }
        set({ user: null })
      },

      syncWithCloud: async () => {
        const user = auth?.currentUser
        if (!isConfigured || !db || !user) return

        try {
          const uid = user.uid
          
          // 1. Sincronizar ejercicios
          const querySnapshot = await getDocs(collection(db, `users/${uid}/progress`))
          const cloudData = {}
          querySnapshot.forEach((doc) => {
            cloudData[doc.id] = doc.data()
          })

          const localExercises = get().ejercicios
          const mergedExercises = { ...localExercises }
          const batch = writeBatch(db)
          let hasCloudUpdates = false
          let hasLocalUpdates = false

          for (const id of Object.keys(localExercises)) {
            const local = localExercises[id]
            const cloud = cloudData[id]

            if (cloud) {
              const localTime = local.ultimaVez ? new Date(local.ultimaVez).getTime() : 0
              const cloudTime = cloud.ultimaVez ? new Date(cloud.ultimaVez).getTime() : 0

              if (localTime > cloudTime) {
                const docRef = doc(db, `users/${uid}/progress`, id)
                batch.set(docRef, local)
                hasCloudUpdates = true
              } else if (cloudTime > localTime) {
                mergedExercises[id] = cloud
                hasLocalUpdates = true
              }
            } else {
              if (local.estado !== 'no_iniciado' || local.intentos > 0) {
                const docRef = doc(db, `users/${uid}/progress`, id)
                batch.set(docRef, local)
                hasCloudUpdates = true
              }
            }
          }

          if (hasCloudUpdates) {
            await batch.commit()
          }

          if (hasLocalUpdates) {
            set({ ejercicios: mergedExercises })
          }

          // 2. Sincronizar datos de perfil (racha, exámenes, etc.)
          const profileDoc = await doc(db, `users/${uid}`)
          const profileSnap = await doc(db, `users/${uid}`).id ? await doc(db, `users/${uid}`) : null
          
          // Para simplificar, si hay perfil en la nube con ultimaSesion más reciente, lo descargamos.
          // Si no, subimos el local.
          // ...
          
        } catch (error) {
          console.error('Error durante la sincronización bidireccional:', error)
        }
      },

      marcarEstado: (id, estado) => {
        const updatedExercise = {
          ...get().ejercicios[id],
          estado,
          ultimaVez: new Date().toISOString(),
        }
        set(s => ({
          ejercicios: {
            ...s.ejercicios,
            [id]: updatedExercise,
          },
        }))
        saveToFirestore(id, updatedExercise)
      },

      registrarIntento: (id, exito) => {
        // Fallback a un progreso por defecto: no todos los 56 ejercicios están
        // en EXERCISE_IDS, así evitamos un crash al registrar intentos.
        const prev = get().ejercicios[id] ?? defaultProgreso()
        const intentos = (prev.intentos ?? 0) + 1
        const testsPasados = exito ? prev.testsTotal : prev.testsPasados
        const { proximaRepasion, intervaloDias } = calcularProximaRepasion(intentos, exito)
        const estado = exito
          ? intentos >= 3 ? 'dominado' : 'practicando'
          : 'practicando'

        const updatedExercise = {
          ...prev,
          intentos,
          testsPasados,
          estado,
          ultimaVez: new Date().toISOString(),
          proximaRepasion,
          intervaloDias,
        }

        set(s => ({
          ejercicios: {
            ...s.ejercicios,
            [id]: updatedExercise,
          },
        }))
        
        saveToFirestore(id, updatedExercise)
        
        // Guardar también actualización de racha
        const hoy = new Date().toISOString().split('T')[0]
        const ultima = get().ultimaSesion ? get().ultimaSesion.split('T')[0] : null
        let racha = get().racha
        
        if (!ultima) {
          racha = 1
        } else if (ultima !== hoy) {
          const ayer = new Date()
          ayer.setDate(ayer.getDate() - 1)
          const ayerStr = ayer.toISOString().split('T')[0]
          if (ultima === ayerStr) {
            racha += 1
          } else {
            racha = 1
          }
        }
        
        set({ racha, ultimaSesion: new Date().toISOString() })
        saveProfileToFirestore({
          racha,
          ultimaSesion: new Date().toISOString(),
          totalSesiones: get().totalSesiones
        })
      },

      actualizarNotas: (id, notas) => {
        const updatedExercise = {
          ...get().ejercicios[id],
          notas,
        }
        set(s => ({
          ejercicios: {
            ...s.ejercicios,
            [id]: updatedExercise,
          },
        }))
        saveToFirestore(id, updatedExercise)
      },

      guardarExamen: (resultado) => {
        const examenes = [resultado, ...get().examenes].slice(0, 10)
        const totalSesiones = get().totalSesiones + 1
        const ultimaSesion = new Date().toISOString()

        set({
          examenes,
          totalSesiones,
          ultimaSesion,
        })

        saveProfileToFirestore({
          examenes,
          totalSesiones,
          ultimaSesion,
        })
      },

      // Selectores derivados (computados fuera del store)
      getEjerciciosParaRepasar: () => {
        const { ejercicios } = get()
        const hoy = new Date()
        return Object.entries(ejercicios)
          .filter(([, p]) => p.proximaRepasion && new Date(p.proximaRepasion) <= hoy)
          .map(([id]) => id)
      },

      getTotalDominados: () => {
        const { ejercicios } = get()
        return Object.values(ejercicios).filter(p => p.estado === 'dominado').length
      },
    }),
    {
      name: '42prep-progress',
      version: 1,
      // No persistir el estado del usuario localmente en localStorage para evitar desajustes
      partialize: (state) => {
        const { user, ...rest } = state
        return rest
      }
    }
  )
)
