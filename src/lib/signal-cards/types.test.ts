import { describe, it, expect } from 'vitest'
import { deriveStage, SYSTEM_SIGNALS, EVIDENCE_TYPES, SIGNAL_CARD_DISCLAIMER } from './types'

describe('signal-card types', () => {
  it('derives case-file only when all three deeper fields are filled', () => {
    expect(deriveStage({})).toBe('question')
    expect(deriveStage({ actor: 'AdCorp' })).toBe('question')
    expect(deriveStage({ actor: 'AdCorp', sourceLead: 'register', publicRelevance: ' ' })).toBe('question')
    expect(deriveStage({ actor: 'AdCorp', sourceLead: 'register', publicRelevance: 'affects many' })).toBe('case-file')
  })

  it('every system signal maps to a real line and a non-empty label', () => {
    for (const s of SYSTEM_SIGNALS) {
      expect(s.label.length).toBeGreaterThan(0)
      expect(['g', 'k', 'r', 'b', 'v']).toContain(s.line)
    }
    expect(SYSTEM_SIGNALS.map((s) => s.id)).toEqual(['tracking', 'money', 'feed', 'future', 'unsure'])
  })

  it('evidence types include the honest "unknown" escape hatch', () => {
    expect(EVIDENCE_TYPES.some((e) => e.id === 'unknown')).toBe(true)
  })

  it('disclaimer states it is not evidence yet', () => {
    expect(SIGNAL_CARD_DISCLAIMER).toMatch(/not evidence yet/i)
  })
})
