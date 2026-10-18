<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { BaseButton, BaseInput } from '@/components/common';
import FleetMap from '@/components/map/FleetMap.vue';
import RouteComparison from '@/components/fleet/RouteComparison.vue';
import { useI18n } from '@/i18n';
import { useFleetStore } from '@/store/fleet.store';
import type { RouteAudit } from '@/types/routeAudit';

const fleet = useFleetStore();
const { t } = useI18n();
const { audits, selectedAudit, loading, error } = storeToRefs(fleet);

const vehicleFilter = ref('all');
const zoneFilter = ref('all');
const dateFrom = ref('');
const dateTo = ref('');
const selectedAuditId = ref<string | null>(null);
type SortKey = 'distanceVarianceMeters' | 'durationVarianceSeconds' | 'shiftEnd';
const sortKey = ref<SortKey>('distanceVarianceMeters');
const sortDirection = ref<'asc' | 'desc'>('desc');
const page = ref(1);
const pageSize = 10;

const vehicleOptions = computed(() => {
  const uniqueVehicles = new Map<string, { value: string; label: string }>();

  for (const vehicle of fleet.state.vehicles) {
    const label = vehicle.registrationNumber || vehicle.id;
    if (!uniqueVehicles.has(vehicle.id)) {
      uniqueVehicles.set(vehicle.id, { value: vehicle.id, label });
    }
  }

  return [
    { value: 'all', label: t('fleet.auditView.filters.allVehicles') },
    ...Array.from(uniqueVehicles.values()),
  ];
});

const zoneOptions = computed(() => {
  const uniqueZones = new Map<string, { value: string; label: string }>();

  for (const vehicle of fleet.state.vehicles) {
    if (!uniqueZones.has(vehicle.zoneId)) {
      uniqueZones.set(vehicle.zoneId, { value: vehicle.zoneId, label: vehicle.zoneName });
    }
  }

  return [
    { value: 'all', label: t('fleet.auditView.filters.allZones') },
    ...Array.from(uniqueZones.values()),
  ];
});

const filteredAudits = computed<RouteAudit[]>(() => {
  const next = [...audits.value].filter((audit) => {
    const vehicleMatch = vehicleFilter.value === 'all' || audit.vehicleId === vehicleFilter.value;
    const zoneMatch = zoneFilter.value === 'all' || audit.zoneId === zoneFilter.value;
    const fromMatch = !dateFrom.value || audit.shiftEnd >= dateFrom.value;
    const toMatch = !dateTo.value || audit.shiftEnd <= `${dateTo.value}T23:59:59Z`;

    return vehicleMatch && zoneMatch && fromMatch && toMatch;
  });

  next.sort((left, right) => {
    const leftValue = left[sortKey.value] ?? 0;
    const rightValue = right[sortKey.value] ?? 0;
    const base = leftValue > rightValue ? 1 : leftValue < rightValue ? -1 : 0;
    return sortDirection.value === 'asc' ? base : -base;
  });

  return next;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredAudits.value.length / pageSize)));

const paginatedAudits = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredAudits.value.slice(start, start + pageSize);
});

const zoneSummary = computed(() => {
  const rows = new Map<string, { zoneName: string; values: number[] }>();

  for (const audit of filteredAudits.value) {
    const current = rows.get(audit.zoneId) ?? { zoneName: audit.zoneName, values: [] };
    current.values.push(Math.abs(audit.distanceVarianceMeters));
    rows.set(audit.zoneId, current);
  }

  return Array.from(rows.entries()).map(([zoneId, info]) => ({
    zoneId,
    zoneName: info.zoneName,
    average: info.values.reduce((sum, value) => sum + value, 0) / info.values.length,
    worst: Math.max(...info.values),
  }));
});

const selectedAuditRecord = computed<RouteAudit | null>(() => {
  if (selectedAuditId.value) {
    return filteredAudits.value.find((audit) => audit.id === selectedAuditId.value) ?? null;
  }

  return filteredAudits.value[0] ?? selectedAudit.value ?? null;
});

const selectedAuditDetail = computed<RouteAudit | null>(() => {
  if (!selectedAuditRecord.value && selectedAudit.value) {
    return selectedAudit.value;
  }

  return selectedAuditRecord.value;
});

const headerSort = (key: SortKey): void => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    return;
  }

  sortKey.value = key;
  sortDirection.value = 'desc';
};

const getSortAria = (key: SortKey): 'ascending' | 'descending' | 'none' => {
  if (sortKey.value !== key) return 'none';
  return sortDirection.value === 'asc' ? 'ascending' : 'descending';
};

