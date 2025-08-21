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
            Why we exist. What we fight for. How we're changing the world, one dataset at a time.
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
                In 2025, <strong className="text-red-400">data literacy became the new digital divide</strong>. 
                While corporations use advanced analytics to manipulate markets and governments use 
                algorithms to control populations, citizens are left with Excel and good intentions.
              </p>
              <p>
                <strong className="text-red-400">Corruption is more sophisticated than ever</strong>. 
                Shell companies hide behind complex ownership structures. Money laundering flows through 
                cryptocurrency and offshore accounts. Election manipulation happens through micro-targeted 
                disinformation campaigns.
              </p>
              <p>
                <strong className="text-red-400">Traditional journalism is failing</strong>. Newsrooms are 
                understaffed. Investigative reporting takes months. By the time a story breaks, the damage 
                is done and the criminals have moved on.
              </p>
              <p className="text-red-300 font-bold">
                Meanwhile, they're getting away with everything.
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
                <strong className="text-yellow-400">Datavism is the first educational platform where every lesson serves justice</strong>. 
                You don't learn Python by analyzing flower datasets. You don't master SQL with employee records. 
                You don't build machine learning models with wine quality data.
              </p>
              <p>
                <strong className="text-yellow-400">You learn by exposing real corruption</strong>. 
                Every challenge you complete exposes actual financial crimes. Every algorithm you build 
                helps detect real money laundering. Every visualization you create reveals authentic 
                political manipulation.
              </p>
              <p>
                <strong className="text-yellow-400">This is education with impact</strong>. 
                When you complete Week 12 of our academy, you won't just have a certificate. 
                You'll have helped recover stolen money, exposed corrupt officials, and contributed 
                to ongoing investigations worldwide.
              </p>
              <p className="text-yellow-300 font-bold">
                Your homework assignments make the world a better place.
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
                <strong className="text-green-400">Transform 100,000 citizens into data investigators</strong>. 
                Create a global network of people who can read between the lines of any dataset. 
                Make transparency unstoppable.
              </p>
              <p>
                <strong className="text-green-400">Build the infrastructure for perpetual accountability</strong>. 
                When every major financial transaction is automatically analyzed by thousands of trained 
                investigators, corruption becomes impossible to hide.
              </p>
              <p>
                <strong className="text-green-400">Democratize the tools of power</strong>. 
                The same data science techniques used by corporations to manipulate you should be 
                in your hands to hold them accountable.
              </p>
              <p className="text-green-300 font-bold">
                When every citizen can analyze data, evil has nowhere to hide.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-black/50 border border-green-400/30 p-12 mt-16">
            <h3 className="text-3xl font-bold text-yellow-400 mb-6">
              READY TO JOIN THE REVOLUTION?
            </h3>
            <p className="text-xl text-green-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Every corrupt official you expose. Every hidden network you uncover. 
              Every dollar you recover. You're not just learning—you're fighting back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/academy"
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
              "The best way to hide a lie is in a spreadsheet. 
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