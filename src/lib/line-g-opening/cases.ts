import type { SystemSignal } from '../signal-cards/types'

export type LaunchpadCase = {
  id: string
  hook: string
  systemSignal: SystemSignal
  starterQuestion: string
  source: { title: string; url: string; contains: string }
}

export const LAUNCHPAD_CASES: LaunchpadCase[] = [
  {
    id: 'data-brokers-ca',
    hook: 'Companies you have never heard of legally sell your location history, browsing behavior and inferred political views — California forces them to register under their real names.',
    systemSignal: 'tracking',
    starterQuestion: 'Which registered data brokers in California explicitly sell precise geolocation data, and do any of them also sell to law enforcement?',
    source: {
      title: 'California Data Broker Registry (CPPA)',
      url: 'https://cppa.ca.gov/data_broker_registry/',
      contains: 'Searchable + downloadable registry of registered data brokers, with the data categories they collect (geolocation, biometrics) and who they share with (incl. government). CSV downloads 2020–2025 (2025 is the current live dataset).',
    },
  },
  {
    id: 'lobby-register-de',
    hook: 'Since 2022 every organization lobbying the German federal government must register publicly — including how many staff it deploys and how much it spends on influence.',
    systemSignal: 'money',
    starterQuestion: 'Which ten organizations spent the most on lobbying the Bundestag in the last reporting year, and what legislative topics did they target?',
    source: {
      title: 'Lobbyregister des Deutschen Bundestages',
      url: 'https://www.lobbyregister.bundestag.de/startseite',
      contains: '6,242 active interest representatives with expenditure ranges, staff counts, interest areas and targeted legislative procedures. Searchable by name, person, topic.',
    },
  },
  {
    id: 'abgeordnetenwatch-de',
    hook: 'Every German MP must disclose secondary income — but "disclosed" does not mean easy to find or to compare.',
    systemSignal: 'money',
    starterQuestion: 'Which Bundestag members earned more from private-sector side income last year than from their parliamentary salary, and which industries recur?',
    source: {
      title: 'abgeordnetenwatch.de',
      url: 'https://www.abgeordnetenwatch.de',
      contains: 'Politician profiles with secondary-income disclosures, named voting records, committee memberships and direct Q&A. Browseable and searchable.',
    },
  },
  {
    id: 'dsa-transparency-db',
    hook: 'The largest platforms in Europe must now report every content-moderation decision they make — 2.4 billion in six months — and the data is public.',
    systemSignal: 'feed',
    starterQuestion: 'Which platform automated the highest share of its content-removal decisions, and which stated violation category was used most to restrict content?',
    source: {
      title: 'DSA Transparency Database (European Commission)',
      url: 'https://transparency.dsa.ec.europa.eu/',
      contains: 'Aggregated statements of reasons from 332 platforms under the DSA — restriction types, automation rates, violation categories, volume trends. Downloadable.',
    },
  },
  {
    id: 'lobby-facts-eu',
    hook: 'EU lobbying disclosures are self-reported — but aggregated, they reveal which private interests buy the most access to European policymakers.',
    systemSignal: 'money',
    starterQuestion: 'Which five organizations held the most meetings with European Commission officials last year, and what policy areas did they declare?',
    source: {
      title: 'LobbyFacts.eu',
      url: 'https://www.lobbyfacts.eu/',
      contains: 'Aggregated EU Transparency Register data for 17,032 entities — declared spending, lobbyist FTEs, EP passes, high-level Commission meetings. By Corporate Europe Observatory + LobbyControl (figures self-declared).',
    },
  },
  {
    id: 'climate-trace-emissions',
    hook: 'For decades national emissions were self-reported by governments — Climate TRACE now tracks 745 million individual emitting sources via satellite and AI, independent of what states claim.',
    systemSignal: 'future',
    starterQuestion: 'Identify the ten highest-emitting individual facilities in a country — does the government\'s official national total match what the satellite data shows?',
    source: {
      title: 'Climate TRACE',
      url: 'https://climatetrace.org/data',
      contains: 'Facility-level greenhouse-gas emissions for 744M+ sources across 10 sectors, 2015–2025 (monthly from 2021). Downloadable by country/sector/facility. API. CC BY 4.0.',
    },
  },
  {
    id: 'india-myneta-criminal-wealth',
    hook: 'Every Indian election candidate must declare their criminal cases, assets and liabilities in a sworn affidavit — MyNeta makes 20 years of those declarations searchable by name, party and constituency.',
    systemSignal: 'money',
    starterQuestion: 'How many sitting MPs in the 2024 Lok Sabha declared more than 10 criminal cases against themselves — and which parties do they belong to?',
    source: {
      title: 'MyNeta — Candidate Affidavit Database (ADR / National Election Watch)',
      url: 'https://www.myneta.info/',
      contains: 'Criminal-case counts, declared assets/liabilities and education for all candidates; sourced from Election Commission of India affidavits. Section paths live under myneta.info (e.g. /LokSabha2024/).',
    },
  },
  {
    id: 'brazil-tse-campaign-finance',
    hook: 'Since 2015 Brazilian corporations are banned from funding campaigns — yet the public electoral-court database shows who funds candidates, how much, and whether those donors also hold government contracts.',
    systemSignal: 'money',
    starterQuestion: 'Which donors appear in the 2024 municipal election finance records and also show up in federal procurement contracts in the same period?',
    source: {
      title: 'Portal de Dados Abertos do TSE — Prestação de Contas Eleitorais 2024',
      url: 'https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2024',
      contains: 'Complete campaign receipts/expenditures for 2024 candidates and parties; CSV/TXT under Creative Commons. Portal holds 169 datasets covering 1998–2026.',
    },
  },
  {
    id: 'icij-offshore-leaks',
    hook: 'More than 810,000 offshore entities — shells, trusts and foundations used to hide wealth across 200 countries — are searchable in one public database built from the Panama and Pandora Papers and three more leaks.',
    systemSignal: 'money',
    starterQuestion: 'Search a minister or major company from your country — do shell-company connections appear in the Offshore Leaks database that were never reported domestically?',
    source: {
      title: 'ICIJ Offshore Leaks Database',
      url: 'https://offshoreleaks.icij.org/',
      contains: '810,000+ offshore entities from five investigations; entity-to-person connections across 200+ countries. Downloadable under ODbL + CC BY-SA.',
    },
  },
  {
    id: 'global-forest-watch-deforestation',
    hook: 'Near-real-time satellite alerts show exactly where tropical forest is disappearing — to the hectare — linked to palm oil, cattle, mining and illegal logging across every tropical country.',
    systemSignal: 'future',
    starterQuestion: 'Which province of Brazil or Indonesia lost the most primary forest in the past 12 months, and which commodity supply chains run through that area?',
    source: {
      title: 'Global Forest Watch — dashboards + open data',
      url: 'https://www.globalforestwatch.org/dashboards/global/',
      contains: 'Tree-cover loss 2001–2024 (annual), GLAD alerts (weekly, near-real-time), 65+ datasets; CSV/GeoJSON/GeoTIFF via data.globalforestwatch.org. Free.',
    },
  },
  {
    id: 'south-africa-vulekamali-budget',
    hook: 'South Africa\'s Treasury publishes every department\'s budget allocation and actual expenditure since 2016 — revealing what was promised, what was spent, and where the gaps are.',
    systemSignal: 'money',
    starterQuestion: 'In the Department of Health, what share of the allocated budget was actually spent in each of the past five years — and which provinces show the largest underspending?',
    source: {
      title: 'Vulekamali — South African Government Budget Data Portal',
      url: 'https://vulekamali.gov.za/',
      contains: 'National + provincial budget allocations vs actual expenditure (2016–present), department breakdowns, infrastructure, Division of Revenue; API + downloads. By National Treasury + Imali Yethu.',
    },
  },
  {
    id: 'opensanctions-global-power',
    hook: 'OpenSanctions aggregates 386 official sanctions lists and politically-exposed-persons registries into one searchable database — the same data banks are legally required to check, now open to anyone.',
    systemSignal: 'tracking',
    starterQuestion: 'Search a business figure or official from your country — are they on any international sanctions list or PEP registry your domestic media never reported?',
    source: {
      title: 'OpenSanctions — Global Sanctions & PEP Database',
      url: 'https://www.opensanctions.org/search/',
      contains: '2,020,490+ entities from 386 sources (OFAC, EU, UN, Interpol, PEP registries) across 134 countries. Searchable; bulk downloads. Free for non-commercial use.',
    },
  },
  {
    id: 'gdelt-media-power',
    hook: 'Every 15 minutes GDELT processes the world\'s news in 100+ languages and maps every event, tone and named actor — making it possible to measure which crises get covered and which are ignored.',
    systemSignal: 'feed',
    starterQuestion: 'Compare news-coverage intensity of protests or corruption scandals in Nigeria vs France over the past year — which were global news, which only local, and what does that asymmetry reveal?',
    source: {
      title: 'GDELT Project — Global Database of Events, Language, and Tone',
      url: 'https://www.gdeltproject.org/',
      contains: '300+ event categories georeferenced, 1979–present, updated every 15 minutes, 100+ languages, tone analysis, a Global Knowledge Graph. Browser Analysis Service, BigQuery, CSV. Free.',
    },
  },

  // ── BATCH 2 ─────────────────────────────────────────────────────
  {
    id: 'exodus-privacy-trackers',
    hook: 'Every Android app may carry invisible passengers — Exodus audited 279,000+ apps, found 432 distinct trackers.',
    systemSignal: 'tracking',
    starterQuestion: 'Which tracker company appears in the most apps, and what does it collect?',
    source: {
      title: 'Exodus Privacy',
      url: 'https://reports.exodus-privacy.eu.org/en/trackers/',
      contains: '432 trackers, per-app reports, ODbL API.',
    },
  },
  {
    id: 'iati-aid-flows',
    hook: '$1T/yr in aid recorded in one open standard — yet recipients can\'t track where it lands.',
    systemSignal: 'money',
    starterQuestion: 'How much aid was committed to a country vs actually disbursed?',
    source: {
      title: 'IATI d-portal',
      url: 'https://d-portal.org/',
      contains: '~1M activities, 1,846 publishers, CSV/JSON/XML.',
    },
  },
  {
    id: 'open-ownership-beneficial',
    hook: '104 countries require companies to disclose who really owns them; Open Ownership stitches it together.',
    systemSignal: 'money',
    starterQuestion: 'Which UK companies with overseas owners bought British property, and who controls them?',
    source: {
      title: 'Open Ownership BODS Data Hub',
      url: 'https://bods-data.openownership.org/',
      contains: 'UK PSC + Overseas Entities + GLEIF, CC0.',
    },
  },
  {
    id: 'ranking-digital-rights',
    hook: 'The 14 most powerful tech platforms scored on every policy affecting your speech and privacy — none passed.',
    systemSignal: 'tracking',
    starterQuestion: 'Which Big Tech firm has the worst record on government data demands?',
    source: {
      title: 'Ranking Digital Rights 2025',
      url: 'https://rankingdigitalrights.org/bte25/',
      contains: '14 companies, 300+ indicators, downloadable.',
    },
  },
  {
    id: 'atlas-of-surveillance',
    hook: '14,900+ documented deployments of drones, facial recognition, predictive policing across 6,000 US jurisdictions.',
    systemSignal: 'tracking',
    starterQuestion: 'How many US cities use facial recognition, and which vendor supplies most?',
    source: {
      title: 'Atlas of Surveillance (EFF)',
      url: 'https://atlasofsurveillance.org/',
      contains: '8 tech types, CSV data library.',
    },
  },
  {
    id: 'edgar-ghg-emissions',
    hook: 'Every country\'s emissions by sector & fuel, independently calculated by EU scientists — not self-reported.',
    systemSignal: 'future',
    starterQuestion: 'Which country\'s emissions grew fastest 2015–2022 and which sector drove it?',
    source: {
      title: 'EDGAR v8.0 (JRC)',
      url: 'https://edgar.jrc.ec.europa.eu/',
      contains: 'CO2/CH4/N2O/F-gases, 220+ countries, 1970–2022, CC BY 4.0.',
    },
  },
  {
    id: 'global-carbon-budget',
    hook: '100+ scientists publish the definitive accounting of carbon emitted — and how little land/ocean absorbed.',
    systemSignal: 'future',
    starterQuestion: 'How much has the land carbon sink declined since 2020?',
    source: {
      title: 'Global Carbon Budget 2024',
      url: 'https://globalcarbonbudget.org/the-latest-gcb-data/',
      contains: 'fossil+land-use emissions, sinks; Zenodo.',
    },
  },
  {
    id: 'financial-secrecy-index',
    hook: 'TJN ranks 141 jurisdictions by how aggressively their laws let the wealthy hide money — top enablers surprise.',
    systemSignal: 'money',
    starterQuestion: 'Which G20 country has the worst secrecy score and which loopholes?',
    source: {
      title: 'Financial Secrecy Index',
      url: 'https://fsi.taxjustice.net/',
      contains: '141 jurisdictions, 100+ sub-indicators, free non-commercial.',
    },
  },
  {
    id: 'usaspending-federal',
    hook: 'Every US federal contract/grant/loan since 2001 — $6.8T/yr — queryable with no API key.',
    systemSignal: 'money',
    starterQuestion: 'Which company got the most federal contracts last year, and how much bypassed competition?',
    source: {
      title: 'USAspending.gov',
      url: 'https://www.usaspending.gov/',
      contains: 'contracts/grants/loans, free REST API, no key.',
    },
  },
  {
    id: 'philippines-cids-elections',
    hook: '30 years of Philippine local election results + fiscal spending in one free DB — dynasties → budget control.',
    systemSignal: 'money',
    starterQuestion: 'Which provinces had the same family govern 20+ years, and how does it track education/health spend?',
    source: {
      title: 'UP CIDS',
      url: 'https://elections.cids.up.edu.ph/',
      contains: '15,148 candidates 1992–2022, electoral+fiscal.',
    },
  },
  {
    id: 'colombia-secop-contracts',
    hook: 'Every Colombian public contract logged in one open DB back to 2011 — cross-reference contractors with donors.',
    systemSignal: 'money',
    starterQuestion: 'Which 2022 public-works contractors were also campaign donors (Cuentas Claras)?',
    source: {
      title: 'Colombia SECOP (OCP)',
      url: 'https://data.open-contracting.org/en/publication/61',
      contains: '11.4M tenders, PDDL. Live: colombiacompra.gov.co.',
    },
  },
  {
    id: 'ghana-procurement-ocds',
    hook: 'Ghana ran Africa\'s first OCDS national e-procurement (2019); full contracting data free to download.',
    systemSignal: 'money',
    starterQuestion: 'Which suppliers won the most Health Ministry contracts 2019–2024 vs tender estimates?',
    source: {
      title: 'Ghana PPA (OCP)',
      url: 'https://data.open-contracting.org/en/publication/85',
      contains: '9,651 awards, monthly, JSON/Excel/CSV.',
    },
  },
  {
    id: 'argentina-wealth-declarations',
    hook: 'Every Argentine executive official must publicly disclose full assets — open format from 2012 on.',
    systemSignal: 'money',
    starterQuestion: 'Which Milei-era officials show the largest asset increase vs their salary?',
    source: {
      title: 'Argentina OA (DJPI)',
      url: 'https://www.argentina.gob.ar/servicio/consultar-declaraciones-juradas-de-funcionarios-publicos',
      contains: 'assets/liabilities/interests 2012–.',
    },
  },
  {
    id: 'ukraine-prozorro',
    hook: 'Ukraine put every government tender online in real time — incl. wartime contracts: who supplies the state.',
    systemSignal: 'money',
    starterQuestion: 'Which suppliers got the largest military/reconstruction contracts since Feb 2022, how many non-competitive?',
    source: {
      title: 'ProZorro (OCP)',
      url: 'https://data.open-contracting.org/en/publication/154',
      contains: 'OCDS 2015–2025, API, bulk. (some wartime redactions)',
    },
  },
  {
    id: 'chile-chilecompra',
    hook: 'Chile\'s Mercado Público logs every contract from 850 state agencies; full OCDS 2018–2022 downloadable.',
    systemSignal: 'money',
    starterQuestion: 'Which municipalities awarded the most single-source contracts during 2019–2021 unrest/pandemic?',
    source: {
      title: 'Chile (OCP)',
      url: 'https://data.open-contracting.org/en/publication/10',
      contains: 'Law 19,886 contracts. Live: publication/144.',
    },
  },
]

