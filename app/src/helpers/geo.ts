export interface Coordinates {
  lat: number
  lng: number
}

const EARTH_RADIUS_M = 6_371_000
const toRad = (deg: number) => (deg * Math.PI) / 180

// Haversine distance between two points, in whole metres.
export function distanceMeters(a: Coordinates, b: Coordinates): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h)))
}

// Link that opens turn-by-turn directions in the Google Maps app or site.
export function mapsDirectionsUrl(to: Coordinates): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${to.lat},${to.lng}`
}
