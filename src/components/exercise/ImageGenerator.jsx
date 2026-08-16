import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Sparkles, RefreshCw, Save, Edit3, Check, HelpCircle, Key, Eye, EyeOff, Settings, Upload, Link as LinkIcon, Trash2 } from 'lucide-react'
import clsx from 'clsx'

// 'ai' | 'upload' | 'url'
const INPUT_MODES = [
  { id: 'upload', icon: Upload,    label: 'Subir archivo' },
  { id: 'url',    icon: LinkIcon,  label: 'URL externa'   },
  { id: 'ai',     icon: Sparkles,  label: 'Generar con IA' },
]

export default function ImageGenerator({ exercise, onSaveImage, savedImageUrl = null }) {
  const [inputMode, setInputMode] = useState('upload')
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem('42prep-img-provider') || 'gemini'
  })

  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('42prep-gemini-api-key') || ''
  })

  const [pollinationsApiKey, setPollinationsApiKey] = useState(() => {
    return import.meta.env.VITE_POLLINATIONS_API_KEY || localStorage.getItem('42prep-pollinations-api-key') || ''
  })

  const [showKeyInput, setShowKeyInput] = useState(!geminiApiKey && !pollinationsApiKey)
  const [showKeyText, setShowKeyText] = useState(false)
  const [imageUrl, setImageUrl] = useState(savedImageUrl || localStorage.getItem(`42prep-img-${exercise.id}`) || null)
  const [prompt, setPrompt] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(!!savedImageUrl)
  const [hasError, setHasError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')
  const fileInputRef = useRef(null)

  // Generate default prompt based on exercise mnemotecnia
  useEffect(() => {
    if (exercise?.palacio) {
      const { personaje, habitacion, historia } = exercise.palacio
      const roomName = {
        cocina: 'cocina (kitchen)',
        'salón': 'salón (living room)',
        dormitorio: 'dormitorio (bedroom)',
        garaje: 'garaje (garage)'
      }[habitacion] || habitacion

      const basePrompt = `Vibrant 3D cartoon style illustration of ${personaje} in a surreal school ${roomName}, related to the story: "${historia}". Absurd visual association, warm lighting, octane render, high definition, detailed.`
      setPrompt(basePrompt)
      setCustomPrompt(basePrompt)
    }
  }, [exercise])

  // Sync with savedImageUrl from parent
  useEffect(() => {
    if (savedImageUrl) {
      setImageUrl(savedImageUrl)
      setIsSaved(true)
    }
  }, [savedImageUrl])

  useEffect(() => {
    localStorage.setItem('42prep-img-provider', provider)
  }, [provider])

  const handleSaveGeminiKey = (key) => {
    const trimmed = key.trim()
    setGeminiApiKey(trimmed)
    localStorage.setItem('42prep-gemini-api-key', trimmed)
  }

  const handleSavePollinationsKey = (key) => {
    const trimmed = key.trim()
    setPollinationsApiKey(trimmed)
    localStorage.setItem('42prep-pollinations-api-key', trimmed)
  }

  const handleGenerate = async () => {
    const activeKey = provider === 'gemini' ? geminiApiKey : pollinationsApiKey

    if (!activeKey) {
      setShowKeyInput(true)
      setHasError(true)
      setErrorMsg(`Por favor, introduce tu API Key para ${provider === 'gemini' ? 'Google AI Studio' : 'Pollinations.ai'}.`)
      return
    }

    setIsLoading(true)
    setIsSaved(false)
    setHasError(false)
    setErrorMsg('')

    const finalPrompt = customPrompt.trim() || prompt

    try {
      if (provider === 'gemini') {
        // Google Gemini Imagen 3
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${activeKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: finalPrompt }
              ]
            }],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"]
            }
          })
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const msg = errData.error?.message || `HTTP Error ${response.status}`;
          
          if (msg.includes('Quota exceeded') && msg.includes('limit: 0')) {
            throw new Error('Cuota excedida (Límite 0). Tu API Key de Google no tiene una cuenta de facturación (tarjeta de crédito) vinculada en Google Cloud. AI Studio bloquea el uso de modelos de imágenes si el proyecto está en modo gratuito absoluto. Solución: Vincula facturación en tu Google Cloud Console, o cambia el proveedor de imágenes a Pollinations.ai usando una clave sin tarjeta.');
          }
          throw new Error(msg);
        }

        const data = await response.json()
        const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
        
        if (!part || !part.inlineData) {
          throw new Error('No se recibió la imagen en el formato esperado de la API de Gemini.')
        }

        const mimeType = part.inlineData.mimeType || 'image/jpeg'
        const base64Data = part.inlineData.data
        const dataUrl = `data:${mimeType};base64,${base64Data}`

        setImageUrl(dataUrl)
        localStorage.setItem(`42prep-img-${exercise.id}`, dataUrl)
        localStorage.setItem(`42prep-prompt-${exercise.id}`, finalPrompt)
        setIsLoading(false)
      } else {
        // Pollinations.ai with Free API key
        const seed = Math.floor(Math.random() * 1000000)
        const cleanedPrompt = finalPrompt
          .replace(/\\/g, '') // remove backslashes
          .replace(/[\/\(\)\{\}\[\]"']/g, ' ') // remove parenthesis, quotes, slashes
          .replace(/\s+/g, ' ')
          .trim()
        const encodedPrompt = encodeURIComponent(cleanedPrompt)
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${seed}&key=${activeKey}`
        
        // Pre-flight check to verify the key works and is not returning 402/Blocked
        const testRes = await fetch(url)
        if (!testRes.ok) {
          if (testRes.status === 402) {
            throw new Error('El servidor de Pollinations.ai devolvió 402. Esto significa que tu clave gratuita no tiene créditos o ha expirado. Por favor ingresa una nueva clave en enter.pollinations.ai.');
          }
          throw new Error(`Error en Pollinations.ai (HTTP ${testRes.status})`);
        }

        setImageUrl(url)
        localStorage.setItem(`42prep-img-${exercise.id}`, url)
        localStorage.setItem(`42prep-prompt-${exercise.id}`, finalPrompt)
        setIsLoading(false)
      }
    } catch (err) {
      console.error(err)
      setIsLoading(false)
      setHasError(true)
      setErrorMsg(err.message || 'Error al generar la imagen. Revisa tu clave o conexión.')
    }
  }

  const handleSave = () => {
    if (!imageUrl) return
    setIsSaved(true)
    if (onSaveImage) {
      onSaveImage(imageUrl, customPrompt || prompt)
    } else {
      localStorage.setItem(`42prep-img-${exercise.id}`, imageUrl)
      localStorage.setItem(`42prep-img-saved-${exercise.id}`, 'true')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setHasError(true)
      setErrorMsg('El archivo seleccionado no es una imagen válida.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setImageUrl(dataUrl)
      setIsSaved(false)
      setHasError(false)
      setErrorMsg('')
      localStorage.setItem(`42prep-img-${exercise.id}`, dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlSave = () => {
    const trimmed = urlInput.trim()
    if (!trimmed.startsWith('http')) {
      setUrlError('La URL debe empezar por http:// o https://')
      return
    }
    setUrlError('')
    setImageUrl(trimmed)
    setIsSaved(false)
    setHasError(false)
    setErrorMsg('')
    localStorage.setItem(`42prep-img-${exercise.id}`, trimmed)
  }

  const handleClearImage = () => {
    setImageUrl(null)
    setIsSaved(false)
    setHasError(false)
    setErrorMsg('')
    localStorage.removeItem(`42prep-img-${exercise.id}`)
    localStorage.removeItem(`42prep-img-saved-${exercise.id}`)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setUrlInput('')
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon size={18} className="text-purple-500" />
          <h3 className="font-bold text-zinc-900 text-sm">Asociación Visual</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {imageUrl && (
            <button
              onClick={handleClearImage}
              title="Eliminar imagen"
              className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-0.5 font-semibold"
            >
              <Trash2 size={10} /> Borrar
            </button>
          )}
          {inputMode === 'ai' && (
            <button
              onClick={() => setShowKeyInput(o => !o)}
              className="text-[10px] text-zinc-500 hover:text-zinc-800 underline font-semibold flex items-center gap-0.5"
            >
              <Settings size={10} />
              Config IA
            </button>
          )}
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl">
        {INPUT_MODES.map(({ id: modeId, icon: Icon, label }) => (
          <button
            key={modeId}
            onClick={() => { setInputMode(modeId); setHasError(false); setErrorMsg('') }}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all',
              inputMode === modeId
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            )}
          >
            <Icon size={12} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Upload mode panel */}
      {inputMode === 'upload' && (
        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-3">
          <p className="text-xs text-purple-700 font-semibold">Sube una imagen desde tu dispositivo</p>
          <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-purple-200 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
            <Upload size={20} className="text-purple-400" />
            <span className="text-xs text-zinc-500">Haz clic o arrastra una imagen aquí</span>
            <span className="text-[10px] text-zinc-400">JPG, PNG, GIF, WebP…</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}

      {/* URL mode panel */}
      {inputMode === 'url' && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
          <p className="text-xs text-blue-700 font-semibold">Pega la URL de una imagen externa</p>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError('') }}
              className="flex-1 px-3 py-2 border border-blue-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
              onClick={handleUrlSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Usar
            </button>
          </div>
          {urlError && <p className="text-[11px] text-red-600">{urlError}</p>}
        </div>
      )}

      {/* API Key Configuration Panel */}
      {inputMode === 'ai' && showKeyInput && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <p className="font-bold text-amber-800 flex items-center gap-1.5">
              <Key size={13} className="text-amber-600" />
              Proveedor de Generación de IA
            </p>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value)
                setHasError(false)
              }}
              className="bg-white border border-amber-200 rounded px-1.5 py-0.5 text-[11px] font-semibold text-amber-900 focus:outline-none"
            >
              <option value="gemini">Google Gemini (Imagen 3)</option>
              <option value="pollinations">Pollinations.ai (Gratis sin tarjeta)</option>
            </select>
          </div>

          {provider === 'gemini' ? (
            <div className="space-y-2">
              <p className="text-[11px] text-amber-700 leading-normal">
                Genera con <strong>gemini-3.1-flash-image</strong>. Requiere un proyecto en Google AI Studio que tenga la **facturación habilitada** (cuenta vinculada), de lo contrario Google limita la cuota a 0.
              </p>
              <ol className="list-decimal list-inside text-[10px] text-amber-600 space-y-0.5">
                <li>Consigue tu clave en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-amber-900">Google AI Studio</a>.</li>
                <li>Vincula facturación en Google Cloud Console para habilitar la cuota de imágenes.</li>
              </ol>
              <div className="flex gap-1.5 mt-2">
                <div className="relative flex-1">
                  <input
                    type={showKeyText ? "text" : "password"}
                    placeholder="Pega tu clave AIzaSy..."
                    value={geminiApiKey}
                    onChange={(e) => handleSaveGeminiKey(e.target.value)}
                    className="w-full pl-2.5 pr-8 py-1.5 border border-amber-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(o => !o)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showKeyText ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {geminiApiKey && (
                  <button
                    onClick={() => setShowKeyInput(false)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition-all shadow"
                  >
                    Guardar
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] text-amber-700 leading-normal">
                Genera con <strong>Flux/Sana</strong>. Requiere una API Key gratuita de Pollinations.ai. Es 100% gratuita y **no requiere tarjetas de crédito**.
              </p>
              <ol className="list-decimal list-inside text-[10px] text-amber-600 space-y-0.5">
                <li>Regístrate y copia tu clave en <a href="https://enter.pollinations.ai" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-amber-900">enter.pollinations.ai</a> (GitHub/Google login).</li>
                <li>Pégala aquí abajo para empezar.</li>
              </ol>
              <div className="flex gap-1.5 mt-2">
                <div className="relative flex-1">
                  <input
                    type={showKeyText ? "text" : "password"}
                    placeholder="Pega tu clave pk_..."
                    value={pollinationsApiKey}
                    onChange={(e) => handleSavePollinationsKey(e.target.value)}
                    className="w-full pl-2.5 pr-8 py-1.5 border border-amber-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(o => !o)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showKeyText ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {pollinationsApiKey && (
                  <button
                    onClick={() => setShowKeyInput(false)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition-all shadow"
                  >
                    Guardar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/80 backdrop-blur-sm z-10 space-y-3"
            >
              <RefreshCw size={28} className="text-purple-500 animate-spin" />
              <p className="text-xs font-semibold text-zinc-500 animate-pulse">Pintando asociación loca...</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/95 p-6 text-center z-10 overflow-y-auto">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-2 shrink-0">
                <HelpCircle size={20} />
              </div>
              <p className="text-xs font-bold text-red-800 mb-1">No se pudo generar la imagen</p>
              <p className="text-[10px] text-red-700 leading-normal max-w-xs mb-3 text-left">
                {errorMsg}
              </p>
              <button
                onClick={handleGenerate}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold transition-all shadow"
              >
                Reintentar generación
              </button>
            </div>
          ) : null}

          {imageUrl && !hasError ? (
            <motion.img
              key={imageUrl}
              src={imageUrl}
              alt={`Mnemotecnia para ${exercise.nombre}`}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onLoad={() => {
                setIsLoading(false)
                setHasError(false)
              }}
              onError={() => {
                setIsLoading(false)
                setHasError(true)
                setErrorMsg('Error al cargar los bytes de la imagen. Verifica tu clave o conexión.')
              }}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : !imageUrl && !hasError ? (
            <div className="text-center p-6 space-y-3 text-zinc-400">
              <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-400">
                <ImageIcon size={28} />
              </div>
              <div className="max-w-xs space-y-1">
                <p className="text-xs font-bold text-zinc-700">Sin imagen generada aún</p>
                <p className="text-[11px] text-zinc-500">
                  Crea una imagen absurda del personaje y la historia para grabarlo permanentemente en tu cerebro.
                </p>
              </div>
            </div>
          ) : null}
      </div>

      {/* AI Controls — only shown in AI mode */}
      {inputMode === 'ai' && (
      <div className="space-y-3">
        {/* Prompt editor */}
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Edit3 size={10} /> Prompt de la IA
            </span>
            <button
              onClick={() => setIsEditingPrompt(!isEditingPrompt)}
              className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold"
            >
              {isEditingPrompt ? 'Bloquear' : 'Editar Prompt'}
            </button>
          </div>
          {isEditingPrompt ? (
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={2}
              className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          ) : (
            <p className="text-xs text-zinc-600 italic line-clamp-2">
              "{customPrompt || prompt}"
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all',
              isLoading
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            )}
          >
            <RefreshCw size={14} className={clsx(isLoading && 'animate-spin')} />
            {imageUrl ? 'Regenerar IA ✨' : 'Generar Asociación ✨'}
          </button>

          {imageUrl && (
            <button
              onClick={handleSave}
              className={clsx(
                'px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all',
                isSaved
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              )}
            >
              {isSaved ? <Check size={14} /> : <Save size={14} />}
              {isSaved ? 'Guardada' : 'Guardar'}
            </button>
          )}
        </div>
      </div>
      )} {/* end AI controls */}

      {/* Save button for upload/URL modes */}
      {inputMode !== 'ai' && imageUrl && (
        <button
          onClick={handleSave}
          className={clsx(
            'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all',
            isSaved
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          )}
        >
          {isSaved ? <Check size={14} /> : <Save size={14} />}
          {isSaved ? 'Imagen guardada' : 'Confirmar imagen'}
        </button>
      )}
    </div>
  )
}
