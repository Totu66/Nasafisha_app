<template>
  <section class="mx-auto max-w-xl">
    <h1 class="text-xl font-bold tracking-tight text-[var(--ns-ash-900,#17211F)]">My reports</h1>

    <!-- Filter pills -->
    <div class="mt-4 flex gap-2">
      <button
        v-for="pill in pills"
        :key="pill.id"
        type="button"
        class="rounded-lg px-4 py-1.5 text-xs font-bold transition"
        :class="pillClass(pill.id)"
        :aria-pressed="filter === pill.id"
        @click="filter = pill.id"
      >
        {{ pill.label }}
      </button>
    </div>

    <p
      v-if="store.error && !store.isLoading"
      class="mt-4 rounded-xl bg-[var(--ns-status-progress-bg,#FFF1CC)] px-4 py-3 text-xs text-[var(--ns-status-progress-fg,#7A4B00)]"
    >
      Showing recent reports — we couldn't reach the server.
    </p>

    <!-- Report list -->
    <div class="mt-4 space-y-3">
      <router-link
        v-for="report in filteredReports"
        :key="report.id"
        :to="detailRoute(report)"
        class="block rounded-2xl transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ns-leaf-600,#16A34A)]"
      >
        <ReportCard :report="report" />
      </router-link>

      <p
        v-if="!filteredReports.length"
        class="rounded-2xl bg-white px-5 py-10 text-center text-sm text-[var(--ns-ash-600,#4F5B57)]"
      >
        Nothing here yet.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ReportCard from '../../components/reports/ReportCard.vue';
import { useReportsStore } from '../../store/reports.store';
import type { Report } from '../../types/report';

type Filter = 'all' | 'open' | 'resolved';

const filter = ref<Filter>('all');
const store = useReportsStore();

const pills = [
  { id: 'all' as const, label: 'All' },
  { id: 'open' as const, label: 'Open' },
  { id: 'resolved' as const, label: 'Resolved' },
];

// Shown until the API returns the citizen's reports (and whenever it is unreachable).
const SEED: Report[] = [
  { id: 1, reference: 'NSF-260915-0043', title: 'Missed collection', location: 'Blessed 5B, Nakuru', status: 'Submitted', updated: 'today 08:14' },
  { id: 2, reference: 'NSF-260915-0042', title: 'Missed collection', location: 'Blessed 5B, Nakuru', status: 'In review', updated: '15/09/2026' },
  { id: 3, reference: 'NSF-260982-0017', title: 'Illegal dumping', location: 'Section 58, Nakuru', status: 'Resolved', updated: '02/09/2026' },
];

const reports = computed<Report[]>(() => (store.reports.length ? store.reports : SEED));

const filteredReports = computed(() => {
  if (filter.value === 'open') return reports.value.filter((r) => r.status !== 'Resolved');
  if (filter.value === 'resolved') return reports.value.filter((r) => r.status === 'Resolved');
  return reports.value;
});

function detailRoute(report: Report): string {
  return report.status === 'Resolved'
    ? `/citizen/reports/${report.reference}/resolved`
    : `/citizen/reports/${report.reference}`;
}

function pillClass(id: Filter): string {
  if (filter.value === id) {
    if (id === 'all') return 'bg-[var(--ns-ash-900,#17211F)] text-white';
    if (id === 'open') return 'bg-[var(--ns-leaf-500,#22C55E)] text-[var(--ns-ash-900,#17211F)]';
    return 'bg-[var(--ns-sun-500,#F5D142)] text-[var(--ns-ash-900,#17211F)]';
  }
  return 'bg-transparent text-[var(--ns-ash-600,#4F5B57)] hover:bg-[var(--ns-ash-100,#E6EBE9)]';
}

onMounted(() => {
  void store.loadMine();
});
</script>
