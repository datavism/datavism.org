'use client'

import Link from 'next/link'
import { Terminal, Lock, Star, Trophy, Users, Clock, Brain, Shield, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BootcampPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6 text-yellow-400 glitch-text crt-text"
          >
            DATAVISM BOOTCAMP
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-green-300 max-w-3xl mx-auto"
          >
            8 levels from digital victim to data activist. Learn Python by exposing real algorithmic manipulation. 
            No toy projects. No fake datasets. Real impact on corporate power.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-cyan-400 text-lg font-mono"
          >
            → "The Revolution Will Be Computed."
          </motion.div>
        </div>

        {/* Live Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center bg-black/50 border border-green-400/30 p-6 hover:border-green-400 transition-all">
            <div className="text-2xl font-bold text-yellow-400 mb-2">2,847</div>
            <div className="text-sm text-green-400">Data Activists</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6 hover:border-green-400 transition-all">
            <div className="text-2xl font-bold text-yellow-400 mb-2">8</div>
            <div className="text-sm text-green-400">Active Levels</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6 hover:border-green-400 transition-all">
            <div className="text-2xl font-bold text-yellow-400 mb-2">€1.2M</div>
            <div className="text-sm text-green-400">Corporate Lies Exposed</div>
          </div>
          <div className="text-center bg-black/50 border border-green-400/30 p-6 hover:border-green-400 transition-all">
            <div className="text-2xl font-bold text-yellow-400 mb-2">89%</div>
            <div className="text-sm text-green-400">Completion Rate</div>
          </div>
        </motion.div>

        {/* Featured: Level 1 Experience */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="text-red-400">FEATURED:</span> 
            <span className="text-yellow-400 ml-2">LEVEL 1 - THE AWAKENING</span>
          </h2>
          
          <div className="bg-black/80 border-2 border-green-400 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="text-green-400 text-6xl font-mono leading-none">
                01101000 01100001 01100011 01101011<br/>
                01110100 01101000 01100101 01101101<br/>
                01100001 01110100 01110010 01101001<br/>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-3">
                    <Brain className="text-green-400" size={32} />
                    THE AWAKENING
                  </h3>
                  <p className="text-green-300 mb-6">
                    Your Instagram feed isn't random. Today you discover how social media algorithms 
                    hijack your brain for profit. Meet Maya Chen, ex-Facebook engineer, your guide 
                    to digital liberation.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="text-yellow-400" size={20} />
                      <span className="text-yellow-400 font-bold">4-Hour Interactive Experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="text-yellow-400" size={20} />
                      <span className="text-yellow-400 font-bold">3,175 XP Total Reward</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="text-yellow-400" size={20} />
                      <span className="text-yellow-400 font-bold">1,247 Activists Awakened</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/bootcamp/level/1"
                    className="inline-block px-8 py-4 bg-green-400 text-black font-bold text-lg hover:bg-green-300 transition-all transform hover:scale-105"
                  >
                    🔓 BEGIN AWAKENING
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-cyan-400 mb-4">🎬 4-Hour Journey Structure</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-green-400/30 bg-green-950/10">
                      <div className="text-green-400 font-bold text-lg">1</div>
                      <div>
                        <div className="text-green-400 font-bold">Initiation Protocol</div>
                        <div className="text-green-300 text-sm">Maya's contact • Python basics • First manipulation detector</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-cyan-400/30 bg-cyan-950/10">
                      <div className="text-cyan-400 font-bold text-lg">2</div>
                      <div>
                        <div className="text-cyan-400 font-bold">Data Excavation</div>
                        <div className="text-cyan-300 text-sm">Personal data heist • Vulnerability analysis • Algorithm anatomy</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-yellow-400/30 bg-yellow-950/10">
                      <div className="text-yellow-400 font-bold text-lg">3</div>
                      <div>
                        <div className="text-yellow-400 font-bold">Pattern Warfare</div>
                        <div className="text-yellow-300 text-sm">Reverse-engineer targeting • Maya's confession • Counter-algorithms</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-red-400/30 bg-red-950/10">
                      <div className="text-red-400 font-bold text-lg">4</div>
                      <div>
                        <div className="text-red-400 font-bold">Liberation Protocol</div>
                        <div className="text-red-300 text-sm">Truth visualization • BOSS: Algorithm Overlord • Digital freedom</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Learning Tracks Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
            COMPLETE BOOTCAMP ROADMAP
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Levels 1-2: Awakening */}
            <div className="bg-black/50 border border-green-400/30 p-6 hover:border-green-400 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="text-green-400" size={24} />
                <h3 className="text-lg font-bold text-green-400">LEVELS 1-2</h3>
              </div>
              <h4 className="text-yellow-400 font-bold mb-3">Digital Awakening</h4>
              <ul className="space-y-1 text-green-300 text-sm mb-4">
                <li>• Social Media Manipulation</li>
                <li>• Price Algorithm Exposure</li>
                <li>• Python + Pandas Mastery</li>
                <li>• Data Liberation Skills</li>
              </ul>
              <div className="text-xs text-green-400/60">Skills: Python, Data Analysis</div>
            </div>

            {/* Levels 3-4: Investigation */}
            <div className="bg-black/50 border border-cyan-400/30 p-6 hover:border-cyan-400 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-cyan-400" size={24} />
                <h3 className="text-lg font-bold text-cyan-400">LEVELS 3-4</h3>
              </div>
              <h4 className="text-yellow-400 font-bold mb-3">Digital Detective</h4>
              <ul className="space-y-1 text-cyan-300 text-sm mb-4">
                <li>• Corporate Greenwashing</li>
                <li>• Surveillance Networks</li>
                <li>• Advanced Visualization</li>
                <li>• Pattern Recognition</li>
              </ul>
              <div className="text-xs text-cyan-400/60">Skills: SQL, Web Scraping</div>
            </div>

            {/* Levels 5-6: Warfare */}
            <div className="bg-black/50 border border-yellow-400/30 p-6 hover:border-yellow-400 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-yellow-400" size={24} />
                <h3 className="text-lg font-bold text-yellow-400">LEVELS 5-6</h3>
              </div>
              <h4 className="text-yellow-400 font-bold mb-3">Data Warfare</h4>
              <ul className="space-y-1 text-yellow-300 text-sm mb-4">
                <li>• Financial Manipulation</li>
                <li>• Healthcare Data Crimes</li>
                <li>• Network Analysis</li>
                <li>• API Infiltration</li>
              </ul>
              <div className="text-xs text-yellow-400/60">Skills: APIs, Statistics</div>
            </div>

            {/* Levels 7-8: Revolution */}
            <div className="bg-black/50 border border-red-400/30 p-6 hover:border-red-400 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-red-400" size={24} />
                <h3 className="text-lg font-bold text-red-400">LEVELS 7-8</h3>
              </div>
              <h4 className="text-yellow-400 font-bold mb-3">Digital Revolution</h4>
              <ul className="space-y-1 text-red-300 text-sm mb-4">
                <li>• Democracy Hacking</li>
                <li>• AI Bias Detection</li>
                <li>• Final Liberation</li>
                <li>• Lead the Resistance</li>
              </ul>
              <div className="text-xs text-red-400/60">Skills: ML, Leadership</div>
            </div>
          </div>
        </motion.div>

        {/* Current Availability */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
            AVAILABLE NOW
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Level 1 - Available */}
            <div className="bg-black/80 border-2 border-green-400 p-6 relative group hover:shadow-green-400/20 hover:shadow-xl transition-all">
              <div className="absolute top-4 right-4">
                <div className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded animate-pulse">
                  LIVE NOW
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Brain className="text-green-400 group-hover:animate-pulse" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-green-400">LEVEL 1: THE AWAKENING</h3>
                  <div className="text-sm text-green-300">Social Media Algorithm Liberation</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">👩‍💻 Handler:</span>
                  <span className="text-yellow-400 font-bold">Maya Chen (Ex-Facebook)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">⏱️ Duration:</span>
                  <span className="text-yellow-400 font-bold">4 Hours Interactive</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">🎯 Boss Battle:</span>
                  <span className="text-red-400 font-bold">The Algorithm Overlord</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-400">🏆 Total XP:</span>
                  <span className="text-yellow-400 font-bold">3,175 XP</span>
                </div>
              </div>
              
              <div className="border-t border-green-400/30 pt-4 mb-6">
                <h4 className="text-green-400 font-bold mb-2">🎬 What You'll Experience:</h4>
                <ul className="space-y-1 text-green-300 text-sm">
                  <li>• Decrypt Maya's encrypted resistance messages</li>
                  <li>• Analyze your personal Instagram manipulation data</li>
                  <li>• Build functions that detect emotional triggers</li>
                  <li>• Visualize algorithmic patterns of control</li>
                  <li>• Generate your personal liberation code</li>
                </ul>
              </div>
              
              <Link
                href="/bootcamp/level/1"
                className="w-full block text-center px-6 py-4 bg-green-400 text-black font-bold text-lg hover:bg-green-300 transition-all transform hover:scale-105"
              >
                🚀 START YOUR AWAKENING
              </Link>
            </div>

            {/* Level 2 - Coming Soon */}
            <div className="bg-black/50 border border-gray-600 p-6 relative opacity-70">
              <div className="absolute top-4 right-4">
                <div className="bg-yellow-600 text-black text-xs font-bold px-3 py-1 rounded">
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
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">👨‍💻 Handler:</span>
                  <span className="text-gray-400">Alex "Zero Cool" Rodriguez</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">⏱️ Duration:</span>
                  <span className="text-gray-400">5 Hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">🎯 Boss Battle:</span>
                  <span className="text-gray-400">The Price Manipulation Cartel</span>
                </div>
              </div>
              
              <div className="border-t border-gray-600/30 pt-4 mb-6">
                <h4 className="text-gray-500 font-bold mb-2">📊 Missions Preview:</h4>
                <ul className="space-y-1 text-gray-500 text-sm">
                  <li>• Build surge pricing detection bots</li>
                  <li>• Expose geographic price discrimination</li>
                  <li>• Decode airline price manipulation</li>
                  <li>• Map corporate collusion networks</li>
                </ul>
              </div>
              
              <button
                disabled
                className="w-full block text-center px-6 py-4 bg-gray-700 text-gray-400 font-bold cursor-not-allowed"
              >
                🔒 COMPLETE LEVEL 1 TO UNLOCK
              </button>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-center bg-black/80 border-2 border-yellow-400 p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-green-400/5"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold text-yellow-400 mb-6">
              🔥 JOIN THE DATA REVOLUTION
            </h3>
            <p className="text-xl text-green-300 mb-8 max-w-3xl mx-auto">
              Every algorithm you decode, every manipulation you expose, every person you awaken - 
              you're not just learning code. You're fighting for digital freedom.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/bootcamp/level/1"
                className="px-12 py-5 bg-gradient-to-r from-green-400 to-yellow-400 text-black font-bold text-xl hover:from-green-300 hover:to-yellow-300 transition-all duration-300 transform hover:scale-105"
              >
                🚀 BEGIN LEVEL 1 NOW
              </Link>
              <div className="text-green-300 text-sm">
                <div>✅ Free forever</div>
                <div>✅ No credit card</div>
                <div>✅ Immediate access</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}