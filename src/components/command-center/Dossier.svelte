<script lang="ts">
  // src/components/command-center/Dossier.svelte
  // Case Dossier overlay — shows real data only. No fabricated metrics.
  // Real: case question, public source (title/url/contains), briefing, method steps, uncertainty.
  // FIRST_OPERATION.briefing is used for lobby-register-de; other cases use their hook.

  import { getCase } from '../../lib/line-g-opening/cases'
  import { FIRST_OPERATION } from '../../lib/command-center/operations'

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
  const isAssigned = $derived(caseId === FIRST_OPERATION.caseId)
  const briefing = $derived(
    isAssigned ? FIRST_OPERATION.briefing : (cas?.hook ?? '')
  )

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
</script>

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
    background: rgba(6, 6, 8, 0.72);
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
    width: min(92vw, 1020px);
    max-height: 90dvh;
    display: flex;
    flex-direction: column;
    background: #0e0f14;
    border: 1px solid #2c2f3a;
    font-family: var(--font-mono, 'Spline Sans Mono', ui-monospace, monospace);
    color: #f2f1ea;
    overflow: hidden;
  }

  /* HUD corner brackets */
  .ds-corner {
    position: absolute;
    width: 12px;
    height: 12px;
    border-color: #00ff8855;
    border-style: solid;
    pointer-events: none;
    z-index: 5;
  }
  .ds-tl { top: 4px;    left: 4px;    border-width: 1.5px 0 0 1.5px; }
  .ds-br { bottom: 4px; right: 4px; border-width: 0 1.5px 1.5px 0; }

  /* ── header ───────────────────────────────────────────────────── */
  .ds-header {
    position: relative;
    flex-shrink: 0;
    padding: 14px 16px 12px;
    border-bottom: 1px solid #20222b;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #0a0b10;
  }

  .ds-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 8px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7a818d;
  }
  .ds-mark   { color: #00ff88; font-size: 10px; }
  .ds-sep    { color: #20222b; }
  .ds-case-id { color: #ffd23f; font-weight: 600; }

  .ds-title {
    font-size: clamp(13px, 2vw, 18px);
    font-weight: 600;
    color: #f2f1ea;
    letter-spacing: 0.02em;
    line-height: 1.3;
    margin: 0;
    padding-right: 32px; /* room for close btn */
  }

  .ds-tags {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ds-tag {
    font-size: 8px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    border: 1px solid;
    padding: 2px 7px;
    font-weight: 600;
  }

  .ds-status {
    font-size: 8px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7a818d;
    border: 1px solid #20222b;
    padding: 2px 7px;
  }
  .ds-status.ds-status-assigned {
    color: #00ff88;
    border-color: #00ff8844;
  }

  .ds-close {
    position: absolute;
    top: 12px;
    right: 14px;
    background: none;
    border: 1px solid #20222b;
    color: #7a818d;
    font-size: 13px;
    width: 26px;
    height: 26px;
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
    grid-template-columns: 1fr 180px;
    gap: 0;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .ds-main {
    padding: 14px 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    scrollbar-width: thin;
    scrollbar-color: #20222b #0e0f14;
    border-right: 1px solid #20222b;
  }
  .ds-main::-webkit-scrollbar { width: 4px; }
  .ds-main::-webkit-scrollbar-track { background: #0e0f14; }
  .ds-main::-webkit-scrollbar-thumb { background: #20222b; border-radius: 2px; }

  /* ── sections ─────────────────────────────────────────────────── */
  .ds-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ds-section-hd {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 8px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #7a818d;
    margin: 0;
    padding-bottom: 6px;
    border-bottom: 1px solid #13141a;
  }

  .ds-sec-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid #20222b;
    border-radius: 2px;
    color: #00ff88;
    font-size: 8px;
    font-weight: 600;
    flex-shrink: 0;
  }

  /* PUBLIC DATA SOURCE */
  .ds-source-card {
    background: #060608;
    border: 1px solid #20222b;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ds-source-link {
    font-size: 10px;
    font-weight: 600;
    color: #00ff88;
    text-decoration: none;
    letter-spacing: 0.06em;
    transition: color 0.2s;
  }
  .ds-source-link:hover { color: #80ffbb; text-decoration: underline; }

  .ds-source-contains {
    font-size: 9px;
    color: #a7ada3;
    line-height: 1.55;
    letter-spacing: 0.02em;
    margin: 0;
  }

  /* BRIEFING */
  .ds-briefing {
    font-size: 10px;
    color: #f2f1ea;
    line-height: 1.65;
    letter-spacing: 0.025em;
    border-left: 2px solid #00ff8844;
    padding-left: 10px;
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
    grid-template-columns: 20px 1fr 20px;
    gap: 8px;
    align-items: start;
    padding: 7px 0;
    border-bottom: 1px solid #13141a;
  }
  .ds-method-item:last-child { border-bottom: none; }

  .ds-method-num {
    font-size: 8px;
    color: #343843;
    letter-spacing: 0.1em;
    padding-top: 1px;
  }

  .ds-method-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ds-method-label {
    font-size: 8.5px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .ds-method-done .ds-method-label  { color: #00ff88; }
  .ds-method-pending .ds-method-label { color: #7a818d; }

  .ds-method-desc {
    font-size: 8px;
    color: #7a818d;
    letter-spacing: 0.03em;
    line-height: 1.45;
  }
  .ds-method-done .ds-method-desc { color: #a7ada3; }

  .ds-method-state {
    font-size: 10px;
    padding-top: 1px;
    text-align: right;
  }
  .ds-method-done    .ds-method-state { color: #00ff88; }
  .ds-method-pending .ds-method-state { color: #343843; }

  /* UNCERTAINTY */
  .ds-uncertainty {
    font-size: 9px;
    color: #ffd23f;
    background: #ffd23f0a;
    border: 1px solid #ffd23f22;
    padding: 10px 12px;
    line-height: 1.6;
    letter-spacing: 0.025em;
    margin: 0;
  }

  /* ── side ─────────────────────────────────────────────────────── */
  .ds-side {
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #20222b #0e0f14;
  }
  .ds-side::-webkit-scrollbar { width: 4px; }
  .ds-side::-webkit-scrollbar-track { background: #0e0f14; }
  .ds-side::-webkit-scrollbar-thumb { background: #20222b; border-radius: 2px; }

  .ds-meta-block {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .ds-meta-label {
    font-size: 7px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #343843;
  }

  .ds-meta-val {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #a7ada3;
    font-weight: 600;
  }
  .ds-meta-id   { color: #ffd23f; }
  .ds-meta-done { color: #00ff88; }
  .ds-meta-assigned { color: #00ff88; }

  .ds-meta-source-link {
    font-size: 9px;
    letter-spacing: 0.14em;
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
    margin: 2px 0;
  }

  /* ── footer / CTA ─────────────────────────────────────────────── */
  .ds-footer {
    flex-shrink: 0;
    padding: 12px 16px;
    border-top: 1px solid #20222b;
    background: #0a0b10;
  }

  .ds-claim-btn {
    display: block;
    width: 100%;
    padding: 11px 20px;
    background: transparent;
    border: 1.5px solid #00ff88;
    color: #00ff88;
    font-family: var(--font-mono, 'Spline Sans Mono', ui-monospace, monospace);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 12px #00ff8822, inset 0 0 12px #00ff8808;
  }
  .ds-claim-btn:hover {
    background: #00ff8812;
    box-shadow: 0 0 22px #00ff8844, inset 0 0 18px #00ff8812;
  }
  .ds-claim-btn:active {
    background: #00ff8820;
  }

  /* ── reduced motion ───────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .ds-claim-btn { transition: none; }
  }
</style>
