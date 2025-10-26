'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Zap } from 'lucide-react'
import { useSound } from '@/lib/hooks/useSound'

interface DecryptPuzzleProps {
  onSolved: () => void
  message?: string
}

const encryptedMessage = "UJHIUOHTUDF TFS DPEF CFIJOE UIF DVSUBJO"
const decryptedMessage = "THE TRUTH IS CODE BEHIND THE CURTAIN"
const hint = "Shift each letter by -1"

export function DecryptPuzzle({
  onSolved,
  message = "Maya's encrypted transmission detected..."
}: DecryptPuzzleProps) {
  const [selectedLetters, setSelectedLetters] = useState<number[]>([])
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const { playSound } = useSound()

  const handleLetterClick = (index: number) => {
    if (isComplete) return

    playSound('typing')

    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter(i => i !== index))
    } else {
      setSelectedLetters([...selectedLetters, index])
    }
  }

  const handleDecrypt = () => {
    if (selectedLetters.length === 0) return

    setIsDecrypting(true)
    playSound('glitch')

    // Simulate decryption process
    setTimeout(() => {
      setIsDecrypting(false)
      setIsComplete(true)
      playSound('success')

      // Call onSolved after showing result
      setTimeout(() => {
        onSolved()
      }, 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            {isComplete ? (
              <Unlock className="w-8 h-8 text-green-400" />
            ) : (
              <Lock className="w-8 h-8 text-red-400 animate-pulse" />
            )}
            <h2 className={`text-2xl font-bold ${isComplete ? 'text-green-400' : 'text-red-400'}`}>
              {isComplete ? 'DECRYPTION SUCCESSFUL' : 'ENCRYPTED TRANSMISSION'}
            </h2>
          </div>

          <p className="text-gray-400">{message}</p>
        </motion.div>

        {/* Encrypted Message Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 border-2 border-cyan-500/30 rounded-lg bg-cyan-950/10 backdrop-blur-sm"
        >
          <div className="font-mono text-lg flex flex-wrap gap-2 justify-center">
            {(isComplete ? decryptedMessage : encryptedMessage).split('').map((char, index) => (
              <motion.span
                key={index}
                initial={isComplete ? { opacity: 0, y: -10 } : {}}
                animate={isComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.03 }}
                onClick={() => !isComplete && handleLetterClick(index)}
                className={`
                  cursor-pointer transition-all
                  ${char === ' ' ? 'w-4' : 'px-2 py-1 border rounded'}
                  ${isComplete
                    ? 'text-green-400 border-green-400 bg-green-950/30'
                    : selectedLetters.includes(index)
                    ? 'text-yellow-400 border-yellow-400 bg-yellow-950/30 scale-110'
                    : 'text-cyan-400 border-cyan-500/30 hover:border-cyan-400 hover:scale-105'
                  }
                  ${isDecrypting ? 'animate-pulse' : ''}
                `}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        {!isComplete && !isDecrypting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <p className="text-gray-400 mb-4">
              Click on letters to select them, then decrypt the message
            </p>

            {!showHint ? (
              <button
                onClick={() => {
                  setShowHint(true)
                  playSound('notification')
                }}
                className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
              >
                Need a hint?
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-sm text-yellow-400 font-mono"
              >
                💡 Hint: {hint}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Decrypt Button */}
        {!isComplete && (
          <div className="flex justify-center">
            <button
              onClick={handleDecrypt}
              disabled={selectedLetters.length === 0 || isDecrypting}
              className={`
                px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 transition-all
                ${selectedLetters.length > 0 && !isDecrypting
                  ? 'bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-105'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {isDecrypting ? (
                <>
                  <Zap className="w-5 h-5 animate-spin" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Decrypt Message
                </>
              )}
            </button>
          </div>
        )}

        {/* Success Message */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-8 p-6 border-2 border-green-400 bg-green-950/20 rounded-lg"
          >
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">
              You're In
            </h3>
            <p className="text-gray-300 mb-4">
              The resistance recognizes you. Now let's learn to break their code...
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Loading terminal...
            </div>
          </motion.div>
        )}

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan" />
      </div>
    </div>
  )
}
