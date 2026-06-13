<script lang="ts">
  import { onMount } from 'svelte'
  import { loadTicket } from '../lib/ticket-storage'
  import { emptyTicket, type Ticket } from '../lib/ticket'
  import { COPY } from '../lib/copy/en'

  const T = COPY.ticket
  let ticket = $state<Ticket>(emptyTicket())
  onMount(() => { ticket = loadTicket() })
</script>

{#if ticket.completedStations.length === 0}
  <p class="text-phosphor-dim mt-6">&gt; {T.empty}</p>
{:else}
  <div class="mt-6 border border-dashed border-phosphor-dim/60 rounded p-5 font-mono">
    <p class="text-phosphor-hi font-bold">DATAVISM · LINE G</p>
    <hr class="border-phosphor-dim/30 my-3" />
    <ul class="space-y-1">
      {#each ticket.completedStations as id}
        <li class="flex justify-between gap-4">
          <span class="text-phosphor">{id}</span>
          <span class="text-signal">{T.stationDone} ✓</span>
        </li>
      {/each}
    </ul>
    <hr class="border-phosphor-dim/30 my-3" />
    <p class="text-phosphor-dim text-xs">{COPY.lineG.stamp}</p>
  </div>
{/if}
