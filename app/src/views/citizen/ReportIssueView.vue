<!--
  FE-002 — "Report an issue": photo + location + what happened + Send  (SRS FR-010)
  Order of things:
    1. first time ever -> go to the consent screen first (SRS §8.2)
    2. camera opens; the citizen takes the photo
    3. at that moment we read the GPS (the report must be geotagged at capture time)
    4. citizen picks what happened, optionally adds a note
    5. Send -> useOfflineQueue sends it now, or saves it on the phone if offline (FE-003)
    6. go to the "Report sent" screen (Kelvin's FE-022)
  Sending is blocked without a photo AND a location (AC-010.3, BR-010.1).
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CameraCapture from '@/components/camera/CameraCapture.vue'
import IssueTypePicker from '@/components/reports/IssueTypePicker.vue'
import { describeSubmitError } from '@/api/reports.api'
import { useOfflineQueue } from '@/composables/useOfflineQueue'
import { useGeolocation } from '@/composables/useGeolocation'
import { usePermission } from '@/composables/usePermission'
import { useAuthStore } from '@/store/auth.store'
import { NOTE_MAX_LENGTH } from '@/config/constants'
import { formatAccuracy } from '@/helpers/geo'
import { isPhotoTooLarge } from '@/helpers/image'
import type { IssueType } from '@/types/report'

const router = useRouter()
const auth = useAuthStore()
const { submitOrQueue } = useOfflineQueue()
const geo = useGeolocation()
const locationPermission = usePermission('geolocation')

const camera = ref<InstanceType<typeof CameraCapture> | null>(null)
const photo = ref<Blob | null>(null)
const capturedAt = ref('')
const issueType = ref<IssueType>('missed_collection')
const note = ref('')
const sending = ref(false)
const error = ref('')

onMounted(async () => {
  if (!auth.consentAccepted) {
    // first use: show the consent screen, then come back here
    await router.replace({ name: 'citizen-consent', query: { next: '/report' } })
    return
  }
  await findLocation()
})

async function findLocation() {
  await geo.locate()
  await locationPermission.refresh()
}

async function onCaptured(p: { blob: Blob; capturedAt: string }) {
  photo.value = p.blob
  capturedAt.value = p.capturedAt
  error.value = ''
  await findLocation() // a fresh GPS reading at the moment of the photo
}

function onCleared() {
  photo.value = null
}

const canSend = computed(() => photo.value !== null && geo.position.value !== null && !sending.value)

function askToRetake(message: string) {
  error.value = message
  photo.value = null
  camera.value?.retake()
}

async function send() {
  if (!photo.value || !geo.position.value) return
  error.value = ''
  if (isPhotoTooLarge(photo.value)) {
    askToRetake('That photo is too large (the limit is 8 MB). Please retake it.')
    return
  }
  sending.value = true
  try {
    const result = await submitOrQueue({
      clientId: crypto.randomUUID(),
      issueType: issueType.value,
      note: note.value.trim() || undefined,
      photo: photo.value,
      latitude: geo.position.value.latitude,
      longitude: geo.position.value.longitude,
      capturedAt: capturedAt.value,
    })
    await router.replace({
      name: 'citizen-report-sent',
      query: result.queued
        ? { pending: '1' }
        : { ref: result.report.referenceNumber, id: result.report.id },
    })
  } catch (err) {
    const problem = describeSubmitError(err)
    if (problem.retakePhoto) askToRetake(problem.message)
    else error.value = problem.message
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <main v-if="auth.consentAccepted" class="mx-auto max-w-3xl p-4">
    <h1 class="text-2xl font-bold">Report an issue</h1>

    <!-- location status (AC-010.3) -->
    <p
      v-if="geo.status.value === 'ready' && geo.position.value"
      class="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800"
    >
      ✓ Location found · {{ formatAccuracy(geo.position.value.accuracy) }}
    </p>
    <p v-else-if="geo.status.value === 'locating'" class="mt-2 text-xs text-stone-500">Finding your location…</p>

    <div
      v-else-if="geo.status.value === 'denied' || geo.status.value === 'error'"
      class="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"
      role="alert"
    >
      <p class="font-semibold">We need your location to send a report.</p>
      <p class="mt-1">
        <template v-if="geo.status.value === 'denied' && locationPermission.state.value === 'denied'">
          Location is blocked for this site. Turn it on in your browser settings, then tap "Try again".
        </template>
        <template v-else>
          Without it the crew cannot find the exact spot. Turn on location, then tap "Try again".
        </template>
      </p>
      <button type="button" class="mt-2 font-semibold underline" @click="findLocation">Try again</button>
    </div>

    <div class="mt-4 grid gap-6 md:grid-cols-2">
      <CameraCapture ref="camera" @captured="onCaptured" @cleared="onCleared" />

      <form class="space-y-4 rounded-xl border border-stone-200 bg-white p-4" @submit.prevent="send">
        <IssueTypePicker v-model="issueType" />

        <label class="block">
          <span class="text-sm font-semibold">Add a note <span class="font-normal text-stone-500">(optional)</span></span>
          <textarea
            v-model="note"
            :maxlength="NOTE_MAX_LENGTH"
            rows="3"
            placeholder="Behind the market gate…"
            class="mt-1 w-full rounded-lg border border-stone-300 p-2 text-sm focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <span class="block text-right text-xs text-stone-500">{{ note.length }}/{{ NOTE_MAX_LENGTH }}</span>
        </label>

        <p v-if="error" class="text-sm text-red-700" role="alert">{{ error }}</p>

        <button
          type="submit"
          :disabled="!canSend"
          class="rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white disabled:opacity-40"
        >
          {{ sending ? 'Sending…' : 'Send report' }}
        </button>
        <p v-if="!photo" class="text-xs text-stone-500">Take a photo first.</p>
      </form>
    </div>
  </main>
</template>
