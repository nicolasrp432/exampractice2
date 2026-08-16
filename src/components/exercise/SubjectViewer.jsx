import { useState } from 'react'
import { Copy, Check, FileCode } from 'lucide-react'

export default function SubjectViewer({ subject = '', subjectEs = '', funcionesPermitidas = [], archivosEsperados = [] }) {
  const [copied, setCopied] = useState(false)
  const [showEs, setShowEs] = useState(false)

  function copy() {
    const textToCopy = showEs && subjectEs ? subjectEs : subject
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!subject) {
    return (
      <div className="py-10 text-center text-zinc-400">
        <p className="text-3xl mb-2">🚧</p>
        <p className="text-sm">Subject no disponible todavía</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden border border-zinc-700/80 bg-[#1E1E2E] flex flex-col shadow-sm">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#181825] border-b border-zinc-700/40 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
            <span className="ml-2 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">subject.txt</span>
          </div>
          
          <div className="flex items-center gap-2">
            {subjectEs && (
              <div className="flex bg-white/10 rounded-lg p-0.5 border border-white/5">
                <button
                  onClick={() => setShowEs(false)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    !showEs ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setShowEs(true)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    showEs ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ES
                </button>
              </div>
            )}
            
            <button
              onClick={copy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 text-zinc-400 hover:text-white text-[11px] transition-colors"
            >
              {copied ? <><Check size={11} /> Copiado</> : <><Copy size={11} /> Copiar</>}
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="text-xs leading-relaxed max-h-[380px] overflow-y-auto p-4 font-mono text-[#A6E3A1] whitespace-pre-wrap break-words select-text">
          {showEs ? subjectEs : subject}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {archivosEsperados.map(f => (
          <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md
                                   bg-blue-50 text-blue-700 text-xs font-mono border border-blue-200">
            <FileCode size={11} /> {f}
          </span>
        ))}
        {funcionesPermitidas.map(fn => (
          <span key={fn} className="anchor-chip">{fn}()</span>
        ))}
      </div>
    </div>
  )
}
