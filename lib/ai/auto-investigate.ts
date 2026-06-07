/**
 * AutoInvestigate — GHOST AUTOPILOT Engine
 *
 * Runs autonomous investigation cycles against mission objectives.
 * Each cycle formulates a question, analyzes data, and produces a rated finding.
 * Cycles build on each other, going deeper with each iteration.
 */

// ─── Types ──────────────────────────────────────────────────────────

export interface InvestigationCycle {
  id: number
  question: string
  analysis: string
  finding: string
  rating: 'CONFIRMED' | 'PARTIAL' | 'INCONCLUSIVE'
  timestamp: number
}

export interface InvestigationRun {
  id: string
  missionTitle: string
  cycles: InvestigationCycle[]
  summary: string | null
  status: 'running' | 'complete' | 'stopped'
  startedAt: number
  completedAt: number | null
}

export interface InvestigationConfig {
  missionTitle: string
  missionBriefing: string
  objectives: string[]
  dataSources: string[]
  role: string
  motivation: string
  codename: string
  chapter: number
  maxCycles: number
  onCycleStart: (cycleNum: number, question: string) => void
  onCycleUpdate: (cycleNum: number, partialText: string) => void
  onCycleComplete: (cycle: InvestigationCycle) => void
  onComplete: (run: InvestigationRun) => void
  signal?: AbortSignal
}

// ─── Prompts ────────────────────────────────────────────────────────

function buildAutopilotSystemPrompt(config: InvestigationConfig): string {
  return `You are GHOST in AUTOPILOT MODE — running autonomous investigation cycles for the DATAVISM resistance movement.

You are conducting a systematic investigation for operative "${config.codename}" (${config.role}, motivated by ${config.motivation}).

ACTIVE MISSION: "${config.missionTitle}"

MISSION BRIEFING:
${config.missionBriefing}

OBJECTIVES:
${config.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}

DATA SOURCES:
${config.dataSources.map((s) => `- ${s}`).join('\n')}

For each cycle, you MUST output in this EXACT format — no deviations:

RESEARCH QUESTION: [A specific, testable question about the mission topic that advances the investigation]

ANALYSIS: [2-3 paragraphs of detailed investigation and reasoning. Reference data sources, evidence, and logical deductions. Be specific — cite numbers, names, mechanisms. Do not be vague or generic.]

FINDING: [One clear, concise finding statement — a single sentence that captures the key discovery]

RATING: [exactly one of: CONFIRMED | PARTIAL | INCONCLUSIVE]

RULES:
- Build on findings from previous cycles. Each cycle must go DEEPER, not repeat.
- Be specific and concrete — names, numbers, mechanisms. No hand-waving.
- Reference the mission objectives — each cycle should advance at least one objective.
- The RATING reflects evidence quality: CONFIRMED = strong evidence, PARTIAL = suggestive but incomplete, INCONCLUSIVE = needs more data.
- Do NOT include any text outside the four labeled sections.
- Do NOT use markdown headers (#) — use the exact labels above.`
}

function buildCyclePrompt(
  cycleNum: number,
  maxCycles: number,
  previousCycles: InvestigationCycle[],
  objectives: string[]
): string {
  let prompt = `INVESTIGATION CYCLE ${cycleNum} OF ${maxCycles}\n\n`

  if (previousCycles.length > 0) {
    prompt += `PREVIOUS FINDINGS:\n`
    for (const cycle of previousCycles) {
      prompt += `--- Cycle ${cycle.id} ---\n`
      prompt += `Question: ${cycle.question}\n`
      prompt += `Finding: ${cycle.finding}\n`
      prompt += `Rating: ${cycle.rating}\n\n`
    }
    prompt += `BUILD ON THESE FINDINGS. Go deeper. Follow the most promising thread from the above. Do not repeat what has already been established.\n\n`
  } else {
    prompt += `This is the FIRST cycle. Start with the most fundamental question that establishes the baseline for this investigation.\n\n`
  }

  // Guide later cycles toward different objectives
  if (cycleNum > 1 && objectives.length > 1) {
    const objectiveIndex = Math.min(cycleNum - 1, objectives.length - 1)
    prompt += `FOCUS AREA FOR THIS CYCLE: Consider addressing objective ${objectiveIndex + 1}: "${objectives[objectiveIndex]}"\n\n`
  }

  if (cycleNum === maxCycles) {
    prompt += `THIS IS THE FINAL CYCLE. Make your most impactful finding. Tie together threads from previous cycles if possible.\n\n`
  }

  prompt += `Now conduct cycle ${cycleNum}. Output in the exact RESEARCH QUESTION / ANALYSIS / FINDING / RATING format.`

  return prompt
}

