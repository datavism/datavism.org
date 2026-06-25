// Browser-only persistence for closed Command Center operations. Anonymous,
// on-device, no network. Mirrors the versioned-envelope pattern from signal-cards/storage.ts.
import type { Finding } from './certify'

export type ClosedOperation = {
  caseId: string
  finding: Finding
  certifiedAt: string
  codename: string
}

const HISTORY_KEY = 'datavism:command-center:history'
const STORAGE_VERSION = 1

type HistoryEnvelope = { version: number; ops: ClosedOperation[] }

const get = (k: string): string | null => { try { return globalThis.localStorage?.getItem(k) ?? null } catch { return null } }
const set = (k: string, v: string): void => { try { globalThis.localStorage?.setItem(k, v) } catch {} }

export function loadHistory(): ClosedOperation[] {
  const raw = get(HISTORY_KEY); if (!raw) return []
  try { const env = JSON.parse(raw) as HistoryEnvelope; return Array.isArray(env?.ops) ? env.ops : [] }
  catch { return [] }
}

export function recordClosed(op: ClosedOperation): ClosedOperation[] {
  const ops = [op, ...loadHistory().filter((x) => x.caseId !== op.caseId)]
  set(HISTORY_KEY, JSON.stringify({ version: STORAGE_VERSION, ops }))
  return ops
}
