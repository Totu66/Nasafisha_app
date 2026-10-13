import { http } from './http'
import type { ApiSuccess } from '@/types/api'
import type { AuthUser } from '@/types/user'

export interface AdminLoginPayload {
  email: string
  password: string
}

export interface LoginResult {
  token: string
  user: AuthUser
}

// FE-029. Endpoint and shape to be confirmed with Sylvia (BE-035).
export async function adminLogin(payload: AdminLoginPayload): Promise<LoginResult> {
  const { data } = await http.post<ApiSuccess<LoginResult>>('/auth/admin/login', payload)
  return data.data
}
