<script lang="ts">
  // src/components/command-center/Dossier.svelte
  // Case Dossier overlay — shows real data only. No fabricated metrics.
  // Real: case question, public source (title/url/contains), briefing, method steps, uncertainty.
  // Scripted operations (starter + Meridian replications) use their briefing; other cases their hook.

  import { getCase } from '../../lib/line-g-opening/cases'
  import { getOperation } from '../../lib/command-center/operations'

  let {
    caseId,
    onclose,
    onclaim,
  }: {
    caseId: string
    onclose: () => void
    onclaim?: (id: string) => void
  } = $props()

  const cas = $derived(getCase(caseId))
  const scripted = $derived(getOperation(caseId))
  const isAssigned = $derived(Boolean(scripted))
  const briefing = $derived(scripted?.briefing ?? cas?.hook ?? '')

  const sigColor: Record<string, string> = {
    tracking: '#00ffff',
    money:    '#ffd23f',
    feed:     '#ff2af0',
    future:   '#aa44ff',
    unsure:   '#7a818d',
  }

  // The six method steps — honest state (only QUESTION is done; we have it)
  const METHOD_STEPS = [
    { label: 'QUESTION',     desc: 'Define the investigative question precisely.', done: true  },
    { label: 'DATA',         desc: 'Locate and pull the primary public source.', done: false },
    { label: 'AI',           desc: 'Use AI to process, pattern-match, and surface signals.', done: false },
    { label: 'VERIFICATION', desc: 'Cross-check output against raw data — never trust unverified results.', done: false },
    { label: 'EVIDENCE',     desc: 'Extract one concrete, citable finding.', done: false },
    { label: 'INTERVENTION', desc: 'Decide how to publish, share, or act on the finding.', done: false },
  ]

  function handleBackdropKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose()
  }

  // ESC closes from anywhere in the dossier (not only the backdrop).
  function handleWindowKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose()
  }
  // (background scroll-lock is owned by the parent CommandCenter.)
</script>

<svelte:window onkeydown={handleWindowKey} />

<!-- ── backdrop ─────────────────────────────────────────────────── -->
<div
  class="dossier-backdrop"
  onclick={onclose}
  onkeydown={handleBackdropKey}
  role="presentation"
  aria-hidden="true"
></div>

