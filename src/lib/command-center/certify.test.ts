import { describe, it, expect } from 'vitest'
import { preCheck } from './certify'
describe('preCheck (method-bar, no AI)', () => {
  const good = { question: 'Who spent the most lobbying the Bundestag in 2024?', sourceUrl: 'https://www.lobbyregister.bundestag.de/startseite', evidence: 'Org X reported the highest expenditure band, ~€8.4M, in the 2024 register entry.', uncertainty: 'Bands are self-declared ranges, not exact figures.' }
  it('passes a complete finding', () => { expect(preCheck(good)).toEqual({ ok: true, missing: [] }) })
  it('flags a missing source', () => { expect(preCheck({ ...good, sourceUrl: '' }).missing).toContain('source') })
  it('flags missing uncertainty', () => { expect(preCheck({ ...good, uncertainty: '' }).missing).toContain('uncertainty') })
  it('flags a vague/too-short finding', () => { expect(preCheck({ ...good, evidence: 'it is bad' }).missing).toContain('specificity') })
  it('requires an http source url', () => { expect(preCheck({ ...good, sourceUrl: 'lobbyregister' }).missing).toContain('source') })
})
