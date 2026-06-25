import { describe, it, expect, beforeEach } from 'vitest'
import { recordClosed, loadHistory } from './history'
import type { ClosedOperation } from './history'

function memoryStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null, length: 0,
  } as Storage
}

const op = (caseId: string, certifiedAt = '2026-06-25T12:00:00.000Z'): ClosedOperation => ({
  caseId,
  finding: {
    question: 'What happened?',
    sourceUrl: 'https://example.com/source',
    evidence: 'Clear documented evidence of the incident.',
    uncertainty: 'Some context may be missing.',
  },
  certifiedAt,
  codename: `GHOST-${caseId.toUpperCase()}`,
})

beforeEach(() => { globalThis.localStorage = memoryStorage() })

describe('operation history', () => {
  it('returns [] when storage is empty', () => {
    expect(loadHistory()).toEqual([])
  })

  it('returns [] when storage is corrupt', () => {
    globalThis.localStorage.setItem('datavism:command-center:history', '{not json')
    expect(loadHistory()).toEqual([])
  })

  it('recordClosed persists and loadHistory returns the record', () => {
    recordClosed(op('case-1'))
    const history = loadHistory()
    expect(history).toHaveLength(1)
    expect(history[0].caseId).toBe('case-1')
    expect(history[0].finding.question).toBe('What happened?')
  })

  it('recordClosed returns the full history array', () => {
    const result = recordClosed(op('case-1'))
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].caseId).toBe('case-1')
  })

  it('prepends new operations (newest first)', () => {
    recordClosed(op('case-1'))
    recordClosed(op('case-2'))
    const history = loadHistory()
    expect(history.map((h) => h.caseId)).toEqual(['case-2', 'case-1'])
  })

  it('deduplicates by caseId — same caseId twice yields one entry, newest data', () => {
    recordClosed(op('case-1', '2026-06-24T12:00:00.000Z'))
    recordClosed(op('case-1', '2026-06-25T12:00:00.000Z'))
    const history = loadHistory()
    expect(history).toHaveLength(1)
    expect(history[0].certifiedAt).toBe('2026-06-25T12:00:00.000Z')
  })

  it('accumulates multiple distinct operations', () => {
    recordClosed(op('case-1'))
    recordClosed(op('case-2'))
    recordClosed(op('case-3'))
    expect(loadHistory()).toHaveLength(3)
  })
})
