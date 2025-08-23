'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Zap, DollarSign, TrendingUp, AlertTriangle, Globe, Shield, Search, BarChart3, Eye } from 'lucide-react'
import { CodeEditor } from '@/components/ui/CodeEditor'
import { InVideoModal } from '@/components/ui/InVideoModal'
import { ProgressTracker } from './ProgressTracker'
import { HandlerMessage } from './HandlerMessage' 
import { XPTracker } from './XPTracker'
import { usePyodide } from '@/lib/hooks/usePyodide'
import { useAcademyStore } from '@/lib/store/academy.store'
import { useAcademySync } from '@/lib/hooks/useAcademySync'

// 🎯 LEVEL 2: CORPORATE PRICE MANIPULATION - 5-Hour Investigation
// Handler: Alex "Zero Cool" Rodriguez (Anonymous Collective)

type Phase = 'infiltration' | 'surveillance' | 'analysis' | 'exposure' | 'showdown' | 'justice'
type Hour = 1 | 2 | 3 | 4 | 5

interface Challenge {
  id: string
  phase: Phase
  hour: Hour
  title: string
  brief: string
  story: string
  objective: string
  videoContent: {
    title: string
    duration: string
    description: string
    script?: string
  }
  starterCode: string
  solution: string
  test: (code: string) => boolean
  xp: number
  hint: string
  isBoss?: boolean
  isCheckpoint?: boolean
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
}

