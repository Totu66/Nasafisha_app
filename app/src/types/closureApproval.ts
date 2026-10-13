export interface ClosureApproval {
  id: string
  ticketId: string
  reference: string
  crewLabel: string
  requestedByName: string
  distanceMeters: number
  limitMeters: number
  beforePhotoUrl: string
  beforeAt: string // ISO
  afterPhotoUrl: string
  afterAt: string // ISO
}