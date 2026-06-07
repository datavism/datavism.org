import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DATAVISM | About',
  description: 'Datavism is data activism powered by AI. We expose corporate manipulation, fight algorithmic injustice, and wield data as a weapon of truth.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-green-500/10">
        <Link href="/" className="font-mono text-green-400/40 text-sm tracking-[0.3em] hover:text-green-400/60 transition-colors">
          DATAVISM
        </Link>
        <div className="flex gap-6">
          <Link href="/manifesto" className="font-mono text-green-400/40 text-xs hover:text-green-400/60 transition-colors">MANIFESTO</Link>
          <Link href="/contact" className="font-mono text-green-400/40 text-xs hover:text-green-400/60 transition-colors">CONTACT</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-20 font-mono">
        <h1
          className="text-4xl md:text-5xl font-bold mb-12"
          style={{ color: '#00ff41', textShadow: '0 0 30px rgba(0,255,65,0.2)' }}
        >
          About DATAVISM
        </h1>

        <div className="space-y-8 text-green-400/80 text-sm leading-relaxed">
          <p>
            Datavism is not a platform. It&apos;s a practice.
          </p>

          <p>
            We build tools and experiences that empower people to use AI and data
            as instruments of accountability. Every investigation on DATAVISM targets
            real-world manipulation — greenwashing, price discrimination, surveillance
            overreach, dark patterns.
          </p>

          <div className="border-l-2 border-green-500/40 pl-6 py-2">
            <p className="text-green-400">
              The premise is simple: you don&apos;t need to be a data scientist to fight
              back. You need AI as your superpower and a mission worth fighting for.
            </p>
          </div>

          <p>
            DATAVISM was created because the same AI tools that corporations use to
            manipulate behavior can be turned around to expose that manipulation. The
            barrier to entry isn&apos;t technical knowledge anymore — it&apos;s knowing how to
            direct AI toward the right targets.
          </p>

          <h2 className="text-xl font-bold text-green-400 pt-4">
            How it works
          </h2>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-green-500/50 shrink-0">01</span>
              <span>You experience the reality of digital surveillance firsthand</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500/50 shrink-0">02</span>
              <span>You create your operative identity and meet GHOST — your AI agent</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500/50 shrink-0">03</span>
              <span>You take on real missions: investigating corporations, exposing manipulation, building evidence</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500/50 shrink-0">04</span>
              <span>Your findings join the Gallery of Impact — a growing archive of accountability</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-green-400 pt-4">
            Open source
          </h2>

          <p>
            DATAVISM is built in the open. The code is public. The investigations are
            transparent. We practice what we preach about accountability.
          </p>

          <p className="text-green-400/40 text-xs pt-8">
            Built with Next.js, Supabase, and open-source AI models.
            <br />
            No tracking. No ads. No data harvesting. Obviously.
          </p>
        </div>

        <div className="mt-16 flex gap-4">
          <Link
            href="/"
            className="font-mono text-sm text-green-400/70 border border-green-500/30 px-6 py-3 hover:bg-green-500/10 transition-colors"
          >
            BEGIN EXPERIENCE
          </Link>
          <Link
            href="/manifesto"
            className="font-mono text-sm text-green-400/40 border border-green-500/15 px-6 py-3 hover:border-green-500/30 transition-colors"
          >
            READ MANIFESTO
          </Link>
        </div>
      </div>
    </div>
  )
}
