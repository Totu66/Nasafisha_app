import { createRouter, createWebHistory } from "vue-router";
import {
  HomeView,
  PostsView,
  DetailsView,
  ApiTestView,
  LandingView,
} from "../views";
import { useAuthStore } from "../store";

const routes = [
  { path: "/", name: "app", component: LandingView },
  { path: "/home", name: "home", component: HomeView },
  {
    path: "/api",
    name: "api",
    component: ApiTestView,
    meta: { requiresAuth: true },
  },
  {
    path: "/posts",
    name: "posts",
    component: PostsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/posts/:id",
    name: "details",
    component: DetailsView,
    props: true,
    meta: { requiresAuth: true },
  },
];

/**Initialize here */
const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  /**If the user is just landing, try to restore session first
   * This "picks up" the session from the Magic Link URL hash
   */
  if (!auth.user) {
    try {
      await auth.fetchUser();
    } catch (err) {
      console.error("Failed to restore session:", err);
    }
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // 2. If route requires auth and we still don't have a user
  if (requiresAuth && !auth.user) {
    return {
      path: "/login",
      query: { returnUrl: to.fullPath },
    };
  }

  /**If user is logged in and tries to go to login page */
  if (to.name === "Login" && auth.user) {
  }

  // // redirect to login page if not logged in and trying to access a restricted page
  // const publicPages = ["/", "/login"];
  // const authRequired = !publicPages.includes(to.path);
  // const auth = useAuthStore();

  // /**add function to check if user is logged in */
  // if (authRequired && !auth.user) {
  //   auth.returnUrl = to.fullPath;
  //   auth.isLoginModalOpen = true;
  //   return from.fullPath;
  //   // return "/login";
  // }
});

export default router;
