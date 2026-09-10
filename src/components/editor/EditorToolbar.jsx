// src/components/editor/EditorToolbar.jsx
import { useState, useRef, useEffect } from 'react'
import {
  Palette,
  Terminal,
  Settings2,
  Copy,
  Check,
  RotateCcw,
  AlignLeft,
  FileCode,
  ChevronDown,
  Sparkles,
  Maximize2,
  Minimize2,
  Code2
} from 'lucide-react'
import clsx from 'clsx'
import { THEME_LIST, LANGUAGE_LIST } from './editorThemes'

export default function EditorToolbar({
  filename = 'solution.c',
  theme = 'vs-dark',
  onThemeChange,
  language = 'c',
  onLanguageChange,
  fontSize = 13,
  onFontSizeChange,
  tabSize = 4,
  onTabSizeChange,
  insertSpaces = false,
  onInsertSpacesChange,
  minimap = false,
  onMinimapToggle,
  wordWrap = 'off',
  onWordWrapToggle,
  lineNumbers = 'on',
  onLineNumbersToggle,
  onFormatCode,
  onResetCode,
  onCopyCode,
  isTerminalOpen = false,
  onToggleTerminal,
  isFullscreen = false,
  onToggleFullscreen,
  hasUnsavedChanges = false,
}) {
  const [copied, setCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const settingsRef = useRef(null)
  const themeRef = useRef(null)

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false)
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setShowThemeMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCopy = () => {
    if (onCopyCode) onCopyCode()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentThemeObj = THEME_LIST.find(t => t.id === theme) || THEME_LIST[0]
  const currentLangObj = LANGUAGE_LIST.find(l => l.id === language) || LANGUAGE_LIST[0]

  return (
    <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-300 select-none gap-2">
      {/* ── Izquierda: Pestaña de Archivo & Lenguaje ── */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 border border-zinc-700/60 font-mono text-zinc-200">
          <FileCode size={13} className="text-blue-400" />
          <span className="font-semibold">{filename}</span>
          {hasUnsavedChanges && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block ml-0.5" title="Cambios no guardados" />
          )}
        </div>

        {/* Selector de Lenguaje */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
            className="bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 rounded px-2 py-1 text-[11px] font-medium text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none pr-5 transition-colors"
            title="Seleccionar lenguaje de sintaxis"
          >
            {LANGUAGE_LIST.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-zinc-900 text-zinc-200">
                {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Centro / Derecha: Controles de Tema, Terminal y Editor ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Selector de Tema */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/70 hover:bg-zinc-700/80 border border-zinc-700/50 text-[11px] font-medium text-zinc-200 transition-colors"
            title="Cambiar tema del editor (VS Code, Dracula, Monokai...)"
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: currentThemeObj.bg }}
            />
            <span className="hidden sm:inline max-w-[120px] truncate">{currentThemeObj.name}</span>
            <ChevronDown size={11} className="text-zinc-400" />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-56 max-h-72 overflow-y-auto rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl z-50 py-1 text-xs">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                Temas de Editor
              </div>
              {THEME_LIST.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange && onThemeChange(t.id)
                    setShowThemeMenu(false)
                  }}
                  className={clsx(
                    'w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-zinc-800 transition-colors',
                    theme === t.id ? 'text-blue-400 font-semibold bg-zinc-800/50' : 'text-zinc-300'
                  )}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: t.bg }}
                  />
                  <span className="flex-1 truncate">{t.name}</span>
                  {theme === t.id && <Check size={12} className="text-blue-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón Terminal 42 */}
        <button
          onClick={onToggleTerminal}
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium transition-all',
            isTerminalOpen
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 shadow-sm shadow-emerald-950'
              : 'bg-zinc-800/70 hover:bg-zinc-700/80 text-zinc-200 border-zinc-700/50'
          )}
          title="Abrir o cerrar Terminal Interactiva 42 (Ctrl+`)"
        >
          <Terminal size={13} className={isTerminalOpen ? 'text-emerald-400' : 'text-zinc-400'} />
          <span className="font-semibold">Terminal 42</span>
          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/40 text-zinc-400 hidden md:inline">Ctrl+`</span>
        </button>

        {/* Botón de Configuración del Editor */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-zinc-700 transition-colors"
            title="Ajustes del editor (fuente, minimapa, sangría...)"
          >
            <Settings2 size={14} />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-full mt-1.5 w-64 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl z-50 p-3 text-xs space-y-3">
              <div className="font-semibold text-zinc-200 border-b border-zinc-800 pb-1.5">
                Configuración de Monaco
              </div>

              {/* Tamaño de Fuente */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Tamaño de fuente:</span>
                <select
                  value={fontSize}
                  onChange={(e) => onFontSizeChange && onFontSizeChange(Number(e.target.value))}
                  className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-zinc-200 text-xs cursor-pointer focus:outline-none"
                >
                  {[12, 13, 14, 15, 16, 18].map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
              </div>

              {/* Sangría Norma 42 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-zinc-400 block">Identación:</span>
                  <span className="text-[10px] text-zinc-500">Norma 42 exige tabulador</span>
                </div>
                <button
                  onClick={() => onInsertSpacesChange && onInsertSpacesChange(!insertSpaces)}
                  className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono hover:bg-zinc-700 text-zinc-200"
                >
                  {insertSpaces ? '4 Espacios' : 'Tabuladores (\\t)'}
                </button>
              </div>

              {/* Minimapa */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Minimapa:</span>
                <button
                  onClick={onMinimapToggle}
                  className={clsx(
                    'px-2 py-0.5 rounded text-[11px] font-medium border',
                    minimap ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  )}
                >
                  {minimap ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              {/* Ajuste de Línea */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Ajuste de línea (Wrap):</span>
                <button
                  onClick={onWordWrapToggle}
                  className={clsx(
                    'px-2 py-0.5 rounded text-[11px] font-medium border',
                    wordWrap === 'on' ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  )}
                >
                  {wordWrap === 'on' ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              {/* Números de Línea */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Números de línea:</span>
                <button
                  onClick={onLineNumbersToggle}
                  className={clsx(
                    'px-2 py-0.5 rounded text-[11px] font-medium border',
                    lineNumbers === 'on' ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  )}
                >
                  {lineNumbers === 'on' ? 'Visibles' : 'Ocultos'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botón Formatear / Reindentar */}
        {onFormatCode && (
          <button
            onClick={onFormatCode}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Auto-formatear código según norma 42"
          >
            <AlignLeft size={14} />
          </button>
        )}

        {/* Botón Copiar */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Copiar código al portapapeles"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>

        {/* Botón Reiniciar plantilla */}
        {onResetCode && (
          <button
            onClick={onResetCode}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
            title="Restaurar plantilla inicial del ejercicio"
          >
            <RotateCcw size={14} />
          </button>
        )}

        {/* Botón Pantalla Completa */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:block"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Editor a pantalla completa'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}
