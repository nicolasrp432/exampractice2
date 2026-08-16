import { AlertTriangle, Skull } from 'lucide-react'
import clsx from 'clsx'

function CodeBlock({ code, variant }) {
  const styles = {
    bad:  { bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-800',   label: '❌ MAL',  labelColor: 'text-red-500'   },
    good: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', label: '✅ BIEN', labelColor: 'text-green-600' },
  }
  const s = styles[variant]
  return (
    <div className={clsx('rounded-lg border p-3', s.bg, s.border)}>
      <p className={clsx('text-[10px] font-bold mb-1.5 uppercase tracking-wide', s.labelColor)}>{s.label}</p>
      <pre className={clsx('text-xs font-mono whitespace-pre-wrap leading-relaxed', s.text)}>{code}</pre>
    </div>
  )
}

export default function TrapsList({ trampas = [] }) {
  if (!trampas.length) {
    return <p className="text-sm text-zinc-400 text-center py-6">No hay trampas registradas todavía</p>
  }

  return (
    <div className="space-y-4">
      {trampas.map((t, i) => (
        <div
          key={i}
          className={clsx('card p-4 border-l-4',
            t.severidad === 'mortal' ? 'border-red-400' : 'border-orange-400'
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            {t.severidad === 'mortal'
              ? <Skull size={14} className="text-red-500 shrink-0" />
              : <AlertTriangle size={14} className="text-orange-500 shrink-0" />
            }
            <span className={clsx('text-xs font-bold uppercase tracking-wide',
              t.severidad === 'mortal' ? 'text-red-600' : 'text-orange-600'
            )}>
              {t.severidad === 'mortal' ? '☠ Mortal' : '⚠ Warning'}
            </span>
            <span className="text-sm font-semibold text-zinc-800">{t.titulo}</span>
          </div>
          <p className="text-xs text-zinc-500 mb-3 ml-6">{t.descripcion}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <CodeBlock code={t.codigoMal}  variant="bad"  />
            <CodeBlock code={t.codigoBien} variant="good" />
          </div>
        </div>
      ))}
    </div>
  )
}
