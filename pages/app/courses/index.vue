<template>
  <div class="max-w-5xl mx-auto pt-4 pb-10 px-4">
    <div class="rounded-lg bg-gray-900 shadow mb-8">
      <div class="px-4 py-3 flex items-center gap-4">
        <AcademicCapIcon class="w-10 h-10 text-white" aria-hidden="true" />
        <h1 class="text-3xl font-bold text-white">Courses</h1>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="course in courses"
        :key="course.level"
        class="relative rounded-lg shadow flex flex-col justify-between min-h-[260px] overflow-hidden bg-gray-900"
      >
        <!-- Content -->
        <div class="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-semibold mb-2 text-white">{{ course.title }}</h2>
            <p class="text-gray-300 mb-4">{{ course.description }}</p>
            <div class="flex gap-8 mb-4 justify-center">
              <div class="flex flex-col items-center">
                <span class="text-2xl font-bold text-indigo-400">{{ course.kanji }}</span>
                <span class="text-xs text-indigo-300 tracking-wide uppercase">Kanji</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-2xl font-bold text-violet-400">{{ course.vocab }}</span>
                <span class="text-xs text-violet-300 tracking-wide uppercase">Vocabulary</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-2xl font-bold text-teal-400">{{ course.grammar }}</span>
                <span class="text-xs text-teal-300 tracking-wide uppercase">Grammar</span>
              </div>
            </div>
          </div>
          <div class="flex gap-3 mt-4 justify-center">
            <button @click="openModal(course)" class="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-md border border-white/10 shadow transition text-center">Start learning</button>
            <NuxtLink :to="`/app/courses/${course.slug}`" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition text-center">View lessons</NuxtLink>
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

<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { AcademicCapIcon, BookOpenIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'app'
})

const modalOpen = ref(false)
const selectedCourse = ref(null)
const router = useRouter()

function startLesson(type) {
  router.push('/classroom/learn')
}

function openModal(course) {
  selectedCourse.value = course
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  selectedCourse.value = null
}

const courses = [
  {
    level: 5,
    title: 'JLPT N5',
    slug: 'jlpt-n5',
    description: 'Beginner level. Learn basic grammar, vocabulary, and kanji for everyday communication.',
    kanji: 100,
    vocab: 800,
    grammar: 80
  },
  {
    level: 4,
    title: 'JLPT N4',
    slug: 'jlpt-n4',
    description: 'Elementary level. Expand your grammar and vocabulary for simple conversations.',
    kanji: 300,
    vocab: 1500,
    grammar: 150
  },
  {
    level: 3,
    title: 'JLPT N3',
    slug: 'jlpt-n3',
    description: 'Intermediate level. Understand and use more complex grammar and vocabulary.',
    kanji: 650,
    vocab: 3750,
    grammar: 200
  },
  {
    level: 2,
    title: 'JLPT N2',
    slug: 'jlpt-n2',
    description: 'Pre-advanced level. Read and understand a wider range of topics in Japanese.',
    kanji: 1000,
    vocab: 6000,
    grammar: 230
  },
  {
    level: 1,
    title: 'JLPT N1',
    slug: 'jlpt-n1',
    description: 'Advanced level. Master Japanese for academic and professional contexts.',
    kanji: 2000,
    vocab: 10000,
    grammar: 300
  },
]
</script>