/**
 * Reactive permission checks for components (FE-033).
 *
 *   const { can, canAny, role } = usePermission();
 *   <BaseButton v-if="can('report:assign')">Assign</BaseButton>
 */

import { computed, type ComputedRef } from 'vue';
import { useAuthStore } from '../store/auth.store';
import {
  permissionsForRole,
  roleHasPermission,
  type Permission,
} from '../config/permissions';
import { ROLE_DEFINITIONS, homeRouteFor, loginRouteFor, roleLabel } from '../config/roles';
import type { UserRole } from '../types/user';

export interface UsePermission {
  role: ComputedRef<UserRole | null>;
  isAuthenticated: ComputedRef<boolean>;
  permissions: ComputedRef<Permission[]>;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  is: (role: UserRole) => boolean;
  homeRoute: ComputedRef<string>;
  loginRoute: ComputedRef<string>;
  label: ComputedRef<string>;
}

export function usePermission(): UsePermission {
  const auth = useAuthStore();

  const role = computed<UserRole | null>(() => auth.role);
  const isAuthenticated = computed(() => auth.isAuthenticated);
  const permissions = computed<Permission[]>(() => permissionsForRole(role.value));

  function can(permission: Permission): boolean {
    return roleHasPermission(role.value, permission);
  }

  function canAny(list: Permission[]): boolean {
    return list.some((permission) => can(permission));
  }

  function canAll(list: Permission[]): boolean {
    return list.length > 0 && list.every((permission) => can(permission));
  }

  function hasRole(roles: UserRole | UserRole[]): boolean {
    if (!role.value) return false;
    return Array.isArray(roles) ? roles.includes(role.value) : roles === role.value;
  }

  function is(expected: UserRole): boolean {
    return role.value === expected;
  }

  const homeRoute = computed(() => homeRouteFor(role.value));
  const loginRoute = computed(() => loginRouteFor(role.value));
  const label = computed(() => roleLabel(role.value));

  return {
    role,
    isAuthenticated,
    permissions,
    can,
    canAny,
    canAll,
    hasRole,
    is,
    homeRoute,
    loginRoute,
    label,
  };
}

export { ROLE_DEFINITIONS };
export default usePermission;
