<template>
  <ContractorLayout>
    <div class="space-y-6">
      <!-- Franchise Profile & Status Header -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">SLA Performance Scorecard</h1>
            <BaseBadge variant="resolved" size="sm" :dot="true">Contract Active</BaseBadge>
          </div>
          <p class="text-xs text-slate-500">
            Official municipal compliance overview for <strong class="text-slate-800">Nakuru Green Clean Franchise Ltd</strong> (Zone E — Nakuru East).
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <span class="text-slate-400 block text-[10px] uppercase font-mono">Contract SLA Threshold</span>
            <span class="font-bold text-slate-800 font-mono text-sm">95.0% Minimum</span>
          </div>

          <BaseButton variant="secondary" size="sm" icon="refresh" :loading="store.isLoading" @click="refreshData">
            Refresh Data
          </BaseButton>

          <router-link to="/contractor/ledger">
            <BaseButton variant="primary" size="sm" icon="arrow-right">
              View Evidence Ledger
            </BaseButton>
          </router-link>
        </div>
      </div>

      <!-- SLA Performance KPI Cards -->
      <ContractorPerformanceCard :metrics="store.metrics" />

      <!-- Weekly Compliance Chart and Daily Breakdown -->
      <SLAComplianceTable :trend="store.weeklyTrend" />
    </div>
  </ContractorLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ContractorLayout from '../../layouts/ContractorLayout.vue';
import ContractorPerformanceCard from '../../components/contractors/ContractorPerformanceCard.vue';
import SLAComplianceTable from '../../components/contractors/SLAComplianceTable.vue';
import { useContractorsStore } from '../../store/contractors.store';
import { BaseBadge, BaseButton } from '../../components/common';

const store = useContractorsStore();

onMounted(async () => {
  await store.fetchProfile();
  await store.fetchScorecard();
});

async function refreshData() {
  await store.fetchScorecard();
}
</script>
