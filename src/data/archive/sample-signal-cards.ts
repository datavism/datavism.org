// Curated, illustrative Signal Cards for the public Archive. These are authored
// examples of the method — clearly labeled curated, never presented as real
// user submissions. Every card states its uncertainty and carries the disclaimer.
import type { SignalCard } from '../../lib/signal-cards/types'
import { SIGNAL_CARD_DISCLAIMER } from '../../lib/signal-cards/types'

const base = {
  version: 1 as const, line: 'g' as const, station: 'g1-the-folder' as const,
  createdAt: '2026-06-01T00:00:00.000Z', tags: ['curated'] as string[],
  visibility: 'public-anonymous' as const, disclaimer: SIGNAL_CARD_DISCLAIMER,
}

export const SAMPLE_SIGNAL_CARDS: SignalCard[] = [
  { ...base, id: 'sc_sample01', stage: 'question', systemSignal: 'tracking',
    suspicion: 'A shop showed me an item I only searched for in another app.',
    question: 'What technical signals would show cross-app tracking before I gave consent?',
    evidenceNeeded: ['technical-signal', 'platform-output'], uncertainty: 'I cannot tell which company links the two apps.',
    suggestedLines: ['k', 'g'], nextLineChoice: 'k' },
  { ...base, id: 'sc_sample02', stage: 'question', systemSignal: 'money',
    suspicion: 'A "free" service keeps a problem alive that it also sells the fix for.',
    question: 'Who profits when this problem is not solved, and how is that visible in public filings?',
    evidenceNeeded: ['public-record', 'document'], uncertainty: 'I do not know the ownership structure yet.',
    suggestedLines: ['r', 'g'], nextLineChoice: 'r' },
  { ...base, id: 'sc_sample03', stage: 'question', systemSignal: 'feed',
    suspicion: 'My feed narrows to one emotion the longer I scroll.',
    question: 'What evidence would show that engagement ranking amplifies one emotion over time?',
    evidenceNeeded: ['platform-output', 'observation'], uncertainty: 'I cannot separate my own behavior from the ranking.',
    suggestedLines: ['b', 'g'], nextLineChoice: 'b' },
  { ...base, id: 'sc_sample04', stage: 'case-file', systemSignal: 'future',
    suspicion: 'A local water level shifts every year but no one names it.',
    question: 'How has this measurable trend changed over the last decade in public datasets?',
    evidenceNeeded: ['dataset', 'public-record'], uncertainty: 'I do not know if the gauge method changed.',
    suggestedLines: ['v', 'g'], nextLineChoice: 'v',
    actor: 'Regional water authority', sourceLead: 'Open environmental data portal', publicRelevance: 'Affects everyone living downstream.' },
  { ...base, id: 'sc_sample05', stage: 'question', systemSignal: 'tracking',
    suspicion: 'A news site loads many third parties before I click anything.',
    question: 'Which third-party domains receive a request before consent on this page?',
    evidenceNeeded: ['technical-signal'], uncertainty: 'I cannot yet identify who owns each domain.',
    suggestedLines: ['k', 'g'], nextLineChoice: 'k' },
  { ...base, id: 'sc_sample06', stage: 'question', systemSignal: 'unsure',
    suspicion: 'Something about an everyday app feels off, but I cannot name it.',
    question: 'What is the single most testable thing about this discomfort?',
    evidenceNeeded: ['unknown'], uncertainty: 'I do not yet know what I am actually looking for.',
    suggestedLines: ['g', 'k', 'r', 'b'], nextLineChoice: 'g' },
]
