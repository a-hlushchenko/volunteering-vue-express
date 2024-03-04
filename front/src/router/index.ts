import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminLoginView from "../views/AdminLoginView.vue";
import AdminAdd from "../views/AdminAdd.vue";
import AdminRequests from "../views/AdminRequests.vue";
import AdminProposes from "../views/AdminProposes.vue";
import AdminEdit from "../views/AdminEdit.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/admin-login",
      name: "Admin login",
      component: AdminLoginView,
    },
    {
      path: "/admin-proposes",
      name: "Admin proposes",
      component: AdminProposes,
    },
    {
      path: "/admin-requests",
      name: "Admin requests",
      component: AdminRequests,
    },
    {
      path: "/admin-add",
      name: "Admin add",
      component: AdminAdd,
    },
    {
      path: "/admin/:postId",
      name: "Admin edit post",
      component: AdminEdit,
    },
  ],
});

export default router;
