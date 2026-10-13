import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../../src/store/auth.store';
import {
  ROLE_DEFINITIONS,
  ROLES,
  homeRouteFor,
  loginRouteFor,
  roleLabel,
} from '../../src/config/roles';
import { permissionsForRole, roleHasPermission } from '../../src/config/permissions';
import { usePermission } from '../../src/composables/usePermission';
import { router } from '../../src/router';
import type { UserRole } from '../../src/types/user';

function signIn(role: UserRole) {
  // Fresh pinia so the guard resolves a store that already holds the session.
  const pinia = createPinia();
  setActivePinia(pinia);
  useAuthStore().setSession({
    token: `token-${role}`,
    user: { id: `usr_${role}`, name: `${role} tester`, role },
  });
  return pinia;
}

async function visit(path: string): Promise<string> {
  await router.push(path);
  return router.currentRoute.value.fullPath;
}

describe('role definitions (FE-033)', () => {
  it('defines exactly the four SRS roles', () => {
    expect(ROLES.sort()).toEqual(['admin', 'citizen', 'contractor', 'field']);
  });

  it('gives every role a distinct home and login route', () => {
    for (const role of ROLES) {
      const def = ROLE_DEFINITIONS[role];
      expect(def.homeRoute).toMatch(/^\//);
      expect(def.loginRoute).toMatch(/^\//);
      expect(def.label.length).toBeGreaterThan(0);
    }
    expect(homeRouteFor(null)).toBe('/login');
    expect(roleLabel(null)).toBe('Guest');
  });

  it('maps each role to its portal home', () => {
    expect(homeRouteFor('admin')).toBe('/admin');
    expect(homeRouteFor('citizen')).toBe('/citizen/reports');
    expect(homeRouteFor('field')).toBe('/field/tickets');
    expect(homeRouteFor('contractor')).toBe('/contractor/scorecard');
    expect(loginRouteFor('citizen')).toBe('/citizen/login');
    expect(loginRouteFor('field')).toBe('/field/login');
    expect(loginRouteFor('contractor')).toBe('/contractor/login');
  });
});

describe('permission matrix (FE-033)', () => {
  it('grants admin full access', () => {
    const adminPerms = permissionsForRole('admin');
    expect(adminPerms.length).toBeGreaterThan(0);
    expect(roleHasPermission('admin', 'report:assign')).toBe(true);
    expect(roleHasPermission('admin', 'audit:view')).toBe(true);
    expect(roleHasPermission('admin', 'user:manage')).toBe(true);
  });

  it('denies citizens admin-only permissions', () => {
    expect(roleHasPermission('citizen', 'report:assign')).toBe(false);
    expect(roleHasPermission('citizen', 'audit:view')).toBe(false);
    expect(roleHasPermission('citizen', 'user:manage')).toBe(false);
  });

  it('denies field crews finance, admin and citizen-only permissions', () => {
    expect(roleHasPermission('field', 'audit:view')).toBe(false);
    expect(roleHasPermission('field', 'finance:refund')).toBe(false);
    expect(roleHasPermission('field', 'user:manage')).toBe(false);
    expect(roleHasPermission('field', 'report:create')).toBe(false);
  });

  it('denies contractors citizen-only permissions', () => {
    expect(roleHasPermission('contractor', 'report:create')).toBe(false);
    expect(roleHasPermission('contractor', 'finance:collect')).toBe(false);
    expect(roleHasPermission('contractor', 'community:post')).toBe(false);
  });

  it('returns no permissions for a signed-out visitor', () => {
    expect(permissionsForRole(null)).toEqual([]);
    expect(roleHasPermission(null, 'report:create')).toBe(false);
  });
});

describe('usePermission composable (FE-033)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('exposes the signed-in role and its home route', () => {
    signIn('citizen');
    const { role, homeRoute, can, hasRole } = usePermission();

    expect(role.value).toBe('citizen');
    expect(homeRoute.value).toBe('/citizen/reports');
    expect(hasRole(['citizen', 'admin'])).toBe(true);
    expect(hasRole(['field'])).toBe(false);
    expect(can('report:create')).toBe(true);
    expect(can('report:assign')).toBe(false);
  });

  it('reports a guest when no session exists', () => {
    const { role, isAuthenticated, can } = usePermission();

    expect(role.value).toBeNull();
    expect(isAuthenticated.value).toBe(false);
    expect(can('report:create')).toBe(false);
  });
});

describe('route guards and RBAC boundaries', () => {
  beforeEach(async () => {
    localStorage.clear();
    setActivePinia(createPinia());
    useAuthStore();
    await router.replace('/');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('sends guests to their portal login with a redirect back', async () => {
    expect(await visit('/admin')).toBe('/login?redirect=/admin');
    expect(await visit('/citizen/reports')).toBe('/citizen/login?redirect=/citizen/reports');
    expect(await visit('/field/tickets')).toBe('/field/login?redirect=/field/tickets');
  });

  it('keeps admins inside the admin portal', async () => {
    signIn('admin');

    expect(await visit('/admin')).toBe('/admin');
    expect(await visit('/admin/audit-logs')).toBe('/admin/audit-logs');
    expect(await visit('/admin/tickets')).toBe('/admin/tickets');
  });

  it('blocks other roles from the admin portal', async () => {
    signIn('citizen');
    expect(await visit('/admin')).toBe('/forbidden');

    signIn('field');
    expect(await visit('/admin')).toBe('/forbidden');

    signIn('contractor');
    expect(await visit('/admin')).toBe('/forbidden');
  });

  it('keeps citizens inside their portal', async () => {
    signIn('citizen');

    expect(await visit('/citizen/reports')).toBe('/citizen/reports');
    expect(await visit('/citizen/payments')).toBe('/citizen/payments');
    expect(await visit('/field/tickets')).toBe('/forbidden');
    expect(await visit('/contractor/scorecard')).toBe('/forbidden');
  });

  it('keeps field crews inside their portal', async () => {
    signIn('field');

    expect(await visit('/field/tickets')).toBe('/field/tickets');
    expect(await visit('/field/sync')).toBe('/field/sync');
    expect(await visit('/citizen/reports')).toBe('/forbidden');
  });

  it('redirects signed-in users away from login pages', async () => {
    signIn('admin');
    expect(await visit('/login')).toBe('/admin');
  });

  it('resolves the unknown routes to the 404 page', async () => {
    expect(await visit('/definitely/not/a/route')).toBe('/definitely/not/a/route');
    expect(router.currentRoute.value.name).toBe('NotFound');
  });
});
