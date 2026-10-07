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
