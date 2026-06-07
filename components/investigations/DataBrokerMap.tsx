'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { success as playSuccess, impact, scan, glitch, whoosh, staticBurst, drone } from '@/lib/audio/procedural'

// ─── Types ──────────────────────────────────────────────────────────

interface DataCategory {
  name: string
  icon: string
  sensitivity: 'low' | 'medium' | 'high' | 'critical'
}

interface CompanyNode {
  id: string
  name: string
  type: 'broker' | 'adnetwork' | 'insurer' | 'employer' | 'political'
  description: string
  dataBought: string[]
  usage: string
  pricePaid: string
  sellsTo: string[]
  revenueFromYou: string
  angle: number // position around the circle (degrees)
}

interface DataPacket {
  id: string
  targetId: string
  progress: number
  color: string
}

// ─── Data ───────────────────────────────────────────────────────────

const PROFILE_DATA: DataCategory[] = [
  { name: 'Full Name & Aliases', icon: '\u{1F464}', sensitivity: 'high' },
  { name: 'Home Address (3 years)', icon: '\u{1F3E0}', sensitivity: 'critical' },
  { name: 'Est. Income: $67,400', icon: '\u{1F4B0}', sensitivity: 'critical' },
  { name: 'Political Lean: Moderate-Left', icon: '\u{1F5F3}', sensitivity: 'critical' },
  { name: 'Health: Anxiety, Insomnia searches', icon: '\u{1FA7A}', sensitivity: 'critical' },
  { name: 'Purchase Intent: Electronics, Travel', icon: '\u{1F6D2}', sensitivity: 'high' },
  { name: 'Location History: 2,847 points', icon: '\u{1F4CD}', sensitivity: 'high' },
  { name: 'Social Graph: 847 connections', icon: '\u{1F465}', sensitivity: 'medium' },
  { name: 'Device: iPhone, MacBook, Alexa', icon: '\u{1F4F1}', sensitivity: 'medium' },
  { name: 'Risk Score: 72/100', icon: '\u{26A0}', sensitivity: 'high' },
]

