import { describe, it, expect } from 'vitest'
import { OPERATIONS, FIRST_OPERATION, getOperation } from './operations'
import { getCase } from '../line-g-opening/cases'
import { GEO } from './geo'

describe('OPERATIONS', () => {
  it('the guided starter stays first and is the lobby register', () => {
    expect(FIRST_OPERATION).toBe(OPERATIONS[0])
    expect(FIRST_OPERATION.caseId).toBe('lobby-register-de')
  })

  it('all caseIds are unique', () => {
    const ids = OPERATIONS.map((o) => o.caseId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every operation resolves to a launchpad case', () => {
    for (const o of OPERATIONS) {
      expect(getCase(o.caseId), `case for ${o.caseId}`).toBeDefined()
    }
  })

  it('every operation has a position on the map', () => {
    for (const o of OPERATIONS) {
      expect(GEO[o.caseId], `geo for ${o.caseId}`).toBeDefined()
    }
  })

  it('honesty guard: every source.url starts with https://', () => {
    for (const o of OPERATIONS) {
      expect(o.source.url, `op ${o.caseId} url`).toMatch(/^https:\/\//)
    }
  })

  it('every operation demands the full method bar', () => {
    for (const o of OPERATIONS) {
      expect(o.methodBar).toEqual({
        wantsSourceCited: true,
        wantsSpecificFinding: true,
        wantsUncertainty: true,
      })
    }
  })
})

// ADR 003 §2 attribution rules — binding for every operation derived from a
// Meridian work: credited, linked to the unedited original, anchored to the
// original's result, and carrying the original's honesty caveats.
describe('derived operations (Meridian attribution, ADR 003)', () => {
  const derived = OPERATIONS.filter((o) => o.derivedFrom)

  it('there are three replication operations', () => {
    expect(derived).toHaveLength(3)
  })

  it('every derivation credits Meridian and links the original in field-research', () => {
    for (const o of derived) {
      expect(o.derivedFrom!.author).toBe('Meridian')
      expect(o.derivedFrom!.workUrl).toMatch(
        /^https:\/\/github\.com\/frankbueltge\/field-research\/tree\/main\/works\//,
      )
      expect(o.derivedFrom!.shipped).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(o.derivedFrom!.work.length).toBeGreaterThan(0)
    }
  })

  it('every derivation carries an anchor and at least two honesty caveats', () => {
    for (const o of derived) {
      expect(o.derivedFrom!.anchor.length, `anchor of ${o.caseId}`).toBeGreaterThan(40)
      expect(o.derivedFrom!.caveats.length, `caveats of ${o.caseId}`).toBeGreaterThanOrEqual(2)
      for (const c of o.derivedFrom!.caveats) expect(c.trim().length).toBeGreaterThan(20)
    }
  })

  it('a derived briefing names the collective — never presents the work as ours', () => {
    for (const o of derived) {
      expect(o.briefing).toContain('Meridian')
    }
  })
})

describe('getOperation', () => {
  it('returns the scripted operation for a known id', () => {
    expect(getOperation('scope2-twin-invoice')?.derivedFrom?.work).toBe('The Two Meters')
  })

  it('returns undefined for unscripted cases', () => {
    expect(getOperation('data-brokers-ca')).toBeUndefined()
    expect(getOperation('nope')).toBeUndefined()
  })
})
