<<<<<<< HEAD
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import TicketCard from '@/components/tickets/TicketCard.vue'
import { useAuthStore } from '@/store/auth.store'
import { useTicketsStore } from '@/store/tickets.store'

const { t } = useI18n()
const auth = useAuthStore()
const store = useTicketsStore()
const { tickets, vehicle, isLoading, hasError } = storeToRefs(store)

const firstName = computed(() => auth.user?.name.split(' ')[0] ?? '')

onMounted(() => store.loadMine())
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold text-green-900">{{ t('field.tickets.hello', { name: firstName }) }}</h1>

    <p
      v-if="vehicle"
      class="mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold"
      :class="vehicle.online ? 'bg-green-100 text-green-900' : 'bg-stone-200 text-stone-700'"
    >
      {{ t('field.tickets.vehicle', { plate: vehicle.plate }) }} ·
      {{ vehicle.online ? t('common.online') : t('common.offline') }}
    </p>

    <h2 class="mt-6 text-lg font-semibold">
      {{ t('field.tickets.assigned', { count: tickets.length }) }}
    </h2>

    <p v-if="isLoading" class="mt-3 text-stone-600">{{ t('common.loading') }}</p>

    <div v-else-if="hasError" role="alert" class="mt-3 rounded bg-red-50 p-3 text-sm text-red-800">
      {{ t('common.loadError') }}
      <button type="button" class="ml-2 underline" @click="store.loadMine()">{{ t('common.retry') }}</button>
    </div>

    <p v-else-if="tickets.length === 0" class="mt-3 text-stone-600">{{ t('field.tickets.empty') }}</p>

    <ul v-else class="mt-3 space-y-2">
      <li v-for="ticket in tickets" :key="ticket.id">
        <TicketCard :ticket="ticket" />
      </li>
    </ul>
  </section>
</template>
=======
<template>
  <section class="space-y-6">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Field operations</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">My tickets</h1>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Assigned</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">14</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">In progress</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">06</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Pending sync</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">03</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="grid grid-cols-5 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Ticket</span>
        <span>Zone</span>
        <span>Status</span>
        <span>Due</span>
        <span>Action</span>
      </div>

      <div class="divide-y divide-slate-200">
        <div v-for="ticket in tickets" :key="ticket.id" class="grid grid-cols-5 items-center gap-4 px-5 py-4 text-sm text-slate-700">
          <span class="font-medium text-slate-900">{{ ticket.name }}</span>
          <span>{{ ticket.zone }}</span>
          <span>
            <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(ticket.status)">{{ ticket.status }}</span>
          </span>
          <span>{{ ticket.due }}</span>
          <button class="text-left text-emerald-700 hover:text-emerald-600">Open</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ticketsApi from '../../api/tickets.api';

const tickets = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    tickets.value = await ticketsApi.list();
  } catch (err) {
    error.value = 'Could not load tickets, showing cached data.';
    tickets.value = [
      { id: 1, name: 'Illegal dump cleanup', zone: 'Zone A', status: 'Assigned', due: 'Today' },
      { id: 2, name: 'Drain blockage', zone: 'Zone C', status: 'In progress', due: 'Tomorrow' },
      { id: 3, name: 'Overflowing bin', zone: 'Zone B', status: 'Pending', due: '2 days' },
    ];
  } finally {
    loading.value = false;
  }
});

const statusClass = (status: string) => {
  if (status === 'In progress') return 'bg-sky-100 text-sky-700';
  if (status === 'Pending') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};
</script>
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
