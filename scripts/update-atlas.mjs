#!/usr/bin/env node
// scripts/update-atlas.mjs — Phase 3 of the field pipeline (ADR 003).
//
// Refreshes the committed snapshot of the Atlas — 214+ source-verified reference
// works of the data-art field, curated in the lab (frankbueltge.de/atlas). We keep
// a committed snapshot instead of fetching at build time: reproducible builds, no
// build-time dependency on a sibling repo (ADR 003 §Phase 3).
//
// Usage: node scripts/update-atlas.mjs

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const RAW_URL =
  'https://raw.githubusercontent.com/frankbueltge/frankbueltge.de/main/src/data/atlas/werke.json'
const OUT = resolve(process.cwd(), 'src', 'data', 'atlas', 'werke.json')

const res = await fetch(RAW_URL)
if (!res.ok) {
  console.error(`update-atlas: fetch failed (${res.status}) — snapshot left unchanged`)
  process.exit(1)
}
const data = await res.json()
if (!Array.isArray(data) || data.length < 100) {
  console.error(`update-atlas: unexpected payload (not an array of works) — snapshot left unchanged`)
  process.exit(1)
}
writeFileSync(OUT, JSON.stringify(data, null, 1) + '\n')
console.log(`update-atlas: snapshot refreshed — ${data.length} works → src/data/atlas/werke.json`)
