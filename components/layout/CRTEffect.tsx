'use client'

import { useEffect, useState } from 'react'

export function CRTEffect() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div 
      className="crt-overlay"
      suppressHydrationWarning={true}
    />
  )
}