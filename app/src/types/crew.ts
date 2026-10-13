export type CrewLiveStatus = 'en_route' | 'off_route' | 'stale' | 'idle'

export interface CrewStatus {
  crewId: string
  crewLabel: string // "Crew B"
  vehiclePlate: string // "KDG 214X"
  status: CrewLiveStatus
  staleMinutes?: number // only when status = 'stale'
  ticketsDone: number
  ticketsTotal: number
}

// A crew member's login account, for PIN resets.
export interface CrewAccount {
  id: string
  name: string
  employeeId: string // "NKR-0417"
  crewLabel: string
  isLocked: boolean
  lockedAt?: string // ISO
}