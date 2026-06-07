import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DATAVISM | Contact',
  description: 'Reach the DATAVISM team. Public channels and secure communication options.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-green-500/10">
        <Link href="/" className="font-mono text-green-400/40 text-sm tracking-[0.3em] hover:text-green-400/60 transition-colors">
          DATAVISM
        </Link>
        <div className="flex gap-6">
          <Link href="/about" className="font-mono text-green-400/40 text-xs hover:text-green-400/60 transition-colors">ABOUT</Link>
          <Link href="/manifesto" className="font-mono text-green-400/40 text-xs hover:text-green-400/60 transition-colors">MANIFESTO</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-20 font-mono">
        <h1
          className="text-4xl md:text-5xl font-bold mb-12"
          style={{ color: '#00ff41', textShadow: '0 0 30px rgba(0,255,65,0.2)' }}
        >
          Contact
        </h1>

        <div className="space-y-10">
          {/* General */}
          <section>
            <h2 className="text-sm text-green-400/50 tracking-[0.2em] mb-4">GENERAL</h2>
            <div className="space-y-3 text-sm">
              <ContactLine label="Email" value="ghost@datavism.org" />
              <ContactLine label="GitHub" value="github.com/datavism" />
              <ContactLine label="X/Twitter" value="@datavism" />
            </div>
          </section>

          {/* Partnerships */}
          <section>
            <h2 className="text-sm text-green-400/50 tracking-[0.2em] mb-4">PARTNERSHIPS & MEDIA</h2>
            <div className="space-y-3 text-sm">
              <ContactLine label="Email" value="hello@datavism.org" />
            </div>
            <p className="text-green-400/30 text-xs mt-3">
              For institutional partnerships, media inquiries, or funding conversations.
            </p>
          </section>

          {/* Secure */}
          <section>
            <h2 className="text-sm text-red-400/70 tracking-[0.2em] mb-4">SECURE CHANNELS</h2>
            <div className="border border-red-500/20 p-5 space-y-3 text-sm">
              <ContactLine label="ProtonMail" value="ghost@protonmail.com" color="red" />
              <ContactLine label="Signal" value="Available on request" color="red" />
              <p className="text-red-400/40 text-xs pt-2">
                For sensitive information or whistleblower communications.
                Use Tor for maximum anonymity.
              </p>
            </div>
          </section>

          {/* Community */}
          <section>
            <h2 className="text-sm text-green-400/50 tracking-[0.2em] mb-4">COMMUNITY</h2>
            <div className="space-y-3 text-sm">
              <ContactLine label="Discord" value="discord.gg/datavism" />
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-green-500/10">
          <p className="text-green-400/20 text-xs">
            No tracking. No analytics on this page. No cookies.
            <br />
            We don&apos;t practice what we fight against.
          </p>
        </div>
      </div>
    </div>
  )
}

function ContactLine({ label, value, color = 'green' }: { label: string; value: string; color?: string }) {
  const c = color === 'red' ? 'text-red-400/70' : 'text-green-400/70'
  const labelC = color === 'red' ? 'text-red-400/40' : 'text-green-400/40'
  return (
    <div className="flex gap-4">
      <span className={`${labelC} w-24 shrink-0`}>{label}</span>
      <span className={c}>{value}</span>
    </div>
  )
}
