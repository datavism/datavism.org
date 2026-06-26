import { describe, it, expect } from 'vitest'
import {
  initialOp,
  toSource,
  toDraft,
  setFinding,
  submit,
  applyVerdict,
  back,
} from './flow'

describe('operation state machine', () => {
  it('starts at briefing', () => {
    const s = initialOp('case-1')
    expect(s.step).toBe('briefing')
    expect(s.caseId).toBe('case-1')
    expect(s.finding).toEqual({})
  })

  it('advances briefing → source → draft', () => {
    const s0 = initialOp('case-1')
    const s1 = toSource(s0)
    expect(s1.step).toBe('source')
    const s2 = toDraft(s1)
    expect(s2.step).toBe('draft')
  })

  it('submit moves draft → certifying', () => {
    const s = submit(toDraft(toSource(initialOp('case-1'))))
    expect(s.step).toBe('certifying')
  })

  it('applyVerdict(true) moves certifying → closed', () => {
    const s = submit(toDraft(toSource(initialOp('case-1'))))
    expect(applyVerdict(s, true).step).toBe('closed')
  })

  it('applyVerdict(false) moves certifying → draft', () => {
    const s = submit(toDraft(toSource(initialOp('case-1'))))
    expect(applyVerdict(s, false).step).toBe('draft')
  })

  it('setFinding merges partial finding into state', () => {
    const s0 = toDraft(toSource(initialOp('case-1')))
    const s1 = setFinding(s0, { question: 'What happened?' })
    expect(s1.finding.question).toBe('What happened?')
    const s2 = setFinding(s1, { sourceUrl: 'https://example.com' })
    // prior fields preserved
    expect(s2.finding.question).toBe('What happened?')
    expect(s2.finding.sourceUrl).toBe('https://example.com')
  })

  it('back steps back one step', () => {
    const s = toDraft(toSource(initialOp('case-1')))
    expect(s.step).toBe('draft')
    expect(back(s).step).toBe('source')
    expect(back(back(s)).step).toBe('briefing')
  })

  it('back is a no-op at briefing', () => {
    const s = initialOp('case-1')
    expect(back(s).step).toBe('briefing')
  })

  it('toSource is a no-op when not at briefing', () => {
    const s = toSource(initialOp('case-1'))
    // calling toSource again should not move further
    expect(toSource(s).step).toBe('source')
  })

  it('toDraft is a no-op when not at source', () => {
    const s = initialOp('case-1')
    expect(toDraft(s).step).toBe('briefing')
  })

  it('submit is a no-op when not at draft', () => {
    const s = toSource(initialOp('case-1'))
    expect(submit(s).step).toBe('source')
  })

  it('applyVerdict is a no-op when not at certifying', () => {
    const s = toDraft(toSource(initialOp('case-1')))
    expect(applyVerdict(s, true).step).toBe('draft')
  })
})
