import { NavLink } from 'react-router-dom'
import { Home, GraduationCap, Grid, Clock, BarChart2, Map } from 'lucide-react'
import clsx from 'clsx'

const MOBILE_NAV = [
  { to: '/',            icon: Home,          label: 'Inicio'      },
  { to: '/fundamentos', icon: GraduationCap, label: 'Fundamentos' },
  { to: '/ejercicios/1',icon: Grid,          label: 'Ejercicios'  },
  { to: '/palacio',     icon: Map,           label: 'Palacio'     },
  { to: '/examen',      icon: Clock,         label: 'Examen'      },
  { to: '/progreso',    icon: BarChart2,     label: 'Progreso'    },
]

export default function MobileBottomNav() {
  return (
    <nav aria-label="Navegación móvil" className="md:hidden shrink-0 h-16 bg-white/95 backdrop-blur-md border-t border-zinc-200 flex items-center justify-around px-2 z-30 pb-safe">
      {MOBILE_NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-150 text-[10px] font-medium min-w-[48px]',
              isActive
                ? 'text-zinc-900 font-bold bg-zinc-100'
                : 'text-zinc-500 hover:text-zinc-800'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={18} className={isActive ? 'text-zinc-900 stroke-[2.5]' : 'text-zinc-400'} />
              <span className="truncate max-w-[56px]">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
