import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Map, Wrench, Clock, BarChart2, GraduationCap,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react'
import clsx from 'clsx'
import { useProgressStore } from '@/store/progressStore'
import { exercisesByLevel } from '@/data/index'

const NAV_ITEMS = [
  { to: '/',            icon: Home,     label: 'Inicio'    },
  { to: '/fundamentos', icon: GraduationCap, label: 'Fundamentos' },
  { to: '/palacio',     icon: Map,      label: 'Palacio'   },
  { to: '/herramientas',icon: Wrench,   label: 'Herramientas' },
  { to: '/examen',      icon: Clock,    label: 'Examen'    },
  { to: '/progreso',    icon: BarChart2, label: 'Progreso' },
]

const LEVELS = [
  { nivel: 1, emoji: '🍳', room: 'Cocina',      total: 12, to: '/ejercicios/1', color: 'text-purple-600', activeBg: 'bg-purple-50', activeBar: 'bg-purple-500' },
  { nivel: 2, emoji: '🛋️', room: 'Salón',       total: 17, to: '/ejercicios/2', color: 'text-green-600',  activeBg: 'bg-green-50',  activeBar: 'bg-green-500'  },
  { nivel: 3, emoji: '🛏️', room: 'Dormitorio',  total: 15, to: '/ejercicios/3', color: 'text-orange-600', activeBg: 'bg-orange-50', activeBar: 'bg-orange-500' },
  { nivel: 4, emoji: '🔧', room: 'Garaje',       total: 3,  to: '/ejercicios/4', color: 'text-red-600',    activeBg: 'bg-red-50',    activeBar: 'bg-red-500'    },
]

export default function Sidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true))
  const ejercicios = useProgressStore(s => s.ejercicios)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)')
    const onChange = (e) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const renderContent = (isDrawer = false) => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo & Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[#E4E4E7]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
            42
          </div>
          {(!collapsed || isDrawer) && (
            <span className="font-semibold text-zinc-900 whitespace-nowrap overflow-hidden">
              Prep
            </span>
          )}
        </div>
        {isDrawer && (
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
            aria-label="Cerrar menú de navegación"
            title="Cerrar menú"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navegación principal */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => {
              if (isDrawer) onCloseMobile()
            }}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
              )
            }
            title={collapsed && !isDrawer ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {(!collapsed || isDrawer) && (
              <span className="whitespace-nowrap">{label}</span>
            )}
          </NavLink>
        ))}

        {/* Separador + Niveles */}
        <div className="mt-3 mb-1">
          {(!collapsed || isDrawer) ? (
            <p className="px-2.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Niveles del Examen
            </p>
          ) : (
            <div className="border-t border-[#E4E4E7] mx-2 my-2" />
          )}
        </div>

        {LEVELS.map(({ nivel, emoji, room, total, to, color, activeBg, activeBar }) => {
          const levelExs = exercisesByLevel[nivel] ?? []
          const dominados = levelExs.filter(ex => ejercicios[ex.id]?.estado === 'dominado').length
          const pct = Math.round((dominados / (levelExs.length || 1)) * 100)

          return (
            <NavLink
              key={nivel}
              to={to}
              onClick={() => {
                if (isDrawer) onCloseMobile()
              }}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-colors duration-150 group',
                  isActive ? activeBg : 'hover:bg-zinc-50'
                )
              }
              title={collapsed && !isDrawer ? `Nivel ${nivel} — ${room}` : undefined}
            >
              <span className="text-base shrink-0">{emoji}</span>
              {(!collapsed || isDrawer) && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={clsx('text-sm font-medium', color)}>{room}</span>
                    <span className="text-xs text-zinc-400">{dominados}/{total}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full transition-all duration-500', activeBar)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Botón colapsar (solo desktop) */}
      {!isDrawer && (
        <div className="p-2 border-t border-[#E4E4E7]">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors duration-150 text-sm"
            title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">Colapsar</span></>}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Sidebar Desktop (Only mounted on desktop screens >= 768px) */}
      {isDesktop && (
        <motion.aside
          animate={{ width: collapsed ? 64 : 240 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="relative flex flex-col h-screen bg-white border-r border-[#E4E4E7] overflow-hidden shrink-0 z-20"
        >
          {renderContent(false)}
        </motion.aside>
      )}

      {/* Mobile Drawer (Only mounted on mobile screens < 768px when opened) */}
      {!isDesktop && (
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onCloseMobile}
                className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-zinc-200 z-50 shadow-2xl overflow-hidden"
              >
                {renderContent(true)}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  )
}
