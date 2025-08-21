// /app/academy/week1/page.tsx
'use client'
import { useEffect } from 'react'
import { usePlausible, track } from '@/lib/analytics'
import CodeRunner from '@/components/CodeRunner'
import Link from 'next/link'

const starter = `# Week 1 — "System Breach"
# Goal: Free yourself from spreadsheet prison.

import pandas as pd
data = {"dept":["Ops","Ops","HR","HR"], "salary":[48000,52000,42000,39000]}
df = pd.DataFrame(data)
print(df.describe())
`

export default function Week1() {
  usePlausible()
  useEffect(() => { track('Academy-Started', { week: 1 }) }, [])

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">Week 1 — System Breach</h1>
        <Link href="/" className="text-sm underline">← Back</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="grid gap-4">
          <p className="text-zinc-700 dark:text-zinc-300">
            Mission: Break free from spreadsheet prison. Learn Python + pandas and
            compute basic stats that reveal patterns in pay data.
          </p>
          <ol className="list-decimal pl-5 grid gap-2 text-zinc-700 dark:text-zinc-300">
            <li>Run the starter code.</li>
            <li>Replace salaries to introduce an outlier (e.g., 200000) and run again.</li>
            <li>Compare <code>mean</code> vs <code>median</code>. What changes?</li>
          </ol>
        </section>

        <section className="grid gap-3">
          <CodeRunner starter={starter} onSuccess={() => { /* could unlock badge */ }} />
        </section>
      </div>

      <div className="mt-10 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <strong>Challenge:</strong> Print the mean and median separately using:
        <pre className="mt-2 p-2 rounded bg-zinc-100 dark:bg-zinc-900 text-xs">{`print("Mean:", df["salary"].mean())\nprint("Median:", df["salary"].median())`}</pre>
      </div>
    </main>
  )
}
