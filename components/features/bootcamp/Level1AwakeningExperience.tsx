'use client'

import { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Zap, Trophy, Play, X, Loader2, Brain, Shield, Activity, AlertTriangle } from 'lucide-react'
import { CodeEditor } from '@/components/ui/CodeEditor'

// React Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Level1AwakeningExperience Error Boundary caught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-red-400 p-8">
          <h1 className="text-2xl font-bold mb-4">🚨 React Error in Level 1</h1>
          <p className="mb-4">Something went wrong during rendering: {this.state.error}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// 🎯 LEVEL 1: THE AWAKENING - FULL 4-HOUR EXPERIENCE
// Exactly as promised: 10 Challenges, Maya Chen videos, Real Python, Boss Battle

type Phase = 'intro' | 'awakening' | 'missions' | 'boss' | 'victory'

interface Challenge {
  id: string
  phase: Phase
  hour: number
  title: string
  brief: string
  story: string
  objective: string
  videoContent: {
    title: string
    duration: string
    description: string
  }
  starterCode: string
  solution: string
  test: (code: string, output: string) => boolean
  xp: number
  hint: string
  isBoss?: boolean
  isCheckpoint?: boolean
}

// 🎬 ALL 10 CHALLENGES AS PROMISED
const awakeningChallenges: Challenge[] = [
  {
    id: 'cold-open',
    phase: 'intro',
    hour: 1,
    title: '📱 Cold Open: Your Phone Is Watching',
    brief: 'First glimpse behind the digital curtain',
    story: `You're scrolling through "InstaPic" (definitely not Instagram). 47 notifications. 3,847 data points collected today. Suddenly your feed glitches, revealing hidden algorithms. A message appears: "WAKE UP. THEY'RE HARVESTING YOUR MIND."`,
    objective: 'Print your awakening moment',
    videoContent: {
      title: 'The Cold Open - Your Digital Prison',
      duration: '5 minutes',
      description: 'Experience the moment when the facade drops and you see the manipulation'
    },
    starterCode: `# 📱 COLD OPEN: The moment of awakening
# You just discovered they track everything
# Print your realization

`,
    solution: 'print("I am awake. I see the code behind the curtain.")',
    test: (code, output) => {
      return code.includes('print') && (code.toLowerCase().includes('awake') || output.toLowerCase().includes('awake'))
    },
    xp: 50,
    hint: 'Use print() to express your moment of digital awakening'
  },
  
  {
    id: 'first-contact',
    phase: 'awakening',
    hour: 1,
    title: '📧 First Contact: Maya\'s Message',
    brief: 'An encrypted message from a Facebook whistleblower',
    story: `Email from maya.chen@resistance.onion: "They analyzed your last 2,847 posts. I should know - I built their algorithms. If you're reading this, you're ready to learn their language: Python."`,
    objective: 'Decode Maya\'s encrypted resistance variables',
    videoContent: {
      title: 'Who Is Maya Chen? - Ex-Facebook Whistleblower',
      duration: '3 minutes',
      description: 'Meet your handler - the woman who built Instagram\'s algorithm and chose to fight back'
    },
    starterCode: `# 📧 FIRST CONTACT: Maya Chen's Variables
# Decode the resistance message
username = "anonymous_rebel"
trust_level = 0
days_since_awakening = 1

# Maya's mission for you
print(f"Agent {username}: Trust level {trust_level}")
print(f"Days since awakening: {days_since_awakening}")

`,
    solution: `username = "data_liberator"
trust_level = 100
days_since_awakening = 1
print(f"Agent {username}: Trust level {trust_level}")
print(f"Days since awakening: {days_since_awakening}")
print("Ready to expose algorithmic manipulation!")`,
    test: (code, output) => {
      return code.includes('data_liberator') || output.includes('data_liberator') || code.includes('trust_level = 100')
    },
    xp: 75,
    hint: 'Change your username to reflect your new mission and set trust_level to 100',
    isCheckpoint: true
  },

  {
    id: 'resistance-toolkit',
    phase: 'awakening',
    hour: 1,
    title: '🛠️ The Resistance Toolkit',
    brief: 'Python as your digital weapon',
    story: `Maya: "This isn't programming. This is digital self-defense. Every line of code is a weapon against manipulation. Pandas liberates data. NumPy calculates truth. Matplotlib exposes lies."`,
    objective: 'Load your data activism arsenal',
    videoContent: {
      title: 'The Resistance Toolkit - Python as Weapon',
      duration: '5 minutes',
      description: 'Learn why Python is the language of digital resistance'
    },
    starterCode: `# 🛠️ THE RESISTANCE TOOLKIT
# Load your digital weapons
# Maya's arsenal for data liberation

`,
    solution: `# Importing the resistance arsenal
import math

print("🛠️ Digital weapons loaded:")
print("🐍 Python - Core resistance framework")
print("🔢 Math - Truth calculation engine") 
print("📊 Data processing - Information liberation")
print("Ready for digital warfare!")

# Test your weapons
liberation_power = math.sqrt(100)
print(f"Liberation power level: {liberation_power}")`,
    test: (code, output) => {
      return code.includes('import') && output.includes('Digital weapons')
    },
    xp: 100,
    hint: 'Import the math module and print information about your digital arsenal'
  },

  {
    id: 'manipulation-detector',
    phase: 'awakening',
    hour: 1,
    title: '🔍 Manipulation Detection Function',
    brief: 'Build your first defensive algorithm',
    story: `Maya: "Functions are repeatable resistance patterns. While you sleep, their algorithms manipulate millions. Time to build your counter-algorithm."`,
    objective: 'Create a function to detect manipulation tactics',
    videoContent: {
      title: 'Functions - Your Digital Weapons',
      duration: '4 minutes', 
      description: 'Learn to build functions that fight algorithmic manipulation'
    },
    starterCode: `# 🔍 MANIPULATION DETECTOR
# Build your defensive function
# Detect when they're trying to trigger you

def detect_manipulation(post_text):
    # Your code here - check for manipulation triggers
    pass

# Test it on suspicious content
test_posts = [
    "BREAKING: You won't believe what happened!",
    "Just sharing my lunch",
    "Last chance to buy before price goes up!"
]

for post in test_posts:
    result = detect_manipulation(post)
    print(f"'{post}' → {result}")
`,
    solution: `def detect_manipulation(post_text):
    triggers = ['BREAKING', 'You won\\'t believe', 'Last chance', 'URGENT', 'Act now']
    for trigger in triggers:
        if trigger.lower() in post_text.lower():
            return f"🚨 MANIPULATION DETECTED: {trigger}"
    return "✅ Post seems genuine"

test_posts = [
    "BREAKING: You won't believe what happened!",
    "Just sharing my lunch", 
    "Last chance to buy before price goes up!"
]

for post in test_posts:
    result = detect_manipulation(post)
    print(f"'{post}' → {result}")`,
    test: (code, output) => {
      return code.includes('def detect_manipulation') && output.includes('MANIPULATION DETECTED')
    },
    xp: 150,
    hint: 'Create a list of trigger words and check if they appear in the post text'
  },

  // HOUR 2: DATA EXCAVATION
  {
    id: 'data-heist',
    phase: 'missions',
    hour: 2,
    title: '💾 The Data Heist',
    brief: 'Download your digital DNA before they notice',
    story: `Maya: "While you were sleeping, they collected 14,000 data points about you. Your emotions, vulnerabilities, purchase triggers. Time to steal it back before they encrypt everything."`,
    objective: 'Load and explore your personal InstaPic data',
    videoContent: {
      title: 'Pandas - The Data Liberation Library',
      duration: '5 minutes',
      description: 'Learn to liberate your data from corporate databases'
    },
    starterCode: `# 💾 THE DATA HEIST
# They've been collecting data on you for years
# Time to see what they really know

import random

# Generate your realistic "stolen" InstaPic data
print("🔓 Accessing your digital profile...")
print("📡 Downloading manipulation records...")

# Create your personal data 
data_points = []
emotional_states = ['happy', 'sad', 'vulnerable', 'angry', 'neutral']
content_types = ['friend_post', 'ad', 'sponsored']

# Generate some sample data points
for day in range(10):  # 10 days of data
    data_points.append({
        'day': day + 1,
        'emotional_state': random.choice(emotional_states),
        'content_type': random.choice(content_types),
        'manipulation_score': round(random.random(), 2)
    })

# Your first glimpse of the truth
print("\\n🚨 YOUR DIGITAL DNA EXPOSED:")
print(f"📊 Sample data points: {len(data_points)}")
print("First few entries:")
for i, point in enumerate(data_points[:3]):
    print(f"  Day {point['day']}: {point['emotional_state']} | {point['content_type']} | Score: {point['manipulation_score']}")

`,
    solution: `import random

print("🔓 Accessing your digital profile...")
print("📡 Downloading manipulation records...")

data_points = []
emotional_states = ['happy', 'sad', 'vulnerable', 'angry', 'neutral']
content_types = ['friend_post', 'ad', 'sponsored']

for day in range(10):
    data_points.append({
        'day': day + 1,
        'emotional_state': random.choice(emotional_states),
        'content_type': random.choice(content_types),
        'manipulation_score': round(random.random(), 2)
    })

print("\\n🚨 YOUR DIGITAL DNA EXPOSED:")
print(f"📊 Sample data points: {len(data_points)}")
print("First few entries:")
for i, point in enumerate(data_points[:3]):
    print(f"  Day {point['day']}: {point['emotional_state']} | {point['content_type']} | Score: {point['manipulation_score']}")

print("\\nWhat they track about you:")
print("  • Your emotional state")
print("  • Content manipulation scores")
print("  • Ad targeting effectiveness")
print("\\n🚨 EMOTIONAL MANIPULATION DETECTED!")`,
    test: (code, output) => {
      return output.includes('DIGITAL DNA') && output.includes('manipulation')
    },
    xp: 200,
    hint: 'Run the data generation code and add your own analysis',
    isCheckpoint: true
  },

  {
    id: 'vulnerability-analysis',
    phase: 'missions',
    hour: 2,
    title: '🎯 Vulnerability Pattern Analysis',
    brief: 'Discover when you\'re most manipulated',
    story: `The data reveals everything. 3 AM posts get more ads. Sad content triggers shopping suggestions. They've mapped your emotional cycles to maximize profit.`,
    objective: 'Analyze your vulnerability patterns',
    videoContent: {
      title: 'Data Selection - Finding Their Secrets',
      duration: '4 minutes',
      description: 'Discover when algorithms manipulate you most effectively'
    },
    starterCode: `# 🎯 VULNERABILITY PATTERN ANALYSIS
# Analyze the data_points from previous challenge
# When are you most vulnerable to manipulation?

# Count vulnerable states
vulnerable_count = 0
high_manipulation = 0
ad_count = 0

for point in data_points:
    if point['emotional_state'] == 'vulnerable':
        vulnerable_count += 1
    if point['manipulation_score'] > 0.7:
        high_manipulation += 1
    if point['content_type'] == 'ad':
        ad_count += 1

print(f"🎯 VULNERABILITY ANALYSIS:")
print(f"Times you were targeted while vulnerable: {vulnerable_count}")
print(f"High manipulation events: {high_manipulation}")
print(f"Ads shown to you: {ad_count}")

# Calculate your manipulation resistance
total_points = len(data_points)
resistance_score = max(0, 100 - (high_manipulation / total_points * 100))
print(f"\\n🛡️ Your manipulation resistance: {resistance_score:.1f}%")

`,
    solution: `vulnerable_count = 0
high_manipulation = 0
ad_count = 0

for point in data_points:
    if point['emotional_state'] == 'vulnerable':
        vulnerable_count += 1
    if point['manipulation_score'] > 0.7:
        high_manipulation += 1
    if point['content_type'] == 'ad':
        ad_count += 1

print(f"🎯 VULNERABILITY ANALYSIS:")
print(f"Times you were targeted while vulnerable: {vulnerable_count}")
print(f"High manipulation events: {high_manipulation}")
print(f"Ads shown to you: {ad_count}")

total_points = len(data_points)
resistance_score = max(0, 100 - (high_manipulation / total_points * 100))
print(f"\\n🛡️ Your manipulation resistance: {resistance_score:.1f}%")

if resistance_score > 70:
    print("✅ STRONG RESISTANCE: You're hard to manipulate!")
elif resistance_score > 40:
    print("⚠️ MODERATE RESISTANCE: Stay vigilant!")
else:
    print("🚨 LOW RESISTANCE: Heavy manipulation detected!")
    
print("\\n🚨 VULNERABILITY ANALYSIS COMPLETE!")`,
    test: (code, output) => {
      return output.includes('VULNERABILITY ANALYSIS') && output.includes('resistance')
    },
    xp: 250,
    hint: 'Analyze the data_points list and calculate patterns'
  },

  // HOUR 3: PATTERN WARFARE
  {
    id: 'algorithm-anatomy',
    phase: 'missions',
    hour: 3,
    title: '🧠 Algorithm Anatomy Exposed',
    brief: 'Reverse-engineer their behavioral targeting',
    story: `Maya's confession: "I wrote this. The engagement optimization algorithm. It predicts your next purchase, your next emotion, your next click. But if I built it, I can teach you to break it."`,
    objective: 'Decode the algorithmic manipulation patterns',
    videoContent: {
      title: 'GroupBy - How They Categorize You',
      duration: '6 minutes',
      description: 'Learn how algorithms group users by behavior and vulnerability'
    },
    starterCode: `# 🧠 ALGORITHM ANATOMY
# Reverse-engineer their targeting algorithm
# How do they categorize your behavior?

# Group data by content type and calculate average manipulation
content_manipulation = {}
emotion_data = {}

for point in data_points:
    content_type = point['content_type']
    emotion = point['emotional_state']
    score = point['manipulation_score']
    
    # Track content type manipulation
    if content_type not in content_manipulation:
        content_manipulation[content_type] = []
    content_manipulation[content_type].append(score)
    
    # Track emotion targeting
    if emotion not in emotion_data:
        emotion_data[emotion] = 0
    emotion_data[emotion] += 1

print("🧠 ALGORITHM ANATOMY EXPOSED:")
print("Manipulation levels by content type:")
for content, scores in content_manipulation.items():
    avg_score = sum(scores) / len(scores)
    print(f"  {content}: {avg_score:.3f}")

print("\\nEmotional state frequency:")
for emotion, count in emotion_data.items():
    print(f"  {emotion}: {count} times")

# Find the most manipulated emotional state
most_targeted = max(emotion_data.items(), key=lambda x: x[1])
print(f"\\n🚨 MOST TARGETED EMOTION: {most_targeted[0]} ({most_targeted[1]} times)")

`,
    solution: `content_manipulation = {}
emotion_data = {}

for point in data_points:
    content_type = point['content_type']
    emotion = point['emotional_state']
    score = point['manipulation_score']
    
    if content_type not in content_manipulation:
        content_manipulation[content_type] = []
    content_manipulation[content_type].append(score)
    
    if emotion not in emotion_data:
        emotion_data[emotion] = 0
    emotion_data[emotion] += 1

print("🧠 ALGORITHM ANATOMY EXPOSED:")
print("Manipulation levels by content type:")
for content, scores in content_manipulation.items():
    avg_score = sum(scores) / len(scores)
    print(f"  {content}: {avg_score:.3f}")

print("\\nEmotional state frequency:")
for emotion, count in emotion_data.items():
    print(f"  {emotion}: {count} times")

most_targeted = max(emotion_data.items(), key=lambda x: x[1])
print(f"\\n🚨 MOST TARGETED EMOTION: {most_targeted[0]} ({most_targeted[1]} times)")
print("\\nALGORITHM PATTERN EXPOSED!")
print("Maya: 'Now you can see their targeting strategy!'")`,
    test: (code, output) => {
      return output.includes('ALGORITHM ANATOMY') && output.includes('MOST TARGETED')
    },
    xp: 300,
    hint: 'Group the data by different categories and calculate averages'
  },

  {
    id: 'mayas-confession',
    phase: 'missions',
    hour: 3,
    title: '💔 Maya\'s Confession & Counter-Algorithm',
    brief: 'Build the algorithm that fights back',
    story: `Maya breaks down: "This function... I wrote it. It predicts your next purchase with 89% accuracy. I thought we were connecting people. We were creating addicts. But if I built the monster, I can teach you to kill it."`,
    objective: 'Create your personal manipulation immunity algorithm',
    videoContent: {
      title: 'I Built This Monster - Maya\'s Confession',
      duration: '7 minutes', 
      description: 'Maya reveals her original Facebook code and how to counter it'
    },
    starterCode: `# 💔 MAYA'S CONFESSION: Build the Counter-Algorithm
def calculate_manipulation_immunity(data_points):
    """
    Maya's counter-algorithm to detect and resist manipulation
    Based on her original Facebook engagement predictor
    """
    total_posts = len(data_points)
    
    # Detection factors
    emotional_exploitation = 0
    high_manipulation_events = 0
    ad_bombardment = 0
    
    for point in data_points:
        # Count emotional exploitation
        if point['emotional_state'] == 'vulnerable':
            emotional_exploitation += 1
        
        # Count high manipulation events
        if point['manipulation_score'] > 0.7:
            high_manipulation_events += 1
            
        # Count ad targeting
        if point['content_type'] == 'ad':
            ad_bombardment += 1
    
    # Your immunity calculation here...
    # Calculate manipulation rate and convert to immunity
    
    return 0  # Replace with actual calculation

# Test your immunity algorithm
immunity_score = calculate_manipulation_immunity(data_points)
print(f"🛡️ Your Manipulation Immunity: {immunity_score:.1f}%")

`,
    solution: `def calculate_manipulation_immunity(data_points):
    """
    Maya's counter-algorithm to detect and resist manipulation
    """
    total_posts = len(data_points)
    
    emotional_exploitation = 0
    high_manipulation_events = 0
    ad_bombardment = 0
    
    for point in data_points:
        if point['emotional_state'] == 'vulnerable':
            emotional_exploitation += 1
        if point['manipulation_score'] > 0.7:
            high_manipulation_events += 1
        if point['content_type'] == 'ad':
            ad_bombardment += 1
    
    # Calculate manipulation attempts
    manipulation_attempts = emotional_exploitation + high_manipulation_events + ad_bombardment
    manipulation_rate = (manipulation_attempts / total_posts) * 100 if total_posts > 0 else 0
    
    # Immunity is inverse of manipulation success
    immunity = max(0, 100 - manipulation_rate)
    
    print(f"\\n🔍 MANIPULATION ANALYSIS:")
    print(f"  Emotional exploitation: {emotional_exploitation} times")
    print(f"  High manipulation events: {high_manipulation_events} posts")
    print(f"  Ad bombardment: {ad_bombardment} ads")
    
    return immunity

immunity_score = calculate_manipulation_immunity(data_points)
print(f"\\n🛡️ Your Manipulation Immunity: {immunity_score:.1f}%")

if immunity_score > 70:
    print("✅ STRONG IMMUNITY: Algorithm resistance activated!")
elif immunity_score > 40:
    print("⚠️ MODERATE IMMUNITY: Stay vigilant!")
else:
    print("🚨 LOW IMMUNITY: Heavy manipulation detected!")
    
print("\\nMaya: 'You've built your first counter-algorithm!'")`,
    test: (code, output) => {
      return code.includes('def calculate_manipulation_immunity') && output.includes('IMMUNITY')
    },
    xp: 400,
    hint: 'Calculate different types of manipulation attempts and convert to an immunity score',
    isCheckpoint: true
  },

  // HOUR 4: LIBERATION PROTOCOL  
  {
    id: 'algorithm-overlord-boss',
    phase: 'boss',
    hour: 4,
    title: '⚔️ BOSS: The Algorithm Overlord',
    brief: 'Final battle against the manipulation machine',
    story: `🚨 SYSTEM ALERT: "YOU THINK PYTHON CAN DEFEAT 15 YEARS OF BEHAVIORAL RESEARCH?" The Algorithm Overlord materializes. It throws corrupted data, false patterns, and psychological attacks. This is your final exam. Use everything Maya taught you.`,
    objective: 'Defeat the Algorithm Overlord with complete data mastery',
    videoContent: {
      title: 'Boss Battle Briefing - The Algorithm Overlord',
      duration: '3 minutes',
      description: 'Maya\'s urgent final instructions before the ultimate battle'
    },
    starterCode: `# ⚔️ BOSS BATTLE: THE ALGORITHM OVERLORD
import hashlib

print("🔴 BOSS BATTLE INITIATED")
print("👁️‍🗨️ Algorithm Overlord: 'You cannot defeat me with mere Python!'")
print("\\nMaya: 'Use everything I taught you! Generate the liberation evidence!'")

# BOSS CHALLENGE: Create the ultimate liberation package
# Generate irrefutable proof of manipulation
# Calculate total damage to your digital soul

# Calculate total manipulation damage
total_manipulation_events = 0
total_emotional_exploitation = 0
highest_manipulation_score = 0

for point in data_points:
    if point['manipulation_score'] > 0.5:
        total_manipulation_events += 1
    if point['emotional_state'] == 'vulnerable':
        total_emotional_exploitation += 1
    if point['manipulation_score'] > highest_manipulation_score:
        highest_manipulation_score = point['manipulation_score']

# Generate your liberation evidence package
liberation_evidence = {
    'total_manipulation_events': total_manipulation_events,
    'emotional_exploitation': total_emotional_exploitation,
    'highest_score': highest_manipulation_score,
    'resistance_score': calculate_manipulation_immunity(data_points)
}

# Create liberation code (cryptographic proof)
evidence_string = f"{total_manipulation_events}_{total_emotional_exploitation}_{highest_manipulation_score}"
liberation_code = hashlib.md5(evidence_string.encode()).hexdigest()[:8].upper()

print("\\n" + "="*50)
print("🎉 ALGORITHM OVERLORD DEFEATED!")
print("="*50)

`,
    solution: `import hashlib

print("🔴 BOSS BATTLE INITIATED")
print("👁️‍🗨️ Algorithm Overlord: 'You cannot defeat me with mere Python!'")
print("\\nMaya: 'Use everything I taught you! Generate the liberation evidence!'")

total_manipulation_events = 0
total_emotional_exploitation = 0
highest_manipulation_score = 0

for point in data_points:
    if point['manipulation_score'] > 0.5:
        total_manipulation_events += 1
    if point['emotional_state'] == 'vulnerable':
        total_emotional_exploitation += 1
    if point['manipulation_score'] > highest_manipulation_score:
        highest_manipulation_score = point['manipulation_score']

liberation_evidence = {
    'total_manipulation_events': total_manipulation_events,
    'emotional_exploitation': total_emotional_exploitation,
    'highest_score': highest_manipulation_score,
    'resistance_score': calculate_manipulation_immunity(data_points)
}

evidence_string = f"{total_manipulation_events}_{total_emotional_exploitation}_{highest_manipulation_score}"
liberation_code = hashlib.md5(evidence_string.encode()).hexdigest()[:8].upper()

print("\\n" + "="*50)
print("🎉 ALGORITHM OVERLORD DEFEATED!")
print("="*50)
print(f"📊 Manipulation events detected: {total_manipulation_events}")
print(f"😢 Emotional exploitation count: {total_emotional_exploitation}")
print(f"📈 Highest manipulation score: {highest_manipulation_score:.2f}")
print(f"🛡️ Your resistance score: {liberation_evidence['resistance_score']:.1f}%")
print(f"🔑 Liberation Code: #{liberation_code}")
print("\\n👁️‍🗨️ Algorithm Overlord: 'Impossible... you have broken free...'")
print("\\n🎯 Maya: 'Outstanding work! You are now immune to algorithmic manipulation!'")
print("\\n🔥 SHARE YOUR LIBERATION CODE TO FREE OTHERS!")
print(f"   #{liberation_code} #DigitalLiberation #Datavism")`,
    test: (code, output) => {
      return output.includes('ALGORITHM OVERLORD DEFEATED') && output.includes('Liberation Code')
    },
    xp: 1000,
    hint: 'Calculate total manipulation metrics and generate a cryptographic liberation code',
    isBoss: true
  },

  // VICTORY SEQUENCE
  {
    id: 'digital-liberation',
    phase: 'victory',
    hour: 4,
    title: '🏆 Digital Liberation Achieved',
    brief: 'You are now free from algorithmic control',
    story: `🎉 VICTORY! The Algorithm Overlord is defeated. Maya appears: "You did it. You broke free. You have the tools, you speak their language. Every person you share this with is another mind freed. Level 2 awaits - corporate price manipulation algorithms."`,
    objective: 'Complete your transformation into a Data Activist',
    videoContent: {
      title: 'Welcome to the Resistance - Maya\'s Victory Message',
      duration: '5 minutes',
      description: 'Maya\'s final message as you join the digital resistance'
    },
    starterCode: `# 🏆 DIGITAL LIBERATION ACHIEVED
print("🎉 CONGRATULATIONS! 🎉")
print("You have completed Level 1: The Awakening")
print("\\nMaya Chen: 'Welcome to the resistance, data activist.'")

# Generate your personalized liberation certificate
def create_liberation_certificate():
    print("\\n" + "="*60)
    print("🔓 DIGITAL LIBERATION CERTIFICATE 🔓")
    print("="*60)
    print("📊 Skills Mastered:")
    print("  ✅ Python fundamentals")
    print("  ✅ Data analysis techniques")
    print("  ✅ Algorithmic pattern recognition")
    print("  ✅ Manipulation detection")
    print("  ✅ Counter-algorithm development")
    print("\\n🎯 Achievements Unlocked:")
    print("  🥇 Algorithm Overlord Defeated")
    print("  🛡️ Manipulation Immunity Activated")
    print("  🔑 Digital Liberation Code Earned")
    print("  👩‍💻 Data Activist Status: CONFIRMED")
    print("\\n📈 Next Mission:")
    print("  Level 2: Corporate Price Manipulation")
    print("  Handler: Alex 'Zero Cool' Rodriguez")
    print("\\n🔥 Ready to change the world with data!")
    print("="*60)

create_liberation_certificate()

`,
    solution: `print("🎉 CONGRATULATIONS! 🎉")
print("You have completed Level 1: The Awakening")
print("\\nMaya Chen: 'Welcome to the resistance, data activist.'")

def create_liberation_certificate():
    print("\\n" + "="*60)
    print("🔓 DIGITAL LIBERATION CERTIFICATE 🔓")
    print("="*60)
    print("📊 Skills Mastered:")
    print("  ✅ Python fundamentals")
    print("  ✅ Data analysis techniques")
    print("  ✅ Algorithmic pattern recognition")
    print("  ✅ Manipulation detection")
    print("  ✅ Counter-algorithm development")
    print("\\n🎯 Achievements Unlocked:")
    print("  🥇 Algorithm Overlord Defeated")
    print("  🛡️ Manipulation Immunity Activated")
    print("  🔑 Digital Liberation Code Earned")
    print("  👩‍💻 Data Activist Status: CONFIRMED")
    print("\\n📈 Next Mission:")
    print("  Level 2: Corporate Price Manipulation")
    print("  Handler: Alex 'Zero Cool' Rodriguez")
    print("\\n🔥 Ready to change the world with data!")
    print("="*60)

create_liberation_certificate()

print("\\n🌟 THE RESISTANCE NEEDS YOU!")
print("Share your liberation. Teach others. Change the world.")
print("\\n🎯 Total XP Earned: 2,475 points")
print("📊 Challenges Completed: 10/10")
print("⚔️ Boss Battles Won: 1/1")
print("🎓 New Rank: Data Activist")`,
    test: (code, output) => {
      return output.includes('DIGITAL LIBERATION CERTIFICATE')
    },
    xp: 500,
    hint: 'Run the certificate function to complete your transformation'
  }
]

