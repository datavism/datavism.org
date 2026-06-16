<script>
  // The Underground — public Case File index. Filter chips (ALL / G / K / R / B
  // / V) re-filter a responsive card grid. Cards arrive pre-enriched from the
  // page (colour + curator resolved from the curriculum).
  let { cards = [], filters = [] } = $props()

  let filter = $state('all')
  const shown = $derived(filter === 'all' ? cards : cards.filter((c) => c.line === filter))
</script>

<div class="filterbar">
  {#each filters as f (f.id)}
    {@const active = filter === f.id}
    <button
      class="chip"
      onclick={() => (filter = f.id)}
      style={active
        ? `background:${f.color};color:#0b0c10;border-color:${f.color};`
        : `background:transparent;color:${f.color};border-color:#2c2f3a;`}
    >{f.label}</button>
  {/each}
  <span class="count">{shown.length} files</span>
</div>

<div class="grid">
  {#each shown as c (c.id)}
    <a class="card" href={c.href} style={`border-top:3px solid ${c.color};opacity:${c.op};`} aria-disabled={c.href === '#' ? 'true' : undefined}>
      <div class="card-top">
        <span class="left">
          <span class="line-badge" style={`border-color:${c.color};color:${c.color};`}>{c.lineCode}</span>
          <span class="cf-id">{c.id}</span>
        </span>
        <span class="status" style={`color:${c.statusColor};border-color:${c.statusColor};`}>{c.statusLabel}</span>
      </div>
      <div class="card-title font-display" style={`color:${c.titleColor};`}>{c.title}</div>
      <p class="card-finding">{c.finding}</p>
      <div class="card-foot">
        <span class="curator">{c.curator}</span>
        <span class="severity" style={`color:${c.color};`}>{c.severity}</span>
      </div>
    </a>
  {/each}
</div>

<style>
  .filterbar { display: flex; flex-wrap: wrap; gap: 9px; padding: 18px 0 26px; border-top: 1px solid var(--color-edge); border-bottom: 1px solid var(--color-edge); }
  .chip { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.08em; padding: 9px 16px; cursor: pointer; border: 1px solid; transition: background .2s ease, color .2s ease; }
  .count { margin-left: auto; align-self: center; font-size: 11px; color: var(--color-ink-4); }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 16px; margin-top: 26px; }
  .card { display: flex; flex-direction: column; border: 1px solid var(--color-edge); background: var(--color-panel); padding: 18px; text-decoration: none; color: inherit; min-height: 210px; transition: transform .2s ease, border-color .2s ease; }
  .card:not([aria-disabled]):hover { transform: translateY(-4px); }
  .card[aria-disabled='true'] { cursor: default; }
  .card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
  .left { display: inline-flex; align-items: center; gap: 8px; }
  .line-badge { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border: 1.5px solid; font-weight: 700; font-size: 11px; }
  .cf-id { font-size: 11px; color: var(--color-ink-4); letter-spacing: 0.08em; }
  .status { font-size: 9.5px; letter-spacing: 0.1em; border: 1px solid; padding: 2px 7px; }
  .card-title { font-weight: 700; font-size: 19px; line-height: 1.05; letter-spacing: -0.02em; }
  .card-finding { font-size: 13px; line-height: 1.5; color: var(--color-ink-3); margin: 12px 0 0; }
  .card-foot { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 16px; }
  .curator { font-size: 10.5px; color: var(--color-ink-4); }
  .severity { font-size: 11px; letter-spacing: 0.12em; }

  @media (prefers-reduced-motion: reduce) { .card:hover { transform: none; } }
</style>
