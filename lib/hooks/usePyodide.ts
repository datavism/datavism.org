import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    loadPyodide: any
  }
}

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadPyodideScript = async () => {
      if (window.loadPyodide) return
      
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
      script.async = true
      document.body.appendChild(script)
      
      await new Promise(resolve => {
        script.onload = resolve
      })
    }

    const initializePyodide = async () => {
      setLoading(true)
      try {
        await loadPyodideScript()
        
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        })
        
        // Load essential packages for data activism
        await pyodideInstance.loadPackage(['pandas', 'numpy', 'matplotlib'])
        
        // Setup realistic social media datasets for Level 1: The Awakening
        pyodideInstance.runPython(`
import pandas as pd
import numpy as np
import sys
from io import StringIO
import matplotlib.pyplot as plt

# Set random seed for consistent "personal" data
np.random.seed(1337)

# Your InstaPic Data - Realistic social media manipulation dataset
# Based on actual patterns from Facebook/Instagram data exports

# Generate 365 days of your "digital life"
dates = pd.date_range('2024-01-01', periods=365, freq='D')

# Realistic hourly patterns (more activity evening/night)
hour_weights = np.array([0.01, 0.01, 0.01, 0.01, 0.01, 0.01,  # 0-5 AM
               0.02, 0.03, 0.04, 0.05, 0.06, 0.07,   # 6-11 AM  
               0.08, 0.08, 0.07, 0.06, 0.07, 0.08,   # 12-5 PM
               0.09, 0.10, 0.11, 0.09, 0.05, 0.02])   # 6-11 PM
# Normalize to ensure sum = 1
hour_weights = hour_weights / hour_weights.sum()

# Create your personal InstaPic manipulation data
your_data = []
for i, date in enumerate(dates):
    # 3-12 posts per day (more on weekends)
    posts_today = np.random.poisson(5 if date.weekday() < 5 else 8)
    
    for _ in range(posts_today):
        hour = np.random.choice(24, p=hour_weights)
        
        # Content types with realistic distribution
        content_probs = np.array([0.35, 0.20, 0.15, 0.08, 0.10, 0.08, 0.04])
        content_probs = content_probs / content_probs.sum()
        content_type = np.random.choice([
            'friend_post', 'ad', 'suggested_post', 'controversial', 
            'story', 'reel', 'sponsored'
        ], p=content_probs)
        
        # Emotional states (vulnerable late at night)
        if hour >= 22 or hour <= 4:
            night_probs = np.array([0.25, 0.30, 0.20, 0.15, 0.10])
            night_probs = night_probs / night_probs.sum()
            emotional_state = np.random.choice([
                'sad', 'vulnerable', 'lonely', 'anxious', 'neutral'
            ], p=night_probs)
        else:
            day_probs = np.array([0.30, 0.40, 0.15, 0.10, 0.05])
            day_probs = day_probs / day_probs.sum()
            emotional_state = np.random.choice([
                'happy', 'neutral', 'excited', 'bored', 'curious'
            ], p=day_probs)
        
        # Manipulation score (higher for ads and vulnerable states)
        base_manipulation = np.random.beta(2, 5)
        if content_type in ['ad', 'sponsored']:
            base_manipulation += 0.3
        if emotional_state in ['sad', 'vulnerable', 'anxious']:
            base_manipulation += 0.2
        if hour >= 22 or hour <= 4:
            base_manipulation += 0.15
            
        manipulation_score = min(1.0, base_manipulation)
        
        # Engagement based on manipulation
        engagement_rate = manipulation_score * 0.8 + np.random.normal(0, 0.1)
        engagement_rate = max(0, min(1, engagement_rate))
        
        # Ad revenue (more from manipulation)
        ad_revenue = 0
        if content_type in ['ad', 'sponsored']:
            ad_revenue = manipulation_score * np.random.gamma(2, 1.5)
        
        # Time spent (addiction factor)
        time_spent = np.random.gamma(2, 5) * (1 + manipulation_score)
        
        your_data.append({
            'user_id': 12847,
            'date': date.strftime('%Y-%m-%d'),
            'hour': hour,
            'content_type': content_type,
            'emotional_state': emotional_state,
            'manipulation_score': round(manipulation_score, 3),
            'engagement_rate': round(engagement_rate, 3),
            'ads_shown': 1 if content_type in ['ad', 'sponsored'] else 0,
            'ad_revenue': round(ad_revenue, 2),
            'time_spent_minutes': round(time_spent, 1),
            'scroll_depth': np.random.beta(3, 2),
            'shares': 1 if np.random.random() < engagement_rate * 0.3 else 0,
            'comments': int(np.random.poisson(engagement_rate * 2)),
            'likes': int(np.random.poisson(engagement_rate * 10))
        })

# Create DataFrame
df = pd.DataFrame(your_data)
df.to_csv('your_instapic_data.csv', index=False)

# Ad targeting data - How they categorize and target you
ad_targeting_campaigns = []
for i in range(150):  # 150 different ad campaigns
    campaign = {
        'user_id': 12847,
        'campaign_id': f'AD_{i+1:03d}',
        'targeting_category': np.random.choice([
            'purchase_intent', 'emotional_vulnerability', 'life_event', 
            'behavioral_pattern', 'demographic', 'lookalike_audience',
            'retargeting', 'interest_based'
        ]),
        'targeting_score': np.random.beta(3, 2),
        'conversion_rate': np.random.beta(2, 8),
        'cost_per_click': np.random.gamma(2, 0.5),
        'profit_margin': np.random.gamma(3, 2),
        'emotional_trigger': np.random.choice([
            'FOMO', 'Social_Approval', 'Fear', 'Desire', 'Urgency', 'Guilt'
        ]),
        'success_rate': np.random.beta(4, 6)
    }
    ad_targeting_campaigns.append(campaign)

ad_df = pd.DataFrame(ad_targeting_campaigns)
ad_df.to_csv('ad_targeting_data.csv', index=False)

# Engagement pattern analysis
engagement_patterns = []
pattern_types = ['scroll_speed', 'pause_duration', 'click_pattern', 'reading_time', 'interaction_delay']

for pattern_type in pattern_types:
    for hour in range(24):
        pattern = {
            'user_id': 12847,
            'pattern_type': pattern_type,
            'hour': hour,
            'effectiveness_score': np.random.beta(3, 4),
            'manipulation_correlation': np.random.beta(4, 3),
            'addiction_indicator': np.random.beta(5, 3),
            'attention_capture_rate': np.random.beta(6, 4)
        }
        engagement_patterns.append(pattern)

eng_df = pd.DataFrame(engagement_patterns)
eng_df.to_csv('engagement_patterns.csv', index=False)

# Summary statistics for verification
print("📱 DIGITAL LIFE DATASETS LOADED:")
print(f"   Personal InstaPic data: {len(df)} posts over {df['date'].nunique()} days")
print(f"   Ad targeting campaigns: {len(ad_df)} different campaigns")
print(f"   Engagement patterns: {len(eng_df)} behavioral measurements")
print(f"\\n💰 SURVEILLANCE ECONOMY STATS:")
print(f"   Total ad revenue from you: \${df['ad_revenue'].sum():.2f}")
print(f"   Emotional vulnerability events: {len(df[df['emotional_state'].isin(['sad', 'vulnerable', 'anxious'])])}")
print(f"   Late-night targeting attempts: {len(df[(df['hour'] >= 22) | (df['hour'] <= 4)])}")
print(f"   Average manipulation score: {df['manipulation_score'].mean():.3f}")
print("\\n🚨 DATA READY FOR DIGITAL LIBERATION PROTOCOL")

# Make datasets globally available
globals()['your_instapic_data'] = df
globals()['ad_targeting_data'] = ad_df  
globals()['engagement_data'] = eng_df
        `)
        
        setPyodide(pyodideInstance)
        setReady(true)
      } catch (error) {
        console.error('Failed to load Pyodide:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!pyodide && !loading) {
      initializePyodide()
    }
  }, [pyodide, loading])

  const runCode = useCallback(async (code: string) => {
    if (!pyodide) throw new Error('Python environment not initialized')
    
    // Capture output
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
    `)
    
    // Run user code
    try {
      pyodide.runPython(code)
      const output = pyodide.runPython('sys.stdout.getvalue()')
      return output
    } catch (error: any) {
      throw new Error(error.message)
    }
  }, [pyodide])

  return { ready, loading, runCode }
}