import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Sparkles, 
  RefreshCw, 
  Save, 
  Edit3, 
  Check, 
  HelpCircle, 
  Upload, 
  Link as LinkIcon, 
  Trash2, 
  Download, 
  Video, 
  Layers, 
  Wand2, 
  Maximize2,
  Share2
} from 'lucide-react';
import clsx from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';

const STYLE_PRESETS = [
  { id: 'octane', label: '🎨 3D Surrealista', promptSuffix: 'vibrant 3D cartoon octane render, surreal visual association, detailed lighting, character focus, 8k render' },
  { id: 'palacio', label: '🏰 Palacio Campayo', promptSuffix: 'storybook fantasy illustration, vivid memory palace concept, expressive character, warm luminous atmosphere' },
  { id: 'cyberpunk', label: '🌌 Cyberpunk 42', promptSuffix: 'cyberpunk terminal aesthetic, glowing neon lights, futuristic coder visual association, cinematic framing' },
  { id: 'pixel', label: '👾 Pixel Art Retro', promptSuffix: 'detailed 16-bit pixel art, classic gaming style, clean isometric perspective' },
  { id: 'technical', label: '✏️ Boceto Técnico', promptSuffix: 'clean architectural schematic blueprint sketch, minimalist C programming concept' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Cuadrado' },
  { id: '16:9', label: '16:9 Panorámico' },
  { id: '9:16', label: '9:16 Vertical' },
  { id: '4:3', label: '4:3 Estándar' },
];

export default function ImageGenerator({ exercise, onSaveImage, savedImageUrl = null }) {
  const geminiApiKey = useSettingsStore((s) => s.geminiApiKey);
  const [activeTab, setActiveTab] = useState('nanobanana'); // 'nanobanana' | 'video' | 'upload' | 'url'
  const [selectedStyle, setSelectedStyle] = useState('octane');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageUrl, setImageUrl] = useState(
    savedImageUrl || localStorage.getItem(`42prep-img-${exercise?.id}`) || null
  );
  const [prompt, setPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(!!savedImageUrl);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [editInstruction, setEditInstruction] = useState('');
  
  // Video Generation States (Veo)
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoStatusMsg, setVideoStatusMsg] = useState('');

  const fileInputRef = useRef(null);

  // Generate default prompt based on exercise mnemonic
  useEffect(() => {
    if (exercise?.palacio) {
      const { personaje, habitacion, historia } = exercise.palacio;
      const roomName = {
        cocina: 'cocina (kitchen)',
        'salón': 'salón (living room)',
        dormitorio: 'dormitorio (bedroom)',
        garaje: 'garaje (garage)',
      }[habitacion] || habitacion;

      const basePrompt = `Vibrant 3D cartoon style illustration of ${personaje} in a surreal school ${roomName}, related to the story: "${historia}". Absurd visual memory association for C programming exam.`;
      setPrompt(basePrompt);
      setCustomPrompt(basePrompt);
    }
  }, [exercise]);

  // Sync with savedImageUrl from parent
  useEffect(() => {
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
      setIsSaved(true);
    }
  }, [savedImageUrl]);

  const buildFinalPrompt = () => {
    const base = customPrompt.trim() || prompt;
    const styleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
    const suffix = styleObj ? `, ${styleObj.promptSuffix}` : '';
    return `${base}${suffix}`;
  };

  const handleGenerateNanoBanana = async (isRemix = false) => {
    setIsLoading(true);
    setIsSaved(false);
    setHasError(false);
    setErrorMsg('');

    const finalPrompt = buildFinalPrompt();

    try {
      const response = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: isRemix && editInstruction ? `${finalPrompt}. Modificación adicional: ${editInstruction}` : finalPrompt,
          aspectRatio,
          inputImage: isRemix ? imageUrl : undefined,
          exerciseId: exercise?.id,
          customKey: geminiApiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error('No se recibió la imagen en el formato esperado.');
      }

      setImageUrl(data.imageUrl);
      localStorage.setItem(`42prep-img-${exercise?.id}`, data.imageUrl);
      localStorage.setItem(`42prep-prompt-${exercise?.id}`, finalPrompt);
      setIsSaved(false);
    } catch (err) {
      console.error(err);
      setHasError(true);
      setErrorMsg(err.message || 'Error al generar la imagen con Nano Banana.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideoVeo = async () => {
    if (!imageUrl && !prompt) return;
    setIsVideoLoading(true);
    setVideoStatusMsg('Iniciando modelo Veo 3.1...');

    try {
      const res = await fetch('/api/gemini/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Cinematic smooth 3D animation loop of ${exercise?.palacio?.personaje || 'character'} in action for ${exercise?.nombre}`,
          startingImage: imageUrl || undefined,
          aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo inicializar la generación de video.');
      }

      const { operationName } = await res.json();
      setVideoStatusMsg('Renderizando fotogramas con Veo (esto puede tomar 1-2 minutos)...');

      // Poll status
      const checkInterval = setInterval(async () => {
        try {
          const statusRes = await fetch('/api/gemini/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName }),
          });
          const { done } = await statusRes.json();

          if (done) {
            clearInterval(checkInterval);
            setVideoStatusMsg('Descargando video final...');

            const downloadRes = await fetch('/api/gemini/video-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName }),
            });

            const blob = await downloadRes.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            setIsVideoLoading(false);
            setVideoStatusMsg('');
          }
        } catch (e) {
          clearInterval(checkInterval);
          setIsVideoLoading(false);
          setVideoStatusMsg('');
        }
      }, 10000);
    } catch (err) {
      console.error(err);
      setIsVideoLoading(false);
      setVideoStatusMsg('');
    }
  };

  const handleSave = () => {
    if (!imageUrl) return;
    setIsSaved(true);
    if (onSaveImage) {
      onSaveImage(imageUrl, customPrompt || prompt);
    } else {
      localStorage.setItem(`42prep-img-${exercise?.id}`, imageUrl);
      localStorage.setItem(`42prep-img-saved-${exercise?.id}`, 'true');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setHasError(true);
      setErrorMsg('El archivo seleccionado no es una imagen válida.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setImageUrl(dataUrl);
      setIsSaved(false);
      setHasError(false);
      setErrorMsg('');
      localStorage.setItem(`42prep-img-${exercise?.id}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSave = () => {
    const trimmed = urlInput.trim();
    if (!trimmed.startsWith('http')) {
      setUrlError('La URL debe empezar por http:// o https://');
      return;
    }
    setUrlError('');
    setImageUrl(trimmed);
    setIsSaved(false);
    setHasError(false);
    setErrorMsg('');
    localStorage.setItem(`42prep-img-${exercise?.id}`, trimmed);
  };

  const handleClearImage = () => {
    setImageUrl(null);
    setVideoUrl(null);
    setIsSaved(false);
    setHasError(false);
    setErrorMsg('');
    localStorage.removeItem(`42prep-img-${exercise?.id}`);
    localStorage.removeItem(`42prep-img-saved-${exercise?.id}`);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUrlInput('');
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `42_${exercise?.nombre || 'asociacion'}_mnemotecnia.png`;
    a.click();
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-sm">Asociación Visual (Nano Banana)</h3>
            <p className="text-[11px] text-zinc-500 font-medium">Graba la historia en tu memoria visual</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {imageUrl && (
            <>
              <button
                onClick={handleDownload}
                title="Descargar imagen"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
              >
                <Download size={14} />
              </button>
              <button
                onClick={handleClearImage}
                title="Eliminar imagen"
                className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-0.5 font-semibold px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={12} /> Borrar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl">
        {[
          { id: 'nanobanana', icon: Wand2, label: 'Generar IA ✨' },
          { id: 'video', icon: Video, label: 'Video Veo 🎬' },
          { id: 'upload', icon: Upload, label: 'Subir foto' },
          { id: 'url', icon: LinkIcon, label: 'URL web' },
        ].map(({ id: modeId, icon: Icon, label }) => (
          <button
            key={modeId}
            onClick={() => {
              setActiveTab(modeId);
              setHasError(false);
              setErrorMsg('');
            }}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all',
              activeTab === modeId
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            )}
          >
            <Icon size={12} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Visual Canvas Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden flex items-center justify-center group">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/60 backdrop-blur-md z-20 space-y-3 text-white"
            >
              <RefreshCw size={32} className="text-purple-400 animate-spin" />
              <div className="text-center">
                <p className="text-xs font-bold">Generando con Nano Banana...</p>
                <p className="text-[10px] text-zinc-300">Pintando la asociación mnemotécnica absurda</p>
              </div>
            </motion.div>
          )}

          {isVideoLoading && (
            <motion.div
              key="video-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md z-20 space-y-3 text-white p-6 text-center"
            >
              <Video size={32} className="text-purple-400 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-purple-300">Generando Video con Veo 3.1</p>
                <p className="text-[10px] text-zinc-300 mt-1 max-w-xs">{videoStatusMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {hasError && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/95 p-6 text-center z-10">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
              <HelpCircle size={20} />
            </div>
            <p className="text-xs font-bold text-red-800 mb-1">Aviso de Generación</p>
            <p className="text-[11px] text-red-700 leading-normal max-w-xs mb-3">{errorMsg}</p>
            <button
              onClick={() => handleGenerateNanoBanana(false)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Video or Image Presentation */}
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            className="h-full w-full object-cover rounded-2xl"
          />
        ) : imageUrl && !hasError ? (
          <motion.img
            key={imageUrl}
            src={imageUrl}
            alt={`Mnemotecnia para ${exercise?.nombre}`}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : !imageUrl && !hasError ? (
          <div className="text-center p-6 space-y-3 text-zinc-400">
            <div className="h-16 w-16 rounded-3xl bg-purple-50 flex items-center justify-center mx-auto text-purple-400">
              <ImageIcon size={28} />
            </div>
            <div className="max-w-xs space-y-1">
              <p className="text-xs font-bold text-zinc-700">Sin imagen generada aún</p>
              <p className="text-[11px] text-zinc-500">
                Haz clic en <strong>Generar con Nano Banana</strong> para crear la asociación visual de {exercise?.palacio?.personaje || 'tu personaje'}.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Nano Banana AI Controls */}
      {activeTab === 'nanobanana' && (
        <div className="space-y-3">
          {/* Style Presets */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Estilo Visual de Memoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {STYLE_PRESETS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id)}
                  className={clsx(
                    'px-2 py-1.5 rounded-xl text-[11px] font-semibold border transition-all text-left truncate',
                    selectedStyle === st.id
                      ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-xs'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  )}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Proporción
            </span>
            <div className="flex gap-1">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id)}
                  className={clsx(
                    'px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors',
                    aspectRatio === ar.id
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                  )}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Edit3 size={11} className="text-purple-600" /> Prompt Mnemotécnico
              </span>
              <button
                onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold"
              >
                {isEditingPrompt ? 'Listo' : 'Personalizar'}
              </button>
            </div>
            {isEditingPrompt ? (
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={2}
                className="w-full bg-white border border-zinc-200 rounded-xl p-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            ) : (
              <p className="text-xs text-zinc-600 italic line-clamp-2">
                "{customPrompt || prompt}"
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerateNanoBanana(false)}
              disabled={isLoading}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-white shadow-md transition-all',
                isLoading
                  ? 'bg-purple-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              )}
            >
              <RefreshCw size={14} className={clsx(isLoading && 'animate-spin')} />
              {imageUrl ? 'Regenerar con Nano Banana ✨' : 'Generar Imagen con Nano Banana ✨'}
            </button>

            {imageUrl && (
              <button
                onClick={handleSave}
                className={clsx(
                  'px-4 py-3 rounded-2xl text-xs font-bold border flex items-center gap-1.5 transition-all shadow-xs',
                  isSaved
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                )}
              >
                {isSaved ? <Check size={14} /> : <Save size={14} />}
                {isSaved ? 'Guardada en Palacio' : 'Guardar'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Video Tab (Veo) */}
      {activeTab === 'video' && (
        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Video size={16} className="text-purple-600" />
            <p className="text-xs text-purple-900 font-bold">Generador de Video Dinámico (Veo 3.1)</p>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Convierte la imagen del personaje o el concepto del ejercicio en un clip de video animado usando el modelo <strong>veo-3.1-lite-generate-preview</strong>.
          </p>
          <button
            onClick={handleGenerateVideoVeo}
            disabled={isVideoLoading || (!imageUrl && !prompt)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-200 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Video size={14} />
            {videoUrl ? 'Regenerar Video Veo 🎬' : 'Crear Video con Veo 🎬'}
          </button>
        </div>
      )}

      {/* Upload mode panel */}
      {activeTab === 'upload' && (
        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-3">
          <p className="text-xs text-purple-700 font-semibold">Sube una imagen desde tu dispositivo</p>
          <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-purple-200 rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all bg-white">
            <Upload size={22} className="text-purple-500" />
            <span className="text-xs text-zinc-600 font-medium">Haz clic o arrastra una imagen aquí</span>
            <span className="text-[10px] text-zinc-400">JPG, PNG, GIF, WebP</span>
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
      {activeTab === 'url' && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
          <p className="text-xs text-blue-700 font-semibold">Pega la URL de una imagen externa</p>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError('');
              }}
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
    </div>
  );
}
