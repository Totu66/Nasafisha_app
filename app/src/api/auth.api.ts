<<<<<<< HEAD
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
=======
import httpClient from './http';

export const authApi = {
  async login(payload: { email: string; password: string; role: 'admin' | 'citizen' | 'field'; }) {
    const res = await httpClient.post('/login', payload);
    return res.data;
  },

  async me() {
    const res = await httpClient.get('/me');
    return res.data;
  },
};

export default authApi;
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
