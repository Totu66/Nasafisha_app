import 'vue-router'
import type { Role } from '@/config/roles'
import type { Permission } from '@/config/permissions'

// Lets us put typed `meta` on routes.
declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    requiresAuth?: boolean
    roles?: readonly Role[]
    permission?: Permission
  }
}