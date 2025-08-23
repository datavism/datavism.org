// Hook for Python execution in the browser - Updated for enhanced Pyodide service
import { useState, useEffect, useCallback, useRef } from 'react'
import { pyodideService } from '@/lib/services/pyodide'

interface UsePythonOptions {
  autoInitialize?: boolean
  onReady?: () => void
  onError?: (error: string) => void
}

interface UsePythonReturn {
  isLoading: boolean
  isReady: boolean
  loadingStatus: string
  loadingProgress: number
  execute: (code: string) => Promise<{ output: string; error: string | null; variables: Record<string, any> }>
  initialize: () => Promise<void>
  reset: () => void
}

// Resistance code snippets for quick testing
export const RESISTANCE_SNIPPETS = {
  basicPrint: `print("I am awake")`,
  variableAssignment: `resistance_level = 100\nprint(f"Resistance: {resistance_level}%")`,
  functionDefinition: `def detect_manipulation(text):\n    triggers = ['BREAKING', 'URGENT']\n    for t in triggers:\n        if t in text:\n            return "Manipulation detected!"\n    return "Clean"`,
  dataAnalysis: `import pandas as pd\ndf = pd.DataFrame(sample_data)\nprint(df.head())`,
  liberation: `code = resistance.generate_liberation_code({'free': True})\nprint(f"Liberation code: #{code}")`
}

export function usePython(options: UsePythonOptions = {}): UsePythonReturn {
  const { autoInitialize = true, onReady, onError } = options
  
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState('Initializing Python...')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const initializingRef = useRef(false)

  const initialize = useCallback(async () => {
    if (initializingRef.current || isReady) return
    
    initializingRef.current = true
    setIsLoading(true)
    
    try {
      // Get loading state updates from the enhanced pyodide service
      const updateProgress = () => {
        const state = pyodideService.getLoadingState()
        setLoadingStatus(state.status)
        
        if (state.isLoading) {
          // Progress simulation based on CDN attempts
          const baseProgress = 20 + (state.currentCdn - 1) * 25
          const retryProgress = state.retryCount * 5
          setLoadingProgress(Math.min(baseProgress + retryProgress, 90))
        } else if (pyodideService.isReady()) {
          setLoadingProgress(100)
          setLoadingStatus('Python ready!')
        }
      }
      
      // Update progress periodically during loading
      const progressInterval = setInterval(updateProgress, 500)
      
      setLoadingStatus('Loading Python interpreter...')
      setLoadingProgress(10)
      
      // Initialize the enhanced pyodide service (includes toolkit)
      await pyodideService.initialize()
      
      clearInterval(progressInterval)
      setLoadingProgress(100)
      setLoadingStatus('Python ready!')
      
      setIsReady(true)
      onReady?.()
      
      // Clear loading UI after a moment
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
      
    } catch (error) {
      console.error('Failed to initialize Python:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setLoadingStatus(`Error: ${errorMsg}`)
      onError?.(errorMsg)
      setIsLoading(false)
    } finally {
      initializingRef.current = false
    }
  }, [isReady, onReady, onError])

  useEffect(() => {
    if (autoInitialize && !isReady && !initializingRef.current) {
      initialize()
    }
  }, [autoInitialize, initialize, isReady])

  const execute = useCallback(async (code: string) => {
    if (!isReady) {
      return {
        output: '',
        error: 'Python environment not ready',
        variables: {}
      }
    }

    const result = await pyodideService.runCode(code)
    
    // Extract user variables (enhanced version handles this better)
    let variables = {}
    try {
      const extractVars = `
# Extract user-defined variables (excluding toolkit)
import json
user_vars = {k: v for k, v in globals().items() 
             if not k.startswith('_') 
             and k not in ['resistance', 'ResistanceToolkit', 'sample_data', 
                           'calculate_digital_footprint', 'generate_liberation_code',
                           'sys', 'io', 'json', 'hashlib', 'datetime', 'OutputCapture']}

# Convert to JSON-serializable format
serializable_vars = {}
for k, v in user_vars.items():
    try:
        json.dumps(v)  # Test if serializable
        serializable_vars[k] = v
    except:
        serializable_vars[k] = str(v)  # Convert to string if not serializable

json.dumps(serializable_vars)
`
      const varsResult = await pyodideService.runCode(extractVars)
      if (varsResult.output && !varsResult.error) {
        variables = JSON.parse(varsResult.output)
      }
    } catch (e) {
      // Ignore variable extraction errors - not critical
      console.debug('Variable extraction failed:', e)
    }

    return {
      output: result.output,
      error: result.error,
      variables
    }
  }, [isReady])

  const reset = useCallback(() => {
    pyodideService.reset()
  }, [])

  return {
    isLoading,
    isReady,
    loadingStatus,
    loadingProgress,
    execute,
    initialize,
    reset
  }
}