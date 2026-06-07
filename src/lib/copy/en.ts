// src/lib/copy/en.ts
// Single source for site copy. DE wird später als de.ts ergänzt (VISION §2).
// Slogans: docs/STORY.md §8 · Manifest: docs/MANIFESTO.md

export const COPY = {
  meta: {
    title: 'DATAVISM — The Data Underground',
    description:
      'The school of the Data Underground. You won’t learn to code — ' +
      'you’ll learn to command: AI, data, and the right questions. ' +
      'The revolution will be computed.',
  },
  hero: {
    title: 'DATAVISM',
    subline: 'THE DATA UNDERGROUND',
    hook: 'They track you. Learn to track back.',
    sub:
      'You won’t learn to code here. You’ll learn to command — ' +
      'AI, data, and the right questions.',
    slogan: 'The revolution will be computed.',
    ctaManifesto: 'Read the manifesto',
    ctaUpstairs: 'meanwhile, upstairs: data-snack.com',
  },
  counter: {
    lead: 'trackable signals emitted on this page so far:',
    collectedNote: 'collected by us: 0. not even ironically.',
    hint: 'moves, clicks, scrolls, seconds — everything a tracker would eat.',
  },
  map: {
    heading: 'THE NETWORK',
    sub: 'Five lines. Every line ends at an adversary.',
    openingFirst: 'LINE G — opening first',
    lines: {
      g: { name: 'LINE G · FOUNDATION', topic: 'Vibe coding & AI orchestration', boss: 'feeds all lines' },
      k: { name: 'LINE K', topic: 'Tracking forensics · OSINT', boss: 'terminus: PANOPTICON' },
      r: { name: 'LINE R', topic: 'Economics · source-stacking', boss: 'terminus: MAMMON' },
      b: { name: 'LINE B', topic: 'Feeds · streams · retention', boss: 'terminus: THE FEED' },
      v: { name: 'LINE V', topic: 'Climate · demographics · archive', boss: 'terminus: CUMULUS REX' },
    },
  },
  footer: {
    org: 'datavism.org · a non-profit digital art project',
    tracking: 'no tracking on this page. not even ironically.',
  },
} as const