const formatVariance = (value: number | null | undefined, suffix: string): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)} ${suffix}`;
};

const resetFilters = (): void => {
  vehicleFilter.value = 'all';
  zoneFilter.value = 'all';
  dateFrom.value = '';
  dateTo.value = '';
  page.value = 1;
};

const loadAudits = async (): Promise<void> => {
  const params: {
    vehicleId?: string;
    zoneId?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {};

  if (vehicleFilter.value !== 'all') params.vehicleId = vehicleFilter.value;
  if (zoneFilter.value !== 'all') params.zoneId = zoneFilter.value;
  if (dateFrom.value) params.dateFrom = dateFrom.value;
  if (dateTo.value) params.dateTo = `${dateTo.value}T23:59:59Z`;

  await fleet.fetchAudits(params);
};

watch(
  [vehicleFilter, zoneFilter, dateFrom, dateTo],
  () => {
    page.value = 1;
    void loadAudits();
  }
);

watch(
  selectedAuditDetail,
  async (nextAudit) => {
    if (!nextAudit) return;

    selectedAuditId.value = nextAudit.id;
    if (nextAudit.vehicleId) {
      fleet.selectVehicle(nextAudit.vehicleId);
    }

    if (fleet.state.selectedAudit?.id !== nextAudit.id) {
      await fleet.fetchAudit(nextAudit.id);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await fleet.fetchVehicles();
  await loadAudits();

  if (fleet.state.audits.length > 0) {
    const firstAudit = fleet.state.audits[0];
    selectedAuditId.value = firstAudit.id;
    await fleet.fetchAudit(firstAudit.id);
    fleet.selectVehicle(firstAudit.vehicleId);
  }
});
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto max-w-7xl space-y-6">
      <header class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">{{ t('fleet.auditView.title') }}</p>
        <div class="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">{{ t('fleet.auditView.title') }}</h1>
            <p class="mt-1 text-sm text-slate-500">{{ t('fleet.auditView.subtitle') }}</p>
          </div>
          <BaseButton variant="secondary" size="sm" @click="resetFilters">
            {{ t('fleet.auditView.filters.reset') }}
          </BaseButton>
        </div>
      </header>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('fleet.auditView.filters.vehicle') }}</label>
            <select v-model="vehicleFilter" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
              <option v-for="vehicle in vehicleOptions" :key="vehicle.value" :value="vehicle.value">
                {{ vehicle.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">{{ t('fleet.auditView.filters.zone') }}</label>
            <select v-model="zoneFilter" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200">
              <option v-for="zone in zoneOptions" :key="zone.value" :value="zone.value">
                {{ zone.label }}
              </option>
            </select>
          </div>

          <div>
            <BaseInput v-model="dateFrom" type="date" :label="t('fleet.auditView.filters.dateFrom')" />
          </div>

          <div>
            <BaseInput v-model="dateTo" type="date" :label="t('fleet.auditView.filters.dateTo')" />
          </div>
        </div>
      </section>

      <section v-if="zoneSummary.length" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
            {{ t('fleet.auditView.summary.title') }}
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[420px] text-left text-sm text-slate-700">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500">
                <th scope="col" class="pb-2 pr-3 font-medium">{{ t('fleet.auditView.summary.zone') }}</th>
                <th scope="col" class="pb-2 pr-3 font-medium">{{ t('fleet.auditView.summary.average') }}</th>
                <th scope="col" class="pb-2 font-medium">{{ t('fleet.auditView.summary.worst') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in zoneSummary" :key="row.zoneId" class="border-b border-slate-100 last:border-0">
                <td class="py-3 pr-3 font-medium text-slate-800">{{ row.zoneName }}</td>
                <td class="py-3 pr-3">{{ formatVariance(row.average, 'm') }}</td>
                <td class="py-3">{{ formatVariance(row.worst, 'm') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="space-y-4">
          <RouteComparison :audit="selectedAuditDetail" :loading="loading.audits" />
          <FleetMap :planned-path="selectedAuditDetail?.plannedRoute?.path ?? []" :actual-path="selectedAuditDetail?.actualPath ?? []" :title="t('fleet.auditView.map')" />
        </div>

        <aside class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-[0.16em] text-slate-500">{{ t('fleet.auditView.selected') }}</p>
          <div v-if="selectedAuditDetail" class="mt-4 space-y-3">
            <div>
              <p class="text-sm text-slate-500">{{ t('fleet.auditView.table.vehicle') }}</p>
              <p class="mt-1 text-lg font-semibold text-slate-900">{{ selectedAuditDetail.registrationNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">{{ t('fleet.auditView.table.zone') }}</p>
              <p class="mt-1 text-base font-medium text-slate-800">{{ selectedAuditDetail.zoneName }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">{{ t('fleet.auditView.table.shiftEnd') }}</p>
              <p class="mt-1 text-base font-medium text-slate-800">{{ new Date(selectedAuditDetail.shiftEnd).toLocaleDateString() }}</p>
            </div>
          </div>
          <div v-else class="mt-4 text-sm text-slate-500">{{ t('fleet.auditView.empty') }}</div>
        </aside>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div v-if="loading.audits" class="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          {{ t('fleet.auditView.loading') }}
        </div>

        <div v-else-if="error.audits" class="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p>{{ t('fleet.auditView.error') }}</p>
          <BaseButton class="mt-4" variant="secondary" size="sm" @click="loadAudits">
            {{ t('fleet.auditView.retry') }}
          </BaseButton>
        </div>

        <div v-else-if="filteredAudits.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          {{ t('fleet.auditView.empty') }}
        </div>

        <div v-else class="space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm text-slate-700">
              <thead>
                <tr class="bg-slate-50 text-slate-600">
                  <th scope="col" class="border-b border-slate-200 px-3 py-3 font-medium">
                    <button type="button" class="inline-flex items-center gap-1 font-medium" @click="headerSort('distanceVarianceMeters')" :aria-sort="getSortAria('distanceVarianceMeters')">
                      {{ t('fleet.auditView.table.distanceVariance') }}
                    </button>
                  </th>
                  <th scope="col" class="border-b border-slate-200 px-3 py-3 font-medium">
                    <button type="button" class="inline-flex items-center gap-1 font-medium" @click="headerSort('durationVarianceSeconds')" :aria-sort="getSortAria('durationVarianceSeconds')">
                      {{ t('fleet.auditView.table.timeVariance') }}
                    </button>
                  </th>
                  <th scope="col" class="border-b border-slate-200 px-3 py-3 font-medium">
                    <button type="button" class="inline-flex items-center gap-1 font-medium" @click="headerSort('shiftEnd')" :aria-sort="getSortAria('shiftEnd')">
                      {{ t('fleet.auditView.table.shiftEnd') }}
                    </button>
                  </th>
                  <th scope="col" class="border-b border-slate-200 px-3 py-3 font-medium">{{ t('fleet.auditView.table.vehicle') }}</th>
                  <th scope="col" class="border-b border-slate-200 px-3 py-3 font-medium">{{ t('fleet.auditView.table.zone') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="audit in paginatedAudits"
                  :key="audit.id"
                  class="cursor-pointer transition hover:bg-slate-50"
                  :class="selectedAuditDetail?.id === audit.id ? 'bg-emerald-50' : ''"
                  @click="selectedAuditId = audit.id; void fleet.fetchAudit(audit.id)"
                  @keydown.enter="selectedAuditId = audit.id; void fleet.fetchAudit(audit.id)"
                  tabindex="0"
                >
                  <td class="border-b border-slate-200 px-3 py-3 font-medium" :class="audit.distanceVarianceMeters >= 0 ? 'text-amber-700' : 'text-emerald-700'">
                    {{ formatVariance(audit.distanceVarianceMeters, 'm') }}
                  </td>
                  <td class="border-b border-slate-200 px-3 py-3 font-medium" :class="audit.durationVarianceSeconds >= 0 ? 'text-amber-700' : 'text-emerald-700'">
                    {{ formatVariance(audit.durationVarianceSeconds, 's') }}
                  </td>
                  <td class="border-b border-slate-200 px-3 py-3">{{ new Date(audit.shiftEnd).toLocaleDateString() }}</td>
                  <td class="border-b border-slate-200 px-3 py-3">{{ audit.registrationNumber }}</td>
                  <td class="border-b border-slate-200 px-3 py-3">{{ audit.zoneName }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm text-slate-500">{{ t('fleet.auditView.table.page', { page: page, total: totalPages }) }}</p>
            <div class="flex gap-2">
              <BaseButton variant="secondary" size="sm" :disabled="page <= 1" @click="page = Math.max(1, page - 1)">
                {{ t('fleet.auditView.table.prev') }}
              </BaseButton>
              <BaseButton variant="secondary" size="sm" :disabled="page >= totalPages" @click="page = Math.min(totalPages, page + 1)">
                {{ t('fleet.auditView.table.next') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

