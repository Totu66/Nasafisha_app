<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import ClosureEvidencePair from '@/components/tickets/ClosureEvidencePair.vue'
import ClosureMismatchAlert from '@/components/tickets/ClosureMismatchAlert.vue'
import { requestClosureApproval } from '@/api/tickets.api'
import { useClosureCheck } from '@/composables/useClosureCheck'
import type { Coordinates } from '@/helpers/geo'
import { useTicketsStore } from '@/store/tickets.store'

interface AfterPhoto {
  url: string
  takenAt: string // ISO
  coords: Coordinates
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useTicketsStore()
const { current: ticket } = storeToRefs(store)

// KELVIN (FE-006): his camera component calls onPhotoCaptured(...) when a photo is taken.
const afterPhoto = ref<AfterPhoto | null>(null)
function onPhotoCaptured(photo: AfterPhoto) {
  afterPhoto.value = photo
}

// FE-027: location check
const reportLocation = computed(() => ticket.value?.location ?? null)
const photoLocation = computed(() => afterPhoto.value?.coords ?? null)
const { distance, hasPhoto, isWithinRadius, limit } = useClosureCheck(reportLocation, photoLocation)

const isRequesting = ref(false)
const approvalSent = ref(false)
const requestFailed = ref(false)

const canClose = computed(() => hasPhoto.value && isWithinRadius.value) // AC-013.2: stays disabled otherwise

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function retake() {
  afterPhoto.value = null
  approvalSent.value = false
}

async function askSupervisor() {
  if (!ticket.value || !afterPhoto.value || distance.value === null) return
  isRequesting.value = true
  requestFailed.value = false
  try {
    await requestClosureApproval(ticket.value.id, {
      distanceMeters: distance.value,
      afterLat: afterPhoto.value.coords.lat,
      afterLng: afterPhoto.value.coords.lng,
      capturedAt: afterPhoto.value.takenAt,
    })
    approvalSent.value = true
  } catch {
    requestFailed.value = true
  } finally {
    isRequesting.value = false
  }
}

function closeTicket() {
  // KELVIN (FE-006/BE-012): submit the closure (queue it when offline), then leave the screen.
  router.push({ name: 'field-tickets' })
}

onMounted(() => {
  if (!ticket.value || ticket.value.id !== String(route.params.id)) store.loadOne(String(route.params.id))
})
</script>

<template>
  <section v-if="ticket">
    <h1 class="text-2xl font-bold text-green-900">{{ t('field.closure.title') }}</h1>

    <!-- KELVIN: put the camera capture component here and wire @captured="onPhotoCaptured" -->

    <p v-if="hasPhoto && isWithinRadius" class="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-900">
      ✓ {{ t('field.closure.insideLimit', { meters: distance }) }}
    </p>

    <div v-if="hasPhoto && !isWithinRadius && distance !== null" class="mt-3">
      <ClosureMismatchAlert :distance-meters="distance" :limit-meters="limit" />
    </div>

    <div class="mt-4">
      <ClosureEvidencePair
        :before-url="ticket.beforePhotoUrl"
        :before-time="formatTime(ticket.reportedAt)"
        :after-url="afterPhoto?.url ?? null"
        :after-time="afterPhoto ? formatTime(afterPhoto.takenAt) : null"
      />
    </div>

    <p v-if="approvalSent" role="status" class="mt-3 rounded bg-blue-50 p-2 text-sm text-blue-900">
      {{ t('field.closure.approvalSent') }}
    </p>
    <p v-if="requestFailed" role="alert" class="mt-3 rounded bg-red-50 p-2 text-sm text-red-800">
      {{ t('field.closure.approvalFailed') }}
    </p>

    <div class="mt-4 flex flex-wrap gap-2">
      <button type="button" class="rounded border border-green-800 px-3 py-2 text-sm text-green-800" @click="retake">
        {{ t('field.closure.retake') }}
      </button>
      <button
        v-if="hasPhoto && !isWithinRadius"
        type="button"
        :disabled="isRequesting || approvalSent"
        class="rounded border border-green-800 px-3 py-2 text-sm text-green-800 disabled:opacity-50"
        @click="askSupervisor"
      >
        {{ t('field.closure.askSupervisor') }}
      </button>
      <button
        type="button"
        :disabled="!canClose"
        class="rounded bg-green-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
        @click="closeTicket"
      >
        {{ t('field.closure.closeTicket') }}
      </button>
    </div>
  </section>
</template>