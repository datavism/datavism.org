'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { success as playSuccess, impact, scan, whoosh } from '@/lib/audio/procedural'

// ─── Types ──────────────────────────────────────────────────────────

interface DeviceProfile {
  id: string
  name: string
  icon: 'iphone' | 'android' | 'macbook' | 'oldlaptop'
  location: string
  price: number
  color: string
  profile: {
    incomeEstimate: string
    browsingHistory: string
    deviceValue: string
    locationWealth: string
    priceCategory: string
  }
}

interface SearchScenario {
  id: string
  product: string
  subtitle: string
  category: string
  devices: DeviceProfile[]
  finding: string
}

// ─── Device Visuals ─────────────────────────────────────────────────

function DeviceFrame({ type, children }: { type: DeviceProfile['icon']; children: React.ReactNode }) {
  if (type === 'iphone' || type === 'android') {
    const isIphone = type === 'iphone'
    return (
      <div className={`rounded-[20px] p-1 ${isIphone ? 'bg-gray-300' : 'bg-gray-600'}`}>
        <div className={`rounded-[16px] overflow-hidden ${isIphone ? 'bg-white' : 'bg-gray-100'} relative`}>
          {/* Notch / camera */}
          <div className="flex justify-center pt-1">
            <div className={`h-4 rounded-full ${isIphone ? 'w-20 bg-gray-300' : 'w-3 h-3 bg-gray-400 rounded-full'}`} />
          </div>
          <div className="px-2 pb-3 pt-1">
            {children}
          </div>
          {/* Home indicator */}
          <div className="flex justify-center pb-1.5">
            <div className={`h-1 w-10 rounded-full ${isIphone ? 'bg-gray-300' : 'bg-gray-400'}`} />
          </div>
        </div>
      </div>
    )
  }

  // Laptop
  const isOld = type === 'oldlaptop'
  return (
    <div>
      <div className={`rounded-t-lg p-1 ${isOld ? 'bg-gray-500 border-2 border-gray-400' : 'bg-gray-300'}`}>
        <div className={`rounded-t overflow-hidden ${isOld ? 'bg-gray-200' : 'bg-white'} relative`}>
          {/* Webcam dot */}
          <div className="flex justify-center pt-0.5">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
          </div>
          <div className="px-2 pb-2 pt-1">
            {children}
          </div>
        </div>
      </div>
      {/* Keyboard base */}
      <div className={`h-2.5 rounded-b-lg mx-2 ${isOld ? 'bg-gray-400' : 'bg-gray-200'}`}>
        <div className={`h-0.5 mx-auto rounded-full mt-1 ${isOld ? 'w-8 bg-gray-500' : 'w-12 bg-gray-300'}`} />
      </div>
    </div>
  )
}

// ─── Animated Price Counter ─────────────────────────────────────────

function AnimatedPrice({ target, color, revealed }: { target: number; color: string; revealed: boolean }) {
  const [display, setDisplay] = useState(0)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    if (!revealed) {
      setDisplay(0)
      return
    }

    const duration = 1200
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setDisplay(Math.round(eased * target))

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [target, revealed])

  return (
    <span className="font-mono font-bold tabular-nums" style={{ color }}>
      ${display}
    </span>
  )
}

// ─── Bar Chart ──────────────────────────────────────────────────────

