import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCrewAccounts, fetchCrewStatus, resetCrewPin } from '@/api/workforce.api'
import { authoriseDeviation, getDeviationAlerts } from '@/api/fleet.api'
import { fetchPendingClosureApprovals } from '@/api/tickets.api'
import type { CrewAccount, CrewStatus } from '@/types/crew'
import type { DeviationAlert } from '@/types/deviationAlert'
import type { ClosureApproval } from '@/types/closureApproval'

export const useSupervisorStore = defineStore('supervisor', () => {
  const crews = ref<CrewStatus[]>([])
  const alerts = ref<DeviationAlert[]>([])
  const approvals = ref<ClosureApproval[]>([])
  const crewAccounts = ref<CrewAccount[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)

  // Drives "Alerts (2)" in the nav and "Needs you (2)" on the crew screen.
  const needsYouCount = computed(() => alerts.value.length + approvals.value.length)

  async function loadAll() {
    isLoading.value = true
    hasError.value = false
    try {
      const [c, a, p] = await Promise.all([
        fetchCrewStatus(),
        getDeviationAlerts(),
        fetchPendingClosureApprovals(),
      ])
      crews.value = c
      alerts.value = a
      approvals.value = p
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function authorise(alertId: string) {
    await authoriseDeviation(alertId)
    alerts.value = alerts.value.filter((a) => a.id !== alertId)
  }

  async function loadCrewAccounts() {
    crewAccounts.value = await fetchCrewAccounts()
  }

  async function resetPin(accountId: string, pin: string) {
    await resetCrewPin(accountId, pin)
    await loadCrewAccounts() // the account is unlocked now
  }

  return {
    crews, alerts, approvals, crewAccounts, isLoading, hasError, needsYouCount,
    loadAll, authorise, loadCrewAccounts, resetPin,
  }
})