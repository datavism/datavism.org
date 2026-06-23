# DATAVISM Curriculum Implementation Bundle v0.1

This bundle contains two implementation artifacts generated from the DATAVISM Curriculum Canon:

1. `src/lib/curriculum/lines.ts`  
   Canonical data model for the five DATAVISM lines and 25 stations.

2. `src/content/stations/*.md`  
   Non-destructive station stubs for all 25 stations.

## Important repo note

The existing DATAVISM repo already has content for LINE G, especially `the-folder.md`.

To avoid accidental overwrites, this bundle uses prefixed filenames:

- `g1-the-folder.md`
- `g2-command.md`
- ...
- `v5-cumulus-file.md`

Before copying into the repo, decide whether to:

- keep the existing `the-folder.md` as canonical and ignore/merge `g1-the-folder.md`,
- rename stubs to match the current slug convention,
- or update route/content logic to accept prefixed station files.

## Recommended import order

1. Copy `src/lib/curriculum/lines.ts`.
2. Use it to power the network map and line overview.
3. Review the 25 station stubs.
4. Merge G-line stubs carefully with existing G1–G5 content.
5. Add real sources, missions and story beats station by station.

## Canonical one-sentence definition

DATAVISM is an Evidence Engine: a five-line curriculum where people learn to investigate hidden systems with AI, data and verifiable methods — and turn every line into a public Case File.
