import { describe, it, expect } from 'vitest'
import { LINES, STATIONS, getStationBySlug, getLineById } from './lines'
import { CASE_INDEX, CASE_DETAIL } from '../caseFiles'

describe('curriculum canon', () => {
  it('has five lines and twenty-five stations', () => {
    expect(LINES).toHaveLength(5)
    LINES.forEach((l) => expect(l.stations).toHaveLength(5))
    expect(STATIONS).toHaveLength(25)
  })

  it('uses the canonical line colours (UI accent #ffd23f stays decoupled)', () => {
    const colours = Object.fromEntries(LINES.map((l) => [l.id, l.color.hex]))
    expect(colours).toEqual({
      g: '#3df07a',
      k: '#f5b700',
      r: '#ff4d4d',
      b: '#4d8dff',
      v: '#b48cff',
    })
    // signal-yellow must NOT be reused as a line colour
    expect(Object.values(colours)).not.toContain('#ffd23f')
  })

  it('is pre-launch: g1 open, g2 announced, everything else locked', () => {
    const byStatus = (s: string) => STATIONS.filter((x) => x.status === s).map((x) => x.id)
    expect(byStatus('open')).toEqual(['g1'])
    expect(byStatus('announced')).toEqual(['g2'])
    expect(byStatus('locked')).toHaveLength(23)
  })

  it('resolves the open station by slug and lines by id', () => {
    expect(getStationBySlug('the-folder')?.id).toBe('g1')
    expect(getLineById('k').mentor).toBe('KEY')
  })
})

describe('case files', () => {
  it('every detail page has an index card, and CF-07 is published', () => {
    for (const slug of Object.keys(CASE_DETAIL)) {
      const card = CASE_INDEX.find((c) => c.slug === slug)
      expect(card, `index card for ${slug}`).toBeTruthy()
    }
    const cf07 = CASE_INDEX.find((c) => c.id === 'CF-07')
    expect(cf07?.status).toBe('published')
    expect(cf07?.slug).toBe('border-signal-leak')
    expect(CASE_DETAIL['border-signal-leak'].verify.some((v) => v.status === 'UNVERIFIED')).toBe(true)
  })
})