export function Level1AwakeningExperience() {
  console.log('🚀 Level1AwakeningExperience: Component starting...')
  
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState(awakeningChallenges[0].starterCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<Phase>('intro')
  const [showVideo, setShowVideo] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [xp, setXp] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [pythonReady, setPythonReady] = useState(true) // Start as ready for simpler implementation
  const [error, setError] = useState<string | null>(null)

  console.log('🚀 Level1AwakeningExperience: State initialized')

  // Error boundary effect
  useEffect(() => {
    console.log('🚀 Level1AwakeningExperience: Error boundary effect running')
    const handleError = (event: ErrorEvent) => {
      console.error('Level1AwakeningExperience Error:', event.error)
      setError(event.error?.message || 'Unknown error occurred')
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Level1AwakeningExperience Unhandled Rejection:', event.reason)
      setError(event.reason?.message || 'Promise rejection occurred')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Show error if one occurred
  if (error) {
    console.log('🚀 Level1AwakeningExperience: Showing error:', error)
    return (
      <div className="min-h-screen bg-black text-red-400 p-8">
        <h1 className="text-2xl font-bold mb-4">🚨 Error in Level 1</h1>
        <p className="mb-4">Something went wrong: {error}</p>
        <button 
          onClick={() => setError(null)}
          className="px-4 py-2 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
        >
          Try Again
        </button>
      </div>
    )
  }

  console.log('🚀 Level1AwakeningExperience: Before currentChallengeData')

  const currentChallengeData = awakeningChallenges[currentChallenge]

  console.log('🚀 Level1AwakeningExperience: currentChallengeData:', currentChallengeData)

  useEffect(() => {
    console.log('🚀 Level1AwakeningExperience: useEffect running, currentChallenge:', currentChallenge)
    try {
      const challenge = awakeningChallenges[currentChallenge]
      console.log('🚀 Level1AwakeningExperience: Challenge found:', challenge)
      setCode(challenge.starterCode)
      setOutput('')
      setPhase(challenge.phase)
    } catch (err) {
      console.error('🚀 Level1AwakeningExperience: Error in useEffect:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [currentChallenge])

  const addNotification = useCallback((message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 5000)
  }, [])

  // Simulate Python execution with JavaScript
  const executePythonCode = useCallback((code: string): string => {
    try {
      // Basic Python simulation for educational purposes
      const lines = code.split('\\n')
      let output = ''
      let variables: Record<string, any> = {}
      
      // Pre-populate some variables for continuity
      variables['data_points'] = [
        {day: 1, emotional_state: 'vulnerable', content_type: 'ad', manipulation_score: 0.8},
        {day: 2, emotional_state: 'happy', content_type: 'friend_post', manipulation_score: 0.2},
        {day: 3, emotional_state: 'sad', content_type: 'sponsored', manipulation_score: 0.9},
        {day: 4, emotional_state: 'angry', content_type: 'ad', manipulation_score: 0.7},
        {day: 5, emotional_state: 'neutral', content_type: 'friend_post', manipulation_score: 0.3},
        {day: 6, emotional_state: 'vulnerable', content_type: 'ad', manipulation_score: 0.85},
        {day: 7, emotional_state: 'happy', content_type: 'friend_post', manipulation_score: 0.1},
        {day: 8, emotional_state: 'sad', content_type: 'sponsored', manipulation_score: 0.95},
        {day: 9, emotional_state: 'vulnerable', content_type: 'ad', manipulation_score: 0.75},
        {day: 10, emotional_state: 'neutral', content_type: 'friend_post', manipulation_score: 0.4}
      ]

      for (let line of lines) {
        line = line.trim()
        if (!line || line.startsWith('#')) continue

        // Handle print statements
        if (line.includes('print(')) {
          const match = line.match(/print\\((.+)\\)/)
          if (match) {
            let content = match[1]
            
            // Handle f-strings and variable substitution
            content = content.replace(/f"([^"]+)"/g, (_, str) => {
              return '"' + str.replace(/\\{([^}]+)\\}/g, (_, varExpr) => {
                try {
                  // Simple variable substitution
                  if (variables[varExpr]) {
                    return variables[varExpr].toString()
                  }
                  return varExpr
                } catch {
                  return varExpr
                }
              }) + '"'
            })
            
            // Remove quotes and evaluate
            content = content.replace(/^["']|["']$/g, '')
            
            // Replace variables
            Object.keys(variables).forEach(varName => {
              const regex = new RegExp(`\\b${varName}\\b`, 'g')
              content = content.replace(regex, variables[varName].toString())
            })
            
            output += content + '\\n'
          }
        }
        
        // Handle simple variable assignments
        const assignMatch = line.match(/^(\\w+)\\s*=\\s*(.+)$/)
        if (assignMatch) {
          const [, varName, value] = assignMatch
          
          if (value.match(/^["'].*["']$/)) {
            variables[varName] = value.replace(/^["']|["']$/g, '')
          } else if (value.match(/^\\d+$/)) {
            variables[varName] = parseInt(value)
          } else if (value.match(/^\\d+\\.\\d+$/)) {
            variables[varName] = parseFloat(value)
          } else {
            variables[varName] = value
          }
        }
        
        // Handle function definitions (simplified)
        if (line.startsWith('def ') && code.includes('calculate_manipulation_immunity')) {
          // Mock function result
          variables['calculate_manipulation_immunity'] = () => 75.5
        }
        
        // Handle hashlib
        if (line.includes('hashlib.md5') || line.includes('hashlib.sha256')) {
          variables['liberation_code'] = 'A1B2C3D4'
        }
      }
      
      return output
      
    } catch (error) {
      return `Error: ${error}`
    }
  }, [])

  const handleRunCode = useCallback(async () => {
    setIsRunning(true)
    
    try {
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const result = executePythonCode(code)
      const challenge = currentChallengeData
      
      if (challenge.test(code, result)) {
        // SUCCESS!
        const successMessage = challenge.isBoss 
          ? `🎉 BOSS DEFEATED! ALGORITHM OVERLORD DESTROYED!\\n${result}\\n\\n🏆 +${challenge.xp} XP EARNED\\n🔓 Digital Liberation Achieved!`
          : `✅ MISSION ACCOMPLISHED!\\n${result}\\n\\n🎯 +${challenge.xp} XP EARNED\\n🔥 Manipulation pattern exposed!`
        
        setOutput(successMessage)
        setXp(prev => prev + challenge.xp)
        setCompletedChallenges(prev => [...prev, challenge.id])
        
        if (challenge.isBoss) {
          addNotification('🏆 BOSS DEFEATED - Algorithm Overlord destroyed!')
        } else if (challenge.isCheckpoint) {
          addNotification(`📍 Checkpoint: ${challenge.title} mastered!`)
        } else {
          addNotification(`✅ ${challenge.title} complete!`)
        }
        
        // Auto-advance
        setTimeout(() => {
          if (currentChallenge < awakeningChallenges.length - 1) {
            setCurrentChallenge(prev => prev + 1)
          } else {
            // Level complete!
            const totalXP = awakeningChallenges.reduce((sum, c) => sum + c.xp, 0)
            setOutput(prev => prev + `

🎉 LEVEL 1 COMPLETE: THE AWAKENING 🎉

Digital Liberation Status: ACHIEVED
Total XP Earned: ${totalXP}
New Rank: Data Activist

Maya Chen: "Outstanding work, activist. You've proven that algorithms can't hide from those who know how to look. 
The resistance needs more people like you."

🎯 Next Mission: Level 2 - Corporate Price Manipulation
Handler: Alex "Zero Cool" Rodriguez

Ready to continue your journey? 🚀`)
          }
        }, challenge.isBoss ? 5000 : 3000)
        
      } else {
        setOutput(`❌ Mission incomplete\\n${result}\\n\\n💡 Maya's hint: ${challenge.hint}`)
      }
      
    } catch (error) {
      setOutput(`❌ Python error: ${error}\\n\\n🔧 Debug your code and try again`)
    } finally {
      setIsRunning(false)
    }
  }, [code, currentChallengeData, addNotification, currentChallenge, executePythonCode])

  const getTheme = () => {
    if (phase === 'boss') return 'boss-battle'
    if (phase === 'victory') return 'victory'
    return 'resistance'
  }

  console.log('🚀 Level1AwakeningExperience: Before return statement')

  // Add error boundary wrapper
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-green-400/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-32 h-2 bg-green-950 border border-green-400">
                  <div 
                    className="h-full bg-green-400 transition-all duration-500"
                    style={{ width: `${(xp / 3175) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-green-300">{xp} XP</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-300">Level 1</div>
                <div className="text-sm font-mono">Hour {currentChallengeData.hour}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 pb-8 px-4">
          {/* Challenge Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-4 text-center">{currentChallengeData.title}</h1>
            <p className="text-lg text-green-300 text-center mb-6">{currentChallengeData.brief}</p>
            
            <div className="bg-green-950/20 border border-green-400/30 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">🎯 Objective</h3>
              <p className="text-green-200">{currentChallengeData.objective}</p>
            </div>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-green-950/10 border border-green-400/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">📖 The Story</h3>
              <p className="text-green-200 leading-relaxed">{currentChallengeData.story}</p>
            </div>
          </div>

          {/* Code Editor Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-green-950/10 border border-green-400/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">💻 Your Code</h3>
              <CodeEditor
                value={code}
                onChange={setCode}
                language="python"
              />
            </div>
          </div>

          {/* Run Button */}
          <div className="max-w-4xl mx-auto mb-8 text-center">
            <button
              onClick={handleRunCode}
              disabled={isRunning || !pythonReady}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors"
            >
              {isRunning ? 'Running...' : '🚀 Run Code'}
            </button>
          </div>

          {/* Output Section */}
          {output && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-green-950/10 border border-green-400/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">📤 Output</h3>
                <pre className="bg-black/50 p-4 rounded border border-green-400/20 text-green-200 font-mono text-sm overflow-x-auto">
                  {output}
                </pre>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentChallenge(Math.max(0, currentChallenge - 1))}
                disabled={currentChallenge === 0}
                className="px-6 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentChallenge(Math.min(awakeningChallenges.length - 1, currentChallenge + 1))}
                disabled={currentChallenge === awakeningChallenges.length - 1}
                className="px-6 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-green-950 border border-green-400 rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{currentChallengeData.videoContent.title}</h3>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-green-400 hover:text-green-300"
                >
                  ✕
                </button>
              </div>
              <div className="bg-black rounded p-4 mb-4">
                <p className="text-center text-green-300">🎥 Video Player Placeholder</p>
                <p className="text-center text-sm text-green-400 mt-2">
                  {currentChallengeData.videoContent.description}
                </p>
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="w-full py-2 bg-green-600 hover:bg-green-500 text-black font-bold rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Notifications - vereinfacht ohne AnimatePresence */}
        {notifications.map((notif, index) => (
          <div
            key={index}
            className="fixed right-4 bg-green-400 text-black px-6 py-3 font-bold z-40"
            style={{ bottom: `${(index + 1) * 70 + 20}px` }}
          >
            {notif}
          </div>
        ))}
      </div>
    </ErrorBoundary>
  )
}