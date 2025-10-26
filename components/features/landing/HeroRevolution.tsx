'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Terminal, AlertTriangle, Play } from 'lucide-react'
import { MayaVideo } from '@/components/ui/MayaVideo'
import { TrustBadges } from './TrustBadges'
import { useSound } from '@/lib/hooks/useSound'

export function HeroRevolution() {
  const [mounted, setMounted] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [trackingCount, setTrackingCount] = useState(0)
  const { playSound } = useSound()

  useEffect(() => {
    setMounted(true)

    // Simulate tracking count increasing
    const interval = setInterval(() => {
      setTrackingCount(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const handleStartClick = () => {
    playSound('notification')
    // Navigate to signup/bootcamp
  }

  const handleWatchTrailer = () => {
    setShowVideo(true)
    playSound('success')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-scroll 20s linear infinite'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* SHOCK VALUE: Tracking Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-950/30 border-2 border-red-500 rounded-lg mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            <div className="text-left">
              <div className="text-sm text-red-300 uppercase tracking-wide">You've been tracked</div>
              <div className="text-3xl font-bold text-red-400 font-mono">
                {trackingCount} times
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            ...in the last {Math.floor(trackingCount / 2)} seconds on this page alone
          </p>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block text-white mb-2">They Track You.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              Learn to Track Back.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Master data science by exposing real algorithmic manipulation.
            <br />
            <span className="text-yellow-400">No prerequisites. Real impact. Actually fun.</span>
          </p>
        </motion.div>

        {/* Video or Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          {showVideo ? (
            <MayaVideo
              title="Welcome to the Resistance"
              duration="2:30"
              autoPlay={true}
              allowSkip={true}
              onSkip={() => setShowVideo(false)}
              onComplete={() => setShowVideo(false)}
            />
          ) : (
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden border-2 border-green-500/30 group cursor-pointer"
                 onClick={handleWatchTrailer}>
              {/* Thumbnail placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">👻</div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Watch the Trailer</h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  See what happens when a Facebook engineer turns whistleblower
                </p>

                {/* Play button */}
                <div className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-400 flex items-center justify-center group-hover:bg-green-500/40 transition-all">
                  <Play className="w-10 h-10 text-green-400 ml-1" />
                </div>

                <p className="text-xs text-gray-600 mt-6">
                  2:30 • Coming soon
                </p>
              </div>

              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan" />
            </div>
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link
            href="/bootcamp/level/1"
            onClick={handleStartClick}
            className="group relative px-8 py-4 bg-green-500 text-black font-bold text-lg rounded-lg hover:bg-green-400 transition-all overflow-hidden"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

            <span className="relative flex items-center justify-center gap-2">
              <Terminal size={20} />
              Start Your Awakening - Free
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </span>
          </Link>

          <button
            onClick={handleWatchTrailer}
            className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold text-lg rounded-lg hover:bg-cyan-400 hover:text-black transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <Play size={20} />
              Watch 2-Min Trailer
            </span>
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <TrustBadges />
        </motion.div>

        {/* Ghost Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="max-w-3xl mx-auto mt-16 p-6 border-2 border-green-500/30 bg-green-950/10 rounded-lg backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">👻</span>
            <div>
              <h3 className="text-green-400 font-bold font-mono mb-2 text-lg">
                MESSAGE FROM GHOST
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-2">
                We're an anonymous collective of ex-FAANG engineers, activists, educators, and artists.
                We built the algorithms that manipulate millions. Now we're teaching you to break them.
              </p>
              <p className="text-sm text-yellow-300 leading-relaxed">
                You'll learn real Python. Analyze real data. Expose real manipulation. Create real change.
                <span className="block mt-1 text-cyan-400">The resistance is coded. Will you join?</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Social Proof - Live Activity Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Live activity</span>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Sarah from Berlin just started Level 1</div>
            <div className="text-gray-600">Mike completed the bootcamp in 3h 47min</div>
            <div className="text-gray-600">Squad "Data Rebels" just exposed their first algorithm</div>
          </div>
        </motion.div>
      </div>

      {/* CSS Animation for grid scroll */}
      <style jsx>{`
        @keyframes grid-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </section>
  )
}
