import { useState } from 'react'
import { Copy, Check, FileCode, Languages } from 'lucide-react'
import { getSpanishSubject } from '@/utils/subjectTranslator'

export default function SubjectViewer({
  subject = '',
  subjectEs = '',
  exercise = null,
  exerciseId = '',
  funcionesPermitidas = [],
  archivosEsperados = []
}) {
  const [copied, setCopied] = useState(false)
  const [localLang, setLocalLang] = useState('es') // 'es' | 'en'

  // Determinar la versión en español (catálogo curado o traducción sintética)
  const resolvedSpanish = subjectEs && subjectEs.trim().length > 10
    ? subjectEs
    : getSpanishSubject(exercise || { id: exerciseId }, subject)

  const activeText = localLang === 'es' && resolvedSpanish
    ? resolvedSpanish
    : subject

  function copy() {
    navigator.clipboard.writeText(activeText || subject)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!subject && !resolvedSpanish) {
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
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#181825] border-b border-zinc-700/40 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
            <span className="ml-2 font-mono text-[11px] text-zinc-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              {localLang === 'es' ? 'subject_es.txt' : 'subject.txt'}
            </span>
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* Selector de idioma EN / ES siempre disponible */}
            <div className="flex items-center bg-zinc-800/90 rounded-lg p-0.5 border border-zinc-700/70 shadow-inner">
              <button
                type="button"
                onClick={() => setLocalLang('en')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  localLang === 'en'
                    ? 'bg-zinc-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Ver subject original en inglés"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocalLang('es')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  localLang === 'es'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Ver subject traducido al español"
              >
                <Languages size={12} className={localLang === 'es' ? 'text-white' : 'text-zinc-400'} />
                ES
              </button>
            </div>
            
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs transition-colors border border-zinc-700/50"
              title="Copiar texto del subject"
            >
              {copied ? <><Check size={12} className="text-green-400" /> Copiado</> : <><Copy size={12} /> Copiar</>}
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="text-xs sm:text-[13px] leading-relaxed max-h-[420px] overflow-y-auto p-4 sm:p-5 font-mono text-[#A6E3A1] whitespace-pre-wrap break-words select-text">
          {activeText}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-0.5">
        {archivosEsperados.map(f => (
          <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md
                                   bg-blue-50 text-blue-700 text-xs font-mono border border-blue-200">
            <FileCode size={12} /> {f}
          </span>
        ))}
        {funcionesPermitidas.map(fn => (
          <span key={fn} className="anchor-chip">{fn}()</span>
        ))}
      </div>
    </div>
  )
}
