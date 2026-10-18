<template>
  <div class="space-y-6">
    <!-- Page header -->
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
          Municipality summary
        </h1>
        <p class="mt-1 text-sm text-[var(--ns-ash-600,#4F5B57)]">
          County-wide environmental cleaning operations overview.
        </p>
      </div>

      <ExportButton
        :data="exportData"
        filename="command-center-report.csv"
      />
    </header>

    <div v-if="loading" class="rounded-xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-10 text-center text-sm text-[var(--ns-ash-600,#4F5B57)]">
      Loading dashboard data...
    </div>

    <div v-else-if="error" class="rounded-xl border border-[var(--ns-danger-border,#F87171)] bg-[var(--ns-danger-bg,#FEE2E2)] p-4 text-sm text-[var(--ns-danger-fg,#991B1B)]">
      {{ error }}
    </div>

    <template v-else>
      <!-- KPI cards (Figma: first card dark) -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-xl bg-[var(--ns-lake-900,#0F2E27)] p-5 text-white">
          <p class="text-xs font-medium text-[var(--ns-lake-100,#DCEDE7)]">Cleanliness score</p>
          <strong class="mt-2 block text-4xl font-extrabold tracking-tight">
            {{ dashboardData?.summary.cleanlinessScore ?? 0 }}%
          </strong>
          <span class="mt-3 inline-flex rounded-full bg-[var(--ns-sun-500,#F5D142)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--ns-lake-950,#081B17)]">
            County target 85%
          </span>
        </article>

        <article class="rounded-xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5">
          <p class="text-xs font-medium text-[var(--ns-ash-600,#4F5B57)]">Active vehicles</p>
          <strong class="mt-2 block text-4xl font-extrabold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
            {{ dashboardData?.summary.activeVehicles ?? 0 }}
          </strong>
          <span class="mt-3 block text-[11px] text-[var(--ns-ash-600,#4F5B57)]">Fleet on the road today</span>
        </article>

        <article class="rounded-xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5">
          <p class="text-xs font-medium text-[var(--ns-ash-600,#4F5B57)]">Pending tickets</p>
          <strong class="mt-2 block text-4xl font-extrabold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
            {{ dashboardData?.summary.pendingTickets ?? 0 }}
          </strong>
          <span class="mt-3 block text-[11px] text-[var(--ns-ash-600,#4F5B57)]">Awaiting dispatch or closure</span>
        </article>

        <article class="rounded-xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5">
          <p class="text-xs font-medium text-[var(--ns-ash-600,#4F5B57)]">Zones covered</p>
          <strong class="mt-2 block text-4xl font-extrabold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
            {{ dashboardData?.summary.totalZones ?? 0 }}
          </strong>
          <span class="mt-3 block text-[11px] text-[var(--ns-ash-600,#4F5B57)]">Active collection zones</span>
        </article>
      </section>

      <!-- Tabs -->
      <div class="border-b border-[var(--ns-ash-200,#D5DBD9)]">
        <nav class="flex gap-6" aria-label="Dashboard sections">
          <button
            v-for="item in tabs"
            :key="item.id"
            type="button"
            class="border-b-[3px] pb-2.5 text-sm font-semibold transition"
            :class="tab === item.id
              ? 'border-[var(--ns-lake-900,#0F2E27)] text-[var(--ns-lake-900,#0F2E27)]'
              : 'border-transparent text-[var(--ns-ash-600,#4F5B57)] hover:text-[var(--ns-lake-900,#0F2E27)]'"
            :aria-current="tab === item.id ? 'page' : undefined"
            @click="tab = item.id"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>

      <!-- Panels -->
      <section
        v-if="tab === 'overview' || tab === 'zones'"
        class="rounded-xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-bold text-[var(--ns-lake-900,#0F2E27)]">Zones</h2>
          <span class="text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ dashboardData?.zones.length ?? 0 }} zones</span>
        </div>

        <div v-if="dashboardData?.zones.length" class="flex flex-col gap-2.5">
          <div
            v-for="zone in dashboardData.zones"
            :key="zone.id"
            class="flex items-center justify-between gap-3 rounded-lg bg-[var(--ns-cream,#F9F6EB)] px-4 py-3"
          >
            <div>
              <strong class="text-sm text-[var(--ns-lake-900,#0F2E27)]">{{ zone.name }}</strong>
              <small class="mt-0.5 block text-xs text-[var(--ns-ash-600,#4F5B57)]">
                {{ zone.municipality || 'Municipality not specified' }}
              </small>
            </div>

            <span
              class="rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize"
              :class="(zone.status || 'active') === 'active'
                ? 'bg-[var(--ns-status-resolved-bg,#DCF2E6)] text-[var(--ns-status-resolved-fg,#14563F)]'
                : 'bg-[var(--ns-status-progress-bg,#FFF1CC)] text-[var(--ns-status-progress-fg,#7A4B00)]'"
            >
              {{ zone.status || 'active' }}
            </span>
          </div>
        </div>

        <p v-else class="py-8 text-center text-sm text-[var(--ns-ash-600,#4F5B57)]">
          No zone data available.
        </p>
      </section>

      <section
        v-if="tab === 'overview' || tab === 'hotspots'"
        class="rounded-xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-bold text-[var(--ns-lake-900,#0F2E27)]">Dumping hotspots</h2>
          <span class="text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ dashboardData?.hotspots.length ?? 0 }}</span>
        </div>

        <div v-if="dashboardData?.hotspots.length" class="flex flex-col gap-2.5">
          <div
            v-for="hotspot in dashboardData.hotspots"
            :key="hotspot.id"
            class="flex items-center justify-between gap-3 rounded-lg bg-[var(--ns-cream,#F9F6EB)] px-4 py-3"
          >
            <div>
              <strong class="text-sm text-[var(--ns-lake-900,#0F2E27)]">{{ hotspot.name }}</strong>
              <small class="mt-0.5 block text-xs text-[var(--ns-ash-600,#4F5B57)]">
                {{ hotspot.incidentCount }} incidents
              </small>
            </div>

            <span
              class="rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize"
              :class="severityClass(hotspot.severity)"
            >
              {{ hotspot.severity }}
            </span>
          </div>
        </div>

        <p v-else class="py-8 text-center text-sm text-[var(--ns-ash-600,#4F5B57)]">
          No hotspot data available.
        </p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ExportButton from '../../components/dashboard/ExportButton.vue'
import { useDashboardStore } from '../../store/dashboard.store'

const {
  dashboardData,
  loading,
  error,
  loadDashboard
} = useDashboardStore()

const tab = ref<'overview' | 'zones' | 'hotspots'>('overview')

const tabs = [
  { id: 'overview' as const, label: 'Overview' },
  { id: 'zones' as const, label: 'Zones' },
  { id: 'hotspots' as const, label: 'Hotspots' },
]

function severityClass(severity: string): string {
  if (severity === 'low') {
    return 'bg-[var(--ns-status-resolved-bg,#DCF2E6)] text-[var(--ns-status-resolved-fg,#14563F)]'
  }
  if (severity === 'medium') {
    return 'bg-[var(--ns-status-progress-bg,#FFF1CC)] text-[var(--ns-status-progress-fg,#7A4B00)]'
  }
  return 'bg-[var(--ns-danger-bg,#FEE2E2)] text-[var(--ns-danger-fg,#991B1B)]'
}

const exportData = computed(() => {
  if (!dashboardData.value) {
    return []
  }

  return dashboardData.value.zones.map((zone) => ({
    Zone: zone.name,
    Municipality: zone.municipality || '',
    Status: zone.status || ''
  }))
})

onMounted(() => {
  loadDashboard()
})
</script>
