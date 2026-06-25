<script lang="ts">
  // src/components/command-center/Investigation.svelte
  // The OPERATION LOOP: claim → locate source → draft finding → GHOST certifies the
  // METHOD (never the truth) → operation closes → enters the on-device record.
  // Drives the flow.ts state machine; persists via history.ts; certifies via /api/certify.
  //
  // HONESTY: GHOST certifies that the METHOD is sound (real source cited, finding
  // specific, uncertainty named). It NEVER certifies that the claim is factually true.
  // Every line of copy here holds that line.

  import { getCase } from '../../lib/line-g-opening/cases'
  import { FIRST_OPERATION } from '../../lib/command-center/operations'
  import { preCheck, type Finding } from '../../lib/command-center/certify'
  import { recordClosed } from '../../lib/command-center/history'
  import {
    initialOp,
    toSource,
    toDraft,
    submit,
    applyVerdict,
    back,
    type OperationState,
  } from '../../lib/command-center/flow'

  let {
    caseId,
    onclose,
    onclosed,
  }: {
    caseId: string
    onclose: () => void
    onclosed?: (id: string) => void
  } = $props()

  const sigColor: Record<string, string> = {
    tracking: '#00ffff',
    money: '#ffd23f',
    feed: '#ff2af0',
    future: '#aa44ff',
    unsure: '#7a818d',
  }

  // ── resolve the operation for ANY case (first op is fully scripted; others
  //    derive their question/source from the launchpad case) ─────────────────
  function operationFor(id: string) {
    const c = getCase(id)
    if (!c) return null
    if (id === FIRST_OPERATION.caseId) {
      return {
        signal: FIRST_OPERATION.signal as string,
        briefing: FIRST_OPERATION.briefing,
        question: FIRST_OPERATION.question,
        source: FIRST_OPERATION.source,
      }
    }
    return {
      signal: c.systemSignal as string,
      briefing: c.hook,
      question: c.starterQuestion,
      source: { title: c.source.title, url: c.source.url, howTo: c.source.contains },
    }
  }

  const operation = operationFor(caseId)

  // ── state machine ──────────────────────────────────────────────────────────
  let op = $state<OperationState>(initialOp(caseId))

  // ── finding form (local; snapshotted into op on submit) ────────────────────
  let fQuestion = $state(operation?.question ?? '')
  let fSourceUrl = $state(operation?.source.url ?? '')
  let fEvidence = $state('')
  let fUncertainty = $state('')

  const finding = $derived<Finding>({
    question: fQuestion,
    sourceUrl: fSourceUrl,
    evidence: fEvidence,
    uncertainty: fUncertainty,
  })
  const check = $derived(preCheck(finding))

  // ── certification result ───────────────────────────────────────────────────
  type Verdict = { certified: boolean; feedback: string; notes: { source: boolean; specificity: boolean; uncertainty: boolean } }
  let verdict = $state<Verdict | null>(null)
  let certError = $state<string | null>(null)
  let closedCodename = $state<string | null>(null)
  let closedAt = $state<string | null>(null)

  // ── progress rail (4 visible stages mapped from the 5 flow steps) ──────────
  const RAIL = ['QUESTION', 'DATA', 'EVIDENCE', 'CERTIFY'] as const
  const railIndex = $derived(
    op.step === 'briefing' ? 0 : op.step === 'source' ? 1 : op.step === 'draft' ? 2 : 3,
  )

  // ── codename: stable per case, evocative, NOT data — just a field label ────
  const CODEWORDS = [
    'VANTAGE', 'LEDGER', 'DRAGNET', 'PLUMBLINE', 'TALLY', 'BEACON', 'QUARRY',
    'THRESHER', 'LANTERN', 'CIPHER', 'KEYSTONE', 'WATCHTOWER', 'UNDERTOW',
    'GRIDIRON', 'BACKSTOP', 'LODESTAR', 'HALLMARK', 'FOOTHOLD',
  ]
  function codenameFor(id: string): string {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
    return CODEWORDS[h % CODEWORDS.length]
  }

  // ── transitions ────────────────────────────────────────────────────────────
  function begin() { op = toSource(op) }
  function pulledData() { op = toDraft(op) }

  let busy = $state(false)
  async function runCertification() {
    if (!check.ok || busy) return
    busy = true
    certError = null
    verdict = null
    op = submit(op) // → certifying
    try {
      const res = await fetch('/api/certify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ finding, operation: { question: operation?.question } }),
      })
      if (res.status === 200) {
        const v = (await res.json()) as Verdict
        verdict = v
        op = applyVerdict(op, v.certified) // certified → closed, else → draft
        if (v.certified) finalizeClose()
      } else if (res.status === 429) {
        certError = 'Rate limit reached — GHOST needs a minute. Your draft is intact.'
        op = applyVerdict(op, false)
      } else if (res.status === 503) {
        certError = 'GHOST certification runs server-side and is offline right now. Your draft is intact.'
        op = applyVerdict(op, false)
      } else {
        certError = 'Certification failed to complete. Your draft is intact — try again.'
        op = applyVerdict(op, false)
      }
    } catch {
      certError = 'Could not reach GHOST. Check your connection — your draft is intact.'
      op = applyVerdict(op, false)
    } finally {
      busy = false
    }
  }

  function finalizeClose() {
    const f: Finding = { ...finding }
    const codename = codenameFor(caseId)
    const certifiedAt = new Date().toISOString()
    recordClosed({ caseId, finding: f, certifiedAt, codename })
    closedCodename = codename
    closedAt = certifiedAt
    onclosed?.(caseId)
  }

  function handleBackdropKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose()
  }
  function reviseDraft() { op = back(op) } // certifying-error landed us in draft already; this is a no-op guard
