<script>
  // Honest signal counter: counts trackable browser events client-side,
  // sends NOTHING anywhere. Pauses when tab hidden (perf rule).
  import { onMount } from 'svelte'
  import { SignalCounter } from '../lib/signals'
  import { COPY } from '../lib/copy/en'

  let total = $state(0)
  const counter = new SignalCounter()

  function bump(type, windowMs = 0) {
    if (document.hidden) return
    if (windowMs > 0) counter.recordThrottled(type, windowMs, performance.now())
    else counter.record(type)
    total = counter.total
  }

  onMount(() => {
    const onMove = () => bump('move', 400)
    const onScroll = () => bump('scroll', 600)
    const onClick = () => bump('click')
    const onKey = () => bump('key', 400)
    const tick = setInterval(() => bump('tick', 0), 1000) // 1 dwell-second = 1 signal

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)

    return () => {
      clearInterval(tick)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
    }
  })
</script>

<p class="text-phosphor-dim text-sm">
  {COPY.counter.lead}
  <span class="text-signal tabular-nums font-bold">{total}</span>
</p>
<p class="text-phosphor-dim text-xs">{COPY.counter.hint}</p>
<p class="text-phosphor-hi text-xs">{COPY.counter.collectedNote}</p>
