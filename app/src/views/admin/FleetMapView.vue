<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useFleetStore } from '@/store/fleet.store';
import VehicleStatusCard from '@/components/fleet/VehicleStatusCard.vue';

const fleet = useFleetStore();

const selectedVehicle = computed(() => fleet.selectedVehicle);
const vehicles = computed(() => fleet.filteredVehicles);
const summary = computed(() => ({
  vehicles: vehicles.value.length,
  stale: fleet.staleVehicles.length,
  dark: fleet.darkVehicles.length,
  deviations: fleet.activeDeviations.length,
}));

onMounted(() => {
  fleet.fetchVehicles();
  fleet.startLivePolling();
});

onBeforeUnmount(() => {
  fleet.stopLivePolling();
});

const handleVehicleSelect = async (vehicleId: string) => {
  fleet.selectVehicle(vehicleId);
  await fleet.fetchHistory(vehicleId);
  await fleet.fetchPlannedRoute(vehicleId);
};

const handleAcknowledgeStale = async (vehicleId: string) => {
  await fleet.acknowledgeStale(vehicleId, 'field-supervisor');
};
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto max-w-7xl space-y-6">
      <header class="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Operations</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900">Fleet tracking</h1>
        </div>
        <div class="flex flex-wrap gap-3 text-sm text-slate-700">
          <span class="rounded-full bg-slate-100 px-3 py-1.5 font-medium">{{ summary.vehicles }} vehicles</span>
          <span class="rounded-full bg-amber-100 px-3 py-1.5 font-medium text-amber-700">{{ summary.stale }} stale</span>
          <span class="rounded-full bg-violet-100 px-3 py-1.5 font-medium text-violet-700">{{ summary.dark }} dark</span>
          <span class="rounded-full bg-rose-100 px-3 py-1.5 font-medium text-rose-700">{{ summary.deviations }} deviations</span>
        </div>
      </header>

      <div v-if="fleet.state.isDataUnavailable" class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Live fleet data is currently unavailable. Showing last known vehicle state until the feed resumes.
      </div>

      <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Map</p>
              <h2 class="text-lg font-semibold text-slate-900">Live fleet overview</h2>
            </div>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Updated {{ fleet.state.lastUpdatedAt ? new Date(fleet.state.lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—' }}
            </span>
          </div>

          <div class="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
            Map view is not available in this environment, so the live fleet list is shown below for operational monitoring.
          </div>
        </div>

        <aside class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Selected vehicle</p>
            <h3 class="mt-2 text-xl font-semibold text-slate-900">
              {{ selectedVehicle?.plateNumber || selectedVehicle?.id || 'No vehicle selected' }}
            </h3>
            <p class="mt-2 text-sm text-slate-600">
              {{ selectedVehicle?.zoneName || 'Unassigned zone' }} · {{ selectedVehicle?.status ? selectedVehicle.status.replace('_', ' ') : 'No status' }}
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Status</p>
            <ul class="mt-3 space-y-2 text-sm text-slate-700">
              <li class="flex items-center justify-between"><span>Live</span><strong>{{ vehicles.filter((vehicle) => !vehicle.isStale).length }}</strong></li>
              <li class="flex items-center justify-between"><span>Stale</span><strong>{{ summary.stale }}</strong></li>
              <li class="flex items-center justify-between"><span>Dark</span><strong>{{ summary.dark }}</strong></li>
              <li class="flex items-center justify-between"><span>Deviation alerts</span><strong>{{ summary.deviations }}</strong></li>
            </ul>
          </div>
        </aside>
      </section>

      <section class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <VehicleStatusCard
          v-for="vehicle in vehicles"
          :key="vehicle.id"
          :vehicle="vehicle"
          :selected="selectedVehicle?.id === vehicle.id"
          @select="handleVehicleSelect"
          @acknowledge-stale="handleAcknowledgeStale"
        />
      </section>
    </div>
  </main>
</template>

