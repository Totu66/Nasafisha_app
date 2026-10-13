import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api/auth.api';
import type { User, UserRole, AuthSession, LoginCredentials } from '../types/user';

const TOKEN_KEY = 'nasafisha_auth_token';
const USER_KEY = 'nasafisha_auth_user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<User | null>(
    localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)!) : null
  );
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const role = computed<UserRole | null>(() => user.value?.role || null);

  function hasRole(requiredRoles: UserRole | UserRole[]): boolean {
    if (!user.value) return false;
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.value.role);
  }

  function setSession(session: AuthSession) {
    token.value = session.token;
    user.value = session.user;
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    error.value = null;
  }

  async function login(credentials: LoginCredentials): Promise<User> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        setSession(response.data);
        return response.data.user;
      }
      throw new Error(response.message || 'Login failed');
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Authentication failed';
      error.value = msg;
      throw new Error(msg);
    } finally {
      isLoading.value = false;
    }
  }

  async function loginContractor(contractorCode: string, accessKey: string): Promise<User> {
    return login({
      contractorCode,
      password: accessKey,
      role: 'contractor',
    });
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // Continue cleanup even if server call fails
    }
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async function restoreSession(): Promise<boolean> {
    if (!token.value) return false;
    try {
      const res = await authApi.me();
      if (res.success && res.data) {
        user.value = res.data;
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        return true;
      }
      return false;
    } catch {
      logout();
      return false;
    }
  }

  // Listen to 401 unauthorized events from Axios interceptor
  if (typeof window !== 'undefined') {
    window.addEventListener('nasafisha:unauthorized', () => {
      token.value = null;
      user.value = null;
    });
  }

  return {
    token,
    user,
    role,
    isLoading,
    error,
    isAuthenticated,
    hasRole,
    setSession,
    login,
    loginContractor,
    logout,
    restoreSession,
  };
});

export default useAuthStore;
