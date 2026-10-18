import http from './http'
import type { ApiSuccess } from '@/types/api'
import type { MyTicketsResponse, Ticket } from '@/types/ticket'
import type { ClosureApproval } from '@/types/closureApproval'


// Tickets assigned to the signed-in crew member, plus their vehicle.
export async function fetchMyTickets(): Promise<MyTicketsResponse> {
  const { data } = await http.get<ApiSuccess<MyTicketsResponse>>('/tickets/mine')
  return data.data
}

export async function fetchTicketById(id: string): Promise<Ticket> {
  const { data } = await http.get<ApiSuccess<Ticket>>(`/tickets/${id}`)
  return data.data
}

export interface ApprovalRequest {
  distanceMeters: number
  afterLat: number
  afterLng: number
  capturedAt: string
}

// FE-027: crew asks a supervisor to approve a closure that is out of range.
export async function requestClosureApproval(ticketId: string, payload: ApprovalRequest): Promise<void> {
  await http.post(`/tickets/${ticketId}/closure-approval-requests`, payload)
}




export async function fetchPendingClosureApprovals(): Promise<ClosureApproval[]> {
  const { data } = await http.get<ApiSuccess<ClosureApproval[]>>('/closure-approvals', {
    params: { status: 'pending' },
  })
  return data.data
}

export async function fetchClosureApproval(id: string): Promise<ClosureApproval> {
  const { data } = await http.get<ApiSuccess<ClosureApproval>>(`/closure-approvals/${id}`)
  return data.data
}

// The server records the supervisor's name as an audit event (BR-013.2).
export async function approveClosure(id: string): Promise<void> {
  await http.post(`/closure-approvals/${id}/approve`)
}

export async function sendBackClosure(id: string): Promise<void> {
  await http.post(`/closure-approvals/${id}/send-back`)
}

/** Ticket row served by the mock API (json-server /tickets). */
export interface TicketListItem {
  id: number
  name: string
  zone: string
  status: string
  due: string
}

// Plain list used by the crew My Tickets screen; the server may be down,
// in which case the caller falls back to its sample rows.
export async function list(): Promise<TicketListItem[]> {
  const { data } = await http.get<TicketListItem[]>('/tickets')
  return data
}

const ticketsApi = {
  list,
  fetchMyTickets,
  fetchTicketById,
  requestClosureApproval,
  fetchPendingClosureApprovals,
  fetchClosureApproval,
  approveClosure,
  sendBackClosure,
}

export default ticketsApi
