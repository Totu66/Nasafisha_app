<script setup lang="ts">
import { useI18n } from '../../i18n'

defineProps<{ distanceMeters: number; limitMeters: number }>()
const { t } = useI18n()
</script>

<template>
  <div role="alert" class="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
    <p class="font-semibold">▲ {{ t('field.closure.mismatchTitle', { meters: distanceMeters }) }}</p>
    <p class="mt-1">{{ t('field.closure.mismatchBody', { limit: limitMeters }) }}</p>
  </div>
</template>