export type DeviationAlertStatus = 'open' | 'cleared' | 'authorised'

export interface DeviationAlert {
  id: string
  crewLabel: string
  vehiclePlate: string
  crewPhone?: string
  distanceMeters: number // how far off the route
  minutesOff: number
  thresholdMeters: number // default 500 (FR-022)
  thresholdMinutes: number // default 10
  status: DeviationAlertStatus
}