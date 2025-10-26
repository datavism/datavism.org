'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Zap, Trophy, Brain, Loader2, Wifi, WifiOff, ChevronRight, Eye, Lock, CheckCircle } from 'lucide-react'
import { CodeEditor } from '@/components/ui/CodeEditor'
import { usePython, RESISTANCE_SNIPPETS } from '@/lib/hooks/usePython'

interface Challenge {
  id: string
  title: string
  story: string
  objective: string
  starterCode: string
  solution: string
  hint: string
  xp: number
  checkAnswer: (output: string) => boolean
}

const challenges: Challenge[] = [
  {
    id: 'awakening',
    title: '📱 The Awakening',
    story: `You're scrolling through social media. 47 notifications. Suddenly the feed glitches.
    
"WAKE UP. THEY'RE HARVESTING YOUR MIND."

Your first act of resistance: Print your awakening message.`,
    objective: 'Print a message showing you are awake',
    starterCode: `# Your first line of resistance code
print("...")  # Replace ... with your message
`,
    solution: `# Your first line of resistance code
print("I am awake. I see the code behind the curtain.")`,
    hint: 'Use print() to declare your awakening - any message with "awake" works!',
    xp: 100,
    checkAnswer: (output) => output.length > 0 && output.toLowerCase().includes('awake')
  },
  {
    id: 'maya-contact',
    title: '📧 Contact from Maya Chen',
    story: `Email from maya.chen@resistance.onion:

"I built MetaFace's algorithms. Now I'll teach you to break them.
Variables are containers for truth. Create your new identity."`,
    objective: 'Create variables for your resistance identity',
    starterCode: `# Define your resistance identity
old_identity = "user_4847392"
new_identity = "..."  # Your resistance name
resistance_level = 0  # Set your resistance level (0-100)

print(f"Old: {old_identity}")
print(f"New: {new_identity}")
print(f"Resistance: {resistance_level}%")
`,
    solution: `# Define your resistance identity
old_identity = "user_4847392"
new_identity = "data_liberator"
resistance_level = 100

print(f"Old: {old_identity}")
print(f"New: {new_identity}")
print(f"Resistance: {resistance_level}%")`,
    hint: 'Set new_identity to any resistance name and resistance_level to 100',
    xp: 150,
    checkAnswer: (output) => output.includes('New:') && output.includes('100')
  },
  {
    id: 'manipulation-detector',
    title: '🔍 Build Manipulation Detector',
    story: `Maya: "They use trigger words to hijack your brain. 
Build a function that detects their manipulation tactics."`,
    objective: 'Create a function to detect manipulation',
    starterCode: `# Detect manipulation in posts
def detect_manipulation(text):
    triggers = ['BREAKING', 'URGENT', 'Last chance']
    # TODO: Check if any trigger is in text
    # Return "Manipulation!" if found, "Clean" if not
    return "..."

# Test it
print(detect_manipulation("BREAKING NEWS"))
print(detect_manipulation("Just a normal post"))
`,
    solution: `# Detect manipulation in posts
def detect_manipulation(text):
    triggers = ['BREAKING', 'URGENT', 'Last chance']
    for trigger in triggers:
        if trigger.lower() in text.lower():
            return "Manipulation!"
    return "Clean"

# Test it
print(detect_manipulation("BREAKING NEWS"))
print(detect_manipulation("Just a normal post"))`,
    hint: 'Loop through triggers and check if each one is in text.lower()',
    xp: 200,
    checkAnswer: (output) => output.includes('Manipulation') || output.includes('Clean')
  },
  {
    id: 'digital-footprint',
    title: '💾 Calculate Your Digital Footprint',
    story: `Maya: "Let's calculate how much of your life they've stolen.
Use the resistance toolkit I've given you."`,
    objective: 'Calculate your digital footprint',
    starterCode: `# Calculate your digital footprint
posts_per_day = 12
years_on_platform = 5

# Use the resistance toolkit
footprint = resistance.calculate_digital_footprint(posts_per_day, years_on_platform)

print(f"Total posts: {footprint['total_posts']}")
print(f"Data points: {footprint['data_points']}")
days = round(footprint['days_lost'], 1)
print(f"Days lost: {days}")
`,
    solution: `# Calculate your digital footprint
posts_per_day = 12
years_on_platform = 5

# Use the resistance toolkit
footprint = resistance.calculate_digital_footprint(posts_per_day, years_on_platform)

print(f"Total posts: {footprint['total_posts']}")
print(f"Data points: {footprint['data_points']}")
days = round(footprint['days_lost'], 1)
print(f"Days lost: {days}")
value = round(footprint['value_extracted'], 2)
print(f"Value extracted: {value}")
`,
    hint: 'The resistance toolkit is pre-loaded - just run the code!',
    xp: 250,
    checkAnswer: (output) => output.includes('Total posts') && output.includes('21900')
  },
  {
    id: 'data-analysis',
    title: '📊 Analyze Manipulation Patterns',
    story: `Maya sends leaked data. "Look at the patterns. See when they strike."`,
    objective: 'Analyze the sample data',
    starterCode: `# Analyze manipulation patterns
import pandas as pd

df = pd.DataFrame(sample_data)
print(f"Records: {len(df)}")

# Find vulnerable moments
vulnerable = df[df['emotional_state'] == 'vulnerable']
print(f"Vulnerable moments: {len(vulnerable)}")

# Average manipulation score
avg_score = df['manipulation_score'].mean()
percent = round(avg_score * 100, 2)
print(f"Avg manipulation: {percent}%")
`,
    solution: `# Analyze manipulation patterns
import pandas as pd

df = pd.DataFrame(sample_data)
print(f"Records: {len(df)}")

# Find vulnerable moments
vulnerable = df[df['emotional_state'] == 'vulnerable']
print(f"Vulnerable moments: {len(vulnerable)}")

# Average manipulation score
avg_score = df['manipulation_score'].mean()
percent = round(avg_score * 100, 2)
print(f"Avg manipulation: {percent}%")

# Find peak manipulation hour
df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
peak_hour = df.groupby('hour')['manipulation_score'].mean().idxmax()
print(f"Peak manipulation: {peak_hour}:00")`,
    hint: 'Use pandas DataFrame methods to analyze the data',
    xp: 300,
    checkAnswer: (output) => output.includes('vulnerable') && output.includes('%')
  },
  {
    id: 'liberation-code',
    title: '🔓 Generate Liberation Code',
    story: `Final challenge: Generate your unique liberation code.
This proves you've broken free from algorithmic control.`,
    objective: 'Generate your liberation code',
    starterCode: `# Generate your liberation code
evidence = {
    'awakened': True,
    'resistance_level': 100,
    'algorithms_defeated': 1
}

# Generate unique liberation hash
liberation_code = resistance.generate_liberation_code(evidence)

print("="*50)
print("🔓 DIGITAL LIBERATION ACHIEVED")
print("="*50)
print(f"Liberation Code: #{liberation_code}")
print("Share this code to free others!")
`,
    solution: `# Generate your liberation code
evidence = {
    'awakened': True,
    'resistance_level': 100,
    'algorithms_defeated': 1,
    'maya_trained': True
}

# Generate unique liberation hash
liberation_code = resistance.generate_liberation_code(evidence)

print("="*50)
print("🔓 DIGITAL LIBERATION ACHIEVED")
print("="*50)
print(f"Liberation Code: #{liberation_code}")
print("Share this code to free others!")
print(f"Total journey: 6 challenges completed")
print("Welcome to the resistance!")`,
    hint: 'The resistance toolkit will generate your unique code',
    xp: 500,
    checkAnswer: (output) => output.includes('LIBERATION') && output.includes('#')
  }
]

