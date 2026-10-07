<template>
  <section class="space-y-6">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Offline sync</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Pending sync queue</h1>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-900">Queued submissions</h2>
        <button class="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Sync all</button>
      </div>

      <div class="space-y-3">
        <div v-for="item in pendingItems" :key="item.id" class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p class="font-medium text-slate-900">{{ item.name }}</p>
            <p class="text-xs text-slate-500">{{ item.meta }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{{ item.status }}</span>
            <button class="text-sm font-medium text-emerald-700 hover:text-emerald-600">Retry</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pendingItems = ref([
  { id: 1, name: 'Illegal dump cleanup entry', meta: 'Zone A · 8:40 AM', status: 'Queued' },
  { id: 2, name: 'Drain inspection note', meta: 'Zone C · 9:10 AM', status: 'Queued' },
  { id: 3, name: 'Safety checklist photo', meta: 'Shift 2 · 10:30 AM', status: 'Failed' },
]);
</script>
