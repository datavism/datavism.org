'use client'

// ─── Types ──────────────────────────────────────────────────────────

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

// ─── Helpers ────────────────────────────────────────────────────────

/** Infer city from timezone identifier */
function cityFromTimezone(tz: string): string {
  const parts = tz.split('/')
  const raw = parts[parts.length - 1]
  const city = raw.replace(/_/g, ' ')

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

// ─── Fingerprint ────────────────────────────────────────────────────

export async function generateFingerprint(): Promise<string> {
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

// ─── Main Collection ────────────────────────────────────────────────

export async function collectUserData(): Promise<UserData> {
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
  const estimatedDaily = estimateDailyHours(device)

  return {
    device, browser, os, language, timezone, city,
    screenResolution, pixelRatio, cpuCores, memory, gpu, fingerprint,
    connectionType, batteryLevel, touchscreen, colorDepth,
    installedPlugins, doNotTrack, cookiesEnabled, localStorageAvailable,
    screenOrientation, onlineStatus, estimatedDailyHours: estimatedDaily,
  }
}

export const FALLBACK_USER_DATA: UserData = {
  device: 'Unknown Device', browser: 'Unknown Browser', os: 'Unknown OS',
  language: 'en', timezone: 'Unknown', city: 'Unknown',
  screenResolution: '0x0', pixelRatio: 1, cpuCores: 0, memory: null,
  gpu: 'Unknown GPU', fingerprint: 'GHOST-XXXX-XXXX',
  connectionType: 'unknown', batteryLevel: null, touchscreen: false,
  colorDepth: 24, installedPlugins: 0, doNotTrack: false,
  cookiesEnabled: true, localStorageAvailable: true,
  screenOrientation: 'unknown', onlineStatus: true, estimatedDailyHours: '4-6',
}
