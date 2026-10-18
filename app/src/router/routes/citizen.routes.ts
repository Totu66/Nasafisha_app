import type { RouteRecordRaw } from 'vue-router';
import CitizenLayout from '../../layouts/CitizenLayout.vue';
import HomeView from '../../views/citizen/HomeView.vue';
import MyReportsView from '../../views/citizen/MyReportsView.vue';
import ReportIssueView from '../../views/citizen/ReportIssueView.vue';
import ReportSentView from '../../views/citizen/ReportSentView.vue';
import ReportDetailView from '../../views/citizen/ReportDetailView.vue';
import ResolvedConfirmationView from '../../views/citizen/ResolvedConfirmationView.vue';
import CommunityView from '../../views/citizen/CommunityView.vue';
import PaymentView from '../../views/citizen/PaymentView.vue';
import PaymentHistoryView from '../../views/citizen/PaymentHistoryView.vue';
import NotificationsView from '../../views/citizen/NotificationsView.vue';
import CleanupEventsView from '../../views/citizen/CleanupEventsView.vue';
import DisposalGuidanceView from '../../views/citizen/DisposalGuidanceView.vue';
import ConsentView from '../../views/citizen/ConsentView.vue';

/**
 * Citizen portal (FR-001 … FR-014), wrapped in CitizenLayout (FE-031).
 * Parent record carries the RBAC meta consumed by router/guards.ts.
 */
export const citizenRoutes: RouteRecordRaw[] = [
  {
    path: '/citizen',
    component: CitizenLayout,
    meta: {
      requiresAuth: true,
      roles: ['citizen', 'admin'],
    },
    children: [
      {
        path: '',
        name: 'CitizenHome',
        component: HomeView,
        meta: { title: 'Home' },
      },
      {
        path: 'reports',
        name: 'CitizenReports',
        component: MyReportsView,
        meta: { title: 'My Reports' },
      },
      {
        path: 'report-new',
        name: 'CitizenReportIssue',
        component: ReportIssueView,
        meta: { title: 'Report an Issue' },
      },
      {
        path: 'reports/sent/:reference?',
        name: 'CitizenReportSent',
        component: ReportSentView,
        meta: { title: 'Report Sent' },
      },
      {
        path: 'reports/:reference/resolved',
        name: 'CitizenReportResolved',
        component: ResolvedConfirmationView,
        meta: { title: 'Report Resolved' },
      },
      {
        path: 'reports/:reference',
        name: 'CitizenReportDetail',
        component: ReportDetailView,
        meta: { title: 'Report Status' },
      },
      {
        path: 'community',
        name: 'CitizenCommunity',
        component: CommunityView,
        meta: { title: 'Community' },
      },
      {
        path: 'payments',
        name: 'CitizenPayments',
        component: PaymentView,
        meta: { title: 'Payments & References' },
      },
      {
        path: 'payments/history',
        name: 'CitizenPaymentHistory',
        component: PaymentHistoryView,
        meta: { title: 'Payment History' },
      },
      {
        path: 'notifications',
        name: 'CitizenNotifications',
        component: NotificationsView,
        meta: { title: 'Notifications' },
      },
      {
        path: 'cleanup-events',
        name: 'CitizenCleanupEvents',
        component: CleanupEventsView,
        meta: { title: 'Cleanup Events' },
      },
      {
        path: 'disposal-guidance',
        name: 'CitizenDisposalGuidance',
        component: DisposalGuidanceView,
        meta: { title: 'Disposal Guidance' },
      },
      {
        path: 'consent',
        name: 'CitizenConsent',
        component: ConsentView,
        meta: { title: 'Data Consent' },
      },
    ],
  },
];

export default citizenRoutes;
