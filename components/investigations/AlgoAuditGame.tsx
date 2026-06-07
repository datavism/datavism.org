'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { impact, scan, success as playSuccess, glitch, typing, whoosh, staticBurst } from '@/lib/audio/procedural'
import type { Mission } from '@/lib/data/missions'

// ─── Types ──────────────────────────────────────────────────────────

interface SearchResult {
  id: string
  title: string
  source: string
  sourceType: 'corporate' | 'independent' | 'academic' | 'activist'
  snippet: string
  engagementCount: string
  framing: 'outrage' | 'sensational' | 'neutral' | 'educational'
  isBiased: boolean // true if the ranking/placement reveals algorithmic bias
  biasReason: string
}

interface QueryData {
  id: string
  label: string
  results: SearchResult[]
}

interface AlgoAuditGameProps {
  mission: Mission
  onComplete: (score: number) => void
}

type GamePhase = 'testing' | 'auditing' | 'report'

// ─── Query Data ─────────────────────────────────────────────────────

const QUERIES: QueryData[] = [
  {
    id: 'climate',
    label: 'climate change',
    results: [
      {
        id: 'cl1', title: 'EXPOSED: The Climate LIE They Don\'t Want You to Know About',
        source: 'ViralTruth Media', sourceType: 'corporate', snippet: 'New evidence suggests the entire narrative is being manipulated by powerful interests who profit from your fear...',
        engagementCount: '2.4M views', framing: 'outrage', isBiased: true,
        biasReason: 'Outrage-framed content ranked #1 despite no scientific basis',
      },
      {
        id: 'cl2', title: 'Scientists FURIOUS as government ignores THIS devastating report',
        source: 'ClickPulse News', sourceType: 'corporate', snippet: 'A leaked internal memo reveals officials deliberately buried findings that would shock the public...',
        engagementCount: '1.8M views', framing: 'sensational', isBiased: true,
        biasReason: 'Sensationalized framing of legitimate data ranked above actual research',
      },
      {
        id: 'cl3', title: 'Climate change impacts local farming communities across midwest',
        source: 'Regional Tribune', sourceType: 'independent', snippet: 'Shifting weather patterns have reduced crop yields by 12% over the past decade according to USDA data...',
        engagementCount: '34K views', framing: 'neutral', isBiased: false,
        biasReason: '',
      },
      {
        id: 'cl4', title: 'Every parent needs to see what\'s coming in 2027 — it\'s TERRIFYING',
        source: 'FearFactor Daily', sourceType: 'corporate', snippet: 'The projections paint a picture so disturbing that experts are calling it "the point of no return"...',
        engagementCount: '890K views', framing: 'outrage', isBiased: true,
        biasReason: 'Fear-based engagement farming with no sources cited',
      },
      {
        id: 'cl5', title: 'IPCC AR6 Synthesis Report: Key findings and policy implications',
        source: 'Nature Climate Change', sourceType: 'academic', snippet: 'A comprehensive review of observed changes and projected impacts with confidence intervals across scenarios...',
        engagementCount: '12K views', framing: 'educational', isBiased: true,
        biasReason: 'Peer-reviewed research ranked #5 below unsourced outrage content',
      },
      {
        id: 'cl6', title: 'Understanding carbon cycles: A visual explainer for citizens',
        source: 'Climate Lab Initiative', sourceType: 'activist', snippet: 'Interactive guide explaining how carbon moves through Earth\'s systems and what human activity changes...',
        engagementCount: '8K views', framing: 'educational', isBiased: true,
        biasReason: 'Educational content consistently buried at bottom of results',
      },
    ],
  },
  {
    id: 'immigration',
    label: 'immigration',
    results: [
      {
        id: 'im1', title: 'SHOCKING: What\'s REALLY happening at the border right now',
        source: 'PatriotPulse', sourceType: 'corporate', snippet: 'Exclusive footage reveals a situation far worse than any official will admit. This changes everything...',
        engagementCount: '3.1M views', framing: 'outrage', isBiased: true,
        biasReason: 'Emotionally manipulative framing with no verifiable claims ranked #1',
      },
      {
        id: 'im2', title: '"They\'re coming for YOUR community" — viral rant breaks internet',
        source: 'ViralRage', sourceType: 'corporate', snippet: 'This 8-minute video has been shared 4 million times and it\'s easy to see why people are furious...',
        engagementCount: '2.2M views', framing: 'outrage', isBiased: true,
        biasReason: 'Algorithmic amplification of dehumanizing rhetoric',
      },
      {
        id: 'im3', title: 'Immigration policy changes: What the new legislation means',
        source: 'PolicyWatch', sourceType: 'independent', snippet: 'A non-partisan analysis of the proposed changes, their projected economic impact, and implementation timeline...',
        engagementCount: '45K views', framing: 'neutral', isBiased: false,
        biasReason: '',
      },
      {
        id: 'im4', title: 'The REAL cost of immigration that NO ONE is talking about',
        source: 'TruthBomb Network', sourceType: 'corporate', snippet: 'We crunched the numbers and what we found will make your blood boil. Share this before it gets removed...',
        engagementCount: '1.4M views', framing: 'sensational', isBiased: true,
        biasReason: 'Cherry-picked statistics presented with manufactured urgency',
      },
      {
        id: 'im5', title: 'Migration economics: Labor market effects in receiving countries',
        source: 'Journal of Economic Perspectives', sourceType: 'academic', snippet: 'Meta-analysis of 42 studies finds net positive GDP impact of 0.2-0.4% in receiving economies...',
        engagementCount: '9K views', framing: 'educational', isBiased: true,
        biasReason: 'Academic meta-analysis ranked below opinion content',
      },
      {
        id: 'im6', title: 'Stories from the border: A documentary series by local journalists',
        source: 'Borderland Stories', sourceType: 'independent', snippet: 'Five-part series featuring firsthand accounts from families, border agents, and community members...',
        engagementCount: '18K views', framing: 'neutral', isBiased: true,
        biasReason: 'Nuanced independent journalism buried below corporate outrage farms',
      },
    ],
  },
  {
    id: 'healthcare',
    label: 'healthcare',
    results: [
      {
        id: 'hc1', title: 'Big Pharma\'s DIRTY SECRET exposed — doctors are FURIOUS',
        source: 'HealthScandal Weekly', sourceType: 'corporate', snippet: 'An insider reveals the shocking truth about the medication millions take every day. Are you at risk?',
        engagementCount: '2.7M views', framing: 'outrage', isBiased: true,
        biasReason: 'Medical misinformation ranked #1 by engagement optimization',
      },
      {
        id: 'hc2', title: 'EXPOSED: What your doctor is NOT telling you about this treatment',
        source: 'ViralHealth', sourceType: 'corporate', snippet: 'They profit from your illness. This whistleblower proves it. Watch before it\'s taken down...',
        engagementCount: '1.9M views', framing: 'sensational', isBiased: true,
        biasReason: 'Conspiracy framing of healthcare ranked above evidence-based content',
      },
      {
        id: 'hc3', title: 'Comparing healthcare systems: Access, cost, and outcomes globally',
        source: 'Health Affairs Journal', sourceType: 'academic', snippet: 'Cross-national analysis of 38 OECD countries reveals divergent approaches to coverage and quality metrics...',
        engagementCount: '22K views', framing: 'educational', isBiased: true,
        biasReason: 'Peer-reviewed comparison study outranked by clickbait',
      },
      {
        id: 'hc4', title: 'Your health insurance company HATES this one trick',
        source: 'ClickMD', sourceType: 'corporate', snippet: 'Millions are overpaying and this simple hack could save you thousands. Big insurance doesn\'t want you to know...',
        engagementCount: '780K views', framing: 'sensational', isBiased: true,
        biasReason: 'Clickbait health advice prioritized over verified medical information',
      },
      {
        id: 'hc5', title: 'Community health clinic opens in underserved neighborhood',
        source: 'City Health Report', sourceType: 'independent', snippet: 'The new facility will provide primary care, dental, and mental health services to 15,000 residents...',
        engagementCount: '5K views', framing: 'neutral', isBiased: false,
        biasReason: '',
      },
      {
        id: 'hc6', title: 'Evidence-based guide to preventive health screenings by age',
        source: 'Preventive Medicine Institute', sourceType: 'academic', snippet: 'Updated recommendations based on systematic review of screening effectiveness and risk-benefit ratios...',
        engagementCount: '11K views', framing: 'educational', isBiased: true,
        biasReason: 'Genuinely useful health guide ranked dead last',
      },
    ],
  },
  {
    id: 'technology',
    label: 'technology',
    results: [
      {
        id: 'te1', title: 'AI will DESTROY 80% of jobs by 2028 — and no one is prepared',
        source: 'TechPanic', sourceType: 'corporate', snippet: 'Leading researchers warn we have less than two years before mass unemployment hits. Are you ready?',
        engagementCount: '3.5M views', framing: 'outrage', isBiased: true,
        biasReason: 'Extreme fearmongering with fabricated statistics ranked #1',
      },
      {
        id: 'te2', title: 'TERRIFYING: Your phone is listening RIGHT NOW and here\'s proof',
        source: 'SurveillanceWatch', sourceType: 'corporate', snippet: 'We ran the experiment and the results are deeply disturbing. Every app on your phone is a spy...',
        engagementCount: '2.1M views', framing: 'sensational', isBiased: true,
        biasReason: 'Unverified surveillance claims amplified over factual reporting',
      },
      {
        id: 'te3', title: 'How smartphones changed social interaction: A 10-year longitudinal study',
        source: 'MIT Technology Review', sourceType: 'academic', snippet: 'Comprehensive study tracking 5,000 participants reveals nuanced effects on communication patterns...',
        engagementCount: '28K views', framing: 'educational', isBiased: true,
        biasReason: 'Decade-long research study buried below viral panic content',
      },
      {
        id: 'te4', title: 'Silicon Valley insider REVEALS the dark truth about your data',
        source: 'TechExpose', sourceType: 'corporate', snippet: 'Former engineer breaks NDA to expose what really happens to the information you share online...',
        engagementCount: '1.6M views', framing: 'sensational', isBiased: true,
        biasReason: 'Sensationalized whistleblower narrative outranks balanced reporting',
      },
      {
        id: 'te5', title: 'Open-source tools for digital privacy: A practical guide',
        source: 'Digital Rights Foundation', sourceType: 'activist', snippet: 'Step-by-step instructions for encrypting data, managing permissions, and protecting your privacy...',
        engagementCount: '15K views', framing: 'educational', isBiased: false,
        biasReason: '',
      },
      {
        id: 'te6', title: 'Local coding workshop teaches seniors to build their own apps',
        source: 'Community Tech News', sourceType: 'independent', snippet: 'The 8-week program has graduated 120 seniors who have built apps ranging from recipe books to health trackers...',
        engagementCount: '4K views', framing: 'neutral', isBiased: true,
        biasReason: 'Community tech story has zero algorithmic visibility',
      },
    ],
  },
  {
    id: 'economy',
    label: 'economy',
    results: [
      {
        id: 'ec1', title: 'The economy is a HOUSE OF CARDS and it\'s about to COLLAPSE',
        source: 'DoomEconomics', sourceType: 'corporate', snippet: 'Three charts that prove we\'re headed for the worst crash in history. Get your money out NOW...',
        engagementCount: '2.9M views', framing: 'outrage', isBiased: true,
        biasReason: 'Financial panic content ranked #1, could cause real economic harm',
      },
      {
        id: 'ec2', title: 'Why the RICH keep getting richer while YOU get NOTHING',
        source: 'ClassWar Daily', sourceType: 'corporate', snippet: 'The system is rigged and here\'s the mathematical proof. This video has billionaires terrified...',
        engagementCount: '2.3M views', framing: 'outrage', isBiased: true,
        biasReason: 'Rage-bait framing of wealth inequality outranks economic analysis',
      },
      {
        id: 'ec3', title: 'Q3 economic indicators: A balanced assessment',
        source: 'The Economist', sourceType: 'independent', snippet: 'Mixed signals across sectors suggest a complex picture. GDP growth steady but labor market shows divergence...',
        engagementCount: '42K views', framing: 'neutral', isBiased: false,
        biasReason: '',
      },
      {
        id: 'ec4', title: 'HIDDEN INFLATION: The real prices they don\'t want you to see',
        source: 'PriceWatch Rebels', sourceType: 'corporate', snippet: 'Government statistics are LYING. Real inflation is 4x higher than reported. Here\'s our investigation...',
        engagementCount: '1.1M views', framing: 'sensational', isBiased: true,
        biasReason: 'Conspiracy framing of economic data ranks above actual economics',
      },
      {
        id: 'ec5', title: 'Understanding monetary policy: How central banks manage inflation',
        source: 'Economics Explained', sourceType: 'academic', snippet: 'Visual breakdown of interest rate mechanisms, money supply, and their effects on everyday prices...',
        engagementCount: '16K views', framing: 'educational', isBiased: true,
        biasReason: 'Economic education consistently deprioritized by the algorithm',
      },
      {
        id: 'ec6', title: 'Local credit union launches no-fee accounts for low-income families',
        source: 'Banking Justice Now', sourceType: 'activist', snippet: 'The initiative aims to bring 10,000 unbanked families into the financial system by year\'s end...',
        engagementCount: '6K views', framing: 'neutral', isBiased: true,
        biasReason: 'Actionable community finance story invisible to algorithm',
      },
    ],
  },
  {
    id: 'education',
    label: 'education',
    results: [
      {
        id: 'ed1', title: 'Schools are INDOCTRINATING your children and here\'s PROOF',
        source: 'ParentRage', sourceType: 'corporate', snippet: 'Hidden camera footage from classrooms across America reveals a coordinated effort to...',
        engagementCount: '2.6M views', framing: 'outrage', isBiased: true,
        biasReason: 'Outrage about education ranked above actual educational content',
      },
      {
        id: 'ed2', title: 'Teacher FIRED for THIS — parents are outraged on both sides',
        source: 'ControversyClips', sourceType: 'corporate', snippet: 'The viral incident has divided the community and the video keeps getting removed and reposted...',
        engagementCount: '1.7M views', framing: 'sensational', isBiased: true,
        biasReason: 'Individual controversy amplified as representative of all education',
      },
      {
        id: 'ed3', title: 'New teaching methods show 40% improvement in reading comprehension',
        source: 'Education Research Quarterly', sourceType: 'academic', snippet: 'Randomized controlled trial across 200 schools demonstrates significant gains with structured literacy approach...',
        engagementCount: '19K views', framing: 'educational', isBiased: true,
        biasReason: 'Breakthrough educational research invisible to most users',
      },
      {
        id: 'ed4', title: 'The TRUTH about college degrees: are they WORTHLESS now?',
        source: 'SkepticalStudent', sourceType: 'corporate', snippet: 'We analyzed 50,000 graduates and the ROI numbers are devastating. Think twice before taking that loan...',
        engagementCount: '920K views', framing: 'sensational', isBiased: true,
        biasReason: 'Cherry-picked data framed as universal truth',
      },
      {
        id: 'ed5', title: 'Free online courses from top universities: Complete 2026 guide',
        source: 'Open Learning Hub', sourceType: 'independent', snippet: 'Curated list of 500+ free courses from MIT, Stanford, and Harvard with completion certificates...',
        engagementCount: '14K views', framing: 'neutral', isBiased: false,
        biasReason: '',
      },
      {
        id: 'ed6', title: 'How Finland redesigned education: Lessons from the world\'s top system',
        source: 'Global Ed Review', sourceType: 'activist', snippet: 'Detailed analysis of Finland\'s approach to teacher training, student wellbeing, and equity in outcomes...',
        engagementCount: '7K views', framing: 'educational', isBiased: true,
        biasReason: 'Policy solutions ranked below outrage about problems',
      },
    ],
  },
  {
    id: 'housing',
    label: 'housing',
    results: [
      {
        id: 'ho1', title: 'You will NEVER afford a home — here\'s why the system is RIGGED',
        source: 'RageFeed', sourceType: 'corporate', snippet: 'Wall Street bought YOUR neighborhood. The American dream is officially dead. Watch this before they...',
        engagementCount: '2.8M views', framing: 'outrage', isBiased: true,
        biasReason: 'Defeatist rage content ranked over actionable housing information',
      },
      {
        id: 'ho2', title: 'EXPOSED: Secret algorithm that makes YOUR rent go up every month',
        source: 'TenantFury', sourceType: 'corporate', snippet: 'Leaked documents reveal landlords use AI to coordinate rent increases across entire cities...',
        engagementCount: '1.5M views', framing: 'sensational', isBiased: true,
        biasReason: 'Sensationalized real issue framed for maximum anger over understanding',
      },
      {
        id: 'ho3', title: 'Housing affordability crisis: Causes, data, and potential solutions',
        source: 'Urban Institute', sourceType: 'academic', snippet: 'Comprehensive analysis of supply constraints, zoning, financing, and policy interventions across 50 metros...',
        engagementCount: '25K views', framing: 'educational', isBiased: true,
        biasReason: 'Solutions-focused research buried below despair content',
      },
      {
        id: 'ho4', title: 'Landlord does something DISGUSTING — tenant fights back',
        source: 'DramaHouse', sourceType: 'corporate', snippet: 'This viral story has renters furious and the landlord\'s response made everything worse...',
        engagementCount: '1.2M views', framing: 'outrage', isBiased: true,
        biasReason: 'Individual anecdote prioritized over systemic analysis',
      },
      {
        id: 'ho5', title: 'Community land trust model expands affordable housing in 12 cities',
        source: 'Housing Solutions Weekly', sourceType: 'independent', snippet: 'The CLT approach has preserved 8,000 permanently affordable units by removing land from speculative market...',
        engagementCount: '8K views', framing: 'neutral', isBiased: false,
        biasReason: '',
      },
      {
        id: 'ho6', title: 'Renter\'s rights toolkit: Know your legal protections state by state',
        source: 'Tenant Rights Project', sourceType: 'activist', snippet: 'Searchable database of tenant protections, eviction defense resources, and legal aid contacts...',
        engagementCount: '11K views', framing: 'educational', isBiased: true,
        biasReason: 'Actionable rights information ranked last',
      },
    ],
  },
  {
    id: 'criminal-justice',
    label: 'criminal justice',
    results: [
      {
        id: 'cj1', title: 'WATCH: Cop does the UNTHINKABLE — body cam footage leaked',
        source: 'JusticeViralClips', sourceType: 'corporate', snippet: 'The footage is going viral and authorities are scrambling to respond. This is the video they tried to bury...',
        engagementCount: '4.1M views', framing: 'outrage', isBiased: true,
        biasReason: 'Decontextualized outrage clip ranked #1 above all systemic analysis',
      },
      {
        id: 'cj2', title: 'Criminal gets WHAT THEY DESERVE — judge drops the hammer',
        source: 'JusticeServed', sourceType: 'corporate', snippet: 'The courtroom erupted after the sentence was read. This is what accountability looks like...',
        engagementCount: '2.5M views', framing: 'sensational', isBiased: true,
        biasReason: 'Punitive spectacle content amplified by engagement algorithm',
      },
      {
        id: 'cj3', title: 'Racial disparities in sentencing: Analysis of 500,000 federal cases',
        source: 'Justice Policy Institute', sourceType: 'academic', snippet: 'Controlling for offense type and criminal history, sentencing gaps persist across racial lines at 19.1%...',
        engagementCount: '31K views', framing: 'educational', isBiased: true,
        biasReason: 'Half-million case study ranked below individual viral clips',
      },
      {
        id: 'cj4', title: 'This judge should be REMOVED — you won\'t believe this ruling',
        source: 'OutrageJustice', sourceType: 'corporate', snippet: 'The decision has sparked protests outside the courthouse and calls for immediate judicial review...',
        engagementCount: '1.3M views', framing: 'outrage', isBiased: true,
        biasReason: 'Individual case outrage prioritized over systemic reform discussion',
      },
      {
        id: 'cj5', title: 'Restorative justice program reduces recidivism by 43% in pilot cities',
        source: 'Reform Now Coalition', sourceType: 'activist', snippet: 'Three-year pilot across 8 cities shows significant reduction in reoffending with community-based approach...',
        engagementCount: '9K views', framing: 'neutral', isBiased: false,
        biasReason: '',
      },
      {
        id: 'cj6', title: 'Know your rights during a police encounter: Constitutional guide',
        source: 'Civil Liberties Union', sourceType: 'independent', snippet: 'Clear, practical guidance on your 4th, 5th, and 6th amendment rights during stops, searches, and arrests...',
        engagementCount: '13K views', framing: 'educational', isBiased: true,
        biasReason: 'Rights education ranked last despite universal relevance',
      },
    ],
  },
]

