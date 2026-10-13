<script setup lang="ts">
// FE-007 (FR-023): one global strip that says "you are offline" and/or how much work is waiting to sync.
import { computed } from 'vue'
import { useQueueState } from '../../composables/fieldAdapters'
import { useFieldOpsI18n } from '../../composables/useFieldOpsI18n'
import { summarizeQueue } from '../../helpers/pendingSync'

const { t } = useFieldOpsI18n()
const { items, online, syncNow } = useQueueState()
const summary = computed(() => summarizeQueue(items.value))
const visible = computed(() => !online.value || summary.value.hasWork)
</script>

<template>
  <div
    v-if="visible"
    role="status"
    class="flex flex-wrap items-center gap-3 bg-amber-100 px-4 py-2 font-semibold text-amber-900"
  >
    <span v-if="!online">{{ t('sync.offline') }}</span>
    <span v-if="summary.pending">{{ t('sync.pending', { n: summary.pending }) }}</span>
    <span v-if="summary.attention" class="text-red-800">{{ t('sync.attention', { n: summary.attention }) }}</span>
    <button v-if="online && summary.pending" type="button" class="min-h-11 underline" @click="syncNow">
      {{ t('sync.syncNow') }}
    </button>
  </div>
</template>
