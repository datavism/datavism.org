// Thin localStorage adapter around the pure ticket logic. SSR-safe: every
// access guards on `typeof localStorage`. This is the ONLY storage in the app.
import { emptyTicket, migrate, stampStation, type Ticket } from './ticket'

const KEY = 'datavism.ticket.v1'

export function loadTicket(): Ticket {
  if (typeof localStorage === 'undefined') return emptyTicket()
  try {
    return migrate(JSON.parse(localStorage.getItem(KEY) ?? 'null'))
  } catch {
    return emptyTicket()
  }
}

export function saveTicket(t: Ticket): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(t))
  } catch {
    /* storage full / blocked — fail silent, ticket stays in-memory */
  }
}

// Stamp a station and persist. Returns the new ticket. Uses real wall-clock —
// the wording on the ticket says "self-stamped", which is honest.
export function stampAndSave(stationId: string): Ticket {
  const next = stampStation(loadTicket(), stationId, new Date().toISOString())
  saveTicket(next)
  return next
}
