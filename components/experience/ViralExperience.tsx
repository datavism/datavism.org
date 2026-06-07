'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SoundEngine } from '@/lib/audio/SoundEngine'
import { FalseComfort } from './phases/FalseComfort'
import { TheGlitch } from './phases/TheGlitch'
import { DataRevelation } from './phases/DataRevelation'
import { SystemSpeaks } from './phases/SystemSpeaks'
import { TheChoice } from './phases/TheChoice'
import { TheHook } from './phases/TheHook'

export type Phase =
  | 'false-comfort'
  | 'glitch'
  | 'revelation'
  | 'system-speaks'
  | 'choice'
  | 'hook'

export interface UserData {
  device: string
  browser: string
  os: string
  language: string
  timezone: string
  city: string
  screenResolution: string
  pixelRatio: number
  cpuCores: number
  memory: number | null
  gpu: string
  fingerprint: string
  connectionType: string
  batteryLevel: number | null
  touchscreen: boolean
  colorDepth: number
  installedPlugins: number
  doNotTrack: boolean
  cookiesEnabled: boolean
  localStorageAvailable: boolean
  screenOrientation: string
  onlineStatus: boolean
  estimatedDailyHours: string
}

export function ViralExperience() {
  const [phase, setPhase] = useState<Phase>('false-comfort')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const soundInitialized = useRef(false)

  // Collect user data on mount
  useEffect(() => {
    collectUserData()
      .then(setUserData)
      .catch(() => {
        // Fallback with minimal data if collection fails
        setUserData({
          device: 'Unknown Device', browser: 'Unknown Browser', os: 'Unknown OS',
          language: navigator?.language || 'en', timezone: 'Unknown',
          city: 'Unknown', screenResolution: `${screen?.width || 0}x${screen?.height || 0}`,
          pixelRatio: window?.devicePixelRatio || 1, cpuCores: 0, memory: null,
          gpu: 'Unknown GPU', fingerprint: 'GHOST-XXXX-XXXX',
          connectionType: 'unknown', batteryLevel: null, touchscreen: false,
          colorDepth: 24, installedPlugins: 0, doNotTrack: false,
          cookiesEnabled: true, localStorageAvailable: true,
          screenOrientation: 'unknown', onlineStatus: true, estimatedDailyHours: '4-6',
        })
      })
  }, [])

  // Initialize sound engine on first interaction
  useEffect(() => {
    const handleInteraction = async () => {
      // Always mark as interacted — even if sound init fails
      setHasInteracted(true)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)

      // Try to init sound engine (may fail on some browsers, that's OK)
      if (!soundInitialized.current) {
        try {
          await SoundEngine.getInstance().init()
          soundInitialized.current = true
        } catch {
          // AudioContext blocked — sound will be silent but app continues
          console.warn('[DATAVISM] AudioContext init failed — sound disabled')
        }
      }
    }
    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

  const advancePhase = useCallback(() => {
    const phases: Phase[] = ['false-comfort', 'glitch', 'revelation', 'system-speaks', 'choice', 'hook']
    const currentIndex = phases.indexOf(phase)
    if (currentIndex < phases.length - 1) {
      setPhase(phases[currentIndex + 1])
    }
  }, [phase])

  const goToPhase = useCallback((newPhase: Phase) => {
    setPhase(newPhase)
  }, [])

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'false-comfort' && (
          <FalseComfort
            key="false-comfort"
            onComplete={advancePhase}
            hasInteracted={hasInteracted}
          />
        )}

        {phase === 'glitch' && (
          <TheGlitch
            key="glitch"
            onComplete={advancePhase}
            hasInteracted={hasInteracted}
          />
        )}

        {phase === 'revelation' && userData && (
          <DataRevelation
            key="revelation"
            userData={userData}
            onComplete={advancePhase}
            hasInteracted={hasInteracted}
          />
        )}

        {phase === 'system-speaks' && (
          <SystemSpeaks
            key="system-speaks"
            onComplete={advancePhase}
            hasInteracted={hasInteracted}
          />
        )}

        {phase === 'choice' && (
          <TheChoice
            key="choice"
            onWakeUp={() => goToPhase('hook')}
            onSleep={() => {
              window.location.href = 'https://www.google.com'
            }}
            hasInteracted={hasInteracted}
          />
        )}

        {phase === 'hook' && userData && (
          <TheHook
            key="hook"
            fingerprint={userData.fingerprint}
            hasInteracted={hasInteracted}
          />
        )}
      </AnimatePresence>

      {/* DEV: Phase navigator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-[100] bg-black/90 border border-green-400/50 px-3 py-2 font-mono text-xs text-green-400">
          <div className="mb-1 text-green-400/60">Phase: {phase}</div>
          <div className="flex gap-1">
            {(['false-comfort', 'glitch', 'revelation', 'system-speaks', 'choice', 'hook'] as Phase[]).map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={`px-2 py-1 border text-xs ${phase === p ? 'border-green-400 bg-green-400/20' : 'border-gray-700 hover:border-gray-500'}`}
              >
                {p.split('-')[0][0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Data Collection ────────────────────────────────────────────────

/** Infer city from timezone identifier */
function cityFromTimezone(tz: string): string {
  // Timezone format: "Continent/City" or "Continent/Region/City"
  const parts = tz.split('/')
  const raw = parts[parts.length - 1]
  // Replace underscores, handle common mappings
  const city = raw.replace(/_/g, ' ')

  // Map some non-obvious timezone IDs to real city names
  const overrides: Record<string, string> = {
    'Calcutta': 'Kolkata',
    'Saigon': 'Ho Chi Minh City',
    'Rangoon': 'Yangon',
  }

  return overrides[city] || city
}

/** Estimate daily screen time from device and time of day */
function estimateDailyHours(device: string): string {
  const hour = new Date().getHours()
  if (device.includes('Phone') || device.includes('iPhone')) {
    return hour >= 22 || hour < 6 ? '4-6' : '3-5'
  }
  return hour >= 22 || hour < 6 ? '8-12' : '6-10'
}

async function collectUserData(): Promise<UserData> {
  const ua = navigator.userAgent
  const device = getDevice(ua)
  const browser = getBrowser(ua)
  const os = getOS(ua)

  const language = navigator.language
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const city = cityFromTimezone(timezone)
  const screenResolution = `${screen.width}x${screen.height}`
  const pixelRatio = window.devicePixelRatio || 1
  const cpuCores = navigator.hardwareConcurrency || 0
  const memory = (navigator as unknown as Record<string, unknown>).deviceMemory as number | null ?? null
  const gpu = getGPU()
  const fingerprint = await generateFingerprint()

  const connection = (navigator as unknown as Record<string, unknown>).connection as { effectiveType?: string } | undefined
  const connectionType = connection?.effectiveType || 'unknown'

  let batteryLevel: number | null = null
  try {
    const getBattery = (navigator as unknown as Record<string, unknown>).getBattery as (() => Promise<{ level: number }>) | undefined
    const battery = await getBattery?.()
    batteryLevel = battery ? Math.round(battery.level * 100) : null
  } catch {
    // Battery API not available
  }

  const touchscreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const colorDepth = screen.colorDepth
  const installedPlugins = navigator.plugins?.length ?? 0
  const doNotTrack = navigator.doNotTrack === '1'
  const cookiesEnabled = navigator.cookieEnabled
  const localStorageAvailable = (() => { try { return !!window.localStorage } catch { return false } })()

  const screenObj = screen as { orientation?: { type?: string } }
  const screenOrientation = screenObj.orientation?.type?.replace('-primary', '') || 'unknown'
  const onlineStatus = navigator.onLine
  const estimatedDailyHours = estimateDailyHours(device)

  return {
    device, browser, os, language, timezone, city,
    screenResolution, pixelRatio, cpuCores, memory, gpu, fingerprint,
    connectionType, batteryLevel, touchscreen, colorDepth,
    installedPlugins, doNotTrack, cookiesEnabled, localStorageAvailable,
    screenOrientation, onlineStatus, estimatedDailyHours
  }
}

function getDevice(ua: string): string {
  if (/iPad/.test(ua)) return 'iPad'
  if (/iPhone/.test(ua)) return 'iPhone'
  if (/Android/.test(ua) && /Mobile/.test(ua)) return 'Android Phone'
  if (/Android/.test(ua)) return 'Android Tablet'
  if (/Macintosh/.test(ua)) return 'Mac'
  if (/Windows/.test(ua)) return 'Windows PC'
  if (/Linux/.test(ua)) return 'Linux PC'
  return 'Unknown Device'
}

function getBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return 'Microsoft Edge'
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Google Chrome'
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return 'Safari'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Opera|OPR\//.test(ua)) return 'Opera'
  return 'Unknown Browser'
}

function getOS(ua: string): string {
  if (/Windows NT 10/.test(ua)) return 'Windows 10/11'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Mac OS X/.test(ua)) {
    const match = ua.match(/Mac OS X (\d+[._]\d+)/)
    return match ? `macOS ${match[1].replace('_', '.')}` : 'macOS'
  }
  if (/Android/.test(ua)) {
    const match = ua.match(/Android (\d+\.?\d*)/)
    return match ? `Android ${match[1]}` : 'Android'
  }
  if (/iOS|iPhone|iPad/.test(ua)) return 'iOS'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Unknown OS'
}

