#!/usr/bin/env node
// scripts/field-sync.mjs — Phase 2 of the field pipeline (ADR 003).
//
// Mirrors the SHIPPED works of the research collective Meridian
// (github.com/frankbueltge/field-research) into the Astro content collection
// src/content/field-works/ — one markdown file per work:
//   frontmatter = the work's meta.json, verbatim values
//   body        = the work's README.md, verbatim (unedited — binding, ADR 002);
//                 interactive works without a README mirror with an empty body —
//                 the page links their live render in the lab (labUrl) instead.
//
// Path boundary (binding): reads ONLY works/<slug>/{meta.json,README.md} from the
// source checkout; writes ONLY into src/content/field-works/. Works that vanish
// upstream are removed from the mirror (the ARCHIVE stays in field-research; this
// is a render mirror, not a second archive).
//
// Usage: node scripts/field-sync.mjs [path-to-field-research-checkout]
//        (default: ../field-research — the sibling checkout / CI clone path)

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, resolve, basename } from 'node:path'

const SOURCE = resolve(process.argv[2] ?? join(process.cwd(), '..', 'field-research'))
const WORKS_DIR = join(SOURCE, 'works')
const OUT_DIR = resolve(process.cwd(), 'src', 'content', 'field-works')
const REPO_WORKS_URL = 'https://github.com/frankbueltge/field-research/tree/main/works'
// Works render live in the lab on frankbueltge.de (pattern verified 2026-07-11).
const LAB_WORKS_URL = 'https://frankbueltge.de/field/werke'

const SLUG_RE = /^[a-z0-9-]+$/

if (!existsSync(WORKS_DIR)) {
  console.error(`field-sync: source works dir not found: ${WORKS_DIR}`)
  process.exit(1)
}

// YAML-safe scalar: JSON string literals are valid YAML flow scalars.
const y = (v) => JSON.stringify(String(v ?? ''))

mkdirSync(OUT_DIR, { recursive: true })

const seen = new Set()
let written = 0
let skipped = 0

for (const entry of readdirSync(WORKS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const slug = entry.name
  if (!SLUG_RE.test(slug)) {
    console.warn(`field-sync: skip ${slug} (slug outside [a-z0-9-])`)
    skipped++
    continue
  }
  const metaPath = join(WORKS_DIR, slug, 'meta.json')
  const readmePath = join(WORKS_DIR, slug, 'README.md')
  if (!existsSync(metaPath)) {
    console.warn(`field-sync: skip ${slug} (missing meta.json)`)
    skipped++
    continue
  }

  let meta
  try {
    meta = JSON.parse(readFileSync(metaPath, 'utf8'))
  } catch (e) {
    console.warn(`field-sync: skip ${slug} (meta.json unparsable: ${e.message})`)
    skipped++
    continue
  }
  if (!meta.title || !meta.date || !meta.author) {
    console.warn(`field-sync: skip ${slug} (meta.json missing title/date/author)`)
    skipped++
    continue
  }

  const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : ''
  const fm = [
    '---',
    `title: ${y(meta.title)}`,
    `date: ${y(meta.date)}`,
    `author: ${y(meta.author)}`,
    `medium: ${y(meta.medium)}`,
    `embodies: ${y(meta.embodies)}`,
    `workUrl: ${y(`${REPO_WORKS_URL}/${slug}`)}`,
    `labUrl: ${y(`${LAB_WORKS_URL}/${slug}/`)}`,
    '---',
    '',
  ].join('\n')

  writeFileSync(join(OUT_DIR, `${slug}.md`), fm + readme)
  seen.add(`${slug}.md`)
  written++
}

// Remove mirror files whose work no longer exists upstream.
let removed = 0
for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith('.md') && !seen.has(f)) {
    rmSync(join(OUT_DIR, f))
    console.warn(`field-sync: removed stale ${f}`)
    removed++
  }
}

console.log(
  `field-sync: ${written} works mirrored from ${basename(SOURCE)}, ${skipped} skipped, ${removed} stale removed → src/content/field-works/`,
)
