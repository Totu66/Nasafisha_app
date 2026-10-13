<script setup lang="ts">
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <header class="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
      <span class="font-bold text-green-900">NASAFISHA</span>
      <LanguageSwitcher />
    </header>
    <main class="mx-auto mt-10 w-full max-w-md px-4">
      <RouterView />
    </main>
  </div>
</template>
