import { defineStore } from "pinia";
import { ref } from "vue";
import type { Meal } from "@/types/meal";
import { mealService } from "@/services/api";

export const useMealStore = defineStore("meal", () => {
  const meals = ref<Meal[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);
  const currentSearchQuery = ref("");

  async function searchMeals(query: string = "") {
    try {
      loading.value = true;
      error.value = null;
      currentSearchQuery.value = query;

      const trimmedQuery = query.trim();
      const response = await mealService.searchMeals(trimmedQuery);

      if (response.meals === null) {
        meals.value = [];
      } else {
        meals.value = response.meals;
      }

      initialized.value = true;
    } catch (err) {
      error.value = "An error occurred while loading meals.";
      meals.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function resetAndInitialize() {
    currentSearchQuery.value = "";
    initialized.value = false;
    await searchMeals("");
  }

  async function initializeStore() {
    if (!initialized.value && meals.value.length === 0) {
      await searchMeals("");
    }
  }

  return {
    meals,
    loading,
    error,
    initialized,
    currentSearchQuery,
    searchMeals,
    initializeStore,
    resetAndInitialize,
  };
});
