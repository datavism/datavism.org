import { describe, it, expect, beforeEach } from 'vitest'
import { loadIdentity, saveIdentity, clearIdentity } from './session'

function memoryStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    length: 0,
  } as Storage
}

beforeEach(() => {
  globalThis.localStorage = memoryStorage()
})

describe('identity session cache', () => {
  it('round-trips an identity and clears it', () => {
    saveIdentity({ uid: 'u1', email: 'a@b.com', codename: 'GHOST-RUNNER' })
    expect(loadIdentity()).toEqual({ uid: 'u1', email: 'a@b.com', codename: 'GHOST-RUNNER' })
    clearIdentity()
    expect(loadIdentity()).toBeNull()
  })

  it('returns null for absent or corrupt storage', () => {
    expect(loadIdentity()).toBeNull()
    globalThis.localStorage.setItem('datavism:identity', '{broken')
    expect(loadIdentity()).toBeNull()
  })
})