const COMPANIES: CompanyNode[] = [
  {
    id: 'axiom',
    name: 'Axiom Data Corp',
    type: 'broker',
    description: 'One of the world\'s largest data brokers. Maintains profiles on 2.5 billion consumers globally.',
    dataBought: ['Name', 'Address', 'Income', 'Purchase History', 'Vehicle Registration'],
    usage: 'Aggregates and resells consumer profiles to 12,000+ clients',
    pricePaid: '$0.007 per data point',
    sellsTo: ['meridian', 'targetpulse', 'sentinel'],
    revenueFromYou: '$23.40/year',
    angle: 0,
  },
  {
    id: 'meridian',
    name: 'Meridian Analytics',
    type: 'adnetwork',
    description: 'Real-time bidding platform that auctions your attention 4,700 times per day.',
    dataBought: ['Browsing History', 'Location', 'App Usage', 'Purchase Intent'],
    usage: 'Serves targeted ads across 2 million websites and apps',
    pricePaid: '$0.012 per impression profile',
    sellsTo: ['politicast', 'sentinel'],
    revenueFromYou: '$41.20/year',
    angle: 45,
  },
  {
    id: 'healthmine',
    name: 'HealthMine Insights',
    type: 'insurer',
    description: 'Sells health "risk scores" to insurance companies. No HIPAA protection for inferred data.',
    dataBought: ['Health Searches', 'Pharmacy Visits', 'Fitness App Data', 'Food Delivery Orders'],
    usage: 'Creates health risk profiles that affect insurance premiums',
    pricePaid: '$0.34 per health profile',
    sellsTo: ['sentinel', 'creditscore'],
    revenueFromYou: '$18.90/year',
    angle: 90,
  },
  {
    id: 'politicast',
    name: 'PolitiCast',
    type: 'political',
    description: 'Micro-targets voters with personalized political messaging based on psychological profiles.',
    dataBought: ['Political Lean', 'Social Media Activity', 'News Consumption', 'Donation History'],
    usage: 'Serves hyper-targeted political ads and disinformation',
    pricePaid: '$0.89 per voter profile',
    sellsTo: ['meridian'],
    revenueFromYou: '$12.70/year',
    angle: 135,
  },
  {
    id: 'workscreen',
    name: 'WorkScreen Pro',
    type: 'employer',
    description: 'Background check company that sells "employability scores" to HR departments.',
    dataBought: ['Social Media', 'Criminal Records', 'Financial History', 'Address History'],
    usage: 'Creates employability risk scores used in hiring decisions',
    pricePaid: '$2.40 per background report',
    sellsTo: ['creditscore'],
    revenueFromYou: '$8.50/year',
    angle: 180,
  },
  {
    id: 'locationiq',
    name: 'LocationIQ',
    type: 'broker',
    description: 'Tracks 200M+ mobile devices. Sells foot traffic data and movement patterns.',
    dataBought: ['GPS Location', 'WiFi Connections', 'Bluetooth Beacons', 'Store Visits'],
    usage: 'Sells movement patterns to retailers, hedge funds, and law enforcement',
    pricePaid: '$0.02 per location ping',
    sellsTo: ['meridian', 'sentinel', 'axiom'],
    revenueFromYou: '$34.60/year',
    angle: 225,
  },
  {
    id: 'creditscore',
    name: 'CreditScope Analytics',
    type: 'insurer',
    description: 'Alternative credit scoring using non-traditional data. Your Netflix account affects your loan rate.',
    dataBought: ['Subscription Data', 'Rent Payments', 'Utility Bills', 'Shopping Patterns'],
    usage: 'Creates "alternative credit scores" that affect loan approvals and rates',
    pricePaid: '$0.15 per data attribute',
    sellsTo: ['healthmine', 'workscreen'],
    revenueFromYou: '$15.30/year',
    angle: 270,
  },
  {
    id: 'sentinel',
    name: 'Sentinel Surveillance',
    type: 'broker',
    description: 'Government contractor. Sells aggregated consumer data to law enforcement and intelligence agencies.',
    dataBought: ['Location History', 'Communication Metadata', 'Financial Transactions', 'Social Graph'],
    usage: 'Enables warrantless surveillance by selling data the government can\'t legally collect',
    pricePaid: '$4.50 per comprehensive profile',
    sellsTo: ['axiom', 'locationiq'],
    revenueFromYou: '$31.40/year',
    angle: 315,
  },
  {
    id: 'targetpulse',
    name: 'TargetPulse',
    type: 'adnetwork',
    description: 'Predictive analytics firm that infers future purchase intent from micro-behaviors.',
    dataBought: ['Mouse Movement', 'Scroll Speed', 'Hover Time', 'Cart Abandonment'],
    usage: 'Predicts what you\'ll buy next and sells that prediction to retailers',
    pricePaid: '$0.03 per behavioral signal',
    sellsTo: ['meridian', 'axiom'],
    revenueFromYou: '$27.80/year',
    angle: 157.5,
  },
  {
    id: 'faceprint',
    name: 'FacePrint ID',
    type: 'broker',
    description: 'Scrapes social media photos to build facial recognition databases. 4 billion faces indexed.',
    dataBought: ['Photos', 'Tagged Images', 'Profile Pictures', 'Video Stills'],
    usage: 'Facial recognition sold to retailers, police, and private investigators',
    pricePaid: '$0.001 per face match',
    sellsTo: ['sentinel', 'workscreen'],
    revenueFromYou: '$5.40/year',
    angle: 67.5,
  },
  {
    id: 'shadowgraph',
    name: 'ShadowGraph',
    type: 'political',
    description: 'Maps social relationships and influence networks. Identifies "persuadable" individuals.',
    dataBought: ['Contact Lists', 'Email Metadata', 'Social Connections', 'Group Memberships'],
    usage: 'Identifies social influence patterns and sells persuasion targeting',
    pricePaid: '$0.45 per social graph node',
    sellsTo: ['politicast', 'meridian'],
    revenueFromYou: '$19.60/year',
    angle: 247.5,
  },
  {
    id: 'datamarket',
    name: 'DataMarket Exchange',
    type: 'broker',
    description: 'The "stock exchange" of personal data. Real-time marketplace where your profile is auctioned.',
    dataBought: ['Everything Available', 'Cross-referenced Profiles', 'Behavioral Models'],
    usage: 'Operates an open marketplace where any buyer can purchase consumer data',
    pricePaid: 'Variable — auction pricing',
    sellsTo: ['axiom', 'meridian', 'healthmine', 'politicast', 'sentinel'],
    revenueFromYou: '$28.93/year',
    angle: 112.5,
  },
]

const TYPE_CONFIG: Record<CompanyNode['type'], { color: string; label: string; borderColor: string }> = {
  broker: { color: '#ef4444', label: 'DATA BROKER', borderColor: 'border-red-500/40' },
  adnetwork: { color: '#eab308', label: 'AD NETWORK', borderColor: 'border-yellow-500/40' },
  insurer: { color: '#3b82f6', label: 'INSURER/CREDIT', borderColor: 'border-blue-500/40' },
  employer: { color: '#a855f7', label: 'EMPLOYER', borderColor: 'border-purple-500/40' },
  political: { color: '#f97316', label: 'POLITICAL', borderColor: 'border-orange-500/40' },
}

