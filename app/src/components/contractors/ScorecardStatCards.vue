<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <!-- KPI 1: SLA compliance (dark card, Figma scorecard) -->
    <div class="flex flex-col justify-between rounded-2xl bg-[var(--ns-lake-900,#0F2E27)] p-5 text-white">
      <div class="flex items-start justify-between gap-3">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-[var(--ns-lake-100,#DCEDE7)]">
          SLA compliance
        </span>
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--ns-sun-500,#F5D142)]">
          <AppIcon
            name="efficiency-index"
            :size="15"
          />
        </span>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <span class="font-mono text-3xl font-extrabold">{{ complianceRate }}%</span>
        <span
          class="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold"
          :class="delta >= 0
            ? 'bg-[var(--ns-sun-500,#F5D142)] text-[var(--ns-lake-950,#081B17)]'
            : 'bg-[var(--ns-danger-bg,#FEE2E2)] text-[var(--ns-danger-fg,#991B1B)]'"
        >
          <AppIcon
            :name="delta >= 0 ? 'trend-up' : 'trend-down'"
            :size="12"
          />
          {{ delta >= 0 ? '+' : '' }}{{ delta }} pts
        </span>
      </div>

      <p class="mt-2 text-xs font-semibold text-[var(--ns-lake-100,#DCEDE7)]">
        {{ statusLabel }}
      </p>
    </div>

    <!-- KPI 2: Average resolution time -->
    <div class="flex flex-col justify-between rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-[var(--ns-ash-600,#4F5B57)]">
        Avg. resolution time
      </span>
      <div class="mt-4">
        <span class="font-mono text-3xl font-extrabold text-[var(--ns-lake-900,#0F2E27)]">{{ resolutionLabel }}</span>
        <p class="mt-1.5 text-xs text-[var(--ns-ash-600,#4F5B57)]">
          From 2.4 days last Q
        </p>
      </div>
    </div>

    <!-- KPI 3: Tickets closed -->
    <div class="flex flex-col justify-between rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-[var(--ns-ash-600,#4F5B57)]">
        Tickets closed
      </span>
      <div class="mt-4">
        <span class="font-mono text-3xl font-extrabold text-[var(--ns-lake-900,#0F2E27)]">{{ ticketsClosed }}</span>
        <p class="mt-1.5 text-xs text-[var(--ns-ash-600,#4F5B57)]">
          Last 90 days
        </p>
      </div>
    </div>

    <!-- KPI 4: Open now -->
    <div class="flex flex-col justify-between rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-[var(--ns-ash-600,#4F5B57)]">
        Open now
      </span>
      <div class="mt-4">
        <span class="font-mono text-3xl font-extrabold text-[var(--ns-lake-900,#0F2E27)]">{{ openTickets }}</span>
        <p class="mt-1.5 text-xs text-[var(--ns-ash-600,#4F5B57)]">
          Zones needing your action
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScorecardMetrics } from '../../types/contractor';
import { AppIcon } from '../common';

const props = defineProps<{
  metrics?: ScorecardMetrics | null;
}>();

const complianceRate = computed(() => props.metrics?.complianceRate ?? 88);
const targetRate = computed(() => props.metrics?.targetComplianceRate ?? 90);
const delta = computed(() => props.metrics?.complianceDelta ?? 4);
const ticketsClosed = computed(() => props.metrics?.totalTicketsResolved ?? 142);
const openTickets = computed(() => props.metrics?.openTickets ?? 9);

const resolutionLabel = computed(() => {
  const days = props.metrics?.avgResolutionDays;
  if (typeof days === 'number') return `${days.toFixed(1)} days`;
  const hours = props.metrics?.mttrHours ?? 50.4;
  return hours >= 24 ? `${(hours / 24).toFixed(1)} days` : `${hours.toFixed(1)}h`;
});

// Wireframe reads 88% vs a 90% target as "On target" while the gap is < 2 pts.
const statusLabel = computed(() =>
  complianceRate.value >= targetRate.value - 2 ? 'On target' : 'Below target'
);
</script>
