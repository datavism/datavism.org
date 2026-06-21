# Integration Contract — datavism.org ⇄ data-snack.com

**Status:** Current (2026-06-21). Binding contract for the cross-platform user-account bridge.
**Canonical mirror:** This file is kept in sync with `data-snack.com/.../prototype-v2/docs/INTEGRATION-datavism.md`.
The **schema source of truth** lives in the data-snack repo (`docs/firestore-schema.md` +
`src/lib/passport.ts` + `functions/auth/`). When in doubt, that repo's code wins.

This is the **actionable contract** for connecting datavism.org accounts to the shared
data-snack identity. It tells you what datavism builds, the exact shared shape, and the
two doc-drifts to avoid.

> **Scope — technical only.** This contract covers data shapes, transport, and ownership.
> The *meaning* of datavism's own fields (what `line` values stand for, how onboarding
> collects them) is datavism's story/product domain and is **out of scope here** — defined
> in datavism's own story docs, not in this bridge contract. data-snack stores those fields
> opaquely and never reads them.

---

## TL;DR — what we build on datavism.org

1. **Bridge = one shared Firestore document** `crew/{uid}` in GCP project **`data-snack`**.
   Key is the **email → Firebase Auth uid**. Mechanism is **Magic Link** (no OAuth, no password).
2. **Read the codename from `crew/{uid}.passport.codename` and keep it.** Never regenerate it.
3. **We write only `crew/{uid}.datavism`**, via the `setDatavismProfile` function (not a direct
   Firestore write) — using the `line` field, NOT the retired `role` schema.
4. **Transport: Option A (decided 2026-06-21)** — Firebase client SDK + `data-snack` config.

---

## Transport: Option A (decided)

datavism.org is **Astro 6 with no auth backend wired yet** (no Supabase, no Firebase). No conflicting
store → we adopt the shared Firestore cleanly.

| Option | What datavism does | Verdict |
|---|---|---|
| **A — Firebase SDK** | Add the Firebase client SDK + the `data-snack` project config; read `crew/{uid}` directly, write `.datavism` via `setDatavismProfile` | ✅ **Chosen** — schema-ready, lowest friction, both sites are Astro |
| **B — Server-to-server** | Call a `data-snack` Cloud Function for every read/patch | cleaner trust boundary, more endpoints |
| **C — Mirror locally** | copy `crew` into a separate datavism store | ❌ breaks single source of truth |

We need from data-snack: the Firebase web config (`PUBLIC_FIREBASE_*`, project `data-snack`) and
`datavism.org` added to **Firebase Auth → Authorized domains**. No Firestore rules change is needed —
reads use the existing matching-uid rule, the `.datavism` write goes through `setDatavismProfile`.

---

## The flow (Magic Link)

**Already built on the data-snack side** (we consume it, we don't rebuild it — origin-aware as of
2026-06-21, pending deploy):

- `requestMagicLink` — `{email, app?, recoveryCode?, codename?}` → 15-min JWT → `magic_links/{jti}`
  → mail. We send **`app:'datavism'`** so the link lands on `https://datavism.org/connect`.
- `redeemMagicLink` — verifies (single-use) → get-or-create Firebase Auth user by email →
  **upserts `crew/{uid}`** with `{uid, email, signed_up_at, passport:{codename, recovery_code}}` →
  mints a custom token.
- `setDatavismProfile` — our write path for `crew/{uid}.datavism`; auth via our Firebase **ID token**.

**What we build on datavism.org:**

1. **`/connect`** — user enters the *same* email → `requestMagicLink` (`app:'datavism'`) →
   on redeem (`signInWithCustomToken`), look up `crew/{uid}` → **import `passport.codename`**.
2. **Onboarding → call `setDatavismProfile`** to write `crew/{uid}.datavism` (the `line` affinity).

Same email across devices = same `uid`. The codename is the stable cross-platform handle —
read it from the crew doc and keep it; do not regenerate it.

---

