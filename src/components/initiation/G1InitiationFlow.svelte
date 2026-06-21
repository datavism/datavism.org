<!-- src/components/initiation/G1InitiationFlow.svelte -->
<script>
  import {
    SYSTEM_SIGNALS, EVIDENCE_TYPES, SIGNAL_CARD_DISCLAIMER, deriveStage,
  } from '../../lib/signal-cards/types'
  import { suggestLines } from '../../lib/signal-cards/route-suggestions'
  import { loadDraft, saveDraft, clearDraft, saveCard, newCardId } from '../../lib/signal-cards/storage'
  import { LINES, getLineById } from '../../lib/curriculum/lines'
  import SignalCard from '../signal-card/SignalCard.svelte'
  import { toMarkdown, toJson, downloadFile, copyText } from '../../lib/signal-cards/export'
  import { domToPng } from 'modern-screenshot'

  const STEPS = ['intro', 'system-signal', 'suspicion', 'question', 'evidence', 'uncertainty', 'route', 'card']
  const PROGRESS = ['Signal', 'Suspicion', 'Question', 'Evidence', 'Uncertainty', 'Route', 'Card']

  let step = $state('intro')
  let draft = $state({ evidenceNeeded: [], tags: [] })

  // one-time hydrate (SelfCheck.svelte pattern)
  let loaded = false
  $effect(() => {
    if (loaded) return
    loaded = true
    const d = loadDraft()
    if (d) draft = { evidenceNeeded: [], tags: [], ...d }
  })

  const stepIndex = $derived(STEPS.indexOf(step))
  const progressIndex = $derived(Math.min(Math.max(stepIndex - 1, 0), PROGRESS.length - 1))

  function persist() { saveDraft($state.snapshot(draft)) }
  function go(next) { step = next; if (next !== 'card') persist() }
  function back() { if (stepIndex > 0) step = STEPS[stepIndex - 1] }

  function pickSignal(s) {
    draft.systemSignal = s.id
    draft.suggestedLines = suggestLines(s.id, draft.question ?? '')
    go('suspicion')
  }
  function toggleEvidence(id) {
    const set = new Set(draft.evidenceNeeded ?? [])
    set.has(id) ? set.delete(id) : set.add(id)
    draft.evidenceNeeded = [...set]
  }
  function enterRoute() {
    draft.suggestedLines = suggestLines(draft.systemSignal, draft.question ?? '')
    if (!draft.nextLineChoice) draft.nextLineChoice = draft.suggestedLines[0] ?? 'g'
    go('route')
  }
  function finishCard() {
    draft.suggestedLines = suggestLines(draft.systemSignal, draft.question ?? '')
    const now = new Date().toISOString()
    draft = {
      ...draft,
      id: draft.id ?? newCardId(),
      version: 1, line: 'g', station: 'g1-the-folder',
      createdAt: draft.createdAt ?? now, updatedAt: now,
      stage: deriveStage(draft),
      visibility: 'private', disclaimer: SIGNAL_CARD_DISCLAIMER,
    }
    saveCard($state.snapshot(draft))
    clearDraft()
    step = 'card'
  }
  function restart() {
    draft = { evidenceNeeded: [], tags: [] }
    clearDraft()
    step = 'intro'
  }

  let cardEl = $state(null)
  let copied = $state(false)

  async function doCopy() {
    copied = await copyText(toMarkdown($state.snapshot(draft)))
    setTimeout(() => (copied = false), 1600)
  }
  function doMarkdown() { downloadFile(`${draft.id}.md`, toMarkdown($state.snapshot(draft)), 'text/markdown') }
  function doJson() { downloadFile(`${draft.id}.json`, toJson($state.snapshot(draft)), 'application/json') }
  async function doPng() {
    if (!cardEl) return
    const url = await domToPng(cardEl, { scale: 2, backgroundColor: '#060608' })
    const a = document.createElement('a')
    a.href = url; a.download = `${draft.id}.png`; a.click()
  }

  let showUpgrade = $state(false)
  let contributeMsg = $state('')

  function upgradeFields() {
    draft.stage = deriveStage(draft)
    draft.updatedAt = new Date().toISOString()
    saveCard($state.snapshot(draft))
  }
  async function contribute() {
    const payload = { ...$state.snapshot(draft), visibility: 'public-anonymous', suspicion: undefined }
    const ok = await copyText(JSON.stringify(payload, null, 2))
    contributeMsg = ok
      ? 'Anonymized payload copied. Nothing was posted — send it in if you want it curated into the Archive.'
      : 'Copy failed — your card stays private on this device.'
  }

  // gating
  const canSuspicion = $derived((draft.suspicion ?? '').trim().length >= 10)
  const canQuestion = $derived((draft.question ?? '').trim().length >= 10)
  const canUncertainty = $derived((draft.uncertainty ?? '').trim().length >= 5)
  const sensitive = $derived(/\b(\d{2,})\b|@|password|passwort|iban|address|adresse/i.test(draft.suspicion ?? ''))
