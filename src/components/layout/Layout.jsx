import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import GlobalAiTutorDrawer from '@/components/chat/GlobalAiTutorDrawer'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function Layout() {
  const location = useLocation()
  const isOnline  = useOnlineStatus()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)} />

        {/* ── Offline banner ── */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              key="offline-banner"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2
                              bg-amber-50 border-b border-amber-200
                              text-xs font-medium text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                Modo offline — todo el contenido disponible
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="h-full pb-6 md:pb-0"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <GlobalAiTutorDrawer />
    </div>
  )
}
