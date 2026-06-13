// Pure ticket logic — NO localStorage here (kept testable & SSR-safe).
// Shape is CROSSWALK-compatible (design §5): completedStations[] + per-station
// stamps, so it migrates losslessly to crew/{emailHash}.datavism in Phase 4.
export const TICKET_VERSION = 1

export interface Ticket {
  version: number
  completedStations: string[]
  stamps: Record<string, string> // stationId -> ISO timestamp ("self-stamped")
}

export function emptyTicket(): Ticket {
  return { version: TICKET_VERSION, completedStations: [], stamps: {} }
}

export function stampStation(t: Ticket, stationId: string, nowISO: string): Ticket {
  if (t.completedStations.includes(stationId)) return t
  return {
    version: t.version,
    completedStations: [...t.completedStations, stationId],
    stamps: { ...t.stamps, [stationId]: nowISO },
  }
}

export function hasStation(t: Ticket, stationId: string): boolean {
  return t.completedStations.includes(stationId)
}

// Version-tolerant parse: anything that isn't a clean current-version ticket
// degrades to an empty ticket rather than throwing.
export function migrate(raw: unknown): Ticket {
  if (!raw || typeof raw !== 'object') return emptyTicket()
  const r = raw as Partial<Ticket>
  if (
    r.version !== TICKET_VERSION ||
    !Array.isArray(r.completedStations) ||
    typeof r.stamps !== 'object' ||
    r.stamps === null
  ) {
    return emptyTicket()
  }
  return {
    version: TICKET_VERSION,
    completedStations: r.completedStations.filter((s): s is string => typeof s === 'string'),
    stamps: r.stamps as Record<string, string>,
  }
}
