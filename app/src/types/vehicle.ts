export type VehicleServiceStatus = 'en_route' | 'servicing' | 'idle';

export interface VehicleLocation {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  crewName?: string;
  zoneId: string;
  zoneName: string;
  status: VehicleServiceStatus;
  latitude: number;
  longitude: number;
  speedKmh: number;
  lastReportedAt: string;
  isStale: boolean;
  staleAcknowledgedAt?: string | null;
  staleAcknowledgedBy?: string | null;
  hasActiveDeviation?: boolean;
}

export interface LiveVehicle extends Vehicle {}

export interface VehicleDarkAlert {
  id: string;
  vehicleId: string;
  zoneId: string;
  zoneName: string;
  lastReportedAt: string;
  reason: 'no_signal' | 'device_offline';
  acknowledgedBy?: string | null;
}

