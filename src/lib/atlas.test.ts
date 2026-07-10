import { describe, it, expect } from 'vitest'
import { ATLAS, LINE_CLUSTERS, CLUSTER_LABELS, fieldRefsForLine } from './atlas'
import type { LineId } from './signal-cards/types'

const LINE_IDS: LineId[] = ['g', 'k', 'r', 'b', 'v']

describe('ATLAS snapshot', () => {
  it('carries the full atlas (200+ works)', () => {
    expect(ATLAS.length).toBeGreaterThanOrEqual(200)
  })

  it('every work has title, artist and a verify status', () => {
    for (const w of ATLAS) {
      expect(w.title?.length, `title of ${w.title}`).toBeGreaterThan(0)
      expect(w.artist?.length, `artist of ${w.title}`).toBeGreaterThan(0)
      expect(['verified', 'toVerify']).toContain(w.verify_status)
    }
  })

  it('clusters stay within the seven of the field map', () => {
    for (const w of ATLAS) {
      for (const c of w.clusters) expect(CLUSTER_LABELS[c], `cluster ${c} of ${w.title}`).toBeDefined()
    }
  })
})

describe('fieldRefsForLine (ADR 002 Zug 3)', () => {
  it('every line has a cluster mapping', () => {
    for (const id of LINE_IDS) {
      expect(LINE_CLUSTERS[id]?.length, `mapping for line ${id}`).toBeGreaterThan(0)
    }
  })

  it('returns only verified works with a documented decisive move, from the line clusters', () => {
    for (const id of LINE_IDS) {
      const refs = fieldRefsForLine(id, 3)
      expect(refs.length).toBeGreaterThan(0)
      expect(refs.length).toBeLessThanOrEqual(3)
      for (const w of refs) {
        expect(w.verify_status).toBe('verified')
        expect(w.decisive_move?.length).toBeGreaterThan(0)
        expect(w.clusters.some((c) => LINE_CLUSTERS[id].includes(c))).toBe(true)
      }
    }
  })

  it('is deterministic — same build, same references', () => {
    expect(fieldRefsForLine('g', 3)).toEqual(fieldRefsForLine('g', 3))
    expect(fieldRefsForLine('k', 3)).toEqual(fieldRefsForLine('k', 3))
  })
})
