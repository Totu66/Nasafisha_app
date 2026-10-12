// Structural on purpose: the repo already has types/deviationAlert.ts, whose exact shape I have not seen.
// Any object with these fields works. Status strings are an assumption; confirm with the API owner.
export interface DeviationAlertLike {
  status: string
  flaggedAt: string
}

// FR-022: flag a vehicle 500 m off-route for 10+ minutes. Detection is server-side; shown here for display/tests.
export const DEVIATION_THRESHOLD_M = 500
export const DEVIATION_THRESHOLD_MIN = 10

export const isActive = (a: DeviationAlertLike): boolean => a.status === 'FLAGGED'

/** Active alerts first, then newest first. Does not mutate the input. */
export function sortAlerts<T extends DeviationAlertLike>(alerts: readonly T[]): T[] {
  return [...alerts].sort((a, b) => {
    if (isActive(a) !== isActive(b)) return isActive(a) ? -1 : 1
    return Date.parse(b.flaggedAt) - Date.parse(a.flaggedAt)
  })
}

export function minutesSince(iso: string, now: number = Date.now()): number {
  return Math.max(0, Math.round((now - Date.parse(iso)) / 60000))
}

/** Only an active alert can be authorised, and only by a supervisor. */
export function canAuthorize(alert: DeviationAlertLike, role: string | null | undefined): boolean {
  return isActive(alert) && role === 'supervisor'
}
