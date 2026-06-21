import { describe, it, expect } from 'vitest'
import { buildSystemPrompt } from './prompt'
import { LINES } from '../curriculum/lines'

describe('GHOST system prompt', () => {
  const p = buildSystemPrompt()

  it('establishes the GHOST persona and the DATAVISM method', () => {
    expect(p).toMatch(/GHOST/)
    expect(p).toMatch(/Question/)
    expect(p).toMatch(/Verification/)
  })

  it('grounds GHOST in all five curriculum lines', () => {
    for (const line of LINES) expect(p).toContain(line.name)
  })

  it('encodes the honesty + safety rules', () => {
    const low = p.toLowerCase()
    expect(low).toMatch(/uncertain/)
    expect(low).toMatch(/not fabricate|do not invent/)
    expect(low).toMatch(/judg/) // judgment/judgement — never outsource it
    expect(low).toMatch(/refuse|off-topic|scope/) // stays on-topic
  })
})
