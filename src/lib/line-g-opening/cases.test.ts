import { describe, it, expect } from 'vitest'
import { LAUNCHPAD_CASES, getCase, terrainFor } from './cases'
import type { SystemSignal } from '../signal-cards/types'

const VALID_SIGNALS: SystemSignal[] = ['tracking', 'money', 'feed', 'future']

describe('LAUNCHPAD_CASES', () => {
  it('contains exactly 13 cases', () => {
    expect(LAUNCHPAD_CASES).toHaveLength(13)
  })

  it('all ids are unique', () => {
    const ids = LAUNCHPAD_CASES.map((c) => c.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('honesty guard: every source.url starts with https://', () => {
    for (const c of LAUNCHPAD_CASES) {
      expect(c.source.url, `case ${c.id} url`).toMatch(/^https:\/\//)
    }
  })

  it('every systemSignal is one of tracking|money|feed|future', () => {
    for (const c of LAUNCHPAD_CASES) {
      expect(VALID_SIGNALS, `case ${c.id} signal`).toContain(c.systemSignal)
    }
  })

  it('all four signals are represented', () => {
    const signals = new Set(LAUNCHPAD_CASES.map((c) => c.systemSignal))
    for (const s of VALID_SIGNALS) {
      expect(signals, `signal '${s}' should be present`).toContain(s)
    }
  })
})

describe('getCase', () => {
  it('returns the correct case for a known id', () => {
    const c = getCase('lobby-register-de')
    expect(c).toBeDefined()
    expect(c?.id).toBe('lobby-register-de')
  })

  it('returns undefined for an unknown id', () => {
    expect(getCase('nope')).toBeUndefined()
  })
})

describe('terrainFor', () => {
  it('hands a non-empty list of real evidence terrains for each signal', () => {
    for (const sig of ['tracking', 'money', 'feed', 'future'] as const) {
      const t = terrainFor(sig)
      expect(t.places.length).toBeGreaterThan(0)
      for (const p of t.places) expect(p.url.startsWith('http')).toBe(true)
    }
  })
})
