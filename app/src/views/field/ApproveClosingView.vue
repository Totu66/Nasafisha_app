<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '../../i18n'
import ClosureEvidencePair from '@/components/tickets/ClosureEvidencePair.vue'
import { approveClosure, fetchClosureApproval, sendBackClosure } from '@/api/tickets.api'
import { formatTime } from '@/helpers/date'
import { useSupervisorStore } from '@/store/supervisor.store'
import type { ClosureApproval } from '@/types/closureApproval'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const supervisor = useSupervisorStore()
const id = String(route.params.id)

const approval = ref<ClosureApproval | null>(null)
const hasError = ref(false)
const isSaving = ref(false)
const saveFailed = ref(false)

onMounted(async () => {
  try {
    approval.value = await fetchClosureApproval(id)
  } catch {
    hasError.value = true
  }
})

async function decide(decision: 'approve' | 'send_back') {
  isSaving.value = true
  saveFailed.value = false
  try {
    if (decision === 'approve') await approveClosure(id)
    else await sendBackClosure(id)
    await supervisor.loadAll() // refresh "Needs you"
    await router.push({ name: 'field-crews' })
  } catch {
    saveFailed.value = true
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <p v-if="hasError" role="alert" class="text-red-800">{{ t('common.loadError') }}</p>
  <p v-else-if="!approval" class="text-stone-600">{{ t('common.loading') }}</p>

  <section v-else>
    <h1 class="text-2xl font-bold text-green-900">{{ t('supervisor.approve.title') }}</h1>

    <div class="mt-4 rounded border border-stone-200 bg-white p-4">
      <p class="font-mono text-sm">{{ approval.reference }}</p>
      <p class="text-sm">{{ t('supervisor.approve.requestedBy', { name: approval.requestedByName, crew: approval.crewLabel }) }}</p>
      <p class="text-sm">{{ t('supervisor.approve.distance', { meters: approval.distanceMeters, limit: approval.limitMeters }) }}</p>

      <div class="mt-3">
        <ClosureEvidencePair
          :before-url="approval.beforePhotoUrl"
          :before-time="formatTime(approval.beforeAt)"
          :after-url="approval.afterPhotoUrl"
          :after-time="formatTime(approval.afterAt)"
        />
      </div>

      <p class="mt-3 text-xs text-stone-500">{{ t('supervisor.approve.recorded') }}</p>
      <p v-if="saveFailed" role="alert" class="mt-2 text-sm text-red-800">{{ t('supervisor.approve.failed') }}</p>

      <div class="mt-3 flex gap-2">
        <button type="button" :disabled="isSaving" class="rounded border border-green-800 px-3 py-2 text-sm text-green-800 disabled:opacity-50" @click="decide('send_back')">
          {{ t('supervisor.approve.sendBack') }}
        </button>
        <button type="button" :disabled="isSaving" class="rounded bg-green-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50" @click="decide('approve')">
          {{ t('supervisor.approve.approve') }}
        </button>
      </div>
    </div>
  </section>
</template>