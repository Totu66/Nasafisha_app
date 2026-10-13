<template>
  <section class="space-y-6">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Citizen portal</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Welcome back</h1>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <router-link to="/citizen/report-new" class="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          </span>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">Report an issue</h2>
            <p class="text-sm text-slate-500">Report dumping, blocked drains or hazards</p>
          </div>
        </div>
      </router-link>

      <router-link to="/citizen/reports" class="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </span>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">My reports</h2>
            <p class="text-sm text-slate-500">Track the status of your submissions</p>
          </div>
        </div>
      </router-link>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-900">Recent activity</h2>
      <p class="mt-4 text-sm text-slate-500">No recent activity.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
