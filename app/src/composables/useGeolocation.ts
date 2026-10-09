<<<<<<< HEAD
import { onBeforeUnmount, ref } from 'vue'
import type { Coordinates } from '@/helpers/geo'

export type GeoError = 'denied' | 'unavailable' | null

// Live position for "distance from the spot" guidance.
export function useGeolocation() {
  const position = ref<Coordinates | null>(null)
  const error = ref<GeoError>(null)
  let watchId: number | null = null

  function start() {
    if (!('geolocation' in navigator)) {
      error.value = 'unavailable'
      return
    }
    watchId = navigator.geolocation.watchPosition(
      (p) => {
        error.value = null
        position.value = { lat: p.coords.latitude, lng: p.coords.longitude }
      },
      (e) => {
        error.value = e.code === e.PERMISSION_DENIED ? 'denied' : 'unavailable'
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    )
  }

  function stop() {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId)
    watchId = null
  }

  onBeforeUnmount(stop)

  return { position, error, start, stop }
}
=======
export function useGeolocation() { return {}; }
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
