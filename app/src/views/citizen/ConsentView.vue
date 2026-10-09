 FE-019 is CHEGE's task. This is a small working version so the flow runs end to end —
  Chege replaces the design, but must keep the one important line:  auth.acceptConsent()
  (SRS §8.2: plain-language consent at first use, BEFORE the first report.)
-->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function allow() {
  auth.acceptConsent()
  const next = typeof route.query.next === 'string' ? route.query.next : '/home'
  await router.replace(next)
}
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
    <h1 class="text-2xl font-bold">Two things we need to see your report</h1>
    <div class="rounded-lg border border-stone-200 bg-white p-3">
      <p class="font-semibold">Camera</p>
      <p class="text-sm text-stone-500">To photograph the waste.</p>
    </div>
    <div class="rounded-lg border border-stone-200 bg-white p-3">
      <p class="font-semibold">Your location</p>
      <p class="text-sm text-stone-500">
        So the crew finds the exact spot. Only used when you send a report.
      </p>
    </div>
    <button type="button" class="rounded-lg bg-green-700 py-3 font-semibold text-white" @click="allow">
      Allow and continue
    </button>
  </main>
</template>
