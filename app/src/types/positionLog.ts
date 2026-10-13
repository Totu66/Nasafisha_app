export interface PositionLogEntry {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  timestamp: string;
}

export interface ShiftPositionHistory {
  vehicleId: string;
  shiftId: string;
  shiftStart: string;
  shiftEnd: string;
  entries: PositionLogEntry[];
}

export interface PositionLog extends ShiftPositionHistory {}

