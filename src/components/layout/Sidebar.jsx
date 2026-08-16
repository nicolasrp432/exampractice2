import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Map, Wrench, Clock, BarChart2, GraduationCap,
  ChevronLeft, ChevronRight,
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
  const ejercicios = useProgressStore(s => s.ejercicios)

  const content = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[#E4E4E7]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
            42
          </div>
          <AnimatePresence initial={false}>
            {(!collapsed || mobileOpen) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-zinc-900 whitespace-nowrap overflow-hidden"
              >
                Prep
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100"
            aria-label="Cerrar menú"
          >
            <ChevronLeft size={20} />
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
            onClick={() => onCloseMobile()}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
              )
            }
            title={collapsed && !mobileOpen ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            <AnimatePresence initial={false}>
              {(!collapsed || mobileOpen) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* Separador + Niveles */}
        <div className="mt-3 mb-1">
          <AnimatePresence initial={false}>
            {(!collapsed || mobileOpen) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-2.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1"
              >
                Niveles del Examen
              </motion.p>
            )}
          </AnimatePresence>
          {collapsed && !mobileOpen && <div className="border-t border-[#E4E4E7] mx-2 my-2" />}
        </div>

        {LEVELS.map(({ nivel, emoji, room, total, to, color, activeBg, activeBar }) => {
          const levelExs = exercisesByLevel[nivel] ?? []
          const dominados = levelExs.filter(ex => ejercicios[ex.id]?.estado === 'dominado').length
          const pct = Math.round((dominados / (levelExs.length || 1)) * 100)

          return (
            <NavLink
              key={nivel}
              to={to}
              onClick={() => onCloseMobile()}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-colors duration-150 group',
                  isActive ? activeBg : 'hover:bg-zinc-50'
                )
              }
              title={collapsed && !mobileOpen ? `Nivel ${nivel} — ${room}` : undefined}
            >
              <span className="text-base shrink-0">{emoji}</span>
              <AnimatePresence initial={false}>
                {(!collapsed || mobileOpen) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </nav>

      {/* Botón colapsar (solo desktop) */}
      <div className="hidden md:block p-2 border-t border-[#E4E4E7]">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors duration-150 text-sm"
          title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">Colapsar</span></>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Sidebar Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex relative flex-col h-screen bg-white border-r border-[#E4E4E7] overflow-hidden shrink-0 z-20"
      >
        {content}
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-zinc-200 z-50 shadow-2xl overflow-hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
