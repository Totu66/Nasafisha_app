import { http } from './http'
import type { ApiSuccess } from '@/types/api'
import type { CrewAccount, CrewStatus } from '@/types/crew'

export async function fetchCrewStatus(): Promise<CrewStatus[]> {
  const { data } = await http.get<ApiSuccess<CrewStatus[]>>('/supervisor/crews')
  return data.data
}

export async function fetchCrewAccounts(): Promise<CrewAccount[]> {
  const { data } = await http.get<ApiSuccess<CrewAccount[]>>('/supervisor/crew-accounts')
  return data.data
}

// BR-002.2: PIN is reset by a supervisor, never self-service.
export async function resetCrewPin(accountId: string, pin: string): Promise<void> {
  await http.post(`/supervisor/crew-accounts/${accountId}/pin`, { pin })
}