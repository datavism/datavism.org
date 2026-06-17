<script>
  // Progress Map / dashboard (design: Progress Map.dc.html). A static demo with
  // EXAMPLE progress data (there is no auth/progress backend yet). The only
  // interaction: clicking a map node updates the "You are here" panel. This
  // route is intentionally unlinked from the rest of the site.
  import NetworkMap from './NetworkMap.svelte'

  const LINES = [
    { id: 'g', code: 'G', name: 'GHOST / FOUNDATION', color: '#00ff88', progress: 80, stations: [
      ['G1', 'THE FOLDER', 'completed', 'Turn discomfort into a testable question.'],
      ['G2', 'COMMAND', 'completed', 'Command AI. Prompts are specs.'],
      ['G3', 'INTAKE', 'completed', 'Collect and structure the raw.'],
      ['G4', 'THE CONFIDENT LIE', 'completed', 'Catch the confident lie.'],
      ['G5', 'MASCHINENRAUM', 'unlocked', 'Run the whole machine.'],
    ] },
    { id: 'k', code: 'K', name: 'KEY / TRACKING & OSINT', color: '#00ffff', progress: 60, stations: [
      ['K1', 'FOOTPRINTS', 'completed', 'Map the traces you leave.'],
      ['K2', 'SIGNALS', 'current', 'Trace the noise. Find the pattern.'],
      ['K3', 'IDENTITY GRAPH', 'unlocked', 'Scattered traces become a profile.'],
      ['K4', 'WATCHTOWER', 'locked', 'Watch what changes in the dark.'],
      ['K5', 'PANOPTICON FILE', 'locked', 'Package the surveillance file.'],
    ] },
    { id: 'r', code: 'R', name: 'ROOK / ECONOMY & POWER', color: '#ffff00', progress: 40, stations: [
      ['R1', 'LEDGER', 'completed', 'Who pays, who profits?'],
      ['R2', 'ACTORS', 'unlocked', 'Map the actors.'],
      ['R3', 'FLOWS', 'locked', 'Follow where value moves.'],
      ['R4', 'LEVERAGE', 'locked', 'Find the pressure points.'],
      ['R5', 'MAMMON FILE', 'locked', 'Make economic power legible.'],
    ] },
    { id: 'b', code: 'B', name: 'BITE / FEEDS & BEHAVIOR', color: '#ff00ff', progress: 33, stations: [
      ['B1', 'SOURCE', 'completed', 'Pick the feed that matters.'],
      ['B2', 'CAPTURE', 'unlocked', 'Capture without distortion.'],
      ['B3', 'NORMALIZE', 'locked', 'Clean the stream.'],
      ['B4', 'DETECT', 'locked', 'Find the loop.'],
      ['B5', 'FEED AUTOPSY', 'locked', 'Autopsy the feed.'],
    ] },
    { id: 'v', code: 'V', name: 'VESPER / CLIMATE & FUTURE', color: '#aa44ff', progress: 20, stations: [
      ['V1', 'ARCHIVE', 'locked', 'Find the long signal.'],
      ['V2', 'PATTERNS', 'locked', 'Read the long trend.'],
      ['V3', 'SCENARIOS', 'locked', 'Map plausible futures.'],
      ['V4', 'IMPACT', 'locked', 'Who is affected, when?'],
      ['V5', 'CUMULUS FILE', 'locked', 'Make the slow system impossible to ignore.'],
    ] },
  ]

  const CASE_FILES = [
    ['CF-07', 'Border Signal Leak', 'completed'],
    ['CF-06', 'Shell Network Map', 'completed'],
    ['CF-05', 'Influence Pipeline', 'progress'],
    ['CF-04', 'Ad-Tech Autopsy', 'locked'],
    ['CF-03', 'Data Pollution Trail', 'locked'],
  ]

  const CF_META = {
    completed: { label: '✓ COMPLETED', color: '#00ff88', title: '#f2f1ea' },
    progress: { label: 'IN PROGRESS', color: '#f5b700', title: '#f5b700' },
    locked: { label: 'LOCKED', color: '#565c66', title: '#6b7280' },
  }

  const ALL = LINES.flatMap((L) => L.stations.map((s) => ({ id: s[0].toLowerCase(), code: s[0], title: s[1], status: s[2], note: s[3], lineName: L.name, color: L.color })))
  const progressStatuses = Object.fromEntries(ALL.map((s) => [s.id, s.status]))

  let focused = $state('k2')
  const here = $derived(ALL.find((s) => s.id === focused) || ALL.find((s) => s.id === 'k2'))
  const caseFiles = CASE_FILES.map((c) => ({ id: c[0], title: c[1], ...CF_META[c[2]], statusLabel: c[2] === 'locked' ? 'LOCKED' : CF_META[c[2]].label }))