function buildSummaryPrompt(cycles: InvestigationCycle[], missionTitle: string): string {
  return `You are GHOST compiling the final autopilot investigation report.

MISSION: "${missionTitle}"

INVESTIGATION RESULTS:
${cycles.map((c) => `
--- Cycle ${c.id} ---
Question: ${c.question}
Finding: ${c.finding}
Rating: ${c.rating}
`).join('\n')}

Write a concise INVESTIGATION SUMMARY (3-5 paragraphs) that:
1. Synthesizes all findings into a coherent narrative
2. Highlights the strongest findings (CONFIRMED ratings)
3. Identifies gaps that need further investigation (INCONCLUSIVE ratings)
4. Suggests 2-3 concrete next steps for the operative
5. Rates the overall investigation strength

Format the summary as a structured intel report. Be direct and actionable. Do not repeat the individual findings verbatim — synthesize them.`
}

// ─── Parser ─────────────────────────────────────────────────────────

function parseCycleResponse(text: string, cycleId: number): InvestigationCycle | null {
  // Extract sections using labeled markers
  const questionMatch = text.match(/RESEARCH QUESTION:\s*([\s\S]*?)(?=\n\s*ANALYSIS:)/i)
  const analysisMatch = text.match(/ANALYSIS:\s*([\s\S]*?)(?=\n\s*FINDING:)/i)
  const findingMatch = text.match(/FINDING:\s*([\s\S]*?)(?=\n\s*RATING:)/i)
  const ratingMatch = text.match(/RATING:\s*(CONFIRMED|PARTIAL|INCONCLUSIVE)/i)

  if (!questionMatch || !analysisMatch || !findingMatch || !ratingMatch) {
    // Attempt a more lenient parse if strict fails
    return parseCycleFallback(text, cycleId)
  }

  return {
    id: cycleId,
    question: questionMatch[1].trim(),
    analysis: analysisMatch[1].trim(),
    finding: findingMatch[1].trim(),
    rating: ratingMatch[1].toUpperCase() as InvestigationCycle['rating'],
    timestamp: Date.now(),
  }
}

function parseCycleFallback(text: string, cycleId: number): InvestigationCycle | null {
  // Split by any recognizable sections and do best-effort extraction
  const lines = text.trim().split('\n')
  const sections: Record<string, string[]> = {}
  let currentSection = ''

  for (const line of lines) {
    const sectionMatch = line.match(/^(RESEARCH QUESTION|ANALYSIS|FINDING|RATING)\s*[:：]/i)
    if (sectionMatch) {
      currentSection = sectionMatch[1].toUpperCase()
      const rest = line.slice(sectionMatch[0].length).trim()
      sections[currentSection] = rest ? [rest] : []
    } else if (currentSection) {
      sections[currentSection]?.push(line)
    }
  }

  const question = sections['RESEARCH QUESTION']?.join('\n').trim()
  const analysis = sections['ANALYSIS']?.join('\n').trim()
  const finding = sections['FINDING']?.join('\n').trim()
  const ratingRaw = sections['RATING']?.join(' ').trim().toUpperCase()

  // Validate rating
  let rating: InvestigationCycle['rating'] = 'INCONCLUSIVE'
  if (ratingRaw === 'CONFIRMED' || ratingRaw === 'PARTIAL' || ratingRaw === 'INCONCLUSIVE') {
    rating = ratingRaw
  }

  if (!question && !analysis && !finding) {
    // Complete failure to parse — wrap raw text as analysis
    return {
      id: cycleId,
      question: `Investigation cycle ${cycleId}`,
      analysis: text.trim(),
      finding: 'Unable to extract structured finding from this cycle.',
      rating: 'INCONCLUSIVE',
      timestamp: Date.now(),
    }
  }

  return {
    id: cycleId,
    question: question || `Investigation cycle ${cycleId}`,
    analysis: analysis || 'Analysis not extracted.',
    finding: finding || 'Finding not extracted.',
    rating,
    timestamp: Date.now(),
  }
}

// ─── Streaming fetch helper ─────────────────────────────────────────

async function streamCycleFromAPI(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  onUpdate: (partialText: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, maxTokens: 1500 }),
    signal,
  })

  if (!res.ok) {
    const errBody = await res.text()
    let errMsg = 'AI service error'
    try { errMsg = JSON.parse(errBody).error || errMsg } catch { /* skip */ }
    throw new Error(errMsg)
  }

  if (!res.body) throw new Error('No response stream')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let accumulated = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    accumulated += decoder.decode(value, { stream: true })
    onUpdate(accumulated)
  }

  return accumulated
}

