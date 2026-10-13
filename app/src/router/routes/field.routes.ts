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
