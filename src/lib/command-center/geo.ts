// src/lib/command-center/geo.ts
// Geographic positions for ALL 28 cases, keyed by canonical cases.ts ids.
// Coordinates: lat/lng WGS-84.

export const GEO: Record<string, { lat: number; lng: number; label: string }> = {
  // ── Batch 1 ────────────────────────────────────────────────────
  'data-brokers-ca':                   { lat:  37.20,  lng: -119.70, label: 'Data Brokers (CA)' },
  'lobby-register-de':                 { lat:  52.52,  lng:   13.40, label: '001 · LOBBYREGISTER (DE)' },
  'abgeordnetenwatch-de':              { lat:  52.40,  lng:   13.62, label: 'Abgeordnetenwatch (DE)' },
  'dsa-transparency-db':               { lat:  50.85,  lng:    4.35, label: 'DSA Transparency (EU)' },
  'lobby-facts-eu':                    { lat:  50.60,  lng:    4.62, label: 'LobbyFacts (EU)' },
  'climate-trace-emissions':           { lat:  10.00,  lng:  -15.00, label: 'Climate TRACE' },
  'india-myneta-criminal-wealth':      { lat:  28.60,  lng:   77.20, label: 'MyNeta (IN)' },
  'brazil-tse-campaign-finance':       { lat: -15.80,  lng:  -47.90, label: 'TSE (BR)' },
  'icij-offshore-leaks':               { lat:  19.00,  lng:  -66.00, label: 'ICIJ Offshore Leaks' },
  'global-forest-watch-deforestation': { lat:  -3.00,  lng:  -60.00, label: 'Global Forest Watch' },
  'south-africa-vulekamali-budget':    { lat: -25.70,  lng:   28.20, label: 'Vulekamali (ZA)' },
  'opensanctions-global-power':        { lat:  50.10,  lng:    8.70, label: 'OpenSanctions' },
  'gdelt-media-power':                 { lat:  38.90,  lng:  -77.00, label: 'GDELT Project' },

  // ── Batch 2 ────────────────────────────────────────────────────
  'exodus-privacy-trackers':           { lat:  48.85,  lng:    2.35, label: 'Exodus Privacy' },
  'iati-aid-flows':                    { lat:   6.00,  lng:   20.00, label: 'IATI Aid Flows' },
  'open-ownership-beneficial':         { lat:  51.50,  lng:   -0.10, label: 'Open Ownership' },
  'ranking-digital-rights':            { lat:  41.00,  lng: -100.00, label: 'Ranking Digital Rights' },
  'atlas-of-surveillance':             { lat:  39.00,  lng:  -98.00, label: 'Atlas of Surveillance' },
  'edgar-ghg-emissions':               { lat:  45.80,  lng:    8.60, label: 'EDGAR (EU)' },
  'global-carbon-budget':              { lat:  55.00,  lng:    9.00, label: 'Global Carbon Budget' },
  'financial-secrecy-index':           { lat:  46.95,  lng:    7.45, label: 'Financial Secrecy Index' },
  'usaspending-federal':               { lat:  37.50,  lng:  -77.40, label: 'USAspending' },
  'philippines-cids-elections':        { lat:  14.60,  lng:  121.00, label: 'CIDS (PH)' },
  'colombia-secop-contracts':          { lat:   4.70,  lng:  -74.10, label: 'SECOP (CO)' },
  'ghana-procurement-ocds':            { lat:   5.60,  lng:   -0.20, label: 'Ghana Procurement' },
  'argentina-wealth-declarations':     { lat: -34.60,  lng:  -58.40, label: 'Wealth Declarations (AR)' },
  'ukraine-prozorro':                  { lat:  50.45,  lng:   30.52, label: 'ProZorro (UA)' },
  'chile-chilecompra':                 { lat: -33.45,  lng:  -70.66, label: 'ChileCompra (CL)' },
}

// Active operation
export const ACTIVE_ID = 'lobby-register-de'

// Signal → canonical hex (matches global.css tokens)
export const SIGNAL_COLOR: Record<string, string> = {
  tracking: '#00ffff',  // line-k cyan
  money:    '#ffd23f',  // signal amber
  feed:     '#ff2af0',  // line-b magenta
  future:   '#aa44ff',  // line-v violet
}