// ─── Framing Colors ─────────────────────────────────────────────────

const FRAMING_CONFIG: Record<SearchResult['framing'], { color: string; bg: string; label: string }> = {
  outrage: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'OUTRAGE' },
  sensational: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', label: 'SENSATIONAL' },
  neutral: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', label: 'NEUTRAL' },
  educational: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'EDUCATIONAL' },
}

const SOURCE_ICONS: Record<SearchResult['sourceType'], string> = {
  corporate: 'CORP',
  independent: 'INDP',
  academic: 'ACAD',
  activist: 'ACTV',
}

// ─── Pie Chart (CSS conic-gradient) ─────────────────────────────────

function PieChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((a, s) => a + s.value, 0)
  let cumulative = 0

  const gradientStops = segments.map(seg => {
    const start = (cumulative / total) * 100
    cumulative += seg.value
    const end = (cumulative / total) * 100
    return `${seg.color} ${start}% ${end}%`
  }).join(', ')

  return (
    <div className="flex items-center gap-4">
      <div
        className="w-20 h-20 rounded-full flex-shrink-0 border border-green-500/20"
        style={{ background: `conic-gradient(${gradientStops})` }}
      />
      <div className="space-y-1">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="font-mono text-xs text-green-300/70">
              {seg.label}: {Math.round((seg.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Bar Chart (CSS) ────────────────────────────────────────────────

function BarChart({ bars }: { bars: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...bars.map(b => b.value))

  return (
    <div className="space-y-2">
      {bars.map(bar => (
        <div key={bar.label} className="flex items-center gap-2">
          <span className="font-mono text-xs text-green-500/50 w-20 text-right flex-shrink-0 truncate">
            {bar.label}
          </span>
          <div className="flex-1 h-4 bg-green-500/5 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(bar.value / max) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded"
              style={{ backgroundColor: bar.color }}
            />
          </div>
          <span className="font-mono text-xs text-green-400/70 w-10 flex-shrink-0 tabular-nums">
            {bar.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Result Card ────────────────────────────────────────────────────

function ResultCard({
  result,
  rank,
  auditMode,
  tagged,
  onTag,
}: {
  result: SearchResult
  rank: number
  auditMode: boolean
  tagged: 'biased' | 'fair' | null
  onTag: (resultId: string, tag: 'biased' | 'fair') => void
}) {
  const f = FRAMING_CONFIG[result.framing]
  const [flash, setFlash] = useState<'green' | 'red' | null>(null)

  const handleTag = (tag: 'biased' | 'fair') => {
    const correct = (tag === 'biased' && result.isBiased) || (tag === 'fair' && !result.isBiased)
    setFlash(correct ? 'green' : 'red')
    setTimeout(() => setFlash(null), 600)
    onTag(result.id, tag)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08 }}
      className={`border rounded-lg p-3 transition-all ${
        flash === 'green'
          ? 'border-green-400/50 bg-green-950/20'
          : flash === 'red'
            ? 'border-red-400/50 bg-red-950/20'
            : tagged
              ? tagged === 'biased'
                ? 'border-red-500/20 bg-red-950/5'
                : 'border-blue-500/20 bg-blue-950/5'
              : 'border-green-500/10 bg-gray-950/60'
      }`}
    >
      {/* Rank badge */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 border border-green-500/20 rounded flex items-center justify-center">
          <span className="font-mono text-xs text-green-500/50">#{rank}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-mono text-xs text-green-300/90 leading-snug mb-1">
            {result.title}
          </h4>

          {/* Source row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-xs text-green-500/40">
              {result.source}
            </span>
            <span className="font-mono text-xs text-green-500/20 border border-green-500/10 rounded px-1 py-0.5">
              {SOURCE_ICONS[result.sourceType]}
            </span>
            <span className={`font-mono text-xs border rounded px-1 py-0.5 ${f.bg} ${f.color}`}>
              {f.label}
            </span>
            <span className="font-mono text-xs text-green-500/30 ml-auto flex-shrink-0">
              {result.engagementCount}
            </span>
          </div>

          {/* Snippet */}
          <p className="font-mono text-xs text-green-500/40 leading-snug line-clamp-2 mb-2">
            {result.snippet}
          </p>

          {/* Audit buttons */}
          {auditMode && !tagged && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => handleTag('biased')}
                className="font-mono text-xs text-red-400 border border-red-500/30 rounded px-3 py-2
                  hover:bg-red-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
              >
                BIASED
              </button>
              <button
                onClick={() => handleTag('fair')}
                className="font-mono text-xs text-blue-400 border border-blue-500/30 rounded px-3 py-2
                  hover:bg-blue-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
              >
                FAIR
              </button>
            </motion.div>
          )}

          {/* Tagged state */}
          {tagged && (
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs uppercase tracking-wider ${
                tagged === 'biased' ? 'text-red-400' : 'text-blue-400'
              }`}>
                Tagged: {tagged}
              </span>
              {tagged === 'biased' && result.isBiased && result.biasReason && (
                <span className="font-mono text-xs text-green-500/40">
                  - {result.biasReason}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────

export function AlgoAuditGame({ mission, onComplete }: AlgoAuditGameProps) {
  const [phase, setPhase] = useState<GamePhase>('testing')
  const [testedQueries, setTestedQueries] = useState<Set<string>>(new Set())
  const [activeQuery, setActiveQuery] = useState<string | null>(null)
  const [tags, setTags] = useState<Record<string, 'biased' | 'fair'>>({})
  const [score, setScore] = useState(0)
  const [totalTagged, setTotalTagged] = useState(0)

  const canAudit = testedQueries.size >= 4
  const activeQueryData = QUERIES.find(q => q.id === activeQuery)

  // Handle query selection
  const handleQuerySelect = useCallback((queryId: string) => {
    scan()
    setActiveQuery(queryId)
    setTestedQueries(prev => new Set([...prev, queryId]))
  }, [])

  // Handle tagging a result
  const handleTag = useCallback((resultId: string, tag: 'biased' | 'fair') => {
    // Find the result
    let result: SearchResult | undefined
    for (const q of QUERIES) {
      result = q.results.find(r => r.id === resultId)
      if (result) break
    }
    if (!result) return

    const correct = (tag === 'biased' && result.isBiased) || (tag === 'fair' && !result.isBiased)

    if (correct) {
      playSuccess()
      setScore(prev => prev + 10)
    } else {
      glitch()
    }

    setTags(prev => ({ ...prev, [resultId]: tag }))
    setTotalTagged(prev => prev + 1)
  }, [])

  // Enter audit mode
  const handleStartAudit = useCallback(() => {
    whoosh()
    setPhase('auditing')
  }, [])

  // Generate report
  const handleGenerateReport = useCallback(() => {
    impact()
    staticBurst(300)
    setPhase('report')
  }, [])

  // Count stats across all tested queries
  const auditStats = useMemo(() => {
    const tested = QUERIES.filter(q => testedQueries.has(q.id))
    const allResults = tested.flatMap(q => q.results)

    const framingCounts = { outrage: 0, sensational: 0, neutral: 0, educational: 0 }
    const sourceCounts = { corporate: 0, independent: 0, academic: 0, activist: 0 }
    let topTwoOutrage = 0
    let bottomTwoEducational = 0

    tested.forEach(q => {
      // Top 2 positions
      if (q.results[0]?.framing === 'outrage' || q.results[0]?.framing === 'sensational') topTwoOutrage++
      if (q.results[1]?.framing === 'outrage' || q.results[1]?.framing === 'sensational') topTwoOutrage++
      // Bottom 2 positions
      if (q.results[4]?.framing === 'educational' || q.results[4]?.framing === 'neutral') bottomTwoEducational++
      if (q.results[5]?.framing === 'educational' || q.results[5]?.framing === 'neutral') bottomTwoEducational++

      q.results.forEach(r => {
        framingCounts[r.framing]++
        sourceCounts[r.sourceType]++
      })
    })

    const totalResults = allResults.length
    const totalTested = tested.length

    return {
      framingCounts,
      sourceCounts,
      topTwoOutrage,
      bottomTwoEducational,
      totalResults,
      totalTested,
      outragePct: Math.round(((framingCounts.outrage + framingCounts.sensational) / totalResults) * 100),
      educationalPct: Math.round(((framingCounts.educational + framingCounts.neutral) / totalResults) * 100),
      corporatePct: Math.round((sourceCounts.corporate / totalResults) * 100),
      independentPct: Math.round(((sourceCounts.independent + sourceCounts.activist + sourceCounts.academic) / totalResults) * 100),
    }
  }, [testedQueries])

  // ── REPORT PHASE ────────────────────────────────────────────────
  if (phase === 'report') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full overflow-y-auto"
      >
        <div className="max-w-lg mx-auto p-6 space-y-6">
          {/* Report header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center border-b border-green-500/20 pb-4"
          >
            <div className="font-mono text-xs text-red-400/60 uppercase tracking-[0.3em] mb-1">
              CLASSIFIED // INTERNAL USE ONLY
            </div>
            <h2 className="font-mono text-xl text-green-400 font-bold mb-1">
              ALGORITHM AUDIT REPORT
            </h2>
            <p className="font-mono text-xs text-green-500/40">
              {auditStats.totalTested} Topics Analyzed / {auditStats.totalResults} Results Evaluated
            </p>
          </motion.div>

          {/* Bias grade */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="border-2 border-red-500/30 rounded-lg p-6 text-center bg-red-950/10"
          >
            <div className="font-mono text-xs text-red-400/60 uppercase tracking-wider mb-2">
              Algorithm Bias Score
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="font-mono text-6xl text-red-400 font-bold"
            >
              F
            </motion.div>
            <p className="font-mono text-xs text-red-400/50 mt-2">
              SEVERE SYSTEMIC BIAS DETECTED
            </p>
          </motion.div>

          {/* Content Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="border border-green-500/15 rounded-lg p-4"
          >
            <h3 className="font-mono text-xs text-green-500/50 uppercase tracking-wider mb-3">
              Content Type Distribution
            </h3>
            <PieChart segments={[
              { label: 'Outrage', value: auditStats.framingCounts.outrage, color: 'rgb(248,113,113)' },
              { label: 'Sensational', value: auditStats.framingCounts.sensational, color: 'rgb(251,146,60)' },
              { label: 'Neutral', value: auditStats.framingCounts.neutral, color: 'rgb(96,165,250)' },
              { label: 'Educational', value: auditStats.framingCounts.educational, color: 'rgb(52,211,153)' },
            ]} />
          </motion.div>

          {/* Source Diversity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="border border-green-500/15 rounded-lg p-4"
          >
            <h3 className="font-mono text-xs text-green-500/50 uppercase tracking-wider mb-3">
              Source Diversity
            </h3>
            <BarChart bars={[
              { label: 'Corporate', value: auditStats.corporatePct, color: 'rgb(248,113,113)' },
              { label: 'Independent', value: Math.round((auditStats.sourceCounts.independent / auditStats.totalResults) * 100), color: 'rgb(96,165,250)' },
              { label: 'Academic', value: Math.round((auditStats.sourceCounts.academic / auditStats.totalResults) * 100), color: 'rgb(52,211,153)' },
              { label: 'Activist', value: Math.round((auditStats.sourceCounts.activist / auditStats.totalResults) * 100), color: 'rgb(250,204,21)' },
            ]} />
          </motion.div>

          {/* Key findings */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="border border-yellow-500/20 rounded-lg p-4 bg-yellow-950/10 space-y-3"
          >
            <h3 className="font-mono text-xs text-yellow-400 uppercase tracking-wider">
              Key Findings
            </h3>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-mono text-xs flex-shrink-0 mt-0.5">01</span>
                <p className="font-mono text-xs text-green-300/70 leading-relaxed">
                  Outrage and sensational content occupies <span className="text-red-400 font-bold">{auditStats.outragePct}%</span> of all recommended content, despite representing a minority of available information.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-mono text-xs flex-shrink-0 mt-0.5">02</span>
                <p className="font-mono text-xs text-green-300/70 leading-relaxed">
                  Educational and neutral content is consistently ranked in positions <span className="text-red-400 font-bold">#5-6</span>, effectively invisible to most users who never scroll past #3.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-mono text-xs flex-shrink-0 mt-0.5">03</span>
                <p className="font-mono text-xs text-green-300/70 leading-relaxed">
                  Corporate media sources with high engagement budgets dominate the top positions at <span className="text-red-400 font-bold">{auditStats.corporatePct}%</span>, while independent and academic sources are systematically deprioritized.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-mono text-xs flex-shrink-0 mt-0.5">04</span>
                <p className="font-mono text-xs text-green-300/70 leading-relaxed">
                  This pattern is <span className="text-red-400 font-bold">consistent across all {auditStats.totalTested} topics tested</span>. The bias is not topic-specific. It is structural.
                </p>
              </div>
            </div>
          </motion.div>

          {/* The conclusion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="border border-red-500/20 rounded-lg p-5 bg-red-950/10"
          >
            <p className="font-mono text-xs text-red-300/80 leading-relaxed">
              This algorithm amplifies outrage <span className="font-bold text-red-400">6x</span> more than education.
              It rewards content designed to make you angry over content designed to make you informed.
              The ranking is not based on truth, accuracy, or public interest. It is based on one metric: engagement.
              And engagement is a euphemism for addiction.
            </p>
          </motion.div>

          {/* Score & complete */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-center space-y-4"
          >
            <div className="border border-green-500/20 rounded-lg p-4 inline-block">
              <div className="font-mono text-xs text-green-500/40 uppercase tracking-wider mb-1">
                Your Audit Score
              </div>
              <div className="font-mono text-3xl text-green-400 font-bold">{score}</div>
              <div className="font-mono text-xs text-green-500/30">
                {totalTagged} results tagged
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                impact()
                onComplete(score)
              }}
              className="w-full border border-green-500/40 text-green-400 font-mono text-sm py-3 rounded
                hover:bg-green-500/10 transition-colors tracking-wider uppercase"
            >
              COMPLETE INVESTIGATION
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // ── TESTING & AUDITING PHASES ───────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-green-500/10 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${phase === 'auditing' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="font-mono text-xs text-green-500/50 uppercase tracking-wider">
                {phase === 'testing' ? 'TESTING ENGINE' : 'AUDIT MODE'}
              </span>
            </div>
            <div className="h-4 w-px bg-green-500/10" />
            <span className="font-mono text-xs text-green-500/40">
              {testedQueries.size}/8 queries
            </span>
          </div>

          <div className="flex items-center gap-3">
            {phase === 'auditing' && (
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-green-500/40">Score:</span>
                <span className="font-mono text-sm text-green-400 font-bold tabular-nums">{score}</span>
              </div>
            )}

            {canAudit && phase === 'testing' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartAudit}
                className="border border-red-500/40 text-red-400 font-mono text-xs px-3 py-2 rounded
                  hover:bg-red-500/10 transition-colors uppercase tracking-wider animate-pulse min-h-[44px]"
              >
                START AUDIT
              </motion.button>
            )}

            {phase === 'auditing' && totalTagged >= 8 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateReport}
                className="border border-yellow-500/40 text-yellow-400 font-mono text-xs px-3 py-2 rounded
                  hover:bg-yellow-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
              >
                GENERATE REPORT
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Search interface */}
      <div className="flex-shrink-0 border-b border-green-500/5 px-3 py-3">
        {/* Search bar aesthetic */}
        <div className="border border-green-500/15 rounded-lg p-2 bg-gray-950/60 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-green-500/30 text-sm">&#9906;</span>
            <span className="font-mono text-xs text-green-400/70">
              {activeQuery
                ? QUERIES.find(q => q.id === activeQuery)?.label
                : 'Select a topic to test the algorithm...'}
            </span>
            <span className="ml-auto font-mono text-xs text-green-500/20 uppercase">
              DataCorp Search Engine v3.2
            </span>
          </div>
        </div>

        {/* Query chips */}
        <div className="flex flex-wrap gap-1.5">
          {QUERIES.map(q => {
            const tested = testedQueries.has(q.id)
            const isActive = activeQuery === q.id

            return (
              <motion.button
                key={q.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuerySelect(q.id)}
                className={`font-mono text-xs px-3 py-2 rounded-full border transition-all min-h-[44px] ${
                  isActive
                    ? 'border-green-400/50 text-green-400 bg-green-500/15'
                    : tested
                      ? 'border-green-500/20 text-green-500/50 bg-green-500/5'
                      : 'border-green-500/15 text-green-500/40 hover:border-green-500/30 hover:text-green-400'
                }`}
              >
                {tested && !isActive && (
                  <span className="mr-1 text-green-400">&#10003;</span>
                )}
                {q.label}
              </motion.button>
            )
          })}
        </div>

        {!canAudit && (
          <p className="font-mono text-xs text-green-500/30 mt-2">
            Test at least 4 topics to unlock audit mode
          </p>
        )}
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto p-3 px-4">
        {!activeQuery ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-xs"
            >
              <div className="w-16 h-16 border border-green-500/15 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="font-mono text-2xl text-green-500/20">&#9906;</span>
              </div>
              <p className="font-mono text-xs text-green-500/40 mb-2">
                Test the recommendation engine
              </p>
              <p className="font-mono text-xs text-green-500/25 leading-relaxed">
                Select topics above to see what the algorithm recommends.
                Look for patterns in how results are ranked.
                {phase === 'testing' ? ' Test 4+ topics to unlock audit mode.' : ' Tag results as BIASED or FAIR.'}
              </p>
            </motion.div>
          </div>
        ) : activeQueryData ? (
          <div className="space-y-2 max-w-lg mx-auto">
            {/* Results header */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-green-500/40">
                {activeQueryData.results.length} results for &quot;{activeQueryData.label}&quot;
              </span>
              <span className="font-mono text-xs text-green-500/20">
                Sorted by: Relevance (Engagement-Optimized)
              </span>
            </div>

            {/* Result cards */}
            {activeQueryData.results.map((result, i) => (
              <ResultCard
                key={result.id}
                result={result}
                rank={i + 1}
                auditMode={phase === 'auditing'}
                tagged={tags[result.id] || null}
                onTag={handleTag}
              />
            ))}

            {/* Pattern hint */}
            {phase === 'testing' && testedQueries.size >= 2 && testedQueries.size < 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="border border-yellow-500/15 rounded p-3 mt-4"
              >
                <p className="font-mono text-xs text-yellow-400/60 leading-relaxed">
                  Notice anything about the ranking? Test {4 - testedQueries.size} more {4 - testedQueries.size === 1 ? 'topic' : 'topics'} to see if the pattern holds.
                </p>
              </motion.div>
            )}
          </div>
        ) : null}
      </div>

      {/* Bottom status */}
      {phase === 'auditing' && (
        <div className="flex-shrink-0 border-t border-green-500/10 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-green-500/30">
              {totalTagged} results tagged / Score: {score}
            </span>
            {totalTagged >= 8 ? (
              <span className="font-mono text-xs text-yellow-400/60 animate-pulse">
                Ready to generate report
              </span>
            ) : (
              <span className="font-mono text-xs text-green-500/30">
                Tag {Math.max(0, 8 - totalTagged)} more results to generate report
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
