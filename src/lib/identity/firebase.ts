// Lazy, config-gated Firebase client init against the data-snack project
// (Transport Option A, docs/INTEGRATION-data-snack.md). Reads PUBLIC_FIREBASE_*
// at build time. When unconfigured, getFirebase() returns null and the whole
// bridge degrades gracefully — /connect shows a "not configured" state and the
// rest of the site is unaffected.
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

type Cfg = {
  apiKey?: string
  authDomain?: string
  projectId?: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

function readConfig(): Cfg {
  const e = import.meta.env as Record<string, string | undefined>
  return {
    apiKey: e.PUBLIC_FIREBASE_API_KEY,
    authDomain: e.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: e.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: e.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: e.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: e.PUBLIC_FIREBASE_APP_ID,
  }
}

export function isConfigured(): boolean {
  const c = readConfig()
  return Boolean(c.apiKey && c.projectId && c.appId)
}

let app: FirebaseApp | null = null

export function getFirebase(): { auth: Auth; db: Firestore } | null {
  if (!isConfigured()) return null
  app = app ?? getApps()[0] ?? initializeApp(readConfig() as Record<string, string>)
  return { auth: getAuth(app), db: getFirestore(app) }
}
