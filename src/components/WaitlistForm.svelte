<script>
  // Waitlist form. Posts ONE field (+ honeypot) to our own /api/subscribe,
  // which proxies the shared double-opt-in backend. Voluntary submission ≠
  // tracking — the no-tracking promise stays true.
  //   variant: 'hero' (left-aligned, on panel) | 'band' (centered, on bg)

  let { variant = 'hero' } = $props()

  let email = $state('')
  let phone = $state('') // honeypot
  let status = $state('idle') // idle | busy | ok | invalid | notwired | down

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  async function submit(e) {
    e.preventDefault()
    const addr = email.trim().toLowerCase()
    if (!EMAIL_RE.test(addr) || addr.length > 254) {
      status = 'invalid'
      return
    }
    status = 'busy'
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: addr, phone }),
      })
      if (res.ok) status = 'ok'
      else if (res.status === 503) status = 'notwired'
      else if (res.status === 400) status = 'invalid'
      else status = 'down'
    } catch {
      status = 'down'
    }
  }

  const center = $derived(variant === 'band')
  const okText = $derived(
    variant === 'band'
      ? "You're on the list. Mind the signal."
      : "You're on the list. Mind the signal — we ping you when Line G opens.",
  )
</script>

{#if status === 'ok'}
  <div class="ok" class:band={variant === 'band'}><span class="dot">◆</span> {okText}</div>
{:else}
  <form class="row" class:center onsubmit={submit}>
    <label class="sr-only" for={`wl-${variant}`}>Email address</label>
    <input
      id={`wl-${variant}`}
      type="email"
      name="email"
      bind:value={email}
      placeholder="you@domain.com"
      required
      autocomplete="email"
      class="input"
      class:band={variant === 'band'}
      oninput={() => { if (status !== 'idle' && status !== 'busy') status = 'idle' }}
    />
    <input type="text" name="phone" bind:value={phone} tabindex="-1" autocomplete="off" aria-hidden="true" class="hp" />
    <button type="submit" class="btn" data-magnetic="0.2" disabled={status === 'busy'}>
      {status === 'busy' ? 'Joining…' : 'Join the waitlist →'}
    </button>
  </form>
  {#if status === 'invalid'}
    <div class="msg err" class:center>Enter a valid email address.</div>
  {:else if status === 'notwired'}
    <div class="msg muted" class:center>Waitlist isn't wired up yet — try again soon.</div>
  {:else if status === 'down'}
    <div class="msg err" class:center>The wire is down. Try again in a moment.</div>
  {/if}
{/if}

<style>
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
  .hp { display: none; }
  .row { display: flex; flex-wrap: wrap; gap: 10px; }
  .row.center { justify-content: center; }
  .input {
    flex: 1; min-width: 220px; background: var(--color-panel); border: 1px solid var(--color-edge-2);
    color: var(--color-ink); font-family: var(--font-mono); font-size: 14px; padding: 14px 16px; outline: none;
  }
  .input.band { background: var(--color-bg); padding: 15px 16px; }
  .input::placeholder { color: var(--color-ink-4); }
  .input:focus { border-color: var(--color-signal); }
  .btn {
    font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.08em; text-transform: uppercase;
    font-weight: 700; padding: 14px 24px; background: var(--color-signal); color: var(--color-panel-2);
    border: none; cursor: pointer; white-space: nowrap; transition: background .2s ease;
  }
  .row.center .btn { padding: 15px 26px; }
  .btn:hover { background: var(--color-signal-hi); }
  .btn:disabled { opacity: 0.6; cursor: wait; }
  .msg { font-family: var(--font-mono); font-size: 12px; margin-top: 10px; }
  .msg.center { text-align: center; }
  .err { color: var(--color-danger); }
  .muted { color: var(--color-ink-4); }
  .ok {
    display: flex; align-items: center; gap: 10px; border: 1px solid var(--color-edge-2);
    border-left: 3px solid var(--color-ghost); background: var(--color-panel); padding: 14px 16px;
    font-family: var(--font-mono); font-size: 13.5px; line-height: 1.45; color: var(--color-ink);
  }
  .ok.band { border-left: 1px solid var(--color-edge-2); border-top: 3px solid var(--color-ghost); background: var(--color-bg); justify-content: center; padding: 18px 20px; font-size: 14px; }
  .ok .dot { color: var(--color-ghost); }
</style>
