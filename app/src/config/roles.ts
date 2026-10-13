// Single source of truth for roles (SRS FR-003: exactly one role per user).
export const ROLES = {
  CITIZEN: 'citizen',
  FIELD_CREW: 'field_crew',
  FIELD_SUPERVISOR: 'field_supervisor',
  OPERATIONS_MANAGER: 'operations_manager',
  EXECUTIVE: 'executive',
  COUNTY_ICT_ADMIN: 'county_ict_admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Roles allowed inside the admin website.
// Field supervisors work in the field app, so they are not listed here.
export const ADMIN_ROLES: readonly Role[] = [
  ROLES.EXECUTIVE,
  ROLES.OPERATIONS_MANAGER,
  ROLES.COUNTY_ICT_ADMIN,
]

// Where each admin role lands after sign-in.
export const ADMIN_HOME_PATH: Partial<Record<Role, string>> = {
  [ROLES.EXECUTIVE]: '/admin/executive',
  [ROLES.OPERATIONS_MANAGER]: '/admin/ops',
  [ROLES.COUNTY_ICT_ADMIN]: '/admin/accounts',
}
