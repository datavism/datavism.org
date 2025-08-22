'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, X, Loader2 } from 'lucide-react'

interface VideoContent {
  title: string
  duration: string
  description: string
  script?: string
  videoId?: string // InVideo project ID
  prompt?: string // AI generation prompt
}

interface InVideoModalProps {
  video: VideoContent
  onClose: () => void
  onComplete?: () => void
}

export function InVideoModal({ video, onClose, onComplete }: InVideoModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateVideo = async () => {
    if (!video.script && !video.prompt) {
      setError('No script or prompt available for video generation')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Call our API to generate video with InVideo
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: video.title,
          script: video.script || generateScriptFromPrompt(video),
          topic: 'Digital Privacy and Data Liberation',
          vibe: 'educational',
          targetAudience: 'Data Activists and Privacy Advocates',
          platform: 'youtube'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate video')
      }

      const result = await response.json()
      setGeneratedVideo(result.videoUrl)
      
      if (onComplete) {
        onComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateScriptFromPrompt = (videoContent: VideoContent): string => {
    // Generate a detailed script based on the video prompt
    const baseScript = `
[SCENE: Maya Chen in dimly lit room with computer screens]

MAYA: ${videoContent.description}

[VISUAL: Code snippets and data visualizations on screen]

The script for "${videoContent.title}" would include:
- Real examples of algorithmic manipulation
- Step-by-step Python coding instructions  
- Emotional storytelling about digital freedom
- Interactive elements that connect to the challenges

[Duration: ${videoContent.duration}]

[CALL TO ACTION: Continue to next mission]
    `
    
    return baseScript
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black border-2 border-purple-400 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-400/30">
          <h2 className="text-xl font-bold text-purple-400">{video.title}</h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-red-400 text-2xl"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Video Player or Generator */}
          {generatedVideo ? (
            <div className="mb-6">
              <div className="aspect-video bg-black border border-purple-400/30 rounded">
                <iframe
                  src={generatedVideo}
                  className="w-full h-full"
                  allowFullScreen
                  title={video.title}
                />
              </div>
            </div>
          ) : (
            <div className="bg-purple-950/20 border border-purple-400/30 p-12 mb-6 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-2">{video.title}</h3>
              <p className="text-purple-300 mb-4">{video.description}</p>
              <div className="text-yellow-400 font-mono text-lg mb-6">Duration: {video.duration}</div>
              
              {/* Script Preview */}
              {video.script && (
                <div className="mt-4 p-4 bg-black/50 border border-purple-400/30 text-left mb-6">
                  <h4 className="text-purple-400 font-bold mb-2">📝 Script Preview:</h4>
                  <p className="text-purple-300 text-sm italic whitespace-pre-line">{video.script}</p>
                </div>
              )}

              {/* Generation Button */}
              <button
                onClick={generateVideo}
                disabled={isGenerating}
                className="px-6 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating Maya's Video...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Generate Video with AI
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 border border-red-400 bg-red-950/20 text-red-400 text-sm">
                  ❌ {error}
                </div>
              )}
            </div>
          )}

          {/* Video Information */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border border-cyan-400/30 p-4">
              <h4 className="text-cyan-400 font-bold mb-2">📹 Video Details</h4>
              <ul className="text-cyan-300 text-sm space-y-1">
                <li>• Duration: {video.duration}</li>
                <li>• Format: Interactive Briefing</li>
                <li>• Handler: Maya Chen</li>
                <li>• Style: Documentary + Code Demo</li>
              </ul>
            </div>
            
            <div className="border border-yellow-400/30 p-4">
              <h4 className="text-yellow-400 font-bold mb-2">🎯 Learning Objectives</h4>
              <ul className="text-yellow-300 text-sm space-y-1">
                <li>• Understand digital manipulation</li>
                <li>• Learn Python resistance tools</li>
                <li>• Recognize algorithmic patterns</li>
                <li>• Build counter-surveillance skills</li>
              </ul>
            </div>
          </div>

          {/* Maya Chen Character Info */}
          <div className="border border-green-400/30 p-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">👩‍💻</div>
              <div>
                <h4 className="text-green-400 font-bold mb-2">Maya Chen - Your Handler</h4>
                <p className="text-green-300 text-sm mb-2">
                  Former Facebook Data Scientist turned whistleblower. Maya built the algorithms that 
                  manipulate billions of users daily. Now she's teaching the resistance how to fight back.
                </p>
                <p className="text-yellow-400 text-xs italic">
                  "I thought we were connecting people. We were creating addicts. Time to break the chains."
                </p>
              </div>
            </div>
          </div>

          {/* Future Full Experience */}
          <div className="bg-green-950/20 border border-green-400/30 p-4 mb-6">
            <h4 className="text-green-400 font-bold mb-2">🚀 Full Experience Features</h4>
            <p className="text-green-300 text-sm mb-3">
              In the complete version, Maya's videos will include:
            </p>
            <ul className="text-green-300 text-sm space-y-1 mb-4">
              <li>• Interactive coding exercises within the video</li>
              <li>• Real social media data analysis examples</li>
              <li>• Emotional storytelling about digital freedom</li>
              <li>• Branch points based on your responses</li>
              <li>• Live data feed integration</li>
              <li>• Personalized manipulation reports</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {generatedVideo && (
              <button
                onClick={onComplete}
                className="px-6 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-bold"
              >
                ✅ Video Watched - Continue Mission
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black transition-all font-bold"
            >
              Skip for Now - Continue Learning
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}