## The shared schema (data-snack code is the source of truth)

```ts
crew/{uid} = {
  uid: string,                 // === Firebase Auth UID === doc id
  email: string,               // verified, canonical lowercase
  signed_up_at: Timestamp,
  passport: {                  // mirror of the data-snack client Passport (snake_case!)
    codename: string,          // ← we READ this and keep it
    recovery_code: string,
    // ...full PassportData (version 2) compatible
  },
  datavism?: {                 // ← WE OWN this; data-snack stores it opaquely
    line: string,              // affinity code, current values 'G'|'K'|'R'|'B'|'V'
    enrolledLines: string[],
    completedStations: string[],
    cohortIds: string[],
  }
}
```

`line` and the other `datavism` fields are **our** vocabulary — their allowed values and
meaning are defined in datavism's own story/product docs, not here. To the bridge they are
opaque strings that data-snack stores verbatim and never interprets.

---

## API contract (concrete — build against these)

All three are gen2 HTTPS functions, `region=europe-west3`, project `data-snack`. Exact URLs handed
over after deploy (`https://europe-west3-data-snack.cloudfunctions.net/<name>`).

```
POST requestMagicLink            (no auth — public)
  body: { email: string, app: 'datavism',
          recoveryCode?: string, codename?: string }
  → 202 { ok: true, mail: 'sent' | 'queued' }  |  202 { ok:true, deduplicated:true }
  → 400 { error: 'invalid-email' }
  app:'datavism' → link lands on https://datavism.org/connect?token=…

POST redeemMagicLink             (no auth — the JWT in the body IS the proof)
  body: { token: string }        // the ?token from the redeem URL
  → 200 { customToken: string, uid: string, email: string }
  → 400 invalid-or-expired | 404 unknown-jti | 409 already-redeemed | 410 expired
  then: signInWithCustomToken(customToken) → read crew/{uid} → keep passport.codename

POST setDatavismProfile          (auth: Authorization: Bearer <our Firebase ID token>)
  body: { line?: string, enrolledLines?: string[],
          completedStations?: string[], cohortIds?: string[] }
  → 200 { ok: true }             // REPLACES the whole crew/{uid}.datavism object
  → 401 missing-bearer | invalid-token
  → 409 not-crew                 // user hasn't completed the magic-link upgrade yet
  Send the full datavism profile each call; values are stored verbatim.
```

---

## ⚠ Two doc-drifts — do NOT trip on these

1. **Use `line`, not `role`.** The field is a `line` string (current agreed values
   `'G'|'K'|'R'|'B'|'V'`). The old `role: warrior|rebel|artist|explorer` + `motivation`
   is **retired**. How those values are chosen/what they mean lives in our story docs, not here.

2. **Passport is v2 + snake_case.** Build against the data-snack `src/lib/passport.ts` shape
   (snake_case `visited_snacks`, key `data_snack_passport`), not the older ADR-004 camelCase snippet.

---

## Build checklist (datavism side)

- [x] Transport = Option A (decided)
- [ ] Obtain `data-snack` Firebase web config + confirm `datavism.org` in Auth authorized domains
- [ ] Add Firebase client SDK, init against project `data-snack`
- [ ] `/connect` page: email → `requestMagicLink({app:'datavism'})` → on `?token` redeem →
      `signInWithCustomToken` → read `crew/{uid}` → import `passport.codename`
- [ ] Onboarding → `setDatavismProfile` (full `datavism` payload, Bearer ID token)
- [ ] Handle returning-connected-user state
- [ ] Keep this file in sync with the data-snack mirror

**Waiting on data-snack:** deploy of the origin-aware functions + `setDatavismProfile`, and the
Firebase config / authorized-domain handover. The API contract above is final — you can build the
`/connect` UI against it now and point at the URLs once they land.

---

## Deliberately not chosen

- OAuth / social login / passwords (magic link only — diner-stub model).
- A second identity store on datavism (breaks single source of truth).
