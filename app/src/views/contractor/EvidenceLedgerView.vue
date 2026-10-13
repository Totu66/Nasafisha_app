<template>
  <ContractorLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Evidence Ledger & Proof Audit</h1>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold">
              PRD F-004
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Running ledger of closed tickets with synchronized Before & After photo evidence, GPS proximity audits, and SLA outcome calculations.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <BaseButton variant="secondary" size="sm" icon="refresh" :loading="store.isLoading" @click="refreshLedger">
            Refresh Ledger
          </BaseButton>
          <BaseButton variant="ghost" size="sm" icon="download" @click="exportLedgerCsv">
            Export CSV
          </BaseButton>
        </div>
      </div>

      <!-- Evidence Ledger Table with Filters -->
      <EvidenceLedgerTable
        :tickets="store.filteredTickets"
        @inspect="handleInspect"
        @filter-change="handleFilterChange"
      />

      <!-- Proof Audit Modal -->
      <ProofAuditModal
        :open="store.isAuditModalOpen"
        :ticket="store.selectedTicket"
        @close="store.closeProofAudit"
      />
    </div>
  </ContractorLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ContractorLayout from '../../layouts/ContractorLayout.vue';
import EvidenceLedgerTable from '../../components/contractors/EvidenceLedgerTable.vue';
import ProofAuditModal from '../../components/contractors/ProofAuditModal.vue';
import { useContractorsStore } from '../../store/contractors.store';
import type { EvidenceTicket, SLAOutcome, IssueCategory } from '../../types/contractor';
import { BaseButton } from '../../components/common';

const store = useContractorsStore();

onMounted(async () => {
  await store.fetchEvidenceLedger();
});

async function refreshLedger() {
  await store.fetchEvidenceLedger();
}

function handleInspect(ticket: EvidenceTicket) {
  store.openProofAudit(ticket);
}

function handleFilterChange(filters: { search: string; outcome: SLAOutcome | 'ALL'; issueCategory: IssueCategory | 'ALL' }) {
  store.setFilter(filters);
}

function exportLedgerCsv() {
  alert('Exporting verified evidence records to CSV for county audit submission.');
}
</script>
