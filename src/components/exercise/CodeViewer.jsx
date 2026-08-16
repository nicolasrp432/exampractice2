import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Copy, Check } from 'lucide-react'

export default function CodeViewer({ codigo = '', titulo = 'Código', lenguaje = 'c', maxHeight = 500 }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(codigo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lineCount = codigo ? codigo.split('\n').length : 1
  const editorHeight = Math.min(maxHeight, Math.max(80, lineCount * 19 + 28))

  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-mono text-zinc-500 ml-1">{titulo}</span>
          <span className="text-xs text-zinc-300">· {lineCount} líneas</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
        </button>
      </div>

      {/* Monaco Editor read-only */}
      <Editor
        height={editorHeight}
        language={lenguaje}
        value={codigo}
        theme="vs"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          renderLineHighlight: 'none',
          selectionHighlight: false,
          occurrencesHighlight: 'off',
          folding: false,
          wordWrap: 'on',
          scrollbar: { vertical: 'hidden', horizontal: 'auto', alwaysConsumeMouseWheel: false },
          padding: { top: 12, bottom: 12 },
          contextmenu: false,
          links: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
