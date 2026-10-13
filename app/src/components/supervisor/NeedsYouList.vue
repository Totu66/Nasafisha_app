<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

export interface NeedsYouItem {
  key: string
  label: string // already translated
  to: RouteLocationRaw
}

defineProps<{ items: NeedsYouItem[] }>()
</script>

<template>
  <ul class="space-y-2">
    <li v-for="item in items" :key="item.key">
      <RouterLink
        :to="item.to"
        class="block rounded border border-stone-200 bg-white p-3 text-sm font-semibold hover:bg-stone-50"
      >
        {{ item.label }}
      </RouterLink>
    </li>
  </ul>
</template>