import { OnboardingOrchestrator } from '@/components/onboarding/OnboardingOrchestrator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DATAVISM | Awaken',
  description: 'Create your operative identity.',
}

export default function AwakenPage() {
  return <OnboardingOrchestrator />
}
