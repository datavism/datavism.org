<!-- src/components/archive/SignalArchiveGrid.svelte -->
<script>
  import { loadCards } from '../../lib/signal-cards/storage'
  import SignalCard from '../signal-card/SignalCard.svelte'

  let { samples = [] } = $props()

  let mine = $state([])
  let line = $state('all')
  let stage = $state('all')

  let loaded = false
  $effect(() => { if (loaded) return; loaded = true; mine = loadCards() })

  const all = $derived([...mine, ...samples])
  const shown = $derived(all.filter((c) =>
    (line === 'all' || c.nextLineChoice === line) && (stage === 'all' || c.stage === stage)))
</script>

<div class="filters">
  <select bind:value={line} aria-label="Filter by line">
    <option value="all">All lines</option>
    <option value="g">G</option><option value="k">K</option><option value="r">R</option><option value="b">B</option><option value="v">V</option>
  </select>
  <select bind:value={stage} aria-label="Filter by stage">
    <option value="all">All stages</option>
    <option value="question">Question</option><option value="case-file">Case File</option>
  </select>
  <span class="count">{shown.length} signal{shown.length === 1 ? '' : 's'}</span>
</div>

{#if mine.length}<p class="mine-note">The first {mine.length} are yours, saved on this device.</p>{/if}

{#if shown.length}
  <div class="grid">
    {#each shown as c (c.id)}<SignalCard card={c} />{/each}
  </div>
{:else}
  <p class="empty">No signals match this filter yet.</p>
{/if}

<style>
  .filters { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 18px; }
  select { background: var(--color-bg); border: 1px solid var(--color-edge-2); color: var(--color-ink); font-family: var(--font-mono); font-size: 12px; padding: 8px 10px; }
  .count { font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-4); }
  .mine-note { font-size: 12px; color: var(--color-line-g); margin: 0 0 14px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; align-items: start; }
  .empty { color: var(--color-ink-4); font-size: 14px; }
</style>
