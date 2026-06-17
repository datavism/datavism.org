<script>
  // Station self-check (design §5). Four binary checks → progress bar + count;
  // when all are ticked the CTA flips from "Begin the mission" to "Open Case
  // File". State persists to localStorage (per-station key). No backend — this
  // is a personal, browser-only checklist (nothing is sent).
  let {
    stationId = 'g1',
    checks = [],
    artifactLabel = 'Case File #1',
    beginHref = '#method',
    doneHref = '/underground',
  } = $props()

  const key = `dv_${stationId}_checks`
  let ticked = $state(checks.map(() => false))

  const done = $derived(ticked.filter(Boolean).length)
  const total = checks.length
  const allDone = $derived(total > 0 && done === total)

  // one-time hydrate from localStorage (no reactive deps → runs once on mount)
  let loaded = false
  $effect(() => {
    if (loaded) return
    loaded = true
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const a = JSON.parse(raw)
        if (Array.isArray(a) && a.length === total) ticked = a.map(Boolean)
      }
    } catch {}
  })

  function toggle(i) {
    ticked[i] = !ticked[i]
    try { localStorage.setItem(key, JSON.stringify(ticked)) } catch {}
  }
</script>

<div class="panel">
  <div class="head">
    <span class="kicker">SELF-CHECK</span>
    <span class="count" class:all={allDone}>{done} / {total}</span>
  </div>
  <div class="list">
    {#each checks as label, i (i)}
      <button class="item" onclick={() => toggle(i)} aria-pressed={ticked[i]}>
        <span class="box" class:on={ticked[i]}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <rect x="1" y="1" width="16" height="16" fill={ticked[i] ? '#39ff14' : '#0b0c10'} stroke={ticked[i] ? '#39ff14' : '#2c2f3a'} stroke-width="1.5" />
            {#if ticked[i]}
              <path d="M4.5 9.2 L7.6 12 L13.5 5.5" fill="none" stroke="#06120a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            {/if}
          </svg>
        </span>
        <span class="label" class:done={ticked[i]}>{label}</span>
      </button>
    {/each}
  </div>
  <div class="track"><div class="fill" style={`width:${total ? Math.round((done / total) * 100) : 0}%`}></div></div>
</div>

<a class="cta" class:complete={allDone} href={allDone ? doneHref : beginHref}>
  {allDone ? `Open ${artifactLabel} →` : 'Begin the mission →'}
</a>

<style>
  .panel { border: 1px solid var(--color-edge); background: var(--color-panel); padding: 20px; }
  .head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .kicker { font-size: 10px; letter-spacing: 0.16em; color: var(--color-ink-4); font-family: var(--font-mono); }
  .count { font-size: 11px; color: var(--color-ink-3); font-family: var(--font-mono); }
  .count.all { color: var(--color-ghost); }
  .list { display: grid; gap: 8px; }
  .item { display: flex; gap: 12px; align-items: flex-start; text-align: left; background: transparent; border: none; padding: 6px 0; cursor: pointer; font-family: inherit; }
  .box { flex: none; margin-top: 1px; line-height: 0; }
  .label { font-size: 13px; line-height: 1.45; color: var(--color-ink-3); }
  .label.done { color: var(--color-ink); }
  .track { height: 4px; background: var(--color-panel-3); margin-top: 16px; position: relative; }
  .fill { position: absolute; top: 0; bottom: 0; left: 0; background: var(--color-ghost); transition: width .3s ease; }

  .cta { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: var(--color-signal); color: var(--color-panel-2); border: 1px solid var(--color-signal); font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; padding: 15px; cursor: pointer; text-decoration: none; box-sizing: border-box; }
  .cta.complete { background: var(--color-ghost); border-color: var(--color-ghost); }
</style>