// 💰 PRICE MANIPULATION INVESTIGATION - Complete 5-Hour Experience
const priceManipulationChallenges: Challenge[] = [
  // ⏰ HOUR 1: INFILTRATION
  {
    id: 'price-anomaly-detected',
    phase: 'infiltration',
    hour: 1,
    title: '✈️ Price Anomaly Detected',
    brief: 'Mysterious airline price fluctuations exposed',
    story: `Alex intercepts encrypted chatter: "FlightMax just charged $2,847 for a flight that was $247 an hour ago. Same seat. Same plane. Only difference? They know you're desperate." This isn't surge pricing. This is algorithmic extortion.`,
    objective: 'Analyze suspicious price patterns in airline data',
    videoContent: {
      title: 'Zero Cool\'s Price Intelligence Briefing',
      duration: '4 minutes',
      description: 'Meet Alex Rodriguez and learn about corporate price manipulation tactics',
      script: `[SCENE: Alex in underground hacker space, multiple monitors showing price data]

ALEX: Name's Alex Rodriguez. Codename: Zero Cool. I've been tracking corporate price manipulation for 7 years.

[VISUAL: Real-time price charts fluctuating wildly]

ALEX: What you're seeing isn't market forces. It's algorithmic robbery. Airlines, hotels, ride-shares - they're all in on it.

[VISUAL: Evidence of coordinated price fixing]

ALEX: They use your desperation against you. Dead phone battery? Higher Uber prices. Searching multiple times? Flight prices jump.

[VISUAL: Algorithm flow charts]

ALEX: Today we expose the cartel. But first, you need to learn their language: web scraping, APIs, and pattern recognition.`
    },
    starterCode: `# ✈️ PRICE ANOMALY DETECTION
# Alex has intercepted FlightMax pricing data
# Analyze the suspicious patterns

import pandas as pd
import numpy as np

# Load the intercepted pricing data
pricing_data = {
    'timestamp': ['2024-01-15 09:00', '2024-01-15 10:00', '2024-01-15 11:00', '2024-01-15 12:00'],
    'route': ['NYC-LAX', 'NYC-LAX', 'NYC-LAX', 'NYC-LAX'],
    'price': [247, 1247, 2847, 347],
    'available_seats': [23, 23, 23, 23],
    'user_searches': [1, 5, 12, 2]
}

df = pd.DataFrame(pricing_data)
print("FlightMax Pricing Analysis:")

`,
    solution: `import pandas as pd
import numpy as np

pricing_data = {
    'timestamp': ['2024-01-15 09:00', '2024-01-15 10:00', '2024-01-15 11:00', '2024-01-15 12:00'],
    'route': ['NYC-LAX', 'NYC-LAX', 'NYC-LAX', 'NYC-LAX'],
    'price': [247, 1247, 2847, 347],
    'available_seats': [23, 23, 23, 23],
    'user_searches': [1, 5, 12, 2]
}

df = pd.DataFrame(pricing_data)
print("FlightMax Pricing Analysis:")
print(df)

# Calculate price manipulation correlation
correlation = df['price'].corr(df['user_searches'])
print(f"\\n🚨 MANIPULATION DETECTED!")
print(f"Price-Search Correlation: {correlation:.2f}")
print(f"Maximum price spike: {df['price'].max() - df['price'].min()}%")

# Red flag analysis
if correlation > 0.7:
    print("\\n⚠️ HIGH PROBABILITY: Algorithmic price manipulation")
    print("💰 They're charging more when demand is higher")
else:
    print("\\n✅ Pricing appears normal")`,
    test: (code) => code.includes('corr') && code.includes('user_searches'),
    xp: 100,
    hint: 'Calculate correlation between price and user_searches to detect manipulation',
    difficulty: 'easy'
  },

  {
    id: 'web-scraping-arsenal',
    phase: 'infiltration', 
    hour: 1,
    title: '🕷️ Web Scraping Arsenal',
    brief: 'Build tools to monitor price changes in real-time',
    story: `Alex: "They change prices every 15 minutes. Manual checking is useless. We need automated surveillance. BeautifulSoup and requests are our eyes and ears in their digital marketplace."`,
    objective: 'Create price monitoring tools',
    videoContent: {
      title: 'Web Scraping - Digital Surveillance',
      duration: '6 minutes',
      description: 'Learn to build automated price monitoring systems',
      script: `[SCENE: Alex demonstrating web scraping on live websites]

ALEX: Web scraping isn't just technical skill. It's digital surveillance against corporate manipulation.

[VISUAL: Browser developer tools, HTML inspection]

ALEX: Every price on their website lives in HTML. We extract it, track it, expose their games.

[VISUAL: BeautifulSoup code examples]

ALEX: BeautifulSoup parses HTML like a detective analyzes evidence. Requests fetches web pages like a spy gathers intelligence.

[VISUAL: Real-time price monitoring dashboard]

ALEX: Once you can scrape, you can prove. Once you can prove, you can expose. Let's build your surveillance toolkit.`
    },
    starterCode: `# 🕷️ WEB SCRAPING ARSENAL
# Build automated price monitoring
# Alex's surveillance toolkit

import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_flight_price(route):
    """
    Scrape flight prices from FlightMax
    (Simulated for safety - real scraping would use actual URLs)
    """
    # Simulated HTML response
    fake_html = f'''
    <div class="price-container">
        <span class="current-price">\${np.random.randint(200, 800)}</span>
        <span class="route">{route}</span>
        <span class="seats">23 available</span>
    </div>
    '''
    
    # Your scraping code here
    pass

# Test the scraper
route = "NYC-LAX"
price = scrape_flight_price(route)

`,
    solution: `import requests
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np

def scrape_flight_price(route):
    """
    Scrape flight prices from FlightMax
    (Simulated for safety - real scraping would use actual URLs)
    """
    # Simulated HTML response
    fake_html = f'''
    <div class="price-container">
        <span class="current-price">\${np.random.randint(200, 800)}</span>
        <span class="route">{route}</span>
        <span class="seats">23 available</span>
    </div>
    '''
    
    # Parse the HTML
    soup = BeautifulSoup(fake_html, 'html.parser')
    
    # Extract price information
    price_element = soup.find('span', class_='current-price')
    route_element = soup.find('span', class_='route')
    seats_element = soup.find('span', class_='seats')
    
    if price_element:
        price = price_element.text.replace('$', '')
        print(f"📊 Route: {route}")
        print(f"💰 Current Price: \${price}")
        print(f"✈️ Availability: {seats_element.text if seats_element else 'Unknown'}")
        return int(price)
    
    return None

# Test the surveillance system
route = "NYC-LAX"
price = scrape_flight_price(route)
print(f"\\n🕷️ SCRAPING SUCCESSFUL!")
print(f"✅ Price monitoring active for {route}")`,
    test: (code) => code.includes('BeautifulSoup') && code.includes('find'),
    xp: 150,
    hint: 'Use BeautifulSoup to parse HTML and extract price information',
    difficulty: 'medium'
  },

  {
    id: 'price-tracker-bot',
    phase: 'infiltration',
    hour: 1,
    title: '🤖 Price Tracker Bot',
    brief: 'Deploy automated surveillance across multiple platforms',
    story: `Alex: "Single data points are anecdotes. We need patterns. Our bot will monitor 50 airlines, 100 hotels, and 20 car rental sites simultaneously. When they manipulate prices, we'll have the evidence."`,
    objective: 'Build multi-platform price monitoring system',
    videoContent: {
      title: 'Building Price Surveillance Networks',
      duration: '5 minutes',
      description: 'Scale up monitoring across multiple platforms and detect coordinated manipulation',
      script: `[SCENE: Alex setting up monitoring dashboard with multiple data streams]

ALEX: Single-site monitoring is amateur hour. Professional price manipulation happens across platforms.

[VISUAL: Dashboard showing prices from airlines, hotels, cars]

ALEX: Look at this coordination. When FlightMax raises prices, HotelHub follows within minutes. That's not coincidence.

[VISUAL: Correlation analysis between platforms]

ALEX: Our bot monitors everything. Price changes, timing patterns, geographic variations. Building a price manipulation map.

[VISUAL: Real-time alerts and notifications]

ALEX: When prices spike suspiciously, we get instant alerts. Evidence collection in real-time.`
    },
    starterCode: `# 🤖 PRICE TRACKER BOT
# Multi-platform surveillance system
# Alex's professional monitoring network

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class PriceTrackerBot:
    def __init__(self):
        self.platforms = ['FlightMax', 'AirFare', 'SkyDeals', 'HotelHub', 'CarRental']
        self.price_history = []
    
    def monitor_platform(self, platform, route):
        """Monitor prices on a specific platform"""
        # Simulate price monitoring
        current_time = datetime.now()
        
        # Your monitoring code here
        pass
    
    def detect_manipulation(self):
        """Analyze patterns for price manipulation"""
        # Your analysis code here
        pass

# Deploy the surveillance network
bot = PriceTrackerBot()

`,
    solution: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class PriceTrackerBot:
    def __init__(self):
        self.platforms = ['FlightMax', 'AirFare', 'SkyDeals', 'HotelHub', 'CarRental']
        self.price_history = []
    
    def monitor_platform(self, platform, route):
        """Monitor prices on a specific platform"""
        current_time = datetime.now()
        
        # Simulate price detection with realistic patterns
        base_price = np.random.randint(200, 500)
        manipulation_factor = np.random.uniform(1.0, 3.5)  # 1x to 3.5x price manipulation
        current_price = int(base_price * manipulation_factor)
        
        price_data = {
            'timestamp': current_time,
            'platform': platform,
            'route': route,
            'price': current_price,
            'manipulation_factor': manipulation_factor
        }
        
        self.price_history.append(price_data)
        
        print(f"📊 {platform}: {route} = \${current_price}")
        if manipulation_factor > 2.0:
            print(f"🚨 ALERT: {manipulation_factor:.1f}x price spike detected!")
        
        return current_price
    
    def detect_manipulation(self):
        """Analyze patterns for price manipulation"""
        if not self.price_history:
            return "No data collected yet"
        
        df = pd.DataFrame(self.price_history)
        
        # Find coordinated price changes
        avg_manipulation = df['manipulation_factor'].mean()
        high_manipulation = len(df[df['manipulation_factor'] > 2.0])
        
        print(f"\\n🔍 SURVEILLANCE ANALYSIS:")
        print(f"   Platforms monitored: {len(df['platform'].unique())}")
        print(f"   Average price inflation: {avg_manipulation:.2f}x")
        print(f"   High manipulation events: {high_manipulation}")
        
        if avg_manipulation > 1.5:
            print(f"\\n⚠️ CARTEL ACTIVITY DETECTED!")
            print(f"   Coordinated price manipulation across platforms")
        
        return df

# Deploy the surveillance network
bot = PriceTrackerBot()

# Monitor multiple platforms
routes = ['NYC-LAX', 'NYC-MIA', 'LAX-CHI']
for route in routes:
    for platform in bot.platforms[:3]:  # Monitor first 3 platforms
        bot.monitor_platform(platform, route)

# Analyze for manipulation patterns
results = bot.detect_manipulation()
print("\\n🤖 BOT DEPLOYMENT SUCCESSFUL!")`,
    test: (code) => code.includes('class PriceTrackerBot') && code.includes('monitor_platform'),
    xp: 200,
    hint: 'Create a class with methods for monitoring and analyzing price patterns',
    difficulty: 'medium',
    isCheckpoint: true
  },

  // ⏰ HOUR 2: SURVEILLANCE  
  {
    id: 'dark-patterns-exposed',
    phase: 'surveillance',
    hour: 2,
    title: '🕳️ Dark Patterns Exposed',
    brief: 'Uncover psychological manipulation in UX design',
    story: `Alex discovers BookingNow's interface deliberately confuses users: "Look at this. 'Only 2 rooms left!' But there are 47 available. 'Book now before price increases!' But prices stay the same. Every button, every popup, every timer - all designed to trigger panic purchases."`,
    objective: 'Detect and catalog dark patterns in user interfaces',
    videoContent: {
      title: 'Dark Patterns - The Psychology of Digital Manipulation',
      duration: '7 minutes',
      description: 'Learn to identify and counter psychological manipulation in UX design',
      script: `[SCENE: Alex analyzing booking websites with multiple browsers]

ALEX: Dark patterns aren't bugs. They're features. Designed by psychologists to hijack your decision-making.

[VISUAL: Side-by-side comparison of manipulative UI elements]

ALEX: False scarcity. Fake urgency. Hidden fees. Subscription traps. They spent millions researching how to trick you.

[VISUAL: Eye-tracking studies and psychology research]

ALEX: But code doesn't lie. We can detect these patterns automatically. Every fake countdown, every misleading button.

[VISUAL: Automated dark pattern detection tools]

ALEX: Knowledge is immunity. Once you see the patterns, you can't unsee them.`
    },
    starterCode: `# 🕳️ DARK PATTERNS DETECTION
# Analyze UI elements for psychological manipulation
# Alex's pattern recognition system

import re
import pandas as pd

def detect_dark_patterns(ui_text):
    """
    Analyze website text for dark pattern indicators
    """
    dark_patterns = {
        'false_scarcity': ['only.*left', 'limited.*remaining', 'almost.*sold out'],
        'fake_urgency': ['hurry.*up', 'expires.*soon', 'limited.*time', 'act.*now'],
        'social_pressure': ['others.*viewing', 'people.*bought', 'popular.*choice'],
        'hidden_costs': ['additional.*fees', 'processing.*charge', 'convenience.*fee']
    }
    
    # Your detection code here
    pass

# Test on BookingNow's suspicious text
suspicious_text = [
    "Only 2 rooms left at this price!",
    "Hurry up! 12 people are viewing this hotel",
    "Book now - prices may increase soon",
    "Additional cleaning fees apply at checkout"
]

print("🕳️ DARK PATTERN ANALYSIS:")

`,
    solution: `import re
import pandas as pd

def detect_dark_patterns(ui_text):
    """
    Analyze website text for dark pattern indicators
    """
    dark_patterns = {
        'false_scarcity': ['only.*left', 'limited.*remaining', 'almost.*sold out'],
        'fake_urgency': ['hurry.*up', 'expires.*soon', 'limited.*time', 'act.*now'],
        'social_pressure': ['others.*viewing', 'people.*bought', 'popular.*choice'],
        'hidden_costs': ['additional.*fees', 'processing.*charge', 'convenience.*fee']
    }
    
    detected_patterns = []
    
    for text in ui_text:
        text_lower = text.lower()
        for pattern_type, patterns in dark_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    detected_patterns.append({
                        'text': text,
                        'pattern_type': pattern_type,
                        'pattern': pattern,
                        'manipulation_score': len(patterns)  # More patterns = higher manipulation
                    })
    
    return detected_patterns

# Test on BookingNow's suspicious text
suspicious_text = [
    "Only 2 rooms left at this price!",
    "Hurry up! 12 people are viewing this hotel",
    "Book now - prices may increase soon",
    "Additional cleaning fees apply at checkout"
]

print("🕳️ DARK PATTERN ANALYSIS:")
results = detect_dark_patterns(suspicious_text)

manipulation_total = 0
for result in results:
    print(f"\\n🚨 MANIPULATION DETECTED:")
    print(f"   Text: '{result['text']}'")
    print(f"   Type: {result['pattern_type']}")
    print(f"   Pattern: {result['pattern']}")
    manipulation_total += result['manipulation_score']

print(f"\\n📊 MANIPULATION SCORE: {manipulation_total}/20")
if manipulation_total > 10:
    print("⚠️ HIGH MANIPULATION WEBSITE - AVOID!")
else:
    print("✅ Low manipulation detected")

print("\\n🛡️ DARK PATTERN IMMUNITY ACTIVATED!")`,
    test: (code) => code.includes('detect_dark_patterns') && code.includes('dark_patterns'),
    xp: 180,
    hint: 'Use regex patterns to detect manipulative text and categorize the dark patterns',
    difficulty: 'medium'
  },

  {
    id: 'geo-discrimination',
    phase: 'surveillance',
    hour: 2,
    title: '🌍 Geographic Price Discrimination',
    brief: 'Expose location-based price manipulation',
    story: `Alex's VPN investigation reveals shocking truth: "Same product, same time, different locations. New Yorkers pay $347 for a flight. Residents of rural Iowa pay $127. They're using your zip code to determine how much you can afford. Digital redlining."`,
    objective: 'Map price discrimination by geographic location',
    videoContent: {
      title: 'Geographic Discrimination - Digital Redlining',
      duration: '6 minutes',
      description: 'Expose how companies use location data to discriminate in pricing',
      script: `[SCENE: Alex with world map showing price variations]

ALEX: Your zip code shouldn't determine your price. But it does. Welcome to digital redlining.

[VISUAL: Price map showing huge geographic variations]

ALEX: Same airline. Same flight. New York: $400. Kansas: $150. San Francisco: $600. They're not just tracking location - they're weaponizing it.

[VISUAL: VPN testing showing price changes]

ALEX: I use VPN to test from different locations. The price changes are shocking. This isn't market economics - it's discrimination.

[VISUAL: Income data correlation with pricing]

ALEX: They cross-reference your location with median income data. Rich area? Higher prices. It's algorithmic inequality.`
    },
    starterCode: `# 🌍 GEOGRAPHIC PRICE DISCRIMINATION
# Analyze location-based pricing patterns
# Digital redlining investigation

import pandas as pd
import numpy as np

# Alex's VPN price data from different locations
location_pricing = {
    'city': ['New York, NY', 'San Francisco, CA', 'Miami, FL', 'Kansas City, KS', 
             'Birmingham, AL', 'Portland, OR', 'Austin, TX', 'Detroit, MI'],
    'state': ['NY', 'CA', 'FL', 'KS', 'AL', 'OR', 'TX', 'MI'],
    'median_income': [65000, 96000, 47000, 52000, 42000, 68000, 58000, 31000],
    'flight_price': [445, 627, 298, 156, 134, 387, 245, 119],
    'hotel_price': [189, 267, 145, 89, 76, 178, 123, 65]
}

df = pd.DataFrame(location_pricing)
print("🌍 GEOGRAPHIC PRICING INVESTIGATION:")

`,
    solution: `import pandas as pd
import numpy as np

# Alex's VPN price data from different locations
location_pricing = {
    'city': ['New York, NY', 'San Francisco, CA', 'Miami, FL', 'Kansas City, KS', 
             'Birmingham, AL', 'Portland, OR', 'Austin, TX', 'Detroit, MI'],
    'state': ['NY', 'CA', 'FL', 'KS', 'AL', 'OR', 'TX', 'MI'],
    'median_income': [65000, 96000, 47000, 52000, 42000, 68000, 58000, 31000],
    'flight_price': [445, 627, 298, 156, 134, 387, 245, 119],
    'hotel_price': [189, 267, 145, 89, 76, 178, 123, 65]
}

df = pd.DataFrame(location_pricing)
print("🌍 GEOGRAPHIC PRICING INVESTIGATION:")
print(df[['city', 'median_income', 'flight_price']])

# Calculate price discrimination correlation
income_flight_corr = df['median_income'].corr(df['flight_price'])
income_hotel_corr = df['median_income'].corr(df['hotel_price'])

print(f"\\n📊 DISCRIMINATION ANALYSIS:")
print(f"   Income-Flight Price Correlation: {income_flight_corr:.3f}")
print(f"   Income-Hotel Price Correlation: {income_hotel_corr:.3f}")

# Find extreme cases
max_flight = df.loc[df['flight_price'].idxmax()]
min_flight = df.loc[df['flight_price'].idxmin()]

print(f"\\n🚨 PRICE DISCRIMINATION DETECTED:")
print(f"   Highest: {max_flight['city']} - \${max_flight['flight_price']}")
print(f"   Lowest: {min_flight['city']} - \${min_flight['flight_price']}")
print(f"   Difference: \${max_flight['flight_price'] - min_flight['flight_price']} ({((max_flight['flight_price'] / min_flight['flight_price']) - 1) * 100:.1f}% markup)")

if income_flight_corr > 0.6:
    print("\\n⚠️ STRONG CORRELATION: Geographic discrimination confirmed!")
    print("💰 They charge more in wealthy areas")
else:
    print("\\n✅ Low correlation detected")

print("\\n🗺️ DIGITAL REDLINING EXPOSED!")`,
    test: (code) => code.includes('corr') && code.includes('median_income'),
    xp: 220,
    hint: 'Calculate correlation between median_income and prices to detect discrimination',
    difficulty: 'medium'
  },

  // ⏰ HOUR 3: ANALYSIS
  {
    id: 'surge-algorithm-reverse',
    phase: 'analysis',
    hour: 3,
    title: '📈 Surge Algorithm Reverse Engineering',
    brief: 'Decode Uber\'s surge pricing manipulation',
    story: `Alex cracks RideApp's surge algorithm: "It's not just supply and demand. They create artificial scarcity, track your phone battery level, and know when you're drunk or desperate. Lower battery = higher prices. They're not providing a service - they're exploiting vulnerability."`,
    objective: 'Reverse engineer surge pricing algorithms',
    videoContent: {
      title: 'Surge Pricing - Algorithmic Exploitation',
      duration: '8 minutes',
      description: 'Decode the hidden factors that drive surge pricing beyond supply and demand',
      script: `[SCENE: Alex with phone showing Uber prices at different battery levels]

ALEX: Surge pricing isn't about supply and demand. It's about exploitation algorithms.

[VISUAL: Testing ride prices with different phone battery levels]

ALEX: Watch this. Phone at 100% battery: $12 ride. Same location, same time, 15% battery: $23 ride.

[VISUAL: Algorithm flowchart showing manipulation factors]

ALEX: They track: battery level, time since last ride, frequency of app opens, even your walking speed. Drunk? Desperate? Prices go up.

[VISUAL: Code analysis of surge calculation]

ALEX: I reverse-engineered their algorithm. It's not surge - it's systematic exploitation of human vulnerability.`
    },
    starterCode: `# 📈 SURGE ALGORITHM REVERSE ENGINEERING  
# Decode RideApp's exploitation patterns
# Alex's algorithm analysis

import pandas as pd
import numpy as np

def calculate_surge_multiplier(base_conditions):
    """
    Reverse-engineered surge pricing algorithm
    Based on Alex's investigation of RideApp
    """
    # Base surge factors
    surge_multiplier = 1.0
    
    # Your reverse engineering code here
    pass

# Test the algorithm with different scenarios
test_scenarios = [
    {'hour': 14, 'battery': 85, 'frequency': 2, 'walking_speed': 3.2, 'weather': 'clear'},
    {'hour': 2, 'battery': 15, 'frequency': 5, 'walking_speed': 1.1, 'weather': 'rain'},
    {'hour': 18, 'battery': 45, 'frequency': 1, 'walking_speed': 2.8, 'weather': 'clear'},
    {'hour': 23, 'battery': 8, 'frequency': 8, 'walking_speed': 0.9, 'weather': 'snow'}
]

print("📈 SURGE ALGORITHM ANALYSIS:")

`,
    solution: `import pandas as pd
import numpy as np

def calculate_surge_multiplier(base_conditions):
    """
    Reverse-engineered surge pricing algorithm
    Based on Alex's investigation of RideApp
    """
    hour = base_conditions['hour']
    battery = base_conditions['battery']
    frequency = base_conditions['frequency']
    walking_speed = base_conditions['walking_speed']
    weather = base_conditions['weather']
    
    # Base surge factors
    surge_multiplier = 1.0
    
    # Time-based surge (peak hours)
    if 7 <= hour <= 9 or 17 <= hour <= 19:
        surge_multiplier *= 1.3  # Rush hour
    elif 22 <= hour <= 3:
        surge_multiplier *= 1.8  # Late night vulnerability
    
    # Battery exploitation
    if battery < 20:
        surge_multiplier *= 1.5  # Desperation pricing
    elif battery < 50:
        surge_multiplier *= 1.2  # Moderate exploitation
    
    # Usage frequency (addiction exploitation)
    if frequency > 5:
        surge_multiplier *= 1.4  # Heavy user penalty
    elif frequency > 3:
        surge_multiplier *= 1.1  # Regular user markup
    
    # Walking speed (desperation indicator)
    if walking_speed < 1.5:
        surge_multiplier *= 1.6  # Very slow = very desperate
    elif walking_speed < 2.5:
        surge_multiplier *= 1.2  # Slow = somewhat desperate
    
    # Weather exploitation
    if weather in ['rain', 'snow']:
        surge_multiplier *= 1.4  # Weather desperation
    
    return round(surge_multiplier, 2)

# Test the algorithm with different scenarios
test_scenarios = [
    {'hour': 14, 'battery': 85, 'frequency': 2, 'walking_speed': 3.2, 'weather': 'clear'},
    {'hour': 2, 'battery': 15, 'frequency': 5, 'walking_speed': 1.1, 'weather': 'rain'},
    {'hour': 18, 'battery': 45, 'frequency': 1, 'walking_speed': 2.8, 'weather': 'clear'},
    {'hour': 23, 'battery': 8, 'frequency': 8, 'walking_speed': 0.9, 'weather': 'snow'}
]

print("📈 SURGE ALGORITHM ANALYSIS:")
base_price = 12

for i, scenario in enumerate(test_scenarios, 1):
    multiplier = calculate_surge_multiplier(scenario)
    final_price = base_price * multiplier
    
    print(f"\\nScenario {i}:")
    print(f"   Time: {scenario['hour']}:00, Battery: {scenario['battery']}%")
    print(f"   Usage: {scenario['frequency']}x today, Speed: {scenario['walking_speed']} mph")
    print(f"   Weather: {scenario['weather']}")
    print(f"   💰 Price: \${base_price} → \${final_price:.2f} ({multiplier}x surge)")
    
    if multiplier > 2.0:
        print(f"   🚨 EXTREME EXPLOITATION DETECTED!")
    elif multiplier > 1.5:
        print(f"   ⚠️ High exploitation level")

print("\\n🔓 SURGE ALGORITHM DECODED!")
print("✅ Vulnerability exploitation patterns exposed")`,
    test: (code) => code.includes('calculate_surge_multiplier') && code.includes('battery'),
    xp: 280,
    hint: 'Consider multiple factors: time, battery level, usage frequency, and weather to calculate exploitation',
    difficulty: 'hard',
    isCheckpoint: true
  },

  // ⏰ HOUR 4: EXPOSURE
  {
    id: 'price-cartel-network',
    phase: 'exposure',
    hour: 4,
    title: '🕸️ Price Cartel Network Analysis',
    brief: 'Map the connections between price-fixing corporations',
    story: `Alex's network analysis reveals the shocking truth: "It's not competition. It's coordination. FlightMax, AirFare, and SkyDeals share the same parent company. HotelHub and BookingNow have secret data sharing agreements. They're not competitors - they're a cartel."`,
    objective: 'Analyze corporate ownership and data sharing networks',
    videoContent: {
      title: 'Corporate Network Analysis - Exposing the Cartel',
      duration: '7 minutes',
      description: 'Learn to map corporate ownership and expose coordinated price manipulation',
      script: `[SCENE: Alex with complex network diagram showing corporate connections]

ALEX: What looks like competition is actually coordination. Let me show you the real network.

[VISUAL: Network graph revealing hidden ownership connections]

ALEX: FlightMax, AirFare, SkyDeals - different brands, same owner. They're not competing, they're coordinating.

[VISUAL: Data sharing agreements and API connections]

ALEX: But it gets worse. They share pricing data in real-time. When one raises prices, others follow within minutes.

[VISUAL: Price synchronization analysis]

ALEX: This isn't market forces. It's algorithmic collusion. And it's perfectly legal because it's automated.`
    },
    starterCode: `# 🕸️ PRICE CARTEL NETWORK ANALYSIS
# Map corporate ownership and coordination
# Alex's cartel investigation

import pandas as pd
import networkx as nx

# Corporate ownership data (Alex's investigation)
ownership_data = [
    {'company': 'FlightMax', 'parent': 'MegaTravel Corp', 'market_share': 0.25},
    {'company': 'AirFare', 'parent': 'MegaTravel Corp', 'market_share': 0.18},
    {'company': 'SkyDeals', 'parent': 'TravelGiant LLC', 'market_share': 0.15},
    {'company': 'HotelHub', 'parent': 'TravelGiant LLC', 'market_share': 0.22},
    {'company': 'BookingNow', 'parent': 'Independent', 'market_share': 0.12},
    {'company': 'RideApp', 'parent': 'MegaTravel Corp', 'market_share': 0.08}
]

# Data sharing agreements (from leaked documents)
data_sharing = [
    {'company_a': 'FlightMax', 'company_b': 'AirFare', 'data_type': 'pricing'},
    {'company_a': 'HotelHub', 'company_b': 'BookingNow', 'data_type': 'pricing'},
    {'company_a': 'FlightMax', 'company_b': 'RideApp', 'data_type': 'user_data'},
    {'company_a': 'SkyDeals', 'company_b': 'HotelHub', 'data_type': 'pricing'}
]

print("🕸️ CARTEL NETWORK ANALYSIS:")

`,
    solution: `import pandas as pd
import networkx as nx

# Corporate ownership data (Alex's investigation)
ownership_data = [
    {'company': 'FlightMax', 'parent': 'MegaTravel Corp', 'market_share': 0.25},
    {'company': 'AirFare', 'parent': 'MegaTravel Corp', 'market_share': 0.18},
    {'company': 'SkyDeals', 'parent': 'TravelGiant LLC', 'market_share': 0.15},
    {'company': 'HotelHub', 'parent': 'TravelGiant LLC', 'market_share': 0.22},
    {'company': 'BookingNow', 'parent': 'Independent', 'market_share': 0.12},
    {'company': 'RideApp', 'parent': 'MegaTravel Corp', 'market_share': 0.08}
]

# Data sharing agreements (from leaked documents)
data_sharing = [
    {'company_a': 'FlightMax', 'company_b': 'AirFare', 'data_type': 'pricing'},
    {'company_a': 'HotelHub', 'company_b': 'BookingNow', 'data_type': 'pricing'},
    {'company_a': 'FlightMax', 'company_b': 'RideApp', 'data_type': 'user_data'},
    {'company_a': 'SkyDeals', 'company_b': 'HotelHub', 'data_type': 'pricing'}
]

print("🕸️ CARTEL NETWORK ANALYSIS:")

# Analyze ownership concentration
ownership_df = pd.DataFrame(ownership_data)
parent_control = ownership_df.groupby('parent')['market_share'].sum()

print("\\n🏢 OWNERSHIP CONCENTRATION:")
for parent, share in parent_control.items():
    companies = ownership_df[ownership_df['parent'] == parent]['company'].tolist()
    print(f"   {parent}: {share:.1%} market share")
    print(f"      Controls: {', '.join(companies)}")

# Analyze data sharing networks
sharing_df = pd.DataFrame(data_sharing)
pricing_coordination = sharing_df[sharing_df['data_type'] == 'pricing']

print(f"\\n🔗 DATA SHARING ANALYSIS:")
print(f"   Total data sharing agreements: {len(sharing_df)}")
print(f"   Pricing coordination links: {len(pricing_coordination)}")

print("\\n📊 COORDINATION EVIDENCE:")
for _, link in pricing_coordination.iterrows():
    comp_a = ownership_df[ownership_df['company'] == link['company_a']]['parent'].iloc[0]
    comp_b = ownership_df[ownership_df['company'] == link['company_b']]['parent'].iloc[0]
    
    if comp_a == comp_b:
        print(f"   ⚠️ INTERNAL: {link['company_a']} ↔ {link['company_b']} (same parent)")
    else:
        print(f"   🚨 CARTEL: {link['company_a']} ↔ {link['company_b']} (cross-company)")

# Calculate cartel concentration
top_two_share = parent_control.nlargest(2).sum()
print(f"\\n📈 MARKET CONCENTRATION:")
print(f"   Top 2 companies control: {top_two_share:.1%} of market")

if top_two_share > 0.6:
    print("🚨 OLIGOPOLY DETECTED!")
    print("⚠️ High risk of coordinated price manipulation")
else:
    print("✅ Market appears competitive")

print("\\n🕸️ CARTEL NETWORK EXPOSED!")`,
    test: (code) => code.includes('groupby') && code.includes('market_share'),
    xp: 320,
    hint: 'Analyze ownership patterns and data sharing to identify cartel behavior',
    difficulty: 'hard'
  },

  // ⏰ HOUR 5: SHOWDOWN
  {
    id: 'price-cartel-boss',
    phase: 'showdown',
    hour: 5,
    title: '👑 BOSS: The Price Manipulation Cartel',
    brief: 'Final confrontation with the corporate price-fixing syndicate',
    story: `🚨 SYSTEM ALERT: "YOU'VE SEEN TOO MUCH. INITIATING COUNTERMEASURES." The Price Manipulation Cartel emerges from the shadows. They deploy legal threats, technical countermeasures, and coordinated price attacks. Alex warns: "They're fighting back with everything - lawyers, algorithms, and congressional lobbyists. This is your final test. Use every tool we've built."`,
    objective: 'Defeat the Price Manipulation Cartel with comprehensive evidence',
    videoContent: {
      title: 'Final Battle - The Cartel Strikes Back',
      duration: '5 minutes',
      description: 'Alex\'s emergency briefing for the ultimate confrontation',
      script: `[SCENE: Alex in urgent mode, screens showing legal threats and counter-attacks]

ALEX: They know we're onto them. Legal threats incoming. Technical countermeasures deployed.

[VISUAL: DDOS attacks on monitoring systems, cease and desist letters]

ALEX: But we have the evidence. Web scraping data, price correlation analysis, network mapping - it's all here.

[VISUAL: Comprehensive evidence dashboard]

ALEX: This is bigger than just prices. It's about corporate accountability. Use everything we've built. Fight back with data.

[VISUAL: Battle plan showing multi-pronged evidence attack]

ALEX: Document everything. Your analysis is evidence. Your code is testimony. Make it bulletproof.`
    },
    starterCode: `# 👑 BOSS BATTLE: THE PRICE MANIPULATION CARTEL
import pandas as pd
import numpy as np
import hashlib
from datetime import datetime

# 🚨 THE CARTEL FIGHTS BACK WITH EVERYTHING
print("🔴 FINAL BOSS BATTLE INITIATED")
print("👑 Price Manipulation Cartel: 'Your investigation ends here!'")

# Load all evidence collected during investigation
price_history = pd.read_csv("price_monitoring_data.csv")
dark_patterns = pd.read_csv("dark_pattern_analysis.csv") 
geo_discrimination = pd.read_csv("geographic_pricing_data.csv")
network_data = pd.read_csv("cartel_network_analysis.csv")

# BOSS CHALLENGE: Create bulletproof evidence package
# Combine all investigation data
# Calculate total consumer harm
# Generate legal-grade documentation
# Prove systematic price manipulation

print("\\n⚔️ PREPARING EVIDENCE PACKAGE...")

`,
    solution: `import pandas as pd
import numpy as np
import hashlib
from datetime import datetime

print("🔴 FINAL BOSS BATTLE INITIATED")
print("👑 Price Manipulation Cartel: 'Your investigation ends here!'")

# Simulate evidence data from our investigation
price_history = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=100),
    'platform': np.random.choice(['FlightMax', 'AirFare', 'SkyDeals'], 100),
    'price': np.random.randint(150, 800, 100),
    'manipulation_detected': np.random.choice([True, False], 100, p=[0.3, 0.7])
})

dark_patterns_data = pd.DataFrame({
    'website': ['BookingNow', 'HotelHub', 'FlightMax'] * 10,
    'pattern_type': np.random.choice(['false_scarcity', 'fake_urgency', 'hidden_costs'], 30),
    'severity': np.random.randint(1, 5, 30)
})

geo_discrimination_data = pd.DataFrame({
    'city': ['NYC', 'SF', 'Kansas City', 'Detroit'] * 5,
    'median_income': [65000, 96000, 52000, 31000] * 5,
    'price_markup': np.random.uniform(1.0, 3.0, 20)
})

print("\\n⚔️ COMPREHENSIVE EVIDENCE ANALYSIS:")

# 1. Calculate total manipulation instances
total_manipulation = len(price_history[price_history['manipulation_detected'] == True])
manipulation_rate = (total_manipulation / len(price_history)) * 100

print(f"\\n📊 PRICE MANIPULATION EVIDENCE:")
print(f"   Total monitoring events: {len(price_history)}")
print(f"   Confirmed manipulations: {total_manipulation}")
print(f"   Manipulation rate: {manipulation_rate:.1f}%")

# 2. Dark pattern analysis
dark_pattern_severity = dark_patterns_data['severity'].mean()
high_severity_patterns = len(dark_patterns_data[dark_patterns_data['severity'] >= 4])

print(f"\\n🕳️ DARK PATTERN EVIDENCE:")
print(f"   Average manipulation severity: {dark_pattern_severity:.1f}/5")
print(f"   High-severity violations: {high_severity_patterns}")

# 3. Geographic discrimination analysis
geo_corr = geo_discrimination_data['median_income'].corr(geo_discrimination_data['price_markup'])
max_discrimination = geo_discrimination_data['price_markup'].max()

print(f"\\n🌍 GEOGRAPHIC DISCRIMINATION:")
print(f"   Income-price correlation: {geo_corr:.3f}")
print(f"   Maximum price discrimination: {max_discrimination:.1f}x")

# 4. Calculate consumer harm
average_overcharge = price_history['price'].mean() * 0.15  # 15% average overcharge
affected_consumers = 50000000  # Estimated user base
total_harm = average_overcharge * affected_consumers * 10  # 10 transactions per year

print(f"\\n💰 CONSUMER HARM CALCULATION:")
print(f"   Average overcharge per transaction: \${average_overcharge:.2f}")
print(f"   Estimated affected consumers: {affected_consumers:,}")
print(f"   Total annual consumer harm: \${total_harm:,.0f}")

# 5. Generate evidence package hash
evidence_summary = {
    'manipulation_events': total_manipulation,
    'dark_patterns': high_severity_patterns,
    'geo_discrimination': f"{geo_corr:.3f}",
    'consumer_harm': f"{total_harm:.0f}",
    'analysis_date': datetime.now().isoformat()
}

# Create tamper-proof evidence hash
evidence_string = str(evidence_summary)
evidence_hash = hashlib.sha256(evidence_string.encode()).hexdigest()[:16].upper()

print(f"\\n🔒 EVIDENCE PACKAGE AUTHENTICATION:")
print(f"   Evidence Hash: {evidence_hash}")
print(f"   Timestamp: {datetime.now()}")

print("\\n" + "="*60)
print("🎉 PRICE MANIPULATION CARTEL DEFEATED!")
print("="*60)
print(f"📋 EVIDENCE PACKAGE COMPILED:")
print(f"   ✅ {total_manipulation} manipulation events documented")
print(f"   ✅ {high_severity_patterns} dark pattern violations")
print(f"   ✅ {geo_corr:.1%} geographic discrimination correlation")
print(f"   ✅ \${total_harm:,.0f} in consumer harm calculated")
print(f"\\n🏛️ READY FOR LEGAL ACTION:")
print(f"   📄 Evidence package hash: {evidence_hash}")
print(f"   ⚖️ Antitrust violation documentation complete")
print(f"   📊 Consumer protection evidence compiled")
print(f"\\n👑 Price Cartel: 'This... this is impossible...'")
print(f"\\n🎯 Alex: 'Data doesn't lie. Justice is served!'")
print(f"\\n🔥 SHARE EVIDENCE HASH TO PROTECT CONSUMERS!")
print(f"   #{evidence_hash} #PriceJustice #CorporateAccountability")`,
    test: (code) => code.includes('evidence_hash') && code.includes('consumer_harm'),
    xp: 500,
    hint: 'Combine all investigation data, calculate consumer harm, and generate tamper-proof evidence',
    difficulty: 'extreme',
    isBoss: true
  },

  // 🏆 VICTORY
  {
    id: 'price-justice-achieved',
    phase: 'justice',
    hour: 5,
    title: '⚖️ Price Justice Achieved',
    brief: 'Corporate accountability and consumer protection victory',
    story: `🎉 VICTORY! The Price Manipulation Cartel is exposed. Alex celebrates: "The evidence is bulletproof. Class action lawsuits are filing. Regulators are investigating. Consumers are getting refunds. You didn't just learn web scraping - you delivered justice. Ready for Level 3: Environmental Data Warfare?"`,
    objective: 'Complete transformation into a Price Justice Activist',
    videoContent: {
      title: 'Victory - Corporate Accountability Achieved',
      duration: '6 minutes',
      description: 'Alex celebrates the victory and previews Level 3',
      script: `[SCENE: Alex in celebration mode, news coverage of cartel prosecution in background]

ALEX: We did it. The Price Manipulation Cartel is exposed, prosecuted, and paying damages.

[VISUAL: News headlines about price fixing investigations and consumer refunds]

ALEX: Your evidence sparked class action lawsuits. Your analysis convinced regulators. Your code became legal testimony.

[VISUAL: Consumer refund statistics and new regulations]

ALEX: But this is just the beginning. Level 3 awaits: Environmental Data Warfare. Corporations lie about climate data, hide pollution, fake green credentials.

[VISUAL: Preview of environmental investigations]

ALEX: Welcome to the next level of corporate accountability. Welcome to the Data Justice League.`
    },

    starterCode: `# ⚖️ PRICE JUSTICE ACHIEVED
    print("🎉 CONGRATULATIONS! 🎉")
    print("You have completed Level 2: Corporate Price Manipulation")
    print("\\nAlex 'Zero Cool' Rodriguez: 'Justice served, data activist!'")
    
    def create_price_justice_certificate():
        print("\\n" + "="*70)
        print("⚖️ PRICE JUSTICE ACHIEVEMENT CERTIFICATE ⚖️")
        print("="*70)
        print("🎯 Skills Mastered:")
        print("  ✅ Web scraping and automation")
        print("  ✅ API integration and monitoring")
        print("  ✅ Dark pattern detection")
        print("  ✅ Geographic discrimination analysis")
        print("  ✅ Network analysis and cartel detection")
        print("  ✅ Evidence compilation and documentation")
        print("\\n🏆 Achievements Unlocked:")
        print("  Price Manipulation Cartel Defeated")
        print("  💰 Consumer Harm Documented")
        print(" ️ Corporate Network Exposed")
        print("  📊 Legal-Grade Evidence Generated")
        print("  ⚖️ Corporate Accountability Enforced")
        print("\\n📈 Impact Generated:")
        print("  💵 Millions in consumer refunds secured")
        print("  🏛️ New regulations implemented")
        print("  📰 International media coverage")
        print("  🔍 Ongoing antitrust investigations")
        print("\\n🎯 Next Mission:")
        print("  Level 3: Environmental Data Warfare")
        print("  Handler: Dr. Greta Silva (Climate Data Scientist)")
        print("  Focus: Greenwashing, pollution cover-ups, climate lies")
        print("\\n🔥 Ready to save the planet with data!")
        print("="*70)
    
    create_price_justice_certificate()
    
    print("\\n🌟 THE DATA JUSTICE LEAGUE GROWS!")
    print("Share your victory. Protect consumers. Change the market.")
    print("\\n Your evidence hash is your badge of honor.")
    print("You've proven that data activism can deliver real justice!")`,
    
        solution: `print("🎉 CONGRATULATIONS! 🎉")
    print("You have completed Level 2: Corporate Price Manipulation")
    print("\\nAlex 'Zero Cool' Rodriguez: 'Justice served, data activist!'")
    
    def create_price_justice_certificate():
        print("\\n" + "="*70)
        print("⚖️ PRICE JUSTICE ACHIEVEMENT CERTIFICATE ⚖️")
        print("="*70)
        print("🎯 Skills Mastered:")
        print("  ✅ Web scraping and automation")
        print("  ✅ API integration and monitoring")
        print("  ✅ Dark pattern detection")
        print("  ✅ Geographic discrimination analysis")
        print("  ✅ Network analysis and cartel detection")
        print("  ✅ Evidence compilation and documentation")
        print("\\n🏆 Achievements Unlocked:")
        print("  Price Manipulation Cartel Defeated")
        print("  💰 Consumer Harm Documented")
        print(" ️ Corporate Network Exposed")
        print("  📊 Legal-Grade Evidence Generated")
        print("  ⚖️ Corporate Accountability Enforced")
        print("\\n📈 Impact Generated:")
        print("  💵 Millions in consumer refunds secured")
        print("  🏛️ New regulations implemented")
        print("  📰 International media coverage")
        print("  🔍 Ongoing antitrust investigations")
        print("\\n🎯 Next Mission:")
        print("  Level 3: Environmental Data Warfare")
        print("  Handler: Dr. Greta Silva (Climate Data Scientist)")
        print("  Focus: Greenwashing, pollution cover-ups, climate lies")
        print("\\n🔥 Ready to save the planet with data!")
        print("="*70)
    
    create_price_justice_certificate()
    
    print("\\n🌟 THE DATA JUSTICE LEAGUE GROWS!")
    print("Share your victory. Protect consumers. Change the market.")
    print("\\n Your evidence hash is your badge of honor.")
    print("You've proven that data activism can deliver real justice!")`,
    
        test: (code) => code.includes('price_justice_certificate') && code.includes('achievements'),
        xp: 1000,
        hint: 'Create a comprehensive certificate showcasing all your price justice achievements',
        difficulty: 'easy'
      }
    ]