function PriceBarChart({ devices, revealed }: { devices: DeviceProfile[]; revealed: boolean }) {
  const maxPrice = Math.max(...devices.map(d => d.price))

  return (
    <div className="flex items-end gap-2 h-28">
      {devices.map((device, i) => {
        const height = revealed ? (device.price / maxPrice) * 100 : 0
        return (
          <div key={device.id} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: revealed ? 0.8 + i * 0.15 : 0, duration: 0.6, ease: 'easeOut' }}
              className="w-full rounded-t"
              style={{ backgroundColor: device.color, minHeight: revealed ? 4 : 0 }}
            />
            <span className="text-xs font-mono text-green-500/50 text-center leading-tight truncate w-full">
              {device.name.split(' ')[0]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Search Scenarios ───────────────────────────────────────────────

const SCENARIOS: SearchScenario[] = [
  {
    id: 'flight',
    product: 'Flight: Berlin > London',
    subtitle: 'Round-trip, Economy, March 20-27',
    category: 'Travel',
    devices: [
      {
        id: 'iphone-sf', name: 'iPhone 15 Pro', icon: 'iphone', location: 'San Francisco, CA',
        price: 487, color: '#3b82f6',
        profile: {
          incomeEstimate: '$142,000/yr (95th percentile)',
          browsingHistory: 'Frequent flyer, business travel searches',
          deviceValue: '$1,199 (flagship tier)',
          locationWealth: 'Median income: $119,000',
          priceCategory: 'PREMIUM',
        },
      },
      {
        id: 'android-det', name: 'Samsung A14', icon: 'android', location: 'Detroit, MI',
        price: 342, color: '#22c55e',
        profile: {
          incomeEstimate: '$38,000/yr (35th percentile)',
          browsingHistory: 'Price comparison sites, budget travel',
          deviceValue: '$199 (budget tier)',
          locationWealth: 'Median income: $31,000',
          priceCategory: 'STANDARD',
        },
      },
      {
        id: 'macbook-nyc', name: 'MacBook Pro', icon: 'macbook', location: 'Manhattan, NY',
        price: 523, color: '#ef4444',
        profile: {
          incomeEstimate: '$185,000/yr (98th percentile)',
          browsingHistory: 'Luxury hotels, first class searches',
          deviceValue: '$2,499 (ultra-premium tier)',
          locationWealth: 'Median income: $93,000',
          priceCategory: 'PREMIUM+',
        },
      },
      {
        id: 'old-ohio', name: 'Old ThinkPad', icon: 'oldlaptop', location: 'Rural Ohio',
        price: 298, color: '#a3e635',
        profile: {
          incomeEstimate: '$29,000/yr (22nd percentile)',
          browsingHistory: 'Minimal — private browsing detected',
          deviceValue: '$150 (legacy tier)',
          locationWealth: 'Median income: $26,000',
          priceCategory: 'VALUE',
        },
      },
    ],
    finding: 'The same flight costs 75% more on a MacBook in Manhattan than on an old laptop in rural Ohio.',
  },
  {
    id: 'rideshare',
    product: 'Ride: Airport > Downtown',
    subtitle: '12.3 miles, Tuesday 6:15 PM',
    category: 'Rideshare',
    devices: [
      {
        id: 'iphone-bh', name: 'iPhone 15 Pro', icon: 'iphone', location: 'Beverly Hills, CA',
        price: 67, color: '#3b82f6',
        profile: {
          incomeEstimate: '$210,000/yr (99th percentile)',
          browsingHistory: 'Frequent rides, never cancels, high tip history',
          deviceValue: '$1,199 (flagship tier)',
          locationWealth: 'Median income: $148,000',
          priceCategory: 'PREMIUM+',
        },
      },
      {
        id: 'android-com', name: 'Pixel 7a', icon: 'android', location: 'Compton, CA',
        price: 31, color: '#22c55e',
        profile: {
          incomeEstimate: '$32,000/yr (28th percentile)',
          browsingHistory: 'Compares prices, sometimes cancels',
          deviceValue: '$349 (mid tier)',
          locationWealth: 'Median income: $29,000',
          priceCategory: 'ECONOMY',
        },
      },
      {
        id: 'macbook-marina', name: 'MacBook Air', icon: 'macbook', location: 'Marina del Rey, CA',
        price: 54, color: '#f59e0b',
        profile: {
          incomeEstimate: '$125,000/yr (92nd percentile)',
          browsingHistory: 'Regular commuter, loyal user',
          deviceValue: '$1,299 (premium tier)',
          locationWealth: 'Median income: $98,000',
          priceCategory: 'PREMIUM',
        },
      },
      {
        id: 'old-inglewood', name: 'Old Galaxy S8', icon: 'android', location: 'Inglewood, CA',
        price: 28, color: '#a3e635',
        profile: {
          incomeEstimate: '$27,000/yr (20th percentile)',
          browsingHistory: 'New user, no ride history',
          deviceValue: '$80 (legacy tier)',
          locationWealth: 'Median income: $24,000',
          priceCategory: 'VALUE',
        },
      },
    ],
    finding: 'The same 12-mile ride costs 139% more from Beverly Hills than from Inglewood. Same distance, same traffic, different zip code.',
  },
  {
    id: 'hotel',
    product: 'Hotel: 4-star, City Center',
    subtitle: '1 night, King Room, April 5',
    category: 'Hospitality',
    devices: [
      {
        id: 'iphone-chi', name: 'iPhone 15', icon: 'iphone', location: 'Chicago, IL (Gold Coast)',
        price: 289, color: '#3b82f6',
        profile: {
          incomeEstimate: '$118,000/yr (90th percentile)',
          browsingHistory: '3 prior searches for this hotel today',
          deviceValue: '$999 (premium tier)',
          locationWealth: 'Median income: $95,000',
          priceCategory: 'PREMIUM',
        },
      },
      {
        id: 'android-gary', name: 'Motorola G', icon: 'android', location: 'Gary, IN',
        price: 198, color: '#22c55e',
        profile: {
          incomeEstimate: '$25,000/yr (18th percentile)',
          browsingHistory: 'First visit, incognito mode',
          deviceValue: '$149 (budget tier)',
          locationWealth: 'Median income: $21,000',
          priceCategory: 'VALUE',
        },
      },
      {
        id: 'macbook-ev', name: 'MacBook Pro', icon: 'macbook', location: 'Evanston, IL',
        price: 312, color: '#ef4444',
        profile: {
          incomeEstimate: '$135,000/yr (94th percentile)',
          browsingHistory: '5 visits in 2 days, checked dates 3x',
          deviceValue: '$2,499 (ultra-premium tier)',
          locationWealth: 'Median income: $87,000',
          priceCategory: 'PREMIUM+',
        },
      },
      {
        id: 'old-ind', name: 'HP Stream', icon: 'oldlaptop', location: 'Indianapolis, IN',
        price: 219, color: '#a3e635',
        profile: {
          incomeEstimate: '$41,000/yr (38th percentile)',
          browsingHistory: 'Cleared cookies, no tracking data',
          deviceValue: '$199 (budget tier)',
          locationWealth: 'Median income: $37,000',
          priceCategory: 'STANDARD',
        },
      },
    ],
    finding: 'Repeat visits drove the price UP by $91. The algorithm detected urgency from browsing behavior and location wealth.',
  },
]

// ─── Main Component ─────────────────────────────────────────────────

interface PriceDiscriminationProps {
  onComplete?: (findings: number) => void
  onEvidenceAdd?: (evidence: { type: string; data: unknown }) => void
}

export function PriceDiscrimination({ onComplete, onEvidenceAdd }: PriceDiscriminationProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [pricesRevealed, setPricesRevealed] = useState(false)
  const [investigatingDevice, setInvestigatingDevice] = useState<string | null>(null)
  const [findingsUnlocked, setFindingsUnlocked] = useState<Set<number>>(new Set())
  const [showFindingReveal, setShowFindingReveal] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const scenario = SCENARIOS[currentScenarioIndex]

  // Reveal prices with dramatic animation
  const handleRevealPrices = useCallback(() => {
    scan()
    setPricesRevealed(true)
  }, [])

  // Investigate a device — show its algorithmic profile
  const handleInvestigate = useCallback((deviceId: string) => {
    whoosh()
    setInvestigatingDevice(prev => prev === deviceId ? null : deviceId)
  }, [])

  // Unlock finding after investigating
  const handleUnlockFinding = useCallback(() => {
    impact()
    setShowFindingReveal(true)
    setFindingsUnlocked(prev => new Set([...prev, currentScenarioIndex]))
  }, [currentScenarioIndex])

  // Move to next scenario
  const handleNext = useCallback(() => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      scan()
      setPricesRevealed(false)
      setInvestigatingDevice(null)
      setShowFindingReveal(false)
      setCurrentScenarioIndex(prev => prev + 1)
    } else {
      impact()
      setIsComplete(true)
      onComplete?.(findingsUnlocked.size + 1)
    }
  }, [currentScenarioIndex, findingsUnlocked.size, onComplete])

  // Add evidence
  const handleAddEvidence = useCallback(() => {
    playSuccess()
    onEvidenceAdd?.({
      type: 'price-discrimination-findings',
      data: {
        scenariosAnalyzed: SCENARIOS.length,
        findingsUnlocked: findingsUnlocked.size,
        scenarios: SCENARIOS.map((s, i) => ({
          product: s.product,
          priceRange: `$${Math.min(...s.devices.map(d => d.price))} - $${Math.max(...s.devices.map(d => d.price))}`,
          gap: `${Math.round(((Math.max(...s.devices.map(d => d.price)) - Math.min(...s.devices.map(d => d.price))) / Math.min(...s.devices.map(d => d.price))) * 100)}%`,
          finding: findingsUnlocked.has(i) ? s.finding : 'Not investigated',
        })),
      },
    })
  }, [findingsUnlocked, onEvidenceAdd])

  // Price gap stats for current scenario
  const minPrice = Math.min(...scenario.devices.map(d => d.price))
  const maxPrice = Math.max(...scenario.devices.map(d => d.price))
  const gap = maxPrice - minPrice
  const gapPercent = Math.round((gap / minPrice) * 100)

  // ── Summary Screen ──────────────────────────────────────────────
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="max-w-lg w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="font-mono text-xs text-red-400/80 uppercase tracking-[0.3em] mb-2"
            >
              Investigation Complete
            </motion.div>
            <h2 className="text-2xl font-mono text-green-400 font-bold mb-4">
              Price Discrimination Exposed
            </h2>
            <p className="text-green-500/60 font-mono text-xs leading-relaxed max-w-md mx-auto">
              Your investigation reveals a systematic pattern: algorithms profile users by device,
              location, and browsing behavior to charge different prices for identical products.
              This is not dynamic pricing based on supply and demand. This is discrimination.
            </p>
          </div>

          {/* Scenario summaries */}
          <div className="space-y-3 mb-8">
            {SCENARIOS.map((s, i) => {
              const sMin = Math.min(...s.devices.map(d => d.price))
              const sMax = Math.max(...s.devices.map(d => d.price))
              const sGap = Math.round(((sMax - sMin) / sMin) * 100)
              return (
                <div key={s.id} className="border border-green-500/20 rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-green-400">{s.product}</span>
                    <span className="font-mono text-xs text-red-400">+{sGap}% gap</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-green-500/40">
                      ${sMin} &mdash; ${sMax}
                    </span>
                    {findingsUnlocked.has(i) && (
                      <span className="text-green-400 text-xs">&#10003; Finding unlocked</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddEvidence}
            className="w-full border border-green-500/40 text-green-400 font-mono text-sm py-3 rounded
              hover:bg-green-500/10 transition-colors tracking-wider uppercase"
          >
            &#9670; Add to Evidence Dossier
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* ── Search Header ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-green-500/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-green-500/50 font-mono text-xs uppercase tracking-wider">
            Search
          </span>
          <span className="text-green-400 font-mono text-sm tabular-nums">
            {currentScenarioIndex + 1}/{SCENARIOS.length}
          </span>
          <div className="h-4 w-px bg-green-500/10" />
          <span className="text-green-500/50 font-mono text-xs uppercase tracking-wider">
            Findings
          </span>
          <span className="text-green-400 font-mono text-sm tabular-nums">
            {findingsUnlocked.size}
          </span>
        </div>
        {pricesRevealed && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-red-400/60 font-mono text-xs uppercase tracking-wider">
              Price Gap
            </span>
            <span className="text-red-400 font-mono text-sm font-bold">
              ${gap} ({gapPercent}%)
            </span>
          </motion.div>
        )}
      </div>

      {/* ── Product Info ──────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-green-500/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-green-500/20 rounded flex items-center justify-center text-green-500/40 font-mono text-xs">
            {scenario.category === 'Travel' ? '&#9992;' : scenario.category === 'Rideshare' ? '&#128663;' : '&#127976;'}
          </div>
          <div>
            <h3 className="font-mono text-sm text-green-400">{scenario.product}</h3>
            <p className="font-mono text-xs text-green-500/40">{scenario.subtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Devices Grid ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {!pricesRevealed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col items-center justify-center"
          >
            <p className="font-mono text-xs text-green-500/50 mb-4 text-center">
              Same product. Four devices. Four locations. What will the algorithm charge?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRevealPrices}
              className="border border-green-500/40 text-green-400 font-mono text-sm px-8 py-3 rounded
                hover:bg-green-500/10 transition-colors tracking-wider uppercase min-h-[44px]"
            >
              &#9654; Run Price Search
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Device cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {scenario.devices.map((device, i) => {
                const isInvestigating = investigatingDevice === device.id
                const priceColor = device.price === maxPrice
                  ? '#ef4444'
                  : device.price === minPrice
                    ? '#4ade80'
                    : '#eab308'

                return (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    className="flex flex-col"
                  >
                    {/* Device frame with price */}
                    <div className="border border-green-500/15 rounded-lg p-3 bg-black/40">
                      <DeviceFrame type={device.icon}>
                        <div className="text-center py-2">
                          <div className="text-[22px] leading-none mb-1">
                            <AnimatedPrice target={device.price} color={priceColor} revealed={pricesRevealed} />
                          </div>
                          <div className="text-xs text-gray-400 font-mono">{scenario.product}</div>
                        </div>
                      </DeviceFrame>

                      <div className="mt-2 text-center">
                        <p className="font-mono text-xs text-green-400 truncate">{device.name}</p>
                        <p className="font-mono text-xs text-green-500/40 truncate">{device.location}</p>
                      </div>

                      {/* Investigate button */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleInvestigate(device.id)}
                        className={`w-full mt-2 border rounded py-2.5 font-mono text-xs uppercase tracking-wider min-h-[44px]
                          transition-colors ${isInvestigating
                            ? 'border-green-400/50 text-green-400 bg-green-500/10'
                            : 'border-green-500/20 text-green-500/50 hover:text-green-400 hover:border-green-500/40'
                          }`}
                      >
                        {isInvestigating ? '&#9660; Profile' : '&#9654; Investigate'}
                      </motion.button>
                    </div>

                    {/* Algorithm Profile Panel */}
                    <AnimatePresence>
                      {isInvestigating && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border border-green-500/15 border-t-0 rounded-b-lg p-2.5 bg-green-950/20 space-y-1.5">
                            <h4 className="font-mono text-xs text-green-500/60 uppercase tracking-widest">
                              Algorithm Profile
                            </h4>
                            {Object.entries(device.profile).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-mono text-xs text-green-500/30 uppercase">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <p className="font-mono text-xs text-green-300/70">{value}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="border border-green-500/15 rounded-lg p-4 bg-black/30"
            >
              <h4 className="font-mono text-xs text-green-500/50 uppercase tracking-wider mb-3">
                Price Comparison
              </h4>
              <PriceBarChart devices={scenario.devices} revealed={pricesRevealed} />
            </motion.div>

            {/* Finding reveal */}
            <AnimatePresence>
              {!showFindingReveal && !findingsUnlocked.has(currentScenarioIndex) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUnlockFinding}
                    className="border border-yellow-500/30 text-yellow-400 font-mono text-xs px-6 py-2.5 rounded
                      hover:bg-yellow-500/5 transition-colors uppercase tracking-wider min-h-[44px]"
                  >
                    &#9670; Unlock Finding
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Finding Panel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showFindingReveal && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex-shrink-0 border-t border-yellow-500/20 bg-black/95 backdrop-blur-sm"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-mono text-xs border border-yellow-500/30 rounded px-1.5 py-0.5 uppercase">
                      Finding Unlocked
                    </span>
                  </div>
                  <p className="text-green-300/80 text-xs leading-relaxed font-mono">
                    {scenario.finding}
                  </p>
                </div>
                <button
                  onClick={() => setShowFindingReveal(false)}
                  className="text-green-500/40 hover:text-green-400 text-lg flex-shrink-0 font-mono"
                >
                  &#10005;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-green-500/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {SCENARIOS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentScenarioIndex
                  ? 'bg-green-400'
                  : findingsUnlocked.has(i)
                    ? 'bg-green-600'
                    : 'bg-green-500/10'
              }`}
            />
          ))}
        </div>

        {pricesRevealed && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="border border-green-500/40 text-green-400 font-mono text-xs px-4 py-2.5 rounded
              hover:bg-green-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
          >
            {currentScenarioIndex < SCENARIOS.length - 1 ? 'Next Search >' : 'See Results >'}
          </motion.button>
        )}
      </div>
    </div>
  )
}
