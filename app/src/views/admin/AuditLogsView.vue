<template>
  <main class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto max-w-6xl space-y-6">
      <header class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Security</p>
        <h1 class="mt-2 text-2xl font-bold text-slate-900">Audit logs</h1>
        <p class="mt-2 text-sm text-slate-600">Sign-ins, role changes and privileged actions.</p>
      </header>

      <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-3">Time</th>
              <th class="px-5 py-3">User</th>
              <th class="px-5 py-3">Action</th>
              <th class="px-5 py-3">Detail</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="entry in entries" :key="entry.id">
              <td class="whitespace-nowrap px-5 py-3 text-slate-500">{{ entry.time }}</td>
              <td class="px-5 py-3 font-medium">{{ entry.user }}</td>
              <td class="px-5 py-3">{{ entry.action }}</td>
              <td class="px-5 py-3 text-slate-500">{{ entry.detail }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="entries.length === 0" class="p-6 text-sm text-slate-500">No audit entries yet.</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const entries = [
  { id: 1, time: 'Today 09:12', user: 'ops-admin', action: 'Sign in', detail: 'Password (ip 127.0.0.1)' },
  { id: 2, time: 'Today 08:55', user: 'supervisor', action: 'Ticket reassigned', detail: 'TKT-1042 → crew 12' },
  { id: 3, time: 'Yesterday 17:40', user: 'ops-admin', action: 'Role changed', detail: 'field → supervisor' },
];
</script>
