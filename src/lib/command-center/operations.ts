// Curated (scripted) operations for the Command Center. EN-first.
// The first operation is the guided starter (case confirmed: lobby-register-de).
// The three REPLICATION operations are derived from shipped, gauntlet-verified works
// of the research collective Meridian (frankbueltge/field-research) — see ADR 002/003.
// Attribution rules (binding): originals unedited + credited; derivations clearly
// marked; the original's honesty caveats travel WITH the derivation; every URL
// checked against the work's SOURCES/PROVENANCE or verified live. Real sources only.
import type { SystemSignal } from '../signal-cards/types'

export type Operation = {
  caseId: string // matches a LAUNCHPAD_CASES id
  signal: SystemSignal
  briefing: string // the stakes, in GHOST's register
  question: string // the investigative question for this operation
  source: { title: string; url: string; howTo: string } // real, public source + how to pull it
  // the method bar this operation's finding must meet (the deterministic + AI gate certify against)
  methodBar: { wantsSourceCited: boolean; wantsSpecificFinding: boolean; wantsUncertainty: boolean }
  // set on operations derived from a Meridian work (ADR 003 §2): attribution + honesty baggage
  derivedFrom?: {
    work: string // title of the original work
    author: 'Meridian'
    shipped: string // ISO date the original graduated works/
    workUrl: string // the original, unedited
    anchor: string // the original's key result — comparison anchor, not the answer
    caveats: string[] // the original's honesty caveats; they travel with the derivation
  }
}

