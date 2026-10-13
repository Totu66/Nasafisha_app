<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Citizen portal</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">My reports</h1>
      </div>
      <router-link to="/citizen/report-new" class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
        New report
      </router-link>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Open reports</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">12</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Resolved</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">38</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Avg. response</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">2.1d</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="grid grid-cols-5 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Issue</span>
        <span>Location</span>
        <span>Status</span>
        <span>Updated</span>
        <span>Action</span>
      </div>

      <div class="divide-y divide-slate-200">
        <div v-for="report in reports" :key="report.id" class="grid grid-cols-5 items-center gap-4 px-5 py-4 text-sm text-slate-700">
          <span class="font-medium text-slate-900">{{ report.title }}</span>
          <span>{{ report.location }}</span>
          <span>
            <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(report.status)">{{ report.status }}</span>
          </span>
          <span>{{ report.updated }}</span>
          <button class="text-left text-emerald-700 hover:text-emerald-600">View</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import reportsApi from '../../api/reports.api';

const reports = ref([] as any[]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    reports.value = await reportsApi.list();
  } catch (err) {
    // fallback: keep some defaults when API is unavailable
    error.value = 'Could not load reports, showing cached data.';
    reports.value = [
      { id: 1, title: 'Illegal dumping', location: 'Kibera', status: 'In review', updated: '2 hours ago' },
      { id: 2, title: 'Blocked drain', location: 'Mikocheni', status: 'Assigned', updated: 'Today' },
      { id: 3, title: 'Overflowing bin', location: 'Kisumu', status: 'Resolved', updated: '2 days ago' },
    ];
  } finally {
    loading.value = false;
  }
});

const statusClass = (status: string) => {
  if (status === 'Resolved') return 'bg-emerald-100 text-emerald-700';
  if (status === 'Assigned') return 'bg-amber-100 text-amber-700';
  return 'bg-sky-100 text-sky-700';
};
</script>
