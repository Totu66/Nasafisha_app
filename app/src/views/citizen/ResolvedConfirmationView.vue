<script setup lang="ts">
// FE-024 (assumed): "Your report was resolved". The resident sees the before/after photos and considers the
// issue resolved without calling anyone (PRD UJ-001 success state). Reached from the resolution notification
// (FR-013.3) or from the report list.
// Deliberately NOT built: a "dispute this resolution" action. The process owner is still open (SRS FR-012.4 / PRD OQ-001).
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BeforeAfterPhotoPair from '../../components/reports/BeforeAfterPhotoPair.vue'
import ReportStatusTimeline from '../../components/reports/ReportStatusTimeline.vue'
import { useCitizenConfirmI18n } from '../../composables/useCitizenConfirmI18n'
import { errorCode, fetchReportByReference, myReportsRoute, trackReportRoute } from '../../composables/citizenAdapters'
import { buildTimeline, formatTimestamp, resolutionView, type CitizenReport } from '../../helpers/reportStatus'

type Screen = 'loading' | 'notFound' | 'offline' | 'error' | 'ready'

const route = useRoute()
const { t, locale } = useCitizenConfirmI18n()
const reference = computed(() => String(route.params.reference ?? '')) // [CHECK] param name in citizen.routes.ts

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

const view = computed(() => (report.value ? resolutionView(report.value) : 'not-resolved'))
const steps = computed(() => (report.value ? buildTimeline(report.value.state, report.value.history) : []))
const resolvedOn = computed(() => formatTimestamp(report.value?.resolvedAt, locale.value))
const stateLabel = computed(() => (report.value ? t(`state.${report.value.state}`) : ''))
</script>

<template>
  <section data-testid="report-resolved" class="mx-auto max-w-2xl space-y-4 p-4">
    <p v-if="screen === 'loading'" class="text-gray-600">{{ t('resolved.loading') }}</p>

    <p v-else-if="screen === 'notFound'" role="alert" class="font-semibold text-red-700">{{ t('resolved.notFound') }}</p>

    <div v-else-if="screen === 'offline' || screen === 'error'" class="space-y-3">
      <p role="alert" class="font-semibold text-red-700">{{ screen === 'offline' ? t('resolved.noConnection') : t('resolved.notFound') }}</p>
      <button type="button" class="min-h-12 rounded-lg border-2 border-green-700 px-4 font-semibold text-green-700" @click="load">
        {{ t('resolved.retry') }}
      </button>
    </div>

    <template v-else-if="report">
      <!-- not resolved yet: show where it is, not an empty "after" frame -->
      <template v-if="view === 'not-resolved'">
        <h1 class="text-xl font-bold">{{ t('resolved.notYet') }}</h1>
        <p>{{ t('resolved.currentStatus', { state: stateLabel }) }}</p>
        <h2 class="font-bold">{{ t('resolved.progress') }}</h2>
        <ReportStatusTimeline :steps="steps" :locale="locale" />
        <router-link
          :to="trackReportRoute(report.reference)"
          class="inline-flex min-h-12 items-center rounded-lg bg-green-700 px-4 font-semibold text-white"
        >
          {{ t('resolved.seeProgress') }}
        </router-link>
      </template>

      <template v-else>
        <h1 class="text-xl font-bold text-green-800">{{ t('resolved.title') }}</h1>
        <p v-if="resolvedOn" class="text-gray-700">{{ t('resolved.resolvedOn', { date: resolvedOn }) }}</p>
        <p v-if="view === 'missing-photo'" role="status" class="rounded-lg bg-amber-50 p-3 text-amber-900">{{ t('resolved.missingPhoto') }}</p>
        <BeforeAfterPhotoPair :before="report.beforePhoto" :after="report.afterPhoto" />
        <h2 class="font-bold">{{ t('resolved.progress') }}</h2>
        <ReportStatusTimeline :steps="steps" :locale="locale" />
        <router-link
          :to="myReportsRoute()"
          class="inline-flex min-h-12 items-center rounded-lg border-2 border-green-700 px-4 font-semibold text-green-700"
        >
          {{ t('resolved.back') }}
        </router-link>
      </template>
    </template>
  </section>
</template>