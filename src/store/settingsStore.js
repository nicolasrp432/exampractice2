import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      tema: 'light',
      idioma: 'es',
      timerExamen: 180,
      nivelesExamen: [1, 2, 3, 4],
      mostrarPistas: true,
      autoReveal: false,
      strictMoulinette: true,
      geminiApiKey: '',

      setTimerExamen: (mins) => set({ timerExamen: mins }),
      setNivelesExamen: (niveles) => set({ nivelesExamen: niveles }),
      togglePistas: () => set(s => ({ mostrarPistas: !s.mostrarPistas })),
      setAutoReveal: (v) => set({ autoReveal: v }),
      toggleStrictMoulinette: () => set(s => ({ strictMoulinette: !s.strictMoulinette })),
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      toggleNivel: (nivel) =>
        set(s => ({
          nivelesExamen: s.nivelesExamen.includes(nivel)
            ? s.nivelesExamen.filter(n => n !== nivel)
            : [...s.nivelesExamen, nivel].sort(),
        })),
    }),
    { name: '42prep-settings' }
  )
)
