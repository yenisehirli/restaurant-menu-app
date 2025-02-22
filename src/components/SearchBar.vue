<script setup lang="ts">
import { ref } from "vue";
import { useMealStore } from "@/stores/meal";
import { useDebounce } from "@vueuse/core";

const searchQuery = ref("");
const mealStore = useMealStore();

const performSearch = async (query: string) => {
  await mealStore.searchMeals(query.trim());
};

const debouncedSearch = useDebounce(performSearch, 500);

const handleInput = (event: Event) => {
  const query = (event.target as HTMLInputElement).value;
  searchQuery.value = query;
  debouncedSearch(query);
};

const handleKeyPress = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await performSearch(searchQuery.value);
  }
};

const handleSearchClick = async () => {
  await performSearch(searchQuery.value);
};
</script>

<template>
  <div class="mb-8">
    <div class="relative max-w-xl mx-auto">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @keypress="handleKeyPress"
        placeholder="Search  (eg: Chicken, Fish, Pasta)"
        class="w-full px-4 py-3 pl-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
      />

      <button
        @click="handleSearchClick"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer p-1"
        title="Ara"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      <div
        v-if="mealStore.loading"
        class="absolute right-12 top-1/2 transform -translate-y-1/2"
      >
        <div
          class="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"
        ></div>
      </div>
    </div>

    <div class="text-center mt-2 text-sm text-gray-500">
      You can search by food name.
    </div>
  </div>
</template>
