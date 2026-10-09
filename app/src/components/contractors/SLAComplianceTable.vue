<template>
  <div class="space-y-6">
    <!-- Visual Weekly Compliance Chart vs Target -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-slate-900">Weekly SLA Compliance vs Target</h3>
            <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">Last 7 Days</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Contract benchmark threshold is 95.0% resolution compliance within specified SLA response windows.</p>
        </div>

        <div class="flex items-center gap-4 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-xs bg-[var(--ns-primary,#1F6F5C)]"></span>
            <span class="text-slate-600">Actual Compliance</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-0.5 border-t-2 border-dashed border-red-500"></span>
            <span class="text-slate-600 font-medium text-red-600">95% Target Line</span>
          </div>
        </div>
      </div>

      <!-- Compliance Chart Bars -->
      <div class="relative pt-6 pb-2">
        <!-- Target Line indicator -->
        <div class="absolute left-0 right-0 top-[20%] border-t-2 border-dashed border-red-400 z-10 pointer-events-none flex justify-end">
          <span class="bg-red-50 text-red-600 font-mono text-[10px] px-1.5 py-0.5 rounded -mt-3 mr-2 font-semibold">Target 95.0%</span>
        </div>

        <div class="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end border-b border-slate-200 pb-2">
          <div
            v-for="point in trend"
            :key="point.date"
            class="flex flex-col items-center h-full justify-end group relative"
          >
            <!-- Hover Tooltip -->
            <div class="opacity-0 group-hover:opacity-100 transition absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded-lg py-1 px-2 whitespace-nowrap shadow-lg pointer-events-none">
              <p class="font-bold font-mono">{{ point.complianceRate }}% ({{ point.resolvedCount }} resolved)</p>
              <p class="text-slate-400 text-[10px]">{{ point.breachedCount }} SLA breaches</p>
            </div>

            <!-- Bar container -->
            <div class="w-full max-w-[42px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
              <div
                class="w-full rounded-t-md transition-all duration-500"
                :class="point.complianceRate >= point.targetRate ? 'bg-[var(--ns-primary,#1F6F5C)] group-hover:bg-[var(--ns-lake-800,#185746)]' : 'bg-red-500 group-hover:bg-red-600'"
                :style="{ height: `${Math.max(10, Math.min(100, (point.complianceRate - 80) * 5))}%` }"
              ></div>
            </div>

            <span class="text-xs font-semibold text-slate-800 mt-2 font-mono">{{ point.day }}</span>
            <span class="text-[10px] text-slate-500 font-mono">{{ point.complianceRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Breakdown Table -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h4 class="font-bold text-sm text-slate-900">Daily Compliance Audit Breakdown</h4>
        <span class="text-xs text-slate-500">Franchise Period: Oct 01 – Oct 07, 2026</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-[11px] uppercase font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3">Day / Date</th>
              <th class="px-6 py-3 text-center">Tickets Resolved</th>
              <th class="px-6 py-3 text-center">SLA Breaches</th>
              <th class="px-6 py-3 text-right">Target Rate</th>
              <th class="px-6 py-3 text-right">Actual Compliance</th>
              <th class="px-6 py-3 text-center">Outcome</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="point in trend"
              :key="point.date"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="px-6 py-3.5 font-medium text-slate-900">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-slate-800">{{ point.day }}</span>
                  <span class="text-xs text-slate-400 font-mono">{{ point.date }}</span>
                </div>
              </td>
              <td class="px-6 py-3.5 text-center font-mono text-slate-700">
                {{ point.resolvedCount }}
              </td>
              <td class="px-6 py-3.5 text-center font-mono" :class="point.breachedCount > 0 ? 'text-red-600 font-bold' : 'text-slate-400'">
                {{ point.breachedCount }}
              </td>
              <td class="px-6 py-3.5 text-right font-mono text-slate-500">
                {{ point.targetRate.toFixed(1) }}%
              </td>
              <td class="px-6 py-3.5 text-right font-mono font-bold" :class="point.complianceRate >= point.targetRate ? 'text-emerald-700' : 'text-red-600'">
                {{ point.complianceRate.toFixed(1) }}%
              </td>
              <td class="px-6 py-3.5 text-center">
                <BaseBadge
                  :variant="point.complianceRate >= point.targetRate ? 'met' : 'breached'"
                  size="sm"
                >
                  {{ point.complianceRate >= point.targetRate ? 'Met (>= 95%)' : 'Breached' }}
                </BaseBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeeklyTrendPoint } from '../../types/contractor';
import { BaseBadge } from '../common';

defineProps<{
  trend: WeeklyTrendPoint[];
}>();
</script>
