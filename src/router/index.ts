import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import MealDetailView from "@/views/MealDetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/meal/:id",
      name: "meal-detail",
      component: MealDetailView,
    },
  ],
});

export default router;
