<script setup lang="ts">
import { useMealStore } from "@/stores/meal";
import MealCard from "./MealCard.vue";

const mealStore = useMealStore();

</script>

<template>
  <div>
    <div
      v-if="mealStore.loading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="bg-gray-200 h-96 rounded-lg animate-pulse"
      ></div>
    </div>

    <div v-else-if="mealStore.error" class="text-center py-10 text-red-600">
      {{ mealStore.error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MealCard
        v-for="meal in mealStore.meals"
        :key="meal.idMeal"
        :meal="meal"
      />
    </div>

    <div
      v-if="!mealStore.loading && !mealStore.error && !mealStore.meals.length"
      class="text-center py-10 text-gray-600"
    >
      No food found matching your search criteria.
    </div>
  </div>
</template>