const SENSITIVITY_COLORS: Record<DataCategory['sensitivity'], string> = {
  low: 'text-green-400/60',
  medium: 'text-yellow-400/60',
  high: 'text-orange-400/60',
  critical: 'text-red-400/60',
}

// ─── Animated Counter ───────────────────────────────────────────────

function DramaticCounter({ target, prefix, suffix, visible, delay = 0 }: {
  target: number
  prefix?: string
  suffix?: string
  visible: boolean
  delay?: number
}) {
  const [display, setDisplay] = useState(0)
  const triggered = useRef(false)

  useEffect(() => {
    if (!visible || triggered.current) return
    triggered.current = true

    const timeout = setTimeout(() => {
      const duration = 2000
      const start = performance.now()
      let raf: number

      const animate = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * target))
        if (progress < 1) raf = requestAnimationFrame(animate)
      }

      raf = requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeout)
  }, [target, visible, delay])

  return (
    <span className="font-mono font-bold text-green-400 tabular-nums">
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}

// ─── Network Node Component ────────────────────────────────────────

function NetworkNode({
  company,
  investigated,
  isActive,
  onClick,
  centerX,
  centerY,
  radius,
}: {
  company: CompanyNode
  investigated: boolean
  isActive: boolean
  onClick: () => void
  centerX: number
  centerY: number
  radius: number
}) {
  const typeConf = TYPE_CONFIG[company.type]
  const rad = (company.angle * Math.PI) / 180
  const x = centerX + Math.cos(rad) * radius
  const y = centerY + Math.sin(rad) * radius
  const nodeSize = investigated ? 28 : 22

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + (company.angle / 360) * 0.8, type: 'spring' }}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {/* Pulse ring for active */}
      {isActive && (
        <motion.circle
          cx={x}
          cy={y}
          r={nodeSize + 6}
          fill="none"
          stroke={typeConf.color}
          strokeWidth={1}
          opacity={0.4}
          animate={{ r: [nodeSize + 6, nodeSize + 14], opacity: [0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Node circle */}
      <motion.circle
        cx={x}
        cy={y}
        r={nodeSize}
        fill={investigated ? `${typeConf.color}22` : '#111'}
        stroke={typeConf.color}
        strokeWidth={investigated ? 2 : 1}
        opacity={investigated ? 1 : 0.6}
        whileHover={{ scale: 1.15 }}
      />

      {/* Label */}
      <text
        x={x}
        y={y - nodeSize - 6}
        textAnchor="middle"
        className="font-mono"
        fontSize={8}
        fill={typeConf.color}
        opacity={investigated ? 1 : 0.5}
      >
        {company.name.split(' ').slice(0, 2).join(' ')}
      </text>

      {/* Type label */}
      <text
        x={x}
        y={y + 3}
        textAnchor="middle"
        className="font-mono"
        fontSize={6}
        fill={typeConf.color}
        opacity={0.7}
      >
        {company.name.charAt(0)}
      </text>

      {/* Investigated check */}
      {investigated && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fill="#22c55e">
          {'\u2713'}
        </text>
      )}
    </motion.g>
  )
}

// ─── Data Packet Animation ──────────────────────────────────────────

function DataPackets({
  investigatedIds,
  centerX,
  centerY,
  radius,
}: {
  investigatedIds: Set<string>
  centerX: number
  centerY: number
  radius: number
}) {
  const [packets, setPackets] = useState<DataPacket[]>([])

  useEffect(() => {
    if (investigatedIds.size === 0) return

    const interval = setInterval(() => {
      const targetCompanies = COMPANIES.filter(c => investigatedIds.has(c.id))
      if (targetCompanies.length === 0) return

      const target = targetCompanies[Math.floor(Math.random() * targetCompanies.length)]
      const typeConf = TYPE_CONFIG[target.type]

      setPackets(prev => [
        ...prev.slice(-15), // keep max 15 packets
        {
          id: `${Date.now()}-${Math.random()}`,
          targetId: target.id,
          progress: 0,
          color: typeConf.color,
        },
      ])
    }, 400)

    return () => clearInterval(interval)
  }, [investigatedIds])

  // Animate packets
  useEffect(() => {
    if (packets.length === 0) return

    const raf = requestAnimationFrame(function animate() {
      setPackets(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + 0.02 }))
          .filter(p => p.progress <= 1)
      )
      if (packets.some(p => p.progress < 1)) {
        requestAnimationFrame(animate)
      }
    })

    return () => cancelAnimationFrame(raf)
  }, [packets.length > 0]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {packets.map(packet => {
        const company = COMPANIES.find(c => c.id === packet.targetId)
        if (!company) return null

        const rad = (company.angle * Math.PI) / 180
        const targetX = centerX + Math.cos(rad) * radius
        const targetY = centerY + Math.sin(rad) * radius

        const x = centerX + (targetX - centerX) * packet.progress
        const y = centerY + (targetY - centerY) * packet.progress

        return (
          <motion.circle
            key={packet.id}
            cx={x}
            cy={y}
            r={2}
            fill={packet.color}
            opacity={1 - packet.progress * 0.5}
          />
        )
      })}
    </>
  )
}

