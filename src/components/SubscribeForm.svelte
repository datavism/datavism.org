<script>
  // Waitlist form. Posts ONE field to our own /api/subscribe (which talks to
  // Resend). Voluntary submission ≠ tracking — the footer claim stays true.
  import { COPY } from '../lib/copy/en'

  let email = $state('')
  let phone = $state('') // honeypot — humans never see or fill this
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
      else status = 'down'
    } catch {
      status = 'down'
    }
  }
</script>

{#if status === 'ok'}
  <p class="text-signal mt-4">&gt; {COPY.waitlist.ok}</p>
{:else}
  <form class="mt-4 flex flex-col sm:flex-row gap-2" onsubmit={submit}>
    <label class="sr-only" for="waitlist-email">Email</label>
    <input
      id="waitlist-email"
      type="email"
      name="email"
      bind:value={email}
      placeholder={COPY.waitlist.placeholder}
      required
      autocomplete="email"
      class="flex-1 bg-transparent border border-phosphor-dim/60 rounded px-3 py-2
             text-phosphor-hi placeholder:text-phosphor-dim/70
             focus:outline-none focus:border-signal"
    />
    <!-- honeypot: hidden from humans, bots fill it -->
    <input
      type="text"
      name="phone"
      bind:value={phone}
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
      class="hidden"
    />
    <button
      type="submit"
      disabled={status === 'busy'}
      class="border border-signal text-signal rounded px-4 py-2 font-bold
             hover:bg-signal hover:text-ink transition-colors
             disabled:opacity-50 disabled:cursor-wait"
    >
      {status === 'busy' ? COPY.waitlist.sending : COPY.waitlist.button}
    </button>
  </form>
  {#if status === 'invalid'}
    <p class="text-line-b text-xs mt-2">&gt; {COPY.waitlist.errInvalid}</p>
  {:else if status === 'notwired'}
    <p class="text-phosphor-dim text-xs mt-2">&gt; {COPY.waitlist.errNotWired}</p>
  {:else if status === 'down'}
    <p class="text-line-b text-xs mt-2">&gt; {COPY.waitlist.errServer}</p>
  {/if}
{/if}
