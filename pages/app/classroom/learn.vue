<template>
  <div class="min-h-screen bg-indigo-500">
    <!-- Progress Bar -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-white/10">
      <div
        class="h-full bg-white transition-all duration-300 ease-in-out"
        :style="{ width: `${(currentLessonIndex + 1) / totalLessons * 100}%` }"
      ></div>
    </div>

    <!-- Progress Stats -->
    <div class="absolute top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-1 text-sm text-white/90">
      {{ currentLessonIndex + 1 }} / {{ totalLessons }}
    </div>

    <!-- Top Navigation -->
    <div class="flex justify-between items-center p-4">
      <button @click="router.back()" class="text-white hover:bg-white/10 p-2 rounded-full transition">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <div class="flex gap-2">
        <button class="text-white hover:bg-white/10 p-2 rounded-full transition">
          <SpeakerWaveIcon class="w-6 h-6" />
        </button>
        <button class="text-white hover:bg-white/10 p-2 rounded-full transition">
          <MinusIcon class="w-6 h-6" />
        </button>
        <button class="text-white hover:bg-white/10 p-2 rounded-full transition">
          <BookOpenIcon class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 py-8">
      <!-- Previous Lesson Button -->
      <button
        @click="goToPreviousLesson"
        class="absolute left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors group"
      >
        <div class="flex flex-col items-center gap-2">
          <ChevronLeftIcon class="w-8 h-8" />
          <span class="text-sm opacity-0 group-hover:opacity-100 transition-opacity">Previous</span>
        </div>
      </button>

      <div class="bg-gray-900/20 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
        <!-- Progress Dots -->
        <div class="absolute top-4 right-4 flex gap-2">
          <div
            v-for="index in 3"
            :key="index"
            class="w-2.5 h-2.5 rounded-full transition-colors duration-300"
            :class="[
              correctAnswersCount >= index ? 'bg-green-400' : 'bg-white/30'
            ]"
          ></div>
        </div>

        <!-- Study Mode -->
        <div v-if="!isTestMode" class="flex flex-col items-center">
          <div class="text-8xl font-bold text-white mb-8">
            {{ currentKanji.character }}
          </div>
          <div class="my-8">
            <span class="text-white/60 text-sm font-medium px-3 py-1 rounded-full bg-white/10">
              KANJI READING
            </span>
          </div>
          <div class="text-xl text-white/90 mb-4">
            {{ currentKanji.reading }}
          </div>
          <div class="my-8">
            <span class="text-white/60 text-sm font-medium px-3 py-1 rounded-full bg-white/10">
              MEANING
            </span>
          </div>
          <div class="text-xl text-white/90 mb-8">
            {{ currentKanji.meaning }}
          </div>
          <button
            @click="isTestMode = true"
            class="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center gap-2"
          >
            Next
            <div class="flex items-center gap-1 text-white/70">
              <div class="border border-white/30 rounded px-1 py-0.5 text-xs">return</div>
              <ArrowLeftIcon class="w-3 h-3 rotate-180" />
            </div>
          </button>
        </div>

        <!-- Test Mode -->
        <div v-else class="flex flex-col items-center">
          <div class="text-8xl font-bold text-white mb-8">
            {{ currentKanji.character }}
          </div>
          <div class="w-full max-w-md">
            <div class="relative">
              <input
                v-model="userAnswer"
                type="text"
                placeholder="Type the reading..."
                class="w-full bg-white/10 text-white text-2xl px-4 py-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-white/50 text-center"
                @keyup.enter="checkAnswer"
              >
              <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/50">
                <div class="border border-white/30 rounded px-1 py-0.5 text-xs">return</div>
                <ArrowLeftIcon class="w-3 h-3 rotate-180" />
              </div>
            </div>
            <div v-if="showFeedback" class="mt-4 text-center">
              <p :class="isCorrect ? 'text-green-400' : 'text-red-400'" class="text-lg font-medium">
                {{ isCorrect ? 'Correct!' : 'Try again' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'classroom'
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronLeftIcon,
  SpeakerWaveIcon,
  MinusIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'

import { ArrowLeftIcon } from '@heroicons/vue/20/solid'

const router = useRouter()
const isTestMode = ref(false)
const userAnswer = ref('')
const showFeedback = ref(false)
const isCorrect = ref(false)
const correctAnswersCount = ref(0)

// Mock lesson data - this would come from your actual lesson data
const lessons = [
  {
    character: '後',
    reading: 'あと・のち・ご・こう',
    meaning: 'after・back・be delayed・behind・later'
  },
  {
    character: '前',
    reading: 'まえ・ぜん',
    meaning: 'before・in front'
  },
  {
    character: '中',
    reading: 'なか・ちゅう',
    meaning: 'middle・inside・center'
  },
  // Add more lessons as needed
]

const currentLessonIndex = ref(0)
const totalLessons = lessons.length
const currentKanji = lessons[currentLessonIndex.value]

function checkAnswer() {
  showFeedback.value = true
  isCorrect.value = currentKanji.reading.split('・').some(reading =>
    reading.toLowerCase() === userAnswer.value.toLowerCase()
  )

  if (isCorrect.value) {
    correctAnswersCount.value++

    setTimeout(() => {
      if (correctAnswersCount.value >= 3) {
        // Reset for next lesson
        correctAnswersCount.value = 0

        // Move to next lesson if available
        if (currentLessonIndex.value < totalLessons - 1) {
          currentLessonIndex.value++
          isTestMode.value = false
        } else {
          // Handle lesson completion
          router.push('/app/courses')
        }
      }

      // Clear input and feedback for next attempt
      showFeedback.value = false
      isCorrect.value = false
      userAnswer.value = ''

      // Only reset test mode when moving to next lesson
      if (correctAnswersCount.value === 0) {
        isTestMode.value = false
      }
    }, 1500)
  }
}

function goToPreviousLesson() {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--
    isTestMode.value = false
    userAnswer.value = ''
    showFeedback.value = false
    correctAnswersCount.value = 0
  }
}
</script>