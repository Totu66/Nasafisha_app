// FE-005 / FR-002: a connectivity gap must never force a re-login. Only expiry or an explicit 401 does.

export interface StoredSession {
  token: string
  /** epoch ms; the session is valid for the shift (default 10 h) */
  expiresAt: number
  /** used to pick the home screen when resuming */
  role?: string
}

export type GapError = { kind: 'network' } | { kind: 'server' } | { kind: 'unauthorized' }
export type GapOutcome = 'resume' | 'reauth'

export function isSessionExpired(session: StoredSession | null | undefined, now: number = Date.now()): boolean {
  return !session || !session.token || now >= session.expiresAt
}

/**
 * Call after connectivity returns (or on app start). Offline failures and 5xx do NOT log the user out.
 * Validation is local, so it works with no network at all.
 */
export function decideAfterGap(
  session: StoredSession | null | undefined,
  now: number = Date.now(),
  lastError?: GapError,
): GapOutcome {
  if (isSessionExpired(session, now)) return 'reauth'
  if (lastError?.kind === 'unauthorized') return 'reauth'
  return 'resume'
}
