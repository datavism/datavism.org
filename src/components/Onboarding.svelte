<script>
  // Onboarding intake (design: Onboarding.dc.html). A 4-step funnel — Welcome →
  // Question → Choose a line → Ready — with its own stepper header and the
  // NetworkMap previewing the chosen line. State is local: { step, question, line }.
  import NetworkMap from './NetworkMap.svelte'

  // non-G lines (k/r/b/v), from lines.ts
  let { lines = [] } = $props()

  let step = $state(0) // 0 welcome · 1 question · 2 line · 3 ready
  let question = $state('')
  let line = $state(null)

  const LABELS = ['WELCOME', 'QUESTION', 'LINE', 'READY']
  const examples = [
    'My weather app feels like an ad. What is it actually collecting and who gets it?',
    'This brand seems to own everything. Who actually owns it, and who profits?',
    "I can't stop scrolling at 2am. What is the feed optimizing for?",
    'The numbers in this report feel off. Do the claims survive their sources?',
  ]

  const chosen = $derived(line ? lines.find((l) => l.id === line) : null)
  const mapSel = $derived(chosen ? chosen.stations[0].id : 'g1')
  const mapLive = $derived(line || 'g')

  function next() {
    if (step === 2 && !line) return
    step = Math.min(3, step + 1)
  }
  function back() { step = Math.max(0, step - 1) }
</script>

