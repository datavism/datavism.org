// /components/CodeRunner.tsx
'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'

const Monaco = dynamic(() => import('@monaco-editor/react'), { ssr: false })

declare global {
  interface Window {
    loadPyodide?: any
  }
}

export default function CodeRunner({
  starter = 'import pandas as pd\nprint("Hello, investigator!")',
  onSuccess,
}: {
  starter?: string
  onSuccess?: (stdout: string) => void
}) {
  const [code, setCode] = useState(starter)
  const [out, setOut] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const pyodideRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    async function boot() {
      // Pyodide Script laden
      if (!document.getElementById('pyodide-cdn')) {
        const s = document.createElement('script')
        s.id = 'pyodide-cdn'
        s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
        s.onload = async () => {
          // @ts-ignore
          const pyodide = await (window as any).loadPyodide?.({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' })
          if (cancelled) return
          pyodideRef.current = pyodide
          // Basis-Pakete
          try {
            await pyodide.loadPackage(['micropip'])
            setLoading(false)
          } catch (e) {
            console.error(e)
            setLoading(false)
          }
        }
        document.head.appendChild(s)
      } else {
        setLoading(false)
      }
    }
    boot()
    return () => { cancelled = true }
  }, [])

  async function run() {
    if (!pyodideRef.current) return
    setOut('Running...')
    try {
      const py = pyodideRef.current
      await py.runPythonAsync(`
import sys
from io import StringIO
_sys_stdout = sys.stdout
_sys_stderr = sys.stderr
_cap = StringIO()
sys.stdout = _cap
sys.stderr = _cap
`)
      await py.runPythonAsync(code)
      const stdout = await py.runPythonAsync('_cap.getvalue()')
      setOut(stdout)
      track('Challenge-Completed', { week: 1, challenge: 1 })
      onSuccess?.(stdout)
    } catch (e: any) {
      setOut(String(e?.message ?? e))
    } finally {
      try {
        await pyodideRef.current.runPythonAsync(`
import sys
sys.stdout = _sys_stdout
sys.stderr = _sys_stderr
`)
      } catch {}
    }
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <Monaco
          height="260px"
          defaultLanguage="python"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontLigatures: true,
            wordWrap: 'on',
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-emerald-950 font-semibold disabled:opacity-50"
        >
          {loading ? 'Booting Python…' : 'Run Code'}
        </button>
      </div>
      <pre className="bg-zinc-950 text-zinc-100 rounded-xl p-4 text-sm min-h-[96px] overflow-auto">
{out || 'Output will appear here…'}
      </pre>
    </div>
  )
}
