'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Palette, Eye, Users } from 'lucide-react'
import Confetti from 'react-confetti'
import { useResistance } from '@/lib/store/useResistance'
import { useRouter } from 'next/navigation'

export function FirstMissionArtist() {
  const [phase, setPhase] = useState<'briefing' | 'creating' | 'success'>('briefing')
  const [selectedBubble, setSelectedBubble] = useState<'left' | 'right' | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const { completeMission, profile } = useResistance()
  const router = useRouter()

  // Simulated filter bubbles data
  const bubbleData = {
    left: {
      name: 'Progressive Bubble',
      color: '#3b82f6',
      posts: [
        '🌱 Climate action NOW!',
        '✊ Social justice matters',
        '🏳️‍🌈 Equality for all',
        '📚 Education is a right',
        '🌍 Save the planet'
      ],
      people: 47382,
      engagement: '94%'
    },
    right: {
      name: 'Conservative Bubble',
      color: '#ef4444',
      posts: [
        '🇺🇸 Traditional values matter',
        '💪 Personal responsibility',
        '⚖️ Law and order first',
        '🏛️ Preserve our heritage',
        '🔒 Protect freedom'
      ],
      people: 45291,
      engagement: '96%'
    }
  }

  const handleExplore = (bubble: 'left' | 'right') => {
    setSelectedBubble(bubble)

    if (!showConfetti) {
      setShowConfetti(true)
      setTimeout(() => {
        setPhase('success')
        completeMission('first-artist', 500)
      }, 4000)
    }
  }

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} colors={['#a855f7', '#ec4899', '#06b6d4']} />}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {phase === 'briefing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Maya's Briefing */}
            <div className="border-2 border-purple-400 p-8 mb-8 bg-purple-950/20">
              <div className="flex items-center gap-4 mb-6">
                <Palette className="w-12 h-12 text-purple-400" />
                <div>
                  <h2 className="text-2xl font-bold text-purple-400">Mission Briefing</h2>
                  <p className="text-gray-400">From: Maya Chen</p>
                </div>
              </div>

              <div className="space-y-4 text-lg text-gray-300">
                <p className="text-yellow-400 font-bold">
                  {profile?.name}, it's time to make the invisible visible.
                </p>
                <p>
                  Algorithms don't just manipulate. They <span className="text-red-400">divide</span>.
                </p>
                <p>
                  They put people in <span className="text-purple-400">filter bubbles</span> - invisible
                  walls that separate us. Show you only what you already believe.
                  Hide everything else.
                </p>
                <p className="text-red-400">
                  Two people on the same platform see completely different realities.
                  They're living in separate worlds, thinking they're seeing "the truth."
                </p>
                <p>
                  Data alone won't convince people. But a powerful visualization?
                  <span className="text-green-400"> That changes minds.</span>
                </p>
                <p className="text-purple-400">
                  Your mission: <strong>Visualize the division. Make them see it.</strong>
                </p>
              </div>
            </div>

            {/* The Challenge */}
            <div className="border border-cyan-400 p-6 mb-6 bg-cyan-950/10">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Viz Artist Challenge
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>🎨 <strong>Objective:</strong> Visualize filter bubbles in action</p>
                <p>🛠️ <strong>Tools:</strong> Interactive visualization (no code required!)</p>
                <p>💡 <strong>Method:</strong> Click each bubble to see how algorithms divide</p>
                <p>🎯 <strong>Reward:</strong> 500 XP + Viz Artist Badge</p>
              </div>
            </div>

            <button
              onClick={() => setPhase('creating')}
              className="w-full px-8 py-4 bg-purple-600 text-white font-bold text-xl hover:bg-purple-500"
            >
              START VISUALIZING →
            </button>
          </motion.div>
        )}

        {phase === 'creating' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold mb-2 text-purple-400">The Filter Bubble Reality</h2>
            <p className="text-gray-400 mb-8">
              Click each bubble to see what people inside experience.
              Notice: They never see each other.
            </p>

            {/* The Visualization */}
            <div className="relative h-[600px] mb-8 border-2 border-purple-400 bg-gradient-to-br from-purple-950/30 to-black p-8">
              {/* Center barrier */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-red-500/30 -ml-0.5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 py-2 text-red-400 text-sm font-bold border border-red-400">
                  ALGORITHMIC WALL
                </div>
              </div>

              {/* Left Bubble */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => handleExplore('left')}
                className={`absolute left-8 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full cursor-pointer transition-all ${
                  selectedBubble === 'left'
                    ? 'border-4 border-blue-400 bg-blue-500/20'
                    : 'border-2 border-blue-400/50 bg-blue-500/10 hover:bg-blue-500/20'
                }`}
                style={{
                  boxShadow: selectedBubble === 'left'
                    ? '0 0 60px rgba(59, 130, 246, 0.6)'
                    : '0 0 30px rgba(59, 130, 246, 0.3)'
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <Users className="w-12 h-12 text-blue-400 mb-2" />
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {bubbleData.left.name}
                  </h3>
                  <div className="text-sm text-blue-300">{bubbleData.left.people.toLocaleString()} people</div>
                  <div className="text-xs text-gray-400 mt-1">{bubbleData.left.engagement} engagement</div>
                </div>
              </motion.div>

              {/* Right Bubble */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => handleExplore('right')}
                className={`absolute right-8 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full cursor-pointer transition-all ${
                  selectedBubble === 'right'
                    ? 'border-4 border-red-400 bg-red-500/20'
                    : 'border-2 border-red-400/50 bg-red-500/10 hover:bg-red-500/20'
                }`}
                style={{
                  boxShadow: selectedBubble === 'right'
                    ? '0 0 60px rgba(239, 68, 68, 0.6)'
                    : '0 0 30px rgba(239, 68, 68, 0.3)'
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <Users className="w-12 h-12 text-red-400 mb-2" />
                  <h3 className="text-xl font-bold text-red-400 mb-2">
                    {bubbleData.right.name}
                  </h3>
                  <div className="text-sm text-red-300">{bubbleData.right.people.toLocaleString()} people</div>
                  <div className="text-xs text-gray-400 mt-1">{bubbleData.right.engagement} engagement</div>
                </div>
              </motion.div>
            </div>

            {/* Content Display */}
            {selectedBubble && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border-2 p-6 ${
                  selectedBubble === 'left'
                    ? 'border-blue-400 bg-blue-950/20'
                    : 'border-red-400 bg-red-950/20'
                }`}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  selectedBubble === 'left' ? 'text-blue-400' : 'text-red-400'
                }`}>
                  What people in {bubbleData[selectedBubble].name} see:
                </h3>

                <div className="grid grid-cols-1 gap-3 mb-4">
                  {bubbleData[selectedBubble].posts.map((post, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-black p-4 border border-gray-700"
                    >
                      <div className="text-lg">{post}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        👍 {Math.floor(Math.random() * 5000)} • 💬 {Math.floor(Math.random() * 500)} • ↗️ {Math.floor(Math.random() * 1000)}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4 text-gray-300">
                  <p className="text-sm">
                    ⚠️ <strong>Notice:</strong> The algorithm only shows content that confirms existing beliefs.
                    Content from the other bubble? <span className="text-red-400">Never appears.</span>
                  </p>
                </div>
              </motion.div>
            )}

            {selectedBubble && (
              <div className="text-center mt-6">
                <p className="text-yellow-400 text-lg mb-4">
                  Try exploring the other bubble. See how different the reality is.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {phase === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">🎨</div>
            <h1 className="text-5xl font-bold text-purple-400 mb-4">
              TRUTH VISUALIZED
            </h1>
            <p className="text-2xl text-yellow-400 mb-8">
              You've made the invisible visible, Viz Artist.
            </p>

            <div className="border-2 border-purple-400 p-8 mb-8 max-w-2xl mx-auto bg-purple-950/20">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">What You Revealed:</h2>
              <div className="space-y-3 text-left text-lg text-gray-300">
                <p>✓ 92,000+ people trapped in echo chambers</p>
                <p>✓ 94-96% engagement (high because it feels "right")</p>
                <p className="text-red-400 font-bold">✓ ZERO content shared between bubbles</p>
                <p>✓ Same platform. Opposite realities.</p>
                <p className="text-purple-400">✓ Algorithm creates division by design</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="border border-cyan-400 p-4 bg-cyan-950/10">
                <div className="text-3xl font-bold text-cyan-400">+500</div>
                <div className="text-sm text-gray-400">XP Earned</div>
              </div>
              <div className="border border-purple-400 p-4 bg-purple-950/10">
                <div className="text-3xl font-bold text-purple-400">🎨</div>
                <div className="text-sm text-gray-400">Viz Artist Badge</div>
              </div>
              <div className="border border-green-400 p-4 bg-green-950/10">
                <div className="text-3xl font-bold text-green-400">1/∞</div>
                <div className="text-sm text-gray-400">Stories Told</div>
              </div>
            </div>

            <div className="border border-cyan-400 p-6 mb-8 max-w-2xl mx-auto bg-cyan-950/10">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Next Level:</h3>
              <p className="text-gray-300">
                Build interactive 3D network graphs of disinformation spread.
                Visualize how fake news travels faster than truth.
                <span className="text-green-400"> Coming in Level 2.</span>
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-purple-600 text-white font-bold text-xl hover:bg-purple-500"
            >
              CONTINUE TO HQ →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
