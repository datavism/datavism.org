<script>
  // GHOST chat — talks to the /api/ghost proxy (Gemini, server-side key). History
  // is kept IN MEMORY ONLY (cleared on reload) — no chat logs in localStorage, no
  // tracking. GHOST is an AI assistant, labeled as such; it does not replace your
  // judgment.
  let messages = $state([]) // { role: 'user' | 'assistant', content }
  let input = $state('')
  let busy = $state(false)
  let offline = $state(false)
  let error = $state('')
  let log = $state(null)

  $effect(() => {
    // autoscroll on new message
    void messages.length
    if (log) log.scrollTop = log.scrollHeight
  })

  async function send(e) {
    e?.preventDefault?.()
    const text = input.trim()
    if (!text || busy) return
    error = ''
    const next = [...messages, { role: 'user', content: text }]
    messages = next
    input = ''
    busy = true
    try {
      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      if (res.status === 503) { offline = true; return }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        error = data?.error === 'safety-blocked'
          ? 'GHOST declined that one. Keep it to the method.'
          : data?.error === 'too-long'
            ? 'That is too long — trim it down.'
            : 'GHOST hit an error. Try again.'
        return
      }
      messages = [...next, { role: 'assistant', content: data.reply }]
    } catch {
      error = 'Network error — try again.'
    } finally {
      busy = false
    }
  }
</script>

<div class="gc">
  {#if offline}
    <div class="panel off">
      <div class="k">// GHOST OFFLINE</div>
      <p class="lead">GHOST isn't switched on for this deployment yet.</p>
      <p class="muted">The agent needs a server key. The method is still yours to walk — start at <a class="link" href="/line-g/the-folder">G1 · THE FOLDER</a>.</p>
    </div>
  {:else}
    <div class="log" bind:this={log}>
      {#if messages.length === 0}
        <p class="hello">A vague feeling is a poor witness. Tell me what you noticed — I'll help you turn it into a question you can test.</p>
      {/if}
      {#each messages as m, i (i)}
        <div class="msg {m.role}">
          <span class="who">{m.role === 'assistant' ? 'GHOST' : 'YOU'}</span>
          <p class="text">{m.content}</p>
        </div>
      {/each}
      {#if busy}<div class="msg assistant"><span class="who">GHOST</span><p class="text dim">thinking…</p></div>{/if}
    </div>

    {#if error}<p class="err">{error}</p>{/if}

    <form class="bar" onsubmit={send}>
      <textarea
        class="in"
        bind:value={input}
        rows="2"
        placeholder="Ask GHOST about the method, or sharpen a question…"
        onkeydown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
      ></textarea>
      <button class="go" type="submit" disabled={busy || !input.trim()}>Send →</button>
    </form>
    <p class="disclaimer">GHOST is an AI assistant. It can be wrong, and it does not replace your judgment — verify before you publish.</p>
  {/if}
</div>

<style>
  .gc { margin-top: 24px; max-width: 720px; }
  .panel { display: grid; gap: 12px; border: 1px solid var(--color-edge); border-top: 3px solid var(--color-line-g); background: var(--color-panel); padding: 22px; }
  .k { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em; color: var(--color-ink-4); }
  .lead { font-size: clamp(16px, 2.2vw, 20px); line-height: 1.4; color: var(--color-ink); margin: 0; }
  .muted { font-size: 13px; line-height: 1.6; color: var(--color-ink-4); margin: 0; }
  .link { color: var(--color-line-g); }
  .log { display: grid; gap: 16px; max-height: 52vh; overflow-y: auto; border: 1px solid var(--color-edge); background: var(--color-panel-2); padding: 20px; }
  .hello { font-size: 14px; line-height: 1.6; color: var(--color-ink-3); margin: 0; font-style: italic; }
  .msg { display: grid; gap: 5px; }
  .who { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.14em; }
  .msg.assistant .who { color: var(--color-line-g); }
  .msg.user .who { color: var(--color-signal); }
  .text { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--color-ink); white-space: pre-wrap; }
  .text.dim { color: var(--color-ink-4); }
  .err { font-size: 13px; color: var(--color-magenta); margin: 10px 0 0; }
  .bar { display: flex; gap: 10px; align-items: stretch; margin-top: 14px; }
  .in { flex: 1; box-sizing: border-box; background: var(--color-bg); border: 1px solid var(--color-edge-2); color: var(--color-ink); font: inherit; font-size: 15px; line-height: 1.5; padding: 12px; resize: vertical; }
  .go { background: var(--color-signal); color: var(--color-panel-2); border: none; font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700; padding: 0 18px; cursor: pointer; }
  .go:disabled { opacity: 0.4; cursor: not-allowed; }
  .disclaimer { font-size: 11.5px; line-height: 1.55; color: var(--color-ink-5); margin: 12px 0 0; }
</style>
