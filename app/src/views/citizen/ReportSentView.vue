<script setup lang="ts">
// FE-022 (assumed): "Report sent" confirmation shown right after a citizen submits (PRD UJ-001 step 2).
// Must never leave the resident wondering whether it was received: it shows the reference (FR-010.4),
// the current status, and what happens next (FR-013.3). Works when the report was saved offline (no reference yet).
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ReportReferenceCard from '../../components/reports/ReportReferenceCard.vue'
import { useCitizenConfirmI18n } from '../../composables/useCitizenConfirmI18n'
import { fetchReportByReference, myReportsRoute, newReportRoute, trackReportRoute } from '../../composables/citizenAdapters'
import type { CitizenReport } from '../../helpers/reportStatus'

const route = useRoute()
const { t } = useCitizenConfirmI18n()

// Route: /…/reports/sent/:reference?   (?queued=1 when the report was saved offline)  [CHECK against your router]
const reference = computed(() => (typeof route.params.reference === 'string' ? route.params.reference : ''))
const queued = computed(() => route.query.queued === '1' || reference.value === '')
const report = ref<CitizenReport | null>(null)

// Optional extras (clustering note). The confirmation itself never depends on this call succeeding.
onMounted(async () => {
  if (queued.value) return
  try {
    report.value = await fetchReportByReference(reference.value)
  } catch {
    report.value = null
  }
})

const stateLabel = computed(() => t(`state.${report.value?.state ?? 'SUBMITTED'}`))
</script>

<template>
  <section data-testid="report-sent" class="mx-auto max-w-md space-y-4 p-4">
    <div class="text-center">
      <svg class="mx-auto h-14 w-14 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M7 12.5l3.2 3.2L17 9" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h1 class="mt-2 text-xl font-bold">{{ queued ? t('sent.queuedTitle') : t('sent.title') }}</h1>
    </div>

    <p v-if="queued" role="status" class="rounded-lg bg-amber-50 p-3 text-amber-900">{{ t('sent.queued') }}</p>
    <template v-else>
      <ReportReferenceCard :reference="reference" />
      <p class="text-center font-semibold">{{ t('sent.status', { state: stateLabel }) }}</p>
      <p v-if="report?.clusteredWithExisting" class="rounded-lg bg-blue-50 p-3 text-blue-900">{{ t('sent.clustered') }}</p>
    </template>

    <p class="text-center text-gray-700">{{ t('sent.whatNext') }}</p>

    <div class="flex flex-col gap-2">
      <router-link
        v-if="!queued"
        :to="trackReportRoute(reference)"
        class="inline-flex min-h-12 items-center justify-center rounded-lg bg-green-700 px-4 font-semibold text-white"
      >
        {{ t('sent.track') }}
      </router-link>
      <router-link
        :to="queued ? myReportsRoute() : newReportRoute()"
        class="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-green-700 px-4 font-semibold text-green-700"
      >
        {{ queued ? t('sent.myReports') : t('sent.another') }}
      </router-link>
    </div>
  </section>
</template>