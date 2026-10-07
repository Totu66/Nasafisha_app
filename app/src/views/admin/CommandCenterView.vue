<template>
  <section class="space-y-6">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Operations overview</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Command center</h1>
    </div>

    <div class="grid gap-4 md:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Open incidents</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">148</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Collections</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">84%</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Fleet on route</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">26</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Safety alerts</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">07</p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Service performance</h2>
        <div class="mt-5 space-y-4">
          <div>
            <div class="mb-1 flex items-center justify-between text-sm text-slate-600">
              <span>Waste collection completion</span>
              <span>84%</span>
            </div>
            <div class="h-2.5 rounded-full bg-slate-100">
              <div class="h-full w-[84%] rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div>
            <div class="mb-1 flex items-center justify-between text-sm text-slate-600">
              <span>Route adherence</span>
              <span>76%</span>
            </div>
            <div class="h-2.5 rounded-full bg-slate-100">
              <div class="h-full w-[76%] rounded-full bg-sky-500"></div>
            </div>
          </div>
          <div>
            <div class="mb-1 flex items-center justify-between text-sm text-slate-600">
              <span>Compliance rate</span>
              <span>91%</span>
            </div>
            <div class="h-2.5 rounded-full bg-slate-100">
              <div class="h-full w-[91%] rounded-full bg-violet-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Priority queue</h2>
        <ul class="mt-5 space-y-3 text-sm text-slate-600">
          <li class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Illegal dumping hotspot</span><span class="font-semibold text-amber-600">High</span></li>
          <li class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Drain blockage</span><span class="font-semibold text-red-600">Critical</span></li>
          <li class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Fleet deviation</span><span class="font-semibold text-sky-600">Medium</span></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
