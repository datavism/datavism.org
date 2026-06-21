import { describe, it, expect } from 'vitest'
import { suggestLines } from './route-suggestions'

describe('suggestLines', () => {
  it('maps each system signal to its base lines', () => {
    expect(suggestLines('tracking')).toEqual(['k', 'g'])
    expect(suggestLines('money')).toEqual(['r', 'g'])
    expect(suggestLines('feed')).toEqual(['b', 'g'])
    expect(suggestLines('future')).toEqual(['v', 'g'])
  })

  it('lets question keywords take precedence and dedups', () => {
    // money base is [r,g] but the text screams tracking → k leads, then base, deduped
    expect(suggestLines('money', 'a cookie and pixel profile follows me')).toEqual(['k', 'r', 'g'])
  })

  it('always includes g and never exceeds four', () => {
    const out = suggestLines('unsure', '')
    expect(out).toContain('g')
    expect(out.length).toBeLessThanOrEqual(4)
  })
})
