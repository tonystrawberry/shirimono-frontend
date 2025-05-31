<template>
  <div class="flex flex-col items-center">
    <div class="text-8xl font-bold text-white mb-8">
      {{ currentKanji.title }}
    </div>

    <!-- Exercise Question -->
    <div class="my-8">
      <span class="text-white/60 text-sm font-medium px-3 py-1 rounded-full bg-white/10">
        {{ exerciseTypeLabel }}
      </span>
    </div>
    <div class="text-xl text-white/90 mb-8">
      {{ currentExercise.question }}
    </div>

    <div class="w-full max-w-md">
      <!-- Input Exercise -->
      <template v-if="currentExercise.question_types.includes('input')">
        <div class="relative">
          <input
            v-model="userAnswer"
            type="text"
            :placeholder="inputPlaceholder"
            class="w-full bg-white/10 text-white text-2xl px-4 py-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-white/50 text-center"
            @keyup.enter="checkAnswer"
          >
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/50">
            <div class="border border-white/30 rounded px-1 py-0.5 text-xs">return</div>
            <ArrowLeftIcon class="w-3 h-3 rotate-180" />
          </div>
        </div>
      </template>

      <!-- Multiple Choice Exercise -->
      <template v-else-if="currentExercise.question_types.includes('multi')">
        <div class="space-y-4">
          <button
            v-for="answer in shuffledAnswers"
            :key="answer"
            @click="checkMultipleChoiceAnswer(answer)"
            class="w-full bg-white/10 hover:bg-white/20 text-white text-xl px-4 py-4 rounded-lg transition text-center"
          >
            {{ answer }}
          </button>
        </div>
      </template>

      <!-- Feedback -->
      <div v-if="showFeedback" class="mt-4 text-center">
        <p :class="isCorrect ? 'text-green-400' : 'text-red-400'" class="text-lg font-medium">
          {{ isCorrect ? 'Correct!' : 'Try again' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/20/solid'
import type { Kanji, Exercise } from '~/composables/api/v1/useCourseLessonsV1'

const props = defineProps<{
  currentKanji: Kanji
  currentExercise: Exercise
}>()

const emit = defineEmits<{
  (e: 'correct'): void
  (e: 'incorrect'): void
}>()

// State
const userAnswer = ref('')
const showFeedback = ref(false)
const isCorrect = ref(false)

// Computed
const exerciseTypeLabel = computed(() => {
  return props.currentExercise.exercise_type === 'meaning' ? 'MEANING' : 'READING'
})

const inputPlaceholder = computed(() => {
  return props.currentExercise.exercise_type === 'meaning'
    ? 'Type the meaning...'
    : 'Type the reading...'
})

const shuffledAnswers = computed(() => {
  if (!props.currentExercise.question_types.includes('multi')) return []

  const allAnswers = [
    ...props.currentExercise.accepted_answers,
    ...props.currentExercise.wrong_answers
  ]
  return allAnswers.sort(() => Math.random() - 0.5)
})

// Methods
function checkAnswer() {
  showFeedback.value = true
  isCorrect.value = props.currentExercise.accepted_answers.some(answer =>
    answer.toLowerCase() === userAnswer.value.toLowerCase()
  )

  if (isCorrect.value) {
    emit('correct')
  } else {
    emit('incorrect')
  }

  if (isCorrect.value) {
    setTimeout(() => {
      showFeedback.value = false
      userAnswer.value = ''
    }, 1500)
  }
}

function checkMultipleChoiceAnswer(answer: string) {
  showFeedback.value = true
  isCorrect.value = props.currentExercise.accepted_answers.includes(answer)

  if (isCorrect.value) {
    emit('correct')
  } else {
    emit('incorrect')
  }

  if (isCorrect.value) {
    setTimeout(() => {
      showFeedback.value = false
    }, 1500)
  }
}
</script>