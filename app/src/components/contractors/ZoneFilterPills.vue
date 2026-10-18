<template>
  <div class="flex flex-wrap items-center gap-2">
    <span
      class="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ns-ash-200,#D5DBD9)] bg-white text-[var(--ns-ash-600,#4F5B57)]"
      aria-hidden="true"
    >
      <AppIcon
        name="filter"
        :size="14"
      />
    </span>

    <button
      v-for="zone in zones"
      :key="zone"
      type="button"
      class="rounded-full border px-3 py-1.5 text-xs font-semibold transition"
      :class="selected === zone
        ? 'border-[var(--ns-lake-900,#0F2E27)] bg-[var(--ns-lake-900,#0F2E27)] text-white'
        : 'border-[var(--ns-ash-200,#D5DBD9)] bg-white text-[var(--ns-ash-700,#3B4743)] hover:border-[var(--ns-ash-400,#889490)]'"
      :aria-pressed="selected === zone"
      @click="selected = zone"
    >
      {{ zone }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AppIcon } from '../common';

const zones = ['Your zones', 'Section 5B', 'Free Area'];
const selected = ref(zones[0]);
</script>