function getGPU(): string {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        return renderer
          .replace(/ANGLE \(/, '')
          .replace(/\)$/, '')
          .replace(/Direct3D\d+/, '')
          .replace(/vs_\d+_\d+ ps_\d+_\d+/, '')
          .trim()
      }
    }
  } catch {
    // WebGL not available
  }
  return 'Unknown GPU'
}

async function generateFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency,
    !!window.sessionStorage,
    !!window.localStorage,
    !!window.indexedDB,
    navigator.platform,
    navigator.cookieEnabled,
    window.devicePixelRatio,
    navigator.maxTouchPoints,
  ]

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 50
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('DATAVISM::FINGERPRINT', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('DATAVISM::FINGERPRINT', 4, 17)
      components.push(canvas.toDataURL())
    }
  } catch {
    // Canvas not available
  }

  // WebGL fingerprint
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL))
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      }
    }
  } catch {}

  const str = components.join('|||')

  // crypto.subtle is only available in secure contexts (HTTPS/localhost)
  // Fallback to simple hash for HTTP connections (e.g., network testing)
  try {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
    const hashArray = Array.from(new Uint8Array(hash))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return `GHOST-${hashHex.slice(0, 4).toUpperCase()}-${hashHex.slice(4, 8).toUpperCase()}`
  } catch {
    // Fallback: simple string hash
    let h = 0
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0
    }
    const hex = Math.abs(h).toString(16).padStart(8, '0').toUpperCase()
    return `GHOST-${hex.slice(0, 4)}-${hex.slice(4, 8)}`
  }
}
