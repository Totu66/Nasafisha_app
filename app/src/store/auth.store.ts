import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { adminLogin, type AdminLoginPayload } from '@/api/auth.api'
import type { AuthUser } from '@/types/user'

const TOKEN_KEY = 'nasafisha.token'
const USER_KEY = 'nasafisha.user'

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<AuthUser | null>(readStoredUser())

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const role = computed(() => user.value?.role ?? null)

  function setSession(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function loginAdmin(payload: AdminLoginPayload): Promise<AuthUser> {
    const result = await adminLogin(payload)
    setSession(result.token, result.user)
    return result.user
  }

  return { token, user, role, isAuthenticated, setSession, logout, loginAdmin }
})