<!-- ── panel ────────────────────────────────────────────────────── -->
{#if cas}
<div
  class="dossier-panel"
  role="dialog"
  aria-modal="true"
  aria-label="Case dossier: {cas.starterQuestion}"
>
  <!-- TL/BR corner brackets (HUD chrome) -->
  <div class="ds-corner ds-tl" aria-hidden="true"></div>
  <div class="ds-corner ds-br" aria-hidden="true"></div>

  <!-- ── header ─────────────────────────────────────────────────── -->
  <header class="ds-header">
    <div class="ds-breadcrumb">
      <span class="ds-mark">◢</span>
      CASE DOSSIER
      <span class="ds-sep">·</span>
      <span class="ds-case-id">{caseId.toUpperCase()}</span>
    </div>
    <h1 class="ds-title">{cas.starterQuestion}</h1>
    <div class="ds-tags">
      <span
        class="ds-tag"
        style="color: {sigColor[cas.systemSignal] ?? '#7a818d'}; border-color: {sigColor[cas.systemSignal] ?? '#7a818d'}55"
      >{cas.systemSignal.toUpperCase()}</span>
      <span class="ds-status" class:ds-status-assigned={isAssigned}>
        STATUS: {isAssigned ? 'ASSIGNED' : 'AVAILABLE'}
      </span>
    </div>

    <button class="ds-close" onclick={onclose} aria-label="Close dossier">✕</button>
  </header>

  <!-- ── body: two-column ────────────────────────────────────────── -->
  <div class="ds-body">

    <!-- main content -->
    <div class="ds-main">

      <!-- (1) PUBLIC DATA SOURCE -->
      <section class="ds-section">
        <h2 class="ds-section-hd">
          <span class="ds-sec-num">1</span> PUBLIC DATA SOURCE
        </h2>
        <div class="ds-source-card">
          <a
            href={cas.source.url}
            target="_blank"
            rel="noopener noreferrer"
            class="ds-source-link"
            aria-label="Open source: {cas.source.title} (opens in new tab)"
          >{cas.source.title} ↗</a>
          <p class="ds-source-contains">{cas.source.contains}</p>
        </div>
      </section>

      <!-- (2) BRIEFING -->
      <section class="ds-section">
        <h2 class="ds-section-hd">
          <span class="ds-sec-num">2</span> BRIEFING
        </h2>
        <p class="ds-briefing">{briefing}</p>
      </section>

      <!-- (3) THE METHOD -->
      <section class="ds-section">
        <h2 class="ds-section-hd">
          <span class="ds-sec-num">3</span> THE METHOD
        </h2>
        <ol class="ds-method-list" aria-label="Investigation method steps">
          {#each METHOD_STEPS as step, idx}
            <li
              class="ds-method-item"
              class:ds-method-done={step.done}
              class:ds-method-pending={!step.done}
            >
              <span class="ds-method-num">{idx + 1}</span>
              <div class="ds-method-body">
                <span class="ds-method-label">{step.label}</span>
                <span class="ds-method-desc">{step.desc}</span>
              </div>
              <span class="ds-method-state" aria-label={step.done ? 'Complete' : 'Pending'}>
                {step.done ? '✓' : '○'}
              </span>
            </li>
          {/each}
        </ol>
      </section>

      <!-- (4) UNCERTAINTY -->
      <section class="ds-section">
        <h2 class="ds-section-hd">
          <span class="ds-sec-num">4</span> UNCERTAINTY
        </h2>
        <p class="ds-uncertainty">
          Nothing here is proven yet. The register is a starting point — figures may be
          self-declared, incomplete, or out of date. You verify.
        </p>
      </section>

    </div>

    <!-- side metadata -->
    <aside class="ds-side" aria-label="Case metadata">
      <div class="ds-meta-block">
        <span class="ds-meta-label">SIGNAL</span>
        <span
          class="ds-meta-val"
          style="color: {sigColor[cas.systemSignal] ?? '#7a818d'}"
        >{cas.systemSignal.toUpperCase()}</span>
      </div>
      <div class="ds-meta-block">
        <span class="ds-meta-label">CASE ID</span>
        <span class="ds-meta-val ds-meta-id">{caseId.toUpperCase()}</span>
      </div>
      <div class="ds-meta-block">
        <span class="ds-meta-label">STATUS</span>
        <span
          class="ds-meta-val"
          class:ds-meta-assigned={isAssigned}
        >{isAssigned ? 'ASSIGNED' : 'AVAILABLE'}</span>
      </div>
      <div class="ds-meta-block">
        <span class="ds-meta-label">METHOD STEPS</span>
        <span class="ds-meta-val">6</span>
      </div>
      <div class="ds-meta-block">
        <span class="ds-meta-label">STEP COMPLETE</span>
        <span class="ds-meta-val ds-meta-done">1 / 6</span>
      </div>
      <div class="ds-meta-divider" aria-hidden="true"></div>
      <div class="ds-meta-block">
        <span class="ds-meta-label">SOURCE TYPE</span>
        <span class="ds-meta-val">PUBLIC REGISTRY</span>
      </div>
      <div class="ds-meta-block">
        <span class="ds-meta-label">SOURCE</span>
        <a
          href={cas.source.url}
          target="_blank"
          rel="noopener noreferrer"
          class="ds-meta-source-link"
          aria-label="Open source (new tab)"
        >OPEN ↗</a>
      </div>
    </aside>

  </div><!-- /ds-body -->

  <!-- ── CTA ────────────────────────────────────────────────────── -->
  <div class="ds-footer">
    <button
      class="ds-claim-btn"
      onclick={() => onclaim?.(caseId)}
      aria-label="Claim this operation"
    >⊕ CLAIM OPERATION</button>
  </div>

</div>
{/if}

<style>
  /* ── backdrop ─────────────────────────────────────────────────── */
  .dossier-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(6, 6, 8, 0.78);
    backdrop-filter: blur(2px);
    z-index: 200;
    cursor: pointer;
  }

  /* ── panel ────────────────────────────────────────────────────── */
  .dossier-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 210;
    width: min(94vw, 1120px);
    max-height: 92dvh;
    display: flex;
    flex-direction: column;
    background: #0e0f14;
    border: 1px solid #2c2f3a;
    box-shadow:
      0 0 0 1px #00ff8810,
      0 40px 120px -20px rgba(0, 0, 0, 0.9),
      0 0 80px -30px #00ff8830;
    font-family: var(--font-mono, 'Spline Sans Mono', ui-monospace, monospace);
    color: #f2f1ea;
    overflow: hidden;
  }

  /* HUD corner brackets */
  .ds-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: #00ff8855;
    border-style: solid;
    pointer-events: none;
    z-index: 5;
  }
  .ds-tl { top: 5px;    left: 5px;    border-width: 1.5px 0 0 1.5px; }
  .ds-br { bottom: 5px; right: 5px; border-width: 0 1.5px 1.5px 0; }

  /* ── header ───────────────────────────────────────────────────── */
  .ds-header {
    position: relative;
    flex-shrink: 0;
    padding: 22px 28px 18px;
    border-bottom: 1px solid #20222b;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: linear-gradient(180deg, #0c0d12 0%, #0a0b10 100%);
  }

  .ds-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7a818d;
  }
  .ds-mark   { color: #00ff88; font-size: 12px; }
  .ds-sep    { color: #343843; }
  .ds-case-id { color: #ffd23f; font-weight: 600; }

  .ds-title {
    font-size: clamp(22px, 2.8vw, 32px);
    font-weight: 600;
    color: #f2f1ea;
    letter-spacing: 0.005em;
    line-height: 1.18;
    margin: 0;
    padding-right: 40px; /* room for close btn */
    text-shadow: 0 0 30px #00ff8814;
  }

  .ds-tags {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .ds-tag {
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border: 1px solid;
    padding: 4px 10px;
    font-weight: 600;
  }

  .ds-status {
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7a818d;
    border: 1px solid #20222b;
    padding: 4px 10px;
  }
  .ds-status.ds-status-assigned {
    color: #00ff88;
    border-color: #00ff8844;
  }

  .ds-close {
    position: absolute;
    top: 18px;
    right: 20px;
    background: none;
    border: 1px solid #20222b;
    color: #7a818d;
    font-size: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: inherit;
    transition: color 0.2s, border-color 0.2s;
  }
  .ds-close:hover { color: #f2f1ea; border-color: #f2f1ea44; }

  /* ── body ─────────────────────────────────────────────────────── */
  .ds-body {
    display: grid;
    grid-template-columns: 1fr 236px;
    gap: 0;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .ds-main {
    padding: 24px 28px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
    scrollbar-width: thin;
    scrollbar-color: #2c2f3a #0e0f14;
    border-right: 1px solid #20222b;
  }
  .ds-main::-webkit-scrollbar { width: 6px; }
  .ds-main::-webkit-scrollbar-track { background: #0e0f14; }
  .ds-main::-webkit-scrollbar-thumb { background: #2c2f3a; border-radius: 3px; }

  /* ── sections ─────────────────────────────────────────────────── */
  .ds-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ds-section-hd {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #a7ada3;
    margin: 0;
    padding-bottom: 9px;
    border-bottom: 1px solid #1c1e26;
  }

  .ds-sec-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: 1px solid #2c2f3a;
    border-radius: 3px;
    color: #00ff88;
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
  }

  /* PUBLIC DATA SOURCE */
  .ds-source-card {
    background: #060608;
    border: 1px solid #20222b;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ds-source-link {
    font-size: 16px;
    font-weight: 600;
    color: #00ff88;
    text-decoration: none;
    letter-spacing: 0.01em;
    transition: color 0.2s;
  }
  .ds-source-link:hover { color: #80ffbb; text-decoration: underline; }

  .ds-source-contains {
    font-size: 14px;
    color: #a7ada3;
    line-height: 1.6;
    letter-spacing: 0.01em;
    margin: 0;
  }

  /* BRIEFING */
  .ds-briefing {
    font-size: 15px;
    color: #f2f1ea;
    line-height: 1.7;
    letter-spacing: 0.005em;
    border-left: 2px solid #00ff8855;
    padding-left: 16px;
    margin: 0;
  }

  /* METHOD steps */
  .ds-method-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ds-method-item {
    display: grid;
    grid-template-columns: 28px 1fr 24px;
    gap: 14px;
    align-items: start;
    padding: 13px 0;
    border-bottom: 1px solid #1c1e26;
  }
  .ds-method-item:last-child { border-bottom: none; }

  .ds-method-num {
    font-size: 14px;
    color: #4a4f5c;
    letter-spacing: 0.08em;
    padding-top: 1px;
  }
  .ds-method-done .ds-method-num { color: #00ff8888; }

  .ds-method-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ds-method-label {
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .ds-method-done .ds-method-label  { color: #00ff88; }
  .ds-method-pending .ds-method-label { color: #c4c9d0; }

  .ds-method-desc {
    font-size: 13.5px;
    color: #7a818d;
    letter-spacing: 0.01em;
    line-height: 1.5;
  }
  .ds-method-done .ds-method-desc { color: #a7ada3; }

  .ds-method-state {
    font-size: 15px;
    padding-top: 1px;
    text-align: right;
  }
  .ds-method-done    .ds-method-state { color: #00ff88; }
  .ds-method-pending .ds-method-state { color: #4a4f5c; }

  /* UNCERTAINTY */
  .ds-uncertainty {
    font-size: 13.5px;
    color: #ffd23f;
    background: #ffd23f0d;
    border: 1px solid #ffd23f2e;
    padding: 14px 16px;
    line-height: 1.65;
    letter-spacing: 0.005em;
    margin: 0;
  }

  /* ── side ─────────────────────────────────────────────────────── */
  .ds-side {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    overflow-y: auto;
    background: #0b0c10;
    scrollbar-width: thin;
    scrollbar-color: #2c2f3a #0b0c10;
  }
  .ds-side::-webkit-scrollbar { width: 6px; }
  .ds-side::-webkit-scrollbar-track { background: #0b0c10; }
  .ds-side::-webkit-scrollbar-thumb { background: #2c2f3a; border-radius: 3px; }

  .ds-meta-block {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ds-meta-label {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #5a606c;
  }

  .ds-meta-val {
    font-size: 13.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #d4d8dc;
    font-weight: 600;
  }
  .ds-meta-id   { color: #ffd23f; }
  .ds-meta-done { color: #00ff88; }
  .ds-meta-assigned { color: #00ff88; }

  .ds-meta-source-link {
    font-size: 13px;
    letter-spacing: 0.12em;
    color: #00ff88;
    text-decoration: none;
    font-weight: 600;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .ds-meta-source-link:hover { color: #80ffbb; }

  .ds-meta-divider {
    height: 1px;
    background: #20222b;
    margin: 4px 0;
  }

  /* ── footer / CTA ─────────────────────────────────────────────── */
  .ds-footer {
    flex-shrink: 0;
    padding: 18px 28px;
    border-top: 1px solid #20222b;
    background: linear-gradient(0deg, #0c0d12 0%, #0a0b10 100%);
  }

  .ds-claim-btn {
    display: block;
    width: 100%;
    padding: 16px 24px;
    background: transparent;
    border: 1.5px solid #00ff88;
    color: #00ff88;
    font-family: var(--font-mono, 'Spline Sans Mono', ui-monospace, monospace);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 16px #00ff8822, inset 0 0 16px #00ff8808;
  }
  .ds-claim-btn:hover {
    background: #00ff8814;
    box-shadow: 0 0 28px #00ff8855, inset 0 0 22px #00ff8814;
  }
  .ds-claim-btn:active {
    background: #00ff8822;
  }

  /* ── reduced motion ───────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .ds-claim-btn { transition: none; }
  }
</style>
