import type { RouteRecordRaw } from 'vue-router';
import FieldLayout from '../../layouts/FieldLayout.vue';
import FieldLogin from '../../views/auth/FieldLogin.vue';
import MyTicketsView from '../../views/field/MyTicketsView.vue';
import PendingSyncView from '../../views/field/PendingSyncView.vue';
import SafetyAlertView from '../../views/field/SafetyAlertView.vue';

/**
 * Field crew portal (FR-002 … FR-007), wrapped in FieldLayout (FE-031).
 * Parent record carries the RBAC meta consumed by router/guards.ts.
 */
export const fieldRoutes: RouteRecordRaw[] = [
  {
    path: '/field/login',
    name: 'FieldLogin',
    component: FieldLogin,
    meta: {
      guestOnly: true,
      title: 'Field Crew Sign-In',
    },
  },
  {
    path: '/field',
    component: FieldLayout,
    meta: {
      requiresAuth: true,
      roles: ['field', 'admin'],
    },
    children: [
      {
        path: '',
        redirect: '/field/tickets',
      },
      {
        path: 'tickets',
        name: 'FieldTickets',
        component: MyTicketsView,
        meta: { title: 'My Tickets' },
      },
      {
        path: 'sync',
        name: 'FieldSync',
        component: PendingSyncView,
        meta: { title: 'Pending Sync' },
      },
      {
        path: 'safety',
        name: 'FieldSafety',
        component: SafetyAlertView,
        meta: { title: 'Safety Alerts' },
      },
    ],
  },
];

export default fieldRoutes;
