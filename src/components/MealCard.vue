<script setup lang="ts">
import { ref } from "vue";
import type { Meal } from "@/types/meal";
import { useFavoriteStore } from "@/stores/favorites";

defineProps<{
  meal: Meal;
}>();

const favoriteStore = useFavoriteStore();
const imageLoaded = ref(false);

const handleImageLoad = () => {
  imageLoaded.value = true;
};
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
  >
    <div class="relative aspect-video">
      <img
        :src="meal.strMealThumb"
        :alt="meal.strMeal"
        class="w-full h-full object-cover transition-opacity duration-300"
        :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
        @load="handleImageLoad"
      />
      <div
        v-if="!imageLoaded"
        class="absolute inset-0 bg-gray-200 animate-pulse"
      ></div>
    </div>

    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          {{ meal.strMeal }}
        </h3>
        <button
          @click="favoriteStore.toggleFavorite(meal)"
          class="text-red-500 hover:text-red-600"
        >
          <span v-if="favoriteStore.isFavorite(meal.idMeal)">❤️</span>
          <span v-else>🤍</span>
        </button>
      </div>

      <div class="flex items-center gap-2 mb-2">
        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {{ meal.strCategory }}
        </span>
        <span
          class="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
        >
          {{ meal.strArea }}
        </span>
      </div>

      <p class="text-gray-600 text-sm line-clamp-2">
        {{ meal.strInstructions }}
      </p>

      <router-link
        :to="{ name: 'meal-detail', params: { id: meal.idMeal } }"
        class="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
      >
        View Recipe
      </router-link>
    </div>
  </div>
</template>
