// Single source of truth for the analytics switch. Read by Analytics.astro
// (ships the script) AND legal.astro (build guard): the deploy that would make
// the privacy page lie cannot build. Enable by setting both env vars on the
// Vercel project (production): PUBLIC_UMAMI_SRC + PUBLIC_UMAMI_WEBSITE_ID.
export const UMAMI_SRC = import.meta.env.PUBLIC_UMAMI_SRC as string | undefined
export const UMAMI_WEBSITE_ID = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID as string | undefined
export const ANALYTICS_ENABLED = Boolean(import.meta.env.PROD && UMAMI_SRC && UMAMI_WEBSITE_ID)
