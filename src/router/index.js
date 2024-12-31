import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/pcd",
    name: "pcd",
    meta: { title: "pcd模型室内导航" },
    component: () => import("../views/pcd/index.vue"),
  },
];

const router = createRouter({
  mode: history,
  // base:process.env.BASE_URL,
  history: createWebHistory(),
  routes,
});

export default router;
