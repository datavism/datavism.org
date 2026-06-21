// src/lib/signal-cards/export.test.ts
import { describe, it, expect } from 'vitest'
import { toMarkdown, toJson, stageLabel } from './export'
import type { SignalCard } from './types'

const base: SignalCard = {
  id: 'sc_1', version: 1, createdAt: '2026-06-21T00:00:00.000Z', line: 'g', station: 'g1-the-folder',
  stage: 'question', systemSignal: 'tracking', suspicion: 'A site knew my search.',
  question: 'What evidence shows cross-site tracking before consent?', evidenceNeeded: ['technical-signal', 'public-record'],
  uncertainty: 'I do not know who receives the data.', suggestedLines: ['k', 'g'], nextLineChoice: 'k',
  tags: [], visibility: 'private', disclaimer: 'This is not evidence yet.',
}

describe('signal-card export', () => {
  it('labels stage by depth', () => {
    expect(stageLabel(base)).toBe('Suspicion → Question')
    expect(stageLabel({ ...base, stage: 'case-file' })).toBe('Case File #1')
  })

  it('markdown carries the question, disclaimer, evidence labels and next line name', () => {
    const md = toMarkdown(base)
    expect(md).toContain('What evidence shows cross-site tracking before consent?')
    expect(md).toMatch(/not evidence yet/i)
    expect(md).toContain('Technical signal')
    expect(md).toContain('KEY / Tracking & OSINT')
    expect(md).not.toContain('## Actor')
  })

  it('markdown adds the deeper sections only for a case-file', () => {
    const md = toMarkdown({ ...base, stage: 'case-file', actor: 'AdCorp', sourceLead: 'register', publicRelevance: 'affects many' })
    expect(md).toContain('## Actor')
    expect(md).toContain('AdCorp')
    expect(md).toContain('## Source Lead')
    expect(md).toContain('register')
    expect(md).toContain('## Public Relevance')
    expect(md).toContain('affects many')
  })

  it('json round-trips', () => {
    expect(JSON.parse(toJson(base))).toEqual(base)
  })
})
