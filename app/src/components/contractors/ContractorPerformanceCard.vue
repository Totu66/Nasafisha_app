<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- KPI 1: Overall SLA Compliance Rate -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider font-mono">SLA Compliance Rate</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-[var(--ns-primary,#1F6F5C)] flex items-center justify-center">
            <AppIcon name="efficiency-index" :size="18" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-slate-900 font-mono">{{ metrics?.complianceRate ?? 96.4 }}%</span>
          <span
            :class="[
              'text-xs font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5',
              (metrics?.complianceDelta ?? 1.4) >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            ]"
          >
            <AppIcon :name="(metrics?.complianceDelta ?? 1.4) >= 0 ? 'trend-up' : 'trend-down'" :size="14" />
            {{ (metrics?.complianceDelta ?? 1.4) >= 0 ? '+' : '' }}{{ metrics?.complianceDelta ?? 1.4 }}%
          </span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Contract Target: <strong class="text-slate-700 font-mono">{{ metrics?.targetComplianceRate ?? 95.0 }}%</strong></span>
        <BaseBadge :variant="(metrics?.complianceRate ?? 96.4) >= (metrics?.targetComplianceRate ?? 95.0) ? 'resolved' : 'danger'" size="sm">
          {{ (metrics?.complianceRate ?? 96.4) >= (metrics?.targetComplianceRate ?? 95.0) ? 'SLA Met' : 'Breach Warning' }}
        </BaseBadge>
      </div>
    </div>

    <!-- KPI 2: Mean Time to Resolution (MTTR) -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider font-mono">Mean Time to Resolve</span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <AppIcon name="timer" :size="18" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-slate-900 font-mono">{{ metrics?.mttrHours ?? 3.2 }}h</span>
          <span class="text-xs text-slate-500 font-medium">per ticket avg</span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Max SLA Threshold: <strong class="text-slate-700 font-mono">{{ metrics?.mttrTargetHours ?? 4.0 }}h</strong></span>
        <span class="text-emerald-700 font-medium text-[11px]">-48 min faster than limit</span>
      </div>
    </div>

    <!-- KPI 3: First-Time Fix & Photographic Verification -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider font-mono">Photo Verification</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <AppIcon name="shield-check" :size="18" />
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-slate-900 font-mono">{{ metrics?.firstTimeFixRate ?? 98.2 }}%</span>
          <span class="text-xs text-emerald-700 font-medium">audit pass</span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>GPS Distance &lt; 50m: <strong class="text-slate-700 font-mono">100%</strong></span>
        <span class="text-slate-600">FR-013 Standard</span>
      </div>
    </div>

    <!-- KPI 4: Tickets & Breaches -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider font-mono">Total Closed Tickets</span>
          <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <AppIcon name="check" :size="18" />
          </div>
        </div>
        <div class="flex items-baseline gap-3">
          <span class="text-3xl font-extrabold text-slate-900 font-mono">{{ metrics?.totalTicketsResolved ?? 142 }}</span>
          <span class="text-xs text-red-600 font-medium font-mono">
            {{ metrics?.slaBreachesCount ?? 5 }} breaches
          </span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Hauled: <strong class="text-slate-700 font-mono">{{ metrics?.totalVolumeTonnes ?? 184.6 }}t</strong></span>
        <span>Fleet active: <strong class="text-slate-700 font-mono">{{ metrics?.activeVehiclesTracked ?? 7 }}/8</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScorecardMetrics } from '../../types/contractor';
import { AppIcon, BaseBadge } from '../common';

defineProps<{
  metrics?: ScorecardMetrics | null;
}>();
</script>
