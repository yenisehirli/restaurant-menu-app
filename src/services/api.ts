import axios from "axios";
import type { MealResponse } from "@/types/meal";

const api = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1",
});

export const mealService = {
  async searchMeals(query: string) {
    const response = await api.get<MealResponse>(`/search.php?s=${query}`);
    return response.data;
  },

  async getMealById(id: string) {
    const response = await api.get<MealResponse>(`/lookup.php?i=${id}`);
    return response.data;
  },

  async getRandomMeal() {
    const response = await api.get<MealResponse>("/random.php");
    return response.data;
  },
};
