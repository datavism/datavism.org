// /lib/analytics.ts
'use client'
export function usePlausible() {
  // lädt Script nur 1x & nur im Client
  if (typeof window === 'undefined') return
  if (document.getElementById('plausible-script')) return
  const s = document.createElement('script')
  s.id = 'plausible-script'
  s.defer = true
  s.setAttribute('data-domain', process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || '')
  s.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(s)
}

export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(event, props ? { props } : undefined)
  }
}
