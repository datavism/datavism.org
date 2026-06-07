'use client'

import { useEffect, useRef } from 'react'

interface ActivityPulseProps {
  color?: string
  speed?: number
  className?: string
}

export default function ActivityPulse({
  color = '#00ff41',
  speed = 1,
  className = '',
}: ActivityPulseProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const rafRef = useRef<number>(0)
  const offsetRef = useRef(0)

  useEffect(() => {
    const width = 200
    const height = 40
    const mid = height / 2

    // Heartbeat pattern segments (relative x positions, y offsets)
    const beatPattern = [
      // flat line
      { dx: 0.0, y: mid },
      { dx: 0.15, y: mid },
      // small bump
      { dx: 0.18, y: mid - 3 },
      { dx: 0.21, y: mid },
      // big spike up
      { dx: 0.25, y: mid - 16 },
      // big spike down
      { dx: 0.28, y: mid + 10 },
      // return
      { dx: 0.32, y: mid },
      // small dip
      { dx: 0.38, y: mid + 3 },
      { dx: 0.42, y: mid },
      // flat
      { dx: 0.55, y: mid },
      // second beat (smaller)
      { dx: 0.58, y: mid - 2 },
      { dx: 0.61, y: mid },
      { dx: 0.64, y: mid - 10 },
      { dx: 0.66, y: mid + 6 },
      { dx: 0.70, y: mid },
      { dx: 0.74, y: mid + 2 },
      { dx: 0.78, y: mid },
      // flat tail
      { dx: 1.0, y: mid },
    ]

    const animate = () => {
      offsetRef.current += 0.003 * speed
      if (offsetRef.current > 1) offsetRef.current -= 1

      const shift = offsetRef.current * width

      // Build path with offset (creates scrolling effect)
      let d = ''
      for (let rep = -1; rep <= 1; rep++) {
        for (let i = 0; i < beatPattern.length; i++) {
          const pt = beatPattern[i]
          const x = pt.dx * width + rep * width - shift
          const y = pt.y
          if (d === '' && i === 0 && rep === -1) {
            d = `M ${x} ${y}`
          } else {
            d += ` L ${x} ${y}`
          }
        }
      }

      if (pathRef.current) {
        pathRef.current.setAttribute('d', d)
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed, color])

  return (
    <div className={`overflow-hidden ${className}`}>
      <svg
        width="200"
        height="40"
        viewBox="0 0 200 40"
        className="w-full h-full"
        style={{ filter: `drop-shadow(0 0 3px ${color}50)` }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
