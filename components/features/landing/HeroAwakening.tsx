'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Terminal, AlertTriangle, Eye, Brain } from 'lucide-react'

export function HeroAwakening() {
  const [manipulationCount, setManipulationCount] = useState(0)
  const [showTruth, setShowTruth] = useState(false)

  useEffect(() => {
    // Simulate real-time manipulation counter
    const interval = setInterval(() => {
      setManipulationCount(prev => prev + Math.floor(Math.random() * 50) + 10)
    }, 100)

    // Show truth after 3 seconds
    setTimeout(() => setShowTruth(true), 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Counter - Pre-awakening */}
        {!showTruth && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-gray-500 text-sm mb-4">Real-time global detection</div>
            <div className="text-6xl font-bold text-red-400 mb-2 font-mono">
              {manipulationCount.toLocaleString()}
            </div>
            <div className="text-gray-400 text-lg">
              algorithmic manipulations detected in the last minute
            </div>
          </motion.div>
        )}

        {/* The Awakening */}
        {showTruth && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            {/* Alert Box */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="border-2 border-red-400 bg-red-950/30 p-6 mb-8 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="text-red-400 w-8 h-8" />
                <div className="text-red-400 text-xl font-bold">SYSTEM ALERT</div>
              </div>
              <div className="text-gray-300 text-lg">
                You are being manipulated <span className="text-red-400 font-bold">right now</span>.
              </div>
            </motion.div>

            {/* Main Message */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">They control your</span>{' '}
                <span className="text-red-400 glitch-text" data-text="FEED">FEED</span>
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="text-white">They control your</span>{' '}
                <span className="text-yellow-400">WALLET</span>
              </h2>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                <span className="text-white">They control your</span>{' '}
                <span className="text-cyan-400">MIND</span>
              </h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl text-green-400 font-bold mb-8"
              >
                But you can stop them.
              </motion.div>
            </div>

            {/* The Three Threats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="border border-red-400/50 p-6 bg-black/50 backdrop-blur-sm"
              >
                <Eye className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-red-400 mb-2">Surveillance</h3>
                <p className="text-gray-400">
                  Every click tracked. Every scroll analyzed. Your behavior monetized.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="border border-yellow-400/50 p-6 bg-black/50 backdrop-blur-sm"
              >
                <Brain className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Manipulation</h3>
                <p className="text-gray-400">
                  AI-powered triggers. Psychological warfare. Your emotions weaponized.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="border border-cyan-400/50 p-6 bg-black/50 backdrop-blur-sm"
              >
                <Terminal className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Control</h3>
                <p className="text-gray-400">
                  Algorithms decide what you see. What you buy. What you believe.
                </p>
              </motion.div>
            </div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
              className="border-2 border-green-400 p-8 bg-green-950/20 backdrop-blur-sm mb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">👻</div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400">Welcome to DATAVISM</h3>
                  <p className="text-gray-400">The Reality Defense Network</p>
                </div>
              </div>

              <div className="space-y-4 text-lg text-gray-300 mb-6">
                <p>
                  We're not just teaching data science.
                  <span className="text-green-400 font-bold"> We're building an army of digital activists.</span>
                </p>
                <p>
                  Every algorithm you learn helps <span className="text-yellow-400">expose manipulation</span>.<br />
                  Every pattern you detect <span className="text-cyan-400">weakens their control</span>.<br />
                  Every investigation you complete <span className="text-green-400">changes reality</span>.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400 mb-8">
                <div>✓ No coding experience needed</div>
                <div>✓ Real-world impact from day one</div>
                <div>✓ Learn $100k+ skills</div>
                <div>✓ Join 2,847 data activists</div>
              </div>

              <Link href="/onboarding/awakening">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-6 bg-green-600 text-black font-bold text-2xl hover:bg-green-500 transition-colors shadow-lg shadow-green-500/50"
                >
                  START YOUR AWAKENING →
                </motion.button>
              </Link>

              <p className="text-center text-gray-500 text-sm mt-4">
                Free forever. No credit card. Just you vs. the algorithm.
              </p>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center text-gray-500 text-sm"
            >
              <p>
                "I learned more in 4 hours than in 4 months of tutorials." - @data_rebel_47
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
