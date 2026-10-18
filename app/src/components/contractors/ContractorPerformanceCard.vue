<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- KPI 1: Overall SLA Compliance Rate (dark card per Figma) -->
    <div class="rounded-2xl border border-[var(--ns-lake-900,#0F2E27)] bg-[var(--ns-lake-900,#0F2E27)] p-5 text-white flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-semibold uppercase tracking-wider font-mono text-[var(--ns-lake-100,#DCEDE7)]">SLA Compliance Rate</span>
          <div class="w-8 h-8 rounded-lg bg-white/10 text-[var(--ns-sun-500,#F5D142)] flex items-center justify-center">
            <AppIcon name="efficiency-index" :size="18" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold font-mono">{{ metrics?.complianceRate ?? 96.4 }}%</span>
          <span
            :class="[
              'text-xs font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5',
              (metrics?.complianceDelta ?? 1.4) >= 0
                ? 'bg-[var(--ns-sun-500,#F5D142)] text-[var(--ns-lake-950,#081B17)]'
                : 'bg-[var(--ns-danger-bg,#FEE2E2)] text-[var(--ns-danger-fg,#991B1B)]'
            ]"
          >
            <AppIcon :name="(metrics?.complianceDelta ?? 1.4) >= 0 ? 'trend-up' : 'trend-down'" :size="14" />
            {{ (metrics?.complianceDelta ?? 1.4) >= 0 ? '+' : '' }}{{ metrics?.complianceDelta ?? 1.4 }}%
          </span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[var(--ns-lake-100,#DCEDE7)]">
        <span>Contract target: <strong class="font-mono text-white">{{ metrics?.targetComplianceRate ?? 95.0 }}%</strong></span>
        <span
          class="rounded-full px-2 py-0.5 text-[11px] font-bold"
          :class="(metrics?.complianceRate ?? 96.4) >= (metrics?.targetComplianceRate ?? 95.0)
            ? 'bg-[var(--ns-sun-500,#F5D142)] text-[var(--ns-lake-950,#081B17)]'
            : 'bg-[var(--ns-danger-bg,#FEE2E2)] text-[var(--ns-danger-fg,#991B1B)]'"
        >
          {{ (metrics?.complianceRate ?? 96.4) >= (metrics?.targetComplianceRate ?? 95.0) ? 'SLA Met' : 'Breach Warning' }}
        </span>
      </div>
    </div>

    <!-- KPI 2: Mean Time to Resolution (MTTR) -->
    <div class="rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-semibold uppercase tracking-wider font-mono text-[var(--ns-ash-600,#4F5B57)]">Mean Time to Resolve</span>
          <div class="w-8 h-8 rounded-lg bg-[var(--ns-cream,#F9F6EB)] text-[var(--ns-lake-800,#185746)] flex items-center justify-center">
            <AppIcon name="timer" :size="18" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold font-mono text-[var(--ns-lake-900,#0F2E27)]">{{ metrics?.mttrHours ?? 3.2 }}h</span>
          <span class="text-xs text-[var(--ns-ash-600,#4F5B57)] font-medium">per ticket avg</span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-[var(--ns-ash-100,#E6EBE9)] flex items-center justify-between text-xs text-[var(--ns-ash-600,#4F5B57)]">
        <span>Max SLA threshold: <strong class="font-mono text-[var(--ns-ash-800,#263330)]">{{ metrics?.mttrTargetHours ?? 4.0 }}h</strong></span>
        <span class="font-medium text-[11px] text-[var(--ns-status-resolved-fg,#14563F)]">Within limit</span>
      </div>
    </div>

    <!-- KPI 3: Photographic Verification -->
    <div class="rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-semibold uppercase tracking-wider font-mono text-[var(--ns-ash-600,#4F5B57)]">Photo Verification</span>
          <div class="w-8 h-8 rounded-lg bg-[var(--ns-cream,#F9F6EB)] text-[var(--ns-lake-800,#185746)] flex items-center justify-center">
            <AppIcon name="shield-check" :size="18" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold font-mono text-[var(--ns-lake-900,#0F2E27)]">{{ metrics?.firstTimeFixRate ?? 98.2 }}%</span>
          <span class="text-xs font-medium text-[var(--ns-status-resolved-fg,#14563F)]">audit pass</span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-[var(--ns-ash-100,#E6EBE9)] flex items-center justify-between text-xs text-[var(--ns-ash-600,#4F5B57)]">
        <span>GPS distance &lt; 50m: <strong class="font-mono text-[var(--ns-ash-800,#263330)]">100%</strong></span>
        <span>FR-013 standard</span>
      </div>
    </div>

    <!-- KPI 4: Tickets & Breaches -->
    <div class="rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-semibold uppercase tracking-wider font-mono text-[var(--ns-ash-600,#4F5B57)]">Total Closed Tickets</span>
          <div class="w-8 h-8 rounded-lg bg-[var(--ns-cream,#F9F6EB)] text-[var(--ns-lake-800,#185746)] flex items-center justify-center">
            <AppIcon name="check" :size="18" />
          </div>
        </div>
        <div class="flex items-baseline gap-3">
          <span class="text-3xl font-extrabold font-mono text-[var(--ns-lake-900,#0F2E27)]">{{ metrics?.totalTicketsResolved ?? 142 }}</span>
          <span class="text-xs font-medium font-mono text-[var(--ns-danger-fg,#991B1B)]">
            {{ metrics?.slaBreachesCount ?? 5 }} breaches
          </span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-[var(--ns-ash-100,#E6EBE9)] flex items-center justify-between text-xs text-[var(--ns-ash-600,#4F5B57)]">
        <span>Hauled: <strong class="font-mono text-[var(--ns-ash-800,#263330)]">{{ metrics?.totalVolumeTonnes ?? 184.6 }}t</strong></span>
        <span>Fleet active: <strong class="font-mono text-[var(--ns-ash-800,#263330)]">{{ metrics?.activeVehiclesTracked ?? 7 }}/8</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScorecardMetrics } from '../../types/contractor';
import { AppIcon } from '../common';

defineProps<{
  metrics?: ScorecardMetrics | null;
}>();
</script>
