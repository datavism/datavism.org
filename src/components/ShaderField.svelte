<script>
  // Flagship hero backdrop — a raw WebGL fragment shader on one fullscreen quad
  // (NO three.js: ~2KB, GPU-cheap). A dark, flowing monochrome "signal field"
  // with a faint warped grid and a cursor-reactive ghost-green glow. Kept dark
  // so hero text contrast / a11y hold.
  //
  // Performance guardrails: DPR capped, paused when offscreen (IO) or the tab is
  // hidden, and fully skipped under prefers-reduced-motion or when WebGL is
  // unavailable — in which case the CSS gradient fallback on the canvas shows.

  let canvas = $state()

  const VERT = `
    attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }
  `
  const FRAG = `
    precision highp float;
    uniform vec2 u_res; uniform float u_time; uniform vec2 u_focus; uniform float u_amp;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
      float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
      return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
    }
    float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }
    void main(){
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 p = uv; p.x *= u_res.x / u_res.y;
      float t = u_time * 0.04;
      vec2 q = vec2(fbm(p*2.2 + t), fbm(p*2.2 - t + 7.3));   // domain warp → flow
      float f = fbm(p*3.0 + q*1.6 + t);
      // faint warped grid (transit/data feel)
      vec2 g = abs(fract((p*7.0 + q*0.7)) - 0.5);
      float grid = smoothstep(0.49, 0.5, max(0.5 - g.x, 0.5 - g.y)) * 0.025;
      float lum = pow(f, 2.4) * 0.14 * u_amp + grid;       // dark base
      float md = distance(uv, u_focus);
      float glow = smoothstep(0.38, 0.0, md);              // signal source behind the wordmark
      vec3 col = vec3(lum);
      col += vec3(0.11, 0.55, 0.18) * (f*f * 0.10 + glow * 0.45) * u_amp;  // ghost-green energy
      col += vec3(0.9, 0.6, 0.12) * glow * glow * 0.10 * u_amp;           // signal-yellow core
      gl_FragColor = vec4(col, 1.0);
    }
  `

  function build(gl, src, type) {
    const s = gl.createShader(type)
    gl.shaderSource(s, src); gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null }
    return s
  }

  $effect(() => {
    if (!canvas) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return // gradient fallback stays
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' })
    if (!gl) return

    const vs = build(gl, VERT, gl.VERTEX_SHADER)
    const fs = build(gl, FRAG, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW) // fullscreen tri
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uFocus = gl.getUniformLocation(prog, 'u_focus')
    const uAmp = gl.getUniformLocation(prog, 'u_amp')

    // The glow anchors BEHIND the DATAVISM wordmark (computed from its real box)
    // and drifts gently — no cursor-follow. Canvas + wordmark share the hero's
    // scroll context, so the anchor only needs recomputing on resize.
    const anchor = [0.3, 0.55]
    const computeAnchor = () => {
      const title = document.querySelector('.hero-title')
      if (!title) return
      const cr = canvas.getBoundingClientRect(), tr = title.getBoundingClientRect()
      if (!cr.width || !cr.height) return
      anchor[0] = (tr.left + tr.width / 2 - cr.left) / cr.width
      anchor[1] = 1 - (tr.top + tr.height / 2 - cr.top) / cr.height
    }

    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width * dpr)); h = Math.max(1, Math.round(r.height * dpr))
      canvas.width = w; canvas.height = h
      gl.viewport(0, 0, w, h)
      computeAnchor()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let raf = 0, running = true, t0 = 0
    const frame = (ts) => {
      if (!running) return
      if (!t0) t0 = ts
      const tt = (ts - t0) / 1000
      const fx = anchor[0] + Math.sin(tt * 0.16) * 0.045  // gentle side sway
      const fy = anchor[1] + Math.cos(tt * 0.12) * 0.06   // gentle up/down drift
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uTime, tt)
      gl.uniform2f(uFocus, fx, fy)
      gl.uniform1f(uAmp, 1.0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(frame)
    }
    const start = () => { if (!running) { running = true; t0 = 0; raf = requestAnimationFrame(frame) } }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    // pause when the hero scrolls away or the tab is hidden
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    raf = requestAnimationFrame(frame)

    return () => {
      stop()
      ro.disconnect(); io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext()
    }
  })
</script>

<canvas bind:this={canvas} class="shader" aria-hidden="true"></canvas>

<style>
  .shader {
    position: absolute; inset: 0; width: 100%; height: 100%; display: block; z-index: 0;
    pointer-events: none;
    /* fallback (no WebGL / reduced-motion): a still signal glow */
    background: radial-gradient(60% 55% at 28% 22%, rgba(57, 255, 20, 0.06), transparent 70%);
  }
</style>
