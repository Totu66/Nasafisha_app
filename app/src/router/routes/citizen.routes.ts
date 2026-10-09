import type { RouteRecordRaw } from 'vue-router';
import CitizenLayout from '../../layouts/CitizenLayout.vue';
import MyReportsView from '../../views/citizen/MyReportsView.vue';
import ReportIssueView from '../../views/citizen/ReportIssueView.vue';
import CommunityView from '../../views/citizen/CommunityView.vue';
import PaymentView from '../../views/citizen/PaymentView.vue';

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
        redirect: '/citizen/reports',
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
    ],
  },
];

export default citizenRoutes;
