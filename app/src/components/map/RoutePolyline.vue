<script setup lang="ts">
import { computed } from 'vue';
import type { LatLng } from '@/types/route';

const props = withDefaults(
  defineProps<{
    points: LatLng[];
    color?: string;
    dashed?: boolean;
    strokeWidth?: number;
    opacity?: number;
    label?: string;
  }>(),
  {
    color: '#1f6f5c',
    dashed: false,
    strokeWidth: 2,
    opacity: 0.9,
    label: '',
  }
);

const path = computed(() =>
  props.points
    .map((point) => `${point.lng.toFixed(5)},${point.lat.toFixed(5)}`)
    .join(' ')
);

const strokeDasharray = computed(() => (props.dashed ? '8 6' : undefined));
</script>

<template>
  <g>
    <polyline
      :points="path"
      :stroke="color"
      :stroke-width="strokeWidth"
      :stroke-dasharray="strokeDasharray"
      :opacity="opacity"
      fill="none"
      :aria-label="label || 'Route polyline'"
    />
  </g>
</template>
