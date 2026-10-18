<template>
  <ContractorLayout>
    <div class="space-y-6">
      <!-- Breadcrumb (Figma: Contractor Performance / scorecard) -->
      <nav
        class="flex items-center gap-1.5 text-xs text-[var(--ns-ash-600,#4F5B57)]"
        aria-label="Breadcrumb"
      >
        <router-link
          to="/contractor"
          class="font-semibold hover:text-[var(--ns-lake-900,#0F2E27)]"
        >
          Contractor Performance
        </router-link>
        <span aria-hidden="true">/</span>
        <span class="text-[var(--ns-lake-900,#0F2E27)]">scorecard</span>
      </nav>

      <!-- Page header -->
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
            Your SLA scorecard
          </h1>
          <p class="mt-1 text-sm text-[var(--ns-ash-600,#4F5B57)]">
            A clear view of service performance across your assigned zones.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span class="flex items-center gap-2 rounded-lg border border-[var(--ns-ash-200,#D5DBD9)] bg-white px-3 py-2 text-xs font-medium text-[var(--ns-ash-700,#3B4743)]">
            <AppIcon
              name="date-range"
              :size="14"
            />
            1 Jan – 31 Mar 2026
          </span>

          <BaseButton
            variant="secondary"
            size="sm"
            icon="refresh"
            :loading="store.isLoading"
            @click="refreshData"
          >
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

      <!-- Zone filter pills -->
      <ZoneFilterPills />

      <!-- KPI stat cards (Figma: dark SLA card + 3 white cards) -->
      <ScorecardStatCards :metrics="store.metrics" />

      <!-- Chart + shared-view rail -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="xl:col-span-2">
          <SLAComplianceChart :trend="store.trend12w" />
        </div>

        <aside class="space-y-4">
          <div class="rounded-2xl border border-[var(--ns-lake-200,#B2D9CE)] bg-[var(--ns-lake-50,#F0F7F4)] p-5">
            <div class="flex items-center gap-2">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ns-lake-900,#0F2E27)] text-[var(--ns-sun-500,#F5D142)]">
                <AppIcon
                  name="contractor-ledger"
                  :size="16"
                />
              </span>
              <h2 class="text-sm font-bold text-[var(--ns-lake-900,#0F2E27)]">
                The same record. A shared view.
              </h2>
            </div>

            <p class="mt-3 text-sm leading-relaxed text-[var(--ns-lake-900,#0F2E27)]">
              The county sees the figures below on the same ledger — your closures, timestamps and
              photographic proof, unchanged.
            </p>

            <router-link
              to="/contractor/ledger"
              class="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ns-lake-900,#0F2E27)] underline-offset-4 hover:underline"
            >
              Read-only performance ledger
              <AppIcon
                name="arrow-right"
                :size="15"
              />
            </router-link>
          </div>

          <div class="rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5">
            <span class="text-[10px] font-semibold uppercase tracking-widest text-[var(--ns-ash-600,#4F5B57)]">
              Contract SLA threshold
            </span>
            <p class="mt-1 font-mono text-lg font-bold text-[var(--ns-lake-900,#0F2E27)]">
              {{ store.metrics?.targetComplianceRate ?? 90 }}% minimum
            </p>
            <p class="mt-2 text-xs text-[var(--ns-ash-600,#4F5B57)]">
              Current rate:
              <strong class="font-mono text-[var(--ns-lake-900,#0F2E27)]">{{ store.metrics?.complianceRate ?? 0 }}%</strong>
            </p>
          </div>
        </aside>
      </div>
    </div>
  </ContractorLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ContractorLayout from '../../layouts/ContractorLayout.vue';
import ScorecardStatCards from '../../components/contractors/ScorecardStatCards.vue';
import SLAComplianceChart from '../../components/contractors/SLAComplianceChart.vue';
import ZoneFilterPills from '../../components/contractors/ZoneFilterPills.vue';
import { useContractorsStore } from '../../store/contractors.store';
import { AppIcon, BaseButton } from '../../components/common';

const store = useContractorsStore();

onMounted(async () => {
  await store.fetchProfile();
  await store.fetchScorecard();
});

async function refreshData() {
  await store.fetchScorecard();
}
</script>
