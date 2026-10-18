<script setup lang="ts">
import { useI18n } from '../../i18n'

defineProps<{ isOnline: boolean; pendingCount: number }>()
const { t } = useI18n()
</script>

<template>
  <p
    v-if="!isOnline || pendingCount > 0"
    role="status"
    class="inline-block rounded bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900"
  >
    ⚠
    <template v-if="!isOnline">{{ t('offline.offlinePrefix') }} </template>
    {{ t('offline.waiting', pendingCount) }}
  </p>
</template>