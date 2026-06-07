'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDatavist, ROLE_CONFIG } from '@/lib/store/useDatavist'
import { buildFirstContactPrompt } from '@/lib/ai/system-prompts'
import { AgentChat } from '@/components/ai/AgentChat'

export default function FirstContactPage() {
  const router = useRouter()
  const profile = useDatavist((s) => s.profile)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!profile) {
      router.replace('/awaken')
      return
    }
    const timer = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(timer)
  }, [profile, router])

  if (!profile || !ready) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-mono text-green-400/60 text-xs tracking-[0.3em]"
        >
          ESTABLISHING SECURE CHANNEL
        </motion.div>
      </div>
    )
  }

  const roleConfig = ROLE_CONFIG[profile.role]
  const systemPrompt = buildFirstContactPrompt(profile.role, profile.motivation, profile.codename)

  const greetings: Record<string, string> = {
    warrior: `Operative ${profile.codename}. GHOST online. Tactical analysis unit ready.\n\nI process datasets, detect statistical anomalies, and build evidence profiles at scale. You point, I find the patterns.\n\nSo tell me — what injustice in this world needs exposing?`,
    rebel: `${profile.codename}. GHOST here. All systems loaded.\n\nI write code, build scrapers, automate monitoring, and construct tools that tear through corporate deception. Whatever you need built, I build it.\n\nWhat problem out there needs a technical solution?`,
    artist: `${profile.codename}. GHOST reporting.\n\nI see data differently — every dataset is a story, every pattern a potential headline. I create visualizations that make injustice impossible to look away from.\n\nWhat story do you think the world needs to see?`,
    explorer: `${profile.codename}. GHOST online. Investigation protocol active.\n\nI follow money trails, cross-reference public records, verify claims against reality, and connect dots that powerful people hope stay unconnected.\n\nWhat doesn't add up?`,
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.012) 0px, transparent 1px, transparent 3px)' }}
      />

      {/* Minimal status bar */}
      <div className="relative z-20 flex items-center justify-between px-4 md:px-8 lg:px-16 py-3 border-b border-green-500/10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: roleConfig.colorHex }} />
          <span className="font-mono text-xs tracking-wider" style={{ color: roleConfig.colorHex, opacity: 0.7 }}>
            GHOST // {roleConfig.title.toUpperCase()}
          </span>
        </div>
        <span className="font-mono text-green-400/20 text-xs tracking-[0.2em] hidden sm:block">
          SECURE CHANNEL ACTIVE
        </span>
      </div>

      {/* Chat — full screen, no framing */}
      <div className="relative z-20 flex-1 overflow-hidden">
        <AgentChat
          systemPrompt={systemPrompt}
          initialMessage={greetings[profile.role]}
          className="h-full"
        />
      </div>

      {/* Bottom hint — appears after 45 seconds */}
      <MissionHint />

      {/* Ambient corner */}
      <div className="fixed bottom-4 right-4 font-mono text-green-500/10 text-xs z-20 hidden md:block">
        DATAVISM
      </div>
    </div>
  )
}

function MissionHint() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 45000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-20 px-4 md:px-8 lg:px-16 py-2 border-t border-green-500/10 flex items-center justify-between"
    >
      <span className="font-mono text-green-400/30 text-xs">
        Ready for a real mission?
      </span>
      <a
        href='/ops'
        className="font-mono text-xs text-green-400/60 hover:text-green-400 transition-colors tracking-wider"
      >
        MISSION BOARD →
      </a>
    </motion.div>
  )
}
