import type { PlannedRoute, LatLng } from './route';

export interface RouteAuditFilter {
  vehicleId?: string;
  zoneId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface RouteAudit {
  id: string;
  vehicleId: string;
  registrationNumber: string;
  zoneId: string;
  zoneName: string;
  shiftId?: string;
  shiftEnd: string;
  plannedRoute?: PlannedRoute;
  actualPath?: LatLng[];
  plannedDistanceMeters: number;
  actualDistanceMeters: number;
  distanceVarianceMeters: number;
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  durationVarianceSeconds: number;
  status?: 'pass' | 'warning' | 'deviation';
}

