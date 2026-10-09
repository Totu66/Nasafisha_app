<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import ClosureEvidencePair from '@/components/tickets/ClosureEvidencePair.vue'
import TicketAuditTrail from '@/components/tickets/TicketAuditTrail.vue'
import TicketStatusChip from '@/components/tickets/TicketStatusChip.vue'
import { formatTime } from '@/helpers/date'
import { useAdminTicketsStore } from '@/store/adminTickets.store'

const { t } = useI18n()
const route = useRoute()
const store = useAdminTicketsStore()
const { detail, isLoading, hasError } = storeToRefs(store)

onMounted(() => store.loadDetail(String(route.params.id)))
</script>

<template>
  <RouterLink :to="{ name: 'admin-tickets' }" class="text-sm text-green-800 underline">
    ← {{ t('admin.ticketDetail.back') }}
  </RouterLink>

  <p v-if="isLoading" class="mt-4 text-stone-600">{{ t('common.loading') }}</p>
  <p v-else-if="hasError || !detail" role="alert" class="mt-4 text-red-800">{{ t('common.loadError') }}</p>

  <section v-else class="mt-3">
    <div class="flex items-center gap-3">
      <h1 class="font-mono text-2xl font-bold text-green-900">{{ detail.reference }}</h1>
      <TicketStatusChip :status="detail.status" />
    </div>

    <p v-if="detail.distanceMeters" class="mt-2 text-sm font-semibold">
      {{ t('admin.ticketDetail.distance', { meters: detail.distanceMeters }) }}
    </p>
    <p v-if="detail.status === 'closing'" class="mt-1 text-sm text-stone-700">
      {{ t('admin.ticketDetail.pending', { name: detail.requestedByName, crew: detail.crewLabel }) }}
    </p>

    <div class="mt-4">
      <ClosureEvidencePair
        :before-url="detail.beforePhotoUrl"
        :before-time="formatTime(detail.beforeAt)"
        :after-url="detail.afterPhotoUrl"
        :after-time="detail.afterAt ? formatTime(detail.afterAt) : null"
      />
    </div>

    <h2 class="mt-6 text-lg font-semibold">{{ t('admin.ticketDetail.audit') }}</h2>
    <div class="mt-2 rounded border border-stone-200 bg-white p-4">
      <TicketAuditTrail :entries="detail.audit" />
    </div>
  </section>
</template>