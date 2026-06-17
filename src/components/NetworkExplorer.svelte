<script>
  // Landing interactive: the Network section (map board + station detail rail +
  // network key) and the Five Lines section share one `selected` station so a
  // click anywhere — a node, a key swatch, a line-card station — drives the
  // detail panel. Data comes from src/lib/curriculum/lines.ts (prop, not hardcoded).
  import NetworkMap from './NetworkMap.svelte'

  let { lines = [], accent = '#ffd23f' } = $props()

  let selected = $state('g1')

  const STATUS = {
    open: { label: 'OPENS FIRST', color: '#ffd23f' },
    announced: { label: 'ANNOUNCED', color: '#f5b700' },
    locked: { label: 'LOCKED', color: '#6b7280' },
  }

  const flat = lines.flatMap((L) =>
    L.stations.map((s) => ({
      ...s,
      lineId: L.id, lineCode: L.code, lineName: L.name, lineColor: L.color.hex,
    })),
  )

  const sel = $derived.by(() => {
    const s = flat.find((x) => x.id === selected) || flat[0]
    const m = STATUS[s.status] || STATUS.locked
    return { ...s, statusLabel: m.label, statusColor: m.color }
  })

  function pick(id) { selected = id }
</script>

<!-- ——— 01 · THE NETWORK ——— -->
<section id="network" class="sec">
  <div class="sec-head">
    <div class="sec-title"><span class="num">01</span><h2 class="font-display h2">The Network</h2></div>
    <p class="sec-desc">Octolinear diagram · click any station to read its brief · every line terminates in a public Case File at the Ghost interchange.</p>
  </div>

  <div class="maprail">
    <div class="board">
      <div class="noise"></div>
      <div class="scanlines"></div>
      <div class="sweep"></div>
      <div class="word-wrap"><span class="word font-display">DATAVISM</span></div>
      <div class="board-label">// DATAVISM · NETWORK DIAGRAM · NOT TO SCALE</div>
      <div class="board-map">
        <NetworkMap selected={selected} onSelect={pick} {accent} dimInactive={true} liveLine="g" />
      </div>
    </div>

    <div class="rail">
      <aside class="detail" style={`border-top:3px solid ${sel.lineColor};`}>
        <div class="detail-top">
          <span style={`color:${sel.lineColor};`}>{sel.lineCode} · {sel.lineName}</span>
          <span class="badge" style={`border-color:${sel.statusColor};color:${sel.statusColor};`}>{sel.statusLabel}</span>
        </div>
        <div class="detail-id">
          <span class="code" style={`background:${sel.lineColor};`}>{sel.code}</span>
          <h3 class="font-display title">{sel.title}</h3>
        </div>
        <p class="cq">{sel.coreQuestion}</p>
        <p class="learns">{sel.learns}</p>
        <div class="detail-grid">
          <div><div class="k">SKILL</div><div class="v">{sel.skill}</div></div>
          <div><div class="k">ARTIFACT</div><div class="v art" style={`color:${sel.lineColor};`}>{sel.artifact}</div></div>
        </div>
      </aside>

      <div class="key">
        <div class="key-h">NETWORK KEY</div>
        <div class="key-lines">
          {#each lines as L (L.id)}
            <button class="key-line" onclick={() => pick(L.stations[0].id)}>
              <span class="sw" style={`background:${L.color.hex};`}></span>
              <span class="key-label">{L.code} · {L.shortName}</span>
            </button>
          {/each}
        </div>
        <div class="legend">
          <span class="lg"><span class="lg-dot ring"></span>STATION · A CAPABILITY</span>
          <span class="lg"><span class="lg-inter"><span></span></span>GHOST · INTERCHANGE</span>
          <span class="lg"><span class="lg-dot open"></span>OPEN · STARTS HERE</span>
          <span class="lg"><span class="lg-dot locked"></span>LOCKED · NOT YET RUNNING</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ——— 02 · THE FIVE LINES ——— -->
<section id="lines" class="sec sec-top">
  <div class="sec-head">
    <div class="sec-title"><span class="num">02</span><h2 class="font-display h2">The Five Lines</h2></div>
    <p class="sec-desc">LINE G + one thematic line = your first full investigation. Learn the method, then choose a system to ride.</p>
  </div>

  <div class="cards">
    {#each lines as L (L.id)}
      <article class="lcard">
        <div class="lcard-left">
          <div class="lcard-id">
            <span class="lcard-badge" style={`background:${L.color.hex};`}>{L.code}</span>
            <div>
              <div class="lcard-name">{L.name}</div>
              <div class="lcard-motto" style={`color:${L.color.hex};`}>{L.motto}</div>
            </div>
          </div>
          <p class="lcard-cq">{L.coreQuestion}</p>
          <div class="lcard-meta">
            <div><span class="ml">SYSTEM</span><br><span style={`color:${L.color.hex};`}>{L.system}</span></div>
            <div><span class="ml">CASE FILE</span><br><span class="ink">{L.finalArtifact}</span></div>
          </div>
        </div>
        <div class="strip">
          <div class="strip-rail" style={`background:${L.color.hex};`}></div>
          {#each L.stations as s (s.id)}
            <button class="stn" onclick={() => pick(s.id)}>
              <span class="stn-dot"
                style={`background:${s.status === 'open' ? L.color.hex : '#11121a'};border:3px ${s.status === 'locked' ? 'dashed' : 'solid'} ${L.color.hex};`}></span>
              <div class="stn-code" style={`color:${L.color.hex};opacity:${s.status === 'locked' ? 0.62 : 1};`}>{s.code}</div>
              <div class="stn-title" style={`color:${s.status === 'locked' ? '#6b7280' : '#a7ada3'};`}>{s.title}</div>
              <div class="stn-art">{s.artifact}</div>
            </button>
          {/each}
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  .sec { max-width: 1560px; margin: 0 auto; padding: 40px 30px 76px; }
  .sec-top { padding: 60px 30px; border-top: 1px solid var(--color-edge); }
  .sec-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 22px; border-bottom: 1px solid var(--color-edge); padding-bottom: 18px; }
  .sec-top .sec-head { margin-bottom: 36px; }
  .sec-title { display: flex; align-items: baseline; gap: 16px; }
  .num { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.16em; color: var(--color-ink-4); }
  .h2 { font-weight: 800; font-size: clamp(26px, 3.4vw, 42px); line-height: 1; letter-spacing: -0.01em; margin: 0; text-transform: uppercase; color: var(--color-ink); }
  .sec-desc { font-family: var(--font-mono); font-size: 11.5px; line-height: 1.7; color: var(--color-ink-4); max-width: 44ch; text-align: right; margin: 0; }

  .maprail { display: grid; grid-template-columns: 1fr 360px; gap: 22px; align-items: stretch; }
  /* Monochrome board: neutral near-black, rounded corners — the background is
     pure 80s analog-TV snow. (The map's own line colours sit on top, z-1.) */
  .board { position: relative; border: 1px solid var(--color-edge); border-radius: 44px; background: radial-gradient(130% 100% at 50% 45%, #141416, #08080a 72%); overflow: hidden; min-height: 420px; container-type: inline-size; }
  /* Animated 80s analog-TV snow. Uses a REAL grayscale noise PNG tile
     (public/tv-noise.png) instead of an SVG filter, so it renders identically
     in EVERY browser. Performant: the tile is decoded once and the animation
     only steps background-position to uncorrelated crops (compositor-only). */
  .noise {
    position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.3;
    background-image: url('/tv-noise.png?v=3');
    /* 64px tile upscaled 4× with nearest-neighbour → chunky ~4px grain */
    background-size: 256px 256px;
    image-rendering: pixelated;
    animation: dv-noise 1.05s steps(1, end) infinite;
  }
  @keyframes dv-noise {
    0%   { background-position: 0 0; }
    10%  { background-position: -120px 60px; }
    20%  { background-position: 90px -130px; }
    30%  { background-position: -180px -40px; }
    40%  { background-position: 60px 150px; }
    50%  { background-position: -90px 110px; }
    60%  { background-position: 170px 40px; }
    70%  { background-position: -150px -120px; }
    80%  { background-position: 110px -170px; }
    90%  { background-position: -60px 90px; }
    100% { background-position: 0 0; }
  }
  /* faint CRT scanlines */
  .scanlines { position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.5; background: repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.018) 0 1px, transparent 1px 3px); }
  /* slow white roll bar (analog vertical-hold feel), monochrome */
  .sweep { position: absolute; left: 0; right: 0; top: 0; height: 22%; pointer-events: none; z-index: 0; background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.04) 55%, transparent); animation: dv-sweep 11s linear infinite; }
  @keyframes dv-sweep { 0% { transform: translateY(-130%); } 100% { transform: translateY(420%); } }
  @media (prefers-reduced-motion: reduce) { .noise { animation: none; } .sweep { display: none; } }
  .word-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 0; overflow: hidden; }
  /* Cinematic backdrop: the whole DATAVISM wordmark, sized to the board width
     (cqw) so it never zooms past 100% of the board. It breathes between full
     width and a little smaller — barely readable, just texture. */
  .word {
    font-weight: 800; font-size: 17.5cqw; letter-spacing: -0.03em; color: var(--color-ink);
    white-space: nowrap; transform-origin: center; opacity: 0.02; will-change: transform, opacity;
    animation: dv-cine 26s ease-in-out infinite;
  }
  @keyframes dv-cine {
    0%, 100% { transform: scale(0.68); opacity: 0.012; }
    50%      { transform: scale(1);    opacity: 0.028; }
  }
  @media (prefers-reduced-motion: reduce) {
    .word { animation: none; transform: scale(1); opacity: 0.02; }
  }
  .board-label { position: absolute; top: 14px; left: 16px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; color: var(--color-ink-5); z-index: 2; }
  .board-map { position: relative; z-index: 1; padding: 10px; }

  .rail { display: flex; flex-direction: column; gap: 16px; }
  .detail { border: 1px solid var(--color-edge); background: var(--color-panel-3); padding: 22px 22px 24px; flex: 1; }
  .detail-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.12em; }
  .badge { border: 1px solid; padding: 3px 8px; }
  .detail-id { display: flex; align-items: center; gap: 13px; margin: 20px 0 4px; }
  .code { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 36px; padding: 0 9px; color: #0b0c10; font-weight: 900; font-size: 19px; letter-spacing: 0.02em; }
  .title { font-weight: 800; font-size: 25px; letter-spacing: -0.01em; text-transform: uppercase; margin: 0; color: var(--color-ink); line-height: 1; }
  .cq { font-style: italic; font-weight: 500; font-size: 19px; line-height: 1.25; color: var(--color-ink); margin: 18px 0 16px; }
  .learns { font-size: 14px; line-height: 1.55; color: var(--color-ink-3); margin: 0 0 20px; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; border-top: 1px solid var(--color-edge); padding-top: 16px; }
  .detail-grid .k { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.12em; color: var(--color-ink-5); margin-bottom: 5px; }
  .detail-grid .v { font-size: 12.5px; line-height: 1.45; color: var(--color-ink-3); }
  .detail-grid .art { font-family: var(--font-mono); line-height: 1.4; }

  .key { border: 1px solid var(--color-edge); background: var(--color-panel-3); padding: 18px 20px; }
  .key-h { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; color: var(--color-ink-5); margin-bottom: 14px; }
  .key-lines { display: grid; gap: 11px; }
  .key-line { display: flex; align-items: center; gap: 12px; background: transparent; border: none; padding: 0; cursor: pointer; text-align: left; font-family: inherit; }
  .sw { width: 26px; height: 4px; border-radius: 2px; flex: none; }
  .key-label { font-weight: 700; font-size: 13px; color: var(--color-ink); letter-spacing: 0.01em; }
  .key-line:hover .key-label { color: #fff; }
  .legend { display: grid; gap: 9px; border-top: 1px solid var(--color-edge); margin-top: 16px; padding-top: 14px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em; color: var(--color-ink-4); }
  .lg { display: inline-flex; align-items: center; gap: 9px; }
  .lg-dot { width: 11px; height: 11px; border-radius: 50%; flex: none; }
  .lg-dot.ring { border: 2.5px solid var(--color-ink-3); background: var(--color-panel-2); }
  .lg-dot.open { background: var(--color-signal); }
  .lg-dot.locked { border: 2.5px dashed var(--color-ink-5); }
  .lg-inter { display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px; border: 1.5px solid var(--color-ink-3); border-radius: 50%; flex: none; }
  .lg-inter span { width: 5px; height: 5px; border-radius: 50%; background: var(--color-ink-3); }

  .cards { display: grid; gap: 14px; }
  .lcard { border: 1px solid var(--color-edge); background: var(--color-panel-3); padding: 24px 26px; display: grid; grid-template-columns: 300px 1fr; gap: 30px; align-items: start; }
  .lcard-id { display: flex; align-items: center; gap: 13px; margin-bottom: 16px; }
  .lcard-badge { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; color: #0b0c10; font-weight: 900; font-size: 24px; flex: none; }
  .lcard-name { font-weight: 800; font-size: 17px; letter-spacing: 0.01em; text-transform: uppercase; color: var(--color-ink); line-height: 1.05; }
  .lcard-motto { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.08em; margin-top: 5px; }
  .lcard-cq { font-style: italic; font-weight: 500; font-size: 18px; line-height: 1.25; color: var(--color-ink-2); margin: 14px 0 16px; }
  .lcard-meta { display: flex; gap: 24px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.04em; }
  .ml { color: var(--color-ink-5); }
  .lcard-meta .ink { color: var(--color-ink); }
  .strip { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); align-items: start; padding-top: 6px; }
  .strip-rail { position: absolute; left: 0; right: 0; top: 12px; height: 3px; opacity: 0.85; }
  .stn { position: relative; text-align: left; background: transparent; border: none; padding: 0 12px 0 0; cursor: pointer; font-family: inherit; }
  .stn-dot { position: relative; z-index: 1; display: block; width: 14px; height: 14px; border-radius: 50%; margin-bottom: 14px; }
  .stn-code { font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; letter-spacing: 0.04em; }
  .stn-title { font-family: var(--font-mono); font-size: 10.5px; line-height: 1.3; margin-top: 6px; letter-spacing: 0.01em; }
  .stn-art { font-family: var(--font-mono); font-size: 9px; color: var(--color-ink-5); margin-top: 8px; }

  @media (max-width: 1080px) {
    .maprail { grid-template-columns: 1fr; }
    .lcard { grid-template-columns: 1fr; }
    .sec-desc { text-align: left; }
  }
</style>
