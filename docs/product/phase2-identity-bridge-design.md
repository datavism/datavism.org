# DATAVISM Phase 2 — Identity Bridge to data-snack — Design

**Status:** Approved roadmap step (design doc §0/§7). Binding spec: `docs/INTEGRATION-data-snack.md`.
**Blocker for go-live (not for build):** `PUBLIC_FIREBASE_*` config in `.env` + one real magic-link round-trip test.

> **Goal.** Let a visitor connect a DATAVISM session to the shared **data-snack identity** (Firebase, magic-link), carry their **codename** across both sites, and sync their DATAVISM progress (`line`, `enrolledLines`, `completedStations`, `cohortIds`) into `crew/{uid}.datavism`. No datavism server — Firebase client SDK + the three live Cloud Functions.

---

## 1. Architecture

- **Client-side Firebase only** (modular SDK: `firebase/app`, `firebase/auth`, `firebase/firestore`). No datavism server runtime — works on the static site as a Svelte island.
- **Config from `PUBLIC_FIREBASE_*` env** (project `data-snack`). If unset, the bridge is **gracefully disabled** — `/connect` renders an "identity not configured yet" state; nothing throws, the rest of the site is unaffected.
- New, isolated surface: `/connect` page + `src/lib/identity/*`. Touches no existing page except an optional codename chip in the header (additive, behind a connected check).
- **We write only `crew/{uid}.datavism`**, via `setDatavismProfile` (never a direct Firestore write). We **read** `crew/{uid}` directly (matching-uid rule) and **keep** `passport.codename` — never regenerate it.

## 2. The flow (magic link) — `/connect`

1. **Request:** user enters email → `POST requestMagicLink { email, app:'datavism' }` → 202 → "check your inbox". The emailed link returns to `https://datavism.org/connect?token=…`.
2. **Redeem:** on `?token`, `POST redeemMagicLink { token }` → `{ customToken, uid, email }` → `signInWithCustomToken(customToken)` → read `crew/{uid}` → **import `passport.codename`** into the identity session.
3. **Returning user:** `onAuthStateChanged` — if already signed in, fetch `crew/{uid}`, show the connected state (codename + "disconnect").
4. **Sync:** on connect (and via a "sync now" button), build the datavism profile from local progress → `POST setDatavismProfile` (Bearer Firebase **ID token**). 409 `not-crew` → surface "finish connecting first" (shouldn't occur post-redeem).

## 3. Profile mapping (our vocabulary → bridge)

`crew/{uid}.datavism = { line, enrolledLines, completedStations, cohortIds }` — values are opaque to data-snack.

| Field | Source / rule |
|---|---|
| `line` | Primary affinity = the most recent G1 Signal Card's `nextLineChoice`, **UPPERCASED** (`'k'`→`'K'`); `'G'` if none. |
| `enrolledLines` | `{'G'} ∪ {each saved card's nextLineChoice}`, uppercased, deduped, stable order G,K,R,B,V. |
| `completedStations` | Our station ids (lowercase, e.g. `'g1'`): `'g1'` if ≥1 Signal Card exists; plus any station whose SelfCheck is all-ticked (`dv_<id>_checks` fully true). |
| `cohortIds` | `[]` — no cohort concept yet (reserved; opaque). |

> **Casing boundary lives in one function.** `line`/`enrolledLines` are UPPERCASE on the bridge; our `lines.ts` is lowercase. Map only at `buildProfile()`. `completedStations` stay lowercase (our vocab).

## 4. State model

`src/lib/identity/session.ts` holds `{ status: 'configured-out'|'disconnected'|'connecting'|'connected', uid?, email?, codename? }`. A light cache (`datavism:identity` = `{uid, codename, email}`) gives instant UI on return; Firebase Auth persists the real session. `signOut()` clears the cache but **keeps** the user's local Signal Cards (their work).

## 5. Honesty / privacy

- Connecting is **opt-in** (the user types their email). Magic-link → no passwords, no OAuth.
- Codename is **read and kept**, never regenerated; we never overwrite anything but `crew/{uid}.datavism`.
- No new tracking. The only new network calls are the three data-snack Cloud Functions + Firebase Auth/Firestore — all user-initiated by connecting. Local Signal Cards remain on-device unless the user connects and syncs.
- Keep `docs/INTEGRATION-data-snack.md` in sync with the data-snack mirror on any contract change.

## 6. Decisions (du-entscheidest calls)

1. **Affinity = most recent route choice** (not 'G' for everyone) — more meaningful; 'G' is the honest default before any choice.
2. **completedStations from real local signals** (cards + SelfCheck), not a fabricated list.
3. **Codename surfaced** on `/connect` and as an optional header chip when connected — it's the cross-platform handle; making it visible is the payoff.
4. **Sync = on-connect + manual button** (not continuous) for v0.1 — simple, predictable, no background writes.
5. **firebase SDK** added as a dependency (the contract's Option A). Tree-shaken to app/auth/firestore.

## 7. Testing

- **Unit (vitest, mocked `fetch`/no live Firebase):** bridge request/response shaping for all three endpoints (incl. error codes 400/404/409/410); `buildProfile()` mapping + uppercase casing + dedup/order; `deriveCompletedStations()` from a seeded localStorage; session cache serialize/round-trip.
- **Config-gated + manual (deferred):** the live `signInWithCustomToken` + Firestore `getDoc` handshake — verified once `PUBLIC_FIREBASE_*` is set, via a real magic-link email. This is the one path unit tests can't cover; flagged in the PR.
- Gates: `astro check` 0/0/0, `astro build` green, `vitest` all pass.

## 8. Scope / non-goals (v0.1)

**In:** `/connect` (request → redeem → connected/returning), codename import + display, progress sync (on-connect + manual), graceful config-off state, disconnect.
**Out:** account dashboard, multi-device card merge UI, email-change, cohort features, any GHOST/AI (Phase 3). No write path other than `setDatavismProfile`.

## 9. Files

```
src/lib/identity/
  firebase.ts     lazy modular-SDK init from PUBLIC_FIREBASE_*; isConfigured(); getAuth/getDb accessors (null when unconfigured)
  bridge.ts       requestMagicLink / redeemMagicLink / setDatavismProfile — typed fetch wrappers to the live URLs (pure, fetch-injectable for tests)
  profile.ts      buildProfile(localProgress) → {line,enrolledLines,completedStations,cohortIds}; lowercase→UPPERCASE line map; deriveCompletedStations()
  session.ts      identity state + localStorage cache (datavism:identity); read crew/{uid}; onAuthStateChanged wiring
src/components/connect/
  ConnectFlow.svelte   the /connect island: email form, ?token redeem, connected/returning/disconnected/config-off states, sync button
src/pages/
  connect.astro        the page (Base layout, focused funnel chrome)
package.json           + firebase
.env.example           already carries PUBLIC_FIREBASE_* placeholders (Phase-1 cleanup)
```

## 10. Go-live checklist (after build)

- [ ] Paste `PUBLIC_FIREBASE_*` (data-snack web config) into `.env` (+ Vercel prod env).
- [ ] Confirm `datavism.org` is allowed for Firebase Auth (contract says no authorized-domain change needed — verify).
- [ ] Real magic-link round-trip: request → email → redeem → codename imported → `setDatavismProfile` 200.
- [ ] Then merge. **Do not merge before this.**
