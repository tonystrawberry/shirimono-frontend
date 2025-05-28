<template>
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="course in userCoursesStore.courseProgress" :key="course.id" class="overflow-hidden rounded-lg bg-gray-900 shadow">
      <div class="p-5">
        <div class="flex flex-col">
          <!-- Title and Icon Row -->
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 rounded-md p-2 mr-3 bg-gray-800">
              <component :is="getIcon(course.slug)" class="size-5 text-gray-400" aria-hidden="true" />
            </div>
            <h3 class="text-base font-medium text-gray-300">{{ course.title }}</h3>
          </div>

          <!-- Progress Bars Section -->
          <div class="space-y-4">
            <!-- Kanji Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-indigo-400">Kanji</span>
                <span class="text-sm text-gray-400">{{ course.progress.kanji.completed }}/{{ course.progress.kanji.total }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-indigo-500"
                  :style="{ width: (course.progress.kanji.completed / course.progress.kanji.total * 100) + '%' }" />
              </div>
            </div>

            <!-- Vocabulary Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-violet-400">Vocabulary</span>
                <span class="text-sm text-gray-400">{{ course.progress.vocabulary.completed }}/{{ course.progress.vocabulary.total }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-violet-500"
                  :style="{ width: (course.progress.vocabulary.completed / course.progress.vocabulary.total * 100) + '%' }" />
              </div>
            </div>

            <!-- Grammar Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-teal-400">Grammar</span>
                <span class="text-sm text-gray-400">{{ course.progress.grammar.completed }}/{{ course.progress.grammar.total }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-teal-500"
                  :style="{ width: (course.progress.grammar.completed / course.progress.grammar.total * 100) + '%' }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'
import { useUserCoursesStore } from '~/stores/userCourses'
import { useCoursesStore } from '~/stores/courses'

const userCoursesStore = useUserCoursesStore()
const coursesStore = useCoursesStore()

const getIcon = (slug: string) => {
  switch (slug) {
    case 'n5':
      return BookOpenIcon
    case 'n4':
      return AcademicCapIcon
    case 'n3':
      return ChartBarIcon
    default:
      return BookOpenIcon
  }
}

onMounted(async () => {
  await Promise.all([
    coursesStore.fetchCourses(),
    userCoursesStore.fetchUserCourses()
  ])
})
</script>