'use client'

import { useEffect, useState } from 'react'

interface ThreatLevelProps {
  level: 1 | 2 | 3 | 4 | 5
  className?: string
}

const LEVEL_LABELS: Record<number, string> = {
  1: 'MINIMAL',
  2: 'LOW',
  3: 'ELEVATED',
  4: 'HIGH',
  5: 'CRITICAL',
}

function getBarColor(barIndex: number, activeLevel: number): string {
  if (barIndex >= activeLevel) return 'rgba(255,255,255,0.08)'
  if (activeLevel <= 2) return '#00ff41'
  if (activeLevel === 3) return '#ffd600'
  if (activeLevel === 4) return '#ff9100'
  return '#ff1744'
}

function getGlowColor(level: number): string {
  if (level <= 2) return 'rgba(0,255,65,0.4)'
  if (level === 3) return 'rgba(255,214,0,0.4)'
  if (level === 4) return 'rgba(255,145,0,0.4)'
  return 'rgba(255,23,68,0.5)'
}

function getLabelColor(level: number): string {
  if (level <= 2) return '#00ff41'
  if (level === 3) return '#ffd600'
  if (level === 4) return '#ff9100'
  return '#ff1744'
}

export default function ThreatLevel({ level, className = '' }: ThreatLevelProps) {
  const [pulse, setPulse] = useState(false)

  // Pulse the active level bar
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const barHeights = [8, 14, 20, 26, 32]

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Bars */}
      <div className="flex items-end gap-1.5 h-9">
        {barHeights.map((h, i) => {
          const isActive = i < level
          const isTopBar = i === level - 1
          const color = getBarColor(i, level)

          return (
            <div
              key={i}
              className="w-3 rounded-sm transition-all duration-300"
              style={{
                height: `${h}px`,
                backgroundColor: color,
                opacity: isTopBar && pulse ? 0.6 : 1,
                boxShadow: isActive
                  ? `0 0 6px ${getGlowColor(level)}`
                  : 'none',
                transition: 'opacity 0.3s ease',
              }}
            />
          )
        })}
      </div>

      {/* Label */}
      <div
        className="font-mono text-xs uppercase tracking-[0.15em] whitespace-nowrap"
        style={{ color: getLabelColor(level) }}
      >
        THREAT LEVEL:{' '}
        <span className="font-bold">{LEVEL_LABELS[level]}</span>
      </div>
    </div>
  )
}
