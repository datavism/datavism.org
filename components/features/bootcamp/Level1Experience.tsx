'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Zap, Target, AlertTriangle, Trophy } from 'lucide-react'
import { CodeEditor } from '@/components/ui/CodeEditor'
import { ProgressTracker } from './ProgressTracker'
import { HandlerMessage } from './HandlerMessage' 
import { XPTracker } from './XPTracker'
import { usePyodide } from '@/lib/hooks/usePyodide'
import { useAcademyStore } from '@/lib/store/academy.store'
import { useAcademySync } from '@/lib/hooks/useAcademySync'

// Module 1: Data Analytics with Python - 4 Hour Ultimate Experience
const module1Challenges = [
  {
    id: 'algorithm-awakening',
    title: 'Algorithm Awakening',
    brief: 'First contact with digital manipulation',
    story: `Welcome to the resistance, data activist. Your smartphone is not your friend. Today, you discover how Instagram's algorithm manipulates your mind.`,
    objective: `Print: "Data activist connected and ready to expose manipulation"`,
    videoContent: {
      title: 'Data Analytics with Python Introduction',
      duration: '2 minutes',
      description: 'Learn why Python is the weapon of choice for data activists worldwide'
    },
    starterCode: `# Welcome to the Data Resistance
# Your mission: Expose algorithmic manipulation
# Print your activation message

`,
    solution: 'print("Data activist connected and ready to expose manipulation")',
    test: (code: string) => code.includes('print') && code.toLowerCase().includes('data activist'),
    xp: 50,
    hint: 'Use print() to announce your mission'
  },
  {
    id: 'weapon-selection',
    title: 'Weapon Selection: Python Libraries',
    brief: 'Load your data analysis arsenal',
    story: `Excel spreadsheets are their weapon. Python libraries are ours. NumPy for calculations, Pandas for data manipulation, Matplotlib for exposing truth through visualization.`,
    objective: 'Import the essential data activism libraries',
    videoContent: {
      title: 'Python Libraries for Data Activism',
      duration: '7 minutes',
      description: 'Master NumPy, Pandas, and Matplotlib - your weapons against digital manipulation'
    },
    starterCode: `# Load the data activism arsenal
# Import NumPy for numerical power
# Import Pandas for data liberation
# Import Matplotlib for truth visualization

`,
    solution: 'import numpy as np\\nimport pandas as pd\\nimport matplotlib.pyplot as plt',
    test: (code: string) => code.includes('import numpy') && code.includes('import pandas') && code.includes('import matplotlib'),
    xp: 75,
    hint: 'Import numpy as np, pandas as pd, and matplotlib.pyplot as plt'
  },
  {
    id: 'data-liberation',
    title: 'Data Liberation: Instagram Export',
    brief: 'Extract your personal manipulation data',
    story: `They have collected 14,000 data points about you. Time to take it back. Load your Instagram data export and see what they really know.`,
    objective: 'Load instagram_data.csv and explore the manipulation',
    videoContent: {
      title: 'Data Slicing and Liberation Techniques',
      duration: '14 minutes',
      description: 'Learn to slice through corporate data hoarding and liberate your information'
    },
    starterCode: `import pandas as pd

# Load your Instagram data export
# File: instagram_data.csv
# Discover what they know about you

`,
    solution: 'df = pd.read_csv("instagram_data.csv")\\nprint(df.head())\\nprint(f"They have {len(df)} data points about you")',
    test: (code: string) => code.includes('read_csv') && code.includes('instagram'),
    xp: 100,
    hint: 'Use pd.read_csv() to load the data, then explore with .head()'
  },
  {
    id: 'pattern-analysis',
    title: 'Pattern Recognition: Algorithm Bias',
    brief: 'Expose the manipulation patterns',
    story: `The algorithm doesn't show you random content. It's designed to maximize engagement, often through outrage and addiction. Time to prove it with data.`,
    objective: `Calculate manipulation metrics from your data`,
    videoContent: {
      title: 'Head of Data Analysis: Finding Hidden Patterns',
      duration: '10 minutes',
      description: 'Uncover how algorithms manipulate your emotions and behavior'
    },
    starterCode: `import pandas as pd
df = pd.read_csv("instagram_data.csv")

# Calculate the manipulation metrics
# How often does the algorithm show you ads vs. friends?
# What's the emotional manipulation score?

`,
    solution: `manipulation_rate = df.groupby("content_type")["engagement_score"].mean()
print(f"Algorithm manipulation detected: {manipulation_rate.max():.1%}")
print(f"Ads vs Friends ratio: {len(df[df.content_type == 'ad']) / len(df[df.content_type == 'friend']):.2f}")`,
    test: (code: string) => code.includes('groupby') && (code.includes('content_type') || code.includes('engagement')),
    xp: 150,
    hint: 'Use groupby() to analyze content patterns'
  },
  {
    id: 'functionality-master',
    title: 'Functionality Mastery: DataFrame Power',
    brief: 'Master advanced data manipulation',
    story: `You've seen the surface. Now dive deeper. Master DataFrames to expose corporate lies, environmental crimes, and algorithmic bias at scale.`,
    objective: 'Advanced DataFrame operations for data activism',
    videoContent: {
      title: 'DataFrame Functionality for Change',
      duration: '10 minutes',
      description: 'Advanced DataFrame techniques to expose systemic manipulation'
    },
    starterCode: `import pandas as pd
import numpy as np
df = pd.read_csv("instagram_data.csv")

# Create new columns to expose manipulation
# Filter for high-manipulation content
# Calculate impact metrics

`,
    solution: `df["manipulation_score"] = df["engagement_rate"] * df["time_spent"]
high_manipulation = df[df.manipulation_score > df.manipulation_score.median()]
print(f"High manipulation content: {len(high_manipulation)} posts")
print(f"Average daily manipulation: {df.manipulation_score.sum() / df.days_active.max():.1f} points")`,
    test: (code: string) => code.includes('manipulation') && (code.includes('[') || code.includes('filter')),
    xp: 200,
    hint: 'Create new columns with df["new_column"] = calculation'
  },
  {
    id: 'boss-algorithm-overlord',
    title: 'BOSS: The Algorithm Overlord',
    brief: 'Final battle against digital manipulation',
    story: `The Algorithm Overlord has detected your investigation. "You think Python can defeat my 15 years of behavioral manipulation research?" Time for the ultimate showdown.`,
    objective: 'Defeat the Algorithm Overlord with complete data analysis',
    videoContent: {
      title: 'Final Battle: Algorithm Overlord Takedown',
      duration: '7 minutes',
      description: 'The ultimate confrontation - expose the full manipulation system'
    },
    starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# BOSS BATTLE: Full algorithm analysis
# Load multiple datasets
# Combine user data, ad data, engagement data
# Create visualization proving manipulation

instagram_data = pd.read_csv("instagram_data.csv")
ad_data = pd.read_csv("ad_targeting_data.csv")
engagement_data = pd.read_csv("engagement_patterns.csv")

# Your code here to defeat the Algorithm Overlord
`,
    solution: `merged_data = instagram_data.merge(ad_data, on="user_id").merge(engagement_data, on="user_id")
manipulation_proof = merged_data.groupby("hour_of_day")["manipulation_score"].mean()
plt.figure(figsize=(10,6))
plt.plot(manipulation_proof.index, manipulation_proof.values)
plt.title("ALGORITHM OVERLORD DEFEATED: Manipulation by Hour")
plt.xlabel("Hour of Day")
plt.ylabel("Manipulation Score")
plt.show()
print("🎉 ALGORITHM OVERLORD DEFEATED! The truth is revealed!")`,
    test: (code: string) => code.includes('merge') && code.includes('plt'),
    xp: 500,
    hint: 'Merge datasets with .merge() and create visualization with matplotlib',
    isBoss: true
  }
]

export function Level1Experience() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState(module1Challenges[0].starterCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isBossMode, setIsBossMode] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  
  const { isReady, runPython } = usePyodide()
  const { addXP, completeChallenge, userProgress } = useAcademyStore()
  const { loading: syncLoading } = useAcademySync()

  useEffect(() => {
    const challenge = module1Challenges[currentChallenge]
    setCode(challenge.starterCode)
    setOutput('')
    setIsBossMode(challenge.isBoss || false)
  }, [currentChallenge])

  const handleRunCode = async () => {
    if (!isReady) {
      setOutput('⚡ Initializing Python environment...')
      return
    }

    setIsRunning(true)
    const challenge = module1Challenges[currentChallenge]
    
    try {
      const result = await runPython(code)
      
      if (challenge.test(code)) {
        // Success!
        setOutput(`✅ SUCCESS: MISSION ACCOMPLISHED\\n${result}\\n\\n🎯 +${challenge.xp} XP EARNED\\n🔥 Manipulation exposed!`)
        
        // Update store with level 1 (bootcamp)
        await addXP(challenge.xp)
        await completeChallenge(challenge.id, 1, code, challenge.xp)
        
        // Auto-advance
        setTimeout(() => {
          if (currentChallenge < module1Challenges.length - 1) {
            setCurrentChallenge(prev => prev + 1)
          } else {
            // Level complete!
            handleLevelComplete()
          }
        }, 3000)
      } else {
        setOutput(`❌ Mission failed\\n${result}\\n\\n💡 Hint: ${challenge.hint}`)
      }
    } catch (error) {
      setOutput(`❌ System Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleLevelComplete = () => {
    setOutput(`
🎉 LEVEL 1 COMPLETE! 🎉

MODULE 1: Data Analytics with Python - MASTERED
Total XP Earned: ${module1Challenges.reduce((sum, c) => sum + c.xp, 0)}

Handler: "Outstanding work, data activist. You've proven algorithms can't hide from Python.
You're ready for Level 2: Advanced Data Visualization."

[Returning to Bootcamp Hub...]
    `)
    
    setTimeout(() => {
      window.location.href = '/bootcamp'
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      {/* CRT Effect Overlay */}
      <div className="crt-overlay" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Mission Brief */}
        <div className="lg:col-span-3">
          <MissionBrief 
            level={1}
            title="LEVEL 1: DIGITAL DETOX"
            module="Module 1 - Data Analytics with Python"
            handler={{
              name: 'Maya Chen',
              avatar: '👩‍💻',
              bio: 'Former Facebook Whistleblower'
            }}
          />
          
          <ProgressTracker 
            challenges={module1Challenges}
            currentChallenge={currentChallenge}
            completedChallenges={userProgress.completedChallenges}
          />
        </div>

        {/* Center Panel - Main Content */}
        <div className={`lg:col-span-6 ${isBossMode ? 'boss-battle-mode' : ''}`}>
          <ChallengeCard
            challenge={module1Challenges[currentChallenge]}
            challengeNumber={currentChallenge + 1}
            totalChallenges={module1Challenges.length}
            onShowVideo={() => setShowVideo(true)}
          />

          <CodeEditor
            value={code}
            onChange={setCode}
            language="python"
            height="300px"
          />

          <ControlPanel
            onRun={handleRunCode}
            onHint={() => alert(module1Challenges[currentChallenge].hint)}
            onSolution={() => setCode(code + '\\n' + module1Challenges[currentChallenge].solution)}
            onShowVideo={() => setShowVideo(true)}
            isRunning={isRunning}
          />

          <OutputTerminal output={output} ready={isReady} loading={syncLoading} />
        </div>

        {/* Right Panel - Stats */}
        <div className="lg:col-span-3">
          <XPTracker />
          <HandlerMessage
            message={getHandlerMessage(currentChallenge)}
            handler="Maya Chen"
            avatar="👩‍💻"
          />
          <ModuleProgress 
            currentChallenge={currentChallenge}
            totalChallenges={module1Challenges.length}
          />
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <VideoModal
          video={module1Challenges[currentChallenge].videoContent}
          onClose={() => setShowVideo(false)}
        />
      )}
    </div>
  )
}

