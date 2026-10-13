import { createRouter, createWebHistory } from 'vue-router';
import adminRoutes from './routes/admin.routes';
import citizenRoutes from './routes/citizen.routes';
import fieldRoutes from './routes/field.routes';
import contractorRoutes from './routes/contractor.routes';
import NotFoundView from '../views/auth/NotFound.vue';

const routes = [
  ...adminRoutes,
  ...citizenRoutes,
  ...fieldRoutes,
  ...contractorRoutes,
  {
    path: '/',
    redirect: '/citizen/reports',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
