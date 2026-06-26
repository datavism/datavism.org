<!-- src/components/line-g-opening/Descent.svelte
     Task 6 — "The Descent" — diegetic GHOST-conducted opening for Line G.
     Svelte 5 runes, client:load, prop: stationId.
     No screen-breaks. No "Lesson N of M". No GSAP.
     Visual target: terminal machine-room + one clean stamped case-file.
-->
<script lang="ts">
  import { onMount } from 'svelte'
  import { initialState, choosePath, pickLaunchpad, setSuspicion, setQuestion, isSeam, back } from '../../lib/line-g-opening/flow'
  import type { OpeningState } from '../../lib/line-g-opening/flow'
  import { LAUNCHPAD_CASES, terrainFor } from '../../lib/line-g-opening/cases'
  import { GHOST_LINES } from './ghost-script'
  import { newCardId, saveCard, clearDraft, saveDraft } from '../../lib/signal-cards/storage'
  import { suggestLines } from '../../lib/signal-cards/route-suggestions'
  import { SIGNAL_CARD_DISCLAIMER } from '../../lib/signal-cards/types'
  import type { SignalCard, SystemSignal } from '../../lib/signal-cards/types'
  import { toMarkdown, toJson, downloadFile, copyText } from '../../lib/signal-cards/export'
  import SignalCardView from '../signal-card/SignalCard.svelte'
  import { domToPng } from 'modern-screenshot'

  const { stationId = 'g1-the-folder' } = $props()

  // ─── flow state ────────────────────────────────────────────────
  let flow = $state<OpeningState>(initialState())

  // ─── typewriter state ──────────────────────────────────────────
  let typedLines = $state<string[]>([])      // descent lines typed so far
  let typedPrompt = $state('')               // ghost prompt typed
  let typingDone = $state(false)             // descent typing complete
  let promptDone = $state(false)             // prompt typing complete

  // ─── input state ──────────────────────────────────────────────
  let suspicionText = $state('')
  let questionText  = $state('')

  // ─── card / export state ──────────────────────────────────────
  let finalCard = $state<SignalCard | null>(null)
  let copied = $state(false)
  let pngMsg = $state('')
  let cardEl = $state<HTMLElement | null>(null)

  // ─── validation ───────────────────────────────────────────────
  const canSuspicion = $derived(suspicionText.trim().length >= 6)
  const canQuestion  = $derived(questionText.trim().length >= 10)

  // ─── pick first 3 launchpad cases (one per distinct signal where possible) ──
  const SHOWN_CASES = (() => {
    const seen = new Set<string>()
    const out = []
    for (const c of LAUNCHPAD_CASES) {
      if (!seen.has(c.systemSignal)) { seen.add(c.systemSignal); out.push(c) }
      if (out.length === 3) break
    }
    return out
  })()

  // ─── typewriter ────────────────────────────────────────────────
  async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

  async function typeString(target: () => string, set: (v: string) => void, delay = 22) {
    const full = target()
    let i = 0
    while (i <= full.length) { set(full.slice(0, i)); i++; await sleep(delay) }
  }

  onMount(async () => {
    await sleep(320)
    for (const line of GHOST_LINES.descent) {
      typedLines = [...typedLines, '']
      const idx = typedLines.length - 1
      await typeString(() => line, (v) => {
        const copy = [...typedLines]
        copy[idx] = v
        typedLines = copy
      }, 20)
      await sleep(260)
    }
    typingDone = true
    await sleep(380)
    // type the prompt
    await typeString(() => GHOST_LINES.prompt, (v) => { typedPrompt = v }, 18)
    promptDone = true
    // advance flow to prompt step
    flow = { ...flow, step: 'prompt' }
  })

  // ─── path handlers ─────────────────────────────────────────────
  function goOwn() { flow = choosePath(flow, 'own') }
  function goBlank() { flow = choosePath(flow, 'launchpad') }

  function pickCase(id: string) {
    flow = pickLaunchpad(flow, id)
    // draft is seeded by pickLaunchpad — pre-fill text boxes too
    suspicionText = flow.draft.suspicion ?? ''
    questionText  = flow.draft.question  ?? ''
    // skip the suspicion/sharpen steps when a case pre-seeds everything;
    // advance directly to the seam (open-file) via setQuestion
    flow = setQuestion(flow, questionText)
  }

  function submitSuspicion() {
    if (!canSuspicion) return
    flow = setSuspicion(flow, suspicionText.trim())
    // pre-fill question if not already set (own path)
    if (!questionText) questionText = ''
  }

  function submitQuestion() {
    if (!canQuestion) return
    flow = setQuestion(flow, questionText.trim())
  }

  function goFirstMove() { flow = { ...flow, step: 'first-move' } }
  function goCard()      { flow = { ...flow, step: 'card' }; buildCard() }

  function buildCard() {
    const d = flow.draft
    const signal: SystemSignal = (d.systemSignal ?? 'unsure') as SystemSignal
    const q = d.question ?? ''
    const suggested = suggestLines(signal, q)
    const now = new Date().toISOString()
    const card: SignalCard = {
      id: newCardId(),
      version: 1,
      createdAt: now,
      updatedAt: now,
      line: 'g',
      station: 'g1-the-folder',
      stage: 'question',
      systemSignal: signal,
      suspicion: d.suspicion ?? '',
      question: q,
      evidenceNeeded: [],
      uncertainty: '',
      suggestedLines: suggested,
      nextLineChoice: suggested[0] ?? 'g',
      tags: ['descent'],
      visibility: 'private',
      disclaimer: SIGNAL_CARD_DISCLAIMER,
    }
    saveCard(card)
    clearDraft()
    finalCard = card
  }

  function doBack() { flow = back(flow) }

  // ─── export ───────────────────────────────────────────────────
  async function doCopy() {
    if (!finalCard) return
    copied = await copyText(toMarkdown(finalCard))
    setTimeout(() => (copied = false), 1600)
  }
  function doMarkdown() { if (finalCard) downloadFile(`${finalCard.id}.md`, toMarkdown(finalCard), 'text/markdown') }
  function doJson()     { if (finalCard) downloadFile(`${finalCard.id}.json`, toJson(finalCard), 'application/json') }
  async function doPng() {
    if (!cardEl || !finalCard) return
    try {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || '#060608'
      const url = await domToPng(cardEl, { scale: 2, backgroundColor: bg })
      const a = document.createElement('a'); a.href = url; a.download = `${finalCard.id}.png`; a.click()
    } catch (e) {
      console.error('[doPng]', e)
      pngMsg = 'PNG export failed — try Copy or .md instead.'
    }
  }

  // convenience derived
  const currentCase = $derived(
    flow.launchpadId ? LAUNCHPAD_CASES.find(c => c.id === flow.launchpadId) ?? null : null
  )
  const terrain = $derived(
    flow.draft.systemSignal ? terrainFor(flow.draft.systemSignal) : { places: [] }
  )
