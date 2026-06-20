// DATAVISM Curriculum Canon v0.1 — The Evidence Engine
// Generated from docs/curriculum/evidence-engine-v0.1.md
//
// Purpose:
// - canonical line/station data for the network map
// - curriculum navigation
// - station listings
// - future status/progress UI
//
// Design principle:
// Story is the interface. Skill is the substance. Every line ends in a Case File.

export type LineId = 'g' | 'k' | 'r' | 'b' | 'v';
export type StationStatus = 'open' | 'announced' | 'locked';

export type Station = {
  id: string;
  code: string;
  slug: string;
  title: string;
  status: StationStatus;
  role: string;
  skill: string;
  artifact: string;
  coreQuestion: string;
  learns: string;
};

export type CurriculumLine = {
  id: LineId;
  code: string;
  slug: string;
  name: string;
  shortName: string;
  mentor: string;
  desk: string;
  role: string;
  coreQuestion: string;
  motto: string;
  system: string;
  finalArtifact: string;
  color: {
    name: string;
    hex: string;
  };
  mapDescription: string;
  stations: Station[];
};

export const CURRICULUM_VERSION = '0.1';

export const CURRICULUM_CANON = {
  name: 'The Evidence Engine',
  oneSentence:
    'DATAVISM is an Evidence Engine: a five-line curriculum where people learn to investigate hidden systems with AI, data and verifiable methods — and turn every line into a public Case File.',
  formula: [
    'G teaches the method.',
    'K traces surveillance.',
    'R follows power.',
    'B decodes behavior.',
    'V reads the future.',
    'Every line ends in a Case File.',
  ],
  progression: [
    'Question',
    'Data',
    'AI',
    'Verification',
    'Evidence',
    'Intervention',
  ],
} as const;

