// Framework-agnostic three.js renderer for THE NETWORK. Reads geometry + a
// station-status map, draws fat neon lines (solid=live / dashed=planned), nodes,
// data-pulses flowing along live lines, bloom, and (full variant) pan/zoom.
// Same postprocessing DNA as TheFolderStory.svelte. No Svelte here.
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LINES, NODES, VIEW, type LineId, type Pt } from './geometry'

export type Status = 'open' | 'announced' | 'locked'
export interface NetworkOpts { statuses: Record<string, Status>; variant: 'hero' | 'full' }
export interface NetworkHandle {
  resize: () => void
  setView: (v: 'hero' | 'full') => void
  toScreen: (p: Pt) => { x: number; y: number } // world → CSS px (for DOM hotspots)
  destroy: () => void
}

const COLOR: Record<LineId, number> = { g: 0xffd23f, k: 0x46c8ff, r: 0xc0c8d8, b: 0xff4fd2, v: 0xb48cff }

// position at parameter t (0..1) along a polyline
function pointAlong(pts: Pt[], t: number): Pt {
  if (pts.length < 2) return pts[0] ?? { x: 0, y: 0 }
  const seg: number[] = []; let total = 0
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); seg.push(d); total += d }
  let dist = t * total
  for (let i = 0; i < seg.length; i++) {
    if (dist <= seg[i]) { const f = seg[i] ? dist / seg[i] : 0; return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f } }
    dist -= seg[i]
  }
  return pts[pts.length - 1]
}

export function createNetwork(canvas: HTMLCanvasElement, opts: NetworkOpts): NetworkHandle {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x050805, 1)

  const scene = new THREE.Scene()
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100)
  cam.position.z = 10

  const liveLine = (id: LineId) => NODES.some((n) => n.line === id && opts.statuses[n.stationId] === 'open')
  const lineMats: LineMaterial[] = []
  const pulses: { pts: Pt[]; mesh: THREE.Mesh; t: number; speed: number }[] = []

  for (const l of LINES) {
    const live = liveLine(l.id)
    for (const stroke of l.strokes) {
      const pos: number[] = []
      for (const p of stroke) pos.push(p.x, p.y, 0)
      const geo = new LineGeometry(); geo.setPositions(pos)
      const mat = new LineMaterial({
        color: COLOR[l.id], linewidth: live ? 7 : 4.5, transparent: true,
        opacity: live ? 1 : 0.55, dashed: !live, dashSize: 9, gapSize: 13,
      })
      lineMats.push(mat)
      const line = new Line2(geo, mat)
      if (!live) line.computeLineDistances()
      scene.add(line)
      // data-pulses flow along live strokes
      if (live && !reduce) {
        for (let i = 0; i < 2; i++) {
          const m = new THREE.Mesh(new THREE.CircleGeometry(6, 18), new THREE.MeshBasicMaterial({ color: COLOR[l.id] }))
          m.position.z = 3; scene.add(m)
          pulses.push({ pts: stroke, mesh: m, t: i / 2, speed: 0.05 + i * 0.015 })
        }
      }
    }
  }

  for (const n of NODES) {
    const open = opts.statuses[n.stationId] === 'open'
    const dot = new THREE.Mesh(new THREE.CircleGeometry(open ? 9 : 7, 28), new THREE.MeshBasicMaterial({ color: open ? 0x050805 : 0x14241a }))
    dot.position.set(n.at.x, n.at.y, 2); scene.add(dot)
    const ring = new THREE.Mesh(new THREE.RingGeometry(open ? 9 : 7, open ? 13 : 10, 28), new THREE.MeshBasicMaterial({ color: open ? COLOR[n.line] : 0x2b3a2f }))
    ring.position.set(n.at.x, n.at.y, 2); scene.add(ring)
  }

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, cam))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.62, 0.45, 0.32)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  // ── camera: base frustum (fit) + zoom/pan (full variant) ──
  let base = { cx: VIEW.w / 2, cy: VIEW.h / 2, halfW: 1, halfH: 1 }
  const view = { zoom: 1, panX: 0, panY: 0 }
  function fit() {
    const w = canvas.clientWidth || canvas.width, h = canvas.clientHeight || canvas.height
    if (!w || !h) return
    renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h)
    for (const m of lineMats) m.resolution.set(w, h)
    const margin = 0.1, vw = VIEW.w * (1 + margin), vh = VIEW.h * (1 + margin)
    const ca = w / h, va = vw / vh
    let halfW: number, halfH: number
    if (ca > va) { halfH = vh / 2; halfW = halfH * ca } else { halfW = vw / 2; halfH = halfW / ca }
    base = { cx: VIEW.w / 2, cy: VIEW.h / 2, halfW, halfH }
    applyCam()
  }
  function applyCam() {
    const hw = base.halfW / view.zoom, hh = base.halfH / view.zoom
    const cx = base.cx + view.panX, cy = base.cy + view.panY
    cam.left = cx - hw; cam.right = cx + hw; cam.top = cy - hh; cam.bottom = cy + hh
    cam.updateProjectionMatrix()
  }
  fit()

  // ── interactivity (full only): drag-pan + wheel-zoom ──
  const cleanups: (() => void)[] = []
  if (opts.variant === 'full') {
    let dragging = false, lx = 0, ly = 0
    const onDown = (e: PointerEvent) => { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId) }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const w = canvas.clientWidth || 1
      const wpp = (base.halfW * 2 / view.zoom) / w // world units per px
      view.panX -= (e.clientX - lx) * wpp; view.panY -= (e.clientY - ly) * wpp
      lx = e.clientX; ly = e.clientY; clampPan(); applyCam()
    }
    const onUp = () => { dragging = false }
    const onWheel = (e: WheelEvent) => { e.preventDefault(); view.zoom = Math.min(4, Math.max(0.6, view.zoom * (e.deltaY < 0 ? 1.12 : 0.89))); clampPan(); applyCam() }
    canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    cleanups.push(() => { canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('wheel', onWheel) })
  }
  function clampPan() {
    const hw = base.halfW / view.zoom, hh = base.halfH / view.zoom
    const mx = Math.max(0, base.halfW - hw), my = Math.max(0, base.halfH - hh)
    view.panX = Math.min(mx, Math.max(-mx, view.panX)); view.panY = Math.min(my, Math.max(-my, view.panY))
  }

  let raf = 0, last = performance.now()
  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    for (const p of pulses) { p.t = (p.t + p.speed * dt) % 1; const pos = pointAlong(p.pts, p.t); p.mesh.position.set(pos.x, pos.y, 3) }
    composer.render(); raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  const _v = new THREE.Vector3()
  function toScreen(p: Pt) {
    _v.set(p.x, p.y, 0).project(cam)
    return { x: (_v.x * 0.5 + 0.5) * (canvas.clientWidth || 1), y: (1 - (_v.y * 0.5 + 0.5)) * (canvas.clientHeight || 1) }
  }

  return {
    resize: fit,
    setView() { fit() },
    toScreen,
    destroy() { cancelAnimationFrame(raf); for (const c of cleanups) c(); renderer.dispose(); for (const m of lineMats) m.dispose() },
  }
}
