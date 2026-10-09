<<<<<<< HEAD
import type { RouteRecordRaw } from 'vue-router'
import FieldLayout from '@/layouts/FieldLayout.vue'
import { ROLES } from '@/config/roles'

const fieldRoutes: RouteRecordRaw[] = [
  {
    path: '/field',
    component: FieldLayout,
    meta: { requiresAuth: true, roles: [ROLES.FIELD_CREW, ROLES.FIELD_SUPERVISOR] },
    children: [
      { path: '', redirect: { name: 'field-tickets' } },
      {
        path: 'tickets',
        name: 'field-tickets',
        component: () => import('@/views/field/MyTicketsView.vue'),
      },
      {
        path: 'tickets/:id',
        name: 'field-ticket-detail',
        component: () => import('@/views/field/TicketDetailView.vue'),
      },
      {
        path: 'tickets/:id/close',
        name: 'field-close-ticket',
        component: () => import('@/views/field/CloseTicketView.vue'),
      },
      {
        path: 'done-today',
        name: 'field-done-today',
        component: () => import('@/views/field/PendingSyncView.vue'),
      },
    ],
  },
]

export default fieldRoutes
=======
import MyTicketsView from '../../views/field/MyTicketsView.vue';
import PendingSyncView from '../../views/field/PendingSyncView.vue';
import SafetyAlertView from '../../views/field/SafetyAlertView.vue';

export default [
  {
    path: '/field',
    name: 'FieldHome',
    redirect: '/field/tickets',
  },
  {
    path: '/field/tickets',
    name: 'FieldTickets',
    component: MyTicketsView,
  },
  {
    path: '/field/sync',
    name: 'FieldSync',
    component: PendingSyncView,
  },
  {
    path: '/field/safety',
    name: 'FieldSafety',
    component: SafetyAlertView,
  },
];
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
