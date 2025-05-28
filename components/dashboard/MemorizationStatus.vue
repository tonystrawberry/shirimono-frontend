<template>
  <div class="rounded-lg bg-white shadow">
    <div class="p-6">
      <h3 class="text-base font-semibold leading-6 text-gray-900">Memorization Progress</h3>
      <div v-if="userReviewsStore.loading" class="mt-2 text-sm text-gray-500">
        Loading progress...
      </div>
      <div v-else-if="userReviewsStore.error" class="mt-2 text-sm text-red-500">
        Error loading progress. Please try again later.
      </div>
      <div v-else class="mt-6 space-y-4">
        <div v-for="course in userReviewsStore.reviewProgress" :key="course.courseId" class="rounded-lg bg-gray-50 p-4">
          <h4 class="text-sm font-medium text-gray-900">{{ course.courseTitle }}</h4>
          <div class="mt-2 flex items-center gap-4">
            <div class="flex items-center gap-1">
              <div class="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
              <span class="text-xs text-gray-600">{{ course.stats.byStatus['mastered'] || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <span class="text-xs text-gray-600">{{ course.stats.byStatus['learning'] || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
              <span class="text-xs text-gray-600">{{ course.stats.byStatus['reviewing'] || 0 }}</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
              <span class="text-xs text-gray-600">{{ course.stats.byStatus['struggling'] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserReviewsStore } from '~/stores/userReviews'

const userReviewsStore = useUserReviewsStore()

onMounted(async () => {
  await userReviewsStore.fetchUserReviews()
})
</script>