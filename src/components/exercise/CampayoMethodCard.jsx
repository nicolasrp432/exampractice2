import { Link } from 'react-router-dom'
import clsx from 'clsx'

const ROOM_COLORS = {
  cocina:     { border: 'border-purple-400', bg: 'bg-purple-50',  text: 'text-purple-700'  },
  'salón':    { border: 'border-green-400',  bg: 'bg-green-50',   text: 'text-green-700'   },
  dormitorio: { border: 'border-orange-400', bg: 'bg-orange-50',  text: 'text-orange-700'  },
  garaje:     { border: 'border-red-400',    bg: 'bg-red-50',     text: 'text-red-700'     },
}

function Step({ number, title, color, children }) {
  return (
    <div className={clsx('rounded-2xl border-l-4 p-4 space-y-2', color.border, color.bg)}>
      <div className="flex items-center gap-2">
        <span className={clsx('h-6 w-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 text-white', color.badge)}>
          {number}
        </span>
        <p className={clsx('text-xs font-bold uppercase tracking-wide', color.text)}>{title}</p>
      </div>
      {children}
    </div>
  )
}

export default function CampayoMethodCard({ exercise }) {
  const { campayoMetodo, palacio, relacionados = [] } = exercise

  if (!campayoMetodo) {
    return (
      <div className="py-16 text-center text-zinc-400">
        <p className="text-4xl mb-3">🚧</p>
        <p className="text-sm">Metodología Campayo en construcción para este ejercicio</p>
      </div>
    )
  }

  const roomColor = ROOM_COLORS[palacio?.habitacion] ?? { border: 'border-zinc-300', bg: 'bg-zinc-50', text: 'text-zinc-600' }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🧠</span>
        <h2 className="text-sm font-bold text-zinc-800">Sistema Ramón Campayo — 5 pasos</h2>
      </div>

      {/* Paso 1 — Feynman */}
      <Step number={1} title="Comprende la lógica · Método Feynman" color={{ border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-500' }}>
        <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
          {campayoMetodo.feynman}
        </p>
        <p className="text-[11px] text-blue-500 italic">
          Explícalo en voz alta como si se lo contaras a un niño de 5 años. Si no puedes, no lo has entendido aún.
        </p>
      </Step>

      {/* Paso 2 — Datos Puros */}
      <Step number={2} title="Aísla los Datos Puros" color={{ border: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-500' }}>
        <p className="text-[11px] text-amber-600 mb-2">
          Lo que NO puedes deducir por lógica y debes memorizar literalmente:
        </p>
        <div className="space-y-2">
          {campayoMetodo.datosPuros.map((d, i) => (
            <div key={i} className="flex items-start gap-2 bg-white rounded-lg px-3 py-2 border border-amber-100">
              <code className="text-xs font-mono font-bold text-amber-800 shrink-0 mt-0.5">{d.elemento}</code>
              {d.nota && <span className="text-[11px] text-zinc-500">— {d.nota}</span>}
            </div>
          ))}
        </div>
      </Step>

      {/* Paso 3 — Asociaciones Inverosímiles */}
      <Step number={3} title="Asociaciones Inverosímiles" color={{ border: 'border-pink-400', bg: 'bg-pink-50', text: 'text-pink-700', badge: 'bg-pink-500' }}>
        <p className="text-[11px] text-pink-600 mb-2">
          Imágenes absurdas y ridículas — cuanto más exageradas, mejor las recuerda el cerebro:
        </p>
        <div className="space-y-2">
          {campayoMetodo.asociaciones.map((a, i) => (
            <div key={i} className="rounded-xl bg-white border border-pink-100 p-3">
              <code className="text-[11px] font-mono font-bold text-pink-700 block mb-1">{a.dato}</code>
              <p className="text-xs text-zinc-700 leading-relaxed">🎨 {a.imagen}</p>
            </div>
          ))}
        </div>
      </Step>

      {/* Paso 4 — Palacio de la Memoria */}
      {palacio && (
        <Step number={4} title="Palacio de la Memoria" color={{ border: roomColor.border, bg: roomColor.bg, text: roomColor.text, badge: 'bg-zinc-600' }}>
          <div className="flex items-start gap-3">
            <span className="text-4xl shrink-0">{palacio.emoji}</span>
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-800">{palacio.personaje}</p>
              <p className="text-xs text-zinc-500">
                📍 {palacio.habitacion}{palacio.mueble ? ` · ${palacio.mueble}` : ''}
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line mt-1">{palacio.historia}</p>
            </div>
          </div>
          {palacio.anclas?.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">⚓ Anclas</p>
              <div className="flex flex-wrap gap-1.5">
                {palacio.anclas.map((a, i) => (
                  <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-700">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Step>
      )}

      {/* Paso 5 — Sentidos + Repetición Espaciada */}
      <Step number={5} title="Todos los sentidos · Repetición Espaciada" color={{ border: 'border-green-400', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-500' }}>
        <ul className="space-y-1.5 text-sm text-zinc-700">
          <li className="flex gap-2"><span>✍️</span><span>Escribe el código a mano mientras lo dices en voz alta</span></li>
          <li className="flex gap-2"><span>🗣️</span><span>Gesticula y muévete mientras explicas cada paso</span></li>
          <li className="flex gap-2"><span>👁️</span><span>Visualiza la imagen absurda antes de escribir cada línea clave</span></li>
          <li className="flex gap-2"><span>📅</span><span>Repasa hoy, mañana, en 1 semana y en 1 mes (sistema Leitner)</span></li>
        </ul>
        <Link
          to="/progreso"
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-green-700 hover:text-green-900 underline"
        >
          Ver mi calendario de repasos →
        </Link>
        {relacionados.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">🔗 Ejercicios relacionados</p>
            <div className="flex flex-wrap gap-1.5">
              {relacionados.map(id => (
                <Link key={id} to={`/ejercicio/${id}`}
                  className="text-xs px-2.5 py-1 rounded-md border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-mono transition-colors">
                  {id}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Step>
    </div>
  )
}
