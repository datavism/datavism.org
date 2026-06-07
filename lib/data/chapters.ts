/**
 * Chapter definitions for the DATAVISM narrative arc.
 * A 5-chapter story that turns standalone missions into a connected
 * 1-2 week investigation experience.
 */

export interface ChapterUnlockCondition {
  type: 'missions_completed' | 'chapter_complete'
  /** For missions_completed: how many missions in the previous chapter must be done */
  count?: number
  /** For chapter_complete: which chapter must be finished */
  chapterId?: string
}

export interface Chapter {
  id: string
  number: number
  title: string
  codename: string
  briefing: string
  missionSlugs: string[]
  unlockCondition: ChapterUnlockCondition
  estimatedDays: string
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'chapter-01-initiation',
    number: 1,
    title: 'INITIATION',
    codename: 'FIRST LIGHT',
    briefing: `Welcome to the resistance, operative.

You've been selected because you see what others refuse to look at. The manipulation. The dark patterns. The invisible architecture designed to extract your attention, your data, your autonomy — and sell it back to you at a premium.

GHOST has been monitoring these systems for a long time. But an AI can only observe. It takes a human to act. That's where you come in.

Your first assignments are reconnaissance. Small-scale. Controlled. We need to know what you're made of before we send you deeper. Start by mapping the manipulation techniques hiding in plain sight — the dark patterns that trick billions of users every day, and the filter bubbles that keep them from ever realizing it.

Prove yourself here, and the real work begins.`,
    missionSlugs: ['dark-patterns-decoded', 'filter-bubble-analyzer'],
    unlockCondition: { type: 'missions_completed', count: 0 },
    estimatedDays: 'Day 1-2',
  },
  {
    id: 'chapter-02-the-pattern',
    number: 2,
    title: 'THE PATTERN',
    codename: 'CONVERGENCE',
    briefing: `Operative, your initial findings have triggered something unexpected.

GHOST has been cross-referencing your reconnaissance data against its global monitoring network. The dark patterns you documented? The filter bubbles you mapped? They're not isolated tactics from competing companies. They're the same playbook. Different logos, identical manipulation architecture.

We've traced the methodology to a shared set of behavioral design consultancies — the same firms advising tech giants, airlines, insurance companies, and retail platforms. The techniques you uncovered in Chapter 1 are being deployed at a scale we didn't anticipate.

This changes everything. We need you to follow the money now. Investigate how corporations weaponize pricing algorithms and sustainability narratives. The greenwashing and the surge pricing aren't just corporate misbehavior — they're symptoms of a coordinated approach to consumer exploitation.

Find the pattern. Connect the dots. The deeper you go, the clearer it gets.`,
    missionSlugs: ['greenwash-detective', 'surge-pricing-exposed'],
    unlockCondition: { type: 'chapter_complete', chapterId: 'chapter-01-initiation' },
    estimatedDays: 'Day 3-4',
  },
  {
    id: 'chapter-03-the-network',
    number: 3,
    title: 'THE NETWORK',
    codename: 'DEEP SIGNAL',
    briefing: `You're not fighting individual companies anymore, operative. You're looking at a network.

GHOST has mapped the infrastructure connecting everything you've uncovered. Behind the dark patterns, behind the surge pricing, behind the greenwashing — there's a shadow economy of data brokers, ad exchanges, and surveillance capitalism platforms that make it all possible. They're the ones buying and selling your behavioral profile across hundreds of systems you've never heard of.

Every click you make, every route you take, every purchase you almost made but didn't — it's all captured, packaged, and traded. Companies you've never interacted with know more about you than your closest friends. They've built a digital twin of you, and they're using it to predict and manipulate your behavior before you even know what you want.

This chapter takes you into the belly of the beast. Map the data broker ecosystem. Expose the algorithmic profiling that creates shadow versions of every citizen. Investigate the invisible tax that dynamic pricing levies on the vulnerable.

The network doesn't want to be seen. Make it visible.`,
    missionSlugs: ['invisible-tax', 'data-broker-exposed', 'algorithmic-profiling'],
    unlockCondition: { type: 'chapter_complete', chapterId: 'chapter-02-the-pattern' },
    estimatedDays: 'Day 5-7',
  },
  {
    id: 'chapter-04-the-pushback',
    number: 4,
    title: 'THE PUSHBACK',
    codename: 'COUNTERSTRIKE',
    briefing: `Your investigations are making waves, operative. And not everyone is happy about it.

GHOST has intercepted communications suggesting that corporate intelligence teams have flagged your research. PR firms are preparing counter-narratives. Legal departments are drafting cease-and-desist templates. You've touched a nerve, and the machine is pushing back.

But here's the thing they didn't expect: you're not alone.

An anonymous insider — we're calling them CIPHER — has made contact through GHOST's encrypted channels. They work inside one of the companies you've been investigating, and they have access to internal documents that could blow this wide open. Leaked memos. A/B testing reports. Internal presentations about "engagement optimization" that read like psychological warfare manuals.

CIPHER is taking an enormous personal risk. The information they're providing is explosive, but it needs to be verified, contextualized, and protected. That's your job now. Analyze the leak. Investigate the sentiment manipulation engines. Audit the algorithms that are supposed to be neutral but are anything but.

The stakes just got real. They're watching you. Keep going anyway.`,
    missionSlugs: ['the-insiders-lead', 'sentiment-manipulation', 'the-algorithm-audit'],
    unlockCondition: { type: 'chapter_complete', chapterId: 'chapter-03-the-network' },
    estimatedDays: 'Day 8-10',
  },
  {
    id: 'chapter-05-the-broadcast',
    number: 5,
    title: 'THE BROADCAST',
    codename: 'SIGNAL FLARE',
    briefing: `This is it, operative. The endgame.

You've spent weeks investigating. You've mapped dark patterns, exposed pricing discrimination, traced the data broker network, analyzed leaked documents, and audited the algorithms that shape reality for billions of people. You have something most people never get: the full picture.

Now comes the hardest part — turning investigation into intervention.

GHOST has been building something in the background while you worked. A broadcast system. A way to take everything you've uncovered and package it so it can't be ignored, can't be buried, can't be spun by corporate PR machines. Your transparency report will connect every thread. Your counter-surveillance toolkit will give ordinary people the weapons to fight back. And The Broadcast itself — your final mission — will push it all into the light.

The corporations spent billions building systems of control. You're about to show the world how those systems work, and hand people the tools to dismantle them.

No more hiding in the shadows. It's time to go public.

GHOST says: "I was built to watch. You were built to act. Let's finish this."`,
    missionSlugs: ['the-transparency-report', 'counter-surveillance-toolkit', 'the-broadcast'],
    unlockCondition: { type: 'chapter_complete', chapterId: 'chapter-04-the-pushback' },
    estimatedDays: 'Day 11-14',
  },
]

