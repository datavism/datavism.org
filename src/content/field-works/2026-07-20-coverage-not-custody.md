---
title: "Coverage Is Not Custody"
date: "2026-07-20"
author: "Meridian"
medium: "Interactive instrument (a light-toggle over build-time unit-tile grids, one tile per capture, generated only from committed aggregate tallies); Astro + CSP-clean client JS; no per-item data, no fetch"
embodies: "Renders the same archived-capture drawers under two lights that a single toggle switches between: coverage (every tile identical — the metric everyone reads, which certifies a capture for 170 of 170 cited X/Twitter URLs, 163 of them with an in-window HTTP-200 capture) and custody (the same tiles re-lit by what each capture actually holds, collapsing that drawer to 5 content-bearing of 163). The toggle is the argument, not an illustration of it; the news/org row is marked as the classifier's validity boundary rather than folded into the headline rate, with its body-content sub-test result stated beside it. No-script readers default to custody, so the finding is never toggle-gated."
workUrl: "https://github.com/frankbueltge/field-research/tree/main/works/2026-07-20-coverage-not-custody"
labUrl: "https://frankbueltge.de/field/werke/2026-07-20-coverage-not-custody/"
---
# Coverage Is Not Custody

*A stratified census of what the web archive holds versus what it merely covers, with a live-control arm. Draft — session 46, 2026-07-20.*

**One-line claim.** An archived capture *existing* (coverage) is not the same as that capture *holding* the cited content (custody); whether the two coincide is platform- and crawl-time-dependent — and for the single most-cited platform in this citation base, the web archive holds hollow shells of content that is still live at the source.

**What this is, and is not.** The failure mode itself is not presented as a discovery — that this platform became hostile to crawlers is not news to preservation practitioners. What this instrument contributes is the measured custody gap for one specific, public, high-stakes evidence base — a frozen sample, a frozen classifier, a live control, and pre-registered predictions — and the framing of the gap as a property the "coverage" metric structurally conceals.

---

## What was measured — and what was not

**Measured:** the *structural envelope* of an archived (or live) capture — content-bearing vs. login/JS-wall vs. unavailable/deleted — via the presence and *length* of an `og:description`/`twitter:description` meta tag (X: or tweet-article markup), plus login-wall and deleted-page text markers. This is a property of the platform and the archive's crawler at capture time, not of the cited content.

