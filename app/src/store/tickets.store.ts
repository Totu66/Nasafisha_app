import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchMyTickets, fetchTicketById } from '@/api/tickets.api'
import type { CrewVehicle, Ticket } from '@/types/ticket'

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref<Ticket[]>([])
  const vehicle = ref<CrewVehicle | null>(null)
  const current = ref<Ticket | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)

  async function loadMine() {
    isLoading.value = true
    hasError.value = false
    try {
      const result = await fetchMyTickets()
      tickets.value = result.tickets
      vehicle.value = result.vehicle
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function loadOne(id: string) {
    isLoading.value = true
    hasError.value = false
    try {
      current.value = await fetchTicketById(id)
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return { tickets, vehicle, current, isLoading, hasError, loadMine, loadOne }
})