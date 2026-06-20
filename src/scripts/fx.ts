// Cinematic FX — "signal decode" text, count-up numbers, and a one-shot
// glitch, all driven off data-attributes via a single IntersectionObserver.
// Run-once per element, framework-agnostic (works on Astro HTML + Svelte
// island output), and fully disabled under prefers-reduced-motion (the real
// text/number is always in the DOM, so SSR/SEO and the no-JS state are intact).
//
//   data-decode            → text resolves from cycling glyphs on first view
//   data-count             → integer ramps 0 → value on first view
//   data-count-suffix="%"  → appended to the counted value
//   data-glitch            → adds .fx-glitch briefly on first view (CSS does the rest)

const GLYPHS = '█▓▒░╳╱╲<>/\\#*+=:.'
const reduceMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

function decode(el: HTMLElement) {
  const final = el.dataset.decodeText ?? el.textContent ?? ''
  el.dataset.decodeText = final
  const chars = Array.from(final)
  const dur = Number(el.dataset.decodeDur ?? 700)
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / dur)
    const revealed = Math.floor(t * chars.length)
    let out = ''
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i]
      out += c === ' ' || c === '\n' || i < revealed ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (t < 1) requestAnimationFrame(tick)
    else el.textContent = final
  }
  requestAnimationFrame(tick)
}

function countUp(el: HTMLElement) {
  // data-count is usually a boolean flag (target = the element's own text);
  // data-count="N" can override. Note: a bare attribute reads as "" via dataset,
  // so check for a non-empty value rather than ?? (which only catches null).
  const attr = el.dataset.count
  const source = attr && attr.trim() !== '' ? attr : (el.textContent ?? '')
  const grouped = source.includes(',') // author wrote a thousands separator → keep grouping (650,000) but leave years/IDs (2026) alone
  const target = Number(source.replace(/[^0-9.]/g, '')) || 0
  const suffix = el.dataset.countSuffix ?? ''
  const dur = Number(el.dataset.countDur ?? 1100)
  const fmt = (n: number) => (grouped ? Math.round(n).toLocaleString('en-US') : `${Math.round(n)}`)
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / dur)
    const eased = 1 - Math.pow(1 - t, 3)
    el.textContent = `${fmt(eased * target)}${suffix}`
    if (t < 1) requestAnimationFrame(tick)
    else el.textContent = `${fmt(target)}${suffix}`
  }
  requestAnimationFrame(tick)
}

// Magnetic hover — the element drifts toward the pointer, springs back on leave.
function magnetic(el: HTMLElement) {
  const strength = Number(el.dataset.magnetic) || 0.3
  let raf = 0
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      el.style.transform = `translate(${(x * strength).toFixed(1)}px, ${(y * strength).toFixed(1)}px)`
    })
  })
  el.addEventListener('pointerleave', () => {
    el.style.transform = ''
  })
}

// Initialise (idempotent) — safe to call on every astro:page-load.
export function initFx() {
  const targets = document.querySelectorAll<HTMLElement>('[data-decode],[data-count],[data-glitch]')
  if (!targets.length || !('IntersectionObserver' in window)) return
  const reduce = reduceMotion()

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        obs.unobserve(el)
        if (el.hasAttribute('data-decode')) decode(el)
        else if (el.hasAttribute('data-count')) countUp(el)
        if (el.hasAttribute('data-glitch')) {
          el.classList.add('fx-glitch')
          setTimeout(() => el.classList.remove('fx-glitch'), 620)
        }
      }
    },
    { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
  )

  targets.forEach((el) => {
    if (el.dataset.fxDone) return
    el.dataset.fxDone = '1'
    if (reduce) return // leave the real text/number in place
    io.observe(el)
  })

  // magnetic buttons (transform springs back to spec layout on leave)
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    if (el.dataset.magDone) return
    el.dataset.magDone = '1'
    if (!reduce) magnetic(el)
  })
}
