import clsx from 'clsx'

const LEVEL_CONFIG = {
  1: { label: 'Nivel 1', room: 'Cocina',     bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  2: { label: 'Nivel 2', room: 'Salón',      bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500'  },
  3: { label: 'Nivel 3', room: 'Dormitorio', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  4: { label: 'Nivel 4', room: 'Garaje',     bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'    },
}

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export default function LevelBadge({ nivel, tamaño = 'md', showRoom = false, className = '' }) {
  const config = LEVEL_CONFIG[nivel]
  if (!config) return null

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border',
        config.bg,
        config.text,
        config.border,
        SIZE_CLASSES[tamaño],
        className
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
      {showRoom ? config.room : config.label}
    </span>
  )
}

export { LEVEL_CONFIG }
