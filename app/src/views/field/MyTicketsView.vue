<template>
  <section class="space-y-6">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">{{ t('field.myTickets.eyebrow') }}</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">{{ t('nav.tickets') }}</h1>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">{{ t('field.myTickets.assigned') }}</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">14</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">{{ t('status.inProgress') }}</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">06</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">{{ t('offline.pendingSync') }}</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">03</p>
      </div>
    </div>

    <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
      {{ t('field.myTickets.loading') }}
    </div>

    <div v-else-if="error" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      {{ error }}
    </div>

    <div v-else class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="grid grid-cols-5 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>{{ t('field.myTickets.table.ticket') }}</span>
        <span>{{ t('field.myTickets.table.zone') }}</span>
        <span>{{ t('field.myTickets.table.status') }}</span>
        <span>{{ t('field.myTickets.table.due') }}</span>
        <span>{{ t('field.myTickets.table.action') }}</span>
      </div>

      <div v-if="tickets.length === 0" class="px-5 py-6 text-sm text-slate-500">
        {{ t('field.myTickets.empty') }}
      </div>

      <div v-else class="divide-y divide-slate-200">
        <div v-for="ticket in tickets" :key="ticket.id" class="grid grid-cols-5 items-center gap-4 px-5 py-4 text-sm text-slate-700">
          <span class="font-medium text-slate-900">{{ t(ticket.name) }}</span>
          <span>{{ ticket.zone }}</span>
          <span>
            <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(ticket.status)">{{ statusText(ticket.status) }}</span>
          </span>
          <span>{{ t(ticket.due) }}</span>
          <button class="text-left text-emerald-700 hover:text-emerald-600">{{ t('field.myTickets.open') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ticketsApi from '../../api/tickets.api';
import { useI18n } from '../../i18n';

const { t } = useI18n();

const tickets = ref<Array<{ id: number; name: string; zone: string; status: string; due: string }>>([]);
const loading = ref(true);
const error = ref('');

const STATUS_KEYS: Record<string, string> = {
  Assigned: 'field.myTickets.statuses.assigned',
  'In progress': 'status.inProgress',
  Pending: 'field.myTickets.statuses.pending',
};

const fallbackTickets = [
  { id: 1, name: 'field.myTickets.samples.illegalDump', zone: 'Zone A', status: 'Assigned', due: 'field.myTickets.due.today' },
  { id: 2, name: 'field.myTickets.samples.drainBlockage', zone: 'Zone C', status: 'In progress', due: 'field.myTickets.due.tomorrow' },
  { id: 3, name: 'field.myTickets.samples.overflowingBin', zone: 'Zone B', status: 'Pending', due: 'field.myTickets.due.twoDays' },
] as const;

onMounted(async () => {
  try {
    loading.value = true;
    error.value = '';
    tickets.value = await ticketsApi.list();
  } catch {
    error.value = t('field.myTickets.loadError');
    tickets.value = [...fallbackTickets];
  } finally {
    loading.value = false;
  }
});

const statusClass = (status: string) => {
  if (status === 'In progress') return 'bg-sky-100 text-sky-700';
  if (status === 'Pending') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
};

const statusText = (status: string) => {
  if (STATUS_KEYS[status]) return t(STATUS_KEYS[status]);
  return status;
};
</script>
