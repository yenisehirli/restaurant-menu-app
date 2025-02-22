<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mealService } from "@/services/api";
import type { Meal } from "@/types/meal";
import { useFavoriteStore } from "@/stores/favorites";

const route = useRoute();
const router = useRouter();
const favoriteStore = useFavoriteStore();

const meal = ref<Meal | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const getIngredients = (meal: Meal) => {
  const ingredients: { name: string; measure: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal];
    const measure = meal[`strMeasure${i}` as keyof Meal];

    if (ingredient && measure) {
      ingredients.push({
        name: ingredient as string,
        measure: measure as string,
      });
    }
  }

  return ingredients;
};

onMounted(async () => {
  try {
    const response = await mealService.getMealById(route.params.id as string);
    if (response.meals && response.meals[0]) {
      meal.value = response.meals[0];
    } else {
      router.push("/");
    }
  } catch (err) {
    error.value = "An error occurred while loading meal details.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="animate-pulse">
      <div class="h-96 bg-gray-200 rounded-lg mb-8"></div>
      <div class="h-8 bg-gray-200 w-1/2 mb-4"></div>
      <div class="h-4 bg-gray-200 w-full mb-2"></div>
      <div class="h-4 bg-gray-200 w-full mb-2"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600 py-10">
      {{ error }}
    </div>

    <div v-else-if="meal" class="max-w-4xl mx-auto">
      <div class="relative">
        <img
          :src="meal.strMealThumb"
          :alt="meal.strMeal"
          class="w-full h-96 object-cover rounded-lg shadow-lg"
        />
        <button
          @click="favoriteStore.toggleFavorite(meal)"
          class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
        >
          <span v-if="favoriteStore.isFavorite(meal.idMeal)">❤️</span>
          <span v-else>🤍</span>
        </button>
      </div>

      <h1 class="text-4xl font-bold mt-8 mb-4">{{ meal.strMeal }}</h1>

      <div class="flex gap-4 mb-6">
        <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          {{ meal.strCategory }}
        </span>
        <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full">
          {{ meal.strArea }}
        </span>
      </div>

      <h2 class="text-2xl font-semibold mb-4">Malzemeler</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <li
          v-for="(ingredient, index) in getIngredients(meal)"
          :key="index"
          class="flex items-center gap-2 p-2 bg-gray-50 rounded"
        >
          <img
            :src="`https://www.themealdb.com/images/ingredients/${ingredient.name}-Small.png`"
            :alt="ingredient.name"
            class="w-8 h-8 object-cover"
          />
          <span>{{ ingredient.measure }} {{ ingredient.name }}</span>
        </li>
      </ul>

      <h2 class="text-2xl font-semibold mb-4">Preparation</h2>
      <p class="whitespace-pre-line text-gray-700">
        {{ meal.strInstructions }}
      </p>

      <div v-if="meal.strYoutube" class="mt-8">
        <h2 class="text-2xl font-semibold mb-4">Video Recipe</h2>
        <a
          :href="meal.strYoutube"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500 hover:text-blue-600"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  </div>
</template>
