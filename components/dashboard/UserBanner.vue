<template>
  <div class="rounded-lg bg-gray-900 shadow">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex items-center space-x-5">
        <div class="flex-shrink-0">
          <img v-if="usersStore.currentUser" class="size-16 rounded-full" :src="usersStore.currentUser.imageUrl" :alt="usersStore.currentUser.email">
        </div>
        <div class="min-w-0 flex-1">
          <p v-if="usersStore.currentUser" class="text-2xl font-semibold text-white">Welcome back, {{ usersStore.currentUser.email }}!</p>
        </div>
        <div class="flex-shrink-0">
          <button class="inline-flex items-center px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-colors">
            <ArrowRightCircleIcon class="size-5 mr-2" />
            Let's Review
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightCircleIcon } from '@heroicons/vue/24/outline'
import { useUsersStore } from '~/stores/users'

const usersStore = useUsersStore()
</script>