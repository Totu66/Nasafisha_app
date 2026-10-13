<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import OfflineBanner from '@/components/offline/OfflineBanner.vue'
import PendingActionRow from '@/components/offline/PendingActionRow.vue'
import { useOfflineQueue } from '@/composables/useOfflineQueue'
import { useOnlineStatus } from '@/composables/useOnlineStatus'

const { t } = useI18n()
const { isOnline } = useOnlineStatus()
const { actions, pendingCount, isSyncing, syncNow } = useOfflineQueue()
</script>

<template>
  <section>
    <OfflineBanner :is-online="isOnline" :pending-count="pendingCount" />

    <h1 class="mt-2 text-2xl font-bold text-green-900">{{ t('field.doneToday.title') }}</h1>

    <p v-if="actions.length === 0" class="mt-3 text-stone-600">{{ t('field.doneToday.empty') }}</p>

    <ul v-else class="mt-3 space-y-2">
      <li v-for="action in actions" :key="action.id">
        <PendingActionRow :action="action" />
      </li>
    </ul>

    <p v-if="pendingCount > 0" class="mt-3 text-sm text-stone-600">{{ t('field.doneToday.help') }}</p>

    <button
      v-if="pendingCount > 0"
      type="button"
      :disabled="isSyncing || !isOnline"
      class="mt-3 rounded bg-green-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      @click="syncNow"
    >
      {{ t('field.doneToday.trySending') }}
    </button>
  </section>
</template>