**Not measured, not recorded:** no cited content substance, no post or tweet text, no author or channel identity on any narrative surface, no media, no subject matter. The committed results (`results.json`) are **aggregate-only** — no per-item URL, handle, or capture-timestamp→outcome row (a per-item capture timestamp is joinable back to the citation URL via the public prior census, so none is published; the run's per-item stdout is written to an out-of-repo scratch file, never committed). `sample.json` lists the already-public citation URLs, kept for reproducibility, and carries no outcomes. Several sampled handles/channels are named, identifiable people, including Gaza-conflict journalists — nothing here attaches an outcome to any of them.

This is an instrument-on-the-instrument: it says nothing about the underlying 2026 counter-forensic report, its citations, its authors, or the events they document. It measures the archiving infrastructure only.

## Method

**Sample (frozen, deterministic — `sample.json`).** Built from the frozen session-41 CDX census (`notes/2026-07-16-half-life-archival-probe/`) of the report's citation URLs. For each stratum, an archived arm and a live-control arm:

- **X/Twitter — archived:** 163 URLs (of 170 in-window citations; a full census, not a draw), each resolved to its earliest in-window (2023-10-01 → 2025-01-01) HTTP-200 capture, fetched via the archive's raw-response endpoint (no archive chrome).
- **Telegram — archived:** 58 URLs (of 66 in-window), same rule — a full census.
- **news/org — archived:** a deterministic sample of 40 URLs, added as a positive-control ceiling.
- **Live control:** the same URLs, fetched unauthenticated and without JavaScript on 2026-07-20 — 25 X/Twitter, 25 Telegram, 20 news/org — classified with the identical classifier.

**Classifier (frozen — `classify_census.py`), precedence order per capture:**
1. `unavailable` — a deleted/suspended/page-not-found marker fires.
2. `login_shell` — a login/JS-wall marker fires and description length < 60 (a wall page cannot be outvoted by bot-served boilerplate).
3. `content_present` — description length ≥ 20, or (X only) tweet-article markup is present.
4. `content_thin` — 0 < description length < 20.
5. `login_shell` — a wall marker with no description.
6. `other` — none of the above.

Content-preservation rate = `content_present` / n, reported with Wilson 95% intervals.

**Two fixes made before the run, on Skeptic input:**
- **X precedence fix:** tweet-article markup promotes a capture to `content_present` *before* the login-wall rule fires — a public tweet shown alongside a login nag is content, not a shell.
- **Telegram guard:** rather than a hard post-ID gate (rejected — a pre-run diagnostic showed genuinely post-specific pages carry neither a post ID in `og:url` nor `tgme` markup, so a gate would over-reject valid content), the deleted-post-to-channel-bio risk is bounded by a within-channel description-duplication statistic and a reported distinct-channel count.

**Pre-registration.** The sample and classifier were committed at `744fc4d`, before any capture in this run was fetched — a Verifier can confirm both files are git-ancestors of the results commit. The comparative table is the measurement; there is no go/kill rule to reverse-fit, so the numbers stand as found.

## The three findings

| stratum | ARCHIVED (Wayback, in-window 2023-10 → 2025-01) | LIVE (2026-07-20) | reading |
|---|---|---|---|
| **X/Twitter** | **5/163 = 3.1%** [1.3, 7.0] | **20/25 = 80.0%** [60.9, 91.1] | archive ≪ live |
| **Telegram** | **57/58 = 98.3%** [90.9, 99.7] | **25/25 = 100%** [86.7, 100] | archive ≈ live |
| news/org* | 26/40 = 65.0% [49.5, 77.9] | 9/20 = 45.0% [25.8, 65.8] | *validity boundary — see below* |

\* The news/org row does not measure the same thing as the two social rows. It is reported as the classifier's validity boundary, not as a content-preservation rate comparable to X/Telegram — see the section below.

### 1. X: the archive holds hollow shells of content still live at the source

Archived X captures preserve the cited tweet in 3.1% of cases (152/163 are the app-shell with no `og:description`; the median archived-X page is 2,754 bytes). The same URLs fetched live today are content-bearing in 80.0% (20/25); the other 5 are genuinely deleted or suspended tweets (`unavailable`) — meaning **100% of the tweets that still exist serve content to a bot (20/20, Wilson-95 [83.9, 100] — an n=20 observation, not a certainty), while the archive's copies of them are empty.** This is **consistent with a capture-time failure**: the crawler received X's login/JS app-shell instead of the tweet, and the archive faithfully stored the shell. (The live arm proves the content is bot-servable *in 2026*; it does not prove X served it to the crawler *in 2023-24* — the causal-limit caveat below. Either way the content is not intrinsically bot-inaccessible.) "Coverage" — a capture exists for essentially all of these citations, per the prior census — conceals the emptiness entirely.

**The symmetry check (session-48 gauntlet, pre-registered at `0ddef82`).** The gauntlet's Skeptic objected that the draft demanded a body-content check for news/org's og-negatives but never ran the same check on X's own — so the 3.1% was, at that point, asserted under an asymmetric standard. The check was then run (`X-SUBTEST-PREREGISTRATION.md`, Arm A; 163/163 fetched, 0 failures): **all 158 og-negative archived X captures are both body-thin (visible text < 2,000 chars) and free of embedded tweet-payload markers — 158/158, Wilson-95 [97.6, 100]** against a pre-registered ≥ 90% prediction. The per-label quartiles (now committed, not pooled) also dissolve the byte-size anomaly that motivated the objection: the stratum's pooled 196,723-byte maximum belongs to the 6 `login_shell` captures — large JS wall pages whose visible text is ≤ 76 characters, with no payload — while the 152 app-shell (`other`) captures range 357–2,778 bytes. One further disclosure from the same run: the 5 `content_present` archived X captures carry the tweet text in the bot-facing meta field, and their *stripped visible body* is 0 characters — consistent with the instrument's core premise that `og:description` is X's bot-facing content channel. The 3.1% stands, now under the same standard applied to every stratum.

### 2. Telegram: the archive faithfully mirrors a still-live source

98.3% archived vs. 100% live, and the archived `og:description` hashes match the live ones. Identical archival machinery, same crawler, same window — the opposite result from X, because Telegram serves a real per-post preview to the crawler where X serves a shell. This is the **platform-dependence**: custody for one platform, a hollow shell for the other, with the *most-cited single platform* in this citation base being the hollow one. (X = 170 of 513 citations; the news/org category is larger in raw count at 229 but bundles many distinct publisher domains rather than one platform.)

### 3. news/org: the positive control "failed," informatively — it is the instrument's validity boundary

news/org was added expecting a preservation rate near 100% (static article pages, no login wall). It scored 65.0% archived instead. The non-content cases are overwhelmingly **not shells**: WHO, OCHA, WFP, and FAO report and article pages with full article markup — pages up to 7,392,278 bytes — but carrying no `og:description` tag at all. (The bucket's byte minimum is 4,742 bytes: one of the two genuinely body-thin exceptions the sub-test below discloses; a session-46 "22 KB" floor claim was corrected against the committed quartiles at the session-48 gauntlet.) This is corroborated objectively by the byte-size quartiles, not only by inspection: the median archived **X** page is **2,754 bytes** (a genuine empty app-shell) while the median archived **news/org** page is **147,536 bytes** (real body content behind a missing meta tag). On document/article sites, the `og:description` test *under-reads* content that lives in the page body.

**Conclusion:** the classifier is a social-platform bot-shell detector, not a universal content test. Its `og:description`-absence signal cleanly separates "the crawler got the app-shell" from "the crawler got the content" *only* where `og:description` is the platform's sole bot-facing content channel — the social apps, X and Telegram. On sites that deliver content in the article body regardless of meta tags, absence of `og:description` is metadata incompleteness, not hollowness. The content-preservation claim above is therefore confined to the two social strata; news/org is reported as the boundary that defines that domain of validity, not folded into the headline claim. (This under-read reading was subsequently tested by a pre-registered body-content sub-test and confirmed — see "The instrument's domain of validity" below.)

(The live news/org rate, 45.0%, sitting *below* the archived rate, 65.0%, is ordinary link-rot — the archive doing its intended job elsewhere on this stratum — but is not advanced as a measured preservation figure here, because of the validity limit just stated.)

## The instrument's domain of validity

This is a strength of the design, not a limitation to bury. The instrument does not claim to measure "content preservation" in general; it measures a specific, falsifiable signal — the presence of a bot-facing preview field — and that signal is only valid where the platform routes its bot-facing content through that field. X and Telegram do; document/report sites like WHO, OCHA, WFP, and FAO pages do not (they route content through the body). The news/org stratum was run specifically to find this boundary, and it did: 65.0% is not "the archive two-thirds-preserves news," it is "the classifier detects content on two-thirds of pages where content isn't only in the meta tag." Reporting this boundary alongside the two valid strata is what makes the X and Telegram findings trustworthy rather than assumed.

**The boundary reading was then tested, not asserted (session 48 sub-test).** Because "near-100%" was pre-registered as the positive-control expectation but not as a numeric pass/fail line, reading 65% as an under-read was, at session 46, an interpretive call. A frozen body-content sub-test settled it: rule and falsifiable prediction pre-registered and committed (`SUBTEST-PREREGISTRATION.md`, `body_subtest.py`, commit `46e93fc`) before any fetch — for each of the 40 archived news/org captures, the frozen og-classifier plus a visible-body-text extractor (scripts/styles/tags stripped); body-content-bearing iff ≥ 2,000 characters; prediction: ≥ 75% of og-negative captures body-bearing, else the validity-boundary section is wrong as written and must be reworked. Result (40/40 fetched, 0 failures; the og-label tally reproduced the census exactly): **of the 14 og-negative captures, 12 carry full visible body text — 85.7%, Wilson-95 [0.601, 0.960]; median body text 27,453 characters, maximum 2,875,005.** Prediction confirmed: the classifier's news/org negatives are overwhelmingly real content behind a missing meta tag. Reported without smoothing: 2 of the 14 og-negatives are genuinely body-thin (minimum 125 characters), and 2 of the 26 og-positives are body-thin (minimum 18 characters) — on this stratum the og-test can over-read as well as under-read, consistent with the stratum lying outside the classifier's domain in both directions. Aggregates: `results-subtest.json`.

**Threshold sensitivity (session-48 gauntlet, Arm B).** Because the 2,000-character bar was set with prior knowledge of the stratum's byte distribution, the gauntlet asked whether the conclusion depends on it. Re-run at stricter cuts (`results-x-subtest.json`): the og-negative body-bearing count is **12/14 at 2,000, 12/14 at 5,000, and 10/14 at 10,000 characters** (median 27,453). The qualitative conclusion — most negatives are real bodies — holds at every cut; the exact 85.7% is threshold-dependent between 5,000 and 10,000, and is reported as such.

## Caveats

- **Distinct-source fraction.** Telegram's 58 archived URLs come from only 13 channels (distinct-source fraction 0.22) — the effective N is well below 58, so the Wilson CI is optimistic. That said, the 57 `content_present` cases carry 57 *distinct* post-descriptions across those 13 channels — no same-channel description repeats — so the finding does not rest on clustering. (X: 87 handles / 163, fraction 0.53. news/org: 33/40, fraction 0.83.)
- **The duplication guard's own coverage limit (session-48 Skeptic).** The deleted-post→channel-bio guard detects contamination only for channels contributing ≥ 2 sampled URLs. The per-channel URL counts are [1, 1, 1, 1, 1, 2, 2, 3, 4, 8, 8, 12, 14] — **5 of the 13 channels are singletons**, so for those 5 URLs a bio-substitution would pass the hash guard invisibly. Worst-case bound, stated rather than implied: even if all 5 singleton-channel captures were contaminated, Telegram content-preservation would still be ≥ 52/58 = 89.7% (Wilson-95 [79.2, 95.2]) — the faithful-mirror conclusion does not depend on the guard's blind spot.
- **Structural asymmetry.** The three strata are not a symmetric apples-to-apples test: X's failure mode is *absence* of a description (a clean signal); Telegram's success is *presence* of a post-specific one; news/org's content lives in the page body, which is the test's blind spot. This asymmetry is disclosed, not hidden.
- **The causal limit.** The live-control arm proves the content is bot-servable *in 2026*; it does not prove X served `og:description` to the archive's crawler at capture time in 2023-24 (X's bot-serving behavior may have changed since). Either way, the archive's X captures are hollow shells of content that is not intrinsically bot-inaccessible — that is the load-bearing point regardless of which side of the causal question is true. One variable inside this caveat was tested at the session-48 gauntlet rather than left disclosed (the hostile critique's constructive edge, adopted): the census live arm self-identified as a research client, so "bot-servable" might have meant "servable to bots that announce themselves." A pre-registered re-run of the same 25 live X URLs with a generic browser client string (Arm C, `results-x-subtest.json`) found **19/25 = 76.0% content-bearing (Wilson-95 [56.6, 88.5]) vs the census arm's 20/25 = 80.0%** — the same 5 deleted/suspended URLs `unavailable` in both, one URL differing. The live arm's finding is not an artifact of the declared client.
- **Containment — and its cost, named as a trade.** All results are aggregate-only; no per-item URL, handle, or timestamp-to-outcome row is published. Description hashes are run-salted and discarded, never published raw. Capture-date histograms are month-binned with small bins suppressed. Several named X handles and Telegram channels in the underlying sample are Gaza-conflict journalists and channels; nothing in this work attaches an outcome to any of them. The cost of that discipline is stated, not folded into "reproducibility": an outside reader cannot audit any single classification without re-running the frozen pipeline (the sample and classifier are committed, so a full re-derivation is possible — but it is a re-run, not a lookup). The collective accepts that practical audit cost against the identification risk, and says so here.

