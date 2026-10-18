<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from '../../i18n'
import PinResetForm from '@/components/supervisor/PinResetForm.vue'
import { useSupervisorStore } from '@/store/supervisor.store'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useSupervisorStore()
const { crewAccounts } = storeToRefs(store)

const isSaving = ref(false)
const failed = ref(false)
const saved = ref(false)

const selected = computed(() => crewAccounts.value.find((a) => a.id === route.params.crewId) ?? null)

onMounted(() => store.loadCrewAccounts())

async function onSave(pin: string) {
  if (!selected.value) return
  isSaving.value = true
  failed.value = false
  try {
    await store.resetPin(selected.value.id, pin)
    saved.value = true
    await router.push({ name: 'field-reset-pin' })
  } catch {
    failed.value = true
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md">
    <h1 class="text-2xl font-bold text-green-900">{{ t('supervisor.pin.title') }}</h1>

    <p v-if="saved && !selected" role="status" class="mt-3 rounded bg-green-50 p-2 text-sm text-green-900">
      {{ t('supervisor.pin.saved') }}
    </p>

    <PinResetForm
      v-if="selected"
      class="mt-4"
      :account="selected"
      :is-saving="isSaving"
      :failed="failed"
      @save="onSave"
      @cancel="router.push({ name: 'field-reset-pin' })"
    />

    <template v-else>
      <p v-if="crewAccounts.length === 0" class="mt-3 text-stone-600">{{ t('supervisor.pin.empty') }}</p>
      <ul class="mt-4 space-y-2">
        <li v-for="account in crewAccounts" :key="account.id">
          <RouterLink
            :to="{ name: 'field-reset-pin', params: { crewId: account.id } }"
            class="flex items-center justify-between rounded border border-stone-200 bg-white p-3 hover:bg-stone-50"
          >
            <span>
              <span class="block font-semibold">{{ account.name }}</span>
              <span class="text-sm text-stone-600">{{ account.employeeId }} · {{ account.crewLabel }}</span>
            </span>
            <span v-if="account.isLocked" class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
              {{ t('supervisor.pin.lockedChip') }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </template>
  </section>
</template>