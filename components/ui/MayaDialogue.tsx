'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Skull, AlertTriangle, Zap } from 'lucide-react'
import { TypewriterText, TypewriterSequence } from './TypewriterText'
import { useSound } from '@/lib/hooks/useSound'

interface MayaDialogueProps {
  character?: 'maya' | 'resistance' | 'system' | 'alert'
  text: string | string[]  // Single text or array for sequence
  onComplete?: () => void
  autoStart?: boolean
  showPortrait?: boolean
  emotion?: 'neutral' | 'urgent' | 'proud' | 'angry' | 'worried'
  glitchEffect?: boolean
}

const characterConfig = {
  maya: {
    name: 'Maya Chen',
    icon: Terminal,
    color: 'text-green-400',
    borderColor: 'border-green-400',
    bgColor: 'bg-green-950/20'
  },
  resistance: {
    name: 'Resistance Network',
    icon: Zap,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-400',
    bgColor: 'bg-cyan-950/20'
  },
  system: {
    name: 'System',
    icon: Terminal,
    color: 'text-yellow-400',
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-950/20'
  },
  alert: {
    name: 'Alert',
    icon: AlertTriangle,
    color: 'text-red-400',
    borderColor: 'border-red-400',
    bgColor: 'bg-red-950/20'
  }
}

const emotionStyles = {
  neutral: 'opacity-100',
  urgent: 'animate-pulse',
  proud: 'brightness-110',
  angry: 'contrast-125',
  worried: 'opacity-90'
}

export function MayaDialogue({
  character = 'maya',
  text,
  onComplete,
  autoStart = true,
  showPortrait = true,
  emotion = 'neutral',
  glitchEffect = false
}: MayaDialogueProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldStart, setShouldStart] = useState(autoStart)
  const { playSound, isEnabled } = useSound()
  const config = characterConfig[character]
  const Icon = config.icon

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (shouldStart && isEnabled) {
      playSound('notification')
    }
  }, [shouldStart, isEnabled, playSound])

  const handleComplete = () => {
    if (isEnabled) {
      playSound('success')
    }
    onComplete?.()
  }

  const textArray = Array.isArray(text) ? text : [text]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            relative p-6 rounded-lg border-2
            ${config.borderColor} ${config.bgColor}
            ${glitchEffect ? 'glitch-border' : ''}
            ${emotionStyles[emotion]}
          `}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan" />

          {/* Header */}
          {showPortrait && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className={`
                p-2 rounded-lg border ${config.borderColor} ${config.bgColor}
                ${emotion === 'urgent' ? 'animate-pulse' : ''}
              `}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <div className={`font-bold ${config.color}`}>{config.name}</div>
                <div className="text-xs text-gray-500">
                  {character === 'maya' && '✉ maya.chen@resistance.onion'}
                  {character === 'resistance' && '📡 Encrypted Channel'}
                  {character === 'system' && '⚙ System Terminal'}
                  {character === 'alert' && '🚨 Security Alert'}
                </div>
              </div>
            </motion.div>
          )}

          {/* Dialogue Text */}
          <div className={`font-mono text-base leading-relaxed ${config.color}`}>
            {textArray.length === 1 ? (
              <TypewriterText
                text={textArray[0]}
                speed={50}
                onComplete={handleComplete}
                className="whitespace-pre-wrap"
              />
            ) : (
              <TypewriterSequence
                lines={textArray}
                speed={50}
                lineDelay={500}
                onComplete={handleComplete}
                className="space-y-2"
              />
            )}
          </div>

          {/* Glitch corners */}
          {glitchEffect && (
            <>
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, -2, 0],
                  y: [0, -2, 0]
                }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
                className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${config.borderColor}`}
              />
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, 2, 0],
                  y: [0, -2, 0]
                }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2, delay: 0.15 }}
                className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${config.borderColor}`}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Quick dialogue presets
export const MayaDialogues = {
  welcome: {
    character: 'maya' as const,
    text: [
      "Welcome to the resistance.",
      "I'm Maya Chen. Former Facebook engineer. Current whistleblower.",
      "I built the algorithms that manipulate millions.",
      "Now I'll teach you to break them."
    ],
    emotion: 'neutral' as const
  },
  urgent: {
    character: 'maya' as const,
    text: "We need to move fast. They're watching.",
    emotion: 'urgent' as const,
    glitchEffect: true
  },
  success: {
    character: 'maya' as const,
    text: "Perfect. You're learning faster than I expected.",
    emotion: 'proud' as const
  },
  alert: {
    character: 'alert' as const,
    text: "⚠ SECURITY BREACH DETECTED ⚠",
    emotion: 'urgent' as const,
    glitchEffect: true
  }
}
