<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useFleetStore } from '@/store/fleet.store';
import DeviationAlertCard from '@/components/fleet/DeviationAlertCard.vue';

const fleet = useFleetStore();
const alerts = computed(() => fleet.state.deviations || []);

onMounted(async () => {
  await fleet.fetchDeviations();
});

const handleSelect = async (alertId: string) => {
  const alert = alerts.value.find((entry) => entry.id === alertId);
  if (alert?.vehicleId) {
    fleet.selectVehicle(alert.vehicleId);
  }
};

const handleAuthorise = async (alertId: string) => {
  await fleet.authoriseDeviation(alertId, 'ops-admin');
};
</script>

<template>
  <main class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto max-w-6xl space-y-6">
      <header class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Compliance</p>
        <h1 class="mt-2 text-2xl font-bold text-slate-900">Deviation alerts</h1>
      </header>

      <section v-if="fleet.state.loading.deviations" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Loading deviation alerts…
      </section>

      <section v-else class="grid gap-4 lg:grid-cols-2">
        <DeviationAlertCard
          v-for="alert in alerts"
          :key="alert.id"
          :alert="alert"
          :can-authorise="alert.status === 'active'"
          @select="handleSelect"
          @authorise="handleAuthorise"
          @view-trail="async (alertId) => fleet.fetchDeviationTrail(alertId)"
        />
      </section>
    </div>
  </main>
</template>

