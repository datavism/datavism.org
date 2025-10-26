import { HeroRevolution } from '../components/features/landing/HeroRevolution'
import { DataTrackingSimulation } from '../components/features/landing/DataTrackingSimulation'
import { LiveActivityFeed } from '../components/features/landing/LiveActivityFeed'
import { StatsSection } from '../components/features/landing/StatsSection'
import { FeaturesSection } from '../components/features/landing/FeaturesSection'
import { LiveTerminal } from '../components/features/landing/LiveTerminal'
import { CTASection } from '../components/features/landing/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroRevolution />
      <DataTrackingSimulation />

      {/* Live Activity Feed Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-white">Join </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              The Resistance
            </span>
          </h2>
          <LiveActivityFeed maxItems={5} />
        </div>
      </section>

      <StatsSection />
      <FeaturesSection />
      <LiveTerminal />
      <CTASection />
    </>
  )
}