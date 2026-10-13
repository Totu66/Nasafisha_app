<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@/i18n';
import type { RouteAudit } from '@/types/routeAudit';

const props = defineProps<{
  audit: RouteAudit | null;
  loading?: boolean;
}>();

const { t } = useI18n();

const statusLabel = computed(() => {
  if (!props.audit?.status) return t('fleet.auditView.status.pending');
  return t(`fleet.auditView.status.${props.audit.status}`);
});

const formatVariance = (value: number | null | undefined, suffix: string): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)} ${suffix}`;
};
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">{{ t('fleet.auditView.detail.title') }}</p>
        <h3 class="text-lg font-semibold text-slate-900">{{ t('fleet.auditView.detail.title') }}</h3>
      </div>
      <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
        {{ statusLabel }}
      </span>
    </div>

    <div v-if="loading" class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      {{ t('fleet.auditView.loading') }}
    </div>

    <div v-else-if="!audit" class="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
      {{ t('fleet.auditView.empty') }}
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-slate-200 p-3">
        <p class="text-xs uppercase tracking-[0.12em] text-slate-500">{{ t('fleet.auditView.detail.distance') }}</p>
        <div class="mt-3 space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-600">{{ t('fleet.auditView.detail.planned') }}</span><strong>{{ audit.plannedDistanceMeters ?? '—' }} m</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">{{ t('fleet.auditView.detail.actual') }}</span><strong>{{ audit.actualDistanceMeters ?? '—' }} m</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">{{ t('fleet.auditView.detail.variance') }}</span><strong :class="(audit.distanceVarianceMeters ?? 0) >= 0 ? 'text-amber-700' : 'text-emerald-700'">{{ formatVariance(audit.distanceVarianceMeters, 'm') }}</strong></div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 p-3">
        <p class="text-xs uppercase tracking-[0.12em] text-slate-500">{{ t('fleet.auditView.detail.duration') }}</p>
        <div class="mt-3 space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-600">{{ t('fleet.auditView.detail.planned') }}</span><strong>{{ audit.plannedDurationSeconds ?? '—' }} s</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">{{ t('fleet.auditView.detail.actual') }}</span><strong>{{ audit.actualDurationSeconds ?? '—' }} s</strong></div>
          <div class="flex justify-between"><span class="text-slate-600">{{ t('fleet.auditView.detail.variance') }}</span><strong :class="(audit.durationVarianceSeconds ?? 0) >= 0 ? 'text-amber-700' : 'text-emerald-700'">{{ formatVariance(audit.durationVarianceSeconds, 's') }}</strong></div>
        </div>
      </div>
    </div>
  </section>
</template>

