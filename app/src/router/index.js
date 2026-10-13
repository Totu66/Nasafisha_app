import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import OperationsView from "../views/OperationsView.vue";
import FleetView from "../views/FleetView.vue";
import TicketsView from "../views/TicketsView.vue";
import DumpingSitesView from "../views/DumpingSitesView.vue";
import AccountsView from "../views/AccountsView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },

  {
    path: "/operations",
    name: "Operations",
    component: OperationsView,
    meta: { requiresAuth: true },
  },

  {
    path: "/fleet",
    name: "Fleet",
    component: FleetView,
    meta: { requiresAuth: true },
  },

 { 
    path: "/tickets",
    name: "Tickets",
    component: TicketsView,
    meta: { requiresAuth: true }
  },
  
  {
  path: "/dumping-sites",
  name: "DumpingSites",
  component: DumpingSitesView,
  meta: { requiresAuth: true }
},

{
    path: "/accounts",
    name: "Accounts",
    component: AccountsView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isLoggedIn =
    localStorage.getItem("nasafisha_logged_in") === "true";

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: {
        returnUrl: to.fullPath,
      },
    };
  }

  if (to.name === "Login" && isLoggedIn) {
    return "/dashboard";
  }

  return true;
});

export default router;
