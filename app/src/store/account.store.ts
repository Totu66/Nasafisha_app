import { ref } from 'vue'
import { defineStore } from 'pinia'
import { createAccount, fetchAccounts, setAccountActive, updateAccountRole } from '@/api/admin.api'
import type { Role } from '@/config/roles'
import type { Account, NewAccountPayload } from '@/types/account'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)

  async function load() {
    isLoading.value = true
    hasError.value = false
    try {
      accounts.value = await fetchAccounts()
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function create(payload: NewAccountPayload) {
    accounts.value.push(await createAccount(payload))
  }

  async function changeRole(id: string, role: Role) {
    await updateAccountRole(id, role)
    const a = accounts.value.find((x) => x.id === id)
    if (a) a.role = role
  }

  async function toggleActive(id: string) {
    const a = accounts.value.find((x) => x.id === id)
    if (!a) return
    const makeActive = a.status === 'inactive'
    await setAccountActive(id, makeActive)
    a.status = makeActive ? 'active' : 'inactive'
  }

  return { accounts, isLoading, hasError, load, create, changeRole, toggleActive }
})