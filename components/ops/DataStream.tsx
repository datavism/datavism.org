'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface DataStreamProps {
  speed?: number
  width?: number
  className?: string
}

interface StreamLine {
  id: number
  text: string
  color: string
  y: number
  opacity: number
}

// Data generators for different "intercepted data" types
function randomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

function randomHex(len: number): string {
  const chars = '0123456789ABCDEF'
  let result = ''
  for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * 16)]
  return result
}

function randomTimestamp(): string {
  const h = String(Math.floor(Math.random() * 24)).padStart(2, '0')
  const m = String(Math.floor(Math.random() * 60)).padStart(2, '0')
  const s = String(Math.floor(Math.random() * 60)).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function randomPort(): string {
  return String(Math.floor(Math.random() * 65535))
}

function generateLine(): { text: string; color: string } {
  const r = Math.random()
  if (r < 0.15) {
    return { text: `[ALERT] ${randomIP()}:${randomPort()}`, color: '#ff1744' }
  }
  if (r < 0.3) {
    return { text: `TCP ${randomIP()} > ${randomPort()}`, color: '#00e5ff' }
  }
  if (r < 0.45) {
    return { text: `0x${randomHex(8)}`, color: '#00ff41' }
  }
  if (r < 0.55) {
    return { text: `${randomTimestamp()} SYN_RECV`, color: '#00e5ff' }
  }
  if (r < 0.65) {
    return { text: `TRACK ${randomHex(4)}-${randomHex(4)}`, color: '#ffd600' }
  }
  if (r < 0.75) {
    return { text: `${randomTimestamp()} PKT ${Math.floor(Math.random() * 9999)}`, color: '#00ff41' }
  }
  if (r < 0.85) {
    return { text: `DNS ${randomIP()} REQ`, color: '#00ff41' }
  }
  if (r < 0.92) {
    return { text: `[INTERCEPT] ${randomHex(12)}`, color: '#ff9100' }
  }
  return { text: `ACK ${randomPort()} > ${randomPort()} TTL=${Math.floor(Math.random() * 128)}`, color: '#00ff41' }
}

export default function DataStream({
  speed = 1,
  width = 180,
  className = '',
}: DataStreamProps) {
  const [lines, setLines] = useState<StreamLine[]>([])
  const nextIdRef = useRef(0)
  const rafRef = useRef<number>(0)
  const lastAddRef = useRef(0)
  const linesRef = useRef<StreamLine[]>([])

  // Keep ref in sync
  useEffect(() => {
    linesRef.current = lines
  }, [lines])

  const addLine = useCallback(() => {
    const { text, color } = generateLine()
    const newLine: StreamLine = {
      id: nextIdRef.current++,
      text,
      color,
      y: 0,
      opacity: 1,
    }
    linesRef.current = [newLine, ...linesRef.current]
    setLines([...linesRef.current])
  }, [])

  useEffect(() => {
    // Initial population
    const initial: StreamLine[] = []
    for (let i = 0; i < 20; i++) {
      const { text, color } = generateLine()
      initial.push({
        id: nextIdRef.current++,
        text,
        color,
        y: i * 18,
        opacity: Math.max(0, 1 - i * 0.05),
      })
    }
    linesRef.current = initial
    setLines(initial)

    // Continuously add lines at variable rate
    let burstMode = false
    let burstEnd = 0

    const tick = (timestamp: number) => {
      // Randomly enter burst mode
      if (!burstMode && Math.random() < 0.003) {
        burstMode = true
        burstEnd = timestamp + 1000 + Math.random() * 2000
      }
      if (burstMode && timestamp > burstEnd) {
        burstMode = false
      }

      const interval = burstMode ? 80 / speed : 300 / speed

      if (timestamp - lastAddRef.current > interval) {
        lastAddRef.current = timestamp
        addLine()

        // Trim old lines
        if (linesRef.current.length > 40) {
          linesRef.current = linesRef.current.slice(0, 35)
          setLines([...linesRef.current])
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed, addLine])

  return (
    <div
      className={`overflow-hidden font-mono text-xs leading-[18px] ${className}`}
      style={{ width: `${width}px` }}
    >
      {/* Fade overlay at top and bottom */}
      <div className="relative">
        <div
          className="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,1), transparent)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
          }}
        />
        <div className="max-h-[400px] overflow-hidden">
          {lines.map((line, i) => (
            <div
              key={line.id}
              className="whitespace-nowrap truncate px-1 transition-opacity duration-500"
              style={{
                color: line.color,
                opacity: Math.max(0.1, 1 - i * 0.04),
                textShadow: `0 0 4px ${line.color}30`,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
