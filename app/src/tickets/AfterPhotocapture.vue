<script setup lang="ts">
import { computed } from 'vue'
import { useFieldOpsI18n } from '../../composables/useFieldOpsI18n'
import type { GpsState } from '../../composables/fieldAdapters'

const props = defineProps<{
  photo: string | null
  gpsState: GpsState
  accuracy?: number
  failed?: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ file: [file: File] }>()

const { t } = useFieldOpsI18n()

const gpsText = computed(() => {
  switch (props.gpsState) {
    case 'getting':
      return t('closure.gpsGetting')
    case 'ok':
      return t('closure.gpsOk', { acc: Math.round(props.accuracy ?? 0) })
    case 'denied':
      return t('closure.gpsDenied')
    case 'failed':
      return t('closure.gpsFailed')
    default:
      return ''
  }
})
const gpsIsError = computed(() => props.gpsState === 'denied' || props.gpsState === 'failed')

function onChange(e: Event): void {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('file', file)
  input.value = '' // allow retaking the same file
}
</script>

<template>
  <div class="space-y-3">
    <img v-if="photo" :src="photo" :alt="t('closure.afterPhoto')" class="max-h-80 w-full rounded-lg object-cover" />
    <p v-else class="rounded-lg bg-amber-50 p-3 text-amber-800">{{ t('closure.photoRequired') }}</p>

    <label
      class="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border-2 border-green-700 px-4 font-semibold text-green-700 focus-within:ring-2 focus-within:ring-blue-500"
      :class="{ 'pointer-events-none opacity-50': disabled }"
    >
      {{ photo ? t('closure.retake') : t('closure.takePhoto') }}
      <input type="file" accept="image/*" capture="environment" class="sr-only" :disabled="disabled" @change="onChange" />
    </label>

    <p v-if="failed" role="alert" class="font-semibold text-red-700">{{ t('closure.photoFailed') }}</p>
    <p v-if="gpsText" :class="gpsIsError ? 'font-semibold text-red-700' : 'text-gray-600'" :role="gpsIsError ? 'alert' : undefined">
      {{ gpsText }}
    </p>
  </div>
</template>
