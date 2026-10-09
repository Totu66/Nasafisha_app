<<<<<<< HEAD
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
=======
<template>
  <section class="space-y-6">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">Offline sync</p>
      <h1 class="mt-2 text-3xl font-bold text-slate-900">Pending sync queue</h1>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-900">Queued submissions</h2>
        <button class="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Sync all</button>
      </div>

      <div class="space-y-3">
        <div v-for="item in pendingItems" :key="item.id" class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p class="font-medium text-slate-900">{{ item.name }}</p>
            <p class="text-xs text-slate-500">{{ item.meta }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{{ item.status }}</span>
            <button class="text-sm font-medium text-emerald-700 hover:text-emerald-600">Retry</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pendingItems = ref([
  { id: 1, name: 'Illegal dump cleanup entry', meta: 'Zone A · 8:40 AM', status: 'Queued' },
  { id: 2, name: 'Drain inspection note', meta: 'Zone C · 9:10 AM', status: 'Queued' },
  { id: 3, name: 'Safety checklist photo', meta: 'Shift 2 · 10:30 AM', status: 'Failed' },
]);
</script>
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
