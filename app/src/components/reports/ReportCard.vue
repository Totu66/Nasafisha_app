<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-sm font-semibold text-slate-900">{{ report.title }}</h3>
        <p class="mt-1 text-xs text-slate-500">{{ report.location }}</p>
      </div>
      <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass">{{ report.status }}</span>
    </div>
    <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
      <span>{{ report.reference }}</span>
      <span>{{ report.updated }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Report } from '../../types/report';

const props = defineProps<{ report: Report }>();

const statusClass = computed(() => {
  if (props.report.status === 'Resolved') return 'bg-emerald-100 text-emerald-700';
  if (props.report.status === 'Assigned') return 'bg-amber-100 text-amber-700';
  if (props.report.status === 'Rejected') return 'bg-red-100 text-red-700';
  return 'bg-sky-100 text-sky-700';
});
</script>
