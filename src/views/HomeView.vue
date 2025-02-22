<script setup lang="ts">
import { onMounted, onActivated } from "vue";
import MealList from "@/components/MealList.vue";
import SearchBar from "@/components/SearchBar.vue";
import { useMealStore } from "@/stores/meal";

const mealStore = useMealStore();

const loadInitialData = async () => {
  if (!mealStore.initialized || mealStore.meals.length === 0) {
    await mealStore.initializeStore();
  }
};

onMounted(loadInitialData);
onActivated(loadInitialData);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">
      Lezzetli Yemek Tarifleri
    </h1>
    <SearchBar />
    <MealList />
  </div>
</template>
