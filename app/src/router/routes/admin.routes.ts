import type { RouteRecordRaw } from 'vue-router';
import AdminLayout from '../../layouts/AdminLayout.vue';
import CommandCenterView from '../../views/admin/CommandCenterView.vue';
import TicketsView from '../../views/admin/TicketsView.vue';
import FleetMapView from '../../views/admin/FleetMapView.vue';
import AuditLogsView from '../../views/admin/AuditLogsView.vue';

/**
 * County control centre (FE-031/033).
 * Parent record carries the RBAC meta consumed by router/guards.ts.
 */
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
    },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: CommandCenterView,
        meta: { title: 'Command Center' },
      },
      {
        path: 'tickets',
        name: 'AdminTickets',
        component: TicketsView,
        meta: { title: 'Ticket Dispatch' },
      },
      {
        path: 'fleet',
        name: 'AdminFleet',
        component: FleetMapView,
        meta: { title: 'Fleet & Routes' },
      },
      {
        path: 'audit-logs',
        name: 'AdminAuditLogs',
        component: AuditLogsView,
        meta: { title: 'Audit Logs' },
      },
    ],
  },
];

export default adminRoutes;
