'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { WelcomeScreen } from '@/components/bootcamp/WelcomeScreen'
import { DecryptPuzzle } from '@/components/bootcamp/DecryptPuzzle'
import { VictorySequence } from '@/components/bootcamp/VictorySequence'
import { Level1AwakeningExperience } from './Level1AwakeningExperience-Simple'

type OnboardingPhase = 'welcome' | 'decrypt' | 'challenges' | 'victory'

export function Level1Enhanced() {
  const [phase, setPhase] = useState<OnboardingPhase>('welcome')
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    // Check if user has seen welcome before
    const hasSeenWelcome = localStorage.getItem('datavism_has_seen_welcome')
    const savedProgress = localStorage.getItem('datavism_level1_progress')

    if (hasSeenWelcome || (savedProgress && JSON.parse(savedProgress).currentChallenge > 0)) {
      // Skip onboarding for returning users
      setPhase('challenges')
      setHasCompletedBefore(true)
    }

    // Get or create user ID
    let uid = localStorage.getItem('datavism_user_id')
    if (!uid) {
      uid = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('datavism_user_id', uid)
    }
    setUserId(uid)

    // Start timer
    setStartTime(Date.now())
  }, [])

  const handleWelcomeComplete = () => {
    localStorage.setItem('datavism_has_seen_welcome', 'true')
    setPhase('decrypt')
  }

  const handleDecryptComplete = () => {
    setPhase('challenges')
  }

  const handleLevel1Complete = (finalXp: number) => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000) // seconds
    setPhase('victory')

    // Save completion
    const completion = {
      level: 1,
      xp: finalXp,
      timeTaken,
      completedAt: new Date().toISOString()
    }
    localStorage.setItem('datavism_level1_completion', JSON.stringify(completion))
  }

  const handleVictoryClose = () => {
    // Navigate to dashboard or Level 2
    window.location.href = '/dashboard'
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'welcome' && !hasCompletedBefore && (
          <WelcomeScreen
            key="welcome"
            onComplete={handleWelcomeComplete}
            onSkip={handleWelcomeComplete}
          />
        )}

        {phase === 'decrypt' && (
          <DecryptPuzzle
            key="decrypt"
            onSolved={handleDecryptComplete}
          />
        )}

        {phase === 'challenges' && (
          <Level1AwakeningExperience
            key="challenges"
            onComplete={handleLevel1Complete}
          />
        )}

        {phase === 'victory' && userId && (
          <VictorySequence
            key="victory"
            userId={userId}
            level={1}
            xpEarned={parseInt(JSON.parse(localStorage.getItem('datavism_level1_completion') || '{}').xp || '0')}
            timeTaken={parseInt(JSON.parse(localStorage.getItem('datavism_level1_completion') || '{}').timeTaken || '0')}
            onClose={handleVictoryClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}
