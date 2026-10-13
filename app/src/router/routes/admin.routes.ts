import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { ADMIN_HOME_PATH, ADMIN_ROLES } from '@/config/roles'
import { PERMISSIONS } from '@/config/permissions'
import { useAuthStore } from '@/store/auth.store'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/sign-in',
    component: AuthLayout,
    meta: { public: true },
    children: [
      {
        path: '',
        name: 'admin-login',
        component: () => import('@/views/auth/AdminLogin.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ADMIN_ROLES },
    children: [
      {
        // /admin sends each role to its own home page.
        path: '',
        name: 'admin-home',
        redirect: () => {
          const auth = useAuthStore()
          return (auth.role && ADMIN_HOME_PATH[auth.role]) || '/admin/sign-in'
        },
      },
      {
        path: 'executive',
        name: 'admin-executive',
        component: () => import('@/views/admin/CommandCenterView.vue'),
        props: { mode: 'executive' },
        meta: { permission: PERMISSIONS.DASHBOARD_EXECUTIVE },
      },
      {
        path: 'ops',
        name: 'admin-ops',
        component: () => import('@/views/admin/CommandCenterView.vue'),
        props: { mode: 'operations' },
        meta: { permission: PERMISSIONS.DASHBOARD_OPERATIONS },
      },
      {
        path: 'ops/fleet',
        name: 'admin-fleet',
        component: () => import('@/views/admin/FleetMapView.vue'),
        meta: { permission: PERMISSIONS.FLEET_VIEW },
      },
      {
        path: 'ops/fleet/:vehicleId/audit',
        name: 'admin-route-audit',
        component: () => import('@/views/admin/RouteAuditView.vue'),
        meta: { permission: PERMISSIONS.FLEET_VIEW },
      },
      {
        path: 'ops/tickets',
        name: 'admin-tickets',
        component: () => import('@/views/admin/TicketsView.vue'),
        meta: { permission: PERMISSIONS.TICKETS_VIEW },
      },
     {
        path: 'ops/tickets/:id',
        name: 'admin-ticket-detail',
        component: () => import('@/views/admin/AdminTicketDetailView.vue'),
        meta: { permission: PERMISSIONS.TICKETS_VIEW },
      },
      {
        path: 'ops/dumping-sites',
        name: 'admin-dumping-sites',
        component: () => import('@/views/admin/DumpingSitesView.vue'),
        meta: { permission: PERMISSIONS.DUMPING_VIEW },
      },
      {
        path: 'efficiency-index',
        name: 'admin-efficiency-index',
        component: () => import('@/views/admin/EfficiencyIndexView.vue'),
        meta: { permission: PERMISSIONS.EFFICIENCY_VIEW },
      },
      {
        path: 'accounts',
        name: 'admin-accounts',
        component: () => import('@/views/admin/UsersRolesView.vue'),
        meta: { permission: PERMISSIONS.ACCOUNTS_MANAGE },
      },
      {
        path: 'audit-logs',
        name: 'admin-audit-logs',
        component: () => import('@/views/admin/AuditLogsView.vue'),
      },
    ],
  },
]

export default adminRoutes
