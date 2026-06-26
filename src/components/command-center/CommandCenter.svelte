<script lang="ts">
  // src/components/command-center/CommandCenter.svelte
  // DATAVISM "Command Center" — full-viewport ops-room dashboard shell.
  // Three-column layout: Operations + Signal Mix | World Map | Assigned Op + Lines.
  // Dense status band at the bottom with REAL aggregate KPIs.
  // All numbers sourced from real data (LAUNCHPAD_CASES, LINES, localStorage).
  // No fake timestamps, no invented metrics, no fabricated reputation/social-proof.
  // No GSAP — CSS animation only.

  import { onMount } from 'svelte'
  import WorldMap from './WorldMap.svelte'
  import Dossier from './Dossier.svelte'
  import Investigation from './Investigation.svelte'
  import ClosedRecord from './ClosedRecord.svelte'
  import { LAUNCHPAD_CASES } from '../../lib/line-g-opening/cases'
  import { FIRST_OPERATION } from '../../lib/command-center/operations'
  import { loadHistory } from '../../lib/command-center/history'
  import type { ClosedOperation } from '../../lib/command-center/history'
  import { LINES } from '../../lib/curriculum/lines'

  // ── dossier + investigation selection ─────────────────────────
  let selectedCaseId = $state<string | null>(null)   // dossier overlay
  let activeOpId = $state<string | null>(null)        // investigation loop overlay
  let reviewOp = $state<ClosedOperation | null>(null) // read-only closed-record overlay

  // transient confirmation line
  let claimedMsg = $state<string | null>(null)
  let claimedTimer: ReturnType<typeof setTimeout> | null = null

  function openDossier(id: string) {
    selectedCaseId = id
  }

  function closeDossier() {
    selectedCaseId = null
  }

  // CLAIM in the dossier → enter the investigation loop (not a toast).
  function handleClaim(id: string) {
    selectedCaseId = null
    activeOpId = id
  }

  function closeInvestigation() {
    activeOpId = null
  }

  // Fired when GHOST certifies the method and the op is recorded on-device.
  function handleClosed(id: string) {
    closedOps = loadHistory()
    if (claimedTimer) clearTimeout(claimedTimer)
    claimedMsg = `Operation closed — method certified, not verified.`
    claimedTimer = setTimeout(() => { claimedMsg = null }, 5_000)
  }

  // ── UTC clock (updates every second) ─────────────────────────
  let now = $state(new Date())
  onMount(() => {
    const id = setInterval(() => { now = new Date() }, 1_000)
    return () => clearInterval(id)
  })
  function utcClock(d: Date): string {
    return d.toISOString().slice(11, 19) + ' UTC'
  }

  // ── closed operations (browser-only; may be empty on first visit) ─
  let closedOps = $state<ClosedOperation[]>([])
  onMount(() => {
    closedOps = loadHistory()
  })

  // Lock background scroll while ANY overlay (dossier or investigation) is open.
  // One lock for whichever is open, so the dossier→investigation handoff can't race.
  $effect(() => {
    const open = selectedCaseId !== null || activeOpId !== null || reviewOp !== null
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  })

  // ── real case counts by systemSignal ─────────────────────────
  const total = LAUNCHPAD_CASES.length

  const bySignal = {
    tracking: LAUNCHPAD_CASES.filter(c => c.systemSignal === 'tracking').length,
    money:    LAUNCHPAD_CASES.filter(c => c.systemSignal === 'money').length,
    feed:     LAUNCHPAD_CASES.filter(c => c.systemSignal === 'feed').length,
    future:   LAUNCHPAD_CASES.filter(c => c.systemSignal === 'future').length,
  }

  const signalBreakdown = [
    { key: 'tracking', label: 'TRACKING', count: bySignal.tracking, color: '#00ffff' },
    { key: 'money',    label: 'MONEY',    count: bySignal.money,    color: '#ffd23f' },
    { key: 'feed',     label: 'FEED',     count: bySignal.feed,     color: '#ff2af0' },
    { key: 'future',   label: 'FUTURE',   count: bySignal.future,   color: '#aa44ff' },
  ] as const

  // ── donut: conic-gradient slices from the REAL signal counts ──
  const donutStops = $derived.by(() => {
    let acc = 0
    const parts: string[] = []
    for (const item of signalBreakdown) {
      const start = (acc / total) * 360
      acc += item.count
      const end = (acc / total) * 360
      parts.push(`${item.color} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`)
    }
    return parts.join(', ')
  })

  // ── line case counts ──────────────────────────────────────────
  // Mapping: tracking→K, money→R, feed→B, future→V, G=Foundation (method, 0)
  const lineCaseCounts: Record<string, number> = {
    g: 0,                    // Foundation / method line — carries no investigation cases
    k: bySignal.tracking,
    r: bySignal.money,
    b: bySignal.feed,
    v: bySignal.future,
  }

  // ── honest KPI aggregates (counts of real things only) ────────
  const assignedCount = 1            // FIRST_OPERATION is the guided starter operation
  const linesCount = LINES.length    // 5 lines (G/K/R/B/V)
  const methodDone = 1               // only QUESTION is established on the assigned op
  const methodTotal = 6              // the six-step method

  // ── signal color helper (for op list badges) ─────────────────
  const sigColor: Record<string, string> = {
    tracking: '#00ffff',
    money:    '#ffd23f',
    feed:     '#ff2af0',
    future:   '#aa44ff',
    unsure:   '#7a818d',
  }
