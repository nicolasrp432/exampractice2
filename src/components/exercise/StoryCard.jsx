import { Link } from 'react-router-dom'
import { Map } from 'lucide-react'
import clsx from 'clsx'
import AnchorChips from './AnchorChips'

const ROOM_COLORS = {
  cocina:     { border: 'border-purple-400', bg: 'bg-purple-50'  },
  salón:      { border: 'border-green-400',  bg: 'bg-green-50'   },
  dormitorio: { border: 'border-orange-400', bg: 'bg-orange-50'  },
  garaje:     { border: 'border-red-400',    bg: 'bg-red-50'     },
}

export default function StoryCard({ palacio = {}, relacionados = [] }) {
  if (!palacio?.historia) {
    return (
      <div className="py-10 text-center text-zinc-400">
        <p className="text-3xl mb-2">🚧</p>
        <p className="text-sm">Historia no disponible todavía</p>
      </div>
    )
  }

  const colors = ROOM_COLORS[palacio.habitacion] ?? { border: 'border-zinc-300', bg: 'bg-zinc-50' }

  return (
    <div className="space-y-4">
      {/* Card principal */}
      <div className={clsx('border-l-4 rounded-r-xl px-5 py-4', colors.border, colors.bg)}>
        <div className="flex items-start gap-3 mb-3">
          <span className="text-5xl leading-none shrink-0">{palacio.emoji}</span>
          <div>
            <p className="font-bold text-zinc-900 text-base">{palacio.personaje}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              📍 {palacio.habitacion}{palacio.mueble ? ` · ${palacio.mueble}` : ''}
            </p>
          </div>
        </div>
        <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">{palacio.historia}</p>
      </div>

      {/* Anclas */}
      {palacio.anclas?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">⚓ Anclas mnemotécnicas</p>
          <AnchorChips anclas={palacio.anclas} />
        </div>
      )}

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">🔗 Ejercicios relacionados</p>
          <div className="flex flex-wrap gap-2">
            {relacionados.map(id => (
              <Link key={id} to={`/ejercicio/${id}`}
                className="text-xs px-2.5 py-1 rounded-md border border-zinc-200
                           hover:bg-zinc-50 text-zinc-600 font-mono transition-colors">
                {id}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link to="/palacio" className="inline-flex items-center gap-1.5 text-sm text-zinc-400
                                      hover:text-zinc-700 transition-colors">
        <Map size={14} /> Ver en el Palacio de la Memoria
      </Link>
    </div>
  )
}
