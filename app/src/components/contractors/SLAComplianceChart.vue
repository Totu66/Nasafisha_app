<template>
  <div class="rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-6 shadow-xs">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h3 class="text-base font-bold text-[var(--ns-lake-900,#0F2E27)]">
          SLA compliance over 12 weeks
        </h3>
        <p class="mt-1 text-xs text-[var(--ns-ash-600,#4F5B57)]">
          Baseline history · your zones only
        </p>
      </div>

      <div class="flex items-center gap-4 text-xs text-[var(--ns-ash-600,#4F5B57)]">
        <span class="flex items-center gap-2">
          <span class="h-0.5 w-4 rounded-full bg-[var(--ns-lake-900,#0F2E27)]" />
          Compliance
        </span>
        <span class="flex items-center gap-2">
          <span class="h-0.5 w-4 rounded-full border-t-2 border-dashed border-[var(--ns-sun-500,#F5D142)]" />
          Target {{ targetLabel }}%
        </span>
      </div>
    </div>

    <div
      v-if="points.length"
      class="mt-5"
    >
      <svg
        :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
        class="h-48 w-full sm:h-56"
        role="img"
        aria-label="Weekly SLA compliance against target"
      >
        <!-- Horizontal guides -->
        <line
          v-for="guide in guides"
          :key="guide.value"
          :x1="PAD_L"
          :x2="VIEW_W - PAD_R"
          :y1="guide.y"
          :y2="guide.y"
          stroke="#E6EBE9"
          stroke-width="1"
        />
        <text
          v-for="guide in guides"
          :key="`label-${guide.value}`"
          :x="PAD_L - 8"
          :y="guide.y + 3"
          text-anchor="end"
          class="fill-[#4F5B57] font-mono"
          font-size="9"
        >
          {{ guide.value }}%
        </text>

        <!-- Target line -->
        <line
          :x1="PAD_L"
          :x2="VIEW_W - PAD_R"
          :y1="targetY"
          :y2="targetY"
          stroke="#F5D142"
          stroke-width="2"
          stroke-dasharray="5 4"
        />

        <!-- Area + compliance line -->
        <path
          :d="areaPath"
          fill="rgba(31,111,92,0.08)"
        />
        <polyline
          :points="polylinePoints"
          fill="none"
          stroke="#0F2E27"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Points -->
        <circle
          v-for="point in plotted"
          :key="point.label"
          :cx="point.x"
          :cy="point.y"
          r="2.5"
          fill="#0F2E27"
        />

        <!-- Now pill on the latest week -->
        <g :transform="`translate(${nowPill.x}, ${nowPill.y})`">
          <rect
            x="-18"
            y="-22"
            width="36"
            height="16"
            rx="8"
            fill="#0F2E27"
          />
          <text
            x="0"
            y="-10"
            text-anchor="middle"
            font-size="9"
            font-weight="700"
            fill="#FFFFFF"
          >
            Now
          </text>
        </g>

        <!-- X labels -->
        <text
          v-for="point in xLabels"
          :key="`x-${point.label}`"
          :x="point.x"
          :y="VIEW_H - 4"
          text-anchor="middle"
          class="fill-[#4F5B57] font-mono"
          font-size="9"
        >
          {{ point.label }}
        </text>
      </svg>

      <p class="mt-3 text-xs text-[var(--ns-ash-600,#4F5B57)]">
        {{ footnote }}
      </p>
    </div>

    <p
      v-else
      class="mt-5 rounded-xl bg-[var(--ns-cream,#F9F6EB)] px-4 py-6 text-center text-xs text-[var(--ns-ash-600,#4F5B57)]"
    >
      Loading the 12-week baseline…
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { WeeklyTrendPoint } from '../../types/contractor';

const props = defineProps<{
  trend: WeeklyTrendPoint[];
}>();

const VIEW_W = 640;
const VIEW_H = 200;
const PAD_L = 34;
const PAD_R = 18;
const PAD_T = 26;
const PAD_B = 20;

const points = computed(() => props.trend ?? []);
const targetRate = computed(() => points.value[0]?.targetRate ?? 90);
const targetLabel = computed(() => String(targetRate.value));

const bounds = computed(() => {
  const rates = points.value.map((p) => p.complianceRate);
  const min = Math.min(...rates, targetRate.value);
  const max = Math.max(...rates, targetRate.value);
  return { lo: Math.floor(min - 2), hi: Math.ceil(max + 2) };
});

function scaleY(value: number): number {
  const { lo, hi } = bounds.value;
  const span = Math.max(1, hi - lo);
  return PAD_T + (1 - (value - lo) / span) * (VIEW_H - PAD_T - PAD_B);
}

function scaleX(index: number): number {
  const count = Math.max(1, points.value.length - 1);
  return PAD_L + (index / count) * (VIEW_W - PAD_L - PAD_R);
}

const plotted = computed(() =>
  points.value.map((p, i) => ({
    label: p.day,
    x: scaleX(i),
    y: scaleY(p.complianceRate),
    rate: p.complianceRate,
  }))
);

const polylinePoints = computed(() =>
  plotted.value.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
);

const areaPath = computed(() => {
  if (!plotted.value.length) return '';
  const base = VIEW_H - PAD_B;
  const first = plotted.value[0];
  const last = plotted.value[plotted.value.length - 1];
  const line = plotted.value.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  return `M ${first.x.toFixed(1)} ${base} ${line} L ${last.x.toFixed(1)} ${base} Z`;
});

const targetY = computed(() => scaleY(targetRate.value));

const guides = computed(() => {
  const { lo, hi } = bounds.value;
  const mid = Math.round((lo + hi) / 2);
  return [lo, mid, hi].map((value) => ({ value, y: scaleY(value) }));
});

const xLabels = computed(() => {
  const pts = plotted.value;
  if (pts.length <= 6) return pts;
  const step = Math.ceil(pts.length / 6);
  return pts.filter((_, i) => i % step === 0 || i === pts.length - 1);
});

const nowPill = computed(() => {
  const last = plotted.value[plotted.value.length - 1];
  return last ? { x: last.x, y: last.y } : { x: 0, y: 0 };
});

const footnote = computed(() => {
  const last = points.value[points.value.length - 1];
  if (!last) return '';
  const gap = Number((targetRate.value - last.complianceRate).toFixed(1));
  if (gap > 0) {
    return `Latest compliance sits ${gap} percentage points below the ${targetRate.value}% target.`;
  }
  return `Latest compliance is ${Math.abs(gap)} percentage points at or above the ${targetRate.value}% target.`;
});
</script>
