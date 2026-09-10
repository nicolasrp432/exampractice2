import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, RotateCcw, CheckCircle2, AlertTriangle, Lightbulb,
  Code2, Brain, BookOpen, Layers, Plus, Trash2, Search,
  ArrowRight, Copy, Check, Filter, ChevronRight, HelpCircle,
  Clock, Zap, Eye, RefreshCw, X, ShieldAlert, Cpu
} from 'lucide-react'
import { useFlashcardStore, getPreviewIntervals } from '@/store/flashcardStore'
import { allExercises } from '@/data/index'
import confetti from 'canvas-confetti'

const CATEGORIES = [
  { id: 'todas', label: 'Todas las Categorías' },
  { id: 'resolucion', label: 'Lógica de Resolución', icon: Brain, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'sintaxis', label: 'Sintaxis C de Examen', icon: Code2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'memoria_punteros', label: 'Memoria & Punteros', icon: Cpu, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'casos_limite', label: 'Casos Límite & Trampas', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200' },
]

export default function AnkiFlashcardStudio({ initialExerciseId = null }) {
  const getAllCards = useFlashcardStore(s => s.getAllCards)
  const progressMap = useFlashcardStore(s => s.progressMap)
  const reviewCard = useFlashcardStore(s => s.reviewCard)
  const addCards = useFlashcardStore(s => s.addCards)
  const addCard = useFlashcardStore(s => s.addCard)
  const deleteCard = useFlashcardStore(s => s.deleteCard)
  const resetCardProgress = useFlashcardStore(s => s.resetCardProgress)
  const resetDeckProgress = useFlashcardStore(s => s.resetDeckProgress)

  // Modos de vista: 'estudio' | 'explorador'
  const [viewMode, setViewMode] = useState('estudio')

  // Filtros
  const [selectedQueue, setSelectedQueue] = useState('due') // 'due' | 'new' | 'all'
  const [selectedLevel, setSelectedLevel] = useState('todos') // 'todos' | 1 | 2 | 3 | 4
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const [selectedExerciseFilter, setSelectedExerciseFilter] = useState(initialExerciseId || 'todos')
  const [searchQuery, setSearchQuery] = useState('')

  // Estado del estudio activo
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0)

  // Modales
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // IA Form State
  const [aiTopic, setAiTopic] = useState(initialExerciseId || 'ft_split')
  const [aiExerciseId, setAiExerciseId] = useState(initialExerciseId || 'ft_split')
  const [aiLevel, setAiLevel] = useState(4)
  const [aiCategory, setAiCategory] = useState('resolucion')
  const [aiCount, setAiCount] = useState(3)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiGeneratedCards, setAiGeneratedCards] = useState([])
  const [aiError, setAiError] = useState(null)

  // Formulario Manual State
  const [manualCard, setManualCard] = useState({
    titulo: '',
    exerciseId: 'ft_strlen',
    nivel: 1,
    categoria: 'resolucion',
    pregunta: '',
    pista: '',
    codigoReto: '',
    respuesta: '',
    codigoSolucion: '',
    porQue: '',
    trampaMoulinette: '',
  })

  const allCards = useMemo(() => getAllCards(), [getAllCards, progressMap])

  // Identificar si una tarjeta está vencida para hoy
  const isCardDue = useCallback((card) => {
    const prog = progressMap[card.id]
    if (!prog) return true // Las tarjetas nunca vistas cuentan como para estudiar
    if (!prog.proximaFecha) return true
    return new Date(prog.proximaFecha) <= new Date()
  }, [progressMap])

  // Estadísticas globales del mazo
  const stats = useMemo(() => {
    let dueCount = 0
    let newCount = 0
    let learningCount = 0
    let masteredCount = 0

    allCards.forEach(c => {
      const prog = progressMap[c.id]
      if (!prog || prog.state === 'nueva') {
        newCount++
        dueCount++
      } else {
        if (prog.state === 'dominada') masteredCount++
        else learningCount++

        if (isCardDue(c)) dueCount++
      }
    })

    return {
      total: allCards.length,
      due: dueCount,
      new: newCount,
      learning: learningCount,
      mastered: masteredCount,
    }
  }, [allCards, progressMap, isCardDue])

  // Filtrado de tarjetas para la sesión de estudio
  const filteredStudyCards = useMemo(() => {
    return allCards.filter(card => {
      // Filtro de cola
      if (selectedQueue === 'due' && !isCardDue(card)) return false
      if (selectedQueue === 'new') {
        const prog = progressMap[card.id]
        if (prog && prog.state !== 'nueva') return false
      }
      // Filtro de nivel
      if (selectedLevel !== 'todos' && card.nivel !== Number(selectedLevel)) return false
      // Filtro de categoría
      if (selectedCategory !== 'todas' && card.categoria !== selectedCategory) return false
      // Filtro de ejercicio
      if (selectedExerciseFilter !== 'todos' && card.exerciseId !== selectedExerciseFilter) return false

      return true
    })
  }, [allCards, selectedQueue, selectedLevel, selectedCategory, selectedExerciseFilter, isCardDue, progressMap])

  // Tarjeta actual
  const currentCard = filteredStudyCards[currentIndex] || null

  // Reiniciar índice al cambiar filtros
  useEffect(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
  }, [selectedQueue, selectedLevel, selectedCategory, selectedExerciseFilter])

  // Atajos de teclado para Anki (Espacio para voltear, 1, 2, 3, 4 para calificar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAiModalOpen || isCreateModalOpen) return
      if (viewMode !== 'estudio' || !currentCard) return

      if (e.code === 'Space') {
        e.preventDefault()
        setIsFlipped(prev => !prev)
      } else if (isFlipped) {
        if (e.key === '1') handleRate('otra_vez')
        else if (e.key === '2') handleRate('dificil')
        else if (e.key === '3') handleRate('bien')
        else if (e.key === '4') handleRate('facil')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFlipped, viewMode, currentCard, isAiModalOpen, isCreateModalOpen])

  // Manejo de calificación Anki
  const handleRate = (rating) => {
    if (!currentCard) return
    reviewCard(currentCard.id, rating)
    setSessionCompletedCount(prev => prev + 1)
    setIsFlipped(false)
    setShowHint(false)

    // Si calificó "otra vez", la tarjeta puede reaparecer en la misma sesión
    if (rating === 'otra_vez') {
      // Avanzar al siguiente o mantener si es la única
      if (currentIndex < filteredStudyCards.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setCurrentIndex(0)
      }
    } else {
      if (currentIndex >= filteredStudyCards.length - 1) {
        // Fin de la tanda
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } })
      } else {
        setCurrentIndex(prev => prev + 1)
      }
    }
  }

  // Copiar código al portapapeles
  const handleCopy = (code) => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // Generación con IA
  const handleGenerateAiCards = async () => {
    setAiLoading(true)
    setAiError(null)
    setAiGeneratedCards([])

    try {
      const res = await fetch('/api/gemini/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          exerciseId: aiExerciseId,
          level: Number(aiLevel),
          category: aiCategory,
          count: Number(aiCount),
        }),
      })

      if (!res.ok) throw new Error('Fallo en la comunicación con el generador')
      const data = await res.json()

      if (data.flashcards && data.flashcards.length > 0) {
        setAiGeneratedCards(data.flashcards)
      } else {
        throw new Error('No se generaron tarjetas válidas')
      }
    } catch (err) {
      setAiError(err.message || 'Error al generar flashcards con IA')
    } finally {
      setAiLoading(false)
    }
  }

  // Guardar tarjetas de IA en el mazo
  const handleSaveAiCards = () => {
    if (aiGeneratedCards.length === 0) return
    addCards(aiGeneratedCards)
    setIsAiModalOpen(false)
    setAiGeneratedCards([])
    confetti({ particleCount: 50, spread: 50 })
  }

  // Guardar tarjeta manual
  const handleSaveManualCard = (e) => {
    e.preventDefault()
    if (!manualCard.pregunta || !manualCard.respuesta) return
    addCard({
      ...manualCard,
      nivel: Number(manualCard.nivel),
    })
    setIsCreateModalOpen(false)
    setManualCard({
      titulo: '',
      exerciseId: 'ft_strlen',
      nivel: 1,
      categoria: 'resolucion',
      pregunta: '',
      pista: '',
      codigoReto: '',
      respuesta: '',
      codigoSolucion: '',
      porQue: '',
      trampaMoulinette: '',
    })
  }

  // Intervalos de la tarjeta actual para vista previa de botones
  const currentIntervals = useMemo(() => {
    if (!currentCard) return { otra_vez: '<10m', dificil: '1d', bien: '3d', facil: '6d' }
    return getPreviewIntervals(progressMap[currentCard.id])
  }, [currentCard, progressMap])

  return (
    <div className="space-y-6">
      {/* ─── ENCABEZADO Y ACCIONES PRINCIPALES ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-900 text-white">
              <Zap size={12} />
              Sistema Anki • SM-2
            </span>
            <span className="text-xs text-zinc-500 font-mono">Rank 02 C Exam</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Flashcards de Sintaxis y Resolución C
          </h2>
          <p className="text-sm text-zinc-600">
            Preguntas técnicas de examen: cómo estructurar el código, manejo de punteros y trampas de Moulinette.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors shadow-xs"
          >
            <Sparkles size={14} />
            Generar con IA
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
          >
            <Plus size={14} />
            Crear Flashcard
          </button>

          <div className="h-6 w-px bg-zinc-200 hidden sm:block" />

          {/* Toggle Modo Estudio / Explorador */}
          <div className="flex items-center p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 text-xs">
            <button
              onClick={() => setViewMode('estudio')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'estudio' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Modo Estudio
            </button>
            <button
              onClick={() => setViewMode('explorador')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'explorador' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Explorador ({allCards.length})
            </button>
          </div>
        </div>
      </div>

      {/* ─── BARRA DE ESTADÍSTICAS DEL MAZO ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => { setSelectedQueue('due'); setViewMode('estudio'); }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedQueue === 'due' && viewMode === 'estudio'
              ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-semibold mb-1">
            <span>Para Hoy</span>
            <Clock size={14} />
          </div>
          <div className="text-2xl font-black text-rose-950 font-mono tracking-tight">{stats.due}</div>
          <p className="text-[11px] text-rose-700/80 mt-0.5">Tarjetas pendientes de repasar</p>
        </div>

        <div
          onClick={() => { setSelectedQueue('new'); setViewMode('estudio'); }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedQueue === 'new' && viewMode === 'estudio'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/20'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-700 font-semibold mb-1">
            <span>Nuevas</span>
            <Sparkles size={14} />
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono tracking-tight">{stats.new}</div>
          <p className="text-[11px] text-blue-700/80 mt-0.5">Aún no evaluadas</p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
            <span>En Aprendizaje</span>
            <Layers size={14} />
          </div>
          <div className="text-2xl font-black text-amber-950 font-mono tracking-tight">{stats.learning}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">En intervalo de consolidación</p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
            <span>Dominadas</span>
            <CheckCircle2 size={14} />
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono tracking-tight">{stats.mastered}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Intervalo ≥ 14 días</p>
        </div>
      </div>

      {/* ─── FILTROS Y CONTROLES ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50/80 p-3 rounded-xl border border-zinc-200">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Selector de Nivel */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-500 font-medium mr-1">Nivel:</span>
            {['todos', 1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                {lvl === 'todos' ? 'Todos' : `Lvl ${lvl}`}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-zinc-300 hidden md:block" />

          {/* Selector de Ejercicio */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-500 font-medium mr-1">Ejercicio:</span>
            <select
              value={selectedExerciseFilter}
              onChange={(e) => setSelectedExerciseFilter(e.target.value)}
              className="bg-white border border-zinc-200 rounded-md px-2.5 py-1 text-xs text-zinc-800 font-medium font-mono focus:outline-hidden focus:ring-1 focus:ring-zinc-400 max-w-[160px] truncate"
            >
              <option value="todos">Todos ({allExercises.length})</option>
              {allExercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.nombre}</option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-zinc-300 hidden md:block" />

          {/* Selector de Categoría */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-500 font-medium mr-1">Enfoque:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-zinc-200 rounded-md px-2.5 py-1 text-xs text-zinc-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {viewMode === 'estudio' && (
          <div className="text-xs text-zinc-500 font-medium">
            Tarjetas en cola actual: <span className="font-bold text-zinc-900 font-mono">{filteredStudyCards.length}</span>
          </div>
        )}
      </div>

      {/* ─── VISTA 1: MODO ESTUDIO ANKI ─── */}
      {viewMode === 'estudio' && (
        <div>
          {filteredStudyCards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 size={30} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">¡Mazo al día para esta selección!</h3>
              <p className="text-sm text-zinc-600 mb-6">
                {selectedQueue === 'due'
                  ? 'Has completado todas las tarjetas pendientes programadas para hoy según el algoritmo SM-2.'
                  : 'No hay tarjetas que coincidan con los filtros seleccionados.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedQueue('all')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
                >
                  Repasar Todas ({allCards.length})
                </button>
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  Generar Nuevas con IA
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Barra de progreso de la sesión */}
              <div className="flex items-center justify-between text-xs text-zinc-500 font-medium px-1">
                <span>
                  Tarjeta <strong className="text-zinc-900 font-mono">{currentIndex + 1}</strong> de{' '}
                  <strong className="text-zinc-900 font-mono">{filteredStudyCards.length}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sesión activa • {sessionCompletedCount} evaluadas
                </span>
              </div>

              {/* Contenedor de la Tarjeta Anki */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-md overflow-hidden transition-all">
                {/* Cabecera de la tarjeta */}
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-900 text-white font-mono">
                      {currentCard.exerciseId}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-200 text-zinc-800">
                      Nivel {currentCard.nivel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {currentCard.categoria === 'memoria_punteros'
                        ? 'Memoria & Punteros'
                        : currentCard.categoria === 'casos_limite'
                        ? 'Casos Límite & Trampas'
                        : currentCard.categoria === 'sintaxis'
                        ? 'Sintaxis C'
                        : 'Lógica de Resolución'}
                    </span>
                    {currentCard.origen === 'ia' && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                        <Sparkles size={10} /> IA
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-zinc-400 font-mono">
                    {progressMap[currentCard.id]?.state === 'dominada' ? (
                      <span className="text-emerald-600 font-semibold">● Dominada</span>
                    ) : progressMap[currentCard.id]?.state === 'repaso' ? (
                      <span className="text-blue-600 font-semibold">● Repaso</span>
                    ) : (
                      <span className="text-zinc-500">● Nueva</span>
                    )}
                  </div>
                </div>

                {/* ─── ANVERSO: PREGUNTA Y RETO ─── */}
                <div className="p-6 sm:p-8 space-y-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      {currentCard.titulo || 'Pregunta de Examen'}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-zinc-900 leading-snug">
                      {currentCard.pregunta}
                    </p>
                  </div>

                  {/* Snippet reto si existe */}
                  {currentCard.codigoReto && (
                    <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 font-mono text-xs text-zinc-200 overflow-x-auto">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2 pb-1 border-b border-zinc-800">
                        <span className="flex items-center gap-1">
                          <Code2 size={12} /> Código a analizar
                        </span>
                        <span>C99</span>
                      </div>
                      <pre className="leading-relaxed">{currentCard.codigoReto}</pre>
                    </div>
                  )}

                  {/* Pista desplegable */}
                  {currentCard.pista && (
                    <div>
                      {!showHint ? (
                        <button
                          onClick={() => setShowHint(true)}
                          className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium hover:underline"
                        >
                          <Lightbulb size={13} />
                          ¿Necesitas una pista?
                        </button>
                      ) : (
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 animate-fadeIn">
                          <Lightbulb size={14} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold">Pista mental: </strong>
                            {currentCard.pista}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ─── REVERSO: RESPUESTA, CÓDIGO Y TRAMPA ─── */}
                  <AnimatePresence>
                    {isFlipped && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pt-6 border-t border-zinc-200 space-y-5"
                      >
                        {/* Explicación de la resolución */}
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 size={13} />
                            Lógica de Resolución & Paso a Paso
                          </h4>
                          <p className="text-sm text-zinc-800 leading-relaxed bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100">
                            {currentCard.respuesta}
                          </p>
                        </div>

                        {/* Código C idiomático de solución */}
                        {currentCard.codigoSolucion && (
                          <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 font-mono text-xs text-zinc-200 overflow-x-auto relative">
                            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 pb-1.5 border-b border-zinc-800">
                              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                                <Code2 size={12} /> Solución Canónica 42
                              </span>
                              <button
                                onClick={() => handleCopy(currentCard.codigoSolucion)}
                                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                              >
                                {copiedCode ? (
                                  <>
                                    <Check size={12} className="text-emerald-400" />
                                    <span className="text-emerald-400">Copiado</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>Copiar</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="leading-relaxed text-emerald-300 font-medium">{currentCard.codigoSolucion}</pre>
                          </div>
                        )}

                        {/* Por qué funciona */}
                        {currentCard.porQue && (
                          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-700">
                            <span className="font-semibold text-zinc-900">¿Por qué funciona así?: </span>
                            {currentCard.porQue}
                          </div>
                        )}

                        {/* Trampa crítica de Moulinette */}
                        {currentCard.trampaMoulinette && (
                          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 flex items-start gap-2.5">
                            <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold text-rose-900 uppercase tracking-wide block mb-0.5">
                                ⚠️ Trampa Mortal de Moulinette (Causa de 0)
                              </strong>
                              <span>{currentCard.trampaMoulinette}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ─── BARRA DE ACCIONES ANKI (CALIFICACIONES) ─── */}
                <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200">
                  {!isFlipped ? (
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      Mostrar Respuesta
                      <span className="text-xs text-zinc-400 font-normal font-mono ml-2">[Espacio]</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-[11px] text-zinc-500 text-center font-medium">
                        ¿Cómo te ha ido? Elige para programar la próxima repetición:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* 1. Otra vez */}
                        <button
                          onClick={() => handleRate('otra_vez')}
                          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-800 transition-colors"
                        >
                          <span className="text-xs font-bold flex items-center gap-1">
                            <RotateCcw size={12} /> Otra vez
                          </span>
                          <span className="text-[10px] text-rose-600 font-mono mt-0.5">
                            {currentIntervals.otra_vez} [1]
                          </span>
                        </button>

                        {/* 2. Difícil */}
                        <button
                          onClick={() => handleRate('dificil')}
                          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 transition-colors"
                        >
                          <span className="text-xs font-bold">Difícil</span>
                          <span className="text-[10px] text-amber-600 font-mono mt-0.5">
                            {currentIntervals.dificil} [2]
                          </span>
                        </button>

                        {/* 3. Bien */}
                        <button
                          onClick={() => handleRate('bien')}
                          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 transition-colors"
                        >
                          <span className="text-xs font-bold">Bien</span>
                          <span className="text-[10px] text-blue-600 font-mono mt-0.5">
                            {currentIntervals.bien} [3]
                          </span>
                        </button>

                        {/* 4. Fácil */}
                        <button
                          onClick={() => handleRate('facil')}
                          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 transition-colors"
                        >
                          <span className="text-xs font-bold">Fácil</span>
                          <span className="text-[10px] text-emerald-600 font-mono mt-0.5">
                            {currentIntervals.facil} [4]
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón rápido para saltar al siguiente si solo estás repasando */}
              <div className="flex items-center justify-between px-1">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setShowHint(false);
                    setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredStudyCards.length - 1));
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-800 font-medium"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setShowHint(false);
                    setCurrentIndex(prev => (prev < filteredStudyCards.length - 1 ? prev + 1 : 0));
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-800 font-medium"
                >
                  Saltar a la siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── VISTA 2: EXPLORADOR DEL MAZO Y BÚSQUEDA ─── */}
      {viewMode === 'explorador' && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por ejercicio, concepto, código o pregunta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <button
              onClick={() => {
                if (window.confirm('¿Deseas reiniciar el progreso de repetición espaciada de todo el mazo?')) {
                  resetDeckProgress()
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200 transition-colors"
            >
              <RotateCcw size={13} />
              Reiniciar Progreso
            </button>
          </div>

          {/* Listado de tarjetas */}
          <div className="divide-y divide-zinc-100 max-h-[600px] overflow-y-auto pr-1">
            {allCards
              .filter(c => {
                if (selectedLevel !== 'todos' && c.nivel !== Number(selectedLevel)) return false
                if (selectedCategory !== 'todas' && c.categoria !== selectedCategory) return false
                if (selectedExerciseFilter !== 'todos' && c.exerciseId !== selectedExerciseFilter) return false
                if (!searchQuery) return true
                const q = searchQuery.toLowerCase()
                return (
                  c.exerciseId?.toLowerCase().includes(q) ||
                  c.titulo?.toLowerCase().includes(q) ||
                  c.pregunta?.toLowerCase().includes(q) ||
                  c.respuesta?.toLowerCase().includes(q)
                )
              })
              .map(card => {
                const prog = progressMap[card.id]
                return (
                  <div key={card.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-50/60 p-2 rounded-lg transition-colors">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                          {card.exerciseId}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-medium">Lvl {card.nivel}</span>
                        <span className="text-[11px] text-zinc-400">•</span>
                        <span className="text-xs font-semibold text-zinc-700 truncate">{card.titulo}</span>
                        {card.origen === 'ia' && (
                          <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-1.5 py-0.2 rounded border border-purple-200">
                            IA
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-800 line-clamp-2">{card.pregunta}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-xs">
                        <div className="font-semibold text-zinc-800">
                          {prog?.state === 'dominada' ? (
                            <span className="text-emerald-600">Dominada</span>
                          ) : prog?.state === 'repaso' ? (
                            <span className="text-blue-600">En Repaso</span>
                          ) : (
                            <span className="text-zinc-400">Nueva</span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          Int: {prog?.intervaloDias || 0}d • EF: {prog?.factorFacilidad || 2.5}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const idx = filteredStudyCards.findIndex(c => c.id === card.id)
                          if (idx !== -1) {
                            setCurrentIndex(idx)
                          }
                          setViewMode('estudio')
                          setIsFlipped(false)
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
                      >
                        Estudiar
                      </button>

                      {card.origen !== 'predefinida' && (
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar tarjeta personalizada"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ─── MODAL: GENERADOR DE FLASHCARDS CON IA (GEMINI) ─── */}
      <AnimatePresence>
        {isAiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900">Generar Flashcards con IA</h3>
                    <p className="text-xs text-zinc-500">Enfocado en Sintaxis C, Algoritmos y Trampas de Moulinette</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Formulario de parámetros */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Ejercicio de 42 o Tema a Tratar
                  </label>
                  <select
                    value={aiExerciseId}
                    onChange={(e) => {
                      setAiExerciseId(e.target.value)
                      setAiTopic(e.target.value)
                      const ex = allExercises?.find(x => x.id === e.target.value)
                      if (ex?.nivel) setAiLevel(ex.nivel)
                    }}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-sm text-zinc-800 font-medium"
                  >
                    <optgroup label="Nivel 1">
                      <option value="ft_strlen">ft_strlen</option>
                      <option value="ft_swap">ft_swap</option>
                      <option value="ft_putstr">ft_putstr</option>
                      <option value="first_word">first_word</option>
                      <option value="fizzbuzz">fizzbuzz</option>
                      <option value="rotone">rotone</option>
                      <option value="repeat_alpha">repeat_alpha</option>
                      <option value="search_and_replace">search_and_replace</option>
                    </optgroup>
                    <optgroup label="Nivel 2">
                      <option value="ft_atoi">ft_atoi</option>
                      <option value="ft_strcmp">ft_strcmp</option>
                      <option value="ft_strcspn">ft_strcspn</option>
                      <option value="ft_strdup">ft_strdup</option>
                      <option value="inter">inter</option>
                      <option value="union">union</option>
                      <option value="print_bits">print_bits</option>
                      <option value="swap_bits">swap_bits</option>
                      <option value="is_power_of_2">is_power_of_2</option>
                    </optgroup>
                    <optgroup label="Nivel 3">
                      <option value="ft_range">ft_range</option>
                      <option value="ft_rrange">ft_rrange</option>
                      <option value="ft_atoi_base">ft_atoi_base</option>
                      <option value="add_prime_sum">add_prime_sum</option>
                      <option value="epur_str">epur_str</option>
                      <option value="expand_str">expand_str</option>
                      <option value="tab_mult">tab_mult</option>
                      <option value="ft_list_size">ft_list_size</option>
                      <option value="pgcd">pgcd</option>
                    </optgroup>
                    <optgroup label="Nivel 4">
                      <option value="ft_split">ft_split</option>
                      <option value="ft_itoa">ft_itoa</option>
                      <option value="fprime">fprime</option>
                      <option value="sort_list">sort_list</option>
                      <option value="flood_fill">flood_fill</option>
                      <option value="rostring">rostring</option>
                      <option value="rev_wstr">rev_wstr</option>
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Enfoque Didáctico</label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800 font-medium"
                    >
                      <option value="resolucion">Lógica de Resolución</option>
                      <option value="sintaxis">Sintaxis C y Punteros</option>
                      <option value="memoria_punteros">Memoria y Malloc</option>
                      <option value="casos_limite">Casos Límite / Moulinette</option>
                      <option value="general">Equilibrado / Variado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Cantidad de Tarjetas</label>
                    <select
                      value={aiCount}
                      onChange={(e) => setAiCount(Number(e.target.value))}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800 font-medium"
                    >
                      <option value={2}>2 tarjetas</option>
                      <option value={3}>3 tarjetas</option>
                      <option value={5}>5 tarjetas</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiCards}
                  disabled={aiLoading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Analizando código y generando flashcards...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generar con Gemini
                    </>
                  )}
                </button>

                {aiError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                    {aiError}
                  </div>
                )}

                {/* Preview de tarjetas generadas */}
                {aiGeneratedCards.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-zinc-200">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                      <span>Tarjetas Generadas ({aiGeneratedCards.length})</span>
                      <button
                        onClick={handleSaveAiCards}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Check size={13} />
                        Guardar en mi mazo Anki
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {aiGeneratedCards.map((card, i) => (
                        <div key={i} className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs space-y-1">
                          <div className="font-bold text-zinc-900">{card.titulo}</div>
                          <div className="text-zinc-700 font-medium">{card.pregunta}</div>
                          <div className="text-emerald-700 text-[11px] pt-1">{card.respuesta}</div>
                          {card.codigoSolucion && (
                            <pre className="p-2 bg-zinc-900 text-emerald-300 rounded font-mono text-[10px] overflow-x-auto mt-1">
                              {card.codigoSolucion}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: CREAR FLASHCARD MANUAL ─── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="font-bold text-zinc-900">Crear Flashcard Manual</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveManualCard} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Ejercicio ID</label>
                    <input
                      type="text"
                      value={manualCard.exerciseId}
                      onChange={(e) => setManualCard({ ...manualCard, exerciseId: e.target.value })}
                      placeholder="ej: ft_split"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Nivel</label>
                    <select
                      value={manualCard.nivel}
                      onChange={(e) => setManualCard({ ...manualCard, nivel: Number(e.target.value) })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800"
                    >
                      <option value={1}>Nivel 1</option>
                      <option value={2}>Nivel 2</option>
                      <option value={3}>Nivel 3</option>
                      <option value={4}>Nivel 4</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Título de la Tarjeta</label>
                  <input
                    type="text"
                    value={manualCard.titulo}
                    onChange={(e) => setManualCard({ ...manualCard, titulo: e.target.value })}
                    placeholder="ej: Gestión de puntero NULL en ft_split"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Pregunta Técnica</label>
                  <textarea
                    rows={2}
                    value={manualCard.pregunta}
                    onChange={(e) => setManualCard({ ...manualCard, pregunta: e.target.value })}
                    placeholder="¿Por qué se debe poner res[words] = NULL al final?"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Respuesta / Paso a Paso</label>
                  <textarea
                    rows={2}
                    value={manualCard.respuesta}
                    onChange={(e) => setManualCard({ ...manualCard, respuesta: e.target.value })}
                    placeholder="Explicación clara y concisa de la solución..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Código C de Solución (Opcional)</label>
                  <textarea
                    rows={2}
                    value={manualCard.codigoSolucion}
                    onChange={(e) => setManualCard({ ...manualCard, codigoSolucion: e.target.value })}
                    placeholder="char **res = malloc(...);"
                    className="w-full bg-zinc-950 text-emerald-300 font-mono border border-zinc-800 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Trampa de Moulinette (Opcional)</label>
                  <input
                    type="text"
                    value={manualCard.trampaMoulinette}
                    onChange={(e) => setManualCard({ ...manualCard, trampaMoulinette: e.target.value })}
                    placeholder="No verificar si malloc devuelve NULL..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs"
                  >
                    Guardar Tarjeta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
