'use client'

import { use } from 'react'
import { FirstMissionWarrior } from '@/components/features/missions/FirstMission-Warrior'
import { useResistance } from '@/lib/store/useResistance'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function FirstMissionPage({ params }: { params: Promise<{ role: string }> }) {
  const resolvedParams = use(params)
  const { profile } = useResistance()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not awakened yet
    if (!profile) {
      router.push('/onboarding/awakening')
    }
  }, [profile, router])

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Redirecting to awakening...</div>
        </div>
      </div>
    )
  }

  // For now, all roles get the warrior mission
  // TODO: Create role-specific missions for rebel, artist, explorer
  switch (resolvedParams.role) {
    case 'warrior':
      return <FirstMissionWarrior />
    case 'rebel':
      return <FirstMissionWarrior /> // TODO: Create FirstMissionRebel
    case 'artist':
      return <FirstMissionWarrior /> // TODO: Create FirstMissionArtist
    case 'explorer':
      return <FirstMissionWarrior /> // TODO: Create FirstMissionExplorer
    default:
      return <FirstMissionWarrior />
  }
}