<div class="ob">
  <!-- HEADER + STEPPER -->
  <header class="ob-head">
    <div class="brand">
      <svg width="22" height="22" viewBox="-8 -8 146 146" aria-hidden="true">
        <path d="M64,0 a64,64 0 0 1 64,64 v64 c0,0 -16,-12 -32,-12 s-32,12 -32,12 s-16,-12 -32,-12 s-32,12 -32,12 v-64 a64,64 0 0 1 64,-64 z" fill="none" stroke="#ff2a6d" stroke-width="12" opacity="0.9" transform="translate(3,3)" />
        <path d="M64,0 a64,64 0 0 1 64,64 v64 c0,0 -16,-12 -32,-12 s-32,12 -32,12 s-16,-12 -32,-12 s-32,12 -32,12 v-64 a64,64 0 0 1 64,-64 z" fill="none" stroke="#39ff14" stroke-width="10" stroke-linejoin="round" />
        <circle cx="78" cy="64" r="7" fill="#39ff14" /><circle cx="110" cy="64" r="7" fill="#39ff14" />
      </svg>
      <a class="name font-display" href="/">DATAVISM</a>
      <span class="tag">INTAKE</span>
    </div>
    <div class="stepper">
      {#each LABELS as _, i}
        <span class="dot" style={`background:${i <= step ? '#39ff14' : '#20222b'};`}></span>
      {/each}
      <span class="step-label">STEP {step + 1} / 4 · {LABELS[step]}</span>
    </div>
  </header>

  <main class="ob-main">
    <div class="ob-col">
      {#if step === 0}
        <div class="eb green">// ACCESS GRANTED · WELCOME TO THE NETWORK</div>
        <h1 class="font-display h1">YOU ARE<br />THE NODE.</h1>
        <p class="p">You're not enrolling in a course. You're entering a network that turns hidden systems into public evidence. No exit without action — so let's get your first investigation moving.</p>
        <p class="p sub">Three quick steps: <span class="ink">bring a question</span> → <span class="ink">choose a line</span> → <span class="ink">enter G1</span>.</p>
        <div class="actions"><button class="btn green-btn" onclick={next}>Begin intake →</button></div>

      {:else if step === 1}
        <div class="eb yellow">// STEP 01 · BRING A QUESTION</div>
        <h2 class="font-display h2">What system bothers you?</h2>
        <p class="p">Don't aim for a perfect research question. Name the unease — a feed, a price, a tracker, a money trail. The network sharpens it into something testable.</p>
        <textarea class="ta" bind:value={question} placeholder="e.g. My weather app feels like an ad. What is it actually collecting?"></textarea>
        <div class="chips">
          {#each examples as ex}
            <button class="chip" onclick={() => (question = ex)}>{ex.split('.')[0]}.</button>
          {/each}
        </div>
        <div class="nav">
          <button class="btn ghost-btn" onclick={back}>← Back</button>
          <button class="btn yellow-btn" onclick={next}>Choose a line →</button>
        </div>

      {:else if step === 2}
        <div class="eb yellow">// STEP 02 · CHOOSE A LINE</div>
        <h2 class="font-display h2 tight">Everyone starts at G. Then pick a system to ride.</h2>
        <p class="p mb">Line G teaches the method. Your chosen line is where you'll apply it first.</p>
        <div class="split">
          <div class="cards">
            {#each lines as l (l.id)}
              <button class="card" onclick={() => (line = l.id)} style={`border-color:${line === l.id ? l.color.hex : '#20222b'};background:${line === l.id ? '#11121a' : '#0e0f14'};`}>
                <span class="card-code" style={`border-color:${l.color.hex};color:${l.color.hex};`}>{l.code}</span>
                <span class="card-mid">
                  <span class="card-name">{l.name}</span>
                  <span class="card-motto" style={`color:${l.color.hex};`}>{l.motto}</span>
                </span>
                <span class="card-mark" style={`color:${line === l.id ? l.color.hex : '#2c2f3a'};`}>{line === l.id ? '●' : '○'}</span>
              </button>
            {/each}
          </div>
          <div class="card-map">
            <NetworkMap selected={mapSel} liveLine={mapLive} labels={false} accent={chosen ? chosen.color.hex : '#ffd23f'} />
          </div>
        </div>
        <div class="nav">
          <button class="btn ghost-btn" onclick={back}>← Back</button>
          <button class="btn yellow-btn" onclick={next} disabled={!line} style={line ? '' : 'background:#2c2f3a;cursor:not-allowed;opacity:0.6;'}>{line ? 'Confirm path →' : 'Pick a line first'}</button>
        </div>

      {:else}
        <div class="eb green">// INTAKE COMPLETE · YOU'RE IN THE NETWORK</div>
        <h2 class="font-display h2 big">YOUR FIRST<br />STOP: <span class="g">G1</span></h2>
        <div class="summary">
          <div class="sum-card" style="border-left:3px solid #ffd23f;">
            <div class="sum-k">YOUR QUESTION</div>
            <div class="sum-v">{question.trim() || 'A system that bothers you — to be sharpened at G1.'}</div>
          </div>
          <div class="sum-card" style={`border-left:3px solid ${chosen ? chosen.color.hex : '#6b7280'};`}>
            <div class="sum-k">YOUR PATH</div>
            <div class="sum-v"><span class="g">G · Foundation</span> <span class="arrow">→</span> <span style={`color:${chosen ? chosen.color.hex : '#6b7280'};`}>{chosen ? chosen.name : 'Choose your line'}</span></div>
          </div>
        </div>
        <p class="p mb2">G1 · THE FOLDER turns your suspicion into a testable question — and your first Case File. Bring the question. The network teaches the method.</p>
        <div class="actions">
          <a class="btn green-btn" href="/line-g/the-folder">Enter G1 · The Folder →</a>
          <a class="btn ghost-btn" href="/#network">Explore the network →</a>
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  .ob { min-height: 100vh; display: flex; flex-direction: column; }
  .ob-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 28px; border-bottom: 1px solid var(--color-edge); }
  .brand { display: flex; align-items: center; gap: 12px; }
  .name { font-weight: 800; font-size: 15px; letter-spacing: -0.04em; color: var(--color-ink); text-decoration: none; }
  .tag { font-size: 9px; letter-spacing: 0.2em; color: var(--color-ink-5); border-left: 1px solid var(--color-edge); padding-left: 10px; }
  .stepper { display: flex; align-items: center; gap: 10px; }
  .dot { width: 22px; height: 4px; }
  .step-label { font-size: 10px; letter-spacing: 0.12em; color: var(--color-ink-4); margin-left: 6px; }

  .ob-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 28px; }
  .ob-col { width: 100%; max-width: 720px; }

  .eb { font-size: 11px; letter-spacing: 0.2em; margin-bottom: 22px; }
  .eb.green { color: var(--color-ghost); margin-bottom: 24px; }
  .eb.yellow { color: var(--color-signal); }
  .green { color: var(--color-ghost); } .g { color: var(--color-line-g); } .ink { color: var(--color-ink-3); }

  .h1 { font-weight: 800; font-size: clamp(36px, 6vw, 64px); line-height: 0.98; letter-spacing: -0.04em; margin: 0; }
  .h2 { font-weight: 800; font-size: clamp(26px, 4vw, 42px); line-height: 1.02; letter-spacing: -0.035em; margin: 0; }
  .h2.tight { font-size: clamp(24px, 3.6vw, 38px); line-height: 1.04; margin: 0 0 8px; }
  .h2.big { font-size: clamp(30px, 5vw, 56px); line-height: 0.98; letter-spacing: -0.04em; }
  .p { font-size: 16px; line-height: 1.7; color: var(--color-ink-2); margin: 26px 0 0; max-width: 56ch; }
  .p.sub { font-size: 13px; color: var(--color-ink-4); margin-top: 16px; }
  .p.mb { font-size: 13.5px; margin: 0 0 22px; color: var(--color-ink-3); }
  .p.mb2 { font-size: 14px; margin: 0 0 28px; color: var(--color-ink-3); max-width: 52ch; }

  .actions, .nav { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 36px; }
  .nav { margin-top: 28px; }
  .btn { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; padding: 15px 28px; border: none; cursor: pointer; text-decoration: none; }
  .green-btn { background: var(--color-ghost); color: #06120a; }
  .yellow-btn { background: var(--color-signal); color: var(--color-panel-2); padding: 14px 24px; }
  .ghost-btn { background: transparent; border: 1px solid var(--color-edge-2); color: var(--color-ink); font-weight: 600; text-transform: none; letter-spacing: 0.06em; padding: 13px 18px; }

  .ta { width: 100%; min-height: 120px; resize: vertical; background: var(--color-panel); border: 1px solid var(--color-edge-2); color: var(--color-ink); font-family: var(--font-mono); font-size: 15px; line-height: 1.6; padding: 16px; outline: none; margin-top: 22px; }
  .ta:focus { border-color: var(--color-signal); }
  .chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 16px; }
  .chip { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-3); background: transparent; border: 1px dashed var(--color-edge-2); padding: 8px 12px; cursor: pointer; text-align: left; transition: border-color .2s ease, color .2s ease; }
  .chip:hover { border-color: var(--color-ghost); color: var(--color-ink); }

  .split { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; margin-top: 4px; }
  .cards { display: grid; gap: 10px; }
  .card { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; text-align: left; border: 1px solid var(--color-edge); background: var(--color-panel); padding: 15px 16px; cursor: pointer; font-family: inherit; transition: transform .2s ease, border-color .2s ease, background .2s ease; }
  .card:hover { transform: translateY(-3px); }
  .card-code { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 1.5px solid; font-weight: 800; font-size: 17px; }
  .card-name { display: block; font-size: 13px; font-weight: 700; color: var(--color-ink); }
  .card-motto { display: block; font-size: 12px; margin-top: 3px; }
  .card-mark { font-size: 16px; }
  .card-map { border: 1px solid var(--color-edge); background: var(--color-panel-2); padding: 10px; }

  .summary { display: grid; gap: 12px; margin: 28px 0 30px; }
  .sum-card { border: 1px solid var(--color-edge); background: var(--color-panel); padding: 16px 18px; }
  .sum-k { font-size: 10px; letter-spacing: 0.14em; color: var(--color-ink-4); margin-bottom: 7px; }
  .sum-v { font-size: 15px; line-height: 1.5; color: var(--color-ink); }
  .arrow { color: var(--color-ink-5); }

  @media (prefers-reduced-motion: reduce) { .card:hover { transform: none; } }
  @media (max-width: 820px) { .split { grid-template-columns: 1fr; } }
</style>
