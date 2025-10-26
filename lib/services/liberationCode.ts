import { createBrowserSupabaseClient } from './supabase/client'

/**
 * Liberation Code Service
 * Generates unique codes for users who complete levels
 * These codes can be shared socially for viral growth
 */

/**
 * Generate a unique 8-character liberation code
 * Format: XXXX-XXXX (e.g. A7F3-9B2E)
 */
function generateCodeString(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars (0,O,I,1)
  let code = ''

  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-'
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return code
}

/**
 * Generate and store liberation code for user
 */
export async function generateLiberationCode(params: {
  userId: string
  level: number
  xpEarned: number
  timeTaken: number // in seconds
}): Promise<{ code: string; error: string | null }> {
  try {
    const supabase = createBrowserSupabaseClient()

    // Check if user already has a code for this level
    const { data: existing } = await supabase
      .from('liberation_codes')
      .select('code')
      .eq('user_id', params.userId)
      .eq('level_completed', params.level)
      .single()

    if (existing) {
      return { code: existing.code, error: null }
    }

    // Generate unique code
    let code = generateCodeString()
    let attempts = 0
    const maxAttempts = 10

    // Ensure uniqueness
    while (attempts < maxAttempts) {
      const { data: duplicate } = await supabase
        .from('liberation_codes')
        .select('code')
        .eq('code', code)
        .single()

      if (!duplicate) break

      code = generateCodeString()
      attempts++
    }

    if (attempts >= maxAttempts) {
      return { code: '', error: 'Failed to generate unique code' }
    }

    // Store in database
    const { error } = await supabase
      .from('liberation_codes')
      .insert({
        user_id: params.userId,
        code: code,
        level_completed: params.level,
        xp_earned: params.xpEarned,
        time_taken: params.timeTaken
      })

    if (error) {
      console.error('Error storing liberation code:', error)
      return { code: '', error: error.message }
    }

    // Create activity feed entry
    await createActivityFeedEntry({
      userId: params.userId,
      actionType: 'level_complete',
      actionData: {
        level: params.level,
        code: code,
        xp: params.xpEarned,
        time: params.timeTaken
      }
    })

    return { code, error: null }

  } catch (error) {
    console.error('Liberation code generation error:', error)
    return { code: '', error: String(error) }
  }
}

/**
 * Get liberation code for user and level
 */
export async function getLiberationCode(userId: string, level: number): Promise<string | null> {
  try {
    const supabase = createBrowserSupabaseClient()

    const { data } = await supabase
      .from('liberation_codes')
      .select('code')
      .eq('user_id', userId)
      .eq('level_completed', level)
      .single()

    return data?.code || null

  } catch (error) {
    console.error('Error fetching liberation code:', error)
    return null
  }
}

/**
 * Increment share count for a code
 */
export async function trackCodeShare(code: string): Promise<void> {
  try {
    const supabase = createBrowserSupabaseClient()

    const { data } = await supabase
      .from('liberation_codes')
      .select('shares_count')
      .eq('code', code)
      .single()

    if (data) {
      await supabase
        .from('liberation_codes')
        .update({ shares_count: (data.shares_count || 0) + 1 })
        .eq('code', code)
    }

  } catch (error) {
    console.error('Error tracking code share:', error)
  }
}

/**
 * Get leaderboard of fastest completions
 */
export async function getLiberationLeaderboard(level: number, limit: number = 10) {
  try {
    const supabase = createBrowserSupabaseClient()

    const { data } = await supabase
      .from('liberation_codes')
      .select(`
        code,
        xp_earned,
        time_taken,
        created_at,
        user:user_id (
          id,
          username
        )
      `)
      .eq('level_completed', level)
      .order('time_taken', { ascending: true })
      .limit(limit)

    return data || []

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

/**
 * Create activity feed entry
 */
async function createActivityFeedEntry(params: {
  userId: string
  actionType: string
  actionData: Record<string, any>
}) {
  try {
    const supabase = createBrowserSupabaseClient()

    await supabase
      .from('activity_feed')
      .insert({
        user_id: params.userId,
        action_type: params.actionType,
        action_data: params.actionData,
        is_public: true
      })

  } catch (error) {
    console.error('Error creating activity feed entry:', error)
  }
}

/**
 * Generate shareable social media messages
 */
export function generateShareMessages(code: string, level: number, timeTaken: number) {
  const hours = Math.floor(timeTaken / 3600)
  const minutes = Math.floor((timeTaken % 3600) / 60)
  const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

  return {
    twitter: `I just broke free from Level ${level} on @datavism in ${timeString}! 🚀\n\nMy Liberation Code: #${code.replace('-', '')}\n\nLearn data science by exposing algorithmic manipulation.\n\nJoin the resistance: datavism.org`,

    linkedin: `I just completed Level ${level} of DATAVISM - learning data science by exposing real algorithmic manipulation.\n\nTime: ${timeString}\nLiberation Code: ${code}\n\nIt's not your typical online course. It's actually engaging.\n\nCheck it out: datavism.org\n\n#DataScience #Python #TechForGood`,

    reddit: `I just finished Level ${level} on DATAVISM (${timeString})\n\nIt's a gamified data science bootcamp where you expose real social media manipulation.\n\nLiberation Code: ${code}\n\nActually fun to learn this way. No boring videos.\n\ndatavism.org`,

    whatsapp: `Hey! I just completed a data science challenge in ${timeString}. It's actually fun - you expose social media manipulation while learning Python.\n\nMy code: ${code}\n\nWanna try? datavism.org`
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}
