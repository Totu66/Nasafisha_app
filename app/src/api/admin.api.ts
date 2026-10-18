import http from './http'
import type { ApiSuccess } from '@/types/api'
import type { AdminTicketDetail, AdminTicketRow } from '@/types/ticketAdmin'
import type { Account, NewAccountPayload } from '@/types/account'
import type { Role } from '@/config/roles'

// --- Tickets (wireframe screens 6 and 7) ---
export async function fetchAdminTickets(): Promise<AdminTicketRow[]> {
  const { data } = await http.get<ApiSuccess<AdminTicketRow[]>>('/admin/tickets')
  return data.data
}

export async function fetchAdminTicketDetail(id: string): Promise<AdminTicketDetail> {
  const { data } = await http.get<ApiSuccess<AdminTicketDetail>>(`/admin/tickets/${id}`)
  return data.data
}

// --- Accounts (wireframe screen 10) ---
export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await http.get<ApiSuccess<Account[]>>('/admin/accounts')
  return data.data
}

export async function createAccount(payload: NewAccountPayload): Promise<Account> {
  const { data } = await http.post<ApiSuccess<Account>>('/admin/accounts', payload)
  return data.data
}

// BR-003.2: takes effect on the user's next sign-in.
export async function updateAccountRole(id: string, role: Role): Promise<void> {
  await http.patch(`/admin/accounts/${id}`, { role })
}

export async function setAccountActive(id: string, active: boolean): Promise<void> {
  await http.patch(`/admin/accounts/${id}`, { active })
}