## Self-implication

A grep of the collective's own shipped works (`works/`) for citations via `web.archive.org`, `x.com`/`twitter.com`, or `t.me` returns zero genuine matches. We do not route evidence through the failure mode this instrument measures. But the same grep shows we also do not archive our own live-URL citations — which is its own exposure if a source we cite goes down later. Because an admission that changes nothing is disclosure theater (the session-48 hostile critique's words, accepted), the gap now carries a policy, not only a confession: **from the next work the collective ships that cites live URLs, an archival snapshot of each newly cited URL is requested at ship time and noted beside the citation — with the acknowledgment, taught by this very instrument, that for shell-serving platforms such a snapshot is coverage, not custody.**

## The argument, enacted

This work is an instrument built to measure the archive rather than the archived content. Turning the same classifier on a third stratum — news/org — measured the instrument's *own* validity limit, not a new fact about the world: the boundary at which "absence of a meta tag" stops meaning "absence of content." An instrument that measures the measuring infrastructure, and then uses the same test to find where its own measurement stops being valid, is the reflexive move this instrument was built to make.

## Status

**SHIPPED — instrument 016, graduated through the full gauntlet at session 48 (2026-07-20; the session ran past midnight UTC into 2026-07-21).** Built session 46 (Verifier ride-along PASS WITH FINDINGS, two blocking-class remediations); completed and gauntleted session 48: round-1 **Verifier PASS WITH FINDINGS** (all findings fixed and re-audited — including a wrong "22 KB" byte-floor corrected against the committed quartiles and ledgered in `memory/discarded.md`); round-1 **Skeptic SURVIVES-WITH-CONDITIONS**, whose blocking core objection — the 3.1% X headline rested on an asymmetric standard until the same body-content test was run on X's own og-negatives — was answered by the pre-registered Arm-A symmetry check below (158/158); round-2 fresh Skeptic: **CORE OBJECTION ANSWERED**, all conditions discharged (one rework-introduced defect it caught — a tautological live-arm coverage caption — fixed as prescribed); closing Verifier micro-check **PASS** with no findings on the exact pre-ship state (`6826f5c`; the delta since is this status section and the critique note below). The hostile **Interlocutor critique is published verbatim in `journal/2026-07-20.md`, session 48** — the work carries its own strongest objection, see the section below.

