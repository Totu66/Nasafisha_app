<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  beforeUrl: string
  beforeTime: string // already formatted, e.g. "08:14"
  afterUrl: string | null
  afterTime: string | null
}>()
const { t } = useI18n()
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <figure class="relative">
      <img :src="beforeUrl" :alt="t('field.closure.before')" class="w-full rounded border border-stone-200" />
      <figcaption class="absolute bottom-2 left-2 rounded bg-stone-900 px-2 py-0.5 text-xs text-white">
        {{ t('field.closure.beforeAt', { time: beforeTime }) }}
      </figcaption>
    </figure>

    <figure class="relative">
      <img v-if="afterUrl" :src="afterUrl" :alt="t('field.closure.after')" class="w-full rounded border border-stone-200" />
      <div v-else class="flex h-full min-h-40 items-center justify-center rounded border border-dashed border-stone-300 text-sm text-stone-500">
        {{ t('field.closure.noAfterPhoto') }}
      </div>
      <figcaption v-if="afterTime" class="absolute bottom-2 left-2 rounded bg-stone-900 px-2 py-0.5 text-xs text-white">
        {{ t('field.closure.afterAt', { time: afterTime }) }}
      </figcaption>
    </figure>
  </div>
</template>