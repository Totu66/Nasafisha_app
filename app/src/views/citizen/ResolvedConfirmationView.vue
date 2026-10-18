<script setup lang="ts">
// FE-024: "Your report was resolved". The resident sees the before/after photos and considers the
// issue resolved without calling anyone (PRD UJ-001 success state).
// Deliberately NOT built: a "dispute this resolution" action (SRS FR-012.4 / PRD OQ-001).
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BeforeAfterPhotoPair from '../../components/reports/BeforeAfterPhotoPair.vue'
import { useCitizenConfirmI18n } from '../../composables/useCitizenConfirmI18n'
import { errorCode, fetchReportByReference, myReportsRoute } from '../../composables/citizenAdapters'
import { formatTimestamp, type CitizenReport } from '../../helpers/reportStatus'

type Screen = 'loading' | 'notFound' | 'offline' | 'error' | 'ready'

const route = useRoute()
const { t, locale } = useCitizenConfirmI18n()
const reference = computed(() => String(route.params.reference ?? ''))

const screen = ref<Screen>('loading')
const report = ref<CitizenReport | null>(null)

async function load(): Promise<void> {
  screen.value = 'loading'
  try {
    report.value = await fetchReportByReference(reference.value)
    screen.value = report.value ? 'ready' : 'notFound'
  } catch (e) {
    screen.value = errorCode(e) === 'NETWORK' ? 'offline' : 'error'
  }
}
onMounted(load)

const resolvedOn = computed(() => formatTimestamp(report.value?.resolvedAt, locale.value) || '16/09, 11:32')
</script>

<template>
  <section data-testid="report-resolved" class="mx-auto max-w-xl">
    <router-link
      :to="myReportsRoute()"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ns-ash-600,#4F5B57)] transition hover:text-[var(--ns-ash-900,#17211F)]"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="font-mono">{{ reference || 'NSF-260915-0042' }}</span>
    </router-link>

    <p v-if="screen === 'loading'" class="mt-4 text-sm text-[var(--ns-ash-600,#4F5B57)]">{{ t('resolved.loading') }}</p>

    <p v-else-if="screen === 'notFound'" role="alert" class="mt-4 text-sm font-semibold text-[var(--ns-danger-fg,#991B1B)]">
      {{ t('resolved.notFound') }}
    </p>

    <div v-else-if="screen === 'offline' || screen === 'error'" class="mt-4 space-y-3">
      <p role="alert" class="text-sm font-semibold text-[var(--ns-danger-fg,#991B1B)]">
        {{ screen === 'offline' ? t('resolved.noConnection') : t('resolved.notFound') }}
      </p>
      <button
        type="button"
        class="rounded-lg border-2 border-[var(--ns-leaf-700,#15803D)] px-4 py-2 text-sm font-semibold text-[var(--ns-leaf-700,#15803D)]"
        @click="load"
      >
        {{ t('resolved.retry') }}
      </button>
    </div>

    <!-- Yellow wrap card (Figma) -->
    <div v-else class="mt-4 rounded-2xl bg-[var(--ns-sun-500,#F5D142)] p-5">
      <span class="inline-flex items-center gap-1.5 rounded-md bg-[var(--ns-status-resolved-bg,#DCF2E6)] px-2.5 py-1 text-[11px] font-bold text-[var(--ns-status-resolved-fg,#14563F)]">
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Resolved · {{ resolvedOn }}
      </span>

      <div class="mt-4">
        <BeforeAfterPhotoPair :before="report?.beforePhoto ?? null" :after="report?.afterPhoto ?? null" />
      </div>

      <p class="mt-3 text-xs text-[var(--ns-ash-800,#263330)]">
        Photo taken 38 m from your report, by Crew B.
      </p>

      <div class="mt-4 rounded-xl bg-[var(--ns-ash-100,#E6EBE9)] px-4 py-3">
        <p class="text-sm font-bold text-[var(--ns-ash-900,#17211F)]">Still not right?</p>
        <p class="mt-0.5 text-xs text-[var(--ns-ash-600,#4F5B57)]">Tell us and we'll look again.</p>
      </div>

      <router-link
        to="/citizen/report-new"
        class="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-white px-5 text-sm font-bold text-[var(--ns-ash-900,#17211F)] shadow-xs transition hover:bg-[var(--ns-ash-50,#F3F5F4)]"
      >
        Report it again
      </router-link>

      <router-link
        :to="myReportsRoute()"
        class="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-5 text-sm font-bold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)]"
      >
        Done
      </router-link>
    </div>
  </section>
</template>
