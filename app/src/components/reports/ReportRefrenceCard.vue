<script setup lang="ts">
// Shows the report reference big and selectable, with an optional Copy button.
import { ref } from 'vue'
import { useCitizenConfirmI18n } from '../../composables/useCitizenConfirmI18n'
import { copyText } from '../../helpers/clipboard'

const props = defineProps<{ reference: string }>()
const { t } = useCitizenConfirmI18n()
const feedback = ref<'idle' | 'copied' | 'failed'>('idle')
let timer: ReturnType<typeof setTimeout> | undefined

async function copy(): Promise<void> {
  feedback.value = (await copyText(props.reference)) ? 'copied' : 'failed'
  clearTimeout(timer)
  timer = setTimeout(() => { feedback.value = 'idle' }, 3000)
}
</script>

<template>
  <div class="rounded-xl border-2 border-green-700 bg-green-50 p-4 text-center">
    <p class="text-sm font-semibold text-green-900">{{ t('sent.referenceLabel') }}</p>
    <!-- data-testid is read by the FE-015 usability spec -->
    <p data-testid="report-reference" class="select-all break-all text-2xl font-bold tracking-wide">{{ reference }}</p>
    <button
      type="button"
      class="mt-2 min-h-11 rounded-lg border-2 border-green-700 px-4 font-semibold text-green-700"
      @click="copy"
    >
      {{ feedback === 'copied' ? t('sent.copied') : t('sent.copy') }}
    </button>
    <p v-if="feedback === 'failed'" role="alert" class="mt-2 text-sm text-red-700">{{ t('sent.copyFailed') }}</p>
  </div>
</template>