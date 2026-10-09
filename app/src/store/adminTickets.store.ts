import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchAdminTicketDetail, fetchAdminTickets } from '@/api/admin.api'
import type { AdminTicketDetail, AdminTicketRow } from '@/types/ticketAdmin'

export const useAdminTicketsStore = defineStore('adminTickets', () => {
  const rows = ref<AdminTicketRow[]>([])
  const detail = ref<AdminTicketDetail | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)

  async function loadRows() {
    isLoading.value = true
    hasError.value = false
    try {
      rows.value = await fetchAdminTickets()
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function loadDetail(id: string) {
    isLoading.value = true
    hasError.value = false
    try {
      detail.value = await fetchAdminTicketDetail(id)
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return { rows, detail, isLoading, hasError, loadRows, loadDetail }
})