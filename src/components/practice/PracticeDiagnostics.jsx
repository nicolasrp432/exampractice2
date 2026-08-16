import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, Wand2 } from 'lucide-react'
import { classifyFailure } from '@/utils/diagnostics/heuristics'

const SEVERITY_STYLES = {
  mortal:  { row: 'border-red-200 bg-red-50',     text: 'text-red-700',    Icon: AlertTriangle },
  warning: { row: 'border-amber-200 bg-amber-50', text: 'text-amber-700',  Icon: AlertCircle   },
  info:    { row: 'border-blue-200 bg-blue-50',   text: 'text-blue-700',   Icon: Info          },
}

/**
 * PracticeDiagnostics
 *
 * Recibe los resultados de los tests del ejercicio (los que ya gestiona
 * PracticeMode) y muestra:
 *   - El primer test que falla, con su diagnóstico heurístico.
 *   - Botón para expandir y ver el resto de fallos, cada uno con su sugerencia.
 *
 * Props:
 *   - tests:    array de { id, entrada, salida, status, output, ... }
 *   - exercise: el ejercicio completo (para tipoEntrega y contexto)
 *   - onInspect: (test) => void  — callback opcional para abrir el detalle
 *
 * Componente puro: no hace fetch, solo presenta lo que ya tiene PracticeMode.
 */
export default function PracticeDiagnostics({ tests = [], exercise, onInspect }) {
  const [expanded, setExpanded] = useState(false)

  const failures = useMemo(() => {
    return tests
      .filter(t => t.status === 'failed')
      .map(t => {
        // Reconstruimos el "result" que esperan las heurísticas a partir
        // de los campos que PracticeMode adjunta a cada test tras correrlo.
        const result = {
          stdout: t.output ?? '',
          stderr: t.stderr ?? '',
          exitCode: t.exitCode ?? null,
          signal: t.signal ?? null,
          compileError: t.compileError ?? null,
        }
        return { test: t, diagnostico: classifyFailure({ test: t, result, exercise }) }
      })
  }, [tests, exercise])

  if (!failures.length) return null

  const first = failures[0]
  const rest  = failures.slice(1)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2.5 flex items-center gap-2">
        <Wand2 size={14} className="text-purple-600" />
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
          Siguiente cosa que arreglar
        </p>
        <span className="ml-auto text-xs text-zinc-500">
          {failures.length} test{failures.length === 1 ? '' : 's'} fallido{failures.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="p-3 space-y-2">
        <FailureCard
          failure={first}
          isFirst
          onInspect={onInspect}
        />

        {rest.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 py-1.5 rounded hover:bg-zinc-50"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Ocultar' : `Ver otros ${rest.length} fallo${rest.length === 1 ? '' : 's'}`}
          </button>
        )}

        {expanded && rest.map((f, i) => (
          <FailureCard
            key={f.test.id ?? i}
            failure={f}
            onInspect={onInspect}
          />
        ))}
      </div>
    </div>
  )
}

function FailureCard({ failure, isFirst, onInspect }) {
  const { test, diagnostico } = failure
  const { row, text, Icon } = SEVERITY_STYLES[diagnostico?.severidad] || SEVERITY_STYLES.info

  return (
    <div className={clsx('rounded-lg border p-3', row, isFirst && 'ring-1 ring-offset-0 ring-purple-200')}>
      <div className="flex items-start gap-2.5">
        <Icon size={16} className={clsx('mt-0.5 shrink-0', text)} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className={clsx('text-sm font-semibold', text)}>
              {diagnostico?.titulo || 'Test fallido (sin patrón conocido)'}
            </p>
            <code className="text-[10px] text-zinc-500 truncate max-w-[40%]" title={test.id}>
              {test.id}
            </code>
          </div>

          {diagnostico?.explicacion && (
            <p className="text-xs text-zinc-700 leading-relaxed">
              {diagnostico.explicacion}
            </p>
          )}

          {!diagnostico && (
            <p className="text-xs text-zinc-600">
              No hay heurística específica para este patrón de fallo. Compara byte a byte tu salida con la esperada.
            </p>
          )}

          {diagnostico?.accion && (
            <p className="text-xs text-zinc-800 bg-white/60 rounded px-2 py-1.5 border border-zinc-100">
              <span className="font-semibold">→ </span>
              {diagnostico.accion}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <code className="text-[10px] text-zinc-500 truncate" title={JSON.stringify(test.entrada)}>
              entrada: {JSON.stringify(test.entrada).slice(0, 60)}{JSON.stringify(test.entrada).length > 60 ? '…' : ''}
            </code>
            {onInspect && (
              <button
                onClick={() => onInspect(test)}
                className="ml-auto text-[11px] font-medium text-purple-600 hover:text-purple-800 underline-offset-2 hover:underline"
              >
                Inspeccionar en "Ejecutar" →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
