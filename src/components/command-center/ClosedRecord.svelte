<script lang="ts">
  // src/components/command-center/ClosedRecord.svelte
  // Read-only review of a closed operation — the on-device record of a finding whose
  // METHOD GHOST certified. Reachable by clicking a tag in the CLOSED CASES ledger.
  // Shows exactly what the agent submitted; re-states "certified, not verified".

  import { getCase } from '../../lib/line-g-opening/cases'
  import type { ClosedOperation } from '../../lib/command-center/history'

  let { op, onclose }: { op: ClosedOperation; onclose: () => void } = $props()

  const cas = $derived(getCase(op.caseId))

  function fmt(iso: string): string {
    // ISO → "2026-06-26 · 01:12 UTC" (honest: this is when the agent closed it)
    if (!iso) return '—'
    const d = iso.slice(0, 10)
    const t = iso.slice(11, 16)
    return `${d} · ${t} UTC`
  }

  function handleWindowKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose()
  }
</script>

<svelte:window onkeydown={handleWindowKey} />

<div
  class="cr-backdrop"
  onclick={onclose}
  role="presentation"
  aria-hidden="true"
></div>

<div class="cr-panel" role="dialog" aria-modal="true" aria-label="Closed record: {op.codename}">
  <div class="cr-corner cr-tl" aria-hidden="true"></div>
  <div class="cr-corner cr-br" aria-hidden="true"></div>

  <header class="cr-header">
    <span class="cr-breadcrumb">
      <span class="cr-mark">◢</span> CLOSED RECORD
      <span class="cr-sep">·</span>
      <span class="cr-case-id">{op.caseId.toUpperCase()}</span>
    </span>
    <button class="cr-close" onclick={onclose} aria-label="Close record">✕</button>
  </header>

  <div class="cr-body">
    <div class="cr-hero">
      <span class="cr-badge">✓ METHOD CERTIFIED</span>
      <h2 class="cr-codename">OPERATION {op.codename}</h2>
      <span class="cr-stamp">CLOSED {fmt(op.certifiedAt)}</span>
    </div>

    <section class="cr-field">
      <span class="cr-lbl">QUESTION</span>
      <p class="cr-question">{op.finding.question}</p>
    </section>

    <section class="cr-field">
      <span class="cr-lbl">PUBLIC SOURCE</span>
      <a class="cr-source" href={op.finding.sourceUrl} target="_blank" rel="noopener noreferrer">
        {cas?.source.title ?? op.finding.sourceUrl} ↗
      </a>
    </section>

    <section class="cr-field">
      <span class="cr-lbl">FINDING</span>
      <p class="cr-text">{op.finding.evidence}</p>
    </section>

    <section class="cr-field">
      <span class="cr-lbl">STATED UNCERTAINTY</span>
      <p class="cr-text cr-text-amber">{op.finding.uncertainty}</p>
    </section>

    <div class="cr-honesty">
      Method certified — <strong>not</strong> fact-verified. GHOST confirmed the craft, not the conclusion. This record stands or falls on your sources.
    </div>
  </div>

  <div class="cr-footer">
    <button class="cr-btn" onclick={onclose}>← BACK TO COMMAND</button>
  </div>
</div>

<style>
  .cr-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(6, 6, 8, 0.8);
    backdrop-filter: blur(3px);
    z-index: 220;
    cursor: pointer;
  }
  .cr-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 230;
    width: min(94vw, 640px);
    max-height: 90dvh;
    display: flex;
    flex-direction: column;
    background: #0e0f14;
    border: 1px solid #2c2f3a;
    box-shadow: 0 0 0 1px #00ff8810, 0 40px 120px -20px rgba(0,0,0,0.9), 0 0 80px -30px #00ff8830;
    font-family: var(--font-mono, 'Spline Sans Mono', ui-monospace, monospace);
    color: #f2f1ea;
    overflow: hidden;
  }
  .cr-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: #00ff8855;
    border-style: solid;
    pointer-events: none;
    z-index: 5;
  }
  .cr-tl { top: 5px; left: 5px; border-width: 1.5px 0 0 1.5px; }
  .cr-br { bottom: 5px; right: 5px; border-width: 0 1.5px 1.5px 0; }

  .cr-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 16px 22px;
    border-bottom: 1px solid #20222b;
    background: linear-gradient(180deg, #0c0d12, #0a0b10);
  }
  .cr-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7a818d;
  }
  .cr-mark { color: #00ff88; }
  .cr-sep { color: #343843; }
  .cr-case-id { color: #ffd23f; font-weight: 600; }
  .cr-close {
    margin-left: auto;
    background: none;
    border: 1px solid #20222b;
    color: #7a818d;
    font-size: 15px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: inherit;
    transition: color 0.2s, border-color 0.2s;
  }
  .cr-close:hover { color: #f2f1ea; border-color: #f2f1ea44; }

  .cr-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    scrollbar-width: thin;
    scrollbar-color: #2c2f3a #0e0f14;
  }
  .cr-body::-webkit-scrollbar { width: 6px; }
  .cr-body::-webkit-scrollbar-thumb { background: #2c2f3a; border-radius: 3px; }

  .cr-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding-bottom: 4px;
  }
  .cr-badge {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    color: #00ff88;
    border: 1px solid #00ff8855;
    padding: 5px 14px;
    background: #00ff880d;
  }
  .cr-codename {
    font-size: clamp(20px, 2.6vw, 26px);
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #f2f1ea;
    margin: 0;
    text-shadow: 0 0 30px #00ff8822;
  }
  .cr-stamp {
    font-size: 11px;
    letter-spacing: 0.14em;
    color: #5a606c;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
  }

  .cr-field { display: flex; flex-direction: column; gap: 6px; }
  .cr-lbl {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7a818d;
  }
  .cr-question {
    font-size: 15px;
    line-height: 1.5;
    color: #f2f1ea;
    border-left: 2px solid #00ff8855;
    padding-left: 12px;
  }
  .cr-source {
    font-size: 14px;
    font-weight: 600;
    color: #00ff88;
    text-decoration: none;
    transition: color 0.2s;
  }
  .cr-source:hover { color: #80ffbb; text-decoration: underline; }
  .cr-text {
    font-size: 14px;
    line-height: 1.6;
    color: #c4c9d0;
  }
  .cr-text-amber { color: #d8c890; }

  .cr-honesty {
    font-size: 12.5px;
    color: #ffd23f;
    background: #ffd23f0d;
    border: 1px solid #ffd23f2e;
    padding: 12px 16px;
    line-height: 1.6;
  }
  .cr-honesty strong { color: #ffe98a; }

  .cr-footer {
    flex-shrink: 0;
    padding: 16px 22px;
    border-top: 1px solid #20222b;
    background: linear-gradient(0deg, #0c0d12, #0a0b10);
  }
  .cr-btn {
    width: 100%;
    background: transparent;
    border: 1px solid #2c2f3a;
    color: #a7ada3;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 12px;
    cursor: pointer;
    transition: border-color 0.18s, color 0.18s;
  }
  .cr-btn:hover { border-color: #7a818d; color: #f2f1ea; }
</style>
