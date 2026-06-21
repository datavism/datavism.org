import { describe, it, expect } from 'vitest'
import { toBridgeLine, buildProfile, deriveCompletedStations } from './profile'
import type { SignalCard } from '../signal-cards/types'

const card = (nextLineChoice: SignalCard['nextLineChoice']): SignalCard => ({
  id: `sc_${nextLineChoice}`, version: 1, createdAt: '2026-06-21T00:00:00.000Z', line: 'g',
  station: 'g1-the-folder', stage: 'question', systemSignal: 'tracking', suspicion: 's', question: 'q',
  evidenceNeeded: [], uncertainty: 'u', suggestedLines: [], nextLineChoice, tags: [],
  visibility: 'private', disclaimer: 'd',
})

describe('identity profile', () => {
  it('uppercases a line id at the bridge boundary', () => {
    expect(toBridgeLine('k')).toBe('K')
    expect(toBridgeLine('g')).toBe('G')
  })

  it('affinity is the most recent route choice; enrolled is G ∪ choices in canon order', () => {
    // storage is newest-first, so cards[0] is the most recent choice
    const p = buildProfile([card('k'), card('r')], ['g1'])
    expect(p.line).toBe('K')
    expect(p.enrolledLines).toEqual(['G', 'K', 'R'])
    expect(p.completedStations).toEqual(['g1'])
    expect(p.cohortIds).toEqual([])
  })

  it('defaults to G affinity with no cards', () => {
    const p = buildProfile([], [])
    expect(p.line).toBe('G')
    expect(p.enrolledLines).toEqual(['G'])
  })

  it('derives completed stations from saved cards (g1) and all-ticked self-checks', () => {
    const store: Record<string, string> = {
      'datavism:signal-cards': JSON.stringify({ version: 1, cards: [card('k')] }),
      'dv_command_checks': JSON.stringify([true, true, true, true, true]), // g2 done
      'dv_intake_checks': JSON.stringify([true, false, true, true, true]), // g3 partial → excluded
    }
    const done = deriveCompletedStations((k) => store[k] ?? null)
    expect(done).toContain('g1')
    expect(done).toContain('g2')
    expect(done).not.toContain('g3')
  })

  it('derives no completion from an empty store', () => {
    expect(deriveCompletedStations(() => null)).toEqual([])
  })
})
