<script setup lang="ts">
import { ref } from 'vue'
import { useFieldOpsI18n } from '../../composables/useFieldOpsI18n'

defineProps<{ loading: boolean; error: string | null }>()
const emit = defineEmits<{ submit: [credentials: { employeeId: string; pin: string }] }>()

const { t } = useFieldOpsI18n()
const employeeId = ref('')
const pin = ref('')
const localError = ref<string | null>(null)

function onSubmit(): void {
  localError.value = null
  if (!employeeId.value.trim() || !pin.value) {
    localError.value = t('login.required')
    return
  }
  emit('submit', { employeeId: employeeId.value.trim(), pin: pin.value })
}

// The parent clears the PIN after a failed attempt.
defineExpose({ clearPin: () => { pin.value = '' } })
</script>

<template>
  <form class="space-y-4" novalidate @submit.prevent="onSubmit">
    <div>
      <label for="ops-employee-id" class="mb-1 block font-semibold">{{ t('login.employeeId') }}</label>
      <input
        id="ops-employee-id"
        v-model="employeeId"
        autocomplete="username"
        autocapitalize="characters"
        class="min-h-12 w-full rounded-lg border-2 border-gray-300 px-3 py-2"
      />
    </div>
    <div>
      <label for="ops-pin" class="mb-1 block font-semibold">{{ t('login.pin') }}</label>
      <input
        id="ops-pin"
        v-model="pin"
        type="password"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="6"
        autocomplete="current-password"
        class="min-h-12 w-full rounded-lg border-2 border-gray-300 px-3 py-2"
      />
    </div>
    <p v-if="localError || error" role="alert" class="font-semibold text-red-700">{{ localError || error }}</p>
    <button
      type="submit"
      :disabled="loading"
      class="min-h-12 w-full rounded-lg bg-green-700 px-4 font-semibold text-white disabled:opacity-50"
    >
      {{ loading ? t('login.signingIn') : t('login.submit') }}
    </button>
  </form>
</template>
