<script setup lang="ts">
import { onMounted } from "vue";
import MealList from "@/components/MealList.vue";
import SearchBar from "@/components/SearchBar.vue";
import { useMealStore } from "@/stores/meal";

const mealStore = useMealStore();

onMounted(() => {
  mealStore.initializeStore();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">
      Delicious Recipes
    </h1>
    <SearchBar />
    <MealList />
  </div>
</template>
