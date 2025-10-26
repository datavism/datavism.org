'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Code, Trophy, Users, X } from 'lucide-react'
import { useSound } from '@/lib/hooks/useSound'

interface WelcomeScreenProps {
  onComplete: () => void
  onSkip?: () => void
  userName?: string
}

const tourSteps = [
  {
    icon: Terminal,
    title: "Your Resistance Terminal",
    description: "This is where you'll write Python code to expose manipulation. Every line you write is a line of defense.",
    color: "text-green-400"
  },
  {
    icon: Code,
    title: "Real Code, Real Skills",
    description: "No multiple choice. No fill-in-the-blanks. You'll write actual Python that executes in your browser.",
    color: "text-cyan-400"
  },
  {
    icon: Trophy,
    title: "XP & Liberation",
    description: "Complete challenges to earn XP. Finish Level 1 to get your Liberation Code - share it to inspire others.",
    color: "text-yellow-400"
  },
  {
    icon: Users,
    title: "You're Not Alone",
    description: "Join squads. Share discoveries. Together we're building humanity's defense against manipulation.",
    color: "text-magenta-400"
  }
]

export function WelcomeScreen({ onComplete, onSkip, userName }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { playSound } = useSound()

  const handleNext = () => {
    playSound('notification')
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      playSound('success')
      onComplete()
    }
  }

  const handleSkip = () => {
    playSound('glitch')
    onSkip ? onSkip() : onComplete()
  }

  const step = tourSteps[currentStep]
  const Icon = step.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <div className="max-w-2xl w-full">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Main content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          {/* Welcome message (first step only) */}
          {currentStep === 0 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="mb-8"
            >
              <div className="text-6xl mb-4">👻</div>
              <h1 className="text-4xl font-bold text-green-400 mb-2">
                Welcome to the Resistance{userName ? `, ${userName}` : ''}
              </h1>
              <p className="text-gray-400">
                Your journey to digital liberation begins now
              </p>
            </motion.div>
          )}

          {/* Step icon */}
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-current ${step.color} mb-6`}>
            <Icon className="w-12 h-12" />
          </div>

          {/* Step content */}
          <h2 className={`text-3xl font-bold mb-4 ${step.color}`}>
            {step.title}
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed max-w-xl mx-auto mb-8">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-green-400 w-8'
                    : index < currentStep
                    ? 'bg-green-600'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-center">
            {currentStep < tourSteps.length - 1 ? (
              <>
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 border border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-400 transition-all rounded"
                >
                  Skip Tour
                </button>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-green-500 text-black font-bold hover:bg-green-400 transition-all rounded flex items-center gap-2"
                >
                  Next
                  <span>→</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="px-12 py-4 bg-green-500 text-black font-bold text-lg hover:bg-green-400 transition-all rounded flex items-center gap-2 group"
              >
                Let's Begin
                <Terminal className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
