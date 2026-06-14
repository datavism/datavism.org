<script lang="ts">
  // THE NETWORK island. SSR-renders an accessible line list (the no-JS / no-WebGL
  // / reduced-motion truth); on mount it lazy-loads the three.js engine, draws the
  // neon map on a canvas, and keeps a transform-synced DOM hotspot over each
  // station for crisp, keyboard-/SEO-friendly navigation.
  import { onMount } from 'svelte'
  import { NODES, LINES } from '../lib/network/geometry'
  import { COPY } from '../lib/copy/en'

  type S = { id: string; status: string; title: string; line: string; index: number }
  let { variant = 'full', stations = [] }: { variant?: 'hero' | 'full'; stations?: S[] } = $props()

  let host: HTMLDivElement
  let canvasEl: HTMLCanvasElement
  let hotEls: HTMLAnchorElement[] = $state([])
  let ready = $state(false)

  const statusOf = (id: string) => stations.find((s) => s.id === id)?.status ?? 'locked'
  const titleOf = (id: string) => stations.find((s) => s.id === id)?.title ?? id
  const hrefOf = (id: string) => (statusOf(id) === 'open' ? `/line-g/${id}` : '/line-g')

  onMount(() => {
    let net: import('../lib/network/engine').NetworkHandle | null = null
    let raf = 0
    let ro: ResizeObserver | null = null
    ;(async () => {
      try {
        const { createNetwork } = await import('../lib/network/engine')
        const map: Record<string, 'open' | 'announced' | 'locked'> = {}
        for (const s of stations) map[s.id] = s.status as 'open' | 'announced' | 'locked'
        net = createNetwork(canvasEl, { statuses: map, variant })
        ready = true
        const place = () => {
          if (net) NODES.forEach((n, i) => {
            const el = hotEls[i]; if (!el) return
            const p = net!.toScreen(n.at)
            el.style.left = `${p.x}px`; el.style.top = `${p.y}px`
          })
          raf = requestAnimationFrame(place)
        }
        place()
        ro = new ResizeObserver(() => net?.resize()); ro.observe(host)
      } catch (e) {
        host.classList.add('no-webgl')
      }
    })()
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); net?.destroy() }
  })
</script>

<div class="netmap" class:hero={variant === 'hero'} bind:this={host}>
  <canvas bind:this={canvasEl} aria-hidden="true"></canvas>

  <div class="hotspots" class:ready aria-label={COPY.network.a11yMap} role="group">
    {#each NODES as n, i (n.stationId)}
      <a
        bind:this={hotEls[i]}
        class="hot {statusOf(n.stationId)}"
        href={hrefOf(n.stationId)}
        aria-label={`G${i + 1} ${titleOf(n.stationId)} — ${statusOf(n.stationId)}`}
      ></a>
    {/each}
  </div>

  <!-- SSR / no-JS / no-WebGL truth (visually hidden when the canvas runs) -->
  <ul class="fallback">
    {#each LINES as l (l.id)}
      <li>
        <b style={`color:${l.colorVar}`}>{l.id.toUpperCase()}</b> · {l.patron}{l.terminus ? ` → ${l.terminus}` : ' · foundation'}
      </li>
    {/each}
  </ul>
</div>

<style>
  .netmap { position: relative; width: 100%; }
  .netmap canvas { display: block; width: 100%; height: 62vh; }
  .netmap.hero canvas { height: 44vh; min-height: 280px; }
  .hotspots { position: absolute; inset: 0; pointer-events: none; }
  .hot {
    position: absolute; width: 34px; height: 34px; transform: translate(-50%, -50%);
    border-radius: 9999px; opacity: 0; pointer-events: none; transition: opacity .2s ease;
  }
  .hotspots.ready .hot.open { opacity: 1; pointer-events: auto; cursor: pointer; }
  .hot.open:hover { box-shadow: 0 0 0 2px var(--color-signal); }
  .hot.open:focus-visible { opacity: 1; outline: 2px solid var(--color-signal); outline-offset: 3px; }
  /* fallback: screen-reader-only while the canvas runs; visible if no WebGL */
  .fallback {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip: rect(0 0 0 0); white-space: nowrap; margin: -1px; padding: 0; list-style: none;
  }
  .netmap.no-webgl canvas, .netmap.no-webgl .hotspots { display: none; }
  .netmap.no-webgl .fallback {
    position: static; width: auto; height: auto; clip: auto; white-space: normal;
    margin: 1.5rem 0 0; padding: 0; line-height: 2; font-size: 0.95rem;
  }
</style>
