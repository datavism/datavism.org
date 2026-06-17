# VERIFY-G1 — Daten-Verifikations-Pass für THE FOLDER (Station G1)

**Datum:** 2026-06-13 · **Status:** v1, durch Claude autonom recherchiert
(Frank: „mach nächsten schritt, zieh durch"). **Reviewbedarf:** Frank gegenlesen.
**Gehört zu:** design §8/§9 (Verifikations-Pass = Tor vor jedem Drop) · `NOTES.md`.

> **Befund vorab:** Die im Design referenzierte „Op-004 AdTech Empire Map" existiert
> in data-snack **nicht** (geprüft: kein `prototype-v2/`, kein `Op-004`/`strecke`/
> `AdTech`-Material). Daher wurde **direkt gegen Primärquellen** verifiziert — sauberer.

---

## Ergebnis: die Daten sind jetzt echt & belegt

| Behauptung im Spike | vorher (erfunden) | jetzt (verifiziert) | Quelle |
|---|---|---|---|
| Zähler „ways to label you" | `1647` „categories on you" | **650.000** | Xandr-Leak, The Markup + netzpolitik 2023 |
| Cold-open-Frequenz | „hundreds of times a day" | **376×/Tag (EU), 747×/Tag (US)** | ICCL/Johnny Ryan 2022 |
| sensible Segmente | erfundene „(inferred)"-Labels | **verbatim echte Segmente** | Xandr-Leak (The Markup + netzpolitik) |
| „offizielle" Taxonomie | — | IAB Audience Taxonomy **1.1, ~1.500 Segmente** | IAB Tech Lab |

**Die Kern-Dramaturgie wird durch die echten Zahlen stärker:** Die „offizielle"
IAB-Taxonomie hat ~1.500 Segmente — der *tatsächliche Marktplatz* (ein einziger,
Xandr) hatte **650.000**. Das ist die ehrliche, größere Zahl.

---

## Verifizierte Segmente (alle im Spike verwendet)

### Sensibel — verbatim aus dem Xandr-Marktplatz-File (2023 versehentlich publiziert)
Quelle US: **The Markup**, Keegan & Eastwood, 2023-06-08.
Quelle EU: **netzpolitik.org**, 2023 (Kooperation mit The Markup).

- „Heavy Purchasers of Pregnancy Test Kits"  *(The Markup)*
- „Depression Medications"  *(The Markup)*
- „Propensity for Depression" / „Propensity for Stroke"  *(The Markup)*
- „Infertility / IVF"  *(The Markup)*
- „Easily Deflated" / „I generally get a raw deal out of life"  *(The Markup, Personality)*
- „HealthRankings › Diabetes Type II" (LiveRamp)  *(netzpolitik)*
- „Rheumatism", „Opiate Addiction", „Fragile Seniors"  *(netzpolitik)*
- „Casino & Gambling Activities" (Eyeota/Mastercard DE), „Gambling Addiction"  *(netzpolitik)*
- „'Hardcore' Republicans" / „'Persuadable' Democrats"  *(netzpolitik, politische Haltung)*

### Datenlieferanten im File (93 gesamt), genannt:
Oracle (>⅓ aller Segmente), Acxiom, Foursquare (Factual), LiveRamp, Eyeota, Mastercard.

### Gewöhnlich — Mix aus Xandr-File + IAB-Standard
- „Affluent Millennials", „Dunkin' Donuts Visitors", „Past Purchases › Subaru",
  „Not a Sightseer"  *(The Markup, verbatim)*
- „Age 35–44", „Homeowner", „Frequent Flyer", „Pet Owner", „Investing",
  „Job Seeking" u.a. — Standard-Kategorien der **IAB Audience Taxonomy 1.1**.

---

## DSGVO-Einordnung (für den Ehrlichkeits-/Story-Beat)

Viele der sensiblen Segmente sind **„besondere Kategorien personenbezogener Daten"
nach Art. 9 DSGVO** — deren Verarbeitung ist grundsätzlich **verboten** ohne
ausdrückliche Einwilligung (enge Ausnahmen):
Gesundheit (Diabetes, Depression, Stroke, IVF, Opiate Addiction, Rheumatism),
politische Meinung (Republican/Democrat). → Trotzdem im Markt gehandelt.
(noyb hat 2024 Beschwerde gegen Xandr eingereicht.)

---

## Quellen (Zugriff 2026-06-13)

- The Markup — „From 'Heavy Purchasers' of Pregnancy Tests to the Depression-Prone:
  We Found 650,000 Ways Advertisers Label You" (2023-06-08):
  https://themarkup.org/privacy/2023/06/08/from-heavy-purchasers-of-pregnancy-tests-to-the-depression-prone-we-found-650000-ways-advertisers-label-you
- netzpolitik.org — „Microsofts Datenmarktplatz Xandr: Das sind 650.000 Kategorien…" (2023):
  https://netzpolitik.org/2023/microsofts-datenmarktplatz-xandr-das-sind-650-000-kategorien-in-die-uns-die-online-werbeindustrie-einsortiert/
- ICCL — „Report on the scale of Real-Time Bidding data broadcasts in the U.S. and Europe"
  (Johnny Ryan, 2022): https://www.iccl.ie/news/iccl-report-on-the-scale-of-real-time-bidding-data-broadcasts-in-the-u-s-and-europe/
- IAB Tech Lab — Audience Taxonomy (v1.1, ~1.500 Segmente):
  https://iabtechlab.com/standards/audience-taxonomy/ ·
  Datei: https://raw.githubusercontent.com/InteractiveAdvertisingBureau/Taxonomies/main/Audience%20Taxonomies/Audience%20Taxonomy%201.1.tsv
- noyb — Xandr-Beschwerde (2024): https://noyb.eu/sites/default/files/2024-07/Xandr%20Complaint-EN_redacted.pdf
- DSGVO Art. 9 (besondere Kategorien): https://gdpr-info.eu/art-9-gdpr/

---

## Noch offen (vor echtem Drop)

- [ ] Exakte Segment-Zahl der IAB Audience Taxonomy 1.1 (TSV hat 242.980 Bytes; „~1.500"
      belegt, exakte Zeilenzahl noch nicht ausgezählt — sekundär, Held-Zahl ist 650.000).
- [ ] Frank-Review: dürfen die echten verbatim-Segmente (politisch/gesundheitlich) so
      gezeigt werden? (Sie sind öffentlich dokumentiert → ja, aber dein Call.)
- [ ] EN-Mikrokopie der neuen Quellenzeile final.
