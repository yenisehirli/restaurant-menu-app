<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useMealStore } from "@/stores/meal";
import { useDebounce } from "@vueuse/core";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const showSuggestions = ref(false);
const mealStore = useMealStore();
const router = useRouter();

watch(
  () => mealStore.currentSearchQuery,
  (newQuery) => {
    searchQuery.value = newQuery;
  },
  { immediate: true }
);

const performSearch = async (query: string) => {
  mealStore.currentSearchQuery = query;

  if (query.length >= 3) {
    await mealStore.searchMeals(query.trim());
    showSuggestions.value = true;
  } else {
    showSuggestions.value = false;
    if (!query) {
      await mealStore.searchMeals("");
    }
  }
};

const debouncedSearch = useDebounce(performSearch, 300);

const handleInput = (event: Event) => {
  const query = (event.target as HTMLInputElement).value;
  searchQuery.value = query;
  mealStore.currentSearchQuery = query;

  if (query.length >= 3) {
    showSuggestions.value = true;
    debouncedSearch(query);
  } else {
    showSuggestions.value = false;
  }
};

const handleKeyPress = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    showSuggestions.value = false;
    if (searchQuery.value.length >= 3) {
      await performSearch(searchQuery.value);
    }
  }
};

const handleSearchClick = async () => {
  showSuggestions.value = false;
  if (searchQuery.value.length >= 3) {
    await performSearch(searchQuery.value);
  }
};

const handleSuggestionClick = async (mealId: string, mealName: string) => {
  searchQuery.value = mealName;
  showSuggestions.value = false;
  await router.push(`/meal/${mealId}`);
};

const handleClickOutside = (event: MouseEvent) => {
  const searchContainer = document.querySelector(".search-container");
  if (searchContainer && !searchContainer.contains(event.target as Node)) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="mb-8 search-container relative">
    <div class="relative max-w-xl mx-auto">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @keypress="handleKeyPress"
        placeholder="Search for a meal..."
        class="w-full px-4 py-3 pl-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200"
      />

      <button
        @click="handleSearchClick"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer p-1"
        :disabled="searchQuery.length < 4"
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

      <div
        v-if="
          showSuggestions &&
          searchQuery.length >= 3 &&
          mealStore.suggestions.length > 0
        "
        class="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
      >
        <div
          v-for="suggestion in mealStore.suggestions"
          :key="suggestion.idMeal"
          @click="handleSuggestionClick(suggestion.idMeal, suggestion.strMeal)"
          class="flex items-center gap-3 p-3 hover:bg-orange-50 cursor-pointer transition-colors"
        >
          <img
            :src="suggestion.strMealThumb"
            :alt="suggestion.strMeal"
            class="w-12 h-12 rounded-full object-cover"
          />
          <span class="flex-1">{{ suggestion.strMeal }}</span>
        </div>
      </div>
    </div>

    <div class="text-center mt-2 text-sm text-gray-500">
      <span v-if="searchQuery.length > 0 && searchQuery.length < 3">
        Please type {{ 3 - searchQuery.length }} more characters...
      </span>
      <span v-else> You can search by food name. </span>
    </div>
  </div>
</template>
