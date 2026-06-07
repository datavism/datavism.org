'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const TABS = [
  { href: '/ops', label: 'HQ', icon: 'grid' },
  { href: '/ops/investigate', label: 'MISSIONS', icon: 'target', matchPrefix: true },
  { href: '/ops/evidence', label: 'EVIDENCE', icon: 'file' },
  { href: '/profile', label: 'PROFILE', icon: 'user' },
] as const

function TabIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? '#00ff41' : 'rgba(0,255,65,0.3)'

  switch (icon) {
    case 'grid':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" />
          <rect x="11" y="3" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" />
          <rect x="3" y="11" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" />
          <rect x="11" y="11" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" />
        </svg>
      )
    case 'target':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.5" />
          <circle cx="10" cy="10" r="3" stroke={color} strokeWidth="1.5" />
          <circle cx="10" cy="10" r="1" fill={color} />
        </svg>
      )
    case 'file':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 3h7l4 4v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke={color} strokeWidth="1.5" />
          <path d="M12 3v4h4" stroke={color} strokeWidth="1.5" />
          <line x1="7" y1="10" x2="13" y2="10" stroke={color} strokeWidth="1" />
          <line x1="7" y1="13" x2="11" y2="13" stroke={color} strokeWidth="1" />
        </svg>
      )
    case 'user':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth="1.5" />
          <path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke={color} strokeWidth="1.5" />
        </svg>
      )
    default:
      return null
  }
}

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (tab: typeof TABS[number]) => {
    if (tab.href === '/ops') return pathname === '/ops'
    if ('matchPrefix' in tab && tab.matchPrefix) {
      return pathname.startsWith('/ops/investigate') || pathname.startsWith('/missions')
    }
    return pathname.startsWith(tab.href)
  }

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex items-stretch">
        {TABS.map((tab) => {
          const active = isActive(tab)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 relative touch-target"
            >
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-green-400/60"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <TabIcon icon={tab.icon} active={active} />
              <span
                className={`font-mono text-[10px] tracking-[0.1em] ${
                  active ? 'text-green-400' : 'text-green-500/30'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