</script>

<section class="flow" aria-label="G1 initiation">
  {#if step !== 'intro' && step !== 'card'}
    <ol class="progress">
      {#each PROGRESS as label, i (label)}
        <li class:on={i <= progressIndex} class:cur={i === progressIndex}>{i + 1} {label}</li>
      {/each}
    </ol>
  {/if}

  {#if step === 'intro'}
    <div class="panel intro">
      <p class="ghost">A feeling is not evidence. But it can become the beginning of a question.</p>
      <p class="lede">This station turns a vague suspicion into your first DATAVISM Signal Card. You will not prove everything today — you will open an investigation.</p>
      <button class="go" onclick={() => go('system-signal')}>Enter the Folder →</button>
    </div>
  {:else if step === 'system-signal'}
    <div class="panel">
      <p class="ghost">What kind of system is on your mind?</p>
      <div class="grid">
        {#each SYSTEM_SIGNALS as s (s.id)}
          <button class="opt" class:sel={draft.systemSignal === s.id} onclick={() => pickSignal(s)}>{s.label}</button>
        {/each}
      </div>
    </div>
  {:else if step === 'suspicion'}
    <div class="panel">
      <p class="ghost">Do not prove it yet. Name what you noticed.</p>
      <textarea bind:value={draft.suspicion} maxlength="280" rows="3" placeholder="A website seems to know what I was looking for elsewhere."></textarea>
      {#if sensitive}<p class="warn">Keep personal data out — no names, emails, addresses or numbers about real people.</p>{/if}
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" disabled={!canSuspicion} onclick={() => go('question')}>Next →</button></div>
    </div>
  {:else if step === 'question'}
    <div class="panel">
      <p class="ghost">Turn the suspicion into a question that could be answered with evidence.</p>
      <textarea bind:value={draft.question} maxlength="280" rows="3" placeholder="What evidence would show that this site tracks me before I consent?"></textarea>
      <div class="hints">
        {#each ['What evidence would show that [system] does [behavior]?', 'Which actors are involved in [system]?', 'Who benefits from [observed pattern]?'] as t (t)}
          <button class="hint" onclick={() => { draft.question = t }}>{t}</button>
        {/each}
      </div>
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" disabled={!canQuestion} onclick={() => go('evidence')}>Next →</button></div>
    </div>
  {:else if step === 'evidence'}
    <div class="panel">
      <p class="ghost">Evidence is what would let someone else inspect the claim.</p>
      <div class="grid">
        {#each EVIDENCE_TYPES as e (e.id)}
          <button class="opt" class:sel={(draft.evidenceNeeded ?? []).includes(e.id)} onclick={() => toggleEvidence(e.id)}>
            <span class="ol">{e.label}</span>{#if e.hint}<span class="oh">{e.hint}</span>{/if}
          </button>
        {/each}
      </div>
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" onclick={() => go('uncertainty')}>Next →</button></div>
    </div>
  {:else if step === 'uncertainty'}
    <div class="panel">
      <p class="ghost">Uncertainty is not weakness. It is where the investigation stays honest.</p>
      <textarea bind:value={draft.uncertainty} maxlength="280" rows="3" placeholder="I do not know who receives the data."></textarea>
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" disabled={!canUncertainty} onclick={enterRoute}>Next →</button></div>
    </div>
  {:else if step === 'route'}
    <div class="panel">
      <p class="ghost">The map can suggest a route. Only you choose the path.</p>
      <div class="grid">
        {#each LINES as l (l.id)}
          <button class="opt" class:sel={draft.nextLineChoice === l.id} class:suggested={(draft.suggestedLines ?? []).includes(l.id)} onclick={() => { draft.nextLineChoice = l.id }}>
            <span class="ol">{l.code} — {l.name}</span><span class="oh">{l.motto}</span>
          </button>
        {/each}
      </div>
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" onclick={finishCard}>Generate Signal Card →</button></div>
    </div>
  {:else if step === 'card'}
    <div class="panel cardwrap">
      <p class="ghost done">Investigation opened. This is your Signal Card — it is not evidence yet.</p>
      <div bind:this={cardEl}><SignalCard card={draft} /></div>
      <div class="actions">
        <button class="act" onclick={doCopy}>{copied ? 'Copied ✓' : 'Copy text'}</button>
        <button class="act" onclick={doMarkdown}>Download .md</button>
        <button class="act" onclick={doJson}>Download .json</button>
        <button class="act" onclick={doPng}>Download .png</button>
      </div>
      <div class="upgrade">
        {#if !showUpgrade}
          <button class="ghostbtn" onclick={() => (showUpgrade = true)}>Make it a full Case File →</button>
        {:else}
          <p class="ghost">Three more fields turn the Signal Card into Case File #1.</p>
          <label class="fld">Actor<input bind:value={draft.actor} placeholder="Who creates, operates or benefits?" /></label>
          <label class="fld">Source lead<input bind:value={draft.sourceLead} placeholder="Where could evidence be found?" /></label>
          <label class="fld">Public relevance<input bind:value={draft.publicRelevance} placeholder="Why does this matter beyond one person?" /></label>
          <button class="go" onclick={upgradeFields}>Save Case File</button>
        {/if}
      </div>

      <div class="contribute">
        <p class="muted">Your card is private on this device. You can keep it that way, export it, or contribute an anonymized copy.</p>
        <button class="ghostbtn" onclick={contribute}>Contribute anonymously (copy payload)</button>
        {#if contributeMsg}<p class="muted ok">{contributeMsg}</p>{/if}
        <a class="muted link" href="/archive">View the Signal Archive →</a>
      </div>

      <div class="nav"><button class="ghostbtn" onclick={restart}>Start another →</button></div>
    </div>
  {/if}
</section>

<style>
  .flow { border: 1px solid var(--color-edge); background: var(--color-panel); padding: 22px; }
  .progress { display: flex; flex-wrap: wrap; gap: 8px 14px; list-style: none; margin: 0 0 20px; padding: 0; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; }
  .progress li { color: var(--color-ink-5); }
  .progress li.on { color: var(--color-ink-3); }
  .progress li.cur { color: var(--color-line-g); }
  .panel { display: grid; gap: 16px; }
  .ghost { font-size: clamp(16px, 2.2vw, 20px); line-height: 1.4; color: var(--color-ink); margin: 0; }
  .ghost.done { color: var(--color-line-g); }
  .lede { font-size: 14px; line-height: 1.6; color: var(--color-ink-3); margin: 0; max-width: 58ch; }
  textarea { width: 100%; box-sizing: border-box; background: var(--color-bg); border: 1px solid var(--color-edge-2); color: var(--color-ink); font: inherit; font-size: 15px; line-height: 1.5; padding: 12px; resize: vertical; }
  .grid { display: grid; gap: 10px; }
  .opt { display: grid; gap: 3px; text-align: left; background: var(--color-panel-2); border: 1px solid var(--color-edge); color: var(--color-ink); padding: 13px 15px; cursor: pointer; font: inherit; }
  .opt:hover { border-color: var(--color-edge-3); }
  .opt.sel { border-color: var(--color-line-g); box-shadow: inset 0 0 0 1px var(--color-line-g); }
  .opt.suggested:not(.sel) { border-left: 3px solid var(--color-line-g); }
  .ol { font-size: 14px; }
  .oh { font-size: 11.5px; color: var(--color-ink-4); }
  .hints { display: grid; gap: 6px; }
  .hint { text-align: left; background: transparent; border: 1px dashed var(--color-edge-2); color: var(--color-ink-3); font: inherit; font-size: 12px; padding: 8px 10px; cursor: pointer; }
  .warn { font-size: 12px; color: var(--color-magenta); margin: 0; }
  .nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 4px; }
  .go { background: var(--color-signal); color: var(--color-panel-2); border: none; font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700; padding: 13px 20px; cursor: pointer; }
  .go:disabled { opacity: 0.4; cursor: not-allowed; }
  .ghostbtn { background: transparent; border: 1px solid var(--color-edge-2); color: var(--color-ink-3); font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.06em; padding: 11px 16px; cursor: pointer; }
  .cardwrap { justify-items: start; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .act { background: var(--color-panel-2); border: 1px solid var(--color-edge-2); color: var(--color-ink); font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.04em; padding: 10px 14px; cursor: pointer; }
  .act:hover { border-color: var(--color-line-g); }
  .upgrade { display: grid; gap: 10px; border-top: 1px solid var(--color-edge); padding-top: 16px; }
  .fld { display: grid; gap: 4px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--color-ink-4); text-transform: uppercase; }
  .fld input { background: var(--color-bg); border: 1px solid var(--color-edge-2); color: var(--color-ink); font: inherit; font-size: 14px; text-transform: none; letter-spacing: 0; padding: 10px; }
  .contribute { display: grid; gap: 8px; border-top: 1px solid var(--color-edge); padding-top: 16px; }
  .muted { font-size: 12px; line-height: 1.55; color: var(--color-ink-4); margin: 0; }
  .muted.ok { color: var(--color-line-g); }
  .link { color: var(--color-signal); text-decoration: none; }
</style>
