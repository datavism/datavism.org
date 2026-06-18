<script>
  // THE NETWORK — the reusable octolinear transit diagram (signature asset).
  // Ported 1:1 from docs/design_handoff_datavism/NetworkMap.dc.html: five lines
  // route from a terminus, bend once, and converge at the GHOST interchange
  // (720,470). Fixed node geometry (GEO) + route polylines (ROUTEPTS). Reused on
  // the landing, onboarding, line, network and progress surfaces.
  //
  // Props (design §"The Signature Asset"):
  //   statuses     {stationId: status}  per-node marker style (falls back to def)
  //   selected     stationId|null        highlight node with an accent ring
  //   onSelect     fn(id)                click handler per node
  //   liveLine     'g'|'k'|…             which line shows flowing packets
  //   dimInactive  bool                  non-live/non-selected lines drop to 0.32
  //   labels       bool                  show station code + title labels
  //   accent       color                 selected-ring colour

  let {
    statuses = {},
    selected = null,
    onSelect = null,
    liveLine = 'g',
    dimInactive = true,
    labels = true,
    accent = '#ffd23f',
  } = $props()

  let hovered = $state(null)
  let internalSel = $state(null)

  // Stations run INNER (1, boards at the Ghost) → OUTER (5, the adversary
  // terminus / final "…FILE"). Positions reversed vs the original handoff.
  const GEO = {
    g1: { x: 660, y: 410, anchor: 'bl' }, g2: { x: 600, y: 350, anchor: 'bl' }, g3: { x: 490, y: 290, anchor: 'above' }, g4: { x: 320, y: 290, anchor: 'above' }, g5: { x: 150, y: 290, anchor: 'above', terminus: true },
    k1: { x: 720, y: 370, anchor: 'right' }, k2: { x: 720, y: 300, anchor: 'right' }, k3: { x: 720, y: 210, anchor: 'right' }, k4: { x: 775, y: 120, anchor: 'above' }, k5: { x: 900, y: 120, anchor: 'above', terminus: true },
    r1: { x: 850, y: 470, anchor: 'above' }, r2: { x: 990, y: 470, anchor: 'above' }, r3: { x: 1130, y: 470, anchor: 'above' }, r4: { x: 1290, y: 400, anchor: 'left' }, r5: { x: 1290, y: 300, anchor: 'left', terminus: true },
    b1: { x: 787, y: 537, anchor: 'ar' }, b2: { x: 826, y: 576, anchor: 'ar' }, b3: { x: 865, y: 615, anchor: 'ar' }, b4: { x: 985, y: 650, anchor: 'below' }, b5: { x: 1110, y: 650, anchor: 'below', terminus: true },
    v1: { x: 660, y: 530, anchor: 'al' }, v2: { x: 600, y: 590, anchor: 'al' }, v3: { x: 490, y: 650, anchor: 'below' }, v4: { x: 320, y: 650, anchor: 'below' }, v5: { x: 150, y: 650, anchor: 'below', terminus: true },
  }

  const ROUTEPTS = {
    g: [[150, 290], [540, 290], [720, 470]], k: [[900, 120], [720, 120], [720, 470]], r: [[1290, 300], [1290, 470], [720, 470]], b: [[1110, 650], [900, 650], [720, 470]], v: [[150, 650], [540, 650], [720, 470]],
  }

  const LC = { g: '#00ff88', k: '#00ffff', r: '#ffff00', b: '#ff00ff', v: '#aa44ff' }
  const ORDER = { g: 0, k: 1, r: 2, b: 3, v: 4 }

  const LINES = [
    { id: 'g', st: [['g1', 'G1', 'THE FOLDER', 'open'], ['g2', 'G2', 'COMMAND', 'announced'], ['g3', 'G3', 'INTAKE', 'locked'], ['g4', 'G4', 'THE CONFIDENT LIE', 'locked'], ['g5', 'G5', 'MASCHINENRAUM', 'locked']] },
    { id: 'k', st: [['k1', 'K1', 'FOOTPRINTS', 'locked'], ['k2', 'K2', 'SIGNALS', 'locked'], ['k3', 'K3', 'IDENTITY GRAPH', 'locked'], ['k4', 'K4', 'WATCHTOWER', 'locked'], ['k5', 'K5', 'PANOPTICON FILE', 'locked']] },
    { id: 'r', st: [['r1', 'R1', 'LEDGER', 'locked'], ['r2', 'R2', 'ACTORS', 'locked'], ['r3', 'R3', 'FLOWS', 'locked'], ['r4', 'R4', 'LEVERAGE', 'locked'], ['r5', 'R5', 'MAMMON FILE', 'locked']] },
    { id: 'b', st: [['b1', 'B1', 'SOURCE', 'locked'], ['b2', 'B2', 'CAPTURE', 'locked'], ['b3', 'B3', 'NORMALIZE', 'locked'], ['b4', 'B4', 'DETECT', 'locked'], ['b5', 'B5', 'FEED AUTOPSY', 'locked']] },
    { id: 'v', st: [['v1', 'V1', 'ARCHIVE', 'locked'], ['v2', 'V2', 'PATTERNS', 'locked'], ['v3', 'V3', 'SCENARIOS', 'locked'], ['v4', 'V4', 'IMPACT', 'locked'], ['v5', 'V5', 'CUMULUS FILE', 'locked']] },
  ]

  const allStations = LINES.flatMap((L) =>
    L.st.map((s) => ({ id: s[0], code: s[1], title: s[2], def: s[3], lineId: L.id, color: LC[L.id] })),
  )

  function pathLen(pts) {
    let L = 0
    for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
    return Math.round(L)
  }

  function roundedPath(pts, r) {
    if (!pts.length) return ''
    let d = 'M ' + pts[0].x + ' ' + pts[0].y
    for (let i = 1; i < pts.length - 1; i++) {
      const prev = pts[i - 1], p = pts[i], next = pts[i + 1]
      const v1x = p.x - prev.x, v1y = p.y - prev.y, l1 = Math.hypot(v1x, v1y)
      const v2x = next.x - p.x, v2y = next.y - p.y, l2 = Math.hypot(v2x, v2y)
      const rr = Math.min(r, l1 / 2, l2 / 2)
      d += ' L ' + (p.x - v1x / l1 * rr) + ' ' + (p.y - v1y / l1 * rr) + ' Q ' + p.x + ' ' + p.y + ' ' + (p.x + v2x / l2 * rr) + ' ' + (p.y + v2y / l2 * rr)
    }
    const last = pts[pts.length - 1]
    return d + ' L ' + last.x + ' ' + last.y
  }

  function labelPos(x, y, a) {
    if (a === 'above') return { cx: x, cy: y - 20, tx: x, ty: y - 36, ta: 'middle' }
    if (a === 'below') return { cx: x, cy: y + 24, tx: x, ty: y + 40, ta: 'middle' }
    if (a === 'left') return { cx: x - 16, cy: y - 5, tx: x - 16, ty: y + 13, ta: 'end' }
    // Diagonal anchors: push the label perpendicular to a 45° line and anchor it
    // to the far side so its nearest corner sits at the node (clears the line).
    if (a === 'bl') return { cx: x - 14, cy: y + 20, tx: x - 14, ty: y + 36, ta: 'end' }   // below-left
    if (a === 'br') return { cx: x + 14, cy: y + 20, tx: x + 14, ty: y + 36, ta: 'start' } // below-right
    if (a === 'al') return { cx: x - 14, cy: y - 14, tx: x - 14, ty: y - 30, ta: 'end' }   // above-left
    if (a === 'ar') return { cx: x + 14, cy: y - 14, tx: x + 14, ty: y - 30, ta: 'start' } // above-right
    return { cx: x + 16, cy: y - 5, tx: x + 16, ty: y + 13, ta: 'start' }                  // right
  }

  const selId = $derived(selected != null ? selected : internalSel)
  const selLineId = $derived((selId || '').charAt(0))

  function select(id) {
    if (typeof onSelect === 'function') onSelect(id)
    else internalSel = id
  }

  // precompute route render data
  const routes = $derived(
    Object.keys(ROUTEPTS).map((id) => {
      const pts = ROUTEPTS[id].map((p) => ({ x: p[0], y: p[1] }))
      const d = roundedPath(pts, 26)
      const len = pathLen(pts)
      const isLive = id === liveLine
      const isSel = id === selLineId
      const on = isLive || isSel
      const op = dimInactive ? (on ? 1 : 0.32) : (on ? 1 : 0.85)
      return {
        id, d, len, color: LC[id], isLive, isSel, on, op,
        width: isSel ? 10.5 : isLive ? 9.5 : 8.5,
        delay: ORDER[id] * 0.13,
        packet: isLive || isSel,
        packetOp: isLive ? 1 : 0.7,
      }
    }),
  )

  const nodes = $derived(
    allStations.map((s) => {
      const g = GEO[s.id]
      const status = statuses[s.id] || s.def
      const isSel = s.id === selId
      const isHov = s.id === hovered
      return { ...s, x: g.x, y: g.y, anchor: g.anchor, baseR: g.terminus ? 8 : 7, status, isSel, isHov, lp: labelPos(g.x, g.y, g.anchor) }
    }),
  )

  const GH = 'M64,0 a64,64 0 0 1 64,64 v64 c0,0 -16,-12 -32,-12 s-32,12 -32,12 s-16,-12 -32,-12 s-32,12 -32,12 v-64 a64,64 0 0 1 64,-64 z'

  // — Signal trains —————————————————————————————————————————————
  // The Ghost sporadically launches a coloured dot ("train") that rides a line
  // out to its terminus; on arrival the whole line flashes. Auto / random, and
  // skipped under prefers-reduced-motion. Uses the rendered path geometry
  // (getPointAtLength) so the dot follows the real curved route.
  let trains = $state([])
  let flashes = $state([])
  let nextId = 0

  // — Ghost radar —————————————————————————————————————————————
  // The Ghost sweeps a radar beam around the map; a few hidden "objects" light
  // up briefly when the beam crosses them. Angles precomputed from the centre.
  let sweepAngle = $state(0)
  let blips = $state(
    [
      { x: 1140, y: 200 },
      { x: 250, y: 360 },
      { x: 1080, y: 580 },
      { x: 430, y: 560 },
    ].map((b) => ({ ...b, angle: ((Math.atan2(b.y - 470, b.x - 720) * 180) / Math.PI + 360) % 360, intensity: 0 })),
  )
  // sweep tail built from thin wedge slices fanning back from the leading edge,
  // opacity fading out → a smooth conic radar sweep (centred on the Ghost).
  const SWEEP = (() => {
    const cx = 720, cy = 470, R = 900, n = 16, span = 80 // reaches every corner (~860)
    const pt = (deg) => [cx + R * Math.cos((deg * Math.PI) / 180), cy + R * Math.sin((deg * Math.PI) / 180)]
    const out = []
    for (let i = 0; i < n; i++) {
      const [x0, y0] = pt(-(i * span) / n)
      const [x1, y1] = pt(-((i + 1) * span) / n)
      out.push({ d: `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 0 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`, op: (0.1 * Math.pow(1 - i / n, 1.5)).toFixed(3) })
    }
    return out
  })()
  const RANGE_RINGS = [150, 330, 540, 760]

  $effect(() => {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ids = Object.keys(LC)
    const lenCache = {}, stopCache = {}
    const pathOf = (id) => document.getElementById(`route-${id}`)
    let raf = 0, last = 0, spawnTimer = 0, alive = true

    // station progress values along a line (in train terms: 0 = Ghost → 1 =
    // terminus), found by sampling the rendered path and snapping each station.
    const computeStops = (lineId, path, total) => {
      if (stopCache[lineId]) return stopCache[lineId]
      const N = 220, samples = []
      for (let i = 0; i <= N; i++) { const L = (total * i) / N; const p = path.getPointAtLength(L); samples.push([L, p.x, p.y]) }
      const line = LINES.find((l) => l.id === lineId)
      const ps = []
      for (const st of line.st) {
        const g = GEO[st[0]]; let best = Infinity, bestL = 0
        for (const s of samples) { const dx = s[1] - g.x, dy = s[2] - g.y, d = dx * dx + dy * dy; if (d < best) { best = d; bestL = s[0] } }
        ps.push(1 - bestL / total)
      }
      // drop the Ghost-adjacent stop (train starts there) and the terminus (it flashes)
      stopCache[lineId] = ps.filter((p) => p > 0.06 && p < 0.94).sort((a, b) => a - b)
      return stopCache[lineId]
    }

    const spawn = () => {
      if (!alive) return
      if (trains.length < 4) {
        const lineId = ids[(Math.random() * ids.length) | 0]
        const path = pathOf(lineId)
        if (path) {
          const total = lenCache[lineId] ?? (lenCache[lineId] = path.getTotalLength())
          trains.push({ id: ++nextId, lineId, color: LC[lineId], p: 0, x: 720, y: 470, stops: computeStops(lineId, path, total), si: 0, pauseUntil: 0 })
        }
      }
      spawnTimer = setTimeout(spawn, 900 + Math.random() * 2800)
    }

    const flash = (lineId) => {
      const id = ++nextId
      flashes.push({ id, lineId })
      setTimeout(() => { flashes = flashes.filter((f) => f.id !== id) }, 650)
    }

    const tick = (ts) => {
      if (!alive) return
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0
      last = ts
      for (let i = trains.length - 1; i >= 0; i--) {
        const t = trains[i]
        const path = pathOf(t.lineId)
        if (!path) { trains.splice(i, 1); continue }
        const total = lenCache[t.lineId] ?? (lenCache[t.lineId] = path.getTotalLength())
        if (ts >= t.pauseUntil) { // not dwelling at a station
          t.p += dt / 2.4 // ~2.4s ghost → terminus (plus dwell time)
          if (t.si < t.stops.length && t.p >= t.stops[t.si]) { // arrive at a station → brief stop
            t.p = t.stops[t.si]
            t.pauseUntil = ts + 280
            t.si++
          } else if (t.p >= 1) { flash(t.lineId); trains.splice(i, 1); continue }
        }
        const pt = path.getPointAtLength(total * (1 - t.p)) // ghost(total) → terminus(0)
        t.x = pt.x; t.y = pt.y
      }
      // radar sweep + hidden-object detection
      const prev = sweepAngle
      sweepAngle = (sweepAngle + dt * 55) % 360 // ~6.5s / revolution
      for (let bi = 0; bi < blips.length; bi++) {
        const b = blips[bi]
        const crossed = sweepAngle >= prev ? b.angle > prev && b.angle <= sweepAngle : b.angle > prev || b.angle <= sweepAngle
        b.intensity = crossed ? 1 : Math.max(0, b.intensity - dt / 2.6) // phosphor afterglow
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    spawnTimer = setTimeout(spawn, 700)
    return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(spawnTimer) }
  })
</script>

<svg viewBox="0 0 1440 760" role="img" aria-label="DATAVISM underground network map: five lines and 25 stations meeting at the Ghost interchange" style="display:block;width:100%;height:auto;">
  <defs>
    <filter id="dvg" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.4" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <pattern id="dvgrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0 H0 V40" fill="none" stroke="#19232f" stroke-width="1" />
    </pattern>
    <!-- major gridlines every 200px for a transit-map / blueprint surface -->
    <pattern id="dvgrid2" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M200 0 H0 V200" fill="none" stroke="#22303f" stroke-width="1" />
    </pattern>
    <radialGradient id="coreglow">
      <stop offset="0%" stop-color="#39ff14" stop-opacity="0.5" />
      <stop offset="45%" stop-color="#39ff14" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#39ff14" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="1440" height="760" fill="url(#dvgrid)" />
  <rect x="0" y="0" width="1440" height="760" fill="url(#dvgrid2)" />

  <!-- casings -->
  {#each routes as r (r.id + 'cas')}
    <path d={r.d} fill="none" stroke="#0b0c10" stroke-width="19" stroke-linecap="round" stroke-linejoin="round" />
  {/each}

  <!-- coloured lines + packets -->
  {#each routes as r (r.id + 'ln')}
    <path
      id={`route-${r.id}`}
      d={r.d}
      class="dv-line"
      fill="none"
      stroke={r.color}
      stroke-width={r.width}
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity={r.op}
      stroke-dasharray={r.len}
      style="--len:{r.len};animation-delay:{r.delay}s;transition:opacity .4s ease,stroke-width .4s ease;"
    />
    {#if r.packet}
      <path d={r.d} class="dv-packets" fill="none" stroke="#f2fffb" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="2 22" opacity={r.packetOp} style="animation-delay:{1.5 + r.delay}s;pointer-events:none;" />
    {/if}
  {/each}

  <!-- signal-train route flashes (brief line-up on arrival) -->
  {#each flashes as f (f.id)}
    {@const fr = routes.find((r) => r.id === f.lineId)}
    {#if fr}
      <path d={fr.d} class="dv-flash" fill="none" stroke={LC[f.lineId]} stroke-width="11" stroke-linecap="round" stroke-linejoin="round" filter="url(#dvg)" style="pointer-events:none;" />
    {/if}
  {/each}

  <!-- signal trains (coloured dots riding the lines out from the Ghost) -->
  {#each trains as t (t.id)}
    <circle cx={t.x} cy={t.y} r="6" fill={t.color} opacity="0.9" filter="url(#dvg)" style="pointer-events:none;" />
    <circle cx={t.x} cy={t.y} r="2.4" fill="#ffffff" style="pointer-events:none;" />
  {/each}

  <!-- ghost radar: static range rings + rotating conic sweep + detected objects -->
  <g class="radar" style="pointer-events:none;">
    {#each RANGE_RINGS as r}
      <circle cx="720" cy="470" {r} fill="none" stroke="#39ff14" stroke-width="1" opacity="0.035" />
    {/each}
    <g class="radar-sweep" transform={`rotate(${sweepAngle} 720 470)`}>
      {#each SWEEP as s}
        <path d={s.d} fill="#39ff14" opacity={s.op} />
      {/each}
      <line x1="720" y1="470" x2="1620" y2="470" stroke="#39ff14" stroke-width="1.4" opacity="0.2" filter="url(#dvg)" />
    </g>
    {#each blips as b (b.x + ',' + b.y)}
      {#if b.intensity > 0.01}
        <g style={`opacity:${b.intensity};`}>
          <circle cx={b.x} cy={b.y} r={4 + (1 - b.intensity) * 16} fill="none" stroke="#39ff14" stroke-width="1.4" opacity={0.55 * b.intensity} />
          <circle cx={b.x} cy={b.y} r="9.5" fill="none" stroke="#39ff14" stroke-width="1" opacity="0.4" />
          <circle cx={b.x} cy={b.y} r="3.4" fill="#39ff14" filter="url(#dvg)" />
        </g>
      {/if}
    {/each}
  </g>

  <!-- stations -->
  {#each nodes as n (n.id)}
    <circle cx={n.x} cy={n.y} r="19" fill="transparent" style="cursor:pointer;" role="button" tabindex="-1" aria-label={n.code + ' ' + n.title}
      onclick={() => select(n.id)}
      onmouseenter={() => (hovered = n.id)}
      onmouseleave={() => (hovered = null)} />
    {#if n.isSel}
      <circle cx={n.x} cy={n.y} r="13" fill="none" stroke={accent} stroke-width="1.6" filter="url(#dvg)" style="pointer-events:none;" />
    {/if}
    <g style="pointer-events:none;">
      {#if n.status === 'completed'}
        <circle cx={n.x} cy={n.y} r={n.baseR} fill="#0b0c10" stroke="#00ff88" stroke-width="2.6" />
        <path d={'M ' + (n.x - 3.4) + ' ' + (n.y + 0.3) + ' L ' + (n.x - 1) + ' ' + (n.y + 2.7) + ' L ' + (n.x + 3.9) + ' ' + (n.y - 2.9)} fill="none" stroke="#00ff88" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
      {:else if n.status === 'current'}
        <circle cx={n.x} cy={n.y} r="13" fill="none" stroke={n.color} stroke-width="1.3" opacity="0.5" class="dv-pulse" />
        <circle cx={n.x} cy={n.y} r="8" fill="#0b0c10" stroke={n.color} stroke-width="3" filter="url(#dvg)" />
        <circle cx={n.x} cy={n.y} r="3.4" fill={n.color} />
      {:else if n.status === 'unlocked'}
        <circle cx={n.x} cy={n.y} r={n.baseR} fill="#0b0c10" stroke="#4d8dff" stroke-width="2.6" />
        <circle cx={n.x} cy={n.y} r="2.6" fill="#4d8dff" />
      {:else if n.status === 'open'}
        <circle cx={n.x} cy={n.y} r={n.baseR} fill="#0b0c10" stroke={n.color} stroke-width="3" />
        <circle cx={n.x} cy={n.y} r="2.6" fill={n.color} />
      {:else if n.status === 'locked'}
        <circle cx={n.x} cy={n.y} r="6.5" fill="#0b0c10" stroke={n.color} stroke-width="3" stroke-dasharray="3 3" opacity="0.55" />
      {:else}
        <circle cx={n.x} cy={n.y} r={n.baseR} fill="#0b0c10" stroke={n.color} stroke-width="2.6" />
      {/if}
    </g>
    {#if labels}
      {@const dim = n.status === 'locked' && !n.isSel && !n.isHov}
      <text x={n.lp.cx} y={n.lp.cy} text-anchor={n.lp.ta} font-family="'Spline Sans Mono', monospace" font-size="16" font-weight="700" fill={n.color} opacity={dim ? 0.75 : 1} style="pointer-events:none;letter-spacing:0.03em;">{n.code}</text>
      <text x={n.lp.tx} y={n.lp.ty} text-anchor={n.lp.ta} font-family="'Spline Sans Mono', monospace" font-size="12" font-weight="600" fill={n.isSel ? '#f2f1ea' : '#9aa192'} opacity={dim ? 0.75 : 1} style="pointer-events:none;letter-spacing:0.02em;">{n.title}</text>
    {/if}
  {/each}

  <!-- GHOST interchange -->
  <circle cx="720" cy="470" r="105" fill="url(#coreglow)" class="dv-core" style="transform-box: fill-box; transform-origin: center;" />
  <circle cx="720" cy="470" r="58" fill="none" stroke="#39ff14" stroke-width="1" stroke-dasharray="2 9" opacity="0.45" class="dv-spin" />
  <circle cx="720" cy="470" r="54" fill="#0b0c10" stroke="#343843" stroke-width="1.5" />
  <g transform="translate(680,420) scale(0.62)">
    <path d={GH} fill="none" stroke="#ff2a6d" stroke-width="12" opacity="0.9" transform="translate(3,3)" />
    <path d={GH} fill="none" stroke="#39ff14" stroke-width="10" stroke-linejoin="round" filter="url(#dvg)" />
    <g class="gh-eyes">
      <circle cx="78" cy="64" r="7" fill="#39ff14" />
      <circle cx="110" cy="64" r="7" fill="#39ff14" />
    </g>
  </g>
  <text x="720" y="556" text-anchor="middle" font-family="'Martian Mono', monospace" font-size="14" font-weight="800" fill="#f2f1ea" style="letter-spacing:-0.02em;">THE GHOST</text>
  <text x="720" y="572" text-anchor="middle" font-family="'Spline Sans Mono', monospace" font-size="9.5" font-weight="600" fill="#39ff14" style="letter-spacing:0.12em;">CONVERGENCE · ALL LINES</text>
</svg>

<style>
  /* interchange ghost blinks, gently (shares the global dv-eyeblink keyframe) */
  .gh-eyes { transform-box: fill-box; transform-origin: center; animation: dv-eyeblink 7.5s infinite; animation-delay: 2.4s; }
  /* living energy core — slow breathing pulse behind the ghost (auto, no cursor) */
  .dv-core { animation: dv-core 4.6s ease-in-out infinite; }
  @keyframes dv-core {
    0%, 100% { opacity: 0.5; transform: scale(0.82); }
    50%      { opacity: 0.95; transform: scale(1.12); }
  }
  /* signal-train arrival: the line flares then fades */
  .dv-flash { animation: dv-flash 0.65s ease-out forwards; }
  @keyframes dv-flash { from { opacity: 0.85; } to { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .gh-eyes, .dv-core, .dv-flash, .dv-spin { animation: none; } .radar-sweep { display: none; } }
</style>
