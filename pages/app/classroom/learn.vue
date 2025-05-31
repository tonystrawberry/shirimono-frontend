<template>
  <div class="min-h-screen bg-indigo-500">
    <!-- Progress Bar -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-white/10">
      <div
        class="h-full bg-white transition-all duration-300 ease-in-out"
        :style="{ width: `${(currentKanjiIndex + 1) / totalKanjis * 100}%` }"
      ></div>
    </div>

    <!-- Progress Stats -->
    <div class="absolute top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-1 text-sm text-white/90">
      {{ currentKanjiIndex + 1 }} / {{ totalKanjis }}
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
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-white">Loading...</div>
      </div>

      <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-red-400">{{ error.message }}</div>
      </div>

      <template v-else>
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
          <!-- Show lesson content -->
          <div v-if="!showingExercise && currentKanji">
            <ClassroomKanjiLesson
              :current-kanji="currentKanji"
              @next="showingExercise = true"
            />
          </div>

          <!-- Show exercise -->
          <div v-else-if="showingExercise && currentKanji && currentExercise">
            <ClassroomKanjiExercise
              :current-kanji="currentKanji"
              :current-exercise="currentExercise"
              @correct="handleCorrectAnswer"
              @incorrect="handleIncorrectAnswer"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ChevronLeftIcon,
  SpeakerWaveIcon,
  MinusIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'
import { useCourseLessonsV1, type Kanji, type Exercise } from '~/composables/api/v1/useCourseLessonsV1'
import { useRouter } from 'vue-router'
import type { ClassroomNavigationState } from '~/types/navigation'

const router = useRouter()

// Route and Navigation State
const classroomNavigation = useState<ClassroomNavigationState>('classroom-navigation')
const courseSlug = computed(() => classroomNavigation.value.courseSlug)
const level = computed(() => classroomNavigation.value.level?.position)

// State
const loading = ref(true)
const error = ref<Error | null>(null)
const kanjis = ref<Kanji[]>([])
const currentKanjiIndex = ref(0)
const currentExerciseIndex = ref(0)
const showingExercise = ref(false)

// Composables
const { fetchKanjiLessons } = useCourseLessonsV1()

// Computed
const currentKanji = computed(() => kanjis.value[currentKanjiIndex.value])
const currentExercise = computed(() => {
  if (!currentKanji.value) return null
  return currentKanji.value.exercises[currentExerciseIndex.value]
})
const totalKanjis = computed(() => kanjis.value.length)

// Methods
async function loadKanjiLessons() {
  // Validate required parameters
  if (!courseSlug.value || !level.value) {
    error.value = new Error('Missing required parameters: course slug or level')
    loading.value = false
    return
  }

  try {
    loading.value = true
    const response = await fetchKanjiLessons(courseSlug.value, level.value)
    console.log("response", response)
    kanjis.value = response.kanjis
  } catch (e) {
    error.value = e as Error
    console.error('Error loading kanji lessons:', e)
  } finally {
    loading.value = false
  }
}

function handleCorrectAnswer() {
  // Move to next exercise or next kanji
  if (currentExerciseIndex.value < currentKanji.value.exercises.length - 1) {
    // More exercises for current kanji
    currentExerciseIndex.value++
  } else {
    // Move to next kanji
    if (currentKanjiIndex.value < kanjis.value.length - 1) {
      currentKanjiIndex.value++
      currentExerciseIndex.value = 0
      showingExercise.value = false
    } else {
      // Completed all kanjis - return to course
      navigateToCourse()
    }
  }
}

function handleIncorrectAnswer() {
  // For now, just log the incorrect answer
  console.log('Incorrect answer')
}

function goToPreviousLesson() {
  if (currentKanjiIndex.value > 0) {
    currentKanjiIndex.value--
    currentExerciseIndex.value = 0
    showingExercise.value = false
  }
}

function navigateToCourse() {
  // Show completion message
  alert('Congratulations! You have completed all Kanji lessons!')
  // Navigate back to course
  navigateTo(`/app/courses/${courseSlug.value}`)
}

// Lifecycle
onMounted(() => {
  // Validate navigation state
  if (!courseSlug.value || !level.value) {
    navigateTo('/app/courses')
    return
  }
  loadKanjiLessons()
})
</script>