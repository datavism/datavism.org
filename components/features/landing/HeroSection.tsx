'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Terminal, Shield, AlertCircle } from 'lucide-react'

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = 'The revolution will be computed.'

  useEffect(() => {
    setMounted(true)
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* CRT Effect Overlay */}
      <div className="crt-overlay" />
      
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-20">
        {mounted && <MatrixRain />}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Ghost Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-green-400 rounded-full flex items-center justify-center text-black text-6xl animate-pulse">
            👻
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-bold mb-6 glitch-text"
          data-text="DATAVISM"
        >
          DATAVISM
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl mb-4 text-yellow-400"
        >
          Learn Data Science by Exposing Real Corruption
        </motion.p>

        {/* Typed Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-xl mb-12 font-mono"
        >
          <span className="text-cyan-400">&gt; </span>
          {typedText}
          <span className="animate-blink">_</span>
        </motion.div>

        {/* Warning Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-2xl mx-auto mb-12 p-6 border-2 border-red-500 bg-red-950/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="text-red-500" size={24} />
            <span className="text-red-500 font-bold">SYSTEM WARNING</span>
          </div>
          <p className="text-sm text-red-300">
            This is not a game. You will analyze real leaked data. 
            You will expose actual corruption. You will make enemies. 
            They will try to stop you. Are you ready?
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/academy"
            className="px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              <Terminal size={20} />
              START INVESTIGATION
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </span>
          </Link>
          
          <Link
            href="/about"
            className="px-8 py-4 bg-transparent border-2 border-green-400 text-green-400 font-bold text-lg hover:bg-green-400 hover:text-black transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <Shield size={20} />
              READ MANIFESTO
            </span>
          </Link>
        </motion.div>

        {/* Live Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-12 text-sm text-green-300"
        >
          {mounted && <LiveCounter />}
        </motion.div>
      </div>
    </section>
  )
}

// Matrix Rain Component
function MatrixRain() {
  const [drops, setDrops] = useState<number[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const columns = Math.floor(window.innerWidth / 20)
      setDrops(Array(columns).fill(1))

      const interval = setInterval(() => {
        setDrops(prev => prev.map(y => (y > window.innerHeight || Math.random() > 0.95 ? 0 : y + 20)))
      }, 100)

      return () => clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {drops.map((y, i) => (
        <span
          key={i}
          className="absolute text-green-400 text-xs font-mono"
          style={{
            left: `${i * 20}px`,
            top: `${y}px`,
            opacity: y > 200 ? 0.5 : 1
          }}
        >
          {Math.random() > 0.5 ? '1' : '0'}
        </span>
      ))}
    </div>
  )
}

// Live Counter Component
function LiveCounter() {
  const [stats, setStats] = useState({
    investigators: 2847,
    exposed: 12.3,
    investigations: 247
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        investigators: prev.investigators + Math.floor(Math.random() * 3),
        exposed: prev.exposed + (Math.random() * 0.1),
        investigations: prev.investigations + (Math.random() > 0.7 ? 1 : 0)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-8 justify-center text-center">
      <div>
        <div className="text-2xl font-bold text-yellow-400">{stats.investigators}</div>
        <div className="text-xs uppercase">Active Investigators</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-red-400">€{stats.exposed.toFixed(1)}M</div>
        <div className="text-xs uppercase">Corruption Exposed</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-cyan-400">{stats.investigations}</div>
        <div className="text-xs uppercase">Ongoing Investigations</div>
      </div>
    </div>
  )
}