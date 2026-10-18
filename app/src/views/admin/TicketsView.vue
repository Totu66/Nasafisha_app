<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from '../../i18n'
import TicketQueueTable from '@/components/tickets/TicketQueueTable.vue'
import { useAdminTicketsStore } from '@/store/adminTickets.store'
import type { AdminTicketRow } from '@/types/ticketAdmin'

type Tab = 'all' | 'open' | 'awaiting' | 'resolved'

const { t } = useI18n()
const store = useAdminTicketsStore()
const { rows, isLoading, hasError } = storeToRefs(store)

const TABS: Tab[] = ['all', 'open', 'awaiting', 'resolved']
const FILTERS: Record<Tab, (r: AdminTicketRow) => boolean> = {
  all: () => true,
  open: (r) => r.status !== 'resolved',
  awaiting: (r) => r.status === 'closing', // a closing request waiting for a supervisor
  resolved: (r) => r.status === 'resolved',
}

const tab = ref<Tab>('all')
const visibleRows = computed(() => rows.value.filter(FILTERS[tab.value]))

onMounted(() => store.loadRows())
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold text-green-900">{{ t('admin.tickets.title') }}</h1>

    <div class="mt-3 flex gap-2" role="tablist">
      <button
        v-for="item in TABS"
        :key="item"
        type="button"
        role="tab"
        :aria-selected="tab === item"
        class="rounded-full border px-3 py-1 text-sm"
        :class="tab === item ? 'border-green-800 bg-green-800 text-white' : 'border-stone-300 text-stone-700'"
        @click="tab = item"
      >
        {{ t(`admin.tickets.tabs.${item}`) }}
      </button>
    </div>

    <p v-if="isLoading" class="mt-4 text-stone-600">{{ t('common.loading') }}</p>
    <div v-else-if="hasError" role="alert" class="mt-4 rounded bg-red-50 p-3 text-sm text-red-800">
      {{ t('common.loadError') }}
      <button type="button" class="ml-2 underline" @click="store.loadRows()">{{ t('common.retry') }}</button>
    </div>
    <p v-else-if="visibleRows.length === 0" class="mt-4 text-stone-600">{{ t('admin.tickets.empty') }}</p>
    <div v-else class="mt-4"><TicketQueueTable :rows="visibleRows" /></div>
  </section>
</template>