interface Level1Props {
  onComplete?: (finalXp: number) => void
}

export function Level1AwakeningExperience({ onComplete }: Level1Props = {}) {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState(challenges[0].starterCode)
  const [output, setOutput] = useState('')
  const [totalXp, setTotalXp] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [showingSolution, setShowingSolution] = useState(false)
  const [challengeStatus, setChallengeStatus] = useState<'pending' | 'completed' | 'solved-with-help'>('pending')

  const { isReady, isLoading, loadingStatus, loadingProgress, execute} = usePython()
  
  const challenge = challenges[currentChallenge]

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('datavism_level1_progress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setCompletedChallenges(progress.completedChallenges || [])
      setTotalXp(progress.totalXp || 0)
      setCurrentChallenge(progress.currentChallenge || 0)
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    const progress = {
      completedChallenges,
      totalXp,
      currentChallenge,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('datavism_level1_progress', JSON.stringify(progress))
  }, [completedChallenges, totalXp, currentChallenge])

  useEffect(() => {
    setCode(challenge.starterCode)
    setOutput('')
    setShowingSolution(false)
    
    // Check if this challenge was already completed
    if (completedChallenges.includes(challenge.id)) {
      setChallengeStatus('completed')
    } else {
      setChallengeStatus('pending')
    }
  }, [currentChallenge, challenge.starterCode, challenge.id, completedChallenges])

  const handleRunCode = async () => {
    if (!isReady) return
    
    const result = await execute(code)
    const outputText = result.error || result.output
    setOutput(outputText)
    
    // Check if challenge is complete
    if (!result.error && challenge.checkAnswer(outputText)) {
      // Calculate XP based on whether solution was shown
      const earnedXp = showingSolution ? Math.floor(challenge.xp * 0.5) : challenge.xp
      
      if (!completedChallenges.includes(challenge.id)) {
        setTotalXp(prev => prev + earnedXp)
        setCompletedChallenges(prev => [...prev, challenge.id])
        setChallengeStatus(showingSolution ? 'solved-with-help' : 'completed')
      }
    }
  }

  const handleShowSolution = () => {
    setShowingSolution(true)
    setCode(challenge.solution)
    setOutput('💡 Solution loaded. You´ll receive 50% XP if you complete with help.')
  }

  const handleNextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1)
    } else {
      // Last challenge complete - trigger onComplete callback
      if (onComplete) {
        onComplete(totalXp)
      }
    }
  }

  const handlePreviousChallenge = () => {
    if (currentChallenge > 0) {
      setCurrentChallenge(prev => prev - 1)
    }
  }

  const canGoNext = completedChallenges.includes(challenge.id) || currentChallenge === 0

  const resetProgress = () => {
    if (confirm('Reset all progress? This cannot be undone!')) {
      localStorage.removeItem('datavism_level1_progress')
      setCompletedChallenges([])
      setTotalXp(0)
      setCurrentChallenge(0)
      setChallengeStatus('pending')
    }
  }

  const progress = ((completedChallenges.length) / challenges.length) * 100

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-green-400 mx-auto mb-4" />
            <div className="text-xl font-bold text-green-400 mb-2">{loadingStatus}</div>
            <div className="w-64 h-2 bg-green-950 border border-green-400">
              <div 
                className="h-full bg-green-400 transition-all"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-green-400/30 bg-black/80 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="text-green-400" />
              <h1 className="text-xl font-bold">LEVEL 1: THE AWAKENING</h1>
            </div>
            <div className="flex items-center gap-4">
              {isReady ? (
                <><Wifi className="text-green-400" size={20} /> <span className="text-sm">Python Ready</span></>
              ) : (
                <><WifiOff className="text-red-400" size={20} /> <span className="text-sm">Loading...</span></>
              )}
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-400" />
                <span className="text-yellow-400 font-bold">{totalXp} XP</span>
              </div>
              <button
                onClick={resetProgress}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-400 hover:bg-red-400 hover:text-black"
              >
                Reset
              </button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full h-1 bg-green-950">
              <div 
                className="h-full bg-green-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-green-300 mt-1">
              {completedChallenges.length}/{challenges.length} Challenges Complete
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Challenge Info */}
          <motion.div
            key={currentChallenge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">{challenge.title}</h2>
              {challengeStatus === 'completed' && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={24} />
                  <span>Completed</span>
                </div>
              )}
              {challengeStatus === 'solved-with-help' && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <CheckCircle size={24} />
                  <span>Completed with help</span>
                </div>
              )}
            </div>
            
            <div className="bg-green-950/20 border border-green-400/30 p-6 rounded mb-6">
              <p className="text-green-200 whitespace-pre-line mb-4">{challenge.story}</p>
              <div className="border-t border-green-400/30 pt-4">
                <p className="text-yellow-400 font-bold">🎯 Objective: {challenge.objective}</p>
                <p className="text-cyan-400 text-sm mt-2">
                  💰 Reward: {challenge.xp} XP 
                  {showingSolution && <span className="text-yellow-400"> (50% with solution)</span>}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Code Editor */}
          <div className="mb-6">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="python"
              height="300px"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={handleRunCode}
              disabled={!isReady}
              className={`px-8 py-3 font-bold text-lg transition-all ${
                isReady 
                  ? 'bg-green-400 text-black hover:bg-green-300' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isReady ? '🚀 RUN CODE' : '⏳ Loading Python...'}
            </button>
            
            {!completedChallenges.includes(challenge.id) && (
              <button
                onClick={handleShowSolution}
                className="px-6 py-3 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold transition-all"
              >
                <Eye className="inline mr-2" size={20} />
                Show Solution (-50% XP)
              </button>
            )}
          </div>

          {/* Output */}
          {output && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <div className="bg-black border-2 border-green-400 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-mono text-green-400">OUTPUT</span>
                  {completedChallenges.includes(challenge.id) && (
                    <span className="text-yellow-400">✅ Complete!</span>
                  )}
                </div>
                <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </motion.div>
          )}

          {/* Hint */}
          <div className="text-center mb-8">
            <details className="inline-block">
              <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
                💡 Need a hint?
              </summary>
              <p className="mt-2 text-green-300 bg-green-950/20 p-3 rounded">
                {challenge.hint}
              </p>
            </details>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousChallenge}
              disabled={currentChallenge === 0}
              className="px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <div className="flex gap-2">
              {challenges.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => completedChallenges.includes(challenges[idx].id) || idx === 0 ? setCurrentChallenge(idx) : null}
                  className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                    completedChallenges.includes(c.id)
                      ? 'bg-green-400'
                      : idx === currentChallenge
                      ? 'bg-yellow-400 animate-pulse'
                      : 'bg-green-950 border border-green-400'
                  }`}
                  title={c.title}
                >
                  {completedChallenges.includes(c.id) && '✓'}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextChallenge}
              disabled={!canGoNext || currentChallenge === challenges.length - 1}
              className={`px-4 py-2 border font-bold transition-all ${
                canGoNext && currentChallenge < challenges.length - 1
                  ? 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                  : 'border-gray-600 text-gray-600 cursor-not-allowed'
              }`}
            >
              {!canGoNext && (
                <Lock className="inline mr-2" size={16} />
              )}
              Next →
            </button>
          </div>

          {/* Challenge Status Info */}
          {!completedChallenges.includes(challenge.id) && currentChallenge > 0 && (
            <div className="mt-4 text-center text-yellow-400 text-sm">
              ⚠️ Complete this challenge to unlock the next one
            </div>
          )}

          {/* Completion Message */}
          {completedChallenges.length === challenges.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-green-950/30 border-2 border-green-400 rounded text-center"
            >
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                🎉 LEVEL COMPLETE!
              </h3>
              <p className="text-green-300 mb-4">
                Total XP Earned: {totalXp} / {challenges.reduce((sum, c) => sum + c.xp, 0)} possible
              </p>
              <p className="text-green-200 mb-4">
                You've broken free from algorithmic control!
              </p>
              <button
                onClick={() => window.location.href = '/bootcamp'}
                className="px-6 py-3 bg-green-400 text-black font-bold hover:bg-green-300"
              >
                Continue to Level 2 →
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}