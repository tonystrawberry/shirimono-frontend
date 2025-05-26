<template>
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="course in courses" :key="course.id" class="overflow-hidden rounded-lg bg-gray-900 shadow">
      <div class="p-5">
        <div class="flex flex-col">
          <!-- Title and Icon Row -->
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 rounded-md p-2 mr-3 bg-gray-800">
              <component :is="course.icon" class="size-5 text-gray-400" aria-hidden="true" />
            </div>
            <h3 class="text-base font-medium text-gray-300">{{ course.name }}</h3>
          </div>

          <!-- Progress Bars Section -->
          <div class="space-y-4">
            <!-- Kanji Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-indigo-400">Kanji</span>
                <span class="text-sm text-gray-400">{{ course.categories.kanji.completed }}/{{ course.categories.kanji.total }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-indigo-500"
                  :style="{ width: (course.categories.kanji.completed / course.categories.kanji.total * 100) + '%' }" />
              </div>
            </div>

            <!-- Vocabulary Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-violet-400">Vocabulary</span>
                <span class="text-sm text-gray-400">{{ course.categories.vocabulary.completed }}/{{ course.categories.vocabulary.total }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-violet-500"
                  :style="{ width: (course.categories.vocabulary.completed / course.categories.vocabulary.total * 100) + '%' }" />
              </div>
            </div>

            <!-- Grammar Progress -->
            <div class="flex flex-col">
              <div class="flex justify-between mb-1.5">
                <span class="text-sm text-teal-400">Grammar</span>
                <span class="text-sm text-gray-400">{{ course.categories.grammar.completed }}/{{ course.categories.grammar.total }}</span>
              </div>
              <div class="h-2 rounded-full bg-gray-700">
                <div class="h-2 rounded-full bg-teal-500"
                  :style="{ width: (course.categories.grammar.completed / course.categories.grammar.total * 100) + '%' }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  BookOpenIcon,
  AcademicCapIcon as CertificateIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'

const courses = [
  {
    id: 1,
    name: 'JLPT N5',
    icon: BookOpenIcon,
    color: 'rose',
    categories: {
      kanji: { completed: 80, total: 100 },
      vocabulary: { completed: 150, total: 200 },
      grammar: { completed: 45, total: 60 }
    }
  },
  {
    id: 2,
    name: 'JLPT N4',
    icon: CertificateIcon,
    color: 'amber',
    categories: {
      kanji: { completed: 120, total: 200 },
      vocabulary: { completed: 300, total: 500 },
      grammar: { completed: 60, total: 120 }
    }
  },
  {
    id: 3,
    name: 'JLPT N3',
    icon: ChartBarIcon,
    color: 'emerald',
    categories: {
      kanji: { completed: 50, total: 300 },
      vocabulary: { completed: 200, total: 800 },
      grammar: { completed: 20, total: 180 }
    }
  }
]
</script>