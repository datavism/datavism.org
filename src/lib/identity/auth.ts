// Identity orchestration: ties the magic-link bridge, Firebase Auth/Firestore,
// the local cache, and the progress profile together. Config-gated — every entry
// point degrades cleanly when Firebase isn't configured. We READ crew/{uid} and
// keep passport.codename; we WRITE only crew/{uid}.datavism via setDatavismProfile.
import { signInWithCustomToken, onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getFirebase, isConfigured } from './firebase'
import { requestMagicLink, redeemMagicLink, setDatavismProfile } from './bridge'
import { loadIdentity, saveIdentity, clearIdentity, type Identity } from './session'
import { readLocalProfile } from './profile'

export { isConfigured }

/** Step 1 — email a magic link that returns to /connect?token=… */
export async function startConnect(email: string): Promise<void> {
  // v0.1 sends email only. The bridge also accepts recoveryCode/codename on the
  // request, but we read the codename on redeem (from crew/{uid}), so the
  // request-side identity hints stay intentionally unused for now.
  await requestMagicLink(email)
}

/** Read crew/{uid}, keep the codename, cache the identity. */
async function importIdentity(uid: string, email: string): Promise<Identity> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')
  const snap = await getDoc(doc(fb.db, 'crew', uid))
  const codename = ((snap.data() as { passport?: { codename?: string } } | undefined)?.passport?.codename) ?? ''
  const id: Identity = { uid, email, codename }
  saveIdentity(id)
  return id
}

/** Step 2 — complete the redeem when /connect?token= is present. */
export async function completeRedeem(token: string): Promise<Identity> {
  const fb = getFirebase()
  if (!fb) throw new Error('firebase-not-configured')
  const { customToken, uid, email } = await redeemMagicLink(token)
  await signInWithCustomToken(fb.auth, customToken)
  return importIdentity(uid, email)
}

/** Step 3 — push local progress to crew/{uid}.datavism. */
export async function syncProgress(): Promise<void> {
  const fb = getFirebase()
  if (!fb?.auth.currentUser) throw new Error('not-signed-in')
  const idToken = await fb.auth.currentUser.getIdToken()
  await setDatavismProfile(idToken, readLocalProfile())
}

/** Returning user: cache-first, then live auth state. Returns an unsubscribe fn. */
export function watchIdentity(cb: (id: Identity | null) => void): () => void {
  cb(loadIdentity())
  const fb = getFirebase()
  if (!fb) return () => {}
  return onAuthStateChanged(fb.auth, async (user: User | null) => {
    if (!user) {
      cb(loadIdentity())
      return
    }
    const cached = loadIdentity()
    if (cached?.uid === user.uid) {
      cb(cached)
      return
    }
    try {
      cb(await importIdentity(user.uid, user.email ?? cached?.email ?? ''))
    } catch {
      cb(loadIdentity())
    }
  })
}

/** Sign out + clear the cache. Local Signal Cards are kept (the user's work). */
export async function disconnect(): Promise<void> {
  const fb = getFirebase()
  clearIdentity()
  if (fb) await signOut(fb.auth)
}
