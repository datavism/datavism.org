'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Brain, TrendingUp, AlertTriangle } from 'lucide-react'
import { CodeEditor } from '@/components/ui/CodeEditor'
import { usePython } from '@/lib/hooks/usePython'
import Confetti from 'react-confetti'
import { useResistance } from '@/lib/store/useResistance'
import { useRouter } from 'next/navigation'

export function FirstMissionWarrior() {
  const [phase, setPhase] = useState<'briefing' | 'analysis' | 'success'>('briefing')
  const [code, setCode] = useState(`# Maya's leaked dataset
import pandas as pd

# Sample of manipulation scores
data = {
    'hour': [2, 14, 22, 3, 15, 23],
    'post_count': [147, 89, 203, 156, 92, 198],
    'manipulation_score': [8.2, 3.1, 9.4, 7.9, 3.3, 9.1]
}

df = pd.DataFrame(data)

# TODO: Find the pattern
# When are manipulation scores highest?
# Hint: Use df.groupby() or df.sort_values()

print(df)
`)
  const [output, setOutput] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const { isReady, execute } = usePython()
  const { completeMission, profile } = useResistance()
  const router = useRouter()

  const checkSolution = (output: string) => {
    // Check if they found the pattern (late night manipulation)
    return output.includes('22') || output.includes('23') ||
           output.toLowerCase().includes('night') ||
           output.includes('9.')
  }

  const handleRun = async () => {
    const result = await execute(code)
    const outputText = result.output || result.error || ''
    setOutput(outputText)

    if (checkSolution(outputText)) {
      setShowConfetti(true)
      setTimeout(() => {
        setPhase('success')
        completeMission('first-warrior', 500)
      }, 3000)
    }
  }

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {phase === 'briefing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Maya's Briefing */}
            <div className="border-2 border-green-400 p-8 mb-8 bg-green-950/20">
              <div className="flex items-center gap-4 mb-6">
                <Terminal className="w-12 h-12 text-green-400" />
                <div>
                  <h2 className="text-2xl font-bold">Mission Briefing</h2>
                  <p className="text-gray-400">From: Maya Chen</p>
                </div>
              </div>

              <div className="space-y-4 text-lg">
                <p className="text-yellow-400 font-bold">
                  Welcome to your first mission, {profile?.name}.
                </p>
                <p>
                  I've leaked a dataset from MetaFace's manipulation engine.
                  It shows when they deploy the most aggressive tactics.
                </p>
                <p className="text-red-400">
                  People are most vulnerable late at night. Lonely. Tired. Weak.
                </p>
                <p>
                  That's when they strike hardest with URGENT and BREAKING posts.
                </p>
                <p className="text-green-400">
                  Your mission: <strong>Prove it with data.</strong>
                </p>
              </div>
            </div>

            {/* The Challenge */}
            <div className="border border-cyan-400 p-6 mb-6 bg-cyan-950/10">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Data Warrior Challenge
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>📊 <strong>Objective:</strong> Find when manipulation scores are highest</p>
                <p>🐍 <strong>Tools:</strong> Python + Pandas</p>
                <p>💡 <strong>Hint:</strong> Look at the late night hours (22:00, 23:00)</p>
                <p>🎯 <strong>Reward:</strong> 500 XP + Data Warrior Badge</p>
              </div>
            </div>

            {/* Code Editor */}
            <CodeEditor
              value={code}
              onChange={setCode}
              language="python"
              height="400px"
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleRun}
                disabled={!isReady}
                className="flex-1 px-8 py-4 bg-green-600 text-black font-bold text-xl hover:bg-green-500 disabled:opacity-50"
              >
                {isReady ? '🚀 ANALYZE DATA' : '⏳ Loading...'}
              </button>
            </div>

            {/* Output */}
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 border-2 border-green-400 p-4 bg-black"
              >
                <div className="text-sm text-green-400 mb-2">OUTPUT:</div>
                <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                  {output}
                </pre>
              </motion.div>
            )}

            {/* Guidance */}
            <details className="mt-6 border border-yellow-400 p-4">
              <summary className="cursor-pointer text-yellow-400 font-bold">
                💡 Need Help?
              </summary>
              <div className="mt-4 space-y-2 text-gray-300">
                <p><strong>Try these approaches:</strong></p>
                <code className="block bg-black p-2 text-green-400">
                  df.sort_values('manipulation_score', ascending=False)
                </code>
                <p className="text-sm">This will show rows with highest manipulation first</p>
                <code className="block bg-black p-2 text-green-400 mt-2">
                  high_manip = df[df['manipulation_score'] &gt; 7]<br/>
                  print(high_manip)
                </code>
                <p className="text-sm">This filters for manipulation scores above 7</p>
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
            <div className="text-8xl mb-6">🏆</div>
            <h1 className="text-5xl font-bold text-green-400 mb-4">
              MISSION COMPLETE
            </h1>
            <p className="text-2xl text-yellow-400 mb-8">
              You've exposed the pattern, Data Warrior.
            </p>

            <div className="border-2 border-green-400 p-8 mb-8 max-w-2xl mx-auto bg-green-950/20">
              <h2 className="text-2xl font-bold text-green-400 mb-4">What You Discovered:</h2>
              <div className="space-y-3 text-left text-lg">
                <p>✓ Manipulation peaks between 22:00-23:00 (late night)</p>
                <p>✓ Scores reach 9.1-9.4 during vulnerable hours</p>
                <p>✓ Post volume also increases (198-203 posts)</p>
                <p className="text-red-400 font-bold">
                  ✓ They target people when they're tired and emotional
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="border border-cyan-400 p-4 bg-cyan-950/10">
                <div className="text-3xl font-bold text-cyan-400">+500</div>
                <div className="text-sm text-gray-400">XP Earned</div>
              </div>
              <div className="border border-yellow-400 p-4 bg-yellow-950/10">
                <div className="text-3xl font-bold text-yellow-400">📊</div>
                <div className="text-sm text-gray-400">Data Warrior Badge</div>
              </div>
              <div className="border border-green-400 p-4 bg-green-950/10">
                <div className="text-3xl font-bold text-green-400">1/∞</div>
                <div className="text-sm text-gray-400">Missions Complete</div>
              </div>
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
