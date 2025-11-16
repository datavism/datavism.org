'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import Confetti from 'react-confetti'
import { useResistance } from '@/lib/store/useResistance'
import { useRouter } from 'next/navigation'

interface Evidence {
  id: string
  title: string
  content: string
  type: 'claim' | 'reality' | 'document'
  credibility: 'fake' | 'real'
}

const evidenceItems: Evidence[] = [
  {
    id: 'claim1',
    title: 'Company Press Release',
    content: '"EcoTech Corp is 100% carbon neutral and committed to saving the planet!"',
    type: 'claim',
    credibility: 'fake'
  },
  {
    id: 'doc1',
    title: 'Leaked Internal Memo',
    content: '"Continue offshore operations. Ignore emissions reporting. Marketing will handle the narrative."',
    type: 'document',
    credibility: 'real'
  },
  {
    id: 'real1',
    title: 'Satellite Data Analysis',
    content: 'EcoTech factories emit 2.4M tons CO2 annually. No carbon offset purchases detected.',
    type: 'reality',
    credibility: 'real'
  },
  {
    id: 'claim2',
    title: 'CEO Interview',
    content: '"We plant a tree for every product sold. We\'re making a difference!"',
    type: 'claim',
    credibility: 'fake'
  },
  {
    id: 'real2',
    title: 'Investigative Report',
    content: 'Photo analysis: "Tree planting" site is actually a parking lot. Trees photoshopped.',
    type: 'reality',
    credibility: 'real'
  }
]

