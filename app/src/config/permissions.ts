/**
 * Permission catalogue and role-to-permission mapping (FE-033).
 * Used by usePermission() in components and by tests/unit/admin-rbac.spec.ts.
 */

import type { UserRole } from '../types/user';

export const PERMISSIONS = [
  // Reports & tickets
  'report:create',
  'report:view:own',
  'report:view:all',
  'report:assign',
  'report:resolve',
  // Fleet & routes
  'fleet:view',
  'fleet:track',
  'route:audit',
  // Finance
  'finance:view',
  'finance:collect',
  'finance:refund',
  // Workforce
  'workforce:view',
  'workforce:manage',
  // Administration
  'user:manage',
  'role:manage',
  'audit:view',
  'config:manage',
  // Contractor ledger
  'contractor:view:own',
  'contractor:view:all',
  'contractor:attest',
  // Community
  'community:post',
  'community:moderate',
  // Offline sync
  'sync:push',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** Every permission, for admin and for "grant all" assertions in tests. */
export const ALL_PERMISSIONS: Permission[] = [...PERMISSIONS];

const ADMIN_PERMISSIONS = ALL_PERMISSIONS;

const CITIZEN_PERMISSIONS: Permission[] = [
  'report:create',
  'report:view:own',
  'finance:collect',
  'community:post',
  'sync:push',
];

const FIELD_PERMISSIONS: Permission[] = [
  'report:view:all',
  'report:assign',
  'report:resolve',
  'fleet:view',
  'workforce:view',
  'community:post',
  'sync:push',
];

const CONTRACTOR_PERMISSIONS: Permission[] = [
  'report:view:all',
  'report:resolve',
  'fleet:view',
  'fleet:track',
  'route:audit',
  'workforce:view',
  'contractor:view:own',
  'contractor:attest',
  'sync:push',
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ADMIN_PERMISSIONS,
  citizen: CITIZEN_PERMISSIONS,
  field: FIELD_PERMISSIONS,
  contractor: CONTRACTOR_PERMISSIONS,
};

export function permissionsForRole(role: UserRole | null | undefined): Permission[] {
  return role ? [...(ROLE_PERMISSIONS[role] ?? [])] : [];
}

export function roleHasPermission(role: UserRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission);
}

export function isPermission(value: unknown): value is Permission {
  return typeof value === 'string' && (PERMISSIONS as readonly string[]).includes(value);
}

export default ROLE_PERMISSIONS;
