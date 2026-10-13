export type QueuedActionType = 'ticket_closure' | 'report'
export type QueuedActionStatus = 'pending' | 'sent' | 'failed'

export interface QueuedAction {
  id: string
  type: QueuedActionType
  reference: string // ticket or report reference
  summary: string // e.g. "Missed collection · Section 58"
  capturedAt: string // ISO time the photo was taken (BR-023.1)
  status: QueuedActionStatus
}