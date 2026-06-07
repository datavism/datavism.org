import { describe, it, expect } from 'vitest'
import { SignalCounter } from './signals'

describe('SignalCounter', () => {
  it('starts at zero', () => {
    const c = new SignalCounter()
    expect(c.total).toBe(0)
  })

  it('counts recorded signals by type', () => {
    const c = new SignalCounter()
    c.record('move')
    c.record('move')
    c.record('click')
    expect(c.total).toBe(3)
    expect(c.byType.move).toBe(2)
    expect(c.byType.click).toBe(1)
  })

  it('throttles a signal type to one per window', () => {
    const c = new SignalCounter()
    expect(c.recordThrottled('move', 1000, 0)).toBe(true)    // t=0ms → counts
    expect(c.recordThrottled('move', 1000, 500)).toBe(false) // t=500ms → throttled
    expect(c.recordThrottled('move', 1000, 1001)).toBe(true) // t=1001ms → counts
    expect(c.total).toBe(2)
  })
})
