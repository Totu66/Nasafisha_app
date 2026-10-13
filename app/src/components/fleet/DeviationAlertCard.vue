<script setup lang="ts">
import type { DeviationAlert } from '@/types/deviationAlert';

const { alert, canAuthorise } = defineProps<{
  alert: DeviationAlert | null;
  canAuthorise?: boolean;
}>();

const emit = defineEmits<{
  (_event: 'select', _alertId: string): void;
  (_event: 'authorise', _alertId: string): void;
  (_event: 'view-trail', _alertId: string): void;
}>();

const statusClasses = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-rose-100 text-rose-700';
    case 'authorised':
      return 'bg-emerald-100 text-emerald-700';
    case 'resolved':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
};
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Deviation</p>
        <h3 class="mt-1 text-lg font-semibold text-slate-900">{{ alert?.title || alert?.vehicleId || 'Deviation alert' }}</h3>
      </div>
      <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="statusClasses(alert?.status || 'active')">
        {{ alert?.status || 'active' }}
      </span>
    </div>

    <p class="mt-3 text-sm text-slate-600">{{ alert?.description || 'No further description was provided.' }}</p>

    <div class="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-slate-500">Vehicle</p>
        <p class="mt-1 font-medium text-slate-800">{{ alert?.vehicleId || '—' }}</p>
      </div>
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-slate-500">Severity</p>
        <p class="mt-1 font-medium text-slate-800">{{ alert?.severity || 'Normal' }}</p>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
        @click="emit('select', alert?.id)"
      >
        View
      </button>
      <button
        v-if="canAuthorise && alert?.id"
        type="button"
        class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        @click="emit('authorise', alert.id)"
      >
        Authorise
      </button>
      <button
        type="button"
        class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
        @click="emit('view-trail', alert?.id)"
      >
        Trail
      </button>
    </div>
  </article>
</template>

