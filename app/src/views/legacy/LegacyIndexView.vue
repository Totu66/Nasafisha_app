<script setup lang="ts">
import { RouterLink } from 'vue-router';

const links = [
  { to: '/legacy/dashboard', label: 'Dashboard' },
  { to: '/legacy/operations', label: 'Operations' },
  { to: '/legacy/fleet', label: 'Fleet' },
  { to: '/legacy/tickets', label: 'Tickets' },
  { to: '/legacy/dumping-sites', label: 'Dumping sites' },
  { to: '/legacy/accounts', label: 'Accounts' },
  { to: '/legacy/login', label: 'Login' },
  { to: '/legacy/landing', label: 'Landing' },
  { to: '/legacy/home', label: 'Home' },
  { to: '/legacy/details', label: 'Details' },
  { to: '/legacy/posts', label: 'Posts' },
  { to: '/legacy/pinia', label: 'Pinia test' },
  { to: '/legacy/api-test', label: 'API test' },
  { to: '/legacy/citizen-report', label: 'Citizen report' },
  { to: '/legacy/contractor-login', label: 'Contractor login' },
  { to: '/legacy/contractor-ledger', label: 'Contractor ledger' },
];
</script>

<template>
  <section class="mx-auto max-w-2xl space-y-6 p-8">
    <header>
      <h1 class="text-2xl font-bold text-slate-900">Legacy screens</h1>
      <p class="mt-1 text-sm text-slate-600">
        Old demo UI kept for reference. Not part of the live portals.
      </p>
    </header>

    <ul class="grid gap-2 sm:grid-cols-2">
      <li v-for="link in links" :key="link.to">
        <RouterLink
          :to="link.to"
          class="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-800"
        >
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>

    <RouterLink to="/" class="inline-block text-sm text-emerald-700 underline">
      Back to the live app
    </RouterLink>
  </section>
</template>
