import { defineStore } from "pinia";
import { ref } from "vue";
import type { Meal } from "@/types/meal";

export const useFavoriteStore = defineStore("favorites", () => {
  const favorites = ref<Meal[]>(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  const isFavorite = (mealId: string): boolean => {
    return favorites.value.some((meal) => meal.idMeal === mealId);
  };

  const toggleFavorite = (meal: Meal) => {
    const index = favorites.value.findIndex((m) => m.idMeal === meal.idMeal);

    if (index === -1) {
      favorites.value.push(meal);
    } else {
      favorites.value.splice(index, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
});
