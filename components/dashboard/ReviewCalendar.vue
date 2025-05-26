<template>
  <div class="bg-gray-900 shadow rounded-lg flex flex-col">
    <div class="p-6 flex flex-col">
      <h2 class="text-lg font-semibold text-white mb-4">Upcoming Reviews</h2>
      <Calendar
        :attributes="attributes"
        class="custom-calendar"
        borderless
        transparent
        is-dark
        :masks="{
          weekdays: 'WWW',
          title: 'MMMM YYYY'
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { Calendar } from 'v-calendar'
import 'v-calendar/style.css'

// Mock review data
const reviews = [
  {
    date: '2024-03-20',
    reviews: [
      { course: 'JLPT N5', count: 25 },
      { course: 'JLPT N4', count: 15 }
    ]
  },
  {
    date: '2024-03-21',
    reviews: [
      { course: 'JLPT N5', count: 30 },
      { course: 'JLPT N3', count: 10 }
    ]
  },
  {
    date: '2024-03-22',
    reviews: [
      { course: 'JLPT N4', count: 20 },
      { course: 'JLPT N3', count: 5 }
    ]
  }
]

const getReviewsForDate = (date) => {
  const formattedDate = new Date(date).toISOString().split('T')[0]
  return reviews.find(r => r.date === formattedDate)?.reviews || []
}

const getTotalReviewsForDate = (date) => {
  const dayReviews = getReviewsForDate(date)
  return dayReviews.reduce((total, review) => total + review.count, 0)
}

// Calendar attributes for dots and popovers
const attributes = reviews.flatMap(review => {
  return review.reviews.map(courseReview => ({
    dates: new Date(review.date),
    dot: {
      style: {
        backgroundColor: courseReview.course === 'JLPT N5' ? '#f43f5e' :  // rose-500
                        courseReview.course === 'JLPT N4' ? '#f59e0b' :  // amber-500
                        '#10b981',  // emerald-500
      }
    },
    popover: {
      label: `${courseReview.course}: ${courseReview.count} reviews`,
      hideIndicator: true,
    }
  }))
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