'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, X, SkipForward } from 'lucide-react'

interface MayaVideoProps {
  videoSrc?: string  // Path to video file
  poster?: string    // Thumbnail image
  title?: string
  duration?: string  // e.g. "3:24"
  onComplete?: () => void
  onSkip?: () => void
  allowSkip?: boolean
  autoPlay?: boolean
  className?: string
}

export function MayaVideo({
  videoSrc,
  poster = '/images/maya-placeholder.jpg',
  title = 'Maya Chen Video',
  duration,
  onComplete,
  onSkip,
  allowSkip = false,
  autoPlay = false,
  className = ''
}: MayaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // If no video src, show placeholder
  const hasVideo = !!videoSrc

  useEffect(() => {
    if (!hasVideo) return

    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setTotalDuration(video.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    if (autoPlay) {
      video.play().catch(err => console.log('Autoplay prevented:', err))
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [hasVideo, autoPlay, onComplete])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || !hasVideo) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video || !hasVideo) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video || !hasVideo) return

    if (!isFullscreen) {
      video.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleSkip = () => {
    setIsPlaying(false)
    onSkip?.()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Placeholder UI if no video
  if (!hasVideo) {
    return (
      <div className={`relative aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <div className="text-6xl mb-4">👻</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">{title}</h3>
            {duration && (
              <p className="text-sm text-gray-500 mb-4">Duration: {duration}</p>
            )}
            <div className="px-4 py-2 border border-yellow-400 text-yellow-400 text-sm font-mono">
              VIDEO COMING SOON
            </div>
            <p className="text-xs text-gray-600 mt-4 max-w-sm">
              Maya Chen videos are currently in production using HeyGen AI avatar technology.
              The story will continue soon!
            </p>
          </motion.div>
        </div>

        {allowSkip && onSkip && (
          <button
            onClick={handleSkip}
            className="absolute bottom-4 right-4 px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 text-sm hover:bg-cyan-500/40 transition-colors rounded flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            Skip for now
          </button>
        )}
      </div>
    )
  }

  // Full video player UI
  return (
    <div
      className={`relative aspect-video bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 flex flex-col justify-between p-4"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">{title}</h3>
                <p className="text-gray-400 text-sm">Maya Chen</p>
              </div>
              {allowSkip && onSkip && (
                <button
                  onClick={handleSkip}
                  className="px-3 py-1 bg-cyan-500/20 border border-cyan-400 text-cyan-400 text-sm hover:bg-cyan-500/40 transition-colors rounded flex items-center gap-1"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </button>
              )}
            </div>

            {/* Center play button */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-green-500/30 border-4 border-green-400 flex items-center justify-center hover:bg-green-500/50 transition-all"
              >
                <Play className="w-10 h-10 text-green-400 ml-1" />
              </button>
            )}

            {/* Bottom controls */}
            <div className="space-y-2">
              {/* Progress bar */}
              <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-400 transition-all"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-green-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-green-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                  </span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Preset configurations for common use cases
export const MayaVideoPresets = {
  levelIntro: (props: Partial<MayaVideoProps>) => (
    <MayaVideo
      autoPlay={true}
      allowSkip={true}
      {...props}
    />
  ),

  storyBeat: (props: Partial<MayaVideoProps>) => (
    <MayaVideo
      autoPlay={false}
      allowSkip={false}
      {...props}
    />
  ),

  trailer: (props: Partial<MayaVideoProps>) => (
    <MayaVideo
      autoPlay={true}
      allowSkip={false}
      {...props}
    />
  )
}