export function getCase(id: string): LaunchpadCase | undefined {
  return LAUNCHPAD_CASES.find((c) => c.id === id)
}

export type Terrain = { places: { kind: string; example: string; url: string }[] }

const TERRAIN: Record<string, Terrain> = {
  tracking: {
    places: [
      {
        kind: 'Data-broker registries',
        example: 'California Data Broker Registry',
        url: 'https://cppa.ca.gov/data_broker_registry/',
      },
      {
        kind: 'Sanctions & PEP databases',
        example: 'OpenSanctions',
        url: 'https://www.opensanctions.org/search/',
      },
    ],
  },
  money: {
    places: [
      {
        kind: 'Lobby registers',
        example: 'Lobbyregister (Bundestag)',
        url: 'https://www.lobbyregister.bundestag.de/startseite',
      },
      {
        kind: 'Campaign-finance records',
        example: 'TSE Brazil (Prestação de Contas)',
        url: 'https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2024',
      },
      {
        kind: 'Offshore / ownership leaks',
        example: 'ICIJ Offshore Leaks',
        url: 'https://offshoreleaks.icij.org/',
      },
      {
        kind: 'Public spending portals',
        example: 'Vulekamali (South Africa)',
        url: 'https://vulekamali.gov.za/',
      },
    ],
  },
  feed: {
    places: [
      {
        kind: 'Platform transparency databases',
        example: 'EU DSA Transparency DB',
        url: 'https://transparency.dsa.ec.europa.eu/',
      },
      {
        kind: 'Global media/event databases',
        example: 'GDELT Project',
        url: 'https://www.gdeltproject.org/',
      },
    ],
  },
  future: {
    places: [
      {
        kind: 'Independent emissions tracking',
        example: 'Climate TRACE',
        url: 'https://climatetrace.org/data',
      },
      {
        kind: 'Deforestation / satellite monitoring',
        example: 'Global Forest Watch',
        url: 'https://www.globalforestwatch.org/dashboards/global/',
      },
    ],
  },
}

export function terrainFor(signal: string): Terrain {
  return TERRAIN[signal] ?? { places: [] }
}
