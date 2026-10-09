import { useAuthStore } from '@/store/auth.store'
import { roleHasPermission, type Permission } from '@/config/permissions'

export function usePermission() {
  const auth = useAuthStore()

  function can(permission: Permission): boolean {
    return !!auth.role && roleHasPermission(auth.role, permission)
  }

  function canAny(permissions: Permission[]): boolean {
    return permissions.some(can)
  }

  return { can, canAny }
}