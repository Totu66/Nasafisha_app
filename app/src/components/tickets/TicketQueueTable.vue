<script setup lang="ts">
import { useI18n } from '../../i18n'
import TicketStatusChip from './TicketStatusChip.vue'
import type { AdminTicketRow } from '@/types/ticketAdmin'

defineProps<{ rows: AdminTicketRow[] }>()
const { t } = useI18n()
</script>

<template>
  <div class="overflow-x-auto rounded border border-stone-200 bg-white">
    <table class="w-full text-left text-sm">
      <thead class="border-b border-stone-200 text-stone-600">
        <tr>
          <th class="p-3 font-semibold">{{ t('admin.tickets.reference') }}</th>
          <th class="p-3 font-semibold">{{ t('admin.tickets.type') }}</th>
          <th class="p-3 font-semibold">{{ t('admin.tickets.zone') }}</th>
          <th class="p-3 font-semibold">{{ t('admin.tickets.crew') }}</th>
          <th class="p-3 font-semibold">{{ t('admin.tickets.status') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-b border-stone-100 last:border-0 hover:bg-stone-50">
          <td class="p-3 font-mono">
            <RouterLink :to="{ name: 'admin-ticket-detail', params: { id: row.id } }" class="text-green-800 underline">
              {{ row.reference }}
            </RouterLink>
          </td>
          <td class="p-3">{{ t(`issueType.${row.issueType}`) }}</td>
          <td class="p-3">{{ row.zone }}</td>
          <td class="p-3">{{ row.crewLabel ?? '—' }}</td>
          <td class="p-3"><TicketStatusChip :status="row.status" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>