// Sub-components

function MissionBrief({ level, title, module, handler }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border border-green-400 p-4 mb-4 bg-black/80"
    >
      <h2 className="text-red-400 text-xl font-bold mb-2 glitch-text">{title}</h2>
      <p className="text-yellow-400 text-sm mb-2">{module}</p>
      <p className="text-cyan-400 text-xs mb-4">🎯 4-Hour Ultimate Experience</p>
      
      <div className="border-t border-green-400/30 pt-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{handler.avatar}</div>
          <h3 className="text-cyan-400 font-bold">{handler.name}</h3>
          <p className="text-xs text-green-300 mt-1">{handler.bio}</p>
        </div>
      </div>
    </motion.div>
  )
}

function ChallengeCard({ challenge, challengeNumber, totalChallenges, onShowVideo }: any) {
  return (
    <motion.div
      key={challenge.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-green-400 p-6 mb-6 bg-black/90"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-cyan-400 text-sm">
          CHALLENGE {challengeNumber} OF {totalChallenges}
        </div>
        <button
          onClick={onShowVideo}
          className="px-3 py-1 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all text-xs"
        >
          📹 WATCH VIDEO ({challenge.videoContent.duration})
        </button>
      </div>
      
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        {challenge.title}
      </h2>
      
      <div className="bg-cyan-950/20 border-l-4 border-cyan-400 p-4 mb-4">
        <p className="italic text-cyan-300">{challenge.story}</p>
      </div>
      
      <div className="border border-yellow-400 p-4 bg-yellow-950/10">
        <h3 className="text-yellow-400 font-bold mb-2">🎯 MISSION OBJECTIVE</h3>
        <p className="font-mono">{challenge.objective}</p>
      </div>
    </motion.div>
  )
}

function ControlPanel({ onRun, onHint, onSolution, onShowVideo, isRunning }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <button
        onClick={onRun}
        disabled={isRunning}
        className="px-4 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all font-bold disabled:opacity-50"
      >
        {isRunning ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
            RUNNING...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Terminal size={16} />
            RUN
          </span>
        )}
      </button>
      
      <button
        onClick={onShowVideo}
        className="px-4 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all font-bold"
      >
        📹 VIDEO
      </button>
      
      <button
        onClick={onHint}
        className="px-4 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-bold"
      >
        💡 HINT
      </button>
      
      <button
        onClick={onSolution}
        className="px-4 py-3 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all font-bold"
      >
        🔓 SOLUTION
      </button>
    </div>
  )
}

