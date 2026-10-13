import type { Router, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import type { UserRole } from '../types/user';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: UserRole[];
    guestOnly?: boolean;
    title?: string;
  }
}

/** Portal each role lands on after signing in (SRS §5.2 role boundaries). */
const HOME_BY_ROLE: Record<UserRole, string> = {
  admin: '/admin',
  citizen: '/citizen/reports',
  field: '/field/tickets',
  contractor: '/contractor/scorecard',
};

/** Login portal used when a guest tries to reach a protected area. */
function loginPathFor(to: RouteLocationNormalized): string {
  if (to.path.startsWith('/contractor')) return '/contractor/login';
  if (to.path.startsWith('/citizen')) return '/citizen/login';
  if (to.path.startsWith('/field')) return '/field/login';
  return '/login';
}

/**
 * Creates and attaches navigation guards for authentication and role-based access control.
 * Matches SRS §5.2 role boundary definitions.
 */
export function setupRouteGuards(router: Router) {
  router.beforeEach((to: RouteLocationNormalized) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.role;

    // Set page title
    if (to.meta.title) {
      document.title = `${to.meta.title} · Nasafisha`;
    } else {
      document.title = 'Nasafisha — Nakuru Municipal Waste Management';
    }

    // 1. Guest-only routes (e.g. login pages) -> redirect to dashboard if already logged in
    if (to.meta.guestOnly && isAuthenticated && userRole) {
      return HOME_BY_ROLE[userRole];
    }

    // 2. Route requires authentication -> send guests to their portal login
    if (to.meta.requiresAuth && !isAuthenticated) {
      return { path: loginPathFor(to), query: { redirect: to.fullPath } };
    }

    // 3. Role check -> authenticated user without the required role is forbidden
    if (to.meta.requiresAuth && to.meta.roles && to.meta.roles.length > 0) {
      if (!userRole || !to.meta.roles.includes(userRole)) {
        return '/forbidden';
      }
    }

    return true;
  });
}

export default setupRouteGuards;
