'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  text: string
  speed?: number  // ms per character
  onComplete?: () => void
  className?: string
  startDelay?: number
  skipAnimation?: boolean
}

export function TypewriterText({
  text,
  speed = 30,
  onComplete,
  className = '',
  startDelay = 0,
  skipAnimation = false
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState(skipAnimation ? text : '')
  const [isComplete, setIsComplete] = useState(skipAnimation)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (skipAnimation) {
      setDisplayedText(text)
      setIsComplete(true)
      onComplete?.()
      return
    }

    // Start delay
    const startTimer = setTimeout(() => {
      // Typing animation
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayedText(text.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        }, speed)

        return () => clearTimeout(timer)
      } else if (!isComplete) {
        setIsComplete(true)
        onComplete?.()
      }
    }, startDelay)

    return () => clearTimeout(startTimer)
  }, [currentIndex, text, speed, onComplete, isComplete, skipAnimation, startDelay])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-5 bg-green-400 ml-1"
        />
      )}
    </motion.div>
  )
}

interface TypewriterSequenceProps {
  lines: string[]
  speed?: number
  lineDelay?: number  // delay between lines
  onComplete?: () => void
  className?: string
}

export function TypewriterSequence({
  lines,
  speed = 30,
  lineDelay = 500,
  onComplete,
  className = ''
}: TypewriterSequenceProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [completedLines, setCompletedLines] = useState<string[]>([])

  const handleLineComplete = () => {
    setCompletedLines(prev => [...prev, lines[currentLineIndex]])

    if (currentLineIndex < lines.length - 1) {
      setTimeout(() => {
        setCurrentLineIndex(currentLineIndex + 1)
      }, lineDelay)
    } else {
      onComplete?.()
    }
  }

  return (
    <div className={className}>
      {completedLines.map((line, index) => (
        <div key={index} className="mb-2">
          {line}
        </div>
      ))}
      {currentLineIndex < lines.length && (
        <TypewriterText
          text={lines[currentLineIndex]}
          speed={speed}
          onComplete={handleLineComplete}
        />
      )}
    </div>
  )
}
