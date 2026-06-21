// Browser-only persistence for Signal Cards. Anonymous, on-device, no network.
// Account sync (Phase 2) reads these same shapes — keep them serializable.
import type { SignalCard } from './types'

const DRAFT_KEY = 'datavism:g1:draft'
const CARDS_KEY = 'datavism:signal-cards'
const STORAGE_VERSION = 1

type CardsEnvelope = { version: number; cards: SignalCard[] }

const get = (k: string): string | null => { try { return globalThis.localStorage?.getItem(k) ?? null } catch { return null } }
const set = (k: string, v: string): void => { try { globalThis.localStorage?.setItem(k, v) } catch {} }
const del = (k: string): void => { try { globalThis.localStorage?.removeItem(k) } catch {} }

export function newCardId(): string {
  try { return `sc_${globalThis.crypto.randomUUID().slice(0, 8)}` }
  catch { return `sc_${Math.random().toString(36).slice(2, 10)}` }
}

export function loadDraft(): Partial<SignalCard> | null {
  const raw = get(DRAFT_KEY); if (!raw) return null
  try { return JSON.parse(raw) as Partial<SignalCard> } catch { return null }
}
export function saveDraft(d: Partial<SignalCard>): void { set(DRAFT_KEY, JSON.stringify(d)) }
export function clearDraft(): void { del(DRAFT_KEY) }

export function loadCards(): SignalCard[] {
  const raw = get(CARDS_KEY); if (!raw) return []
  try { const env = JSON.parse(raw) as CardsEnvelope; return Array.isArray(env?.cards) ? env.cards : [] }
  catch { return [] }
}
export function saveCard(c: SignalCard): SignalCard[] {
  const cards = [c, ...loadCards().filter((x) => x.id !== c.id)]
  set(CARDS_KEY, JSON.stringify({ version: STORAGE_VERSION, cards }))
  return cards
}
export function removeCard(id: string): SignalCard[] {
  const cards = loadCards().filter((x) => x.id !== id)
  set(CARDS_KEY, JSON.stringify({ version: STORAGE_VERSION, cards }))
  return cards
}
