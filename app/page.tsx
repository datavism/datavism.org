import { HeroRevolution } from '../components/features/landing/HeroRevolution'
import { DataTrackingSimulation } from '../components/features/landing/DataTrackingSimulation'
import { StatsSection } from '../components/features/landing/StatsSection'
import { FeaturesSection } from '../components/features/landing/FeaturesSection'
import { LiveTerminal } from '../components/features/landing/LiveTerminal'
import { CTASection } from '../components/features/landing/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroRevolution />
      <DataTrackingSimulation />
      <StatsSection />
      <FeaturesSection />
      <LiveTerminal />
      <CTASection />
    </>
  )
}