import type { RouteRecordRaw } from 'vue-router';
import FieldLayout from '../../layouts/FieldLayout.vue';
import FieldLogin from '../../views/auth/FieldLogin.vue';
import MyTicketsView from '../../views/field/MyTicketsView.vue';
import PendingSyncView from '../../views/field/PendingSyncView.vue';
import SafetyAlertView from '../../views/field/SafetyAlertView.vue';
import TicketDetailView from '../../views/field/TicketDetailView.vue';
import CloseTicketView from '../../views/field/CloseTicketView.vue';
import ApproveClosingView from '../../views/field/ApproveClosingView.vue';
import ResetPinView from '../../views/field/ResetPinView.vue';
import crewAlerts from '../../views/field/crewAlerts.vue';
import ShiftView from '../../views/field/ShiftView.vue';
import AttendanceView from '../../views/field/AttendanceView.vue';

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
        name: 'field-tickets',
        component: MyTicketsView,
        meta: { title: 'My Tickets' },
      },
      {
        path: 'tickets/:id',
        name: 'field-ticket-detail',
        component: TicketDetailView,
        meta: { title: 'Ticket Detail' },
      },
      {
        path: 'tickets/:id/close',
        name: 'field-close-ticket',
        component: CloseTicketView,
        meta: { title: 'Close Ticket' },
      },
      {
        path: 'approvals',
        name: 'field-approvals',
        component: ApproveClosingView,
        meta: { title: 'Closure Approvals' },
      },
      {
        path: 'crew/:crewId?/reset-pin',
        name: 'field-reset-pin',
        component: ResetPinView,
        meta: { title: 'Reset PIN' },
      },
      {
        // The dedicated supervisor crews screen is an empty source file (not routable);
        // approvals land back on the ticket queue until it is built.
        path: 'crews',
        name: 'field-crews',
        redirect: '/field/tickets',
      },
      {
        path: 'alerts',
        name: 'field-crew-alerts',
        component: crewAlerts,
        meta: { title: 'Crew Alerts' },
      },
      {
        path: 'shift',
        name: 'field-shift',
        component: ShiftView,
        meta: { title: 'Shift' },
      },
      {
        path: 'attendance',
        name: 'field-attendance',
        component: AttendanceView,
        meta: { title: 'Attendance' },
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
