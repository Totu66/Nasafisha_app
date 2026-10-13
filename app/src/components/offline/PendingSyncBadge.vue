<script setup lang="ts">
import { useFieldOpsI18n } from '../../composables/useFieldOpsI18n'

withDefaults(defineProps<{ attention?: boolean }>(), { attention: false })
const { t } = useFieldOpsI18n()
</script>

<template>
  <span
    class="inline-block rounded-full px-3 py-0.5 text-sm font-semibold"
    :class="attention ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'"
  >
    {{ attention ? t('sync.badgeAttention') : t('sync.badge') }}
  </span>
</template>
