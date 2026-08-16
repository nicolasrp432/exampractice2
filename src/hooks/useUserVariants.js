import { useState, useEffect } from 'react'
import { db, auth, isConfigured } from '../utils/firebase'
import { doc, setDoc, deleteDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const storageKey = (exerciseId) => `42prep-variants-${exerciseId}`

function load(exerciseId) {
  try {
    const raw = localStorage.getItem(storageKey(exerciseId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(exerciseId, variants) {
  try {
    localStorage.setItem(storageKey(exerciseId), JSON.stringify(variants))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function useUserVariants(exerciseId) {
  const [variants, setVariants] = useState(() => load(exerciseId))

  useEffect(() => {
    if (!isConfigured || !db || !auth) return

    // Escuchar el estado de autenticación para descargar variantes de la nube
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, `users/${user.uid}/variants`),
            where('exerciseId', '==', exerciseId)
          )
          const querySnapshot = await getDocs(q)
          const cloudVariants = []
          querySnapshot.forEach((docSnap) => {
            cloudVariants.push({ id: docSnap.id, ...docSnap.data() })
          })

          if (cloudVariants.length > 0) {
            // Ordenar por fecha de guardado descendente
            cloudVariants.sort((a, b) => new Date(b.fechaGuardado).getTime() - new Date(a.fechaGuardado).getTime())
            setVariants(cloudVariants)
            persist(exerciseId, cloudVariants)
          }
        } catch (error) {
          console.error('Error al cargar variantes de Firestore:', error)
        }
      }
    })

    return () => unsubscribe()
  }, [exerciseId])

  const saveVariant = async (nombre, descripcion, codigo) => {
    const newVariant = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      descripcion: (descripcion || '').trim(),
      codigo,
      fechaGuardado: new Date().toISOString(),
      exerciseId,
    }
    const updated = [newVariant, ...variants]
    setVariants(updated)
    persist(exerciseId, updated)

    const user = auth?.currentUser
    if (isConfigured && db && user) {
      try {
        await setDoc(doc(db, `users/${user.uid}/variants`, newVariant.id), newVariant)
      } catch (error) {
        console.error('Error al subir variante a Firestore:', error)
      }
    }
  }

  const deleteVariant = async (id) => {
    const updated = variants.filter(v => v.id !== id)
    setVariants(updated)
    persist(exerciseId, updated)

    const user = auth?.currentUser
    if (isConfigured && db && user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/variants`, id))
      } catch (error) {
        console.error('Error al borrar variante en Firestore:', error)
      }
    }
  }

  return { variants, saveVariant, deleteVariant }
}