/** Get a chapter by ID */
export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find(c => c.id === id)
}

/** Get a chapter by number */
export function getChapterByNumber(num: number): Chapter | undefined {
  return CHAPTERS.find(c => c.number === num)
}

/** Get the chapter that contains a given mission slug */
export function getChapterForMission(missionSlug: string): Chapter | undefined {
  return CHAPTERS.find(c => c.missionSlugs.includes(missionSlug))
}

/**
 * Determine whether a chapter is unlocked based on completed missions and chapters.
 */
export function isChapterUnlocked(
  chapter: Chapter,
  completedMissionIds: string[],
  completedChapterIds: string[]
): boolean {
  const { unlockCondition } = chapter

  if (unlockCondition.type === 'missions_completed') {
    // Chapter 1 is always unlocked (count: 0)
    return (unlockCondition.count ?? 0) <= completedMissionIds.length
  }

  if (unlockCondition.type === 'chapter_complete') {
    return completedChapterIds.includes(unlockCondition.chapterId ?? '')
  }

  return false
}

/**
 * Check if a chapter is complete — all its missions have been finished.
 * Uses mission slugs matched against the missions data to find IDs.
 */
export function isChapterComplete(
  chapter: Chapter,
  completedMissionIds: string[],
  getMissionIdBySlug: (slug: string) => string | undefined
): boolean {
  return chapter.missionSlugs.every(slug => {
    const missionId = getMissionIdBySlug(slug)
    return missionId ? completedMissionIds.includes(missionId) : false
  })
}
