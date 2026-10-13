import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { contractorsApi } from '../api/contractors.api';
import type {
  ContractorProfile,
  ScorecardMetrics,
  WeeklyTrendPoint,
  EvidenceTicket,
  EvidenceLedgerFilter,
} from '../types/contractor';

export const useContractorsStore = defineStore('contractors', () => {
  const profile = ref<ContractorProfile | null>(null);
  const metrics = ref<ScorecardMetrics | null>(null);
  const weeklyTrend = ref<WeeklyTrendPoint[]>([]);
  const evidenceTickets = ref<EvidenceTicket[]>([]);
  const selectedTicket = ref<EvidenceTicket | null>(null);
  const isAuditModalOpen = ref<boolean>(false);

  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Active filters for Evidence Ledger
  const filters = ref<EvidenceLedgerFilter>({
    search: '',
    outcome: 'ALL',
    issueCategory: 'ALL',
    dateRange: '7d',
  });

  const filteredTickets = computed(() => {
    let result = [...evidenceTickets.value];

    if (filters.value.outcome && filters.value.outcome !== 'ALL') {
      result = result.filter((t) => t.slaOutcome === filters.value.outcome);
    }

    if (filters.value.issueCategory && filters.value.issueCategory !== 'ALL') {
      result = result.filter((t) => t.issueCategory === filters.value.issueCategory);
    }

    if (filters.value.search?.trim()) {
      const q = filters.value.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.referenceNumber.toLowerCase().includes(q) ||
          t.zone.toLowerCase().includes(q) ||
          t.crewName.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q)
      );
    }

    return result;
  });

  const complianceStatus = computed(() => {
    if (!metrics.value) return 'UNKNOWN';
    if (metrics.value.complianceRate >= metrics.value.targetComplianceRate) return 'COMPLIANT';
    if (metrics.value.complianceRate >= metrics.value.targetComplianceRate - 3) return 'AT_RISK';
    return 'BREACHED';
  });

  async function fetchProfile() {
    try {
      const res = await contractorsApi.getProfile();
      if (res.success && res.data) profile.value = res.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contractor profile';
    }
  }

  async function fetchScorecard() {
    isLoading.value = true;
    error.value = null;
    try {
      const [metricsRes, trendRes] = await Promise.all([
        contractorsApi.getScorecard(),
        contractorsApi.getWeeklyTrend(),
      ]);

      if (metricsRes.success && metricsRes.data) metrics.value = metricsRes.data;
      if (trendRes.success && trendRes.data) weeklyTrend.value = trendRes.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to load SLA scorecard';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchEvidenceLedger() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await contractorsApi.getEvidenceLedger(filters.value);
      if (res.success && res.data) {
        evidenceTickets.value = res.data;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load evidence ledger';
    } finally {
      isLoading.value = false;
    }
  }

  function openProofAudit(ticket: EvidenceTicket) {
    selectedTicket.value = ticket;
    isAuditModalOpen.value = true;
  }

  function closeProofAudit() {
    isAuditModalOpen.value = false;
    selectedTicket.value = null;
  }

  function setFilter(partial: Partial<EvidenceLedgerFilter>) {
    filters.value = { ...filters.value, ...partial };
  }

  function resetFilters() {
    filters.value = {
      search: '',
      outcome: 'ALL',
      issueCategory: 'ALL',
      dateRange: '7d',
    };
  }

  return {
    profile,
    metrics,
    weeklyTrend,
    evidenceTickets,
    selectedTicket,
    isAuditModalOpen,
    isLoading,
    error,
    filters,
    filteredTickets,
    complianceStatus,
    fetchProfile,
    fetchScorecard,
    fetchEvidenceLedger,
    openProofAudit,
    closeProofAudit,
    setFilter,
    resetFilters,
  };
});

export default useContractorsStore;
