<script setup lang="ts">
import type { ShiftPositionHistory, PositionLogEntry } from '@/types/positionLog';

const { history, loading, error } = defineProps<{
  history: ShiftPositionHistory | null;
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  (_event: 'focus-point', _point: PositionLogEntry): void;
}>();

const rows = () => (history?.entries ?? []) as PositionLogEntry[];
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">History</p>
        <h3 class="text-lg font-semibold text-slate-900">Position history</h3>
      </div>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
        {{ rows().length }} points
      </span>
    </div>

    <div v-if="loading" class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      Loading position history…
    </div>

    <div v-else-if="error" class="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {{ error }}
    </div>

    <div v-else-if="!rows().length" class="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
      No position updates are available for this vehicle.
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-slate-200">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-3 py-2 font-medium">Time</th>
            <th class="px-3 py-2 font-medium">Latitude</th>
            <th class="px-3 py-2 font-medium">Longitude</th>
            <th class="px-3 py-2 font-medium">Speed</th>
            <th class="px-3 py-2 font-medium text-right">Focus</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="(point, index) in rows()" :key="`${point.timestamp || index}`" class="align-top">
            <td class="px-3 py-2 text-slate-700">{{ point.timestamp ? new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—' }}</td>
            <td class="px-3 py-2 text-slate-700">{{ point.latitude ?? '—' }}</td>
            <td class="px-3 py-2 text-slate-700">{{ point.longitude ?? '—' }}</td>
            <td class="px-3 py-2 text-slate-700">{{ point.speedKmh ?? '—' }}</td>
            <td class="px-3 py-2 text-right">
              <button
                type="button"
                class="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                @click="emit('focus-point', point)"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

