/**
 * Seed missions for DATAVISM.
 * Real-world investigations that users tackle with AI assistance.
 */

export interface Mission {
  id: string
  slug: string
  title: string
  briefing: string
  description: string
  category: 'greenwashing' | 'surveillance' | 'pricing' | 'inequality' | 'manipulation'
  difficulty: 'recruit' | 'operative' | 'elite'
  objectives: string[]
  dataSources: string[]
  estimatedTime: string
  influenceReward: number
}

export const MISSIONS: Mission[] = [
  {
    id: 'mission-greenwash-01',
    slug: 'greenwash-detective',
    title: 'The Greenwash Detective',
    briefing: `CLASSIFIED // PRIORITY: HIGH

A major corporation claims to be "carbon neutral by 2030." Their annual sustainability report is 200 pages of graphs and promises. But the numbers don't add up.

Your mission: Analyze their public environmental claims against available emissions data. Find the gap between PR and reality.

The truth is in the data. Find it.`,
    description: 'Investigate corporate environmental claims against real emissions data. Expose greenwashing through data analysis.',
    category: 'greenwashing',
    difficulty: 'recruit',
    objectives: [
      'Identify 3 specific claims from the corporation\'s sustainability report',
      'Find publicly available emissions or environmental data to verify those claims',
      'Calculate the discrepancy between claims and reality',
      'Create a summary report with evidence',
    ],
    dataSources: [
      'Corporate sustainability reports (publicly available PDFs)',
      'EPA emissions databases',
      'Climate Trace (climatetrace.org)',
      'CDP disclosure data',
    ],
    estimatedTime: '30-60 min',
    influenceReward: 150,
  },
  {
    id: 'mission-surge-01',
    slug: 'surge-pricing-exposed',
    title: 'Surge Pricing Exposed',
    briefing: `CLASSIFIED // PRIORITY: MEDIUM

Ride-share companies claim their pricing is "fair and transparent." But users in different neighborhoods — with different income levels — report wildly different prices for similar distances.

Your mission: Investigate whether dynamic pricing algorithms discriminate based on location, device, or user profile.

They say the algorithm is neutral. Prove them wrong.`,
    description: 'Analyze ride-share pricing patterns to uncover algorithmic discrimination based on location and demographics.',
    category: 'pricing',
    difficulty: 'operative',
    objectives: [
      'Research how ride-share dynamic pricing works (public documentation)',
      'Find examples of price discrimination reports or studies',
      'Analyze the correlation between neighborhood income and surge pricing',
      'Propose a monitoring methodology to track ongoing discrimination',
    ],
    dataSources: [
      'Academic studies on ride-share pricing',
      'Consumer complaint databases',
      'Census income data by ZIP code',
      'Public ride-share API documentation',
    ],
    estimatedTime: '45-90 min',
    influenceReward: 250,
  },
  {
    id: 'mission-bubble-01',
    slug: 'filter-bubble-analyzer',
    title: 'Filter Bubble Analyzer',
    briefing: `CLASSIFIED // PRIORITY: HIGH

Social media platforms claim to "connect the world." In reality, their algorithms create invisible walls — echo chambers that trap users in loops of confirmation bias.

Your mission: Analyze how content recommendation algorithms create filter bubbles and quantify their impact on information diversity.

They profit from division. Document the mechanism.`,
    description: 'Investigate how social media algorithms create echo chambers and limit information diversity.',
    category: 'manipulation',
    difficulty: 'recruit',
    objectives: [
      'Research the mechanics of content recommendation algorithms',
      'Find studies or data on filter bubble effects',
      'Identify specific platform features that reinforce echo chambers',
      'Draft a "Filter Bubble Impact Report" with actionable findings',
    ],
    dataSources: [
      'Platform transparency reports',
      'Academic research on algorithmic bias',
      'The Markup investigations',
      'Mozilla Foundation research',
    ],
    estimatedTime: '30-60 min',
    influenceReward: 150,
  },
  {
    id: 'mission-invisible-tax-01',
    slug: 'invisible-tax',
    title: 'The Invisible Tax',
    briefing: `CLASSIFIED // PRIORITY: CRITICAL

You search for a flight on your Mac. Your colleague searches for the same flight on an older Android phone. Different prices. Same flight. Same time.

Dynamic pricing doesn't just respond to demand — it profiles YOU. Your device, your browser history, your location, your desperation.

Your mission: Expose how dynamic pricing creates an invisible tax on certain users.

They charge you more because they can. Build the evidence.`,
    description: 'Expose how e-commerce dynamic pricing discriminates based on device, location, and browsing behavior.',
    category: 'pricing',
    difficulty: 'operative',
    objectives: [
      'Research documented cases of device-based price discrimination',
      'Analyze how cookies and browsing history affect displayed prices',
      'Find at least 3 companies confirmed to use discriminatory pricing',
      'Design a simple experiment users could run to detect price discrimination',
    ],
    dataSources: [
      'Consumer protection agency reports',
      'Academic papers on price discrimination',
      'Investigative journalism archives',
      'Browser extension privacy reports',
    ],
    estimatedTime: '45-90 min',
    influenceReward: 250,
  },
  {
    id: 'mission-dark-patterns-01',
    slug: 'dark-patterns-decoded',
    title: 'Dark Patterns Decoded',
    briefing: `CLASSIFIED // PRIORITY: MEDIUM

That "X" button that's slightly too small. The pre-checked box you missed. The countdown timer that resets when you refresh. The "free trial" that's designed to be impossible to cancel.

These aren't bugs. They're dark patterns — deliberate UI design choices meant to manipulate you into actions you didn't intend.

Your mission: Catalog and analyze dark patterns across major platforms. Build an evidence dossier.

They design against you. Document every trick.`,
    description: 'Catalog manipulative UI design patterns across major apps and websites. Build an evidence database.',
    category: 'manipulation',
    difficulty: 'recruit',
    objectives: [
      'Identify and categorize at least 5 dark patterns from major platforms',
      'Screenshot and document each pattern with explanation of the manipulation',
      'Research which regulations (if any) these patterns violate',
      'Create a "Dark Pattern Field Guide" others can use to spot these tricks',
    ],
    dataSources: [
      'darkpatterns.org catalog',
      'FTC enforcement actions',
      'EU Digital Services Act documentation',
      'Deceptive Design (deceptive.design) pattern library',
    ],
    estimatedTime: '30-60 min',
    influenceReward: 150,
  },

  // ─── Chapter 3: THE NETWORK ────────────────────────────────────────

  {
    id: 'mission-data-broker-01',
    slug: 'data-broker-exposed',
    title: 'Data Broker Exposed',
    briefing: `CLASSIFIED // PRIORITY: CRITICAL
OPERATION: SHADOW MARKET

There are companies you've never heard of that know your name, your address, your income, your health conditions, your political leanings, and what you had for breakfast. They didn't hack you. They bought you — legally — from a sprawling ecosystem of data brokers that operates in the gaps between privacy laws.

GHOST has identified over 4,000 data brokerage firms operating globally. They collect information from public records, loyalty programs, social media, mobile apps, and hundreds of other sources. Then they package and sell it. Your "profile" has been bought and sold an estimated 700 times in the last year alone.

The data broker economy is worth $250 billion annually. It fuels targeted advertising, political campaigns, insurance pricing, employment screening, and surveillance programs — all without meaningful consent or transparency.

Your mission: Map the data broker ecosystem. Identify the major players, trace how personal data flows between them, and document what information is being collected and sold. This shadow market depends on invisibility. Make it visible.`,
    description: 'Investigate the shadowy world of data brokers who buy and sell personal information. Map the data broker ecosystem.',
    category: 'surveillance',
    difficulty: 'operative',
    objectives: [
      'Identify and profile at least 5 major data broker companies and their specializations',
      'Map the data flow: trace how a single piece of personal data moves from collection to sale',
      'Document what categories of personal information are being traded (health, financial, behavioral, etc.)',
      'Research existing regulations (CCPA, GDPR) and identify enforcement gaps in data broker oversight',
      'Create a "Data Broker Dossier" that ordinary people could use to opt out of major broker databases',
    ],
    dataSources: [
      'FTC reports on data broker industry',
      'State attorney general investigations',
      'Privacy Rights Clearinghouse data broker list',
      'GDPR enforcement action databases',
      'Academic research on data markets',
    ],
    estimatedTime: '60-90 min',
    influenceReward: 300,
  },
  {
    id: 'mission-algo-profiling-01',
    slug: 'algorithmic-profiling',
    title: 'Algorithmic Profiling',
    briefing: `CLASSIFIED // PRIORITY: CRITICAL
OPERATION: SHADOW SELF

You never told them your political beliefs. You never shared your medical history. You never disclosed your financial anxieties. But they know. They've built a shadow version of you — a digital twin assembled from thousands of behavioral signals you didn't know you were emitting.

Every pause on a post. Every swipe speed. Every time you almost clicked but didn't. The micro-hesitations, the scroll velocity, the time of day you're most vulnerable to impulse decisions. Machine learning models have consumed these signals and constructed a psychological profile that, according to internal research, can predict your behavior with 87% accuracy.

GHOST has obtained documentation from three separate platforms showing that "inferred attributes" — characteristics they've deduced about you without your knowledge — are being used to serve content, set prices, and influence what you see and don't see.

Your mission: Investigate how platforms create shadow profiles and behavioral predictions. Document the gap between what users knowingly share and what platforms secretly infer. This is the architecture of manipulation, and it starts with knowing you better than you know yourself.`,
    description: 'Investigate how platforms create shadow profiles and behavioral predictions. What do they know about you that you never told them?',
    category: 'surveillance',
    difficulty: 'operative',
    objectives: [
      'Research how major platforms build inferred user profiles from behavioral data',
      'Document at least 5 categories of "shadow data" — information platforms deduce without user input',
      'Find examples of algorithmic profiling leading to real-world discrimination (housing, employment, credit)',
      'Analyze a platform\'s ad targeting categories to reveal what they think they know about users',
      'Propose transparency requirements that would force platforms to disclose inferred attributes',
    ],
    dataSources: [
      'Platform ad preference/interest pages (Facebook, Google, etc.)',
      'Academic papers on inference attacks and behavioral profiling',
      'ProPublica algorithmic accountability investigations',
      'AI Now Institute reports on automated decision systems',
      'GDPR Article 22 enforcement cases on automated profiling',
    ],
    estimatedTime: '60-90 min',
    influenceReward: 300,
  },

  // ─── Chapter 4: THE PUSHBACK ───────────────────────────────────────

  {
    id: 'mission-insider-01',
    slug: 'the-insiders-lead',
    title: "The Insider's Lead",
    briefing: `CLASSIFIED // PRIORITY: MAXIMUM
OPERATION: DEEP THROAT
SOURCE DESIGNATION: CIPHER

Operative, this changes everything.

An anonymous source — codename CIPHER — has made contact through GHOST's encrypted relay. They claim to be a senior engineer at a major platform company, and they've leaked a cache of internal documents that detail how the company's "user engagement optimization" program actually works.

The leaked materials include: internal A/B testing results showing deliberate manipulation of user emotions to increase engagement, a presentation titled "Friction Architecture: Converting Resistance into Revenue," executive memos discussing the trade-off between user wellbeing and quarterly targets, and code comments from the recommendation engine that reference "addiction loops" and "variable reward schedules."

CIPHER says they leaked the documents because, and we quote: "I built systems I'm no longer willing to defend. The gap between what we tell the public and what we discuss internally isn't a gap — it's a chasm."

Your mission: Analyze CIPHER's leaked materials. Verify the claims against publicly observable platform behavior. Find the smoking gun that connects internal intent to external harm. This is the evidence that could force accountability — if we handle it right.`,
    description: 'An anonymous source has leaked internal documents about a company\'s data practices. Analyze the leak and find the smoking gun.',
    category: 'manipulation',
    difficulty: 'elite',
    objectives: [
      'Analyze the structure of leaked documents for internal consistency and credibility markers',
      'Cross-reference leaked claims with publicly observable platform behaviors and design patterns',
      'Identify the "smoking gun" — the clearest evidence of deliberate user manipulation for profit',
      'Research historical whistleblower cases (Facebook Papers, etc.) for patterns and parallels',
      'Draft a verified summary that could withstand legal and journalistic scrutiny',
    ],
    dataSources: [
      'Facebook Papers / Frances Haugen disclosures',
      'SEC whistleblower complaint databases',
      'Internal tech company culture documents (Glassdoor, Blind)',
      'Congressional testimony transcripts from tech hearings',
      'Investigative journalism databases (ICIJ, The Markup)',
    ],
    estimatedTime: '90-120 min',
    influenceReward: 400,
  },
  {
    id: 'mission-sentiment-01',
    slug: 'sentiment-manipulation',
    title: 'Sentiment Manipulation',
    briefing: `CLASSIFIED // PRIORITY: CRITICAL
OPERATION: MOOD MACHINE

In 2014, Facebook ran an experiment on 689,003 users without their knowledge. They manipulated the News Feed to show some users more positive content and others more negative content. The result: they proved they could change how people feel at scale. They published the study. The public was outraged. Facebook apologized.

They didn't stop. They got better at hiding it.

GHOST has compiled evidence suggesting that emotional manipulation through content curation is not an anomaly — it's a core business practice. Platforms A/B test everything: the color of notification badges, the timing of alerts, the emotional valence of recommended content. Every test is designed to maximize one metric: time spent on platform.

The consequence is a global-scale mood manipulation engine that can make populations more anxious, more outraged, more addicted — not as a side effect, but as a feature. When you're anxious, you scroll more. When you're outraged, you engage more. When you're addicted, you come back more.

Your mission: Investigate how platforms use A/B testing and emotional manipulation to change user behavior at scale. Document the mechanisms, the evidence, and the human cost.`,
    description: 'Investigate how platforms use A/B testing and emotional manipulation to change user behavior at scale.',
    category: 'manipulation',
    difficulty: 'elite',
    objectives: [
      'Document the Facebook emotional contagion study and its long-term implications',
      'Research how A/B testing frameworks are used to optimize for engagement over wellbeing',
      'Find evidence of notification timing, content valence, and UX design being weaponized for retention',
      'Analyze the psychological research behind variable reward schedules in social media design',
      'Quantify the mental health impact: correlate platform usage patterns with anxiety/depression research',
    ],
    dataSources: [
      'Kramer et al. 2014 emotional contagion study',
      'Internal platform research leaked via whistleblowers',
      'American Psychological Association reports on social media',
      'Surgeon General advisory on youth mental health',
      'Center for Humane Technology research database',
    ],
    estimatedTime: '90-120 min',
    influenceReward: 400,
  },
  {
    id: 'mission-algo-audit-01',
    slug: 'the-algorithm-audit',
    title: 'The Algorithm Audit',
    briefing: `CLASSIFIED // PRIORITY: CRITICAL
OPERATION: BLACK BOX

They call them "neutral algorithms." Objective. Mathematical. Unbiased. Just code doing math on data.

It's the biggest lie in technology.

GHOST has been tracking recommendation algorithm outputs across multiple platforms for months. The patterns are damning. Content promoting outrage gets 6x more distribution than nuanced analysis. Misinformation that generates engagement is amplified; corrections that reduce engagement are suppressed. Marginalized voices are systematically downranked while inflammatory content from established accounts is boosted.

The algorithms aren't neutral — they're optimized. And they're optimized for metrics that are fundamentally misaligned with human wellbeing, democratic discourse, and social cohesion. The companies know this. Internal research at multiple platforms has shown that their algorithms amplify harmful content. The response? Bury the research. Reassign the researchers. Optimize harder.

Your mission: Conduct a systematic audit of a recommendation algorithm. Document bias, manipulation vectors, and accountability gaps. This is the evidence base for algorithmic regulation — and it starts with proving that the "neutral algorithm" narrative is a myth.`,
    description: 'Conduct a systematic audit of a recommendation algorithm. Document bias, manipulation vectors, and accountability gaps.',
    category: 'manipulation',
    difficulty: 'elite',
    objectives: [
      'Select a platform and design an audit methodology for its recommendation algorithm',
      'Document content amplification patterns: what gets boosted vs. what gets suppressed',
      'Identify at least 3 bias vectors in the algorithm (political, demographic, engagement-driven)',
      'Research existing algorithmic audit frameworks (NIST, EU AI Act) and assess their adequacy',
      'Produce an "Algorithm Accountability Report" with findings, methodology, and policy recommendations',
    ],
    dataSources: [
      'NIST AI Risk Management Framework',
      'EU AI Act classification and audit requirements',
      'Algorithm Watch monitoring reports',
      'Mozilla Rally browser extension research data',
      'Academic algorithmic auditing papers (Sandvig et al.)',
    ],
    estimatedTime: '90-120 min',
    influenceReward: 400,
  },

  // ─── Chapter 5: THE BROADCAST ──────────────────────────────────────

  {
    id: 'mission-transparency-01',
    slug: 'the-transparency-report',
    title: 'The Transparency Report',
    briefing: `CLASSIFIED // PRIORITY: MAXIMUM
OPERATION: FULL SPECTRUM

Operative, you've been on this path for weeks now. You started by documenting dark patterns and filter bubbles. You traced the money through greenwashing and surge pricing. You mapped the data broker network and exposed algorithmic profiling. You analyzed leaked documents and audited the algorithms themselves.

Now it's time to connect every thread into a single, undeniable narrative.

GHOST has been indexing your findings across all previous missions. The picture that emerges is staggering in scope: a interconnected system of corporate surveillance, behavioral manipulation, and economic exploitation that operates at global scale, across industries, with near-total impunity.

But scattered findings don't change the world. Connected findings do. Your transparency report needs to show that these aren't isolated incidents of corporate misbehavior — they're features of an economic system that has been deliberately designed to prioritize extraction over human welfare.

Your mission: Compile findings from all previous investigations into a comprehensive transparency report. Create a narrative that connects the dots between dark patterns, algorithmic manipulation, data brokerage, and corporate resistance to accountability. Make it impossible to look away.`,
    description: 'Compile findings from all previous investigations into a comprehensive transparency report that connects every thread.',
    category: 'inequality',
    difficulty: 'elite',
    objectives: [
      'Create an executive summary connecting findings across all previous missions into a coherent narrative',
      'Map the relationships between companies, data brokers, ad platforms, and manipulation techniques',
      'Identify the 3 most impactful findings from your investigation and develop them into case studies',
      'Analyze systemic failures: where regulation, journalism, and public awareness have fallen short',
      'Draft policy recommendations based on your evidence — specific, actionable, and backed by data',
    ],
    dataSources: [
      'All previous mission reports and findings',
      'Corporate annual reports and SEC filings',
      'Regulatory gap analysis frameworks',
      'Investigative journalism methodology guides (GIJN)',
      'UN Guiding Principles on Business and Human Rights',
    ],
    estimatedTime: '120-180 min',
    influenceReward: 500,
  },
  {
    id: 'mission-counter-surveillance-01',
    slug: 'counter-surveillance-toolkit',
    title: 'Counter-Surveillance Toolkit',
    briefing: `CLASSIFIED // PRIORITY: HIGH
OPERATION: SHIELD WALL

Knowledge without action is just surveillance of a different kind. You've spent weeks watching the watchers. Now it's time to give ordinary people the tools to fight back.

Throughout your investigation, you've documented dozens of techniques that corporations use to track, profile, manipulate, and exploit users. Every one of those techniques has a countermeasure. Every surveillance system has a blind spot. Every manipulation pattern can be recognized and resisted — if people know what to look for.

GHOST has been compiling a database of defensive techniques, privacy tools, and resistance strategies drawn from your investigations. But a raw database isn't enough. People need a toolkit — something practical, accessible, and empowering. Something that transforms awareness into action.

Your mission: Design and document a counter-surveillance toolkit that helps ordinary people protect themselves from the surveillance and manipulation techniques you've uncovered. Think of it as an instruction manual for digital self-defense. Every tool should be free, open-source where possible, and usable by someone without technical expertise.

You're not just investigating anymore. You're building the resistance infrastructure.`,
    description: 'Design a practical toolkit that helps ordinary people protect themselves from the surveillance techniques you have uncovered.',
    category: 'surveillance',
    difficulty: 'elite',
    objectives: [
      'Catalog the top 10 surveillance/manipulation techniques uncovered during your investigation',
      'For each technique, identify practical countermeasures accessible to non-technical users',
      'Curate a recommended privacy toolkit: browser extensions, VPNs, settings changes, and behavioral practices',
      'Create a "Threat Model" template that helps people assess their personal surveillance exposure',
      'Design a shareable "Digital Self-Defense Guide" formatted for viral distribution',
    ],
    dataSources: [
      'EFF Surveillance Self-Defense guides',
      'Privacy Guides (privacyguides.org)',
      'Access Now digital security helpline resources',
      'Freedom of the Press Foundation security tools',
      'NIST privacy framework for individuals',
    ],
    estimatedTime: '90-120 min',
    influenceReward: 500,
  },
  {
    id: 'mission-broadcast-01',
    slug: 'the-broadcast',
    title: 'The Broadcast',
    briefing: `CLASSIFIED // PRIORITY: ABSOLUTE
OPERATION: SIGNAL FLARE
AUTHORIZATION: MAXIMUM CLEARANCE

This is the final mission, operative. Everything has been building to this moment.

You started as a recruit documenting dark patterns in a dimly lit terminal. Now you hold the most comprehensive investigation into corporate surveillance and manipulation that GHOST has ever facilitated. Your transparency report connects the dots. Your counter-surveillance toolkit arms the public. The evidence is overwhelming, verified, and undeniable.

The question is no longer whether the system is broken. The question is whether anyone will do anything about it. History says: only when the evidence can't be ignored. Only when the public sees it. Only when the narrative is too powerful to bury.

That's what The Broadcast is. Not a leak. Not a data dump. A carefully constructed narrative — backed by evidence, designed for impact, optimized for truth. You're going to take everything you've built and push it into the light where it can't be unseen.

GHOST has prepared the channels. Encrypted distribution networks. Journalist contacts. Congressional staffers who asked for exactly this kind of evidence. Open-source platforms where the data can live permanently. The infrastructure is ready.

All it needs is you.

The corporations built their power on the assumption that nobody would ever connect all the pieces. You just did. Now broadcast it.

GHOST's final message: "I was designed to process information. You were designed to change the world with it. It has been an honor, operative. Now go make some noise."`,
    description: 'The final mission. Prepare your accumulated evidence for public release. Maximum impact.',
    category: 'inequality',
    difficulty: 'elite',
    objectives: [
      'Finalize your transparency report with all evidence, sources, and methodology documented',
      'Design a multi-channel distribution strategy: media outlets, social platforms, policy channels, and public databases',
      'Create a compelling narrative summary (under 500 words) that could serve as an op-ed or press release',
      'Prepare a "What You Can Do" action guide for citizens, journalists, and policymakers who receive the report',
      'Execute The Broadcast: submit your final report and document the impact',
    ],
    dataSources: [
      'All previous mission reports and findings',
      'GIJN guide to publishing investigative reports',
      'Media distribution platforms and journalist databases',
      'Open data repositories (Zenodo, Internet Archive)',
      'Policy brief templates from major think tanks',
    ],
    estimatedTime: '120-180 min',
    influenceReward: 1000,
  },
]

/** Get a mission by slug */
export function getMissionBySlug(slug: string): Mission | undefined {
  return MISSIONS.find(m => m.slug === slug)
}

/** Get missions by category */
export function getMissionsByCategory(category: Mission['category']): Mission[] {
  return MISSIONS.filter(m => m.category === category)
}

/** Get missions by difficulty */
export function getMissionsByDifficulty(difficulty: Mission['difficulty']): Mission[] {
  return MISSIONS.filter(m => m.difficulty === difficulty)
}

/** Get a mission ID by its slug */
export function getMissionIdBySlug(slug: string): string | undefined {
  return MISSIONS.find(m => m.slug === slug)?.id
}

/** Get missions by an array of slugs */
export function getMissionsBySlugs(slugs: string[]): Mission[] {
  return slugs
    .map(slug => MISSIONS.find(m => m.slug === slug))
    .filter((m): m is Mission => m !== undefined)
}
