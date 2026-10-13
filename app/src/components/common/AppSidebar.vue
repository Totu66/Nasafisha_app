<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { NavItem } from '@/config/adminNav'

defineProps<{ items: NavItem[] }>()
const { t } = useI18n()
</script>

<template>
  <nav aria-label="Main" class="w-56 shrink-0 border-r border-stone-200 bg-white p-3">
    <ul class="space-y-1">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="block rounded px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
          active-class="bg-green-50 font-semibold text-green-900"
        >
          {{ t(item.labelKey) }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>