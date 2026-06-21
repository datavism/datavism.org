// Lightweight, on-device cache of the connected identity — gives instant UI on
// return while Firebase Auth restores the real session. The codename here is the
// cross-platform handle imported from crew/{uid}.passport.codename; we keep it,
// never regenerate it. Signal Cards are NOT touched by disconnect — they are the
// user's local work.
export type Identity = { uid: string; email: string; codename: string }

const KEY = 'datavism:identity'

export function loadIdentity(): Identity | null {
  try {
    const raw = globalThis.localStorage?.getItem(KEY)
    return raw ? (JSON.parse(raw) as Identity) : null
  } catch {
    return null
  }
}

export function saveIdentity(id: Identity): void {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(id))
  } catch {}
}

export function clearIdentity(): void {
  try {
    globalThis.localStorage?.removeItem(KEY)
  } catch {}
}
