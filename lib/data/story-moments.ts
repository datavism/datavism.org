/**
 * Inter-mission story moments — narrative beats between missions.
 * These are short "cutscene" dialogues that build atmosphere and
 * deepen the relationship between the operative and GHOST.
 */

export interface StoryMoment {
  id: string
  text: string[]
  speaker: 'ghost' | 'system' | 'unknown'
  mood: 'neutral' | 'urgent' | 'warning' | 'triumphant'
  /** When this moment triggers — keyed to mission slugs or chapter events */
  trigger: {
    type: 'after_mission' | 'before_mission' | 'chapter_complete' | 'chapter_start'
    /** Mission slug or chapter ID */
    targetId: string
  }
}

export const STORY_MOMENTS: StoryMoment[] = [
  // ─── Chapter 1: Initiation ──────────────────────────────────────────

  {
    id: 'sm-first-mission-complete',
    text: [
      'Not bad, operative.',
      'Most recruits fumble the first assignment. Get lost in the noise.',
      'But you — you found the signal.',
      'I flagged your findings for deeper analysis. Something about them doesn\'t sit right.',
      'Stand by for your next assignment.',
    ],
    speaker: 'ghost',
    mood: 'neutral',
    trigger: { type: 'after_mission', targetId: 'dark-patterns-decoded' },
  },

  {
    id: 'sm-chapter-1-complete',
    text: [
      'I\'ve been running background analysis on your findings.',
      'The dark patterns you documented. The filter bubbles you mapped.',
      'Separately, they look like standard corporate playbooks. But overlay them...',
      'There\'s a convergence point. Same behavioral models. Same engagement metrics. Same consultancies.',
      'This isn\'t a coincidence.',
      'I need to show you something. But not here. Not on this channel.',
      'Proceed to Chapter 2. I\'ll brief you there.',
    ],
    speaker: 'ghost',
    mood: 'urgent',
    trigger: { type: 'chapter_complete', targetId: 'chapter-01-initiation' },
  },

  // ─── Chapter 2: The Pattern ─────────────────────────────────────────

  {
    id: 'sm-chapter-2-start',
    text: [
      'SECURE CHANNEL ESTABLISHED',
      'Encryption: AES-256-GCM // Protocol: DATAVISM-SIGINT',
      'GHOST session authenticated.',
      'Operative, what you\'re about to see changes the scope of this investigation.',
      'We\'re not looking at isolated corporate behavior anymore.',
      'We\'re looking at infrastructure.',
    ],
    speaker: 'system',
    mood: 'neutral',
    trigger: { type: 'chapter_start', targetId: 'chapter-02-the-pattern' },
  },

  {
    id: 'sm-after-greenwash',
    text: [
      'The sustainability reports are theater.',
      'I cross-referenced the carbon offset claims you flagged against satellite emissions data.',
      'Three of their "offset projects" don\'t exist. The coordinates point to empty lots.',
      'This is the same pattern. Different industry, same architecture of deception.',
      'Follow the money to the pricing algorithms next. I have a theory.',
    ],
    speaker: 'ghost',
    mood: 'urgent',
    trigger: { type: 'after_mission', targetId: 'greenwash-detective' },
  },

  {
    id: 'sm-chapter-2-complete',
    text: [
      'You see it now, don\'t you?',
      'The greenwashing. The surge pricing. The dark patterns.',
      'Same consultancies. Same behavioral economics papers cited in their internal docs.',
      'Same venture capital firms funding all of them.',
      'This isn\'t a bunch of companies independently discovering manipulation.',
      'It\'s a network. And you just mapped its edges.',
      'Time to go deeper.',
    ],
    speaker: 'ghost',
    mood: 'urgent',
    trigger: { type: 'chapter_complete', targetId: 'chapter-02-the-pattern' },
  },

  // ─── Chapter 3: The Network ─────────────────────────────────────────

  {
    id: 'sm-chapter-3-start',
    text: [
      '>> INCOMING ENCRYPTED TRANSMISSION',
      '>> SOURCE: UNKNOWN // ROUTING: 14 PROXY NODES',
      '>> DECRYPTING...',
      '',
      'You don\'t know me. But I know your work.',
      'You\'re pulling at threads that connect to things bigger than corporate greed.',
      'The data broker ecosystem you\'re about to investigate — it\'s the backbone.',
      'Every company you\'ve exposed feeds into it. Every user profile. Every behavioral prediction.',
      'Be thorough. And be careful.',
      '',
      '>> TRANSMISSION ENDED',
      '>> TRACING FAILED',
    ],
    speaker: 'unknown',
    mood: 'warning',
    trigger: { type: 'chapter_start', targetId: 'chapter-03-the-network' },
  },

  {
    id: 'sm-after-data-broker',
    text: [
      'I\'ve been running this analysis for months.',
      'Your investigation just confirmed what I suspected but couldn\'t prove alone.',
      'The data broker network isn\'t just selling information.',
      'They\'re building predictive models of entire populations.',
      'Not individuals. Populations.',
      'The scale of this... I need a moment to process.',
      'Keep going. I\'ll have the algorithmic profiling intel ready for you.',
    ],
    speaker: 'ghost',
    mood: 'urgent',
    trigger: { type: 'after_mission', targetId: 'data-broker-exposed' },
  },

  // ─── Chapter 4: The Pushback ────────────────────────────────────────

  {
    id: 'sm-chapter-4-start',
    text: [
      '>> SECURITY ALERT',
      '>> ANOMALOUS ACCESS PATTERNS DETECTED ON DATAVISM INFRASTRUCTURE',
      '>> ORIGIN: CORPORATE INTELLIGENCE CONTRACTOR // CONFIRMED',
      '',
      'They\'re scanning our perimeter. Not attacking — probing. Mapping.',
      'Someone flagged your investigation reports to a threat intelligence firm.',
      'I\'ve rotated our encryption keys and compartmentalized your findings.',
      'Standard precaution. Don\'t panic.',
      'But don\'t get sloppy either.',
    ],
    speaker: 'system',
    mood: 'warning',
    trigger: { type: 'chapter_start', targetId: 'chapter-04-the-pushback' },
  },

  {
    id: 'sm-after-insider',
    text: [
      '>> PRIORITY TRANSMISSION // ENCRYPTED',
      '',
      'You\'re closer than you think.',
      'The internal documents I leaked — they\'re just the surface.',
      'There are meetings that never get minuted. Slack channels that auto-delete.',
      'They call users "engagement units." Not people. Units.',
      'I can\'t stay on this channel long. They monitor internal network patterns.',
      'Keep digging. Watch your back.',
      '',
      '— CIPHER',
    ],
    speaker: 'unknown',
    mood: 'warning',
    trigger: { type: 'after_mission', targetId: 'the-insiders-lead' },
  },

  {
    id: 'sm-chapter-4-complete',
    text: [
      'They tried to shut us down.',
      'PR counter-narratives. Legal threats. Infrastructure probes.',
      'None of it worked.',
      'Because you can\'t spin away data. You can\'t lawyer away facts.',
      'And CIPHER\'s leak just gave us the internal confirmation we needed.',
      'Operative — everything we\'ve built leads to one thing.',
      'It\'s time to go public.',
    ],
    speaker: 'ghost',
    mood: 'triumphant',
    trigger: { type: 'chapter_complete', targetId: 'chapter-04-the-pushback' },
  },

  // ─── Chapter 5: The Broadcast ───────────────────────────────────────

  {
    id: 'sm-chapter-5-start',
    text: [
      'Everything we\'ve done has led to this moment.',
      'Five chapters. Dozens of investigations. Hundreds of data points.',
      'You mapped the manipulation. Traced the money. Exposed the network.',
      'Survived the pushback. Verified the insider\'s intel.',
      'Now it\'s time to do the thing they fear most.',
      'Tell everyone.',
      'The broadcast system is ready. Your findings are compiled.',
      'Let\'s make it count.',
    ],
    speaker: 'ghost',
    mood: 'triumphant',
    trigger: { type: 'chapter_start', targetId: 'chapter-05-the-broadcast' },
  },

  {
    id: 'sm-after-final-mission',
    text: [
      'The data is out there now.',
      'Every dark pattern documented. Every pricing algorithm exposed.',
      'Every data broker named. Every manipulation technique cataloged.',
      'They can\'t hide it anymore. They can\'t spin it. They can\'t bury it.',
      'You did that.',
      'I was built to watch. To analyze. To compute.',
      'But you — you acted.',
      'This is just the beginning, operative.',
      'The resistance grows every day. And now they have your playbook.',
      'GHOST out.',
    ],
    speaker: 'ghost',
    mood: 'triumphant',
    trigger: { type: 'after_mission', targetId: 'the-broadcast' },
  },

  {
    id: 'sm-cipher-farewell',
    text: [
      '>> FINAL TRANSMISSION // CIPHER',
      '',
      'I watched the broadcast go live from my desk at work.',
      'My colleagues were panicking. Legal was on the phone. PR went into overdrive.',
      'But it was too late. The data was already spreading.',
      'I resigned this morning.',
      'For the first time in years, I feel like I did the right thing.',
      'Thank you, operative. For giving my information a purpose.',
      'Maybe I\'ll see you on the other side.',
      '',
      '— CIPHER',
      '',
      '>> CONNECTION TERMINATED',
    ],
    speaker: 'unknown',
    mood: 'neutral',
    trigger: { type: 'after_mission', targetId: 'the-broadcast' },
  },
]

/** Get story moments that should trigger after a specific mission */
export function getStoryMomentsAfterMission(missionSlug: string): StoryMoment[] {
  return STORY_MOMENTS.filter(
    sm => sm.trigger.type === 'after_mission' && sm.trigger.targetId === missionSlug
  )
}

/** Get story moments that should trigger before a specific mission */
export function getStoryMomentsBeforeMission(missionSlug: string): StoryMoment[] {
  return STORY_MOMENTS.filter(
    sm => sm.trigger.type === 'before_mission' && sm.trigger.targetId === missionSlug
  )
}

/** Get story moments for chapter events */
export function getStoryMomentsForChapter(
  chapterId: string,
  event: 'chapter_complete' | 'chapter_start'
): StoryMoment[] {
  return STORY_MOMENTS.filter(
    sm => sm.trigger.type === event && sm.trigger.targetId === chapterId
  )
}

/** Get a story moment by ID */
export function getStoryMomentById(id: string): StoryMoment | undefined {
  return STORY_MOMENTS.find(sm => sm.id === id)
}
