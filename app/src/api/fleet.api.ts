<<<<<<< HEAD
import { http } from './http'
import type { ApiSuccess } from '@/types/api'
import type { DeviationAlert } from '@/types/deviationAlert'

export async function fetchOpenDeviationAlerts(): Promise<DeviationAlert[]> {
  const { data } = await http.get<ApiSuccess<DeviationAlert[]>>('/deviation-alerts', {
    params: { status: 'open' },
  })
  return data.data
}

// AC-022.2: a supervisor marks the stop as authorised. The server keeps the audit entry.
export async function authoriseDeviation(alertId: string): Promise<void> {
  await http.post(`/deviation-alerts/${alertId}/authorise`)
}
=======
export const fleetApi = {};
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