// ─── Connection Lines Between Companies ─────────────────────────────

function CompanyConnections({
  investigatedIds,
  centerX,
  centerY,
  radius,
}: {
  investigatedIds: Set<string>
  centerX: number
  centerY: number
  radius: number
}) {
  const connections = useMemo(() => {
    const lines: { from: CompanyNode; to: CompanyNode }[] = []
    const investigated = COMPANIES.filter(c => investigatedIds.has(c.id))

    for (const company of investigated) {
      for (const sellToId of company.sellsTo) {
        const target = COMPANIES.find(c => c.id === sellToId)
        if (target && investigatedIds.has(target.id)) {
          // Avoid duplicates
          const exists = lines.some(
            l => (l.from.id === company.id && l.to.id === target.id) ||
                 (l.from.id === target.id && l.to.id === company.id)
          )
          if (!exists) lines.push({ from: company, to: target })
        }
      }
    }
    return lines
  }, [investigatedIds, centerX, centerY, radius])

  return (
    <>
      {connections.map(({ from, to }) => {
        const radFrom = (from.angle * Math.PI) / 180
        const radTo = (to.angle * Math.PI) / 180
        const x1 = centerX + Math.cos(radFrom) * radius
        const y1 = centerY + Math.sin(radFrom) * radius
        const x2 = centerX + Math.cos(radTo) * radius
        const y2 = centerY + Math.sin(radTo) * radius

        return (
          <motion.line
            key={`${from.id}-${to.id}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#22c55e"
            strokeWidth={0.5}
            strokeDasharray="3 3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 0.6 }}
          />
        )
      })}
    </>
  )
}

// ─── Main Component ─────────────────────────────────────────────────

interface DataBrokerMapProps {
  onComplete?: (score: number) => void
  onEvidenceAdd?: (evidence: { type: string; data: unknown }) => void
}

export function DataBrokerMap({ onComplete, onEvidenceAdd }: DataBrokerMapProps) {
  const [phase, setPhase] = useState<'profile' | 'market' | 'pricetag'>('profile')
  const [investigatedNodes, setInvestigatedNodes] = useState<Set<string>>(new Set())
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [profileRevealed, setProfileRevealed] = useState(false)
  const [showPriceTag, setShowPriceTag] = useState(false)
  const stopDroneRef = useRef<(() => void) | null>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // SVG dimensions based on container
  const [svgSize, setSvgSize] = useState({ width: 600, height: 400 })

  useEffect(() => {
    const updateSize = () => {
      if (svgContainerRef.current) {
        const rect = svgContainerRef.current.getBoundingClientRect()
        setSvgSize({
          width: Math.max(rect.width, 300),
          height: Math.max(rect.height, 300),
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [phase])

  const centerX = svgSize.width / 2
  const centerY = svgSize.height / 2
  const networkRadius = Math.min(svgSize.width, svgSize.height) * 0.35

  // Clean up drone on unmount
  useEffect(() => {
    return () => { stopDroneRef.current?.() }
  }, [])

  // Reveal profile
  const handleRevealProfile = useCallback(() => {
    scan()
    setProfileRevealed(true)
    setTimeout(() => {
      impact()
    }, 800)
  }, [])

  // Transition to market phase
  const handleEnterMarket = useCallback(() => {
    whoosh()
    setPhase('market')
  }, [])

  // Investigate a company
  const handleInvestigate = useCallback((companyId: string) => {
    scan()
    if (activeNode === companyId) {
      setActiveNode(null)
      return
    }

    setActiveNode(companyId)
    setInvestigatedNodes(prev => {
      const next = new Set(prev)
      next.add(companyId)

      // Check if enough investigated for price tag reveal
      if (next.size >= 6 && !showPriceTag) {
        setTimeout(() => {
          setShowPriceTag(true)
          impact()
        }, 500)
      }

      return next
    })
  }, [activeNode, showPriceTag])

  // Transition to price tag phase
  const handleShowPriceTag = useCallback(() => {
    stopDroneRef.current?.()
    stopDroneRef.current = null
    impact()
    staticBurst(300)
    setPhase('pricetag')
  }, [])

  // Add evidence
  const handleAddEvidence = useCallback(() => {
    playSuccess()
    const totalRevenue = COMPANIES.reduce((sum, c) => {
      return sum + parseFloat(c.revenueFromYou.replace(/[^0-9.]/g, ''))
    }, 0)
    onEvidenceAdd?.({
      type: 'data-broker-map',
      data: {
        companiesInvestigated: investigatedNodes.size,
        totalCompanies: COMPANIES.length,
        estimatedProfileValue: `$${totalRevenue.toFixed(2)}`,
        estimatedTimesSold: 847,
        companiesWithAccess: 142,
        dataCategories: PROFILE_DATA.map(d => ({ name: d.name, sensitivity: d.sensitivity })),
        brokerDetails: Array.from(investigatedNodes).map(id => {
          const c = COMPANIES.find(co => co.id === id)
          return c ? { name: c.name, type: c.type, dataBought: c.dataBought, revenueFromYou: c.revenueFromYou } : null
        }).filter(Boolean),
      },
    })
    onComplete?.(investigatedNodes.size)
  }, [investigatedNodes, onComplete, onEvidenceAdd])

  const activeCompany = activeNode ? COMPANIES.find(c => c.id === activeNode) : null
  const activeTypeConf = activeCompany ? TYPE_CONFIG[activeCompany.type] : null

  // ── Phase 3: THE PRICE TAG ────────────────────────────────────────
  if (phase === 'pricetag') {
    const totalRevenue = COMPANIES.reduce((sum, c) => {
      return sum + parseFloat(c.revenueFromYou.replace(/[^0-9.]/g, ''))
    }, 0)

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
          {/* Dramatic reveal */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-xs text-red-400/80 uppercase tracking-[0.3em] mb-4"
            >
              {'\u26A0'} Data Exposure Report
            </motion.div>

            {/* Big numbers */}
            <div className="space-y-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="font-mono text-xs text-green-500/50 uppercase tracking-wider mb-1">
                  Your Data Has Been Sold
                </div>
                <div className="font-mono text-5xl font-bold text-red-400">
                  <DramaticCounter target={847} suffix=" TIMES" visible={true} delay={800} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="font-mono text-xs text-green-500/50 uppercase tracking-wider mb-1">
                  Estimated Value of Your Profile
                </div>
                <div className="font-mono text-5xl font-bold text-yellow-400">
                  <DramaticCounter target={Math.round(totalRevenue * 100)} prefix="$" visible={true} delay={1500} />
                  <span className="text-lg text-yellow-400/60">/year</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <div className="font-mono text-xs text-green-500/50 uppercase tracking-wider mb-1">
                  Companies With Access To Your Data
                </div>
                <div className="font-mono text-5xl font-bold text-orange-400">
                  <DramaticCounter target={142} visible={true} delay={2100} />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="border border-red-500/20 rounded-lg p-4 bg-red-950/10 mb-6"
            >
              <p className="font-mono text-sm text-red-400/90 leading-relaxed">
                &ldquo;You are not the customer. You are the product.&rdquo;
              </p>
              <p className="font-mono text-xs text-red-400/40 mt-2">
                Every app you install, every search you make, every place you visit feeds this machine.
                Your data generates revenue for companies you&apos;ve never heard of, used by people you&apos;ll never meet,
                for purposes you never consented to.
              </p>
            </motion.div>

            {/* Company breakdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
              className="space-y-1.5 mb-6 text-left max-h-40 overflow-y-auto"
            >
              {Array.from(investigatedNodes).map(id => {
                const c = COMPANIES.find(co => co.id === id)
                if (!c) return null
                const conf = TYPE_CONFIG[c.type]
                return (
                  <div key={id} className="flex items-center justify-between px-2 py-1 rounded bg-black/40 border border-green-500/5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: conf.color }} />
                      <span className="font-mono text-xs text-green-400/70">{c.name}</span>
                    </div>
                    <span className="font-mono text-xs text-green-500/50">{c.revenueFromYou}</span>
                  </div>
                )
              })}
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddEvidence}
            className="w-full border border-green-500/40 text-green-400 font-mono text-sm py-3 rounded
              hover:bg-green-500/10 transition-colors tracking-wider uppercase"
          >
            {'\u25C6'} Add to Evidence Dossier
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  // ── Phase 2: THE MARKET ───────────────────────────────────────────
  if (phase === 'market') {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-green-500/10 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-green-500/50 font-mono text-xs uppercase tracking-wider">
              Data Market
            </span>
            <span className="text-green-400 font-mono text-sm tabular-nums">
              {investigatedNodes.size}/{COMPANIES.length} investigated
            </span>
          </div>
          <span className="font-mono text-xs text-green-500/40">Phase 2/3</span>
        </div>

        {/* Instruction */}
        <div className="flex-shrink-0 border-b border-green-500/5 px-4 py-1.5 bg-green-950/20">
          <p className="font-mono text-xs text-green-500/50 text-center">
            {'\u25B6'} Click company nodes to investigate. Your data flows outward to each buyer.
            Investigate {Math.max(0, 6 - investigatedNodes.size)} more to see your total exposure.
          </p>
        </div>

        {/* Network + Detail panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Mobile: Scrollable list view */}
          <div className="md:hidden flex-1 overflow-y-auto px-4 py-3">
            <div className="space-y-2">
              {COMPANIES.map(company => {
                const conf = TYPE_CONFIG[company.type]
                const isInvestigated = investigatedNodes.has(company.id)
                const isActive = activeNode === company.id
                return (
                  <motion.button
                    key={company.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInvestigate(company.id)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all min-h-[44px] ${
                      isActive
                        ? 'border-green-400/40 bg-green-950/30'
                        : isInvestigated
                          ? 'border-green-500/20 bg-green-950/10'
                          : 'border-green-500/10 bg-black/30'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: conf.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-green-400 truncate">{company.name}</span>
                        {isInvestigated && <span className="text-green-400 text-xs">{'\u2713'}</span>}
                      </div>
                      <span className="font-mono text-xs uppercase tracking-wider" style={{ color: conf.color }}>
                        {conf.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-green-500/50 flex-shrink-0">{company.revenueFromYou}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Desktop: SVG Network */}
          <div className="hidden md:block flex-1 relative min-h-[300px]" ref={svgContainerRef}>
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
              className="absolute inset-0"
            >
              {/* Center profile circle */}
              <motion.circle
                cx={centerX}
                cy={centerY}
                r={30}
                fill="#111"
                stroke="#22c55e"
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              />
              <motion.circle
                cx={centerX}
                cy={centerY}
                r={36}
                fill="none"
                stroke="#22c55e"
                strokeWidth={0.5}
                opacity={0.3}
                animate={{ r: [36, 44], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text
                x={centerX}
                y={centerY - 4}
                textAnchor="middle"
                className="font-mono"
                fontSize={8}
                fill="#22c55e"
              >
                YOUR
              </text>
              <text
                x={centerX}
                y={centerY + 6}
                textAnchor="middle"
                className="font-mono"
                fontSize={8}
                fill="#22c55e"
              >
                DATA
              </text>

              {/* Lines from center to each company */}
              {COMPANIES.map(company => {
                const rad = (company.angle * Math.PI) / 180
                const x = centerX + Math.cos(rad) * networkRadius
                const y = centerY + Math.sin(rad) * networkRadius
                const isInvestigated = investigatedNodes.has(company.id)

                return (
                  <motion.line
                    key={`line-${company.id}`}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke={TYPE_CONFIG[company.type].color}
                    strokeWidth={isInvestigated ? 1 : 0.5}
                    strokeDasharray={isInvestigated ? 'none' : '2 4'}
                    opacity={isInvestigated ? 0.5 : 0.15}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isInvestigated ? 0.5 : 0.15 }}
                    transition={{ delay: 0.2 + (company.angle / 360) * 0.5 }}
                  />
                )
              })}

              {/* Company-to-company connections */}
              <CompanyConnections
                investigatedIds={investigatedNodes}
                centerX={centerX}
                centerY={centerY}
                radius={networkRadius}
              />

              {/* Data packets */}
              <DataPackets
                investigatedIds={investigatedNodes}
                centerX={centerX}
                centerY={centerY}
                radius={networkRadius}
              />

              {/* Company nodes */}
              {COMPANIES.map(company => (
                <NetworkNode
                  key={company.id}
                  company={company}
                  investigated={investigatedNodes.has(company.id)}
                  isActive={activeNode === company.id}
                  onClick={() => handleInvestigate(company.id)}
                  centerX={centerX}
                  centerY={centerY}
                  radius={networkRadius}
                />
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
              {Object.entries(TYPE_CONFIG).map(([type, conf]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: conf.color }} />
                  <span className="font-mono text-xs uppercase tracking-wider" style={{ color: conf.color }}>
                    {conf.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <AnimatePresence>
            {activeCompany && activeTypeConf && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="flex-shrink-0 border-l border-green-500/10 overflow-hidden bg-black/60 hidden md:block"
              >
                <div className="w-[320px] h-full overflow-y-auto p-4">
                  {/* Company header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activeTypeConf.color }}
                    />
                    <span
                      className="font-mono text-xs uppercase tracking-wider"
                      style={{ color: activeTypeConf.color }}
                    >
                      {activeTypeConf.label}
                    </span>
                  </div>

                  <h3 className="font-mono text-sm text-green-400 font-bold mb-1">
                    {activeCompany.name}
                  </h3>
                  <p className="font-mono text-xs text-green-500/50 leading-relaxed mb-4">
                    {activeCompany.description}
                  </p>

                  {/* What they buy */}
                  <div className="mb-3">
                    <h4 className="font-mono text-xs text-green-500/60 uppercase tracking-wider mb-1.5">
                      Data They Buy From You
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {activeCompany.dataBought.map(d => (
                        <span
                          key={d}
                          className="font-mono text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400/70 border border-red-500/20"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="mb-3">
                    <h4 className="font-mono text-xs text-green-500/60 uppercase tracking-wider mb-1">
                      What They Do With It
                    </h4>
                    <p className="font-mono text-xs text-green-400/60 leading-relaxed">
                      {activeCompany.usage}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <h4 className="font-mono text-xs text-green-500/60 uppercase tracking-wider mb-1">
                      Price Paid Per Data Point
                    </h4>
                    <p className="font-mono text-xs text-yellow-400/70">
                      {activeCompany.pricePaid}
                    </p>
                  </div>

                  {/* Revenue from you */}
                  <div className="mb-3">
                    <h4 className="font-mono text-xs text-green-500/60 uppercase tracking-wider mb-1">
                      Annual Revenue From YOUR Data
                    </h4>
                    <p className="font-mono text-lg text-red-400 font-bold">
                      {activeCompany.revenueFromYou}
                    </p>
                  </div>

                  {/* Sells to */}
                  <div className="mb-3">
                    <h4 className="font-mono text-xs text-green-500/60 uppercase tracking-wider mb-1.5">
                      Sells Your Data To
                    </h4>
                    <div className="space-y-1">
                      {activeCompany.sellsTo.map(id => {
                        const target = COMPANIES.find(c => c.id === id)
                        if (!target) return null
                        const tConf = TYPE_CONFIG[target.type]
                        return (
                          <div key={id} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tConf.color }} />
                            <span className="font-mono text-xs text-green-400/50">
                              {target.name}
                            </span>
                            {investigatedNodes.has(id) && (
                              <span className="text-green-400 text-xs">{'\u2713'}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Close */}
                  <button
                    onClick={() => setActiveNode(null)}
                    className="w-full mt-2 border border-green-500/20 text-green-500/40 font-mono text-xs py-2.5 rounded
                      hover:text-green-400 hover:border-green-500/40 transition-colors uppercase tracking-wider min-h-[44px]"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile detail sheet */}
        <AnimatePresence>
          {activeCompany && activeTypeConf && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed inset-x-0 bottom-0 z-50 max-h-[60vh] bg-black border-t border-green-500/20
                rounded-t-xl overflow-y-auto"
            >
              <div className="p-4">
                {/* Handle bar */}
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-1 rounded-full bg-green-500/20" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeTypeConf.color }} />
                    <span className="font-mono text-xs uppercase tracking-wider" style={{ color: activeTypeConf.color }}>
                      {activeTypeConf.label}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveNode(null)}
                    className="text-green-500/40 hover:text-green-400 font-mono text-sm"
                  >
                    {'\u2715'}
                  </button>
                </div>

                <h3 className="font-mono text-sm text-green-400 font-bold mb-1">{activeCompany.name}</h3>
                <p className="font-mono text-xs text-green-500/50 leading-relaxed mb-3">{activeCompany.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="border border-red-500/20 rounded p-2 bg-red-950/10">
                    <div className="font-mono text-xs text-red-400/60 uppercase mb-0.5">Revenue from you</div>
                    <div className="font-mono text-sm text-red-400 font-bold">{activeCompany.revenueFromYou}</div>
                  </div>
                  <div className="border border-yellow-500/20 rounded p-2 bg-yellow-950/10">
                    <div className="font-mono text-xs text-yellow-400/60 uppercase mb-0.5">Price per point</div>
                    <div className="font-mono text-sm text-yellow-400 font-bold">{activeCompany.pricePaid}</div>
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="font-mono text-xs text-green-500/60 uppercase tracking-wider mb-1">Data Bought</h4>
                  <div className="flex flex-wrap gap-1">
                    {activeCompany.dataBought.map(d => (
                      <span key={d} className="font-mono text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400/70 border border-red-500/20">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="font-mono text-xs text-green-400/50 leading-relaxed">{activeCompany.usage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal bar */}
        <AnimatePresence>
          {showPriceTag && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="flex-shrink-0 border-t border-red-500/20 bg-black/95 backdrop-blur-sm px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-red-400 uppercase tracking-wider mb-0.5 animate-pulse">
                    {'\u26A0'} Full Exposure Detected
                  </div>
                  <p className="font-mono text-xs text-green-400/70">
                    {investigatedNodes.size} companies investigated. Ready to see what your data is worth?
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowPriceTag}
                  className="flex-shrink-0 border border-red-500/40 text-red-400 font-mono text-xs px-4 py-2.5 rounded
                    hover:bg-red-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
                >
                  Your Price Tag {'\u2192'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom nav */}
        <div className="flex-shrink-0 border-t border-green-500/10 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {COMPANIES.map(c => (
              <div
                key={c.id}
                className={`w-2 h-2 rounded-full transition-colors`}
                style={{
                  backgroundColor: investigatedNodes.has(c.id) ? TYPE_CONFIG[c.type].color : 'rgba(34, 197, 94, 0.1)',
                }}
                title={c.name}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-green-500/30">
            {investigatedNodes.size < 6
              ? `Investigate ${6 - investigatedNodes.size} more nodes`
              : 'Price tag unlocked!'}
          </span>
        </div>
      </div>
    )
  }

  // ── Phase 1: YOUR DATA PROFILE ────────────────────────────────────
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="font-mono text-xs text-red-400/60 uppercase tracking-[0.3em] mb-2">
            {'\u26A0'} Classified Intelligence
          </div>
          <h2 className="font-mono text-lg text-green-400 font-bold mb-2">
            Your Data Profile
          </h2>
          <p className="font-mono text-xs text-green-500/50">
            This is what the data broker industry knows about you.
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-green-500/30 rounded-lg bg-black/60 overflow-hidden mb-6"
        >
          {/* Card header */}
          <div className="border-b border-green-500/10 px-4 py-2 flex items-center justify-between">
            <span className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
              Consumer Profile #4,847,291
            </span>
            <span className="font-mono text-xs text-red-400/60 uppercase tracking-wider">
              {profileRevealed ? 'EXPOSED' : 'CLASSIFIED'}
            </span>
          </div>

          {/* Data rows */}
          <div className="p-3 space-y-1">
            {PROFILE_DATA.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={profileRevealed ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 0 }}
                transition={{ delay: profileRevealed ? 0.1 + i * 0.08 : 0 }}
                className="flex items-center gap-2 py-1 px-2 rounded bg-green-950/20"
              >
                <span className="text-sm flex-shrink-0">{item.icon}</span>
                <span className={`font-mono text-xs flex-1 ${
                  profileRevealed ? SENSITIVITY_COLORS[item.sensitivity] : 'text-green-500/20'
                }`}>
                  {profileRevealed ? item.name : '\u2588'.repeat(20 + Math.floor(Math.random() * 10))}
                </span>
                {profileRevealed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className={`font-mono text-xs uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      item.sensitivity === 'critical'
                        ? 'bg-red-500/10 text-red-400'
                        : item.sensitivity === 'high'
                          ? 'bg-orange-500/10 text-orange-400'
                          : item.sensitivity === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-green-500/10 text-green-400'
                    }`}
                  >
                    {item.sensitivity}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        {!profileRevealed ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRevealProfile}
            className="w-full border border-green-500/40 text-green-400 font-mono text-sm py-3 rounded
              hover:bg-green-500/10 transition-colors tracking-wider uppercase min-h-[44px]"
          >
            {'\u25B6'} Declassify Profile
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="font-mono text-xs text-red-400/60 text-center">
              This data is compiled from your browsing, purchases, location, and public records.
              No hacking required. It&apos;s all legally bought and sold.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnterMarket}
              className="w-full border border-red-500/40 text-red-400 font-mono text-sm py-3 rounded
                hover:bg-red-500/10 transition-colors tracking-wider uppercase min-h-[44px]"
            >
              Enter The Data Market {'\u2192'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
