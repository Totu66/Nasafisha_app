<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from '../../i18n'
import TicketMapPreview from '@/components/tickets/TicketMapPreview.vue'
import TicketStatusChip from '@/components/tickets/TicketStatusChip.vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { distanceMeters, mapsDirectionsUrl } from '@/helpers/geo'
import { useTicketsStore } from '@/store/tickets.store'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useTicketsStore()
const { current: ticket, isLoading, hasError } = storeToRefs(store)
const { position, error: geoError, start } = useGeolocation()

const distance = computed(() =>
  ticket.value && position.value ? distanceMeters(position.value, ticket.value.location) : null,
)

onMounted(() => {
  store.loadOne(String(route.params.id))
  start()
})

function takeAfterPhoto() {
  router.push({ name: 'field-close-ticket', params: { id: String(route.params.id) } })
}
</script>

<template>
  <p v-if="isLoading" class="text-stone-600">{{ t('common.loading') }}</p>
  <p v-else-if="hasError || !ticket" role="alert" class="text-red-800">{{ t('common.loadError') }}</p>

  <section v-else>
    <div class="flex items-center gap-3">
      <h1 class="font-mono text-2xl font-bold text-green-900">{{ ticket.reference }}</h1>
      <TicketStatusChip :status="ticket.status" />
    </div>

    <div class="mt-4 grid gap-4 md:grid-cols-2">
      <TicketMapPreview :distance-meters="distance" />

      <div class="rounded border border-stone-200 bg-white p-4">
        <h2 class="text-lg font-semibold">{{ t(`issueType.${ticket.issueType}`) }}</h2>
        <p class="text-sm text-stone-700">
          {{ ticket.zone }}<template v-if="ticket.locationNote"> · {{ ticket.locationNote }}</template>
        </p>

        <p v-if="ticket.residentNote" class="mt-3 text-xs text-stone-500">
          {{ t('field.detail.residentNote', { note: ticket.residentNote }) }}
        </p>

        <figure class="mt-3">
          <img
            :src="ticket.beforePhotoUrl"
            :alt="t('field.detail.beforePhotoAlt')"
            class="w-full rounded border border-stone-200 object-cover"
          />
        </figure>

        <p v-if="geoError" role="alert" class="mt-3 rounded bg-amber-50 p-2 text-xs text-amber-900">
          {{ t(`field.detail.geo.${geoError}`) }}
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <a
            :href="mapsDirectionsUrl(ticket.location)"
            target="_blank"
            rel="noopener"
            class="rounded border border-green-800 px-3 py-2 text-sm text-green-800 hover:bg-green-50"
          >
            {{ t('field.detail.openMaps') }}
          </a>
          <button
            type="button"
            class="rounded bg-green-700 px-3 py-2 text-sm font-medium text-white"
            @click="takeAfterPhoto"
          >
            {{ t('field.detail.takeAfterPhoto') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>