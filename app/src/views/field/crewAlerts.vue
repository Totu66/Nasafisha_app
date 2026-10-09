<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import DeviationAlertCard from '@/components/fleet/DeviationAlertCard.vue'
import { useSupervisorStore } from '@/store/supervisor.store'

const { t } = useI18n()
const store = useSupervisorStore()
const { alerts } = storeToRefs(store)
const busyId = ref<string | null>(null)
const failed = ref(false)

async function onAuthorise(id: string) {
  busyId.value = id
  failed.value = false
  try {
    await store.authorise(id)
  } catch {
    failed.value = true
  } finally {
    busyId.value = null
  }
}
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold text-green-900">{{ t('supervisor.alerts.pageTitle') }}</h1>

    <p v-if="failed" role="alert" class="mt-3 rounded bg-red-50 p-2 text-sm text-red-800">
      {{ t('supervisor.alerts.failed') }}
    </p>
    <p v-if="alerts.length === 0" class="mt-3 text-stone-600">{{ t('supervisor.alerts.empty') }}</p>

    <div class="mt-4 space-y-6">
      <DeviationAlertCard
        v-for="alert in alerts"
        :key="alert.id"
        :alert="alert"
        :is-busy="busyId === alert.id"
        @authorise="onAuthorise"
      />
    </div>
  </section>
</template>