import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Map, BrainCircuit, Users, ArrowLeft, ArrowRight, Check, X, Search, RotateCcw, Gauge } from 'lucide-react';
import clsx from 'clsx';
import { allExercises } from '@/data/index';
import { useProgressStore } from '@/store/progressStore';
import { getToolById } from '@/utils/tools';

// Bloque de comprensión para el reverso de la flashcard: en vez de solo la
// historia mnemónica, reta con el "porqué" (decisión clave) y las herramientas.
function BackFaceExtras({ exercise }) {
  const [revealed, setRevealed] = useState(false);
  const decision = exercise.desglose?.decisionesClave?.[0];
  const herramientas = exercise.herramientas ?? [];

  if (!decision && herramientas.length === 0) return null;

  return (
    <div className="shrink-0 mt-4 pt-4 border-t border-purple-200 space-y-3">
      {herramientas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {herramientas.map((id) => {
            const t = getToolById(id);
            if (!t) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-medium"
              >
                {t.emoji} {t.label}
              </span>
            );
          })}
        </div>
      )}

      {decision && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRevealed((v) => !v);
          }}
          className="w-full text-left bg-white border border-amber-200 rounded-xl px-3 py-2 hover:bg-amber-50/50 transition-colors"
        >
          <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
            🤔 {decision.pregunta}
          </p>
          {revealed ? (
            <p className="text-sm text-zinc-700 mt-1">{decision.respuesta}</p>
          ) : (
            <p className="text-xs text-zinc-400 mt-1">Toca para ver el porqué</p>
          )}
        </button>
      )}
    </div>
  );
}

const ROOMS = [
  { id: 'cocina', name: 'Cocina', icon: '🍳', level: 1, color: 'bg-purple-50 border-purple-200 text-purple-700', active: 'bg-purple-100' },
  { id: 'salón', name: 'Salón', icon: '🛋️', level: 2, color: 'bg-green-50 border-green-200 text-green-700', active: 'bg-green-100' },
  { id: 'dormitorio', name: 'Dormitorio', icon: '🛏️', level: 3, color: 'bg-orange-50 border-orange-200 text-orange-700', active: 'bg-orange-100' },
  { id: 'garaje', name: 'Garaje', icon: '🔧', level: 4, color: 'bg-red-50 border-red-200 text-red-700', active: 'bg-red-100' },
];

