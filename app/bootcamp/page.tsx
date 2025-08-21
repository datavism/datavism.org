'use client'

import Link from 'next/link'
import { Terminal, Lock, Star, Trophy, Users, Clock } from 'lucide-react'

export default function BootcampPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-yellow-400 glitch-text crt-text">
            DATAVISM BOOTCAMP
          </h1>
          <p className="text-xl text-green-300 max-w-3xl mx-auto">
            12 levels from data victim to data activist. Learn Python, SQL, and Machine Learning 
            by exposing algorithmic manipulation. No toy projects. No fake datasets. Real impact.
          </p>
          <div className="mt-6 text-cyan-400 text-lg font-mono">
            → "Turn Data into Activism."
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center bg-black/50 border border-green-400/30 p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">2,847</div>
            <div className="text-sm text-green-400">Data Activists</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">12</div>
            <div className="text-sm text-green-400">Levels Program</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">€12.3M</div>
            <div className="text-sm text-green-400">Corporate BS Exposed</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">89</div>
            <div className="text-sm text-green-400">Algorithms Decoded</div>
          </div>
        </div>

        {/* Learning Tracks */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Level 1-4: Data Awakening */}
          <div className="bg-black/50 border border-green-400/30 p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">LEVEL 1-4</h3>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Data Awakening</h4>
            <p className="text-green-300 text-sm mb-4">Python fundamentals through real corporate manipulation</p>
            <ul className="space-y-2 text-green-300 text-sm">
              <li>• <strong>Digital Detox:</strong> Social media algorithm analysis</li>
              <li>• <strong>Price Manipulation:</strong> Dynamic pricing detection</li>
              <li>• <strong>Greenwashing Hunter:</strong> Corporate sustainability lies</li>
              <li>• <strong>Algorithm Bias:</strong> AI discrimination patterns</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-green-400/30">
              <div className="text-xs text-green-400/60">SKILLS UNLOCKED</div>
              <div className="text-sm text-green-300">Python, Pandas, Data Cleaning, Web Scraping</div>
            </div>
          </div>

          {/* Level 5-8: Digital Detective */}
          <div className="bg-black/50 border border-yellow-400/30 p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">LEVEL 5-8</h3>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Digital Detective</h4>
            <p className="text-green-300 text-sm mb-4">SQL + Advanced Analytics + Data Visualization</p>
            <ul className="space-y-2 text-green-300 text-sm">
              <li>• <strong>Database Infiltration:</strong> Corporate data mining</li>
              <li>• <strong>Climate Truth:</strong> Real vs. reported emissions</li>
              <li>• <strong>Media Manipulation:</strong> Statistical misrepresentation</li>
              <li>• <strong>Network Analysis:</strong> Corporate connection mapping</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-yellow-400/30">
              <div className="text-xs text-yellow-400/60">SKILLS UNLOCKED</div>
              <div className="text-sm text-green-300">Advanced SQL, Network Analysis, Data Visualization</div>
            </div>
          </div>

          {/* Level 9-12: AI Activist */}
          <div className="bg-black/50 border border-red-400/30 p-8">
            <h3 className="text-2xl font-bold text-red-400 mb-4">LEVEL 9-12</h3>
            <h4 className="text-lg font-bold text-red-400 mb-4">AI Activist</h4>
            <p className="text-green-300 text-sm mb-4">Machine Learning + AI Bias Detection</p>
            <ul className="space-y-2 text-green-300 text-sm">
              <li>• <strong>Bias Detection AI:</strong> Build discrimination detectors</li>
              <li>• <strong>Deepfake Hunter:</strong> AI-generated content detection</li>
              <li>• <strong>Recommendation Reversal:</strong> Algorithm manipulation exposure</li>
              <li>• <strong>Final Mission:</strong> Your own data activism project</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-red-400/30">
              <div className="text-xs text-red-400/60">SKILLS UNLOCKED</div>
              <div className="text-sm text-green-300">ML, AI Ethics, Neural Networks, NLP</div>
            </div>
          </div>
        </div>

        {/* Currently Available */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
            CURRENTLY AVAILABLE
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Level 1 - Available */}
            <div className="bg-black/50 border border-green-400 p-6 relative">
              <div className="absolute top-4 right-4">
                <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">
                  AVAILABLE
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="text-green-400" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-green-400">LEVEL 1: DIGITAL DETOX</h3>
                  <div className="text-sm text-green-300">Social Media Algorithm Analysis</div>
                </div>
              </div>
              
              <p className="text-green-300 text-sm mb-4">
                Your Instagram feed is not random. Today, you learn to expose how algorithms manipulate your behavior.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Mission 1: Algorithm Awakening</span>
                  <span className="text-yellow-400">+50 XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Mission 2: Data Liberation</span>
                  <span className="text-yellow-400">+75 XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Boss Battle: The Algorithm Overlord</span>
                  <span className="text-red-400">+300 XP</span>
                </div>
              </div>
              
              <Link
                href="/bootcamp/level/1"
                className="w-full block text-center px-6 py-3 bg-green-400 text-black font-bold hover:bg-green-300 transition-colors"
              >
                START LEVEL 1
              </Link>
            </div>

            {/* Level 2 - Coming Soon */}
            <div className="bg-black/50 border border-gray-600 p-6 relative opacity-60">
              <div className="absolute top-4 right-4">
                <div className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                  COMING SOON
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-gray-400" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-gray-400">LEVEL 2: PRICE MANIPULATION</h3>
                  <div className="text-sm text-gray-500">Dynamic Pricing Detective</div>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-4">
                Ever notice how flight prices change when you refresh? Time to decode dynamic pricing algorithms.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Mission 3: Price Tracker</span>
                  <span>+100 XP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Mission 4: Surge Decoder</span>
                  <span>+150 XP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Boss Battle: The Surge Pricing Syndicate</span>
                  <span>+400 XP</span>
                </div>
              </div>
              
              <button
                disabled
                className="w-full block text-center px-6 py-3 bg-gray-700 text-gray-400 font-bold cursor-not-allowed"
              >
                LOCKED
              </button>
            </div>
          </div>
        </div>

        {/* Join CTA */}
        <div className="text-center bg-black/50 border border-yellow-400/30 p-12">
          <h3 className="text-3xl font-bold text-yellow-400 mb-6">
            JOIN THE DATA ACTIVISM MOVEMENT
          </h3>
          <p className="text-xl text-green-300 mb-8 max-w-2xl mx-auto">
            Complete all 12 levels to become a certified Data Activist. 
            Every mission you complete exposes real digital manipulation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bootcamp/level/1"
              className="px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              START BOOTCAMP NOW
            </Link>
            <Link
              href="/community"
              className="px-8 py-4 bg-transparent border-2 border-green-400 text-green-400 font-bold text-lg hover:bg-green-400 hover:text-black transition-all duration-300"
            >
              JOIN COMMUNITY
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}