</script>

<!-- ═══════════════════════════════════════════════════════════════
     SCENE WRAPPER  — terminal "machine room"
════════════════════════════════════════════════════════════════ -->
<div class="scene" aria-label="Line G · The Descent">

  <!-- status bar -->
  <div class="bar">
    <span><span class="dot">◢</span> MASCHINENRAUM · LINE G</span>
    <span>THE FOLDER · #001</span>
  </div>

  <!-- terminal body — EVERYTHING scrolls inside here, no page-break -->
  <div class="body">

    <!-- ── 0 · DESCENT — typed in on mount ─────────────────────── -->
    <p class="ln dim">// abstieg … verbindung zum maschinenraum steht</p>

    {#each typedLines as line, i (i)}
      <p class="ln ghost-line">
        <span class="gh">GHOST</span>&nbsp;{line}{#if !typingDone && i === typedLines.length - 1}<span class="cur dv-cursor"></span>{/if}
      </p>
    {/each}

    <!-- ── 1 · PROMPT ────────────────────────────────────────────── -->
    {#if typingDone}
      <p class="ln dim" style="margin-top:14px">&gt; {typedPrompt}{#if !promptDone}<span class="cur dv-cursor"></span>{/if}</p>
    {/if}

    {#if flow.step === 'prompt' && promptDone}
      <div class="doors" role="group" aria-label="Choose a path">
        <button class="door-btn" onclick={goOwn}>
          <span class="door-label">// Ich habe eine Frage</span>
          <span class="door-sub">Bring your suspicion — I'll help sharpen it into a question.</span>
        </button>
        <button class="door-btn dim-btn" onclick={goBlank}>
          <span class="door-label">// Mir fällt nichts ein</span>
          <span class="door-sub">Nothing comes to mind. Show me a real thread.</span>
        </button>
      </div>
    {/if}

    <!-- ── BLANK PATH · launchpad picker ─────────────────────────── -->
    {#if flow.step === 'launchpad'}
      <div class="block">
        <p class="ln ghost-line"><span class="gh">GHOST</span>&nbsp;{GHOST_LINES.blankResist}</p>
        <p class="ln ghost-line"><span class="gh">GHOST</span>&nbsp;{GHOST_LINES.blankOffer}</p>
        <div class="cases" role="group" aria-label="Launchpad cases">
          {#each SHOWN_CASES as c (c.id)}
            <button class="case-btn" onclick={() => pickCase(c.id)}>
              <span class="case-signal eyebrow">// {c.systemSignal}</span>
              <span class="case-hook">{c.hook}</span>
              <span class="case-pick">PULL THIS THREAD →</span>
            </button>
          {/each}
        </div>
        <button class="back-btn" onclick={doBack}>← back</button>
      </div>
    {/if}

    <!-- ── OWN PATH · suspicion entry ───────────────────────────── -->
    {#if flow.step === 'suspicion' && flow.path === 'own'}
      <div class="block">
        <p class="ln ghost-line"><span class="gh">GHOST</span>&nbsp;{GHOST_LINES.suspicionPrompt}</p>
        <div class="input-row">
          <span class="you-lbl">DU</span>
          <textarea
            class="terminal-input"
            bind:value={suspicionText}
            rows={3}
            maxlength={280}
            placeholder="Ich bemerke, dass …"
            aria-label="Dein Verdacht"
          ></textarea>
        </div>
        <div class="nav-row">
          <button class="back-btn" onclick={doBack}>← back</button>
          <button class="go-btn" disabled={!canSuspicion} onclick={submitSuspicion}>SCHÄRFEN →</button>
        </div>
      </div>
    {/if}

    <!-- ── SHARPEN · question entry (own path only — launchpad skips here) ─ -->
    {#if flow.step === 'sharpen'}
      <div class="block">
        <p class="ln ghost-line"><span class="gh">GHOST</span>&nbsp;{GHOST_LINES.sharpen}</p>
        <div class="input-row">
          <span class="you-lbl">DU</span>
          <textarea
            class="terminal-input"
            bind:value={questionText}
            rows={3}
            maxlength={280}
            placeholder="Wer finanziert …? Welche Daten werden …?"
            aria-label="Deine Frage"
          ></textarea>
        </div>
        <div class="nav-row">
          <button class="back-btn" onclick={doBack}>← back</button>
          <button class="go-btn" disabled={!canQuestion} onclick={submitQuestion}>AKTE ÖFFNEN →</button>
        </div>
      </div>
    {/if}

    <!-- ════════════════════════════════════════════════════════════
         THE SEAM — file opens INLINE, no screen-break.
         Everything above stays visible; the file animates in below.
    ═══════════════════════════════════════════════════════════════ -->
    {#if isSeam(flow) || flow.step === 'first-move' || flow.step === 'card'}

      <!-- ghost confirms -->
      <p class="ln ghost-line seam-line">
        <span class="gh">GHOST</span>&nbsp;{GHOST_LINES.seam}
      </p>

      <!-- THE CASE FILE — stamped, opens at the seam -->
      <div class="file" role="region" aria-label="Case file">
        <div class="fh">
          <span>CASE FILE · LINE G · #001</span>
          <span class="stamp">GEÖFFNET · UNVERIFIZIERT</span>
        </div>
        <div class="fb">
          <p class="margin">„Das ist kein Beweis. Noch nicht. Es ist eine eröffnete Ermittlung — und sie gehört dir." — GHOST</p>

          <div class="frow">
            <p class="flabel">// Verdacht</p>
            {#if flow.draft.suspicion}
              <div class="redact-block">{flow.draft.suspicion.slice(0, 8).replace(/./g, '░')}&nbsp;<span class="fval dim-val">{flow.draft.suspicion.slice(0,40)}{flow.draft.suspicion.length > 40 ? '…' : ''}</span></div>
            {:else}
              <span class="redact"></span>
            {/if}
          </div>

          <div class="frow">
            <p class="flabel">// Frage</p>
            <div class="fval">{flow.draft.question ?? ''}</div>
          </div>

          <!-- ── FIRST MOVE section (revealed after seam) ────────── -->
          {#if flow.step === 'first-move' || flow.step === 'card'}
            <div class="frow">
              <p class="flabel">// Erste Spur</p>
              {#if currentCase}
                <!-- launchpad path: real source -->
                <div class="first-move-block">
                  <p class="ln ghost-line" style="margin:0 0 10px"><span class="gh">GHOST</span>&nbsp;{GHOST_LINES.firstMoveCase}</p>
                  <a class="source-link" href={currentCase.source.url} target="_blank" rel="noopener noreferrer">
                    <span class="src-arrow">▸</span>
                    <span class="src-title">{currentCase.source.title}</span>
                    <span class="src-url">· {currentCase.source.url}</span>
                  </a>
                  <p class="src-contains">{currentCase.source.contains}</p>
                </div>
              {:else}
                <!-- own path: terrain -->
                <div class="first-move-block">
                  <p class="ln ghost-line" style="margin:0 0 10px"><span class="gh">GHOST</span>&nbsp;{GHOST_LINES.firstMoveOwn}</p>
                  {#each terrain.places as p (p.url)}
                    <div class="terrain-row">
                      <span class="terrain-kind eyebrow">// {p.kind}</span>
                      <a class="source-link" href={p.url} target="_blank" rel="noopener noreferrer">
                        <span class="src-arrow">▸</span>
                        <span class="src-title">{p.example}</span>
                      </a>
                    </div>
                  {/each}
                  {#if terrain.places.length === 0}
                    <p class="dim">Keine öffentlichen Quellen für dieses Signal kartiert.</p>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}

          <!-- receipt-style Signal Card seed line -->
          <p class="seed">▚ SIGNAL CARD · Keim · <strong class="g-text">noch kein Beweis</strong> · Ermittlung eröffnet · exportierbar</p>
        </div>
      </div>

      <!-- ── advance to first-move ──────────────────────────────── -->
      {#if isSeam(flow) && flow.step !== 'first-move' && flow.step !== 'card'}
        <div class="nav-row" style="margin-top:14px">
          <button class="go-btn" onclick={goFirstMove}>ERSTE SPUR FINDEN →</button>
        </div>
      {/if}

      <!-- ── advance to card ─────────────────────────────────────── -->
      {#if flow.step === 'first-move'}
        <div class="nav-row" style="margin-top:14px">
          <button class="back-btn" onclick={doBack}>← back</button>
          <button class="go-btn" onclick={goCard}>SIGNAL CARD GENERIEREN →</button>
        </div>
      {/if}

    {/if}

    <!-- ════════════════════════════════════════════════════════════
         CARD STEP — artifact + export + connect CTA
    ═══════════════════════════════════════════════════════════════ -->
    {#if flow.step === 'card' && finalCard}
      <div class="card-section">
        <p class="ln ghost-line"><span class="gh">GHOST</span>&nbsp;{GHOST_LINES.card}</p>

        <div bind:this={cardEl}>
          <SignalCardView card={finalCard} />
        </div>

        <div class="actions">
          <button class="act-btn" onclick={doCopy}>{copied ? 'Copied ✓' : 'Copy text'}</button>
          <button class="act-btn" onclick={doMarkdown}>Download .md</button>
          <button class="act-btn" onclick={doJson}>Download .json</button>
          <button class="act-btn" onclick={doPng}>Download .png</button>
        </div>
        {#if pngMsg}<p class="muted">{pngMsg}</p>{/if}

        <!-- ── CONNECT CTA ────────────────────────────────────────── -->
        <div class="connect-cta">
          <p class="ln ghost-line"><span class="gh">GHOST</span>&nbsp;{GHOST_LINES.connectCta}</p>
          <a class="cta-link" href="/connect">ZUR VERBINDUNG → /connect</a>
        </div>
      </div>
    {/if}

  </div><!-- /body -->
</div><!-- /scene -->

<style>
  /* ─── scene shell ──────────────────────────────────────────── */
  .scene {
    max-width: 760px;
    margin: 0 auto;
    border: 1px solid var(--color-edge-2);
    background: var(--color-bg);
    position: relative;
    overflow: hidden;
    box-shadow: 0 24px 80px -30px #000;
  }
  /* scanlines + vignette overlay */
  .scene::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      repeating-linear-gradient(0deg, rgba(255,255,255,.018) 0 1px, transparent 1px 3px),
      radial-gradient(120% 80% at 50% 0%, transparent 55%, rgba(0,0,0,.55) 100%);
    z-index: 0;
  }

  /* ─── status bar ──────────────────────────────────────────── */
  .bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 14px;
    border-bottom: 1px solid var(--color-edge);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: .18em;
    color: var(--color-ink-5);
    text-transform: uppercase;
    position: relative;
    z-index: 1;
  }
  .dot { color: var(--color-line-g); }

  /* ─── terminal body ───────────────────────────────────────── */
  .body {
    padding: 18px 18px 28px;
    font-family: var(--font-mono);
    font-size: 13.5px;
    line-height: 1.55;
    min-height: 330px;
    position: relative;
    z-index: 1;
  }

  /* ─── line primitives ─────────────────────────────────────── */
  .ln { margin: 0 0 8px; }
  .dim { color: var(--color-ink-5); }
  .gh { color: var(--color-ghost); }
  .g-text { color: var(--color-line-g); }
  .ghost-line { color: var(--color-ink-2); }
  .seam-line { margin-top: 18px; }

  /* blinking cursor — reuse global animation */
  .cur {
    display: inline-block;
    width: 8px;
    height: 14px;
    background: var(--color-ghost);
    vertical-align: -2px;
    margin-left: 2px;
  }

  /* ─── path doors (prompt step) ────────────────────────────── */
  .doors {
    display: grid;
    gap: 10px;
    margin-top: 16px;
  }
  .door-btn {
    display: grid;
    gap: 4px;
    text-align: left;
    background: var(--color-panel);
    border: 1px solid var(--color-edge-2);
    color: var(--color-ink);
    padding: 13px 15px;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 13px;
    transition: border-color .18s ease;
  }
  .door-btn:hover { border-color: var(--color-line-g); }
  .door-btn.dim-btn { color: var(--color-ink-4); }
  .door-label {
    font-size: 10px;
    letter-spacing: .2em;
    color: var(--color-eyebrow);
    text-transform: uppercase;
  }
  .door-sub { font-size: 12.5px; color: var(--color-ink-3); line-height: 1.4; }

  /* ─── launchpad cases ────────────────────────────────────── */
  .block { margin-top: 16px; display: grid; gap: 12px; }
  .cases { display: grid; gap: 10px; margin-top: 4px; }
  .case-btn {
    display: grid;
    gap: 5px;
    text-align: left;
    background: var(--color-panel-2);
    border: 1px solid var(--color-edge-2);
    color: var(--color-ink);
    padding: 14px 16px;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 12.5px;
    transition: border-color .18s ease;
  }
  .case-btn:hover { border-color: var(--color-line-g); border-left-color: var(--color-line-g); border-left-width: 3px; }
  .case-signal { font-size: 9px; letter-spacing: .2em; color: var(--color-eyebrow); }
  .case-hook { font-size: 13px; color: var(--color-ink-2); line-height: 1.45; }
  .case-pick { font-size: 10px; letter-spacing: .14em; color: var(--color-line-g); text-transform: uppercase; margin-top: 3px; }

  /* ─── input rows ─────────────────────────────────────────── */
  .input-row { display: grid; grid-template-columns: 40px 1fr; gap: 8px; align-items: start; }
  .you-lbl { color: var(--color-signal); font-size: 11px; letter-spacing: .12em; padding-top: 13px; }
  .terminal-input {
    width: 100%;
    box-sizing: border-box;
    background: var(--color-panel-2);
    border: 1px solid var(--color-edge-2);
    border-left: 2px solid var(--color-ghost);
    color: var(--color-ink);
    font-family: var(--font-mono);
    font-size: 13.5px;
    line-height: 1.5;
    padding: 11px 13px;
    resize: vertical;
  }
  .terminal-input:focus {
    outline: none;
    border-color: var(--color-line-g);
    border-left-color: var(--color-ghost);
  }
  .terminal-input::placeholder { color: var(--color-ink-5); }

  /* ─── nav row ────────────────────────────────────────────── */
  .nav-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .back-btn {
    background: transparent;
    border: 1px solid var(--color-edge-2);
    color: var(--color-ink-4);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: .06em;
    padding: 10px 14px;
    cursor: pointer;
  }
  .go-btn {
    background: var(--color-signal);
    color: var(--color-panel-2);
    border: none;
    font-family: var(--font-mono);
    font-size: 11.5px;
    letter-spacing: .08em;
    font-weight: 700;
    padding: 12px 20px;
    cursor: pointer;
    text-transform: uppercase;
  }
  .go-btn:disabled { opacity: .38; cursor: not-allowed; }

  /* ─── THE CASE FILE ──────────────────────────────────────── */
  .file {
    margin-top: 18px;
    border: 1px solid var(--color-edge-3);
    border-top: 3px solid var(--color-line-g);
    background: var(--color-panel-3);
    position: relative;
    animation: open .5s ease both;
  }
  @keyframes open {
    from { opacity: 0; transform: translateY(10px) scaleY(.96); }
    to   { opacity: 1; transform: none; }
  }
  .fh {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px 14px;
    border-bottom: 1px solid var(--color-edge-2);
    font-size: 10px;
    letter-spacing: .16em;
    color: var(--color-ink-4);
    text-transform: uppercase;
  }
  .stamp {
    border: 1.5px solid var(--color-magenta);
    color: var(--color-magenta);
    font-size: 9px;
    letter-spacing: .14em;
    padding: 3px 8px;
    transform: rotate(-5deg);
    font-weight: 700;
    opacity: .9;
    white-space: nowrap;
  }
  .fb { padding: 14px 16px 18px; display: grid; gap: 14px; }
  .margin {
    border-left: 2px solid var(--color-ghost);
    padding: 1px 0 1px 12px;
    font-style: italic;
    color: var(--color-ink-3);
    font-size: 12px;
    line-height: 1.6;
    margin: 0;
  }
  .flabel {
    font-size: 9px;
    letter-spacing: .2em;
    color: var(--color-ink-5);
    text-transform: uppercase;
    margin: 0 0 5px;
  }
  .frow { margin: 0; }
  .fval { font-size: 13px; color: var(--color-ink); }
  .dim-val { color: var(--color-ink-3); }

  /* redaction bar */
  .redact {
    display: inline-block;
    background: #1b1c24;
    height: 14px;
    width: 160px;
    max-width: 80%;
    border-radius: 1px;
    box-shadow: 0 0 0 1px #000 inset;
  }
  .redact-block { font-size: 12px; color: var(--color-ink-5); }

  /* ─── first-move / terrain ───────────────────────────────── */
  .first-move-block { display: grid; gap: 8px; margin-top: 4px; }
  .source-link {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: baseline;
    text-decoration: none;
    color: var(--color-signal);
    font-size: 12.5px;
    line-height: 1.4;
  }
  .source-link:hover .src-title { text-decoration: underline; }
  .src-arrow { color: var(--color-signal); }
  .src-title { font-weight: 700; }
  .src-url { color: var(--color-ink-4); font-size: 11px; word-break: break-all; }
  .src-contains { font-size: 11.5px; color: var(--color-ink-4); line-height: 1.5; margin: 2px 0 0; }
  .terrain-row { display: grid; gap: 4px; margin-bottom: 10px; }
  .terrain-kind { font-size: 9px; letter-spacing: .2em; color: var(--color-eyebrow); }

  /* seed line */
  .seed {
    margin: 0;
    border-top: 1px dashed var(--color-edge-2);
    padding-top: 11px;
    font-size: 10.5px;
    color: var(--color-ink-5);
  }

  /* ─── card section ───────────────────────────────────────── */
  .card-section { margin-top: 20px; display: grid; gap: 16px; justify-items: start; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .act-btn {
    background: var(--color-panel-2);
    border: 1px solid var(--color-edge-2);
    color: var(--color-ink);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: .04em;
    padding: 10px 14px;
    cursor: pointer;
  }
  .act-btn:hover { border-color: var(--color-line-g); }
  .muted { font-size: 12px; color: var(--color-ink-4); margin: 0; }

  /* ─── connect CTA ────────────────────────────────────────── */
  .connect-cta {
    border-top: 1px solid var(--color-edge);
    padding-top: 16px;
    display: grid;
    gap: 12px;
  }
  .cta-link {
    display: inline-block;
    background: transparent;
    border: 1px solid var(--color-line-g);
    color: var(--color-line-g);
    font-family: var(--font-mono);
    font-size: 11.5px;
    letter-spacing: .1em;
    padding: 12px 20px;
    text-decoration: none;
    text-transform: uppercase;
    transition: background .18s ease, color .18s ease;
  }
  .cta-link:hover { background: var(--color-line-g); color: var(--color-bg); }

  /* ─── reduced motion ─────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .cur { animation: none !important; opacity: 1; }
    .file { animation: none !important; }
  }
</style>
