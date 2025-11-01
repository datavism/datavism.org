'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/bootcamp', label: 'BOOTCAMP' },
    { href: '/about', label: 'ABOUT' },
    { href: '/contact', label: 'CONTACT' }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="border-b border-green-400/30 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/brand/svg/g3-neon-ghost-icon-dark.svg" 
              alt="DATAVISM Ghost Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-green-400">DATAVISM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-mono tracking-wider transition-colors duration-300 py-2 ${
                  isActive(item.href)
                    ? 'text-yellow-400 shadow-glow'
                    : 'text-green-400 hover:text-yellow-400 hover:shadow-glow'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - 44x44px minimum touch target (WCAG) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-green-400 hover:text-yellow-400 transition-colors p-3 -mr-3"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-mono tracking-wider py-3 px-4 transition-all duration-300 rounded ${
                    isActive(item.href)
                      ? 'text-yellow-400 bg-yellow-400/10 border-l-4 border-yellow-400'
                      : 'text-green-400 hover:text-yellow-400 hover:bg-green-400/5'
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && <span className="ml-2">←</span>}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}