</script>

<!-- ── full-viewport shell ──────────────────────────────────────── -->
<div class="cc-shell" role="main" aria-label="Command Center Dashboard">

  <!-- ── scanline overlay (full viewport) ──────────────────────── -->
  <div class="cc-scanlines" aria-hidden="true"></div>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- TOP NAV BAR                                                  -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <header class="cc-topbar">
    <div class="topbar-brand">
      <span class="brand-glyph">◢</span>
      <span class="brand-name">DATAVISM</span>
      <span class="topbar-sep">·</span>
      <span class="brand-page">COMMAND CENTER</span>
    </div>

    <nav class="topbar-nav" aria-label="Command Center navigation">
      <span class="nav-tab nav-active" aria-current="page">DASHBOARD</span>
      <span class="nav-tab nav-dim" aria-disabled="true">CASES</span>
      <span class="nav-tab nav-dim" aria-disabled="true">LINES</span>
      <span class="nav-tab nav-dim" aria-disabled="true">FIELD</span>
    </nav>

    <div class="topbar-meta">
      <span class="meta-clock" aria-live="off">{utcClock(now)}</span>
      <span class="meta-badge" title="Transport encrypted; content not independently verified">ENCRYPTED</span>
    </div>
  </header>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- THREE-COLUMN MAIN                                            -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <div class="cc-main">

    <!-- ── LEFT COLUMN ────────────────────────────────────────── -->
    <aside class="cc-col cc-left" aria-label="Operations log and signal mix">

      <!-- OPERATIONS panel -->
      <section class="panel panel-ops">
        <div class="panel-hd">
          <span class="panel-mark">◢</span>
          OPERATIONS
          <span class="panel-hd-count">{total} OPEN</span>
        </div>
        <div class="panel-body ops-scroll">
          {#each LAUNCHPAD_CASES as c (c.id)}
            <div
              class="op-row op-row-clickable"
              role="button"
              tabindex="0"
              aria-label="Open dossier: {c.id}"
              onclick={() => openDossier(c.id)}
              onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDossier(c.id) } }}
            >
              <span class="op-dot" style="background: {sigColor[c.systemSignal] ?? '#7a818d'}" aria-hidden="true"></span>
              <div class="op-text">
                <span
                  class="op-sig"
                  style="color: {sigColor[c.systemSignal] ?? '#7a818d'}"
                >{c.systemSignal.toUpperCase()}</span>
                <p class="op-hook">{c.hook}</p>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- SIGNAL MIX (real donut) -->
      <section class="panel panel-ov">
        <div class="panel-hd">
          <span class="panel-mark">◢</span>
          SIGNAL MIX
          <span class="panel-hd-note">BY SYSTEM</span>
        </div>
        <div class="panel-body ov-body">
          <div class="donut-wrap" role="img" aria-label="{total} cases across {signalBreakdown.length} signal types">
            <div class="donut" style="background: conic-gradient(from -90deg, {donutStops})">
              <div class="donut-hole">
                <span class="donut-num">{total}</span>
                <span class="donut-lbl">CASES</span>
              </div>
            </div>
          </div>
          <div class="ov-legend">
            {#each signalBreakdown as item (item.key)}
              <div class="leg-row">
                <span class="leg-dot" style="background: {item.color}" aria-hidden="true"></span>
                <span class="leg-lbl">{item.label}</span>
                <span class="leg-num" style="color: {item.color}">{item.count}</span>
              </div>
            {/each}
          </div>
        </div>
      </section>

    </aside>

    <!-- ── CENTER: WORLD MAP ──────────────────────────────────── -->
    <div class="cc-col cc-center">
      <div class="panel panel-map">
        <div class="panel-hd panel-hd-map">
          <span class="panel-mark">◢</span>
          GLOBAL INVESTIGATION MAP
          <span class="map-hd-meta">{total} SOURCES · NATURAL EARTH · WGS-84</span>
        </div>
        <div class="map-frame">
          <WorldMap chrome={false} onselect={openDossier} />
        </div>
      </div>
    </div>

    <!-- ── RIGHT COLUMN ───────────────────────────────────────── -->
    <aside class="cc-col cc-right" aria-label="Assigned operation and lines status">

      <!-- ASSIGNED OPERATION -->
      <section class="panel panel-assigned">
        <div class="panel-hd">
          <span class="panel-mark">◢</span>
          ASSIGNED OPERATION
          <span class="panel-hd-tag">CASE NEEDS YOU</span>
        </div>
        <div class="panel-body aop-body">
          <div class="aop-top">
            <span class="aop-id">OP · {FIRST_OPERATION.caseId.toUpperCase()}</span>
            <span class="aop-signal" style="color: {sigColor[FIRST_OPERATION.signal]}; border-color: {sigColor[FIRST_OPERATION.signal]}55">
              {FIRST_OPERATION.signal.toUpperCase()}
            </span>
          </div>
          <p class="aop-question">{FIRST_OPERATION.question}</p>

          <div class="aop-source">
            <span class="aop-source-label">PUBLIC SOURCE</span>
            <span class="aop-source-name">{FIRST_OPERATION.source.title}</span>
          </div>

          <div class="aop-method">
            <span class="aop-method-lbl">METHOD</span>
            <div class="aop-dots" aria-hidden="true">
              {#each Array(methodTotal) as _, i}
                <span class="aop-dot" class:aop-dot-done={i < methodDone}></span>
              {/each}
            </div>
            <span class="aop-method-frac">{methodDone}/{methodTotal}</span>
          </div>

          <div class="aop-action">
            <button
              class="aop-link"
              onclick={() => openDossier(FIRST_OPERATION.caseId)}
            >OPEN DOSSIER →</button>
          </div>
        </div>
      </section>

      <!-- LINES STATUS -->
      <section class="panel panel-lines">
        <div class="panel-hd">
          <span class="panel-mark">◢</span>
          LINES STATUS
          <span class="panel-hd-count">{linesCount}</span>
        </div>
        <div class="panel-body">
          {#each LINES as line (line.id)}
            <div class="line-row">
              <div class="line-badge" style="border-color: {line.color.hex}; color: {line.color.hex}">
                {line.code}
              </div>
              <div class="line-info">
                <span class="line-name">{line.shortName.toUpperCase()}</span>
                <span class="line-role">{line.motto.toUpperCase()}</span>
              </div>
              <div class="line-count" style="color: {line.color.hex}">
                {lineCaseCounts[line.id]}
                <span class="line-count-label">CASES</span>
              </div>
            </div>
          {/each}
        </div>
      </section>

    </aside>
  </div><!-- /cc-main -->

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- CLAIMED OPERATION MESSAGE (transient)                         -->
  <!-- ════════════════════════════════════════════════════════════ -->
  {#if claimedMsg}
    <div class="cc-claimed-msg" role="status" aria-live="polite">
      <span class="claimed-mark">◢</span>
      {claimedMsg}
    </div>
  {/if}

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- BOTTOM STATUS BAND — real aggregate KPIs                     -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <footer class="cc-bottombar">

    <!-- KPI tiles (all real counts) -->
    <div class="bb-kpis" aria-label="Operational summary">
      <div class="bb-kpi">
        <span class="bb-num">{total}</span>
        <span class="bb-lbl">OPS AVAILABLE</span>
      </div>
      <div class="bb-kpi">
        <span class="bb-num bb-amber">{assignedCount}</span>
        <span class="bb-lbl">ASSIGNED</span>
      </div>
      <div class="bb-kpi">
        <span class="bb-num bb-green">{closedOps.length}</span>
        <span class="bb-lbl">CLOSED</span>
      </div>
      <div class="bb-kpi">
        <span class="bb-num">{linesCount}</span>
        <span class="bb-lbl">LINES</span>
      </div>
      <div class="bb-kpi">
        <span class="bb-num bb-cyan">{methodDone}<span class="bb-frac">/{methodTotal}</span></span>
        <span class="bb-lbl">METHOD</span>
      </div>
    </div>

    <!-- closed cases ledger -->
    <div class="bb-cell bb-closed">
      <span class="bb-cell-lbl">CLOSED CASES</span>
      {#if closedOps.length === 0}
        <span class="bb-empty">No operations closed yet — claim 001 to enter the record.</span>
      {:else}
        <div class="closed-list">
          {#each closedOps as op (op.caseId)}
            <button
              class="closed-tag"
              onclick={() => (reviewOp = op)}
              aria-label="Review closed operation {op.codename}"
            >{op.codename}</button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- agent status -->
    <div class="bb-cell bb-agent">
      <span class="bb-cell-lbl">AGENT STATUS</span>
      <span class="agent-offline"><span class="agent-pip"></span> NOT CONNECTED</span>
    </div>

    <!-- system message -->
    <div class="bb-cell bb-sys">
      <span class="bb-cell-lbl">SYSTEM</span>
      <span class="sys-msg">METHOD CERTIFIED, NOT VERIFIED</span>
    </div>

  </footer>

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- DOSSIER OVERLAY                                              -->
  <!-- ════════════════════════════════════════════════════════════ -->
  {#if selectedCaseId}
    <Dossier
      caseId={selectedCaseId}
      onclose={closeDossier}
      onclaim={handleClaim}
    />
  {/if}

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- INVESTIGATION LOOP OVERLAY                                   -->
  <!-- ════════════════════════════════════════════════════════════ -->
  {#if activeOpId}
    <Investigation
      caseId={activeOpId}
      onclose={closeInvestigation}
      onclosed={handleClosed}
    />
  {/if}

  <!-- ════════════════════════════════════════════════════════════ -->
  <!-- CLOSED RECORD OVERLAY (read-only review)                     -->
  <!-- ════════════════════════════════════════════════════════════ -->
  {#if reviewOp}
    <ClosedRecord op={reviewOp} onclose={() => (reviewOp = null)} />
  {/if}

</div><!-- /cc-shell -->

<style>
  /* ── reset + base ───────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── shell: full-viewport ops room ─────────────────────────── */
  .cc-shell {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100dvh;
    overflow: hidden;
    background: #060608;
    color: #f2f1ea;
    font-family: var(--font-mono, 'Spline Sans Mono', ui-monospace, monospace);
  }

  /* ── scanlines overlay ──────────────────────────────────────── */
  .cc-scanlines {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.045) 2px,
      rgba(0, 0, 0, 0.045) 4px
    );
  }

  /* ══════════════════════════════════════════════════════════════
   * TOP NAV BAR
   * ═════════════════════════════════════════════════════════════*/
  .cc-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 18px;
    border-bottom: 1px solid #20222b;
    background: linear-gradient(180deg, #0c0d12, #0a0b10);
    flex-shrink: 0;
    min-height: 46px;
  }

  /* brand */
  .topbar-brand {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 13px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .brand-glyph { color: #00ff88; font-size: 15px; }
  .brand-name  { color: #00ff88; font-weight: 600; }
  .topbar-sep  { color: #343843; }
  .brand-page  { color: #a7ada3; }

  /* nav tabs */
  .topbar-nav {
    display: flex;
    align-items: center;
    gap: 5px;
    flex: 1;
    justify-content: center;
  }
  .nav-tab {
    padding: 5px 14px;
    font-size: 11.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    border: 1px solid transparent;
    cursor: default;
  }
  .nav-active {
    color: #00ff88;
    border-color: #00ff8844;
    background: #00ff8810;
  }
  .nav-dim { color: #4a4f5c; }

  /* meta (clock + badge) */
  .topbar-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }
  .meta-clock {
    font-size: 13px;
    letter-spacing: 0.12em;
    color: #00ffff;
    font-variant-numeric: tabular-nums;
  }
  .meta-badge {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #060608;
    background: #7a818d;
    padding: 3px 8px;
    border-radius: 1px;
    font-weight: 600;
  }

  /* ══════════════════════════════════════════════════════════════
   * THREE-COLUMN MAIN
   * ═════════════════════════════════════════════════════════════*/
  .cc-main {
    display: grid;
    grid-template-columns: 23% 1fr 24%;
    gap: 10px;
    padding: 10px;
    min-height: 0;
    overflow: hidden;
  }

  .cc-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    overflow: hidden;
  }

  /* ══════════════════════════════════════════════════════════════
   * PANEL BASE + CORNER BRACKETS
   * ═════════════════════════════════════════════════════════════*/
  .panel {
    position: relative;
    background: #0e0f14;
    border: 1px solid #20222b;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* TL corner bracket */
  .panel::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 11px;
    height: 11px;
    border-top: 1.5px solid #00ff8844;
    border-left: 1.5px solid #00ff8844;
    pointer-events: none;
    z-index: 2;
  }
  /* BR corner bracket */
  .panel::after {
    content: '';
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 11px;
    height: 11px;
    border-bottom: 1.5px solid #00ff8844;
    border-right: 1.5px solid #00ff8844;
    pointer-events: none;
    z-index: 2;
  }

  /* panel header */
  .panel-hd {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 13px 8px;
    border-bottom: 1px solid #20222b;
    font-size: 11.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #a7ada3;
    flex-shrink: 0;
    background: #0b0c10;
  }
  .panel-mark { color: #00ff88; font-size: 12px; line-height: 1; }
  .panel-hd-count {
    margin-left: auto;
    color: #ffd23f;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
  }
  .panel-hd-note,
  .panel-hd-tag {
    margin-left: auto;
    color: #5a606c;
    font-size: 10px;
    letter-spacing: 0.16em;
  }
  .panel-hd-tag { color: #00ff88; }

  /* panel body */
  .panel-body {
    padding: 13px;
    flex: 1;
    min-height: 0;
  }

  /* ══════════════════════════════════════════════════════════════
   * LEFT COLUMN — OPERATIONS
   * ═════════════════════════════════════════════════════════════*/
  .panel-ops { flex: 1; min-height: 0; }

  .ops-scroll {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
    scrollbar-width: thin;
    scrollbar-color: #2c2f3a #0e0f14;
  }
  .ops-scroll::-webkit-scrollbar { width: 6px; }
  .ops-scroll::-webkit-scrollbar-track { background: #0e0f14; }
  .ops-scroll::-webkit-scrollbar-thumb { background: #2c2f3a; border-radius: 3px; }

  .op-row {
    display: grid;
    grid-template-columns: 8px 1fr;
    gap: 9px;
    align-items: start;
    padding: 9px 6px;
    border-bottom: 1px solid #15161d;
  }
  .op-row:last-child { border-bottom: none; }

  .op-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-top: 4px;
    flex-shrink: 0;
    box-shadow: 0 0 6px currentColor;
  }

  .op-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }

  .op-row-clickable {
    cursor: pointer;
    transition: background 0.15s;
  }
  .op-row-clickable:hover,
  .op-row-clickable:focus-visible {
    background: #ffffff0a;
    outline: none;
  }

  .op-sig {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    line-height: 1;
  }
  .op-hook {
    font-size: 12.5px;
    color: #c4c9d0;
    line-height: 1.5;
    letter-spacing: 0.01em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── SIGNAL MIX (donut) ─────────────────────────────────────── */
  .panel-ov { flex-shrink: 0; }

  .ov-body {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .donut-wrap { flex-shrink: 0; }
  .donut {
    position: relative;
    width: 112px;
    height: 112px;
    border-radius: 50%;
    filter: drop-shadow(0 0 10px #00ffff22);
  }
  .donut-hole {
    position: absolute;
    inset: 27px;
    background: #0e0f14;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
  }
  .donut-num {
    font-size: 28px;
    font-weight: 600;
    color: #f2f1ea;
    line-height: 1;
  }
  .donut-lbl {
    font-size: 9.5px;
    letter-spacing: 0.2em;
    color: #7a818d;
  }

  .ov-legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }
  .leg-row {
    display: grid;
    grid-template-columns: 10px 1fr auto;
    align-items: center;
    gap: 9px;
  }
  .leg-dot {
    width: 9px;
    height: 9px;
    border-radius: 2px;
    box-shadow: 0 0 6px currentColor;
  }
  .leg-lbl {
    font-size: 11.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #a7ada3;
  }
  .leg-num {
    font-size: 14px;
    font-weight: 600;
    text-align: right;
  }

  /* ══════════════════════════════════════════════════════════════
   * CENTER: WORLD MAP
   * ═════════════════════════════════════════════════════════════*/
  .cc-center { flex: 1; min-height: 0; }
  .panel-map { height: 100%; }

  .panel-hd-map { justify-content: flex-start; }
  .map-hd-meta {
    margin-left: auto;
    font-size: 10px;
    color: #5a606c;
    letter-spacing: 0.12em;
  }

  .map-frame {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
    background:
      radial-gradient(ellipse at center, #0a0e14 0%, #060608 75%);
  }
  /* WorldMap's .world-map-wrap has aspect-ratio: 16/9 + width: 100% */
  .map-frame :global(.world-map-wrap) {
    width: 100%;
    max-height: 100%;
    aspect-ratio: 16 / 9;
    object-fit: contain;
  }

  /* ══════════════════════════════════════════════════════════════
   * RIGHT COLUMN — ASSIGNED OPERATION
   * ═════════════════════════════════════════════════════════════*/
  .panel-assigned { flex: 1; min-height: 0; }

  .aop-body {
    display: flex;
    flex-direction: column;
    gap: 13px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #2c2f3a #0e0f14;
  }

  .aop-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .aop-id {
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #ffd23f;
    font-weight: 600;
  }
  .aop-signal {
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
    border: 1px solid;
    padding: 3px 8px;
  }
  .aop-question {
    font-size: 14px;
    color: #f2f1ea;
    line-height: 1.55;
    letter-spacing: 0.005em;
    border-left: 2px solid #00ff8855;
    padding-left: 12px;
  }
  .aop-source {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #060608;
    border: 1px solid #20222b;
    padding: 10px 12px;
  }
  .aop-source-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #5a606c;
  }
  .aop-source-name {
    font-size: 12.5px;
    color: #00ff88;
    letter-spacing: 0.02em;
  }

  /* method mini-tracker */
  .aop-method {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .aop-method-lbl {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #5a606c;
  }
  .aop-dots {
    display: flex;
    gap: 5px;
    flex: 1;
  }
  .aop-dot {
    width: 100%;
    height: 5px;
    background: #20222b;
    border-radius: 1px;
  }
  .aop-dot-done {
    background: #00ff88;
    box-shadow: 0 0 6px #00ff8866;
  }
  .aop-method-frac {
    font-size: 12px;
    font-weight: 600;
    color: #00ff88;
    letter-spacing: 0.06em;
  }

  .aop-action { margin-top: auto; padding-top: 4px; }
  .aop-link {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #00ff88;
    border: 1px solid #00ff8855;
    padding: 10px 14px;
    cursor: pointer;
    background: #00ff8808;
    font-family: inherit;
    font-weight: 600;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .aop-link:hover, .aop-link:focus-visible {
    border-color: #00ff88;
    background: #00ff8814;
    box-shadow: 0 0 16px #00ff8833;
    outline: none;
  }

  /* ── LINES STATUS ───────────────────────────────────────────── */
  .panel-lines { flex-shrink: 0; }

  .panel-lines .panel-body {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .line-row {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 8px 0;
    border-bottom: 1px solid #15161d;
  }
  .line-row:last-child { border-bottom: none; }

  .line-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
    background: rgba(0, 0, 0, 0.35);
  }

  .line-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  .line-name {
    font-size: 12px;
    color: #f2f1ea;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .line-role {
    font-size: 9.5px;
    color: #5a606c;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .line-count {
    font-size: 18px;
    font-weight: 600;
    text-align: right;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.1;
  }
  .line-count-label {
    font-size: 8.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5a606c;
    font-weight: 400;
  }

  /* ══════════════════════════════════════════════════════════════
   * BOTTOM STATUS BAND
   * ═════════════════════════════════════════════════════════════*/
  .cc-bottombar {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: stretch;
    gap: 0;
    border-top: 1px solid #20222b;
    background: linear-gradient(0deg, #0c0d12, #0a0b10);
    flex-shrink: 0;
    min-height: 66px;
  }

  /* KPI tiles */
  .bb-kpis {
    display: flex;
    align-items: stretch;
  }
  .bb-kpi {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 8px 18px;
    border-right: 1px solid #15161d;
    min-width: 78px;
  }
  .bb-num {
    font-size: 26px;
    font-weight: 600;
    color: #f2f1ea;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .bb-frac { font-size: 14px; color: #5a606c; }
  .bb-amber { color: #ffd23f; }
  .bb-green { color: #00ff88; }
  .bb-cyan  { color: #00ffff; }
  .bb-lbl {
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #5a606c;
    white-space: nowrap;
  }

  /* shared cell */
  .bb-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 8px 18px;
    border-right: 1px solid #15161d;
    min-width: 0;
  }
  .bb-cell-lbl {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #5a606c;
    white-space: nowrap;
  }

  .bb-closed { min-width: 0; }
  .bb-empty {
    font-size: 11px;
    color: #7a818d;
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .closed-list {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    overflow: hidden;
  }
  .closed-tag {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #00ff88;
    border: 1px solid #00ff8844;
    background: #00ff8808;
    padding: 3px 9px;
    white-space: nowrap;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, border-color 0.15s;
  }
  .closed-tag:hover,
  .closed-tag:focus-visible {
    background: #00ff8818;
    border-color: #00ff8899;
    outline: none;
  }

  .bb-agent { border-right: 1px solid #15161d; }
  .agent-offline {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11.5px;
    letter-spacing: 0.12em;
    color: #7a818d;
    white-space: nowrap;
  }
  .agent-pip {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4a4f5c;
    box-shadow: 0 0 6px #4a4f5c;
  }

  .bb-sys { border-right: none; }
  .sys-msg {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #00ff88;
    white-space: nowrap;
  }

  /* ══════════════════════════════════════════════════════════════
   * CLAIMED MESSAGE (transient status line)
   * ═════════════════════════════════════════════════════════════*/
  .cc-claimed-msg {
    position: fixed;
    bottom: 84px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 250;
    display: flex;
    align-items: center;
    gap: 9px;
    background: #0a0b10;
    border: 1px solid #00ff8844;
    box-shadow: 0 0 24px #00ff8822;
    padding: 9px 18px;
    font-size: 11.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00ff88;
    white-space: nowrap;
    pointer-events: none;
    animation: msg-fadein 0.3s ease;
  }
  .claimed-mark { font-size: 12px; }

  @keyframes msg-fadein {
    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* ══════════════════════════════════════════════════════════════
   * RESPONSIVE — keep dense but legible below 1100px
   * ═════════════════════════════════════════════════════════════*/
  @media (max-width: 1100px) {
    .bb-kpi { padding: 8px 12px; min-width: 64px; }
    .bb-num { font-size: 22px; }
  }

  /* ══════════════════════════════════════════════════════════════
   * REDUCED MOTION
   * ═════════════════════════════════════════════════════════════*/
  @media (prefers-reduced-motion: reduce) {
    .cc-scanlines { display: none; }
    .cc-claimed-msg { animation: none; }
  }
</style>
