// src/lib/command-center/geo.ts
// Geographic case data for the Global Investigation Map.
// Coordinates: [lng, lat] — WGS-84, matching d3-geo convention.

export type CaseSignal = 'tracking' | 'money' | 'feed' | 'future'

export interface GeoCase {
  id: string
  label: string
  signal: CaseSignal
  lat: number
  lng: number
  active?: true // hero focal point — the active operation
}

export const GEO_CASES: GeoCase[] = [
  // ── TRACKING (cyan) ─────────────────────────────────────────
  { id: 'data-brokers-ca',          label: 'Data Brokers (CA)',        signal: 'tracking', lat:  37.2,  lng: -119.7 },
  { id: 'opensanctions',            label: 'OpenSanctions',            signal: 'tracking', lat:  50.1,  lng:    8.7 },
  { id: 'exodus-privacy',           label: 'Exodus Privacy',           signal: 'tracking', lat:  48.85, lng:    2.35 },
  { id: 'ranking-digital-rights',   label: 'Ranking Digital Rights',   signal: 'tracking', lat:  40.0,  lng: -100.0 },
  { id: 'atlas-of-surveillance',    label: 'Atlas of Surveillance',    signal: 'tracking', lat:  39.0,  lng:  -98.0 },

  // ── MONEY (amber) ────────────────────────────────────────────
  { id: 'lobby-register-de',        label: '001 · LOBBYREGISTER (DE)', signal: 'money',    lat:  52.52, lng:   13.40, active: true },
  { id: 'abgeordnetenwatch-de',     label: 'Abgeordnetenwatch (DE)',   signal: 'money',    lat:  52.4,  lng:   13.6 },
  { id: 'lobby-facts-eu',           label: 'Lobby Facts (EU)',         signal: 'money',    lat:  50.6,  lng:    4.6 },
  { id: 'india-myneta',             label: 'MyNeta (IN)',              signal: 'money',    lat:  28.6,  lng:   77.2 },
  { id: 'brazil-tse',               label: 'TSE Brasil',               signal: 'money',    lat: -15.8,  lng:  -47.9 },
  { id: 'icij-offshore-leaks',      label: 'ICIJ Offshore Leaks',      signal: 'money',    lat:  19.0,  lng:  -66.0 },
  { id: 'south-africa-vulekamali',  label: 'Vulekamali (ZA)',          signal: 'money',    lat: -25.7,  lng:   28.2 },
  { id: 'iati-aid',                 label: 'IATI Aid Tracker',         signal: 'money',    lat:   6.0,  lng:   20.0 },
  { id: 'open-ownership',           label: 'Open Ownership (UK)',      signal: 'money',    lat:  51.5,  lng:   -0.1 },
  { id: 'edgar-ghg',                label: 'EDGAR GHG',                signal: 'money',    lat:  45.8,  lng:    8.6 },
  { id: 'financial-secrecy-index',  label: 'Financial Secrecy Index',  signal: 'money',    lat:  46.95, lng:    7.45 },
  { id: 'usaspending',              label: 'USASpending',              signal: 'money',    lat:  38.9,  lng:  -77.05 },
  { id: 'philippines-cids',         label: 'Philippines CIDS',         signal: 'money',    lat:  14.6,  lng:  121.0 },
  { id: 'colombia-secop',           label: 'Colombia SECOP',           signal: 'money',    lat:   4.7,  lng:  -74.1 },
  { id: 'ghana-procurement',        label: 'Ghana Procurement',        signal: 'money',    lat:   5.6,  lng:   -0.2 },
  { id: 'argentina-wealth',         label: 'Argentina Wealth',         signal: 'money',    lat: -34.6,  lng:  -58.4 },
  { id: 'ukraine-prozorro',         label: 'Prozorro (UA)',            signal: 'money',    lat:  50.45, lng:   30.52 },
  { id: 'chile-chilecompra',        label: 'ChileCompra',              signal: 'money',    lat: -33.45, lng:  -70.66 },

  // ── FEED (magenta) ───────────────────────────────────────────
  { id: 'dsa-transparency-db',      label: 'DSA Transparency DB',      signal: 'feed',     lat:  50.85, lng:    4.35 },
  { id: 'gdelt',                    label: 'GDELT Project',            signal: 'feed',     lat:  38.9,  lng:  -77.0 },

  // ── FUTURE (violet) ─────────────────────────────────────────
  { id: 'climate-trace-emissions',  label: 'Climate TRACE',            signal: 'future',   lat:  10.0,  lng:  -15.0 },
  { id: 'global-forest-watch',      label: 'Global Forest Watch',      signal: 'future',   lat:  -3.0,  lng:  -60.0 },
  { id: 'global-carbon-budget',     label: 'Global Carbon Budget',     signal: 'future',   lat:  55.0,  lng:    9.0 },
]

// Signal → canonical hex (matches global.css tokens)
export const SIGNAL_COLOR: Record<CaseSignal, string> = {
  tracking: '#00ffff',  // line-k cyan
  money:    '#ffd23f',  // signal amber
  feed:     '#ff2af0',  // line-b magenta (close to spec #ff2af0 vs #ff00ff)
  future:   '#aa44ff',  // line-v violet
}

// Active operation (singleton shortcut)
export const ACTIVE_CASE = GEO_CASES.find(c => c.active)!
