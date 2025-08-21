'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Twitter, MessageCircle, Mail } from 'lucide-react'

export function Footer() {
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/datavism', label: 'Twitter' },
    { icon: MessageCircle, href: 'https://discord.gg/datavism', label: 'Discord' },
    { icon: Github, href: 'https://github.com/datavism', label: 'GitHub' },
    { icon: Mail, href: 'mailto:ghost@datavism.org', label: 'Email' }
  ]

  return (
    <footer className="border-t border-green-400/30 bg-black/95 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & Mission */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/brand/svg/g3-neon-ghost-icon-dark.svg" 
                alt="DATAVISM Ghost Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-green-400">DATAVISM</span>
            </div>
            <p className="text-green-300 text-sm leading-relaxed mb-4">
              Learn Data Science by Exposing Algorithmic Manipulation. 
              Turn data into activism.
            </p>
            <p className="text-green-400/60 text-xs">
              A Non-Profit Digital Art Project
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider">
              Quick Access
            </h3>
            <div className="space-y-2">
              <Link href="/bootcamp" className="block text-green-300 hover:text-yellow-400 transition-colors text-sm">
                Bootcamp
              </Link>
              <Link href="/about" className="block text-green-300 hover:text-yellow-400 transition-colors text-sm">
                Manifesto
              </Link>
              <Link href="/contact" className="block text-green-300 hover:text-yellow-400 transition-colors text-sm">
                Secure Contact
              </Link>
              <Link href="/whistleblower" className="block text-red-400 hover:text-red-300 transition-colors text-sm">
                Report Manipulation
              </Link>
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-green-400 hover:text-yellow-400 transition-colors"
                  aria-label={link.label}
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </div>
            
            {/* Terminal-style motto */}
            <div className="bg-black/50 border border-green-400/30 p-3 font-mono text-xs">
              <div className="text-green-400">
                <span className="text-green-400/60">&gt; </span>
                "Algorithms control you.<br/>
                <span className="text-green-400/60">&gt; </span>
                Data activism frees you."
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-400/30 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-green-400/60 text-sm">
              © 2025 Datavism. Made with 🔥 for transparency.
            </p>
            <div className="flex gap-6 text-xs">
              <Link href="/privacy" className="text-green-400/60 hover:text-green-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-green-400/60 hover:text-green-400">
                Terms of Service
              </Link>
              <Link href="/security" className="text-green-400/60 hover:text-green-400">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}