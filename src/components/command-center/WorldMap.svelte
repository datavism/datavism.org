<script lang="ts">
  // src/components/command-center/WorldMap.svelte
  // Global Investigation Map — cinematic ops-room centerpiece.
  // d3-geo NaturalEarth projection · SVG country paths · glowing case nodes
  // · active-operation reticle · animated boot sequence.
  // No GSAP — CSS + SVG animation only.

  import { onMount } from 'svelte'
  import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo'
  import { feature } from 'topojson-client'
  import type { Topology } from 'topojson-specification'
  import { LAUNCHPAD_CASES } from '../../lib/line-g-opening/cases'
  import { GEO, ACTIVE_ID, SIGNAL_COLOR } from '../../lib/command-center/geo'

  // ── props ──────────────────────────────────────────────────────
  let { chrome = true, onselect }: { chrome?: boolean; onselect?: (id: string) => void } = $props()

  // ── merged case nodes (static, computed once at module load) ──
  interface CaseNode {
    id: string
    signal: string
    lat: number
    lng: number
    label: string
    active: boolean
  }

  const CASE_NODES: CaseNode[] = LAUNCHPAD_CASES
    .filter(c => GEO[c.id])
    .map(c => ({
      id: c.id,
      signal: c.systemSignal,
      ...GEO[c.id],
      active: c.id === ACTIVE_ID,
    }))

  // ── container / projection state ──────────────────────────────
  let svgEl: SVGSVGElement
  let w = $state(960)
  let h = $state(540)

  // ── world geometry ────────────────────────────────────────────
  let landPaths = $state<string[]>([])
  let borderPaths = $state<string[]>([])
  let graticulePath = $state('')
  let loaded = $state(false)

  // ── projected node positions ──────────────────────────────────
  interface ProjectedNode extends CaseNode {
    x: number
    y: number
  }
  let nodes = $state<ProjectedNode[]>([])

  // ── connection arcs (quadratic Bezier) ───────────────────────
  interface Arc { d: string; color: string }
  let arcs = $state<Arc[]>([])

  // ── boot animation state ──────────────────────────────────────
  let bootDone = $state(false)   // final settled state
  let visibleNodes = $state<Set<string>>(new Set())

  // ── resize observer ───────────────────────────────────────────
  let containerEl: HTMLDivElement

  function buildProjection(width: number, height: number) {
    return geoNaturalEarth1()
      .scale(width / 6.0)
      .translate([width / 2, height / 2])
  }

  function buildPaths(width: number, height: number, topo: Topology) {
    const proj = buildProjection(width, height)
    const path = geoPath(proj)

    // Countries as individual features for stroke rendering
    const countries = feature(topo, (topo as any).objects.countries)
    const borders   = feature(topo, (topo as any).objects.land)

    landPaths   = (countries as any).features.map((f: any) => path(f) ?? '')
    borderPaths = [(path(borders) ?? '')]
    graticulePath = path(geoGraticule().step([20, 20])()) ?? ''

    // Project each case node
    nodes = CASE_NODES.map(c => {
      const pt = proj([c.lng, c.lat])!
      return { ...c, x: pt[0], y: pt[1] }
    })

    // Build connection arcs between thematically linked nodes
    arcs = buildArcs(nodes)
  }

  function buildArcs(ns: ProjectedNode[]): Arc[] {
    const find = (id: string) => ns.find(n => n.id === id)
    const arc = (a: ProjectedNode | undefined, b: ProjectedNode | undefined, color: string): Arc | null => {
      if (!a || !b) return null
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2 - Math.abs(b.x - a.x) * 0.28
      return { d: `M ${a.x},${a.y} Q ${mx},${my} ${b.x},${b.y}`, color }
    }
    return [
      arc(find('lobby-register-de'),        find('lobby-facts-eu'),                    '#ffd23f'),
      arc(find('lobby-register-de'),        find('open-ownership-beneficial'),          '#ffd23f'),
      arc(find('exodus-privacy-trackers'),  find('dsa-transparency-db'),               '#00ffff'),
      arc(find('gdelt-media-power'),        find('ranking-digital-rights'),            '#ff2af0'),
      arc(find('climate-trace-emissions'),  find('global-forest-watch-deforestation'), '#aa44ff'),
      arc(find('global-carbon-budget'),     find('edgar-ghg-emissions'),               '#aa44ff'),
    ].filter(Boolean) as Arc[]
  }

  // ── node label visibility heuristic ──────────────────────────
  // Show labels for "large" nodes (active + a curated 7 others)
  const LABELLED = new Set([
    'lobby-register-de',
    'data-brokers-ca',
    'gdelt-media-power',
    'ukraine-prozorro',
    'india-myneta-criminal-wealth',
    'icij-offshore-leaks',
    'global-forest-watch-deforestation',
    'opensanctions-global-power',
  ])

  // ── boot sequence ─────────────────────────────────────────────
  async function runBootSequence() {
    // All non-active nodes fade in staggered over 2.5s
    const nonActive = CASE_NODES.filter(c => !c.active)
    for (let i = 0; i < nonActive.length; i++) {
      await delay(42)
      visibleNodes = new Set([...visibleNodes, nonActive[i].id])
    }
    // Active op locks on last with a slight dramatic pause
    await delay(400)
    visibleNodes = new Set([...visibleNodes, ACTIVE_ID])
    await delay(200)
    bootDone = true
  }

  function delay(ms: number) {
    return new Promise<void>(r => setTimeout(r, ms))
  }

  // ── init ──────────────────────────────────────────────────────
  onMount(async () => {
    // Observe container size for responsiveness
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const rect = e.contentRect
        if (rect.width > 0) {
          w = rect.width
          h = rect.height || rect.width * (9 / 16)
          if (loaded) buildPaths(w, h, (window as any).__worldTopo)
        }
      }
    })
    ro.observe(containerEl)

    // Load world atlas topology
    const res = await fetch('/world-atlas/countries-110m.json')
    const topo: Topology = await res.json()
    ;(window as any).__worldTopo = topo

    // First measurement
    const rect = containerEl.getBoundingClientRect()
    w = rect.width || 960
    h = rect.height || w * (9 / 16)

    buildPaths(w, h, topo)
    loaded = true

    await delay(100)
    runBootSequence()

    return () => ro.disconnect()
  })

  // (re-projection on resize is handled non-reactively in the ResizeObserver
  //  above; a $effect here would read+write `nodes` and loop — do not add one.)

  // ── helpers ───────────────────────────────────────────────────
  function nodeR(c: CaseNode): number {
    return c.active ? 8 : 5
  }

  function pulseDelay(i: number): string {
    return `${(i * 0.37) % 3}s`
  }

  let now = $state(new Date())
  onMount(() => {
    const id = setInterval(() => { now = new Date() }, 1000)
    return () => clearInterval(id)
  })

  function formatTime(d: Date) {
    return d.toISOString().slice(11, 19) + ' UTC'
  }
