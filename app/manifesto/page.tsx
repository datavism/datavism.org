import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DATAVISM | Manifesto',
  description: 'Data is power. They weaponized it against you. Now you wield it back. The Datavism Manifesto.',
}

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,255,65,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.015) 0px, transparent 1px, transparent 3px)',
        }}
      />

      <article className="relative z-10 max-w-2xl w-full space-y-16">
        {/* Title */}
        <header className="text-center space-y-6">
          <h1
            className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            style={{ textShadow: '0 0 40px rgba(0,255,65,0.3)' }}
          >
            <span className="text-green-400">DATA</span>
            <span className="text-white">VISM</span>
          </h1>
          <p className="font-mono text-green-400/60 text-sm tracking-[0.3em] uppercase">
            A Manifesto
          </p>
        </header>

        {/* Body */}
        <div className="space-y-12 font-mono text-lg md:text-xl leading-relaxed">
          <section>
            <p className="text-white/90">
              Every second, your data is harvested.
              Every click catalogued. Every hesitation monetized.
              They turned your attention into a commodity
              and your behavior into a product.
            </p>
          </section>

          <section>
            <p className="text-white/90">
              They call it <span className="text-red-400">personalization</span>.
              <br />
              We call it <span className="text-red-400">extraction</span>.
            </p>
          </section>

          <section>
            <p className="text-green-400 text-2xl md:text-3xl font-bold">
              But the tools have changed.
            </p>
          </section>

          <section>
            <p className="text-white/90">
              Artificial intelligence was built to serve corporations.
              To predict your purchases. To manipulate your feed.
              To keep you scrolling, buying, complying.
            </p>
          </section>

          <section>
            <p className="text-white/90">
              We take those same tools and point them the other way.
            </p>
          </section>

          <section className="border-l-2 border-green-500 pl-6 space-y-4">
            <p className="text-green-400 text-xl md:text-2xl font-bold">
              Datavism is the act of using data as a weapon of truth.
            </p>
            <p className="text-white/70">
              AI is your superpower. You don&apos;t need to understand every algorithm.
              You need to know how to aim.
            </p>
          </section>

          <section>
            <p className="text-white/90">
              We investigate. We expose. We intervene.
              <br />
              Greenwashing. Price manipulation. Surveillance. Dark patterns.
              <br />
              We turn their data against them.
            </p>
          </section>

          <section>
            <p className="text-yellow-400 text-2xl md:text-3xl font-bold">
              You don&apos;t need permission.
              <br />
              You need a mission.
            </p>
          </section>

          <section>
            <p className="text-white/70 text-base">
              Datavism is not a course. It&apos;s not a platform.
              <br />
              It&apos;s a practice. A stance. A movement.
            </p>
          </section>

          <section className="text-center pt-8">
            <p
              className="text-green-400 text-3xl md:text-4xl font-bold"
              style={{ textShadow: '0 0 30px rgba(0,255,65,0.4)' }}
            >
              They profit from your data.
              <br />
              Now you fight back.
            </p>
          </section>
        </div>

        {/* CTA */}
        <footer className="text-center pt-8 space-y-6">
          <a
            href="/"
            className="inline-block font-mono text-lg text-green-400 border-2 border-green-500 px-10 py-5 hover:bg-green-500 hover:text-black transition-all tracking-wider"
            style={{
              boxShadow: '0 0 20px rgba(0,255,65,0.2)',
            }}
          >
            BEGIN THE EXPERIENCE
          </a>

          <p className="font-mono text-green-500/30 text-xs">
            // DATAVISM.ORG
          </p>
        </footer>
      </article>
    </div>
  )
}
