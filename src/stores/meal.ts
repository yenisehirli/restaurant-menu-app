import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Meal } from "@/types/meal";
import { mealService } from "@/services/api";

export const useMealStore = defineStore("meal", () => {
  const meals = ref<Meal[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);
  const currentSearchQuery = ref("");

  const suggestions = computed(() => {
    const query = currentSearchQuery.value.toLowerCase().trim();

    if (query.length < 3) return [];

    interface Suggestion {
      idMeal: string;
      strMeal: string;
      strMealThumb: string;
    }

    return meals.value
      .filter(
        (meal: Meal) =>
          meal.strMeal.toLowerCase().includes(query) ||
          meal.strCategory?.toLowerCase().includes(query) ||
          meal.strArea?.toLowerCase().includes(query)
      )
      .map(
        (meal: Meal): Suggestion => ({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
        })
      )
      .slice(0, 5);
  });

  async function searchMeals(query: string = "") {
    try {
      loading.value = true;
      error.value = null;

      const trimmedQuery = query.trim();

      if (trimmedQuery.length >= 3 || !trimmedQuery) {
        const response = await mealService.searchMeals(trimmedQuery);
        meals.value = response.meals || [];
      } else {
        meals.value = [];
      }

      initialized.value = true;
    } catch (err) {
      error.value = "An error occurred while loading meals.";
      meals.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function initializeStore() {
    if (!initialized.value && meals.value.length === 0) {
      await searchMeals("");
    }
  }

  async function resetAndInitialize() {
    try {
      loading.value = true;
      error.value = null;
      currentSearchQuery.value = "";
      initialized.value = false;

      const response = await mealService.searchMeals("");
      meals.value = response.meals || [];
      initialized.value = true;
    } catch (err) {
      error.value = "An error occurred while loading meals";
      meals.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    meals,
    loading,
    error,
    initialized,
    currentSearchQuery,
    suggestions,
    searchMeals,
    initializeStore,
    resetAndInitialize,
  };
});
