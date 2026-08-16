import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

const SPEED_LABELS = [
  { key: 'lento', label: 'Lento' },
  { key: 'normal', label: 'Normal' },
  { key: 'rapido', label: 'Rápido' },
]

/**
 * Barra de controles reutilizable para los motores de animación.
 * Recibe el objeto devuelto por useAnimationPlayer.
 * `stepLabel` (opcional) sustituye el "Paso X/Y" por una etiqueta propia del motor.
 */
export default function PlayerControls({ player, stepLabel = null }) {
  const {
    step,
    totalSteps,
    playing,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    speedKey,
    setSpeedKey,
  } = player

  const atStart = step === 0
  const atEnd = step >= totalSteps - 1
  const progress = totalSteps > 1 ? (step / (totalSteps - 1)) * 100 : 100

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={stepBack}
          disabled={atStart}
          title="Paso anterior"
          className={clsx(
            'p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors',
            atStart ? 'opacity-30' : 'hover:bg-zinc-50'
          )}
        >
          <ChevronLeft size={16} />
        </button>

        <button onClick={playing ? pause : play} className="btn-primary">
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? 'Pausa' : atEnd ? 'Repetir' : 'Reproducir'}
        </button>

        <button
          onClick={stepForward}
          disabled={atEnd}
          title="Paso siguiente"
          className={clsx(
            'p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors',
            atEnd ? 'opacity-30' : 'hover:bg-zinc-50'
          )}
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={reset}
          title="Reiniciar"
          className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          <RotateCcw size={16} />
        </button>

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-0.5">
          {SPEED_LABELS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSpeedKey(s.key)}
              className={clsx(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                speedKey === s.key
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-500 hover:bg-zinc-100'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-zinc-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-mono text-zinc-400 shrink-0 tabular-nums">
          {stepLabel ?? `Paso ${step + 1}/${totalSteps}`}
        </span>
      </div>
    </div>
  )
}
