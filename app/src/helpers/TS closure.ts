// FE-006 / FR-013: photo-gated ticket closure rule. Pure functions, no framework imports.
// If helpers/geo.ts already has a haversine function, re-export it here instead of duplicating.

export interface LatLng {
  lat: number
  lng: number
}

export interface Position extends LatLng {
  accuracy?: number
}

export type ClosureCheck =
  | { ok: true; distance: number }
  | { ok: false; code: 'NO_TICKET' | 'NO_PHOTO' | 'NO_LOCATION' }
  | { ok: false; code: 'TOO_FAR'; distance: number }

export const DEFAULT_CLOSURE_RADIUS_M = 100

const EARTH_RADIUS_M = 6371008.8
const rad = (deg: number): number => (deg * Math.PI) / 180

export function haversineMeters(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(s)))
}

export function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`
}

/** The UI uses this for instant feedback; the API remains the authority (it must re-check). */
export function evaluateClosure(input: {
  ticket: LatLng | null | undefined
  photo: string | Blob | null | undefined
  position: Position | null | undefined
  radius?: number
}): ClosureCheck {
  const { ticket, photo, position, radius = DEFAULT_CLOSURE_RADIUS_M } = input
  if (!ticket) return { ok: false, code: 'NO_TICKET' }
  if (!photo) return { ok: false, code: 'NO_PHOTO' }
  if (!position || !Number.isFinite(position.lat) || !Number.isFinite(position.lng)) {
    return { ok: false, code: 'NO_LOCATION' }
  }
  const distance = haversineMeters(position, ticket)
  return distance > radius ? { ok: false, code: 'TOO_FAR', distance } : { ok: true, distance }
}
