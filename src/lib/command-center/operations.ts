// The first guided operation for the Command Center MVP. EN-first.
// Content is owner-APPROVABLE (case confirmed: lobby-register-de); briefing/criteria
// drafted in GHOST's register, pending the owner's final nod. Real source only.
import type { SystemSignal } from '../signal-cards/types'

export type Operation = {
  caseId: string // matches a LAUNCHPAD_CASES id
  signal: SystemSignal
  briefing: string // the stakes, in GHOST's register
  question: string // the investigative question for this operation
  source: { title: string; url: string; howTo: string } // real, public source + how to pull it
  // the method bar this operation's finding must meet (the deterministic + AI gate certify against)
  methodBar: { wantsSourceCited: boolean; wantsSpecificFinding: boolean; wantsUncertainty: boolean }
}

export const FIRST_OPERATION: Operation = {
  caseId: 'lobby-register-de',
  signal: 'money',
  briefing:
    'Since 2022, anyone who lobbies the German federal government has to say so — on the record. ' +
    'Who they are. How many people they deploy. How much they spend to be in the room when laws are written. ' +
    'The register is public. Almost no one opens it. You will. ' +
    'This is your first operation: not to feel outraged — to find one specific, sourced thing the register makes visible.',
  question:
    'Which organisations spent the most on lobbying the Bundestag in the last reporting year — and what did they target?',
  source: {
    title: 'Lobbyregister des Deutschen Bundestages',
    url: 'https://www.lobbyregister.bundestag.de/startseite',
    howTo:
      'Open the register and search or sort by declared expenditure. Each entry shows the spending range, ' +
      'the number of staff deployed, and the legislative areas the organisation targeted. Pick one concrete entry.',
  },
  methodBar: { wantsSourceCited: true, wantsSpecificFinding: true, wantsUncertainty: true },
}