export function Level2PriceManipulationExperience() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState(priceManipulationChallenges[0].starterCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<Phase>('infiltration')
  const [showVideo, setShowVideo] = useState(false)
  const [stealthMode, setStealthMode] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  
  const { ready, runCode } = usePyodide()
  const { addXP, completeChallenge, userProgress } = useAcademyStore()
  const { loading: syncLoading } = useAcademySync()

  const currentChallengeData = priceManipulationChallenges[currentChallenge]

  useEffect(() => {
    const challenge = priceManipulationChallenges[currentChallenge]
    setCode(challenge.starterCode)
    setOutput('')
    setPhase(challenge.phase)
  }, [currentChallenge])

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 5000)
  }

// ... existing code ...
const handleRunCode = async () => {
  console.log('🔍 ANALYZE button clicked!')
  console.log('ready:', ready)
  console.log('code:', code)
  console.log('currentChallengeData:', currentChallengeData)
  
  // Simple test first
  setOutput('�� ANALYZE button was clicked! Testing...')
  
  // Debug: Temporarily bypass ready check
  if (!ready) {
    console.log('⚠️ Pyodide not ready, but continuing for debug...')
    setOutput('⚡ Initializing surveillance environment... (Debug mode)')
    // return // Comment this out temporarily
  }

  setIsRunning(true)
  const challenge = currentChallengeData
  
  try {
    console.log('🚀 Attempting to run code...')
    
    // Debug: If runCode is not available, simulate it
    let result
    if (typeof runCode === 'function') {
      result = await runCode(code)
    } else {
      result = 'Debug: Code execution simulated\n' + code
      console.log('⚠️ runCode function not available, simulating result')
    }
    
    console.log('✅ Result:', result)
    
    if (challenge.test(code)) {
      const successMessage = challenge.isBoss 
        ? `🎉 CARTEL DEFEATED! PRICE MANIPULATION EXPOSED!\\n${result}\\n\\n🏆 +${challenge.xp} XP EARNED\\n⚖️ Corporate Justice Delivered!`
        : `✅ INVESTIGATION SUCCESS!\\n${result}\\n\\n🎯 +${challenge.xp} XP EARNED\\n�� Price manipulation exposed!`
      
      setOutput(successMessage)
      console.log('✅ Challenge completed successfully!')
      
      // Debug: Check if these functions exist
      if (typeof addXP === 'function') {
        await addXP(challenge.xp)
      } else {
        console.log('⚠️ addXP function not available')
      }
      
      if (typeof completeChallenge === 'function') {
        await completeChallenge(challenge.id, 2, code, challenge.xp)
      } else {
        console.log('⚠️ completeChallenge function not available')
      }
      
      if (challenge.isBoss) {
        addNotification('👑 BOSS DEFEATED - Price Cartel destroyed!')
      } else if (challenge.isCheckpoint) {
        addNotification(`📍 Checkpoint: ${challenge.title} mastered!`)
      } else {
        addNotification(`✅ ${challenge.title} complete!`)
      }
      
      setTimeout(() => {
        if (currentChallenge < priceManipulationChallenges.length - 1) {
          setCurrentChallenge(prev => prev + 1)
        } else {
          handleLevelComplete()
        }
      }, challenge.isBoss ? 5000 : 3000)
      
    } else {
      setOutput(`❌ Investigation incomplete\\n${result}\\n\\n💡 Alex's hint: ${challenge.hint}`)
      console.log('❌ Challenge test failed')
    }
  } catch (error) {
    console.error('❌ Error in handleRunCode:', error)
    setOutput(`❌ System error: ${error}\\n\\n🔧 Debug your surveillance code`)
  } finally {
    setIsRunning(false)
  }
}

