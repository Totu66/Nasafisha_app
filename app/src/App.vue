<template>
  <div class="min-h-screen bg-slate-100 text-slate-800">
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">N</div>
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Nasafisha</p>
            <p class="text-sm font-semibold">Waste operations dashboard</p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-sm font-medium">
          <router-link class="rounded-full px-3 py-2 hover:bg-slate-100" to="/admin">Admin</router-link>
          <router-link class="rounded-full px-3 py-2 hover:bg-slate-100" to="/citizen/reports">Citizen</router-link>
          <router-link class="rounded-full px-3 py-2 hover:bg-slate-100" to="/field/tickets">Field</router-link>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>
