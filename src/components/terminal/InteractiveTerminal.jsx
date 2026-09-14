// src/components/terminal/InteractiveTerminal.jsx
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Terminal as TerminalIcon,
  Play,
  Bug,
  ShieldAlert,
  FileCheck,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
  Check,
  Send,
  CornerDownLeft,
  Sparkles,
  Info,
  GripHorizontal,
} from 'lucide-react'
import clsx from 'clsx'
import { executeTerminalClientFallback } from '@/utils/terminalFallback'

export default function InteractiveTerminal({
  code,
  exercise,
  filename = 'solution.c',
  isOpen = false,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('terminal') // 'terminal' | 'compile' | 'asan' | 'gdb' | 'norm'
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandLogs, setCommandLogs] = useState([
    {
      id: 'init',
      command: 'uname -a && gcc --version | head -n 1',
      stdout: 'Linux 42-exam-container 6.1.0-x86_64\ngcc (Debian 12.2.0-14) 12.2.0 (Normas 42 preparadas)',
      stderr: '',
      exitCode: 0,
      timestamp: new Date().toLocaleTimeString(),
    }
  ])
  const [customArgs, setCustomArgs] = useState('')
  const [customStdin, setCustomStdin] = useState('')
  const [showInputParams, setShowInputParams] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  // Altura ajustable y deslizante (resizable)
  const [terminalHeight, setTerminalHeight] = useState(() => {
    try {
      const saved = localStorage.getItem('42prep-terminal-height')
      const parsed = saved ? parseInt(saved, 10) : 320
      return isNaN(parsed) || parsed < 150 ? 320 : parsed
    } catch {
      return 320
    }
  })
  const [isDragging, setIsDragging] = useState(false)
  const isResizingRef = useRef(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(320)

  const logsEndRef = useRef(null)
  const inputRef = useRef(null)

  // Manejador para iniciar el deslizamiento (resize)
  const startResizing = useCallback((e) => {
    isResizingRef.current = true
    setIsDragging(true)
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    startYRef.current = clientY
    startHeightRef.current = terminalHeight
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'row-resize'
  }, [terminalHeight])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizingRef.current) return
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      // Arrastrar hacia arriba (menor clientY) aumenta la altura de la terminal
      const deltaY = startYRef.current - clientY
      const minH = 150
      const maxH = Math.min(window.innerHeight * 0.85, 780)
      const nextH = Math.max(minH, Math.min(maxH, startHeightRef.current + deltaY))
      setTerminalHeight(nextH)
    }

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false
        setIsDragging(false)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
        setTerminalHeight((curr) => {
          try {
            localStorage.setItem('42prep-terminal-height', String(Math.round(curr)))
          } catch {}
          return curr
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleMouseMove, { passive: false })
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [])

  // Scroll al final al recibir nuevo log
  useEffect(() => {
    if (isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [commandLogs, isOpen])

  // Enfocar input al abrir
  useEffect(() => {
    if (isOpen && activeTab === 'terminal') {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, activeTab])

  if (!isOpen) return null

  const parseArgsList = (raw) => {
    if (!raw.trim()) return []
    const matches = raw.match(/"[^"]*"|\S+/g) || []
    return matches.map(m => m.replace(/^"|"$/g, ''))
  }

  const executeAction = async ({ action = 'custom', customCmd = null }) => {
    if (isExecuting) return

    const cmdToRun = customCmd !== null ? customCmd : command.trim()
    if (action === 'custom' && !cmdToRun) return

    setIsExecuting(true)

    // Guardar en historial de comandos
    if (action === 'custom' && cmdToRun) {
      setHistory(prev => [cmdToRun, ...prev.filter(c => c !== cmdToRun)].slice(0, 50))
      setHistoryIndex(-1)
    }

    const argsList = parseArgsList(customArgs)
    const exerciseId = exercise?.id || 'solution'
    const tipoEntrega = exercise?.tipoEntrega || 'programa'

    try {
      let data = null
      let usedFallback = false

      try {
        const res = await fetch('/api/terminal/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            command: cmdToRun,
            code,
            exerciseId,
            tipoEntrega,
            filename: `${exerciseId}.c`,
            args: argsList,
            stdin: customStdin,
          })
        })

        const contentType = res.headers.get('content-type') || ''
        if (res.ok && contentType.includes('application/json')) {
          data = await res.json()
          if (data?.useClientExecution || data?.compilerUnavailable) {
            usedFallback = true
          }
        } else {
          // El servidor devolvió 404 (ej: Vercel) o página HTML. Pasamos al ejecutor seguro.
          usedFallback = true
        }
      } catch (netErr) {
        // Servidor no disponible o modo offline
        usedFallback = true
      }

      // Si el backend nativo no está disponible, ejecutamos a través del motor seguro
      if (usedFallback || !data) {
        data = await executeTerminalClientFallback({
          action,
          command: cmdToRun,
          code,
          exercise,
          filename: `${exerciseId}.c`,
          args: argsList,
          stdin: customStdin,
        })
      }

      if (data?.clear) {
        setCommandLogs([])
        setCommand('')
        return
      }

      const newLog = {
        id: `log_${Date.now()}`,
        action,
        command: data?.command || cmdToRun,
        stdout: data?.stdout ?? '',
        stderr: data?.stderr ?? '',
        exitCode: data?.exitCode ?? 0,
        signal: data?.signal ?? null,
        timestamp: new Date().toLocaleTimeString(),
      }

      setCommandLogs(prev => [...prev, newLog])
      if (action === 'custom') setCommand('')
    } catch (err) {
      setCommandLogs(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          action,
          command: cmdToRun,
          stdout: '',
          stderr: `Error en la terminal: ${err.message}`,
          exitCode: 1,
          timestamp: new Date().toLocaleTimeString(),
        }
      ])
    } finally {
      setIsExecuting(false)
    }
  }

  // Navegación por historial con teclas Arriba / Abajo
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeAction({ action: 'custom' })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1
        setHistoryIndex(nextIdx)
        setCommand(history[nextIdx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1
        setHistoryIndex(nextIdx)
        setCommand(history[nextIdx])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommand('')
      }
    }
  }

  const handleCopyLog = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 1800)
  }

  const exName = exercise?.id || 'solution'

  return (
    <div
      style={{ height: `${terminalHeight}px` }}
      className="flex flex-col bg-[#0d1117] text-zinc-300 font-mono z-20 shadow-2xl relative overflow-hidden shrink-0"
    >
      {/* ── Manija de Arrastre para Redimensionar (Deslizar hacia arriba o abajo) ── */}
      <div
        onMouseDown={startResizing}
        onTouchStart={startResizing}
        className={clsx(
          "w-full h-2.5 cursor-row-resize flex items-center justify-center select-none transition-colors border-t border-zinc-700/80 group z-30 shrink-0",
          isDragging ? "bg-emerald-500/30" : "bg-[#141820] hover:bg-emerald-500/20"
        )}
        title="Arrastra hacia arriba para agrandar o hacia abajo para reducir la terminal"
      >
        <div className={clsx(
          "w-12 h-1 rounded-full transition-all flex items-center justify-center",
          isDragging ? "bg-emerald-400 w-16 h-1.5" : "bg-zinc-600 group-hover:bg-zinc-400"
        )} />
      </div>

      {/* ── Barra Superior de Pestañas & Acciones de Ventana ── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-zinc-800 shrink-0 select-none text-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('terminal')}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors',
              activeTab === 'terminal'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            )}
          >
            <TerminalIcon size={13} className="text-emerald-400" />
            Terminal 42
          </button>

          <button
            onClick={() => {
              setActiveTab('compile')
              executeAction({ action: 'compile' })
            }}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors',
              activeTab === 'compile'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            )}
            title="Compilar con gcc -Wall -Wextra -Werror"
          >
            <Play size={13} className="text-blue-400" />
            Compilar 42
          </button>

          <button
            onClick={() => {
              setActiveTab('asan')
              executeAction({ action: 'asan' })
            }}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors',
              activeTab === 'asan'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            )}
            title="Detectar leaks de memoria y buffer overflows con AddressSanitizer (-fsanitize=address)"
          >
            <ShieldAlert size={13} className="text-amber-400" />
            AddressSanitizer (Leaks)
          </button>

          <button
            onClick={() => {
              setActiveTab('gdb')
              executeAction({ action: 'gdb' })
            }}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors',
              activeTab === 'gdb'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            )}
            title="Inspección GDB en tiempo real con Backtrace y Variables"
          >
            <Bug size={13} className="text-purple-400" />
            GDB Debug
          </button>

          <button
            onClick={() => {
              setActiveTab('norm')
              executeAction({ action: 'norm' })
            }}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors',
              activeTab === 'norm'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            )}
            title="Verificar cumplimiento estricto de la Norma 42"
          >
            <FileCheck size={13} className="text-teal-400" />
            Norminette
          </button>
        </div>

        {/* Acciones de Ventana */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button
            onClick={() => setShowInputParams(!showInputParams)}
            className={clsx(
              'px-2 py-0.5 rounded text-[11px] font-sans transition-colors',
              showInputParams ? 'bg-blue-900/60 text-blue-300' : 'hover:bg-zinc-800 text-zinc-400'
            )}
            title="Configurar argumentos (argv) y entrada estándar (stdin)"
          >
            Args / Stdin {showInputParams ? '▲' : '▼'}
          </button>

          <button
            onClick={() => setCommandLogs([])}
            className="p-1 hover:bg-zinc-800 rounded hover:text-zinc-200"
            title="Limpiar terminal"
          >
            <Trash2 size={13} />
          </button>

          <button
            onClick={() => {
              if (terminalHeight < 240) setTerminalHeight(340)
              else if (terminalHeight < 460) setTerminalHeight(560)
              else setTerminalHeight(200)
            }}
            className="p-1 hover:bg-zinc-800 rounded hover:text-zinc-200"
            title="Ajustar tamaño predeterminado (o arrastra la barra superior para deslizar libremente)"
          >
            {terminalHeight > 450 ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded hover:text-red-400 ml-1"
            title="Cerrar terminal"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Sub-panel opcional para Argumentos & Stdin ── */}
      {showInputParams && (
        <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-[#12161f] border-b border-zinc-800 text-xs text-zinc-300 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-zinc-400 shrink-0 text-[11px] font-sans">Argumentos (argv):</span>
            <input
              type="text"
              value={customArgs}
              onChange={(e) => setCustomArgs(e.target.value)}
              placeholder={`"42" "School" ...`}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-zinc-400 shrink-0 text-[11px] font-sans">Stdin:</span>
            <input
              type="text"
              value={customStdin}
              onChange={(e) => setCustomStdin(e.target.value)}
              placeholder="Entrada interactiva por teclado"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* ── Barra de Atajos Rápidos ── */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f141c] border-b border-zinc-800/80 shrink-0 overflow-x-auto text-[11px]">
        <span className="text-zinc-500 font-sans text-[10px] uppercase font-bold tracking-wider mr-1 shrink-0">
          Atajos 42:
        </span>

        <button
          onClick={() => executeAction({ action: 'compile' })}
          disabled={isExecuting}
          className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-200 hover:text-white transition-colors shrink-0"
        >
          ▶ gcc -Wall -Wextra -Werror
        </button>

        <button
          onClick={() => executeAction({ action: 'run' })}
          disabled={isExecuting}
          className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-emerald-300 hover:text-emerald-200 transition-colors shrink-0"
        >
          ⚡ ./solution {customArgs ? customArgs : ''}
        </button>

        <button
          onClick={() => executeAction({ action: 'asan' })}
          disabled={isExecuting}
          className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-amber-300 hover:text-amber-200 transition-colors shrink-0"
        >
          🛡️ ASan Leaks
        </button>

        <button
          onClick={() => executeAction({ action: 'gdb' })}
          disabled={isExecuting}
          className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-purple-300 hover:text-purple-200 transition-colors shrink-0"
        >
          🐛 GDB Backtrace
        </button>

        <button
          onClick={() => executeAction({ action: 'norm' })}
          disabled={isExecuting}
          className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-teal-300 hover:text-teal-200 transition-colors shrink-0"
        >
          📏 Norminette
        </button>

        <button
          onClick={() => executeAction({ action: 'custom', customCmd: 'ls -la' })}
          disabled={isExecuting}
          className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-300 hover:text-white transition-colors shrink-0"
        >
          📁 ls -la
        </button>

        <button
          onClick={() => executeAction({ action: 'custom', customCmd: `nm -u solution 2>/dev/null || nm -u ${exName}` })}
          disabled={isExecuting}
          className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-300 hover:text-white transition-colors shrink-0"
          title="Ver funciones externas usadas (comprobar que no hay funciones prohibidas)"
        >
          🔍 nm -u (Símbolos)
        </button>
      </div>

      {/* ── Cuerpo Principal de Logs y Salida de Terminal ── */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 text-xs leading-relaxed select-text font-mono">
        {commandLogs.map((log, idx) => {
          const isError = log.exitCode !== 0
          return (
            <div key={log.id || idx} className="border-b border-zinc-800/50 pb-2.5 last:border-b-0">
              {/* Encabezado del comando ejecutado */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-400 font-bold">user@42-exam:~/workspace$</span>
                  <span className="text-white font-semibold">{log.command}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={clsx(
                    'px-1.5 py-0.2 rounded text-[10px] font-bold font-mono',
                    log.exitCode === 0
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                  )}>
                    {log.exitCode === 0 ? 'EXIT 0' : `EXIT ${log.exitCode}`}
                  </span>
                  <span className="text-[10px] text-zinc-500">{log.timestamp}</span>
                  <button
                    onClick={() => handleCopyLog((log.stdout || '') + '\n' + (log.stderr || ''), idx)}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200"
                    title="Copiar salida"
                  >
                    {copiedIndex === idx ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                  </button>
                </div>
              </div>

              {/* Stdout */}
              {log.stdout && (
                <pre className="whitespace-pre-wrap text-zinc-200 bg-black/40 p-2 rounded border border-zinc-800/40 text-[11.5px]">
                  {log.stdout}
                </pre>
              )}

              {/* Stderr */}
              {log.stderr && (
                <pre className={clsx(
                  'whitespace-pre-wrap p-2 rounded border text-[11.5px] mt-1',
                  isError
                    ? 'text-rose-300 bg-rose-950/30 border-rose-900/40'
                    : 'text-amber-300 bg-amber-950/20 border-amber-900/30'
                )}>
                  {log.stderr}
                </pre>
              )}

              {/* Sin salida */}
              {!log.stdout && !log.stderr && (
                <div className="text-zinc-500 italic text-[11px]">
                  (El comando se ejecutó sin emitir salida por stdout ni stderr)
                </div>
              )}
            </div>
          )
        })}

        {isExecuting && (
          <div className="flex items-center gap-2 text-emerald-400 py-1 text-xs">
            <span className="animate-spin inline-block w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full" />
            <span>Ejecutando en el entorno 42...</span>
          </div>
        )}

        <div ref={logsEndRef} />
      </div>

      {/* ── Barra de Entrada de Comandos Interactiva ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] border-t border-zinc-800 shrink-0">
        <span className="text-emerald-400 font-bold shrink-0 select-none text-xs">
          user@42-exam:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          placeholder="Escribe un comando bash o gcc (ej: gcc solution.c -o solution && ./solution 42)..."
          className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-zinc-600"
        />
        <button
          onClick={() => executeAction({ action: 'custom' })}
          disabled={isExecuting || !command.trim()}
          className={clsx(
            'flex items-center gap-1 px-3 py-1 rounded font-semibold text-xs transition-colors shrink-0',
            command.trim() && !isExecuting
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          )}
          title="Ejecutar comando (Enter)"
        >
          <CornerDownLeft size={13} />
          <span>Run</span>
        </button>
      </div>
    </div>
  )
}
