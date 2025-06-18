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
    case 'CourseLevelKanji':
      return 'Kanji'
    case 'CourseLevelVocabulary':
      return 'Vocabulary'
    case 'CourseLevelGrammar':
      return 'Grammar'
    default:
      return 'Unknown'
  }
}

const calendarAttributes = computed<AttributeConfig[]>(() => {
  const attributes: AttributeConfig[] = []
  const reviews = userReviewsStore.upcomingReviews

  Object.entries(reviews).forEach(([date, dayReviews]) => {
    if (dayReviews.userReviewKanjis.length > 0) {
      attributes.push({
        key: `${date}-kanji`,
        dates: [new Date(date)],
        dot: {
          color: getReviewTypeColor('CourseKanji')
        },
        popover: {
          label: `Kanji: ${dayReviews.userReviewKanjis.length} reviews`,
          hideIndicator: false,
        }
      })
    }

    if (dayReviews.userReviewVocabularies.length > 0) {
      attributes.push({
        key: `${date}-vocabulary`,
        dates: [new Date(date)],
        dot: {
          color: getReviewTypeColor('CourseVocabulary')
        },
        popover: {
          label: `Vocabulary: ${dayReviews.userReviewVocabularies.length} reviews`,
          hideIndicator: false,
        }
      })
    }

    if (dayReviews.userReviewGrammars.length > 0) {
      attributes.push({
        key: `${date}-grammar`,
        dates: [new Date(date)],
        dot: {
          color: getReviewTypeColor('CourseGrammar')
        },
        popover: {
          label: `Grammar: ${dayReviews.userReviewGrammars.length} reviews`,
          hideIndicator: false,
        }
      })
    }
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