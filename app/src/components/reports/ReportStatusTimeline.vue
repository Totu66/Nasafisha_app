<script setup lang="ts">
// The five report states (Submitted → … → Resolved) with the time each was reached (FR-013.1, FR-013.5).
import { useCitizenConfirmI18n } from '../../composables/useCitizenConfirmI18n'
import { formatTimestamp, type TimelineStep } from '../../helpers/reportStatus'

defineProps<{ steps: TimelineStep[]; locale: string }>()
const { t } = useCitizenConfirmI18n()
</script>

<template>
  <ol class="space-y-3" aria-live="polite">
    <li
      v-for="step in steps"
      :key="step.state"
      class="flex items-start gap-3"
      :aria-current="step.status === 'current' ? 'step' : undefined"
    >
      <span
        class="mt-1 inline-block h-4 w-4 shrink-0 rounded-full border-2"
        :class="{
          'border-green-700 bg-green-700': step.status === 'done',
          'border-green-700 bg-white ring-4 ring-green-200': step.status === 'current',
          'border-gray-300 bg-white': step.status === 'upcoming',
        }"
        aria-hidden="true"
      />
      <div>
        <p :class="step.status === 'upcoming' ? 'text-gray-500' : 'font-semibold'">
          {{ t(`state.${step.state}`) }}
          <span class="sr-only"> · {{ t(`timeline.${step.status}`) }}</span>
        </p>
        <p v-if="step.at" class="text-sm text-gray-600">{{ formatTimestamp(step.at, locale) }}</p>
      </div>
    </li>
  </ol>
</template>