<template>
  <div class="max-w-5xl mx-auto pt-4 pb-10 px-4">
    <div class="rounded-lg bg-gray-900 shadow mb-8">
      <div class="px-4 py-3 flex items-center gap-4">
        <AcademicCapIcon class="w-10 h-10 text-white" aria-hidden="true" />
        <h1 class="text-3xl font-bold text-white">Courses</h1>
      </div>
    </div>

    <div v-if="loading" class="text-gray-400">
      Loading courses...
    </div>
    <div v-else-if="error" class="text-red-400">
      Error loading courses. Please try again later.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="course in coursesWithProgress"
        :key="course.id"
        class="relative rounded-lg shadow flex flex-col justify-between min-h-[260px] overflow-hidden bg-gray-900"
      >
        <!-- Content -->
        <div class="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-semibold mb-2 text-white">{{ course.title }}</h2>
            <p class="text-gray-300 mb-4">{{ getCourseDescription(course.slug) }}</p>
            <div class="flex gap-8 mb-4 justify-center">
              <div class="flex flex-col items-center">
                <span class="text-2xl font-bold text-indigo-400">{{ course.kanjis_count }}</span>
                <span class="text-xs text-indigo-300 tracking-wide uppercase">Kanji</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-2xl font-bold text-violet-400">{{ course.vocabularies_count }}</span>
                <span class="text-xs text-violet-300 tracking-wide uppercase">Vocabulary</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-2xl font-bold text-teal-400">{{ course.grammars_count }}</span>
                <span class="text-xs text-teal-300 tracking-wide uppercase">Grammar</span>
              </div>
            </div>
          </div>

          <!-- Progress Bars -->
          <div class="space-y-4">
            <!-- Kanji Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-indigo-400">Kanji</span>
                <span class="text-sm text-gray-400">{{ course.progress?.kanji.completed || 0 }}/{{ course.kanjis_count }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-indigo-500"
                  :style="{ width: ((course.progress?.kanji.completed || 0) / course.kanjis_count * 100) + '%' }" />
              </div>
            </div>

            <!-- Vocabulary Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-violet-400">Vocabulary</span>
                <span class="text-sm text-gray-400">{{ course.progress?.vocabulary.completed || 0 }}/{{ course.vocabularies_count }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-violet-500"
                  :style="{ width: ((course.progress?.vocabulary.completed || 0) / course.vocabularies_count * 100) + '%' }" />
              </div>
            </div>

            <!-- Grammar Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-teal-400">Grammar</span>
                <span class="text-sm text-gray-400">{{ course.progress?.grammar.completed || 0 }}/{{ course.grammars_count }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-teal-500"
                  :style="{ width: ((course.progress?.grammar.completed || 0) / course.grammars_count * 100) + '%' }" />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 mt-6">
            <button
              @click="openModal(course)"
              class="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition border border-white/10"
            >
              Start Learning
            </button>
            <button
              @click="router.push(`/app/courses/${course.slug}`)"
              class="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <TransitionRoot appear :show="modalOpen" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
              leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-8 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-2xl font-bold leading-6 text-white mb-6 flex items-center gap-2">
                  <AcademicCapIcon class="w-7 h-7 text-indigo-400" />
                  Start Learning
                </DialogTitle>
                <div class="flex flex-col gap-4">
                  <button
                    @click="startLesson('kanji')"
                    class="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition"
                  >
                    <AcademicCapIcon class="w-6 h-6 text-white" />
                    Learn Kanji
                  </button>
                  <button
                    @click="startLesson('vocabulary')"
                    class="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold text-lg transition"
                  >
                    <BookOpenIcon class="w-6 h-6 text-white" />
                    Learn Vocabulary
                  </button>
                  <button
                    @click="startLesson('grammar')"
                    class="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg transition"
                  >
                    <Cog6ToothIcon class="w-6 h-6 text-white" />
                    Learn Grammar
                  </button>
                </div>
                <div class="mt-6 flex justify-end">
                  <button @click="closeModal" class="text-gray-400 hover:text-white text-sm font-medium">Cancel</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { AcademicCapIcon, BookOpenIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '~/stores/courses'
import { useUserCoursesStore } from '~/stores/userCourses'
import type { Course } from '~/composables/api/v1/useCoursesV1'

definePageMeta({
  layout: 'app'
})

const router = useRouter()
const coursesStore = useCoursesStore()
const userCoursesStore = useUserCoursesStore()

const modalOpen = ref(false)
const selectedCourse = ref<Course | null>(null)

const loading = computed(() => coursesStore.loading || userCoursesStore.loading)
const error = computed(() => coursesStore.error || userCoursesStore.error)

// Combine courses with their progress
const coursesWithProgress = computed(() => {
  return coursesStore.courses.map(course => ({
    ...course,
    progress: userCoursesStore.courseProgress.find(c => c.slug === course.slug)?.progress
  }))
})

function startLesson(type: 'kanji' | 'vocabulary' | 'grammar') {
  if (!selectedCourse.value) return
  router.push(`/app/courses/${selectedCourse.value.slug}/${type}/1`)
  closeModal()
}

function openModal(course: Course) {
  selectedCourse.value = course
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  selectedCourse.value = null
}

function getCourseDescription(slug: string): string {
  switch (slug) {
    case 'n5':
      return 'Beginner level. Learn basic grammar, vocabulary, and kanji for everyday communication.'
    case 'n4':
      return 'Elementary level. Expand your grammar and vocabulary for simple conversations.'
    case 'n3':
      return 'Intermediate level. Understand and use more complex grammar and vocabulary.'
    case 'n2':
      return 'Pre-advanced level. Read and understand a wider range of topics in Japanese.'
    case 'n1':
      return 'Advanced level. Master Japanese for academic and professional contexts.'
    default:
      return 'Learn Japanese language skills with our comprehensive course.'
  }
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    coursesStore.fetchCourses(),
    userCoursesStore.fetchUserCourses()
  ])
})
</script>