<template>
  <div class="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600">
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
      <div class="bg-gray-900/20 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
        <!-- Study Mode -->
        <div v-if="!isTestMode" class="flex flex-col items-center">
          <div class="mb-4">
            <span class="text-white/60 text-sm font-medium px-3 py-1 rounded-full bg-white/10">
              KANJI READING
            </span>
          </div>
          <div class="text-8xl font-bold text-white mb-8">
            {{ currentKanji.character }}
          </div>
          <div class="text-xl text-white/90 mb-4">
            {{ currentKanji.reading }}
          </div>
          <div class="mb-8">
            <span class="text-white/60 text-sm font-medium px-3 py-1 rounded-full bg-white/10">
              MEANING
            </span>
          </div>
          <div class="text-xl text-white/90 mb-8">
            {{ currentKanji.meaning }}
          </div>
          <button
            @click="isTestMode = true"
            class="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Next
          </button>
        </div>

        <!-- Test Mode -->
        <div v-else class="flex flex-col items-center">
          <div class="text-8xl font-bold text-white mb-8">
            {{ currentKanji.character }}
          </div>
          <div class="w-full max-w-md">
            <input
              v-model="userAnswer"
              type="text"
              placeholder="Type the reading..."
              class="w-full bg-white/10 text-white text-xl px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
              @keyup.enter="checkAnswer"
            >
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronLeftIcon,
  SpeakerWaveIcon,
  MinusIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const isTestMode = ref(false)
const userAnswer = ref('')
const showFeedback = ref(false)
const isCorrect = ref(false)

// Mock data - this would come from your actual lesson data
const currentKanji = {
  character: '後',
  reading: 'あと・のち・ご・こう',
  meaning: 'after・back・be delayed・behind・later'
}

function checkAnswer() {
  showFeedback.value = true
  isCorrect.value = currentKanji.reading.split('・').some(reading =>
    reading.toLowerCase() === userAnswer.value.toLowerCase()
  )

  if (isCorrect.value) {
    setTimeout(() => {
      // Move to next kanji or end lesson
      showFeedback.value = false
      isCorrect.value = false
      userAnswer.value = ''
      isTestMode.value = false
    }, 1500)
  }
}
</script>