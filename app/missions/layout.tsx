import { ReactNode } from 'react'

export default function MissionsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Minimal nav: DATAVISM wordmark + back link */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-3 border-b border-green-500/10 bg-black/90 backdrop-blur flex items-center justify-between">
        <a
          href="/"
          className="font-mono text-green-400/40 text-sm tracking-[0.3em] hover:text-green-400/60 transition-colors"
        >
          DATAVISM
        </a>
        <a
          href="/ops"
          className="font-mono text-green-400/60 text-xs hover:text-green-400 transition-colors"
        >
          MISSION BOARD
        </a>
      </nav>
      <div className="pt-12">{children}</div>
    </div>
  )
}
