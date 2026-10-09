import type { Role } from '@/config/roles'

export type AccountStatus = 'active' | 'locked' | 'inactive'

export interface Account {
  id: string
  name: string
  email: string
  role: Role // exactly one role (BR-003.1)
  employeeId?: string // field accounts only
  zone: string // "All zones" or specific zones
  status: AccountStatus
}

export interface NewAccountPayload {
  name: string
  email: string
  role: Role
  zone: string
}