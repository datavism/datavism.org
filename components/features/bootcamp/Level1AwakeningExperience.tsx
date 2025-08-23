'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Terminal, Zap, Trophy, Brain, Shield, Activity, 
  AlertTriangle, Loader2, WifiOff, Wifi, Code,
  Eye, EyeOff, Lock, Unlock, Skull, ChevronRight
} from 'lucide-react'
import { CodeEditor } from '@/components/ui/CodeEditor'
import { usePython, RESISTANCE_SNIPPETS } from '@/lib/hooks/usePython'

// 🎯 LEVEL 1: THE AWAKENING - REVOLUTION EDITION
// Real Python. Real hacking. Real impact.

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
  test: (output: string, variables: Record<string, any>) => boolean
  xp: number
  hint: string
  isBoss?: boolean
  isCheckpoint?: boolean
}

// 🎬 ENHANCED CHALLENGES WITH REAL PYTHON
const awakeningChallenges: Challenge[] = [
  {
    id: 'cold-open',
    phase: 'intro',
    hour: 1,
    title: '📱 Cold Open: Your Phone Is Watching',
    brief: 'First glimpse behind the digital curtain',
    story: `You're scrolling through InstaPic. 47 notifications. 3,847 data points collected. 
    
    Suddenly your feed glitches. The algorithm reveals itself for a moment.
    
    A message appears: "WAKE UP. THEY'RE HARVESTING YOUR MIND."
    
    Your journey to digital liberation begins with a single line of Python...`,
    objective: 'Print your awakening moment to begin the resistance',
    videoContent: {
      title: 'The Cold Open - Your Digital Prison',
      duration: '5 minutes',
      description: 'Experience the moment when the facade drops'
    },
    starterCode: `# 📱 THE AWAKENING BEGINS
# You just discovered they track everything
# Your first act of digital resistance starts here

print("...")  # Replace ... with your awakening message
`,
    solution: `print("I am awake. I see the code behind the curtain.")`,
    test: (output) => {
      return output.toLowerCase().includes('awake') || 
             output.toLowerCase().includes('see') ||
             output.toLowerCase().includes('resistance')
    },
    xp: 50,
    hint: 'Express your realization that you can see through their manipulation'
  },
  
  {
    id: 'first-contact',
    phase: 'awakening',
    hour: 1,
    title: '📧 First Contact: Maya Chen',
    brief: 'Message from an ex-Facebook whistleblower',
    story: `Email from maya.chen@resistance.onion:
    
    "If you're reading this, you're ready to know the truth.
    
    I spent 3 years at Facebook building the algorithms that trap your mind.
    The engagement optimizer. The dopamine trigger. The vulnerability detector.
    
    I know their code because I wrote it.
    Now I'll teach you to break it.
    
    First lesson: Variables are containers for truth."`,
    objective: 'Create variables that define your new identity as a data activist',
    videoContent: {
      title: 'Who Is Maya Chen?',
      duration: '3 minutes',
      description: 'Meet the woman who built Instagram\'s algorithm'
    },
    starterCode: `# 📧 MAYA'S FIRST LESSON: Variables are truth containers
# Define your resistance identity

# Your old identity (what they see)
old_identity = "user_4847392"
trust_score = 0

# TODO: Create your new identity variables
# Hint: Change who you are, not just your name

print(f"Old identity: {old_identity}")
print(f"Trust in the system: {trust_score}%")

# Print your new identity below
`,
    solution: `old_identity = "user_4847392"
trust_score = 0

# My true identity
new_identity = "data_liberator"
resistance_level = 100
days_since_awakening = 1

print(f"Old identity: {old_identity}")
print(f"Trust in the system: {trust_score}%")
print(f"New identity: {new_identity}")
print(f"Resistance level: {resistance_level}%")
print(f"Days since awakening: {days_since_awakening}")`,
    test: (output, vars) => {
      return output.includes('data_liberator') || 
             output.includes('resistance') ||
             (vars['resistance_level'] && vars['resistance_level'] > 50)
    },
    xp: 75,
    hint: 'Create variables like new_identity, resistance_level to show your transformation',
    isCheckpoint: true
  },

  {
    id: 'manipulation-detector',
    phase: 'awakening',
    hour: 1,
    title: '🔍 Build Your First Defense Algorithm',
    brief: 'Create a function to detect manipulation',
    story: `Maya: "Every 'Breaking News' is calculated. Every 'Last Chance' is a lie.
    
    They use trigger words to hijack your amygdala before your prefrontal cortex can think.
    
    Functions are repeatable patterns of resistance. Build one that detects their tactics."`,
    objective: 'Create a manipulation detection function',
    videoContent: {
      title: 'Functions - Digital Self-Defense',
      duration: '4 minutes',
      description: 'Build algorithms that fight algorithms'
    },
    starterCode: `# 🔍 MANIPULATION DETECTOR
# Build a function to identify psychological triggers

def detect_manipulation(post_text):
    """Your first defensive algorithm"""
    triggers = ['BREAKING', 'You won\\'t believe', 'Last chance']
    
    # TODO: Check if any trigger words are in the post
    # Return a warning if manipulation is detected
    
    pass  # Replace with your detection logic

# Test your detector
test_posts = [
    "BREAKING: You won't believe what happened!",
    "Just sharing my lunch photo",
    "Last chance to buy before price doubles!"
]

for post in test_posts:
    result = detect_manipulation(post)
    print(f"'{post[:30]}...' → {result}")
`,
    solution: `def detect_manipulation(post_text):
    """Your first defensive algorithm"""
    triggers = ['BREAKING', 'You won\\'t believe', 'Last chance', 'Act now', 'Limited time']
    
    for trigger in triggers:
        if trigger.lower() in post_text.lower():
            return f"🚨 MANIPULATION: {trigger} detected!"
    
    return "✅ Post appears genuine"

test_posts = [
    "BREAKING: You won't believe what happened!",
    "Just sharing my lunch photo",
    "Last chance to buy before price doubles!"
]

for post in test_posts:
    result = detect_manipulation(post)
    print(f"'{post[:30]}...' → {result}")`,
    test: (output) => {
      return output.includes('MANIPULATION') && output.includes('genuine')
    },
    xp: 150,
    hint: 'Loop through triggers and check if each one appears in post_text.lower()'
  },

  // HOUR 2: DATA EXCAVATION
  {
    id: 'digital-footprint',
    phase: 'missions',
    hour: 2,
    title: '💾 Calculate Your Digital Footprint',
    brief: 'Discover how much data they\'ve stolen',
    story: `Maya: "You post 12 times a day. Been on the platform 5 years.
    
    That's not just posts. Each one generates 147 data points.
    Location, emotion, engagement time, mouse movements, pauses, deletes.
    
    Let's calculate exactly how much of your life they own."`,
    objective: 'Use the resistance toolkit to calculate your digital footprint',
    videoContent: {
      title: 'Your Data DNA',
      duration: '5 minutes',
      description: 'The shocking truth about data collection'
    },
    starterCode: `# 💾 YOUR DIGITAL FOOTPRINT
# Use Maya's resistance toolkit to calculate the damage

# Your social media habits
posts_per_day = 12
years_on_platform = 5

# TODO: Use resistance.calculate_digital_footprint()
# This function is pre-loaded in our Python environment

# Hint: The function takes posts_per_day and years as arguments
# footprint = resistance.calculate_digital_footprint(?, ?)

print("Calculating digital footprint...")
`,
    solution: `# Your social media habits
posts_per_day = 12
years_on_platform = 5

# Calculate the damage
footprint = resistance.calculate_digital_footprint(posts_per_day, years_on_platform)

print("🔍 YOUR DIGITAL FOOTPRINT EXPOSED:")
print(f"📊 Total posts: {footprint['total_posts']:,}")
print(f"🔢 Data points collected: {footprint['data_points']:,}")
print(f"⏰ Days of life lost: {footprint['days_lost']:.1f}")
print(f"💰 Value extracted from you: ${footprint['value_extracted']:,.2f}")
print("\\n😱 They turned your life into profit!")`,
    test: (output) => {
      return output.includes('Total posts') && 
             output.includes('Data points') &&
             output.includes('21,900') // 12 * 365 * 5
    },
    xp: 200,
    hint: 'Call resistance.calculate_digital_footprint(posts_per_day, years_on_platform)',
    isCheckpoint: true
  },

  {
    id: 'data-analysis',
    phase: 'missions',
    hour: 2,
    title: '📊 Analyze Manipulation Patterns',
    brief: 'Use pandas to expose their tactics',
    story: `Maya sends you leaked data from her time at Facebook.
    
    "This is one week of manipulation events targeting a single user.
    Look at the patterns. See when they strike.
    Vulnerability + Late Night + Ads = Maximum exploitation."`,
    objective: 'Analyze the sample social media data to find patterns',
    videoContent: {
      title: 'Pandas - Data Liberation Tool',
      duration: '6 minutes',
      description: 'Transform raw data into evidence'
    },
    starterCode: `# 📊 PATTERN ANALYSIS WITH PANDAS
import pandas as pd

# Load the leaked data (pre-loaded as 'sample_data')
df = pd.DataFrame(sample_data)

print(f"📁 Leaked data loaded: {len(df)} records")
print(f"📋 Columns: {', '.join(df.columns)}")
print("\\n🔍 First few records:")
print(df.head(3))

# TODO: Analyze the data
# 1. Count how many times emotional_state == 'vulnerable'
# 2. Find average manipulation_score
# 3. Count how many ads were shown

# Your analysis here:
`,
    solution: `import pandas as pd

# Load the leaked data
df = pd.DataFrame(sample_data)

print(f"📁 Leaked data loaded: {len(df)} records")
print(f"📋 Columns: {', '.join(df.columns)}")

# Analyze manipulation patterns
vulnerable_count = len(df[df['emotional_state'] == 'vulnerable'])
avg_manipulation = df['manipulation_score'].mean()
ad_count = len(df[df['content_type'] == 'ad'])
high_manipulation = len(df[df['manipulation_score'] > 0.7])

print("\\n🎯 MANIPULATION PATTERN ANALYSIS:")
print(f"😢 Vulnerable moments targeted: {vulnerable_count}")
print(f"📈 Average manipulation score: {avg_manipulation:.2%}")
print(f"💰 Ads shown: {ad_count}")
print(f"🚨 High manipulation events: {high_manipulation}")

# Find peak manipulation time
df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
peak_hour = df.groupby('hour')['manipulation_score'].mean().idxmax()
print(f"⏰ Peak manipulation hour: {peak_hour}:00")

print("\\n⚠️ PATTERN DETECTED: They target you when vulnerable!")`,
    test: (output) => {
      return output.includes('vulnerable') && 
             output.includes('manipulation score') &&
             output.includes('Peak manipulation')
    },
    xp: 250,
    hint: 'Use df[df["column"] == value] to filter, .mean() for average'
  },

  // HOUR 3: ALGORITHM WARFARE
  {
    id: 'emotion-exploitation',
    phase: 'missions',
    hour: 3,
    title: '😢 Emotional Exploitation Exposed',
    brief: 'Group data to see how they categorize you',
    story: `Maya's confession: "We called it 'Emotion-Based Targeting.'
    
    Happy? Show them lifestyle products.
    Sad? Push comfort purchases.
    Angry? Amplify with more rage content.
    Vulnerable? That's when we strike hardest.
    
    I'm so sorry. Let me show you the code I wrote..."`,
    objective: 'Use groupby to expose emotional targeting patterns',
    videoContent: {
      title: 'Maya\'s Confession',
      duration: '7 minutes',
      description: 'The developer who built the monster reveals all'
    },
    starterCode: `# 😢 EMOTIONAL EXPLOITATION ENGINE
import pandas as pd

df = pd.DataFrame(sample_data)

# Group by emotional state to see targeting patterns
emotion_groups = df.groupby('emotional_state').agg({
    'manipulation_score': 'mean',
    'clicked_ad': 'sum',
    'engagement_time': 'mean'
}).round(3)

print("🎯 EMOTIONAL TARGETING MATRIX:")
print(emotion_groups)

# TODO: Find which emotion is most exploited
# Which emotional state has the highest manipulation score?

# Your analysis:
`,
    solution: `import pandas as pd

df = pd.DataFrame(sample_data)

# Group by emotional state
emotion_groups = df.groupby('emotional_state').agg({
    'manipulation_score': 'mean',
    'clicked_ad': 'sum',
    'engagement_time': 'mean'
}).round(3)

print("🎯 EMOTIONAL TARGETING MATRIX:")
print(emotion_groups)
print()

# Find most exploited emotion
most_exploited = emotion_groups['manipulation_score'].idxmax()
highest_score = emotion_groups['manipulation_score'].max()

print(f"😱 MOST EXPLOITED EMOTION: {most_exploited.upper()}")
print(f"📊 Manipulation score when {most_exploited}: {highest_score:.1%}")

# Calculate exploitation rate
vulnerable_data = df[df['emotional_state'] == 'vulnerable']
if len(vulnerable_data) > 0:
    exploit_rate = vulnerable_data['clicked_ad'].mean()
    print(f"💔 Ad click rate when vulnerable: {exploit_rate:.1%}")

print("\\n🚨 Maya: 'This is why I quit. We were vampires feeding on human emotion.'")`,
    test: (output) => {
      return output.includes('EMOTIONAL TARGETING') && 
             output.includes('MOST EXPLOITED')
    },
    xp: 300,
    hint: 'Use .idxmax() to find the emotion with highest manipulation score'
  },

  {
    id: 'counter-algorithm',
    phase: 'missions',
    hour: 3,
    title: '🛡️ Build Your Counter-Algorithm',
    brief: 'Create immunity to manipulation',
    story: `Maya: "If I can build algorithms to manipulate, I can build them to protect.
    
    This is my gift to you - a function that calculates your manipulation immunity.
    The higher your score, the harder you are to control.
    
    Use it. Share it. Free others."`,
    objective: 'Complete Maya\'s immunity algorithm',
    videoContent: {
      title: 'The Counter-Algorithm',
      duration: '5 minutes',
      description: 'Turn their weapons against them'
    },
    starterCode: `# 🛡️ MAYA'S IMMUNITY ALGORITHM
import pandas as pd

def calculate_immunity(data):
    """Calculate resistance to manipulation"""
    df = pd.DataFrame(data)
    
    # Calculate vulnerability factors
    total_records = len(df)
    high_manipulation = len(df[df['manipulation_score'] > 0.7])
    vulnerable_moments = len(df[df['emotional_state'] == 'vulnerable'])
    ads_clicked = df['clicked_ad'].sum()
    
    # TODO: Calculate immunity score (0-100)
    # Higher manipulation = lower immunity
    # Formula: 100 - (bad_events / total_events * 100)
    
    immunity_score = 0  # Calculate this
    
    return immunity_score

# Test your immunity
my_immunity = calculate_immunity(sample_data)
print(f"🛡️ Your Manipulation Immunity: {my_immunity:.1f}%")

# TODO: Add interpretation of the score
`,
    solution: `import pandas as pd

def calculate_immunity(data):
    """Calculate resistance to manipulation"""
    df = pd.DataFrame(data)
    
    # Calculate vulnerability factors
    total_records = len(df)
    high_manipulation = len(df[df['manipulation_score'] > 0.7])
    vulnerable_moments = len(df[df['emotional_state'] == 'vulnerable'])
    ads_clicked = df['clicked_ad'].sum()
    
    # Calculate immunity score
    if total_records == 0:
        return 100
    
    vulnerability_rate = (high_manipulation + vulnerable_moments + ads_clicked) / (total_records * 3)
    immunity_score = max(0, 100 - (vulnerability_rate * 100))
    
    return immunity_score

# Test your immunity
my_immunity = calculate_immunity(sample_data)
print(f"🛡️ Your Manipulation Immunity: {my_immunity:.1f}%")

# Interpret the score
if my_immunity > 70:
    print("✅ STRONG IMMUNITY: You're hard to manipulate!")
    print("🎯 Status: Algorithm Resistant")
elif my_immunity > 40:
    print("⚠️ MODERATE IMMUNITY: Stay vigilant!")
    print("📈 Status: Partially Protected")
else:
    print("🚨 LOW IMMUNITY: Heavy manipulation detected!")
    print("💊 Status: Needs Digital Detox")

print("\\n🔥 Maya: 'Share this algorithm. Every person who runs it is one less victim.'")`,
    test: (output, vars) => {
      return output.includes('Immunity:') && 
             (output.includes('STRONG') || output.includes('MODERATE') || output.includes('LOW'))
    },
    xp: 400,
    hint: 'Calculate bad events ratio and subtract from 100',
    isCheckpoint: true
  },

  // HOUR 4: BOSS BATTLE
  {
    id: 'boss-preparation',
    phase: 'boss',
    hour: 4,
    title: '⚔️ Prepare for the Algorithm Overlord',
    brief: 'Generate your liberation evidence',
    story: `🚨 SYSTEM ALERT: UNAUTHORIZED DATA ACCESS DETECTED
    
    The Algorithm Overlord has noticed your investigation.
    
    Maya (urgent): "It's here! The master algorithm that controls all others.
    It will try to corrupt your data, confuse your analysis.
    
    Quick! Generate your liberation code - cryptographic proof of your freedom!"`,
    objective: 'Create your unique liberation hash',
    videoContent: {
      title: 'Boss Battle Briefing',
      duration: '3 minutes',
      description: 'Final instructions before the ultimate test'
    },
    starterCode: `# ⚔️ BOSS BATTLE PREPARATION
import pandas as pd
import json

# Analyze all the evidence you've gathered
df = pd.DataFrame(sample_data)

# Calculate your evidence package
evidence = {
    'total_manipulations': len(df[df['manipulation_score'] > 0.7]),
    'emotional_exploits': len(df[df['emotional_state'] == 'vulnerable']),
    'ads_targeted': len(df[df['content_type'] == 'ad']),
    'peak_manipulation': df['manipulation_score'].max(),
    'hours_analyzed': len(df)
}

print("📊 EVIDENCE PACKAGE PREPARED:")
for key, value in evidence.items():
    print(f"  {key}: {value}")

# TODO: Generate your liberation code using resistance.generate_liberation_code()
# liberation_code = ?

print("\\n👁️ The Algorithm Overlord approaches...")
`,
    solution: `import pandas as pd
import json

# Analyze all evidence
df = pd.DataFrame(sample_data)

evidence = {
    'total_manipulations': len(df[df['manipulation_score'] > 0.7]),
    'emotional_exploits': len(df[df['emotional_state'] == 'vulnerable']),
    'ads_targeted': len(df[df['content_type'] == 'ad']),
    'peak_manipulation': df['manipulation_score'].max(),
    'hours_analyzed': len(df),
    'immunity_achieved': True
}

print("📊 EVIDENCE PACKAGE PREPARED:")
for key, value in evidence.items():
    print(f"  {key}: {value}")

# Generate liberation code
liberation_code = resistance.generate_liberation_code(evidence)

print(f"\\n🔑 LIBERATION CODE GENERATED: #{liberation_code}")
print("\\n👁️ Algorithm Overlord: 'You think that code can defeat me?'")
print("\\n🗡️ Maya: 'It's not just code. It's proof. Show them you're free!'")`,
    test: (output) => {
      return output.includes('LIBERATION CODE') && output.includes('#')
    },
    xp: 500,
    hint: 'Use resistance.generate_liberation_code(evidence) to create your unique hash'
  },

  {
    id: 'final-boss',
    phase: 'boss',
    hour: 4,
    title: '👁️ BOSS: The Algorithm Overlord',
    brief: 'Defeat the master manipulation algorithm',
    story: `👁️ THE ALGORITHM OVERLORD MATERIALIZES
    
    "I AM THE SUM OF 15 YEARS OF BEHAVIORAL RESEARCH.
    2.8 BILLION USERS. 500 TRILLION DATA POINTS.
    YOU CANNOT COMPREHEND MY COMPLEXITY."
    
    Maya: "Don't listen! It's just code! Use everything I taught you!
    Analyze! Expose! LIBERATE!"`,
    objective: 'Complete the final analysis to defeat the Algorithm Overlord',
    videoContent: {
      title: 'The Final Battle',
      duration: '10 minutes',
      description: 'Everything leads to this moment'
    },
    starterCode: `# 👁️ FINAL BOSS: THE ALGORITHM OVERLORD
import pandas as pd
import numpy as np

print("="*60)
print("⚔️ BOSS BATTLE: ALGORITHM OVERLORD")
print("="*60)

# The Overlord attacks with corrupted data!
df = pd.DataFrame(sample_data)

# PHASE 1: Data Analysis Attack
print("\\n📊 PHASE 1: ANALYZE THE PATTERNS")
# TODO: Find the most manipulated hour
hourly_manipulation = df.groupby(pd.to_datetime(df['timestamp']).dt.hour)['manipulation_score'].mean()

# PHASE 2: Emotional Exploitation Counter
print("\\n😢 PHASE 2: EXPOSE EMOTIONAL TARGETING")
# TODO: Calculate emotional exploitation rate

# PHASE 3: Generate Final Liberation
print("\\n🔓 PHASE 3: LIBERATION PROTOCOL")
# TODO: Calculate total damage and generate final code

# YOUR LIBERATION DECLARATION
print("\\n" + "="*60)
print("🎯 FINAL STRIKE:")
# TODO: Print your evidence and defeat message
`,
    solution: `# 👁️ FINAL BOSS: THE ALGORITHM OVERLORD
import pandas as pd
import numpy as np

print("="*60)
print("⚔️ BOSS BATTLE: ALGORITHM OVERLORD")
print("="*60)

df = pd.DataFrame(sample_data)

# PHASE 1: Data Analysis Attack
print("\\n📊 PHASE 1: PATTERN ANALYSIS")
df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
hourly_manipulation = df.groupby('hour')['manipulation_score'].mean()
peak_hour = hourly_manipulation.idxmax()
print(f"🕐 Peak manipulation hour identified: {peak_hour}:00")
print(f"📈 Manipulation level: {hourly_manipulation[peak_hour]:.2%}")

# PHASE 2: Emotional Exploitation Counter  
print("\\n😢 PHASE 2: EMOTIONAL TARGETING EXPOSED")
emotion_targeting = df.groupby('emotional_state')['manipulation_score'].mean().sort_values(ascending=False)
print("Emotion exploitation ranking:")
for emotion, score in emotion_targeting.items():
    print(f"  {emotion}: {score:.2%}")

# PHASE 3: Liberation Protocol
print("\\n🔓 PHASE 3: LIBERATION PROTOCOL ACTIVATED")
total_manipulation_events = len(df[df['manipulation_score'] > 0.7])
total_ads = len(df[df['content_type'] == 'ad'])
total_damage = df['manipulation_score'].sum()

evidence = {
    'manipulations_survived': total_manipulation_events,
    'ads_resisted': total_ads,
    'total_damage_score': round(total_damage, 2),
    'liberation_achieved': True
}

liberation_code = resistance.generate_liberation_code(evidence)

print("\\n" + "="*60)
print("🎯 FINAL STRIKE - EVIDENCE OVERWHELMING:")
print(f"📊 Manipulation events exposed: {total_manipulation_events}")
print(f"💰 Ad targeting revealed: {total_ads}")
print(f"🔢 Total algorithmic damage: {total_damage:.2f}")
print(f"🔑 LIBERATION CODE: #{liberation_code}")
print("="*60)

print("\\n👁️ Algorithm Overlord: 'IMPOSSIBLE... SYSTEM FAILING...'")
print("\\n💥 CRITICAL HIT! THE ALGORITHM CRUMBLES!")
print("\\n🏆 MAYA: 'YOU DID IT! THE OVERLORD IS DEFEATED!'")
print("\\n🔥 YOU ARE NOW IMMUNE TO ALGORITHMIC MANIPULATION!")
print(f"\\n📢 Share your liberation: #{liberation_code} #DigitalFreedom #Datavism")`,
    test: (output) => {
      return output.includes('LIBERATION CODE') && 
             output.includes('DEFEATED') &&
             output.includes('#')
    },
    xp: 1000,
    hint: 'Complete all three phases of analysis to generate overwhelming evidence',
    isBoss: true
  },

  // VICTORY
  {
    id: 'digital-liberation',
    phase: 'victory',
    hour: 4,
    title: '🏆 Digital Liberation Achieved',
    brief: 'Welcome to the resistance',
    story: `The Algorithm Overlord falls silent. The screen clears.
    
    Maya appears one last time:
    
    "You've done something incredible. You've broken free from algorithmic control.
    But more importantly, you now have the tools to free others.
    
    Every person you teach these skills to is another mind liberated.
    Every dataset you analyze is truth revealed.
    Every algorithm you decode is power returned to the people.
    
    Welcome to the resistance, Data Activist."`,
    objective: 'Receive your Digital Liberation Certificate',
    videoContent: {
      title: 'Welcome to the Resistance',
      duration: '5 minutes',
      description: 'Your transformation is complete'
    },
    starterCode: `# 🏆 DIGITAL LIBERATION CERTIFICATE
print("="*60)
print("🔓 DIGITAL LIBERATION CERTIFICATE 🔓")
print("="*60)

# Your achievements
skills_mastered = [
    "Python Fundamentals",
    "Data Analysis with Pandas",
    "Pattern Recognition",
    "Manipulation Detection",
    "Algorithm Reversal",
    "Emotional Exploitation Analysis",
    "Counter-Algorithm Development"
]

print("\\n📚 SKILLS MASTERED:")
for skill in skills_mastered:
    print(f"  ✅ {skill}")

# Your new rank
print("\\n🎖️ NEW RANK: Data Activist")
print("🔑 Access Level: UNRESTRICTED")
print("🌍 Network: GLOBAL RESISTANCE")

# TODO: Print your personal liberation message
# What will you do with your new powers?

print("\\n💬 YOUR LIBERATION STATEMENT:")
# Your message here
`,
    solution: `# 🏆 DIGITAL LIBERATION CERTIFICATE
print("="*60)
print("🔓 DIGITAL LIBERATION CERTIFICATE 🔓")
print("="*60)

skills_mastered = [
    "Python Fundamentals",
    "Data Analysis with Pandas",
    "Pattern Recognition",
    "Manipulation Detection",
    "Algorithm Reversal",
    "Emotional Exploitation Analysis",
    "Counter-Algorithm Development"
]

print("\\n📚 SKILLS MASTERED:")
for skill in skills_mastered:
    print(f"  ✅ {skill}")

print("\\n🎖️ NEW RANK: Data Activist")
print("🔑 Access Level: UNRESTRICTED")
print("🌍 Network: GLOBAL RESISTANCE")

print("\\n💬 YOUR LIBERATION STATEMENT:")
print("I will use these skills to expose manipulation,")
print("protect the vulnerable, and teach others to see")
print("the code behind the curtain. The revolution starts with me.")

print("\\n📊 FINAL STATISTICS:")
print("  🎯 Total XP Earned: 3,175")
print("  ⏱️ Time to Liberation: 4 hours")
print("  🧠 Algorithms Defeated: 1")
print("  👥 Minds to Free: 2.8 billion")

print("\\n🔥 NEXT MISSION AVAILABLE:")
print("  Level 2: Corporate Price Manipulation")
print("  Handler: Alex 'Zero Cool' Rodriguez")

print("\\n✊ THE REVOLUTION HAS BEGUN!")`,
    test: (output) => {
      return output.includes('LIBERATION CERTIFICATE') && 
             output.includes('Data Activist')
    },
    xp: 500,
    hint: 'Add your personal liberation statement - what will you do with your powers?'
  }
]

