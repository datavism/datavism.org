<script lang="ts">
  // src/components/command-center/CommandCenter.svelte
  // DATAVISM "Command Center" — full-viewport ops-room dashboard shell.
  // Three-column layout: Operations log | World Map | Lines + Active Op.
  // All numbers sourced from real data (LAUNCHPAD_CASES, LINES, localStorage).
  // No fake timestamps, no invented metrics.
  // No GSAP — CSS animation only.

  import { onMount } from 'svelte'
  import WorldMap from './WorldMap.svelte'
  import Dossier from './Dossier.svelte'
  import { LAUNCHPAD_CASES } from '../../lib/line-g-opening/cases'
  import { FIRST_OPERATION } from '../../lib/command-center/operations'
  import { loadHistory } from '../../lib/command-center/history'
  import type { ClosedOperation } from '../../lib/command-center/history'
  import { LINES } from '../../lib/curriculum/lines'

  // ── dossier selection ─────────────────────────────────────────
  let selectedCaseId = $state<string | null>(null)

  // transient "claimed" confirmation line
  let claimedMsg = $state<string | null>(null)
  let claimedTimer: ReturnType<typeof setTimeout> | null = null

  function openDossier(id: string) {
    selectedCaseId = id
  }

  function closeDossier() {
    selectedCaseId = null
  }

  function handleClaim(id: string) {
    selectedCaseId = null
    if (claimedTimer) clearTimeout(claimedTimer)
    claimedMsg = `Operation claimed — investigation flow coming next.`
    claimedTimer = setTimeout(() => { claimedMsg = null }, 4_000)
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

  // ── line case counts ──────────────────────────────────────────
  // Mapping: tracking→K, money→R, feed→B, future→V, G=Foundation (method, 0)
  const lineCaseCounts: Record<string, number> = {
    g: 0,                    // Foundation / method line — carries no investigation cases
    k: bySignal.tracking,
    r: bySignal.money,
    b: bySignal.feed,
    v: bySignal.future,
  }

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
    <aside class="cc-col cc-left" aria-label="Operations log and overview">

      <!-- OPERATIONS panel -->
      <section class="panel panel-ops">
        <div class="panel-hd">
          <span class="panel-mark">◢</span>
          OPERATIONS
          <span class="panel-hd-count">{total}</span>
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
              <span
                class="op-sig"
                style="color: {sigColor[c.systemSignal] ?? '#7a818d'}"
              >{c.systemSignal.toUpperCase()}</span>
              <p class="op-hook">{c.hook}</p>
            </div>
          {/each}
        </div>
      </section>

      <!-- INVESTIGATIONS OVERVIEW -->
      <section class="panel panel-ov">
        <div class="panel-hd">
          <span class="panel-mark">◢</span>
          INVESTIGATIONS OVERVIEW
        </div>
        <div class="panel-body">
          <div class="ov-total">
            TOTAL CASES
            <span class="ov-total-num">{total}</span>
          </div>
          <div class="ov-bars" role="list" aria-label="Case breakdown by signal">
            {#each signalBreakdown as item (item.key)}
              <div class="ov-row" role="listitem">
                <span class="ov-label" style="color: {item.color}">{item.label}</span>
                <div class="ov-track" aria-hidden="true">
                  <div
                    class="ov-bar"
                    style="width: {(item.count / total * 100).toFixed(1)}%; background: {item.color}"
                  ></div>
                </div>
                <span class="ov-num" style="color: {item.color}">{item.count}</span>
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
          <span class="map-hd-meta">NATURAL EARTH · WGS-84</span>
        </div>
        <div class="map-frame">
          <WorldMap chrome={false} onselect={openDossier} />
        </div>
      </div>
    </div>

    <!-- ── RIGHT COLUMN ───────────────────────────────────────── -->
    <aside class="cc-col cc-right" aria-label="Lines status and assigned operation">

      <!-- LINES STATUS -->
      <section class="panel panel-lines">
        <div class="panel-hd">
          <span class="panel-mark">◢</span>
          LINES STATUS
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

      <!-- ASSIGNED OPERATION -->
      <section class="panel panel-assigned">
        <div class="panel-hd">
          <span class="panel-mark">◢</span>
          ASSIGNED OPERATION
        </div>
        <div class="panel-body">
          <div class="aop-id">OP · {FIRST_OPERATION.caseId.toUpperCase()}</div>
          <div class="aop-signal" style="color: {sigColor[FIRST_OPERATION.signal]}">
            {FIRST_OPERATION.signal.toUpperCase()}
          </div>
          <p class="aop-question">{FIRST_OPERATION.question}</p>
          <div class="aop-source">
            <span class="aop-source-label">SOURCE</span>
            <span class="aop-source-name">{FIRST_OPERATION.source.title}</span>
          </div>
          <div class="aop-action">
            <button
              class="aop-link"
              onclick={() => openDossier(FIRST_OPERATION.caseId)}
            >VIEW DOSSIER →</button>
          </div>
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
  <!-- BOTTOM BAR                                                   -->
  <!-- ════════════════════════════════════════════════════════════ -->
  <footer class="cc-bottombar">
    <div class="bottom-block bottom-closed">
      <span class="bottom-lbl">CLOSED CASES</span>
      {#if closedOps.length === 0}
        <span class="bottom-empty">
          No operations closed yet — claim 001 to enter the record.
        </span>
      {:else}
        <div class="closed-list">
          {#each closedOps as op (op.caseId)}
            <span class="closed-tag">{op.codename}</span>
          {/each}
        </div>
      {/if}
    </div>

    <div class="bottom-block bottom-agent">
      <span class="bottom-lbl">AGENT STATUS</span>
      <span class="agent-offline">░░░░░ · NOT CONNECTED</span>
    </div>

    <div class="bottom-block bottom-status">
      SECURE CHANNEL · METHOD CERTIFIED, NOT VERIFIED
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
    padding: 8px 16px;
    border-bottom: 1px solid #20222b;
    background: #0a0b10;
    flex-shrink: 0;
    min-height: 40px;
  }

  /* brand */
  .topbar-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .brand-glyph { color: #00ff88; font-size: 13px; }
  .brand-name  { color: #00ff88; font-weight: 600; }
  .topbar-sep  { color: #20222b; }
  .brand-page  { color: #a7ada3; }

  /* nav tabs */
  .topbar-nav {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
  }
  .nav-tab {
    padding: 3px 10px;
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border: 1px solid transparent;
    cursor: default;
  }
  .nav-active {
    color: #00ff88;
    border-color: #00ff8844;
    background: #00ff8808;
  }
  .nav-dim { color: #343843; }

  /* meta (clock + badge) */
  .topbar-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .meta-clock {
    font-size: 10px;
    letter-spacing: 0.14em;
    color: #00ffff;
    font-variant-numeric: tabular-nums;
  }
  .meta-badge {
    font-size: 8px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #060608;
    background: #7a818d;
    padding: 2px 6px;
    border-radius: 1px;
  }

  /* ══════════════════════════════════════════════════════════════
   * THREE-COLUMN MAIN
   * ═════════════════════════════════════════════════════════════*/
  .cc-main {
    display: grid;
    grid-template-columns: 22% 1fr 22%;
    gap: 8px;
    padding: 8px;
    min-height: 0;
    overflow: hidden;
  }

  .cc-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
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
    top: 3px;
    left: 3px;
    width: 9px;
    height: 9px;
    border-top: 1.5px solid #00ff8844;
    border-left: 1.5px solid #00ff8844;
    pointer-events: none;
    z-index: 2;
  }
  /* BR corner bracket */
  .panel::after {
    content: '';
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 9px;
    height: 9px;
    border-bottom: 1.5px solid #00ff8844;
    border-right: 1.5px solid #00ff8844;
    pointer-events: none;
    z-index: 2;
  }

  /* panel header */
  .panel-hd {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 5px;
    border-bottom: 1px solid #20222b;
    font-size: 8px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7a818d;
    flex-shrink: 0;
  }
  .panel-mark { color: #00ff88; font-size: 10px; line-height: 1; }
  .panel-hd-count {
    margin-left: auto;
    color: #ffd23f;
    font-size: 9px;
    font-weight: 600;
  }

  /* panel body */
  .panel-body {
    padding: 10px;
    flex: 1;
    min-height: 0;
  }

  /* ══════════════════════════════════════════════════════════════
   * LEFT COLUMN
   * ═════════════════════════════════════════════════════════════*/

  /* OPERATIONS */
  .panel-ops { flex: 1; min-height: 0; }

  .ops-scroll {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    /* custom scrollbar */
    scrollbar-width: thin;
    scrollbar-color: #20222b #0e0f14;
  }
  .ops-scroll::-webkit-scrollbar { width: 4px; }
  .ops-scroll::-webkit-scrollbar-track { background: #0e0f14; }
  .ops-scroll::-webkit-scrollbar-thumb { background: #20222b; border-radius: 2px; }

  .op-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 6px 0;
    border-bottom: 1px solid #13141a;
  }
  .op-row:last-child { border-bottom: none; }

  .op-row-clickable {
    cursor: pointer;
    transition: background 0.15s;
    border-radius: 1px;
    padding-left: 4px;
    padding-right: 4px;
  }
  .op-row-clickable:hover,
  .op-row-clickable:focus-visible {
    background: #ffffff08;
    outline: none;
  }

  .op-sig {
    font-size: 7px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    line-height: 1;
  }
  .op-hook {
    font-size: 8.5px;
    color: #a7ada3;
    line-height: 1.45;
    letter-spacing: 0.03em;
  }

  /* INVESTIGATIONS OVERVIEW */
  .panel-ov { flex-shrink: 0; }

  .ov-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 8px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #7a818d;
    margin-bottom: 10px;
  }
  .ov-total-num { color: #f2f1ea; font-size: 14px; font-weight: 600; letter-spacing: 0; }

  .ov-bars { display: flex; flex-direction: column; gap: 7px; }

  .ov-row {
    display: grid;
    grid-template-columns: 60px 1fr 20px;
    align-items: center;
    gap: 6px;
  }
  .ov-label {
    font-size: 7.5px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    line-height: 1;
  }
  .ov-track {
    height: 3px;
    background: #13141a;
    border-radius: 1px;
    overflow: hidden;
  }
  .ov-bar {
    height: 100%;
    border-radius: 1px;
    min-width: 2px;
  }
  .ov-num {
    font-size: 8px;
    font-weight: 600;
    text-align: right;
    letter-spacing: 0;
  }

  /* ══════════════════════════════════════════════════════════════
   * CENTER: WORLD MAP
   * ═════════════════════════════════════════════════════════════*/
  .cc-center { flex: 1; min-height: 0; }
  .panel-map { height: 100%; }

  .panel-hd-map { justify-content: flex-start; }
  .map-hd-meta {
    margin-left: auto;
    font-size: 7px;
    color: #343843;
    letter-spacing: 0.12em;
  }

  .map-frame {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
    background: #060608;
  }
  /* WorldMap's .world-map-wrap has aspect-ratio: 16/9 + width: 100% */
  .map-frame :global(.world-map-wrap) {
    width: 100%;
    max-height: 100%;
    aspect-ratio: 16 / 9;
    object-fit: contain;
  }

  /* ══════════════════════════════════════════════════════════════
   * RIGHT COLUMN
   * ═════════════════════════════════════════════════════════════*/

  /* LINES STATUS */
  .panel-lines { flex-shrink: 0; }

  .panel-lines .panel-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .line-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;
    border-bottom: 1px solid #13141a;
  }
  .line-row:last-child { border-bottom: none; }

  .line-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: 1px solid;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0;
    flex-shrink: 0;
    background: rgba(0, 0, 0, 0.3);
  }

  .line-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }
  .line-name {
    font-size: 8.5px;
    color: #f2f1ea;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .line-role {
    font-size: 6.5px;
    color: #343843;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .line-count {
    font-size: 13px;
    font-weight: 600;
    text-align: right;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    letter-spacing: 0;
  }
  .line-count-label {
    font-size: 6px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #343843;
    font-weight: 400;
  }

  /* ASSIGNED OPERATION */
  .panel-assigned { flex: 1; min-height: 0; }

  .panel-assigned .panel-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #20222b #0e0f14;
  }

  .aop-id {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #ffd23f;
    font-weight: 600;
  }
  .aop-signal {
    font-size: 7.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 600;
  }
  .aop-question {
    font-size: 9px;
    color: #f2f1ea;
    line-height: 1.5;
    letter-spacing: 0.02em;
    border-left: 1.5px solid #20222b;
    padding-left: 8px;
  }
  .aop-source {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .aop-source-label {
    font-size: 7px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #343843;
  }
  .aop-source-name {
    font-size: 8.5px;
    color: #7a818d;
    letter-spacing: 0.04em;
  }
  .aop-action { margin-top: auto; }
  .aop-link {
    display: inline-block;
    font-size: 8.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #00ff88;
    border: 1px solid #00ff8844;
    padding: 4px 10px;
    cursor: pointer;
    background: none;
    font-family: inherit;
    transition: border-color 0.15s, background 0.15s;
  }
  .aop-link:hover, .aop-link:focus-visible {
    border-color: #00ff8888;
    background: #00ff8808;
    outline: none;
  }

  /* ══════════════════════════════════════════════════════════════
   * BOTTOM BAR
   * ═════════════════════════════════════════════════════════════*/
  .cc-bottombar {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 16px;
    padding: 6px 16px;
    border-top: 1px solid #20222b;
    background: #0a0b10;
    flex-shrink: 0;
    min-height: 36px;
  }

  .bottom-block {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .bottom-lbl {
    font-size: 7px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #343843;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .bottom-empty {
    font-size: 8px;
    color: #343843;
    letter-spacing: 0.06em;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .closed-list {
    display: flex;
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  .closed-tag {
    font-size: 8px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00ff88;
    border: 1px solid #00ff8844;
    padding: 2px 6px;
    white-space: nowrap;
  }

  .agent-offline {
    font-size: 9px;
    letter-spacing: 0.14em;
    color: #343843;
    white-space: nowrap;
  }

  .bottom-status {
    font-size: 7.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #343843;
    white-space: nowrap;
    justify-content: flex-end;
  }

  /* ══════════════════════════════════════════════════════════════
   * CLAIMED MESSAGE (transient status line)
   * ═════════════════════════════════════════════════════════════*/
  .cc-claimed-msg {
    position: fixed;
    bottom: 48px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 250;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0a0b10;
    border: 1px solid #00ff8844;
    padding: 7px 16px;
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #00ff88;
    white-space: nowrap;
    pointer-events: none;
    animation: msg-fadein 0.3s ease;
  }
  .claimed-mark { font-size: 10px; }

  @keyframes msg-fadein {
    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* ══════════════════════════════════════════════════════════════
   * REDUCED MOTION
   * ═════════════════════════════════════════════════════════════*/
  @media (prefers-reduced-motion: reduce) {
    .cc-scanlines { display: none; }
    .cc-claimed-msg { animation: none; }
  }
</style>
