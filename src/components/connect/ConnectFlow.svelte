<script>
  // /connect — magic-link identity bridge to data-snack. Config-gated: with no
  // PUBLIC_FIREBASE_* set, shows a calm "not configured" state. One email, no
  // password. The codename is imported and kept (never regenerated).
  import {
    isConfigured, startConnect, completeRedeem, syncProgress, watchIdentity, disconnect,
  } from '../../lib/identity/auth'

  let state = $state('init') // init | config-off | disconnected | sent | connecting | connected | error
  let email = $state('')
  let codename = $state('')
  let error = $state('')
  let syncMsg = $state('')

  let started = false
  $effect(() => {
    if (started) return
    started = true
    if (!isConfigured()) { state = 'config-off'; return }

    const url = new URL(window.location.href)
    const token = url.searchParams.get('token')
    if (token) {
      state = 'connecting'
      completeRedeem(token)
        .then(async (id) => {
          codename = id.codename
          url.searchParams.delete('token')
          history.replaceState({}, '', url.pathname + url.search)
          try { await syncProgress() } catch {}
          state = 'connected'
        })
        .catch((e) => { error = e?.code === 'already-redeemed' ? 'That link was already used — request a new one.' : 'Could not complete the connection. Request a new link.'; state = 'error' })
      return
    }

    return watchIdentity((id) => {
      if (id) { codename = id.codename; state = 'connected' }
      else if (state === 'init') state = 'disconnected'
    })
  })

  async function submit(e) {
    e.preventDefault()
    error = ''
    const value = email.trim()
    if (!value) return
    try { await startConnect(value); state = 'sent' }
    catch (err) { error = err?.code === 'invalid-email' ? 'That email looks invalid.' : 'Could not send the link — try again.' }
  }
  async function doSync() {
    syncMsg = 'Syncing…'
    try { await syncProgress(); syncMsg = 'Progress synced to your crew record.' }
    catch { syncMsg = 'Sync failed — try again.' }
  }
  async function doDisconnect() {
    await disconnect(); codename = ''; syncMsg = ''; state = 'disconnected'
  }
</script>

<div class="cf">
  {#if state === 'init' || state === 'connecting'}
    <p class="muted">{state === 'connecting' ? 'Connecting your identity…' : '…'}</p>

  {:else if state === 'config-off'}
    <div class="panel">
      <div class="k">// IDENTITY</div>
      <p class="lead">Accounts aren't switched on for this deployment yet.</p>
      <p class="muted">Your work is saved locally on this device. When the identity bridge is live, you'll be able to connect here with just your email.</p>
    </div>

  {:else if state === 'disconnected'}
    <form class="panel" onsubmit={submit}>
      <div class="k">// CONNECT</div>
      <p class="lead">Enter the email you use on data-snack.</p>
      <input class="in" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" required />
      <button class="go" type="submit">Send magic link →</button>
      <p class="muted">No password. We email a one-time link that returns you here. Same email on both sites = same identity.</p>
      {#if error}<p class="err">{error}</p>{/if}
    </form>

  {:else if state === 'sent'}
    <div class="panel">
      <div class="k">// CHECK YOUR INBOX</div>
      <p class="lead">A magic link is on its way to <span class="hl">{email}</span>.</p>
      <p class="muted">Open it on this device to finish connecting. The link expires in 15 minutes.</p>
    </div>

  {:else if state === 'connected'}
    <div class="panel ok">
      <div class="k">// CONNECTED</div>
      <p class="lead">You are <span class="hl">{codename || 'connected'}</span>.</p>
      <p class="muted">Your codename carries across DATAVISM and data-snack. Your progress can be saved to your crew record.</p>
      <div class="row">
        <button class="go" type="button" onclick={doSync}>Sync my progress</button>
        <button class="ghost" type="button" onclick={doDisconnect}>Disconnect</button>
      </div>
      {#if syncMsg}<p class="muted ok-msg">{syncMsg}</p>{/if}
    </div>

  {:else if state === 'error'}
    <div class="panel">
      <div class="k">// CONNECTION FAILED</div>
      <p class="lead">{error}</p>
      <button class="go" type="button" onclick={() => { error=''; state='disconnected' }}>Try again →</button>
    </div>
  {/if}
</div>

<style>
  .cf { margin-top: 24px; max-width: 460px; }
  .panel { display: grid; gap: 14px; border: 1px solid var(--color-edge); border-top: 3px solid var(--color-signal); background: var(--color-panel); padding: 22px; }
  .panel.ok { border-top-color: var(--color-line-g); }
  .k { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em; color: var(--color-ink-4); }
  .lead { font-size: clamp(16px, 2.2vw, 20px); line-height: 1.4; color: var(--color-ink); margin: 0; }
  .hl { color: var(--color-line-g); }
  .muted { font-size: 13px; line-height: 1.6; color: var(--color-ink-4); margin: 0; }
  .muted.ok-msg { color: var(--color-line-g); }
  .err { font-size: 13px; color: var(--color-magenta); margin: 0; }
  .in { width: 100%; box-sizing: border-box; background: var(--color-bg); border: 1px solid var(--color-edge-2); color: var(--color-ink); font: inherit; font-size: 15px; padding: 12px; }
  .go { background: var(--color-signal); color: var(--color-panel-2); border: none; font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700; padding: 13px 18px; cursor: pointer; justify-self: start; }
  .ghost { background: transparent; border: 1px solid var(--color-edge-2); color: var(--color-ink-3); font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.06em; padding: 12px 16px; cursor: pointer; }
  .row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
</style>