</script>

<div
  class="iv-backdrop"
  onclick={onclose}
  onkeydown={handleBackdropKey}
  role="presentation"
  aria-hidden="true"
></div>

{#if operation}
<div class="iv-panel" role="dialog" aria-modal="true" aria-label="Operation: {operation.question}">
  <div class="iv-corner iv-tl" aria-hidden="true"></div>
  <div class="iv-corner iv-br" aria-hidden="true"></div>

  <!-- ── header + progress rail ─────────────────────────────────── -->
  <header class="iv-header">
    <div class="iv-head-top">
      <span class="iv-breadcrumb">
        <span class="iv-mark">◢</span> OPERATION
        <span class="iv-sep">·</span>
        <span class="iv-op-id">{caseId.toUpperCase()}</span>
      </span>
      <span class="iv-signal" style="color: {sigColor[operation.signal] ?? '#7a818d'}; border-color: {(sigColor[operation.signal] ?? '#7a818d')}55">
        {operation.signal.toUpperCase()}
      </span>
      <button class="iv-close" onclick={onclose} aria-label="Close operation">✕</button>
    </div>

    <div class="iv-rail" aria-label="Operation progress">
      {#each RAIL as stage, i}
        <div
          class="rail-node"
          class:rail-done={i < railIndex || op.step === 'closed'}
          class:rail-active={i === railIndex && op.step !== 'closed'}
        >
          <span class="rail-dot" aria-hidden="true">
            {#if i < railIndex || op.step === 'closed'}✓{:else}{i + 1}{/if}
          </span>
          <span class="rail-lbl">{stage}</span>
        </div>
        {#if i < RAIL.length - 1}
          <span class="rail-link" class:rail-link-done={i < railIndex || op.step === 'closed'} aria-hidden="true"></span>
        {/if}
      {/each}
    </div>
  </header>

  <!-- ── body ───────────────────────────────────────────────────── -->
  <div class="iv-body">

    <!-- STEP 1 · BRIEFING / QUESTION -->
    {#if op.step === 'briefing'}
      <div class="iv-step">
        <div class="ghost-line">
          <span class="ghost-tag">GHOST</span>
          <p>Operation claimed. Before you touch the data — hold the question. A vague feeling is a poor witness. This is what you're here to make visible:</p>
        </div>
        <h1 class="iv-question">{operation.question}</h1>
        <p class="iv-briefing">{operation.briefing}</p>
        <div class="iv-actions">
          <button class="iv-btn iv-btn-primary" onclick={begin}>BEGIN → LOCATE THE SOURCE</button>
        </div>
      </div>

    <!-- STEP 2 · DATA / SOURCE -->
    {:else if op.step === 'source'}
      <div class="iv-step">
        <div class="ghost-line">
          <span class="ghost-tag">GHOST</span>
          <p>Step 2 — <strong>DATA</strong>. I don't pull it for you; you do. That's the whole point. Open the real source, find one concrete entry, then come back and draft it.</p>
        </div>
        <div class="iv-source-card">
          <span class="src-label">PUBLIC SOURCE</span>
          <a class="src-link" href={operation.source.url} target="_blank" rel="noopener noreferrer">
            {operation.source.title} ↗
          </a>
          <p class="src-how">{operation.source.howTo}</p>
        </div>
        <div class="iv-actions iv-actions-split">
          <button class="iv-btn iv-btn-ghost" onclick={() => (op = back(op))}>← BACK</button>
          <button class="iv-btn iv-btn-primary" onclick={pulledData}>I'VE PULLED THE DATA → DRAFT</button>
        </div>
      </div>

    <!-- STEP 3 · EVIDENCE / DRAFT -->
    {:else if op.step === 'draft'}
      <div class="iv-step">
        <div class="ghost-line">
          <span class="ghost-tag">GHOST</span>
          <p>Step 3 — <strong>EVIDENCE</strong>. One specific finding. Cite where it came from. Name what you can't yet prove. I certify the <em>method</em>, not the truth — the claim stays yours.</p>
        </div>

        {#if verdict && !verdict.certified}
          <div class="iv-verdict-fail" role="status">
            <span class="vf-mark">✕ METHOD NOT YET CERTIFIED</span>
            <p class="vf-feedback">{verdict.feedback}</p>
            <div class="vf-notes">
              <span class="vf-note" class:vf-ok={verdict.notes.source}>SOURCE {verdict.notes.source ? '✓' : '✕'}</span>
              <span class="vf-note" class:vf-ok={verdict.notes.specificity}>SPECIFIC {verdict.notes.specificity ? '✓' : '✕'}</span>
              <span class="vf-note" class:vf-ok={verdict.notes.uncertainty}>UNCERTAINTY {verdict.notes.uncertainty ? '✓' : '✕'}</span>
            </div>
          </div>
        {/if}

        {#if certError}
          <div class="iv-cert-error" role="status">{certError}</div>
        {/if}

        <div class="iv-form">
          <label class="fld">
            <span class="fld-lbl">QUESTION</span>
            <input class="fld-in" bind:value={fQuestion} placeholder="The precise question you are answering" />
          </label>
          <label class="fld">
            <span class="fld-lbl">SOURCE URL</span>
            <input class="fld-in" bind:value={fSourceUrl} placeholder="https://… the exact public source" />
          </label>
          <label class="fld">
            <span class="fld-lbl">YOUR FINDING <span class="fld-hint">— one concrete, traceable fact</span></span>
            <textarea class="fld-ta" rows="3" bind:value={fEvidence} placeholder="e.g. Acme Verband declared the 4.5–5.0M € band, 18 staff, targeting energy policy."></textarea>
          </label>
          <label class="fld">
            <span class="fld-lbl">WHAT'S UNVERIFIED <span class="fld-hint">— what could be wrong, self-declared, out of date</span></span>
            <textarea class="fld-ta" rows="2" bind:value={fUncertainty} placeholder="e.g. The figure is a self-declared range, not audited."></textarea>
          </label>
        </div>

        <div class="iv-checklist" aria-hidden="true">
          <span class="ck" class:ck-ok={!check.missing.includes('question')}>QUESTION</span>
          <span class="ck" class:ck-ok={!check.missing.includes('source')}>SOURCE</span>
          <span class="ck" class:ck-ok={!check.missing.includes('specificity')}>SPECIFIC</span>
          <span class="ck" class:ck-ok={!check.missing.includes('uncertainty')}>UNCERTAINTY</span>
        </div>

        <div class="iv-actions iv-actions-split">
          <button class="iv-btn iv-btn-ghost" onclick={() => (op = back(op))}>← BACK</button>
          <button class="iv-btn iv-btn-primary" disabled={!check.ok || busy} onclick={runCertification}>
            SUBMIT FOR CERTIFICATION →
          </button>
        </div>
      </div>

    <!-- STEP 4 · CERTIFYING -->
    {:else if op.step === 'certifying'}
      <div class="iv-step iv-step-center">
        <div class="cert-pulse" aria-hidden="true"></div>
        <span class="cert-title">GHOST IS CHECKING YOUR METHOD</span>
        <span class="cert-sub">Source cited? Finding specific? Uncertainty named? — not whether it's true.</span>
      </div>

    <!-- STEP 5 · CLOSED -->
    {:else if op.step === 'closed'}
      <div class="iv-step iv-step-center">
        <span class="closed-badge">✓ METHOD CERTIFIED</span>
        <h2 class="closed-codename">OPERATION {closedCodename}</h2>
        <p class="closed-question">{fQuestion}</p>
        {#if verdict?.feedback}
          <p class="closed-feedback">“{verdict.feedback}”</p>
        {/if}
        <div class="closed-honesty">
          Method certified — <strong>not</strong> fact-verified. GHOST confirmed your craft, not your conclusion. The claim is yours to stand behind.
        </div>
        <div class="iv-actions">
          <button class="iv-btn iv-btn-primary" onclick={onclose}>RETURN TO COMMAND →</button>
        </div>
      </div>
    {/if}

  </div>
</div>
{/if}

<style>
  .iv-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(6, 6, 8, 0.82);
    backdrop-filter: blur(3px);
    z-index: 220;
    cursor: pointer;
  }

  .iv-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 230;
    width: min(94vw, 760px);
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

  .iv-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: #00ff8855;
    border-style: solid;
    pointer-events: none;
    z-index: 5;
  }
  .iv-tl { top: 5px; left: 5px; border-width: 1.5px 0 0 1.5px; }
  .iv-br { bottom: 5px; right: 5px; border-width: 0 1.5px 1.5px 0; }

  /* ── header ─────────────────────────────────────────────────── */
  .iv-header {
    flex-shrink: 0;
    padding: 18px 24px 16px;
    border-bottom: 1px solid #20222b;
    background: linear-gradient(180deg, #0c0d12, #0a0b10);
  }
  .iv-head-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .iv-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7a818d;
  }
  .iv-mark { color: #00ff88; }
  .iv-sep { color: #343843; }
  .iv-op-id { color: #ffd23f; font-weight: 600; }
  .iv-signal {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
    border: 1px solid;
    padding: 3px 9px;
  }
  .iv-close {
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
  .iv-close:hover { color: #f2f1ea; border-color: #f2f1ea44; }

  /* progress rail */
  .iv-rail {
    display: flex;
    align-items: center;
    gap: 0;
  }
  .rail-node {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .rail-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1.5px solid #2c2f3a;
    color: #5a606c;
    font-size: 12px;
    font-weight: 600;
    background: #0b0c10;
  }
  .rail-lbl {
    font-size: 10.5px;
    letter-spacing: 0.14em;
    color: #5a606c;
    text-transform: uppercase;
  }
  .rail-link {
    flex: 1;
    height: 1.5px;
    background: #2c2f3a;
    margin: 0 10px;
    min-width: 14px;
  }
  .rail-link-done { background: #00ff8866; }
  .rail-active .rail-dot {
    border-color: #00ff88;
    color: #00ff88;
    box-shadow: 0 0 12px #00ff8855;
  }
  .rail-active .rail-lbl { color: #00ff88; }
  .rail-done .rail-dot {
    border-color: #00ff8866;
    color: #00ff88;
    background: #00ff880d;
  }
  .rail-done .rail-lbl { color: #a7ada3; }

  /* ── body ───────────────────────────────────────────────────── */
  .iv-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 22px 24px;
    scrollbar-width: thin;
    scrollbar-color: #2c2f3a #0e0f14;
  }
  .iv-body::-webkit-scrollbar { width: 6px; }
  .iv-body::-webkit-scrollbar-thumb { background: #2c2f3a; border-radius: 3px; }

  .iv-step { display: flex; flex-direction: column; gap: 18px; }
  .iv-step-center {
    align-items: center;
    text-align: center;
    justify-content: center;
    min-height: 280px;
    gap: 14px;
  }

  /* GHOST guidance line */
  .ghost-line {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    background: #00ff880a;
    border-left: 2px solid #00ff8866;
    padding: 12px 14px;
  }
  .ghost-tag {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: #00ff88;
    padding-top: 1px;
  }
  .ghost-line p {
    font-size: 13.5px;
    line-height: 1.6;
    color: #c4c9d0;
    letter-spacing: 0.005em;
  }
  .ghost-line strong { color: #00ff88; font-weight: 600; }
  .ghost-line em { color: #ffd23f; font-style: normal; }

  .iv-question {
    font-size: clamp(19px, 2.4vw, 25px);
    font-weight: 600;
    line-height: 1.25;
    color: #f2f1ea;
    margin: 0;
    text-shadow: 0 0 30px #00ff8814;
  }
  .iv-briefing {
    font-size: 14px;
    line-height: 1.7;
    color: #a7ada3;
    letter-spacing: 0.005em;
  }

  /* source card */
  .iv-source-card {
    background: #060608;
    border: 1px solid #20222b;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .src-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #5a606c;
  }
  .src-link {
    font-size: 17px;
    font-weight: 600;
    color: #00ff88;
    text-decoration: none;
    transition: color 0.2s;
  }
  .src-link:hover { color: #80ffbb; text-decoration: underline; }
  .src-how {
    font-size: 13.5px;
    color: #a7ada3;
    line-height: 1.6;
  }

  /* form */
  .iv-form { display: flex; flex-direction: column; gap: 14px; }
  .fld { display: flex; flex-direction: column; gap: 6px; }
  .fld-lbl {
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #7a818d;
  }
  .fld-hint {
    color: #5a606c;
    letter-spacing: 0.02em;
    text-transform: none;
    font-size: 11px;
  }
  .fld-in, .fld-ta {
    background: #060608;
    border: 1px solid #2c2f3a;
    color: #f2f1ea;
    font-family: inherit;
    font-size: 13.5px;
    line-height: 1.55;
    padding: 10px 12px;
    width: 100%;
    resize: vertical;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .fld-in:focus, .fld-ta:focus {
    outline: none;
    border-color: #00ff8888;
    box-shadow: 0 0 0 1px #00ff8833;
  }
  .fld-in::placeholder, .fld-ta::placeholder { color: #4a4f5c; }

  /* live checklist */
  .iv-checklist { display: flex; gap: 8px; flex-wrap: wrap; }
  .ck {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5a606c;
    border: 1px solid #20222b;
    padding: 3px 9px;
    border-radius: 1px;
  }
  .ck::before { content: '○ '; }
  .ck-ok {
    color: #00ff88;
    border-color: #00ff8844;
    background: #00ff8808;
  }
  .ck-ok::before { content: '✓ '; }

  /* verdict-fail block */
  .iv-verdict-fail {
    background: #ff2a2a0a;
    border: 1px solid #ff5a5a33;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .vf-mark {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: #ff7a7a;
  }
  .vf-feedback { font-size: 13.5px; line-height: 1.6; color: #e8c4c4; }
  .vf-notes { display: flex; gap: 8px; flex-wrap: wrap; }
  .vf-note {
    font-size: 10px;
    letter-spacing: 0.12em;
    color: #ff7a7a;
    border: 1px solid #ff5a5a33;
    padding: 2px 8px;
  }
  .vf-note.vf-ok { color: #00ff88; border-color: #00ff8844; }

  .iv-cert-error {
    background: #ffd23f0d;
    border: 1px solid #ffd23f33;
    padding: 11px 14px;
    font-size: 13px;
    line-height: 1.55;
    color: #ffd23f;
  }

  /* certifying state */
  .cert-pulse {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #00ff88;
    box-shadow: 0 0 0 0 #00ff8855;
    animation: cert-ping 1.4s ease-out infinite;
  }
  @keyframes cert-ping {
    0% { box-shadow: 0 0 0 0 #00ff8855; opacity: 1; }
    100% { box-shadow: 0 0 0 26px #00ff8800; opacity: 0.6; }
  }
  .cert-title {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: #00ff88;
  }
  .cert-sub {
    font-size: 12.5px;
    color: #7a818d;
    line-height: 1.5;
    max-width: 380px;
  }

  /* closed state */
  .closed-badge {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2em;
    color: #00ff88;
    border: 1px solid #00ff8855;
    padding: 6px 16px;
    background: #00ff880d;
  }
  .closed-codename {
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #f2f1ea;
    margin: 0;
    text-shadow: 0 0 30px #00ff8822;
  }
  .closed-question {
    font-size: 14px;
    color: #a7ada3;
    line-height: 1.6;
    max-width: 480px;
  }
  .closed-feedback {
    font-size: 13px;
    color: #00ff88;
    font-style: italic;
    line-height: 1.55;
    max-width: 480px;
  }
  .closed-honesty {
    font-size: 12.5px;
    color: #ffd23f;
    background: #ffd23f0d;
    border: 1px solid #ffd23f2e;
    padding: 12px 16px;
    line-height: 1.6;
    max-width: 500px;
  }
  .closed-honesty strong { color: #ffe98a; }

  /* actions */
  .iv-actions { display: flex; gap: 12px; margin-top: 4px; }
  .iv-actions-split { justify-content: space-between; }
  .iv-btn {
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 13px 22px;
    cursor: pointer;
    transition: background 0.18s, box-shadow 0.18s, border-color 0.18s, opacity 0.18s;
  }
  .iv-btn-primary {
    flex: 1;
    background: transparent;
    border: 1.5px solid #00ff88;
    color: #00ff88;
    box-shadow: 0 0 16px #00ff8822, inset 0 0 16px #00ff8808;
  }
  .iv-btn-primary:hover:not(:disabled) {
    background: #00ff8814;
    box-shadow: 0 0 28px #00ff8855, inset 0 0 22px #00ff8814;
  }
  .iv-btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: #2c2f3a;
    color: #5a606c;
    box-shadow: none;
  }
  .iv-btn-ghost {
    background: transparent;
    border: 1px solid #2c2f3a;
    color: #7a818d;
  }
  .iv-btn-ghost:hover {
    border-color: #7a818d;
    color: #c4c9d0;
  }

  @media (prefers-reduced-motion: reduce) {
    .cert-pulse { animation: none; }
    .iv-btn { transition: none; }
  }
</style>
