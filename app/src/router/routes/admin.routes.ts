import type { RouteRecordRaw } from 'vue-router';
import AdminLayout from '../../layouts/AdminLayout.vue';
import CommandCenterView from '../../views/admin/CommandCenterView.vue';
import TicketsView from '../../views/admin/TicketsView.vue';
import AdminTicketDetailView from '../../views/admin/AdminTicketDetailView.vue';
import FleetMapView from '../../views/admin/FleetMapView.vue';
import RouteAuditView from '../../views/admin/RouteAuditView.vue';
import DeviationAlertsView from '../../views/admin/DeviationAlertsView.vue';
import ContractorPerformanceView from '../../views/admin/ContractorPerformanceView.vue';
import AuditLogsView from '../../views/admin/AuditLogsView.vue';
import UsersRolesView from '../../views/admin/UsersRolesView.vue';
import ZoningOverlayView from '../../views/admin/ZoningOverlayView.vue';
import TrendAnalyticsView from '../../views/admin/TrendAnalyticsView.vue';
import SpatialLedgerView from '../../views/admin/SpatialLedgerView.vue';
import ShiftPerformanceView from '../../views/admin/ShiftPerformanceView.vue';
import SafetyAlertsView from '../../views/admin/SafetyAlertsView.vue';
import PaymentsView from '../../views/admin/PaymentsView.vue';
import PaymentComplianceView from '../../views/admin/PaymentComplianceView.vue';
import NotificationsView from '../../views/admin/NotificationsView.vue';
import HotspotModelView from '../../views/admin/HotspotModelView.vue';
import FinancialOversightView from '../../views/admin/FinancialOversightView.vue';
import EfficiencyIndexView from '../../views/admin/EfficiencyIndexView.vue';
import DumpingSitesView from '../../views/admin/DumpingSitesView.vue';
import AttendanceView from '../../views/admin/AttendanceView.vue';

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
        name: 'admin-tickets',
        component: TicketsView,
        meta: { title: 'Ticket Dispatch' },
      },
      {
        path: 'tickets/:id',
        name: 'admin-ticket-detail',
        component: AdminTicketDetailView,
        meta: { title: 'Ticket Detail' },
      },
      {
        path: 'accounts',
        name: 'AdminAccounts',
        component: UsersRolesView,
        meta: { title: 'Users & Roles' },
      },
      {
        path: 'zoning',
        name: 'AdminZoning',
        component: ZoningOverlayView,
        meta: { title: 'Zoning Overlay' },
      },
      {
        path: 'trends',
        name: 'AdminTrends',
        component: TrendAnalyticsView,
        meta: { title: 'Trend Analytics' },
      },
      {
        path: 'spatial-ledger',
        name: 'AdminSpatialLedger',
        component: SpatialLedgerView,
        meta: { title: 'Spatial Ledger' },
      },
      {
        path: 'shifts',
        name: 'AdminShifts',
        component: ShiftPerformanceView,
        meta: { title: 'Shift Performance' },
      },
      {
        path: 'safety-alerts',
        name: 'AdminSafetyAlerts',
        component: SafetyAlertsView,
        meta: { title: 'Safety Alerts' },
      },
      {
        path: 'payments',
        name: 'AdminPayments',
        component: PaymentsView,
        meta: { title: 'Payments' },
      },
      {
        path: 'payment-compliance',
        name: 'AdminPaymentCompliance',
        component: PaymentComplianceView,
        meta: { title: 'Payment Compliance' },
      },
      {
        path: 'notifications',
        name: 'AdminNotifications',
        component: NotificationsView,
        meta: { title: 'Notifications' },
      },
      {
        path: 'hotspots',
        name: 'AdminHotspots',
        component: HotspotModelView,
        meta: { title: 'Hotspot Model' },
      },
      {
        path: 'finance',
        name: 'AdminFinance',
        component: FinancialOversightView,
        meta: { title: 'Financial Oversight' },
      },
      {
        path: 'efficiency-index',
        name: 'AdminEfficiencyIndex',
        component: EfficiencyIndexView,
        meta: { title: 'Efficiency Index' },
      },
      {
        path: 'dumping-sites',
        name: 'AdminDumpingSites',
        component: DumpingSitesView,
        meta: { title: 'Dumping Sites' },
      },
      {
        path: 'attendance',
        name: 'AdminAttendance',
        component: AttendanceView,
        meta: { title: 'Attendance' },
      },
      {
        path: 'fleet',
        name: 'AdminFleet',
        component: FleetMapView,
        meta: { title: 'Fleet & Routes' },
      },
      {
        path: 'route-audit',
        name: 'AdminRouteAudit',
        component: RouteAuditView,
        meta: { title: 'Route Audit' },
      },
      {
        path: 'deviation-alerts',
        name: 'AdminDeviationAlerts',
        component: DeviationAlertsView,
        meta: { title: 'Deviation Alerts' },
      },
      {
        path: 'contractors',
        name: 'AdminContractorPerformance',
        component: ContractorPerformanceView,
        meta: { title: 'Contractor Performance' },
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
