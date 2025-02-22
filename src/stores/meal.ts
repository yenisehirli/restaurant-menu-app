import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Meal, MealSuggestion } from "@/types/meal";
import { mealService } from "@/services/api";

export const useMealStore = defineStore("meal", () => {
  const meals = ref<Meal[]>([]);
  const allMeals = ref<MealSuggestion[]>([]);
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

  async function loadAllMealsForSuggestions() {
    try {
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      const allMealsSet = new Set<string>();

      for (const letter of alphabet) {
        const response = await mealService.searchByFirstLetter(letter);
        if (response.meals) {
          response.meals.forEach((meal: Meal) => {
            if (!allMealsSet.has(meal.idMeal)) {
              allMealsSet.add(meal.idMeal);
              allMeals.value.push({
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb,
              });
            }
          });
        }
      }
    } catch (err) {
      console.error("Yemek önerileri yüklenirken hata oluştu:", err);
    }
  }

  async function initializeStore() {
    if (!initialized.value && meals.value.length === 0) {
      await searchMeals("");
    }
  }

  async function resetAndInitialize() {
    currentSearchQuery.value = "";
    initialized.value = false;
    await searchMeals("");
  }

  async function getRandomMeal() {
    try {
      loading.value = true;
      error.value = null;

      const response = await mealService.getRandomMeal();

      if (response.meals && response.meals.length > 0) {
        return response.meals[0];
      }
      return null;
    } catch (err) {
      error.value = "Random yemek yüklenirken bir hata oluştu";
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function getMealById(id: string) {
    try {
      loading.value = true;
      error.value = null;

      const response = await mealService.getMealById(id);

      if (response.meals && response.meals.length > 0) {
        return response.meals[0];
      }
      return null;
    } catch (err) {
      error.value = "Yemek detayları yüklenirken bir hata oluştu";
      return null;
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