</script>

<!-- ── outer container ──────────────────────────────────────── -->
<div
  bind:this={containerEl}
  class="world-map-wrap"
  aria-label="Global Investigation Map"
>

  <!-- ── scanlines + vignette ─────────────────────────────────── -->
  <div class="scanlines" aria-hidden="true"></div>
  <div class="vignette"  aria-hidden="true"></div>

  {#if chrome}
  <!-- ── HUD corner brackets ──────────────────────────────────── -->
  <div class="hud-corner hud-tl" aria-hidden="true"></div>
  <div class="hud-corner hud-tr" aria-hidden="true"></div>
  <div class="hud-corner hud-bl" aria-hidden="true"></div>
  <div class="hud-corner hud-br" aria-hidden="true"></div>

  <!-- ── HUD labels ───────────────────────────────────────────── -->
  <div class="hud-label hud-label-tl" aria-hidden="true">
    <span class="hud-mark">&#9698;</span> GLOBAL INVESTIGATION MAP
  </div>
  <div class="hud-label hud-label-tr" aria-hidden="true">
    <span class="hud-count">{CASE_NODES.length}</span> ACTIVE CASES
    <span class="hud-sep">·</span>
    <span class="hud-clock">{formatTime(now)}</span>
  </div>
  <div class="hud-label hud-label-bl" aria-hidden="true">
    SYS:CIVIL_SIGNAL <span class="hud-sep">·</span> THREAT:FINANCIAL_OPACITY
  </div>
  <div class="hud-label hud-label-br" aria-hidden="true">
    NATURAL_EARTH_1 <span class="hud-sep">·</span> WGS-84
  </div>
  {/if}

  <!-- ── SVG map ──────────────────────────────────────────────── -->
  {#if loaded}
  <svg
    bind:this={svgEl}
    viewBox="0 0 {w} {h}"
    width={w}
    height={h}
    class="world-svg"
    role="img"
    aria-hidden="true"
  >
    <defs>
      <!-- Node glows by signal -->
      <filter id="glow-cyan"    x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-amber"   x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-magenta" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-violet"  x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-green"   x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="9" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-land" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="4"/>
      </filter>

      <!-- Radial heatmap under active op -->
      <radialGradient id="active-heat" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stop-color="#00ff88" stop-opacity="0.18"/>
        <stop offset="60%"  stop-color="#00ff88" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#00ff88" stop-opacity="0"/>
      </radialGradient>

      <!-- Arc dash pattern -->
      <marker id="arc-dot" viewBox="0 0 4 4" refX="2" refY="2" markerWidth="4" markerHeight="4">
        <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.6"/>
      </marker>
    </defs>

    <!-- ── background fill ──────────────────────────────────── -->
    <rect width={w} height={h} fill="#060608"/>

    <!-- ── land shadows (soft atmospheric glow behind continents) -->
    {#each borderPaths as bp}
      <path d={bp} fill="#0bd8c0" opacity="0.08" filter="url(#glow-land)" />
    {/each}

    <!-- ── graticule (faint command grid) ─────────────────── -->
    <path d={graticulePath} fill="none" stroke="#1aa39a" stroke-width="0.3" opacity="0.13" />

    <!-- ── landmasses ──────────────────────────────────────── -->
    {#each landPaths as lp}
      <path d={lp} fill="#13161e" stroke="#283041" stroke-width="0.5" />
    {/each}

    <!-- ── connection arcs ─────────────────────────────────── -->
    {#each arcs as arc, i}
      <path
        d={arc.d}
        fill="none"
        stroke={arc.color}
        stroke-width="0.8"
        opacity="0.25"
        stroke-dasharray="4 6"
        class="map-arc"
        style="animation-delay: {i * 0.6}s"
      />
    {/each}

    <!-- ── nodes ───────────────────────────────────────────── -->
    {#each nodes as node, i}
      {@const color = node.active ? '#00ff88' : (SIGNAL_COLOR[node.signal] ?? '#7a818d')}
      {@const r = nodeR(node)}
      {@const visible = visibleNodes.has(node.id)}

      <g
        class="map-node"
        class:node-visible={visible}
        class:node-clickable={!!onselect}
        style="transform-origin: {node.x}px {node.y}px; animation-delay: {pulseDelay(i)}"
        role={onselect ? 'button' : undefined}
        tabindex={onselect ? 0 : undefined}
        aria-label={onselect ? `Open dossier: ${node.label ?? node.id}` : undefined}
        onclick={() => onselect?.(node.id)}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onselect?.(node.id) } }}
      >
        {#if node.active}
          <!-- Active op heat glow -->
          <circle
            cx={node.x} cy={node.y}
            r={80}
            fill="url(#active-heat)"
            opacity={bootDone ? 1 : 0}
            class="active-heat"
          />

          <!-- Expanding halo ring -->
          <circle
            cx={node.x} cy={node.y}
            r={22}
            fill="none"
            stroke="#00ff88"
            stroke-width="0.8"
            opacity="0.35"
            class="active-halo"
          />

          <!-- Rotating targeting reticle (outer dashed ring) -->
          <circle
            cx={node.x} cy={node.y}
            r={15}
            fill="none"
            stroke="#00ff88"
            stroke-width="1"
            stroke-dasharray="5 3"
            opacity={bootDone ? 0.7 : 0}
            class="reticle-ring"
            style="transform-origin: {node.x}px {node.y}px"
          />

          <!-- Cross-hair lines (horizontal) -->
          <line x1={node.x - 20} y1={node.y} x2={node.x - 9}  y2={node.y}
            stroke="#00ff88" stroke-width="0.8" opacity={bootDone ? 0.6 : 0} class="reticle-cross"/>
          <line x1={node.x + 9}  y1={node.y} x2={node.x + 20} y2={node.y}
            stroke="#00ff88" stroke-width="0.8" opacity={bootDone ? 0.6 : 0} class="reticle-cross"/>
          <!-- Cross-hair lines (vertical) -->
          <line x1={node.x} y1={node.y - 20} x2={node.x} y2={node.y - 9}
            stroke="#00ff88" stroke-width="0.8" opacity={bootDone ? 0.6 : 0} class="reticle-cross"/>
          <line x1={node.x} y1={node.y + 9}  x2={node.x} y2={node.y + 20}
            stroke="#00ff88" stroke-width="0.8" opacity={bootDone ? 0.6 : 0} class="reticle-cross"/>

          <!-- Corner bracket marks at 45° -->
          {#each [[-1,-1],[1,-1],[1,1],[-1,1]] as [sx,sy]}
            <path
              d="M {node.x + sx*12} {node.y + sy*9}
                 L {node.x + sx*12} {node.y + sy*12}
                 L {node.x + sx*9}  {node.y + sy*12}"
              fill="none"
              stroke="#00ff88"
              stroke-width="1.2"
              opacity={bootDone ? 0.8 : 0}
              class="reticle-corner"
            />
          {/each}
        {/if}

        <!-- Pulse ring (ambient, all nodes) -->
        {#if !node.active}
          <circle
            cx={node.x} cy={node.y}
            r={r + 4}
            fill="none"
            stroke={color}
            stroke-width="0.8"
            opacity="0"
            class="node-pulse-ring"
          />
        {/if}

        <!-- Core dot -->
        <circle
          cx={node.x} cy={node.y}
          r={r}
          fill={color}
          opacity={node.active ? 0.95 : 0.85}
          filter={node.active ? 'url(#glow-green)' : `url(#glow-${
            node.signal === 'tracking' ? 'cyan'
            : node.signal === 'money'  ? 'amber'
            : node.signal === 'feed'   ? 'magenta'
            : 'violet'
          })`}
          class="node-dot"
          class:active-dot={node.active}
        />

        <!-- Label (only for labelled set + active) -->
        {#if LABELLED.has(node.id)}
          {@const above = node.y > h * 0.75}
          {@const left  = node.x > w * 0.82}
          <text
            x={node.x + (left ? -(r + 5) : (r + 5))}
            y={node.y + (above ? -(r + 3) : (r + 4))}
            text-anchor={left ? 'end' : 'start'}
            dominant-baseline={above ? 'auto' : 'hanging'}
            class="node-label"
            class:active-label={node.active}
            fill={node.active ? '#00ff88' : '#7a818d'}
            font-size={node.active ? '7' : '6'}
          >{node.label}</text>
        {/if}
      </g>
    {/each}
  </svg>
  {:else}
  <!-- skeleton while topology loads -->
  <div class="map-loading">
    <span class="loading-dot">&#9632;</span>
    <span class="loading-dot">&#9632;</span>
    <span class="loading-dot">&#9632;</span>
    <span class="loading-text">SCANNING GRID…</span>
  </div>
  {/if}

  <!-- ── legend ────────────────────────────────────────────────── -->
  <div class="hud-legend" aria-label="Signal legend">
    <div class="legend-item"><span class="legend-dot" style="background:#00ff88"></span>ACTIVE OP</div>
    <div class="legend-item"><span class="legend-dot" style="background:#00ffff"></span>TRACKING</div>
    <div class="legend-item"><span class="legend-dot" style="background:#ffd23f"></span>MONEY</div>
    <div class="legend-item"><span class="legend-dot" style="background:#ff2af0"></span>FEED</div>
    <div class="legend-item"><span class="legend-dot" style="background:#aa44ff"></span>FUTURE</div>
  </div>

</div>

<style>
  /* ── wrapper ────────────────────────────────────────────────── */
  .world-map-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #060608;
    overflow: hidden;
    border: 1px solid #20222b;
    container-type: inline-size;
  }

  /* ── SVG ────────────────────────────────────────────────────── */
  .world-svg {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
  }

  /* ── scanlines overlay ──────────────────────────────────────── */
  .scanlines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0,0,0,0.06) 2px,
      rgba(0,0,0,0.06) 4px
    );
  }

  /* ── vignette ───────────────────────────────────────────────── */
  .vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 9;
    background: radial-gradient(
      ellipse 90% 90% at 50% 50%,
      transparent 50%,
      rgba(6,6,8,0.55) 100%
    );
  }

  /* ── HUD corner brackets ────────────────────────────────────── */
  .hud-corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border-color: #00ff88;
    border-style: solid;
    pointer-events: none;
    z-index: 20;
    opacity: 0.7;
  }
  .hud-tl { top: 8px;  left: 8px;  border-width: 1.5px 0 0 1.5px; }
  .hud-tr { top: 8px;  right: 8px; border-width: 1.5px 1.5px 0 0; }
  .hud-bl { bottom: 8px; left: 8px;  border-width: 0 0 1.5px 1.5px; }
  .hud-br { bottom: 8px; right: 8px; border-width: 0 1.5px 1.5px 0; }

  /* ── HUD labels ─────────────────────────────────────────────── */
  .hud-label {
    position: absolute;
    z-index: 20;
    font-family: "Spline Sans Mono", ui-monospace, monospace;
    font-size: clamp(7px, 0.9cqi, 10px);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7a818d;
    pointer-events: none;
    line-height: 1;
  }
  .hud-label-tl { top: 6px;    left: 30px; }
  .hud-label-tr { top: 6px;    right: 30px; text-align: right; }
  .hud-label-bl { bottom: 6px; left: 30px; }
  .hud-label-br { bottom: 6px; right: 30px; text-align: right; }

  .hud-mark   { color: #00ff88; }
  .hud-count  { color: #ffd23f; font-weight: 600; }
  .hud-sep    { opacity: 0.4; }
  .hud-clock  { color: #00ffff; font-variant-numeric: tabular-nums; }

  /* ── legend ─────────────────────────────────────────────────── */
  .hud-legend {
    position: absolute;
    bottom: 22px;
    right: 30px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 3px;
    pointer-events: none;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: "Spline Sans Mono", ui-monospace, monospace;
    font-size: clamp(6px, 0.75cqi, 9px);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7a818d;
  }
  .legend-dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 4px currentColor;
  }

  /* ── node base (boot hidden) ────────────────────────────────── */
  .map-node {
    opacity: 0;
    transform: scale(0.3);
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .map-node.node-visible {
    opacity: 1;
    transform: scale(1);
  }

  /* ── clickable node ─────────────────────────────────────────── */
  .map-node.node-clickable {
    cursor: pointer;
  }
  .map-node.node-clickable:hover,
  .map-node.node-clickable:focus-visible {
    filter: brightness(1.6) drop-shadow(0 0 6px currentColor);
    outline: none;
  }

  /* ── node dot ───────────────────────────────────────────────── */
  .node-dot {
    transition: opacity 0.3s;
  }

  /* ── ambient pulse ring ─────────────────────────────────────── */
  .node-pulse-ring {
    animation: node-pulse 3.5s ease-out infinite;
  }
  @keyframes node-pulse {
    0%   { opacity: 0.5; r: 6; }
    60%  { opacity: 0;   r: 12; }
    100% { opacity: 0;   r: 12; }
  }

  /* ── active op dot throb ────────────────────────────────────── */
  .active-dot {
    animation: active-throb 2s ease-in-out infinite;
  }
  @keyframes active-throb {
    0%, 100% { opacity: 0.95; }
    50%       { opacity: 0.65; }
  }

  /* ── active halo ring ───────────────────────────────────────── */
  .active-halo {
    animation: halo-expand 3s ease-out infinite;
  }
  @keyframes halo-expand {
    0%   { r: 14; opacity: 0.45; }
    80%  { r: 36; opacity: 0; }
    100% { r: 36; opacity: 0; }
  }

  /* ── active heat ────────────────────────────────────────────── */
  .active-heat {
    transition: opacity 0.8s ease;
    animation: heat-breathe 4s ease-in-out infinite;
  }
  @keyframes heat-breathe {
    0%, 100% { opacity: 0.8; }
    50%       { opacity: 1.0; }
  }

  /* ── reticle ring rotation ──────────────────────────────────── */
  .reticle-ring {
    animation: reticle-spin 18s linear infinite;
    transition: opacity 0.6s ease;
  }
  @keyframes reticle-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── reticle crosshair + corner fade-in ────────────────────── */
  .reticle-cross, .reticle-corner {
    transition: opacity 0.6s ease 0.3s;
  }

  /* ── active label ───────────────────────────────────────────── */
  .node-label {
    font-family: "Spline Sans Mono", ui-monospace, monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    pointer-events: none;
  }
  .active-label {
    font-weight: 600;
    letter-spacing: 0.12em;
  }

  /* ── connection arcs ────────────────────────────────────────── */
  .map-arc {
    animation: arc-flow 6s linear infinite;
  }
  @keyframes arc-flow {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: -40; }
  }

  /* ── loading state ──────────────────────────────────────────── */
  .map-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: "Spline Sans Mono", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7a818d;
  }
  .loading-dot {
    color: #00ff88;
    animation: dot-blink 1.2s step-end infinite;
  }
  .loading-dot:nth-child(2) { animation-delay: 0.4s; }
  .loading-dot:nth-child(3) { animation-delay: 0.8s; }
  @keyframes dot-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .loading-text { margin-left: 8px; }

  /* ── reduced motion ─────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .map-node    { transition: none !important; }
    .node-pulse-ring, .active-dot, .active-halo,
    .active-heat, .reticle-ring, .map-arc { animation: none !important; }
  }
</style>