export function FirstMissionExplorer() {
  const [phase, setPhase] = useState<'briefing' | 'investigating' | 'analysis' | 'success'>('briefing')
  const [collectedEvidence, setCollectedEvidence] = useState<Evidence[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const { completeMission, profile } = useResistance()
  const router = useRouter()

  const collectEvidence = (evidence: Evidence) => {
    if (!collectedEvidence.find(e => e.id === evidence.id)) {
      setCollectedEvidence([...collectedEvidence, evidence])

      if (collectedEvidence.length >= 3) {
        setTimeout(() => setPhase('analysis'), 1000)
      }
    }
  }

  const submitInvestigation = () => {
    const hasClaims = collectedEvidence.some(e => e.type === 'claim')
    const hasReality = collectedEvidence.some(e => e.type === 'reality')
    const hasDoc = collectedEvidence.some(e => e.type === 'document')

    if (hasClaims && hasReality && hasDoc) {
      setShowConfetti(true)
      setTimeout(() => {
        setPhase('success')
        completeMission('first-explorer', 500)
      }, 3000)
    }
  }

  const handleContinue = () => {
    router.push('/dashboard')
  }

  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'claim': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'reality': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'document': return <FileText className="w-5 h-5 text-cyan-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} colors={['#eab308', '#22c55e', '#06b6d4']} />}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {phase === 'briefing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="border-2 border-yellow-400 p-8 mb-8 bg-yellow-950/20">
              <div className="flex items-center gap-4 mb-6">
                <Search className="w-12 h-12 text-yellow-400" />
                <div>
                  <h2 className="text-2xl font-bold text-yellow-400">Mission Briefing</h2>
                  <p className="text-gray-400">From: Maya Chen</p>
                </div>
              </div>

              <div className="space-y-4 text-lg text-gray-300">
                <p className="text-yellow-400 font-bold">
                  {profile?.name}, time for detective work.
                </p>
                <p>
                  Corporations spend billions on <span className="text-green-400">"green" marketing</span>.
                  They plaster their logos with leaves. Promise to save the planet.
                </p>
                <p className="text-red-400">
                  Most of it is lies. Greenwashing. Marketing fantasy while they destroy the earth.
                </p>
                <p>
                  I've leaked documents from <strong>EcoTech Corp</strong>.
                  They claim to be "100% carbon neutral." Tree planters. Planet savers.
                </p>
                <p>
                  But I've also obtained satellite data, internal memos, and investigative reports.
                </p>
                <p className="text-yellow-400">
                  Your mission: <strong>Collect evidence. Connect the dots. Expose the lie.</strong>
                </p>
              </div>
            </div>

            <div className="border border-cyan-400 p-6 mb-6 bg-cyan-950/10">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Truth Explorer Challenge
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>🔍 <strong>Objective:</strong> Gather evidence of greenwashing</p>
                <p>🛠️ <strong>Tools:</strong> Critical thinking + Document analysis</p>
                <p>💡 <strong>Method:</strong> Collect Claims, Reality, and Documents</p>
                <p>🎯 <strong>Reward:</strong> 500 XP + Truth Explorer Badge</p>
              </div>
            </div>

            <button
              onClick={() => setPhase('investigating')}
              className="w-full px-8 py-4 bg-yellow-600 text-black font-bold text-xl hover:bg-yellow-500"
            >
              START INVESTIGATION →
            </button>
          </motion.div>
        )}

        {phase === 'investigating' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-400">Evidence Collection</h2>
              <div className="text-lg text-gray-400">
                Collected: {collectedEvidence.length}/4
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Available Evidence</h3>
                <div className="space-y-3">
                  {evidenceItems.map((evidence) => {
                    const isCollected = collectedEvidence.find(e => e.id === evidence.id)

                    return (
                      <motion.button
                        key={evidence.id}
                        whileHover={!isCollected ? { scale: 1.02 } : {}}
                        onClick={() => !isCollected && collectEvidence(evidence)}
                        disabled={!!isCollected}
                        className={`w-full text-left p-4 border-2 transition-all ${
                          isCollected
                            ? 'border-green-400 bg-green-950/20 opacity-50 cursor-default'
                            : 'border-gray-600 hover:border-yellow-400 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getEvidenceIcon(evidence.type)}
                          <div className="flex-1">
                            <div className="font-bold text-sm mb-1 flex items-center justify-between">
                              <span className={
                                evidence.type === 'claim' ? 'text-yellow-400' :
                                evidence.type === 'reality' ? 'text-green-400' :
                                'text-cyan-400'
                              }>
                                {evidence.title}
                              </span>
                              {isCollected && <CheckCircle className="w-4 h-4 text-green-400" />}
                            </div>
                            <div className="text-xs text-gray-400">{evidence.content}</div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-green-400">Your Case File</h3>
                <div className="border-2 border-green-400 p-4 bg-green-950/10 min-h-[400px]">
                  {collectedEvidence.length === 0 && (
                    <p className="text-gray-500 text-center py-12">
                      Click evidence items to add them to your case file.
                      You need Claims, Reality, and Documents.
                    </p>
                  )}

                  <AnimatePresence>
                    {collectedEvidence.map((evidence, i) => (
                      <motion.div
                        key={evidence.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="mb-3 p-3 bg-black border border-gray-700"
                      >
                        <div className="flex items-start gap-2">
                          {getEvidenceIcon(evidence.type)}
                          <div>
                            <div className="text-sm font-bold text-gray-300">{evidence.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{evidence.content}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {collectedEvidence.length >= 4 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={submitInvestigation}
                      className="w-full mt-4 px-6 py-3 bg-yellow-600 text-black font-bold hover:bg-yellow-500"
                    >
                      📋 SUBMIT INVESTIGATION
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h1 className="text-5xl font-bold text-yellow-400 mb-4">
              CASE CLOSED
            </h1>
            <p className="text-2xl text-green-400 mb-8">
              You've exposed the greenwashing, Truth Explorer.
            </p>

            <div className="border-2 border-yellow-400 p-8 mb-8 max-w-2xl mx-auto bg-yellow-950/20">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Evidence Summary:</h2>
              <div className="space-y-3 text-left text-lg text-gray-300">
                <p>
                  <strong className="text-yellow-400">CLAIM:</strong> "100% carbon neutral"
                </p>
                <p>
                  <strong className="text-red-400">REALITY:</strong> 2.4M tons CO2/year, no offsets
                </p>
                <p>
                  <strong className="text-cyan-400">EVIDENCE:</strong> Internal memo admits ignoring emissions
                </p>
                <p>
                  <strong className="text-yellow-400">CLAIM:</strong> "Tree planting program"
                </p>
                <p>
                  <strong className="text-red-400">REALITY:</strong> Photos were photoshopped. No trees planted.
                </p>
                <p className="text-green-400 font-bold pt-3 border-t border-gray-700">
                  ✓ GREENWASHING CONFIRMED
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="border border-cyan-400 p-4 bg-cyan-950/10">
                <div className="text-3xl font-bold text-cyan-400">+500</div>
                <div className="text-sm text-gray-400">XP Earned</div>
              </div>
              <div className="border border-yellow-400 p-4 bg-yellow-950/10">
                <div className="text-3xl font-bold text-yellow-400">🔍</div>
                <div className="text-sm text-gray-400">Truth Explorer Badge</div>
              </div>
              <div className="border border-green-400 p-4 bg-green-950/10">
                <div className="text-3xl font-bold text-green-400">1/∞</div>
                <div className="text-sm text-gray-400">Cases Solved</div>
              </div>
            </div>

            <div className="border border-cyan-400 p-6 mb-8 max-w-2xl mx-auto bg-cyan-950/10">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Next Level:</h3>
              <p className="text-gray-300">
                Investigate complex disinformation networks. Track money flows.
                Connect shell companies to real actors.
                <span className="text-green-400"> Advanced OSINT in Level 2.</span>
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-yellow-600 text-black font-bold text-xl hover:bg-yellow-500"
            >
              CONTINUE TO HQ →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
