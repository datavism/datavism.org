<script>
  // Copy-citation button with a 2s "Copied ✓" confirmation (design §6 rail).
  let { citation = '' } = $props()
  let copied = $state(false)
  let timer

  async function copy() {
    try { await navigator.clipboard.writeText(citation) } catch {}
    copied = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied = false), 2000)
  }
</script>

<button class="copy" class:copied onclick={copy}>
  {copied ? 'Copied ✓' : 'Copy citation'}
</button>

<style>
  .copy {
    display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
    background: transparent; border: 1px solid var(--color-edge-2); color: var(--color-ink);
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 11px; cursor: pointer; transition: border-color .2s ease, color .2s ease;
  }
  .copy.copied { border-color: var(--color-ghost); color: var(--color-ghost); }
</style>
