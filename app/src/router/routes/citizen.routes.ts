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
