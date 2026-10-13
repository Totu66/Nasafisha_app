<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DistanceBadge from './DistanceBadge.vue'

// Placeholder map area. Swap the inner <div> for the Google Map once
// providers/googleMaps.ts is ready (DA-011). The props will not change.
defineProps<{ distanceMeters: number | null }>()
const { t } = useI18n()
</script>

<template>
  <div class="relative h-64 overflow-hidden rounded border border-stone-200 bg-stone-100">
    <div class="flex h-full items-center justify-center text-sm text-stone-500">
      {{ t('field.detail.mapPlaceholder') }}
    </div>
    <div class="absolute bottom-2 left-2">
      <DistanceBadge :meters="distanceMeters" />
    </div>
  </div>
</template>