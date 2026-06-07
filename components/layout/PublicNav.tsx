'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { href: '/ops', label: 'MISSIONS' },
  { href: '/gallery', label: 'GALLERY' },
  { href: '/profile', label: 'PROFILE' },
]

export function PublicNav() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-green-500/10 bg-black/95 backdrop-blur-sm safe-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-mono text-green-400/50 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] hover:text-green-400/80 transition-colors select-none"
        >
          DATAVISM
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative font-mono text-xs tracking-[0.1em] sm:tracking-[0.15em] py-1 transition-colors duration-200 touch-target
                ${isActive(link.href)
                  ? 'text-green-400'
                  : 'text-green-400/40 hover:text-green-400/70'
                }
              `}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="publicNavIndicator"
                  className="absolute -bottom-[1px] left-0 right-0 h-px bg-green-400/60"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