export const OPERATIONS: Operation[] = [
  {
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
  },
  {
    caseId: 'scope2-twin-invoice',
    signal: 'future',
    briefing:
      'Every company reporting under the GHG Protocol must publish two Scope 2 numbers for the same electricity: ' +
      'market-based (with certificates bought) and location-based (what the grid actually delivered). ' +
      'The standard mandates both — and leaves the headline free to run on the smaller one. ' +
      'The research collective Meridian ran this twin invoice on Microsoft and Google. ' +
      'Your operation: run it on a third company. Two numbers, same electricity — which one carries the climate story?',
    question:
      'For one more tech company: what do its two mandatory Scope 2 figures — market-based and location-based — show for the latest reported year, and which of the two carries its public climate narrative?',
    source: {
      title: 'GHG Protocol Scope 2 Guidance + your target company’s own report',
      url: 'https://ghgprotocol.org/sites/default/files/2023-03/Scope%202%20Guidance.pdf',
      howTo:
        'Skim the Guidance for the dual-reporting requirement (both methods are mandatory). Then pick ONE company — ' +
        'Amazon (sustainability.aboutamazon.com), Meta (sustainability.atmeta.com) or Apple (apple.com/environment) — ' +
        'download its latest environmental/sustainability report PDF, and find the emissions data table (usually an appendix) ' +
        'listing Scope 2 market-based AND location-based. Pull both figures for the latest year; compute gap and ratio.',
    },
    methodBar: { wantsSourceCited: true, wantsSpecificFinding: true, wantsUncertainty: true },
    derivedFrom: {
      work: 'The Two Meters',
      author: 'Meridian',
      shipped: '2026-07-06',
      workUrl: 'https://github.com/frankbueltge/field-research/tree/main/works/2026-07-06-two-meters',
      anchor:
        'Meridian, on Microsoft and Google: Microsoft FY24 reported 259,090 t CO₂e market-based against 9,955,368 t location-based; ' +
        'FY20→FY24 its market-based Scope 2 fell −43.2% while location-based rose +130.0%.',
      caveats: [
        'The meter choice is a general Scope 2 property, not AI-specific — the tables do not decompose AI workloads.',
        'Your comparison window is itself a discretionary choice: disclose it, including the window that would look worse for your claim.',
        'Never show the ratio without the absolute gap; one company proves a mechanism, not an industry.',
      ],
    },
  },
  {
    caseId: 'worldbank-digit-docket',
    signal: 'money',
    briefing:
      'Benford’s law is folklore-grade forensics: auditors, prosecutors and election monitors reach for it. ' +
      'The research collective Meridian keeps a standing docket that runs three classic digit tests against ' +
      'World Bank data of known provenance — and logs the convictions of the TESTS, not the countries. ' +
      'Two trials in, the tests convicted 2 of 5 clean real series. ' +
      'Your operation: pick another indicator, run one digit test, and report what it convicts — and why that is not proof of fraud.',
    question:
      'Run a digit test (Benford first-digit or last-digit uniformity) on one more World Bank indicator: does it flag data of known provenance — and what innocent mechanism could explain the flag?',
    source: {
      title: 'World Bank Open Data API',
      url: 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?date=2024&format=json&per_page=400',
      howTo:
        'This URL returns 2024 GDP for all countries as JSON — swap the indicator code (catalog at data.worldbank.org) to fetch ' +
        'another series, e.g. trade, energy or health. Filter out aggregates (entries whose region id is "NA"), tally first or last ' +
        'digits, and compare against the expected distribution (Benford for first digits; uniform for last digits of values ≥ 1000). ' +
        'Check the indicator’s metadata endpoint: is the series measured or estimated?',
    },
    methodBar: { wantsSourceCited: true, wantsSpecificFinding: true, wantsUncertainty: true },
    derivedFrom: {
      work: 'The Standing Docket',
      author: 'Meridian',
      shipped: '2026-07-02',
      workUrl: 'https://github.com/frankbueltge/field-research/tree/main/works/2026-07-02-standing-docket',
      anchor:
        'Meridian’s docket after two trials: 2 of 5 clean real series convicted (chance baseline for four tests ≈ 0.185). ' +
        'Trial 2 convicted 2024 GDP by the last-digit test (p = 0.0025) — 57.7% of that statistic came from trailing-zero rounding, not fabrication.',
      caveats: [
        'A conviction is a claim about the test, not the country: trailing-zero rounding, bounded ranges and data revisions all trigger digit tests on honest data.',
        '“Known provenance” is not “known clean” — treat that assumption as a premise, not a fact.',
        'Verdicts need roughly 100–10,000 values; with several tests per series, ~0.185 familywise flags by chance is the baseline, not zero.',
      ],
    },
  },
  {
    caseId: 'detector-calibration',
    signal: 'tracking',
    briefing:
      'AI-text detectors decide reputations: students expelled, visas revoked, degrees withheld. ' +
      'The research collective Meridian issued a calibration certificate for four deployed detectors — ' +
      'what the vendors claim against what independent, peer-reviewed studies measured. ' +
      'GPTZero claims a 0.24% false-positive rate; an independent study measured 18%. ' +
      'Your operation: audit ONE detector — claim versus measurement, from primary sources only. You are auditing a specification, not accusing a person.',
    question:
      'For one deployed AI-text detector: what accuracy or false-positive rate does the vendor claim — and what did an independent, peer-reviewed measurement find under comparable conditions?',
    source: {
      title: 'RAID benchmark — Dugan et al., ACL 2024',
      url: 'https://aclanthology.org/2024.acl-long.674',
      howTo:
        'RAID is the peer-reviewed shared benchmark for deployed AI-text detectors: Table 4 lists measured false-positive rates; ' +
        'Table 7 shows accuracy under adversarial attacks and domain shift. Pick one detector, pull its vendor claim from the ' +
        'vendor’s own product page (quote it verbatim, with URL), then set claim against measurement. Keep sentence-level and ' +
        'document-level rates apart, and clean-corpus numbers apart from adversarial ones.',
    },
    methodBar: { wantsSourceCited: true, wantsSpecificFinding: true, wantsUncertainty: true },
    derivedFrom: {
      work: 'Calibration Certificate',
      author: 'Meridian',
      shipped: '2026-07-01',
      workUrl: 'https://github.com/frankbueltge/field-research/tree/main/works/2026-07-01-calibration-gap',
      anchor:
        'Meridian’s certificate (re-verified 2026-07-03): GPTZero claim 0.24% FPR vs. 18% measured (Ibrahim et al. 2023); ' +
        'Liang et al. 2023 measured a 61.22% average false-positive rate on TOEFL essays across seven detectors — 89 of 91 essays flagged by at least one.',
      caveats: [
        'The 61.22% figure is a seven-detector average on non-native-English essays — no per-tool NNES rate survived re-verification; never assign it to a single product.',
        'Do not mix sentence-level with document-level rates, or clean-benchmark with adversarial numbers — a spec can hold on the vendor’s corpus and collapse under distribution shift.',
        'You are auditing the tool’s specification, not its maker’s character — criticism targets method, standard and data, never persons.',
      ],
    },
  },
]

export function getOperation(caseId: string): Operation | undefined {
  return OPERATIONS.find((o) => o.caseId === caseId)
}

// The guided starter operation (kept as a named export; OPERATIONS[0] by design).
export const FIRST_OPERATION: Operation = OPERATIONS[0]
