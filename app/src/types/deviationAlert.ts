import type { LiveVehicle } from './vehicle';

export type DeviationStatus = 'active' | 'authorised' | 'cleared';
export type DeviationIssueType = 'missed_collection' | 'illegal_dumping';

export interface DeviationLocation {
  lat: number;
  lng: number;
}

export interface DeviationAlert {
  id: string;
  vehicleId: string;
  registrationNumber: string;
  zoneId: string;
  zoneName?: string;
  status: DeviationStatus;
  raisedAt: string;
  clearedAt?: string | null;
  authorisedAt?: string | null;
  authorisedBy?: string | null;
  maxDeviationMeters: number;
  durationSeconds: number;
  thresholdMeters: number;
  thresholdMinutes: number;
  location: DeviationLocation;
  title?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high';
  issueType?: DeviationIssueType;
}

export interface DeviationAuditEvent {
  id: string;
  alertId: string;
  type: 'raised' | 'cleared' | 'authorised';
  at: string;
  actorId?: string;
  note?: string;
}

export interface FleetSnapshot {
  timestamp: string;
  liveVehicles: LiveVehicle[];
  deviationAlerts: DeviationAlert[];
}

export interface AcknowledgeStalePayload {
  vehicleId: string;
  acknowledgedBy: string;
}

export interface AuthoriseDeviationPayload {
  alertId: string;
  authorisedBy: string;
  note?: string;
}

export type { VehicleServiceStatus, Vehicle, LiveVehicle, VehicleDarkAlert } from './vehicle';

