<template>
  <div class="max-w-5xl mx-auto pt-4 pb-10 px-4">
    <div v-if="loading" class="text-gray-400">
      Loading course...
    </div>
    <div v-else-if="error" class="text-red-400">
      Error loading course. Please try again later.
    </div>
    <div v-else-if="course">
      <!-- Course Header -->
      <div class="rounded-lg bg-gray-900 shadow mb-8">
        <div class="px-4 py-3 flex items-center gap-4">
          <component :is="getIcon(course.slug)" class="w-10 h-10 text-white" aria-hidden="true" />
          <h1 class="text-3xl font-bold text-white">{{ course.title }}</h1>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex justify-center gap-6 mb-8">
        <button
          :class="[tab === 'kanji' ? 'bg-indigo-600 text-white' : 'bg-indigo-900 text-indigo-300', 'px-6 py-3 rounded-lg font-bold text-lg flex flex-col items-center gap-1 transition min-w-[120px]']"
          @click="switchTab('kanji')"
        >
          <span class="flex items-center gap-2">
            <AcademicCapIcon class="w-6 h-6" />
            <span>漢字</span>
          </span>
          <span class="text-xs font-normal tracking-wider uppercase" :class="tab === 'kanji' ? 'text-indigo-200' : 'text-indigo-400'">KANJI</span>
        </button>
        <button
          :class="[tab === 'vocabulary' ? 'bg-violet-600 text-white' : 'bg-violet-900 text-violet-200', 'px-6 py-3 rounded-lg font-bold text-lg flex flex-col items-center gap-1 transition min-w-[120px]']"
          @click="switchTab('vocabulary')"
        >
          <span class="flex items-center gap-2">
            <BookOpenIcon class="w-6 h-6" />
            <span>単語</span>
          </span>
          <span class="text-xs font-normal tracking-wider uppercase" :class="tab === 'vocabulary' ? 'text-violet-200' : 'text-violet-400'">VOCABULARY</span>
        </button>
        <button
          :class="[tab === 'grammar' ? 'bg-teal-600 text-white' : 'bg-teal-900 text-teal-200', 'px-6 py-3 rounded-lg font-bold text-lg flex flex-col items-center gap-1 transition min-w-[120px]']"
          @click="switchTab('grammar')"
        >
          <span class="flex items-center gap-2">
            <Cog6ToothIcon class="w-6 h-6" />
            <span>文法</span>
          </span>
          <span class="text-xs font-normal tracking-wider uppercase" :class="tab === 'grammar' ? 'text-teal-200' : 'text-teal-400'">GRAMMAR</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loadingLevels" class="text-gray-400">
        Loading levels...
      </div>
      <!-- Error State -->
      <div v-else-if="levelsError" class="text-red-400">
        Error loading levels. Please try again later.
      </div>
      <!-- Content -->
      <div v-else-if="courseLevels" class="space-y-8">
        <div v-for="level in courseLevels.levels" :key="level.id" class="bg-gray-900 rounded-lg shadow p-6">
          <div class="flex items-center mb-4 relative">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full"
              :class="{
                'bg-indigo-700': tab === 'kanji',
                'bg-violet-700': tab === 'vocabulary',
                'bg-teal-700': tab === 'grammar'
              }">
              <span class="text-white font-bold">{{ level.position }}</span>
            </span>
            <span class="text-lg font-semibold text-white ml-3">{{ level.title }}</span>
          </div>

          <p class="text-gray-400 mb-4">{{ level.description }}</p>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="point in level.points"
              :key="point.id"
              class="inline-block px-3 py-1 rounded shadow-sm hover:bg-opacity-80 transition text-white font-semibold text-lg"
              :class="{
                'bg-indigo-700 hover:bg-indigo-600': tab === 'kanji',
                'bg-violet-700 hover:bg-violet-600': tab === 'vocabulary',
                'bg-teal-700 hover:bg-teal-600': tab === 'grammar'
              }"
              @click="startPoint(level, point)"
            >
              {{ point.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BookOpenIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'
import { useCoursesStore } from '~/stores/courses'
import { useUserCoursesStore } from '~/stores/userCourses'
import { useCoursesV1, type CourseLevel, type CoursePoint } from '~/composables/api/v1/useCoursesV1'

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const userCoursesStore = useUserCoursesStore()
const coursesV1 = useCoursesV1()

const loading = computed(() => coursesStore.loading || userCoursesStore.loading)
const error = computed(() => coursesStore.error || userCoursesStore.error)
const loadingLevels = computed(() => coursesStore.loadingLevels)
const levelsError = computed(() => coursesStore.levelsError)

// Get the current course based on the slug
const course = computed(() => {
  return coursesStore.courses.find(c => c.slug === route.params.slug)
})

// Get the course progress
const courseProgress = computed(() => {
  return userCoursesStore.courseProgress.find(c => c.slug === route.params.slug)
})

// Get the current course levels
const courseLevels = computed(() => {
  if (!course.value) return null
  return {
    levels: coursesStore.getCourseLevels(course.value.slug, tab.value)
  }
})

const tab = ref<'kanji' | 'vocabulary' | 'grammar'>('kanji')

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

async function switchTab(newTab: 'kanji' | 'vocabulary' | 'grammar') {
  tab.value = newTab
  await fetchLevels()
}

async function fetchLevels() {
  if (!course.value) return
  await coursesStore.fetchCourseLevels(course.value.slug, tab.value)
}

function startPoint(level: CourseLevel, point: CoursePoint) {
  if (!course.value) return
  router.push(`/app/courses/${course.value.slug}/${tab.value}/${level.position}`)
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    coursesStore.fetchCourses(),
    userCoursesStore.fetchUserCourses()
  ])
  await fetchLevels()
})
</script>