import CommandCenterView from '../../views/admin/CommandCenterView.vue';
import TicketsView from '../../views/admin/TicketsView.vue';
import AuditLogsView from '../../views/admin/AuditLogsView.vue';

export default [
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: CommandCenterView,
  },
  {
    path: '/admin/tickets',
    name: 'AdminTickets',
    component: TicketsView,
  },

  {
    path: '/admin/audit-logs',
    name: 'AdminAuditLogs',
    component: AuditLogsView,
  },
];
