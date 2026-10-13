import ContractorLoginView from '../../views/contractors/ContractorLoginView.vue';
import EvidenceLedgerView from '../../views/contractors/EvidenceLedgerView.vue';

export default [
  {
    path: '/contractor',
    name: 'ContractorHome',
    redirect: '/contractor/login',
  },
  {
    path: '/contractor/login',
    name: 'ContractorLogin',
    component: ContractorLoginView,
  },
  {
    path: '/contractor/evidence-ledger',
    name: 'ContractorEvidenceLedger',
    component: EvidenceLedgerView,
  },
];
