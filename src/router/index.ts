import { createRouter, createWebHistory } from "vue-router";
import { useMealStore } from "@/stores/meal";
import HomeView from "@/views/HomeView.vue";
import MealDetailView from "@/views/MealDetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresInitialData: true,
      },
    },
    {
      path: "/meal/:id",
      name: "meal-detail",
      component: MealDetailView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresInitialData) {
    const mealStore = useMealStore();

    const needsReset = from.name === "meal-detail" || !mealStore.initialized;

    if (needsReset) {
      await mealStore.resetAndInitialize();
    }
  }
  next();
});

export default router;
