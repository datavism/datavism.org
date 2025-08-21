// /components/TerminalHero.tsx
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const lines = [
  '> INCOMING TRANSMISSION...',
  '> SOURCE: UNKNOWN',
  '> ENCRYPTION: ENABLED',
  '',
  '"If you\'re reading this, you\'ve been selected.',
  'The world is drowning in lies, but you can see through them.',
  'We need investigators. We need truth seekers.',
  'We need you."',
  '',
  '- Ghost',
]

export default function TerminalHero() {
  const [shown, setShown] = useState<string[]>([])
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setShown(prev => prev.length < lines.length ? [...prev, lines[i++]] : prev)
    }, 70)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-zinc-950 text-zinc-100 rounded-2xl p-6 md:p-8 shadow-xl border border-zinc-800">
      <pre className="font-mono text-sm md:text-base leading-6 whitespace-pre-wrap">
        {shown.join('\n')}
      </pre>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/academy/week1" className="px-4 py-2 rounded-xl bg-emerald-500 text-emerald-950 font-semibold hover:brightness-110">
          ACCEPT MISSION
        </Link>
        <Link href="#about" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700">
          LEARN MORE
        </Link>
      </div>
    </div>
  )
}
