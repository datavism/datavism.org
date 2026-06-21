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
3. **We write only `crew/{uid}.datavism`**, using the **`line`** schema (`G/K/R/B/V`) —
   NOT the retired `role` schema.
4. **Transport decision is open** — recommended **Option A** below.

---

## Our situation + the one open decision

datavism.org is **Astro 6 with no auth backend wired yet** (no Supabase, no Firebase). That's an
advantage: there's no conflicting store, so we can adopt the shared Firestore cleanly.

| Option | What datavism does | Verdict |
|---|---|---|
| **A — Firebase SDK** | Add the Firebase client SDK + the `data-snack` project config; read/write `crew/{uid}` directly as the authenticated user | ✅ **Recommended** — schema-ready, lowest friction, both sites are Astro |
| **B — Server-to-server** | Call a `data-snack` Cloud Function that reads/patches `crew/{uid}` | cleaner trust boundary, needs a new endpoint |
| **C — Mirror locally** | copy `crew` into a separate datavism store | ❌ breaks single source of truth |

Pick **A** unless there's a concrete reason not to. We'll need the `data-snack` Firebase web config
(`PUBLIC_FIREBASE_*`) and the project's Firestore rules to permit a matching-uid `.datavism` write
(or expose a small Function for it).

---

## The flow (Magic Link)

**Already built on the data-snack side** (we consume it, we don't rebuild it):

- `requestMagicLink` — `{email, recoveryCode?, codename?}` → 15-min JWT → `magic_links/{jti}` → mail.
- `redeemMagicLink` — verifies (single-use) → get-or-create Firebase Auth user by email →
  **upserts `crew/{uid}`** with `{uid, email, signed_up_at, passport:{codename, recovery_code}}` →
  mints a custom token.

**What we build on datavism.org:**

1. **`/connect`** — user enters the *same* email → trigger a magic link →
   on redeem, look up `crew/{uid}` → **import `passport.codename`** into the datavism store.
2. **Onboarding → write `crew/{uid}.datavism`** with the `line` affinity (schema below).

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

## ⚠ Two doc-drifts — do NOT trip on these

1. **Use `line`, not `role`.** The field is a `line` string (current agreed values
   `'G'|'K'|'R'|'B'|'V'`). The old `role: warrior|rebel|artist|explorer` + `motivation`
   is **retired**. How those values are chosen/what they mean lives in our story docs, not here.

2. **Passport is v2 + snake_case.** Build against the data-snack `src/lib/passport.ts` shape
   (snake_case `visited_snacks`, key `data_snack_passport`), not the older ADR-004 camelCase snippet.

---

## Build checklist (datavism side)

- [ ] Transport decision (Option A recommended) + obtain `data-snack` Firebase config
- [ ] `/connect` page: email → magic link → redeem → import `passport.codename`
- [ ] Onboarding writes `crew/{uid}.datavism` with the `line` schema
- [ ] Confirm Firestore rule path for the matching-uid `.datavism` write
- [ ] Keep this file in sync with the data-snack mirror

---

## Deliberately not chosen

- OAuth / social login / passwords (magic link only — diner-stub model).
- A second identity store on datavism (breaks single source of truth).
