import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    loadPyodide: any
  }
}

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadPyodideScript = async () => {
      if (window.loadPyodide) return
      
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
      script.async = true
      document.body.appendChild(script)
      
      await new Promise(resolve => {
        script.onload = resolve
      })
    }

    const initializePyodide = async () => {
      setLoading(true)
      try {
        await loadPyodideScript()
        
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        })
        
        // Load essential packages
        await pyodideInstance.loadPackage(['pandas', 'numpy'])
        
        // Setup sample data
        pyodideInstance.runPython(`
import pandas as pd
import numpy as np
import sys
from io import StringIO

# Create sample datasets
np.random.seed(1337)

# MegaCorp employees
employees_data = {
    'employee_id': range(1, 51),
    'name': [f'Employee_{i}' for i in range(1, 51)],
    'gender': ['Male']*30 + ['Female']*20,
    'salary': list(np.random.normal(75000, 5000, 30)) + list(np.random.normal(60000, 5000, 20)),
    'dept_id': np.random.choice([1, 2, 3, 4], 50)
}
df = pd.DataFrame(employees_data)
df.to_csv('megacorp_employees.csv', index=False)
employees = df  # Alias

# Departments
departments = pd.DataFrame({
    'dept_id': [1, 2, 3, 4],
    'department': ['Engineering', 'Marketing', 'Sales', 'HR'],
    'budget': [5000000, 2000000, 3000000, 1000000]
})
departments.to_csv('departments.csv', index=False)

print("Data loaded. Ready for investigation.")
        `)
        
        setPyodide(pyodideInstance)
        setReady(true)
      } catch (error) {
        console.error('Failed to load Pyodide:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!pyodide && !loading) {
      initializePyodide()
    }
  }, [pyodide, loading])

  const runCode = useCallback(async (code: string) => {
    if (!pyodide) throw new Error('Pyodide not initialized')
    
    // Capture output
    pyodide.runPython(`
sys.stdout = StringIO()
    `)
    
    // Run user code
    try {
      pyodide.runPython(code)
      const output = pyodide.runPython('sys.stdout.getvalue()')
      return output
    } catch (error: any) {
      throw new Error(error.message)
    }
  }, [pyodide])

  return { ready, loading, runCode }
}