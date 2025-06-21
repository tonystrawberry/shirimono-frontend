<template>
  <div class="min-h-screen" :class="backgroundColor">
    <!-- Progress Bar -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-white/10">
      <div
        class="h-full bg-white transition-all duration-300 ease-in-out"
        :style="{ width: `${(initialReviewCount > 0 ? ((initialReviewCount - reviews.length) / initialReviewCount * 100) : 0)}%` }"
      ></div>
    </div>

    <!-- Progress Stats -->
    <div class="absolute top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-1 text-sm text-white/90">
      Reviews left: {{ reviews.length }}
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
        <div class="text-white">Loading reviews...</div>
      </div>

      <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-red-400">{{ error.message }}</div>
      </div>

      <div v-else-if="reviews.length === 0" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-white text-center">
          <h2 class="text-2xl font-bold mb-4">All done for now!</h2>
          <p>You have no more reviews due.</p>
          <button @click="router.push('/app')" class="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">
            Back to Dashboard
          </button>
        </div>
      </div>

      <template v-else>
        <div class="bg-gray-900/20 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
          <!-- Show exercise -->
          <div v-if="currentReview">
            <ClassroomKanjiExercise
              v-if="currentReview.pointType === 'kanji'"
              :current-exercise="currentReview.exercise"
              @correct="handleReviewCorrectAnswer"
              @incorrect="handleIncorrectAnswer"
              :target-correct-answers="1"
            />
            <ClassroomGrammarExercise
              v-else-if="currentReview.pointType === 'grammar'"
              :current-exercise="currentReview.exercise"
              @correct="handleReviewCorrectAnswer"
              @incorrect="handleIncorrectAnswer"
              :target-correct-answers="1"
            />
            <ClassroomVocabularyExercise
              v-else-if="currentReview.pointType === 'vocabulary'"
              :current-exercise="currentReview.exercise"
              @correct="handleReviewCorrectAnswer"
              @incorrect="handleIncorrectAnswer"
              :target-correct-answers="1"
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
import { useUserReviewsV1, type DueReviewKanji, type DueReviewVocabulary, type DueReviewGrammar } from '~/composables/api/v1/useUserReviewsV1'
import { useRouter } from 'vue-router'
import ClassroomKanjiExercise from '~/components/classroom/ClassroomKanjiExercise.vue'
import ClassroomGrammarExercise from '~/components/classroom/ClassroomGrammarExercise.vue'
import ClassroomVocabularyExercise from '~/components/classroom/ClassroomVocabularyExercise.vue'

const router = useRouter()

// State
const loading = ref(true)
const error = ref<Error | null>(null)
const reviews = ref<DueReview[]>([])
const initialReviewCount = ref(0)
const currentReviewIndex = ref(0)

// Composables
const { fetchDueReviews, submitCorrectReview } = useUserReviewsV1()

// Computed
const currentReview = computed(() => {
  if (reviews.value.length > 0) {
    return reviews.value[currentReviewIndex.value]
  }
  return null
})

const backgroundColor = computed(() => {
  if (!currentReview.value) {
    return 'bg-gray-800'
  }

  switch (currentReview.value.pointType) {
    case 'kanji':
      return 'bg-indigo-500'
    case 'vocabulary':
      return 'bg-violet-500'
    case 'grammar':
      return 'bg-teal-500'
    default:
      return 'bg-gray-800'
  }
})

// Methods
async function loadDueReviews() {
  try {
    loading.value = true
    const response = await fetchDueReviews()

    const fetchedReviews: DueReview[] = []

    response.user_review_kanjis.forEach(item => {
      fetchedReviews.push({ ...item, exercise: item.kanji_exercise, pointType: 'kanji' })
    })
    response.user_review_vocabularies.forEach(item => {
      fetchedReviews.push({ ...item, exercise: item.vocabulary_exercise, pointType: 'vocabulary' })
    })
    response.user_review_grammars.forEach(item => {
      fetchedReviews.push({ ...item, exercise: item.grammar_exercise, pointType: 'grammar' })
    })

    // Shuffle reviews
    reviews.value = fetchedReviews.sort(() => Math.random() - 0.5)
    initialReviewCount.value = reviews.value.length

    if (reviews.value.length > 0) {
      currentReviewIndex.value = 0
    }
  } catch (e) {
    error.value = e as Error
    console.error('Error loading due reviews:', e)
  } finally {
    loading.value = false
  }
}

async function handleReviewCorrectAnswer() {
  if (!currentReview.value) return

  const review = currentReview.value as any

  let courseSlug: string
  let position: number

  switch (review.pointType) {
    case 'kanji':
      courseSlug = review.course.slug
      position = review.course_level_kanji.position
      break
    case 'vocabulary':
      courseSlug = review.course.slug
      position = review.course_level_vocabulary.position
      break
    case 'grammar':
      courseSlug = review.course.slug
      position = review.course_level_grammar.position
      break
    default:
      console.error('Unknown review type:', review.pointType)
      return
  }

  try {
    await submitCorrectReview(
      courseSlug,
      position,
      currentReview.value.pointType,
      currentReview.value.exercise.id
    )
  } catch (e) {
    console.error('Error submitting correct review:', e)
    // For now, we proceed even if the API call fails
  }

  // Remove from reviews list and show the next one
  reviews.value.splice(currentReviewIndex.value, 1)

  if (reviews.value.length > 0) {
    setRandomCurrentReviewIndex()
  } else {
    // No more reviews, can navigate away or show a success message.
    // The template already handles the empty state.
  }
}

function handleIncorrectAnswer() {
  // Show another random exercise after incorrect answer
  setRandomCurrentReviewIndex()
}

function setRandomCurrentReviewIndex() {
  if (reviews.value.length === 0) return
  // Set to a random index different from current
  let newIndex
  do {
    newIndex = Math.floor(Math.random() * reviews.value.length)
  } while (reviews.value.length > 1 && newIndex === currentReviewIndex.value)
  currentReviewIndex.value = newIndex
}

// Lifecycle
onMounted(() => {
  loadDueReviews()
})
</script>