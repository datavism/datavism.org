'use client'

import { useRouter } from 'next/navigation'
import { TheAwakening } from '@/components/features/onboarding/TheAwakening'
import { useResistance } from '@/lib/store/useResistance'

interface AwakeningChoices {
  name: string
  motivation: 'truth' | 'justice' | 'freedom' | 'impact'
  role: 'warrior' | 'rebel' | 'artist' | 'explorer'
}

export default function AwakeningPage() {
  const router = useRouter()
  const { setProfile } = useResistance()

  const handleComplete = async (choices: AwakeningChoices) => {
    // Create resistance profile
    const profile = {
      name: choices.name,
      role: choices.role,
      motivation: choices.motivation,
      awakeningCompletedAt: new Date().toISOString(),
      level: 1,
      xp: 0,
      missionsCompleted: [],
    }

    // Save to Zustand store (persisted to localStorage)
    setProfile(profile)

    // TODO: Save to Supabase when authenticated

    // Redirect to personalized first mission based on role
    setTimeout(() => {
      router.push(`/missions/first/${choices.role}`)
    }, 3000)
  }

  return <TheAwakening onComplete={handleComplete} />
}