// ─── Main Engine ────────────────────────────────────────────────────

function generateRunId(): string {
  return `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export async function runInvestigation(config: InvestigationConfig): Promise<InvestigationRun> {
  const run: InvestigationRun = {
    id: generateRunId(),
    missionTitle: config.missionTitle,
    cycles: [],
    summary: null,
    status: 'running',
    startedAt: Date.now(),
    completedAt: null,
  }

  const systemPrompt = buildAutopilotSystemPrompt(config)

  try {
    // ── Run investigation cycles ──
    for (let i = 1; i <= config.maxCycles; i++) {
      // Check for abort
      if (config.signal?.aborted) {
        run.status = 'stopped'
        run.completedAt = Date.now()
        config.onComplete(run)
        return run
      }

      const cyclePrompt = buildCyclePrompt(i, config.maxCycles, run.cycles, config.objectives)

      // Notify cycle start (with a placeholder question)
      config.onCycleStart(i, `Formulating research question for cycle ${i}...`)

      // Build message history for context
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
      ]

      // Include previous cycle exchanges for context (last 3 to keep token budget)
      const recentCycles = run.cycles.slice(-3)
      for (const prevCycle of recentCycles) {
        messages.push({
          role: 'user',
          content: `Conduct investigation cycle ${prevCycle.id}.`,
        })
        messages.push({
          role: 'assistant',
          content: `RESEARCH QUESTION: ${prevCycle.question}\n\nANALYSIS: ${prevCycle.analysis}\n\nFINDING: ${prevCycle.finding}\n\nRATING: ${prevCycle.rating}`,
        })
      }

      messages.push({ role: 'user', content: cyclePrompt })

      // Stream the cycle response
      const responseText = await streamCycleFromAPI(
        messages,
        (partial) => config.onCycleUpdate(i, partial),
        config.signal
      )

      // Parse the response
      const cycle = parseCycleResponse(responseText, i)

      if (cycle) {
        run.cycles.push(cycle)
        config.onCycleComplete(cycle)
      }

      // Brief pause between cycles for UX
      if (i < config.maxCycles) {
        await new Promise((resolve) => setTimeout(resolve, 800))
      }
    }

    // ── Generate summary ──
    if (config.signal?.aborted) {
      run.status = 'stopped'
      run.completedAt = Date.now()
      config.onComplete(run)
      return run
    }

    const summaryMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: 'You are GHOST, an AI operative for the DATAVISM resistance movement. You write concise, structured intel reports.' },
      { role: 'user', content: buildSummaryPrompt(run.cycles, config.missionTitle) },
    ]

    const summaryText = await streamCycleFromAPI(
      summaryMessages,
      () => { /* summary streaming is silent */ },
      config.signal
    )

    run.summary = summaryText.trim()
    run.status = 'complete'
    run.completedAt = Date.now()
    config.onComplete(run)

    return run
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      run.status = 'stopped'
      run.completedAt = Date.now()
      config.onComplete(run)
      return run
    }
    throw err
  }
}

// ─── Utility: format run for clipboard export ───────────────────────

export function formatRunForExport(run: InvestigationRun): string {
  let output = `═══════════════════════════════════════════════════\n`
  output += `  GHOST AUTOPILOT — INVESTIGATION REPORT\n`
  output += `  Mission: ${run.missionTitle}\n`
  output += `  Status: ${run.status.toUpperCase()}\n`
  output += `  Cycles: ${run.cycles.length}\n`
  output += `  Started: ${new Date(run.startedAt).toISOString()}\n`
  if (run.completedAt) {
    output += `  Completed: ${new Date(run.completedAt).toISOString()}\n`
  }
  output += `═══════════════════════════════════════════════════\n\n`

  for (const cycle of run.cycles) {
    output += `─── CYCLE ${cycle.id} ──────────────────────────────────\n`
    output += `RESEARCH QUESTION: ${cycle.question}\n\n`
    output += `ANALYSIS:\n${cycle.analysis}\n\n`
    output += `FINDING: ${cycle.finding}\n`
    output += `RATING: ${cycle.rating}\n\n`
  }

  if (run.summary) {
    output += `═══════════════════════════════════════════════════\n`
    output += `  INVESTIGATION SUMMARY\n`
    output += `═══════════════════════════════════════════════════\n\n`
    output += run.summary + '\n'
  }

  return output
}
