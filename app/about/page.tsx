'use client'

import { Shield, Target, Users } from 'lucide-react'
import Link from 'next/link'



export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-yellow-400 glitch-text">
            THE MANIFESTO
          </h1>
          <p className="text-xl text-green-300 max-w-2xl mx-auto">
            Why algorithms control you. How data activism frees you. What we're building together.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* The Problem */}
          <section className="border-l-4 border-red-500 pl-8 bg-red-950/10 py-8 pr-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-red-500" size={32} />
              <h2 className="text-3xl font-bold text-red-400">THE PROBLEM</h2>
            </div>
            <div className="space-y-4 text-green-300 leading-relaxed text-lg">
              <p>
                In 2025, <strong className="text-red-400">algorithms control more of your life than you realize</strong>. 
                What you see on social media, what prices you pay, what jobs you get offered, what news you read—
                all determined by code designed to manipulate your behavior for profit.
              </p>
              <p>
                <strong className="text-red-400">Your data is weaponized against you</strong>. 
                Companies know you better than you know yourself. They use sophisticated machine learning 
                to predict and influence your decisions. They create filter bubbles that polarize society. 
                They manipulate prices based on your location, device, and browsing history.
              </p>
              <p>
                <strong className="text-red-400">Meanwhile, citizens are kept in the dark</strong>. 
                These algorithms are black boxes. The data is locked away. The manipulation techniques 
                are trade secrets. We're told to "trust the algorithm" while being systematically exploited.
              </p>
              <p className="text-red-300 font-bold">
                You are not the customer—you are the product being optimized.
              </p>
            </div>
          </section>

          {/* The Solution */}
          <section className="border-l-4 border-yellow-500 pl-8 bg-yellow-950/10 py-8 pr-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-yellow-500" size={32} />
              <h2 className="text-3xl font-bold text-yellow-400">THE SOLUTION</h2>
            </div>
            <div className="space-y-4 text-green-300 leading-relaxed text-lg">
              <p>
                <strong className="text-yellow-400">Datavism is the first educational platform that teaches data science through activism</strong>. 
                You don't learn Python by analyzing flower datasets. You don't master SQL with employee records. 
                You don't build machine learning models with wine quality data.
              </p>
              <p>
                <strong className="text-yellow-400">You learn by exposing real algorithmic manipulation</strong>. 
                Every challenge you complete reveals actual corporate deception. Every algorithm you build 
                helps detect real bias in AI systems. Every visualization you create exposes authentic 
                digital manipulation.
              </p>
              <p>
                <strong className="text-yellow-400">This is education with impact</strong>. 
                When you complete Level 12 of our bootcamp, you won't just have a certificate. 
                You'll have helped expose algorithmic bias, revealed corporate greenwashing, and contributed 
                to digital transparency worldwide.
              </p>
              <p className="text-yellow-300 font-bold">
                Your homework assignments make the digital world more transparent.
              </p>
            </div>
          </section>

          {/* The Mission */}
          <section className="border-l-4 border-green-500 pl-8 bg-green-950/10 py-8 pr-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-green-500" size={32} />
              <h2 className="text-3xl font-bold text-green-400">THE MISSION</h2>
            </div>
            <div className="space-y-4 text-green-300 leading-relaxed text-lg">
              <p>
                <strong className="text-green-400">Transform 100,000 citizens into data activists</strong>. 
                Create a global network of people who can see through algorithmic manipulation. 
                Make digital transparency unstoppable.
              </p>
              <p>
                <strong className="text-green-400">Build the infrastructure for algorithmic accountability</strong>. 
                When thousands of trained data activists can analyze every major algorithm, 
                corporate manipulation becomes impossible to hide.
              </p>
              <p>
                <strong className="text-green-400">Democratize the tools of digital literacy</strong>. 
                The same data science techniques used by corporations to manipulate you should be 
                in your hands to hold them accountable.
              </p>
              <p className="text-green-300 font-bold">
                When every citizen can analyze algorithms, manipulation has nowhere to hide.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-black/50 border border-green-400/30 p-12 mt-16">
            <h3 className="text-3xl font-bold text-yellow-400 mb-6">
              READY TO JOIN THE REVOLUTION?
            </h3>
            <p className="text-xl text-green-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Every algorithm you decode. Every bias you expose. 
              Every manipulation you uncover. You're not just learning—you're fighting back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/bootcamp"
                className="px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
              >
                START YOUR TRAINING
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-green-400 text-green-400 font-bold text-lg hover:bg-green-400 hover:text-black transition-all duration-300"
              >
                SECURE CONTACT
              </Link>
            </div>
          </section>

          {/* Quote */}
          <section className="text-center mt-16">
            <blockquote className="text-2xl text-green-400 font-mono max-w-3xl mx-auto mb-4">
              "The best way to hide manipulation is in an algorithm. 
              The best way to expose it is with Python."
            </blockquote>
            <cite className="text-green-400/60 text-lg">
              — Ghost, Founder of The Data Underground
            </cite>
          </section>
        </div>
      </div>
    </div>
  )
}