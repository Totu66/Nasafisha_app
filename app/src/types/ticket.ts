<<<<<<< HEAD
import type { Coordinates } from '@/helpers/geo'

export type TicketStatus = 'assigned' | 'in_progress' | 'closing' | 'resolved' | 'blocked'
export type IssueType = 'missed_collection' | 'illegal_dumping'

export interface Ticket {
  id: string
  reference: string // e.g. NSF-260915-0042
  issueType: IssueType
  zone: string // e.g. "Section 58"
  locationNote?: string // e.g. "behind the market gate"
  residentNote?: string
  status: TicketStatus
  location: Coordinates // where the resident reported from
  beforePhotoUrl: string
  reportedAt: string // ISO 8601
}

export interface CrewVehicle {
  plate: string // e.g. KDG 214X
  online: boolean
}

export interface MyTicketsResponse {
  vehicle: CrewVehicle | null
  tickets: Ticket[]
}
=======
export interface Ticket {}
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
