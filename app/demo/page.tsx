'use client'

import { useState } from 'react'
import { MayaDialogue, MayaDialogues } from '@/components/ui/MayaDialogue'
import { TypewriterText, TypewriterSequence } from '@/components/ui/TypewriterText'
import { useSound } from '@/lib/hooks/useSound'
import { Volume2, VolumeX } from 'lucide-react'

export default function DemoPage() {
  const [showDialogue, setShowDialogue] = useState(false)
  const [dialogueType, setDialogueType] = useState<keyof typeof MayaDialogues>('welcome')
  const { playSound, toggleSound, isEnabled } = useSound()

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-green-400">
            🎮 Interactive Features Demo
          </h1>
          <button
            onClick={toggleSound}
            className="p-3 rounded-lg border border-green-400 bg-green-950/20 hover:bg-green-950/40 transition-colors"
          >
            {isEnabled ? (
              <Volume2 className="w-6 h-6 text-green-400" />
            ) : (
              <VolumeX className="w-6 h-6 text-red-400" />
            )}
          </button>
        </div>

        {/* Typewriter Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-cyan-400">1. Typewriter Effect</h2>
          <div className="p-6 rounded-lg border border-cyan-400 bg-cyan-950/20">
            <TypewriterText
              text="This is an animated typewriter effect. It types one character at a time..."
              speed={30}
              className="text-cyan-400 font-mono"
            />
          </div>
        </section>

        {/* Typewriter Sequence Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">2. Typewriter Sequence</h2>
          <div className="p-6 rounded-lg border border-yellow-400 bg-yellow-950/20">
            <TypewriterSequence
              lines={[
                "Line 1: Multiple lines can be typed in sequence.",
                "Line 2: Each line waits for the previous to complete.",
                "Line 3: Perfect for dialogue and story beats!"
              ]}
              speed={25}
              lineDelay={400}
              className="text-yellow-400 font-mono"
            />
          </div>
        </section>

        {/* Sound Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-magenta-400">3. Sound System</h2>
          <div className="p-6 rounded-lg border border-magenta-400 bg-magenta-950/20">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => playSound('typing')}
                className="p-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors text-white"
              >
                🎹 Typing
              </button>
              <button
                onClick={() => playSound('success')}
                className="p-3 rounded bg-green-800 hover:bg-green-700 transition-colors text-white"
              >
                ✅ Success
              </button>
              <button
                onClick={() => playSound('error')}
                className="p-3 rounded bg-red-800 hover:bg-red-700 transition-colors text-white"
              >
                ❌ Error
              </button>
              <button
                onClick={() => playSound('glitch')}
                className="p-3 rounded bg-purple-800 hover:bg-purple-700 transition-colors text-white"
              >
                ⚡ Glitch
              </button>
              <button
                onClick={() => playSound('notification')}
                className="p-3 rounded bg-cyan-800 hover:bg-cyan-700 transition-colors text-white"
              >
                🔔 Notification
              </button>
            </div>
          </div>
        </section>

        {/* Maya Dialogue Demo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400">4. Maya Dialogue System</h2>

          {/* Controls */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                setDialogueType('welcome')
                setShowDialogue(false)
                setTimeout(() => setShowDialogue(true), 100)
              }}
              className="px-4 py-2 rounded border border-green-400 bg-green-950/20 hover:bg-green-950/40 transition-colors text-green-400"
            >
              👋 Welcome
            </button>
            <button
              onClick={() => {
                setDialogueType('urgent')
                setShowDialogue(false)
                setTimeout(() => setShowDialogue(true), 100)
              }}
              className="px-4 py-2 rounded border border-red-400 bg-red-950/20 hover:bg-red-950/40 transition-colors text-red-400"
            >
              🚨 Urgent
            </button>
            <button
              onClick={() => {
                setDialogueType('success')
                setShowDialogue(false)
                setTimeout(() => setShowDialogue(true), 100)
              }}
              className="px-4 py-2 rounded border border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 transition-colors text-cyan-400"
            >
              🎯 Success
            </button>
            <button
              onClick={() => {
                setDialogueType('alert')
                setShowDialogue(false)
                setTimeout(() => setShowDialogue(true), 100)
              }}
              className="px-4 py-2 rounded border border-yellow-400 bg-yellow-950/20 hover:bg-yellow-950/40 transition-colors text-yellow-400"
            >
              ⚠ Alert
            </button>
          </div>

          {/* Dialogue Display */}
          {showDialogue && (
            <MayaDialogue
              {...MayaDialogues[dialogueType]}
              onComplete={() => console.log('Dialogue complete!')}
            />
          )}
        </section>

        {/* All Character Types */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400">5. All Character Types</h2>

          <MayaDialogue
            character="maya"
            text="This is Maya Chen speaking. I can guide you through the resistance."
            emotion="neutral"
            onComplete={() => {}}
          />

          <MayaDialogue
            character="resistance"
            text="Resistance Network online. All channels encrypted."
            emotion="neutral"
            onComplete={() => {}}
          />

          <MayaDialogue
            character="system"
            text="System: Connection established. Python environment loaded."
            emotion="neutral"
            onComplete={() => {}}
          />

          <MayaDialogue
            character="alert"
            text="ALERT: Suspicious activity detected!"
            emotion="urgent"
            glitchEffect={true}
            onComplete={() => {}}
          />
        </section>

        {/* Usage Instructions */}
        <section className="space-y-4 mt-12 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold text-gray-400">How to Use in Level 1</h2>
          <div className="p-6 rounded-lg bg-gray-900 text-gray-300 font-mono text-sm space-y-3">
            <p>// Import the components:</p>
            <code className="block text-green-400">
              import {'{ MayaDialogue }'} from '@/components/ui/MayaDialogue'
            </code>

            <p className="pt-4">// Use in your challenges:</p>
            <code className="block text-yellow-400">
              {`<MayaDialogue
  character="maya"
  text="Your first lesson begins now..."
  emotion="neutral"
  onComplete={() => unlockCodeEditor()}
/>`}
            </code>

            <p className="pt-4">// Or use sequences:</p>
            <code className="block text-cyan-400">
              {`<MayaDialogue
  character="maya"
  text={[
    "I built these algorithms.",
    "Now I'll teach you to break them.",
    "Let's begin..."
  ]}
  emotion="proud"
  onComplete={() => startChallenge()}
/>`}
            </code>
          </div>
        </section>
      </div>
    </div>
  )
}
