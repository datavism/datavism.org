'use client'

interface HandlerMessageProps {
  message: string
  handler: string
}

export function HandlerMessage({ message, handler }: HandlerMessageProps) {
  return (
    <div className="border border-cyan-400 p-4 bg-cyan-950/10 my-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold">
          MC
        </div>
        <span className="text-cyan-400 font-bold">{handler}</span>
      </div>
      <p className="text-cyan-300 italic text-sm">{message}</p>
    </div>
  )
}