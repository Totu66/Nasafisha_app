<template>
  <section class="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Citizen reporting</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Report an issue</h1>
    </div>

    <form class="space-y-5">
      <div class="grid gap-5 md:grid-cols-2">
        <label class="space-y-2 text-sm font-medium text-slate-700">
          <span>Issue type</span>
          <select class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500">
            <option>Illegal dumping</option>
            <option>Blocked drain</option>
            <option>Overfilled bin</option>
            <option>Public health issue</option>
          </select>
        </label>

        <label class="space-y-2 text-sm font-medium text-slate-700">
          <span>Priority</span>
          <select class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500">
            <option>Low</option>
            <option selected>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </label>
      </div>

      <label class="space-y-2 text-sm font-medium text-slate-700">
        <span>Location</span>
        <input value="Kibera, Nairobi" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500" />
      </label>

      <label class="space-y-2 text-sm font-medium text-slate-700">
        <span>Description</span>
        <textarea rows="5" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500">Large piles of waste are blocking the roadside and attracting pests.</textarea>
      </label>

      <div class="flex items-center justify-between pt-2">
        <button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Save draft</button>
        <button type="submit" class="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500">Submit report</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
</script>