function PalaceView({ ejercicios }) {
  const [zoomedRoom, setZoomedRoom] = useState(null);
  const navigate = useNavigate();

  const getExercisesForRoom = (level) => allExercises.filter(e => e.nivel === level);

  if (zoomedRoom) {
    const room = ROOMS.find(r => r.id === zoomedRoom);
    const roomExercises = getExercisesForRoom(room.level);
    
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setZoomedRoom(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-zinc-600" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{room.icon}</span>
            <h2 className="text-2xl font-bold text-zinc-800">{room.name}</h2>
            <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-sm font-medium">Nivel {room.level}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {roomExercises.map((ex, i) => {
            const estado = ejercicios[ex.id]?.estado || 'no_iniciado';
            const savedImg = localStorage.getItem(`42prep-img-${ex.id}`);
            const estadoColor = estado === 'dominado' ? 'border-green-300 bg-green-50' : 
                               estado === 'practicando' ? 'border-orange-300 bg-orange-50' : 
                               'border-zinc-200 bg-white hover:border-zinc-300';
                               
            return (
              <motion.button
                key={ex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/ejercicio/${ex.id}`)}
                className={clsx('flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all hover:shadow-md cursor-pointer overflow-hidden', estadoColor)}
              >
                {savedImg ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 shadow-xs border border-zinc-200/60 shrink-0">
                    <img src={savedImg} alt={ex.nombre} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-5xl mb-3 block drop-shadow-sm">{ex.palacio?.emoji || '❓'}</span>
                )}
                <span className="font-bold text-zinc-800 text-sm mb-1">{ex.palacio?.personaje || 'Sin Personaje'}</span>
                <span className="font-mono text-xs text-zinc-500">{ex.nombre}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[500px]">
      {ROOMS.map((room, i) => {
        const roomExercises = getExercisesForRoom(room.level);
        const dominados = roomExercises.filter(ex => ejercicios[ex.id]?.estado === 'dominado').length;
        
        return (
          <motion.button
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setZoomedRoom(room.id)}
            className={clsx(
              "relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden group",
              room.color
            )}
          >
            <div className={clsx("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity", room.active)} />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-7xl mb-4 drop-shadow-sm">{room.icon}</span>
              <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
              <div className="px-4 py-1.5 bg-white/60 backdrop-blur-sm rounded-full text-sm font-semibold shadow-sm">
                Nivel {room.level} • {dominados}/{roomExercises.length} dominados
              </div>
            </div>
            
            <div className="relative z-10 w-full mt-8 flex flex-wrap justify-center gap-2 px-4">
              {roomExercises.slice(0, 8).map((ex) => (
                <span key={ex.id} className="text-2xl" title={ex.nombre}>{ex.palacio?.emoji || '❓'}</span>
              ))}
              {roomExercises.length > 8 && <span className="text-lg font-bold opacity-50 flex items-center justify-center w-8 h-8">+{roomExercises.length - 8}</span>}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function FlashcardsView({ ejercicios }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [deck, setDeck] = useState([]);

  const flashcardExercises = useMemo(() => {
    return [...allExercises].sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    const initialDeck = flashcardExercises.map(ex => ({
      id: ex.id,
      dueAt: 0,
      intervalDays: ejercicios[ex.id]?.intervaloDias || 1,
      exercise: ex,
    }));
    setDeck(initialDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcardExercises, ejercicios]);

  const currentCard = deck[currentIndex];

  const scheduleCard = useCallback((correct) => {
    setDeck(prev => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const now = Date.now();
      const card = next[currentIndex];
      const nextInterval = correct
        ? Math.min((card.intervalDays || 1) * 2, 30)
        : 1;
      card.intervalDays = nextInterval;
      card.dueAt = now + nextInterval * 24 * 60 * 60 * 1000;
      if (!correct) {
        next.splice(currentIndex, 1);
        const insertAt = Math.min(currentIndex + 1, next.length);
        next.splice(insertAt, 0, card);
        return next;
      }
      return next;
    });
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex(i => (i - 1 + Math.max(deck.length, 1)) % Math.max(deck.length, 1));
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex(i => (i + 1) % Math.max(deck.length, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck.length]);

  if (deck.length === 0 || !currentCard) return null;

  const exercise = currentCard.exercise;
  const progresoSesion = Math.min(sessionStats.correct + sessionStats.wrong, 30);

  const handleFlip = () => setIsFlipped(v => !v);
  
  const nextCard = (correct) => {
    setSessionStats(s => ({ ...s, [correct ? 'correct' : 'wrong']: s[correct ? 'correct' : 'wrong'] + 1 }));
    scheduleCard(correct);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % deck.length);
    }, 150);
  };
  
  const prevCard = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i - 1 + deck.length) % deck.length);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto min-h-[500px]">
      
      <div className="w-full flex items-center justify-between mb-8 px-4">
        <span className="text-sm font-semibold text-zinc-500 flex items-center gap-2"><Gauge size={15} /> Sesión actual</span>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-red-500 flex items-center gap-1"><X size={16}/> {sessionStats.wrong}</span>
          <span className="text-green-500 flex items-center gap-1"><Check size={16}/> {sessionStats.correct}</span>
        </div>
        <span className="text-sm font-semibold text-zinc-500">{progresoSesion}/30</span>
      </div>

      <div className="w-full aspect-[3/4] sm:aspect-video relative" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={handleFlip}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* ANVERSO */}
              <div 
                className="absolute inset-0 w-full h-full bg-white border-2 border-zinc-200 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-center overflow-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {localStorage.getItem(`42prep-img-${exercise.id}`) ? (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden mb-4 shadow-md border border-zinc-200">
                    <img src={localStorage.getItem(`42prep-img-${exercise.id}`)} alt={exercise.nombre} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-8xl mb-6 drop-shadow-md">{exercise.palacio?.emoji || '❓'}</span>
                )}
                <h2 className="text-3xl font-bold text-zinc-800 font-mono">{exercise.nombre}</h2>
                <div className="mt-6 px-4 py-2 bg-zinc-100 text-zinc-500 rounded-full font-medium text-sm animate-pulse">
                  Click para revelar
                </div>
              </div>

              {/* REVERSO */}
              <div 
                className="absolute inset-0 w-full h-full bg-purple-50 border-2 border-purple-200 rounded-3xl shadow-lg flex flex-col p-8 overflow-y-auto"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="text-center mb-6 border-b border-purple-200 pb-4 shrink-0">
                  <h3 className="text-2xl font-bold text-purple-900">{exercise.palacio?.personaje}</h3>
                  <span className="font-mono text-sm text-purple-600">{exercise.nombre}</span>
                </div>
                
                <p className="text-base text-zinc-700 leading-relaxed mb-6 italic flex-1">
                  "{exercise.palacio?.historia}"
                </p>

                <div className="shrink-0">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-3">Anclas Clave</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {exercise.palacio?.anclas?.map((a, i) => (
                      <span key={i} className="bg-white border border-purple-100 text-purple-800 px-3 py-1.5 rounded-lg text-sm font-mono shadow-sm">
                        {a}
                      </span>
                    ))}
                  </div>

                  {exercise.formulaClave && (
                    <div className="mt-auto">
                      <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-3">Fórmula</h4>
                      <div className="bg-white p-4 rounded-xl border border-purple-100 font-mono text-sm text-zinc-800 shadow-sm text-center">
                        {exercise.formulaClave.minusculas || exercise.formulaClave.formula || exercise.formulaClave.descripcion}
                      </div>
                    </div>
                  )}

                  <BackFaceExtras exercise={exercise} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 mt-8 w-full">
        <button
          onClick={prevCard}
          className="p-4 bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors shadow-sm"
          title="Anterior"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextCard(false); }}
          className="flex-1 py-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-lg transition-colors shadow-sm"
        >
          No lo sé
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextCard(true); }}
          className="flex-1 py-4 bg-green-500 border border-transparent text-white hover:bg-green-600 rounded-xl font-bold text-lg transition-colors shadow-md"
        >
          Lo tengo
        </button>
        <button
          onClick={() => {
            setDeck(prev => [...prev].sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="p-4 bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors shadow-sm"
          title="Mezclar mazo"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}

function CharactersView({ ejercicios }) {
  const navigate = useNavigate();
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return allExercises.filter(ex => {
      const st = ejercicios[ex.id]?.estado || 'no_iniciado';
      if (filterLevel !== 'all' && ex.nivel !== parseInt(filterLevel)) return false;
      if (filterDifficulty !== 'all' && ex.dificultad !== filterDifficulty) return false;
      if (filterStatus !== 'all' && st !== filterStatus) return false;
      if (search && !ex.nombre.toLowerCase().includes(search.toLowerCase()) && !(ex.palacio?.personaje||'').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterLevel, filterDifficulty, filterStatus, search, ejercicios]);

  return (
    <div className="space-y-6">
      {/* FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Buscar personaje o ejercicio..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none">
          <option value="all">Todos los niveles</option>
          <option value="1">Nivel 1</option>
          <option value="2">Nivel 2</option>
          <option value="3">Nivel 3</option>
          <option value="4">Nivel 4</option>
        </select>

        <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none">
          <option value="all">Todas las dif.</option>
          <option value="fácil">Fácil</option>
          <option value="medio">Medio</option>
          <option value="difícil">Difícil</option>
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none">
          <option value="all">Todos los estados</option>
          <option value="no_iniciado">Sin empezar</option>
          <option value="practicando">Practicando</option>
          <option value="dominado">Dominado</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filtered.map(ex => {
            const estado = ejercicios[ex.id]?.estado || 'no_iniciado';
            const savedImg = localStorage.getItem(`42prep-img-${ex.id}`);
            return (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={ex.id}
                onClick={() => navigate(`/ejercicio/${ex.id}`)}
                className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-md hover:border-zinc-300 transition-all text-left h-full overflow-hidden"
              >
                {savedImg ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 shadow-xs border border-zinc-200 shrink-0">
                    <img src={savedImg} alt={ex.nombre} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-5xl mb-3 drop-shadow-sm">{ex.palacio?.emoji || '❓'}</span>
                )}
                <h3 className="font-bold text-zinc-800 leading-tight mb-1">{ex.palacio?.personaje || 'Sin Personaje'}</h3>
                <span className="font-mono text-xs text-zinc-500 mb-3">{ex.nombre}</span>
                
                <div className="w-full flex items-center justify-between mt-auto pt-3 border-t border-zinc-100">
                  <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md">
                    Nivel {ex.nivel}
                  </span>
                  <span className={clsx(
                    "w-3 h-3 rounded-full",
                    estado === 'dominado' ? 'bg-green-500' :
                    estado === 'practicando' ? 'bg-orange-400' : 'bg-zinc-300'
                  )} title={estado} />
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No se encontraron personajes con esos filtros.
          </div>
        )}
      </div>
    </div>
  );
}

export default function MemoryPalace() {
  const [mode, setMode] = useState('palace'); // 'palace' | 'flashcards' | 'characters'
  const [searchParams, setSearchParams] = useSearchParams();
  const { ejercicios } = useProgressStore();

  useEffect(() => {
    const paramMode = searchParams.get('mode');
    if (paramMode === 'flashcards' || paramMode === 'characters' || paramMode === 'palace') {
      setMode(paramMode);
    }
  }, [searchParams]);

  const updateMode = useCallback((nextMode) => {
    setMode(nextMode);
    setSearchParams({ mode: nextMode }, { replace: true });
  }, [setSearchParams]);

  const tabs = [
    { id: 'palace', label: 'Palacio', icon: <Map size={16} /> },
    { id: 'flashcards', label: 'Flash Cards', icon: <BrainCircuit size={16} /> },
    { id: 'characters', label: 'Personajes', icon: <Users size={16} /> },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Palacio de la Memoria</h1>
          <p className="text-zinc-500">Repasa tus historias, personajes y anclas para dominar el examen.</p>
        </div>

        {/* TOGGLE */}
        <div className="flex items-center p-1 bg-zinc-100 rounded-xl self-start md:self-auto border border-zinc-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => updateMode(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all relative",
                mode === tab.id ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {mode === tab.id && (
                <motion.div
                  layoutId="palace-tab-indicator"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-zinc-200/50"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {mode === 'palace' && (
            <motion.div key="palace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <PalaceView ejercicios={ejercicios} />
            </motion.div>
          )}
          {mode === 'flashcards' && (
            <motion.div key="flashcards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <FlashcardsView ejercicios={ejercicios} />
            </motion.div>
          )}
          {mode === 'characters' && (
            <motion.div key="characters" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <CharactersView ejercicios={ejercicios} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
