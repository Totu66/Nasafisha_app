<template>
  <ol class="space-y-4">
    <li v-for="step in steps" :key="step.label" class="flex items-start gap-3">
      <span
        class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        :class="step.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'"
      >
        {{ step.done ? '✓' : step.index }}
      </span>
      <div>
        <p class="text-sm font-medium" :class="step.done ? 'text-slate-900' : 'text-slate-500'">{{ step.label }}</p>
        <p v-if="step.time" class="text-xs text-slate-400">{{ step.time }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ReportStatusStep } from '../../types/report';

const props = defineProps<{ history: ReportStatusStep[] }>();

const steps = computed(() =>
  props.history.map((s, i) => ({ ...s, index: i + 1, done: s.done })),
);
</script>
