'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDatavist, ROLE_CONFIG } from '@/lib/store/useDatavist'
import { BottomNav } from '@/components/ui/BottomNav'

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const profile = useDatavist((s) => s.profile)
  const [time, setTime] = useState('')
  const [hydrated, setHydrated] = useState(false)

  // Hydration guard
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Redirect if not awakened
  useEffect(() => {
    if (hydrated && !profile) {
      router.replace('/awaken')
    }
  }, [hydrated, profile, router])

  if (!hydrated || !profile) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-green-500/40 font-mono text-sm animate-pulse">
          ESTABLISHING SECURE CONNECTION...
        </div>
      </div>
    )
  }

  const roleConf = ROLE_CONFIG[profile.role]

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-12 md:h-10 border-b border-green-500/10 flex items-center px-4 gap-3 md:gap-4 z-50">
        {/* Left: Wordmark */}
        <div className="flex-shrink-0">
          <span className="font-mono text-xs tracking-[0.3em] text-green-500/40 uppercase">
            Datavism
          </span>
        </div>

        {/* Center: Clock */}
        <div className="flex-1 flex justify-center">
          <span className="font-mono text-xs md:text-sm text-green-400 tracking-widest tabular-nums">
            {time}
          </span>
        </div>

        {/* Right: Operative + role */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="font-mono text-xs text-green-500/50 uppercase tracking-wider hidden sm:inline">
            {profile.codename}
          </span>
          <span
            className="text-sm"
            style={{ color: roleConf.colorHex }}
            title={roleConf.title}
          >
            {roleConf.icon}
          </span>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden">{children}</main>

      {/* ── Bottom Navigation (Mobile only) ────────────────────── */}
      <BottomNav />
    </div>
  )
}
