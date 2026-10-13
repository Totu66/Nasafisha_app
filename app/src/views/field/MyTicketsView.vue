<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import TicketCard from '@/components/tickets/TicketCard.vue'
import { useAuthStore } from '@/store/auth.store'
import { useTicketsStore } from '@/store/tickets.store'

const { t } = useI18n()
const auth = useAuthStore()
const store = useTicketsStore()
const { tickets, vehicle, isLoading, hasError } = storeToRefs(store)

const firstName = computed(() => auth.user?.name.split(' ')[0] ?? '')

onMounted(() => store.loadMine())
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold text-green-900">{{ t('field.tickets.hello', { name: firstName }) }}</h1>

    <p
      v-if="vehicle"
      class="mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold"
      :class="vehicle.online ? 'bg-green-100 text-green-900' : 'bg-stone-200 text-stone-700'"
    >
      {{ t('field.tickets.vehicle', { plate: vehicle.plate }) }} ·
      {{ vehicle.online ? t('common.online') : t('common.offline') }}
    </p>

    <h2 class="mt-6 text-lg font-semibold">
      {{ t('field.tickets.assigned', { count: tickets.length }) }}
    </h2>

    <p v-if="isLoading" class="mt-3 text-stone-600">{{ t('common.loading') }}</p>

    <div v-else-if="hasError" role="alert" class="mt-3 rounded bg-red-50 p-3 text-sm text-red-800">
      {{ t('common.loadError') }}
      <button type="button" class="ml-2 underline" @click="store.loadMine()">{{ t('common.retry') }}</button>
    </div>

    <p v-else-if="tickets.length === 0" class="mt-3 text-stone-600">{{ t('field.tickets.empty') }}</p>

    <ul v-else class="mt-3 space-y-2">
      <li v-for="ticket in tickets" :key="ticket.id">
        <TicketCard :ticket="ticket" />
      </li>
    </ul>
  </section>
</template>
