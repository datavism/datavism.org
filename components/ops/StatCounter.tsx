'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: number
  label?: string
  prefix?: string
  suffix?: string
  className?: string
}

export default function StatCounter({
  value,
  label,
  prefix = '',
  suffix = '',
  className = '',
}: StatCounterProps) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const prevValueRef = useRef(0)

  useEffect(() => {
    const startValue = prevValueRef.current
    const duration = 2000

    startTimeRef.current = 0

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic for dramatic slowdown at the end
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (value - startValue) * eased)

      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        prevValueRef.current = value
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="font-mono text-2xl tabular-nums tracking-wider"
        style={{
          color: '#00ff41',
          textShadow: '0 0 8px rgba(0,255,65,0.5), 0 0 20px rgba(0,255,65,0.2)',
        }}
      >
        {prefix}
        {display.toLocaleString()}
        {suffix}
      </div>
      {label && (
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-green-500/50 mt-1">
          {label}
        </div>
      )}
    </div>
  )
}
