import { computed, ref, type Ref } from 'vue'
import { DEFAULT_CLOSURE_RADIUS_M, evaluateClosure, type LatLng, type Position } from '../helpers/closure'
import { compressPhoto, getGpsFix, type GpsFix, type GpsState } from './fieldAdapters'

export interface CaptureDeps {
  compress: (file: File) => Promise<string>
  getFix: () => Promise<GpsFix>
}

/**
 * FE-006: takes the after-photo + GPS fix together and gives the closure verdict.
 * `deps` lets tests (or your own helpers) replace photo compression / GPS.
 */
export function useClosureGate(
  ticket: Ref<LatLng | null | undefined>,
  options: { radius?: number; deps?: CaptureDeps } = {},
) {
  const radius = options.radius ?? DEFAULT_CLOSURE_RADIUS_M
  const deps: CaptureDeps = options.deps ?? { compress: (f) => compressPhoto(f), getFix: () => getGpsFix() }

  const photo = ref<string | null>(null)
  const capturedAt = ref<number | null>(null)
  const position = ref<Position | null>(null)
  const gpsState = ref<GpsState>('idle')
  const captureFailed = ref(false)

  const check = computed(() =>
    evaluateClosure({ ticket: ticket.value, photo: photo.value, position: position.value, radius }),
  )
  /** The Close button needs a photo AND a location. "Too far" shows a notice instead of disabling the button. */
  const canSubmit = computed(() => Boolean(photo.value && position.value))

  /** Start GPS at the same moment the photo is processed, so the fix matches when the photo was taken. */
  async function capture(file: File): Promise<void> {
    captureFailed.value = false
    photo.value = null
    position.value = null
    gpsState.value = 'getting'
    const fixPromise = deps.getFix()
    try {
      photo.value = await deps.compress(file)
      capturedAt.value = Date.now()
    } catch {
      gpsState.value = 'idle'
      captureFailed.value = true
      return
    }
    const fix = await fixPromise
    if ('position' in fix) {
      position.value = fix.position
      gpsState.value = 'ok'
    } else {
      gpsState.value = fix.error === 'DENIED' ? 'denied' : 'failed'
    }
  }

  function reset(): void {
    photo.value = null
    capturedAt.value = null
    position.value = null
    gpsState.value = 'idle'
    captureFailed.value = false
  }

  return { photo, capturedAt, position, gpsState, captureFailed, check, canSubmit, capture, reset, radius }
}
