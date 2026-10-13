import MyReportsView from '../../views/citizen/MyReportsView.vue';
import ReportIssueView from '../../views/citizen/ReportIssueView.vue';
import CommunityView from '../../views/citizen/CommunityView.vue';
import PaymentView from '../../views/citizen/PaymentView.vue';

export default [
  {
    path: '/citizen',
    name: 'CitizenHome',
    redirect: '/citizen/reports',
  },
  {
    path: '/citizen/reports',
    name: 'CitizenReports',
    component: MyReportsView,
  },
  {
    path: '/citizen/report-new',
    name: 'CitizenReportIssue',
    component: ReportIssueView,
  },
  {
    path: '/citizen/reports/sent/:reference?',
    name: 'report-sent',
    component: () => import('../../views/citizen/ReportSentView.vue'),
  },
  {
    path: '/citizen/reports/:reference/resolved',
    name: 'report-resolved',
    component: () => import('../../views/citizen/ResolvedConfirmationView.vue'),
  },
  {
    path: '/citizen/community',
    name: 'CitizenCommunity',
    component: CommunityView,
  },
  {
    path: '/citizen/payments',
    name: 'CitizenPayments',
    component: PaymentView,
  },
];
