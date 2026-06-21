import { describe, it, expect, beforeEach } from 'vitest'
import { newCardId, loadDraft, saveDraft, clearDraft, loadCards, saveCard, removeCard } from './storage'
import type { SignalCard } from './types'

function memoryStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null, length: 0,
  } as Storage
}

const card = (id: string): SignalCard => ({
  id, version: 1, createdAt: '2026-06-21T00:00:00.000Z', line: 'g', station: 'g1-the-folder',
  stage: 'question', systemSignal: 'tracking', suspicion: 's', question: 'q',
  evidenceNeeded: ['technical-signal'], uncertainty: 'u', suggestedLines: ['k', 'g'],
  nextLineChoice: 'k', tags: [], visibility: 'private', disclaimer: 'd',
})

beforeEach(() => { globalThis.localStorage = memoryStorage() })

describe('signal-card storage', () => {
  it('mints a prefixed id', () => {
    expect(newCardId()).toMatch(/^sc_[a-z0-9-]+$/i)
  })

  it('round-trips a draft and clears it', () => {
    saveDraft({ suspicion: 'they watch me' })
    expect(loadDraft()?.suspicion).toBe('they watch me')
    clearDraft()
    expect(loadDraft()).toBeNull()
  })

  it('saves newest-first and replaces by id', () => {
    saveCard(card('a'))
    saveCard(card('b'))
    expect(loadCards().map((c) => c.id)).toEqual(['b', 'a'])
    saveCard({ ...card('a'), question: 'updated' })
    expect(loadCards().map((c) => c.id)).toEqual(['a', 'b'])
    expect(loadCards().find((c) => c.id === 'a')?.question).toBe('updated')
  })

  it('removes a card by id', () => {
    saveCard(card('a')); saveCard(card('b'))
    expect(removeCard('a').map((c) => c.id)).toEqual(['b'])
  })

  it('survives corrupt storage', () => {
    globalThis.localStorage.setItem('datavism:signal-cards', '{not json')
    expect(loadCards()).toEqual([])
  })
})
