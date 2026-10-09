import type { RouteRecordRaw } from 'vue-router';
import ContractorScorecardView from '../../views/contractor/ContractorScorecardView.vue';
import EvidenceLedgerView from '../../views/contractor/EvidenceLedgerView.vue';
import ContractorLogin from '../../views/auth/ContractorLogin.vue';

export const contractorRoutes: RouteRecordRaw[] = [
  {
    path: '/contractor/login',
    name: 'ContractorLogin',
    component: ContractorLogin,
    meta: {
      guestOnly: true,
      title: 'Contractor Portal Sign-In',
    },
  },
  {
    path: '/contractor',
    name: 'ContractorRoot',
    redirect: '/contractor/scorecard',
  },
  {
    path: '/contractor/scorecard',
    name: 'ContractorScorecard',
    component: ContractorScorecardView,
    meta: {
      requiresAuth: true,
      roles: ['contractor', 'admin'],
      title: 'SLA Scorecard',
    },
  },
  {
    path: '/contractor/ledger',
    name: 'ContractorEvidenceLedger',
    component: EvidenceLedgerView,
    meta: {
      requiresAuth: true,
      roles: ['contractor', 'admin'],
      title: 'Evidence Ledger & Proof Audit',
    },
  },
];

export default contractorRoutes;