</script>

<header class="app-head">
  <a class="brand" href="/">
    <svg width="24" height="24" viewBox="-8 -8 146 146" aria-hidden="true">
      <path d="M64,0 a64,64 0 0 1 64,64 v64 c0,0 -16,-12 -32,-12 s-32,12 -32,12 s-16,-12 -32,-12 s-32,12 -32,12 v-64 a64,64 0 0 1 64,-64 z" fill="none" stroke="#ff2a6d" stroke-width="12" opacity="0.9" transform="translate(3,3)" />
      <path d="M64,0 a64,64 0 0 1 64,64 v64 c0,0 -16,-12 -32,-12 s-32,12 -32,12 s-16,-12 -32,-12 s-32,12 -32,12 v-64 a64,64 0 0 1 64,-64 z" fill="none" stroke="#39ff14" stroke-width="10" stroke-linejoin="round" />
      <circle cx="78" cy="64" r="7" fill="#39ff14" /><circle cx="110" cy="64" r="7" fill="#39ff14" />
    </svg>
    <span class="bname font-display">DATAVISM</span>
    <span class="btag">PROGRESS MAP</span>
  </a>
  <div class="hslog">TURN HIDDEN SYSTEMS<br />INTO PUBLIC EVIDENCE</div>
</header>

<div class="shell">
  <!-- LEFT -->
  <aside class="col">
    <div class="card profile">
      <span class="avatar">
        <svg width="26" height="26" viewBox="-8 -8 146 146" aria-hidden="true"><path d="M64,0 a64,64 0 0 1 64,64 v64 c0,0 -16,-12 -32,-12 s-32,12 -32,12 s-16,-12 -32,-12 s-32,12 -32,12 v-64 a64,64 0 0 1 64,-64 z" fill="none" stroke="#ff2a6d" stroke-width="12" opacity="0.9" transform="translate(3,3)" /><path d="M64,0 a64,64 0 0 1 64,64 v64 c0,0 -16,-12 -32,-12 s-32,12 -32,12 s-16,-12 -32,-12 s-32,12 -32,12 v-64 a64,64 0 0 1 64,-64 z" fill="none" stroke="#39ff14" stroke-width="10" stroke-linejoin="round" /><circle cx="78" cy="64" r="7" fill="#39ff14" /><circle cx="110" cy="64" r="7" fill="#39ff14" /></svg>
      </span>
      <div class="prof-body">
        <div class="prof-role">GHOST ANALYST</div>
        <div class="prof-level font-display">LEVEL 12</div>
        <div class="xpbar"><div class="xpfill" style="width:61.25%"></div></div>
        <div class="xprow"><span>2,450 XP</span><span>2,450 / 4,000</span></div>
      </div>
    </div>

    <div class="card">
      <div class="ck">LINE PROGRESS</div>
      <div class="lp">
        {#each LINES as L (L.id)}
          <div>
            <div class="lp-head">
              <span class="lp-badge" style={`border-color:${L.color};color:${L.color};`}>{L.code}</span>
              <span class="lp-name">{L.name}</span>
              <span class="lp-pct" style={`color:${L.color};`}>{L.progress}%</span>
            </div>
            <div class="lp-track"><div class="lp-fill" style={`width:${L.progress}%;background:${L.color};`}></div></div>
          </div>
        {/each}
      </div>
    </div>

    <div class="card ring-card">
      <svg width="92" height="92" viewBox="0 0 100 100" style="flex:none;">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#20222b" stroke-width="7" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#39ff14" stroke-width="7" stroke-linecap="round" stroke-dasharray="263.9" stroke-dashoffset="211.1" transform="rotate(-90 50 50)" />
      </svg>
      <div>
        <div class="ring-frac font-display"><span class="green">5</span> / 25</div>
        <div class="ring-pct font-display">20%</div>
        <div class="ring-label">CASE FILES<br />COMPLETED</div>
      </div>
    </div>

    <div class="card mission">
      <div class="ck">CURRENT MISSION</div>
      <div class="mrow">
        <span class="mbadge">K</span>
        <span class="mtitle font-display">SIGNALS</span>
        <span class="mcode">K2</span>
      </div>
      <div class="mnote">Trace the noise. Find the pattern.</div>
      <button class="mbtn">VIEW MISSION <span class="gold">→</span></button>
    </div>

    <div class="card">
      <div class="ck">LEGEND</div>
      <div class="legend">
        <span class="lg"><span class="lgi"><svg width="18" height="18" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="none" stroke="#00ff88" stroke-width="2" /><path d="M6.5 11.3 L9.4 14 L15 7.6" fill="none" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>COMPLETED</span>
        <span class="lg"><span class="lgi"><svg width="18" height="18" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="#0b0c10" stroke="#ffd23f" stroke-width="2.6" /><circle cx="11" cy="11" r="4" fill="#ffd23f" /></svg></span>CURRENT STATION</span>
        <span class="lg"><span class="lgi"><svg width="18" height="18" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="none" stroke="#4d8dff" stroke-width="2" /><circle cx="11" cy="11" r="3" fill="#4d8dff" /></svg></span>UNLOCKED</span>
        <span class="lg"><span class="lgi"><svg width="18" height="18" viewBox="0 0 22 22"><rect x="6" y="10" width="10" height="7.5" rx="1" fill="none" stroke="#565c66" stroke-width="1.5" /><path d="M8 10 V8 a3 3 0 0 1 6 0 V10" fill="none" stroke="#565c66" stroke-width="1.5" /></svg></span>LOCKED</span>
      </div>
    </div>
  </aside>

  <!-- CENTER -->
  <section class="center">
    <div class="center-head">
      <h1 class="font-display ctitle">DATAVISM PROGRESS MAP</h1>
      <p class="csub">Track your path through the Evidence Engine.</p>
    </div>
    <div class="mapwrap">
      <div class="map-label">// NETWORK · YOUR PROGRESS</div>
      <NetworkMap statuses={progressStatuses} selected={focused} onSelect={(id) => (focused = id)} liveLine="k" dimInactive={false} accent="#ffd23f" />
      <div class="map-legend">
        <span class="ml"><span class="d ring-g"></span>COMPLETED</span>
        <span class="ml"><span class="d fill-k"></span>CURRENT</span>
        <span class="ml"><span class="d ring-b"></span>UNLOCKED</span>
        <span class="ml"><span class="d dash"></span>LOCKED</span>
      </div>
    </div>
  </section>

  <!-- RIGHT -->
  <aside class="col">
    <div class="card here" style={`border-color:${here.color};border-top:3px solid ${here.color};`}>
      <div class="ck">YOU ARE HERE</div>
      <div class="here-id">
        <span class="here-code" style={`background:${here.color};`}>{here.code}</span>
        <span class="here-title font-display">{here.title}</span>
      </div>
      <div class="here-line" style={`color:${here.color};`}>{here.lineName}</div>
      <div class="here-foot">
        <p class="here-note">{here.note}</p>
        <svg width="60" height="40" viewBox="0 0 60 40" style="flex:none;"><rect x="2" y="22" width="8" height="16" fill="#2c2f3a" /><rect x="15" y="14" width="8" height="24" fill="#2c2f3a" /><rect x="28" y="8" width="8" height="30" fill="#00ffff" /><rect x="41" y="18" width="8" height="20" fill="#2c2f3a" /></svg>
      </div>
    </div>

    <div class="card">
      <div class="cf-head"><span class="ck" style="margin:0;">RECENT CASE FILES</span><span class="viewall">VIEW ALL ›</span></div>
      <div class="cf-list">
        {#each caseFiles as cf (cf.id)}
          <div class="cf-row">
            <span class="cf-id">{cf.id}</span>
            <span class="cf-title" style={`color:${cf.title};`}>{cf.title}</span>
            <span class="cf-status" style={`color:${cf.color};`}>{cf.statusLabel}</span>
          </div>
        {/each}
      </div>
      <div class="cf-foot"><span><span class="green">5</span> / 25 case files</span><span class="green">20%</span></div>
    </div>
  </aside>
</div>

<!-- BOTTOM STRIP -->
<div class="strip-wrap">
  <div class="strip">
    <div class="strip-title">FIVE LINES. ONE NETWORK.</div>
    <div class="strip-cells">
      <div class="cell">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#39ff14" stroke-width="1.6"><circle cx="7" cy="13" r="4" /><circle cx="19" cy="13" r="4" /><path d="M11 13 h4" /></svg>
        <div><div class="cell-h">CROSS-LINE INSIGHT</div><div class="cell-b">Connect methods.</div></div>
      </div>
      <div class="cell">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#ffd23f" stroke-width="1.6"><circle cx="13" cy="13" r="9" /><circle cx="13" cy="13" r="2.5" fill="#ffd23f" /><path d="M13 1 v4 M13 21 v4 M1 13 h4 M21 13 h4" /></svg>
        <div><div class="cell-h">EVIDENCE-FIRST</div><div class="cell-b">Verify everything.</div></div>
      </div>
      <div class="cell">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#ff2a6d" stroke-width="1.6" stroke-linejoin="round"><path d="M3 7 h7 l2 3 h11 v12 h-20 z" /></svg>
        <div><div class="cell-h">CASE FILES</div><div class="cell-b">Every line ends in one.</div></div>
      </div>
    </div>
  </div>
</div>

<style>
  .app-head { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 16px 28px; border-bottom: 1px solid var(--color-edge); }
  .brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .bname { font-weight: 800; font-size: 17px; letter-spacing: -0.04em; color: var(--color-ink); }
  .btag { font-size: 10px; letter-spacing: 0.2em; color: var(--color-ink-4); border-left: 1px solid var(--color-edge); padding-left: 12px; }
  .hslog { font-size: 10.5px; letter-spacing: 0.16em; color: var(--color-ink-4); text-align: right; line-height: 1.5; }

  .shell { display: grid; grid-template-columns: 296px 1fr 320px; gap: 18px; padding: 22px 28px; max-width: 1640px; margin: 0 auto; align-items: start; }
  .col { display: grid; gap: 16px; }
  .card { border: 1px solid var(--color-edge); background: var(--color-panel); padding: 16px; }
  .ck { font-size: 10px; letter-spacing: 0.16em; color: var(--color-ink-4); margin-bottom: 14px; }

  .profile { display: flex; align-items: center; gap: 14px; }
  .avatar { display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; border: 1px solid var(--color-edge-2); border-radius: 50%; flex: none; }
  .prof-body { min-width: 0; flex: 1; }
  .prof-role { font-size: 10px; letter-spacing: 0.16em; color: var(--color-ink-4); }
  .prof-level { font-weight: 700; font-size: 16px; color: var(--color-ghost); margin: 3px 0 8px; }
  .xpbar { height: 5px; background: var(--color-panel-3); border: 1px solid var(--color-edge); position: relative; }
  .xpfill { position: absolute; top: 0; bottom: 0; left: 0; background: var(--color-ghost); }
  .xprow { display: flex; justify-content: space-between; font-size: 9.5px; color: var(--color-ink-4); margin-top: 5px; }

  .lp { display: grid; gap: 13px; }
  .lp-head { display: flex; align-items: center; gap: 9px; margin-bottom: 6px; }
  .lp-badge { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border: 1px solid; font-size: 10px; font-weight: 700; flex: none; }
  .lp-name { font-size: 10.5px; color: var(--color-ink-2); letter-spacing: 0.04em; }
  .lp-pct { margin-left: auto; font-size: 10.5px; }
  .lp-track { height: 4px; background: var(--color-panel-3); position: relative; }
  .lp-fill { position: absolute; top: 0; bottom: 0; left: 0; }

  .ring-card { display: flex; align-items: center; gap: 18px; }
  .ring-frac { font-size: 20px; color: var(--color-ink); }
  .ring-pct { font-size: 26px; font-weight: 800; color: var(--color-ghost); line-height: 1.1; }
  .ring-label { font-size: 9.5px; letter-spacing: 0.12em; color: var(--color-ink-4); margin-top: 4px; }
  .green { color: var(--color-ghost); }

  .mission { border-left: 3px solid var(--color-line-k); }
  .mrow { display: flex; align-items: center; gap: 11px; }
  .mbadge { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: var(--color-line-k); color: var(--color-panel-2); font-weight: 800; font-size: 14px; flex: none; }
  .mtitle { font-weight: 700; font-size: 17px; color: var(--color-ink); }
  .mcode { margin-left: auto; font-size: 11px; color: var(--color-line-k); }
  .mnote { font-size: 11.5px; line-height: 1.5; color: var(--color-ink-3); margin: 12px 0 14px; }
  .mbtn { display: flex; align-items: center; justify-content: space-between; width: 100%; background: transparent; border: 1px solid var(--color-edge-2); color: var(--color-ink); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; padding: 10px 13px; cursor: pointer; transition: border-color .2s ease; }
  .mbtn:hover { border-color: var(--color-line-k); }
  .gold { color: var(--color-line-k); }

  .legend { display: grid; gap: 11px; font-size: 10.5px; letter-spacing: 0.04em; color: var(--color-ink-3); }
  .lg { display: inline-flex; align-items: center; gap: 11px; }
  .lgi { display: inline-flex; line-height: 0; }

  .center-head { text-align: center; margin-bottom: 6px; }
  .ctitle { font-weight: 800; font-size: clamp(26px, 3.4vw, 42px); letter-spacing: -0.04em; margin: 0; color: var(--color-ink); }
  .csub { font-size: 13px; color: var(--color-ink-3); margin: 8px 0 0; }
  .mapwrap { margin-top: 26px; border: 1px solid var(--color-edge); background: var(--color-panel-2); padding: 14px 14px 8px; position: relative; }
  .map-label { position: absolute; top: 12px; left: 16px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; color: #46525d; z-index: 2; }
  .map-legend { display: flex; flex-wrap: wrap; gap: 16px 22px; padding: 10px 6px 12px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; color: var(--color-ink-4); border-top: 1px solid var(--color-edge); margin-top: 4px; }
  .ml { display: inline-flex; align-items: center; gap: 8px; }
  .ml .d { width: 11px; height: 11px; border-radius: 50%; }
  .ring-g { border: 2px solid var(--color-line-g); }
  .fill-k { background: var(--color-line-k); }
  .ring-b { border: 2px solid var(--color-line-b); }
  .dash { border: 2px dashed var(--color-ink-5); }

  .here-id { display: flex; align-items: center; gap: 12px; }
  .here-code { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 32px; padding: 0 8px; color: var(--color-panel-2); font-weight: 800; font-size: 16px; }
  .here-title { font-weight: 700; font-size: 18px; color: var(--color-ink); }
  .here-line { font-size: 10.5px; letter-spacing: 0.06em; margin: 12px 0 6px; }
  .here-foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; }
  .here-note { font-size: 12px; line-height: 1.5; color: var(--color-ink-3); margin: 0; max-width: 22ch; }

  .cf-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .viewall { font-size: 9.5px; letter-spacing: 0.1em; color: var(--color-ink-3); cursor: pointer; }
  .cf-list { display: grid; gap: 1px; background: var(--color-edge); }
  .cf-row { display: flex; align-items: center; gap: 10px; background: var(--color-panel); padding: 11px 4px; }
  .cf-id { font-size: 10.5px; color: var(--color-ink-4); width: 42px; flex: none; }
  .cf-title { font-size: 11.5px; flex: 1; }
  .cf-status { font-size: 10px; letter-spacing: 0.08em; }
  .cf-foot { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--color-edge); margin-top: 12px; padding-top: 12px; font-size: 11px; color: var(--color-ink-4); }

  .strip-wrap { max-width: 1640px; margin: 4px auto 0; padding: 0 28px; }
  .strip { border: 1px solid var(--color-edge); background: var(--color-panel-2); padding: 22px 28px; }
  .strip-title { text-align: center; font-size: 12px; letter-spacing: 0.22em; color: var(--color-ink-4); margin-bottom: 20px; }
  .strip-cells { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--color-edge); }
  .cell { background: var(--color-panel-2); padding: 16px 20px; display: flex; align-items: center; gap: 14px; }
  .cell-h { font-size: 12px; font-weight: 700; color: var(--color-ink); letter-spacing: 0.04em; }
  .cell-b { font-size: 11px; color: var(--color-ink-4); margin-top: 3px; }

  @media (max-width: 1180px) {
    .shell { grid-template-columns: 1fr; }
    .strip-cells { grid-template-columns: 1fr; }
  }
</style>
