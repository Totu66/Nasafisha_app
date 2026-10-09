
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import ReportCard from '@/components/reports/ReportCard.vue'
import PendingReportCard from '@/components/offline/PendingReportCard.vue'
import { useReportsStore } from '@/store/reports.store'
import { useOfflineStore } from '@/store/offline.store'
import { useOfflineQueue } from '@/composables/useOfflineQueue'

type Filter = 'all' | 'open' | 'resolved'
const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'resolved', label: 'Resolved' },
]

const reportsStore = useReportsStore()
const offline = useOfflineStore()
const { reports, loading, error } = storeToRefs(reportsStore)
const { pending } = storeToRefs(offline)

const filter = ref<Filter>('all')
const shown = computed(() =>
  reports.value.filter((r) => filter.value === 'all' || (filter.value === 'resolved') === (r.status === 'resolved')),
)
const showPending = computed(() => filter.value !== 'resolved')

onMounted(() => reportsStore.fetchMyReports())

// when a waiting report finishes sending, the pending count drops: reload the list
watch(
  () => offline.pendingCount,
  (now, before) => {
    if (now < before) reportsStore.fetchMyReports()
  },
)

// ---- TEST BUTTON (development only) -------------------------------------
// Makes a fake report so you can try the list without the camera. Delete when you no longer need it.
const { submitOrQueue } = useOfflineQueue()
async function addTestReport() {
  const result = await submitOrQueue({
    clientId: crypto.randomUUID(),
    issueType: 'illegal_dumping',
    note: 'Test report',
    photo: new Blob(['test'], { type: 'image/jpeg' }),
    latitude: -0.3031,
    longitude: 36.08,
    capturedAt: new Date().toISOString(),
  })
  if (!result.queued) await reportsStore.fetchMyReports()
}
const isDev = import.meta.env.DEV
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-4 p-4">
    <h1 class="text-2xl font-bold">My reports</h1>

    <div class="flex gap-2" role="tablist" aria-label="Filter reports">
      <button
        v-for="f in filters"
        :key="f.key"
        type="button"
        role="tab"
        :aria-selected="filter === f.key"
        class="rounded-full border-2 px-3 py-1 text-sm font-semibold"
        :class="filter === f.key ? 'border-green-700 bg-green-700 text-white' : 'border-stone-800'"
        @click="filter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <ul class="space-y-2">
      <template v-if="showPending">
        <li v-for="item in pending" :key="item.localId"><PendingReportCard :item="item" /></li>
      </template>
      <li v-for="report in shown" :key="report.id"><ReportCard :report="report" /></li>
    </ul>

    <p v-if="loading && reports.length === 0" class="text-stone-500">Loading your reports…</p>

    <div v-else-if="error && reports.length === 0" class="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="mt-2 font-semibold underline" @click="reportsStore.fetchMyReports()">Try again</button>
    </div>

    <p
      v-else-if="shown.length === 0 && (!showPending || pending.length === 0)"
      class="py-10 text-center text-stone-500"
    >
      {{ filter === 'all' ? 'You have not made any reports yet.' : 'No reports here.' }}
    </p>

    <button
      v-if="isDev"
      type="button"
      class="w-full rounded-lg border border-dashed border-stone-400 py-2 text-sm text-stone-600"
      @click="addTestReport"
    >
      DEV: add a test report
    </button>
  </main>
</template>
