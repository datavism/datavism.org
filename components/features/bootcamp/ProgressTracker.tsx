'use client'

interface Challenge {
  id: string
  title: string
}

interface ProgressTrackerProps {
  challenges: Challenge[]
  currentChallenge: number
  completedChallenges: string[]
}

export function ProgressTracker({ challenges, currentChallenge, completedChallenges }: ProgressTrackerProps) {
  return (
    <div className="border border-green-400/50 p-4 bg-black/50 mb-4">
      <h3 className="text-green-400 font-bold mb-3">MISSION PROGRESS</h3>
      <div className="space-y-2">
        {challenges.map((challenge: Challenge, i: number) => (
          <div
            key={challenge.id}
            className={`flex items-center gap-2 p-2 text-sm ${
              completedChallenges.includes(`week1-${challenge.id}`) 
                ? 'text-green-400' 
                : i === currentChallenge 
                ? 'text-yellow-400 bg-yellow-950/20 border-l-2 border-yellow-400' 
                : 'text-gray-600'
            }`}
          >
            <span>{completedChallenges.includes(`week1-${challenge.id}`) ? '✓' : i === currentChallenge ? '▶' : '○'}</span>
            <span>{challenge.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}