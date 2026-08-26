import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCw7D9jOpbwrI6P-DWue6gQvLCWfeAtmNs',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0593895065.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0593895065',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0593895065.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '540788787318',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:540788787318:web:2936613f96cbe86c333757',
}

// Conectar con la base de datos Firestore por defecto o personalizada válida
const customDbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID

let app = null
let auth = null
let db = null

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  auth = getAuth(app)
  if (customDbId && customDbId !== '(default)' && customDbId !== 'ai-studio-exampractice-167a4d8d-8da3-45ce-b300-3ad6e635704c') {
    db = getFirestore(app, customDbId)
  } else {
    db = getFirestore(app)
  }
} catch (error) {
  console.warn('Firebase Firestore/Auth fallback init:', error?.message)
}

const isConfigured = !!app

export { app, auth, db, isConfigured }