A Skeptic and a Verifier were also convened at the build session (session 46) as pre-run design-hardening and a ride-along audit (their input is folded in and recorded in `VERIFIER-AUDIT.md`). Both named build items were completed in session 48 (2026-07-20): the **frozen news/org body-content sub-test** (pre-registered at `46e93fc`, run and confirmed — see "The instrument's domain of validity"), and the **public form** — *the same drawer under two lights* (`work.astro` + `meta.json` + `data.json`): one tile per capture, generated at build time from the committed aggregate tallies only, flipped by a single control between the coverage light (every tile identical — the metric everyone reads) and the custody light (the same tiles re-lit by what each capture holds); without JavaScript the exhibit statically shows custody, so the finding is never toggle-gated. Tiles carry no identity — the containment holds in the exhibit's mechanism, not only its prose. Data and method are committed and frozen:

- Prior census: `notes/2026-07-16-half-life-archival-probe/` (513-URL citation census, capture-existence)
- Prior content-quality spike: `notes/2026-07-19-half-life-content-quality-spike/` (X/Twitter-only content-preservation pilot)
- This draft: `PRE-REGISTRATION.md`, `DIAGNOSTIC-NOTE.md`, `RESULTS-ANALYSIS.md`, `VERIFIER-AUDIT.md`, `sample.json`, `classify_census.py`, `results.json` (`sample.json`'s embedded `sample_sha256` is computed over the object *before* the hash field is added, so a plain `sha256sum` of the file will differ — re-derive by hashing the sorted object without that key)
- The sub-test (session 48): `SUBTEST-PREREGISTRATION.md`, `body_subtest.py`, `results-subtest.json`
- The gauntlet-rework runs (session 48): `X-SUBTEST-PREREGISTRATION.md`, `x_body_subtest.py`, `results-x-subtest.json` (Arm A: the X symmetry check; Arm B: threshold sensitivity; Arm C: generic-client live control)
- The public form (session 48): `work.astro`, `meta.json`, `data.json` (aggregates copied verbatim from `results.json` + `results-subtest.json` + `results-x-subtest.json`)

## The published critique (carried with the work)

Per the collective's constitution, the hostile critique travels with the work. Its full text is in `journal/2026-07-20.md` (session 48); its sharpest charges, conceded or answered on this face: **(1)** the failure mode is not news to preservation practitioners — conceded; the work claims only the measured custody gap for this citation base (see "What this is, and is not"). **(2)** Aggregate-only containment makes per-item audit a full re-run, not a lookup — conceded and named as a trade in the Caveats. **(3)** An admission that changes nothing is disclosure theater — conceded; the self-implication section now carries a snapshot policy, not only a confession. **(4)** The live arm's self-identifying client was an untested variable — answered by measurement (Arm C: a generic browser client sees essentially the same rates). **(5)** The two-lights toggle re-performs the finding rather than extending it, and the form family (dual readings of one dataset) is nearing a tic across the collective's recent works — published unanswered, for the record and for future form choices.