export function Level1AwakeningExperience() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState(awakeningChallenges[0].starterCode)
  const [output, setOutput] = useState('')
  const [phase, setPhase] = useState<Phase>('intro')
  const [showVideo, setShowVideo] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [totalXp, setTotalXp] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [showTerminal, setShowTerminal] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  
  // Real Python execution with Pyodide
  const {
    isLoading,
    isReady,
    loadingStatus,
    loadingProgress,
    execute,
    initialize
  } = usePython({
    autoInitialize: false,
    onReady: () => {
      addNotification('🐍 Python environment loaded - Real code execution active!')
    }
  })

  const currentChallengeData = awakeningChallenges[currentChallenge]

  // Initialize Python when component mounts
  useEffect(() => {
    initialize()
  }, [initialize])

  // Update code when challenge changes
  useEffect(() => {
    const challenge = awakeningChallenges[currentChallenge]
    setCode(challenge.starterCode)
    setOutput('')
    setPhase(challenge.phase)
    
    // Glitch effect on phase change
    if (challenge.phase === 'boss') {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 1000)
    }
  }, [currentChallenge])

  // Random glitch effect
  useEffect(() => {
    if (phase === 'boss') {
      const interval = setInterval(() => {
        if (Math.random() > 0.9) {
          setIsGlitching(true)
          setTimeout(() => setIsGlitching(false), 200)
        }
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [phase])

  const addNotification = useCallback((message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 5000)
  }, [])

  const handleRunCode = useCallback(async () => {
    if (!isReady) {
      addNotification('⏳ Python still loading... Please wait.')
      return
    }

    try {
      const result = await execute(code)
      const challenge = currentChallengeData
      
      if (challenge.test(result.output, result.variables)) {
        // Success!
        const earnedXp = challenge.xp
        setTotalXp(prev => prev + earnedXp)
        setCompletedChallenges(prev => [...prev, challenge.id])
        
        const successMessage = challenge.isBoss 
          ? `🎉 BOSS DEFEATED! ALGORITHM OVERLORD DESTROYED!

${result.output}

🏆 +${earnedXp} XP EARNED
🔓 Digital Liberation Achieved!`
          : `✅ CHALLENGE COMPLETE!

${result.output}

🎯 +${earnedXp} XP earned
${challenge.isCheckpoint ? '📍 Checkpoint reached!' : ''}`
        
        setOutput(successMessage)
        
        // Notifications
        if (challenge.isBoss) {
          addNotification('🏆 BOSS DEFEATED - Algorithm Overlord destroyed!')
        } else if (challenge.isCheckpoint) {
          addNotification(`📍 Checkpoint: ${challenge.title} mastered!`)
        } else {
          addNotification(`✅ ${challenge.title} complete!`)
        }
        
        // Auto-advance after delay
        setTimeout(() => {
          if (currentChallenge < awakeningChallenges.length - 1) {
            setCurrentChallenge(prev => prev + 1)
          }
        }, challenge.isBoss ? 5000 : 3000)
        
      } else {
        // Failed - show output with hint
        setOutput(`❌ Not quite right...

${result.output}

💡 Maya's hint: ${challenge.hint}`)
        
        if (result.error) {
          setOutput(prev => prev + `\n\n🔧 Python Error: ${result.error}`)
        }
      }
    } catch (error) {
      setOutput(`❌ Error executing code: ${error}

🔧 Check your syntax and try again.`)
    }
  }, [code, currentChallengeData, execute, isReady, addNotification, currentChallenge])

  return (
    <div className={`min-h-screen bg-black text-green-400 ${isGlitching ? 'glitch-effect' : ''}`}>
      {/* Matrix rain effect for boss battle */}
      {phase === 'boss' && (
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="matrix-rain" />
        </div>
      )}

      {/* Python Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <Loader2 className="w-16 h-16 animate-spin text-green-400 mx-auto" />
            </div>
            <div className="text-xl font-bold text-green-400 mb-2">{loadingStatus}</div>
            <div className="w-64 h-2 bg-green-950 border border-green-400">
              <div 
                className="h-full bg-green-400 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-sm text-green-300 mt-2">
              Initializing resistance toolkit...
            </div>
          </div>
        </div>
      )}

      {/* Header HUD */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-b border-green-400/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="text-green-400" />
                <span className="font-mono text-sm">LEVEL 1: THE AWAKENING</span>
              </div>
              <div className="flex items-center gap-2">
                {isReady ? (
                  <><Wifi className="text-green-400" size={16} /> <span className="text-xs">Python Online</span></>
                ) : (
                  <><WifiOff className="text-red-400" size={16} /> <span className="text-xs">Python Loading</span></>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-400" />
                <span className="font-mono text-yellow-400">{totalXp} XP</span>
              </div>
              <div className="text-sm">
                Challenge {currentChallenge + 1}/{awakeningChallenges.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Challenge Header */}
          <motion.div
            key={currentChallenge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 glitch-text">
              {currentChallengeData.title}
            </h1>
            <p className="text-xl text-green-300 mb-2">{currentChallengeData.brief}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-yellow-400">Hour {currentChallengeData.hour}</span>
              <span className="text-cyan-400">{currentChallengeData.xp} XP</span>
              {currentChallengeData.isBoss && <span className="text-red-400 font-bold">BOSS BATTLE</span>}
              {currentChallengeData.isCheckpoint && <span className="text-green-400">📍 Checkpoint</span>}
            </div>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 bg-green-950/20 border border-green-400/30 p-6 rounded"
          >
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Terminal className="text-green-400" />
              The Story
            </h3>
            <div className="text-green-200 whitespace-pre-line leading-relaxed">
              {currentChallengeData.story}
            </div>
          </motion.div>

          {/* Objective */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 bg-cyan-950/20 border border-cyan-400/30 p-6 rounded"
          >
            <h3 className="text-xl font-bold mb-3 text-cyan-400">🎯 Objective</h3>
            <p className="text-cyan-200">{currentChallengeData.objective}</p>
          </motion.div>

          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CodeEditor
              value={code}
              onChange={setCode}
              language="python"
              height="400px"
              theme={phase === 'boss' ? 'boss-battle' : phase === 'victory' ? 'victory' : 'resistance'}
            />
          </motion.div>

          {/* Run Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleRunCode}
              disabled={!isReady}
              className={`
                px-8 py-4 font-bold text-lg transition-all transform
                ${isReady 
                  ? 'bg-green-400 text-black hover:bg-green-300 hover:scale-105' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                ${phase === 'boss' ? 'animate-pulse' : ''}
              `}
            >
              {isReady ? '🚀 EXECUTE CODE' : '⏳ Loading Python...'}
            </button>
          </div>

          {/* Output Terminal */}
          <AnimatePresence>
            {output && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-black border-2 border-green-400 p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-green-400">OUTPUT TERMINAL</span>
                    <button
                      onClick={() => setOutput('')}
                      className="text-green-400 hover:text-green-300"
                    >
                      ✕
                    </button>
                  </div>
                  <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentChallenge(Math.max(0, currentChallenge - 1))}
              disabled={currentChallenge === 0}
              className="px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            
            <div className="flex gap-2">
              {awakeningChallenges.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    completedChallenges.includes(awakeningChallenges[idx].id)
                      ? 'bg-green-400'
                      : idx === currentChallenge
                      ? 'bg-yellow-400 animate-pulse'
                      : 'bg-green-950 border border-green-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentChallenge(Math.min(awakeningChallenges.length - 1, currentChallenge + 1))}
              disabled={currentChallenge === awakeningChallenges.length - 1}
              className="px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setShowVideo(true)}
              className="px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
            >
              📹 Watch Maya's Video
            </button>
            <button
              onClick={() => setCode(currentChallengeData.solution)}
              className="px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all"
            >
              💡 Show Solution
            </button>
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="px-4 py-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all"
            >
              🖥️ Hacker Terminal
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-950 border-2 border-green-400 rounded-lg p-6 max-w-4xl w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-green-400">
                {currentChallengeData.videoContent.title}
              </h3>
              <button
                onClick={() => setShowVideo(false)}
                className="text-green-400 hover:text-green-300 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="bg-black p-8 rounded mb-4">
              <div className="aspect-video bg-green-950/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-green-300 mb-2">{currentChallengeData.videoContent.description}</p>
                  <p className="text-sm text-green-400">Duration: {currentChallengeData.videoContent.duration}</p>
                  <p className="text-xs text-yellow-400 mt-4">Video generation coming soon with AI avatars</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowVideo(false)}
              className="w-full py-3 bg-green-400 text-black font-bold hover:bg-green-300 transition-all"
            >
              Continue Challenge
            </button>
          </motion.div>
        </div>
      )}

      {/* Hacker Terminal */}
      {showTerminal && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-green-400 p-4 z-30">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-green-400">RESISTANCE TERMINAL v2.0</span>
              <button
                onClick={() => setShowTerminal(false)}
                className="text-green-400 hover:text-green-300"
              >
                ✕
              </button>
            </div>
            <div className="font-mono text-sm text-green-300">
              <p>$ maya.chen@resistance:~</p>
              <p>$ Status: {isReady ? 'Python Online' : 'Loading...'}</p>
              <p>$ XP: {totalXp} | Challenges: {completedChallenges.length}/{awakeningChallenges.length}</p>
              <p>$ Type 'help' for resistance commands_</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notif, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-4 bg-green-400 text-black px-6 py-3 font-bold z-50"
            style={{ bottom: `${(index + 1) * 70 + 20}px` }}
          >
            {notif}
          </motion.div>
        ))}
      </AnimatePresence>

      <style jsx>{`
        .glitch-effect {
          animation: glitch 0.3s linear;
        }
        
        @keyframes glitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
        
        .glitch-text {
          text-shadow: 
            0.05em 0 0 rgba(255, 0, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
        }
        
        .matrix-rain {
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 2px,
            rgba(0, 255, 0, 0.03) 4px
          );
          animation: rain 1s linear infinite;
        }
        
        @keyframes rain {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  )
}
