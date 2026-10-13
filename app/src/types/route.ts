export interface LatLng {
  lat: number;
  lng: number;
}

export interface PlannedRoute {
  id: string;
  name: string;
  zoneId: string;
  vehicleId: string;
  path: LatLng[];
  plannedDistanceMeters: number;
  plannedDurationSeconds: number;
}

export interface Route extends PlannedRoute {}

