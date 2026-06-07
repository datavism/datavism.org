'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SoundEngine } from '@/lib/audio/SoundEngine'
import type { UserRole, UserMotivation } from '@/lib/store/useDatavist'
import { Briefing } from './Briefing'
import { DriveSelection } from './DriveSelection'
import { RoleSelection } from './RoleSelection'
import { CodenameEntry } from './CodenameEntry'
import { AgentActivation } from './AgentActivation'

type Phase = 'briefing' | 'drive' | 'role' | 'codename' | 'activation'

export function OnboardingOrchestrator() {
  const [phase, setPhase] = useState<Phase>('briefing')
  const [motivation, setMotivation] = useState<UserMotivation | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [codename, setCodename] = useState<string>('')

  // Ensure audio context is initialized on first interaction
  const initAudio = useCallback(async () => {
    try {
      await SoundEngine.getInstance().init()
    } catch {
      // Audio not available — proceed silently
    }
  }, [])

  const handleBriefingComplete = useCallback(async () => {
    await initAudio()
    setPhase('drive')
  }, [initAudio])

  const handleDriveSelect = useCallback((m: UserMotivation) => {
    setMotivation(m)
    setPhase('role')
  }, [])

  const handleRoleSelect = useCallback((r: UserRole) => {
    setRole(r)
    setPhase('codename')
  }, [])

  const handleCodenameSubmit = useCallback((c: string) => {
    setCodename(c)
    setPhase('activation')
  }, [])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <AnimatePresence mode="wait">
        {phase === 'briefing' && (
          <Briefing key="briefing" onComplete={handleBriefingComplete} />
        )}

        {phase === 'drive' && (
          <DriveSelection key="drive" onSelect={handleDriveSelect} />
        )}

        {phase === 'role' && motivation && (
          <RoleSelection
            key="role"
            motivation={motivation}
            onSelect={handleRoleSelect}
          />
        )}

        {phase === 'codename' && role && (
          <CodenameEntry
            key="codename"
            role={role}
            onSubmit={handleCodenameSubmit}
          />
        )}

        {phase === 'activation' && role && motivation && (
          <AgentActivation
            key="activation"
            codename={codename}
            role={role}
            motivation={motivation}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
