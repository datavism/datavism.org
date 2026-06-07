'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDatavist } from '@/lib/store/useDatavist'
import { getMissionBySlug } from '@/lib/data/missions'
import { Workbench } from '@/components/workbench/Workbench'

export default function MissionWorkbenchPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const { profile } = useDatavist()
  const router = useRouter()

  const mission = getMissionBySlug(resolvedParams.slug)

  useEffect(() => {
    if (!profile) {
      router.push('/awaken')
    }
  }, [profile, router])

  // Profile not loaded yet — show authentication screen
  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-2 animate-pulse tracking-wider">
            AUTHENTICATING OPERATIVE...
          </div>
          <div className="text-green-400/30 text-xs tracking-[0.3em]">
            SECURE CHANNEL INITIALIZING
          </div>
        </div>
      </div>
    )
  }

  // Mission not found — terminal 404
  if (!mission) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="max-w-xl w-full mx-4">
          <div className="border border-red-500/40 bg-red-950/10 p-8">
            <div className="text-red-400 text-xs tracking-[0.3em] mb-4">
              // ERROR 404 — MISSION NOT FOUND
            </div>
            <div className="text-red-300 text-2xl font-bold tracking-wider mb-4">
              CLASSIFIED FILE MISSING
            </div>
            <div className="text-red-400/60 text-sm mb-2">
              Mission slug: <span className="text-red-300">{resolvedParams.slug}</span>
            </div>
            <div className="text-red-400/40 text-xs mb-6 leading-relaxed">
              The requested mission dossier could not be located in the resistance database.
              It may have been redacted, or the access path is incorrect.
            </div>
            <div className="border-t border-red-500/20 pt-4 flex gap-4">
              <button
                onClick={() => router.push('/ops')}
                className="px-6 py-2 border border-green-500/40 text-green-400 text-xs tracking-wider hover:bg-green-500/10 hover:border-green-400 transition-all"
              >
                RETURN TO MISSION BOARD
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <Workbench mission={mission} />
}
