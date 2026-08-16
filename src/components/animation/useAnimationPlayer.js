import { useState, useEffect, useCallback, useRef } from 'react'

// Velocidades en ms por paso (lento / normal / rápido)
export const PLAYER_SPEEDS = { lento: 1000, normal: 500, rapido: 200 }

/**
 * Hook compartido por todos los motores de animación de ejercicios.
 * Gestiona el índice de paso, reproducción automática, velocidad y controles.
 * Cada motor calcula sus propios "fotogramas" y solo consume `step`.
 */
export function useAnimationPlayer(totalSteps) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedKey, setSpeedKey] = useState('normal')
  const timer = useRef(null)

  const safeTotal = Math.max(1, totalSteps)

  // Si el total cambia (nueva config), reseteamos para no quedar fuera de rango.
  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [totalSteps])

  useEffect(() => {
    if (!playing) return undefined
    if (step >= safeTotal - 1) {
      setPlaying(false)
      return undefined
    }
    timer.current = setTimeout(
      () => setStep((s) => Math.min(s + 1, safeTotal - 1)),
      PLAYER_SPEEDS[speedKey]
    )
    return () => clearTimeout(timer.current)
  }, [playing, step, speedKey, safeTotal])

  const play = useCallback(() => {
    setStep((s) => (s >= safeTotal - 1 ? 0 : s))
    setPlaying(true)
  }, [safeTotal])

  const pause = useCallback(() => setPlaying(false), [])

  const reset = useCallback(() => {
    setPlaying(false)
    setStep(0)
  }, [])

  const stepForward = useCallback(
    () => setStep((s) => Math.min(s + 1, safeTotal - 1)),
    [safeTotal]
  )

  const stepBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), [])

  return {
    step,
    setStep,
    playing,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    speedKey,
    setSpeedKey,
    totalSteps: safeTotal,
  }
}
