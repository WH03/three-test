import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/pcd",
    name: "pcd",
    meta: { title: "pcd模型室内导航" },
    component: () => import("../views/pcd/index.vue"),
  },
  {
    path: "/raycaster",
    name: "raycaster",
    meta: { title: "鼠标交互" },
    component: () => import("../views/raycaster/index.vue"),
  },

  {
    path: "/clipping",
    name: "clipping",
    meta: { title: "裁切" },
    component: () => import("../views/clipping/index.vue"),
  },


];

const router = createRouter({
  mode: history,
  // base:process.env.BASE_URL,
  history: createWebHistory(),
  routes,
});

export default router;
