import { ROLES, type Role } from './roles'

// Pages and navigation check permissions, never role names.
// To change what a role can do, edit ROLE_PERMISSIONS only.
export const PERMISSIONS = {
  DASHBOARD_EXECUTIVE: 'dashboard:executive', // municipality summary only (AC-030.1)
  DASHBOARD_OPERATIONS: 'dashboard:operations', // zone drill-down
  FLEET_VIEW: 'fleet:view',
  TICKETS_VIEW: 'tickets:view',
  DUMPING_VIEW: 'dumping:view',
  EFFICIENCY_VIEW: 'efficiency:view',
  ACCOUNTS_MANAGE: 'accounts:manage',
   // ICT Administrator only (FR-003)
    // Add inside PERMISSIONS:
  CREW_STATUS_VIEW: 'crew:status:view',
  DEVIATION_AUTHORISE: 'deviation:authorise', // FR-022
  CLOSURE_APPROVE: 'closure:approve', // BR-013.2
  CREW_PIN_RESET: 'crew:pin:reset', // BR-002.2
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.CITIZEN]: [],
  [ROLES.FIELD_CREW]: [],
  [ROLES.FIELD_SUPERVISOR]: [],
  [ROLES.EXECUTIVE]: [PERMISSIONS.DASHBOARD_EXECUTIVE, PERMISSIONS.EFFICIENCY_VIEW],
  [ROLES.OPERATIONS_MANAGER]: [
    PERMISSIONS.DASHBOARD_OPERATIONS,
    PERMISSIONS.FLEET_VIEW,
    PERMISSIONS.TICKETS_VIEW,
    PERMISSIONS.DUMPING_VIEW,
    PERMISSIONS.EFFICIENCY_VIEW,
  ],
 

// Replace the field_supervisor line in ROLE_PERMISSIONS with:
  [ROLES.FIELD_SUPERVISOR]: [
    PERMISSIONS.CREW_STATUS_VIEW,
    PERMISSIONS.DEVIATION_AUTHORISE,
    PERMISSIONS.CLOSURE_APPROVE,
    PERMISSIONS.CREW_PIN_RESET,
  ],

  [ROLES.COUNTY_ICT_ADMIN]: [PERMISSIONS.ACCOUNTS_MANAGE],
}

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}