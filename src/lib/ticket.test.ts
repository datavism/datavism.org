import { describe, it, expect } from 'vitest'
import { emptyTicket, stampStation, hasStation, migrate, TICKET_VERSION } from './ticket'

describe('ticket logic', () => {
  it('starts empty at the current version', () => {
    const t = emptyTicket()
    expect(t.version).toBe(TICKET_VERSION)
    expect(t.completedStations).toEqual([])
    expect(t.stamps).toEqual({})
  })

  it('stamps a station with a timestamp (pure — returns a new ticket)', () => {
    const t0 = emptyTicket()
    const t1 = stampStation(t0, 'g1-the-folder', '2026-06-13T10:00:00.000Z')
    expect(t0.completedStations).toEqual([]) // original untouched
    expect(t1.completedStations).toEqual(['g1-the-folder'])
    expect(t1.stamps['g1-the-folder']).toBe('2026-06-13T10:00:00.000Z')
  })

  it('is idempotent — re-stamping keeps the first timestamp and no duplicates', () => {
    const t1 = stampStation(emptyTicket(), 'g1-the-folder', '2026-06-13T10:00:00.000Z')
    const t2 = stampStation(t1, 'g1-the-folder', '2026-06-13T999')
    expect(t2.completedStations).toEqual(['g1-the-folder'])
    expect(t2.stamps['g1-the-folder']).toBe('2026-06-13T10:00:00.000Z')
  })

  it('reports membership', () => {
    const t = stampStation(emptyTicket(), 'g1-the-folder', 'x')
    expect(hasStation(t, 'g1-the-folder')).toBe(true)
    expect(hasStation(t, 'g2-command')).toBe(false)
  })

  it('migrates garbage / null / old shapes to a valid empty ticket', () => {
    expect(migrate(null)).toEqual(emptyTicket())
    expect(migrate('nonsense')).toEqual(emptyTicket())
    expect(migrate({})).toEqual(emptyTicket())
    expect(migrate({ version: 0, completedStations: 'no' })).toEqual(emptyTicket())
  })

  it('migrates a valid ticket through unchanged', () => {
    const good = stampStation(emptyTicket(), 'g1-the-folder', 'x')
    expect(migrate(good)).toEqual(good)
  })
})
