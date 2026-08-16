import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth, isConfigured } from '@/utils/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth'
import { X, Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isConfigured) {
      setError('Firebase no está configurado. Revisa tus variables de entorno (.env).')
      return
    }
    setError('')
    setIsLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onClose()
    } catch (err) {
      let msg = err.message
      if (err.code === 'auth/wrong-password') msg = 'Contraseña incorrecta.'
      else if (err.code === 'auth/user-not-found') msg = 'No existe una cuenta con este correo.'
      else if (err.code === 'auth/email-already-in-use') msg = 'El correo ya está registrado.'
      else if (err.code === 'auth/weak-password') msg = 'La contraseña debe tener al menos 6 caracteres.'
      else if (err.code === 'auth/invalid-email') msg = 'Correo electrónico inválido.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymous = async () => {
    if (!isConfigured) {
      setError('Firebase no está configurado. Revisa tus variables de entorno (.env).')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await signInAnonymously(auth)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 overflow-hidden z-10"
        >
          {/* Header decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-full hover:bg-zinc-50 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="text-center mb-6 space-y-2">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-zinc-50 border border-zinc-100 items-center justify-center text-xl">
              🎓
            </div>
            <h2 className="text-xl font-black text-zinc-900">
              {isSignUp ? 'Crear tu Cuenta 2.0' : 'Sincronizar Progreso'}
            </h2>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Guarda tus avances en la nube, imágenes mnemotécnicas y variantes para repasarlos en cualquier dispositivo.
            </p>
          </div>

          {!isConfigured ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 text-xs flex gap-2.5 items-start">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Firebase no está configurado</p>
                <p className="mt-1 text-amber-700">
                  Para habilitar la nube, crea un archivo <code className="font-mono bg-amber-100/50 px-1 rounded">.env</code> en la raíz del proyecto con las claves de tu proyecto Firebase.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@42.fr"
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:bg-white focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:bg-white focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={clsx(
                  'w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all mt-2',
                  isLoading
                    ? 'bg-zinc-400 cursor-not-allowed'
                    : 'bg-zinc-950 hover:bg-zinc-800'
                )}
              >
                {isLoading ? 'Conectando...' : isSignUp ? 'Registrarse y Sincronizar' : 'Iniciar Sesión'}
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 border-t border-zinc-150 flex items-center" />
                <span className="relative bg-white px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  o también
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAnonymous}
                  disabled={isLoading}
                  className="flex-1 py-2 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User size={13} />
                  Modo Invitado (Anónimo)
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate gratis'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
