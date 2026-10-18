<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ns-ash-600,#4F5B57)]">
          Franchise oversight
        </p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
          Contractor performance
        </h1>
        <p class="mt-1 text-sm text-[var(--ns-ash-600,#4F5B57)]">
          {{ store.profile?.name ?? 'Nakuru Green Clean Franchise Ltd' }}
          <span v-if="store.profile?.assignedZone"> · {{ store.profile.assignedZone }}</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <BaseBadge :variant="statusVariant">{{ statusLabel }}</BaseBadge>
        <BaseButton variant="secondary" size="sm" icon="refresh" :loading="store.isLoading" @click="refresh">
          Refresh
        </BaseButton>
      </div>
    </header>

    <p
      v-if="store.error"
      class="rounded-xl border border-[var(--ns-danger-border,#F87171)] bg-[var(--ns-danger-bg,#FEE2E2)] px-4 py-3 text-sm text-[var(--ns-danger-fg,#991B1B)]"
    >
      {{ store.error }}
    </p>

    <ContractorPerformanceCard :metrics="store.metrics" />

    <section v-if="store.weeklyTrend.length">
      <SLAComplianceTable :trend="store.weeklyTrend" />
    </section>
    <section
      v-else-if="store.isLoading"
      class="rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-6 text-sm text-[var(--ns-ash-600,#4F5B57)] shadow-xs"
    >
      Loading weekly compliance trend…
    </section>
    <section
      v-else
      class="rounded-2xl border border-dashed border-[var(--ns-ash-200,#D5DBD9)] bg-white p-6 text-sm text-[var(--ns-ash-600,#4F5B57)]"
    >
      No compliance data for this period yet.
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ContractorPerformanceCard from '../../components/contractors/ContractorPerformanceCard.vue';
import SLAComplianceTable from '../../components/contractors/SLAComplianceTable.vue';
import { BaseBadge, BaseButton } from '../../components/common';
import { useContractorsStore } from '../../store/contractors.store';

const store = useContractorsStore();

const statusVariant = computed(() => {
  if (store.complianceStatus === 'COMPLIANT') return 'met' as const;
  if (store.complianceStatus === 'AT_RISK') return 'in-progress' as const;
  if (store.complianceStatus === 'BREACHED') return 'breached' as const;
  return 'neutral' as const;
});

const statusLabel = computed(() => {
  if (store.complianceStatus === 'COMPLIANT') return 'SLA compliant';
  if (store.complianceStatus === 'AT_RISK') return 'At risk';
  if (store.complianceStatus === 'BREACHED') return 'SLA breached';
  return 'Awaiting data';
});

onMounted(async () => {
  await store.fetchProfile();
  await store.fetchScorecard();
});

async function refresh() {
  await store.fetchScorecard();
}
</script>
