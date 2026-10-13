<script setup lang="ts">
// The proof of resolution (PRD UJ-001 success state, FR-012.2): the before and after photos side by side.
import { useCitizenConfirmI18n } from '../../composables/useCitizenConfirmI18n'

defineProps<{ before: string | null; after: string | null }>()
const { t } = useCitizenConfirmI18n()
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <figure class="space-y-1">
      <figcaption class="font-semibold">{{ t('resolved.before') }}</figcaption>
      <img v-if="before" :src="before" :alt="t('resolved.beforeAlt')" loading="lazy" class="aspect-[4/3] w-full rounded-lg object-cover" />
      <div v-else class="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100 text-gray-500">–</div>
    </figure>
    <figure class="space-y-1">
      <figcaption class="font-semibold">{{ t('resolved.after') }}</figcaption>
      <img v-if="after" :src="after" :alt="t('resolved.afterAlt')" loading="lazy" class="aspect-[4/3] w-full rounded-lg object-cover" />
      <div v-else class="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100 text-center text-gray-500">
        {{ t('resolved.noAfter') }}
      </div>
    </figure>
  </div>
</template>