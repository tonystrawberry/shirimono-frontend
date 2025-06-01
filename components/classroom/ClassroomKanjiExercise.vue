<template>
  <div class="flex flex-col items-center">
    <!-- Progress Dots -->
    <div class="absolute top-4 left-4 flex gap-2">
      <div
        v-for="i in targetCorrectAnswers"
        :key="i"
        class="w-2.5 h-2.5 rounded-full transition-colors duration-300"
        :class="effectiveCorrectAnswers >= i ? 'bg-green-400' : 'bg-white/30'"
      ></div>
    </div>

    <div class="text-8xl font-bold text-white mb-8">
      {{ currentExercise.question }}
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
      <!-- Answer Review State -->
      <template v-if="showingAnswer">
        <div class="text-center">
          <div class="mb-6">
            <p :class="isCorrect ? 'text-green-400' : 'text-red-400'" class="text-2xl font-medium mb-4">
              {{ isCorrect ? 'Correct!' : 'Incorrect' }}
            </p>

            <!-- Input type review -->
            <template v-if="currentExercise.question_types.includes('input')">
              <p class="text-white/70">The correct answer was:</p>
              <p class="text-white text-xl mt-2">
                {{ currentExercise.accepted_answers.join(' or ') }}
              </p>
            </template>

            <!-- Multiple choice review -->
            <template v-else-if="currentExercise.question_types.includes('multi')">
              <div class="space-y-3">
                <button
                  v-for="answer in lastShownAnswers"
                  :key="answer"
                  disabled
                  class="w-full px-4 py-4 rounded-lg transition text-center text-xl"
                  :class="[
                    currentExercise.accepted_answers.includes(answer)
                      ? 'bg-green-500/20 text-green-400'
                      : (answer === selectedAnswer ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/50')
                  ]"
                >
                  {{ answer }}
                </button>
              </div>
            </template>
          </div>

          <button
            @click="continueAfterAnswer"
            class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition text-lg"
          >
            Continue
          </button>
        </div>
      </template>

      <!-- Input Exercise -->
      <template v-else-if="currentExercise.question_types.includes('input')">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/20/solid'
import type { Exercise } from '~/composables/api/v1/useCourseLessonsV1'

const props = defineProps<{
  currentExercise: Exercise & {
    numberOfCorrectAnswers?: number
  },
  targetCorrectAnswers: number
}>()

const emit = defineEmits(['correct', 'incorrect'])

// State
const userAnswer = ref('')
const showingAnswer = ref(false)
const isCorrect = ref(false)
const selectedAnswer = ref('')
const lastShownAnswers = ref<string[]>([])

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

const effectiveCorrectAnswers = computed(() => {
  const base = props.currentExercise.numberOfCorrectAnswers ?? 0
  return showingAnswer.value && isCorrect.value ? base + 1 : base
})

// Methods
function checkAnswer() {
  isCorrect.value = props.currentExercise.accepted_answers.some(answer =>
    answer.toLowerCase() === userAnswer.value.toLowerCase()
  )
  showingAnswer.value = true
}

function checkMultipleChoiceAnswer(answer: string) {
  selectedAnswer.value = answer
  isCorrect.value = props.currentExercise.accepted_answers.includes(answer)
  lastShownAnswers.value = shuffledAnswers.value
  showingAnswer.value = true
}

function continueAfterAnswer() {
  if (isCorrect.value) {
    emit('correct')
  } else {
    emit('incorrect')
  }

  // Reset state
  showingAnswer.value = false
  userAnswer.value = ''
  isCorrect.value = false
  selectedAnswer.value = ''
  lastShownAnswers.value = []
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'ClassroomKanjiExercise'
})
</script>