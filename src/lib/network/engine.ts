// Framework-agnostic three.js renderer for THE NETWORK. Reads geometry + a
// station-status map, draws fat neon lines (solid=live / dashed=planned), nodes,
// and bloom — same postprocessing DNA as TheFolderStory.svelte. No Svelte here.
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LINES, NODES, VIEW, type LineId } from './geometry'

export type Status = 'open' | 'announced' | 'locked'
export interface NetworkOpts { statuses: Record<string, Status>; variant: 'hero' | 'full' }
export interface NetworkHandle { resize: () => void; setView: (v: 'hero' | 'full') => void; destroy: () => void }

const COLOR: Record<LineId, number> = { g: 0xffd23f, k: 0x46c8ff, r: 0xc0c8d8, b: 0xff4fd2, v: 0xb48cff }

export function createNetwork(canvas: HTMLCanvasElement, opts: NetworkOpts): NetworkHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x050805, 1)

  const scene = new THREE.Scene()
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100)
  cam.position.z = 10

  const liveLine = (id: LineId) => NODES.some((n) => n.line === id && opts.statuses[n.stationId] === 'open')
  const lineMats: LineMaterial[] = []

  // ── fat neon lines (solid=live, dashed=planned) ──
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
    }
  }

  // ── station nodes ──
  for (const n of NODES) {
    const open = opts.statuses[n.stationId] === 'open'
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(open ? 9 : 7, 28),
      new THREE.MeshBasicMaterial({ color: open ? 0x050805 : 0x14241a }),
    )
    dot.position.set(n.at.x, n.at.y, 2); scene.add(dot)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(open ? 9 : 7, open ? 13 : 10, 28),
      new THREE.MeshBasicMaterial({ color: open ? COLOR[n.line] : 0x2b3a2f }),
    )
    ring.position.set(n.at.x, n.at.y, 2); scene.add(ring)
  }

  // ── postprocessing (bloom) ──
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, cam))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.62, 0.45, 0.32)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  function fit() {
    const w = canvas.clientWidth || canvas.width, h = canvas.clientHeight || canvas.height
    if (!w || !h) return
    renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h)
    for (const m of lineMats) m.resolution.set(w, h)
    // contain VIEW (with margin), centred → y-down (top<bottom flips the axis)
    const margin = 0.1
    const vw = VIEW.w * (1 + margin), vh = VIEW.h * (1 + margin)
    const ca = w / h, va = vw / vh
    let halfW: number, halfH: number
    if (ca > va) { halfH = vh / 2; halfW = halfH * ca } else { halfW = vw / 2; halfH = halfW / ca }
    const cx = VIEW.w / 2, cy = VIEW.h / 2
    cam.left = cx - halfW; cam.right = cx + halfW; cam.top = cy - halfH; cam.bottom = cy + halfH
    cam.updateProjectionMatrix()
  }
  fit()

  let raf = 0
  const loop = () => { composer.render(); raf = requestAnimationFrame(loop) }
  raf = requestAnimationFrame(loop)

  return {
    resize: fit,
    setView() { fit() },
    destroy() { cancelAnimationFrame(raf); renderer.dispose(); for (const m of lineMats) m.dispose() },
  }
}
