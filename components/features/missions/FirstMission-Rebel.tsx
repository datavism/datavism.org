'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Code, DollarSign, TrendingUp } from 'lucide-react'
import Confetti from 'react-confetti'
import { useResistance } from '@/lib/store/useResistance'
import { useRouter } from 'next/navigation'

export function FirstMissionRebel() {
  const [phase, setPhase] = useState<'briefing' | 'building' | 'testing' | 'success'>('briefing')
  const [code, setCode] = useState(`// Maya's leaked price data API
const priceData = {
  "first_visit": { price: 29.99, time: "10:00" },
  "second_visit": { price: 34.99, time: "10:05" },
  "third_visit": { price: 39.99, time: "10:10" }
};

// TODO: Build a function to detect price manipulation
// Compare prices and find the pattern

function detectPriceManipulation(data) {
  // Your code here
  // Hint: Compare first_visit vs third_visit

  return "TODO: Return your findings";
}

console.log(detectPriceManipulation(priceData));
`)
  const [output, setOutput] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [priceIncreases, setPriceIncreases] = useState(0)
  const { completeMission, profile } = useResistance()
  const router = useRouter()

  const runCode = () => {
    try {
      // Create a safe eval environment
      const priceData = {
        "first_visit": { price: 29.99, time: "10:00" },
        "second_visit": { price: 34.99, time: "10:05" },
        "third_visit": { price: 39.99, time: "10:10" }
      }

      // Extract the function from code
      const funcMatch = code.match(/function detectPriceManipulation\([^)]*\)\s*\{([\s\S]+?)\}/)
      if (!funcMatch) {
        setOutput('❌ Error: detectPriceManipulation function not found')
        return
      }

      const funcBody = funcMatch[1]
      const detectPriceManipulation = new Function('data', funcBody)

      const result = detectPriceManipulation(priceData)
      const resultStr = String(result)

      setOutput(`✅ Success!\n\n${resultStr}`)

      // Check if they found the manipulation
      if (resultStr.includes('33%') ||
          resultStr.includes('$10') ||
          resultStr.includes('39.99') ||
          (resultStr.includes('increase') && resultStr.includes('price'))) {

        setPriceIncreases(33)
        setShowConfetti(true)
        setTimeout(() => {
          setPhase('success')
          completeMission('first-rebel', 500)
        }, 3000)
      }
    } catch (error) {
      setOutput(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} colors={['#22c55e', '#eab308', '#06b6d4']} />}

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {phase === 'briefing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Maya's Briefing */}
            <div className="border-2 border-green-400 p-8 mb-8 bg-green-950/20">
              <div className="flex items-center gap-4 mb-6">
                <Code className="w-12 h-12 text-green-400" />
                <div>
                  <h2 className="text-2xl font-bold">Mission Briefing</h2>
                  <p className="text-gray-400">From: Maya Chen</p>
                </div>
              </div>

              <div className="space-y-4 text-lg">
                <p className="text-yellow-400 font-bold">
                  Welcome, {profile?.name}. Time to build your first weapon.
                </p>
                <p>
                  Online stores are using <span className="text-red-400">dynamic pricing algorithms</span>.
                  They track your visits. Your interest. Your desperation.
                </p>
                <p className="text-red-400">
                  Come back to check a product? Price goes up. Show interest? Price increases.
                  They're literally charging you more because you want it.
                </p>
                <p>
                  I've intercepted price data from a major e-commerce site.
                  Same product. Same user. Three visits in 10 minutes.
                </p>
                <p className="text-green-400">
                  Your mission: <strong>Build a detector. Expose the manipulation.</strong>
                </p>
              </div>
            </div>

            {/* The Challenge */}
            <div className="border border-cyan-400 p-6 mb-6 bg-cyan-950/10">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Code Rebel Challenge
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>💻 <strong>Objective:</strong> Build a price manipulation detector</p>
                <p>🛠️ <strong>Tools:</strong> JavaScript (vanilla - no frameworks needed)</p>
                <p>💡 <strong>Hint:</strong> Compare first_visit price vs third_visit price</p>
                <p>🎯 <strong>Reward:</strong> 500 XP + Code Rebel Badge</p>
              </div>
            </div>

            <button
              onClick={() => setPhase('building')}
              className="w-full px-8 py-4 bg-green-600 text-black font-bold text-xl hover:bg-green-500"
            >
              START BUILDING →
            </button>
          </motion.div>
        )}

        {phase === 'building' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold mb-6">Build Your Price Detector</h2>

            {/* Code Editor (Simple textarea for now) */}
            <div className="border-2 border-green-400 mb-6 bg-black">
              <div className="flex items-center justify-between px-4 py-2 border-b border-green-400/30">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-mono">price_detector.js</span>
                </div>
                <div className="text-xs font-mono text-gray-400">JAVASCRIPT</div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-4 bg-black text-green-300 font-mono text-sm outline-none resize-none"
                rows={20}
                spellCheck={false}
              />
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={runCode}
                className="flex-1 px-8 py-4 bg-green-600 text-black font-bold text-xl hover:bg-green-500"
              >
                🚀 RUN CODE
              </button>
              <button
                onClick={() => setPhase('briefing')}
                className="px-6 py-4 border border-gray-600 text-gray-400 hover:border-green-400 hover:text-green-400"
              >
                ← Back to Briefing
              </button>
            </div>

            {/* Output */}
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-green-400 p-4 bg-black mb-6"
              >
                <div className="text-sm text-green-400 mb-2">CONSOLE OUTPUT:</div>
                <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                  {output}
                </pre>
              </motion.div>
            )}

            {/* Hints */}
            <details className="border border-yellow-400 p-4">
              <summary className="cursor-pointer text-yellow-400 font-bold">
                💡 Need Help?
              </summary>
              <div className="mt-4 space-y-3 text-gray-300">
                <p><strong>Try this approach:</strong></p>
                <code className="block bg-black p-3 text-green-400">
                  const firstPrice = data.first_visit.price;<br/>
                  const thirdPrice = data.third_visit.price;<br/>
                  const increase = thirdPrice - firstPrice;<br/>
                  const percentIncrease = (increase / firstPrice) * 100;<br/>
                  <br/>
                  return `Price increased by $${'{'}increase{'}'} ({'{'}percentIncrease.toFixed(0){'}'}%)`;
                </code>
              </div>
            </details>
          </motion.div>
        )}

        {phase === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">⚡</div>
            <h1 className="text-5xl font-bold text-green-400 mb-4">
              WEAPON BUILT
            </h1>
            <p className="text-2xl text-yellow-400 mb-8">
              You've exposed the price manipulation, Code Rebel.
            </p>

            <div className="border-2 border-green-400 p-8 mb-8 max-w-2xl mx-auto bg-green-950/20">
              <h2 className="text-2xl font-bold text-green-400 mb-4">What You Discovered:</h2>
              <div className="space-y-3 text-left text-lg">
                <p>✓ Price started at $29.99 (first visit)</p>
                <p>✓ Increased to $39.99 (third visit - 10 min later)</p>
                <p className="text-red-400 font-bold">✓ 33% price increase in 10 minutes!</p>
                <p>✓ Algorithm detected "high interest" → raised price</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="border border-cyan-400 p-4 bg-cyan-950/10">
                <div className="text-3xl font-bold text-cyan-400">+500</div>
                <div className="text-sm text-gray-400">XP Earned</div>
              </div>
              <div className="border border-yellow-400 p-4 bg-yellow-950/10">
                <div className="text-3xl font-bold text-yellow-400">💻</div>
                <div className="text-sm text-gray-400">Code Rebel Badge</div>
              </div>
              <div className="border border-green-400 p-4 bg-green-950/10">
                <div className="text-3xl font-bold text-green-400">1/∞</div>
                <div className="text-sm text-gray-400">Tools Built</div>
              </div>
            </div>

            <div className="border border-cyan-400 p-6 mb-8 max-w-2xl mx-auto bg-cyan-950/10">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Next Level:</h3>
              <p className="text-gray-300">
                Build a browser extension that tracks prices in real-time.
                Monitor thousands of products. Alert users to manipulation.
                <span className="text-green-400"> Coming soon in Level 2.</span>
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-green-600 text-black font-bold text-xl hover:bg-green-500"
            >
              CONTINUE TO HQ →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
