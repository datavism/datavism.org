<script lang="ts">
  // Binary self-checks → when all are ticked, self-stamp the ticket.
  // Honest wording: the stamp says "self-stamped" (GHOST-eval is a later phase).
  import { onMount } from 'svelte'
  import { stampAndSave, loadTicket } from '../lib/ticket-storage'

  let {
    stationId,
    checks = [],
    artifactName = 'Case File',
    stampWord = 'self-stamped',
  }: {
    stationId: string
    checks?: string[]
    artifactName?: string
    stampWord?: string
  } = $props()

  let ticked = $state<boolean[]>(checks.map(() => false))
  let stamped = $state(false)
  let when = $state('')

  const allDone = $derived(ticked.every(Boolean))

  onMount(() => {
    const t = loadTicket()
    if (t.completedStations.includes(stationId)) {
      stamped = true
      when = t.stamps[stationId] ?? ''
      ticked = checks.map(() => true)
    }
  })

  function stamp() {
    if (!allDone || stamped) return
    const t = stampAndSave(stationId)
    stamped = true
    when = t.stamps[stationId] ?? ''
  }
</script>

<ul class="space-y-2">
  {#each checks as label, i}
    <li>
      <label class="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={ticked[i]} disabled={stamped}
               class="mt-1 accent-[var(--color-signal)]" />
        <span class="text-phosphor">{label}</span>
      </label>
    </li>
  {/each}
</ul>

{#if stamped}
  <p class="text-signal font-bold mt-4">&gt; {artifactName} — {stampWord} ✓</p>
  {#if when}<p class="text-phosphor-dim text-xs mt-1">stamped {when}</p>{/if}
{:else}
  <button
    onclick={stamp}
    disabled={!allDone}
    class="mt-4 border border-signal text-signal rounded px-4 py-2 font-bold
           hover:bg-signal hover:text-ink transition-colors
           disabled:opacity-40 disabled:cursor-not-allowed">
    Stamp {artifactName}
  </button>
{/if}