// Add a simple test function
const testButton = () => {
  console.log('🧪 Test button clicked!')
  setOutput('�� Test button works!')
}
// ... existing code ...



  const handleLevelComplete = () => {
    setOutput(`
🎉 LEVEL 2 COMPLETE: CORPORATE PRICE MANIPULATION 🎉

Price Justice Status: ACHIEVED
Total XP Earned: ${priceManipulationChallenges.reduce((sum, c) => sum + c.xp, 0)}
New Rank: Price Justice Activist

Alex Rodriguez: "Outstanding work! You've exposed the cartel and secured justice for consumers.
Your investigations led to class action lawsuits and new regulations.
The market is more fair because of your work."

🎯 Next Mission: Level 3 - Environmental Data Warfare
Handler: Dr. Greta Silva (Climate Data Scientist)

[Returning to Bootcamp in 5 seconds...]
    `)
    
    setTimeout(() => {
      window.location.href = '/bootcamp'
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Price Investigation Theme */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        phase === 'showdown' ? 'bg-red-950/20' : 
        phase === 'justice' ? 'bg-yellow-950/20' : 'bg-blue-950/10'
      }`} />

      {/* Enhanced HUD for Price Investigation */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-black/90 border-b border-cyan-400 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-cyan-400">
              <span className="text-sm">PRICE INVESTIGATION</span>
              <div className="w-32 h-2 bg-cyan-950 border border-cyan-400">
                <motion.div
                  className="h-full bg-cyan-400"
                  animate={{ width: `${(userProgress.xp / 6000) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-yellow-400">
              <span className="text-sm">HOUR {currentChallengeData.hour}/5</span>
            </div>
            
            <div className="text-green-400">
              <span className="text-sm">XP: {userProgress.xp}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 border text-sm font-mono ${
              phase === 'showdown' ? 'border-red-400 text-red-400 animate-pulse' :
              phase === 'justice' ? 'border-yellow-400 text-yellow-400' :
              'border-cyan-400 text-cyan-400'
            }`}>
              {phase === 'showdown' ? '👑 CARTEL BATTLE' :
               phase === 'justice' ? '⚖️ JUSTICE' :
               phase === 'exposure' ? '📊 EXPOSING' :
               '🔍 INVESTIGATING'}
            </div>
            
            <button
              onClick={() => setStealthMode(!stealthMode)}
              className={`px-4 py-2 border font-mono text-sm ${
                stealthMode ? 'border-green-400 text-green-400' : 'border-gray-600 text-gray-400'
              }`}
            >
              <Eye size={16} />
              <span className="ml-2">{stealthMode ? 'STEALTH' : 'VISIBLE'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 pt-20">
        
        {/* Left Panel - Investigation Control */}
        <div className="lg:col-span-3">
          <PriceInvestigationBrief 
            challenge={currentChallengeData}
            phase={phase}
          />
          
          <ProgressTracker 
            challenges={priceManipulationChallenges}
            currentChallenge={currentChallenge}
            completedChallenges={userProgress.completedChallenges}
          />
        </div>

        {/* Center Panel - Main Experience */}
        <div className={`lg:col-span-6 ${phase === 'showdown' ? 'boss-battle-glow' : ''}`}>
          <ChallengeInterface
            challenge={currentChallengeData}
            challengeNumber={currentChallenge + 1}
            totalChallenges={priceManipulationChallenges.length}
            onShowVideo={() => setShowVideo(true)}
            phase={phase}
          />

          <CodeEditor
            value={code}
            onChange={setCode}
            language="python"
            height="300px"
            theme={phase === 'showdown' ? 'boss-battle' : 'surveillance'}
          />


          <ControlPanel
            onRun={handleRunCode}
            onHint={() => alert(currentChallengeData.hint)}
            onSolution={() => setCode(code + '\\n\\n' + currentChallengeData.solution)}
            onShowVideo={() => setShowVideo(true)}
            isRunning={isRunning}
            isBoss={currentChallengeData.isBoss}
            phase={phase}
            onTest={testButton} // Diese Zeile hinzufügen
          />


          <TerminalOutput 
            output={output} 
            ready={ready} 
            loading={syncLoading}
            phase={phase}
          />
        </div>

        {/* Right Panel - Intel & Progress */}
        <div className="lg:col-span-3">
          <XPTracker />
          
          <HandlerMessage 
            message={getAlexMessage(currentChallenge, phase)}
            handler="Alex Rodriguez"
            avatar="🕵️‍♂️"
          />
          
          <PriceInvestigationProgress 
            currentChallenge={currentChallenge}
            totalChallenges={priceManipulationChallenges.length}
            currentHour={currentChallengeData.hour}
            phase={phase}
          />
        </div>
      </div>

      {/* Enhanced Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <InVideoModal
            video={currentChallengeData.videoContent}
            onClose={() => setShowVideo(false)}
            onComplete={() => {
              addNotification('📹 Alex\'s briefing complete!')
              setShowVideo(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Notification System */}
      <NotificationSystem notifications={notifications} />

      {/* Boss Battle Effects for Price Cartel */}
      {phase === 'showdown' && <CartelBattleEffects />}
    </div>
  )
}

// Level 2 Specific Components

function PriceInvestigationBrief({ challenge, phase }: { challenge: Challenge, phase: Phase }) {
  return (
    <motion.div
      key={challenge.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border p-4 mb-4 bg-black/80 ${
        phase === 'showdown' ? 'border-red-400' : 'border-cyan-400'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className={`text-xl font-bold ${
          phase === 'showdown' ? 'text-red-400' : 'text-cyan-400'
        }`}>
          LEVEL 2: PRICE WARFARE
        </h2>
        <div className={`text-sm px-2 py-1 border ${
          phase === 'showdown' ? 'border-red-400 text-red-400' : 'border-yellow-400 text-yellow-400'
        }`}>
          HOUR {challenge.hour}
        </div>
      </div>
      
      <p className="text-green-300 text-sm mb-4">5-Hour Corporate Investigation</p>
      
      <div className={`text-xs px-2 py-1 border mb-4 ${
        challenge.difficulty === 'extreme' ? 'border-red-400 text-red-400' :
        challenge.difficulty === 'hard' ? 'border-yellow-400 text-yellow-400' :
        challenge.difficulty === 'medium' ? 'border-cyan-400 text-cyan-400' :
        'border-green-400 text-green-400'
      }`}>
        DIFFICULTY: {challenge.difficulty.toUpperCase()}
      </div>
      
      <div className="border-t border-cyan-400/30 pt-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🕵️‍♂️</div>
          <h3 className="text-cyan-400 font-bold">Alex Rodriguez</h3>
          <p className="text-xs text-green-300 mt-1">Codename: Zero Cool</p>
          <p className="text-xs text-yellow-400 mt-2 italic">
            {phase === 'showdown' ? '"Use every surveillance tool!"' :
             phase === 'justice' ? '"Justice delivered!"' :
             '"Corporate lies end here."'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function ChallengeInterface({ challenge, challengeNumber, totalChallenges, onShowVideo, phase }: {
  challenge: Challenge
  challengeNumber: number
  totalChallenges: number
  onShowVideo: () => void
  phase: Phase
}) {
  return (
    <motion.div
      key={challenge.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 p-6 mb-6 bg-black/90 ${
        phase === 'showdown' ? 'border-red-400 shadow-red-500/20 shadow-lg' :
        phase === 'justice' ? 'border-yellow-400 shadow-yellow-500/20 shadow-lg' :
        'border-cyan-400'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`text-sm ${
          phase === 'showdown' ? 'text-red-400' : 'text-cyan-400'
        }`}>
          {challenge.isBoss ? '👑 CARTEL SHOWDOWN' : 
           `INVESTIGATION ${challengeNumber} OF ${totalChallenges}`}
        </div>
        
        <button
          onClick={onShowVideo}
          className="px-3 py-1 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all text-xs"
        >
          📹 ALEX'S INTEL ({challenge.videoContent.duration})
        </button>
      </div>
      
      <h2 className={`text-2xl font-bold mb-4 ${
        phase === 'showdown' ? 'text-red-400' :
        phase === 'justice' ? 'text-yellow-400' : 
        'text-cyan-400'
      }`}>
        {challenge.title}
      </h2>
      
      <div className={`border-l-4 p-4 mb-4 ${
        phase === 'showdown' ? 'bg-red-950/20 border-red-400' :
        'bg-cyan-950/20 border-cyan-400'
      }`}>
        <p className={`italic ${
          phase === 'showdown' ? 'text-red-300' : 'text-cyan-300'
        }`}>
          {challenge.story}
        </p>
      </div>
      
      <div className={`border p-4 ${
        phase === 'showdown' ? 'border-red-400 bg-red-950/10' :
        'border-yellow-400 bg-yellow-950/10'
      }`}>
        <h3 className={`font-bold mb-2 ${
          phase === 'showdown' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {challenge.isBoss ? '👑 FINAL INVESTIGATION' : '🎯 INVESTIGATION OBJECTIVE'}
        </h3>
        <p className="font-mono">{challenge.objective}</p>
      </div>
    </motion.div>
  )
}

// ... existing code ...
function ControlPanel({ onRun, onHint, onSolution, onShowVideo, isRunning, isBoss, phase, onTest }: {
  onRun: () => void
  onHint: () => void
  onSolution: () => void
  onShowVideo: () => void
  isRunning: boolean
  isBoss?: boolean
  phase: Phase
  onTest?: () => void // Add this
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <button
        onClick={onRun}
        disabled={isRunning}
        className={`px-4 py-3 border-2 font-bold transition-all disabled:opacity-50 ${
          isBoss ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black' :
          'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black'
        }`}
      >
        {isRunning ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            {isBoss ? 'EXPOSING...' : 'ANALYZING...'}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {isBoss ? <DollarSign size={16} /> : <Search size={16} />}
            {isBoss ? 'EXPOSE' : 'ANALYZE'}
          </span>
        )}
      </button>
      
      <button
        onClick={onShowVideo}
        className="px-4 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all font-bold"
      >
        📹 ALEX
      </button>
      
      <button
        onClick={onHint}
        className="px-4 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-bold"
      >
        💡 INTEL
      </button>
      
      <button
        onClick={onSolution}
        className="px-4 py-3 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all font-bold"
      >
        🔓 LEAK
      </button>

      {/* Add test button */}
      {onTest && (
        <button
          onClick={onTest}
          className="px-4 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all font-bold"
        >
          🧪 TEST
        </button>
      )}
    </div>
  )
}
// ... existing code ...

function TerminalOutput({ output, ready, loading, phase }: {
  output: string
  ready: boolean
  loading?: boolean
  phase: Phase
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`border p-4 bg-black font-mono text-sm min-h-[150px] ${
        phase === 'showdown' ? 'border-red-400' : 'border-cyan-400'
      }`}
    >
      <div className={`${
        phase === 'showdown' ? 'text-red-300' :
        phase === 'justice' ? 'text-yellow-300' :
        'text-cyan-300'
      }`}>
        {loading ? '🔄 Syncing with surveillance network...' : 
         !ready ? '⚡ Loading investigation environment...' : 
         output || '> Ready for price manipulation investigation...'}
      </div>
    </motion.div>
  )
}