function OutputTerminal({ output, ready, loading }: { output: string, ready: boolean, loading?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-green-400 p-4 bg-black font-mono text-sm min-h-[150px]"
    >
      <div className="text-green-300">
        {loading ? '🔄 Syncing with database...' : !ready ? '⚡ Loading Python environment...' : output || '> Waiting for your first data activism mission...'}
      </div>
    </motion.div>
  )
}

function ModuleProgress({ currentChallenge, totalChallenges }: any) {
  const progress = ((currentChallenge + 1) / totalChallenges) * 100
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border border-green-400 p-4 bg-green-950/10 mb-4"
    >
      <h3 className="text-green-400 font-bold mb-3">MODULE 1 PROGRESS</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>📹 7 Videos</span>
          <span className="text-yellow-400">60 min total</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>📖 2 Readings</span>
          <span className="text-cyan-400">20 min total</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>⚡ 6 Challenges</span>
          <span className="text-green-400">{currentChallenge + 1}/{totalChallenges}</span>
        </div>
        
        <div className="w-full h-2 bg-black border border-green-400">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-green-400"
          />
        </div>
        
        <div className="text-center text-sm text-green-400">
          {Math.round(progress)}% Complete
        </div>
      </div>
    </motion.div>
  )
}

function VideoModal({ video, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black border-2 border-purple-400 max-w-4xl w-full"
      >
        <div className="flex items-center justify-between p-4 border-b border-purple-400/30">
          <h2 className="text-xl font-bold text-purple-400">{video.title}</h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-red-400 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 text-center">
          <div className="bg-purple-950/20 border border-purple-400/30 p-12 mb-4">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-2xl font-bold text-purple-400 mb-2">{video.title}</h3>
            <p className="text-purple-300 mb-4">{video.description}</p>
            <div className="text-yellow-400 font-mono text-lg">Duration: {video.duration}</div>
          </div>
          
          <p className="text-green-300 text-sm mb-6">
            🎬 In the full version, this will be an interactive video with hands-on coding exercises, 
            real Instagram data analysis, and live examples of algorithmic manipulation.
          </p>
          
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all font-bold"
          >
            CONTINUE MISSION
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Helper functions
function getHandlerMessage(challengeIndex: number) {
  const messages = [
    "Welcome to the data resistance. Let's expose their manipulation.",
    "Good. Python libraries loaded. Corporate algorithms don't stand a chance.",
    "Your personal data revealed. This is bigger than we thought.",
    "Pattern recognition activated. Algorithm bias confirmed.",
    "DataFrame mastery achieved. You're becoming unstoppable.",
    "FINAL BATTLE! The Algorithm Overlord has been exposed!"
  ]
  return messages[challengeIndex] || "Keep fighting, data activist."
}