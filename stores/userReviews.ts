import { defineStore } from 'pinia'
import { useUserReviewsV1, type Review } from '~/composables/api/v1/useUserReviewsV1'

interface ReviewsByDate {
  [date: string]: Review[]
}

interface CourseProgress {
  courseId: string
  courseTitle: string
  stats: {
    total: number
    correct: number
    byStatus: Record<string, number>
  }
}

export const useUserReviewsStore = defineStore('userReviews', {
  state: () => ({
    reviews: [] as Review[],
    loading: false,
    error: null as Error | null
  }),

  getters: {
    upcomingReviews: (state): ReviewsByDate => {
      const reviewsByDate: ReviewsByDate = {}

      state.reviews.forEach(review => {
        const date = new Date(review.next_review_at).toISOString().split('T')[0]
        if (!reviewsByDate[date]) {
          reviewsByDate[date] = []
        }
        reviewsByDate[date].push(review)
      })

      return reviewsByDate
    },

    reviewProgress: (state): CourseProgress[] => {
      // Group reviews by course
      const courseReviews = state.reviews.reduce((acc, review) => {
        const courseId = review.course.id
        if (!acc[courseId]) {
          acc[courseId] = {
            courseId,
            courseTitle: review.course.title,
            reviews: []
          }
        }
        acc[courseId].reviews.push(review)
        return acc
      }, {} as Record<string, { courseId: string; courseTitle: string; reviews: Review[] }>)

      // Calculate stats for each course
      return Object.values(courseReviews).map(({ courseId, courseTitle, reviews }) => ({
        courseId,
        courseTitle,
        stats: {
          total: reviews.length,
          correct: reviews.reduce((sum, review) => sum + review.number_of_correct_reviews, 0),
          byStatus: reviews.reduce((acc, review) => {
            acc[review.memorization_status] = (acc[review.memorization_status] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        }
      }))
    }
  },

  actions: {
    async fetchUserReviews() {
      this.loading = true
      this.error = null

      try {
        const { fetchUserReviews } = useUserReviewsV1()
        this.reviews = await fetchUserReviews()
      } catch (err) {
        this.error = err as Error
        this.reviews = []
      } finally {
        this.loading = false
      }
    }
  }
})