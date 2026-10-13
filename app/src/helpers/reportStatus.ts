// FE-022 / FE-024: report status model for the citizen confirmation screens.
// SRS FR-013.1: Submitted → Verified → Assigned → In Progress → Resolved.
// Structural on purpose: the repo already has types/report.ts; map your report into CitizenReport in the adapter.

export const REPORT_STATES = ['SUBMITTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const
export type ReportState = (typeof REPORT_STATES)[number]

export interface StatusEvent {
  state: ReportState
  /** ISO timestamp of the transition (FR-013.5) */
  at: string
}

export interface CitizenReport {
  reference: string
  state: ReportState
  history: StatusEvent[]
  beforePhoto: string | null
  afterPhoto: string | null
  resolvedAt: string | null
  address?: string
  /** true when this report was clustered into an existing incident (FR-011.2) */
  clusteredWithExisting?: boolean
}

export type StepStatus = 'done' | 'current' | 'upcoming'
export interface TimelineStep {
  state: ReportState
  status: StepStatus
  at: string | null
}

/** One step per state, marked done / current / upcoming, with the time it was reached. */
export function buildTimeline(current: ReportState, history: readonly StatusEvent[]): TimelineStep[] {
  const currentIndex = REPORT_STATES.indexOf(current)
  const resolved = current === 'RESOLVED'
  return REPORT_STATES.map((state, i) => {
    const events = history.filter((h) => h.state === state)
    const at = events.length ? events[events.length - 1].at : null
    const status: StepStatus = i < currentIndex || resolved ? 'done' : i === currentIndex ? 'current' : 'upcoming'
    return { state, status, at: status === 'upcoming' ? null : at }
  })
}

export type ResolutionView = 'ready' | 'not-resolved' | 'missing-photo'

/**
 * What the "resolved" screen may show. A resolved report must have an after-photo (FR-012.1);
 * if the data says Resolved but the photo is missing, say so instead of showing an empty "after" frame.
 */
export function resolutionView(report: Pick<CitizenReport, 'state' | 'afterPhoto'>): ResolutionView {
  if (report.state !== 'RESOLVED') return 'not-resolved'
  return report.afterPhoto ? 'ready' : 'missing-photo'
}

/** Localised date + time in Nakuru time. Returns '' for an invalid date. */
export function formatTimestamp(iso: string | null | undefined, locale: string, timeZone = 'Africa/Nairobi'): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(locale === 'sw' ? 'sw-KE' : 'en-KE', { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(d)
}