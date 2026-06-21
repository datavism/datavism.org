<!-- src/components/signal-card/SignalCard.svelte -->
<script>
  import { EVIDENCE_TYPES } from '../../lib/signal-cards/types'
  import { getLineById } from '../../lib/curriculum/lines'

  let { card = {} } = $props()

  const next = $derived(card.nextLineChoice ? getLineById(card.nextLineChoice) : null)
  const stage = $derived(card.stage === 'case-file' ? 'Case File #1' : 'Suspicion → Question')
  const evidence = $derived(
    (card.evidenceNeeded ?? []).map((id) => EVIDENCE_TYPES.find((e) => e.id === id)?.label ?? id),
  )
</script>

<article class="card" style="--accent: var(--color-line-g)">
  <header class="top">
    <span class="brand font-display">DATAVISM</span>
    <span class="code">G1 · THE FOLDER</span>
  </header>

  <div class="stage">{stage}</div>

  <h3 class="q font-display">{card.question || 'Your investigation question'}</h3>

  <dl class="fields">
    <div><dt>System signal</dt><dd>{card.systemSignal ?? '—'}</dd></div>
    <div><dt>Evidence needed</dt><dd>{evidence.length ? evidence.join(', ') : '—'}</dd></div>
    <div><dt>Uncertainty</dt><dd>{card.uncertainty || '—'}</dd></div>
    <div><dt>Next route</dt><dd>{next ? `${next.code} — ${next.name}` : '—'}</dd></div>
    {#if card.stage === 'case-file'}
      <div><dt>Actor</dt><dd>{card.actor || '—'}</dd></div>
      <div><dt>Source lead</dt><dd>{card.sourceLead || '—'}</dd></div>
      <div><dt>Public relevance</dt><dd>{card.publicRelevance || '—'}</dd></div>
    {/if}
  </dl>

  <footer class="foot">
    <span class="stamp">NOT EVIDENCE YET · INVESTIGATION OPENED</span>
    {#if card.id}<span class="id">{card.id}</span>{/if}
  </footer>
</article>

<style>
  .card { position: relative; background: var(--color-panel-2); border: 1px solid var(--color-edge-2); border-top: 3px solid var(--accent); padding: 22px; display: grid; gap: 16px; max-width: 460px; color: var(--color-ink); }
  .top { display: flex; align-items: center; justify-content: space-between; }
  .brand { font-weight: 800; letter-spacing: -0.02em; font-size: 16px; color: var(--color-signal); }
  .code { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; color: var(--color-ink-4); }
  .stage { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em; color: var(--accent); }
  .q { font-weight: 800; font-size: clamp(20px, 3.2vw, 28px); line-height: 1.12; letter-spacing: -0.03em; margin: 0; }
  .fields { display: grid; gap: 12px; margin: 0; }
  .fields div { display: grid; gap: 3px; border-top: 1px solid var(--color-edge); padding-top: 10px; }
  dt { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.12em; color: var(--color-ink-5); text-transform: uppercase; }
  dd { margin: 0; font-size: 13.5px; line-height: 1.45; color: var(--color-ink-2); }
  .foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-top: 1px solid var(--color-edge); padding-top: 12px; }
  .stamp { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; color: var(--color-magenta); }
  .id { font-family: var(--font-mono); font-size: 9px; color: var(--color-ink-5); }
</style>
