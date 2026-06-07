import { ReactNode } from 'react'

export default function AwakenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Minimal: just DATAVISM wordmark top-left */}
      <div className="fixed top-4 left-6 z-50 font-mono text-green-400/40 text-sm tracking-[0.3em]">
        DATAVISM
      </div>
      {children}
    </div>
  )
}
