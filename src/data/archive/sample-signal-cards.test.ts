import { describe, it, expect } from 'vitest'
import { SAMPLE_SIGNAL_CARDS } from './sample-signal-cards'

describe('sample signal cards', () => {
  it('has at least six curated entries', () => {
    expect(SAMPLE_SIGNAL_CARDS.length).toBeGreaterThanOrEqual(6)
  })
  it('every entry is honest and curated', () => {
    for (const c of SAMPLE_SIGNAL_CARDS) {
      expect(c.question.length).toBeGreaterThan(0)
      expect(c.uncertainty.length).toBeGreaterThan(0)
      expect(c.disclaimer).toMatch(/not evidence yet/i)
      expect(c.visibility).toBe('public-anonymous')
      expect(['question', 'case-file']).toContain(c.stage)
      expect(c.tags).toContain('curated')
    }
  })
  it('uses unique ids', () => {
    const ids = SAMPLE_SIGNAL_CARDS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
