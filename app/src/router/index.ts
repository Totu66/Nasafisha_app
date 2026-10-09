import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AuthLayout from '../layouts/AuthLayout.vue';
import adminRoutes from './routes/admin.routes';
import citizenRoutes from './routes/citizen.routes';
import fieldRoutes from './routes/field.routes';
import contractorRoutes from './routes/contractor.routes';
import StaffLogin from '../views/auth/StaffLogin.vue';
import CitizenLogin from '../views/auth/CitizenLogin.vue';
import ForbiddenView from '../views/auth/Forbidden.vue';
import NotFoundView from '../views/auth/NotFound.vue';
import { setupRouteGuards } from './guards';
import { useAuthStore } from '../store/auth.store';
import { homeRouteFor } from '../config/roles';

/**
 * Public entry point: signed-in users go to their portal home,
 * guests land on the citizen sign-in (FR-001).
 */
function defaultHome(): string {
  const auth = useAuthStore();
  return auth.isAuthenticated && auth.role ? homeRouteFor(auth.role) : '/citizen/login';
}

const routes: RouteRecordRaw[] = [
  // Public & Authentication routes (AuthLayout shell — FE-031)
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'StaffLogin',
        component: StaffLogin,
        meta: {
          guestOnly: true,
          title: 'Staff Login',
        },
      },
    ],
  },
  {
    path: '/citizen/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'CitizenLogin',
        component: CitizenLogin,
        meta: {
          guestOnly: true,
          title: 'Citizen Sign-In',
        },
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: ForbiddenView,
    meta: {
      title: 'Access Forbidden',
    },
  },

  // Role domain routes (each wrapped in its own layout — FE-031/033)
  ...adminRoutes,
  ...citizenRoutes,
  ...fieldRoutes,
  ...contractorRoutes,

  // Root redirect
  {
    path: '/',
    redirect: defaultHome,
  },

  // Catch-all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: {
      title: 'Page Not Found',
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Attach role-based route guard
setupRouteGuards(router);

export default router;
