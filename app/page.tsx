import { HeroSection } from '../components/features/landing/HeroSection'
import { StatsSection } from '../components/features/landing/StatsSection'
import { FeaturesSection } from '../components/features/landing/FeaturesSection'
import { LiveTerminal } from '../components/features/landing/LiveTerminal'
import { CTASection } from '../components/features/landing/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <LiveTerminal />
      <CTASection />
    </>
  )
}