export const LINES = [
  {
    id: "g",
    code: "G",
    slug: "ghost-foundation",
    name: "GHOST / Foundation",
    shortName: "Foundation",
    mentor: "GHOST",
    desk: "Method Desk",
    role: "The operating system of DATAVISM.",
    coreQuestion: "How do I turn a vague suspicion into a verifiable investigation?",
    motto: "Ask better. Command cleaner. Verify harder.",
    system: "The learner's own uncertainty",
    finalArtifact: "Eval Report",
    mapDescription: "G teaches the method.",
    color: {
      name: "ghost green",
      hex: "#00ff88",
    },
    stations: [
      {
        id: "g1",
        code: "G1",
        slug: "the-folder",
        title: "THE FOLDER",
        status: "open",
        role: "Orientation: transform discomfort into a testable question.",
        skill: "Question design and investigability.",
        artifact: "Your First Case File",
        coreQuestion: "What exactly can be tested?",
        learns: "Turning diffuse discomfort into a testable data question.",
      },
      {
        id: "g2",
        code: "G2",
        slug: "command",
        title: "COMMAND",
        status: "open",
        role: "Access: command AI with specs, constraints and iteration.",
        skill: "AI orchestration and prompt-as-spec discipline.",
        artifact: "Command Log",
        coreQuestion: "How do I make the machine useful without trusting it blindly?",
        learns: "Using AI with specs, constraints, iterations and clear intent.",
      },
      {
        id: "g3",
        code: "G3",
        slug: "intake",
        title: "INTAKE",
        status: "open",
        role: "Structure: collect and structure raw material.",
        skill: "Source intake, data structuring and first pipeline thinking.",
        artifact: "Intake Sheet / Mini-Pipeline",
        coreQuestion: "What raw material do I need, and how do I structure it?",
        learns: "Collecting and structuring sources, data and raw material.",
      },
      {
        id: "g4",
        code: "G4",
        slug: "the-confident-lie",
        title: "THE CONFIDENT LIE",
        status: "open",
        role: "Verification: detect plausible but false machine output.",
        skill: "Critical AI literacy, claim checking and source verification.",
        artifact: "Verification Protocol",
        coreQuestion: "Which claims survive contact with the source?",
        learns: "Detecting hallucinations, false claims, weak sources and misleading conclusions.",
      },
      {
        id: "g5",
        code: "G5",
        slug: "maschinenraum",
        title: "MASCHINENRAUM",
        status: "open",
        role: "Integration: combine the full investigation workflow.",
        skill: "Evaluation, method design and investigation workflow synthesis.",
        artifact: "Eval Report",
        coreQuestion: "Does the whole machine produce a reliable result?",
        learns: "Combining question, command, intake and verification into a complete method.",
      },
    ],
  },
  {
    id: "k",
    code: "K",
    slug: "key-tracking-osint",
    name: "KEY / Tracking & OSINT",
    shortName: "Tracking & OSINT",
    mentor: "KEY",
    desk: "Surveillance Desk",
    role: "The line that traces watchers, trackers and identity systems.",
    coreQuestion: "Who watches us, and how?",
    motto: "Trace the watchers.",
    system: "PANOPTICON",
    finalArtifact: "Panopticon Case File",
    mapDescription: "K traces surveillance.",
    color: {
      name: "key cyan",
      hex: "#00ffff",
    },
    stations: [
      {
        id: "k1",
        code: "K1",
        slug: "footprints",
        title: "FOOTPRINTS",
        status: "locked",
        role: "Orientation: understand traces created by people, devices, browsers and platforms.",
        skill: "Trace literacy and footprint mapping.",
        artifact: "Footprint Map",
        coreQuestion: "What traces exist before anyone calls them data?",
        learns: "Understanding the traces people, browsers, devices and platforms generate.",
      },
      {
        id: "k2",
        code: "K2",
        slug: "signals",
        title: "SIGNALS",
        status: "locked",
        role: "Access: inspect pixels, cookies, SDKs, consent flows and request patterns.",
        skill: "Tracking signal inspection.",
        artifact: "Tracking Signal Sheet",
        coreQuestion: "Which technical signals prove that tracking is happening?",
        learns: "Reading pixels, cookies, SDKs, consent flows and request patterns.",
      },
      {
        id: "k3",
        code: "K3",
        slug: "identity-graph",
        title: "IDENTITY GRAPH",
        status: "locked",
        role: "Structure: connect IDs, segments, brokers, profiles and inferred identities.",
        skill: "Identity graph reasoning and entity-resolution literacy.",
        artifact: "Identity Graph Sketch",
        coreQuestion: "How does a scattered trace become a profile?",
        learns: "Understanding IDs, segments, brokers, profiles and entity resolution.",
      },
      {
        id: "k4",
        code: "K4",
        slug: "watchtower",
        title: "WATCHTOWER",
        status: "locked",
        role: "Analysis: monitor changes across sources, pages, policies, datasets or actors.",
        skill: "OSINT monitoring and change detection.",
        artifact: "Watchlist / Monitor",
        coreQuestion: "What changes when nobody is looking?",
        learns: "Monitoring changes, sources, pages, systems or actors with OSINT methods.",
      },
      {
        id: "k5",
        code: "K5",
        slug: "panopticon-file",
        title: "PANOPTICON FILE",
        status: "locked",
        role: "Case File: document a tracking or surveillance structure as public evidence.",
        skill: "Surveillance investigation packaging.",
        artifact: "Panopticon Case File",
        coreQuestion: "How do we make a surveillance structure visible and verifiable?",
        learns: "Turning a concrete tracking or surveillance structure into public evidence.",
      },
    ],
  },
  {
    id: "r",
    code: "R",
    slug: "rook-economy-power",
    name: "ROOK / Economy & Power",
    shortName: "Economy & Power",
    mentor: "ROOK",
    desk: "Money Desk",
    role: "The line that follows money, ownership, incentives and leverage.",
    coreQuestion: "Who benefits?",
    motto: "Follow the value.",
    system: "MAMMON",
    finalArtifact: "Mammon Case File",
    mapDescription: "R follows power.",
    color: {
      name: "rook yellow",
      hex: "#ffff00",
    },
    stations: [
      {
        id: "r1",
        code: "R1",
        slug: "ledger",
        title: "LEDGER",
        status: "locked",
        role: "Orientation: formulate the economic question.",
        skill: "Economic question design.",
        artifact: "Money Question Brief",
        coreQuestion: "Who pays, who profits, and who carries risk?",
        learns: "Formulating the economic question behind a system.",
      },
      {
        id: "r2",
        code: "R2",
        slug: "actors",
        title: "ACTORS",
        status: "locked",
        role: "Access: identify companies, people, institutions, owners, funders and lobby actors.",
        skill: "Actor mapping and source-backed entity research.",
        artifact: "Actor Map",
        coreQuestion: "Which actors make the system work?",
        learns: "Mapping companies, people, institutions, owners, funders and lobby actors.",
      },
      {
        id: "r3",
        code: "R3",
        slug: "flows",
        title: "FLOWS",
        status: "locked",
        role: "Structure: turn money, ownership, contracts or subsidies into analyzable flows.",
        skill: "Flow modeling and tabular economic evidence.",
        artifact: "Flow Table",
        coreQuestion: "Where does value move?",
        learns: "Structuring money, contracts, ad spend, subsidies, capital or ownership flows.",
      },
      {
        id: "r4",
        code: "R4",
        slug: "leverage",
        title: "LEVERAGE",
        status: "locked",
        role: "Analysis: identify dependencies, risks, pressure points and power positions.",
        skill: "Leverage and dependency analysis.",
        artifact: "Leverage Map",
        coreQuestion: "Where is the system vulnerable, dependent or exposed?",
        learns: "Identifying dependencies, risks, pressure points and power positions.",
      },
      {
        id: "r5",
        code: "R5",
        slug: "mammon-file",
        title: "MAMMON FILE",
        status: "locked",
        role: "Case File: document an economic power structure as public evidence.",
        skill: "Economic investigation packaging.",
        artifact: "Mammon Case File",
        coreQuestion: "How do we make economic power legible?",
        learns: "Turning an economic power structure into public evidence.",
      },
    ],
  },
  {
    id: "b",
    code: "B",
    slug: "bite-feeds-behavior",
    name: "BITE / Feeds & Behavior",
    shortName: "Feeds & Behavior",
    mentor: "BITE",
    desk: "Behavior Desk",
    role: "The line that decodes feeds, streams, attention and behavioral loops.",
    coreQuestion: "Why do we keep watching, clicking, scrolling or returning?",
    motto: "Decode the feed.",
    system: "THE FEED",
    finalArtifact: "Feed Autopsy Case File",
    mapDescription: "B decodes behavior.",
    color: {
      name: "feed magenta",
      hex: "#ff00ff",
    },
    stations: [
      {
        id: "b1",
        code: "B1",
        slug: "source",
        title: "SOURCE",
        status: "locked",
        role: "Orientation: identify relevant feeds, platforms, channels, APIs, exports or streams.",
        skill: "Source selection and stream framing.",
        artifact: "Source Inventory",
        coreQuestion: "Which feed or stream defines the signal environment?",
        learns: "Identifying relevant feeds, platforms, channels, APIs, exports or streams.",
      },
      {
        id: "b2",
        code: "B2",
        slug: "capture",
        title: "CAPTURE",
        status: "locked",
        role: "Access: collect feed, stream, event or content data responsibly.",
        skill: "Responsible capture pipelines.",
        artifact: "Capture Pipeline",
        coreQuestion: "How do we capture the signal without distorting it?",
        learns: "Collecting feed, stream, event or content data responsibly.",
      },
      {
        id: "b3",
        code: "B3",
        slug: "normalize",
        title: "NORMALIZE",
        status: "locked",
        role: "Structure: clean timestamps, categories, duplicates, formats and events.",
        skill: "Event data cleaning and normalization.",
        artifact: "Clean Event Table",
        coreQuestion: "What structure makes this stream analyzable?",
        learns: "Cleaning timestamps, categories, duplicates, formats and event structures.",
      },
      {
        id: "b4",
        code: "B4",
        slug: "detect",
        title: "DETECT",
        status: "locked",
        role: "Analysis: find peaks, patterns, repetitions, anomalies or engagement signals.",
        skill: "Signal detection in behavioral and content data.",
        artifact: "Signal Report",
        coreQuestion: "What rhythm, anomaly or loop does the feed reveal?",
        learns: "Finding peaks, patterns, repetitions, anomalies or engagement signals.",
      },
      {
        id: "b5",
        code: "B5",
        slug: "feed-autopsy",
        title: "FEED AUTOPSY",
        status: "locked",
        role: "Case File: explain a platform, feed or behavior dynamic as public evidence.",
        skill: "Feed investigation packaging.",
        artifact: "Feed Autopsy Case File",
        coreQuestion: "How do we make a feed dynamic visible?",
        learns: "Explaining a platform, feed or behavior dynamic as public evidence.",
      },
    ],
  },
  {
    id: "v",
    code: "V",
    slug: "vesper-climate-future",
    name: "VESPER / Climate & Future",
    shortName: "Climate & Future",
    mentor: "VESPER",
    desk: "Future Desk",
    role: "The line that reads long systems, archives, scenarios and future risks.",
    coreQuestion: "What changes over time, and what remains when the feed has moved on?",
    motto: "Read the long signal.",
    system: "CUMULUS REX",
    finalArtifact: "Cumulus Case File",
    mapDescription: "V reads the future.",
    color: {
      name: "vesper purple",
      hex: "#aa44ff",
    },
    stations: [
      {
        id: "v1",
        code: "V1",
        slug: "archive",
        title: "ARCHIVE",
        status: "locked",
        role: "Orientation: find historical sources, long-term datasets and institutional records.",
        skill: "Archive and long-term source discovery.",
        artifact: "Archive Map",
        coreQuestion: "Where does the long signal live?",
        learns: "Finding historical sources, long-term datasets and institutional records.",
      },
      {
        id: "v2",
        code: "V2",
        slug: "patterns",
        title: "PATTERNS",
        status: "locked",
        role: "Structure and analysis: read trends, seasonality, breaks, baselines and movement.",
        skill: "Longitudinal pattern analysis.",
        artifact: "Pattern Sheet",
        coreQuestion: "What is changing, what is stable, and what is noise?",
        learns: "Reading trends, seasonality, breaks, baselines and long-term movement.",
      },
      {
        id: "v3",
        code: "V3",
        slug: "scenarios",
        title: "SCENARIOS",
        status: "locked",
        role: "Analysis: work with uncertainty, futures, assumptions and scenario logic.",
        skill: "Scenario reasoning and uncertainty framing.",
        artifact: "Scenario Board",
        coreQuestion: "What futures are plausible under which assumptions?",
        learns: "Working with uncertainty, futures, assumptions and scenario logic.",
      },
      {
        id: "v4",
        code: "V4",
        slug: "impact",
        title: "IMPACT",
        status: "locked",
        role: "Interpretation: connect long-term patterns to affected groups and consequences.",
        skill: "Impact analysis and public-interest framing.",
        artifact: "Impact Brief",
        coreQuestion: "Who is affected, how, when and with what uncertainty?",
        learns: "Connecting long-term patterns to affected groups, risks and consequences.",
      },
      {
        id: "v5",
        code: "V5",
        slug: "cumulus-file",
        title: "CUMULUS FILE",
        status: "locked",
        role: "Case File: turn a long-system finding into public evidence.",
        skill: "Long-horizon investigation packaging.",
        artifact: "Cumulus Case File",
        coreQuestion: "How do we make a slow system impossible to ignore?",
        learns: "Turning a long-system finding into public evidence.",
      },
    ],
  },
] as const satisfies readonly CurriculumLine[];

export const STATIONS = LINES.flatMap((line) =>
  line.stations.map((station) => ({
    ...station,
    lineId: line.id,
    lineCode: line.code,
    lineName: line.name,
    lineSlug: line.slug,
    lineMotto: line.motto,
    lineColor: line.color,
  })),
);

export type StationWithLine = (typeof STATIONS)[number];

export function getLineById(id: LineId): CurriculumLine {
  const line = LINES.find((item) => item.id === id);
  if (!line) {
    throw new Error(`Unknown DATAVISM line: ${id}`);
  }
  return line;
}

export function getStationBySlug(slug: string): StationWithLine | undefined {
  return STATIONS.find((station) => station.slug === slug);
}

export function getStationsByLine(id: LineId): readonly Station[] {
  return getLineById(id).stations;
}

export function getOpenStations(): StationWithLine[] {
  return STATIONS.filter((station) => station.status === 'open');
}

export function getAnnouncedStations(): StationWithLine[] {
  return STATIONS.filter((station) => station.status === 'announced');
}

export function getLockedStations(): StationWithLine[] {
  return STATIONS.filter((station) => station.status === 'locked');
}
