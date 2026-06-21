import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'zod'

// Stations collection (design §6). One markdown file per station; the cinematic
// story-kern is a Svelte island, so the body stays mostly notes — the structured
// beats (mission, self-checks, sources, GHOST fragment) live in frontmatter.
const stations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stations' }),
  schema: z.object({
    line: z.enum(['g', 'k', 'r', 'b', 'v']),
    index: z.number().int().positive(),
    title: z.string(),
    skill: z.string(),
    status: z.enum(['open', 'announced', 'locked']),
    dropDate: z.string().optional(),
    teaser: z.string().optional(), // one-liner shown on the line page for any station
    sources: z
      .array(z.object({ label: z.string(), url: z.url(), accessed: z.string() }))
      .default([]),
    ogImage: z.string().optional(),
    // playable beats — only `open` stations carry them (design §4)
    missionMinutes: z.string().optional(), // e.g. "45–90 min"
    ghostFragment: z.array(z.string()).default([]),
    mission: z.object({ goal: z.string(), steps: z.array(z.string()) }).optional(),
    selfChecks: z.array(z.string()).min(1).max(5).optional(),
    artifactName: z.string().optional(), // e.g. "Case File #1"
    nextTeaser: z.string().optional(),
    // Stufe-A station body — frontmatter-driven beats (open stations populate these).
    outcome: z.string().optional(), // hero outcome line
    signal: z.object({ lead: z.string(), body: z.string() }).optional(),
    method: z.object({ intro: z.string(), steps: z.array(z.string()) }).optional(),
    tooling: z.object({ intro: z.string().optional(), items: z.array(z.string()) }).optional(),
    verification: z.object({ intro: z.string(), checks: z.array(z.string()) }).optional(),
    bridge: z.string().optional(),
    artifactDesc: z.string().optional(),
    artifactTemplate: z.string().optional(), // copyable markdown the learner fills in
    stationSentence: z.string().optional(), // memorable closing line (canon "Station Sentence")
  }),
})

export const collections = { stations }
