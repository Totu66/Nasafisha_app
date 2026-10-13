import type { Role } from '@/config/roles'

export interface AuthUser {
  id: string
  name: string
  role: Role
  zone?: string
}