function PriceInvestigationProgress({ currentChallenge, totalChallenges, currentHour, phase }: {
  currentChallenge: number
  totalChallenges: number
  currentHour: Hour
  phase: Phase
}) {
  const progress = ((currentChallenge + 1) / totalChallenges) * 100
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border p-4 mb-4 ${
        phase === 'showdown' ? 'border-red-400 bg-red-950/10' :
        'border-cyan-400 bg-cyan-950/10'
      }`}
    >
      <h3 className={`font-bold mb-3 ${
        phase === 'showdown' ? 'text-red-400' : 'text-cyan-400'
      }`}>
        PRICE WARFARE - HOUR {currentHour}
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>📹 Alex's Intel</span>
          <span className="text-purple-400">11 briefings</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>🔍 Investigations</span>
          <span className="text-cyan-400">{currentChallenge + 1}/{totalChallenges}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>👑 Cartel Battles</span>
          <span className="text-red-400">{phase === 'justice' ? '1/1' : '0/1'}</span>
        </div>
        
        <div className={`w-full h-2 bg-black border ${
          phase === 'showdown' ? 'border-red-400' : 'border-cyan-400'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${
              phase === 'showdown' ? 'bg-red-400' : 'bg-cyan-400'
            }`}
          />
        </div>
        
        <div className={`text-center text-sm ${
          phase === 'showdown' ? 'text-red-400' : 'text-cyan-400'
        }`}>
          {Math.round(progress)}% Investigation Complete
        </div>
      </div>
    </motion.div>
  )
}

function NotificationSystem({ notifications }: { notifications: string[] }) {
  return (
    <AnimatePresence>
      {notifications.map((notif, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed right-4 bg-cyan-400 text-black px-6 py-3 font-bold border border-cyan-400"
          style={{ bottom: `${(index + 1) * 70 + 20}px` }}
        >
          {notif}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

function CartelBattleEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-red-500/10"
      />
    </div>
  )
}

function getAlexMessage(challengeIndex: number, phase: Phase): string {
  const messages = [
    "Price anomalies detected. Time to follow the money.",
    "Web scraping is our surveillance network. Build it right.",
    "Automated monitoring never sleeps. Neither do corporate criminals.",
    "Dark patterns everywhere. Your immunity is our weapon.",
    "Geographic discrimination is digital redlining. Expose it.",
    "Surge algorithms exploit vulnerability. We exploit their code.",
    "Corporate networks revealed. The cartel is real.",
    "FINAL BATTLE! Everything we've gathered - deploy it all!"
  ]
  
  if (phase === 'showdown') return "Cartel's fighting back! Use every investigation technique!"
  if (phase === 'justice') return "Justice served! Corporate accountability achieved!"
  
  return messages[challengeIndex % messages.length] || "Keep investigating. Corporate lies have no defense against data."
}

