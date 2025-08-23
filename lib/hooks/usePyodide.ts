// Hook for using Pyodide in React components
import { useState, useEffect, useCallback } from 'react'
import { pyodideService } from '@/lib/services/pyodide'

interface UsePyodideReturn {
  isReady: boolean
  isLoading: boolean
  error: string | null
  runPython: (code: string) => Promise<{ output: string; error: string | null }>
  reset: () => void
}

export function usePyodide(): UsePyodideReturn {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initPyodide = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await pyodideService.initialize()
        setIsReady(true)
      } catch (err) {
        console.error('Failed to initialize Pyodide:', err)
        setError(err instanceof Error ? err.message : 'Failed to load Python environment')
      } finally {
        setIsLoading(false)
      }
    }

    initPyodide()
  }, [])

  const runPython = useCallback(async (code: string) => {
    if (!isReady) {
      return {
        output: '',
        error: 'Python environment not ready. Please wait...'
      }
    }

    return pyodideService.runCode(code)
  }, [isReady])

  const reset = useCallback(() => {
    pyodideService.reset()
  }, [])

  return {
    isReady,
    isLoading,
    error,
    runPython,
    reset
  }
}