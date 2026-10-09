<<<<<<< HEAD
export {};
=======
import { createRouter, createWebHistory } from 'vue-router';
import adminRoutes from './routes/admin.routes';
import citizenRoutes from './routes/citizen.routes';
import fieldRoutes from './routes/field.routes';
import CitizenLogin from '../views/auth/CitizenLogin.vue';
import NotFoundView from '../views/auth/NotFound.vue';

const routes = [
  ...adminRoutes,
  ...citizenRoutes,
  ...fieldRoutes,
  {
    path: '/',
    name: 'CitizenLogin',
    component: CitizenLogin,
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
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
