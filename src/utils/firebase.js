import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import firebaseAppletConfig from '../../firebase-applet-config.json'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig?.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig?.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig?.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig?.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig?.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig?.appId || '',
}

const firestoreDatabaseId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  firebaseAppletConfig?.firestoreDatabaseId ||
  '(default)'

let app = null
let auth = null
let db = null

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  auth = getAuth(app)

  if (firestoreDatabaseId && firestoreDatabaseId !== '(default)') {
    db = getFirestore(app, firestoreDatabaseId)
  } else {
    db = getFirestore(app)
  }
} catch (error) {
  console.warn('Firebase Firestore/Auth init notice:', error?.message)
}

const isConfigured = Boolean(app && firebaseConfig.apiKey)

export { app, auth, db, isConfigured, firestoreDatabaseId }
