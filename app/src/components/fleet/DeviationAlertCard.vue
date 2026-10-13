<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DeviationAlert } from '@/types/deviationAlert'

defineProps<{ alert: DeviationAlert; isBusy: boolean }>()
const emit = defineEmits<{ (e: 'authorise', id: string): void }>()
const { t } = useI18n()
</script>

<template>
  <article class="grid gap-4 md:grid-cols-2">
    <!-- Placeholder until the Google map provider (DA-011) is ready. -->
    <div class="flex h-56 items-center justify-center rounded border border-stone-200 bg-stone-100 text-sm text-stone-500">
      {{ t('supervisor.alerts.mapPlaceholder') }}
    </div>

    <div class="rounded border border-stone-200 bg-white p-4">
      <h2 class="text-lg font-bold text-green-900">▲ {{ t('supervisor.alerts.title', { crew: alert.crewLabel }) }}</h2>
      <p class="mt-2 text-sm">
        {{ t('supervisor.alerts.body', { plate: alert.vehiclePlate, meters: alert.distanceMeters, minutes: alert.minutesOff }) }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <a
          v-if="alert.crewPhone"
          :href="`tel:${alert.crewPhone}`"
          class="rounded border border-green-800 px-3 py-2 text-sm text-green-800"
        >
          {{ t('supervisor.alerts.callCrew') }}
        </a>
        <button
          type="button"
          :disabled="isBusy"
          class="rounded bg-green-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          @click="emit('authorise', alert.id)"
        >
          {{ t('supervisor.alerts.authorise') }}
        </button>
      </div>

      <p class="mt-3 text-xs text-stone-500">
        {{ t('supervisor.alerts.help', { meters: alert.thresholdMeters, minutes: alert.thresholdMinutes }) }}
      </p>
    </div>
  </article>
</template>
