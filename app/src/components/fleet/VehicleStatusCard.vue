<script setup lang="ts">
const props = defineProps<{
  vehicle: Record<string, any> | null;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (_event: 'select', _vehicleId: string): void;
  (_event: 'acknowledge-stale', _vehicleId: string): void;
}>();

const statusText = (status: string) => {
  switch (status) {
    case 'en_route':
      return 'En route';
    case 'servicing':
      return 'Servicing';
    case 'idle':
      return 'Idle';
    default:
      return 'Unknown';
  }
};

const statusClasses = (status: string) => {
  switch (status) {
    case 'en_route':
      return 'bg-emerald-100 text-emerald-700';
    case 'servicing':
      return 'bg-amber-100 text-amber-700';
    case 'idle':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const staleClasses = (vehicle: Record<string, any> | null) => {
  if (!vehicle) return 'bg-slate-100 text-slate-700';
  if (vehicle.isStale) return 'bg-rose-100 text-rose-700';
  if (vehicle.darkAlert) return 'bg-violet-100 text-violet-700';
  return 'bg-emerald-100 text-emerald-700';
};

const handleSelect = () => {
  if (props.vehicle?.id) emit('select', props.vehicle.id);
};

const handleAcknowledge = () => {
  if (props.vehicle?.id) emit('acknowledge-stale', props.vehicle.id);
};
</script>

<template>
  <button
    type="button"
    class="w-full rounded-2xl border text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    :class="selected ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'"
    @click="handleSelect"
  >
    <div class="flex items-start justify-between gap-4 p-4">
      <div>
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Vehicle</p>
        <h3 class="mt-1 text-lg font-semibold text-slate-900">{{ vehicle?.plateNumber || vehicle?.id || 'Unknown vehicle' }}</h3>
        <p class="mt-1 text-sm text-slate-600">{{ vehicle?.driverName || 'No driver assigned' }}</p>
      </div>

      <div class="flex flex-col items-end gap-2">
        <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="statusClasses(vehicle?.status || 'idle')">
          {{ statusText(vehicle?.status || 'idle') }}
        </span>
        <span class="rounded-full px-2.5 py-1 text-[11px] font-medium" :class="staleClasses(vehicle)">
          {{ vehicle?.isStale ? 'Stale' : vehicle?.darkAlert ? 'Dark' : 'Live' }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-slate-500">Zone</p>
        <p class="mt-1 font-medium text-slate-800">{{ vehicle?.zoneName || 'Unassigned' }}</p>
      </div>
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-slate-500">Last report</p>
        <p class="mt-1 font-medium text-slate-800">{{ vehicle?.lastReportedAt ? new Date(vehicle.lastReportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—' }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between border-t border-slate-200 px-4 py-3">
      <span class="text-sm text-slate-600">{{ vehicle?.speedKmh ? `${vehicle.speedKmh} km/h` : 'Speed unavailable' }}</span>
      <button
        v-if="vehicle?.isStale"
        type="button"
        class="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        @click.stop="handleAcknowledge"
      >
        Acknowledge
      </button>
    </div>
  </button>
</template>

