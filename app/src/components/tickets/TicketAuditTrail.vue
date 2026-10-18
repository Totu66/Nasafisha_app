<script setup lang="ts">
import { useI18n } from '../../i18n'
import { formatTime } from '@/helpers/date'
import type { TicketAuditEntry } from '@/types/ticketAdmin'

defineProps<{ entries: TicketAuditEntry[] }>()
const { t } = useI18n()
</script>

<template>
  <ol class="space-y-2 text-sm">
    <li v-for="entry in entries" :key="entry.id" class="flex gap-3">
      <time class="w-12 shrink-0 font-mono text-stone-500" :datetime="entry.at">{{ formatTime(entry.at) }}</time>
      <span>
        {{ t(`admin.audit.${entry.kind}`) }} · {{ entry.actor }}
        <template v-if="entry.detail"> — {{ entry.detail }}</template>
      </span>
    </li>
  </ol>
</template>