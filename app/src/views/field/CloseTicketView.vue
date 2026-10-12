<script setup lang="ts">
// FE-006 (FR-013): close a ticket with a mandatory after-photo + automatic GPS.
//  • Close stays disabled until a photo AND a location exist.
//  • Outside the closure radius (100 m) the ticket cannot be closed: a "too far" notice is shown.
//  • No connection: the closure is saved to the offline queue and syncs later (FR-023).
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AfterPhotoCapture from '../../components/tickets/AfterPhotoCapture.vue'
import TooFarNotice from '../../components/tickets/TooFarNotice.vue'
import { useClosureGate } from '../../composables/useClosureGate'
import { useFieldOpsI18n } from '../../composables/useFieldOpsI18n'
import {
  enqueueClosure,
  errorCode,
  fetchTicket,
  homeRouteForRole,
  sendClosure,
  type FieldTicket,
} from '../../composables/fieldAdapters'
import { formatDistance } from '../../helpers/closure'

type Screen = 'loading' | 'form' | 'tooFar' | 'done' | 'blocked' | 'notFound'

const route = useRoute()
const { t } = useFieldOpsI18n()
// CHECK: the route param name in router/routes/field.routes.ts (ticketId or id).
const ticketId = String(route.params.ticketId ?? route.params.id)

const ticket = ref<FieldTicket | null>(null)
const screen = ref<Screen>('loading')
const busy = ref(false)
const error = ref<string | null>(null)
const message = ref('')

// Top-level refs so the template unwraps them.
const { photo, capturedAt, position, gpsState, captureFailed, check, canSubmit, capture, reset, radius } = useClosureGate(ticket)

onMounted(async () => {
  try {
    ticket.value = await fetchTicket(ticketId)
  } catch {
    ticket.value = null
  }
  screen.value = !ticket.value ? 'notFound' : ticket.value.open ? 'form' : 'blocked'
})

const distanceLabel = computed(() => {
  const c = check.value
  return !c.ok && c.code === 'TOO_FAR' ? formatDistance(c.distance) : ''
})

function retake(): void {
  reset()
  error.value = null
  screen.value = 'form'
}

function finish(text: string): void {
  message.value = text
  screen.value = 'done'
}

async function submit(): Promise<void> {
  error.value = null
  const c = check.value
  if (!c.ok) {
    if (c.code === 'TOO_FAR') {
      screen.value = 'tooFar'
      return
    }
    error.value = c.code === 'NO_PHOTO' ? t('closure.photoRequired') : t('closure.gpsFailed')
    return
  }
  const payload = {
    ticketId,
    photo: photo.value as string,
    // When the PHOTO was taken, not when it syncs (matters for queued closures).
    capturedAt: capturedAt.value ?? Date.now(),
    position: position.value as NonNullable<typeof position.value>,
  }
  busy.value = true
  try {
    await sendClosure(payload)
    finish(t('closure.success'))
  } catch (e) {
    const code = errorCode(e)
    if (code === 'NETWORK' || !navigator.onLine) {
      await enqueueClosure(payload)
      finish(t('closure.queued'))
    } else if (code === 'CLOSURE_TOO_FAR') {
      screen.value = 'tooFar'
    } else if (code === 'ALREADY_CLOSED') {
      error.value = t('closure.alreadyClosed')
    } else if (code === 'PHOTO_REQUIRED') {
      error.value = t('closure.photoRequired')
    } else if (code === 'LOCATION_REQUIRED') {
      error.value = t('closure.gpsFailed')
    } else {
      error.value = t('closure.error')
    }
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-xl space-y-4 p-4">
    <p v-if="screen === 'loading'" class="text-gray-600">{{ t('closure.loading') }}</p>

    <p v-else-if="screen === 'notFound'" role="alert" class="font-semibold text-red-700">{{ t('closure.notFound') }}</p>

    <p v-else-if="screen === 'blocked'" class="rounded-lg bg-amber-50 p-3 text-amber-800">{{ t('closure.notOpen') }}</p>

    <template v-else-if="screen === 'form'">
      <h1 class="text-xl font-bold">{{ t('closure.title', { id: ticketId }) }}</h1>
      <p class="text-gray-600">{{ t('closure.intro') }}</p>
      <AfterPhotoCapture
        :photo="photo"
        :gps-state="gpsState"
        :accuracy="position?.accuracy"
        :failed="captureFailed"
        :disabled="busy"
        @file="capture"
      />
      <p v-if="error" role="alert" class="font-semibold text-red-700">{{ error }}</p>
      <button
        type="button"
        :disabled="!canSubmit || busy"
        class="min-h-12 w-full rounded-lg bg-green-700 px-4 font-semibold text-white disabled:opacity-50"
        @click="submit"
      >
        {{ busy ? t('closure.submitting') : t('closure.submit') }}
      </button>
    </template>

    <TooFarNotice v-else-if="screen === 'tooFar'" :distance-label="distanceLabel" :radius="radius" @retake="retake" />

    <template v-else>
      <h1 class="text-xl font-bold">{{ message }}</h1>
      <router-link :to="homeRouteForRole('crew')" class="inline-flex min-h-12 items-center rounded-lg bg-green-700 px-4 font-semibold text-white">
        {{ t('closure.back') }}
      </router-link>
    </template>
  </section>
</template>
