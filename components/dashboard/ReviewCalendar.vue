<template>
  <div class="bg-gray-900 shadow rounded-lg flex flex-col">
    <div class="p-6 flex flex-col">
      <h2 class="text-lg font-semibold text-white mb-4">Upcoming Reviews</h2>
      <div v-if="userReviewsStore.loading" class="text-sm text-gray-400">
        Loading reviews...
      </div>
      <div v-else-if="userReviewsStore.error" class="text-sm text-red-400">
        Error loading reviews. Please try again later.
      </div>
      <Calendar
        v-else
        :attributes="calendarAttributes"
        class="custom-calendar"
        borderless
        transparent
        is-dark
        locale="ja"
        :masks="{
          title: 'YYYY年MMMM'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Calendar } from 'v-calendar'
import 'v-calendar/style.css'
import { useUserReviewsStore } from '~/stores/userReviews'
import { type Review } from '~/composables/api/v1/useUserReviewsV1'
import type { AttributeConfig } from 'v-calendar/dist/types/src/utils/attribute'

const userReviewsStore = useUserReviewsStore()

const getReviewTypeColor = (type: string): string => {
  switch (type) {
    case 'CourseKanji':
      return 'indigo'
    case 'CourseVocabulary':
      return 'violet'
    case 'CourseGrammar':
      return 'teal'
    default:
      return 'indigo'
  }
}

const getReviewTypeLabel = (type: string): string => {
  switch (type) {
    case 'CourseKanji':
      return 'Kanji'
    case 'CourseVocabulary':
      return 'Vocabulary'
    case 'CourseGrammar':
      return 'Grammar'
    default:
      return type
  }
}

const calendarAttributes = computed<AttributeConfig[]>(() => {
  const attributes: AttributeConfig[] = []
  const reviews = userReviewsStore.upcomingReviews

  // Group reviews by date and type
  Object.entries(reviews).forEach(([date, dayReviews]) => {
    // Group reviews by type
    const reviewsByType = dayReviews.reduce((acc, review) => {
      const type = review.course_point.type
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(review)
      return acc
    }, {} as Record<string, Review[]>)

    // Create dots for each type
    Object.entries(reviewsByType).forEach(([type, typeReviews]) => {
      attributes.push({
        key: `${date}-${type}`,
        dates: [new Date(date)],
        dot: {
          color: getReviewTypeColor(type)
        },
        popover: {
          label: `${getReviewTypeLabel(type)}: ${typeReviews.length} reviews`,
          hideIndicator: false,
        }
      })
    })
  })

  return attributes
})

onMounted(async () => {
  await userReviewsStore.fetchUserReviews()
})
</script>

<style>
.custom-calendar {
  width: 100%;
}

.custom-calendar :deep(.vc-pane-container) {
  width: 100% !important;
}

.custom-calendar :deep(.vc-weeks) {
  width: 100% !important;
}
</style>