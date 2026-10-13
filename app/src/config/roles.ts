/**
 * Role definitions for NASAFISHA (FE-033).
 * Single source of truth for what each of the four SRS roles may do.
 */

import type { UserRole } from '../types/user';

export interface RoleDefinition {
  key: UserRole;
  label: string;
  /** Route the user is sent to after signing in. */
  homeRoute: string;
  /** Route used when the role is not signed in. */
  loginRoute: string;
  description: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  admin: {
    key: 'admin',
    label: 'Administrator',
    homeRoute: '/admin',
    loginRoute: '/login',
    description: 'County operations staff with full oversight of tickets, fleet, finance and audit.',
  },
  citizen: {
    key: 'citizen',
    label: 'Citizen',
    homeRoute: '/citizen/reports',
    loginRoute: '/citizen/login',
    description: 'Residents who report issues, track progress and pay waste service fees.',
  },
  field: {
    key: 'field',
    label: 'Field Crew',
    homeRoute: '/field/tickets',
    loginRoute: '/field/login',
    description: 'Crew members assigned tickets, attendance, shifts and offline synchronisation.',
  },
  contractor: {
    key: 'contractor',
    label: 'Contractor',
    homeRoute: '/contractor/scorecard',
    loginRoute: '/contractor/login',
    description: 'Franchise operators reviewing SLA scorecards and the shared evidence ledger.',
  },
};

export const ROLES: UserRole[] = Object.keys(ROLE_DEFINITIONS) as UserRole[];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && value in ROLE_DEFINITIONS;
}

export function roleLabel(role: UserRole | null | undefined): string {
  return role ? ROLE_DEFINITIONS[role].label : 'Guest';
}

export function homeRouteFor(role: UserRole | null | undefined): string {
  return role ? ROLE_DEFINITIONS[role].homeRoute : '/login';
}

export function loginRouteFor(role: UserRole | null | undefined): string {
  return role ? ROLE_DEFINITIONS[role].loginRoute : '/login';
}

export default ROLE_DEFINITIONS;
