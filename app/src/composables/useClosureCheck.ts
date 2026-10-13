import { computed, type Ref } from 'vue'
import { CLOSURE_RADIUS_METERS } from '@/config/constants'
import { distanceMeters, type Coordinates } from '@/helpers/geo'

// Decides whether an after-photo is close enough to the report (AC-013.2).
// The server enforces the same rule; this only drives the screen.
export function useClosureCheck(
  reportLocation: Ref<Coordinates | null>,
  photoLocation: Ref<Coordinates | null>,
) {
  const distance = computed(() =>
    reportLocation.value && photoLocation.value
      ? distanceMeters(reportLocation.value, photoLocation.value)
      : null,
  )
  const hasPhoto = computed(() => photoLocation.value !== null)
  const isWithinRadius = computed(() => distance.value !== null && distance.value <= CLOSURE_RADIUS_METERS)

  return { distance, hasPhoto, isWithinRadius, limit: CLOSURE_RADIUS_METERS }
}