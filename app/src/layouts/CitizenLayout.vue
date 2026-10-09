<!--
  The frame around the logged-in citizen screens: the top bar (wireframe: NASAFISHA + Home |
  My reports), the offline banner, then whichever screen the route shows (<RouterView />).
  It also starts the automatic sending of queued reports (FE-003) — once.
  Not here yet (other people's tasks): the "Help" link and the EN | sw language switch (FE-018, Sylvia).
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import OfflineBanner from '@/components/offline/OfflineBanner.vue'
import { startAutoSync } from '@/offline/syncManager'

onMounted(startAutoSync)

const links = [
  { label: 'Home', to: { name: 'citizen-home' } },
  { label: 'My reports', to: { name: 'citizen-my-reports' } },
]
</script>

<template>
  <div class="min-h-screen bg-[#f8f1e4]">
    <header class="border-b border-stone-200 bg-white">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <span class="text-sm font-extrabold tracking-wide">NASAFISHA</span>
        <nav class="flex gap-1 text-sm" aria-label="Main">
          <router-link
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="rounded px-2 py-1"
            active-class="bg-green-100 font-semibold text-green-900"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </div>
    </header>
    <OfflineBanner />
    <RouterView />
  </div>
</template>
