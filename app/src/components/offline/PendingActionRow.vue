<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../../i18n'
import type { QueuedAction } from '@/types/offline'

const props = defineProps<{ action: QueuedAction }>()
const { t } = useI18n()

const STYLES = {
  pending: 'bg-amber-100 text-amber-900',
  sent: 'bg-green-100 text-green-900',
  failed: 'bg-red-100 text-red-900',
} as const
const chipClass = computed(() => STYLES[props.action.status])
</script>

<template>
  <div class="flex items-center justify-between rounded border border-stone-200 bg-white p-3">
    <div>
      <p class="font-mono text-sm font-semibold">{{ action.reference }}</p>
      <p class="text-sm text-stone-600">{{ action.summary }}</p>
    </div>
    <span class="rounded-full px-2 py-0.5 text-xs font-semibold" :class="chipClass">
      <template v-if="action.status === 'sent'">✓ </template>{{ t(`offline.status.${action.status}`) }}
    </span>
  </div>
</template>