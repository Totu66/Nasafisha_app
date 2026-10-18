<script setup lang="ts">
// FE-022: "Report sent" confirmation shown right after a citizen submits (PRD UJ-001 step 2).
// Shows the reference (FR-010.4), current status, and what happens next (FR-013.3).
// Works when the report was saved offline (no reference yet).
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCitizenConfirmI18n } from '../../composables/useCitizenConfirmI18n'
import { fetchReportByReference, myReportsRoute, trackReportRoute } from '../../composables/citizenAdapters'
import ReportStatusList from '../../components/reports/ReportStatusList.vue'
import type { ReportStatusStep } from '../../types/report'
import type { CitizenReport } from '../../helpers/reportStatus'

const route = useRoute()
const { t } = useCitizenConfirmI18n()

const reference = computed(() => (typeof route.params.reference === 'string' ? route.params.reference : ''))
const queued = computed(() => route.query.queued === '1' || reference.value === '')
const report = ref<CitizenReport | null>(null)
const copied = ref(false)

const nextSteps = computed<ReportStatusStep[]>(() => [
  { label: 'Report received', done: true, time: reference.value || 'just now' },
  { label: 'Verified by the county', done: false },
  { label: 'Collection crew assigned', done: false },
  { label: 'Pickup in progress', done: false },
  { label: 'Resolved', done: false },
])

onMounted(async () => {
  if (queued.value) return
  try {
    report.value = await fetchReportByReference(reference.value)
  } catch {
    report.value = null
  }
})

async function copyReference() {
  try {
    await navigator.clipboard.writeText(reference.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <section data-testid="report-sent" class="mx-auto max-w-md rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white px-7 py-8 text-center shadow-sm">
    <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ns-status-resolved-bg,#DCF2E6)] text-[var(--ns-status-resolved-fg,#14563F)]">
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>

    <h1 class="mt-4 text-xl font-bold tracking-tight text-[var(--ns-ash-900,#17211F)]">
      {{ queued ? t('sent.queuedTitle') : t('sent.title') }}
    </h1>

    <template v-if="!queued">
      <p class="mt-5 text-xs font-medium uppercase tracking-wide text-[var(--ns-ash-600,#4F5B57)]">Your reference</p>
      <p class="mt-1 flex items-center justify-center gap-2">
        <span class="font-mono text-base font-bold text-[var(--ns-leaf-700,#15803D)]">{{ reference }}</span>
        <button
          type="button"
          class="text-xs font-semibold text-[var(--ns-leaf-700,#15803D)] underline underline-offset-2"
          @click="copyReference"
        >
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </p>
    </template>

    <p v-if="queued" role="status" class="mt-4 rounded-xl bg-[var(--ns-status-progress-bg,#FFF1CC)] px-4 py-3 text-sm text-[var(--ns-status-progress-fg,#7A4B00)]">
      {{ t('sent.queued') }}
    </p>

    <p v-if="report?.clusteredWithExisting" class="mt-4 rounded-xl bg-[var(--ns-status-received-bg,#E3EEFB)] px-4 py-3 text-sm text-[var(--ns-status-received-fg,#1E4E8C)]">
      {{ t('sent.clustered') }}
    </p>

    <p class="mt-4 text-sm text-[var(--ns-ash-600,#4F5B57)]">
      We'll send an SMS each time the status changes.
    </p>

    <div v-if="!queued" class="mt-6 border-t border-[var(--ns-ash-100,#E6EBE9)] pt-5 text-left">
      <h2 class="text-sm font-bold text-[var(--ns-ash-900,#17211F)]">What happens next</h2>
      <div class="mt-3">
        <ReportStatusList :history="nextSteps" />
      </div>
    </div>

    <router-link
      v-if="!queued"
      :to="trackReportRoute(reference)"
      class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)]"
    >
      {{ t('sent.track') }}
    </router-link>

    <router-link
      :to="myReportsRoute()"
      class="mt-4 inline-block text-sm font-medium text-[var(--ns-ash-700,#3B4743)] underline underline-offset-2 hover:text-[var(--ns-ash-900,#17211F)]"
    >
      Back to home
    </router-link>
  </section>
</template>
