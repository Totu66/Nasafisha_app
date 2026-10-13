<script setup lang="ts">
// FE-010 (FR-022): off-route alerts with a supervisor Authorise control. Refreshes every 20 s and keeps
// the last data on screen if a refresh fails. Self-contained: mount it in views/admin/DeviationAlertsView.vue.
import { onMounted, onUnmounted, ref } from 'vue'
import DeviationAuthorizeControl from './DeviationAuthorizeControl.vue'
import { authorizeDeviation, currentRole, fetchDeviationAlerts, type DeviationRow } from '../../composables/fieldAdapters'
import { useFieldOpsI18n } from '../../composables/useFieldOpsI18n'
import { canAuthorize, minutesSince, sortAlerts } from '../../helpers/deviation'

const POLL_MS = 20000
const { t } = useFieldOpsI18n()

const alerts = ref<DeviationRow[]>([])
const loading = ref(true)
const loadFailed = ref(false)
const authorizeFailed = ref(false)
const busyId = ref<string | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

let role: string | null = null
try {
  role = currentRole()
} catch {
  role = null // adapter not wired yet: controls stay hidden
}

async function load(): Promise<void> {
  try {
    alerts.value = sortAlerts(await fetchDeviationAlerts())
    loadFailed.value = false
  } catch {
    loadFailed.value = true // keep showing the last data
  } finally {
    loading.value = false
  }
}

async function authorize(id: string): Promise<void> {
  busyId.value = id
  authorizeFailed.value = false
  try {
    await authorizeDeviation(id)
  } catch {
    authorizeFailed.value = true
  } finally {
    busyId.value = null
    await load()
  }
}

const statusLabel = (status: string): string =>
  status === 'FLAGGED' ? t('deviation.flagged') : status === 'AUTHORISED' ? t('deviation.authorised') : t('deviation.cleared')

onMounted(() => {
  void load()
  timer = setInterval(load, POLL_MS)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-lg font-bold">{{ t('deviation.title') }}</h2>
      <button type="button" class="min-h-11 px-2 underline" @click="load">{{ t('deviation.refresh') }}</button>
    </div>

    <p v-if="loadFailed" class="rounded-lg bg-amber-50 p-3 text-amber-800">{{ t('deviation.loadFailed') }}</p>
    <p v-if="authorizeFailed" role="alert" class="font-semibold text-red-700">{{ t('deviation.failed') }}</p>
    <p v-if="loading" class="text-gray-600">{{ t('deviation.loading') }}</p>

    <ul v-else-if="alerts.length" class="space-y-3">
      <li v-for="a in alerts" :key="a.id" class="rounded-xl border border-gray-200 bg-white p-4">
        <div class="flex items-center justify-between gap-2">
          <strong>{{ a.vehicleId }}</strong>
          <span
            class="rounded-full px-3 py-0.5 text-sm font-semibold"
            :class="a.status === 'FLAGGED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
          >
            {{ statusLabel(a.status) }}
          </span>
        </div>
        <p class="text-gray-700">
          {{ t('deviation.offRoute', { m: a.offRouteMeters ?? 0, min: a.offRouteMinutes ?? minutesSince(a.flaggedAt) }) }}
        </p>
        <DeviationAuthorizeControl v-if="canAuthorize(a, role)" :busy="busyId === a.id" @authorize="authorize(a.id)" />
      </li>
    </ul>
    <p v-else class="text-gray-600">{{ t('deviation.empty') }}</p>
  </section>
</template>
