<script setup lang="ts">
import { RouterView } from "vue-router";
import { useFavoriteStore } from "@/stores/favorites";
import { ref } from "vue";

const favoriteStore = useFavoriteStore();

const showFavorites = ref(false);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-orange-500 text-white sticky top-0 z-50 shadow-md">
      <nav
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <router-link
          to="/"
          class="text-2xl font-bold flex items-center gap-2 hover:text-orange-100 transition-colors"
        >
          <span>🍽️</span>
          <span>Restoraurant Menu</span>
        </router-link>

        <div class="flex items-center gap-6">
          <div class="relative">
            <button
              @click="showFavorites = !showFavorites"
              class="flex items-center gap-2 hover:text-orange-100 transition-colors"
            >
              <span>❤️</span>
              <span>Favorites</span>
              <span
                v-if="favoriteStore.favorites.length"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ favoriteStore.favorites.length }}
              </span>
            </button>

            <div
              v-if="showFavorites"
              class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 text-gray-800"
            >
              <div
                v-if="favoriteStore.favorites.length === 0"
                class="px-4 py-2 text-gray-500"
              >
                No favorite food added yet.
              </div>
              <router-link
                v-for="favorite in favoriteStore.favorites"
                :key="favorite.idMeal"
                :to="`/meal/${favorite.idMeal}`"
                class="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 transition-colors"
                @click="showFavorites = false"
              >
                <img
                  :src="favorite.strMealThumb"
                  :alt="favorite.strMeal"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span class="flex-1 truncate">{{ favorite.strMeal }}</span>
                <button
                  @click.prevent="favoriteStore.toggleFavorite(favorite)"
                  class="text-red-500 hover:text-red-600"
                >
                  ✕
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="bg-gray-800 text-white py-6 mt-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About Us</h3>
            <p class="text-gray-400">
              We bring you the most delicious recipes from world cuisine. New
              recipes are added every day!
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <router-link
                  to="/"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </router-link>
              </li>
              <li>
                <button
                  @click="showFavorites = true"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Favorites
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Communication</h3>
            <ul class="space-y-2 text-gray-400">
              <li>📧 info@restoranmenu.com</li>
              <li>📱 +90 500 000 00 00</li>
            </ul>
          </div>
        </div>

        <div
          class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} Restaurant Menu. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>

    <div
      v-if="showFavorites"
      class="fixed inset-0 bg-[#888] opacity-50 z-40"
      @click="showFavorites = false"
    ></div>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
