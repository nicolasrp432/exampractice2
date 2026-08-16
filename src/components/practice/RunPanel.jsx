import { useState, useCallback } from 'react'
import { Play, Plus, X, Terminal, Microscope, Loader2, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

function ArgChip({ value, onChange, onRemove, autoFocus }) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white pl-2 pr-1 py-1">
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="arg"
        className="w-28 text-xs font-mono bg-transparent outline-none"
      />
      <button
        onClick={onRemove}
        className="rounded p-0.5 text-zinc-400 hover:bg-red-50 hover:text-red-500"
        title="Quitar argumento"
      >
        <X size={12} />
      </button>
    </div>
  )
}

export default function RunPanel({
  args,
  setArgs,
  stdin,
  setStdin,
  onRun,
  onTrace,
  running,
  tracing,
  result,
  traceError,
  tests = [],
  exercise = null,
}) {
  const [showStdin, setShowStdin] = useState(Boolean(stdin))

  const addArg = useCallback(() => setArgs((a) => [...a, '']), [setArgs])
  const setArgAt = useCallback(
    (i, v) => setArgs((a) => a.map((x, idx) => (idx === i ? v : x))),
    [setArgs]
  )
  const removeArgAt = useCallback(
    (i) => setArgs((a) => a.filter((_, idx) => idx !== i)),
    [setArgs]
  )

  const loadTestArgs = (test) => {
    setArgs(test.entrada.map(String))
  }

  const exit = result?.exitCode
  const signal = result?.signal
  const crashed = signal !== null && signal !== undefined
  const nonZero = !crashed && exit !== undefined && exit !== 0 && exit !== -1

  const fileExpected = exercise?.archivosEsperados?.[0] || `${exercise?.nombre || 'function'}.c`
  const isProgram = exercise?.tipoEntrega === 'programa'

  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
          Argumentos (argv[1], argv[2], …)
        </p>
        <div className="flex flex-wrap gap-2">
          {args.map((a, i) => (
            <ArgChip
              key={i}
              value={a}
              onChange={(v) => setArgAt(i, v)}
              onRemove={() => removeArgAt(i)}
              autoFocus={a === '' && i === args.length - 1}
            />
          ))}
          <button
            onClick={addArg}
            className="flex items-center gap-1 rounded-md border border-dashed border-zinc-300 px-2 py-1 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
          >
            <Plus size={12} /> argumento
          </button>
        </div>
        {args.length === 0 && (
          <p className="mt-1 text-[11px] text-zinc-400">
            Sin argumentos: el programa se ejecutará con argc = 1.
          </p>
        )}
      </div>

      {tests.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
            Cargar args desde un test
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tests.map((t, i) => (
              <button
                key={t.id ?? i}
                onClick={() => loadTestArgs(t)}
                className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[11px] font-mono text-zinc-600 hover:bg-zinc-50"
                title={t.descripcion}
              >
                #{i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowStdin((v) => !v)}
          className="text-xs text-zinc-500 hover:text-zinc-700"
        >
          {showStdin ? '− Ocultar stdin' : '+ Añadir stdin'}
        </button>
        {showStdin && (
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Texto que recibirá el programa por stdin"
            rows={3}
            className="mt-1.5 w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRun}
          disabled={running || tracing}
          className={clsx(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold',
            running || tracing
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-900 text-white hover:bg-zinc-700'
          )}
        >
          {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
          {running ? 'Ejecutando…' : 'Ejecutar'}
        </button>
        <button
          onClick={onTrace}
          disabled={running || tracing}
          className={clsx(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border',
            running || tracing
              ? 'border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed'
              : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'
          )}
          title="Compilar instrumentado y ver paso a paso"
        >
          {tracing ? <Loader2 size={13} className="animate-spin" /> : <Microscope size={13} />}
          {tracing ? 'Trazando…' : 'Paso a paso'}
        </button>
      </div>

      {traceError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertTriangle size={12} />
            No se pudo trazar
          </div>
          <p className="mt-0.5 leading-relaxed">{traceError}</p>
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-zinc-500">
              <Terminal size={11} /> exit
            </span>
            <span
              className={clsx(
                'rounded px-1.5 py-0.5 font-semibold',
                crashed
                  ? 'bg-red-100 text-red-700'
                  : nonZero
                  ? 'bg-amber-100 text-amber-700'
                  : exit === 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-zinc-100 text-zinc-600'
              )}
            >
              {crashed ? `signal ${signal}` : exit}
            </span>
            {result.compileError && (
              <span className="rounded bg-red-100 px-1.5 py-0.5 font-semibold text-red-700">
                compile error
              </span>
            )}
          </div>

          {result.compileError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-[11px] font-semibold text-red-700 mb-1">Compilación</p>
              <pre className="text-[11px] font-mono text-red-700 whitespace-pre-wrap leading-relaxed max-h-32 overflow-auto">
                {result.compileError}
              </pre>
            </div>
          )}

          <div className="rounded-lg border border-zinc-200 bg-zinc-900 px-3 py-2">
            <p className="text-[11px] font-semibold text-zinc-400 mb-1">stdout</p>
            <pre className="text-[11px] font-mono text-green-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">
              {result.stdout || <span className="text-zinc-500 italic">(vacío)</span>}
            </pre>
          </div>

          {result.stderr && (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <p className="text-[11px] font-semibold text-zinc-500 mb-1">stderr</p>
              <pre className="text-[11px] font-mono text-zinc-700 whitespace-pre-wrap leading-relaxed max-h-32 overflow-auto">
                {result.stderr}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Sección: Compilar localmente en tu terminal */}
      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-zinc-500 group-open:text-zinc-800 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <Terminal size={13} className="text-zinc-400 group-open:text-zinc-700" />
              Compilar localmente en tu terminal
            </span>
            <span className="text-[10px] text-zinc-400 group-open:hidden">Mostrar</span>
            <span className="text-[10px] text-zinc-400 hidden group-open:inline">Ocultar</span>
          </summary>
          <div className="mt-3 space-y-2.5 text-xs text-zinc-600 leading-relaxed">
            <p>
              Si tu conexión falla o deseas probar directamente en tu ordenador de manera independiente:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-500">
              <li>Crea un archivo local llamado <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">{fileExpected}</code>.</li>
              <li>Pega tu código del editor en el archivo.</li>
              <li>Compila en tu terminal con <code>gcc</code>:</li>
            </ol>
            <div className="relative rounded-lg bg-zinc-900 px-3 py-2 text-[10px] font-mono text-green-400 overflow-x-auto whitespace-pre">
              {isProgram ? (
                <span>gcc -Wall -Wextra -Werror {fileExpected} && ./a.out</span>
              ) : (
                <span>
                  # 1. Crea un archivo main.c con tus casos de prueba
                  <br />
                  # 2. Compila tu archivo y tu main juntos:
                  <br />
                  gcc -Wall -Wextra -Werror main.c {fileExpected} && ./a.out
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 italic">
              💡 Recuerda que para funciones, el compilador local o de examen de 42 añade un main de pruebas al compilar.
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
