// FE-007 / FR-023: derive "pending sync" indicators from the offline queue's items.
// Deliberately structural so it works with whatever shape offline/queue.ts stores.

export interface QueueItemLike {
  id: string
  type: string
  status: string
  payload?: Record<string, unknown>
}

export interface PendingSummary {
  pending: number
  attention: number
  byType: Record<string, number>
  hasWork: boolean
}

/** Statuses meaning "still going to send". Adjust to the statuses used by offline/queue.ts. */
export const PENDING_STATUSES = ['pending', 'queued', 'syncing']
/** Statuses meaning "needs a human": conflict, rejected, failed. */
export const ATTENTION_STATUSES = ['conflict', 'rejected', 'failed']

export function summarizeQueue(items: readonly QueueItemLike[]): PendingSummary {
  const summary: PendingSummary = { pending: 0, attention: 0, byType: {}, hasWork: false }
  for (const item of items) {
    if (PENDING_STATUSES.includes(item.status)) {
      summary.pending += 1
      summary.byType[item.type] = (summary.byType[item.type] ?? 0) + 1
    } else if (ATTENTION_STATUSES.includes(item.status)) {
      summary.attention += 1
    }
  }
  summary.hasWork = summary.pending + summary.attention > 0
  return summary
}

/** True if a still-pending queue item refers to this ticket/report (for per-row badges). */
export function isEntityPending(
  items: readonly QueueItemLike[],
  key: 'ticketId' | 'reportId',
  id: string,
): boolean {
  return items.some((i) => PENDING_STATUSES.includes(i.status) && i.payload?.[key] === id)
}

export type QueueItemKind = 'closure' | 'report' | 'other'

/** Which label to show for a queue item. Matches loosely so it works with the queue's own type names. */
export function queueItemKind(type: string): QueueItemKind {
  const s = type.toLowerCase()
  if (s.includes('report')) return 'report'
  if (s.includes('ticket') || s.includes('clos')) return 'closure'
  return 'other'
}

export type QueueStatusKind = 'waiting' | 'conflict' | 'rejected' | 'unknown'

export function queueStatusKind(status: string): QueueStatusKind {
  if (PENDING_STATUSES.includes(status)) return 'waiting'
  if (status === 'conflict') return 'conflict'
  if (ATTENTION_STATUSES.includes(status)) return 'rejected'
  return 'unknown'
}
