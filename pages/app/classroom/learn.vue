<template>
  <div class="min-h-screen bg-indigo-500">
    <!-- Progress Bar -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-white/10">
      <div
        class="h-full bg-white transition-all duration-300 ease-in-out"
        :style="{ width: `${((lessonViewIndex + 1) / totalKanjis * 100)}%` }"
      ></div>
    </div>

    <!-- Progress Stats -->
    <div class="absolute top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-1 text-sm text-white/90">
      <template v-if="mode === 'lesson'">
        Lesson {{ lessonViewIndex + 1 }} / {{ totalKanjis }}
      </template>
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
          v-if="mode === 'lesson' && lessonViewIndex > 0"
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
          <div v-if="mode === 'lesson' && currentKanji">
            <ClassroomKanjiLesson
              :current-kanji="currentKanji"
              @next="handleNextLesson"
            />
          </div>

          <!-- Show exercise -->
          <div v-else-if="mode === 'exercise' && currentExercise">
            <ClassroomKanjiExercise
              :current-exercise="currentExercise"
              @correct="handleReviewCorrectAnswer"
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

// Constants
const LESSONS_BATCH_SIZE = 2
const TARGET_CORRECT_ANSWERS = 3

// Route and Navigation State
const classroomNavigation = useState<ClassroomNavigationState>('classroom-navigation')
const courseSlug = computed(() => classroomNavigation.value.courseSlug)
const level = computed(() => classroomNavigation.value.level?.position)

// State
const loading = ref(true)
const error = ref<Error | null>(null)
const mode = ref<'lesson' | 'exercise'>('lesson')
const lessons = ref<Kanji[]>([])
const lessonViewIndex = ref(0)
const exercises = ref<Exercise[]>([])
const currentExerciseIndex = ref(0)
const lastBatchLessonViewIndex = ref(LESSONS_BATCH_SIZE - 1)


// Composables
const { fetchKanjiLessons } = useCourseLessonsV1()

// Computed
const currentKanji = computed(() => {
  return lessons.value[lessonViewIndex.value]
})

const currentExercise = computed(() => {
  return exercises.value[currentExerciseIndex.value]
})

const totalKanjis = computed(() => {
  return lessons.value.length
})

const allDone = computed(() => {
  // Check that all exercises in lessons have numberOfCorrectAnswers >= TARGET_CORRECT_ANSWERS
  return lessons.value.every(lesson => lesson.exercises.every(exercise => (exercise.numberOfCorrectAnswers ?? 0) >= TARGET_CORRECT_ANSWERS))
})

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

    // Initialize lessons with original kanjis
    lessons.value = response.kanjis.map(kanji => ({
      ...kanji,
      exercises: kanji.exercises.map(exercise => ({
        ...exercise,
        numberOfCorrectAnswers: 0,
        done: false
      }))
    }))

    // Initialize exercises as empty
    exercises.value = []
  } catch (e) {
    error.value = e as Error
    console.error('Error loading kanji lessons:', e)
  } finally {
    loading.value = false
  }
}

function handleNextLesson() {
  if (lessonViewIndex.value === lastBatchLessonViewIndex.value) {
    // If we're at the end of a batch, switch to exercise mode and reinject lessons for exercise
    reinjectLessonsForReview()
    mode.value = 'exercise'
    lastBatchLessonViewIndex.value = Math.min(lastBatchLessonViewIndex.value + LESSONS_BATCH_SIZE, lessons.value.length - 1)
  } else {
    // If there are more lessons, show the next lesson
    const hasMoreLessons = lessonViewIndex.value < lessons.value.length - 1;
    if (hasMoreLessons) {
      lessonViewIndex.value++
    } else {
      // If no more lessons, switch to exercise mode and reinject lessons for exercise
      reinjectLessonsForReview()
      mode.value = 'exercise'
      lastBatchLessonViewIndex.value = Math.min(lastBatchLessonViewIndex.value + LESSONS_BATCH_SIZE, lessons.value.length - 1)
    }
  }
}

function reinjectLessonsForReview() {
  // Clear current exercises
  exercises.value = []

  console.log("lessonViewIndex", lessonViewIndex.value)

  // Add lessons up to current lessonViewIndex back to exercises if they have undone exercises
  for (let i = 0; i <= lessonViewIndex.value; i++) {
    const lesson = lessons.value[i]
    console.log("lesson", lesson)
    // Get references to undone exercises from the original lesson
    const undoneExercises = lesson.exercises.filter((ex: Exercise) => (ex.numberOfCorrectAnswers ?? 0) < TARGET_CORRECT_ANSWERS)

    console.log("undoneExercises", undoneExercises)
    // Add undoneExercises as is to exercises
    for (const exercise of undoneExercises) {
      if (!exercise.numberOfCorrectAnswers) {
        exercise.numberOfCorrectAnswers = 0
      }
      exercises.value.push(exercise)
    }
  }

  if (exercises.value.length > 0) {
    setRandomCurrentExerciseIndex()
  } else {
    // If no exercises (all exercises done), move to next batch of lessons
    if (lessonViewIndex.value < lessons.value.length - 1) {
      mode.value = 'lesson'
      lessonViewIndex.value++
      lastBatchLessonViewIndex.value = Math.min(lastBatchLessonViewIndex.value + LESSONS_BATCH_SIZE, lessons.value.length - 1)
    } else {
      // If no more lessons and no exercises, we're done
     console.log("WHTTTA????")
      navigateTo('/app')
    }
  }
}

function handleReviewCorrectAnswer() {
  // Increment correct answers for current exercise
  const currentExercise = exercises.value[currentExerciseIndex.value]
  if (!currentExercise.numberOfCorrectAnswers) {
    currentExercise.numberOfCorrectAnswers = 0
  }
  currentExercise.numberOfCorrectAnswers++

  exercises.value.splice(currentExerciseIndex.value, 1)

  if (exercises.value.length === 0) {

    if (lessonViewIndex.value < lessons.value.length - 1) {
      mode.value = 'lesson'
      lessonViewIndex.value++
    } else {
      reinjectLessonsForReview()
    }
  }

  if (allDone.value) {
    console.log("Maybe here????")
    navigateTo('/app')
  }

  setRandomCurrentExerciseIndex()
}

function handleIncorrectAnswer() {
  if (mode.value === 'exercise') {
    // Show another random exercise after incorrect answer
    setRandomCurrentExerciseIndex()
  }
  // For lesson mode, just stay on the same exercise
}

function setRandomCurrentExerciseIndex() {
  // Set to a random index different from current
  let newIndex
  do {
    newIndex = Math.floor(Math.random() * exercises.value.length)
  } while (exercises.value.length > 1 && newIndex === currentExerciseIndex.value)
  currentExerciseIndex.value = newIndex
}

function goToPreviousLesson() {
  if (mode.value === 'lesson' && lessonViewIndex.value > 0) {
    lessonViewIndex.value--
    currentExerciseIndex.value = 0
  }
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