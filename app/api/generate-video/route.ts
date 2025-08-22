import { NextRequest, NextResponse } from 'next/server'

// InVideo API integration for generating Maya Chen briefing videos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, script, topic, vibe, targetAudience, platform } = body

    // Validate required fields
    if (!title || !script) {
      return NextResponse.json(
        { error: 'Title and script are required' },
        { status: 400 }
      )
    }

    // Check for InVideo API key
    const inVideoApiKey = process.env.INVIDEO_API_KEY
    if (!inVideoApiKey) {
      // Return a placeholder response for development
      return NextResponse.json({
        message: 'Video generation simulated (InVideo API key not configured)',
        videoUrl: createPlaceholderVideo(title, script),
        duration: estimateDuration(script),
        status: 'placeholder'
      })
    }

    // Call InVideo API to generate the video
    const inVideoResponse = await fetch('https://api.invideo.io/v2/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${inVideoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // InVideo API parameters for Maya Chen briefing
        prompt: createMayaChenPrompt(title, script, topic),
        template: 'educational-briefing', // Custom template for Maya videos
        voice: {
          type: 'ai',
          gender: 'female',
          accent: 'american',
          speed: 'normal',
          tone: 'professional-but-urgent'
        },
        style: {
          theme: 'dark-tech',
          color_scheme: 'green-black-yellow', // Datavism colors
          font: 'monospace',
          background: 'dark-room-with-screens'
        },
        content: {
          title: title,
          script: script,
          duration: estimateDuration(script),
          platform: platform || 'youtube'
        },
        branding: {
          logo: 'datavism-resistance-logo',
          watermark: false,
          credits: 'Datavism Digital Liberation Project'
        }
      })
    })

    if (!inVideoResponse.ok) {
      const errorData = await inVideoResponse.json()
      throw new Error(`InVideo API error: ${errorData.message || 'Unknown error'}`)
    }

    const videoData = await inVideoResponse.json()

    // Return the generated video information
    return NextResponse.json({
      message: 'Video generated successfully',
      videoUrl: videoData.video_url,
      videoId: videoData.video_id,
      duration: videoData.duration,
      thumbnail: videoData.thumbnail_url,
      status: 'completed',
      embedCode: `<iframe src="${videoData.video_url}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`
    })

  } catch (error) {
    console.error('Video generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate video',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: 'Using placeholder video'
      },
      { status: 500 }
    )
  }
}

// Create a placeholder video for development
function createPlaceholderVideo(title: string, script: string): string {
  const encodedTitle = encodeURIComponent(title)
  const encodedScript = encodeURIComponent(script.substring(0, 200))
  
  // Return a data URL with video placeholder
  return `data:text/html,<html>
    <head><title>${title}</title></head>
    <body style="background: #000; color: #00ff00; font-family: monospace; padding: 20px; text-align: center;">
      <h1 style="color: #00ff00;">🎬 ${title}</h1>
      <div style="border: 2px solid #00ff00; padding: 20px; margin: 20px; background: #001100;">
        <h2 style="color: #ffff00;">Maya Chen - Resistance Briefing</h2>
        <div style="text-align: left; margin: 20px 0;">
          <p style="color: #00ffff;">Script Preview:</p>
          <p style="font-size: 14px; line-height: 1.5;">${script.substring(0, 300)}...</p>
        </div>
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ffff00; background: #111;">
          <p style="color: #ffff00;">📹 In the full version, this will be an AI-generated video featuring:</p>
          <ul style="text-align: left; color: #00ff00;">
            <li>Maya Chen AI avatar speaking</li>
            <li>Real code examples and data visualizations</li>
            <li>Interactive elements and challenges</li>
            <li>Emotional storytelling about digital freedom</li>
          </ul>
        </div>
        <button onclick="window.parent.postMessage('video-complete', '*')" 
                style="background: #00ff00; color: #000; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer;">
          ✅ Continue Mission
        </button>
      </div>
    </body>
  </html>`
}

// Create the AI prompt for Maya Chen character
function createMayaChenPrompt(title: string, script: string, topic: string): string {
  return `
Create an educational video featuring Maya Chen, a former Facebook data scientist turned whistleblower.

CHARACTER: Maya Chen
- Appearance: Asian-American woman in her early 30s, wearing a black hoodie
- Setting: Dimly lit room with multiple computer screens showing code and data
- Personality: Intelligent, urgent, empathetic but determined
- Voice: Professional but passionate, with slight urgency

VIDEO TITLE: ${title}

TOPIC: ${topic}

VISUAL STYLE:
- Dark, tech-noir aesthetic with green/yellow/cyan accent colors
- Code snippets and data visualizations on background screens
- Matrix-style digital rain effects
- Close-ups on Maya's face during emotional moments
- Wide shots showing the "resistance hideout" environment

SCRIPT TO FOLLOW:
${script}

ADDITIONAL ELEMENTS:
- Show real examples of algorithmic manipulation
- Include Python code snippets that viewers can follow
- Add data visualizations that prove the points being made
- Create emotional connection between Maya and the viewer
- End with clear call-to-action for the next learning step

DURATION: Approximately 3-7 minutes based on script length
TONE: Educational but dramatic, like a documentary meets spy thriller
TARGET: People learning about digital privacy and data manipulation
  `
}

// Estimate video duration based on script length
function estimateDuration(script: string): number {
  // Rough estimation: 150 words per minute for educational content
  const wordCount = script.split(' ').length
  const estimatedMinutes = Math.ceil(wordCount / 150)
  return Math.max(1, Math.min(estimatedMinutes, 10)) // Between 1-10 minutes
}

// GET endpoint for checking API status
export async function GET() {
  return NextResponse.json({
    status: 'Video Generation API Ready',
    service: 'InVideo Integration',
    version: '1.0.0',
    endpoints: {
      generate: 'POST /api/generate-video',
      status: 'GET /api/generate-video'
    },
    features: [
      'Maya Chen AI character videos',
      'Educational briefing generation',
      'Datavism theme integration',
      'Interactive placeholder fallback'
    ]
  })
}