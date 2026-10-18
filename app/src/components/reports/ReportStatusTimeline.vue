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
        class="mt-1 inline-block h-3.5 w-3.5 shrink-0 rounded-full"
        :class="{
          'bg-[var(--ns-leaf-600,#16A34A)]': step.status === 'done',
          'bg-[var(--ns-sun-600,#E4BE2E)] ring-4 ring-[var(--ns-sun-50,#FDF7DE)]': step.status === 'current',
          'bg-[var(--ns-ash-300,#B5BFBC)]': step.status === 'upcoming',
        }"
        aria-hidden="true"
      />
      <div>
        <p
          class="text-sm"
          :class="step.status === 'upcoming' ? 'text-[var(--ns-ash-600,#4F5B57)]' : 'font-semibold text-[var(--ns-ash-900,#17211F)]'"
        >
          {{ t(`state.${step.state}`) }}
          <span class="sr-only"> · {{ t(`timeline.${step.status}`) }}</span>
        </p>
        <p v-if="step.at" class="text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ formatTimestamp(step.at, locale) }}</p>
      </div>
    </li>
  </ol>
</template>