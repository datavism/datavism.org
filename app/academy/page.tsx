'use client'

import Link from 'next/link'
import { Terminal, Lock, Star, Trophy, Users, Clock } from 'lucide-react'

export default function AcademyPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-yellow-400 glitch-text">
            DATA UNDERGROUND ACADEMY
          </h1>
          <p className="text-xl text-green-300 max-w-3xl mx-auto">
            12 weeks from Excel victim to data vigilante. Learn Python, SQL, and Machine Learning 
            by investigating real corruption. No toy projects. No fake datasets. Real impact.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center bg-black/50 border border-green-400/30 p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">2,847</div>
            <div className="text-sm text-green-400">Active Students</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">12</div>
            <div className="text-sm text-green-400">Weeks Program</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">€12.3M</div>
            <div className="text-sm text-green-400">Corruption Exposed</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">247</div>
            <div className="text-sm text-green-400">Investigations</div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Weeks 1-4 */}
          <div className="bg-black/50 border border-green-400/30 p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">WEEKS 1-4</h3>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Foundation & Python</h4>
            <ul className="space-y-2 text-green-300 text-sm">
              <li>• System Breach: First Contact</li>
              <li>• Excel Liberation with Pandas</li>
              <li>• Financial Crime Detection</li>
              <li>• Shell Company Networks</li>
              <li>• Money Laundering Patterns</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-green-400/30">
              <div className="text-xs text-green-400/60">SKILLS UNLOCKED</div>
              <div className="text-sm text-green-300">Python, Pandas, Data Cleaning, Basic Analytics</div>
            </div>
          </div>

          {/* Weeks 5-8 */}
          <div className="bg-black/50 border border-yellow-400/30 p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">WEEKS 5-8</h3>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">SQL & Databases</h4>
            <ul className="space-y-2 text-green-300 text-sm">
              <li>• Database Infiltration</li>
              <li>• Complex Query Operations</li>
              <li>• Network Analysis</li>
              <li>• Transaction Tracking</li>
              <li>• Government Contract Fraud</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-yellow-400/30">
              <div className="text-xs text-yellow-400/60">SKILLS UNLOCKED</div>
              <div className="text-sm text-green-300">Advanced SQL, Graph Theory, Network Analysis</div>
            </div>
          </div>

          {/* Weeks 9-12 */}
          <div className="bg-black/50 border border-red-400/30 p-8">
            <h3 className="text-2xl font-bold text-red-400 mb-4">WEEKS 9-12</h3>
            <h4 className="text-lg font-bold text-red-400 mb-4">Machine Learning</h4>
            <ul className="space-y-2 text-green-300 text-sm">
              <li>• Anomaly Detection AI</li>
              <li>• Pattern Recognition</li>
              <li>• Predictive Analytics</li>
              <li>• Text Mining & NLP</li>
              <li>• Final Investigation Project</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-red-400/30">
              <div className="text-xs text-red-400/60">SKILLS UNLOCKED</div>
              <div className="text-sm text-green-300">ML, AI, Neural Networks, NLP</div>
            </div>
          </div>
        </div>

        {/* Current Available Content */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
            CURRENTLY AVAILABLE
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Week 1 - Available */}
            <div className="bg-black/50 border border-green-400 p-6 relative">
              <div className="absolute top-4 right-4">
                <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">
                  AVAILABLE
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="text-green-400" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-green-400">WEEK 1: SYSTEM BREACH</h3>
                  <div className="text-sm text-green-300">First Contact & Excel Liberation</div>
                </div>
              </div>
              
              <p className="text-green-300 text-sm mb-4">
                Corporate databases use Excel to hide crimes. Today, you learn to expose them with Python and Pandas.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Challenge 1: First Contact</span>
                  <span className="text-yellow-400">+50 XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Challenge 2: Data Liberation</span>
                  <span className="text-yellow-400">+75 XP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Boss Battle: Excel Overlord</span>
                  <span className="text-red-400">+300 XP</span>
                </div>
              </div>
              
              <Link
                href="/academy/week/1"
                className="w-full block text-center px-6 py-3 bg-green-400 text-black font-bold hover:bg-green-300 transition-colors"
              >
                START WEEK 1
              </Link>
            </div>

            {/* Week 2 - Coming Soon */}
            <div className="bg-black/50 border border-gray-600 p-6 relative opacity-60">
              <div className="absolute top-4 right-4">
                <div className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                  COMING SOON
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-gray-400" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-gray-400">WEEK 2: DEEP INFILTRATION</h3>
                  <div className="text-sm text-gray-500">Advanced Pandas & Financial Crime</div>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-4">
                Dive deeper into financial datasets. Uncover sophisticated money laundering operations.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Challenge 3: Money Trail</span>
                  <span>+100 XP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Challenge 4: Shell Games</span>
                  <span>+150 XP</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Boss Battle: The Laundromat</span>
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
            JOIN THE DATA UNDERGROUND
          </h3>
          <p className="text-xl text-green-300 mb-8 max-w-2xl mx-auto">
            Complete all 12 weeks to become a certified Data Investigator. 
            Every challenge you solve exposes real corruption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/academy/week/1"
              className="px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              START TRAINING NOW
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