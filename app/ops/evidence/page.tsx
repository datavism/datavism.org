'use client'

import { useMemo } from 'react'
import EvidenceBoard, { type EvidenceItem } from '@/components/ops/EvidenceBoard'
import { useDatavist, ROLE_CONFIG } from '@/lib/store/useDatavist'

// ─── Placeholder Evidence ───────────────────────────────────────────
// Pre-populated findings that look like real investigation results.
// These serve as defaults if the user has no stored evidence yet.

function createPlaceholders(): EvidenceItem[] {
  const now = Date.now()
  return [
    {
      id: 'ev-seed-001',
      title: 'Dynamic Pricing by Device Type',
      content:
        'Amazon shows 23% higher prices to iPhone users vs Android in 3/10 product categories. Price differentials appear in electronics, travel, and luxury goods. A/B test methodology confirms device fingerprinting as the trigger.',
      category: 'pricing',
      missionSlug: 'price-watch',
      x: 120,
      y: 80,
      connections: ['ev-seed-003', 'ev-seed-005'],
      createdAt: now - 86400000 * 12,
    },
    {
      id: 'ev-seed-002',
      title: 'Greenwash: Shell Emissions Report',
      content:
        "Shell's 2024 sustainability report claims -15% emissions vs baseline. EPA monitoring data from the same period shows +3%. Discrepancy traced to Scope 3 exclusions and a shifted baseline year from 2018 to 2020.",
      category: 'greenwash',
      missionSlug: 'green-check',
      x: 420,
      y: 60,
      connections: ['ev-seed-006'],
      createdAt: now - 86400000 * 9,
    },
    {
      id: 'ev-seed-003',
      title: 'Outrage Amplification Algorithm',
      content:
        "Instagram's 'Explore' algorithm recommends outrage content 6x more than educational content in the same topic category. Engagement-maximization model weights anger reactions 3.2x higher than shares.",
      category: 'algorithm',
      missionSlug: 'algo-audit',
      x: 180,
      y: 320,
      connections: ['ev-seed-001', 'ev-seed-004'],
      createdAt: now - 86400000 * 7,
    },
    {
      id: 'ev-seed-004',
      title: 'Location Tracking After Opt-Out',
      content:
        'Google continues collecting location data via Wi-Fi triangulation even after user disables Location History. 847 location pings recorded over 72 hours from a "disabled" device. Data transmitted to ads.google.com endpoint.',
      category: 'surveillance',
      x: 550,
      y: 290,
      connections: ['ev-seed-003', 'ev-seed-007'],
      createdAt: now - 86400000 * 5,
    },
    {
      id: 'ev-seed-005',
      title: 'Surge Pricing Coordination',
      content:
        'Uber and Lyft surge pricing activates within 90 seconds of each other in 94% of observed events across 3 cities. Statistical analysis suggests shared signal or coordinated pricing rather than independent demand response.',
      category: 'pricing',
      missionSlug: 'price-watch',
      x: 60,
      y: 530,
      connections: ['ev-seed-001'],
      createdAt: now - 86400000 * 4,
    },
    {
      id: 'ev-seed-006',
      title: 'Carbon Credit Double-Counting',
      content:
        'Brazilian forest preservation credits sold to both Delta Airlines and Shell for the same 12,000-hectare plot in Para state. Registry cross-reference reveals duplicate serial numbers across Verra and Gold Standard.',
      category: 'greenwash',
      x: 700,
      y: 120,
      connections: ['ev-seed-002'],
      createdAt: now - 86400000 * 3,
    },
    {
      id: 'ev-seed-007',
      title: 'Shadow Profiles for Non-Users',
      content:
        'Meta maintains detailed advertising profiles for individuals who have never created a Facebook or Instagram account. Contact upload data from existing users creates "shadow profiles" with inferred demographics, interests, and social graphs.',
      category: 'privacy',
      x: 780,
      y: 420,
      connections: ['ev-seed-004'],
      createdAt: now - 86400000 * 2,
    },
    {
      id: 'ev-seed-008',
      title: 'Dark Pattern: Subscription Maze',
      content:
        'Adobe cancellation flow requires 7 clicks, 3 page loads, and presents 4 retention offers before allowing account closure. The "Cancel" button uses low-contrast gray text while "Keep Plan" uses high-contrast blue. Average time to cancel: 12 minutes.',
      category: 'manipulation',
      x: 400,
      y: 500,
      connections: [],
      createdAt: now - 86400000,
    },
  ]
}

// ─── Page Component ─────────────────────────────────────────────────

export default function EvidencePage() {
  const profile = useDatavist((s) => s.profile)
  const roleConf = profile ? ROLE_CONFIG[profile.role] : null

  const placeholders = useMemo(() => createPlaceholders(), [])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 sm:px-5 py-3 border-b border-green-500/8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <h1
            className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-bold"
            style={{
              color: '#00ff41',
              textShadow: '0 0 10px rgba(0,255,65,0.3)',
            }}
          >
            Evidence Board
          </h1>
          <div className="h-3 w-px bg-green-500/15 hidden sm:block" />
          <span className="font-mono text-xs text-green-500/30 uppercase tracking-wider hidden sm:inline">
            Classified Findings
          </span>
        </div>

        {profile && roleConf && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-green-500/25 uppercase tracking-wider hidden sm:inline">
              Operative {profile.codename}
            </span>
            <span
              className="text-sm"
              style={{ color: roleConf.colorHex }}
            >
              {roleConf.icon}
            </span>
          </div>
        )}
      </div>

      {/* ── Board ───────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <EvidenceBoard evidence={placeholders} />
      </div>
    </div>
  )
}
