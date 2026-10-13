import { PERMISSIONS, type Permission } from './permissions'

export interface NavItem {
  labelKey: string // i18n key
  to: string
  permission: Permission // item shows only if the role has this
}

// One list drives the whole menu. Add a page = add a line.
export const ADMIN_NAV: NavItem[] = [
  { labelKey: 'nav.overview', to: '/admin/executive', permission: PERMISSIONS.DASHBOARD_EXECUTIVE },
  { labelKey: 'nav.overview', to: '/admin/ops', permission: PERMISSIONS.DASHBOARD_OPERATIONS },
  { labelKey: 'nav.fleetMap', to: '/admin/ops/fleet', permission: PERMISSIONS.FLEET_VIEW },
  { labelKey: 'nav.tickets', to: '/admin/ops/tickets', permission: PERMISSIONS.TICKETS_VIEW },
  { labelKey: 'nav.dumpingSites', to: '/admin/ops/dumping-sites', permission: PERMISSIONS.DUMPING_VIEW },
  { labelKey: 'nav.efficiencyIndex', to: '/admin/efficiency-index', permission: PERMISSIONS.EFFICIENCY_VIEW },
  { labelKey: 'nav.accounts', to: '/admin/accounts', permission: PERMISSIONS.ACCOUNTS_MANAGE },
]