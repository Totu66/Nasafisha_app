import type { IssueType, TicketStatus } from './ticket'

export interface AdminTicketRow {
  id: string
  reference: string
  issueType: IssueType
  zone: string
  crewLabel: string | null
  status: TicketStatus
}

export type AuditKind =
  | 'submitted' | 'verified' | 'assigned'
  | 'closure_blocked' | 'closure_approved' | 'closure_overridden' | 'resolved'

export interface TicketAuditEntry {
  id: string
  at: string // ISO
  kind: AuditKind
  actor: string // "Wanjiru", "Crew D", "Achieng"
  detail?: string // e.g. "138 m"
}

export interface AdminTicketDetail {
  id: string
  reference: string
  status: TicketStatus
  crewLabel: string | null
  requestedByName?: string
  distanceMeters?: number
  beforePhotoUrl: string
  beforeAt: string
  afterPhotoUrl: string | null
  afterAt: string | null
  audit: TicketAuditEntry[]
}