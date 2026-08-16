import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import ExerciseList from '@/pages/ExerciseList'
import ExerciseDetail from '@/pages/ExerciseDetail'
import PracticeMode from '@/pages/PracticeMode'
import ExamSimulator from '@/pages/ExamSimulator'
import Tools from '@/pages/Tools'
import Fundamentos from '@/pages/Fundamentos'
import ProgressPage from '@/pages/ProgressPage'
import MemoryPalace from '@/pages/MemoryPalace'
import { auth, isConfigured } from '@/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useProgressStore } from '@/store/progressStore'

export default function App() {
  const setUser = useProgressStore(s => s.setUser)
  const syncWithCloud = useProgressStore(s => s.syncWithCloud)

  useEffect(() => {
    if (!isConfigured || !auth) return
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          isAnonymous: user.isAnonymous
        })
        syncWithCloud()
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [setUser, syncWithCloud])
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ejercicios/:nivel" element={<ExerciseList />} />
        <Route path="/ejercicio/:id" element={<ExerciseDetail />} />
        <Route path="/herramientas" element={<Tools />} />
        <Route path="/fundamentos" element={<Fundamentos />} />
        <Route path="/progreso" element={<ProgressPage />} />
        <Route path="/palacio" element={<MemoryPalace />} />
      </Route>

      {/* Examen y práctica sin sidebar (modo concentración) */}
      <Route path="/practicar/:id" element={<PracticeMode />} />
      <Route path="/examen" element={<ExamSimulator />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
