<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TicketStatus } from '@/types/ticket'

const props = defineProps<{ status: TicketStatus }>()
const { t } = useI18n()

const STYLES: Record<TicketStatus, string> = {
  assigned: 'bg-stone-200 text-stone-800',
  in_progress: 'bg-amber-100 text-amber-900',
  closing: 'bg-blue-100 text-blue-900',
  resolved: 'bg-green-100 text-green-900',
  blocked: 'bg-red-100 text-red-900',
}
const classes = computed(() => STYLES[props.status])
</script>

<template>
  <span class="rounded-full px-2 py-0.5 text-xs font-semibold" :class="classes">
    {{ t(`ticketStatus.${status}`) }}
  </span>
</template>