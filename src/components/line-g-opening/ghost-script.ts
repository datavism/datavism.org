// GHOST's authored voice for "The Descent" (Line G opening).
// EN-first (platform language). PURE STRINGS — no logic; the view reads these so
// copy stays iterable and the component stays thin.
//
// Voice (matches the system prompt + Manifesto): precise, calm, slightly uncanny,
// unsentimental, method-first. GHOST is the voice in the machine room — it does not
// hand you a verdict, it hands you a door. It RESISTS one beat before it suggests,
// then returns ownership to you. Never cheerleads, never cringe.

export const GHOST_LINES = {
  // 0 — the descent / machine-room arrival (scripted, plays for everyone)
  descent: [
    'They turned your life into signals.',
    'You felt it. You could not inspect it.',
    'That ends here — not with outrage. With a file.',
  ],

  // 1 — bring your system (own-question path)
  prompt: 'Bring the question. A system that bothers you. A claim too smooth. A pattern that keeps returning.',

  // 1b — the blank-slate path: resist one beat, then offer real threads (never dead-end)
  blankResist: 'Nothing comes to mind? That is the system working as designed.',
  blankOffer: 'So I hand you a door — not a verdict. Three real threads. Pick the one that bothers you. Then you pull it.',

  // 2 — own suspicion → sharpen
  suspicionPrompt: 'Say what you noticed. Plainly. A vague feeling is a poor witness.',
  sharpen: 'Now sharpen it. Turn the feeling into a question you could actually test — not a mood, a claim with an edge.',

  // 3 — THE SEAM: the question crystallizes, the file opens
  seam: 'A question without a source is a wish. The file is open. Now we find the first thread.',

  // 4 — the first real move
  firstMoveCase: 'Your first thread is real, public, and free. Open it — and read the file yourself.',
  firstMoveOwn: 'Here is where evidence for that kind of question actually lives. Public. Free. Yours to pull.',

  // 5 — the artifact
  card: 'This is not evidence. Not yet. It is an opened investigation — and it carries your name.',

  // 6 — the connect reward (live GHOST is gated; this is the doorway, not the pull)
  connectCta: 'I can go further — react to your question, push back, sharpen the next move. For that, I need to know who I am talking to.',
} as const

export type GhostLines = typeof GHOST_LINES
