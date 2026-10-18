<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '../../i18n'
import { formatTime } from '@/helpers/date'
import type { CrewAccount } from '@/types/crew'

defineProps<{ account: CrewAccount; isSaving: boolean; failed: boolean }>()
const emit = defineEmits<{ (e: 'save', pin: string): void; (e: 'cancel'): void }>()
const { t } = useI18n()

const pin = ref('')
const isValid = computed(() => /^\d{4,6}$/.test(pin.value)) // IN-002.2: 4 to 6 digits
</script>

<template>
  <form class="rounded border border-stone-200 bg-white p-4" novalidate @submit.prevent="isValid && emit('save', pin)">
    <p class="font-bold">{{ account.name }}</p>
    <p class="text-sm text-stone-600">{{ account.employeeId }} · {{ account.crewLabel }}</p>

    <p v-if="account.isLocked && account.lockedAt" class="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
      ⚠ {{ t('supervisor.pin.locked', { time: formatTime(account.lockedAt) }) }}
    </p>

    <label for="new-pin" class="mt-3 block text-sm font-medium">{{ t('supervisor.pin.newPin') }}</label>
    <input
      id="new-pin"
      v-model="pin"
      type="password"
      inputmode="numeric"
      maxlength="6"
      autocomplete="new-password"
      class="mt-1 w-full rounded border border-stone-300 px-3 py-2"
    />
    <p class="mt-1 text-xs text-stone-500">{{ t('supervisor.pin.help') }}</p>
    <p v-if="pin && !isValid" class="mt-1 text-xs text-red-800">{{ t('supervisor.pin.invalid') }}</p>
    <p v-if="failed" role="alert" class="mt-1 text-sm text-red-800">{{ t('supervisor.pin.failed') }}</p>

    <div class="mt-3 flex gap-2">
      <button type="submit" :disabled="!isValid || isSaving" class="rounded bg-green-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">
        {{ t('supervisor.pin.save') }}
      </button>
      <button type="button" class="rounded border border-green-800 px-3 py-2 text-sm text-green-800" @click="emit('cancel')">
        {{ t('supervisor.pin.cancel') }}
      </button>
    </div>
  </form>
</template>