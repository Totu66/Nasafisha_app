<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TicketStatusChip from './TicketStatusChip.vue'
import type { Ticket } from '@/types/ticket'

defineProps<{ ticket: Ticket }>()
const { t } = useI18n()
</script>

<template>
  <RouterLink
    :to="{ name: 'field-ticket-detail', params: { id: ticket.id } }"
    class="flex items-center justify-between rounded border border-stone-200 bg-white p-3 hover:bg-stone-50"
  >
    <div>
      <p class="font-mono text-sm font-semibold">{{ ticket.reference }}</p>
      <p class="text-sm text-stone-600">
        {{ t(`issueType.${ticket.issueType}`) }} · {{ ticket.zone }}
      </p>
    </div>
    <TicketStatusChip :status="ticket.status" />
  </RouterLink>
</template>