'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Share2, Copy, Twitter, Linkedin, MessageCircle, Check } from 'lucide-react'
import { useSound } from '@/lib/hooks/useSound'
import {
  generateLiberationCode,
  generateShareMessages,
  copyToClipboard,
  trackCodeShare
} from '@/lib/services/liberationCode'
import Confetti from 'react-confetti'

interface VictorySequenceProps {
  userId: string
  level: number
  xpEarned: number
  timeTaken: number // in seconds
  onClose?: () => void
}

export function VictorySequence({
  userId,
  level,
  xpEarned,
  timeTaken,
  onClose
}: VictorySequenceProps) {
  const [liberationCode, setLiberationCode] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [copied, setCopied] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const { playSound } = useSound()

  useEffect(() => {
    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Generate liberation code
    const generate = async () => {
      playSound('success')

      const { code, error } = await generateLiberationCode({
        userId,
        level,
        xpEarned,
        timeTaken
      })

      if (!error && code) {
        // Reveal code with delay for dramatic effect
        setTimeout(() => {
          setLiberationCode(code)
          setIsGenerating(false)
          playSound('notification')
        }, 2000)
      } else {
        setIsGenerating(false)
        console.error('Failed to generate code:', error)
      }
    }

    generate()
  }, [userId, level, xpEarned, timeTaken, playSound])

  const handleCopy = async () => {
    const success = await copyToClipboard(liberationCode)
    if (success) {
      setCopied(true)
      playSound('success')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async (platform: 'twitter' | 'linkedin' | 'reddit' | 'whatsapp') => {
    const messages = generateShareMessages(liberationCode, level, timeTaken)
    await trackCodeShare(liberationCode)
    playSound('notification')

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messages.twitter)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://datavism.org')}&summary=${encodeURIComponent(messages.linkedin)}`,
      reddit: `https://reddit.com/submit?title=${encodeURIComponent(`Completed Level ${level} on DATAVISM`)}&text=${encodeURIComponent(messages.reddit)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  const hours = Math.floor(timeTaken / 3600)
  const minutes = Math.floor((timeTaken % 3600) / 60)
  const seconds = timeTaken % 60

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
    >
      {/* Confetti */}
      {!isGenerating && liberationCode && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#39FF14', '#00FFFF', '#FFFF00', '#FF2A6D']}
        />
      )}

      <div className="max-w-2xl w-full relative">
        {/* Victory Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="text-center mb-8"
        >
          <div className="text-8xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold text-yellow-400 mb-2">
            LEVEL {level} LIBERATED!
          </h1>
          <p className="text-xl text-gray-300">
            You've broken free from algorithmic manipulation
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="p-4 border border-green-400 bg-green-950/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 font-mono">
              +{xpEarned}
            </div>
            <div className="text-sm text-gray-400 uppercase">XP Earned</div>
          </div>

          <div className="p-4 border border-cyan-400 bg-cyan-950/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-cyan-400 font-mono">
              {hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${minutes}:${seconds.toString().padStart(2, '0')}`}
            </div>
            <div className="text-sm text-gray-400 uppercase">Time Taken</div>
          </div>

          <div className="p-4 border border-yellow-400 bg-yellow-950/20 rounded-lg text-center col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-yellow-400">
              👻
            </div>
            <div className="text-sm text-gray-400 uppercase">Awakened</div>
          </div>
        </motion.div>

        {/* Liberation Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mb-8 p-8 border-2 border-green-400 bg-green-950/20 rounded-lg backdrop-blur-sm"
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-green-400 mb-2">
              Your Liberation Code
            </h2>
            <p className="text-gray-400 text-sm">
              Share this code to inspire others to join the resistance
            </p>
          </div>

          {isGenerating ? (
            <div className="flex items-center justify-center gap-3 py-6">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : liberationCode ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-center mb-6"
              >
                <div className="inline-block px-8 py-4 bg-black border-2 border-green-400 rounded-lg">
                  <div className="text-5xl font-bold text-green-400 font-mono tracking-wider">
                    #{liberationCode.replace('-', '')}
                  </div>
                </div>
              </motion.div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="w-full mb-4 px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Code
                  </>
                )}
              </button>

              {/* Share Buttons */}
              <div className="space-y-2">
                <div className="text-sm text-gray-500 text-center mb-3">
                  Or share directly:
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="px-4 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </button>

                  <button
                    onClick={() => handleShare('linkedin')}
                    className="px-4 py-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>

                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="px-4 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>

                  <button
                    onClick={() => handleShare('reddit')}
                    className="px-4 py-3 bg-[#FF4500] text-white rounded-lg hover:bg-[#e03d00] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Share2 className="w-4 h-4" />
                    Reddit
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-red-400">
              Failed to generate code. Please try again.
            </div>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center space-y-4"
        >
          <p className="text-gray-300">
            Ready for more? Level 2 awaits...
          </p>

          <div className="flex gap-4 justify-center">
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-400 transition-all rounded"
              >
                Back to Dashboard
              </button>
            )}

            <button
              onClick={() => window.location.href = '/bootcamp/level/2'}
              className="px-8 py-3 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all rounded flex items-center gap-2"
            >
              Continue to Level 2
              <span>→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
