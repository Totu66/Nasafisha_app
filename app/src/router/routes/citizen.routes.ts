{
  path: 'reports/sent/:reference?',          // reference is optional: an offline-saved report has none yet
  name: 'report-sent',
  component: () => import('../../views/citizen/ReportSentView.vue'),
  // meta: { ...copy from the ReportIssueView route }
},
{
  path: 'reports/:reference/resolved',
  name: 'report-resolved',
  component: () => import('../../views/citizen/ResolvedConfirmationView.vue'),
  // meta: { ...copy from the ReportDetailView route }
}