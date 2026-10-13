<script setup lang="ts">
import { computed } from 'vue';
import { isMapsAvailable } from '@/providers/googleMaps';
import type { LatLng } from '@/types/route';
import RoutePolyline from '@/components/map/RoutePolyline.vue';

const props = withDefaults(
  defineProps<{
    plannedPath?: LatLng[];
    actualPath?: LatLng[];
    title?: string;
  }>(),
  {
    plannedPath: () => [],
    actualPath: () => [],
    title: 'Route map',
  }
);

const points = computed(() => {
  const all = [...props.plannedPath, ...props.actualPath];
  if (!all.length) {
    return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
  }

  const latitudes = all.map((point) => point.lat);
  const longitudes = all.map((point) => point.lng);

  return {
    minLat: Math.min(...latitudes),
    maxLat: Math.max(...latitudes),
    minLng: Math.min(...longitudes),
    maxLng: Math.max(...longitudes),
  };
});

const viewBox = computed(() => {
  const width = points.value.maxLng - points.value.minLng || 1;
  const height = points.value.maxLat - points.value.minLat || 1;
  return {
    minX: points.value.minLng - width * 0.15,
    minY: points.value.minLat - height * 0.15,
    width: width * 1.3,
    height: height * 1.3,
  };
});

const mapNotice = computed(() =>
  isMapsAvailable() ? '' : 'Google Maps is unavailable. Showing the route overlay instead.'
);

const projectedPoints = (path: LatLng[]) => {
  if (!path.length) return [];

  return path.map((point) => {
    const x = ((point.lng - viewBox.value.minX) / viewBox.value.width) * 100;
    const y = ((point.lat - viewBox.value.minY) / viewBox.value.height) * 100;
    return { x, y };
  });
};

const actualSvgPoints = computed(() => projectedPoints(props.actualPath));
const plannedSvgPoints = computed(() => projectedPoints(props.plannedPath));
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="mb-3 flex items-center justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">{{ title }}</p>
      </div>
      <span v-if="mapNotice" class="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700">
        {{ mapNotice }}
      </span>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" class="h-72 w-full">
        <rect x="0" y="0" width="100" height="100" fill="#f8fafc" />
        <path v-if="plannedSvgPoints.length" :d="plannedSvgPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')" fill="none" stroke="#94a3b8" stroke-dasharray="3 2" stroke-width="1.2" />
        <path v-if="actualSvgPoints.length" :d="actualSvgPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')" fill="none" stroke="#1f6f5c" stroke-width="1.6" />
      </svg>
    </div>

    <div class="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
      <span class="inline-flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-slate-400" /> Planned</span>
      <span class="inline-flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-emerald-700" /> Actual</span>
    </div>
  </section>
</template>
