'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Zap, Eye, Brain, Shield, AlertTriangle } from 'lucide-react'
import Confetti from 'react-confetti'

interface TheAwakeningProps {
  onComplete: (choices: AwakeningChoices) => void
}

interface AwakeningChoices {
  name: string
  motivation: 'truth' | 'justice' | 'freedom' | 'impact'
  role: 'warrior' | 'rebel' | 'artist' | 'explorer'
}

type Phase = 'feed' | 'glitch' | 'maya' | 'truth' | 'choice' | 'role' | 'commitment' | 'welcome'

export function TheAwakening({ onComplete }: TheAwakeningProps) {
  const [phase, setPhase] = useState<Phase>('feed')
  const [choices, setChoices] = useState<Partial<AwakeningChoices>>({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [feedPosts, setFeedPosts] = useState(0)

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Simulate addictive feed scrolling
  useEffect(() => {
    if (phase === 'feed') {
      const interval = setInterval(() => {
        setFeedPosts(p => p + 1)
        if (feedPosts > 10) {
          setPhase('glitch')
        }
      }, 800)
      return () => clearInterval(interval)
    }
  }, [phase, feedPosts])

  const handleMotivation = (motivation: AwakeningChoices['motivation']) => {
    setChoices({ ...choices, motivation })
    setPhase('role')
  }

  const handleRole = (role: AwakeningChoices['role']) => {
    setChoices({ ...choices, role })
    setPhase('commitment')
  }

  const handleCommitment = () => {
    setShowConfetti(true)
    setPhase('welcome')
    setTimeout(() => {
      if (choices.motivation && choices.role && choices.name) {
        onComplete(choices as AwakeningChoices)
      }
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={1000}
          colors={['#00ff41', '#ffff00', '#00ffff', '#ff00ff']}
        />
      )}

      <AnimatePresence mode="wait">
        {/* PHASE 1: The Feed - Show how they're being manipulated */}
        {phase === 'feed' && (
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8 max-w-md"
          >
            <div className="space-y-4">
              <div className="text-gray-500 text-center text-sm mb-8">Your Feed</div>
              {Array.from({ length: Math.min(feedPosts, 15) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-700 p-4 rounded bg-gray-900"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-700 rounded-full" />
                    <div className="text-gray-400 text-sm">Ad • Sponsored</div>
                  </div>
                  <div className="text-red-400 font-bold mb-1">
                    {i % 3 === 0 && "🚨 BREAKING: You WON'T BELIEVE This!"}
                    {i % 3 === 1 && "⚠️ URGENT: Last Chance to Save 90%!"}
                    {i % 3 === 2 && "😱 SHOCKING: Everyone is Doing This Now!"}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Click now before it's too late...
                  </div>
                </motion.div>
              ))}
              <div className="text-center text-gray-600 text-sm animate-pulse">
                Scroll for more...
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 2: The Glitch - Something's wrong */}
        {phase === 'glitch' && (
          <motion.div
            key="glitch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen"
          >
            <motion.div
              animate={{
                opacity: [1, 0, 1, 0, 1],
                scale: [1, 1.1, 0.9, 1.2, 1],
              }}
              transition={{ duration: 2 }}
              onAnimationComplete={() => setPhase('maya')}
              className="text-center"
            >
              <div className="text-6xl mb-4 glitch-text" data-text="ERROR">ERROR</div>
              <div className="text-red-400 text-2xl animate-pulse">WAKE UP</div>
              <div className="text-gray-400 mt-4">Something's not right...</div>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 3: Maya Appears */}
        {phase === 'maya' && (
          <motion.div
            key="maya"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-16 max-w-3xl"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="border-2 border-green-400 p-8 bg-green-950/20 mb-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <Terminal className="w-12 h-12 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-green-400">Maya Chen</div>
                  <div className="text-sm text-gray-400">Former MetaFace Engineer</div>
                </div>
              </div>

              <div className="space-y-4 text-lg leading-relaxed">
                <p>Those weren't random posts.</p>
                <p className="text-yellow-400">They were designed to manipulate you.</p>
                <p>BREAKING. URGENT. LAST CHANCE. SHOCKING.</p>
                <p>Every word calculated. Every emotion weaponized.</p>
                <p className="text-red-400">I know. I built the system.</p>
                <p className="mt-6">The question is: Are you ready to see how deep this goes?</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPhase('truth')}
                className="mt-8 w-full px-8 py-4 bg-red-600 text-white font-bold text-xl hover:bg-red-500 transition-colors"
              >
                Show me the truth
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 4: The Truth - The Algorithmic Consortium */}
        {phase === 'truth' && (
          <motion.div
            key="truth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-16 max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold text-red-400 mb-4 glitch-text" data-text="THE ALGORITHMIC CONSORTIUM">
                THE ALGORITHMIC CONSORTIUM
              </h1>
              <p className="text-xl text-gray-300">They control more than you think.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Brain, title: 'Your Mind', desc: 'AI-powered manipulation targeting your psychology' },
                { icon: Zap, title: 'Your Money', desc: 'Dynamic pricing extracting maximum profit' },
                { icon: Eye, title: 'Your Privacy', desc: 'Surveillance capitalism monetizing your behavior' },
              ].map((threat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="border border-red-400 p-6 bg-red-950/20"
                >
                  <threat.icon className="w-12 h-12 text-red-400 mb-4" />
                  <h3 className="text-xl font-bold text-red-400 mb-2">{threat.title}</h3>
                  <p className="text-gray-300">{threat.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="border-2 border-yellow-400 p-8 bg-yellow-950/20 mb-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">But here's the thing...</h2>
              <p className="text-xl mb-4">They're not unbeatable.</p>
              <p className="text-lg text-gray-300">
                Every algorithm has a pattern. Every manipulation leaves a trace.
                And we can detect it. Expose it. <span className="text-green-400 font-bold">Stop it.</span>
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPhase('choice')}
              className="w-full px-8 py-4 bg-green-600 text-black font-bold text-2xl hover:bg-green-500 transition-colors"
            >
              I want to fight back
            </motion.button>
          </motion.div>
        )}

        {/* PHASE 5: Your Motivation - Why are you here? */}
        {phase === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-16 max-w-4xl"
          >
            <h1 className="text-4xl font-bold text-green-400 mb-4 text-center">
              Why do you want to join the resistance?
            </h1>
            <p className="text-xl text-gray-400 mb-12 text-center">
              Choose what drives you. This matters.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  id: 'truth' as const,
                  title: 'Seeking Truth',
                  desc: 'I want to uncover what\'s hidden. See through the lies. Understand reality.',
                  color: 'cyan',
                },
                {
                  id: 'justice' as const,
                  title: 'Fighting for Justice',
                  desc: 'I want to hold the powerful accountable. Expose corruption. Demand fairness.',
                  color: 'yellow',
                },
                {
                  id: 'freedom' as const,
                  title: 'Protecting Freedom',
                  desc: 'I want to defend privacy. Stop surveillance. Preserve autonomy.',
                  color: 'green',
                },
                {
                  id: 'impact' as const,
                  title: 'Making Impact',
                  desc: 'I want to change the world. Build solutions. Create lasting change.',
                  color: 'purple',
                },
              ].map((motivation) => (
                <motion.button
                  key={motivation.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMotivation(motivation.id)}
                  className={`border-2 border-${motivation.color}-400 p-8 text-left hover:bg-${motivation.color}-950/30 transition-all`}
                >
                  <h3 className={`text-2xl font-bold text-${motivation.color}-400 mb-3`}>
                    {motivation.title}
                  </h3>
                  <p className="text-gray-300">{motivation.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PHASE 6: Your Role - What will you do? */}
        {phase === 'role' && (
          <motion.div
            key="role"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-16 max-w-5xl"
          >
            <h1 className="text-4xl font-bold text-green-400 mb-4 text-center">
              Choose your path in the resistance
            </h1>
            <p className="text-xl text-gray-400 mb-12 text-center">
              Everyone contributes differently. What's your strength?
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  id: 'warrior' as const,
                  title: '📊 Data Warrior',
                  desc: 'Analyze patterns. Crunch numbers. Find the smoking gun in datasets.',
                  skills: 'Python • Pandas • Statistics',
                  for: 'Analytical minds, problem solvers, pattern hunters',
                },
                {
                  id: 'rebel' as const,
                  title: '💻 Code Rebel',
                  desc: 'Build tools. Automate investigations. Create the weapons of truth.',
                  skills: 'JavaScript • APIs • Automation',
                  for: 'Builders, engineers, tool creators',
                },
                {
                  id: 'artist' as const,
                  title: '🎨 Viz Artist',
                  desc: 'Make data beautiful. Tell stories. Turn numbers into impact.',
                  skills: 'D3.js • Design • Storytelling',
                  for: 'Designers, communicators, storytellers',
                },
                {
                  id: 'explorer' as const,
                  title: '🔍 Truth Explorer',
                  desc: 'Investigate. Document. Connect the dots. Ask the hard questions.',
                  skills: 'Research • OSINT • Critical Thinking',
                  for: 'Curious minds, researchers, detectives',
                },
              ].map((role) => (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRole(role.id)}
                  className="border-2 border-green-400 p-6 text-left hover:bg-green-950/30 transition-all"
                >
                  <h3 className="text-2xl font-bold text-green-400 mb-3">{role.title}</h3>
                  <p className="text-lg text-gray-300 mb-4">{role.desc}</p>
                  <div className="border-t border-green-400/30 pt-3 mt-3">
                    <div className="text-sm text-yellow-400 mb-1">You'll learn:</div>
                    <div className="text-sm text-gray-400 mb-3">{role.skills}</div>
                    <div className="text-xs text-gray-500">For: {role.for}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            <p className="text-center text-gray-500 mt-8 text-sm">
              Don't worry - you can explore all paths later. This is just where you'll start.
            </p>
          </motion.div>
        )}

        {/* PHASE 7: The Commitment */}
        {phase === 'commitment' && (
          <motion.div
            key="commitment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-16 max-w-3xl"
          >
            <div className="border-2 border-green-400 p-12 bg-green-950/20">
              <div className="flex items-center justify-center mb-8">
                <Shield className="w-24 h-24 text-green-400" />
              </div>

              <h1 className="text-4xl font-bold text-green-400 mb-6 text-center">
                Welcome to DATAVISM
              </h1>

              <div className="space-y-4 text-lg text-gray-300 mb-8">
                <p className="text-center">
                  You're not just learning data science.
                </p>
                <p className="text-center text-yellow-400 font-bold">
                  You're joining a movement.
                </p>
                <p className="text-center">
                  Every algorithm you write helps expose manipulation.<br />
                  Every pattern you detect weakens their control.<br />
                  Every investigation you complete changes the world.
                </p>
              </div>

              <div className="border border-green-400/30 p-6 mb-8">
                <div className="text-sm text-gray-400 mb-4 text-center">Your resistance name:</div>
                <input
                  type="text"
                  placeholder="Enter your codename..."
                  onChange={(e) => setChoices({ ...choices, name: e.target.value })}
                  className="w-full bg-black border-2 border-green-400 px-4 py-3 text-green-400 text-center text-xl font-mono focus:outline-none focus:border-yellow-400"
                />
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Choose wisely. This is how you'll be known.
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCommitment}
                disabled={!choices.name || choices.name.length < 3}
                className="w-full px-8 py-4 bg-green-600 text-black font-bold text-2xl hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                JOIN THE RESISTANCE
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* PHASE 8: Welcome to the Network */}
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <div className="text-8xl mb-4">👻</div>
                <h1 className="text-5xl font-bold text-green-400 mb-4">
                  Welcome, {choices.name}
                </h1>
                <p className="text-2xl text-yellow-400">
                  Your mission begins now.
                </p>
              </motion.div>

              <div className="text-gray-400 text-lg">
                Redirecting to your first mission...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
