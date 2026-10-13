<script setup lang="ts">
// FE-010 (FR-022): the supervisor's "Authorise" control. Two-step (button, then confirm) so it cannot be
// tapped by accident. Drop it into any alert row, or into a live-map popup.
import { ref } from 'vue'
import { useFieldOpsI18n } from '../../composables/useFieldOpsI18n'

defineProps<{ busy?: boolean }>()
const emit = defineEmits<{ authorize: [] }>()
const { t } = useFieldOpsI18n()
const confirming = ref(false)

function confirm(): void {
  confirming.value = false
  emit('authorize')
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-if="!confirming"
      type="button"
      :disabled="busy"
      class="min-h-12 rounded-lg bg-green-700 px-4 font-semibold text-white disabled:opacity-50"
      @click="confirming = true"
    >
      {{ t('deviation.authorise') }}
    </button>
    <template v-else>
      <span class="font-semibold">{{ t('deviation.confirm') }}</span>
      <button type="button" class="min-h-12 rounded-lg bg-green-700 px-4 font-semibold text-white" @click="confirm">
        {{ t('deviation.confirmYes') }}
      </button>
      <button type="button" class="min-h-12 rounded-lg border-2 border-gray-400 px-4 font-semibold" @click="confirming = false">
        {{ t('deviation.confirmNo') }}
      </button>
    </template>
  </div>
</template>
